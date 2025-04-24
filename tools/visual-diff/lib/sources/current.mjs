/**
 * Current branch source handler for Visual Diff.
 *
 * Handles creating a snapshot from the current branch.
 */

import { execSync } from 'child_process';
import path from 'path';
import { ensureDirectory } from '../config.mjs';
import { captureScreenshots } from '../screenshot.mjs';

/**
 * Create a snapshot from the current branch.
 *
 * @param {Object} options - The options.
 * @param {string} options.outputDir - The output directory for screenshots.
 * @param {string} options.targetDir - The target directory to capture (components or components-sdc).
 * @returns {Promise<Object>} The snapshot data.
 */
export async function createCurrentSnapshot({
  outputDir,
  targetDir = 'components'
}) {
  ensureDirectory(outputDir);

  try {
    console.log('Building Storybook...');
    if (targetDir === 'components-sdc') {
      execSync('npm --prefix components-sdc run build-storybook', {
        stdio: 'inherit'
      });
    } else {
      execSync('npm run build-storybook', {
        stdio: 'inherit'
      });
    }

    // Get the current commit hash.
    const commitHash = execSync('git rev-parse HEAD').toString().trim();

    // Define Storybook directory based on target.
    const storybookDir = targetDir === 'components-sdc'
      ? path.join(process.cwd(), 'components-sdc/storybook-static')
      : path.join(process.cwd(), 'storybook-static');

    console.log(`Capturing screenshots from ${targetDir} in current branch...`);
    await captureScreenshots({
      storybookDir,
      outputDir,
      port: 6010
    });

    const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

    return {
      type: 'current',
      date: new Date().toISOString(),
      directory: outputDir,
      commit: commitHash,
      branch: branchName,
      targetDir
    };
  } catch (error) {
    console.error('Error creating current snapshot:', error);
    throw error;
  }
}
