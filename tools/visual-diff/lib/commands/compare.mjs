/**
 * Compare command for Visual Diff.
 *
 * Handles comparing two sets of screenshots.
 */

import { loadScreenshotSets, addComparison, getScreenshotPath, ensureDirectory } from '../screenshot-set-manager.mjs';
import { compareScreenshots } from '../compare.mjs';
import { generateAndWriteIndexHtml } from '../server.mjs';

import {determineOptimalConcurrency} from "../utils.mjs";

/**
 * Generate a default name for a comparison.
 *
 * @param {string} sourceName - The source screenshot set name.
 * @param {string} targetName - The target screenshot set name.
 * @param {Object} config - Configuration object containing screenshot sets data.
 * @returns {string} The generated name.
 */
function generateComparisonName(sourceName, targetName, config) {
  // Get source and target data
  const sourceSet = config.screenshot_sets[sourceName];
  const targetSet = config.screenshot_sets[targetName];

  // Create a concise description for the name with a 'diff' prefix
  let name = 'diff';

  // Add source info with double-hyphen
  name += '--';

  if (sourceSet && sourceSet.source) {
    if (sourceSet.source === 'main') {
      name += 'main';
    } else if (sourceSet.source === 'release' && sourceSet.version) {
      name += `release-${sourceSet.version}`;
    } else if (sourceSet.source === 'current' && sourceSet.branch) {
      name += `branch-${sourceSet.branch.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
    } else {
      name += sourceName.split('--')[1] || sourceName; // Try to get source part from new format
    }
  } else {
    name += sourceName.split('--')[1] || sourceName; // Try to get source part from new format
  }

  name += '--vs--';

  if (targetSet && targetSet.source) {
    if (targetSet.source === 'main') {
      name += 'main';
    } else if (targetSet.source === 'release' && targetSet.version) {
      name += `release-${targetSet.version}`;
    } else if (targetSet.source === 'current' && targetSet.branch) {
      name += `branch-${targetSet.branch.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
    } else {
      name += targetName.split('--')[1] || targetName; // Try to get source part from new format
    }
  } else {
    name += targetName.split('--')[1] || targetName; // Try to get source part from new format
  }

  return name;
}

/**
 * Execute the compare command.
 *
 * @param {Object} options - The command options.
 * @param {string} options.source - The source screenshots set name.
 * @param {string} options.target - The target screenshots set name.
 * @param {string} options.name - The name for this comparison.
 * @returns {Promise<void>}
 */
export async function executeCompareCommand(options) {
  try {
    const config = loadScreenshotSets();
    const forceOverwrite = options.force || false;

    const sourceName = options.source;
    const targetName = options.target;

    if (!sourceName || !config.screenshot_sets[sourceName]) {
      throw new Error(`Source screenshot set "${sourceName}" not found. Use 'npm run visual-diff -- list --sets' to see available screenshot sets.`);
    }

    if (!targetName || !config.screenshot_sets[targetName]) {
      throw new Error(`Target screenshot set "${targetName}" not found. Use ''npm run visual-diff -- list --sets' to see available screenshot sets.`);
    }

    const name = options.name || generateComparisonName(sourceName, targetName, config);

    const comparisonExists = config.comparisons[name];

    if (comparisonExists && !forceOverwrite && !options.confirmedOverwrite) {
      console.warn(`Warning: A comparison named "${name}" already exists.`);
      console.warn(`To overwrite it, run the command again with --force or confirm when prompted.`);

      if (!options.interactive) {
        return {
          name,
          source: sourceName,
          target: targetName,
          exists: true,
          requiresConfirmation: true
        };
      }
    }

    const sourceDir = config.screenshot_sets[sourceName].directory;
    const targetDir = config.screenshot_sets[targetName].directory;
    const outputDir = getScreenshotPath(name);

    ensureDirectory(outputDir);

    console.log(`Comparing source "${sourceName}" to target "${targetName}"...`);
    console.log(`Output directory: ${outputDir}`);
    console.log(`Comparison name: ${name}`);

    if (comparisonExists) {
      console.log(`Note: Overwriting existing comparison "${name}".`);
    }

    await compareScreenshots({
      sourceDir,
      targetDir,
      outputDir
    });

    // Add to configuration
    addComparison(name, {
      source: sourceName,
      target: targetName,
      date: new Date().toISOString(),
      reportDirectory: outputDir,
      completed: true
    });

    console.log(`Comparison "${name}" has been created.`);
    console.log(`View the report at ${outputDir}/index.html`);

    // Generate the index.html file after comparison
    const indexPath = await generateAndWriteIndexHtml();
    console.log(`Main index.html updated at ${indexPath}`);

    return {
      name,
      source: sourceName,
      target: targetName,
      reportDirectory: outputDir,
      completed: true,
      exists: comparisonExists
    };
  } catch (error) {
    console.error('Error executing compare command:', error);
    throw error;
  }
}
