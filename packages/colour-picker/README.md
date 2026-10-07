# @civictheme/colour-picker

Recipe-driven sub-theme colour tooling for CivicTheme 2.x: a zero-dependency
engine (this package's P1 core), a CLI, an AI skill and a human UI, layered
over [`@civictheme/tokens`](../tokens). Full plan and recorded decisions:
`docs/colour-picker-plan.md` in the repo root.

**Status: P1 (engine) + P2 (CLI) — skill (P3), UI (P4), Leonardo generation
(P5) and packaging (P6) follow.** Both this package and `@civictheme/tokens`
are `private: true` until the maintainer publishes them.

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
```

`emit` writes `tokens.json` (the recipe-applied DTCG tree),
`resolved.{light,dark}.json`, `css/variables.css` (the full stylesheet),
`overrides.scss` (only the changed custom properties, loadable after the
stock variables), `figma/{light,dark}.tokens.json` (native Import mode) and
`figma/name-map.json`. An identity emit is byte-identical to the tokens
dist. Exit codes: 0 success, 1 failure (or `check --strict` with failing
targets), 2 usage. `generate` arrives at P5, `serve` at P4, `init-skill` at
P3 — each with the thing it operates on.

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
