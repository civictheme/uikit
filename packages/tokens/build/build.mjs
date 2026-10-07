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
 *
 * The emit functions live in emit.mjs, importable by sibling packages.
 */
import fs from 'fs';
import path from 'path';
import { MODES, PACKAGE_DIR, loadTokens, resolveModes } from './lib.mjs';
import { CSS_BANNER, figmaDoc, cssForMode, nameMapFor } from './emit.mjs';

const DIST = path.join(PACKAGE_DIR, 'dist');

const tree = loadTokens();
const resolved = resolveModes();

fs.mkdirSync(path.join(DIST, 'figma'), { recursive: true });
for (const mode of MODES) {
  fs.writeFileSync(path.join(DIST, 'figma', `${mode}.tokens.json`), `${JSON.stringify(figmaDoc(tree, mode), null, 2)}\n`);
  fs.writeFileSync(path.join(DIST, `resolved.${mode}.json`), `${JSON.stringify(resolved[mode], null, 2)}\n`);
}

fs.mkdirSync(path.join(DIST, 'css'), { recursive: true });
fs.writeFileSync(path.join(DIST, 'css', 'variables.css'), `${CSS_BANNER}${cssForMode(tree, resolved, 'light')}\n${cssForMode(tree, resolved, 'dark')}`);

fs.writeFileSync(path.join(DIST, 'figma', 'name-map.json'), `${JSON.stringify(nameMapFor(tree), null, 2)}\n`);

console.log(`Built ${Object.keys(resolved.light).length} tokens × ${MODES.length} modes -> ${path.relative(process.cwd(), DIST)}`);
