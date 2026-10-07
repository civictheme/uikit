/**
 * Recipe semantics gate, exercising the uplift-plan §4.4 example shapes on
 * real tokens: a light-only palette literal (followed by its alias
 * dependents), a component alias re-point, a dark-only component literal,
 * brand inputs, palette + component additions joining Contrast QA and the
 * emitted outputs, and the drift guards that make malformed recipes fail
 * loudly.
 */
import { resolveRecipe, targetsForRecipe, applyRecipe, loadTargets } from '../engine/resolve.mjs';
import { checkContrast } from '../engine/contrast.mjs';
import { emitCss, emitFigma } from '../engine/emit.mjs';
import { loadTokens } from '@civictheme/tokens/build/lib.mjs';

const failures = [];
const expect = (label, condition, detail = '') => {
  if (!condition) failures.push(`${label}${detail ? `: ${detail}` : ''}`);
};

const defaults = resolveRecipe({ version: 1 }).resolved;

// --- 1. Overrides + brands + additions applied together.
const recipe = {
  version: 1,
  name: 'test-agency',
  brands: { light: { brand1: '#112233' } },
  overrides: {
    'color.palette.highlight': { light: '#ffcc00' },
    'color.component.button.primary-background-color': { $value: '{color.palette.background-dark}' },
    'color.component.alert.error-background-color': { dark: '#e85653' },
  },
  additions: {
    'color.palette.brand-accent': { light: '#6a3bb5', dark: '#c9a1e8', target: 3 },
    'color.component.my-hero.background-color': { $value: '{color.palette.brand-accent}' },
  },
};
const { tree, resolved } = resolveRecipe(recipe);

// Light-only literal: light changes, dark keeps the default, dependents follow.
expect('highlight light override', resolved.light['color.palette.highlight'] === '#ffcc00', resolved.light['color.palette.highlight']);
expect('highlight dark untouched', resolved.dark['color.palette.highlight'] === defaults.dark['color.palette.highlight']);
expect('stripe follows highlight', resolved.light['color.component.promo-card.stripe-background-color'] === '#ffcc00');

// Alias re-point: both modes now track the new target.
['light', 'dark'].forEach((mode) => {
  expect(`button re-point (${mode})`, resolved[mode]['color.component.button.primary-background-color'] === resolved[mode]['color.palette.background-dark']);
});
expect('button re-point changed something', resolved.light['color.component.button.primary-background-color'] !== defaults.light['color.component.button.primary-background-color']);

// Dark-only literal: dark changes, light keeps the default.
expect('alert dark override', resolved.dark['color.component.alert.error-background-color'] === '#e85653');
expect('alert light untouched', resolved.light['color.component.alert.error-background-color'] === defaults.light['color.component.alert.error-background-color']);

// Brands land in the brand tokens (generator inputs; emitted to Figma only).
expect('brand1 light input', resolved.light['color.brand.brand1'] === '#112233');
expect('brand1 dark untouched', resolved.dark['color.brand.brand1'] === defaults.dark['color.brand.brand1']);

// Additions resolve in both modes and the alias graph reaches them.
expect('addition light', resolved.light['color.palette.brand-accent'] === '#6a3bb5');
expect('addition dark', resolved.dark['color.palette.brand-accent'] === '#c9a1e8');
expect('component addition follows', resolved.dark['color.component.my-hero.background-color'] === '#c9a1e8');

// Defaults are never touched: the shipped tree still resolves identically.
expect('defaults untouched', JSON.stringify(resolveRecipe({ version: 1 }).resolved) === JSON.stringify(defaults));

// --- 2. Additions join Contrast QA (session-11 values: 7.09 / 4.91 vs the
// light/dark background-light, both passing the >= 3 target).
const rows = checkContrast(resolved, targetsForRecipe(recipe));
const accent = Object.fromEntries(rows.filter((row) => row.tokenPath === 'color.palette.brand-accent').map((row) => [row.mode, row]));
expect('accent targeted in both modes', Boolean(accent.light && accent.dark));
expect('accent light ratio', accent.light?.ratio === 7.09 && accent.light?.pass === true, JSON.stringify(accent.light));
expect('accent dark ratio', accent.dark?.ratio === 4.91 && accent.dark?.pass === true, JSON.stringify(accent.dark));
expect('core targets unchanged by recipe targets', Object.keys(targetsForRecipe(recipe)).length === Object.keys(loadTargets()).length + 1);

