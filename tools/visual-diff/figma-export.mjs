/**
 * Figma visual-diff exporter.
 *
 * Exports the frames listed in config/figma-export-manifest.json as PNGs via
 * the Figma REST images API and registers the result as a screenshot set, so
 * `npm run diff:command -- compare` can diff Figma captures the same way as
 * Storybook ones.
 *
 * Usage:
 *   FIGMA_TOKEN=figd_xxx node tools/visual-diff/figma-export.mjs --set figma-baseline--pretoken
 *   node tools/visual-diff/figma-export.mjs --set figma-current--branch --file-key <branchFileKey>
 *
 * The token can also be placed in .claude-scratchpad/.figma-token (one line,
 * git-ignored). Requires a personal access token with file read access
 * (figma.com → Settings → Security → Personal access tokens).
 *
 * Node ids are stable across edits and Figma branches, so the same manifest
 * drives the baseline export of the main file and later exports of the
 * migration branch (pass the branch file key via --file-key).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(TOOL_DIR, '..', '..');
const CONFIG_PATH = path.join(TOOL_DIR, 'config', '.screenshot-sets.json');
const MANIFEST_PATH = path.join(TOOL_DIR, 'config', 'figma-export-manifest.json');
const SCREENSHOTS_DIR = path.join(TOOL_DIR, 'screenshots');

const BATCH_SIZE = 20;
const BATCH_DELAY_MS = 1200; // stay well inside Figma API rate limits

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { scale: 1 };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--set') out.set = args[++i];
    else if (args[i] === '--file-key') out.fileKey = args[++i];
    else if (args[i] === '--scale') out.scale = Number(args[++i]);
    else if (args[i] === '--manifest') out.manifest = args[++i];
  }
  if (!out.set) {
    console.error('Missing required --set <name> (e.g. --set figma-baseline--pretoken)');
    process.exit(1);
  }
  return out;
}

function getToken() {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN.trim();
  const tokenFile = path.join(ROOT, '.claude-scratchpad', '.figma-token');
  if (fs.existsSync(tokenFile)) return fs.readFileSync(tokenFile, 'utf-8').trim();
  console.error('No Figma token. Set FIGMA_TOKEN or create .claude-scratchpad/.figma-token');
  process.exit(1);
}

async function fetchImageUrls(fileKey, ids, scale, token) {
  const url = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(ids.join(','))}&format=png&scale=${scale}`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': token } });
  if (!res.ok) throw new Error(`Images API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.err) throw new Error(`Images API error: ${data.err}`);
  return data.images;
}

async function download(url, filePath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${res.status} for ${filePath}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buf);
  return buf.length;
}

function registerSet(setName, meta) {
  const config = fs.existsSync(CONFIG_PATH)
    ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
    : { screenshot_sets: {}, comparisons: {} };
  config.screenshot_sets[setName] = meta;
  fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);
}

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

async function main() {
  const opts = parseArgs();
  const token = getToken();
  const manifest = JSON.parse(fs.readFileSync(opts.manifest || MANIFEST_PATH, 'utf-8'));
  const fileKey = opts.fileKey || manifest.fileKey;
  const outputDir = path.join(SCREENSHOTS_DIR, opts.set);

  console.log(`Exporting ${manifest.nodes.length} nodes from ${fileKey} at scale ${opts.scale} to ${outputDir}`);

  const failures = [];
  let saved = 0;
  for (let i = 0; i < manifest.nodes.length; i += BATCH_SIZE) {
    const batch = manifest.nodes.slice(i, i + BATCH_SIZE);
    const urls = await fetchImageUrls(fileKey, batch.map((n) => n.id), opts.scale, token);
    for (const node of batch) {
      const url = urls[node.id];
      const fileName = `${node.name}--${node.id.replace(/:/g, '-')}.png`;
      const filePath = path.join(outputDir, node.page, fileName);
      if (!url) {
        failures.push(`${node.page}/${fileName} (render returned null)`);
        continue;
      }
      try {
        const bytes = await download(url, filePath);
        saved += 1;
        console.log(`  saved ${node.page}/${fileName} (${Math.round(bytes / 1024)} KB)`);
      } catch (error) {
        failures.push(`${node.page}/${fileName} (${error.message})`);
      }
    }
    if (i + BATCH_SIZE < manifest.nodes.length) await sleep(BATCH_DELAY_MS);
  }

  registerSet(opts.set, {
    source: 'figma',
    sourceType: 'figma',
    package: 'figma',
    date: new Date().toISOString(),
    directory: outputDir,
    fileKey,
    scale: opts.scale,
    nodeCount: manifest.nodes.length,
    manifest: opts.manifest || MANIFEST_PATH,
  });

  console.log(`\nDone: ${saved}/${manifest.nodes.length} exported to set "${opts.set}".`);
  if (failures.length) {
    console.error(`Failures (${failures.length}):`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
