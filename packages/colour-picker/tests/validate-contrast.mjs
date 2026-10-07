/**
 * Contrast calibration gate. The maths must reproduce the recorded
 * fixtures (session-10/11, re-verified 2026-10-07): vs the dark
 * background-light #0d4458 — border #1a4e61 = 1.16:1, interaction-focus
 * #8b5cd7 = 2.32:1, error #e85653 = 2.97:1 — and the shipped targets.json
 * must flag EXACTLY those three failures on today's defaults, with every
 * light-theme check passing. A broken setup (wrong maths, drifted targets,
 * drifted token values) is detectable right here.
 */
import { contrastRatio, roundRatio, checkContrast } from '../engine/contrast.mjs';
import { resolveRecipe, loadTargets } from '../engine/resolve.mjs';

const failures = [];

// --- 1. The maths against known ratios.
const FIXTURES = [
  ['#1a4e61', '#0d4458', 1.16],
  ['#8b5cd7', '#0d4458', 2.32],
  ['#e85653', '#0d4458', 2.97],
  ['#000000', '#ffffff', 21],
  ['#ffffff', '#000000', 21],
  ['#767676', '#ffffff', 4.54],
];
FIXTURES.forEach(([a, b, expected]) => {
  const actual = roundRatio(contrastRatio(a, b));
  if (actual !== expected) failures.push(`ratio ${a} vs ${b}: got ${actual}, expected ${expected}`);
});

// --- 2. The shipped targets against today's defaults.
const EXPECTED_FAILURES = [
  'dark color.palette.border',
  'dark color.palette.interaction-focus',
  'dark color.palette.error',
];
const { resolved } = resolveRecipe({ version: 1 });
const rows = checkContrast(resolved, loadTargets());
const targetCount = Object.keys(loadTargets()).length;
if (rows.length !== targetCount * 2) {
  failures.push(`expected ${targetCount} targeted slots x 2 modes = ${targetCount * 2} rows, got ${rows.length}`);
}
const failing = rows.filter((row) => !row.pass).map((row) => `${row.mode} ${row.tokenPath}`);
if (JSON.stringify(failing.sort()) !== JSON.stringify([...EXPECTED_FAILURES].sort())) {
  failures.push(`known-failure set drifted: got [${failing.join(', ')}], expected [${EXPECTED_FAILURES.join(', ')}]`);
}
const border = rows.find((row) => row.mode === 'dark' && row.tokenPath === 'color.palette.border');
if (border?.ratio !== 1.16 || border?.target !== 3 || border?.againstValue !== '#0d4458') {
  failures.push(`dark border row drifted: ${JSON.stringify(border)}`);
}

if (failures.length) {
  console.error(`Contrast validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`Contrast validation passed: WCAG maths matches the recorded fixtures; ${targetCount} targeted slots x 2 modes report exactly the 3 known dark failures (border 1.16:1, focus 2.32:1, error 2.97:1) and a clean light theme.`);
