#!/usr/bin/env node

/* eslint-disable no-console, max-len, no-use-before-define, no-underscore-dangle */
/**
 * Script to generate docblock headers for component files from YAML component definitions.
 *
 * This script will add or update docblock headers for the following file types:
 *   - *.twig - Main component template
 *   - *.stories.twig - Storybook stories template
 *   - *.js - Component JavaScript
 *   - *.stories.js - Storybook stories JavaScript
 *   - *.scss - Component SCSS styles
 *   - *.stories.scss - Storybook stories SCSS styles
 *
 * Usage:
 *   node components-update-sdc.js [path] [--dry-run] [--check]
 *
 * [path] can be:
 *   - A specific .component.yml file
 *   - A directory containing component files
 *   - Not specified, which will process all components recursively
 *
 * Flags:
 *   --dry-run: Don't write to files, just show what would be generated
 *   --check: Validate if components are up-to-date (exits with code 1 if updates needed)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import yaml from 'js-yaml';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default components directory
const DEFAULT_COMPONENTS_DIR = path.resolve(__dirname, '../../packages/sdc/components');

// Templates for formatting headers for different file types
const TEMPLATES = {
  // Twig docblock wrapper
  twig: `{#
/**
 * @file
 * CivicTheme {{componentName}} component.
 *
 * Variables:
{{variables}}
 */
#}`,

  // JS file header
  js: `/**
 * CivicTheme {{componentName}} component.
 */`,

  // Stories.js file header
  'stories.js': `/**
 * CivicTheme {{componentName}} component stories.
 */`,

  // SCSS file header
  scss: `//
// CivicTheme {{componentName}} component styles.
//`,

  // Stories SCSS file header
  'stories.scss': `//
// CivicTheme {{componentName}} component story styles.
//`,

  // Stories Twig file header
  'stories.twig': `{#
/**
 * @file
 * CivicTheme {{componentName}} component stories.
 */
#}`,

  // Template for each variable line - we'll use a single template and handle indentation dynamically
  variable: ' * {{indent}}- {{name}}: [{{type}}] {{description}}',
};

/**
 * Main function to process components.
 */
async function main() {
  // Display yellow frame for start of script
  console.log(`\x1b[33m${'='.repeat(80)}\x1b[0m`);
  console.log('\x1b[33m  STARTING COMPONENT SDC UPDATE SCRIPT\x1b[0m');
  console.log(`\x1b[33m${'='.repeat(80)}\x1b[0m`);
  console.log();

  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  let dryRun = args.includes('--dry-run');
  const checkMode = args.includes('--check');

  // Remove flags from args
  const paths = args.filter((arg) => !arg.startsWith('-'));
  const targetPath = paths.length > 0 ? paths[0] : DEFAULT_COMPONENTS_DIR;

  if (dryRun) {
    console.log('Dry run mode - not writing to files');
  }

  if (checkMode) {
    console.log('Check mode - validating components are up to date');
    // In check mode, we always want to do a dry run (no actual changes)
    dryRun = true;
  }

  try {
    // Check if the path exists
    if (!fs.existsSync(targetPath)) {
      console.error(`Error: Path does not exist: ${targetPath}`);
      process.exit(1);
    }

    let results;

    // Check if it's a directory or file
    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) {
      // Process as directory - make sure targetPath doesn't end with trailing slash
      const normalizedPath = targetPath.endsWith('/') ? targetPath.slice(0, -1) : targetPath;
      results = processDirectory(normalizedPath, true, dryRun, checkMode);
    } else {
      // Process as file
      results = processFile(targetPath, dryRun, checkMode);
    }

    // Determine color based on result
    let frameColor = '\x1b[32m'; // Green by default
    let resultMessage = 'COMPLETED SUCCESSFULLY';

    // Use red frame if there are failures or needed updates in check mode
    if (results.failed > 0 || (checkMode && results.needsUpdate > 0)) {
      frameColor = '\x1b[31m'; // Red for errors
      resultMessage = 'COMPLETED WITH ERRORS';
    }

    console.log(`\n${frameColor}${'='.repeat(80)}\x1b[0m`);
    console.log(`${frameColor}  RESULTS:\x1b[0m`);
    console.log(`${frameColor + '-'.repeat(80)}\x1b[0m`);
    console.log(`  Processed: ${results.processed}`);
    console.log(`  Skipped: ${results.skipped}`);
    console.log(`  Failed: ${results.failed}`);
    if (checkMode) {
      console.log(`  Need updates: ${results.needsUpdate}`);
    }
    console.log(`  Total: ${results.total}`);
    console.log(`${frameColor + '-'.repeat(80)}\x1b[0m`);
    console.log(`${frameColor}  ${resultMessage}\x1b[0m`);
    console.log(`${frameColor + '='.repeat(80)}\x1b[0m`);

    // Exit with error if any files failed
    if (results.failed > 0) {
      console.error(`\n${results.failed} file(s) failed to process due to YAML parsing errors.`);
      console.error('Please fix the YAML files and try again.');
      process.exit(1);
    }

    // In check mode, exit with error if any components need updates
    if (checkMode && results.needsUpdate > 0) {
      console.error(`\n${results.needsUpdate} component(s) need to be updated.`);
      console.error('Run without --check flag to update these components.');
      process.exit(1);
    }
  } catch (error) {
    // Display red frame for error
    console.log(`\n\x1b[31m${'='.repeat(80)}\x1b[0m`);
    console.log('\x1b[31m  ERROR OCCURRED\x1b[0m');
    console.log(`\x1b[31m${'-'.repeat(80)}\x1b[0m`);
    console.error('  Error:', error.message);
    console.log(`\x1b[31m${'='.repeat(80)}\x1b[0m`);
    process.exit(1);
  }
}

