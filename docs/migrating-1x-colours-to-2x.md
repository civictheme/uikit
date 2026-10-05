# Migrating sub-theme colours from 1.x to 2.x

CivicTheme 2.x removes the Sass colour system. If your sub-theme customises
colour through `$ct-colors-brands`, `$ct-colors`, `$ct-*-light-*`/`$ct-*-dark-*`
variables or the `ct-color-*()` functions, **it will not compile against
2.x** until those customisations are migrated. Everything else (spacing,
typography, grid, custom components) is unaffected by this change.

The architecture itself is explained in
[`2x-colour-variables.md`](2x-colour-variables.md); the token source lives in
[`packages/tokens`](../packages/tokens/README.md). An AI-agent version of
this procedure (suitable for Claude Code or similar) is
[`migrate-1x-colours-to-2x.prompt.md`](migrate-1x-colours-to-2x.prompt.md).

## What replaced what

| 1.x | 2.x |
|---|---|
| `$ct-colors-brands`, `$ct-colors` maps | DTCG tokens (`packages/tokens`); palette ships as `--ct-color-[slot]` custom properties |
| `$ct-chip-light-background-color` / `…-dark-…` pairs | One property per role: `--ct-chip-background-color` |
| Per-theme rules and variable names | Theme scopes: `:root`/`.ct-theme-light` and `.ct-theme-dark`; one definition, resolved per scope |
| `ct-color-light/dark/tint/shade/tone/blend/constant-*()` | Removed — no compile-time colour processing exists |
| Sub-theme SCSS variable overrides | A colour overrides stylesheet of scoped custom properties (below) |

## The migration in five steps

1. **Inventory** every colour customisation in the sub-theme: the two Sass
   maps, `$ct-*-light/dark-*` overrides, `ct-color-*()` calls, and raw hexes
   that duplicate palette values.

2. **Capture resolved values from your compiled 1.x CSS.** Your 1.x
   `civictheme.variables.css` has every palette and component variable fully
   resolved. Diff it against a stock CivicTheme 1.x build: the changed
   properties are exactly your customisations, including knock-on values you
   never wrote explicitly (palette slots derived from your brand colours, and
   component values 1.x derived from the palette, such as the
   status-background tints).

3. **Write the overrides stylesheet**, loaded after CivicTheme's
   `civictheme.variables.css`:

   ```css
   :root,
   .ct-theme-light {
     --ct-color-highlight: #ffcc00;
   }

   .ct-theme-dark {
     --ct-color-highlight: #cc9900;
   }
   ```

   Palette names map 1:1 (`'highlight'` → `--ct-color-highlight`). For
   component variables, do not guess the 2.x name from the 1.x one — every
   token in `packages/tokens/tokens/color.components.json` lists its 1.x
   source variables under `$extensions["io.civictheme.scss"]`; look yours up
   there. Overriding a palette property restyles everything that aliases it.

4. **Convert your own SCSS**: `ct-color-light('x')` → `var(--ct-color-x)`
   (and drop the dark twin rule — the scope handles it); resolved hexes from
   the compiled CSS replace `ct-color-tint/shade(...)` expressions; for
   translucent palette colours use
   `color-mix(in srgb, var(--ct-color-x) NN%, transparent)`.

5. **Validate**: zero remaining `$ct-*-light/dark-*` or `ct-color-` hits;
   render pages in both themes (toggle `.ct-theme-dark`) and compare with
   your 1.x rendering — the values came from it, so any difference is a
   migration bug.

## Notes

- **Brand colours** are generator inputs, not CSS. Their palette effects are
  captured by the step-2 diff. Keep your brand hexes recorded: a later 2.x
  release ships a recipe file + colour generator (Leonardo-based) that
  derives the palette from brands again — your overrides stylesheet converts
  into a recipe mechanically if you kept the step-2 diff.
- **Dark values must be re-declared** in the `.ct-theme-dark` block even when
  equal to light, or dark scopes fall back to CivicTheme's dark defaults.
- **Status-background tints** (information/warning/error/success component
  backgrounds) are captured literals in 2.x: if your sub-theme changes the
  status palette colours, override those component properties too (step 2's
  diff catches this automatically).
