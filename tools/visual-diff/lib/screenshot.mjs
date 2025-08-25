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
import { ensureDirectory } from './screenshot-set-manager.mjs';
import { determineOptimalConcurrency } from './utils.mjs';
import { loadConfig } from './config.mjs';

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
  const config = loadConfig();
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
      puppeteerOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      },
    });
    await cluster.task(async ({ page, data: { storyUrl, filePath, selectors } }) => {
      await page.goto(storyUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      console.log(`Capturing: ${storyUrl} to ${filePath}`);

      if (config.screenshot_options?.disable_css_transitions) {
        await page.evaluate(() => {
          const style = document.createElement('style');
          style.textContent = `
            *, *::before, *::after {
              transition: none !important;
              transition-duration: 0s !important;
            }
          `;
          document.head.appendChild(style);
        });
      }

      if (config.screenshot_options?.hide_mask_selectors && selectors.length > 0) {
        await page.evaluate((cssSelectors) => {
          document.querySelectorAll(cssSelectors.join(', ')).forEach((el) => {
            el.style.visibility = 'hidden';
          });
        }, selectors);
      }

      if (config.screenshot_options?.replace_images_with_solid_color) {
        await page.evaluate(() => {
          // Base64 encoded 1x1 pixel (PNG format)
          const pixelImageB64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
          // Replace all img src attributes
          const images = document.querySelectorAll('img');
          images.forEach((img) => {
            if (img.src && !img.src.startsWith('data:')) {
              img.src = pixelImageB64;
            }
          });

          // Replace background images in CSS
          const elementsWithBg = document.querySelectorAll('.ct-footer, .ct-banner__inner, .ct-background');
          elementsWithBg.forEach((el) => {
            const style = window.getComputedStyle(el);
            const bgImage = style.backgroundImage;
            if (bgImage && bgImage !== 'none' && !bgImage.includes('data:')) {
              el.style.backgroundImage = `url("${pixelImageB64}")`;
            }
          });
        });
      }

      // Small delay to ensure page has settled down
      const settleDelay = config.screenshot_options?.settle_delay_ms || 0;
      if (settleDelay > 0) {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, settleDelay);
        });
      }

      await page.screenshot({
        path: filePath,
        fullPage: true,
      });
    });
    storyIds.forEach(({ id: storyId }) => {
      const storyPath = storyId.replace(/--/g, '/');
      const fileName = `${storyPath}.png`;
      const filePath = path.join(outputDir, fileName);
      const fileDir = path.dirname(filePath);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      const storyUrl = `${url}/iframe?id=${storyId}&viewMode=story`;
      cluster.queue({ storyUrl, filePath, selectors: config.masking.selectors || [] });
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
