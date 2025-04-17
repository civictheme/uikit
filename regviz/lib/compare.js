/**
 * Comparison module for RegViz.
 * 
 * Handles comparing screenshots using reg-cli.
 */

import { execSync } from 'child_process';
import { ensureDirectory } from './config.js';

/**
 * Compare two sets of screenshots using reg-cli.
 * 
 * @param {Object} options - The options.
 * @param {string} options.baselineDir - The baseline screenshots directory.
 * @param {string} options.targetDir - The target screenshots directory.
 * @param {string} options.outputDir - The output directory for comparison results.
 * @returns {Promise<void>}
 */
export async function compareScreenshots({
  baselineDir,
  targetDir,
  outputDir
}) {
  ensureDirectory(outputDir);

  try {
    console.log(`Comparing screenshots from ${baselineDir} to ${targetDir}`);
    console.log(`Results will be saved to ${outputDir}`);
    
    execSync(
      `npx reg-cli ${baselineDir} ${targetDir} ${outputDir} --report ${outputDir}/index.html --json ${outputDir}/reg.json`,
      { stdio: 'inherit' }
    );
    
    console.log('Comparison complete. Results available at:');
    console.log(`- HTML Report: ${outputDir}/index.html`);
    console.log(`- JSON Report: ${outputDir}/reg.json`);
    
    return true;
  } catch (error) {
    console.error('Error comparing screenshots:', error);
    return false;
  }
}