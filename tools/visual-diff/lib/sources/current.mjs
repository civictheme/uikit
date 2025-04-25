/**
 * Current branch source handler for Visual Diff.
 *
 * Handles creating a snapshot from the current branch.
 */

import { execSync } from 'child_process';
import { ensureDirectory } from '../screenshot-set-manager.mjs';
import { captureScreenshots } from '../screenshot.mjs';
import {buildStoryBook, captureScreenshotsForSource, installDependencies} from "./utils.mjs";

/**
 * Create a snapshot from the current branch.
 *
 * @param {Object} options - The options.
 * @param {string} options.source - The source identifier (e.g. branch name, tag name).
 * @param {string} options.sourceType - The source type from SOURCE_TYPES.
 * @param {string} options.package - The package to capture (e.g. twig, sdc).
 * @param {string} options.force - Force overwrite if the comparison already exists.
 * @param {string} options.outputDir - The output directory for screenshots.
 * @param {string} options.targetDir - The target directory to capture.
 * @returns {Promise<Object>} The snapshot data.
 */
export async function createCurrentSnapshot({
  source,
  sourceType,
  outputDir,
  package: packageName,
  targetDir = 'components'
}) {
  ensureDirectory(outputDir);

  try {
    installDependencies()
    buildStoryBook();
    await captureScreenshotsForSource(process.cwd(), source, sourceType, packageName, outputDir);

    const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

    return {
      source,
      sourceType,
      package: packageName,
      date: new Date().toISOString(),
      directory: outputDir,
      commit: execSync('git rev-parse HEAD').toString().trim(),
      branch: branchName,
      targetDir
    };
  } catch (error) {
    console.error('Error creating current snapshot:', error);
    throw error;
  }
}
