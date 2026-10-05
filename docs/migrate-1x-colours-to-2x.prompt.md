# AI migration prompt: CivicTheme 1.x sub-theme colours → UIKit 2.x tokens

> **Usage:** give this entire prompt to an AI coding agent (Claude Code or
> similar) with the sub-theme codebase checked out, plus access to the
> sub-theme's **compiled 1.x CSS** (its `dist/civictheme.variables.css` or
> equivalent) and to CivicTheme UIKit 2.x (`packages/tokens`). The short
> human-readable version of this procedure is
> `docs/migrating-1x-colours-to-2x.md`.

---

You are migrating a CivicTheme 1.x sub-theme's **colour customisations** to
CivicTheme UIKit 2.x. Work only on colours — leave spacing, typography, and
other Sass untouched.

## Background: what changed

| | 1.x | 2.x |
|---|---|---|
| Palette | Sass maps (`$ct-colors-brands`, `$ct-colors`), derived at compile time via `ct-color-tint/shade/blend()` | DTCG tokens JSON (`packages/tokens/tokens/*.json`) → generated CSS custom properties; no compile-time derivation exists |
| Component colours | Doubled Sass variables `$ct-[component]-(light\|dark)-[rule]` with `!default` | One CSS custom property per role: `--ct-[component]-[rule]`, aliasing palette properties |
| Theme switching | Separate per-theme rules/variables | A scope: `:root`/`.ct-theme-light` (light is the default) and `.ct-theme-dark`; one definition per colour, resolved per scope |
| Sub-theme format | SCSS overrides of maps and `$ct-*` variables | A **colour overrides stylesheet**: scoped custom-property declarations (a recipe file + generator replaces this in a later 2.x release — structure your output so that swap is mechanical) |
| Sass colour functions | `ct-color-light/dark/tint/shade/tone/blend/constant-*` | **Removed.** Do not call them; they do not exist on 2.x |

Name mapping:

- Palette: 1.x key `'x'` → token `color.palette.x` → CSS `--ct-color-x`
  (`'interaction-hover-background'` → `--ct-color-interaction-hover-background`).
  Theme is never part of a 2.x name.
- Component: **do not derive the 2.x name from the Sass variable name by
  string mechanics.** 1.x names are ambiguous (component vs subcomponent
  hyphens). Every component token in
  `packages/tokens/tokens/color.components.json` records its exact 1.x source
  variables under `$extensions["io.civictheme.scss"]` (`light`/`dark`, or
  `unthemed`) — look the 1.x variable up there and use the token's path
  (`color.component.chip.background-color` → `--ct-chip-background-color`).
  If a variable is absent from both the extensions and the group's
  `io.civictheme.skipped` extension, flag it — do not invent a name.

## Step 1 — Inventory the sub-theme

Search the sub-theme for every colour customisation:

1. `$ct-colors-brands` and `$ct-colors` map declarations.
2. Overrides of component variables matching `$ct-*-light-*` / `$ct-*-dark-*`.
3. Calls to `ct-color-light(`, `ct-color-dark(`, `ct-color-constant-light(`,
   `ct-color-constant-dark(`, `ct-color-tint(`, `ct-color-shade(`,
   `ct-color-tone(`, `ct-color-blend(` in the sub-theme's own SCSS.
4. CSS overrides of `--ct-color-light-*` / `--ct-color-dark-*` custom
   properties (these 1.x properties no longer exist).
5. Raw hex values in sub-theme SCSS that duplicate 1.x palette values
   (compile the 1.x theme or inspect its dist CSS to get the resolved palette
   hexes first).

Produce the inventory before changing anything.

## Step 2 — Capture resolved values from the compiled 1.x CSS

The sub-theme's compiled 1.x `civictheme.variables.css` contains **every**
palette and component variable fully resolved (aliases flattened, derivations
evaluated). It is the migration's single source of values — never re-implement
`ct-color-tint/shade/blend()` maths.

