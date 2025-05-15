#!/usr/bin/env node
/**
 * Script to update version numbers across all package.json files.
 * 
 * Usage: node version-sync.js <version>
 * Example: node version-sync.js 1.10.1
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve(process.cwd(), '../../');
const PACKAGE_PATHS = [
  path.resolve(ROOT_DIR, 'package.json'),
  path.resolve(ROOT_DIR, 'packages/twig/package.json'),
  path.resolve(ROOT_DIR, 'packages/sdc/package.json'),
];

// Get version from command line
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Error: Version number is required');
  console.error('Usage: node version-sync.js <version>');
  console.error('Example: node version-sync.js 1.10.1');
  process.exit(1);
}

// Validate semver format (basic validation)
const semverRegex = /^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;
if (!semverRegex.test(newVersion)) {
  console.error(`Error: "${newVersion}" is not a valid semver version`);
  process.exit(1);
}

// Update each package.json file
for (const packagePath of PACKAGE_PATHS) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const oldVersion = packageJson.version;
    
    packageJson.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log(`Updated ${path.relative(ROOT_DIR, packagePath)}: ${oldVersion} -> ${newVersion}`);
  } catch (error) {
    console.error(`Error updating ${packagePath}:`, error.message);
    process.exit(1);
  }
}

console.log(`\nSuccessfully updated all package versions to ${newVersion}`);