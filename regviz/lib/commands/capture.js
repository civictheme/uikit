/**
 * Capture command for RegViz.
 *
 * Handles capturing screenshots from a specific source.
 */

import path from 'path';
import { createSnapshot } from '../sources/index.js';
import { getDataPath, ensureDirectory } from '../config.js';

/**
 * Generate a default name for a capture set.
 *
 * @param {string} source - The source (main, current, release).
 * @param {string} targetDir - The target directory (components or components-sdc).
 * @param {Object} options - Additional options for name generation.
 * @returns {string} The generated name.
 */
function generateCaptureName(source, targetDir, options = {}) {
  let name = 'set';
  
  // Add double-hyphen and source type
  name += `--${source}`;

  // Add specific details based on source
  if (source === 'release' && options.version) {
    name += `-${options.version}`;
  } else if (source === 'current' && options.branch) {
    // Sanitize branch name for safe filenames
    const safeBranch = options.branch.replace(/[^a-zA-Z0-9-_]/g, '-');
    name += `-${safeBranch}`;
  }

  // Add target directory type with double-hyphen
  const targetName = targetDir === 'components-sdc' ? 'sdc' : 'components';
  name += `--${targetName}`;

  return name;
}

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
    let additionalInfo = {};
    if (source === 'current') {
      try {
        const { execSync } = await import('child_process');
        const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        additionalInfo.branch = branch;
      } catch (error) {
        console.warn('Unable to get branch information:', error.message);
      }
    }

    // Generate name using naming function
    const name = options.name || generateCaptureName(source, targetDir, {
      ...additionalInfo,
      version: options.version
    });

    // No longer need to determine the role for backward compatibility

    // Get the output directory
    const outputDir = getDataPath('set', name);

    // Load configuration to check for existing captures
    const config = await import('../config.js').then(module => module.loadConfig());

    // Check if this capture already exists
    const captureExists = config.screenshot_sets[name];

    // If the capture exists and we're not forcing overwrite, handle appropriately
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
    console.log(`Capture name: ${name}`);

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
    const { addScreenshotSet } = await import('../config.js');
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
