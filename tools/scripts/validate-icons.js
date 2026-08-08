#!/usr/bin/env node

/**
 * Validates that every icon referenced by name actually exists.
 *
 * The icon component inlines its SVG through Twig's source() with
 * ignore_missing set, and is wrapped in `{% if source is not empty %}`. A name
 * that does not resolve therefore renders nothing at all, raises no error and
 * fails no test — a mistyped icon is invisible until someone looks at the page.
 *
 * This catches those references at build time instead, where a name is written
 * as a literal in a template, story or test.
 */

import fs from 'fs';
import path from 'path';

const PACKAGES = [
  path.join(import.meta.dirname, '../../packages/sdc'),
  path.join(import.meta.dirname, '../../packages/twig'),
];

const SCANNED_EXTENSIONS = ['.twig', '.js'];

// Matches `icon: 'name'` and `symbol: "name"` where the value is a literal.
// The negative lookbehind keeps `icon_placement:` and `icon_class:` out, and a
// non-literal value such as `symbol: icon` simply does not match.
const REFERENCE_PATTERN = /(?<![\w-])(icon|symbol)\s*:\s*(['"])([^'"]*)\2/g;

// ANSI color codes for terminal output.
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

/**
 * Returns the set of icon names available to a package.
 */
function availableIcons(packageDir) {
  const iconsDir = path.join(packageDir, 'assets/icons');
  if (!fs.existsSync(iconsDir)) {
    return null;
  }

  return new Set(
    fs.readdirSync(iconsDir)
      .filter((entry) => entry.endsWith('.svg'))
      .map((entry) => path.basename(entry, '.svg')),
  );
}

/**
 * Recursively find files worth scanning under a directory.
 */
function findFiles(dir) {
  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '__snapshots__') {
        results.push(...findFiles(fullPath));
      }
    } else if (SCANNED_EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Collects unknown icon references from a single file.
 */
function validateFile(filePath, icons) {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    for (const match of line.matchAll(REFERENCE_PATTERN)) {
      const [, property, , name] = match;

      // An empty value is how templates opt out of rendering an icon.
      if (name === '') {
        continue;
      }

      if (!icons.has(name)) {
        errors.push({
          filePath,
          line: index + 1,
          message: `${property}: '${name}' does not match any icon in assets/icons`,
        });
      }
    }
  });

  return errors;
}

/**
 * Main validation function.
 */
function validate() {
  console.log(`${colors.blue}Validating icon references...${colors.reset}\n`);

  const rootDir = path.join(import.meta.dirname, '../..');
  const allErrors = [];

  for (const packageDir of PACKAGES) {
    const icons = availableIcons(packageDir);
    if (icons === null) {
      continue;
    }

    const files = findFiles(path.join(packageDir, 'components')).sort();
    const relDir = path.relative(rootDir, packageDir);
    console.log(`${colors.blue}Scanning ${relDir} (${files.length} files, ${icons.size} icons available)${colors.reset}`);

    for (const filePath of files) {
      allErrors.push(...validateFile(filePath, icons));
    }
  }

  console.log('');

  if (allErrors.length > 0) {
    console.log(`${colors.red}Found ${allErrors.length} error(s):${colors.reset}\n`);
    for (const error of allErrors) {
      const relPath = path.relative(rootDir, error.filePath);
      console.log(`  ${colors.yellow}${relPath}:${error.line}${colors.reset}`);
      console.log(`    ${error.message}\n`);
    }
    console.log('─'.repeat(60));
    console.log(`${colors.red}✗ Icon validation failed with ${allErrors.length} error(s)${colors.reset}`);
    process.exit(1);
  } else {
    console.log('─'.repeat(60));
    console.log(`${colors.green}✓ All icon references resolve!${colors.reset}`);
    process.exit(0);
  }
}

validate();
