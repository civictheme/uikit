/**
 * Shared utility functions.
 */

import { execSync } from 'child_process';
import os from 'os';
import { loadScreenshotSets } from './screenshot-set-manager.mjs';

/**
 * Format a machine set name into a display name
 *
 * @param {string} source - source name
 * @param {string} sourceType - source type (current_branch, branch, tag)
 * @param {string} packageName - package name
 *
 * @returns {string} Human-readable name
 */
export function formatDisplayName(source, sourceType, packageName) {
  if (source === 'current_branch') {
    return `Current branch (${packageName})`;
  }
  return `${sourceType}: ${source} (${packageName})`;
}

/**
 * Generate a name for a screenshot set.
 *
 * @param {Object} options - The options object.
 * @param {string} options.sourceType - Source type.
 * @param {string} options.source - The source value (branch name, tag name).
 * @param {string} options.package - The package name (twig, sdc).
 * @param {Object} [options.branch] - Branch information for current branch.
 * @param {string} [options.safeBranch] - Safe branch name for current branch.
 * @returns {string} The generated set name.
 */
export function generateSetName(options) {
  const { sourceType, source, package: packageName } = options;
  const parts = [];
  if (sourceType === 'current_branch') {
    parts.push('current');
    parts.push(options.safeBranch);
  } else if (sourceType === 'branch') {
    parts.push('branch');
    parts.push(source.replace(/[^a-zA-Z0-9-_]/g, '-'));
  } else if (sourceType === 'tag') {
    parts.push('tag');
    parts.push(source.replace(/[^a-zA-Z0-9-_]/g, '-'));
  }
  parts.push(packageName);

  return parts.join('--');
}

/**
 * Gets branch name and generates a safe branch name.
 *
 * @returns {{branch: string, safeBranch: string}}
 */
export function getBranchData() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    return {
      branch,
      safeBranch: branch.replace(/[^a-zA-Z0-9-_]/g, '-'),
    };
  } catch (error) {
    console.warn('Unable to get branch information:', error.message);
    throw error;
  }
}

/**
 * Determine appropriate concurrency for screenshot capture.
 *
 * @returns {number}
 */
export function determineOptimalConcurrency() {
  const cpuCount = os.cpus().length;
  const totalMemoryGB = os.totalmem() / 1024 / 1024 / 1024;

  // Each Puppeteer instance can use ~100-200MB of memory.
  const estimatedMemoryPerProcess = 0.2; // GB

  // Calculate how many processes the memory can support
  const memoryBasedLimit = Math.floor(totalMemoryGB / estimatedMemoryPerProcess);

  // Use the smaller of CPU-based or memory-based limits
  // Add a smaller cap to prevent overwhelming the system.
  const maxConcurrency = Math.min(
    cpuCount * 2,
    memoryBasedLimit,
    100,
  );

  return Math.max(1, maxConcurrency);
}

/**
 * Creates a list of options for the interactive CLI.
 *
 * @returns {Array} - source options.
 */
export function getSourceOptions() {
  const screenshotSets = loadScreenshotSets().screenshot_sets || {};
  const sourceOptions = Object.entries(screenshotSets).map(([name, screenshotSet]) => ({
    name: formatDisplayName(screenshotSet.source, screenshotSet.sourceType, screenshotSet.package),
    value: name,
  }));

  return sourceOptions;
}

/**
 * Generates a diff name from source and target.
 *
 * Used in directories and screenshot sets.
 *
 * @param {string} sourceName - source name.
 * @param {string} targetName - target name.
 *
 * @returns {string} - generated diff name.
 */
export function generateDiffName(sourceName, targetName) {
  return `diff-${sourceName}--vs--${targetName}`;
}
