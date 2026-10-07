#!/usr/bin/env node
/**
 * The AI/maintainer side application (R4): recipe in, resolved values /
 * contrast QA / build outputs out. Zero dependencies — hand-rolled args,
 * node:* only. Exit codes: 0 success (contrast failures WARN, never block —
 * recorded decision), 1 failure or `check --strict` with failing targets,
 * 2 usage. The one exception to zero-dep is `generate`: palette generation
 * lazily imports @adobe/leonardo-contrast-colors in engine/derive.mjs,
 * Node-side only (the containment rule — the UI's Generate button POSTs to
 * /generate on `serve`, no Leonardo bytes ever reach a browser).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadTokens, resolveModes, MODES } from '@civictheme/tokens/build/lib.mjs';
import { resolveRecipe, targetsForRecipe, loadTargets } from './engine/resolve.mjs';
import { checkContrast } from './engine/contrast.mjs';
import { emitCss, emitFigma, emitResolved, emitNameMap, emitScssOverrides } from './engine/emit.mjs';

const USAGE = `Usage: npx @civictheme/colour-picker <command> [options]

Commands:
  resolve     Full resolved token table, both modes
  check       Contrast QA against the per-family targets (warns, never blocks)
  emit        Write every build output of a recipe to a directory
  generate    Generate the palette from the brand inputs (Leonardo), into the recipe's generated key
  serve       Serve the human UI locally
  init-skill  Install the colour-picker AI skill into ./.claude/skills/

Options:
  --recipe <file>         Recipe JSON (default: identity — the stock tokens)
  --out <dir>             emit: output directory (required)
  --targets <file>        check: alternative targets JSON ({ "targets": { ... } })
  --json                  Machine-readable output
  --strict                check: exit 1 when any contrast target fails
  --write                 generate: write the updated recipe back to --recipe (default: print it)
  --port <n>              serve: port (default 8420; 0 picks a free one)
  --storybook-url <url>   serve: Storybook base URL for live component previews
`;

function parseArgs(argv) {
  const options = { command: argv[0], json: false, strict: false };
  const flags = { '--recipe': 'recipe', '--out': 'out', '--targets': 'targets', '--port': 'port', '--storybook-url': 'storybookUrl' };
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') options.json = true;
    else if (arg === '--strict') options.strict = true;
    else if (arg === '--write') options.write = true;
    else if (flags[arg]) {
      const value = argv[++i];
      if (value === undefined || value.startsWith('--')) throw new Error(`${arg} needs a value`);
      options[flags[arg]] = value;
    } else throw new Error(`Unknown argument "${arg}"`);
  }
  return options;
}

function loadRecipe(file) {
  if (!file) return { version: 1 };
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf-8');
  } catch (error) {
    throw new Error(`Cannot read recipe ${file}: ${error.message}`, { cause: error });
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Recipe ${file} is not valid JSON: ${error.message}`, { cause: error });
  }
}

function loadTargetsFile(file) {
  if (!file) return loadTargets();
  const parsed = JSON.parse(fs.readFileSync(file, 'utf-8'));
  if (!parsed.targets || typeof parsed.targets !== 'object') throw new Error(`Targets file ${file} has no "targets" object`);
  return parsed.targets;
}

const pad = (text, width) => String(text).padEnd(width);

function commandResolve(options) {
  const { resolved } = resolveRecipe(loadRecipe(options.recipe));
  if (options.json) {
    console.log(JSON.stringify(resolved, null, 2));
    return 0;
  }
  const paths = Object.keys(resolved.light);
  const width = Math.max(...paths.map((tokenPath) => tokenPath.length));
  console.log(`${pad('token', width)}  ${pad('light', 11)}  dark`);
  paths.forEach((tokenPath) => {
    console.log(`${pad(tokenPath, width)}  ${pad(resolved.light[tokenPath], 11)}  ${resolved.dark[tokenPath]}`);
  });
  console.log(`\n${paths.length} tokens x ${MODES.length} modes`);
  return 0;
}

function commandCheck(options) {
  const recipe = loadRecipe(options.recipe);
  const { resolved } = resolveRecipe(recipe);
  const rows = checkContrast(resolved, targetsForRecipe(recipe, loadTargetsFile(options.targets)));
  const failures = rows.filter((row) => !row.pass);
  if (options.json) {
    console.log(JSON.stringify({ rows, failures: failures.length, strict: options.strict }, null, 2));
  } else {
    const width = Math.max(...rows.map((row) => row.tokenPath.length));
    rows.forEach((row) => {
      const ratio = row.ratio === null ? 'n/a' : `${row.ratio.toFixed(2)}:1`;
      console.log(`${row.pass ? ' ok ' : 'FAIL'}  ${pad(row.mode, 5)} ${pad(row.tokenPath, width)}  ${pad(row.value, 11)} vs ${pad(row.againstValue, 11)} ${pad(ratio, 8)} (target ${row.target}:1)`);
    });
    const summary = `${rows.length - failures.length}/${rows.length} contrast checks pass`;
    console.log(failures.length ? `\n${summary}; ${failures.length} failing (warn-only${options.strict ? '' : '; --strict to fail'})` : `\n${summary}.`);
  }
  return options.strict && failures.length ? 1 : 0;
}

function commandEmit(options) {
  if (!options.out) throw new Error('emit needs --out <dir>');
  const recipe = loadRecipe(options.recipe);
  const { tree, resolved } = resolveRecipe(recipe);
  const baseTree = loadTokens();
  const baseResolved = resolveModes(baseTree);

  const outputs = { 'tokens.json': `${JSON.stringify(tree, null, 2)}\n` };
  for (const mode of MODES) {
    outputs[`resolved.${mode}.json`] = emitResolved(resolved, mode);
    outputs[path.join('figma', `${mode}.tokens.json`)] = `${JSON.stringify(emitFigma(tree, mode), null, 2)}\n`;
  }
  outputs[path.join('css', 'variables.css')] = emitCss(tree, resolved);
  outputs['overrides.scss'] = emitScssOverrides(baseTree, baseResolved, tree, resolved);
  outputs[path.join('figma', 'name-map.json')] = `${JSON.stringify(emitNameMap(tree), null, 2)}\n`;

  Object.entries(outputs).forEach(([file, content]) => {
    const target = path.join(options.out, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  });

  const failures = checkContrast(resolved, targetsForRecipe(recipe)).filter((row) => !row.pass).length;
  if (options.json) {
    console.log(JSON.stringify({ out: options.out, files: Object.keys(outputs), contrastFailures: failures }, null, 2));
  } else {
    console.log(`Wrote ${Object.keys(outputs).length} files to ${options.out}:`);
    Object.keys(outputs).forEach((file) => console.log(`  - ${file}`));
    if (failures) console.log(`\n⚠ ${failures} contrast targets failing (warn-only) — run check for detail.`);
  }
  return 0;
}

async function commandGenerate(options) {
  if (options.write && !options.recipe) throw new Error('generate --write needs --recipe <file> to write back to');
  const { generateRecipe } = await import('./engine/derive.mjs');
  const { recipe, rows } = await generateRecipe(loadRecipe(options.recipe));
  const recipeJson = `${JSON.stringify(recipe, null, 2)}\n`;
  if (options.json) {
    console.log(JSON.stringify({ recipe, rows, written: options.write ? options.recipe : null }, null, 2));
    if (options.write) fs.writeFileSync(options.recipe, recipeJson);
    return 0;
  }
  const width = Math.max(...rows.map((row) => row.tokenPath.length));
  rows.forEach((row) => {
    if (row.locked) {
      console.log(`lock  ${pad('', 5)} ${pad(row.tokenPath, width)}  kept — slot has an override`);
      return;
    }
    const detail = row.method === 'contrast'
      ? `${pad(row.ratio.toFixed(2), 5)}:1 vs ${row.against.split('.').pop()} (requested ${row.request}:1, floor ${row.floor}:1)`
      : 'mix rule';
    console.log(`${row.method === 'contrast' ? 'solve' : 'mix '}  ${pad(row.mode, 5)} ${pad(row.tokenPath, width)}  ${pad(row.before, 11)} -> ${pad(row.value, 11)} ${detail}`);
  });
  if (options.write) {
    fs.writeFileSync(options.recipe, recipeJson);
    console.log(`\nWrote the generated palette back to ${options.recipe}`);
  } else {
    console.log(`\n${recipeJson}`);
  }
  return 0;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
};

/**
 * The human UI's local server: a hand-rolled node:http static server (zero
 * deps — R2/R3). Mounts this package at /colour-picker/ and the tokens
 * package at /colour-picker-tokens/ — the same paths the sdc Storybook
 * serves them at via staticDirs, so ui/index.html's import map works
 * identically in both contexts. POST /generate is the P5 containment
 * boundary: the UI sends a recipe, this process runs Leonardo
 * (engine/derive.mjs) and returns the updated recipe — the browser never
 * loads a Leonardo byte. serve-config.json advertises the capability; the
 * Storybook-static copy has no config, so its Generate button stays off.
 */
