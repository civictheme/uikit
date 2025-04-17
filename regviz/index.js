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
import { loadConfig, saveConfig, initConfig } from './lib/config.js';
import { 
  executeCaptureCommand, 
  executeCompareCommand, 
  executeCleanCommand 
} from './lib/commands/index.js';
import { runInteractiveMenu } from './lib/interactive.js';

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
  .option('-t, --target <target>', 'Target directory (components|components-sdc)', 'components')
  .option('-n, --name <name>', 'Name for this capture set')
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
  .option('-s, --source <name>', 'Source screenshots set name')
  .option('-t, --target <name>', 'Target screenshots set name')
  .option('-n, --name <name>', 'Name for this comparison')
  .option('-f, --force', 'Force overwrite if the comparison already exists')
  .option('-b, --baseline <name>', 'Alias for source (backward compatibility)')
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
  .option('-b, --baselines', 'List screenshot sets with baseline role (backward compatibility)')
  .option('-t, --targets', 'List screenshot sets with target role (backward compatibility)')
  .action((options) => {
    try {
      const config = loadConfig();
      
      const showAll = options.all || (!options.sets && !options.baselines && !options.targets && !options.comparisons);
      
      if (showAll || options.sets || options.baselines || options.targets) {
        console.log('\nAvailable screenshot sets:');
        
        if (!config.screenshot_sets || Object.keys(config.screenshot_sets).length === 0) {
          console.log('  No screenshot sets available');
        } else {
          // Filter by role if requested
          let setsToDisplay = Object.entries(config.screenshot_sets);
          
          if (options.baselines && !options.targets && !options.sets) {
            // Only show baselines
            setsToDisplay = setsToDisplay.filter(([_, set]) => set.role === 'baseline');
          } else if (options.targets && !options.baselines && !options.sets) {
            // Only show targets
            setsToDisplay = setsToDisplay.filter(([_, set]) => set.role === 'target');
          }
          
          if (setsToDisplay.length === 0) {
            console.log('  No matching screenshot sets available');
          } else {
            setsToDisplay.forEach(([name, set]) => {
              const sourceInfo = set.source ? ` from ${set.source}` : '';
              const roleInfo = set.role ? ` (${set.role})` : '';
              console.log(`  - ${name}${sourceInfo}${roleInfo}`);
            });
          }
        }
      }

      if (showAll || options.comparisons) {
        console.log('\nCompleted comparisons:');
        if (!config.comparisons || Object.keys(config.comparisons).length === 0) {
          console.log('  No comparisons available');
        } else {
          Object.entries(config.comparisons).forEach(([name, comparison]) => {
            const sourceRef = comparison.source || comparison.baseline;
            const targetRef = comparison.target;
            console.log(`  - ${name}: ${sourceRef} vs ${targetRef}`);
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
  .option('-b, --baseline <name>', 'Remove screenshot set (backward compatibility)')
  .option('-t, --target <name>', 'Remove screenshot set (backward compatibility)')
  .action(async (options) => {
    try {
      await executeCleanCommand(options);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();