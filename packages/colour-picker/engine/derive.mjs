/**
 * P5 palette generation — the one place Leonardo is touched, and Node-side
 * ONLY (the containment rule: no Leonardo bytes ever reach a browser; the
 * UI's Generate button POSTs to the serve process which calls this).
 * `@adobe/leonardo-contrast-colors` is loaded behind a lazy dynamic import so
 * everything else in the package keeps working without it installed.
 *
 * `generateRecipe` MATERIALISES the solve into the recipe's `generated` key
 * (resolution precedence: override ?? generated ?? default — core.mjs).
 * Rules live in generation.json as designer-editable data: `contrast` slots
 * are Leonardo-solved on the key colour's scale to the recorded per-mode
 * ratio (floored at the targets.json target, measured against the slot's
 * `against` token); `mix` slots are percentage tints/shades of a brand (the
 * 1.x derivation recipe). Locks are mechanical: a slot with an override in
 * the recipe is never generated; `generate` owns the whole `generated` key
 * and replaces it on every run.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadTokens } from '@civictheme/tokens/build/lib.mjs';
import { resolveRecipe } from './core.mjs';
import { contrastRatio, roundRatio } from './contrast.mjs';
import { loadTargets } from './resolve.mjs';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BRAND_NAMES = ['brand1', 'brand2', 'brand3'];
const RECIPE_KEY_ORDER = ['$schema', 'version', 'name', 'brands', 'overrides', 'generated', 'additions'];
const MODES = ['light', 'dark'];
/** Re-solve bumps when Leonardo lands a hair under the floor (its solves are
 * closest-on-scale, so a true ratio of e.g. 2.998 against a 3 floor is
 * possible); +0.05 per attempt keeps the result visually indistinguishable. */
const FLOOR_BUMP = 0.05;
const FLOOR_ATTEMPTS = 5;

/** Shipped generation rules (generation.json): tokenPath -> rule map. */
export function loadGeneration() {
  return JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'generation.json'), 'utf-8')).slots;
}

/** Leonardo 1.1.0 internally passes its own deprecated `colorspace` spelling
 * (lib/color.js -> createScale), warning once per constructed colour — pure
 * noise on our call path, silenced for the duration of a generate. */
function quietLeonardo(fn) {
  const warn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('Leonardo:')) return;
    warn(...args);
  };
  try {
    return fn();
  } finally {
    console.warn = warn;
  }
}

async function loadLeonardo() {
  try {
    return await import('@adobe/leonardo-contrast-colors');
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error('Palette generation needs @adobe/leonardo-contrast-colors (the package\'s one optional dependency, Node-side only). '
        + 'Install it next to @civictheme/colour-picker: npm i --save-exact @adobe/leonardo-contrast-colors@1.1.0', { cause: error });
    }
    throw error;
  }
}

/** Sass-style mix toward white (tint) / black (shade), bytes rounded
 * half-to-even — the 1.x `ct-color-tint`/`ct-color-shade` maths, so stock
 * brands reproduce the stock untargeted slots exactly. */
function mixHex(hex, rule) {
  const amount = (rule.tint ?? rule.shade ?? 0) / 100;
  const toward = rule.tint !== undefined ? 255 : 0;
  const bytes = [1, 3, 5].map((i) => {
    const mixed = parseInt(hex.slice(i, i + 2), 16) * (1 - amount) + toward * amount;
    const floor = Math.floor(mixed);
    const byte = Math.abs(mixed - floor - 0.5) < 1e-4 ? (floor % 2 === 0 ? floor : floor + 1) : Math.round(mixed);
    return byte.toString(16).padStart(2, '0');
  });
  return `#${bytes.join('')}`;
}

function checkGenerationRules(generation, defaults, targets) {
  const problems = [];
  Object.entries(generation).forEach(([tokenPath, rule]) => {
    if (defaults.light[tokenPath] === undefined) problems.push(`${tokenPath}: not a token`);
    if (rule.method === 'contrast') {
      if (!BRAND_NAMES.includes(rule.key) && rule.key !== 'default') problems.push(`${tokenPath}: unknown key "${rule.key}"`);
      if (!targets[tokenPath]) problems.push(`${tokenPath}: contrast slot has no targets.json entry`);
      MODES.forEach((mode) => {
        if (typeof rule.ratio?.[mode] !== 'number') problems.push(`${tokenPath}: no ${mode} ratio`);
      });
    } else if (rule.method === 'mix') {
      MODES.forEach((mode) => {
        const mix = rule[mode];
        if (!mix || !BRAND_NAMES.includes(mix.of)) problems.push(`${tokenPath}: ${mode} mix must name a brand in "of"`);
        else if (mix.tint !== undefined && mix.shade !== undefined) problems.push(`${tokenPath}: ${mode} mix has both tint and shade`);
      });
    } else problems.push(`${tokenPath}: unknown method "${rule.method}"`);
  });
  if (problems.length) {
    throw new Error(`generation rules invalid (${problems.length} problems):\n${problems.map((problem) => `  - ${problem}`).join('\n')}`);
  }
}

