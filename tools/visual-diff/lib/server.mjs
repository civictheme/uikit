/**
 * HTTP Server module for RegViz.
 *
 * Provides a web interface to browse and view visual difference reports.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadScreenshotSets as loadConfig, getDataPath } from './screenshot-set-manager.mjs';
import { formatDisplayName } from './utils.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const TEMPLATES_DIR = path.join(dirname, 'templates');

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

/**
 * Generate HTML for the comparison list.
 *
 * @param {Object} config - The configuration object.
 * @returns {string} The HTML for the comparison list.
 */
function generateComparisonList(config) {
  if (!config.comparisons || Object.keys(config.comparisons).length === 0) {
    return '<p class="empty-message">No comparison reports available.</p>';
  }

  let html = '<div class="card-list">';

  Object.entries(config.comparisons).forEach(([name, comparison]) => {
    const reportUrl = `/${name}/index.html`;
    const sourceName = formatDisplayName(comparison.source);
    const targetName = formatDisplayName(comparison.target);
    const date = new Date(comparison.date).toLocaleString();

    html += `
    <div class="card">
      <a href="${reportUrl}" style="display: block; text-decoration: none; color: inherit;">
        <h3>${formatDisplayName(name)}</h3>
        <p>Source: ${sourceName}<br>Target: ${targetName}</p>
        <p class="timestamp">Created: ${date}</p>
        <p><button class="view-btn">View Comparison Report</button></p>
      </a>
    </div>
    `;
  });

  html += '</div>';
  return html;
}

/**
 * Generate the home page HTML.
 *
 * @returns {string} The HTML for the home page.
 */
function generateLandingPage() {
  const config = loadConfig();
  const templatePath = path.join(TEMPLATES_DIR, 'homepage.html');

  try {
    const template = fs.readFileSync(templatePath, 'utf8');
    return template.replace('{{COMPARISON_LIST}}', generateComparisonList(config));
  } catch (error) {
    console.error(`Error reading template file: ${error.message}`);
    return `<html><body><h1>RegViz - Visual Regression Reports</h1>
      <div>${generateComparisonList(config)}</div></body></html>`;
  }
}

/**
 * Generate and write the index.html file to disk.
 *
 * @param {string} outputPath
 * @returns {Promise<void>}
 */
export async function generateAndWriteIndexHtml(outputPath) {
  try {
    const html = generateLandingPage();
    const dataPath = outputPath || path.join(getDataPath(''), 'index.html');

    fs.writeFileSync(dataPath, html);
    console.log(`Index.html generated at: ${dataPath}`);
    return dataPath;
  } catch (error) {
    console.error('Error generating index.html:', error);
    throw error;
  }
}

/**
 * Serve a static file.
 *
 * @param {string} filePath - The path to the file.
 * @param {http.ServerResponse} res - The response object.
 */
function serveStaticFile(filePath, res) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Internal server error');
      }
      return;
    }

    // If the path is a directory, try to serve index.html
    if (stats.isDirectory()) {
      serveStaticFile(path.join(filePath, 'index.html'), res);
      return;
    }

    const ext = path.extname(filePath);
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';

    // Serve the file
    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(500);
        res.end('Internal server error');
        return;
      }

      res.setHeader('Content-Type', contentType);
      res.writeHead(200);
      res.end(data);
    });
  });
}

export async function startServer(options = {}) {
  const { port = 3000, detached = false } = options;

  // Define the screenshots directory as the root serving directory
  const screenshotsDir = path.resolve('./tools/visual-diff/screenshots');

  const server = http.createServer((req, res) => {
    // Decode and clean the URL path
    const urlPath = decodeURI(req.url.split('?')[0]);
    console.log(`Request for ${urlPath}`);
    // Map the URL path to a file path within the screenshots directory
    let filePath = path.join(screenshotsDir, urlPath);

    // Check if the path is a directory
    let isDirectory = false;
    try {
      isDirectory = fs.statSync(filePath).isDirectory();
    } catch (error) {
      // Path doesn't exist, will be handled as 404 below
    }

    // If it's a directory, try to serve index.html from that directory
    if (isDirectory) {
      filePath = path.join(filePath, 'index.html');
      console.log(`Request for ${urlPath} resolved to ${filePath}`);
    }
    console.log(`Serving ${filePath}`);
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File doesn't exist
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      // Serve the file
      serveStaticFile(filePath, res);
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      console.log(`Server started on http://localhost:${port} serving files from ${screenshotsDir}`);

      if (detached) {
        // If detached, don't keep the process running
        server.unref();
        console.log('Server running in detached mode. The process will exit but the server will continue running.');
      }

      resolve(server);
    });

    server.on('error', (error) => {
      reject(error);
    });
  });
}
