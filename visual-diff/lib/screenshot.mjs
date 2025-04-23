/**
 * Screenshot capture module for Visual Diff.
 *
 * Handles capturing screenshots from Storybook.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import handler from 'serve-handler';
import { Cluster } from 'puppeteer-cluster';
import { ensureDirectory } from './config.mjs';

import { determineOptimalConcurrency } from './utils.mjs';
/**
 * Start a static server for the given directory.
 *
 * @param {string} directory - The directory to serve.
 * @param {number} port - The port to serve on.
 * @returns {Promise<http.Server>} The server instance.
 */
function startStaticServer(directory, port) {
  const server = http.createServer((request, response) => handler(request, response, {
    public: directory,
  }));

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

  const storyEntries = Object.values(indexData.entries)
    .filter((entry) => entry.type === 'story' && !entry.id.includes('--docs'));

  return storyEntries.map((entry) => ({
    id: entry.id,
    title: entry.title,
  })).filter(({ id }) => !id.includes('--docs'));
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
  concurrency = determineOptimalConcurrency(),
}) {
  ensureDirectory(outputDir);
  let server = null;
  try {
    server = await startStaticServer(storybookDir, port);

    const url = `http://localhost:${port}`;
    console.log(`Processing Storybook at ${url}`);

    const storyIds = getStoryIdsFromIndexJson(storybookDir);
    console.log(`Found ${storyIds.length} stories`);

    console.log(`Concurrent operations limited to ${concurrency}`);
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_BROWSER,
      maxConcurrency: concurrency,
    });
    await cluster.task(async ({ page, data: { storyUrl, filePath } }) => {
      console.log(`Capturing: ${storyUrl} to ${filePath}`);
      await page.goto(storyUrl, {waitUntil: ['domcontentloaded', 'networkidle0']});
      await page.screenshot({
        path: filePath,
        fullPage: true,
      });
    });
    storiesToCapture.forEach(({ id: storyId }) => {
      const storyPath = storyId.replace(/--/g, '/');
      const fileName = `${storyPath}.png`;
      const filePath = path.join(outputDir, fileName);
      const fileDir = path.dirname(filePath);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      const storyUrl = `${url}/iframe?id=${storyId}&viewMode=story`;
      cluster.queue({ storyUrl, filePath });
    });
    await cluster.idle();
    await cluster.close();
    console.log(`Screenshots captured to ${outputDir}`);
  } catch (error) {
    console.error('Error capturing screenshots:', error);
    throw error;
  } finally {
    if (server) {
      server.close();
    }
  }
}
