module.exports = {
  transform: {
    '^.+\\.jsx?$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
      ],
    }],
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg|ico|woff|woff2|ttf|eot|webm|avi|mp4|twig)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@storybook/addon-knobs)/)',
  ],
};
