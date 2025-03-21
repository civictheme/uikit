import fs from 'fs';
import path from 'path';

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

export default {
  getDeps: (storiesPath) => {
    const componentDirName = '/components/';
    const componentDirectory = storiesPath.substring(0, storiesPath.lastIndexOf(componentDirName) + componentDirName.length);
    const dir = path.dirname(storiesPath);
    const twigFiles = new Set(); // Store unique twig files to scan
    const scannedFiles = new Set(); // Prevent infinite recursion

    // Scans a data file for twig imports and nested data imports
    const scanDataFile = (dataPath, currentDir) => {
      if (!fs.existsSync(dataPath)) return;

      const dataContent = fs.readFileSync(dataPath, 'utf8');

      // Add twig imports
      [...dataContent.matchAll(/import.*from\s+'([^']*\.twig)'/g)]
        .forEach(match => twigFiles.add(path.resolve(currentDir, match[1])));

      // Scan nested data files
      [...dataContent.matchAll(/import.*from\s+'([^']*\.stories\.data)'/g)]
        .forEach(match => {
          const nestedPath = path.resolve(currentDir, match[1] + '.js');
          scanDataFile(nestedPath, path.dirname(nestedPath));
        });
    };

    // Scans a twig file for includes and adds dependencies
    const scanTwigFile = (twigPath) => {
      if (scannedFiles.has(twigPath)) return;
      scannedFiles.add(twigPath);

      const twigContent = fs.readFileSync(twigPath, 'utf8');
      [...twigContent.matchAll(/include\s+'civictheme:([^']+)'/g)]
        .forEach(match => {
          const componentPath = path.join(path.dirname(twigPath), '../../', match[1]);
          const componentName = path.basename(componentPath);
          const dependencyPath = findFileDirectory(componentDirectory, `${componentName}.twig`);

          if (dependencyPath.length > 0) {
            const dependencyTwigPath = path.join(path.dirname(dependencyPath[0]), `${componentName}.twig`);
            twigFiles.add(path.resolve(dependencyTwigPath));
          }
        });
    };

    // Initial scan of stories file
    if (fs.existsSync(storiesPath)) {
      const storiesContent = fs.readFileSync(storiesPath, 'utf8');

      // Add direct twig imports
      [...storiesContent.matchAll(/import.*from\s+'([^']*\.twig)'/g)]
        .forEach(match => twigFiles.add(path.resolve(dir, match[1])));

      // Scan data files
      [...storiesContent.matchAll(/import.*from\s+'([^']*\.stories\.data)'/g)]
        .forEach(match => scanDataFile(path.resolve(dir, match[1] + '.js'), dir));
    }

    // Process all found twig files
    twigFiles.forEach(scanTwigFile);

    // Generate imports for all found components
    const imports = [];
    scannedFiles.forEach(twigPath => {
      const componentDir = path.dirname(twigPath);
      const componentName = path.basename(twigPath, '.twig');

      // Add CSS if exists
      const cssPath = path.join(componentDir, `${componentName}.css`);
      if (fs.existsSync(cssPath)) {
        const relativePath = path.relative(dir, cssPath);
        imports.push(relativePath.startsWith('.') ? relativePath : `./${relativePath}`);
      }

      // Add JS if exists and not a stories file
      if (!componentName.endsWith('.stories')) {
        const jsPath = path.join(componentDir, `${componentName}.js`);
        if (fs.existsSync(jsPath)) {
          const relativePath = path.relative(dir, jsPath);
          imports.push(relativePath.startsWith('.') ? relativePath : `./${relativePath}`);
        }
      }
    });

    return [...new Set(imports)].sort();
  }
}
