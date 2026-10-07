# @civictheme/colour-picker

Recipe-driven sub-theme colour tooling for CivicTheme 2.x: a zero-dependency
engine (this package's P1 core), a CLI, an AI skill and a human UI, layered
over [`@civictheme/tokens`](../tokens). Full plan and recorded decisions:
`docs/colour-picker-plan.md` in the repo root.

**Status: P1 (engine) + P2 (CLI) + P3 (AI skill) + P4 (human UI) —
Leonardo generation (P5) and packaging (P6) follow.** Both this package and
`@civictheme/tokens` are `private: true` until the maintainer publishes
them.

## The model

A sub-theme's entire colour intent is a small **recipe** file — brand inputs
plus overrides and additions. Everything else (resolved values, CSS custom
properties, Figma mode files) is a build output of the recipe over the
shipped token defaults, which the recipe never modifies:

```
resolved(token, mode) = override ?? current-default ?? alias
```

```json
{
  "version": 1,
  "brands": { "light": { "brand1": "#00698f" } },
  "overrides": {
    "color.palette.highlight": { "light": "#ffcc00" },
    "color.component.button.primary-background-color": { "$value": "{color.palette.background-dark}" },
    "color.component.alert.error-background-color": { "dark": "#e85653" }
  },
  "additions": {
    "color.palette.brand-accent": { "light": "#6a3bb5", "dark": "#c9a1e8", "target": 3 },
    "color.component.my-hero.background-color": { "$value": "{color.palette.brand-accent}" }
  }
}
```

Schema: [`recipe.schema.json`](./recipe.schema.json). An identity recipe
(`{"version": 1}`) reproduces the tokens dist byte-for-byte — the engine's
acceptance gate.

## CLI (`cli.mjs`)

The AI/maintainer side application — zero dependencies, `node cli.mjs …` in
the repo (or `npx @civictheme/colour-picker …` once published):

```
resolve [--recipe recipe.json] [--json]      # full resolved table, both modes
check   [--recipe recipe.json] [--json]      # contrast QA; warns, never blocks
        [--strict] [--targets targets.json]  #   --strict exits 1 on failures (CI)
emit    --recipe recipe.json --out dir/      # every build output of the recipe
serve   [--port 8420] [--storybook-url …]    # the human UI, locally
```

`emit` writes `tokens.json` (the recipe-applied DTCG tree),
`resolved.{light,dark}.json`, `css/variables.css` (the full stylesheet),
`overrides.scss` (only the changed custom properties, loadable after the
stock variables), `figma/{light,dark}.tokens.json` (native Import mode) and
`figma/name-map.json`. An identity emit is byte-identical to the tokens
dist. `init-skill` installs the AI skill below into `./.claude/skills/`.
Exit codes: 0 success, 1 failure (or `check --strict` with failing
targets), 2 usage. `generate` arrives at P5, `serve` at P4 — each with the
thing it operates on.

## Human UI (`ui/`)

A static vanilla ESM app (no framework, no bundler) implementing the
session-11 design: brand inputs, the palette grid with per-cell override
editors and lock badges, the component-centric live preview with that
component's tokens editable below it, the full component-token table with
add-token flows, a Contrast QA band, and the export panel whose recipe JSON
block is editable copy/paste (no importer). All computation runs
client-side through `engine/core.mjs` — the same pure engine as the CLI —
via the import map in `ui/index.html`; the page is themed with the tokens
package's own custom properties.

Reach it two ways:

- **`npx @civictheme/colour-picker serve`** — a zero-dependency static
  server mounting this package at `/colour-picker/` and
  `@civictheme/tokens` at `/colour-picker-tokens/`. Pass `--storybook-url`
  to point live previews at a running Storybook.
- **Inside a Storybook** (the UIKit sdc Storybook ships it): add the
  stories glob and serve the two packages at the same paths —

  ```js
  // .storybook/main.js
  const colourPickerDir = getAbsolutePath('@civictheme/colour-picker');
  const tokensDir = getAbsolutePath('@civictheme/tokens');
  stories: [..., join(colourPickerDir, 'stories/**/*.stories.js')],
  staticDirs: [...,
    { from: colourPickerDir, to: '/colour-picker' },
    { from: tokensDir, to: '/colour-picker-tokens' }],
  ```

Live previews embed real story iframes (`iframe.html?id=…` with the theme
global per pane) and inject the generated custom properties over the
story's token CSS when the Storybook is same-origin (always true when
mounted). A cross-origin Storybook renders stock colours; no Storybook at
all degrades to resolved swatches. There is no Generate button behaviour
yet — palette generation is Node-side Leonardo at P5.

## AI skill (`skills/colour-picker/`)

`SKILL.md` teaches an AI agent the whole workflow without the UI: the
agency branch (edit a recipe, `check`, `emit` — never touch
`node_modules`) and the maintainer branch (edit `packages/tokens/tokens/*`
following the merge conventions, then the gates, including the full
fallout of a deliberate value change). It ships in the package, installs
via `init-skill`, and the UIKit repo's own copy lives at
`.claude/skills/colour-picker/`.

## Engine API (`engine/`)

- `resolve.mjs` — `resolveRecipe(recipe)` → `{ tree, resolved }`
  (recipe-applied DTCG tree + flat `{ mode: { tokenPath: hex } }` maps);
  `validateRecipe`, `applyRecipe`, `targetsForRecipe`, `loadTargets`.
  Malformed recipes throw listing every problem.
- `contrast.mjs` — own WCAG 2.x maths (no dependency): `contrastRatio`,
  `checkContrast(resolved, targets)`. Contrast failures **warn, never
  block**; the known calibration failures on today's defaults are the three
  dark values border 1.16:1, interaction-focus 2.32:1, error 2.97:1.
- `emit.mjs` — `emitCss`, `emitFigma`, `emitResolved`, `emitNameMap`: thin
  wrappers over the tokens build emit module, extended only to name recipe
  additions (custom palette slots land under `Custom/` in Figma).

Contrast targets ship as data in [`targets.json`](./targets.json) — the
recorded proposal (text ≥ 7:1, UI/status ≥ 3:1, text-on-fill ≥ 4.5:1),
designer-adjustable by editing one file.

## Boundaries (the R1–R3 guarantees)

- UIKit packages never import this one; `tests/validate-isolation.mjs`
  enforces the direction (plugin → tokens only).
- Zero runtime dependencies beyond `@civictheme/tokens`. Leonardo arrives at
  P5 only, pinned and lazy-imported, for palette generation — never for
  checking, and never in the browser.