async function commandServe(options) {
  const { createServer } = await import('node:http');
  const packageRoot = path.dirname(fileURLToPath(import.meta.url));
  const tokensRoot = path.dirname(fileURLToPath(import.meta.resolve('@civictheme/tokens/package.json')));
  const mounts = { '/colour-picker/': packageRoot, '/colour-picker-tokens/': tokensRoot };

  const server = createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    if (request.method === 'POST' && url.pathname === '/generate') {
      try {
        let body = '';
        for await (const chunk of request) body += chunk;
        const { generateRecipe } = await import('./engine/derive.mjs');
        const result = await generateRecipe(JSON.parse(body));
        response.writeHead(200, { 'content-type': MIME['.json'] });
        return response.end(JSON.stringify(result));
      } catch (error) {
        response.writeHead(400, { 'content-type': MIME['.json'] });
        return response.end(JSON.stringify({ error: error.message }));
      }
    }
    if (url.pathname === '/' || url.pathname === '/colour-picker/ui/') {
      response.writeHead(302, { location: '/colour-picker/ui/index.html' });
      return response.end();
    }
    if (url.pathname === '/colour-picker/ui/serve-config.json') {
      response.writeHead(200, { 'content-type': MIME['.json'] });
      return response.end(JSON.stringify({ storybookUrl: options.storybookUrl ?? null, generate: true }));
    }
    const mount = Object.keys(mounts).find((prefix) => url.pathname.startsWith(prefix));
    const file = mount && path.join(mounts[mount], decodeURIComponent(url.pathname.slice(mount.length)));
    if (!file || !path.resolve(file).startsWith(mounts[mount] + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404, { 'content-type': 'text/plain' });
      return response.end('Not found');
    }
    response.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    return response.end(fs.readFileSync(file));
  });

  const port = options.port === undefined ? 8420 : Number(options.port);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error(`Invalid --port ${JSON.stringify(options.port)}`);
  await new Promise((ready, failed) => server.listen(port, '127.0.0.1').once('listening', ready).once('error', failed));
  const address = `http://127.0.0.1:${server.address().port}/`;
  if (options.json) console.log(JSON.stringify({ url: address, storybookUrl: options.storybookUrl ?? null }, null, 2));
  else console.log(`Colour picker UI at ${address}${options.storybookUrl ? ` (previews from ${options.storybookUrl})` : ' (no --storybook-url: previews probe the current origin, else swatch-only)'}`);
  return new Promise(() => {});
}

function commandInitSkill(options) {
  const source = path.join(path.dirname(fileURLToPath(import.meta.url)), 'skills', 'colour-picker');
  const target = path.resolve('.claude', 'skills', 'colour-picker');
  fs.cpSync(source, target, { recursive: true });
  if (options.json) console.log(JSON.stringify({ installed: target }, null, 2));
  else console.log(`Installed the colour-picker skill to ${target}`);
  return 0;
}

const COMMANDS = { resolve: commandResolve, check: commandCheck, emit: commandEmit, generate: commandGenerate, serve: commandServe, 'init-skill': commandInitSkill };

let options;
try {
  options = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(`${error.message}\n\n${USAGE}`);
  process.exit(2);
}
if (!options.command || !COMMANDS[options.command]) {
  console.error(USAGE);
  process.exit(options.command ? 2 : 0);
}
try {
  process.exit(await COMMANDS[options.command](options));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
