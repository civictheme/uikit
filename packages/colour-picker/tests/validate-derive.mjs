/**
 * P5 acceptance gate (the recorded expectation): generating from the STOCK
 * brands must produce a near-but-NOT-identical palette — the mix slots
 * reproduce stock byte-for-byte (the 1.x derivation maths), the solved
 * slots stay at the stock contrast structure, and the three known dark
 * failures (border 1.16:1, interaction-focus 2.32:1, error 2.97:1) come out
 * fixed at >= 3:1. Plus the mechanics: override locks, wholesale `generated`
 * replacement, override ?? generated ?? default precedence, and the
 * identity gate staying intact (no generated key = stock untouched —
 * validate-identity covers the byte-for-byte half). Prints the stock
 * round-trip diff table as the accessibility QA record.
 */
import { generateRecipe, loadGeneration } from '../engine/derive.mjs';
import { resolveRecipe, targetsForRecipe, loadTargets } from '../engine/resolve.mjs';
import { checkContrast } from '../engine/contrast.mjs';

const failures = [];
const expect = (label, condition, detail = '') => {
  if (!condition) failures.push(`${label}${detail ? `: ${detail}` : ''}`);
};

const stock = resolveRecipe({ version: 1 }).resolved;
const generation = loadGeneration();
const PALETTE_SLOTS = Object.keys(generation);

// --- 1. Stock round-trip: every core palette slot generated, floors met.
const { recipe, rows } = await generateRecipe({ version: 1 });
expect('generated covers every generation.json slot', JSON.stringify(Object.keys(recipe.generated).sort()) === JSON.stringify([...PALETTE_SLOTS].sort()));
expect('generate only adds the generated key', JSON.stringify(Object.keys(recipe)) === JSON.stringify(['version', 'generated']));

const { resolved } = resolveRecipe(recipe);
const qa = checkContrast(resolved, targetsForRecipe(recipe, loadTargets()));
expect('generated palette passes every contrast target', qa.every((row) => row.pass),
  qa.filter((row) => !row.pass).map((row) => `${row.tokenPath} ${row.mode} ${row.ratio}:1`).join(', '));

// The three known dark failures are the demo that generation fixes them.
['color.palette.border', 'color.palette.interaction-focus', 'color.palette.error'].forEach((tokenPath) => {
  const row = qa.find((candidate) => candidate.tokenPath === tokenPath && candidate.mode === 'dark');
  expect(`${tokenPath} dark fixed to >= 3:1`, row?.ratio >= 3, `${row?.ratio}:1`);
  expect(`${tokenPath} dark changed from stock`, resolved.dark[tokenPath] !== stock.dark[tokenPath]);
});

// Near-but-NOT-identical: mix slots byte-equal to stock, the whole set not.
Object.entries(generation).forEach(([tokenPath, rule]) => {
  if (rule.method !== 'mix') return;
  ['light', 'dark'].forEach((mode) => {
    expect(`mix slot ${tokenPath} (${mode}) reproduces stock`, resolved[mode][tokenPath] === stock[mode][tokenPath],
      `${stock[mode][tokenPath]} -> ${resolved[mode][tokenPath]}`);
  });
});
expect('palette is NOT identical to stock', PALETTE_SLOTS.some((tokenPath) => resolved.dark[tokenPath] !== stock.dark[tokenPath]));

// Print the diff table — the accessibility QA record for the PR.
console.log('Stock round-trip diff (generated vs stock; contrast rows show achieved ratio / floor):');
rows.filter((row) => !row.locked && row.value !== row.before).forEach((row) => {
  const detail = row.method === 'contrast' ? `  ${row.ratio}:1 vs ${row.against.split('.').pop()} (floor ${row.floor}:1)` : '';
  console.log(`  ${row.mode.padEnd(5)} ${row.tokenPath.padEnd(42)} ${row.before} -> ${row.value}${detail}`);
});

