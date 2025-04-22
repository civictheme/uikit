/**
 * HTTP Server module for RegViz.
 *
 * Provides a web interface to browse and view visual difference reports.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadConfig, getDataPath } from './config.mjs';
import { formatDisplayName } from './utils.mjs';

// Path to the templates directory
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const TEMPLATES_DIR = path.join(dirname, 'templates');

// Content type mapping
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
    const reportUrl = `/report/${name}/index.html`;
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
    // Read the template file
    const template = fs.readFileSync(templatePath, 'utf8');

    // Replace the placeholder with the comparison list
    return template.replace('{{COMPARISON_LIST}}', generateComparisonList(config));
  } catch (error) {
    console.error(`Error reading template file: ${error.message}`);
    // Return a simple fallback if template can't be read
    return `<html><body><h1>RegViz - Visual Regression Reports</h1>
      <div>${generateComparisonList(config)}</div></body></html>`;
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

    // Determine content type based on file extension
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

/**
 * Start the HTTP server.
 *
 * @param {Object} options - The server options.
 * @param {number} options.port - The port to listen on.
 * @param {boolean} options.detached - Whether to run in detached mode.
 * @returns {Promise<http.Server>} The server instance.
 */
export async function startServer(options = {}) {
  const { port = 3000, detached = false } = options;

  const server = http.createServer((req, res) => {
    // Extract URL path
    const urlPath = decodeURI(req.url.split('?')[0]);

    // Handle root path (home page)
    if (urlPath === '/' || urlPath === '/index.html') {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(generateLandingPage());
      return;
    }

    // Handle report paths
    if (urlPath.startsWith('/report/')) {
      const configName = urlPath.split('/')[2];
      const filePath = urlPath.split('/').slice(3).join('/');

      // Get config to check if report exists
      const config = loadConfig();
      if (!config.comparisons[configName] && !config.screenshot_sets[configName]) {
        res.writeHead(404);
        res.end('Report not found');
        return;
      }

      const configDir = getDataPath(configName);
      const fullPath = path.join(configDir, filePath || 'index.html');

      serveStaticFile(fullPath, res);
      return;
    }

    // Handle screenshot paths
    if (urlPath.startsWith('/screenshots/')) {
      const setName = urlPath.split('/')[2];
      const filePath = urlPath.split('/').slice(3).join('/');

      // Get config to check if screenshot set exists
      const config = loadConfig();
      if (!config.screenshot_sets[setName] && !config.screenshot_sets[setName]) {
        res.writeHead(404);
        res.end('Screenshot set not found');
        return;
      }

      const screenshotDir = getDataPath(setName);
      const fullPath = path.join(screenshotDir, filePath || 'index.html');

      serveStaticFile(fullPath, res);
      return;
    }

    // Return 404 for everything else
    res.writeHead(404);
    res.end('Not found');
  });

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      console.log(`Visual Diff server started on http://localhost:${port}`);

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
