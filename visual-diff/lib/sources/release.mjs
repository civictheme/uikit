/**
 * Release source handler for Visual Diff.
 *
 * Handles creating a snapshot from the latest release or specific version.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {ensureDirectory} from '../config.mjs';
import {captureScreenshots} from '../screenshot.mjs';
import {getLatestReleaseTag} from "../utils.mjs";

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
