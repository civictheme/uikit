import { defineConfig } from 'vite';
import { resolve } from 'path';
import twig from 'vite-plugin-twig-drupal';

export default defineConfig(({ mode }) => ({
  plugins: [
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
            '*.test.js'
          ]
        }
      }
    }
  ],
}));
