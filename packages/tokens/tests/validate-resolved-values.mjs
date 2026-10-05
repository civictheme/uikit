/**
 * Tokens validation gate (plan §3.2).
 *
 * 1. Source sanity: every token resolves through its alias graph for both
 *    modes (resolveModes throws on cycles, unknown aliases or bad values),
 *    and the component tier keeps its io.civictheme.scss source-variable
 *    bridge (used by sub-theme migration tooling).
 *
 * 2. Embeds check: the compiled UIKit stylesheets embed the CURRENT tokens
 *    dist CSS byte-for-byte. Since 2.x components consume only the
 *    token-generated custom properties, byte-equal embedding is the whole
 *    colour contract between the packages; resolved-value maths stays inside
 *    this package.
 *
 * Exits non-zero on any failure.
 */
import fs from 'fs';
import path from 'path';
import { MODES, PACKAGE_DIR, loadTokens, treeForMode, flattenTree, resolveModes } from '../build/lib.mjs';

const SCSS_EXTENSION = 'io.civictheme.scss';

const EMBEDDING_FILES = [
  ['sdc', 'civictheme.variables.css'],
  ['twig', 'civictheme.variables.css'],
  ['twig', 'civictheme.css'],
  ['twig', 'civictheme.storybook.css'],
];

const failures = [];

// --- Source sanity.
const tree = loadTokens();
const resolved = resolveModes(tree);
MODES.forEach((mode) => {
  Object.entries(resolved[mode]).forEach(([tokenPath, value]) => {
    if (!/^#[0-9a-f]{6}$/.test(value) && value !== 'transparent') {
      failures.push(`${mode}: ${tokenPath} resolved to "${value}", not a hex colour or transparent`);
    }
  });
});

const flatLight = flattenTree(treeForMode(tree, 'light'));
const componentPaths = Object.keys(flatLight).filter((p) => p.startsWith('color.component.'));
componentPaths.forEach((tokenPath) => {
  if (!flatLight[tokenPath].$extensions?.[SCSS_EXTENSION]) {
    failures.push(`${tokenPath}: missing ${SCSS_EXTENSION} extension (1.x source-variable bridge for migration tooling)`);
  }
});

// --- Embeds check.
const tokensCss = fs.readFileSync(path.resolve(PACKAGE_DIR, 'dist', 'css', 'variables.css'), 'utf-8');
['.ct-theme-light', '.ct-theme-dark', '--ct-color-heading'].forEach((marker) => {
  if (!tokensCss.includes(marker)) {
    failures.push(`tokens dist CSS is missing "${marker}" - rebuild the tokens package`);
  }
});

EMBEDDING_FILES.forEach(([pkg, file]) => {
  const cssPath = path.resolve(PACKAGE_DIR, '..', pkg, 'dist', file);
  let css;
  try {
    css = fs.readFileSync(cssPath, 'utf-8');
  } catch {
    failures.push(`${pkg}/${file}: missing (${cssPath})`);
    return;
  }
  if (!css.includes(tokensCss)) {
    failures.push(`${pkg}/${file}: does not embed the current tokens dist CSS byte-for-byte - rebuild the ${pkg} package`);
  }
});

if (failures.length) {
  console.error(`Tokens validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
const tokenCount = Object.keys(resolved.light).length;
console.log(`Tokens validation passed: ${tokenCount} tokens resolve in both modes (${componentPaths.length} component tokens carry the scss bridge); tokens dist CSS embedded byte-for-byte in ${EMBEDDING_FILES.map(([p, f]) => `${p}/${f}`).join(', ')}.`);
