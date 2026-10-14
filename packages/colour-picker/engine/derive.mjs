/**
 * P5 palette generation — the Node-side shell over the browser-pure
 * engine/generate.mjs, mirroring the core.mjs / resolve.mjs split: the same
 * API with filesystem defaults (the committed @civictheme/tokens sources,
 * this package's targets.json and generation.json). CLI and tests import
 * this module; the browser UI imports generate.mjs directly and supplies
 * the data.
 *
 * Leonardo comes from the committed, pinned vendor bundle
 * (vendor/leonardo.mjs — see `npm run vendor-leonardo`), loaded lazily by
 * generate.mjs, so Node and the browser solve with identical bytes. The P5
 * "Node-side only" containment rule was deliberately reversed in P8 so
 * Generate works in embedded copies (e.g. Drupal theme settings) without a
 * Node runtime — see docs/colour-picker-plan.md.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadTokens } from '@civictheme/tokens/build/lib.mjs';
import { loadTargets } from './resolve.mjs';
import { generateRecipe as generateRecipeCore } from './generate.mjs';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Shipped generation rules (generation.json): tokenPath -> rule map. */
export function loadGeneration() {
  return JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'generation.json'), 'utf-8')).slots;
}

/**
 * Runs the generation rules for a recipe and returns `{ recipe, rows }` —
 * engine/generate.mjs documents the contract; this shell only defaults the
 * data inputs from the committed files.
 */
export async function generateRecipe(recipe, { tree = loadTokens(), targets = loadTargets(), generation = loadGeneration() } = {}) {
  return generateRecipeCore(recipe, { tree, targets, generation });
}
