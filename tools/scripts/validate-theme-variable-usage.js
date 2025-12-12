#!/usr/bin/env node

/**
 * Validates that all CSS variables defined in civictheme.variables.css
 * are actually used within the component CSS files and the base CSS file.
 *
 * Any variables that are defined but never used will be reported.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VARIABLES_FILE = path.join(
  __dirname,
  '../../packages/sdc/dist/civictheme.variables.css'
);

const BASE_CSS_FILE = path.join(
  __dirname,
  '../../packages/sdc/dist/civictheme.base.css'
);

const COMPONENTS_DIR = path.join(
  __dirname,
  '../../packages/sdc/components'
);

// ANSI colour codes for terminal output
const colours = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

/**
 * Extracts CSS variable names from the variables CSS file.
 * @param {string} content - CSS file content
 * @returns {Set<string>} Set of variable names (without the -- prefix)
 */
function extractDefinedVariables(content) {
  const variables = new Set();
  // Match CSS custom property definitions: --variable-name: value;
  const variablePattern = /--([\w-]+)\s*:/g;
  let match;

  while ((match = variablePattern.exec(content)) !== null) {
    variables.add(match[1]);
  }

  return variables;
}

/**
 * Finds all CSS files recursively in a directory.
 * @param {string} dir - Directory to search
 * @param {string[]} files - Accumulated file paths
 * @returns {string[]} Array of CSS file paths
 */
function findCssFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findCssFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extracts all variable usages from CSS content.
 * @param {string} content - CSS file content
 * @returns {Set<string>} Set of variable names used (without the -- prefix)
 */
function extractUsedVariables(content) {
  const usedVariables = new Set();
  // Match var(--variable-name) or var(--variable-name, fallback)
  const varPattern = /var\(\s*--([\w-]+)/g;
  let match;

  while ((match = varPattern.exec(content)) !== null) {
    usedVariables.add(match[1]);
  }

  return usedVariables;
}

/**
 * Checks which variables are used across all CSS files.
 * @param {string[]} cssFiles - Array of CSS file paths
 * @returns {Set<string>} Set of all used variable names
 */
function findAllUsedVariables(cssFiles) {
  const allUsed = new Set();

  for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const usedInFile = extractUsedVariables(content);
    usedInFile.forEach((v) => allUsed.add(v));
  }

  return allUsed;
}

/**
 * Main validation function.
 */
function validateVariableUsage() {
  console.log(`${colours.blue}Validating CSS variable usage...${colours.reset}\n`);

  // Read the variables file
  let variablesContent;
  try {
    variablesContent = fs.readFileSync(VARIABLES_FILE, 'utf8');
  } catch (error) {
    console.log(`${colours.red}Error reading variables file: ${error.message}${colours.reset}`);
    process.exit(1);
  }

  // Extract defined variables
  const definedVariables = extractDefinedVariables(variablesContent);
  console.log(`${colours.blue}Variables file:${colours.reset} ${VARIABLES_FILE}`);
  console.log(`Found ${colours.green}${definedVariables.size}${colours.reset} defined variables\n`);

  // Find all CSS files in components
  let cssFiles;
  try {
    cssFiles = findCssFiles(COMPONENTS_DIR);
  } catch (error) {
    console.log(`${colours.red}Error reading components directory: ${error.message}${colours.reset}`);
    process.exit(1);
  }

  console.log(`${colours.blue}Components directory:${colours.reset} ${COMPONENTS_DIR}`);
  console.log(`Found ${colours.green}${cssFiles.length}${colours.reset} CSS files\n`);

  // Add base CSS file to the list of files to check
  let baseCssContent = '';
  try {
    baseCssContent = fs.readFileSync(BASE_CSS_FILE, 'utf8');
    console.log(`${colours.blue}Base CSS file:${colours.reset} ${BASE_CSS_FILE}`);
  } catch (error) {
    console.log(`${colours.yellow}Warning: Could not read base CSS file: ${error.message}${colours.reset}\n`);
  }

  // Find all used variables from component CSS files
  const usedVariables = findAllUsedVariables(cssFiles);

  // Also check the base CSS file for variable usage
  if (baseCssContent) {
    const usedInBase = extractUsedVariables(baseCssContent);
    usedInBase.forEach((v) => usedVariables.add(v));
    console.log(`Found ${colours.green}${usedInBase.size}${colours.reset} variables used in base CSS file\n`);
  }

  // Also check the variables file itself (variables can reference other variables)
  const usedInVariables = extractUsedVariables(variablesContent);
  usedInVariables.forEach((v) => usedVariables.add(v));

  console.log(`Found ${colours.green}${usedVariables.size}${colours.reset} total unique variables used\n`);

  console.log('─'.repeat(60) + '\n');

  // Find unused variables
  const unusedVariables = [];

  for (const varName of definedVariables) {
    if (!usedVariables.has(varName)) {
      unusedVariables.push(varName);
    }
  }

  // Sort variables for consistent output
  unusedVariables.sort();

  // Report unused variables
  if (unusedVariables.length > 0) {
    console.log(`${colours.red}Unused variables:${colours.reset}\n`);
    unusedVariables.forEach((varName) => {
      console.log(`  ${colours.yellow}--${varName}${colours.reset}`);
    });
    console.log();
  }

  console.log('─'.repeat(60));

  // Summary
  if (unusedVariables.length > 0) {
    console.log(`${colours.red}✗ Found ${unusedVariables.length} unused variable(s)${colours.reset}`);
    process.exit(1);
  } else {
    console.log(`${colours.green}✓ All variables are used!${colours.reset}`);
    process.exit(0);
  }
}

// Run validation
validateVariableUsage();
