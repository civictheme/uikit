/**
 * CLI end-to-end gate (the P2 acceptance): the real executable, spawned as
 * a consumer would run it. Identity emit must be byte-identical to the
 * tokens dist (so the emitted Figma files pass the same semantic contract
 * as validate-figma-emit); check exposes the three known failures with
 * warn-only exit semantics and --strict flips them; an example recipe's
 * outputs land its exact changes, including the minimal overrides.scss.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { PACKAGE_DIR as TOKENS_DIR } from '@civictheme/tokens/build/lib.mjs';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(PACKAGE_ROOT, 'cli.mjs');
const DIST = path.join(TOKENS_DIR, 'dist');

const failures = [];
const expect = (label, condition, detail = '') => {
  if (!condition) failures.push(`${label}${detail ? `: ${detail}` : ''}`);
};

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ct-colour-picker-cli-'));
const run = (args) => {
  try {
    return { status: 0, stdout: execFileSync(process.execPath, [CLI, ...args], { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (error) {
    return { status: error.status, stdout: error.stdout ?? '', stderr: error.stderr ?? '' };
  }
};
const writeJson = (name, data) => {
  const file = path.join(tempRoot, name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
};

// --- 1. resolve: identity output equals the dist resolved maps.
const resolve = run(['resolve', '--json']);
expect('resolve exits 0', resolve.status === 0, resolve.stderr);
const resolved = JSON.parse(resolve.stdout);
['light', 'dark'].forEach((mode) => {
  const dist = JSON.parse(fs.readFileSync(path.join(DIST, `resolved.${mode}.json`), 'utf-8'));
  expect(`resolve ${mode} matches dist`, JSON.stringify(resolved[mode]) === JSON.stringify(dist));
});

// --- 2. check: three known failures, warn-only unless --strict.
const check = run(['check', '--json']);
expect('check exits 0 without --strict', check.status === 0, check.stderr);
expect('check reports 3 failures', JSON.parse(check.stdout).failures === 3, check.stdout.slice(0, 200));
expect('check --strict exits 1', run(['check', '--strict']).status === 1);
const fixedRecipe = writeJson('fixed.json', {
  version: 1,
  overrides: {
    'color.palette.border': { dark: '#e7f9ff' },
    'color.palette.interaction-focus': { dark: '#e7f9ff' },
    'color.palette.error': { dark: '#e7f9ff' },
  },
});
expect('check --strict exits 0 on a fixed recipe', run(['check', '--strict', '--recipe', fixedRecipe]).status === 0);

// --- 3. emit: identity outputs are byte-identical to the tokens dist.
const identityOut = path.join(tempRoot, 'identity');
expect('identity emit exits 0', run(['emit', '--out', identityOut]).status === 0);
[['css/variables.css', 'css/variables.css'], ['figma/light.tokens.json', 'figma/light.tokens.json'],
  ['figma/dark.tokens.json', 'figma/dark.tokens.json'], ['figma/name-map.json', 'figma/name-map.json'],
  ['resolved.light.json', 'resolved.light.json'], ['resolved.dark.json', 'resolved.dark.json']].forEach(([emitted, dist]) => {
  const produced = fs.readFileSync(path.join(identityOut, emitted), 'utf-8');
  const committed = fs.readFileSync(path.join(DIST, dist), 'utf-8');
  expect(`identity emit ${emitted} byte-identical to dist`, produced === committed);
});
expect('identity overrides.scss says no changes', fs.readFileSync(path.join(identityOut, 'overrides.scss'), 'utf-8').includes('No changes'));

// --- 4. emit: the example recipe's outputs land its exact changes.
const exampleRecipe = writeJson('example.json', {
  version: 1,
  overrides: {
    'color.palette.highlight': { light: '#ffcc00' },
    'color.component.button.primary-background-color': { $value: '{color.palette.background-dark}' },
    'color.component.alert.error-background-color': { dark: '#e85653' },
  },
  additions: {
    'color.palette.brand-accent': { light: '#6a3bb5', dark: '#c9a1e8', target: 3 },
    'color.component.my-hero.background-color': { $value: '{color.palette.brand-accent}' },
  },
});
const exampleOut = path.join(tempRoot, 'example');
const emit = run(['emit', '--recipe', exampleRecipe, '--out', exampleOut, '--json']);
expect('example emit exits 0', emit.status === 0, emit.stderr);
expect('example emit reports contrast state', JSON.parse(emit.stdout).contrastFailures === 3);

const scss = fs.readFileSync(path.join(exampleOut, 'overrides.scss'), 'utf-8');
const lightBlock = scss.split('.ct-theme-dark')[0];
const darkBlock = scss.slice(scss.indexOf('.ct-theme-dark'));
expect('scss: highlight in light block', lightBlock.includes('--ct-color-highlight: #ffcc00;'));
expect('scss: highlight not in dark block', !darkBlock.includes('--ct-color-highlight'));
expect('scss: button re-point in both blocks', lightBlock.includes('--ct-button-primary-background-color: var(--ct-color-background-dark);')
  && darkBlock.includes('--ct-button-primary-background-color: var(--ct-color-background-dark);'));
expect('scss: alert dark literal only in dark block', darkBlock.includes('--ct-alert-error-background-color: #e85653;')
  && !lightBlock.includes('--ct-alert-error-background-color'));
expect('scss: additions present', lightBlock.includes('--ct-color-brand-accent: #6a3bb5;')
  && darkBlock.includes('--ct-color-brand-accent: #c9a1e8;')
  && lightBlock.includes('--ct-my-hero-background-color: var(--ct-color-brand-accent);'));

const tokensJson = JSON.parse(fs.readFileSync(path.join(exampleOut, 'tokens.json'), 'utf-8'));
expect('tokens.json carries the addition', tokensJson.color.palette['brand-accent']?.$value?.hex === '#6a3bb5');
const figmaDark = JSON.parse(fs.readFileSync(path.join(exampleOut, 'figma', 'dark.tokens.json'), 'utf-8'));
expect('figma dark carries the addition', figmaDark.Custom?.['Brand Accent']?.$value?.hex === '#C9A1E8');

// --- 5. init-skill copies the shipped skill into ./.claude/skills.
const skillCwd = path.join(tempRoot, 'consumer-project');
fs.mkdirSync(skillCwd, { recursive: true });
try {
  execFileSync(process.execPath, [CLI, 'init-skill'], { encoding: 'utf-8', cwd: skillCwd, stdio: ['ignore', 'pipe', 'pipe'] });
  const installed = fs.readFileSync(path.join(skillCwd, '.claude', 'skills', 'colour-picker', 'SKILL.md'), 'utf-8');
  expect('init-skill installs SKILL.md', installed.includes('name: colour-picker') && installed.includes('check --json'));
} catch (error) {
  failures.push(`init-skill threw: ${error.message}`);
}

// --- 6. Failure modes: usage and malformed input.
expect('unknown command exits 2', run(['bogus']).status === 2);
expect('unknown flag exits 2', run(['resolve', '--bogus']).status === 2);
expect('emit without --out exits 1', run(['emit']).status === 1);
const badRecipe = writeJson('bad.json', { version: 1, overrides: { 'color.palette.nope': { light: '#000000' } } });
const bad = run(['check', '--recipe', badRecipe]);
expect('malformed recipe exits 1 with the problem listed', bad.status === 1 && bad.stderr.includes('no such token'));

fs.rmSync(tempRoot, { recursive: true, force: true });

if (failures.length) {
  console.error(`CLI validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log('CLI validation passed: identity resolve/emit reproduce the tokens dist byte-for-byte; check warns on the 3 known failures with --strict flipping the exit; an example recipe lands its exact changes across tokens.json, overrides.scss and the Figma files; usage and malformed input fail with the right codes.');
