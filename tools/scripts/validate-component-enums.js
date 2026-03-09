#!/usr/bin/env node

/**
 * Validates that component YAML files have correct enum values for
 * known properties like 'theme' and 'vertical_spacing'.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENT_DIRS = [
  path.join(__dirname, '../../packages/sdc/components'),
  path.join(__dirname, '../../packages/twig/components'),
];

// Expected enum values for known properties (order-independent).
const EXPECTED_ENUMS = {
  theme: ['light', 'dark'],
  vertical_spacing: ['none', 'top', 'bottom', 'both'],
};

// ANSI color codes for terminal output.
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

/**
 * Recursively find all *.component.yml files under a directory.
 */
function findComponentFiles(dir) {
  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findComponentFiles(fullPath));
    } else if (entry.name.endsWith('.component.yml')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Recursively find properties with enum values in a schema object.
 * Looks for keys matching EXPECTED_ENUMS that have an 'enum' field.
 */
function findEnumProperties(obj, parentPath = '') {
  const found = [];

  if (!obj || typeof obj !== 'object') {
    return found;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (!value || typeof value !== 'object') {
      continue;
    }

    if (EXPECTED_ENUMS[key] && Array.isArray(value.enum)) {
      found.push({
        property: key,
        path: parentPath ? `${parentPath}.${key}` : key,
        actualEnum: value.enum,
      });
    }

    // Recurse into nested objects (e.g. nested properties).
    if (value.properties) {
      found.push(...findEnumProperties(value.properties, parentPath ? `${parentPath}.${key}` : key));
    }
  }

  return found;
}

/**
 * Validate a single component file.
 * Returns an array of error objects.
 */
function validateFile(filePath) {
  const errors = [];

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return [{ filePath, message: `Error reading file: ${error.message}` }];
  }

  let doc;
  try {
    doc = yaml.load(content);
  } catch (error) {
    return [{ filePath, message: `Error parsing YAML: ${error.message}` }];
  }

  if (!doc || !doc.props || !doc.props.properties) {
    return errors;
  }

  const enumProps = findEnumProperties(doc.props.properties);

  for (const { property, path: propPath, actualEnum } of enumProps) {
    const expected = EXPECTED_ENUMS[property];
    const actualSet = new Set(actualEnum);
    const expectedSet = new Set(expected);

    const missing = expected.filter((v) => !actualSet.has(v));
    const extra = actualEnum.filter((v) => !expectedSet.has(v));

    if (missing.length > 0 || extra.length > 0) {
      const parts = [];
      if (missing.length > 0) {
        parts.push(`missing: [${missing.join(', ')}]`);
      }
      if (extra.length > 0) {
        parts.push(`unexpected: [${extra.join(', ')}]`);
      }
      errors.push({
        filePath,
        message: `${propPath}: enum should be [${expected.join(', ')}], got [${actualEnum.join(', ')}] (${parts.join('; ')})`,
      });
    }
  }

  return errors;
}

/**
 * Main validation function.
 */
function validate() {
  console.log(`${colors.blue}Validating component YAML enum values...${colors.reset}\n`);

  const allErrors = [];

  for (const dir of COMPONENT_DIRS) {
    if (!fs.existsSync(dir)) {
      continue;
    }

    const files = findComponentFiles(dir).sort();
    const relDir = path.relative(path.join(__dirname, '../..'), dir);
    console.log(`${colors.blue}Scanning ${relDir} (${files.length} files)${colors.reset}`);

    for (const filePath of files) {
      const errors = validateFile(filePath);
      allErrors.push(...errors);
    }
  }

  console.log('');

  if (allErrors.length > 0) {
    const rootDir = path.join(__dirname, '../..');
    console.log(`${colors.red}Found ${allErrors.length} error(s):${colors.reset}\n`);
    for (const error of allErrors) {
      const relPath = path.relative(rootDir, error.filePath);
      console.log(`  ${colors.yellow}${relPath}${colors.reset}`);
      console.log(`    ${error.message}\n`);
    }
    console.log('─'.repeat(60));
    console.log(`${colors.red}✗ Component enum validation failed with ${allErrors.length} error(s)${colors.reset}`);
    process.exit(1);
  } else {
    console.log('─'.repeat(60));
    console.log(`${colors.green}✓ All component enum values are correct!${colors.reset}`);
    process.exit(0);
  }
}

validate();
