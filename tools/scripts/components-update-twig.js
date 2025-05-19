#!/usr/bin/env node

/* eslint-disable no-console, max-len, no-use-before-define, no-underscore-dangle, no-unused-vars, no-useless-escape, no-cond-assign, prefer-destructuring */
/**
 * Script to synchronize components between directories, with options to:
 * 1. Copy entire components with namespace transformations (default)
 * 2. Copy only the docblock headers (with --headers-only flag)
 *
 * This tool can:
 * - Copy twig files from source to destination directory
 * - Replace "civictheme:" namespace references with path-based namespaces
 * - Copy only docblock headers from source to destination files
 * - Verify that components are up-to-date without making changes
 *
 * Example path-based namespace transformation:
 * For component in "03-organisms/header/header.twig",
 * "civictheme:header" would be replaced with "@organisms/header/header.twig"
 *
 * Usage:
 *   node components-update-twig.js [options] <src-dir> <dst-dir>
 *
 * Options:
 *   --headers-only: Only copy docblock headers, not entire components
 *   --dry-run: Don't write to files, just show what would be copied
 *   --check: Validate if files are up-to-date (exits with code 1 if updates needed)
 *   --help, -h: Show this help message
 *
 * Examples:
 *   node components-update-twig.js packages/sdc/components packages/twig/components
 *   node components-update-twig.js --headers-only packages/sdc/components packages/twig/components
 *   node components-update-twig.js --check packages/sdc/components packages/twig/components
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Template for formatting the twig docblock header
const TEMPLATES = {
  // Main docblock wrapper
  docblock: `{#
/**
 * @file
 * {{componentName}} component.
 *
 * Variables:
{{variables}}
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
  console.log('\x1b[33m  STARTING COMPONENT TWIG UPDATE SCRIPT\x1b[0m');
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
  const headersOnly = args.includes('--headers-only');

  // Remove flags from args
  const paths = args.filter((arg) => !arg.startsWith('-'));

  if (paths.length !== 2) {
    console.error('Error: You must provide source and destination directories');
    printHelp();
    process.exit(1);
  }

  // Script is executed from tools/scripts, but paths might be relative to project root
  // Handle "../../" style paths correctly by resolving them from script directory
  const projectRoot = path.resolve(__dirname, '../..');

  // Check if the paths start with "../" which indicates they're relative to the script location
  let srcDir = paths[0].startsWith('../')
    ? path.resolve(__dirname, paths[0])
    : path.resolve(projectRoot, paths[0]);

  let dstDir = paths[1].startsWith('../')
    ? path.resolve(__dirname, paths[1])
    : path.resolve(projectRoot, paths[1]);

  // Normalize paths to remove trailing slashes
  srcDir = srcDir.endsWith('/') ? srcDir.slice(0, -1) : srcDir;
  dstDir = dstDir.endsWith('/') ? dstDir.slice(0, -1) : dstDir;

  if (dryRun) {
    console.log('Dry run mode - not writing to files');
  }

  if (checkMode) {
    console.log('Check mode - validating components are up to date');
    // In check mode, we always want to do a dry run (no actual changes)
    dryRun = true;
  }

  if (headersOnly) {
    console.log('Headers only mode - only copying docblock headers');
  }

  try {
    // Check if source directory exists
    if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) {
      console.error(`Error: Source directory does not exist: ${srcDir}`);
      process.exit(1);
    }

    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dstDir)) {
      if (!dryRun) {
        console.log(`Creating destination directory: ${dstDir}`);
        fs.mkdirSync(dstDir, { recursive: true });
      } else {
        console.log(`Would create destination directory: ${dstDir}`);
      }
    } else if (!fs.statSync(dstDir).isDirectory()) {
      console.error(`Error: Destination path exists but is not a directory: ${dstDir}`);
      process.exit(1);
    }

    console.log(`Source directory: ${srcDir}`);
    console.log(`Destination directory: ${dstDir}`);

    let results;
    if (headersOnly) {
      // Process only headers
      results = processHeaders(srcDir, dstDir, dryRun, checkMode);
    } else {
      // Process full components with namespace transformations
      results = processComponents(srcDir, dstDir, dryRun, checkMode);
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
    if (results.componentsCount) {
      console.log(`    Components: ${results.componentsCount}`);
    }
    if (results.assetCount) {
      console.log(`    Assets: ${results.assetCount}`);
    }
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
      console.error(`\n${results.failed} file(s) failed to process.`);
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
Usage: node components-update-twig.js [options] <src-dir> <dst-dir>

Synchronize components between directories, with options to:
1. Copy entire components with namespace transformations (default)
2. Copy only the docblock headers (with --headers-only flag)

This tool can:
- Copy twig files from source to destination directory
- Copy all asset files in component directories (everything except *.component.yml and *.css files)
- Replace "civictheme:" namespace references with path-based namespaces
- Copy only docblock headers from source to destination files
- Verify that components are up-to-date without making changes

Files with the following patterns are excluded:
- .stories.twig
- .component.yml
- .css

The script handles relative paths:
- "../../components/sdc" is relative to the script location
- "packages/sdc/components" is relative to the project root

Options:
  --headers-only  Only copy docblock headers, not entire components
  --dry-run       Don't write to files, just show what would be copied
  --check         Check if components need updates, exits with code 1 if updates needed
  --help, -h      Show this help message

Arguments:
  <src-dir>       Source directory containing twig files 
  <dst-dir>       Destination directory where twig files will be written

Examples:
  node components-update-twig.js packages/sdc/components packages/twig/components
  node components-update-twig.js --headers-only packages/sdc/components packages/twig/components
  node components-update-twig.js --check packages/sdc/components packages/twig/components
  `);
}

/**
 * Find files matching a pattern recursively.
 *
 * @param {string} baseDir - Base directory to search in
 * @param {string} extension - File extension to search for
 * @param {Array} excludePatterns - Array of patterns to exclude
 * @returns {Array} Array of file paths with relative paths from baseDir
 */