/**
 * Print help information.
 */
function printHelp() {
  console.log(`
Usage: node components-update-sdc.js [options] [path]

Generate docblock headers for component files from YAML component definitions.

Supported File Types:
  - *.twig - Main component template
  - *.stories.twig - Storybook stories template
  - *.js - Component JavaScript
  - *.stories.js - Storybook stories JavaScript
  - *.scss - Component SCSS styles
  - *.stories.scss - Storybook stories SCSS styles

Options:
  --dry-run     Don't write to files, just show what would be generated
  --check       Check if components need updates, exits with code 1 if updates needed
  --help, -h    Show this help message

Arguments:
  [path]        Path to process (default: all components)
                - A specific .component.yml file
                - A directory containing components
                - Not specified, which processes all components recursively

Examples:
  node components-update-sdc.js                                 # Process all components
  node components-update-sdc.js --dry-run                       # Dry run on all components
  node components-update-sdc.js --check                         # Check if components need updates
  node components-update-sdc.js path/to/component.component.yml # Process single component
  node components-update-sdc.js path/to/components/             # Process directory
  `);
}

/**
 * Read a YAML file and parse it into a structured object.
 *
 * @param {string} yamlPath - Path to the component.yml file
 * @returns {Object} Parsed data with component properties
 */
function readYamlFile(yamlPath) {
  // Read file content as string
  const content = fs.readFileSync(yamlPath, 'utf8');

  // Parse YAML content to JavaScript object
  const yamlData = yaml.load(content);

  // Create result structure
  const result = {
    name: yamlData.name || '',
    description: yamlData.description || '',
    properties: {},
    slots: {},
  };

  // Extract properties from props section
  if (yamlData.props && yamlData.props.properties) {
    result.properties = yamlData.props.properties;
  }

  // Extract slots
  if (yamlData.slots) {
    result.slots = yamlData.slots;
  }

  return result;
}

/**
 * Generate variables section for twig docblock.
 *
 * @param {Object} properties - Component properties from YAML
 * @param {Object} slots - Component slots from YAML
 * @returns {string} Formatted variables section
 */
function generateVariablesSection(properties, slots) {
  const variablesLines = [];

  // Process regular properties
  Object.entries(properties).forEach(([propName, propData]) => {
    variablesLines.push(...generatePropertyLines(propName, propData));
  });

  // Add slots as a separate section if they exist
  if (Object.keys(slots).length > 0) {
    variablesLines.push(' *');
    variablesLines.push(' * Slots:');

    Object.entries(slots).forEach(([slotName, slotData]) => {
      const template = TEMPLATES.variable;
      const line = template
        .replace('{{indent}}', '')
        .replace('{{name}}', slotName)
        .replace('{{type}}', 'slot')
        .replace('{{description}}', slotData.description || '');

      variablesLines.push(line);
    });
  }

  return variablesLines.join('\n');
}

