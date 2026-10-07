/**
 * P4 gate, scripted half: the UI stays a static browser app and the serve
 * command actually serves it. (1) The whole import graph reachable from
 * ui/app.mjs and the browser-side engine must be free of Node built-ins —
 * the wrong-tree/fs modules (engine/resolve.mjs, tokens lib.mjs) must never
 * sneak in. (2) index.html carries the import map both hosting contexts
 * rely on. (3) `serve` really serves the page, the mounted packages and the
 * dynamic serve-config at the documented paths. The visual half of the gate
 * is the browser walkthrough recorded in the PR.
 */
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_ROOT = path.dirname(fileURLToPath(import.meta.resolve('@civictheme/tokens/package.json')));

const failures = [];
const expect = (label, condition, detail = '') => {
  if (!condition) failures.push(`${label}${detail ? `: ${detail}` : ''}`);
};

// --- 1. Browser purity of the client import graph.
const FORBIDDEN = /^(node:|fs$|path$|url$|os$|child_process$|http$)/;
function resolveSpecifier(specifier, fromFile) {
  if (specifier.startsWith('@civictheme/tokens/')) return path.join(TOKENS_ROOT, specifier.slice('@civictheme/tokens/'.length));
  if (specifier.startsWith('@civictheme/colour-picker/')) return path.join(PACKAGE_ROOT, specifier.slice('@civictheme/colour-picker/'.length));
  if (specifier.startsWith('.')) return path.resolve(path.dirname(fromFile), specifier);
  return null;
}
const seen = new Set();
const queue = [path.join(PACKAGE_ROOT, 'ui', 'app.mjs')];
while (queue.length) {
  const file = queue.pop();
  if (seen.has(file)) continue;
  seen.add(file);
  let source;
  try {
    source = fs.readFileSync(file, 'utf-8');
  } catch {
    failures.push(`import graph: ${path.relative(PACKAGE_ROOT, file)} does not exist`);
    continue;
  }
  for (const match of source.matchAll(/^import\s[^'"]*['"]([^'"]+)['"];?$/gm)) {
    const specifier = match[1];
    if (FORBIDDEN.test(specifier)) {
      failures.push(`import graph: ${path.relative(PACKAGE_ROOT, file)} imports Node built-in "${specifier}" — the browser graph must stay pure`);
      continue;
    }
    const resolved = resolveSpecifier(specifier, file);
    if (!resolved) failures.push(`import graph: ${path.relative(PACKAGE_ROOT, file)} imports unmapped specifier "${specifier}"`);
    else queue.push(resolved);
  }
}
expect('import graph reaches the pure engine', [...seen].some((file) => file.endsWith('engine/core.mjs')));
expect('import graph reaches the tokens model', [...seen].some((file) => file.endsWith('build/model.mjs')));
expect('import graph never touches resolve.mjs', ![...seen].some((file) => file.endsWith('engine/resolve.mjs')));
expect('import graph never touches tokens lib.mjs', ![...seen].some((file) => file.endsWith('build/lib.mjs')));

// --- 2. index.html contract.
const indexHtml = fs.readFileSync(path.join(PACKAGE_ROOT, 'ui', 'index.html'), 'utf-8');
expect('import map maps the tokens package', indexHtml.includes('"@civictheme/tokens/": "/colour-picker-tokens/"'));
expect('import map maps this package', indexHtml.includes('"@civictheme/colour-picker/": "/colour-picker/"'));
expect('dogfoods the tokens stylesheet', indexHtml.includes('/colour-picker-tokens/dist/css/variables.css'));
const story = fs.readFileSync(path.join(PACKAGE_ROOT, 'stories', 'colour-picker.stories.js'), 'utf-8');
expect('story iframes the static app', story.includes('/colour-picker/ui/index.html'));

// --- 3. serve smoke test.
const child = spawn(process.execPath, [path.join(PACKAGE_ROOT, 'cli.mjs'), 'serve', '--port', '0', '--json', '--storybook-url', 'http://storybook.invalid/'], { stdio: ['ignore', 'pipe', 'pipe'] });
try {
  const address = await new Promise((resolve, reject) => {
    let buffer = '';
    child.stdout.on('data', (chunk) => {
      buffer += chunk;
      try {
        resolve(JSON.parse(buffer).url);
      } catch { /* JSON incomplete — keep buffering */ }
    });
    child.on('exit', (code) => reject(new Error(`serve exited early (${code})`)));
    setTimeout(() => reject(new Error('serve did not report an address in 5s')), 5000);
  });
  const get = async (route) => {
    const response = await fetch(new URL(route, address));
    return { status: response.status, type: response.headers.get('content-type') ?? '', body: await response.text() };
  };
  const page = await get('/colour-picker/ui/index.html');
  expect('serve: ui page', page.status === 200 && page.type.startsWith('text/html') && page.body.includes('Colour picker'));
  const engine = await get('/colour-picker/engine/core.mjs');
  expect('serve: engine module', engine.status === 200 && engine.type.startsWith('text/javascript'));
  const model = await get('/colour-picker-tokens/build/model.mjs');
  expect('serve: tokens model module', model.status === 200 && model.type.startsWith('text/javascript'));
  const tokens = await get('/colour-picker-tokens/tokens/color.palette.json');
  expect('serve: token sources', tokens.status === 200 && JSON.parse(tokens.body).color.palette !== undefined);
  const config = await get('/colour-picker/ui/serve-config.json');
  expect('serve: dynamic config carries --storybook-url', config.status === 200 && JSON.parse(config.body).storybookUrl === 'http://storybook.invalid/');
  const traversal = await get('/colour-picker/../package.json');
  expect('serve: no path traversal', traversal.status === 404);
  const missing = await get('/colour-picker/nope.txt');
  expect('serve: 404s cleanly', missing.status === 404);
} catch (error) {
  failures.push(`serve: ${error.message}`);
} finally {
  child.kill();
}

if (failures.length) {
  console.error(`UI validation FAILED (${failures.length} problems):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`UI validation passed: the browser import graph (${seen.size} modules) is Node-free and reaches the pure engine; index.html carries the import map and dogfoods the tokens CSS; serve delivers the app, both package mounts and the dynamic config with correct types and traversal safety.`);
