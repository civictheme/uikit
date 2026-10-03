# @civictheme/tokens

DTCG-format design tokens — the single source of truth for colour in CivicTheme 2.x. SCSS/CSS custom properties and Figma variables are both generated from the JSON here; neither side derives colours itself.

## Layout

```
tokens/
  color.brand.json      # brand1/2/3 primitives — the only hand-edited colour inputs
  color.palette.json    # 18 semantic colours — resolved values (generated, Phase 4 regenerates via Leonardo)
build/                  # Style Dictionary v5 build + the token<->Figma name map
dist/
  css/variables.css     # 2.x theme-scoped custom properties (:root/.ct-theme-light + .ct-theme-dark)
  figma/light.tokens.json   # Figma native DTCG mode import files (right-click mode -> Import mode)
  figma/dark.tokens.json
  figma/name-map.json   # token path <-> Figma variable name contract
  resolved.{light,dark}.json  # flat token-path -> hex maps for tooling/CI
tests/validate-resolved-values.mjs  # resolved-value equality gate vs compiled UIKit CSS
```

## Token format (DTCG 2025.10)

- Colour `$value`s are structured objects (`colorSpace`/`components`/`alpha`/`hex`). `hex` is always carried and is the canonical comparison key — Figma stores float32 components.
- **Theme is a mode, never part of the token path.** A token's `$value` is the light (default) mode value; the dark value lives under `$extensions["io.civictheme.modes"].dark`. The build emits one single-mode file per mode for Figma, and both scopes into one CSS file.
- Token path ↔ CSS custom property ↔ Figma variable differ only by separators/case: `color.palette.interaction-background` ↔ `--ct-color-interaction-background` ↔ `Interaction/Background`. The explicit map lives in `build/figma-names.mjs` (group assignment, e.g. `heading` → `Typography/`, is a lookup, not string mechanics).
- Brand tokens are generator inputs only — they ship in Figma for designers, but never in CSS.

## Commands

```
npm run dist -w packages/tokens    # build dist/ from tokens/
npm run test -w packages/tokens    # resolved-value gate: tokens must equal compiled UIKit CSS
```

The test compares every brand + palette token against the compiled `--ct-color-{light|dark}-*` custom properties in `packages/{sdc,twig}/dist`. Phase 1 captured today's compiled values into the tokens, so the diff starts at zero and must stay zero until the deliberate Leonardo regeneration (Phase 4) — any failure is either a token typo or an unflagged colour change in SCSS.

## Current status / provisional bits

- Theme scope selectors are `.ct-theme-light` / `.ct-theme-dark` (with light also on `:root`) — matches the existing class convention; `[data-theme]` was the alternative (plan §3.4 open item).
- Figma leaf names `Background/Default`, `Border/Default`, `Highlight/Default` are provisional until Phase 3 creates the `Colour` collection seeded from the actual paint-style names.
- Figma import files emit plain hex strings (maximum importer compatibility); flip to full colour objects in `build/build.mjs` if Figma's importer prefers them.
- Component-tier tokens (`color.components.json`, ~568 aliases) land in Phase 2.
