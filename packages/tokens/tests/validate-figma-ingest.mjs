/**
 * Figma ingest acceptance gate (plan §3.2, Phase 2c).
 *
 * The fixtures are the REAL Export-mode dump of the Colour collection from
 * the Figma rehearsal file (430 variables: 21 palette + 409 component, full
 * alias graph), whose values are exactly the committed token values.
 *
 * 1. Round-trip: ingesting the fixtures must reproduce every tokens/*.json
 *    byte-for-byte with zero reported changes — proving name back-mapping,
 *    alias translation, colour normalisation and extension preservation.
 * 2. Change application: a doctored export (one literal edit, one alias
 *    re-point) must land exactly those two changes and nothing else.
 * 3. Drift guard: added, missing, renamed variables and swapped mode files
 *    must fail loudly with nothing written.
 *
 * Exits non-zero on any failure.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { PACKAGE_DIR } from '../build/lib.mjs';
import { ingest } from '../build/figma-ingest.mjs';

const FIXTURES = path.join(PACKAGE_DIR, 'tests', 'fixtures', 'figma-export');
const TOKENS_DIR = path.join(PACKAGE_DIR, 'tokens');
const LIGHT = path.join(FIXTURES, 'Light.tokens.json');
const DARK = path.join(FIXTURES, 'Dark.tokens.json');

const failures = [];
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ct-figma-ingest-'));
const tempDir = (name) => {
  const dir = path.join(tempRoot, name);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

// --- 1. Round-trip: fixture ingest reproduces the committed files exactly.
const roundTripOut = tempDir('round-trip');
try {
  const result = ingest({ lightFile: LIGHT, darkFile: DARK, outDir: roundTripOut });
  if (result.changes.length) {
    failures.push(`round-trip: expected zero changes, got ${result.changes.length} (first: ${result.changes[0]})`);
  }
  result.files.forEach((file) => {
    const committed = fs.readFileSync(path.join(TOKENS_DIR, file), 'utf-8');
    const produced = fs.readFileSync(path.join(roundTripOut, file), 'utf-8');
    if (committed !== produced) {
      const index = [...committed].findIndex((char, i) => char !== produced[i]);
      failures.push(`round-trip: ${file} differs from the committed file at offset ${index}: committed "${committed.slice(index, index + 60)}" vs produced "${produced.slice(index, index + 60)}"`);
    }
  });
} catch (error) {
  failures.push(`round-trip: ingest threw: ${error.message}`);
}

// --- 2. Change application: one literal edit + one alias re-point.
const doctoredLight = JSON.parse(fs.readFileSync(LIGHT, 'utf-8'));
doctoredLight.Brand['Brand 1'].$value = {
  colorSpace: 'srgb',
  components: [17 / 255, 34 / 255, 51 / 255],
  alpha: 1,
  hex: '#112233',
};
doctoredLight.Component.Button['Primary Color'].$value = '{Interaction.Interaction Hover Text}';
const doctoredLightFile = path.join(tempRoot, 'Light.doctored.tokens.json');
fs.writeFileSync(doctoredLightFile, JSON.stringify(doctoredLight));

const changeOut = tempDir('changes');
try {
  const result = ingest({ lightFile: doctoredLightFile, darkFile: DARK, outDir: changeOut });
  if (result.changes.length !== 2) {
    failures.push(`changes: expected exactly 2 changes, got ${result.changes.length}: ${result.changes.join(' | ')}`);
  }
  const brand = JSON.parse(fs.readFileSync(path.join(changeOut, 'color.brand.json'), 'utf-8'));
  const brand1 = brand.color.brand.brand1;
  if (brand1.$value.hex !== '#112233' || brand1.$value.components.join(',') !== '0.066667,0.133333,0.2') {
    failures.push(`changes: brand1 light not applied/normalised: ${JSON.stringify(brand1.$value)}`);
  }
  if (brand1.$extensions['io.civictheme.modes'].dark.hex !== '#61daff') {
    failures.push('changes: brand1 dark should be untouched');
  }
  const components = JSON.parse(fs.readFileSync(path.join(changeOut, 'color.components.json'), 'utf-8'));
  const primary = components.color.component.button['primary-color'];
  if (primary.$value !== '{color.palette.interaction-hover-text}') {
    failures.push(`changes: button primary-color light not re-pointed: ${JSON.stringify(primary.$value)}`);
  }
  if (primary.$extensions['io.civictheme.modes']?.dark !== '{color.palette.interaction-text}') {
    failures.push(`changes: button primary-color dark should keep the original target via a new modes override: ${JSON.stringify(primary.$extensions)}`);
  }
  if (!primary.$extensions['io.civictheme.scss']) {
    failures.push('changes: button primary-color lost its io.civictheme.scss bridge');
  }
  const palette = fs.readFileSync(path.join(changeOut, 'color.palette.json'), 'utf-8');
  if (palette !== fs.readFileSync(path.join(TOKENS_DIR, 'color.palette.json'), 'utf-8')) {
    failures.push('changes: color.palette.json should be byte-identical to committed');
  }
} catch (error) {
  failures.push(`changes: ingest threw: ${error.message}`);
}

// --- 3. Drift guards: each case must throw and write nothing.
function expectFailure(name, lightDoc, darkFile, messagePart) {
  const file = path.join(tempRoot, `Light.${name}.tokens.json`);
  fs.writeFileSync(file, JSON.stringify(lightDoc));
  const outDir = path.join(tempRoot, `guard-${name}`);
  try {
    ingest({ lightFile: file, darkFile, outDir });
    failures.push(`guard ${name}: expected the ingest to fail`);
  } catch (error) {
    if (!error.message.includes(messagePart)) {
      failures.push(`guard ${name}: failed for the wrong reason (wanted "${messagePart}"): ${error.message.split('\n').slice(0, 3).join(' ')}`);
    }
    if (fs.existsSync(outDir)) {
      failures.push(`guard ${name}: failed ingest must not write output`);
    }
  }
}

const base = () => JSON.parse(fs.readFileSync(LIGHT, 'utf-8'));

const added = base();
added.Component.Button['Bogus Color'] = { $type: 'color', $value: '{Interaction.Interaction Text}' };
expectFailure('added', added, DARK, 'maps to no committed token');

const removed = base();
delete removed.Brand['Brand 1'];
expectFailure('removed', removed, DARK, 'missing from the light export');

const renamed = base();
renamed.Component.Button['Primary color'] = renamed.Component.Button['Primary Color'];
delete renamed.Component.Button['Primary Color'];
expectFailure('renamed', renamed, DARK, 'does not round-trip the component name rule');

expectFailure('swapped', JSON.parse(fs.readFileSync(DARK, 'utf-8')), DARK, 'mode files swapped');

fs.rmSync(tempRoot, { recursive: true, force: true });

if (failures.length) {
  console.error(`Figma ingest validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log('Figma ingest validation passed: fixture round-trip is byte-identical with zero changes; a doctored export lands exactly its two edits; added/removed/renamed variables and swapped mode files fail loudly without writing.');