/**
 * Generate docblock lines for a property and its nested properties.
 * This function is recursive and handles nested properties at any depth.
 *
 * @param {string} propName - Property name
 * @param {Object} propData - Property data from YAML
 * @param {number} depth - Nesting depth (0 for top-level)
 * @returns {Array} Array of formatted lines
 */
function generatePropertyLines(propName, propData, depth = 0) {
  const lines = [];
  const type = propData.type || 'string';
  const description = propData.description || '';

  // Create indentation string based on depth
  const indent = '  '.repeat(depth);

  // Format the description - add a colon for objects/arrays with nested properties
  let formattedDesc = description;
  const hasNestedItems = (type === 'object' && propData.properties && Object.keys(propData.properties).length > 0)
    || (type === 'array' && propData.items && propData.items.properties && Object.keys(propData.items.properties).length > 0);

  if (hasNestedItems) {
    // Add a colon if not already present
    if (!formattedDesc.endsWith(':')) {
      formattedDesc = formattedDesc.endsWith('.')
        ? `${formattedDesc.substring(0, formattedDesc.length - 1)}:`
        : `${formattedDesc}:`;
    }
  }

  // Create the line from the template
  const line = TEMPLATES.variable
    .replace('{{indent}}', indent)
    .replace('{{name}}', propName)
    .replace('{{type}}', type)
    .replace('{{description}}', formattedDesc);

  lines.push(line);

  // Handle nested properties for objects
  if (type === 'object' && propData.properties) {
    Object.entries(propData.properties).forEach(([nestedName, nestedData]) => {
      lines.push(...generatePropertyLines(nestedName, nestedData, depth + 1));
    });
  }

  // Handle array items with a fully recursive approach
  if (type === 'array' && propData.items) {
    // Add "Each item contains:" line with proper indentation
    lines.push(` * ${indent}  Each item contains:`);

    // For simple array items (no properties)
    if (propData.items.type && !propData.items.properties) {
      const itemType = propData.items.type || 'any';
      lines.push(` * ${indent}    [${itemType}] items`);
    // For object array items with properties
    } else if (propData.items.properties) {
      // Process all item properties recursively
      Object.entries(propData.items.properties).forEach(([itemPropName, itemPropData]) => {
        // Generate lines with deeper indentation for array items
        const itemLines = generatePropertyLines(itemPropName, itemPropData, depth + 1);
        lines.push(...itemLines);
      });
    // For arrays with no specified structure
    } else {
      lines.push(` * ${indent}    [any] items`);
    }
  }

  return lines;
}

/**
 * Detect file type from file path.
 *
 * @param {string} filePath - Path to the file
 * @returns {string} File type key for template selection
 */
function detectFileType(filePath) {
  const fileName = path.basename(filePath);
  const extension = path.extname(filePath).substring(1);

  if (fileName.includes('.stories.js')) return 'stories.js';
  if (fileName.includes('.stories.twig')) return 'stories.twig';
  if (fileName.includes('.stories.scss')) return 'stories.scss';

  return extension; // js, scss, twig
}

/**
 * Generate docblock header content for a specific file type.
 *
 * @param {string} fileType - Type of file (js, scss, twig, etc.)
 * @param {string} componentName - Name of the component
 * @param {string} variablesSection - Variables section for twig files
 * @returns {string} Generated docblock header
 */
function generateDocblock(fileType, componentName, variablesSection = '') {
  // Get the template for this file type, or use js template as fallback
  const template = TEMPLATES[fileType] || TEMPLATES.js;

  // Replace placeholders
  let docblock = template.replace(/\{\{componentName\}\}/g, componentName);

  // Only add variables section for twig files
  if (fileType === 'twig' && variablesSection) {
    docblock = docblock.replace('{{variables}}', variablesSection);
  }

  return docblock;
}

/**
 * Generate and write docblock header to a specific file.
 *
 * @param {string} filePath - Path to the file to update
 * @param {string} componentName - Component name
 * @param {string} variablesSection - Variables section for twig files
 * @param {boolean} dryRun - If true, don't write to files
 * @param {boolean} checkMode - If true, just check if updates are needed
 * @returns {Object} Result with success status and needsUpdate flag
 */
