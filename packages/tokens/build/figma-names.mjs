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
