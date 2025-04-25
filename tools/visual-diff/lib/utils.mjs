/**
 * Shared utility functions.
 */

import { execSync } from 'child_process';
import os from 'os';

/**
 * Get all release tags from the current year, sorted from newest to oldest.
 *
 * @returns {Array<string>} Array of release tags from the current year.
 */
export function getCompatibleReleaseTags() {
  try {
    // First compatible release is 1.10.
    // Released March 2025 (with new storybook).
    const startYear = 2025;

    // Get all tags sorted by commit date (newest first).
    const tagsWithDates = execSync(
      'git for-each-ref --sort=-creatordate --format="%(refname:short) %(creatordate:short)" refs/tags/',
    ).toString().trim();

    // Parse the output to get tags with their dates.
    const tagData = tagsWithDates.split('\n').map((line) => {
      const [tag, date] = line.trim().split(' ');
      return { tag, date, year: date ? parseInt(date.split('-')[0], 10) : null };
    });
    return tagData
      .filter((data) => data.year === startYear)
      .map((data) => data.tag);
  } catch (error) {
    console.error('Error getting release tags:', error);
    return [];
  }
}

/**
 * Get the latest release tag.
 *
 * @returns {string} The latest release tag.
 */
export function getLatestReleaseTag() {
  try {
    const currentYearTags = getCompatibleReleaseTags();

    if (currentYearTags.length > 0) {
      console.log(`Using latest release tag: ${currentYearTags[0]}`);
      return currentYearTags[0];
    }
    // UIKit has a release for this year.
    // So there is a problem if this fails.
    throw new Error('No version tags found');
  } catch (error) {
    console.error('Error getting latest release tag:', error);
    throw error;
  }
}

/**
 * Format a machine set name into a display name
 *
 * @param {string} name - Machine name
 *
 * @returns {string} Human-readable name
 */
export function formatDisplayName(name) {
  // Extract parts from the name format:
  // "set--<type>--<branch or tag>--<component_framework>".
  const parts = name.split('--');
  if (parts.length >= 3) {
    const type = parts[1] || ''; // main, current, release
    let branch = '';
    let framework = 'components';

    // Handle different format variations.
    if (parts.length === 3) {
      // Format: "set--main--sdc" or "set--main--components"
      if (type === 'main' || type === 'release') {
        // eslint-disable-next-line prefer-destructuring
        framework = parts[2];
      } else {
        // eslint-disable-next-line prefer-destructuring
        branch = parts[2];
      }
    } else if (parts.length >= 4) {
      // Format with 4+ parts: "set--current--feature-branch--components"
      // eslint-disable-next-line prefer-destructuring
      branch = parts[2];
      // eslint-disable-next-line prefer-destructuring
      framework = parts[3];
    }

    // Form a human-readable name
    let readableName = '';

    if (type === 'main') {
      readableName = 'Main branch';
    } else if (type === 'current') {
      readableName = `Branch: ${branch}`;
    } else if (type === 'release') {
      readableName = `Release: ${branch}`;
    } else {
      readableName = type;
    }

    // Add framework info
    readableName += ` (${framework})`;

    return readableName;
  }

  return name;
}

/**
 * Get the framework name from the directory name.
 *
 * @param {string} directory The directory name.
 *
 * @returns {string} The framework name.
 */
export function getFrameworkName(directory) {
  // Map directory paths to package names
  const frameworks = {
    'packages/twig': 'twig',
    'packages/sdc': 'sdc',
    'components': 'twig',
    'components-sdc': 'sdc',
  };

  // Return the framework name if it exists
  if (frameworks[directory]) {
    return frameworks[directory];
  }

  // Extract just the last part of the path
  const parts = directory.split('/');
  return parts[parts.length - 1];
}

/**
 * Generate a name for a screenshot set.
 *
 * @param {Object} options - The options object.
 * @param {string} options.sourceType - The source type (current_branch, branch, tag).
 * @param {string} options.source - The source value (branch name, tag name).
 * @param {string} options.package - The package name (twig, sdc).
 * @param {Object} [options.branch] - Branch information for current branch (from getBranchData).
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
