/**
 * RegViz - Visual Difference CLI for CivicTheme UIKit
 *
 * A command-line tool to capture screenshots and compare visual differences
 * between different versions of CivicTheme components.
 */

import {Command} from 'commander';
import {executeCompareCommand} from './lib/commands/compare.mjs';
import {executeCaptureCommand} from './lib/commands/capture.mjs';
import {executeCleanCommand} from './lib/commands/clean.mjs';
import {runInteractiveMenu} from './lib/interactive.mjs';
import {startServer} from './lib/server.mjs';
import {initScreenshotSets, loadScreenshotSets} from "./lib/screenshot-set-manager.mjs";

// Get the directory name of the current module

const program = new Command();

program
    .name('visual-diff')
    .description('Visual difference testing tool for CivicTheme UIKit')
    .version('1.0.0', '-v, --version', 'Output the current version');

initScreenshotSets();

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

program
    .command('capture')
    .description('Capture screenshots from a specific source')
    .option('-s, --source <source>', 'Source identifier (e.g., main, current_branch, tag name)', 'current_branch')
    .option('-t, --type <sourceType>', 'Source type (current_branch, branch, tag)', 'current_branch')
    .option('-p, --package <package>', 'Package to capture (twig, sdc)', 'twig')
    .option('-f, --force', 'Force overwrite if the capture already exists')
    .action(async (options) => {
        try {
            // Convert command line options to the new format
            const captureOptions = {
                source: options.source,
                sourceType: options.source === 'current_branch' ? 'current_branch' : options.type,
                package: options.package,
                force: options.force
            };
            await executeCaptureCommand(captureOptions);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    });

program
    .command('compare')
    .description('Compare two sets of screenshots')
    .option('-s, --source <name>', 'First (source) screenshot set name')
    .option('-t, --target <name>', 'Second (target) screenshot set name')
    .option('-f, --force', 'Force overwrite if the comparison already exists')
    .action(async (options) => {
        try {
            await executeCompareCommand(options.source, options.target);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    });

program
    .command('list')
    .description('List available screenshot sets or comparisons')
    .option('-s, --sets', 'List available screenshot sets')
    .option('-c, --comparisons', 'List completed comparisons')
    .option('-a, --all', 'List all available data')
    .action((options) => {
        try {
            const config = loadScreenshotSets();

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
