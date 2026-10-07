#!/usr/bin/env node
/**
 * The AI/maintainer side application (R4): recipe in, resolved values /
 * contrast QA / build outputs out. Zero dependencies — hand-rolled args,
 * node:* only. Exit codes: 0 success (contrast failures WARN, never block —
 * recorded decision), 1 failure or `check --strict` with failing targets,
 * 2 usage. `generate` (Leonardo) arrives at P5; `serve` (human UI) at P4;
 * `init-skill` at P3 — each lands with the thing it operates on.
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
  init-skill  Install the colour-picker AI skill into ./.claude/skills/

Options:
  --recipe <file>    Recipe JSON (default: identity — the stock tokens)
  --out <dir>        emit: output directory (required)
  --targets <file>   check: alternative targets JSON ({ "targets": { ... } })
  --json             Machine-readable output
  --strict           check: exit 1 when any contrast target fails
`;

function parseArgs(argv) {
  const options = { command: argv[0], json: false, strict: false };
  const flags = { '--recipe': 'recipe', '--out': 'out', '--targets': 'targets' };
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') options.json = true;
    else if (arg === '--strict') options.strict = true;
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

function commandInitSkill(options) {
  const source = path.join(path.dirname(fileURLToPath(import.meta.url)), 'skills', 'colour-picker');
  const target = path.resolve('.claude', 'skills', 'colour-picker');
  fs.cpSync(source, target, { recursive: true });
  if (options.json) console.log(JSON.stringify({ installed: target }, null, 2));
  else console.log(`Installed the colour-picker skill to ${target}`);
  return 0;
}

const COMMANDS = { resolve: commandResolve, check: commandCheck, emit: commandEmit, 'init-skill': commandInitSkill };

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
  process.exit(COMMANDS[options.command](options));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
