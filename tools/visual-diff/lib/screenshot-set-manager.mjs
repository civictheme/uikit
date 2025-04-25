/**
 * Screenshot set management for Visual Diff.
 *
 * Handles loading, saving, and initialization of screenshot set data.
 */

import fs from 'fs';
import path from 'path';

// Configuration file path.
const CONFIG_DIR = path.join(process.cwd(), 'tools', 'visual-diff', 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, '.screenshot-sets.json');

const DEFAULT_CONFIG = {
  screenshot_sets: {},
  comparisons: {},
};

/**
 * Load screenshot sets from file.
 *
 * @returns {Object} The loaded screenshot sets.
 */
export function loadScreenshotSets() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    console.error(`Error loading screenshot sets: ${error.message}`);
  }

  return DEFAULT_CONFIG;
}

/**
 * Ensure a directory exists.
 *
 * @param {string} dirPath - The directory path.
 */
export function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Save screenshot sets to file.
 *
 * @param {Object} config - The screenshot sets to save.
 * @returns {boolean} Whether the save was successful.
 */
export function saveScreenshotSets(config) {
  try {
    ensureDirectory(CONFIG_DIR);
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    console.log(`Screenshot sets saved at ${CONFIG_FILE}`);
    return true;
  } catch (error) {
    console.error(`Error saving screenshot sets: ${error.message}`);
    return false;
  }
}

/**
 * Initialize screenshot sets if they don't exist.
 *
 * @returns {Object} The loaded or initialized screenshot sets.
 */
export function initScreenshotSets() {
  ensureDirectory(CONFIG_DIR);

  if (!fs.existsSync(CONFIG_FILE)) {
    saveScreenshotSets(DEFAULT_CONFIG);
    console.log(`Screenshot sets initialized at ${CONFIG_FILE}`);
  }
  return loadScreenshotSets();
}

/**
 * Get the screenshot directory path for a specific type of data.
 *
 * @param {string} name - The name of the data item.
 * @returns {string} The directory path.
 */
export function getScreenshotPath(name) {
  const baseDir = path.join(process.cwd(), 'tools', 'visual-diff', 'screenshots');
  ensureDirectory(baseDir);

  return path.join(baseDir, name);
}

/**
 * Add a screenshot set to the configuration.
 *
 * @param {string} name - The name of the screenshot set.
 * @param {Object} data - The screenshot set data.
 * @returns {boolean} Whether the operation was successful.
 */
export function addScreenshotSet(name, data) {
  const config = loadScreenshotSets();
  config.screenshot_sets[name] = data;
  return saveScreenshotSets(config);
}

/**
 * Add a comparison to the configuration.
 *
 * @param {string} name - The name of the comparison.
 * @param {Object} data - The comparison data.
 * @returns {boolean} Whether the operation was successful.
 */
export function addComparison(name, data) {
  const config = loadScreenshotSets();
  config.comparisons[name] = data;
  return saveScreenshotSets(config);
}

/**
 * Remove a screenshot set from the configuration.
 *
 * @param {string} name - The name of the screenshot set.
 * @returns {boolean} Whether the operation was successful.
 */
export function removeScreenshotSet(name) {
  const config = loadScreenshotSets();
  if (config.screenshot_sets[name]) {
    delete config.screenshot_sets[name];
    return saveScreenshotSets(config);
  }
  return false;
}

/**
 * Remove a comparison from the configuration.
 *
 * @param {string} name - The name of the comparison.
 * @returns {boolean} Whether the operation was successful.
 */
export function removeComparison(name) {
  const config = loadScreenshotSets();
  if (config.comparisons[name]) {
    delete config.comparisons[name];
    return saveScreenshotSets(config);
  }
  return false;
}
