/**
 * Capture command for RegViz.
 *
 * Handles capturing screenshots from a specific source.
 */

import path from 'path';
import { createSnapshot } from '../sources/index.mjs';
import { getDataPath, ensureDirectory } from '../screenshot-set-manager.mjs';
import { generateSetName, getBranchData } from "../utils.mjs";

/**
 * Execute the capture command.
 *
 * @param {Object} options - The command options.
 * @param {string} options.source - The source (main, current, release).
 * @param {string} options.target - The target directory (components or components-sdc).
 * @param {string} options.name - The name for this capture set.
 * @returns {Promise<void>}
 */
export async function executeCaptureCommand(options) {
  try {
    const source = options.source || 'current';
    const targetDir = options.target || 'components';
    const forceOverwrite = options.force || false;

    // Get branch information for current source
    if (source === 'current' && !options.branch) {
      options = {
        ...options,
        ...getBranchData(),
      }
    }

    const name = options.name || generateSetName(options);

    const outputDir = getDataPath(name);

    // Load configuration to check for existing captures.
    const config = await import('../screenshot-set-manager.mjs').then(module => module.loadScreenshotSets());
    const captureExists = config.screenshot_sets[name];

    // If the capture exists and we're not forcing overwrite, handle appropriately.
    if (captureExists && !forceOverwrite && !options.confirmedOverwrite) {
      console.warn(`Warning: A screenshot set named "${name}" already exists.`);
      console.warn(`To overwrite it, run the command again with --force or confirm when prompted.`);

      // If in interactive mode, the calling function should handle the confirmation
      if (!options.interactive) {
        return {
          name,
          exists: true,
          outputDir,
          requiresConfirmation: true
        };
      }
    }

    // Proceed with the capture if the user confirmed, forced overwrite, or it's a new capture
    ensureDirectory(outputDir);

    console.log(`Capturing screenshots from ${source} source for ${targetDir}...`);
    console.log(`Output directory: ${outputDir}`);
    console.log(`Screenshot set name: ${name}`);

    if (captureExists) {
      console.log(`Note: Overwriting existing screenshot set "${name}".`);
    }

    // Create the snapshot
    const snapshotData = await createSnapshot({
      source,
      outputDir,
      targetDir,
      version: options.version
    });

    // Add to configuration using the new screenshot_sets concept
    const { addScreenshotSet } = await import('../screenshot-set-manager.mjs');
    addScreenshotSet(name, {
      ...snapshotData,
      directory: outputDir,
      source,
      captureDirectory: targetDir
    });

    console.log(`Screenshot set "${name}" has been created.`);

    return {
      name,
      exists: captureExists,
      ...snapshotData
    };
  } catch (error) {
    console.error('Error executing capture command:', error);
    throw error;
  }
}
