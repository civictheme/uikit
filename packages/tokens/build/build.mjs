/**
 * @civictheme/tokens build.
 *
 * Emits, per DTCG mode (light/dark):
 *   dist/figma/<mode>.tokens.json  — Figma native "Import mode" (plan §3.2)
 *   dist/resolved.<mode>.json      — flat token-path -> hex map for CI
 * and combined:
 *   dist/css/variables.css         — 2.x theme-scoped properties (§3.4)
 *   dist/figma/name-map.json       — token path <-> Figma name contract
 *
 * The Figma files carry ALL 430 variables (brand + palette + component),
 * mirroring the proven Export-mode shape, so the production run can create or
 * update the whole Colour collection through Figma's native Import mode
 * (rehearsed 2026-10-06: import matches by name, creates the full alias
 * graph with scopes and codeSyntax, preserves variable ids in-place, and is
 * an idempotent no-op on equal values).
 */
import fs from 'fs';
import path from 'path';
import { MODES, PACKAGE_DIR, loadTokens, treeForMode, flattenTree, resolveModes, isAlias, aliasTarget } from './lib.mjs';
import { figmaNameFor, figmaScopesFor } from './figma-names.mjs';

const DIST = path.join(PACKAGE_DIR, 'dist');

/**
 * The 2.x custom-property name for a token (§3.4 naming contract).
 * Brand tokens are generator input only — they ship nowhere in CSS.
 */
function cssNameFor(tokenPath) {
  const [, tier, ...rest] = tokenPath.split('.');
  if (tier === 'palette') return `--ct-color-${rest.join('-')}`;
  if (tier === 'component') return `--ct-${rest.join('-')}`;
  throw new Error(`No CSS name for "${tokenPath}" — only palette and component tokens ship in CSS`);
}

/**
 * A committed $value in Figma Export-mode form: an alias becomes a DTCG
 * reference string with the dot-separated Figma path (names never contain
 * dots, so the slash->dot translation is unambiguous); a literal keeps the
 * committed 6-decimal components and alpha with hex flipped to Figma's
 * uppercase. Figma's native Import mode rejects legacy hex-string colours —
 * the DTCG 2025.10 object form is required.
 */
function figmaValue(value) {
  if (isAlias(value)) return `{${figmaNameFor(aliasTarget(value)).replaceAll('/', '.')}}`;
  return { colorSpace: 'srgb', components: value.components, alpha: value.alpha, hex: value.hex.toUpperCase() };
}

/**
 * One mode's Figma import document. Each variable carries com.figma.scopes
 * and (except brand, which ships nowhere in CSS) WEB codeSyntax, so a native
 * import CREATES variables with the correct pickers and syntax, not just
 * values; the doc-level com.figma.modeName drives the ingest's swapped-files
 * guard. com.figma.variableId is deliberately absent — import matches by
 * name, and ids differ per file.
 */
function figmaDoc(tree, mode) {
  const out = { $extensions: { 'com.figma.modeName': mode === 'light' ? 'Light' : 'Dark' } };
  Object.entries(flattenTree(treeForMode(tree, mode))).forEach(([tokenPath, token]) => {
    const segments = figmaNameFor(tokenPath).split('/');
    const leaf = segments.pop();
    let group = out;
    segments.forEach((segment) => {
      group[segment] = group[segment] || {};
      group = group[segment];
    });
    const $extensions = { 'com.figma.scopes': figmaScopesFor(tokenPath) };
    if (!tokenPath.startsWith('color.brand.')) $extensions['com.figma.codeSyntax'] = { WEB: `var(${cssNameFor(tokenPath)})` };
    group[leaf] = { $type: 'color', $value: figmaValue(token.$value), $extensions };
  });
  return out;
}

function cssLiteral(value) {
  return value.alpha === 0 ? 'transparent' : value.hex.toLowerCase();
}

/**
 * One theme scope block: palette literals, then component properties whose
 * aliases are emitted as var() references, so the DTCG alias graph survives
 * into the browser. Component properties are re-declared in BOTH scope
 * blocks, not once on :root (deliberate §3.4 deviation): var() substitution
 * inside a custom property happens where that property is DECLARED and the
 * substituted result is what inherits, so a :root-only declaration would
 * freeze every component property at its light value for descendants of a
 * .ct-theme-dark scope.
 */
function cssForMode(tree, resolved, mode) {
  const selector = mode === 'light' ? ':root,\n.ct-theme-light' : '.ct-theme-dark';
  const flat = flattenTree(treeForMode(tree, mode));
  const paths = Object.keys(flat);
  const paletteLines = paths.filter((tokenPath) => tokenPath.startsWith('color.palette.'))
    .map((tokenPath) => `  ${cssNameFor(tokenPath)}: ${resolved[mode][tokenPath]};`);
  const componentLines = paths.filter((tokenPath) => tokenPath.startsWith('color.component.'))
    .map((tokenPath) => {
      const value = flat[tokenPath].$value;
      const css = isAlias(value) ? `var(${cssNameFor(aliasTarget(value))})` : cssLiteral(value);
      return `  ${cssNameFor(tokenPath)}: ${css};`;
    });
  return `${selector} {\n${paletteLines.join('\n')}\n\n${componentLines.join('\n')}\n}\n`;
}

const tree = loadTokens();
const resolved = resolveModes();

fs.mkdirSync(path.join(DIST, 'figma'), { recursive: true });
for (const mode of MODES) {
  fs.writeFileSync(path.join(DIST, 'figma', `${mode}.tokens.json`), `${JSON.stringify(figmaDoc(tree, mode), null, 2)}\n`);
  fs.writeFileSync(path.join(DIST, `resolved.${mode}.json`), `${JSON.stringify(resolved[mode], null, 2)}\n`);
}

fs.mkdirSync(path.join(DIST, 'css'), { recursive: true });
const banner = '/**\n * Generated by @civictheme/tokens — do not edit.\n * Source: packages/tokens/tokens/*.json\n */\n';
fs.writeFileSync(path.join(DIST, 'css', 'variables.css'), `${banner}${cssForMode(tree, resolved, 'light')}\n${cssForMode(tree, resolved, 'dark')}`);

const nameMap = Object.fromEntries(Object.keys(flattenTree(tree)).map((tokenPath) => [tokenPath, figmaNameFor(tokenPath)]));
fs.writeFileSync(path.join(DIST, 'figma', 'name-map.json'), `${JSON.stringify(nameMap, null, 2)}\n`);

console.log(`Built ${Object.keys(resolved.light).length} tokens × ${MODES.length} modes -> ${path.relative(process.cwd(), DIST)}`);
