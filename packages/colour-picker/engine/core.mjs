/**
 * Recipe resolution core (uplift plan §4.4 plus the session-11 `additions`
 * key and the P5 `generated` key): per token and mode, resolved =
 * override ?? generated ?? current-default ?? alias. `generated` holds the
 * values the `generate` command MATERIALISED into the recipe (palette slots
 * only, per-mode literals) — resolution never derives on its own, so a
 * recipe without the key still reproduces stock byte-for-byte (the identity
 * gate), and overrides always win over generated values.
 * Pure — no Node built-ins, importable in the browser (the UI runs the same
 * resolution client-side); every function takes the defaults tree and the
 * targets map as arguments. resolve.mjs wraps this with the Node-side
 * loaders. Defaults are never modified: a recipe is an agency's sub-theme
 * layered over them, and an identity (empty) recipe reproduces today's
 * resolved values byte-for-byte (tests/validate-identity.mjs).
 *
 * Value merge-back mirrors the Figma ingest semantics: $value holds the
 * light value, dark lives under io.civictheme.modes only while the modes
 * differ — except that a pre-existing explicit dark stays explicit (some
 * committed tokens record an equal dark deliberately).
 */
import { MODES_EXTENSION, flattenTree, resolveTree } from '@civictheme/tokens/build/model.mjs';

export const RECIPE_VERSION = 1;
export const DEFAULT_AGAINST = 'color.palette.background-light';

