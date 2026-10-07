---
name: colour-picker
description: CivicTheme colour and theming work — sub-theme recipes, token edits, contrast QA. Use when changing colours, building or updating a sub-theme, adding colour tokens, or checking contrast in a project that has @civictheme/colour-picker installed or in the CivicTheme UIKit repo itself.
---

# CivicTheme colour picker — AI workflow

You never need the human UI. The CLI is the whole application for you:
`npx @civictheme/colour-picker <cmd>` in a consumer project, or
`node packages/colour-picker/cli.mjs <cmd>` in the CivicTheme UIKit repo.
Every command takes `--json` for machine-readable output.

## Decide which branch you are on

**Agency / sub-theme work** (a consumer project depending on
`@civictheme/sdc`): you change a **recipe**, never CivicTheme's own files.

1. Edit (or create) `recipe.json`. Schema v1, formally at
   `node_modules/@civictheme/colour-picker/recipe.schema.json` (in the UIKit
   repo: `packages/colour-picker/recipe.schema.json`); the shape in full:

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

   Semantics: per token and mode, `override ?? generated ?? current-default
   ?? alias`. In an override, a mode literal (`"light"`/`"dark"`, `#rrggbb` or
   `"transparent"`) wins over `"$value"` (an alias re-point applying to both
   modes); a mode with neither keeps the shipped default. `additions` create
   NEW tokens (paths must not collide; palette additions may carry a contrast
   `target`, measured against `color.palette.background-light` unless
   `against` names another token). A `generated` key may also be present —
   it is OWNED by the `generate` command (below): never hand-edit it, and
   know that every `generate` run replaces it wholesale. Token paths are the keys of
   `node_modules/@civictheme/tokens/dist/resolved.light.json` (in the UIKit
   repo: `packages/tokens/dist/resolved.light.json`; an `emit` run's
   `resolved.light.json` output lists them all too). Custom-property names:
   `--ct-color-<slug>` for palette tokens, `--ct-<component>-<property>` for
   component tokens (no `component` segment).

2. Optional — generate the palette from the brand inputs:
   `npx @civictheme/colour-picker generate --recipe recipe.json --write`
   solves every core palette slot from `brands` (Leonardo, WCAG-targeted:
   contrast slots are solved to the stock design's contrast structure and
   floored at the targets, the rest follow the 1.x tint/shade rules — the
   table is `generation.json` in the package root) and materialises the
   result into the recipe's `generated` key. Slots with an override are
   LOCKED — never regenerated. Without `--write` it prints the updated
   recipe; `--json` returns `{ recipe, rows }` where `rows` is the per-slot
   QA table (before/after values, achieved ratio, floor). On stock brands
   this also fixes the 3 known dark failures (border, interaction-focus,
   error all come out ≥ 3:1). Requires `@adobe/leonardo-contrast-colors`
   (installed with the package; Node-side only — generation never runs in a
   browser).
3. `npx @civictheme/colour-picker check --recipe recipe.json --json` —
   the contrast oracle. Failures are warnings, never blockers; use
   `--strict` only where CI should fail.
4. `npx @civictheme/colour-picker emit --recipe recipe.json --out <dir>` —
   writes `tokens.json` (the recipe-applied DTCG tree),
   `resolved.{light,dark}.json`, `css/variables.css` (full stylesheet),
   `overrides.scss` (only the changed custom properties — load it after the
   stock CivicTheme variables stylesheet), `figma/{light,dark}.tokens.json`
   (native Figma Import-mode files for the design side) and
   `figma/name-map.json`.
5. Commit the recipe AND the emitted outputs. Never edit anything under
   `node_modules/`.

**CivicTheme maintainer work** (this repo, changing shipped defaults): edit
`packages/tokens/tokens/color.{brand,palette,components}.json` directly,
following the merge conventions:

- `$value` holds the LIGHT value; dark lives under
  `$extensions["io.civictheme.modes"].dark` and is only ADDED when the modes
  newly diverge — never remove an existing explicit dark (some tokens record
  an equal dark deliberately).
- Literals are colour objects: `colorSpace: "srgb"`, components rounded to
  6 decimals, `alpha`, lowercase `hex`. Aliases are `"{color.path.to.token}"`
  strings.
- Preserve `$description` and every `io.civictheme.*` extension.

Prerequisite: the repo must be npm-installed at its root (`npm install`
creates the workspace links). Without them, Node resolves
`@civictheme/tokens` by walking UP into a parent checkout's `node_modules`
and the CLI silently checks the WRONG tree — if
`node_modules/@civictheme/tokens` is not a link to `packages/tokens`, stop
and install before trusting any result.

Then gate: `node packages/colour-picker/cli.mjs check --json`, then
`npm run dist -w packages/tokens` and `npm test -w packages/tokens`. A
refactor must leave the dist byte-identical. A deliberate value change is
different in three expected ways, none a bug:

1. It moves rendering — a designer-sign-off visual regression event.
2. `validate-resolved-values` fails first: packages/sdc and packages/twig
   embed the tokens dist CSS byte-for-byte, so the value change must
   rebuild them too (root `npm run dist`).
3. `validate-figma-emit` AND `validate-figma-ingest` fail against the
   committed real-export fixtures
   (`packages/tokens/tests/fixtures/figma-export/`) until the Figma
   round-trip refreshes them — import the new dist files into the Figma
   sandbox, re-export, and commit the fresh exports as the fixtures in the
   same PR. (`npm test -w packages/tokens` chains its tests with `&&` and
   stops at the first failure — run them individually for the full
   picture.)

**Either branch**: `check --json` is the programmatic contrast oracle; the
rows carry `mode`, `tokenPath`, `ratio`, `target`, `pass`. Targets live in
`targets.json` (package root) — text ≥ 7:1, UI/status ≥ 3:1, text-on-fill
≥ 4.5:1.

## Self-check your setup

On STOCK tokens, `check --json` reports exactly **3 failures, all dark**:
`color.palette.border` 1.16:1, `color.palette.interaction-focus` 2.32:1,
`color.palette.error` 2.97:1 (each vs dark background-light `#0d4458`), and
a clean light theme. Any other result on unmodified tokens means your
checkout or install is broken — stop and investigate. With a recipe loaded,
those 3 stock failures persist unless the recipe overrides those slots OR
carries a `generated` palette (generation solves them to ≥ 3:1): any count
above 3, or any new failing tokenPath, is caused by your recipe.

## Figma round-trip (maintainers)

Code → Figma: the dist files `packages/tokens/dist/figma/{light,dark}.tokens.json`
are imported natively (Variables panel → Import mode; matches by name,
preserves variable ids). Figma → code: `npm run ingest -w packages/tokens --
<Light.tokens.json> <Dark.tokens.json>` merges designer edits back. Details:
the "Code → Figma" and ingest sections of `packages/tokens/README.md`.

## Hard rules

- Never edit `dist/` anywhere — dist is always generated.
- Never bypass the recipe/token merge semantics (no hand-editing emitted
  outputs, no writes into `node_modules`).
- Agency recipes never modify `color.components.json` or the core palette —
  overrides and additions only.
- New dependencies require explicit human approval — this toolchain is
  zero-dependency by design, with one recorded exception:
  `@adobe/leonardo-contrast-colors` (pinned, approved 2026-10-07) powers
  `generate` only, loads lazily, and runs Node-side only — it must never be
  imported into the browser graph (the UI's Generate button POSTs to the
  CLI `serve` process instead).
