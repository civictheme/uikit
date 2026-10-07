/**
 * WCAG 2.x contrast — the plugin's own implementation (recorded decision:
 * checking colours needs no dependency; Leonardo arrives at P5 for palette
 * GENERATION only). Calibration contract, verified by
 * tests/validate-contrast.mjs against the recorded known failures: vs the
 * dark background-light #0d4458 — border #1a4e61 = 1.16:1, interaction-focus
 * #8b5cd7 = 2.32:1, error #e85653 = 2.97:1; all light-theme checks pass.
 */

/** WCAG 2.x relative luminance of a #rrggbb colour. */
export function relativeLuminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two #rrggbb colours (order-independent). */
export function contrastRatio(hexA, hexB) {
  const [lighter, darker] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Ratio rounded to 2 dp — the display and report convention. */
export function roundRatio(ratio) {
  return Math.round(ratio * 100) / 100;
}

/**
 * Contrast QA over resolved token values (`{ mode: { tokenPath: hex } }`,
 * the resolveModes shape): every targeted token is measured against its
 * `against` token in the same mode. Failures WARN, never block (recorded
 * decision) — this returns rows, it does not throw on a miss; it throws only
 * when the targets name a token the resolved set does not have (config
 * drift). A transparent value cannot be measured and reports ratio null,
 * pass false.
 */
export function checkContrast(resolved, targets) {
  const rows = [];
  Object.keys(resolved).forEach((mode) => {
    Object.entries(targets).forEach(([tokenPath, { target, against }]) => {
      const value = resolved[mode][tokenPath];
      const againstValue = resolved[mode][against];
      if (value === undefined) throw new Error(`Contrast target names unknown token "${tokenPath}"`);
      if (againstValue === undefined) throw new Error(`Contrast target for "${tokenPath}" measures against unknown token "${against}"`);
      const measurable = value !== 'transparent' && againstValue !== 'transparent';
      const ratio = measurable ? roundRatio(contrastRatio(value, againstValue)) : null;
      rows.push({ mode, tokenPath, value, against, againstValue, ratio, target, pass: measurable && ratio >= target });
    });
  });
  return rows;
}
