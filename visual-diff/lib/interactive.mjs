/**
 * Interactive CLI menu for Visual Diff.
 *
 * Provides an interactive menu interface for the RegViz CLI.
 */

import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { getDataPath, loadConfig } from './config.mjs';
import { executeCaptureCommand } from './commands/capture.mjs';
import { executeCompareCommand } from './commands/compare.mjs';
import { executeCleanCommand } from './commands/clean.mjs';
import { formatDisplayName, generateSetName, getBranchData, getCompatibleReleaseTags } from './utils.mjs';
import { startServer } from './server.mjs';

/**
 * Handle the compare command interactively.
 *
 * @returns {Promise<void>}
 */
export async function handleCompareInteractive() {
  try {
    const config = loadConfig();

    // Check if we have screenshot sets
    if (!config.screenshot_sets || Object.keys(config.screenshot_sets).length < 2) {
      console.log('Not enough screenshot sets available. At least two sets are needed for comparison.');

      const { createSet } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'createSet',
          message: 'Would you like to create a screenshot set now?',
          default: true,
        },
      ]);

      if (createSet) {
        // eslint-disable-next-line no-use-before-define
        await handleCaptureInteractive();
      } else {
        // eslint-disable-next-line no-use-before-define
        await runInteractiveMenu();
      }
      return;
    }

    // Prepare choices from all screenshot sets with human-readable names
    const screenshotSets = Object.keys(config.screenshot_sets || {}).map((name) => ({
      name: formatDisplayName(name),
      value: name,
    }));

    // Filter choices for source
    const sourceChoices = [...screenshotSets];

    // First choose the source
    const sourceAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'source',
        message: 'Select source screenshot set:',
        choices: sourceChoices,
      },
    ]);

    // Then choose the target (ensuring it's different from the source)
    const targetChoices = screenshotSets.filter((choice) => choice.value !== sourceAnswer.source);

    if (targetChoices.length === 0) {
      console.log('No other screenshot sets available to compare with.');
      return;
    }

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'target',
        message: 'Select target screenshot set:',
        choices: targetChoices,
      },
    ]);

    // Add the source from previous prompt
    answers.source = sourceAnswer.source;

    const options = {
      source: answers.source,
      target: answers.target,
      name: undefined,
      interactive: true,
    };

    // If user didn't provide a name, preview the auto-generated name
    // Generate a preview name based on similar logic to compare.js
    const sourceSet = config.screenshot_sets[options.source];
    const targetSet = config.screenshot_sets[options.target];

    // Create a concise description for the name with a 'diff' prefix
    let name = 'diff';

    // Add source info with double-hyphen
    name += '--';

    // Add source info
    if (sourceSet && sourceSet.source) {
      if (sourceSet.source === 'main') {
        name += 'main';
      } else if (sourceSet.source === 'release' && sourceSet.version) {
        name += `release-${sourceSet.version}`;
      } else if (sourceSet.source === 'current' && sourceSet.branch) {
        name += `branch-${sourceSet.branch.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
      } else {
        name += options.source.split('--')[1] || options.source;
      }
    } else {
      name += options.source.split('--')[1] || options.source;
    }

    // Add vs with double-hyphen
    name += '--vs--';

    // Add target info
    if (targetSet && targetSet.source) {
      if (targetSet.source === 'main') {
        name += 'main';
      } else if (targetSet.source === 'release' && targetSet.version) {
        name += `release-${targetSet.version}`;
      } else if (targetSet.source === 'current' && targetSet.branch) {
        name += `branch-${targetSet.branch.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
      } else {
        name += options.target.split('--')[1] || options.target;
      }
    } else {
      name += options.target.split('--')[1] || options.target;
    }

    // Get the output directory
    const outputDir = getDataPath(name);
    console.log(`Comparison report will be stored in: ${outputDir}`);

    options.name = name;

    // Initial attempt to execute the comparison
    const result = await executeCompareCommand(options);

    // If a comparison with this name already exists, prompt for confirmation
    if (result && result.requiresConfirmation) {
      console.log(`\nA comparison named "${result.name}" already exists.`);

      const { confirmOverwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmOverwrite',
          message: 'Do you want to overwrite the existing comparison?',
          default: false,
        },
      ]);

      if (confirmOverwrite) {
        // Re-run with confirmation flag
        options.confirmedOverwrite = true;
        await executeCompareCommand(options);
      } else {
        console.log('Comparison operation cancelled.');
      }
    }

    // Ask if user wants to continue
    const { continueAction } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAction',
        message: 'Would you like to do something else?',
        default: true,
      },
    ]);

    if (continueAction) {
      // eslint-disable-next-line no-use-before-define
      await runInteractiveMenu();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Handle the capture command interactively.
 *
 * @returns {Promise<void>}
 */
export async function handleCaptureInteractive() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'source',
        message: 'Select source for screenshots:',
        choices: [
          { name: 'Current branch', value: 'current' },
          { name: 'Main branch', value: 'main' },
          { name: 'Release', value: 'release' },
        ],
        default: 'current',
      },
      {
        type: 'list',
        name: 'target',
        message: 'Select target directory:',
        choices: [
          { name: 'Components', value: 'components' },
          { name: 'SDC Components', value: 'components-sdc' },
        ],
        default: 'components',
      },
      {
        type: 'list',
        name: 'version',
        message: 'Select release version:',
        choices: async () => {
          try {
            return getCompatibleReleaseTags();
          } catch (error) {
            console.error('Error getting release tags:', error);
            return [{ name: 'Custom version', value: 'custom' }];
          }
        },
        when: (answersState) => answersState.source === 'release',
      },
      {
        type: 'input',
        name: 'customVersion',
        message: 'Enter custom release version:',
        validate: (input) => (input.trim() !== '' ? true : 'Version cannot be empty'),
        when: (answersState) => answersState.source === 'release' && answersState.version === 'custom',
      },
    ]);

    // First gather information for name generation
    if (answers.source === 'current' && !answers.name) {
      try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        console.log(`\nDetected current branch: ${branch}`);
      } catch (error) {
        // Silently ignore branch detection errors
      }
    }

    // Collect basic options
    const options = {
      source: answers.source,
      target: answers.target,
      name: undefined,
      version: (answers.version === 'custom' ? answers.customVersion : answers.version) || undefined,
      interactive: true,
    };

    // Preview and confirm auto-generated name if user didn't provide one
    try {
      // Get branch information for current source
      if (options.source === 'current') {
        Object.assign(options, getBranchData());
      }

      // Get the output directory
      options.name = generateSetName(options);
      const { name } = options;
      const outputDir = getDataPath(name);
      console.log(`\nUsing auto-generated name: ${name}`);
      console.log(`Screenshots will be stored in: ${outputDir}`);
    } catch (error) {
      console.error(`Error generating name: ${error.message}`);
    }

    // Initial attempt to check if the capture already exists
    const result = await executeCaptureCommand(options);

    // If a capture with this name already exists, prompt for confirmation
    if (result && result.requiresConfirmation) {
      console.log(`\nA screenshot set named "${result.name}" already exists.`);

      const { confirmOverwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmOverwrite',
          message: 'Do you want to overwrite the existing capture?',
          default: false,
        },
      ]);

      if (confirmOverwrite) {
        // Re-run with confirmation flag
        options.confirmedOverwrite = true;
        await executeCaptureCommand(options);
      } else {
        console.log('Capture operation cancelled.');
      }
    }

    // Ask if user wants to continue
    const { continueAction } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAction',
        message: 'Would you like to do something else?',
        default: true,
      },
    ]);

    if (continueAction) {
      // eslint-disable-next-line no-use-before-define
      await runInteractiveMenu();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Handle the list command interactively.
 *
 * @returns {Promise<void>}
 */
export async function handleListInteractive() {
  try {
    const { listType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'listType',
        message: 'What would you like to list?',
        choices: [
          { name: 'All data', value: 'all' },
          { name: 'Screenshot sets', value: 'sets' },
          { name: 'Comparisons', value: 'comparisons' },
        ],
        default: 'all',
      },
    ]);

    const config = loadConfig();

    if (listType === 'all' || listType === 'sets') {
      console.log('\nAvailable screenshot sets:');
      if (!config.screenshot_sets || Object.keys(config.screenshot_sets).length === 0) {
        console.log('  No screenshot sets available');
      } else {
        Object.keys(config.screenshot_sets).forEach((name) => {
          console.log(`  - ${formatDisplayName(name)}`);
        });
      }
    }

    if (listType === 'all' || listType === 'comparisons') {
      console.log('\nCompleted comparisons:');
      if (!config.comparisons || Object.keys(config.comparisons).length === 0) {
        console.log('  No comparisons available');
      } else {
        Object.values(config.comparisons).forEach((comparison) => {
          console.log(`  - ${formatDisplayName(comparison.source)} vs ${formatDisplayName(comparison.target)}`);
        });
      }
    }

    // Ask if user wants to continue
    const { continueAction } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAction',
        message: 'Would you like to do something else?',
        default: true,
      },
    ]);

    if (continueAction) {
      // eslint-disable-next-line no-use-before-define
      await runInteractiveMenu();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Handle the clean command interactively.
 *
 * @returns {Promise<void>}
 */
export async function handleCleanInteractive() {
  try {
    const config = loadConfig();

    const { cleanType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'cleanType',
        message: 'What would you like to clean?',
        choices: [
          { name: 'Screenshot set', value: 'set' },
          { name: 'Comparison', value: 'comparison' },
          { name: 'All data', value: 'all' },
        ],
      },
    ]);

    if (cleanType === 'all') {
      const { confirmAll } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmAll',
          message: 'Are you sure you want to remove ALL Visual Diff data? This cannot be undone.',
          default: false,
        },
      ]);

      if (confirmAll) {
        await executeCleanCommand({ all: true });
      } else {
        console.log('Operation cancelled.');
      }
    } else if (cleanType === 'set') {
      if (!config.screenshot_sets || Object.keys(config.screenshot_sets).length === 0) {
        console.log('No screenshot sets available to clean.');
      } else {
        const { set } = await inquirer.prompt([
          {
            type: 'list',
            name: 'set',
            message: 'Select screenshot set to remove:',
            choices: Object.keys(config.screenshot_sets).map((name) => ({
              name: formatDisplayName(name),
              value: name,
            })),
          },
        ]);

        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to remove screenshot set "${set}"? This cannot be undone.`,
            default: false,
          },
        ]);

        if (confirm) {
          await executeCleanCommand({ set });
        } else {
          console.log('Operation cancelled.');
        }
      }
    } else if (cleanType === 'comparison') {
      if (!config.comparisons || Object.keys(config.comparisons).length === 0) {
        console.log('No comparisons available to clean.');
      } else {
        const { comparison } = await inquirer.prompt([
          {
            type: 'list',
            name: 'comparison',
            message: 'Select comparison to remove:',
            choices: Object.entries(config.comparisons).map(([name, comparisonSet]) => ({
              name: `${formatDisplayName(comparisonSet.source)} vs ${formatDisplayName(comparisonSet.target)}`,
              value: name,
            })),
          },
        ]);

        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to remove comparison "${comparison}"? This cannot be undone.`,
            default: false,
          },
        ]);

        if (confirm) {
          await executeCleanCommand({ comparison });
        } else {
          console.log('Operation cancelled.');
        }
      }
    }

    // Ask if user wants to continue
    const { continueAction } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAction',
        message: 'Would you like to do something else?',
        default: true,
      },
    ]);

    if (continueAction) {
      // eslint-disable-next-line no-use-before-define
      await runInteractiveMenu();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Run the interactive menu.
 *
 * @returns {Promise<void>}
 */
export async function runInteractiveMenu() {
  try {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Capture screenshots', value: 'capture' },
          { name: 'Compare screenshots', value: 'compare' },
          { name: 'List available data', value: 'list' },
          { name: 'Clean up data', value: 'clean' },
          { name: 'Start web server', value: 'serve' },
          { name: 'Exit', value: 'exit' },
        ],
      },
    ]);

    if (action === 'exit') {
      console.log('Goodbye!');
      return;
    }

    switch (action) {
      case 'capture':
        await handleCaptureInteractive();
        break;
      case 'compare':
        await handleCompareInteractive();
        break;
      case 'clean':
        await handleCleanInteractive();
        break;
      case 'serve':
        // eslint-disable-next-line no-use-before-define
        await handleServerInteractive();
        break;
      case 'list':
      default:
        await handleListInteractive();
        break;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Handle the server command interactively.
 *
 * @returns {Promise<void>}
 */
export async function handleServerInteractive() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'port',
        message: 'Port to run the server on:',
        default: '3000',
        validate: (input) => {
          const port = parseInt(input, 10);
          if (Number.isNaN(port) || port < 1 || port > 65535) {
            return 'Please enter a valid port number (1-65535)';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'detached',
        message: 'Run server in background (detached mode)?',
        default: false,
      },
    ]);

    const port = parseInt(answers.port, 10);

    console.log(`Starting server on port ${port}...`);
    const server = await startServer({
      port,
      detached: answers.detached,
    });

    if (!answers.detached) {
      console.log(`Server is running at http://localhost:${port}`);
      console.log('Press Ctrl+C to stop the server');

      // Wait for another menu prompt or Ctrl+C
      const { continueAction } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueAction',
          message: 'Would you like to return to the main menu? (Server will continue running in background)',
          default: true,
        },
      ]);

      if (continueAction) {
        server.unref();
        await runInteractiveMenu();
      } else {
        console.log('Shutting down server...');
        server.close(() => {
          console.log('Server stopped');
          process.exit(0);
        });
      }
    } else {
      console.log(`Server is running in the background at http://localhost:${port}`);
      console.log('You can continue using the CLI while the server runs');

      // Return to main menu
      const { continueAction } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueAction',
          message: 'Would you like to do something else?',
          default: true,
        },
      ]);

      if (continueAction) {
        await runInteractiveMenu();
      }
    }
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
  }
}
