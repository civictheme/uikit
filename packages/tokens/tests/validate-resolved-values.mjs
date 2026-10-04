/**
 * Resolved-value equality gate (plan §3.2).
 *
 * Resolves every brand + palette token from the DTCG source and compares the
 * hex values against the compiled 1.x-structure CSS custom properties
 * (`--ct-color-{light|dark}-{slot}`) in packages/{sdc,twig}/dist.
 *
 * This diff starts at zero (Phase 1 captured the compiled values) and must
 * stay zero until the deliberate Leonardo regeneration in Phase 4. Any
 * mismatch is a bug in the tokens or an unflagged colour change in SCSS.
 *
 * Exits non-zero on any mismatch, missing slot, or CSS slot with no token.
 */
import fs from 'fs';
import path from 'path';
import { MODES, PACKAGE_DIR, resolveModes } from '../build/lib.mjs';

const UIKIT_PACKAGES = ['sdc', 'twig'];

function compiledColors(cssPath) {
  const css = fs.readFileSync(cssPath, 'utf-8');
  const colors = { light: {}, dark: {} };
  for (const match of css.matchAll(/--ct-color-(light|dark)-([a-z0-9-]+):\s*([^;}]+)[;}]/g)) {
    colors[match[1]][match[2]] = match[3].trim().toLowerCase();
  }
  return colors;
}

function tokenPathForSlot(slot, tokenPaths) {
  const paletteToken = `color.palette.${slot}`;
  const brandToken = `color.brand.${slot}`;
  if (paletteToken in tokenPaths) return paletteToken;
  if (brandToken in tokenPaths) return brandToken;
  return null;
}

const resolved = resolveModes();
const failures = [];
let checked = 0;

UIKIT_PACKAGES.forEach((pkg) => {
  const cssPath = path.resolve(PACKAGE_DIR, '..', pkg, 'dist', 'civictheme.variables.css');
  const compiled = compiledColors(cssPath);
  MODES.forEach((mode) => {
    const slots = compiled[mode];
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
    Object.keys(resolved[mode]).forEach((tokenPath) => {
      if (!coveredTokens.has(tokenPath)) {
        failures.push(`${pkg}/${mode}: token "${tokenPath}" has no compiled counterpart`);
      }
    });
  });
});

if (failures.length) {
  console.error(`Token <-> compiled CSS validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`Token <-> compiled CSS validation passed: ${checked} slot comparisons across ${UIKIT_PACKAGES.join(', ')} × ${MODES.join('/')}; zero drift.`);
