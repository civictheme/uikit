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
 * Style Dictionary v5 parses/resolves each single-mode DTCG tree; colour
 * objects are collapsed to their `hex` by a custom transform (the known
 * SD 2025.10 colour-object gap, plan §6). The Figma emit re-expands hex to
 * the 2025.10 colour object — Figma's importer rejects hex strings.
 */
import fs from 'fs';
import path from 'path';
import StyleDictionary from 'style-dictionary';
import { MODES, PACKAGE_DIR, loadTokens, treeForMode, flattenTree, resolveModes, isAlias, aliasTarget } from './lib.mjs';
import { FIGMA_NAMES } from './figma-names.mjs';

const DIST = path.join(PACKAGE_DIR, 'dist');

StyleDictionary.registerTransform({
  name: 'ct/color/hex',
  type: 'value',
  filter: (token) => (token.$type ?? token.type) === 'color',
  transform: (token) => (typeof token.$value === 'string' ? token.$value : token.$value.hex).toLowerCase(),
});

// Figma's native "Import mode" rejects legacy hex-string colours; it requires
// the DTCG 2025.10 object form (colorSpace/components/alpha). `hex` is an
// optional convenience field Figma itself includes on export.
function figmaColorValue(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return { colorSpace: 'srgb', components: channels, alpha: 1, hex: hex.toUpperCase() };
}

StyleDictionary.registerFormat({
  name: 'ct/figma-dtcg',
  format: ({ dictionary }) => {
    const out = {};
    dictionary.allTokens.forEach((token) => {
      const tokenPath = token.path.join('.');
      const figmaName = FIGMA_NAMES[tokenPath];
      if (!figmaName) throw new Error(`No Figma name mapped for token "${tokenPath}" — add it to build/figma-names.mjs`);
      const segments = figmaName.split('/');
      const leaf = segments.pop();
      let group = out;
      segments.forEach((segment) => {
        group[segment] = group[segment] || {};
        group = group[segment];
      });
      group[leaf] = { $type: 'color', $value: figmaColorValue(token.$value) };
    });
    return `${JSON.stringify(out, null, 2)}\n`;
  },
});

async function buildMode(tree, mode) {
  const sd = new StyleDictionary({
    tokens: treeForMode(tree, mode),
    log: { verbosity: 'default' },
    platforms: {
      figma: {
        transforms: ['ct/color/hex'],
        buildPath: `${DIST}/figma/`,
        files: [{
          destination: `${mode}.tokens.json`,
          format: 'ct/figma-dtcg',
          // Component tokens stay out of Figma (plan §3.1): designers bind to
          // the palette variables; this tier lives in JSON/CSS only.
          filter: (token) => token.path[1] !== 'component',
        }],
      },
    },
  });
  await sd.buildAllPlatforms();
}

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

for (const mode of MODES) {
  await buildMode(tree, mode);
  fs.writeFileSync(path.join(DIST, `resolved.${mode}.json`), `${JSON.stringify(resolved[mode], null, 2)}\n`);
}

fs.mkdirSync(path.join(DIST, 'css'), { recursive: true });
const banner = '/**\n * Generated by @civictheme/tokens — do not edit.\n * Source: packages/tokens/tokens/*.json\n */\n';
fs.writeFileSync(path.join(DIST, 'css', 'variables.css'), `${banner}${cssForMode(tree, resolved, 'light')}\n${cssForMode(tree, resolved, 'dark')}`);
fs.writeFileSync(path.join(DIST, 'figma', 'name-map.json'), `${JSON.stringify(FIGMA_NAMES, null, 2)}\n`);

console.log(`Built ${Object.keys(resolved.light).length} tokens × ${MODES.length} modes -> ${path.relative(process.cwd(), DIST)}`);
