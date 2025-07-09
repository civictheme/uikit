export default {
  testEnvironment: 'jsdom',
  projects: [
    '<rootDir>/packages/twig',
    '<rootDir>/packages/sdc',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg|ico|woff|woff2|ttf|eot|webm|avi|mp4)$': 'jest-transform-stub',
  },
  coverageDirectory: '.logs/coverage',
  collectCoverageFrom: [
    '**/tests/**/*.{js,jsx,twig}',
  ],
  setupFiles: ['<rootDir>/tests/jest.helpers.js'],
};