// --- 2. Locks: an overridden slot is never generated; the override wins.
const lockedRecipe = {
  version: 1,
  overrides: { 'color.palette.error': { dark: '#ff0000' }, 'color.palette.highlight': { light: '#ffcc00' } },
};
const lockedRun = await generateRecipe(lockedRecipe);
expect('overridden contrast slot not generated', lockedRun.recipe.generated['color.palette.error'] === undefined);
expect('overridden mix slot not generated', lockedRun.recipe.generated['color.palette.highlight'] === undefined);
expect('lock reported', lockedRun.rows.some((row) => row.tokenPath === 'color.palette.error' && row.locked));
const lockedResolved = resolveRecipe(lockedRun.recipe).resolved;
expect('override wins over generation', lockedResolved.dark['color.palette.error'] === '#ff0000');
expect('override light side keeps its default', lockedResolved.light['color.palette.error'] === stock.light['color.palette.error']);

// --- 3. Regeneration owns the whole generated key.
const stale = { version: 1, generated: { 'color.palette.highlight': { light: '#123456', dark: '#123456' } } };
const regenerated = await generateRecipe(stale);
expect('stale generated value replaced', regenerated.recipe.generated['color.palette.highlight'].light === stock.light['color.palette.highlight']);

// --- 4. Precedence: generated beats default, override beats generated.
const precedence = resolveRecipe({
  version: 1,
  generated: { 'color.palette.highlight': { light: '#111111', dark: '#222222' } },
  overrides: { 'color.palette.highlight': { dark: '#333333' } },
}).resolved;
expect('generated beats default', precedence.light['color.palette.highlight'] === '#111111');
expect('override beats generated', precedence.dark['color.palette.highlight'] === '#333333');
expect('generated flows to alias dependents', precedence.light['color.component.promo-card.stripe-background-color'] === '#111111');

// --- 5. Generated validation guards.
const expectInvalid = (label, badRecipe, messagePart) => {
  try {
    resolveRecipe(badRecipe);
    failures.push(`guard ${label}: expected the recipe to be rejected`);
  } catch (error) {
    if (!error.message.includes(messagePart)) {
      failures.push(`guard ${label}: rejected for the wrong reason (wanted "${messagePart}"): ${error.message.split('\n').slice(0, 2).join(' ')}`);
    }
  }
};
expectInvalid('generated on a component token', { version: 1, generated: { 'color.component.button.primary-background-color': { light: '#111111' } } }, 'palette slots only');
expectInvalid('generated on an unknown slot', { version: 1, generated: { 'color.palette.nope': { light: '#111111' } } }, 'no such token');
expectInvalid('generated alias', { version: 1, generated: { 'color.palette.highlight': { $value: '{color.palette.body}' } } }, 'unknown key');
expectInvalid('generated bad hex', { version: 1, generated: { 'color.palette.highlight': { light: '#12345' } } }, 'must be "#rrggbb"');

// --- 6. Custom brands: generation adapts and still hits every floor.
const branded = await generateRecipe({
  version: 1,
  brands: { light: { brand1: '#7a3b00', brand2: '#efe8df' }, dark: { brand1: '#ffb366', brand2: '#2a1f14' } },
});
const brandedResolved = resolveRecipe(branded.recipe).resolved;
const brandedQa = checkContrast(brandedResolved, targetsForRecipe(branded.recipe, loadTargets()));
expect('custom-brand palette passes every contrast target', brandedQa.every((row) => row.pass),
  brandedQa.filter((row) => !row.pass).map((row) => `${row.tokenPath} ${row.mode} ${row.ratio}:1`).join(', '));
expect('custom-brand backgrounds derive from brand2', brandedResolved.light['color.palette.background'] === '#efe8df');

if (failures.length) {
  console.error(`Derive validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log('Derive validation passed: stock round-trip generates a near-but-not-identical palette with every contrast floor met (the 3 known dark failures fixed), mix slots reproduce stock byte-for-byte, override locks hold, generate owns the generated key wholesale, and the override ?? generated ?? default precedence resolves correctly.');
