/**
 * Release source handler for RegViz.
 * 
 * Handles creating a snapshot from the latest release or specific version.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ensureDirectory } from '../config.js';
import { captureScreenshots } from '../screenshot.js';

/**
 * Get all release tags from the current year, sorted from newest to oldest.
 * 
 * @returns {Array<string>} Array of release tags from the current year.
 */
function getCurrentYearReleaseTags() {
  try {
    const currentYear = new Date().getFullYear();
    
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
    const currentYearTags = tagData
      .filter(data => data.year === currentYear && versionTagRegex.test(data.tag))
      .map(data => data.tag);
    
    if (currentYearTags.length === 0) {
      console.log(`No release tags found for year ${currentYear}`);
      return [];
    }
    
    console.log(`Found ${currentYearTags.length} release tags for year ${currentYear}`);
    return currentYearTags;
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
function getLatestReleaseTag() {
  try {
    // Get the current year's tags
    const currentYearTags = getCurrentYearReleaseTags();
    
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
 * Create a snapshot from a release.
 * 
 * @param {Object} options - The options.
 * @param {string} options.outputDir - The output directory for screenshots.
 * @param {string} options.targetDir - The target directory to capture (components or components-sdc).
 * @param {string} [options.version] - The specific version to use (defaults to latest).
 * @returns {Promise<Object>} The snapshot data.
 */
export async function createReleaseSnapshot({
  outputDir,
  targetDir = 'components',
  version
}) {
  ensureDirectory(outputDir);
  
  // Determine the version to use
  const releaseTag = version || getLatestReleaseTag();
  console.log(`Using release tag: ${releaseTag}`);
  
  // Create a temporary directory for the release
  const tempDir = path.join(process.cwd(), `.tmp-release-${releaseTag}`);
  
  try {
    // Clean up if the temporary directory already exists
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    console.log(`Cloning repository and checking out release tag ${releaseTag}...`);
    // Get the repo URL from git config
    const repoUrl = execSync('git config --get remote.origin.url').toString().trim();
    
    // Clone the repo (without specifying a branch)
    execSync(`git clone ${repoUrl} ${tempDir} --depth 1`, {
      stdio: 'inherit'
    });
    
    // Fetch tags and checkout the specific tag
    execSync(`git fetch --tags && git checkout ${releaseTag}`, {
      stdio: 'inherit',
      cwd: tempDir
    });
    
    // Install dependencies
    console.log('Installing dependencies...');
    execSync('npm install', {
      stdio: 'inherit',
      cwd: tempDir
    });
    
    // Build Storybook
    console.log('Building Storybook...');
    if (targetDir === 'components-sdc') {
      execSync('npm --prefix components-sdc run build-storybook', {
        stdio: 'inherit',
        cwd: tempDir
      });
    } else {
      execSync('npm run build-storybook', {
        stdio: 'inherit',
        cwd: tempDir
      });
    }
    
    // Define Storybook directory based on target
    const storybookDir = targetDir === 'components-sdc'
      ? path.join(tempDir, 'components-sdc/storybook-static')
      : path.join(tempDir, 'storybook-static');
    
    // Capture screenshots
    console.log(`Capturing screenshots from ${targetDir} in release ${releaseTag}...`);
    await captureScreenshots({
      storybookDir,
      outputDir,
      port: 6011 // Use a different port to avoid conflicts
    });
    
    // Return snapshot data
    return {
      type: 'release',
      date: new Date().toISOString(),
      directory: outputDir,
      version: releaseTag,
      targetDir
    };
  } catch (error) {
    console.error(`Error creating release snapshot for ${releaseTag}:`, error);
    throw error;
  } finally {
    // Clean up the temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}