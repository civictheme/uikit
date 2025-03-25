import { defineConfig } from 'vite';
import { resolve } from 'path';
import twig from 'vite-plugin-twig-drupal';
import sdcPlugin from './.storybook/sdc-plugin.js';

const componentDirectory = resolve(import.meta.dirname, './components');

export default defineConfig(({ mode }) => ({
  plugins: [
    twig({
      namespaces: {
        civictheme: componentDirectory,
      },
    }),
    sdcPlugin({ path: componentDirectory }),
    // This plugin allow watching files in the ./dist folder.
    {
      name: 'watch-dist',
      configureServer: (server) => {
        server.watcher.options = {
          ...server.watcher.options,
          ignored: [
            '**/.git/**',
            '**/node_modules/**',
            '**/.logs/**',
          ]
        }
      }
    }
  ],
}));
