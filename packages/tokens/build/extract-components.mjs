/**
 * Generates tokens/color.components.json from the 1.x component variables
 * (plan §5 Phase 2).
 *
 * Structure source:
 * packages/sdc/components/00-base/_variables.components.scss
 *   - `ct-color-light|dark('slot')`  -> alias into the palette tier
 *   - `$ct-other-variable`           -> alias into another component token
 *   - `ct-color-tint|shade(...)`     -> literal (derivation runs at
 *                                       generation time; the Sass colour
 *                                       functions leave 2.x)
 *   - `transparent`                  -> literal, alpha 0
 *   - `false` / `inherit`            -> no token (recorded on the group's
 *                                       io.civictheme.skipped extension)
 * Source of values: packages/sdc/dist/civictheme.variables.css (the compiled
 * 1.x custom properties — the same ground truth the Phase 1 palette capture
 * used), which also verifies every alias resolves to the identical value.
 *
 * Naming: `$ct-<component>-<light|dark>-<rest>` collapses to the mode-less
 * token `color.component.<component>.<rest>`; theme becomes the mode (§3.1).
 * Unthemed 1.x variables (back-to-top: one variable serving both themes with
 * light values) keep their light alias and pin the dark mode to the same
 * resolved literal, so 2.x renders them identically inside dark scopes.
 * Every token records its 1.x source variable names under the
 * io.civictheme.scss extension — the bridge for the Phase 2b refactor, the
 * validation test, and migration tooling.
 *
 * The script is deterministic and idempotent: re-running it against unchanged
 * SCSS reproduces the file byte-for-byte. It verifies the full token graph
 * against the compiled CSS before writing, and refuses to write on any
 * mismatch.
 */
import fs from 'fs';
import path from 'path';
import { MODES, MODES_EXTENSION, PACKAGE_DIR, loadTokens, treeForMode, flattenTree, resolveModes, parseCssVars, resolveCssVar } from './lib.mjs';

const SCSS_PATH = path.resolve(PACKAGE_DIR, '..', 'sdc', 'components', '00-base', '_variables.components.scss');
const CSS_PATH = path.resolve(PACKAGE_DIR, '..', 'sdc', 'dist', 'civictheme.variables.css');
const OUT_PATH = path.join(PACKAGE_DIR, 'tokens', 'color.components.json');
const SCSS_EXTENSION = 'io.civictheme.scss';
const SKIPPED_EXTENSION = 'io.civictheme.skipped';

// 1.x components whose colour variables carry no light|dark theme segment
// (a single variable serves both themes with light-palette values).
const UNTHEMED_COMPONENTS = ['back-to-top'];

/** Six-decimal sRGB components, matching the palette capture's precision. */
function colorObject(hex) {
  const components = [1, 3, 5].map((i) => Math.round((parseInt(hex.slice(i, i + 2), 16) / 255) * 1e6) / 1e6);
  return { colorSpace: 'srgb', components, alpha: 1, hex };
}

const TRANSPARENT = { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0, hex: '#000000' };

function classify(expr) {
  let match = expr.match(/^ct-color-(light|dark)\('([a-z0-9-]+)'\)$/);
  if (match) return { kind: 'palette', mode: match[1], slot: match[2] };
  match = expr.match(/^\$(ct-[a-z0-9-]+)$/);
  if (match) return { kind: 'var', target: match[1] };
  match = expr.match(/^ct-color-(tint|shade)\(ct-color-constant-(light|dark)\('([a-z0-9-]+)'\),\s*(\d+)\)$/);
  if (match) return { kind: 'derived', fn: match[1], mode: match[2], slot: match[3], amount: match[4] };
  if (expr === 'transparent') return { kind: 'transparent' };
  if (expr === 'false') return { kind: 'false' };
  if (expr === 'inherit') return { kind: 'inherit' };
  throw new Error(`Unrecognised colour expression: ${expr}`);
}

/** `$ct-...` variable name -> { component, theme|null, rest }. */
function splitName(name) {
  let match = name.match(/^ct-outline-(light|dark)$/);
  if (match) return { component: 'outline', theme: match[1], rest: 'color' };
  match = name.match(/^ct-(.+?)-(light|dark)-(.+)$/);
  if (match) return { component: match[1], theme: match[2], rest: match[3] };
  const unthemed = UNTHEMED_COMPONENTS.find((c) => name.startsWith(`ct-${c}-`));
  if (unthemed) return { component: unthemed, theme: null, rest: name.slice(`ct-${unthemed}-`.length) };
  throw new Error(`Cannot derive component/theme from "$${name}" — if it is a new unthemed component, add it to UNTHEMED_COMPONENTS`);
}

