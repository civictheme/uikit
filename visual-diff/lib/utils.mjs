/**
 * Shared utility functions.
 */

import {execSync} from 'child_process';
import os from "os";

/**
 * Get all release tags from the current year, sorted from newest to oldest.
 *
 * @returns {Array<string>} Array of release tags from the current year.
 */
export function getCompatibleReleaseTags() {
    try {
        // First compatible release is 1.10.
        // Released March 2025.
        const startYear = 2025;

        // Get all tags sorted by commit date (newest first)
        const tagsWithDates = execSync(
            'git for-each-ref --sort=-creatordate --format="%(refname:short) %(creatordate:short)" refs/tags/'
        ).toString().trim();

        // Parse the output to get tags with their dates
        const tagData = tagsWithDates.split('\n').map(line => {
            const [tag, date] = line.trim().split(' ');
            return { tag, date, year: date ? parseInt(date.split('-')[0], 10) : null };
        });

        // Filter for version tags from the current year
        const versionTagRegex = /^v?(\d+\.\d+(\.\d+)*)$/;
        return tagData
            .filter(data => data.year === startYear && versionTagRegex.test(data.tag))
            .map(data => data.tag);
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
        // Get the current year's tags
        const currentYearTags = getCompatibleReleaseTags();

        if (currentYearTags.length > 0) {
            console.log(`Using latest release tag: ${currentYearTags[0]}`);
            return currentYearTags[0];
        }

        // Fall back to all tags if no current year tags
        const tags = execSync('git tag --sort=-v:refname').toString().trim().split('\n');

        // Find the first tag that looks like a version
        const versionTagRegex = /^v?(\d+\.\d+(\.\d+)*)$/;
        const latestTag = tags.find(tag => versionTagRegex.test(tag));

        if (!latestTag) {
            throw new Error('No version tags found');
        }

        console.log(`No current year tags found. Using latest overall tag: ${latestTag}`);
        return latestTag;
    } catch (error) {
        console.error('Error getting latest release tag:', error);
        throw error;
    }
}

/**
 * Format a technical set name into a human-readable display name
 *
 * @param {string} name - The technical name (e.g. "set--current--feature-branch--components")
 * @returns {string} Human-readable name (e.g. "Branch: feature-branch (Components)")
 */
export function formatDisplayName(name) {
    // Extract parts from the technical name format "set--<type>--<branch or tag>--<component_framework>"
    const parts = name.split('--');
    if (parts.length >= 3) {
        const type = parts[1] || ''; // main, current, release
        let branch = '';
        let framework = 'components';

        // Handle different format variations
        if (parts.length === 3) {
            // Format: "set--main--sdc" or "set--main--components"
            if (type === 'main' || type === 'release') {
                framework = parts[2];
            } else {
                // For current branches with just 3 parts, assume components as framework
                branch = parts[2];
            }
        } else if (parts.length >= 4) {
            // Format with 4+ parts: "set--current--feature-branch--components"
            branch = parts[2];
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
    const frameworks = {
        'components': 'twig',
        'components-sdc': 'sdc'
    };

    if (!frameworks[directory]) {
        throw new Error(`Unknown framework: ${directory}`);
    }

    return frameworks[directory];
}

/**
 * Generate a name for a screenshot set.
 *
 * @param options
 * @returns {string}
 */
export function generateSetName(options) {
    let name = 'set';
    name += `--${options.source}`;

    if (options.source === 'release' && options.version) {
        name += `--${options.version}`;
    } else if (options.source === 'current' && options.branch) {
        name += `--${options.safeBranch}`;
    }

    const targetName = getFrameworkName(options.target);
    name += `--${targetName}`;

    return name;
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
        }
    }
    catch (error) {
        console.warn('Unable to get branch information:', error.message);
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
        24
    );

    return Math.max(1, maxConcurrency);
}
