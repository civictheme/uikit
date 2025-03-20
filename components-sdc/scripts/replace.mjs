/**
 * Script to replace atomic paths with SDC paths.
 *
 * This script:
 * 1. Finds all twig files in /Component.
 * 2. Replaces paths to @base / @atoms / @molecules / @organisms with SDC path.
 */

import fs from 'fs';
import path from 'path';

const targetDir = `../components/`;

function findStoriesFiles(dir) {
  const results = [];
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results.push(...findStoriesFiles(filePath));
    } else if (file.endsWith('.twig')) {
      results.push(filePath);
    }
  });
  return results;
}

async function processStoriesFiles() {
  for (const filePath of storiesFiles) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const matches = fileData.matchAll(/@(base|atoms|molecules|organisms)\/([^/]+)\/([^/]+)\.twig/gi);
    const matchesArray = Array.from(matches).reverse();
    let updateData = fileData;

    matchesArray.forEach(match => {
      const idx = match.index;
      const str = match[0];
      const twigName = match[3];
      updateData = updateData.substring(0, idx) + 'civictheme:' + twigName + updateData.substring(idx + str.length);
    });

    fs.writeFileSync(filePath, updateData, 'utf8');
  }
}

const storiesFiles = findStoriesFiles(targetDir);
processStoriesFiles().catch(console.error);