/**
 * Runs the generation rules for a recipe and returns `{ recipe, rows }`:
 * the input recipe with a freshly materialised `generated` key (overridden
 * slots skipped — the lock; any prior `generated` key replaced), and the QA
 * rows behind it — per slot and mode the method, the pre-generation value,
 * the generated value and (for contrast slots) the requested ratio, the
 * floor and the achieved ratio; locked slots report `locked: true`.
 */
export async function generateRecipe(recipe, { tree = loadTokens(), targets = loadTargets(), generation = loadGeneration() } = {}) {
  const { Color, Theme } = await loadLeonardo();

  // The base state: the recipe WITHOUT its generated key (brands + overrides
  // + additions applied). Brands and solve backgrounds both read from here.
  const base = { ...recipe };
  delete base.generated;
  const { resolved: baseResolved } = resolveRecipe(base, tree);
  checkGenerationRules(generation, baseResolved, targets);

  const brandOf = (mode, brand) => baseResolved[mode][`color.brand.${brand}`];
  const locked = (tokenPath) => recipe.overrides?.[tokenPath] !== undefined;

  // Pass 1 — mix slots (pure maths). They include every background/fill the
  // contrast solves measure against, so `state` is solve-ready afterwards.
  const state = { light: { ...baseResolved.light }, dark: { ...baseResolved.dark } };
  const generated = {};
  const rows = [];
  Object.entries(generation).forEach(([tokenPath, rule]) => {
    if (rule.method !== 'mix') return;
    if (locked(tokenPath)) {
      rows.push({ tokenPath, method: 'mix', locked: true });
      return;
    }
    const spec = {};
    MODES.forEach((mode) => {
      const value = mixHex(brandOf(mode, rule[mode].of), rule[mode]);
      rows.push({ tokenPath, mode, method: 'mix', before: baseResolved[mode][tokenPath], value });
      state[mode][tokenPath] = value;
      spec[mode] = value;
    });
    generated[tokenPath] = spec;
  });

  // Pass 2 — contrast slots, one Leonardo solve per slot and mode against
  // the exact background hex from the post-mix state (probed contract: a
  // string backgroundColor is contrasted against verbatim).
  const solve = (keys, background, ratio) => quietLeonardo(() => {
    const theme = new Theme({
      colors: [new Color({ name: 'slot', colorKeys: keys, ratios: [ratio] })],
      backgroundColor: background,
      output: 'HEX',
    });
    return theme.contrastColors[1].values[0].value.toLowerCase();
  });
  Object.entries(generation).forEach(([tokenPath, rule]) => {
    if (rule.method !== 'contrast') return;
    if (locked(tokenPath)) {
      rows.push({ tokenPath, method: 'contrast', locked: true });
      return;
    }
    const { target: floor, against } = targets[tokenPath];
    const spec = {};
    MODES.forEach((mode) => {
      const keys = rule.key === 'default'
        ? [baseResolved[mode][tokenPath]]
        : [...new Set(MODES.map((keyMode) => brandOf(keyMode, rule.key)))];
      const againstValue = state[mode][against];
      let request = Math.max(rule.ratio[mode], floor);
      let value = solve(keys, againstValue, request);
      for (let attempt = 1; contrastRatio(value, againstValue) < floor && attempt <= FLOOR_ATTEMPTS; attempt++) {
        request = floor + FLOOR_BUMP * attempt;
        value = solve(keys, againstValue, request);
      }
      rows.push({
        tokenPath,
        mode,
        method: 'contrast',
        before: baseResolved[mode][tokenPath],
        value,
        against,
        againstValue,
        request,
        floor,
        ratio: roundRatio(contrastRatio(value, againstValue)),
      });
      spec[mode] = value;
    });
    generated[tokenPath] = spec;
  });

  const updated = {};
  RECIPE_KEY_ORDER.forEach((key) => {
    if (key === 'generated') {
      if (Object.keys(generated).length) updated.generated = generated;
    } else if (recipe[key] !== undefined) updated[key] = recipe[key];
  });
  return { recipe: updated, rows };
}
