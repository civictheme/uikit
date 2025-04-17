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
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      
      // Migrate old format if needed
      if (config.baselines || config.targets) {
        const migratedConfig = migrateConfig(config);
        saveConfig(migratedConfig);
        return migratedConfig;
      }
      
      return config;
    }
  } catch (error) {
    console.error(`Error loading configuration: ${error.message}`);
  }
  
  return DEFAULT_CONFIG;
}

/**
 * Migrate old configuration format to new format.
 * 
 * @param {Object} oldConfig - The old configuration.
 * @returns {Object} The migrated configuration.
 */
function migrateConfig(oldConfig) {
  const newConfig = {
    screenshot_sets: {},
    comparisons: oldConfig.comparisons || {}
  };
  
  // Migrate baselines to screenshot_sets
  if (oldConfig.baselines) {
    Object.entries(oldConfig.baselines).forEach(([name, data]) => {
      newConfig.screenshot_sets[name] = {
        ...data,
        role: 'baseline'
      };
    });
  }
  
  // Migrate targets to screenshot_sets
  if (oldConfig.targets) {
    Object.entries(oldConfig.targets).forEach(([name, data]) => {
      newConfig.screenshot_sets[name] = {
        ...data,
        role: 'target'
      };
    });
  }
  
  // Update comparisons to reference screenshot_sets
  if (oldConfig.comparisons) {
    Object.entries(oldConfig.comparisons).forEach(([name, data]) => {
      newConfig.comparisons[name] = {
        ...data,
        source: data.baseline,
        target: data.target
      };
      
      // Remove old properties
      delete newConfig.comparisons[name].baseline;
    });
  }
  
  console.log('Configuration migrated to new format');
  return newConfig;
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
    return true;
  } catch (error) {
    console.error(`Error saving configuration: ${error.message}`);
    return false;
  }
}

/**
 * Get the directory path for a specific type of data.
 *
 * @param {string} type - The type of data (set, comparison).
 * @param {string} name - The name of the data.
 * @returns {string} The directory path.
 */
export function getDataPath(type, name) {
  const baseDir = path.join(process.cwd(), 'screenshots');
  
  switch (type) {
    case 'set':
      return path.join(baseDir, `set-${name}`);
    case 'comparison':
      return path.join(baseDir, `diff-${name}`);
    default:
      throw new Error(`Unknown data type: ${type}`);
  }
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