/**
 * Interactive CLI menu for Visual Diff.
 *
 * Provides an interactive menu interface for the RegViz CLI.
 */

import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { getScreenshotPath, loadScreenshotSets } from './screenshot-set-manager.mjs';
import { loadScreenshotSources, loadAvailablePackages, SOURCE_TYPES } from './config.mjs';
import { executeCaptureCommand } from './commands/capture.mjs';
import { executeCompareCommand } from './commands/compare.mjs';
import { executeCleanCommand } from './commands/clean.mjs';
import { formatDisplayName, generateDiffName, getBranchData, getSourceOptions } from './utils.mjs';
import { startServer } from './server.mjs';

/**
 * Handle the compare command interactively.
 *
 * @returns {Promise<void>}
 */
export async function handleCompareInteractive() {
  try {
    const config = loadScreenshotSets();

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

    const sourceChoices = getSourceOptions();
    const { source: sourceName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'source',
        message: 'Select source screenshot set:',
        choices: sourceChoices,
      },
    ]);

    const targetChoices = sourceChoices.filter((choice) => choice.value !== sourceName);

    if (targetChoices.length === 0) {
      console.log('No other screenshot sets available to compare with.');
      return;
    }

    const { target: targetName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'target',
        message: 'Select target screenshot set:',
        choices: targetChoices,
      },
    ]);

    const options = {
      sourceName,
      targetName,
    };

    options.name = generateDiffName(sourceName, targetName);

    await executeCompareCommand(sourceName, targetName);
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
    // Get sources from config
    const sources = loadScreenshotSources();

    if (sources.length === 0) {
      console.log('No screenshot sources configured. Please update config.json first.');
      return;
    }

    // First get source information
    const sourceAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'source',
        message: 'Select source for screenshots:',
        choices: sources,
        default: 'current_branch',
      },
    ]);

    // Find the selected source
    const selectedSource = sources.find((s) => s.value === sourceAnswers.source);
    const { sourceType } = selectedSource;

    // Get packages for the selected source
    const packageChoices = loadAvailablePackages(sourceAnswers.source, sourceType);

    if (packageChoices.length === 0) {
      console.log(`No packages configured for source: ${selectedSource.name}. Please update config.json first.`);
      return;
    }

    // Get tag version if needed
    const versionInfo = {};
    if (sourceType === SOURCE_TYPES.TAG) {
      // For tags, we already have the version from the tag selection
      versionInfo.version = sourceAnswers.source;
    } else if (sourceType === SOURCE_TYPES.BRANCH && sourceAnswers.source !== 'main') {
      // For non-main branches, we don't need additional version info
    } else if (sourceType === SOURCE_TYPES.CURRENT_BRANCH) {
      // For current branch, we'll get branch info later
    }

    // Now select the package
    const packageAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'package',
        message: 'Select component package:',
        choices: packageChoices,
        default: packageChoices[0].value,
      },
    ]);

    // Display branch info for current branch
    if (sourceType === SOURCE_TYPES.CURRENT_BRANCH) {
      try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        console.log(`\nDetected current branch: ${branch}`);
      } catch (error) {
        // Silently ignore branch detection errors
      }
    }

    // Build options for the capture command
    const options = {
      source: sourceAnswers.source, // The actual selected value
      sourceType,
      package: packageAnswer.package,
      name: undefined,
      interactive: true,
    };

    // Add version if this is a tag/release
    if (versionInfo.version) {
      options.version = versionInfo.version;
    }

    try {
      // Get current branch info if needed
      if (sourceType === SOURCE_TYPES.CURRENT_BRANCH) {
        Object.assign(options, getBranchData());
      }

      // Generate a name for this capture
      const nameParts = [];

      // Add source type to name
      if (sourceType === SOURCE_TYPES.CURRENT_BRANCH) {
        nameParts.push('current');
        if (options.branch) {
          nameParts.push(options.branch.replace(/[^a-zA-Z0-9-_]/g, '-'));
        }
      } else if (sourceType === SOURCE_TYPES.BRANCH) {
        nameParts.push('branch');
        nameParts.push(sourceAnswers.source.replace(/[^a-zA-Z0-9-_]/g, '-'));
      } else if (sourceType === SOURCE_TYPES.TAG) {
        nameParts.push('tag');
        nameParts.push(sourceAnswers.source.replace(/[^a-zA-Z0-9-_]/g, '-'));
      }

      // Add package to name
      nameParts.push(packageAnswer.package);

      // Create the name with double dashes between parts
      options.name = nameParts.join('--');

      const { name } = options;
      const outputDir = getScreenshotPath(name);
      console.log(`\nUsing auto-generated name: ${name}`);
      console.log(`Screenshots will be stored in: ${outputDir}`);
    } catch (error) {
      console.error(`Error generating name: ${error.message}`);
    }

    const result = await executeCaptureCommand(options);

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
        options.confirmedOverwrite = true;
        await executeCaptureCommand(options);
      } else {
        console.log('Capture operation cancelled.');
      }
    }

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

    const config = loadScreenshotSets();

    if (listType === 'all' || listType === 'sets') {
      console.log('\nAvailable screenshot sets:');
      if (!config.screenshot_sets || Object.keys(config.screenshot_sets).length === 0) {
        console.log('  No screenshot sets available');
      } else {
        Object.values(config.screenshot_sets).forEach((screenshotSet) => {
          console.log(`  - ${formatDisplayName(screenshotSet.source, screenshotSet.package)}`);
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
    const config = loadScreenshotSets();

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
        const sourceOptions = getSourceOptions();
        const { set } = await inquirer.prompt([
          {
            type: 'list',
            name: 'set',
            message: 'Select screenshot set to remove:',
            choices: sourceOptions,
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
