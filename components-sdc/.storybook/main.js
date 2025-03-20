import dependencies from './ct-dependencies'; // eslint-disable-line import/no-unresolved

const config = {
  stories: ['../components/**/*.stories.js'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@whitespace/storybook-addon-html',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: [{ from: '../dist/assets', to: '/assets' }, './static'],
  viteFinal: (config) => {
    // Add new imports to the stories.js files
    config.plugins.push({
      name: 'sdc-stories',
      enforce: 'pre',
      transform: (code, id) => {
        if (id.endsWith('.stories.js')) {
          // Find and import all dependencies from a story (and it's referenced twig files)
          const loadedDependencies = dependencies.getDeps(id).map(i => `import '${i}';`).join('\n');
          return {
            code: `${loadedDependencies}\n${code}`,
            map: null,
          };
        }
        return null;
      },
    });

    config.plugins.push({
      name: 'sdc-js-wrapper',
      transform: (code, id) => {
        // Only process js files in the component directory that are not stories.
        if (id.indexOf('/components/') >= 0 && id.endsWith('.js') && !id.endsWith('stories.js') && !id.endsWith('stories.data.js')) {
          return {
            code: `document.addEventListener('DOMContentLoaded', () => {\n${code}\n});`,
            map: null
          };
        }
        return null;
      }
    })

    return config;
  },
}
export default config
