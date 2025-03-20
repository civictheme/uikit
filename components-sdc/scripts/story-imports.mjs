/**
 * Script to insert imports css and js into stories.
 *
 * This script:
 * 1. Finds all twig files in /Component.
 * 2. Replaces paths to @base / @atoms / @molecules / @organisms with SDC path.
 */

import fs from 'fs';
import path from 'path';

const targetDir = `../components/`;

function findStoriesFiles(dir, ext) {
  const results = [];
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results.push(...findStoriesFiles(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  });
  return results;
}

function findFileDirectory(dir, name) {
  const results = [];
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results.push(...findFileDirectory(filePath, name));
    } else if (file === name) {
      results.push(filePath);
    }
  });
  return results;
}

function getDependencyImports(dir, name) {
  const imports = [];
  const twigFiles = new Set(); // Store unique twig files to scan
  const scannedFiles = new Set(); // Prevent infinite recursion

  // First scan the stories file for twig imports
  const storiesPath = `${dir}${name}.stories.js`;
  if (fs.existsSync(storiesPath)) {
    const storiesContent = fs.readFileSync(storiesPath, 'utf8');

    // Find direct twig imports
    const twigImports = storiesContent.matchAll(/import.*from\s+'([^']*\.twig)'/g);
    for (const match of twigImports) {
      twigFiles.add(path.resolve(dir, match[1]));
    }

    // Find and scan story data files
    const dataImports = storiesContent.matchAll(/import.*from\s+'([^']*\.stories\.data)'/g);
    for (const match of dataImports) {
      const dataPath = path.resolve(dir, match[1] + '.js');
      if (fs.existsSync(dataPath)) {
        const dataContent = fs.readFileSync(dataPath, 'utf8');
        const dataTwigImports = dataContent.matchAll(/import.*from\s+'([^']*\.twig)'/g);
        for (const dataTwigMatch of dataTwigImports) {
          twigFiles.add(path.resolve(dir, dataTwigMatch[1]));
        }
      }
    }
  }

  // Scan each twig file for includes
  function scanTwigFile(twigPath) {
    if (scannedFiles.has(twigPath)) {
      return;
    }
    scannedFiles.add(twigPath);
    const twigContent = fs.readFileSync(twigPath, 'utf8');
    const includeMatches = twigContent.matchAll(/include\s+'civictheme:([^']+)'/g);

    for (const match of includeMatches) {
      const includedComponent = match[1];
      const componentPath = path.join(path.dirname(twigPath), '../../', includedComponent);
      const componentName = path.basename(componentPath);

      const dependencyPath = findFileDirectory(targetDir, `${componentName}.twig`);
      const dependencyDir = (dependencyPath.length > 0) ? path.dirname(dependencyPath[0]) : null;

      if (dependencyDir) {
        const dependencyTwigPath = `${dependencyDir}/${componentName}.twig`;
        twigFiles.add(path.resolve(dependencyTwigPath));
      }
    }
  }

  // Process all found twig files
  for (const twigPath of twigFiles) {
    scanTwigFile(twigPath);
  }

  // Generate imports for all found components
  for (const twigPath of scannedFiles) {
    const componentDir = path.dirname(twigPath);
    const componentName = path.basename(twigPath, '.twig');

    // Check for CSS
    const cssPath = `${componentDir}/${componentName}.css`;
    if (fs.existsSync(cssPath)) {
      const relativeCssPath = path.relative(dir, cssPath);
      const importCssPath = relativeCssPath.startsWith('.') ? relativeCssPath : `./${relativeCssPath}`;
      imports.push(`import '${importCssPath}'; /* generated */`);
    }

    // Check for JS
    const jsPath = `${componentDir}/${componentName}.component.js`;
    if (fs.existsSync(jsPath)) {
      const relativeJsPath = path.relative(dir, jsPath);
      const importJsPath = relativeJsPath.startsWith('.') ? relativeJsPath : `./${relativeJsPath}`;
      imports.push(`import '${importJsPath}'; /* generated */`);
    }
  }

  return [...new Set(imports)].sort(); // Remove duplicates
}

async function processStoriesFiles() {
  for (const filePath of storiesFiles) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    let fileLines = fileData.split('\n')

    // Get the component details from the path
    const pathArr = filePath.split('/')
    const fileName = pathArr.pop()
    const componentDir = pathArr.join('/') + '/'
    const componentName = pathArr.pop()

    const dependencyImports = getDependencyImports(componentDir, componentName)

    // Get the new import statements for css and js
    const newImports = [
      ...dependencyImports,
    ]

    // Remove old generated lines
    fileLines = fileLines.filter(line => line.indexOf(`/* generated */`) < 0)

    // Remove any spacing at the start of the file.
    let hitFirstItem = false
    while (!hitFirstItem) {
      if (fileLines[0] === '') {
        fileLines.shift()
      } else {
        hitFirstItem = true
      }
    }

    if (newImports.length > 0) {
      // Add new generated lines
      fileLines.unshift(...newImports, '');
    }

    fs.writeFileSync(filePath, fileLines.join('\n', 'utf8'));
  }
}

const storiesFiles = findStoriesFiles(targetDir, '.stories.js');
processStoriesFiles().catch(console.error);