// ---------------------------------------------------------------------------
// Parse the SCSS into per-token records.
// ---------------------------------------------------------------------------

const scss = fs.readFileSync(SCSS_PATH, 'utf-8');
const cssVars = parseCssVars(fs.readFileSync(CSS_PATH, 'utf-8'));

const colourVars = new Map();
for (const match of scss.matchAll(/^\$(ct-[a-z0-9-]+):\s*(.+?)\s*!default;/gm)) {
  const [, name, expr] = match;
  if (!(name.endsWith('-color') || /^ct-outline-(light|dark)$/.test(name))) continue;
  if (colourVars.has(name)) {
    // Sass !default: the first declaration wins.
    if (colourVars.get(name) !== expr) throw new Error(`"$${name}" declared twice with different values`);
    continue;
  }
  colourVars.set(name, expr);
}

const records = new Map();
for (const [name, expr] of colourVars) {
  const { component, theme, rest } = splitName(name);
  const key = `${component}.${rest}`;
  if (!records.has(key)) records.set(key, { component, rest, unthemed: theme === null, modes: {}, src: {} });
  const record = records.get(key);
  const mode = theme ?? 'light';
  if (record.modes[mode]) throw new Error(`Duplicate ${mode} source for token ${key}`);
  record.modes[mode] = classify(expr);
  record.src[theme === null ? 'unthemed' : mode] = `$${name}`;
}

// ---------------------------------------------------------------------------
// Build the DTCG tree.
// ---------------------------------------------------------------------------

const paletteTree = loadTokens(['color.components.json']);
const paletteSlots = new Set(Object.keys(paletteTree.color.palette).filter((k) => !k.startsWith('$')));

const skipped = {};
const stats = { tokens: 0, paletteAliases: 0, componentAliases: 0, derived: 0, transparent: 0, pinned: 0, skipped: 0 };

function compiledLiteral(srcVar) {
  return resolveCssVar(cssVars, `--${srcVar.slice(1)}`);
}