// --- 3. Additions reach the emitted outputs.
const css = emitCss(tree, resolved);
expect('addition palette property (light)', css.includes('--ct-color-brand-accent: #6a3bb5;'));
expect('addition palette property (dark)', css.includes('--ct-color-brand-accent: #c9a1e8;'));
expect('addition component property', css.includes('--ct-my-hero-background-color: var(--ct-color-brand-accent);'));
const figmaLight = emitFigma(tree, 'light');
const accentVar = figmaLight.Custom?.['Brand Accent'];
expect('addition in Figma doc', accentVar?.$value?.hex === '#6A3BB5', JSON.stringify(accentVar));
expect('addition codeSyntax', accentVar?.$extensions?.['com.figma.codeSyntax']?.WEB === 'var(--ct-color-brand-accent)');
expect('addition scopes', JSON.stringify(accentVar?.$extensions?.['com.figma.scopes']) === JSON.stringify(['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE']));
const heroVar = figmaLight.Component?.['My Hero']?.['Background Color'];
expect('component addition aliases in Figma doc', heroVar?.$value === '{Custom.Brand Accent}', JSON.stringify(heroVar));

// --- 4. Transparent literals resolve and emit as `transparent`.
const transparent = resolveRecipe({ version: 1, overrides: { 'color.palette.highlight': { light: 'transparent' } } });
expect('transparent resolves', transparent.resolved.light['color.palette.highlight'] === 'transparent');
expect('transparent emits', emitCss(transparent.tree, transparent.resolved).includes('--ct-color-highlight: transparent;'));

// --- 5. The merge keeps committed per-mode structure (ingest semantics).
const applied = applyRecipe(loadTokens(), recipe);
const highlightNode = applied.color.palette.highlight;
expect('override keeps dark mode entry', highlightNode.$extensions?.['io.civictheme.modes']?.dark?.hex === defaults.dark['color.palette.highlight']);
expect('override normalises the literal', highlightNode.$value.hex === '#ffcc00' && highlightNode.$value.components.join(',') === '1,0.8,0');

// --- 6. Drift guards: malformed recipes throw, listing the problem.
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
expectInvalid('unknown override', { version: 1, overrides: { 'color.palette.nope': { light: '#000000' } } }, 'no such token');
expectInvalid('addition collision', { version: 1, additions: { 'color.palette.highlight': { light: '#000000' } } }, 'collides with an existing token');
expectInvalid('bad hex', { version: 1, overrides: { 'color.palette.highlight': { light: '#ffcc0' } } }, 'must be "#rrggbb"');
expectInvalid('unknown alias target', { version: 1, overrides: { 'color.palette.highlight': { $value: '{color.palette.nope}' } } }, 'aliases unknown token');
expectInvalid('wrong version', { version: 2 }, 'version must be 1');
expectInvalid('unknown key', { version: 1, overides: {} }, 'unknown top-level key');
expectInvalid('addition without light', { version: 1, additions: { 'color.palette.accent': { dark: '#c9a1e8' } } }, 'needs a light value');
expectInvalid('bad target', { version: 1, additions: { 'color.palette.accent': { light: '#6a3bb5', target: 0.5 } } }, 'target must be a contrast ratio');
expectInvalid('bad brand', { version: 1, brands: { light: { brand9: '#000000' } } }, 'unknown brand');

if (failures.length) {
  console.error(`Recipe validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log('Recipe validation passed: overrides (light-only, alias re-point, dark-only), brands and additions resolve correctly with defaults untouched; additions join Contrast QA and all emitted outputs; malformed recipes fail loudly.');
