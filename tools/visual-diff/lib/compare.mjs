/**
 * Comparison module for Visual Diff.
 *
 * Handles comparing screenshots using reg-cli.
 */

import { execSync } from 'child_process';
import { ensureDirectory } from './screenshot-set-manager.mjs';

import { determineOptimalConcurrency } from './utils.mjs';

/**
 * Compare two sets of screenshots using reg-cli.
 *
 * @param {string} sourceDir - Source screenshots directory.
 * @param {string} targetDir - Target screenshots directory.
 * @param {string} outputDir - Output directory for comparison results.
 * @returns {Promise<void>}
 */
export async function compareScreenshots(
  sourceDir,
  targetDir,
  outputDir,
) {
  ensureDirectory(outputDir);

  try {
    console.log(`Comparing screenshots from ${sourceDir} to ${targetDir}`);
    console.log(`Results will be saved to ${outputDir}`);
    const concurrency = determineOptimalConcurrency();
    execSync(
      `npx reg-cli ${sourceDir} ${targetDir} ${outputDir} --additionalDetection client --concurrency ${concurrency} --report ${outputDir}/index.html --json ${outputDir}/reg.json`,
      { stdio: 'inherit' },
    );

    console.log('Comparison complete. Results available at:');
    console.log(`- HTML Report: ${outputDir}/index.html`);
    console.log(`- JSON Report: ${outputDir}/reg.json`);
  } catch (error) {
    // ignore error.
  }
}
