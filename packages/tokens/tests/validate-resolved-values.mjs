/**
 * Resolved-value equality gate (plan §3.2).
 *
 * Brand + palette tier: resolves every token from the DTCG source and
 * compares the hex values against the compiled 1.x-structure CSS custom
 * properties (`--ct-color-{light|dark}-{slot}`) in packages/{sdc,twig}/dist.
 *
 * Component tier (Phase 2): resolves every component token through its alias
 * graph and compares against the compiled 1.x component custom property
 * (`--ct-chip-light-background-color` etc.) named by the token's
 * io.civictheme.scss extension, chasing var() references to literals.
 * Coverage runs both ways: every component token must have a compiled
 * counterpart, and every compiled colour property must map to a token or sit
 * on the extraction skip list.
 *
 * This diff starts at zero (Phases 1-2 captured the compiled values) and must
 * stay zero until the deliberate Leonardo regeneration in Phase 4. Any
 * mismatch is a bug in the tokens or an unflagged colour change in SCSS.
 *
 * Exits non-zero on any mismatch, missing slot, or CSS slot with no token.
 */
import fs from 'fs';
import path from 'path';
import { MODES, PACKAGE_DIR, loadTokens, treeForMode, flattenTree, resolveModes, parseCssVars, resolveCssVar } from '../build/lib.mjs';

const UIKIT_PACKAGES = ['sdc', 'twig'];
const SCSS_EXTENSION = 'io.civictheme.scss';
const SKIPPED_EXTENSION = 'io.civictheme.skipped';

const tree = loadTokens();
const resolved = resolveModes(tree);
const flatLight = flattenTree(treeForMode(tree, 'light'));
const componentPaths = Object.keys(flatLight).filter((p) => p.startsWith('color.component.'));
const skippedProps = new Set(
  Object.keys(tree.color.component.$extensions[SKIPPED_EXTENSION]).map((srcVar) => `--${srcVar.slice(1)}`),
);

function tokenPathForSlot(slot, tokenPaths) {
  const paletteToken = `color.palette.${slot}`;
  const brandToken = `color.brand.${slot}`;
  if (paletteToken in tokenPaths) return paletteToken;
  if (brandToken in tokenPaths) return brandToken;
  return null;
}

const failures = [];
let checked = 0;

UIKIT_PACKAGES.forEach((pkg) => {
  const cssPath = path.resolve(PACKAGE_DIR, '..', pkg, 'dist', 'civictheme.variables.css');
  const cssVars = parseCssVars(fs.readFileSync(cssPath, 'utf-8'));

  // --- Brand + palette tier.
  const paletteSlots = { light: {}, dark: {} };
  Object.entries(cssVars).forEach(([prop, value]) => {
    const match = prop.match(/^--ct-color-(light|dark)-([a-z0-9-]+)$/);
    if (match) paletteSlots[match[1]][match[2]] = value.toLowerCase();
  });
  MODES.forEach((mode) => {
    const slots = paletteSlots[mode];
    if (!Object.keys(slots).length) {
      failures.push(`${pkg}/${mode}: no --ct-color-${mode}-* definitions found in ${cssPath}`);
      return;
    }
    const coveredTokens = new Set();
    Object.entries(slots).forEach(([slot, cssHex]) => {
      const tokenPath = tokenPathForSlot(slot, resolved[mode]);
      if (!tokenPath) {
        failures.push(`${pkg}/${mode}: compiled slot "${slot}" has no token`);
        return;
      }
      coveredTokens.add(tokenPath);
      const tokenHex = resolved[mode][tokenPath];
      checked += 1;
      if (tokenHex !== cssHex) {
        failures.push(`${pkg}/${mode}: ${tokenPath} = ${tokenHex} but compiled --ct-color-${mode}-${slot} = ${cssHex}`);
      }
    });
    Object.keys(resolved[mode])
      .filter((tokenPath) => tokenPath.startsWith('color.palette.') || tokenPath.startsWith('color.brand.'))
      .forEach((tokenPath) => {
        if (!coveredTokens.has(tokenPath)) {
          failures.push(`${pkg}/${mode}: token "${tokenPath}" has no compiled counterpart`);
        }
      });
  });

  // --- Component tier.
  const claimedProps = new Set();
  componentPaths.forEach((tokenPath) => {
    const src = flatLight[tokenPath].$extensions?.[SCSS_EXTENSION];
    if (!src) {
      failures.push(`${tokenPath}: missing ${SCSS_EXTENSION} extension (source-variable bridge)`);
      return;
    }
    // The compiled file also carries this token's own generated 2.x property
    // (the tokens dist CSS is embedded into civictheme.variables.css).
    claimedProps.add(`--ct-${tokenPath.split('.').slice(2).join('-')}`);
    MODES.forEach((mode) => {
      const srcVar = src[mode] ?? src.unthemed;
      const prop = `--${srcVar.slice(1)}`;
      claimedProps.add(prop);
      checked += 1;
      let compiled;
      try {
        compiled = resolveCssVar(cssVars, prop);
      } catch {
        failures.push(`${pkg}/${mode}: ${tokenPath}: compiled CSS has no ${prop}`);
        return;
      }
      if (resolved[mode][tokenPath] !== compiled) {
        failures.push(`${pkg}/${mode}: ${tokenPath} = ${resolved[mode][tokenPath]} but compiled ${prop} = ${compiled}`);
      }
    });
  });
  Object.keys(cssVars)
    .filter((prop) => (prop.endsWith('-color') || /^--ct-outline-(light|dark)$/.test(prop)) && !prop.startsWith('--ct-color-'))
    .forEach((prop) => {
      if (!claimedProps.has(prop) && !skippedProps.has(prop)) {
        failures.push(`${pkg}: compiled ${prop} has no component token and is not on the extraction skip list`);
      }
    });
});

if (failures.length) {
  console.error(`Token <-> compiled CSS validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`Token <-> compiled CSS validation passed: ${checked} comparisons (brand/palette + ${componentPaths.length} component tokens) across ${UIKIT_PACKAGES.join(', ')} × ${MODES.join('/')}; zero drift.`);
