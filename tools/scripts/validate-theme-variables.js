#!/usr/bin/env node

/**
 * Validates that every `var(--ct-*)` reference in the compiled component CSS
 * is declared somewhere: in the token-generated + Sass-emitted
 * `dist/civictheme.variables.css`, or as a custom-property declaration in any
 * scanned stylesheet.
 *
 * This is the 2.x colour-token coverage gate. It catches the "de-themed to
 * an undefined property" failure class: a component consuming a custom
 * property that no longer exists silently falls back to initial/inherited
 * values instead of failing the build.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGES = ['sdc', 'twig'];

// Shipped bundles to scan for references on top of the per-component CSS.
// Stories/Storybook bundles are development-only copies and stay out.
const DIST_FILES = {
  sdc: ['civictheme.base.css'],
  twig: ['civictheme.css'],
};

// ANSI colour codes for terminal output.
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

const DECLARATION_PATTERN = /(--ct-[a-z0-9-]+)\s*:/g;
const REFERENCE_PATTERN = /var\((--ct-[a-z0-9-]+)[),]/g;

function* cssFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* cssFiles(entryPath);
    } else if (entry.name.endsWith('.css')) {
      yield entryPath;
    }
  }
}

let overallProblems = 0;

PACKAGES.forEach((pkg) => {
  const packageDir = path.join(__dirname, '../../packages', pkg);
  const variablesFile = path.join(packageDir, 'dist', 'civictheme.variables.css');

  const files = [...cssFiles(path.join(packageDir, 'components'))];
  DIST_FILES[pkg].forEach((file) => {
    const distPath = path.join(packageDir, 'dist', file);
    if (fs.existsSync(distPath)) {
      files.push(distPath);
    }
  });

  const defined = new Set();
  for (const match of fs.readFileSync(variablesFile, 'utf8').matchAll(DECLARATION_PATTERN)) {
    defined.add(match[1]);
  }
  files.forEach((file) => {
    for (const match of fs.readFileSync(file, 'utf8').matchAll(DECLARATION_PATTERN)) {
      defined.add(match[1]);
    }
  });

  let packageProblems = 0;
  console.log(`${colors.blue}Checking var(--ct-*) coverage: packages/${pkg}${colors.reset}`);
  files.forEach((file) => {
    const missing = new Set();
    for (const match of fs.readFileSync(file, 'utf8').matchAll(REFERENCE_PATTERN)) {
      if (!defined.has(match[1])) {
        missing.add(match[1]);
      }
    }
    if (missing.size > 0) {
      packageProblems += missing.size;
      console.log(`  ${colors.red}${path.relative(packageDir, file)}: ${[...missing].join(', ')}${colors.reset}`);
    }
  });

  if (packageProblems === 0) {
    console.log(`  ${colors.green}✓ All references are declared (${files.length} files)${colors.reset}\n`);
  } else {
    console.log(`  ${colors.red}✗ ${packageProblems} undefined variable reference(s)${colors.reset}\n`);
  }
  overallProblems += packageProblems;
});

if (overallProblems > 0) {
  console.log(`${colors.red}✗ Validation failed: ${overallProblems} undefined var(--ct-*) reference(s)${colors.reset}`);
  process.exit(1);
}
console.log(`${colors.green}✓ Every var(--ct-*) reference in compiled CSS is declared${colors.reset}`);
