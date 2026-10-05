/**
 * Shared token loading/resolution for the build and the validation test,
 * so both consume the exact same resolution path.
 *
 * Mode model: a token's `$value` holds the light (default) mode value;
 * other modes live under `$extensions["io.civictheme.modes"].<mode>`.
 * Theme is never part of the token path (plan §3.1).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const MODES = ['light', 'dark'];
export const MODES_EXTENSION = 'io.civictheme.modes';

export const PACKAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_DIR = path.join(PACKAGE_DIR, 'tokens');

function isToken(node) {
  return Boolean(node) && typeof node === 'object' && '$value' in node;
}

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && typeof target[key] === 'object' && !Array.isArray(target[key])) {
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

/** Loads and merges every tokens/*.json source file into one DTCG tree. */
export function loadTokens(excludeFiles = []) {
  const tree = {};
  const files = fs.readdirSync(TOKENS_DIR)
    .filter((f) => f.endsWith('.json') && !excludeFiles.includes(f))
    .sort();
  files.forEach((file) => {
    deepMerge(tree, JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, file), 'utf-8')));
  });
  return tree;
}

/**
 * Returns a copy of the tree with every token's `$value` swapped to the
 * requested mode's value and the modes extension stripped — i.e. a plain
 * single-mode DTCG tree, which is what Style Dictionary (and Figma's native
 * mode import) consume.
 */
export function treeForMode(tree, mode) {
  if (isToken(tree)) {
    const { $extensions, ...rest } = tree;
    const modeValue = $extensions?.[MODES_EXTENSION]?.[mode];
    const extensions = { ...$extensions };
    delete extensions[MODES_EXTENSION];
    const token = { ...rest, $value: modeValue ?? tree.$value };
    if (Object.keys(extensions).length) token.$extensions = extensions;
    return token;
  }
  if (tree && typeof tree === 'object' && !Array.isArray(tree)) {
    return Object.fromEntries(Object.entries(tree).map(([key, value]) => [
      key,
      key.startsWith('$') ? value : treeForMode(value, mode),
    ]));
  }
  return tree;
}

/** Flattens a single-mode tree to a `{ 'color.x.y': token }` map. */
export function flattenTree(tree, prefix = []) {
  const flat = {};
  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith('$')) continue;
    if (isToken(value)) {
      flat[[...prefix, key].join('.')] = value;
    } else if (value && typeof value === 'object') {
      Object.assign(flat, flattenTree(value, [...prefix, key]));
    }
  }
  return flat;
}

/**
 * Hex for a literal colour token value — the canonical comparison key (§3.3).
 * A fully transparent colour resolves to the CSS `transparent` keyword (used
 * by component tokens; it has no meaningful hex).
 */
export function hexOf(value) {
  if (typeof value === 'string') return value.toLowerCase();
  if (value.alpha === 0) return 'transparent';
  return value.hex.toLowerCase();
}

/** True for a `{color.path.to.token}` DTCG alias value. */
export function isAlias(value) {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

/** The token path inside a DTCG alias value. */
export function aliasTarget(value) {
  return value.slice(1, -1);
}

/**
 * Resolves every mode to a flat `{ mode: { tokenPath: hex } }` map, following
 * `{alias}` references (component tokens alias the palette tier) within the
 * same mode. This is the single resolution path shared by build outputs and
 * validation.
 */
export function resolveModes(tree = loadTokens()) {
  const resolved = {};
  MODES.forEach((mode) => {
    const flat = flattenTree(treeForMode(tree, mode));
    const out = {};
    const resolving = new Set();
    const resolvePath = (tokenPath) => {
      if (tokenPath in out) return out[tokenPath];
      if (!(tokenPath in flat)) throw new Error(`Alias references unknown token "${tokenPath}"`);
      if (resolving.has(tokenPath)) throw new Error(`Alias cycle through "${tokenPath}"`);
      resolving.add(tokenPath);
      const value = flat[tokenPath].$value;
      out[tokenPath] = isAlias(value) ? resolvePath(aliasTarget(value)) : hexOf(value);
      resolving.delete(tokenPath);
      return out[tokenPath];
    };
    Object.keys(flat).forEach(resolvePath);
    resolved[mode] = out;
  });
  return resolved;
}
