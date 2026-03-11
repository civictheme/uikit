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

   
  console.log('Test environment set up successfully.');
}

// Run script on test fixtures
function runScript() {
   
  console.log('Running components-update-sdc.js on test fixtures...');
  try {
    const mySliderYamlPath = path.join(tempDir, 'my-slider.component.yml');
    execSync(`node ${scriptPath} ${mySliderYamlPath}`, { stdio: 'inherit' });
     
    console.log('Script executed successfully.');
    return true;
  } catch (error) {
     
    console.error('Script execution failed:', error);
    return false;
  }
}

// Check the generated file against expected output
function verifyDocblocks() {
   
  console.log('\nVerifying generated file matches expected file...');

  // Test Case: Just compare the files directly
  const generatedFile = path.join(tempDir, 'my-slider.twig');
  const expectedFile = path.join(fixturesDir, 'my-slider.expected.twig');

  if (!fs.existsSync(generatedFile)) {
     
    console.error('ERROR: Generated file not found:', generatedFile);
    return false;
  }

  if (!fs.existsSync(expectedFile)) {
     
    console.error('ERROR: Expected file not found:', expectedFile);
    return false;
  }

  // Read file contents without any processing
  const generatedContent = fs.readFileSync(generatedFile, 'utf8');
  const expectedContent = fs.readFileSync(expectedFile, 'utf8');

  // Simple string comparison
  if (generatedContent === expectedContent) {
     
    console.log('✅ Generated file exactly matches expected file');
    return true;
  }
   
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

   
  console.log(`\nFiles differ at position ${diffPosition}:`);
   
  console.log('\nGenerated content:');
   
  console.log(generatedContext);
   
  console.log('\nExpected content:');
   
  console.log(expectedContext);

  // Show character codes to help spot whitespace issues
  if (diffPosition < generatedContent.length && diffPosition < expectedContent.length) {
     
    console.log(`\nCharacter codes at difference: Generated=${generatedContent.charCodeAt(diffPosition)}, Expected=${expectedContent.charCodeAt(diffPosition)}`);
  } else if (diffPosition >= generatedContent.length) {
     
    console.log('\nGenerated content is shorter than expected');
  } else {
     
    console.log('\nGenerated content is longer than expected');
  }

  return false;
}

// Main test function
function runTests() {
   
  console.log('===================================');
   
  console.log('TESTING COMPONENTS-UPDATE-SDC.JS');
   
  console.log('===================================\n');

  setupTests();

  const scriptRunSuccessful = runScript();
  if (!scriptRunSuccessful) {
     
    console.error('\nTESTS FAILED: Script execution error');
    process.exit(1);
  }

  const filesMatch = verifyDocblocks();

   
  console.log('\n===================================');
  if (filesMatch) {
     
    console.log('✅ ALL TESTS PASSED');
     
    console.log('===================================');
    process.exit(0);
  } else {
     
    console.log('❌ SOME TESTS FAILED');
     
    console.log('===================================');
    process.exit(1);
  }
}

runTests();
