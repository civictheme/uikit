/**
 * Source handlers for RegViz.
 * 
 * Handles creating snapshots from different sources.
 */

import { createMainSnapshot } from './main.js';
import { createCurrentSnapshot } from './current.js';
import { createReleaseSnapshot } from './release.js';

/**
 * Create a snapshot from a source.
 * 
 * @param {Object} options - The options.
 * @param {string} options.source - The source (main, current, release).
 * @param {string} options.outputDir - The output directory for screenshots.
 * @param {string} options.targetDir - The target directory to capture (components or components-sdc).
 * @param {string} [options.version] - The specific version to use for release source.
 * @returns {Promise<Object>} The snapshot data.
 */
export async function createSnapshot(options) {
  const { source } = options;
  
  switch (source) {
    case 'main':
      return createMainSnapshot(options);
    case 'current':
      return createCurrentSnapshot(options);
    case 'release':
      return createReleaseSnapshot(options);
    default:
      throw new Error(`Unknown source: ${source}`);
  }
}