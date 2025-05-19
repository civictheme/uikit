#!/usr/bin/env node

/**
 * Tests for the components-update-sdc.js script.
 *
 * This script validates that the header docblock generation works correctly.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
// eslint-disable-next-line no-unused-vars
import yaml from 'js-yaml';

// Get the directory name using ES modules approach
// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

// Define test directories
const scriptPath = path.join(__dirname, '../components-update-sdc.js');
const fixturesDir = path.join(__dirname, 'fixtures');
const tempDir = path.join(__dirname, '.temp');

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Create copies of fixtures for testing
function setupTests() {
  // eslint-disable-next-line no-console
  console.log('Setting up test environment...');

  // Clean temp directory
  if (fs.existsSync(tempDir)) {
    const files = fs.readdirSync(tempDir);
    for (const file of files) {
      fs.unlinkSync(path.join(tempDir, file));
    }
  } else {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Copy fixtures to temp directory
  const fixtures = fs.readdirSync(fixturesDir);
  for (const fixture of fixtures) {
    const fixtureSource = path.join(fixturesDir, fixture);
    const fixtureDest = path.join(tempDir, fixture);
    fs.copyFileSync(fixtureSource, fixtureDest);
  }

  // eslint-disable-next-line no-console
  console.log('Test environment set up successfully.');
}

// Run script on test fixtures
function runScript() {
  // eslint-disable-next-line no-console
  console.log('Running components-update-sdc.js on test fixtures...');
  try {
    const mySliderYamlPath = path.join(tempDir, 'my-slider.component.yml');
    execSync(`node ${scriptPath} ${mySliderYamlPath}`, { stdio: 'inherit' });
    // eslint-disable-next-line no-console
    console.log('Script executed successfully.');
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Script execution failed:', error);
    return false;
  }
}

// Check the generated file against expected output
function verifyDocblocks() {
  // eslint-disable-next-line no-console
  console.log('\nVerifying generated file matches expected file...');

  // Test Case: Just compare the files directly
  const generatedFile = path.join(tempDir, 'my-slider.twig');
  const expectedFile = path.join(fixturesDir, 'my-slider.expected.twig');

  if (!fs.existsSync(generatedFile)) {
    // eslint-disable-next-line no-console
    console.error('ERROR: Generated file not found:', generatedFile);
    return false;
  }

  if (!fs.existsSync(expectedFile)) {
    // eslint-disable-next-line no-console
    console.error('ERROR: Expected file not found:', expectedFile);
    return false;
  }

  // Read file contents without any processing
  const generatedContent = fs.readFileSync(generatedFile, 'utf8');
  const expectedContent = fs.readFileSync(expectedFile, 'utf8');

  // Simple string comparison
  if (generatedContent === expectedContent) {
    // eslint-disable-next-line no-console
    console.log('✅ Generated file exactly matches expected file');
    return true;
  }
  // eslint-disable-next-line no-console
  console.log('❌ Files do not match');

  // Find the position of the first difference to help diagnose
  let diffPosition = 0;
  while (diffPosition < generatedContent.length
           && diffPosition < expectedContent.length
           && generatedContent[diffPosition] === expectedContent[diffPosition]) {
    diffPosition++;
  }

  // Show some context around the difference
  const start = Math.max(0, diffPosition - 20);
  const generatedContext = generatedContent.substring(start, diffPosition + 80);
  const expectedContext = expectedContent.substring(start, diffPosition + 80);

  // eslint-disable-next-line no-console
  console.log(`\nFiles differ at position ${diffPosition}:`);
  // eslint-disable-next-line no-console
  console.log('\nGenerated content:');
  // eslint-disable-next-line no-console
  console.log(generatedContext);
  // eslint-disable-next-line no-console
  console.log('\nExpected content:');
  // eslint-disable-next-line no-console
  console.log(expectedContext);

  // Show character codes to help spot whitespace issues
  if (diffPosition < generatedContent.length && diffPosition < expectedContent.length) {
    // eslint-disable-next-line no-console
    console.log(`\nCharacter codes at difference: Generated=${generatedContent.charCodeAt(diffPosition)}, Expected=${expectedContent.charCodeAt(diffPosition)}`);
  } else if (diffPosition >= generatedContent.length) {
    // eslint-disable-next-line no-console
    console.log('\nGenerated content is shorter than expected');
  } else {
    // eslint-disable-next-line no-console
    console.log('\nGenerated content is longer than expected');
  }

  return false;
}

// Main test function
function runTests() {
  // eslint-disable-next-line no-console
  console.log('===================================');
  // eslint-disable-next-line no-console
  console.log('TESTING COMPONENTS-UPDATE-SDC.JS');
  // eslint-disable-next-line no-console
  console.log('===================================\n');

  setupTests();

  const scriptRunSuccessful = runScript();
  if (!scriptRunSuccessful) {
    // eslint-disable-next-line no-console
    console.error('\nTESTS FAILED: Script execution error');
    process.exit(1);
  }

  const filesMatch = verifyDocblocks();

  // eslint-disable-next-line no-console
  console.log('\n===================================');
  if (filesMatch) {
    // eslint-disable-next-line no-console
    console.log('✅ ALL TESTS PASSED');
    // eslint-disable-next-line no-console
    console.log('===================================');
    process.exit(0);
  } else {
    // eslint-disable-next-line no-console
    console.log('❌ SOME TESTS FAILED');
    // eslint-disable-next-line no-console
    console.log('===================================');
    process.exit(1);
  }
}

runTests();
