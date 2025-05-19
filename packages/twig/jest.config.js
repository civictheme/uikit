export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg|ico|woff|woff2|ttf|eot|webm|avi|mp4)$': 'jest-transform-stub',
  },
  coverageDirectory: '.logs/coverage',
  collectCoverageFrom: [
    '**/components/**/*.{js,jsx,twig}',
    '**/tests/**/*.{js,jsx,twig}',
    '!**/*.stories.js',
  ],
  // Use a custom jest helper for the twig package
  setupFiles: ['<rootDir>/tests/jest.helpers.js'],
};
