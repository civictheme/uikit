/**
 * P1 acceptance gate: an identity (empty) recipe reproduces the shipped
 * tokens outputs BYTE-FOR-BYTE — the resolved value maps, the CSS custom
 * properties, both Figma mode files and the name map all equal the
 * committed @civictheme/tokens dist. Any drift between the engine and the
 * proven tokens build fails here first.
 */
import fs from 'fs';
import path from 'path';
import { MODES, PACKAGE_DIR as TOKENS_DIR, loadTokens } from '@civictheme/tokens/build/lib.mjs';
import { resolveRecipe } from '../engine/resolve.mjs';
import { emitCss, emitFigma, emitResolved, emitNameMap } from '../engine/emit.mjs';

const DIST = path.join(TOKENS_DIR, 'dist');
const failures = [];

function expectBytes(label, produced, distFile) {
  const committed = fs.readFileSync(distFile, 'utf-8');
  if (produced !== committed) {
    const index = [...committed].findIndex((char, i) => char !== produced[i]);
    failures.push(`${label}: differs from ${path.relative(TOKENS_DIR, distFile)} at offset ${index}: dist "${committed.slice(index, index + 60)}" vs engine "${produced.slice(index, index + 60)}"`);
  }
}

const { tree, resolved } = resolveRecipe({ version: 1 });

// The applied tree must be exactly the loaded defaults — no perturbation.
if (JSON.stringify(tree) !== JSON.stringify(loadTokens())) {
  failures.push('identity recipe perturbed the token tree');
}

for (const mode of MODES) {
  expectBytes(`resolved ${mode}`, emitResolved(resolved, mode), path.join(DIST, `resolved.${mode}.json`));
  expectBytes(`figma ${mode}`, `${JSON.stringify(emitFigma(tree, mode), null, 2)}\n`, path.join(DIST, 'figma', `${mode}.tokens.json`));
}
expectBytes('css', emitCss(tree, resolved), path.join(DIST, 'css', 'variables.css'));
expectBytes('name map', `${JSON.stringify(emitNameMap(tree), null, 2)}\n`, path.join(DIST, 'figma', 'name-map.json'));

if (failures.length) {
  console.error(`Identity validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`Identity validation passed: an empty recipe reproduces all ${Object.keys(resolved.light).length} resolved values, the CSS, both Figma mode files and the name map byte-for-byte from the tokens dist.`);
