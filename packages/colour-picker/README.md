# @civictheme/colour-picker

Recipe-driven sub-theme colour tooling for CivicTheme 2.x: a zero-dependency
engine (this package's P1 core), a CLI, an AI skill, a human UI and a
Leonardo-powered palette generator, layered over
[`@civictheme/tokens`](../tokens). Full plan and recorded decisions:
`docs/colour-picker-plan.md` in the repo root.

**Status: P1 (engine) + P2 (CLI) + P3 (AI skill) + P4 (human UI) + P5
(palette generation) — packaging (P6) follows.** Both this package and
`@civictheme/tokens` are `private: true` until the maintainer publishes
them.

## The model

A sub-theme's entire colour intent is a small **recipe** file — brand inputs
plus overrides and additions. Everything else (resolved values, CSS custom
properties, Figma mode files) is a build output of the recipe over the
shipped token defaults, which the recipe never modifies:

```
resolved(token, mode) = override ?? generated ?? current-default ?? alias
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
acceptance gate. A `generated` key may also appear: it holds the palette
values the `generate` command materialised from the brand inputs (below),
is owned wholesale by that command, and sits under overrides in the
resolution order — so nothing is ever force-generated and a recipe without
the key still resolves to stock.

## Palette generation (`generate`)

`generate` derives every core palette slot from the recipe's `brands` and
writes the result into the recipe's `generated` key:

- **Contrast slots** (heading, body, border, the interaction texts, focus
  and the status colours) are solved by
  [`@adobe/leonardo-contrast-colors`](https://github.com/adobe/leonardo) on
  the key colour's scale to the stock design's measured contrast ratio,
  floored at the [`targets.json`](./targets.json) WCAG targets and measured
  against the slot's own `against` token. On stock brands this fixes the
  three known dark failures (border, interaction-focus and error all come
  out ≥ 3:1) while leaving slots already at their recorded ratio untouched.
- **The rest** (backgrounds, border-light/dark, the interaction fills,
  highlight) follow the 1.x `$ct-colors-default` tint/shade derivation
  verbatim — on stock brands they reproduce the stock values byte-for-byte.

The whole mapping is data, not code:
[`generation.json`](./generation.json) records per slot the method, key
colour and per-mode ratios, designer-editable in one file. Slots carrying
an override in the recipe are **locked** — `generate` never writes them.

Leonardo is this package's one dependency beyond `@civictheme/tokens`
(pinned, approved per-dependency as recorded in the plan) and is **lazily
imported, Node-side only** — the containment rule: no Leonardo bytes are
ever bundled, served to, or executed in a browser. The UI's Generate button
POSTs the recipe to the local `serve` process (`POST /generate`), which
runs the solve and returns the updated recipe; every other command keeps
working if the dependency is absent.

## CLI (`cli.mjs`)

The AI/maintainer side application — zero dependencies, `node cli.mjs …` in
the repo (or `npx @civictheme/colour-picker …` once published):

```
resolve  [--recipe recipe.json] [--json]      # full resolved table, both modes
check    [--recipe recipe.json] [--json]      # contrast QA; warns, never blocks
         [--strict] [--targets targets.json]  #   --strict exits 1 on failures (CI)
emit     --recipe recipe.json --out dir/      # every build output of the recipe
generate [--recipe recipe.json] [--write]     # solve the palette from the brands
serve    [--port 8420] [--storybook-url …]    # the human UI, locally
```

`emit` writes `tokens.json` (the recipe-applied DTCG tree),
`resolved.{light,dark}.json`, `css/variables.css` (the full stylesheet),
`overrides.scss` (only the changed custom properties, loadable after the
stock variables), `figma/{light,dark}.tokens.json` (native Import mode) and
`figma/name-map.json`. An identity emit is byte-identical to the tokens
dist. `generate` prints the recipe with its freshly solved `generated` key
(`--write` updates the `--recipe` file in place; `--json` adds the per-slot
QA rows). `init-skill` installs the AI skill below into `./.claude/skills/`.
Exit codes: 0 success, 1 failure (or `check --strict` with failing
targets), 2 usage.

## Human UI (`ui/`)

A static vanilla ESM app (no framework, no bundler) implementing the
session-11 design: brand inputs, the palette grid with per-cell override
editors and lock badges, the component-centric live preview with that
component's tokens editable below it, the full component-token table with
add-token flows, a Contrast QA band, and the export panel with a recipe
file importer and an editable copy/paste recipe JSON block. All computation runs
client-side through `engine/core.mjs` — the same pure engine as the CLI —
via the import map in `ui/index.html`; the page is themed with the tokens
package's own custom properties.

Reach it two ways:

- **`npx @civictheme/colour-picker serve`** — a zero-dependency static
  server mounting this package at `/colour-picker/` and
  `@civictheme/tokens` at `/colour-picker-tokens/`. Pass `--storybook-url`
  to a running Storybook and `serve` **proxies it same-origin** (every path
  it does not own is forwarded), so the live story previews accept the
  generated-CSS injection and restyle on every recipe change — including
  a freshly generated palette.
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
all degrades to resolved swatches. The Generate button is live only when
the page is served by the CLI (`serve-config.json` advertises the
`/generate` endpoint); the Storybook-static copy keeps it disabled with
instructions to run `serve` — generation is Node-side only.

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
- `derive.mjs` — `generateRecipe(recipe)` → `{ recipe, rows }` (the recipe
  with a fresh `generated` key + the per-slot QA rows). The only module
  that touches Leonardo, behind a lazy import; everything else works
  without the dependency installed.

Contrast targets ship as data in [`targets.json`](./targets.json) — the
recorded proposal (text ≥ 7:1, UI/status ≥ 3:1, text-on-fill ≥ 4.5:1),
designer-adjustable by editing one file.

## Boundaries (the R1–R3 guarantees)

- UIKit packages never import this one; `tests/validate-isolation.mjs`
  enforces the direction (plugin → tokens only).
- Zero runtime dependencies beyond `@civictheme/tokens`, with the one
  recorded exception: `@adobe/leonardo-contrast-colors` (pinned exact,
  lazy-imported) for palette generation only — never for checking, and
  never in the browser (`tests/validate-ui.mjs` asserts the browser graph
  cannot reach `derive.mjs`).
