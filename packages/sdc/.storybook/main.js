// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const getAbsolutePath = function (value) {
  return dirname(require.resolve(join(value, 'package.json')));
};
// Opt-in colour-picker mounting (the plugin's docs page; sdc Storybook only
// by decision). Static-serving two package dirs is file-copy only — nothing
// on the story-build critical path, and UIKit code never imports the plugin.
const colourPickerDir = getAbsolutePath('@civictheme/colour-picker');
const tokensDir = getAbsolutePath('@civictheme/tokens');

const config = {
  stories: [
    '../components/**/*.stories.js',
    join(colourPickerDir, 'stories/**/*.stories.js'),
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@whitespace/storybook-addon-html'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/html-vite'),
    options: {},
  },
  staticDirs: [
    { from: '../dist/assets', to: '/assets' },
    './static',
    { from: colourPickerDir, to: '/colour-picker' },
    { from: tokensDir, to: '/colour-picker-tokens' },
  ],
};

export default config;
