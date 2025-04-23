/**
 * RegViz - Visual Difference CLI for CivicTheme UIKit
 *
 * A command-line tool to capture screenshots and compare visual differences
 * between different versions of CivicTheme components.
 */

import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import { loadConfig, saveConfig, initConfig } from './lib/config.mjs';
import { executeCompareCommand } from './lib/commands/compare.mjs';
import  { executeCaptureCommand } from './lib/commands/capture.mjs';
import { executeCleanCommand } from './lib/commands/clean.mjs';
import { runInteractiveMenu } from './lib/interactive.mjs';
import { startServer } from './lib/server.mjs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJsonPath = path.join(dirname(__dirname), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Initialize the program
const program = new Command();

program
  .name('regviz')
  .description('Visual difference testing tool for CivicTheme UIKit')
  .version(packageJson.version || '1.0.0');

// Initialize configuration if it doesn't exist
initConfig();

// Interactive mode
program
  .command('interactive')
  .alias('i')
  .description('Run in interactive mode with menu prompts')
  .action(async () => {
    try {
      await runInteractiveMenu();
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Capture command
program
  .command('capture')
  .description('Capture screenshots from a specific source')
  .option('-s, --source <source>', 'Source for screenshots (main|release|current)', 'current')
  .option('-t, --target <target>', 'Target component directory (components|components-sdc)', 'components')
  .option('-v, --version <version>', 'Specific release version (only for release source)')
  .option('-f, --force', 'Force overwrite if the capture already exists')
  .action(async (options) => {
    try {
      await executeCaptureCommand(options);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Compare command
program
  .command('compare')
  .description('Compare two sets of screenshots')
  .option('-s, --source <name>', 'First (source) screenshot set name')
  .option('-t, --target <name>', 'Second (target) screenshot set name')
  .option('-f, --force', 'Force overwrite if the comparison already exists')
  .action(async (options) => {
    try {
      await executeCompareCommand(options);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// List command
program
  .command('list')
  .description('List available screenshot sets or comparisons')
  .option('-s, --sets', 'List available screenshot sets')
  .option('-c, --comparisons', 'List completed comparisons')
  .option('-a, --all', 'List all available data')
  .action((options) => {
    try {
      const config = loadConfig();

      const showAll = options.all || (!options.sets && !options.comparisons);

      if (showAll || options.sets) {
        console.log('\nAvailable screenshot sets:');

        if (!config.screenshot_sets || Object.keys(config.screenshot_sets).length === 0) {
          console.log('  No screenshot sets available');
        } else {
          Object.entries(config.screenshot_sets).forEach(([name, set]) => {
            const sourceInfo = set.source ? ` from ${set.source}` : '';
            console.log(`  - ${name}${sourceInfo}`);
          });
        }
      }

      if (showAll || options.comparisons) {
        console.log('\nCompleted comparisons:');
        if (!config.comparisons || Object.keys(config.comparisons).length === 0) {
          console.log('  No comparisons available');
        } else {
          Object.entries(config.comparisons).forEach(([name, comparison]) => {
            console.log(`  - ${name}: ${comparison.source} vs ${comparison.target}`);
          });
        }
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Clean command
program
  .command('clean')
  .description('Remove screenshot sets or comparisons')
  .option('-s, --set <name>', 'Remove screenshot set')
  .option('-c, --comparison <name>', 'Remove comparison')
  .option('-a, --all', 'Remove all data')
  .action(async (options) => {
    try {
      await executeCleanCommand(options);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Server command
program
  .command('serve')
  .description('Start a web server to view comparisons and screenshots')
  .option('-p, --port <port>', 'Port to run the server on', '3000')
  .option('-d, --detached', 'Run server in detached mode (background)', false)
  .action(async (options) => {
    try {
      const port = parseInt(options.port, 10);
      const server = await startServer({
        port,
        detached: options.detached
      });

      if (!options.detached) {
        console.log(`Server running at http://localhost:${port}`);
        console.log('Press Ctrl+C to stop');

        // Keep the process running unless Ctrl+C is pressed
        process.on('SIGINT', () => {
          console.log('Shutting down server...');
          server.close(() => {
            console.log('Server stopped');
            process.exit(0);
          });
        });
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
