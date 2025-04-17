/**
 * Interactive CLI menu for RegViz.
 *
 * Provides an interactive menu interface for the RegViz CLI.
 */

import inquirer from 'inquirer';
import { loadConfig } from './config.js';
import {
  executeCaptureCommand,
  executeCompareCommand,
  executeCleanCommand
} from './commands/index.js';

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
          { name: 'Exit', value: 'exit' }
        ]
      }
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
      case 'list':
        await handleListInteractive();
        break;
      case 'clean':
        await handleCleanInteractive();
        break;
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
async function handleCaptureInteractive() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'source',
        message: 'Select source for screenshots:',
        choices: [
          { name: 'Current branch', value: 'current' },
          { name: 'Main branch', value: 'main' },
          { name: 'Release', value: 'release' }
        ],
        default: 'current'
      },
      {
        type: 'list',
        name: 'target',
        message: 'Select target directory:',
        choices: [
          { name: 'Components', value: 'components' },
          { name: 'SDC Components', value: 'components-sdc' }
        ],
        default: 'components'
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for this capture (leave empty for auto-generated):',
        default: ''
      },
      {
        type: 'list',
        name: 'version',
        message: 'Select release version:',
        choices: async () => {
          try {
            // Import necessary modules
            const { execSync } = await import('child_process');

            // Get current year
            const currentYear = new Date().getFullYear();

            // Get all tags sorted by commit date (newest first)
            const tagsWithDates = execSync(
              'git for-each-ref --sort=-creatordate --format="%(refname:short) %(creatordate:short)" refs/tags/'
            ).toString().trim();

            // Parse the output to get tags with their dates
            const tagData = tagsWithDates.split('\n').map(line => {
              const [tag, date] = line.trim().split(' ');
              return { tag, date, year: date ? parseInt(date.split('-')[0], 10) : null };
            });

            // Filter for version tags from the current year
            const versionTagRegex = /^v?(\d+\.\d+(\.\d+)*)$/;
            const currentYearTags = tagData
              .filter(data => data.year === currentYear && versionTagRegex.test(data.tag))
              .map(data => ({ name: `${data.tag} (${data.date})`, value: data.tag }));

            if (currentYearTags.length === 0) {
              // Fallback to recent version tags if no current year tags
              const recentTags = tagData
                .filter(data => versionTagRegex.test(data.tag))
                .slice(0, 5)
                .map(data => ({ name: `${data.tag} (${data.date})`, value: data.tag }));

              return [
                { name: '--- Recent Tags ---', disabled: true },
                ...recentTags,
                { name: 'Custom version', value: 'custom' }
              ];
            }

            return [
              ...currentYearTags,
              { name: 'Custom version', value: 'custom' }
            ];
          } catch (error) {
            console.error('Error getting release tags:', error);
            return [{ name: 'Custom version', value: 'custom' }];
          }
        },
        when: (answers) => answers.source === 'release'
      },
      {
        type: 'input',
        name: 'customVersion',
        message: 'Enter custom release version:',
        validate: (input) => input.trim() !== '' ? true : 'Version cannot be empty',
        when: (answers) => answers.source === 'release' && answers.version === 'custom'
      }
    ]);

    // First gather information for name generation
    if (answers.source === 'current' && !answers.name) {
      try {
        const { execSync } = await import('child_process');
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
      name: answers.name || undefined,
      version: (answers.version === 'custom' ? answers.customVersion : answers.version) || undefined,
      interactive: true
    };

    // Preview and confirm auto-generated name if user didn't provide one
    if (!options.name) {
      try {
        // Get branch information for current source
        let additionalInfo = {};
        if (options.source === 'current') {
          try {
            const { execSync } = await import('child_process');
            const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
            additionalInfo.branch = branch;
          } catch (error) {
            // Silently ignore branch detection errors
          }
        }

        // Generate the name using the same logic as in capture.js
        let name = options.source;

        if (options.source === 'release' && options.version) {
          name += `-${options.version}`;
        } else if (options.source === 'current' && additionalInfo.branch) {
          const safeBranch = additionalInfo.branch.replace(/[^a-zA-Z0-9-_]/g, '-');
          name += `-${safeBranch}`;
        }

        const targetName = options.target === 'components-sdc' ? 'sdc' : 'components';
        name += `-${targetName}`;

        console.log(`\nAuto-generated name: ${name}`);

        const { confirmName } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmName',
            message: 'Use this auto-generated name?',
            default: true
          }
        ]);

        if (!confirmName) {
          const { customName } = await inquirer.prompt([
            {
              type: 'input',
              name: 'customName',
              message: 'Enter a custom name:',
              validate: (input) => input.trim() !== '' ? true : 'Name cannot be empty'
            }
          ]);

          options.name = customName;
        } else {
          options.name = name;
        }
      } catch (error) {
        console.error(`Error generating name: ${error.message}`);
      }
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
          default: false
        }
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
        default: true
      }
    ]);

    if (continueAction) {
      await runInteractiveMenu();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

/**
 * Handle the compare command interactively.
 *
 * @returns {Promise<void>}
 */
async function handleCompareInteractive() {
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
          default: true
        }
      ]);
      
      if (createSet) {
        await handleCaptureInteractive();
      } else {
        await runInteractiveMenu();
      }
      return;
    }
    
    // Prepare choices from all screenshot sets
    const screenshotSets = Object.entries(config.screenshot_sets || {}).map(([name, set]) => {
      const sourceInfo = set.source ? ` from ${set.source}` : '';
      const roleInfo = set.role ? ` (${set.role})` : '';
      return {
        name: `${name}${sourceInfo}${roleInfo}`,
        value: name
      };
    });
    
    // Filter choices for source (traditionally baselines)
    const sourceChoices = [...screenshotSets];
    
    // First choose the source
    const sourceAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'source',
        message: 'Select source screenshot set:',
        choices: sourceChoices
      }
    ]);
    
    // Then choose the target (ensuring it's different from the source)
    const targetChoices = screenshotSets.filter(choice => choice.value !== sourceAnswer.source);
    
    if (targetChoices.length === 0) {
      console.log('No other screenshot sets available to compare with.');
      return;
    }
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'target',
        message: 'Select target screenshot set:',
        choices: targetChoices
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for this comparison (leave empty for auto-generated):',
        default: ''
      }
    ]);
    
    // Add the source from previous prompt
    answers.source = sourceAnswer.source;
    
    const options = {
      source: answers.source,
      target: answers.target,
      name: answers.name || undefined,
      interactive: true
    };
    
    // If user didn't provide a name, preview the auto-generated name
    if (!options.name) {
      // Generate a preview name based on similar logic to compare.js
      const sourceSet = config.screenshot_sets[options.source];
      const targetSet = config.screenshot_sets[options.target];
      let name = '';
      
      // Add source info
      if (sourceSet && sourceSet.source) {
        if (sourceSet.source === 'main') {
          name += 'main';
        } else if (sourceSet.source === 'release' && sourceSet.version) {
          name += `release-${sourceSet.version}`;
        } else if (sourceSet.source === 'current' && sourceSet.branch) {
          name += `branch-${sourceSet.branch.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
        } else {
          name += options.source.split('-')[0];
        }
      } else {
        name += options.source.split('-')[0];
      }
      
      // Add vs
      name += '-vs-';
      
      // Add target info
      if (targetSet && targetSet.source) {
        if (targetSet.source === 'main') {
          name += 'main';
        } else if (targetSet.source === 'release' && targetSet.version) {
          name += `release-${targetSet.version}`;
        } else if (targetSet.source === 'current' && targetSet.branch) {
          name += `branch-${targetSet.branch.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
        } else {
          name += options.target.split('-')[0];
        }
      } else {
        name += options.target.split('-')[0];
      }
      
      console.log(`\nAuto-generated name: ${name}`);
      
      const { confirmName } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmName',
          message: 'Use this auto-generated name?',
          default: true
        }
      ]);
      
      if (!confirmName) {
        const { customName } = await inquirer.prompt([
          {
            type: 'input',
            name: 'customName',
            message: 'Enter a custom name:',
            validate: (input) => input.trim() !== '' ? true : 'Name cannot be empty'
          }
        ]);
        
        options.name = customName;
      } else {
        options.name = name;
      }
    }
    
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
          default: false
        }
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
        default: true
      }
    ]);
    
    if (continueAction) {
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
async function handleListInteractive() {
  try {
    const { listType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'listType',
        message: 'What would you like to list?',
        choices: [
          { name: 'All data', value: 'all' },
          { name: 'Screenshot sets', value: 'sets' },
          { name: 'Comparisons', value: 'comparisons' }
        ],
        default: 'all'
      }
    ]);
    
    const config = loadConfig();
    
    if (listType === 'all' || listType === 'sets') {
      console.log('\nAvailable screenshot sets:');
      if (!config.screenshot_sets || Object.keys(config.screenshot_sets).length === 0) {
        console.log('  No screenshot sets available');
      } else {
        Object.entries(config.screenshot_sets).forEach(([name, set]) => {
          const sourceInfo = set.source ? ` from ${set.source}` : '';
          const roleInfo = set.role ? ` (${set.role})` : '';
          console.log(`  - ${name}${sourceInfo}${roleInfo}`);
        });
      }
    }
    
    if (listType === 'all' || listType === 'comparisons') {
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
    
    // Ask if user wants to continue
    const { continueAction } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAction',
        message: 'Would you like to do something else?',
        default: true
      }
    ]);
    
    if (continueAction) {
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
async function handleCleanInteractive() {
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
          { name: 'All data', value: 'all' }
        ]
      }
    ]);
    
    if (cleanType === 'all') {
      const { confirmAll } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmAll',
          message: 'Are you sure you want to remove ALL RegViz data? This cannot be undone.',
          default: false
        }
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
            choices: Object.entries(config.screenshot_sets).map(([name, set]) => {
              const sourceInfo = set.source ? ` from ${set.source}` : '';
              const roleInfo = set.role ? ` (${set.role})` : '';
              return {
                name: `${name}${sourceInfo}${roleInfo}`,
                value: name
              };
            })
          }
        ]);
        
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to remove screenshot set "${set}"? This cannot be undone.`,
            default: false
          }
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
            choices: Object.entries(config.comparisons).map(([name, comparison]) => {
              const sourceRef = comparison.source || comparison.baseline;
              const targetRef = comparison.target;
              return {
                name: `${name}: ${sourceRef} vs ${targetRef}`,
                value: name
              };
            })
          }
        ]);
        
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to remove comparison "${comparison}"? This cannot be undone.`,
            default: false
          }
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
        default: true
      }
    ]);
    
    if (continueAction) {
      await runInteractiveMenu();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}