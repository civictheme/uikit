import { join } from 'node:path' // 1. Add dependencies.
import { cwd } from 'node:process'

const config = {
  // stories: ['../components/**/*.component.yml'], // 2. Set components glob.
  stories: ['../components/**/*.stories.js'],
  addons: [
    {
      name: 'storybook-addon-sdc',
      options: {
        sdcStorybookOptions: {
          namespace: 'civictheme',
        },
        vitePluginTwigDrupalOptions: {
          namespaces: {
            civictheme: join(cwd(), './components'),
          },
        },
        jsonSchemaFakerOptions: {},
      },
    },
    // Any other addons.
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@whitespace/storybook-addon-html',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: [{ from: '../dist/assets', to: '/assets' }, './static'],
}
export default config
