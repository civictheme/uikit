#!/usr/bin/env node

/**
 * Validates that all light theme variables have matching dark theme variables
 * and vice versa in the SCSS variables file.
 *
 * Pattern: $<component-identifier>-<theme>-<variable-identifier>
 * where <theme> is either 'light' or 'dark'
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VARIABLES_FILES = [
  path.join(
    __dirname,
    '../../packages/twig/components/00-base/_variables.components.scss'
  ),
  path.join(
    __dirname,
    '../../packages/sdc/components/00-base/_variables.components.scss'
  ),
];

// ANSI color codes for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

/**
 * Extracts theme variables from SCSS content
 * @param {string} content - SCSS file content
 * @returns {Object} Object with 'light' and 'dark' arrays of variable info
 */
function extractThemeVariables(content) {
  const lines = content.split('\n');
  const lightVariables = new Map();
  const darkVariables = new Map();

  // Pattern to match: $component-light-property or $component-dark-property
  const variablePattern = /^\$([a-zA-Z0-9_-]+)-(light|dark)-([a-zA-Z0-9_-]+)\s*:/;

  lines.forEach((line, index) => {
    const match = line.match(variablePattern);
    if (match) {
      const [, component, theme, property] = match;
      const variableName = `${component}-${theme}-${property}`;
      const baseKey = `${component}-${property}`; // Key without theme for matching

      const variableInfo = {
        name: variableName,
        component,
        property,
        line: index + 1,
        baseKey,
      };

      if (theme === 'light') {
        lightVariables.set(baseKey, variableInfo);
      } else if (theme === 'dark') {
        darkVariables.set(baseKey, variableInfo);
      }
    }
  });

  return { lightVariables, darkVariables };
}

/**
 * Finds unpaired variables
 * @param {Map} sourceVars - Variables to check
 * @param {Map} targetVars - Variables to match against
 * @param {string} sourceTheme - Name of source theme
 * @param {string} targetTheme - Name of target theme
 * @returns {Array} Array of unpaired variable info
 */
function findUnpairedVariables(sourceVars, targetVars, sourceTheme, targetTheme) {
  const unpaired = [];

  for (const [baseKey, varInfo] of sourceVars) {
    if (!targetVars.has(baseKey)) {
      unpaired.push({
        ...varInfo,
        missingTheme: targetTheme,
      });
    }
  }

  return unpaired;
}

/**
 * Validates a single file
 * @param {string} filePath - Path to the SCSS file
 * @returns {Object} Validation results
 */
function validateFile(filePath) {
  const fileName = path.basename(path.dirname(filePath));

  // Read the file
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return {
      fileName,
      filePath,
      error: error.message,
      hasErrors: true,
    };
  }

  // Extract variables
  const { lightVariables, darkVariables } = extractThemeVariables(content);

  // Find unpaired variables
  const lightWithoutDark = findUnpairedVariables(
    lightVariables,
    darkVariables,
    'light',
    'dark'
  );
  const darkWithoutLight = findUnpairedVariables(
    darkVariables,
    lightVariables,
    'dark',
    'light'
  );

  return {
    fileName,
    filePath,
    lightVariables,
    darkVariables,
    lightWithoutDark,
    darkWithoutLight,
    hasErrors: lightWithoutDark.length > 0 || darkWithoutLight.length > 0,
  };
}

/**
 * Main validation function
 */
function validateThemeVariables() {
  console.log(`${colors.blue}Validating SCSS theme variables...${colors.reset}\n`);

  let overallHasErrors = false;
  const results = [];

  // Validate each file
  VARIABLES_FILES.forEach((filePath) => {
    const result = validateFile(filePath);
    results.push(result);

    console.log(`${colors.blue}File: ${result.filePath}${colors.reset}`);

    if (result.error) {
      console.log(`${colors.red}Error reading file: ${result.error}${colors.reset}\n`);
      overallHasErrors = true;
      return;
    }

    console.log(`Found ${colors.green}${result.lightVariables.size}${colors.reset} light theme variables`);
    console.log(`Found ${colors.green}${result.darkVariables.size}${colors.reset} dark theme variables\n`);

    // Report unpaired variables
    if (result.lightWithoutDark.length > 0) {
      overallHasErrors = true;
      console.log(`${colors.red}Light variables missing dark counterparts:${colors.reset}\n`);
      result.lightWithoutDark.forEach((varInfo) => {
        console.log(
          `  ${colors.yellow}$${varInfo.name}${colors.reset} (line ${varInfo.line})`
        );
        console.log(`    Missing: ${colors.red}$${varInfo.component}-dark-${varInfo.property}${colors.reset}\n`);
      });
    }

    if (result.darkWithoutLight.length > 0) {
      overallHasErrors = true;
      console.log(`${colors.red}Dark variables missing light counterparts:${colors.reset}\n`);
      result.darkWithoutLight.forEach((varInfo) => {
        console.log(
          `  ${colors.yellow}$${varInfo.name}${colors.reset} (line ${varInfo.line})`
        );
        console.log(`    Missing: ${colors.red}$${varInfo.component}-light-${varInfo.property}${colors.reset}\n`);
      });
    }

    if (!result.hasErrors) {
      console.log(`${colors.green}✓ All theme variables are properly paired in this file!${colors.reset}\n`);
    }

    console.log('─'.repeat(60) + '\n');
  });

  // Final summary
  console.log('─'.repeat(60));
  if (overallHasErrors) {
    const totalUnpaired = results.reduce((sum, r) => {
      if (r.error) return sum;
      return sum + (r.lightWithoutDark?.length || 0) + (r.darkWithoutLight?.length || 0);
    }, 0);
    console.log(`${colors.red}✗ Validation failed: ${totalUnpaired} unpaired variable(s) found across ${results.length} file(s)${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✓ All theme variables are properly paired in all files!${colors.reset}`);
    process.exit(0);
  }
}

// Run validation
validateThemeVariables();
