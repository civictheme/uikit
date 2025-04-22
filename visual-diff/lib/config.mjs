/**
 * Configuration management for RegViz.
 *
 * Handles loading, saving, and initialization of configuration.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration file path
const CONFIG_DIR = path.join(process.cwd(), 'regviz', 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'regviz.json');

// Default configuration
const DEFAULT_CONFIG = {
  screenshot_sets: {},
  comparisons: {}
};

/**
 * Initialize configuration if it doesn't exist.
 *
 * @returns {Object} The loaded or initialized configuration.
 */
export function initConfig() {
  ensureDirectory(CONFIG_DIR);

  if (!fs.existsSync(CONFIG_FILE)) {
    saveConfig(DEFAULT_CONFIG);
    console.log(`Configuration initialized at ${CONFIG_FILE}`);
  }
  return loadConfig();
}

/**
 * Load configuration from file.
 *
 * @returns {Object} The loaded configuration.
 */
export function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    console.error(`Error loading configuration: ${error.message}`);
  }

  return DEFAULT_CONFIG;
}

/**
 * Save configuration to file.
 *
 * @param {Object} config - The configuration to save.
 * @returns {boolean} Whether the save was successful.
 */
export function saveConfig(config) {
  try {
    ensureDirectory(CONFIG_DIR);
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    console.log(`Configuration saved at ${CONFIG_FILE}`);
    return true;
  } catch (error) {
    console.error(`Error saving configuration: ${error.message}`);
    return false;
  }
}

/**
 * Get the directory path for a specific type of data.
 *
 * @param {string} name - The name of the data item.
 * @returns {string} The directory path.
 */
export function getDataPath(name) {
  const baseDir = path.join(process.cwd(), 'regviz', 'screenshots');
  ensureDirectory(baseDir);

  return path.join(baseDir, name);
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
 * Add a screenshot set to the configuration.
 *
 * @param {string} name - The name of the screenshot set.
 * @param {Object} data - The screenshot set data.
 * @returns {boolean} Whether the operation was successful.
 */
export function addScreenshotSet(name, data) {
  const config = loadConfig();
  config.screenshot_sets[name] = data;
  return saveConfig(config);
}

/**
 * Add a comparison to the configuration.
 *
 * @param {string} name - The name of the comparison.
 * @param {Object} data - The comparison data.
 * @returns {boolean} Whether the operation was successful.
 */
export function addComparison(name, data) {
  const config = loadConfig();
  config.comparisons[name] = data;
  return saveConfig(config);
}

/**
 * Remove a screenshot set from the configuration.
 *
 * @param {string} name - The name of the screenshot set.
 * @returns {boolean} Whether the operation was successful.
 */
export function removeScreenshotSet(name) {
  const config = loadConfig();
  if (config.screenshot_sets[name]) {
    delete config.screenshot_sets[name];
    return saveConfig(config);
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
  const config = loadConfig();
  if (config.comparisons[name]) {
    delete config.comparisons[name];
    return saveConfig(config);
  }
  return false;
}