function literalValue(hexOrKeyword) {
  if (hexOrKeyword === 'transparent') return TRANSPARENT;
  if (!/^#[0-9a-f]{6}$/.test(hexOrKeyword)) throw new Error(`Expected a 6-digit hex, got "${hexOrKeyword}"`);
  return colorObject(hexOrKeyword);
}

/** The token-mode value for one classified 1.x expression. */
function modeValue(record, mode, cls, notes) {
  const srcVar = record.src[record.unthemed ? 'unthemed' : mode];
  if (cls.kind === 'palette') {
    if (!paletteSlots.has(cls.slot)) throw new Error(`${srcVar}: unknown palette slot "${cls.slot}"`);
    if (!record.unthemed && cls.mode !== mode) {
      notes.push(`1.x ${mode} value crossed themes (${srcVar}: ct-color-${cls.mode}('${cls.slot}')); captured as a literal.`);
      return literalValue(compiledLiteral(srcVar));
    }
    stats.paletteAliases += 1;
    return `{color.palette.${cls.slot}}`;
  }
  if (cls.kind === 'var') {
    const target = splitName(cls.target);
    const targetKey = `${target.component}.${target.rest}`;
    const targetRecord = records.get(targetKey);
    if (!targetRecord) throw new Error(`${srcVar}: aliases "$${cls.target}", which is not a colour variable`);
    const targetMode = target.theme ?? 'light';
    if (targetMode !== mode) {
      notes.push(`1.x ${mode} value crossed themes (${srcVar}: $${cls.target}); captured as a literal.`);
      return literalValue(compiledLiteral(srcVar));
    }
    const targetCls = targetRecord.modes[targetMode];
    if (targetCls.kind === 'false' || targetCls.kind === 'inherit') {
      throw new Error(`${srcVar}: aliases "$${cls.target}", which produces no token (${targetCls.kind})`);
    }
    stats.componentAliases += 1;
    return `{color.component.${target.component}.${target.rest}}`;
  }
  if (cls.kind === 'derived') {
    notes.push(`${mode}: derived in 1.x as ct-color-${cls.fn}(ct-color-constant-${cls.mode}('${cls.slot}'), ${cls.amount}); captured as a literal (derivation moves to the generator, plan §4.4).`);
    stats.derived += 1;
    return literalValue(compiledLiteral(srcVar));
  }
  if (cls.kind === 'transparent') {
    stats.transparent += 1;
    return { ...TRANSPARENT };
  }
  throw new Error(`${srcVar}: unexpected ${cls.kind} value`);
}

const componentGroups = {};
const problems = [];

for (const [key, record] of records) {
  const kinds = Object.values(record.modes).map((cls) => cls.kind);
  if (kinds.every((kind) => kind === 'false' || kind === 'inherit')) {
    Object.values(record.src).forEach((srcVar) => { skipped[srcVar] = record.modes.light.kind; });
    stats.skipped += 1;
    continue;
  }
  if (kinds.some((kind) => kind === 'false' || kind === 'inherit')) {
    problems.push(`${key}: one theme is ${kinds.find((k) => k === 'false' || k === 'inherit')} but the other is not — needs a decision`);
    continue;
  }
  if (!record.unthemed && MODES.some((mode) => !record.modes[mode])) {
    problems.push(`${key}: missing ${MODES.filter((mode) => !record.modes[mode]).join('/')} theme counterpart`);
    continue;
  }

  const notes = [];
  const light = modeValue(record, 'light', record.modes.light, notes);
  let dark;
  if (record.unthemed) {
    dark = literalValue(compiledLiteral(record.src.unthemed));
    notes.push('Unthemed in 1.x (one variable, light values, for both themes): dark mode pinned to the light literal.');
    stats.pinned += 1;
  } else {
    dark = modeValue(record, 'dark', record.modes.dark, notes);
  }

  const token = { $value: light };
  if (JSON.stringify(light) !== JSON.stringify(dark)) {
    token.$extensions = { [MODES_EXTENSION]: { dark } };
  }
  if (notes.length) token.$description = notes.join(' ');
  token.$extensions = { ...token.$extensions, [SCSS_EXTENSION]: record.src };

  componentGroups[record.component] = componentGroups[record.component] || {};
  componentGroups[record.component][record.rest] = token;
  stats.tokens += 1;
}

if (problems.length) {
  console.error(`Extraction FAILED (${problems.length} problems):`);
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}

const componentsTree = {
  color: {
    component: {
      $type: 'color',
      $description: 'Component colour tokens: aliases into the palette tier (plus captured literals where 1.x derived or hardcoded values). Generated from packages/sdc/components/00-base/_variables.components.scss by build/extract-components.mjs; each token records its 1.x source variables under the io.civictheme.scss extension. Not emitted to Figma (plan §3.1 — palette variables only unless designers ask).',
      $extensions: { [SKIPPED_EXTENSION]: skipped },
      ...componentGroups,
    },
  },
};

// ---------------------------------------------------------------------------
// Verify the whole graph resolves to the compiled 1.x values, then write.
// ---------------------------------------------------------------------------

const mergedTree = structuredClone(paletteTree);
mergedTree.color.component = componentsTree.color.component;
const resolved = resolveModes(mergedTree);
const flatLight = flattenTree(treeForMode(mergedTree, 'light'));
let verified = 0;

Object.keys(flatLight).filter((p) => p.startsWith('color.component.')).forEach((tokenPath) => {
  const src = flatLight[tokenPath].$extensions[SCSS_EXTENSION];
  MODES.forEach((mode) => {
    const expected = compiledLiteral(src[mode] ?? src.unthemed);
    const actual = resolved[mode][tokenPath];
    verified += 1;
    if (expected !== actual) {
      problems.push(`${tokenPath} (${mode}): token resolves to ${actual} but 1.x compiled to ${expected}`);
    }
  });
});

if (problems.length) {
  console.error(`Verification FAILED (${problems.length} mismatches) — not writing:`);
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}

fs.writeFileSync(OUT_PATH, `${JSON.stringify(componentsTree, null, 2)}\n`);
console.log(`Wrote ${path.relative(process.cwd(), OUT_PATH)}: ${stats.tokens} tokens `
  + `(${stats.paletteAliases} palette aliases, ${stats.componentAliases} component aliases, `
  + `${stats.derived} derived literals, ${stats.transparent} transparent, ${stats.pinned} dark-pinned unthemed); `
  + `${stats.skipped} skipped (false/inherit); ${verified} values verified against compiled 1.x CSS.`);