function findFiles(baseDir, extension, excludePatterns = []) {
  try {
    // Make sure we use the full path for find command
    const fullPath = path.resolve(process.cwd(), baseDir);
    // Properly quote the path for find command to handle spaces and special characters
    const command = `find "${fullPath}" -name "*.${extension}" -type f`;

    console.log(`Searching for ${extension} files in: ${fullPath}`);
    const output = execSync(command, { encoding: 'utf8' });

    // Convert absolute paths to relative paths from baseDir
    const files = output.trim().split('\n')
      .filter(Boolean)
      .map((absolutePath) => path.relative(fullPath, absolutePath));

    // Filter out excluded patterns
    if (excludePatterns.length > 0) {
      const filteredFiles = files.filter((file) => !excludePatterns.some((pattern) => file.includes(pattern)));
      console.log(`Found ${files.length} files, ${files.length - filteredFiles.length} excluded`);
      return filteredFiles;
    }

    return files;
  } catch (error) {
    console.error(`Error finding files: ${error.message}`);
    return [];
  }
}

/**
 * Ensures that a file ends with a newline character.
 * 
 * @param {string} filePath - Path to the file to check
 * @param {boolean} dryRun - If true, don't write to files
 * @returns {boolean} True if the file needed a newline added, false otherwise
 */
