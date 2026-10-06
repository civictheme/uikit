/**
 * Figma → code ingest (plan §3.2, Phase 2c).
 *
 * Consumes the two files of a Figma native "Export mode" dump of the Colour
 * collection (Light + Dark — the UI downloads them together as Colour.zip)
 * and merges the values back into tokens/*.json, so designer edits in Figma
 * flow to code. MERGE, never regeneration: only `$value` and the
 * io.civictheme.modes dark override are rewritten; `$description` and every
 * other extension (the io.civictheme.* scss bridge, skipped lists) are
 * preserved — the export does not carry them.
 *
 * Export facts this relies on (verified against the real 430-variable dump):
 * aliases arrive as DTCG reference strings with dot-separated Figma paths
 * ("{Interaction.Interaction Text}"); literals arrive as DTCG 2025.10 colour
 * objects with full-float components; each file's doc-level $extensions
 * carries com.figma.modeName. com.figma.* extensions are dropped on ingest.
 *
 * Drift guard: any unknown, missing or renamed variable, a mode-file mix-up,
 * or a non-srgb colour fails the whole run loudly — nothing is written.
 *
 * CLI: node build/figma-ingest.mjs <Light.tokens.json> <Dark.tokens.json>
 *        [--out <dir>] [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { PACKAGE_DIR, MODES_EXTENSION } from './lib.mjs';
import { figmaNameFor, tokenPathFor } from './figma-names.mjs';

const TOKENS_DIR = path.join(PACKAGE_DIR, 'tokens');
const MODE_NAME_EXTENSION = 'com.figma.modeName';

const round6 = (value) => Math.round(value * 1e6) / 1e6;

function isToken(node) {
  return Boolean(node) && typeof node === 'object' && '$value' in node;
}

/** Flattens an export document to a `figmaName -> $value` map. */
function flattenExport(doc, failures, label) {
  const values = new Map();
  const walk = (node, segments) => {
    if (isToken(node)) {
      if (node.$type !== 'color') failures.push(`${label}: "${segments.join('/')}" has $type "${node.$type}", expected "color"`);
      values.set(segments.join('/'), node.$value);
      return;
    }
    if (node && typeof node === 'object') {
      Object.entries(node).forEach(([key, child]) => {
        if (!key.startsWith('$')) walk(child, [...segments, key]);
      });
    }
  };
  walk(doc, []);
  return values;
}

/**
 * An export $value in the committed-file form: alias strings become
 * `{token.path}` references; colour objects are byte-rounded and rebuilt to
 * the file convention (6-decimal components, lowercase hex).
 */
