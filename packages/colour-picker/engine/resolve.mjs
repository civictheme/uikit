/**
 * Node-side shell over the pure recipe core (core.mjs): the same API with
 * filesystem defaults — the committed @civictheme/tokens sources and this
 * package's targets.json. The browser UI imports core.mjs directly and
 * supplies both as data; CLI and tests import this module.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadTokens } from '@civictheme/tokens/build/lib.mjs';
import * as core from './core.mjs';

export { RECIPE_VERSION, DEFAULT_AGAINST, BRAND_KEYS, applyRecipe } from './core.mjs';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Shipped contrast targets (targets.json) as a flat tokenPath -> spec map. */
export function loadTargets() {
  return JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'targets.json'), 'utf-8')).targets;
}

export function validateRecipe(recipe, tree = loadTokens()) {
  return core.validateRecipe(recipe, tree);
}

export function targetsForRecipe(recipe, targets = loadTargets()) {
  return core.targetsForRecipe(recipe, targets);
}

export function resolveRecipe(recipe, tree = loadTokens()) {
  return core.resolveRecipe(recipe, tree);
}