function updateFileHeader(filePath, componentName, variablesSection, dryRun, checkMode) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { success: false, needsUpdate: false, reason: 'file-not-found' };
    }

    // Detect file type
    const fileType = detectFileType(filePath);

    // Generate docblock for this file type
    const docblock = generateDocblock(fileType, componentName, variablesSection);

    // Read current file content
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Create new content
    let newContent;
    let needsUpdate = false;
    let existingHeader = '';

    // Handle each file type differently
    if (fileType === 'twig' || fileType === 'stories.twig') {
      // For Twig files, look for {# /**...*/ #} blocks
      const docblockPattern = /\{#\s*\/\*\*[\s\S]*?\*\/\s*#\}/;
      const match = fileContent.match(docblockPattern);

      if (match) {
        [existingHeader] = match;
        // Check if headers are different
        if (existingHeader.trim() !== docblock.trim()) {
          needsUpdate = true;
          newContent = fileContent.replace(docblockPattern, docblock);
        }
      } else {
        // No existing header, add one
        needsUpdate = true;
        newContent = `${docblock}\n\n${fileContent}`;
      }
    } else if (fileType === 'scss' || fileType === 'stories.scss') {
      // For SCSS files, remove all consecutive // lines at the beginning of the file
      // Split the content into lines
      const lines = fileContent.split('\n');
      let contentStartIndex = 0;

      // Find the first non-comment line
      while (contentStartIndex < lines.length
             && (lines[contentStartIndex].trim() === '' || lines[contentStartIndex].trim().startsWith('//'))) {
        contentStartIndex++;
      }

      // Get the content without the comment header
      const codeContent = lines.slice(contentStartIndex).join('\n');

      // Check if existing header differs from our template
      const existingHeaderLines = lines.slice(0, contentStartIndex).join('\n');

      // We always need to update SCSS files since we're completely replacing the header
      needsUpdate = true;
      newContent = `${docblock}\n\n${codeContent}`;

      // For check mode, handle finding existing slash-style comments
      if (checkMode || dryRun) {
        if (existingHeaderLines.trim() === docblock.trim()) {
          needsUpdate = false;
        }
      }
    } else {
      // For JS and other files, look for /** ... */ blocks
      const docblockPattern = /\/\*\*[\s\S]*?\*\//;
      const match = fileContent.match(docblockPattern);

      if (match) {
        [existingHeader] = match;
        // Check if headers are different
        if (existingHeader.trim() !== docblock.trim()) {
          needsUpdate = true;
          newContent = fileContent.replace(docblockPattern, docblock);
        }
      } else {
        // No existing header, add one
        needsUpdate = true;
        newContent = `${docblock}\n\n${fileContent}`;
      }
    }

    if (checkMode && needsUpdate) {
      console.log(`\x1b[31mComponent ${filePath} NEEDS TO BE UPDATED\x1b[0m`);
      return { success: true, needsUpdate: true };
    }

    if (dryRun && needsUpdate) {
      console.log(`\n\x1b[31mComponent ${filePath} WOULD BE UPDATED\x1b[0m`);
      console.log(`Generated docblock:`);
      console.log(docblock);
      return { success: true, needsUpdate };
    }

    // Only write if an update is needed
    if (needsUpdate) {
      // Write updated content back to file
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`\x1b[32mComponent ${filePath} UPDATED\x1b[0m`);
    }

    return { success: true, needsUpdate };
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return { success: false, needsUpdate: false, reason: 'error', error };
  }
}

/**
 * Find all component-related files in a directory.
 *
 * @param {string} dir - Directory to search in
 * @param {string} componentName - Component name without extension
 * @returns {Array} Array of file paths
 */
function findComponentFiles(dir, componentName) {
  try {
    const fileTypes = [
      `${componentName}.twig`,
      `${componentName}.stories.twig`,
      `${componentName}.js`,
      `${componentName}.stories.js`,
      `${componentName}.scss`,
      `${componentName}.stories.scss`,
    ];

    return fileTypes
      .map((fileName) => path.join(dir, fileName))
      .filter((filePath) => fs.existsSync(filePath));
  } catch (error) {
    console.error(`Error finding component files: ${error.message}`);
    return [];
  }
}

/**
 * Generate and write docblock headers for all component files.
 *
 * @param {string} yamlPath - Path to the component.yml file
 * @param {boolean} [dryRun=false] - If true, don't write to files
 * @param {boolean} [checkMode=false] - If true, just check if an update is needed
 * @returns {Object} Result object with success status and needsUpdate flag
 */
