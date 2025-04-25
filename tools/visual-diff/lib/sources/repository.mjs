/**
 * Branch and tag source handler for Visual Diff.
 *
 * Handles creating a snapshot from a branch or tag.
 */

import fs from 'fs';
import path from 'path';
import { ensureDirectory } from '../screenshot-set-manager.mjs';
import {
  buildStoryBook,
  captureScreenshotsForSource,
  cloneRepository,
  installDependencies,
  getCommitHash
} from "./utils.mjs";

/**
 * Create a snapshot from a release or branch.
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
export async function createRepositorySnapshot({
  source,
  outputDir,
  targetDir,
  sourceType,
  package: packageName,
}) {
  ensureDirectory(outputDir);


  const cwd = path.join(process.cwd(), `.tmp/${sourceType}`);

  try {
    if (fs.existsSync(cwd)) {
      fs.rmSync(cwd, { recursive: true, force: true });
    }

    cloneRepository(cwd, source)
    installDependencies(cwd);
    buildStoryBook(cwd)
    await captureScreenshotsForSource(cwd, source, sourceType, packageName, outputDir);

    // @todo update screenshot data structure.
    return {
      source,
      sourceType,
      package: packageName,
      date: new Date().toISOString(),
      directory: outputDir,
      reference: getCommitHash(cwd),
      targetDir
    };
  } catch (error) {
    console.error('Error creating snapshot:', error);
    throw error;
  } finally {
    if (fs.existsSync(cwd)) {
      fs.rmSync(cwd, { recursive: true, force: true });
    }
  }
}
