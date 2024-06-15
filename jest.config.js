module.exports = {
  transform: {
    '^.+\\.jsx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
      ],
    }],
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg|ico|woff|woff2|ttf|eot|webm|avi|mp4)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@storybook/addon-knobs)/)',
  ],
  coverageDirectory: '.logs/coverage',
  collectCoverageFrom: [
    '**/components/**/*.{js,jsx,twig}',
    '!**/*.stories.js',
  ],
};
