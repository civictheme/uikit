/**
 * Clean command for RegViz.
 *
 * Handles removing baselines, targets, or comparisons.
 */

import fs from 'fs';
import {
    loadScreenshotSets,
    saveScreenshotSets,
    removeComparison, removeScreenshotSetFromConfig, getScreenshotPath, ensureDirectory
} from '../screenshot-set-manager.mjs';

/**
 * Execute the clean command.
 *
 * @param {Object} options - The command options.
 * @param {string} options.set - The screenshot set to remove.
 * @param {string} options.comparison - The comparison to remove.
 * @param {boolean} options.all - Whether to remove all data.
 * @returns {Promise<void>}
 */
export async function executeCleanCommand(options) {
    try {
        const config = loadScreenshotSets();

        const setToRemove = options.set;
        const comparisonToRemove = options.comparison;

        if (!setToRemove && !comparisonToRemove && !options.all) {
            console.error('Please specify a screenshot set or comparison to remove.');
            return;
        }
        if (options.all) {
            console.log('Removing all Visual Diff data...');
            const screenshotPath = getScreenshotPath('');
            console.log(`Removing screenshot directory: ${screenshotPath}`);
            fs.rmSync(screenshotPath, {recursive: true, force: true});
            ensureDirectory(screenshotPath);
            saveScreenshotSets({
                screenshot_sets: {},
                comparisons: {}
            });

            console.log('All Visual Diff data has been removed.');
            return true;
        }

        if (setToRemove) {
            const {removeScreenshotSetFromConfig} = await import('../screenshot-set-manager.mjs');

            if (!config.screenshot_sets || !config.screenshot_sets[setToRemove]) {
                console.error(`Screenshot set "${setToRemove}" not found.`);
                return;
            }

            const set = config.screenshot_sets[setToRemove];
            if (set.directory && fs.existsSync(set.directory)) {
                fs.rmSync(set.directory, {recursive: true, force: true});
                console.log(`Removed screenshot set directory: ${set.directory}`);
            }

            removeScreenshotSetFromConfig(setToRemove);
            console.log(`Screenshot set "${setToRemove}" has been removed.`);
        }

        if (comparisonToRemove) {
            if (!config.comparisons || !config.comparisons[comparisonToRemove]) {
                console.error(`Comparison "${comparisonToRemove}" not found.`);
                return;
            }

            const comparison = config.comparisons[comparisonToRemove];
            if (comparison.reportDirectory && fs.existsSync(comparison.reportDirectory)) {
                fs.rmSync(comparison.reportDirectory, {recursive: true, force: true});
                console.log(`Removed comparison directory: ${comparison.reportDirectory}`);
            }

            removeComparison(comparisonToRemove);
            console.log(`Comparison "${comparisonToRemove}" has been removed.`);
        }

        return true;
    } catch (error) {
        console.error('Error executing clean command:', error);
        throw error;
    }
}
