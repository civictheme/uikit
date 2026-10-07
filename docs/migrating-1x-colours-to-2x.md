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
| Sub-theme SCSS variable overrides | A **recipe** consumed by `@civictheme/colour-picker` (quick start below), or a hand-written colour overrides stylesheet of scoped custom properties (the five-step procedure) |

## Quick start: recipe-driven colours with `@civictheme/colour-picker`

The recommended 2.x sub-theme format is not a stylesheet you maintain by
hand but a small **recipe** file — your brand colours plus your explicit
overrides — from which every artefact (CSS custom properties, resolved
values, Figma variable files) is generated. The five-step procedure below
is still how you *extract* your 1.x customisations; the recipe is where
they *live* afterwards.

```sh
npm install --save-dev @civictheme/colour-picker
```

(Until the 2.x packages are published to npm, the toolchain lives in the
UIKit repo: substitute `node packages/colour-picker/cli.mjs` for
`npx @civictheme/colour-picker` below.)

1. **Write `recipe.json`** from your inventory — brands from your 1.x
   `$ct-colors-brands`, overrides/additions from the step-2 diff:

   ```json
   {
     "version": 1,
     "brands": { "light": { "brand1": "#00698f" }, "dark": { "brand1": "#61daff" } },
     "overrides": {
       "color.palette.highlight": { "light": "#ffcc00", "dark": "#cc9900" }
     },
     "additions": {
       "color.palette.brand-accent": { "light": "#6a3bb5", "dark": "#c9a1e8", "target": 3 }
     }
   }
   ```

   Schema: `node_modules/@civictheme/colour-picker/recipe.schema.json`.
   Overrides change existing tokens (palette or per-component); additions
   create new ones, including tokens for your own custom components.

2. **Optionally generate the palette from your brands**:

   ```sh
   npx @civictheme/colour-picker generate --recipe recipe.json --write
   ```

   This derives all 18 core palette slots from your brand colours —
   WCAG-targeted (text ≥ 7:1, UI/status ≥ 3:1, text-on-fill ≥ 4.5:1) where
   1.x used blind tint/shade percentages — and records the result in the
   recipe's `generated` key. Any slot you override is locked and never
   regenerated. Skip this step to keep stock palette values plus your
   overrides.

3. **Check contrast**: `npx @civictheme/colour-picker check --recipe
   recipe.json`. Failures warn, never block; add `--strict` in CI if you
   want a hard gate.

4. **Emit the build outputs**:

   ```sh
   npx @civictheme/colour-picker emit --recipe recipe.json --out build/colours
   ```

   `overrides.scss` holds exactly your changed custom properties — load it
   after CivicTheme's `civictheme.variables.css` and you are done (it is
   the step-3 stylesheet below, generated). Also emitted: the full
   `css/variables.css`, `resolved.{light,dark}.json`, the recipe-applied
   token tree, and `figma/{light,dark}.tokens.json` your designers can
   import natively into Figma variables.

5. **Commit the recipe** (and the emitted outputs your build consumes). On
   CivicTheme upgrades, re-run `emit`: untouched tokens pick up new
   defaults, your overrides persist.

Prefer a visual tool? `npx @civictheme/colour-picker serve` opens the
picker UI (palette grid with live contrast QA, per-component token editing,
live Storybook previews, the same generate button and export files). Using
an AI agent? `npx @civictheme/colour-picker init-skill` installs the
workflow skill into `./.claude/skills/`.

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
  captured by the step-2 diff. Put your brand hexes in the recipe's
  `brands` key: the colour picker's `generate` command derives the palette
  from them again (quick start, step 2) — and an existing overrides
  stylesheet converts into a recipe mechanically, since every
  `--ct-color-x: #hex` line is an `overrides` entry.
- **Dark values must be re-declared** in the `.ct-theme-dark` block even when
  equal to light, or dark scopes fall back to CivicTheme's dark defaults.
- **Status-background tints** (information/warning/error/success component
  backgrounds) are captured literals in 2.x: if your sub-theme changes the
  status palette colours, override those component properties too (step 2's
  diff catches this automatically).
