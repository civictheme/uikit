/**
 * Clean command for RegViz.
 * 
 * Handles removing baselines, targets, or comparisons.
 */

import fs from 'fs';
import { 
  loadConfig, 
  saveConfig, 
  removeBaseline, 
  removeTarget, 
  removeComparison 
} from '../config.js';

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
    const config = loadConfig();
    
    // For backward compatibility
    const setToRemove = options.set || options.baseline || options.target;
    
    if (options.all) {
      // Remove all data
      console.log('Removing all RegViz data...');
      
      // Remove all screenshot sets
      Object.entries(config.screenshot_sets || {}).forEach(([name, set]) => {
        if (set.directory && fs.existsSync(set.directory)) {
          fs.rmSync(set.directory, { recursive: true, force: true });
          console.log(`Removed screenshot set directory: ${set.directory}`);
        }
      });
      
      // Remove all comparisons
      Object.entries(config.comparisons || {}).forEach(([name, comparison]) => {
        if (comparison.reportDirectory && fs.existsSync(comparison.reportDirectory)) {
          fs.rmSync(comparison.reportDirectory, { recursive: true, force: true });
          console.log(`Removed comparison directory: ${comparison.reportDirectory}`);
        }
      });
      
      // Reset the configuration
      saveConfig({
        screenshot_sets: {},
        comparisons: {}
      });
      
      console.log('All RegViz data has been removed.');
      return true;
    }
    
    if (setToRemove) {
      // Remove a specific screenshot set
      const { removeScreenshotSet } = await import('../config.js');
      
      if (!config.screenshot_sets || !config.screenshot_sets[setToRemove]) {
        throw new Error(`Screenshot set "${setToRemove}" not found.`);
      }
      
      const set = config.screenshot_sets[setToRemove];
      if (set.directory && fs.existsSync(set.directory)) {
        fs.rmSync(set.directory, { recursive: true, force: true });
        console.log(`Removed screenshot set directory: ${set.directory}`);
      }
      
      removeScreenshotSet(setToRemove);
      console.log(`Screenshot set "${setToRemove}" has been removed.`);
    }
    
    if (options.comparison) {
      // Remove a specific comparison
      if (!config.comparisons || !config.comparisons[options.comparison]) {
        throw new Error(`Comparison "${options.comparison}" not found.`);
      }
      
      const comparison = config.comparisons[options.comparison];
      if (comparison.reportDirectory && fs.existsSync(comparison.reportDirectory)) {
        fs.rmSync(comparison.reportDirectory, { recursive: true, force: true });
        console.log(`Removed comparison directory: ${comparison.reportDirectory}`);
      }
      
      removeComparison(options.comparison);
      console.log(`Comparison "${options.comparison}" has been removed.`);
    }
    
    return true;
  } catch (error) {
    console.error('Error executing clean command:', error);
    throw error;
  }
}