function internalValue(exportValue, failures, context) {
  if (typeof exportValue === 'string') {
    if (!/^\{[^{}]+\}$/.test(exportValue)) {
      failures.push(`${context}: unrecognised string value ${JSON.stringify(exportValue)}`);
      return null;
    }
    // Figma variable names never contain dots, so the dot-separated alias
    // path translates to the slash-separated name unambiguously.
    const figmaName = exportValue.slice(1, -1).replaceAll('.', '/');
    try {
      return `{${tokenPathFor(figmaName)}}`;
    } catch (error) {
      failures.push(`${context}: alias target ${error.message}`);
      return null;
    }
  }
  if (!exportValue || typeof exportValue !== 'object' || !Array.isArray(exportValue.components)) {
    failures.push(`${context}: unrecognised value ${JSON.stringify(exportValue)}`);
    return null;
  }
  if (exportValue.colorSpace !== 'srgb') {
    failures.push(`${context}: colorSpace "${exportValue.colorSpace}" is not srgb`);
    return null;
  }
  const bytes = exportValue.components.map((channel) => Math.round(channel * 255));
  const hex = `#${bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  return {
    colorSpace: 'srgb',
    components: bytes.map((byte) => round6(byte / 255)),
    alpha: round6(exportValue.alpha ?? 1),
    hex,
  };
}

function sameValue(a, b) {
  if (typeof a === 'string' || typeof b === 'string') return a === b;
  return a.hex === b.hex && a.alpha === b.alpha;
}

function describeValue(value) {
  if (value === null || value === undefined) return 'none';
  if (typeof value === 'string') return value;
  return value.alpha === 1 ? value.hex : `${value.hex}/alpha ${value.alpha}`;
}

function loadExportFile(file, expectedModeName, failures) {
  const doc = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const modeName = doc.$extensions?.[MODE_NAME_EXTENSION];
  if (modeName && modeName !== expectedModeName) {
    failures.push(`${path.basename(file)}: carries ${MODE_NAME_EXTENSION} "${modeName}" but was given as the ${expectedModeName} file — mode files swapped?`);
  }
  return flattenExport(doc, failures, path.basename(file));
}

/**
 * Runs the ingest. Returns `{ changes, tokenCount, files }` on success;
 * throws with every problem listed (and writes nothing) on any failure.
 */
export function ingest({ lightFile, darkFile, outDir = TOKENS_DIR, dryRun = false }) {
  const failures = [];
  const modeExports = {
    light: loadExportFile(lightFile, 'Light', failures),
    dark: loadExportFile(darkFile, 'Dark', failures),
  };

  const sourceFiles = fs.readdirSync(TOKENS_DIR).filter((file) => file.endsWith('.json')).sort();
  const consumed = new Set();
  const changes = [];
  let tokenCount = 0;
  const outputs = [];

  sourceFiles.forEach((file) => {
    const tree = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, file), 'utf-8'));
    const walk = (node, segments) => {
      if (isToken(node)) {
        tokenCount += 1;
        const tokenPath = segments.join('.');
        const figmaName = figmaNameFor(tokenPath);
        consumed.add(figmaName);
        if (!modeExports.light.has(figmaName) || !modeExports.dark.has(figmaName)) {
          const missingFrom = ['light', 'dark'].filter((mode) => !modeExports[mode].has(figmaName));
          failures.push(`${tokenPath}: "${figmaName}" missing from the ${missingFrom.join(' and ')} export — deleted or renamed in Figma?`);
          return;
        }
        const light = internalValue(modeExports.light.get(figmaName), failures, `${tokenPath} (light)`);
        const dark = internalValue(modeExports.dark.get(figmaName), failures, `${tokenPath} (dark)`);
        if (light === null || dark === null) return;

        const oldLight = node.$value;
        const oldDark = node.$extensions?.[MODES_EXTENSION]?.dark ?? node.$value;
        if (!sameValue(light, oldLight)) changes.push(`${tokenPath} light: ${describeValue(oldLight)} -> ${describeValue(light)}`);
        if (!sameValue(dark, oldDark)) changes.push(`${tokenPath} dark: ${describeValue(oldDark)} -> ${describeValue(dark)}`);

        node.$value = light;
        const extensions = { ...node.$extensions };
        const hadDark = Boolean(extensions[MODES_EXTENSION] && 'dark' in extensions[MODES_EXTENSION]);
        // Merge semantics preserve each token's existing per-mode structure:
        // an explicit dark entry stays explicit even when it now equals light
        // (some committed tokens record an equal dark deliberately, e.g.
        // interaction-focus); one is only ADDED when the modes now diverge.
        if (!sameValue(light, dark) || hadDark) {
          // Keep the modes extension in its conventional first position.
          const rest = { ...extensions };
          delete rest[MODES_EXTENSION];
          const modes = { ...extensions[MODES_EXTENSION], dark };
          Object.keys(extensions).forEach((key) => delete extensions[key]);
          extensions[MODES_EXTENSION] = modes;
          Object.assign(extensions, rest);
        }
        if (Object.keys(extensions).length) node.$extensions = extensions;
        return;
      }
      if (node && typeof node === 'object') {
        Object.entries(node).forEach(([key, child]) => {
          if (!key.startsWith('$')) walk(child, [...segments, key]);
        });
      }
    };
    walk(tree, []);
    outputs.push([file, `${JSON.stringify(tree, null, 2)}\n`]);
  });

  ['light', 'dark'].forEach((mode) => {
    modeExports[mode].forEach((value, figmaName) => {
      if (!consumed.has(figmaName)) {
        let hint = '';
        try {
          tokenPathFor(figmaName);
        } catch (error) {
          hint = ` (${error.message})`;
        }
        failures.push(`${mode} export: variable "${figmaName}" maps to no committed token — added or renamed in Figma?${hint}`);
      }
    });
  });

  if (failures.length) {
    throw new Error(`Figma ingest FAILED, nothing written (${failures.length} problems):\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  }

  if (!dryRun) {
    fs.mkdirSync(outDir, { recursive: true });
    outputs.forEach(([file, content]) => fs.writeFileSync(path.join(outDir, file), content));
  }
  return { changes, tokenCount, files: sourceFiles };
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isCli) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const outFlag = args.indexOf('--out');
  const outDir = outFlag === -1 ? undefined : path.resolve(args[outFlag + 1]);
  const positional = args.filter((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--out');
  if (positional.length !== 2) {
    console.error(`Usage: node ${path.relative(process.cwd(), fileURLToPath(import.meta.url))} <Light.tokens.json> <Dark.tokens.json> [--out <dir>] [--dry-run]`);
    process.exit(2);
  }
  try {
    const result = ingest({ lightFile: positional[0], darkFile: positional[1], outDir, dryRun });
    const target = dryRun ? '(dry run — nothing written)' : `-> ${path.relative(process.cwd(), outDir ?? TOKENS_DIR)}`;
    console.log(`Figma ingest: ${result.tokenCount} tokens matched across ${result.files.join(', ')} ${target}`);
    if (result.changes.length) {
      console.log(`${result.changes.length} value changes:`);
      result.changes.forEach((change) => console.log(`  - ${change}`));
    } else {
      console.log('No value changes — Figma and code are in sync.');
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
