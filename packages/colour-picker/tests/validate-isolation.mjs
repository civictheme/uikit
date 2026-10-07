/**
 * R3 guard: UIKit never grows an edge to this plugin. No file in
 * packages/{tokens,sdc,twig} may reference colour-picker (or the color-
 * spelling) — the dependency direction is strictly plugin -> tokens. The
 * single allowed exception is the P4 opt-in mounting in the sdc Storybook
 * CONFIG (stories glob + staticDirs — build wiring, not an import edge);
 * everything else stays forbidden, package code above all.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PACKAGES_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const GUARDED = ['tokens', 'sdc', 'twig'];
const SKIP_DIRS = new Set(['node_modules', 'dist', 'storybook-static', 'vendor', '.git']);
const TEXT_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.json', '.scss', '.css', '.twig', '.md', '.yml', '.yaml', '.html', '.txt']);
const PATTERN = /colou?r-picker/i;
const ALLOWED = new Set(['sdc/.storybook/main.js']);

const hits = [];
const walk = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full);
      return;
    }
    if (!TEXT_EXTENSIONS.has(path.extname(entry.name))) return;
    if (ALLOWED.has(path.relative(PACKAGES_DIR, full))) return;
    const lines = fs.readFileSync(full, 'utf-8').split('\n');
    lines.forEach((line, index) => {
      if (PATTERN.test(line)) hits.push(`${path.relative(PACKAGES_DIR, full)}:${index + 1}: ${line.trim().slice(0, 120)}`);
    });
  });
};
GUARDED.forEach((pkg) => walk(path.join(PACKAGES_DIR, pkg)));

if (hits.length) {
  console.error(`Isolation guard FAILED: UIKit packages reference the colour-picker plugin (${hits.length} hits):`);
  hits.forEach((hit) => console.error(`  - ${hit}`));
  process.exit(1);
}
console.log(`Isolation guard passed: no reference to the plugin anywhere in packages/{${GUARDED.join(',')}} beyond the allowed sdc Storybook mounting config.`);
