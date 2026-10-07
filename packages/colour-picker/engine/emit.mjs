/**
 * Output emitters: thin wrappers over the @civictheme/tokens build emit
 * module, so a recipe's outputs come from the exact code that builds the
 * shipped dist (an identity recipe's outputs are byte-identical to it —
 * tests/validate-identity.mjs). The only extension is naming for recipe
 * ADDITIONS, which the fixed Figma tables cannot cover: custom palette slots
 * emit under Custom/ with broad picker scopes; component additions already
 * fit the mechanical Component/ name rule.
 */
import { figmaNameFor, figmaScopesFor } from '@civictheme/tokens/build/figma-names.mjs';
import { CSS_BANNER, cssForMode, figmaDoc, nameMapFor } from '@civictheme/tokens/build/emit.mjs';

const CUSTOM_SCOPES = ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE'];

const titleCase = (slug) => slug.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');

/** The Figma name for any token a recipe can produce (core tables first). */
export function recipeNameFor(tokenPath) {
  try {
    return figmaNameFor(tokenPath);
  } catch (error) {
    const parts = tokenPath.split('.');
    if (parts.length === 3 && parts[0] === 'color' && parts[1] === 'palette') return `Custom/${titleCase(parts[2])}`;
    throw error;
  }
}

/** Figma scopes for any token a recipe can produce (core tables first). */
export function recipeScopesFor(tokenPath) {
  try {
    return figmaScopesFor(tokenPath);
  } catch {
    recipeNameFor(tokenPath);
    return CUSTOM_SCOPES;
  }
}

/** dist/css/variables.css for a recipe-applied tree (full file, not a diff). */
export function emitCss(tree, resolved) {
  return `${CSS_BANNER}${cssForMode(tree, resolved, 'light')}\n${cssForMode(tree, resolved, 'dark')}`;
}

/** One mode's Figma native-import document for a recipe-applied tree. */
export function emitFigma(tree, mode) {
  return figmaDoc(tree, mode, { nameFor: recipeNameFor, scopesFor: recipeScopesFor });
}

/** dist/resolved.<mode>.json file content for a resolved map. */
export function emitResolved(resolved, mode) {
  return `${JSON.stringify(resolved[mode], null, 2)}\n`;
}

/** dist/figma/name-map.json content for a recipe-applied tree. */
export function emitNameMap(tree) {
  return nameMapFor(tree, recipeNameFor);
}