const RECIPE_KEYS = ['$schema', 'version', 'name', 'brands', 'overrides', 'generated', 'additions'];
const VALUE_KEYS = ['light', 'dark', '$value'];
const GENERATED_KEYS = ['light', 'dark'];
const ADDITION_KEYS = [...VALUE_KEYS, 'target', 'against'];
export const BRAND_KEYS = ['brand1', 'brand2', 'brand3'];
const HEX = /^#[0-9a-fA-F]{6}$/;
const PALETTE_PATH = /^color\.palette\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COMPONENT_PATH = /^color\.component\.[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$/;

const round6 = (value) => Math.round(value * 1e6) / 1e6;

/** A recipe literal (hex or "transparent") as a committed colour object. */
function colourValue(literal) {
  if (literal === 'transparent') return { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0, hex: '#000000' };
  const hex = literal.toLowerCase();
  const bytes = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return { colorSpace: 'srgb', components: bytes.map((byte) => round6(byte / 255)), alpha: 1, hex };
}

function sameValue(a, b) {
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  return a.hex === b.hex && a.alpha === b.alpha;
}

function isPlainObject(node) {
  return Boolean(node) && typeof node === 'object' && !Array.isArray(node);
}

/** The given targets plus every recipe addition that carries one. */
export function targetsForRecipe(recipe, targets) {
  const merged = { ...targets };
  Object.entries(recipe.additions ?? {}).forEach(([tokenPath, spec]) => {
    if (spec.target !== undefined) merged[tokenPath] = { target: spec.target, against: spec.against ?? DEFAULT_AGAINST };
  });
  return merged;
}

function checkValueSpec(spec, context, allowedKeys, problems) {
  if (!isPlainObject(spec)) {
    problems.push(`${context}: must be an object, got ${JSON.stringify(spec)}`);
    return;
  }
  Object.keys(spec).forEach((key) => {
    if (!allowedKeys.includes(key)) problems.push(`${context}: unknown key "${key}" (allowed: ${allowedKeys.join(', ')})`);
  });
  if (!VALUE_KEYS.some((key) => key in spec)) problems.push(`${context}: needs at least one of ${VALUE_KEYS.join(', ')}`);
  ['light', 'dark'].forEach((mode) => {
    const literal = spec[mode];
    if (literal !== undefined && literal !== 'transparent' && !(typeof literal === 'string' && HEX.test(literal))) {
      problems.push(`${context}: ${mode} must be "#rrggbb" or "transparent", got ${JSON.stringify(literal)}`);
    }
  });
  if (spec.$value !== undefined && !(typeof spec.$value === 'string' && spec.$value.startsWith('{') && spec.$value.endsWith('}'))) {
    problems.push(`${context}: $value must be a "{color.path.to.token}" alias, got ${JSON.stringify(spec.$value)}`);
  }
}

/**
 * Validates a recipe against the defaults tree. Throws listing every
 * problem; malformed input is the one thing that is never warn-only
 * (contrast failures warn, bad recipes fail).
 */
export function validateRecipe(recipe, tree) {
  const problems = [];
  if (!isPlainObject(recipe)) throw new Error('Recipe invalid: not an object');
  Object.keys(recipe).forEach((key) => {
    if (!RECIPE_KEYS.includes(key)) problems.push(`unknown top-level key "${key}" (allowed: ${RECIPE_KEYS.join(', ')})`);
  });
  if (recipe.version !== RECIPE_VERSION) {
    problems.push(`version must be ${RECIPE_VERSION}, got ${JSON.stringify(recipe.version)}`);
  }

  const defaults = flattenTree(tree);
  const additionPaths = Object.keys(recipe.additions ?? {});
  const knownPaths = new Set([...Object.keys(defaults), ...additionPaths]);
  const checkAlias = (spec, context) => {
    if (typeof spec.$value === 'string' && spec.$value.startsWith('{') && spec.$value.endsWith('}')) {
      const target = spec.$value.slice(1, -1);
      if (!knownPaths.has(target)) problems.push(`${context}: $value aliases unknown token "${target}"`);
    }
  };

  if (recipe.brands !== undefined) {
    if (!isPlainObject(recipe.brands)) {
      problems.push('brands: must be an object');
    } else {
      Object.entries(recipe.brands).forEach(([mode, brandSet]) => {
        if (mode !== 'light' && mode !== 'dark') {
          problems.push(`brands: unknown mode "${mode}" (allowed: light, dark)`);
          return;
        }
        if (!isPlainObject(brandSet)) {
          problems.push(`brands.${mode}: must be an object`);
          return;
        }
        Object.entries(brandSet).forEach(([brand, hex]) => {
          if (!BRAND_KEYS.includes(brand)) problems.push(`brands.${mode}: unknown brand "${brand}" (allowed: ${BRAND_KEYS.join(', ')})`);
          else if (!(typeof hex === 'string' && HEX.test(hex))) problems.push(`brands.${mode}.${brand}: must be "#rrggbb", got ${JSON.stringify(hex)}`);
        });
      });
    }
  }

  if (recipe.overrides !== undefined && !isPlainObject(recipe.overrides)) problems.push('overrides: must be an object');
  Object.entries(isPlainObject(recipe.overrides) ? recipe.overrides : {}).forEach(([tokenPath, spec]) => {
    const context = `overrides.${tokenPath}`;
    if (!(tokenPath in defaults)) problems.push(`${context}: no such token — overrides apply to existing tokens, additions create new ones`);
    checkValueSpec(spec, context, VALUE_KEYS, problems);
    if (isPlainObject(spec)) checkAlias(spec, context);
  });

  if (recipe.generated !== undefined && !isPlainObject(recipe.generated)) problems.push('generated: must be an object');
  Object.entries(isPlainObject(recipe.generated) ? recipe.generated : {}).forEach(([tokenPath, spec]) => {
    const context = `generated.${tokenPath}`;
    if (!PALETTE_PATH.test(tokenPath)) problems.push(`${context}: generated values are palette slots only`);
    else if (!(tokenPath in defaults)) problems.push(`${context}: no such token — generate materialises existing palette slots`);
    checkValueSpec(spec, context, GENERATED_KEYS, problems);
  });

  if (recipe.additions !== undefined && !isPlainObject(recipe.additions)) problems.push('additions: must be an object');
  Object.entries(isPlainObject(recipe.additions) ? recipe.additions : {}).forEach(([tokenPath, spec]) => {
    const context = `additions.${tokenPath}`;
    if (tokenPath in defaults) problems.push(`${context}: collides with an existing token — additions never touch the core sets, use an override`);
    if (!PALETTE_PATH.test(tokenPath) && !COMPONENT_PATH.test(tokenPath)) {
      problems.push(`${context}: addition paths must be color.palette.<slug> or color.component.<component>.<property> (lowercase slugs)`);
    }
    checkValueSpec(spec, context, ADDITION_KEYS, problems);
    if (!isPlainObject(spec)) return;
    checkAlias(spec, context);
    if (spec.light === undefined && spec.$value === undefined) problems.push(`${context}: an addition needs a light value (a light literal or a $value alias)`);
    if (spec.target !== undefined && !(typeof spec.target === 'number' && spec.target > 1 && spec.target <= 21)) {
      problems.push(`${context}: target must be a contrast ratio in (1, 21], got ${JSON.stringify(spec.target)}`);
    }
    if (spec.against !== undefined && !knownPaths.has(spec.against)) problems.push(`${context}: against names unknown token "${spec.against}"`);
  });

  if (problems.length) {
    throw new Error(`Recipe invalid (${problems.length} problems):\n${problems.map((problem) => `  - ${problem}`).join('\n')}`);
  }
}

function tokenNodeAt(tree, tokenPath) {
  return tokenPath.split('.').reduce((node, segment) => node?.[segment], tree);
}

/** Applies an override's light/dark/$value spec onto a token node in place. */
function applySpec(node, spec) {
  const origLight = node.$value;
  const origDark = node.$extensions?.[MODES_EXTENSION]?.dark ?? node.$value;
  const newLight = spec.light !== undefined ? colourValue(spec.light) : (spec.$value ?? origLight);
  const newDark = spec.dark !== undefined ? colourValue(spec.dark) : (spec.$value ?? origDark);

  node.$value = newLight;
  const extensions = { ...node.$extensions };
  const hadDark = Boolean(extensions[MODES_EXTENSION] && 'dark' in extensions[MODES_EXTENSION]);
  if (!sameValue(newLight, newDark) || hadDark) {
    const rest = { ...extensions };
    delete rest[MODES_EXTENSION];
    const modes = { ...extensions[MODES_EXTENSION], dark: newDark };
    Object.keys(extensions).forEach((key) => delete extensions[key]);
    extensions[MODES_EXTENSION] = modes;
    Object.assign(extensions, rest);
  } else {
    delete extensions[MODES_EXTENSION];
  }
  if (Object.keys(extensions).length) node.$extensions = extensions;
  else delete node.$extensions;
}

/**
 * The defaults tree with the recipe layered on: brands, generated values
 * and overrides mutate existing tokens, additions insert new ones. Returns
 * a new tree; `tree` is not modified. Call validateRecipe first
 * (resolveRecipe does both).
 */
export function applyRecipe(tree, recipe) {
  const applied = structuredClone(tree);

  BRAND_KEYS.forEach((brand) => {
    const spec = {};
    if (recipe.brands?.light?.[brand] !== undefined) spec.light = recipe.brands.light[brand];
    if (recipe.brands?.dark?.[brand] !== undefined) spec.dark = recipe.brands.dark[brand];
    if (Object.keys(spec).length) applySpec(tokenNodeAt(applied, `color.brand.${brand}`), spec);
  });

  // Generated before overrides: both mutate in place, so applying overrides
  // second gives the override ?? generated ?? default precedence per mode.
  Object.entries(recipe.generated ?? {}).forEach(([tokenPath, spec]) => {
    applySpec(tokenNodeAt(applied, tokenPath), spec);
  });

  Object.entries(recipe.overrides ?? {}).forEach(([tokenPath, spec]) => {
    applySpec(tokenNodeAt(applied, tokenPath), spec);
  });

  Object.entries(recipe.additions ?? {}).forEach(([tokenPath, spec]) => {
    const segments = tokenPath.split('.');
    const leaf = segments.pop();
    let group = applied;
    segments.forEach((segment) => {
      group[segment] = group[segment] || {};
      group = group[segment];
    });
    const light = spec.light !== undefined ? colourValue(spec.light) : spec.$value;
    const dark = spec.dark !== undefined ? colourValue(spec.dark) : (spec.$value ?? light);
    const token = { $value: light };
    if (!sameValue(light, dark)) token.$extensions = { [MODES_EXTENSION]: { dark } };
    group[leaf] = token;
  });

  return applied;
}

/**
 * Validate + apply + resolve in one step: returns `{ tree, resolved }` where
 * `tree` is the recipe-applied DTCG tree (the emitters' input) and
 * `resolved` is the flat `{ mode: { tokenPath: hex } }` map (the contrast
 * oracle's input), both produced by the proven tokens machinery.
 */
export function resolveRecipe(recipe, tree) {
  validateRecipe(recipe, tree);
  const applied = applyRecipe(tree, recipe);
  return { tree: applied, resolved: resolveTree(applied) };
}