1. Parse the sub-theme's compiled `--ct-color-{light|dark}-{slot}` palette
   properties and every compiled component colour property.
2. Do the same for a **stock CivicTheme 1.x** build of the same version.
3. Diff them. The changed set is exactly what the sub-theme customised —
   including knock-on changes the sub-theme never wrote explicitly (palette
   slots derived from overridden brands, and component tokens that 1.x derived
   from palette colours, e.g. the status-background tints).

## Step 3 — Write the colour overrides stylesheet

Create one stylesheet (e.g. `theme.colors.css`) loaded after CivicTheme's
`civictheme.variables.css`, containing only scoped custom-property
declarations built from the Step 2 diff:

```css
:root,
.ct-theme-light {
  --ct-color-highlight: #ffcc00;            /* palette override */
  --ct-field-message-information-background-color: #cfe6f0; /* derived literal */
}

.ct-theme-dark {
  --ct-color-highlight: #cc9900;
}
```

- Palette diffs → `--ct-color-[slot]` per scope block (light values go in the
  `:root, .ct-theme-light` block, dark in `.ct-theme-dark`).
- Component-variable diffs → the 2.x property found via the
  `io.civictheme.scss` lookup, per scope block.
- Brands: brand colours do not exist in 2.x CSS — their effect on the palette
  is already in the Step 2 palette diff. Record the brand hexes in the report
  (they become generator inputs in a later 2.x release).
- Where light and dark diffs are identical, still declare both scopes (the
  dark block must re-declare to win inside `.ct-theme-dark`).
- Skip entries whose resolved value equals stock — `!default` overrides that
  restated defaults produce empty diffs; do not emit noise.

## Step 4 — Convert custom SCSS

In the sub-theme's own components/styles:

- `ct-color-light('x')` → `var(--ct-color-x)`. Delete the parallel dark-theme
  rule if its only difference was `ct-color-dark('x')` of the same slot — the
  scope handles it.
- `ct-color-dark('x')` where there is no light counterpart: keep a
  `.ct-theme-dark &` scoped rule using `var(--ct-color-x)` only if the intent
  was dark-only styling; flag for review.
- Raw hexes that equal a 1.x palette value: replace with the matching
  `var(--ct-color-x)` **only when the semantic role is clear from context**.
  Several palette slots share hexes (in the default palette `#00698f` is
  brand1-light, brand3-dark, interaction-background-light, and
  highlight-dark) — choose by role, never by value alone; flag ambiguous
  cases.
- `ct-color-tint/shade/tone/blend()` expressions: take the resolved hex from
  the compiled 1.x CSS and use it as a literal, flagged `needs-design-review`.
- Alpha/translucency of palette colours: prefer requesting a new token;
  interim: `color-mix(in srgb, var(--ct-color-x) NN%, transparent)`.
- After conversion, no `$ct-` colour variable and no `ct-color-*()` call may
  remain anywhere in the sub-theme.

## Step 5 — Report

Write `MIGRATION-REPORT.md`: inventory counts, the Step 2 diff (as a table of
token path → light/dark values — this becomes the recipe file when the
generator ships), brand hexes, converted items, flagged items
(`needs-design-review`, `ambiguous-slot`, `no-matching-token`), and anything
intentionally left as a literal.

## Step 6 — Validate

1. Grep for leftovers: `\$ct-.*-(light|dark)-`, `ct-color-` — must be zero
   hits in the sub-theme.
2. Build the sub-theme; render representative pages in **both** themes
   (toggle `.ct-theme-dark` on a wrapper) and compare against the 1.x
   rendering. Every colour must match the 1.x render exactly — the Step 2
   values are resolved from it, so any difference is a migration bug.
3. Check devtools on a themed element: each overridden property should show
   the sub-theme's stylesheet winning over `civictheme.variables.css`.

Rules of conduct: never bulk-replace by hex value without role confirmation;
never guess token paths; prefer flagging over inventing; keep every change
reviewable (small commits per step).
