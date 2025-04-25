/**
 * Source handlers for Visual Diff.
 *
 * Handles creating snapshots from different sources.
 */

import { createRepositorySnapshot } from './repository.mjs';
import { createCurrentSnapshot } from './current.mjs';
import {SOURCE_TYPES} from "../config.mjs";

/**
 * Create a snapshot from a source.
 *
 * @param {Object} options - The command options.
 * @param {string} options.source - The source identifier (e.g. branch name, tag name).
 * @param {string} options.sourceType - The source type from SOURCE_TYPES.
 * @param {string} options.package - The package to capture (e.g. twig, sdc).
 * @param {string} options.force - Force overwrite if the comparison already exists.
 * @param {string} options.outputDir - The output directory for screenshots.
 * @param {string} options.targetDir - The target directory to capture.
 * @returns {Promise<Object>} The snapshot data.
 */
export async function createSnapshot(options) {
  const { source, sourceType } = options;

  switch (sourceType) {
    case SOURCE_TYPES.TAG:
    case SOURCE_TYPES.BRANCH:
      return createRepositorySnapshot(options);
    case SOURCE_TYPES.CURRENT_BRANCH:
      return createCurrentSnapshot(options);
    default:
      throw new Error(`Unknown source type: ${source}`);
  }
}
