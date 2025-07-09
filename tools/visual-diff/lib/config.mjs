/**
 * Configuration management for Visual Diff.
 *
 * Handles loading and managing screenshot source configurations.
 */

import fs from 'fs';
import path from 'path';

// Configuration file path.
const CONFIG_DIR = path.join(process.cwd(), 'tools', 'visual-diff', 'config');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Source types
export const SOURCE_TYPES = {
  CURRENT_BRANCH: 'current_branch',
  BRANCH: 'branch',
  TAG: 'tag',
};

/**
 * Ensure a directory exists.
 *
 * @param {string} dirPath - The directory path.
 */
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Load configuration from file.
 *
 * @returns {Object} The loaded configuration.
 */
export function loadConfig() {
  try {
    ensureDirectory(CONFIG_DIR);
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    console.error(`Error loading configuration: ${error.message}`);
  }

  // Return default configuration if file doesn't exist or there's an error
  return {
    masking: {
      selectors: [
        '.ct-iframe',
        '.ct-map--canvas',
        '.ct-video-player',
        '.ct-video',
      ],
    },
    screenshot_sources: {
      current_branch: {
        packages: {
          twig: 'packages/twig',
          sdc: 'packages/sdc',
        },
      },
      branches: {
        main: {
          packages: {
            twig: 'components',
          },
        },
      },
      tags: {},
    },
  };
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
 * Load available screenshot sources for use in interactive prompts.
 *
 * @returns {Array} List of screenshot sources formatted for inquirer choices.
 */
export function loadScreenshotSources() {
  const config = loadConfig();
  const sources = [];

  // Add current branch
  sources.push({
    name: 'Current branch',
    value: 'current_branch',
    sourceType: SOURCE_TYPES.CURRENT_BRANCH,
  });

  // Add branches
  Object.keys(config.screenshot_sources.branches || {}).forEach((branch) => {
    sources.push({
      name: `Branch: ${branch}`,
      value: branch,
      sourceType: SOURCE_TYPES.BRANCH,
    });
  });

  // Add tags
  Object.keys(config.screenshot_sources.tags || {}).forEach((tag) => {
    sources.push({
      name: `Release: ${tag}`,
      value: tag,
      sourceType: SOURCE_TYPES.TAG,
    });
  });

  return sources;
}

/**
 * Load available packages for a given source.
 *
 * @param {string} source - The source identifier.
 * @param {string} sourceType - The source type (current_branch, branch, tag).
 * @returns {Array} List of packages formatted for inquirer choices.
 */
export function loadAvailablePackages(source, sourceType) {
  const config = loadConfig();
  let packages = {};

  // Determine which packages object to use based on source type
  if (sourceType === SOURCE_TYPES.CURRENT_BRANCH) {
    packages = config.screenshot_sources.current_branch.packages || {};
  } else if (sourceType === SOURCE_TYPES.BRANCH) {
    packages = (config.screenshot_sources.branches[source] || {}).packages || {};
  } else if (sourceType === SOURCE_TYPES.TAG) {
    packages = (config.screenshot_sources.tags[source] || {}).packages || {};
  }

  // Convert to choices array
  return Object.keys(packages).map((pkg) => ({
    name: pkg,
    value: pkg,
  }));
}

/**
 * Get the directory for a specific source and package combination.
 *
 * @param {string} source - The source identifier.
 * @param {string} sourceType - The source type (current_branch, branch, tag).
 * @param {string} packageName - The package identifier.
 * @param {string} directoryType - Package path or storybookPath.
 * @returns {string|null} The directory path or null if not found.
 */
export function getDirectoryForSource(source, sourceType, packageName, directoryType = 'path') {
  const config = loadConfig();
  let packagePath = null;

  if (directoryType !== 'path' && directoryType !== 'storybookPath') {
    throw new Error(`Invalid directory type: ${directoryType}`);
  }

  // Determine which packages object to use based on source type
  if (sourceType === SOURCE_TYPES.CURRENT_BRANCH) {
    packagePath = config.screenshot_sources.current_branch.packages[packageName][directoryType];
  } else if (sourceType === SOURCE_TYPES.BRANCH) {
    packagePath = (config.screenshot_sources.branches[source]) ? config.screenshot_sources.branches[source].packages[packageName][directoryType] : {};
  } else if (sourceType === SOURCE_TYPES.TAG) {
    packagePath = (config.screenshot_sources.tags[source]) ? config.screenshot_sources.tags[source].packages[packageName][directoryType] : {};
  }

  return packagePath;
}

/**
 * Check if a package is allowed for a specific source.
 *
 * @param {string} source - The source identifier.
 * @param {string} sourceType - The source type (current_branch, branch, tag).
 * @param {string} packageName - The package identifier.
 * @returns {boolean} Whether the package is allowed.
 */
export function isPackageAllowed(source, sourceType, packageName) {
  return getDirectoryForSource(source, sourceType, packageName) !== undefined;
}

/**
 * Add a new branch configuration.
 *
 * @param {string} branch - The branch name.
 * @param {Object} config - The branch configuration.
 * @returns {boolean} Whether the operation was successful.
 */
export function addBranch(branch, branchConfig) {
  try {
    const config = loadConfig();
    config.screenshot_sources.branches[branch] = branchConfig;
    return saveConfig(config);
  } catch (error) {
    console.error(`Error adding branch: ${error.message}`);
    return false;
  }
}

/**
 * Add a new tag configuration.
 *
 * @param {string} tag - The tag name.
 * @param {Object} config - The tag configuration.
 * @returns {boolean} Whether the operation was successful.
 */
export function addTag(tag, tagConfig) {
  try {
    const config = loadConfig();
    config.screenshot_sources.tags[tag] = tagConfig;
    return saveConfig(config);
  } catch (error) {
    console.error(`Error adding tag: ${error.message}`);
    return false;
  }
}

/**
 * Update the current branch configuration.
 *
 * @param {Object} config - The current branch configuration.
 * @returns {boolean} Whether the operation was successful.
 */
export function updateCurrentBranch(branchConfig) {
  try {
    const config = loadConfig();
    config.screenshot_sources.current_branch = branchConfig;
    return saveConfig(config);
  } catch (error) {
    console.error(`Error updating current branch: ${error.message}`);
    return false;
  }
}
