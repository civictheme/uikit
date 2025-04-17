/**
 * Jest configuration for RegViz tests.
 */

export default {
  testEnvironment: 'node',
  transform: {}, // We're using ES modules, so no transform needed
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.mjs$': '$1'
  },
  testMatch: ['regviz/tests/**/*.test.mjs'],
  collectCoverageFrom: [
    '**/regviz/lib/**/*.mjs',
    '**/regviz/index.mjs',
    '!**/node_modules/**',
  ],
  coverageDirectory: '.logs/coverage-regviz',
  // Setup the transformIgnorePatterns to handle ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(inquirer|chalk|commander|inquirer-interrupted-prompt|@inquirer)/)'
  ],
};
