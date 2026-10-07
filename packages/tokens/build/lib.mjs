/**
 * Shared token loading/resolution for the build and the validation test,
 * so both consume the exact same resolution path. The pure model (mode
 * handling, flattening, alias resolution) lives in model.mjs — this module
 * adds the Node-side filesystem loader and re-exports the model for
 * existing importers.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mergeTrees, resolveTree } from './model.mjs';

export { MODES, MODES_EXTENSION, deepMerge, mergeTrees, treeForMode, flattenTree, hexOf, isAlias, aliasTarget } from './model.mjs';

export const PACKAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_DIR = path.join(PACKAGE_DIR, 'tokens');

/** Loads and merges every tokens/*.json source file into one DTCG tree. */
export function loadTokens(excludeFiles = []) {
  const files = fs.readdirSync(TOKENS_DIR)
    .filter((f) => f.endsWith('.json') && !excludeFiles.includes(f))
    .sort();
  return mergeTrees(...files.map((file) => JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, file), 'utf-8'))));
}

/** resolveTree over the committed sources (the historical default). */
export function resolveModes(tree = loadTokens()) {
  return resolveTree(tree);
}
