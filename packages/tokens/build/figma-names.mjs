/**
 * Deterministic token-path <-> Figma variable name map (plan §3.1).
 *
 * Reconciled 2026-10-04 against the actual paint-style taxonomy in the
 * pretoken file: the `Colour` collection keeps each style's exact LEAF name
 * (so the leaf slugifies 1:1 to the token leaf, e.g. "Interaction Hover
 * Background" <-> interaction-hover-background) and drops the theme prefix
 * (theme becomes a mode) plus the groups' " Colours"/" Colour" suffix
 * (redundant inside a collection named "Colour"). Brand 1-3 are the only
 * leaves whose slug differs from the token name (brand-1 vs brand1) — this
 * explicit table, not string mechanics, is the contract.
 */
/*
 * The component tier (Phase 3b) is covered by a mechanical rule instead of
 * table entries: `color.component.<comp>.<prop>` <-> `Component/<Comp Title
 * Case>/<Prop Title Case>` (hyphen <-> space, title-case each word; verified
 * reversible across all 409 component tokens — no brand1-style exceptions
 * exist in this tier). Use figmaNameFor()/tokenPathFor() below, which apply
 * the table first and the rule second.
 */
export const FIGMA_NAMES = {
  'color.brand.brand1': 'Brand/Brand 1',
  'color.brand.brand2': 'Brand/Brand 2',
  'color.brand.brand3': 'Brand/Brand 3',
  'color.palette.heading': 'Typography/Heading',
  'color.palette.body': 'Typography/Body',
  'color.palette.background-light': 'Background/Background Light',
  'color.palette.background': 'Background/Background',
  'color.palette.background-dark': 'Background/Background Dark',
  'color.palette.border-light': 'Border/Border Light',
  'color.palette.border': 'Border/Border',
  'color.palette.border-dark': 'Border/Border Dark',
  'color.palette.interaction-text': 'Interaction/Interaction Text',
  'color.palette.interaction-background': 'Interaction/Interaction Background',
  'color.palette.interaction-hover-text': 'Interaction/Interaction Hover Text',
  'color.palette.interaction-hover-background': 'Interaction/Interaction Hover Background',
  'color.palette.interaction-focus': 'Interaction/Interaction Focus',
  'color.palette.highlight': 'Highlight/Highlight',
  'color.palette.information': 'Status/Information',
  'color.palette.warning': 'Status/Warning',
  'color.palette.error': 'Status/Error',
  'color.palette.success': 'Status/Success',
};

/*
 * Figma variable scopes (which pickers each variable appears in). Palette and
 * brand scopes mirror the source file's variables exactly (read from the real
 * Export-mode dump, 2026-10-06); the component tier uniformly carries
 * SHAPE_FILL + TEXT_FILL (the Phase 3b piece-1 decision — narrowing per
 * component is a parked designer decision; changing it here rolls out via the
 * next native import).
 */
export const FIGMA_SCOPES = {
  'color.brand.brand1': ['FRAME_FILL', 'SHAPE_FILL'],
  'color.brand.brand2': ['FRAME_FILL', 'SHAPE_FILL'],
  'color.brand.brand3': ['FRAME_FILL', 'SHAPE_FILL'],
  'color.palette.heading': ['TEXT_FILL'],
  'color.palette.body': ['TEXT_FILL'],
  'color.palette.background-light': ['FRAME_FILL', 'SHAPE_FILL'],
  'color.palette.background': ['FRAME_FILL', 'SHAPE_FILL'],
  'color.palette.background-dark': ['FRAME_FILL', 'SHAPE_FILL'],
  'color.palette.border-light': ['STROKE'],
  'color.palette.border': ['STROKE'],
  'color.palette.border-dark': ['STROKE'],
  'color.palette.interaction-text': ['SHAPE_FILL', 'TEXT_FILL'],
  'color.palette.interaction-background': ['FRAME_FILL', 'SHAPE_FILL'],
  'color.palette.interaction-hover-text': ['SHAPE_FILL', 'TEXT_FILL'],
  'color.palette.interaction-hover-background': ['FRAME_FILL', 'SHAPE_FILL'],
  'color.palette.interaction-focus': ['STROKE', 'EFFECT_COLOR'],
  'color.palette.highlight': ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL'],
  'color.palette.information': ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE'],
  'color.palette.warning': ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE'],
  'color.palette.error': ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE'],
  'color.palette.success': ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE'],
};

const COMPONENT_SCOPES = ['SHAPE_FILL', 'TEXT_FILL'];

const TOKEN_PATHS = Object.fromEntries(Object.entries(FIGMA_NAMES).map(([tokenPath, figmaName]) => [figmaName, tokenPath]));

const titleCase = (slug) => slug.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');

/** The Figma name for a token path (table first, component rule second). */
export function figmaNameFor(tokenPath) {
  if (FIGMA_NAMES[tokenPath]) return FIGMA_NAMES[tokenPath];
  const parts = tokenPath.split('.');
  if (parts.length === 4 && parts[0] === 'color' && parts[1] === 'component') {
    return `Component/${titleCase(parts[2])}/${titleCase(parts[3])}`;
  }
  throw new Error(`No Figma name for token "${tokenPath}" — not in FIGMA_NAMES and not a color.component.<comp>.<prop> path`);
}

/** The Figma scopes for a token path (table tiers, uniform components). */
export function figmaScopesFor(tokenPath) {
  if (FIGMA_NAMES[tokenPath]) {
    if (!FIGMA_SCOPES[tokenPath]) throw new Error(`No Figma scopes for token "${tokenPath}" — add it to FIGMA_SCOPES in build/figma-names.mjs`);
    return FIGMA_SCOPES[tokenPath];
  }
  // Throws unless it is a valid component path.
  figmaNameFor(tokenPath);
  return COMPONENT_SCOPES;
}

/**
 * The token path for a Figma variable name — the ingest direction. STRICT:
 * a Component/ name must round-trip to itself through figmaNameFor, so any
 * drift in casing or spacing introduced by a rename in Figma fails loudly
 * instead of silently mapping onto the nearest token.
 */
export function tokenPathFor(figmaName) {
  if (TOKEN_PATHS[figmaName]) return TOKEN_PATHS[figmaName];
  const segments = figmaName.split('/');
  if (segments.length === 3 && segments[0] === 'Component') {
    const slug = (name) => name.toLowerCase().replaceAll(' ', '-');
    const tokenPath = `color.component.${slug(segments[1])}.${slug(segments[2])}`;
    if (figmaNameFor(tokenPath) !== figmaName) {
      throw new Error(`Figma name "${figmaName}" does not round-trip the component name rule (expected "${figmaNameFor(tokenPath)}") — renamed in Figma?`);
    }
    return tokenPath;
  }
  throw new Error(`No token path for Figma variable "${figmaName}" — not in FIGMA_NAMES and not a Component/<Comp>/<Prop> name`);
}