function ensureFileEndsWithNewline(filePath, dryRun = false) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return false;
    }

    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file already ends with a newline
    if (!content.endsWith('\n')) {
      if (!dryRun) {
        // Add newline and write back to file
        fs.writeFileSync(filePath, content + '\n', 'utf8');
        console.log(`Added missing newline to ${filePath}`);
      } else {
        console.log(`Would add missing newline to ${filePath}`);
      }
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error ensuring newline at end of ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Extract docblock header from a twig file.
 *
 * @param {string} content - Twig file content
 * @returns {string|null} Docblock header or null if not found
 */
function extractDocblock(content) {
  const docblockMatch = content.match(/\{#\s*\/\*\*[\s\S]*?\*\/\s*#\}/);
  return docblockMatch ? docblockMatch[0] : null;
}

/**
 * Get namespace mapping for a component file based on its path
 *
 * @param {string} relPath - Relative path of the component
 * @returns {Object} Mapping of component name to namespace
 */
function getNamespaceMapping(relPath) {
  // Parse the component path to get the directory structure
  // e.g. "03-organisms/header/header.twig" => { type: "organisms", name: "header" }
  const dirPath = path.dirname(relPath);
  const fileName = path.basename(relPath, '.twig');

  // Extract the component type from the directory path
  // Look for patterns like "01-atoms", "02-molecules", "03-organisms"
  // and strip the numeric prefix
  const dirParts = dirPath.split('/');
  let componentType = '';
  let componentPath = '';

  if (dirParts[0].match(/^\d+-[a-z]+$/)) {
    // This is a directory with pattern like "01-atoms"
    componentType = dirParts[0].replace(/^\d+-/, '');
    componentPath = dirPath.replace(/^\d+-[a-z]+\//, '');
  } else {
    // Just use the first directory as component type
    componentType = dirParts[0];
    componentPath = dirPath.replace(`${componentType}/`, '');
  }

  // If the file is in a subdirectory with the same name as the file,
  // adjust the component path
  // e.g. "organisms/header/header.twig" => component path should be "header"
  if (componentPath.endsWith(`/${fileName}`)) {
    componentPath = componentPath.replace(`/${fileName}`, '');
  }

  // Build the namespace prefix
  // e.g. "@organisms/header/"
  const namespacePrefix = `@${componentType}/${componentPath}${componentPath ? '/' : ''}`;

  // Create a mapping of component names to their full namespace paths
  const mapping = {
    [fileName]: `${namespacePrefix}${fileName}.twig`,
  };

  return mapping;
}

/**
 * Replace civictheme namespace references with path-based references
 *
 * @param {string} content - Original twig file content
 * @param {Object} namespaceMap - Mapping of component names to namespaces
 * @returns {string} Transformed content
 */
function replaceNamespaces(content, namespaceMap) {
  let transformedContent = content;

  // Find all civictheme: namespace references
  const namespaceRegex = /civictheme:([a-zA-Z0-9_\-]+)/g;
  let match;

  while ((match = namespaceRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const componentName = match[1];

    // If we have a mapping for this component
    if (namespaceMap[componentName]) {
      transformedContent = transformedContent.replace(
        fullMatch,
        namespaceMap[componentName],
      );
    }
  }

  return transformedContent;
}

/**
 * Build a complete namespace mapping for all components
 *
 * @param {string} srcDir - Source directory
 * @param {Array} componentFiles - List of component files
 * @returns {Object} Complete namespace mapping
 */
function buildNamespaceMapping(srcDir, componentFiles) {
  const completeMapping = {};

  componentFiles.forEach((relPath) => {
    const mapping = getNamespaceMapping(relPath);

    // Add each component mapping to the complete mapping
    Object.entries(mapping).forEach(([key, value]) => {
      completeMapping[key] = value;
    });
  });

  return completeMapping;
}

/**
 * Find all asset files in a directory that aren't twig, yml, or stories.
 *
 * @param {string} baseDir - Base directory to search in
 * @returns {Array} Array of asset file paths relative to baseDir
 */
function findAssetFiles(baseDir) {
  try {
    const fullPath = path.resolve(process.cwd(), baseDir);
    // Find all files recursively and exclude *.component.yml, *.stories.twig, *.twig, and *.css files
    const command = `find "${fullPath}" -type f -not -name "*.component.yml" -not -name "*.stories.twig" -not -name "*.twig" -not -name "*.css"`;

    console.log(`Searching for asset files in: ${fullPath}`);
    const output = execSync(command, { encoding: 'utf8' });

    // Convert absolute paths to relative paths from baseDir
    const files = output.trim().split('\n')
      .filter(Boolean)
      .map((absolutePath) => path.relative(fullPath, absolutePath));

    console.log(`Found ${files.length} asset files`);
    return files;
  } catch (error) {
    console.error(`Error finding asset files: ${error.message}`);
    return [];
  }
}

/**
 * Copy a file from source to destination.
 *
 * @param {string} srcPath - Source file path
 * @param {string} dstPath - Destination file path
 * @param {boolean} dryRun - If true, don't actually copy the file
 * @returns {boolean} True if the file was copied or would be copied, false otherwise
 */
function copyFile(srcPath, dstPath, dryRun) {
  try {
    const dstDirPath = path.dirname(dstPath);

    // Make sure the destination directory exists
    if (!fs.existsSync(dstDirPath)) {
      if (!dryRun) {
        fs.mkdirSync(dstDirPath, { recursive: true });
      }
    }

    // Check if file already exists and is identical
    if (fs.existsSync(dstPath)) {
      const srcContent = fs.readFileSync(srcPath);
      const dstContent = fs.readFileSync(dstPath);

      if (Buffer.compare(srcContent, dstContent) === 0) {
        return false; // Files are identical, no need to copy
      }
    }

    // Copy the file if not in dry run mode
    if (!dryRun) {
      fs.copyFileSync(srcPath, dstPath);
    }

    return true; // File was copied or would be copied
  } catch (error) {
    console.error(`Error copying file ${srcPath} to ${dstPath}: ${error.message}`);
    return false;
  }
}

/**
 * Process components by copying them from source to destination
 * with namespace transformations. Also copy all other assets found in component directories.
 *
 * @param {string} srcDir - Source directory
 * @param {string} dstDir - Destination directory
 * @param {boolean} dryRun - If true, don't write to files
 * @param {boolean} checkMode - If true, just check if updates are needed
 * @returns {Object} Results with counts
 */
function processComponents(srcDir, dstDir, dryRun, checkMode) {
  // Patterns to exclude
  const excludePatterns = ['.stories.twig'];

  // Find all twig files in the source directory, excluding stories
  const srcFiles = findFiles(srcDir, 'twig', excludePatterns);
  const srcCount = srcFiles.length;

  console.log(`Found ${srcCount} valid twig files in source directory (excluding .stories.twig)`);

  // Find all asset files (not twig, not component.yml)
  const assetFiles = findAssetFiles(srcDir);
  console.log(`Found ${assetFiles.length} asset files to copy`);
  
  // Find all YAML files to ensure they have newlines
  if (!checkMode) {
    console.log(`Checking source YAML files for newlines...`);
    const yamlFiles = findFiles(srcDir, 'yml');
    yamlFiles.forEach(yamlFile => {
      const fullPath = path.join(srcDir, yamlFile);
      ensureFileEndsWithNewline(fullPath, dryRun);
    });
    
    // Also ensure all twig files in source have newlines
    console.log(`Checking source Twig files for newlines...`);
    srcFiles.forEach(twigFile => {
      const fullPath = path.join(srcDir, twigFile);
      ensureFileEndsWithNewline(fullPath, dryRun);
    });
  }

  // Build a complete namespace mapping for all components
  const namespaceMapping = buildNamespaceMapping(srcDir, srcFiles);

  // Log the namespace mapping for debugging
  console.log('\nNamespace mapping:');
  Object.entries(namespaceMapping).forEach(([key, value]) => {
    console.log(`  ${key} => ${value}`);
  });
  console.log('');

  let processed = 0;
  let assetProcessed = 0;
  const skipped = 0;
  let failed = 0;
  let needsUpdate = 0;

  // Process each source file
  srcFiles.forEach((relPath) => {
    try {
      const srcPath = path.join(srcDir, relPath);
      const dstPath = path.join(dstDir, relPath);
      const dstDirPath = path.dirname(dstPath);

      // Read source file
      const srcContent = fs.readFileSync(srcPath, 'utf8');

      // Transform content by replacing namespace references
      const transformedContent = replaceNamespaces(srcContent, namespaceMapping);

      // Check if destination file exists
      const fileExists = fs.existsSync(dstPath);
      let needsThisUpdate = true;

      if (fileExists) {
        // Read destination file
        const dstContent = fs.readFileSync(dstPath, 'utf8');

        // Check if content is already up to date
        if (dstContent === transformedContent) {
          needsThisUpdate = false;
          console.log(`Component ${relPath} is up to date`);
        }
      }

      if (needsThisUpdate) {
        needsUpdate++;

        if (checkMode) {
          console.log(`\x1b[31mComponent ${relPath} ${fileExists ? 'NEEDS TO BE UPDATED' : 'NEEDS TO BE CREATED'}\x1b[0m`);
          processed++;
          return;
        }

        if (dryRun) {
          console.log(`\x1b[31mComponent ${relPath} WOULD BE ${fileExists ? 'UPDATED' : 'CREATED'}\x1b[0m`);
          processed++;
          return;
        }

        // Ensure destination directory exists
        if (!fs.existsSync(dstDirPath)) {
          fs.mkdirSync(dstDirPath, { recursive: true });
        }

        // Make sure content ends with newline
        if (!transformedContent.endsWith('\n')) {
          transformedContent += '\n';
        }
        
        // Write transformed content to destination file
        fs.writeFileSync(dstPath, transformedContent, 'utf8');
        console.log(`\x1b[32mComponent ${relPath} ${fileExists ? 'UPDATED' : 'CREATED'}\x1b[0m`);
        processed++;
      } else {
        processed++;
      }
    } catch (error) {
      console.error(`Error processing ${relPath}: ${error.message}`);
      failed++;
    }
  });

  // Now copy all asset files
  console.log('\nProcessing asset files...');
  assetFiles.forEach((relPath) => {
    try {
      const srcPath = path.join(srcDir, relPath);
      const dstPath = path.join(dstDir, relPath);

      // Default to needing update if file doesn't exist
      let needsThisUpdate = true;

      // If file exists, check content
      if (fs.existsSync(dstPath)) {
        const srcContent = fs.readFileSync(srcPath);
        const dstContent = fs.readFileSync(dstPath);
        needsThisUpdate = Buffer.compare(srcContent, dstContent) !== 0;
      }

      if (needsThisUpdate) {
        if (checkMode) {
          console.log(`\x1b[31mAsset ${relPath} ${fs.existsSync(dstPath) ? 'NEEDS TO BE UPDATED' : 'NEEDS TO BE CREATED'}\x1b[0m`);
          needsUpdate++;
          assetProcessed++;
          return;
        }

        if (dryRun) {
          console.log(`\x1b[31mAsset ${relPath} WOULD BE ${fs.existsSync(dstPath) ? 'UPDATED' : 'CREATED'}\x1b[0m`);
          assetProcessed++;
          return;
        }

        const copied = copyFile(srcPath, dstPath, false);
        if (copied) {
          console.log(`\x1b[32mAsset ${relPath} ${fs.existsSync(dstPath) ? 'UPDATED' : 'CREATED'}\x1b[0m`);
        } else {
          console.log(`Asset ${relPath} already up to date`);
        }
        assetProcessed++;
      }
    } catch (error) {
      console.error(`Error processing asset ${relPath}: ${error.message}`);
      failed++;
    }
  });

  return {
    processed: processed + assetProcessed,
    skipped,
    failed,
    needsUpdate,
    total: srcCount + assetFiles.length,
    assetCount: assetFiles.length,
    componentsCount: srcCount,
  };
}

/**
 * Process components by copying only their docblock headers
 * from source to destination files.
 *
 * @param {string} srcDir - Source directory
 * @param {string} dstDir - Destination directory
 * @param {boolean} dryRun - If true, don't write to files
 * @param {boolean} checkMode - If true, just check if updates are needed
 * @returns {Object} Results with counts
 */
function processHeaders(srcDir, dstDir, dryRun, checkMode) {
  // Patterns to exclude
  const excludePatterns = ['.stories.twig'];

  // Find all twig files in the source directory, excluding stories
  const srcFiles = findFiles(srcDir, 'twig', excludePatterns);
  const srcCount = srcFiles.length;

  console.log(`Found ${srcCount} valid twig files in source directory (excluding .stories.twig)`);

  // Find all twig files in the destination directory for counting, excluding stories
  const dstAllFiles = findFiles(dstDir, 'twig', excludePatterns);
  const dstCount = dstAllFiles.length;

  console.log(`Found ${dstCount} valid twig files in destination directory (excluding .stories.twig)`);
  
  // Find all YAML files to ensure they have newlines
  if (!checkMode) {
    // Check source YAML and Twig files for newlines
    console.log(`Checking source YAML files for newlines...`);
    const srcYamlFiles = findFiles(srcDir, 'yml');
    srcYamlFiles.forEach(yamlFile => {
      const fullPath = path.join(srcDir, yamlFile);
      ensureFileEndsWithNewline(fullPath, dryRun);
    });
    
    console.log(`Checking source Twig files for newlines...`);
    srcFiles.forEach(twigFile => {
      const fullPath = path.join(srcDir, twigFile);
      ensureFileEndsWithNewline(fullPath, dryRun);
    });
    
    // Check destination YAML and Twig files for newlines
    console.log(`Checking destination YAML files for newlines...`);
    const dstYamlFiles = findFiles(dstDir, 'yml');
    dstYamlFiles.forEach(yamlFile => {
      const fullPath = path.join(dstDir, yamlFile);
      ensureFileEndsWithNewline(fullPath, dryRun);
    });
    
    console.log(`Checking destination Twig files for newlines...`);
    dstAllFiles.forEach(twigFile => {
      const fullPath = path.join(dstDir, twigFile);
      ensureFileEndsWithNewline(fullPath, dryRun);
    });
  }

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  let needsUpdate = 0;

  // Process each source file
  srcFiles.forEach((relPath) => {
    try {
      const srcPath = path.join(srcDir, relPath);
      const dstPath = path.join(dstDir, relPath);

      // Check if destination file exists
      if (!fs.existsSync(dstPath)) {
        console.log(`Skipping: Destination file does not exist: ${dstPath}`);
        skipped++;
        return;
      }

      // Read source and destination files
      const srcContent = fs.readFileSync(srcPath, 'utf8');
      const dstContent = fs.readFileSync(dstPath, 'utf8');

      // Extract docblock from source
      const srcDocblock = extractDocblock(srcContent);

      if (!srcDocblock) {
        console.log(`Skipping: Source file has no docblock: ${srcPath}`);
        skipped++;
        return;
      }

      // Check if destination already has the correct docblock
      const dstDocblock = extractDocblock(dstContent);
      let newDstContent;
      let needsThisUpdate = false;

      if (dstDocblock) {
        // If destination already has docblock, check if it matches
        if (dstDocblock.trim() === srcDocblock.trim()) {
          // Docblocks match, no update needed
          if (checkMode) {
            console.log(`Component ${relPath} docblock is up to date`);
          }
          processed++;
          return;
        }
        // Docblocks don't match, update needed
        needsThisUpdate = true;
        newDstContent = dstContent.replace(dstDocblock, srcDocblock);
      } else {
        // No docblock in destination, add one
        needsThisUpdate = true;
        newDstContent = `${srcDocblock}\n\n${dstContent}`;
      }

      if (needsThisUpdate) {
        needsUpdate++;

        if (checkMode) {
          console.log(`\x1b[31mComponent ${relPath} NEEDS TO BE UPDATED\x1b[0m`);
          processed++;
          return;
        }

        if (dryRun) {
          console.log(`\x1b[31mComponent ${relPath} WOULD BE UPDATED\x1b[0m`);
          processed++;
          return;
        }

        // Make sure content ends with newline
        if (!newDstContent.endsWith('\n')) {
          newDstContent += '\n';
        }
        
        // Write updated content to destination file
        fs.writeFileSync(dstPath, newDstContent, 'utf8');
        console.log(`\x1b[32mComponent ${relPath} UPDATED\x1b[0m`);
        processed++;
      } else {
        processed++;
      }
    } catch (error) {
      console.error(`Error processing ${relPath}: ${error.message}`);
      failed++;
    }
  });

  return {
    processed,
    skipped,
    failed,
    needsUpdate,
    total: srcCount,
    srcCount,
    dstCount,
  };
}

// Run the script
main();
