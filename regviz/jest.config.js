/**
 * Jest configuration for RegViz tests.
 */

export default {
  testEnvironment: 'node',
  transform: {}, // We're using ES modules, so no transform needed
  extensionsToTreatAsEsm: ['.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/regviz/tests/**/*.test.js'],
  collectCoverageFrom: [
    '**/regviz/lib/**/*.js',
    '**/regviz/index.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: '.logs/coverage-regviz',
  // Setup the transformIgnorePatterns to handle ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(inquirer|chalk|commander|inquirer-interrupted-prompt|@inquirer)/)'
  ],
};