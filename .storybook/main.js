const config = {
  stories: [
    '../components/**/*.stories.js',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
};

export default config;
