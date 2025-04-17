/**
 * Screenshot capture module for RegViz.
 * 
 * Handles capturing screenshots from Storybook.
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import http from 'http';
import handler from 'serve-handler';
import pLimit from 'p-limit';
import { ensureDirectory } from './config.js';

/**
 * Start a static server for the given directory.
 * 
 * @param {string} directory - The directory to serve.
 * @param {number} port - The port to serve on.
 * @returns {Promise<http.Server>} The server instance.
 */
function startStaticServer(directory, port) {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: directory
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      console.log(`Server started on port ${port} serving ${directory}`);
      resolve(server);
    });

    server.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Get all story IDs from a Storybook instance.
 * 
 * @param {string} staticDir - The Storybook static directory.
 * @returns {Array<Object>} The story IDs.
 */
function getStoryIdsFromIndexJson(staticDir) {
  const indexPath = path.join(staticDir, 'index.json');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`index.json not found at ${indexPath}`);
  }

  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const indexData = JSON.parse(indexContent);

  // Filter out entries that aren't stories (e.g., docs pages)
  const storyEntries = Object.entries(indexData.entries)
    .filter(([_, entry]) => entry.type === 'story' && !entry.id.includes('--docs'));

  return storyEntries.map(([_, entry]) => ({
    id: entry.id,
    title: entry.title
  }));
}

/**
 * Take screenshots of all stories in a Storybook instance.
 * 
 * @param {Object} options - The options.
 * @param {string} options.storybookDir - The Storybook static directory.
 * @param {string} options.outputDir - The output directory for screenshots.
 * @param {number} options.port - The port to serve Storybook on.
 * @returns {Promise<void>}
 */
export async function captureScreenshots({
  storybookDir,
  outputDir,
  port = 6006,
  concurrency = 48
}) {
  ensureDirectory(outputDir);
  let server = null;
  let browser = null;

  try {
    // Start static server
    server = await startStaticServer(storybookDir, port);
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: true
    });

    const url = `http://localhost:${port}`;
    console.log(`Processing Storybook at ${url}`);

    // Get all story IDs
    const storyIds = getStoryIdsFromIndexJson(storybookDir);
    console.log(`Found ${storyIds.length} stories`);

    // Filter out docs pages
    const storiesToCapture = storyIds.filter(({id}) => !id.includes('--docs'));

    // Create a limit function for concurrent operations
    const limit = pLimit(concurrency);

    // Create an array of promises
    const promises = storiesToCapture.map(({id: storyId, title}) => {
      return limit(async () => {
        const page = await browser.newPage();

        try {
          const storyPath = storyId.replace(/--/g, '/');
          const fileName = `${storyPath}.png`;
          const filePath = path.join(outputDir, fileName);

          // Ensure directory exists
          const fileDir = path.dirname(filePath);
          if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
          }

          // Navigate to story
          const storyUrl = `${url}/iframe?id=${storyId}&viewMode=story`;
          console.log(`Capturing: ${storyUrl}`);
          await page.goto(storyUrl, { waitUntil: 'networkidle0' });

          // Take screenshot
          await page.screenshot({
            path: filePath,
            fullPage: true
          });
        } catch (error) {
          console.error(`Error capturing ${storyId}:`, error);
        } finally {
          await page.close();
        }
      });
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
    console.log(`Screenshots captured to ${outputDir}`);

  } catch (error) {
    console.error('Error capturing screenshots:', error);
    throw error;
  } finally {
    // Close browser
    if (browser) {
      await browser.close();
    }
    
    // Close server
    if (server) {
      server.close();
    }
  }
}