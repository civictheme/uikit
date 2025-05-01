/**
 * Compare command for Visual Diff.
 *
 * Handles comparing two sets of screenshots.
 */

import {
    loadScreenshotSets,
    addComparisonToConfiguration,
    getScreenshotPath,
    ensureDirectory
} from '../screenshot-set-manager.mjs';
import {compareScreenshots} from '../compare.mjs';
import {generateAndWriteIndexHtml} from '../server.mjs';

import {determineOptimalConcurrency, generateDiffName} from "../utils.mjs";

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
 * @param {string} sourceName - The source screenshots set name.
 * @param {string} targetName - The target screenshots set name.
 * @returns {Promise<void>}
 */
export async function executeCompareCommand(
    sourceName,
    targetName,
) {
    try {
        const config = loadScreenshotSets();
        // load required variables.
        // validate comparison
        const source = config.screenshot_sets[sourceName] || false;
        const target = config.screenshot_sets[targetName] || false;
        if (!source) {
            throw new Error(`Source screenshot set "${sourceName}" does not exist.`);
        }
        if (!target) {
            throw new Error(`Target screenshot set "${targetName}" does not exist.`);
        }
        const sourceScreenshotDirectory = source.directory;
        const targetScreenshotDirectory = target.directory;
        const name = generateDiffName(sourceName, targetName);
        const comparisonExists = config.comparisons[name];
        if (comparisonExists) {
            console.log(`Note: Overwriting existing comparison "${name}".`);
        }

        const outputDir = getScreenshotPath(name);
        ensureDirectory(outputDir);

        console.log(`Comparing source "${sourceName}" to target "${targetName}"...`);
        console.log(`Output directory: ${outputDir}`);
        console.log(`Comparison name: ${name}`);
        await compareScreenshots(
            sourceScreenshotDirectory,
            targetScreenshotDirectory,
            outputDir
        );

        // Add to configuration
        addComparisonToConfiguration(name, {
            source: sourceName,
            target: targetName,
            date: new Date().toISOString(),
            reportDirectory: outputDir,
            completed: true
        });

        console.log(`Comparison "${name}" has been created.`);
        console.log(`View the report at ${outputDir}/index.html`);

        // Generate the index.html file after comparison
        await generateAndWriteIndexHtml();
    } catch (error) {
        console.error('Error executing compare command:', error);
        throw error;
    }
}
