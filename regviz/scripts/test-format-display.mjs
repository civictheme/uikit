/**
 * Manual test for formatDisplayName function
 */


import {formatDisplayName} from "../lib/utils.mjs";

// Test cases
const testCases = [
  { input: 'set--main--components', expected: 'Main branch (components)' },
  { input: 'set--current--feature-branch--components', expected: 'Branch: feature-branch (components)' },
  { input: 'set--release--1.2.3--components', expected: 'Release: 1.2.3 (components)' },
  { input: 'set--main--sdc', expected: 'Main branch (SDC)' },
  { input: 'set--current--feature-branch--custom', expected: 'Branch: feature-branch (custom)' },
  { input: 'some-arbitrary-name', expected: 'some-arbitrary-name' },
  { input: 'set--current', expected: 'set--current' }
];

// Run tests and output results
console.log('Testing formatDisplayName function:');
console.log('==================================');

testCases.forEach(({ input, expected }) => {
  const actual = formatDisplayName(input);
  const passed = actual === expected;

  console.log(`Input: "${input}"`);
  console.log(`Expected: "${expected}"`);
  console.log(`Actual: "${actual}"`);
  console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('----------------------------------');
});

// Summary
const passedCount = testCases.filter(({ input, expected }) =>
  formatDisplayName(input) === expected
).length;

console.log(`Summary: ${passedCount}/${testCases.length} tests passed`);
