/**
 * Capture command for RegViz.
 *
 * Handles capturing screenshots from a specific source.
 */

import path from 'path';
import { createSnapshot } from '../sources/index.mjs';
import { getScreenshotPath, ensureDirectory } from '../screenshot-set-manager.mjs';
import { generateSetName, getBranchData } from "../utils.mjs";
import {getDirectoryForSource, isPackageAllowed, SOURCE_TYPES} from '../config.mjs';

/**
 * Execute the capture command.
 *
 * @param {Object} options - The command options.
 * @param {string} options.source - The source identifier (e.g. branch name, tag name).
 * @param {string} options.sourceType - The source type from SOURCE_TYPES.
 * @param {string} options.package - The package to capture (e.g. twig, sdc).
 * @param {string} options.force - Force overwrite if the comparison already exists.
 * @returns {Promise<void>}
 */
export async function executeCaptureCommand(options) {
  try {
    const source = options.source;
    const sourceType = options.sourceType;
    const packageName = options.package;
    const forceOverwrite = options.force || false;

    if (!source || !sourceType || !packageName) {
      throw new Error('Missing required parameters: sourceValue, sourceType, and package are required');
    }

    if (!isPackageAllowed(source, sourceType, packageName)) {
      throw new Error(`Package ${packageName} is not allowed for source ${source} of type ${sourceType}`);
    }

    // Get the directory from config
    const targetDir = getDirectoryForSource(source, sourceType, packageName);

    if (!targetDir) {
      throw new Error(`No directory configured for source ${source} with package ${packageName}`);
    }

    // Get branch information for current branch
    if (sourceType === SOURCE_TYPES.CURRENT_BRANCH && !options.branch) {
      options = {
        ...options,
        ...getBranchData(),
      }
    }

    const name = generateSetName(options);

    const outputDir = getScreenshotPath(name);

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

    ensureDirectory(outputDir);

    console.log(`Capturing screenshots from ${source} ${sourceType} for ${targetDir}...`);
    console.log(`Output directory: ${outputDir}`);
    console.log(`Screenshot set name: ${name}`);

    if (captureExists) {
      console.log(`Note: Overwriting existing screenshot set "${name}".`);
    }

    // Create the snapshot
    const snapshotData = await createSnapshot({
      ...options,
      outputDir,
      targetDir,
    });

    // Add to configuration using the new screenshot_sets concept
    const { addScreenshotSet } = await import('../screenshot-set-manager.mjs');
    addScreenshotSet(name, {
      ...snapshotData,
      directory: outputDir,
      sourceType,
      sourceValue: source,
      packageName,
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