function generateComponentHeaders(yamlPath, dryRun = false, checkMode = false) {
  try {
    // Get directory and component name
    const dir = path.dirname(yamlPath);
    const componentName = path.basename(yamlPath, '.component.yml');

    // Parse YAML file
    const yamlData = readYamlFile(yamlPath);

    // Generate variables section for twig files
    const variablesSection = generateVariablesSection(yamlData.properties, yamlData.slots);

    // Find all component files
    const componentFiles = findComponentFiles(dir, componentName);

    if (componentFiles.length === 0) {
      console.warn(`No component files found for ${componentName}`);
      return { success: false, needsUpdate: false };
    }

    let processedCount = 0;
    let updatedCount = 0;
    let failedCount = 0;

    // Process each file
    componentFiles.forEach((filePath) => {
      const result = updateFileHeader(
        filePath,
        yamlData.name || componentName,
        variablesSection,
        dryRun,
        checkMode,
      );

      if (result.success) {
        processedCount++;
        if (result.needsUpdate) {
          updatedCount++;
        }
      } else if (result.reason !== 'file-not-found') {
        failedCount++;
      }
    });

    return {
      success: failedCount === 0,
      needsUpdate: updatedCount > 0,
      processed: processedCount,
      updated: updatedCount,
      failed: failedCount,
      total: componentFiles.length,
    };
  } catch (error) {
    console.error(`Error processing ${yamlPath}: ${error.message}`);
    return { success: false, needsUpdate: false };
  }
}

/**
 * Find files matching a pattern.
 *
 * @param {string} pattern - Search pattern
 * @returns {Array} Matching file paths
 */
function findFiles(pattern) {
  try {
    // Properly quote the path part of the pattern to handle spaces and special characters
    const parts = pattern.split(' -');
    const searchPath = parts[0];
    const searchOptions = parts.slice(1).map((part) => `-${part}`).join(' ');

    const command = `find "${searchPath}" ${searchOptions}`;
    const output = execSync(command, { encoding: 'utf8' });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Error finding files: ${error.message}`);
    return [];
  }
}

/**
 * Process a directory of component files.
 *
 * @param {string} dirPath - Directory path
 * @param {boolean} [recursive=false] - Process subdirectories
 * @param {boolean} [dryRun=false] - Don't write to files
 * @param {boolean} [checkMode=false] - If true, just check if updates are needed
 * @returns {Object} Results with counts
 */
function processDirectory(dirPath, recursive = false, dryRun = false, checkMode = false) {
  const pattern = recursive
    ? `${dirPath} -name "*.component.yml" -type f`
    : `${dirPath} -maxdepth 1 -name "*.component.yml" -type f`;

  const files = findFiles(pattern);

  console.log(`Found ${files.length} component YAML files in ${dirPath}${recursive ? ' (recursive)' : ''}`);

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  let needsUpdate = 0;

  files.forEach((file) => {
    try {
      const result = generateComponentHeaders(file, dryRun, checkMode);
      if (result.success) {
        if (result.needsUpdate) {
          needsUpdate++;
        }
        processed += result.processed || 1;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
      failed++;
    }
  });

  return {
    processed,
    skipped,
    failed,
    needsUpdate,
    total: files.length,
  };
}

/**
 * Process a single component file.
 *
 * @param {string} filePath - Component YAML file path
 * @param {boolean} [dryRun=false] - Don't write to files
 * @param {boolean} [checkMode=false] - If true, just check if updates are needed
 * @returns {Object} Results with counts
 */
function processFile(filePath, dryRun = false, checkMode = false) {
  if (!filePath.endsWith('.component.yml')) {
    console.error(`Error: ${filePath} is not a component YAML file.`);
    return {
      processed: 0,
      skipped: 1,
      failed: 0,
      needsUpdate: 0,
      total: 1,
    };
  }

  try {
    const result = generateComponentHeaders(filePath, dryRun, checkMode);

    return {
      processed: result.processed || 0,
      skipped: (result.total || 0) - (result.processed || 0),
      failed: result.failed || 0,
      needsUpdate: result.needsUpdate ? 1 : 0,
      total: result.total || 0,
    };
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return {
      processed: 0,
      skipped: 0,
      failed: 1,
      needsUpdate: 0,
      total: 1,
    };
  }
}

// Run the script
main();
