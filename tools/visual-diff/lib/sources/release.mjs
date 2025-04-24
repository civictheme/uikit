/**
 * Release source handler for Visual Diff.
 *
 * Handles creating a snapshot from the latest release or specific version.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {ensureDirectory} from '../screenshot-set-manager.mjs';
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

  const releaseTag = version || getLatestReleaseTag();
  console.log(`Using release tag: ${releaseTag}`);

  const tempDir = path.join(process.cwd(), `.tmp-release-${releaseTag}`);

  try {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    console.log(`Cloning repository and checking out release tag ${releaseTag}...`);
    const repoUrl = execSync('git config --get remote.origin.url').toString().trim();

    execSync(`git clone ${repoUrl} ${tempDir} --depth 1`, {
      stdio: 'inherit'
    });

    execSync(`git fetch --tags && git checkout ${releaseTag}`, {
      stdio: 'inherit',
      cwd: tempDir
    });

    console.log('Installing dependencies...');
    execSync('npm install', {
      stdio: 'inherit',
      cwd: tempDir
    });

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

    const storybookDir = targetDir === 'components-sdc'
      ? path.join(tempDir, 'components-sdc/storybook-static')
      : path.join(tempDir, 'storybook-static');

    console.log(`Capturing screenshots from ${targetDir} in release ${releaseTag}...`);
    await captureScreenshots({
      storybookDir,
      outputDir,
      port: 6011
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
