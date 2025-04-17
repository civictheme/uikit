/**
 * Main branch source handler for RegViz.
 * 
 * Handles creating a snapshot from the main branch.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ensureDirectory } from '../config.js';
import { captureScreenshots } from '../screenshot.js';

/**
 * Create a snapshot from the main branch.
 * 
 * @param {Object} options - The options.
 * @param {string} options.outputDir - The output directory for screenshots.
 * @param {string} options.targetDir - The target directory to capture (components or components-sdc).
 * @returns {Promise<Object>} The snapshot data.
 */
export async function createMainSnapshot({
  outputDir,
  targetDir = 'components'
}) {
  ensureDirectory(outputDir);
  
  // Create a temporary directory for the main branch
  const tempDir = path.join(process.cwd(), '.tmp-main-branch');
  
  try {
    // Clean up if the temporary directory already exists
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    console.log('Cloning main branch...');
    // Get the repo URL from git config
    const repoUrl = execSync('git config --get remote.origin.url').toString().trim();
    
    // Clone the repo
    execSync(`git clone ${repoUrl} ${tempDir} --depth 1 --branch main`, {
      stdio: 'inherit'
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
    
    // Get the current commit hash
    const commitHash = execSync('git rev-parse HEAD', {
      cwd: tempDir
    }).toString().trim();
    
    // Define Storybook directory based on target
    const storybookDir = targetDir === 'components-sdc'
      ? path.join(tempDir, 'components-sdc/storybook-static')
      : path.join(tempDir, 'storybook-static');
    
    // Capture screenshots
    console.log(`Capturing screenshots from ${targetDir} in main branch...`);
    await captureScreenshots({
      storybookDir,
      outputDir,
      port: 6009 // Use a different port to avoid conflicts
    });
    
    // Return snapshot data
    return {
      type: 'main',
      date: new Date().toISOString(),
      directory: outputDir,
      commit: commitHash,
      targetDir
    };
  } catch (error) {
    console.error('Error creating main snapshot:', error);
    throw error;
  } finally {
    // Clean up the temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}