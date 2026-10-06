/**
 * Figma emit acceptance gate.
 *
 * dist/figma/{light,dark}.tokens.json carry all 430 variables (brand +
 * palette + component, aliases as references) so the production run can
 * create or update the Colour collection via Figma's native Import mode.
 * Two proofs against the dist artifacts themselves:
 *
 * 1. Export equivalence: each emitted file must be semantically identical to
 *    the committed real Export-mode fixture (same variable set; aliases
 *    exact; literals byte-equal with equal alpha and hex; scopes and
 *    codeSyntax equal; doc-level mode name equal). The only tolerated
 *    differences are com.figma.variableId (unknowable before an import —
 *    deliberately not emitted) and float formatting (committed 6-decimal
 *    components vs Figma's full float32).
 * 2. Ingest round-trip: ingesting the emitted files must reproduce every
 *    committed tokens/*.json byte-for-byte with zero reported changes — the
 *    code -> Figma -> code loop closes on the dist artifacts.
 *
 * Exits non-zero on any failure. Requires a current dist (npm run dist).
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { PACKAGE_DIR } from '../build/lib.mjs';
import { ingest } from '../build/figma-ingest.mjs';

const DIST_FIGMA = path.join(PACKAGE_DIR, 'dist', 'figma');
const FIXTURES = path.join(PACKAGE_DIR, 'tests', 'fixtures', 'figma-export');
const TOKENS_DIR = path.join(PACKAGE_DIR, 'tokens');

const failures = [];
let variableCount = 0;

/** Flattens an import/export document to a `figmaName -> leaf node` map. */
function flattenDoc(doc) {
  const map = new Map();
  const walk = (node, segments) => {
    if (node && typeof node === 'object' && '$value' in node) {
      map.set(segments.join('/'), node);
      return;
    }
    if (node && typeof node === 'object') {
      Object.entries(node).forEach(([key, child]) => {
        if (!key.startsWith('$')) walk(child, [...segments, key]);
      });
    }
  };
  walk(doc, []);
  return map;
}

const byteKey = (components) => components.map((channel) => Math.round(channel * 255)).join(',');
const round6 = (value) => Math.round(value * 1e6) / 1e6;

// --- 1. Export equivalence.
[['light', 'Light'], ['dark', 'Dark']].forEach(([mode, modeName]) => {
  const emitted = JSON.parse(fs.readFileSync(path.join(DIST_FIGMA, `${mode}.tokens.json`), 'utf-8'));
  const fixture = JSON.parse(fs.readFileSync(path.join(FIXTURES, `${modeName}.tokens.json`), 'utf-8'));
  if (emitted.$extensions?.['com.figma.modeName'] !== modeName) {
    failures.push(`${mode}: doc-level com.figma.modeName is ${JSON.stringify(emitted.$extensions?.['com.figma.modeName'])}, expected "${modeName}"`);
  }
  const emittedFlat = flattenDoc(emitted);
  const fixtureFlat = flattenDoc(fixture);
  variableCount = emittedFlat.size;
  fixtureFlat.forEach((node, name) => {
    if (!emittedFlat.has(name)) failures.push(`${mode}: "${name}" is in the export fixture but not emitted`);
  });
  emittedFlat.forEach((node, name) => {
    const expected = fixtureFlat.get(name);
    if (!expected) {
      failures.push(`${mode}: emitted "${name}" is not in the export fixture`);
      return;
    }
    if (node.$type !== 'color') failures.push(`${mode}: ${name} has $type ${JSON.stringify(node.$type)}, expected "color"`);
    const value = node.$value;
    const expectedValue = expected.$value;
    if (typeof value === 'string' || typeof expectedValue === 'string') {
      if (value !== expectedValue) failures.push(`${mode}: ${name} $value ${JSON.stringify(value)} != fixture ${JSON.stringify(expectedValue)}`);
    } else if (value.colorSpace !== 'srgb' || byteKey(value.components) !== byteKey(expectedValue.components)
      || round6(value.alpha) !== round6(expectedValue.alpha) || value.hex !== expectedValue.hex) {
      failures.push(`${mode}: ${name} colour differs from fixture: ${JSON.stringify(value)} vs ${JSON.stringify(expectedValue)}`);
    }
    ['com.figma.scopes', 'com.figma.codeSyntax'].forEach((key) => {
      const actual = JSON.stringify(node.$extensions?.[key]);
      const wanted = JSON.stringify(expected.$extensions?.[key]);
      if (actual !== wanted) failures.push(`${mode}: ${name} ${key} ${actual} != fixture ${wanted}`);
    });
  });
});

// --- 2. Ingest round-trip on the emitted files.
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ct-figma-emit-'));
try {
  const result = ingest({
    lightFile: path.join(DIST_FIGMA, 'light.tokens.json'),
    darkFile: path.join(DIST_FIGMA, 'dark.tokens.json'),
    outDir: tempRoot,
  });
  if (result.changes.length) {
    failures.push(`round-trip: expected zero changes ingesting the emitted files, got ${result.changes.length} (first: ${result.changes[0]})`);
  }
  result.files.forEach((file) => {
    const committed = fs.readFileSync(path.join(TOKENS_DIR, file), 'utf-8');
    const produced = fs.readFileSync(path.join(tempRoot, file), 'utf-8');
    if (committed !== produced) {
      const index = [...committed].findIndex((char, i) => char !== produced[i]);
      failures.push(`round-trip: ${file} differs from the committed file at offset ${index}: committed "${committed.slice(index, index + 60)}" vs produced "${produced.slice(index, index + 60)}"`);
    }
  });
} catch (error) {
  failures.push(`round-trip: ingest threw: ${error.message}`);
}
fs.rmSync(tempRoot, { recursive: true, force: true });

if (failures.length) {
  console.error(`Figma emit validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`Figma emit validation passed: both dist import files carry all ${variableCount} variables, semantically identical to the real export fixtures (values, aliases, scopes, codeSyntax, mode names), and ingesting them reproduces the committed token files byte-for-byte with zero changes.`);
