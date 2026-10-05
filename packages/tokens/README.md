# @civictheme/tokens

DTCG-format design tokens — the single source of truth for colour in CivicTheme 2.x. SCSS/CSS custom properties and Figma variables are both generated from the JSON here; neither side derives colours itself.

## Layout

```
tokens/
  color.brand.json      # brand1/2/3 primitives — the only hand-edited colour inputs
  color.palette.json    # 18 semantic colours — resolved values (generated, Phase 4 regenerates via Leonardo)
  color.components.json # 409 component tokens — aliases into the palette (captured from the 1.x SCSS; maintained by hand until the Phase 4 generator)
build/                  # Style Dictionary v5 build, the token<->Figma name map
dist/
  css/variables.css     # 2.x theme-scoped custom properties (:root/.ct-theme-light + .ct-theme-dark)
  figma/light.tokens.json   # Figma native DTCG mode import files (right-click mode -> Import mode)
  figma/dark.tokens.json
  figma/name-map.json   # token path <-> Figma variable name contract
  resolved.{light,dark}.json  # flat token-path -> hex maps for tooling/CI
tests/validate-resolved-values.mjs  # source-resolution sanity + embeds gate vs compiled UIKit CSS
```

## Token format (DTCG 2025.10)

- Colour `$value`s are structured objects (`colorSpace`/`components`/`alpha`/`hex`). `hex` is always carried and is the canonical comparison key — Figma stores float32 components.
- **Theme is a mode, never part of the token path.** A token's `$value` is the light (default) mode value; the dark value lives under `$extensions["io.civictheme.modes"].dark`. The build emits one single-mode file per mode for Figma, and both scopes into one CSS file.
- Token path ↔ CSS custom property ↔ Figma variable differ only by separators/case: `color.palette.interaction-background` ↔ `--ct-color-interaction-background` ↔ `Interaction/Background`. The explicit map lives in `build/figma-names.mjs` (group assignment, e.g. `heading` → `Typography/`, is a lookup, not string mechanics).
- Brand tokens are generator inputs only — they ship in Figma for designers, but never in CSS.
- **Component tokens** (`color.component.chip.background-color` ↔ `--ct-chip-background-color`) are aliases into the palette — `"$value": "{color.palette.interaction-text}"` — or into other component tokens, mirroring the 1.x SCSS alias graph. Where 1.x derived values (`ct-color-tint`/`ct-color-shade` on status colours) or hardcoded them (`transparent`), the token is a captured literal with the derivation recorded in `$description`. Each token's 1.x source variables sit under `$extensions["io.civictheme.scss"]` — the bridge used by the validation test, the Phase 2b component refactor, and sub-theme migration tooling. Component tokens are **not** emitted to Figma (plan §3.1: palette variables only, unless designers ask for the tier).
- In the generated CSS, component properties are emitted as `var()` references so the alias graph survives into devtools, and they are re-declared in **both** theme scope blocks (a deliberate deviation from plan §3.4's ":root once"): `var()` substitution inside a custom property happens where that property is *declared*, and the substituted result is what inherits — declared only on `:root`, every component property would freeze at its light value for descendants of a `.ct-theme-dark` scope.

## Commands

```
npm run dist -w packages/tokens     # build dist/ from tokens/
npm run test -w packages/tokens     # source-resolution sanity + embeds gate
```

The test resolves every token through its alias graph for both modes (cycles, unknown aliases and malformed values fail), checks the component tier keeps its `io.civictheme.scss` source-variable bridge (used by sub-theme migration tooling), and asserts the compiled UIKit stylesheets (`sdc/civictheme.variables.css`, `twig/civictheme.{variables,storybook,}.css`) embed the current `dist/css/variables.css` byte-for-byte. Since 2.x components consume only the token-generated custom properties, byte-equal embedding is the whole colour contract between the packages.

`color.components.json` was captured from the 1.x SCSS by a deterministic extractor (removed with the 1.x colour variables in the Phase 2b cleanup — see git history for `build/extract-components.mjs`); it is maintained by hand until the Phase 4 generator takes over. 1.x variables set to `false` (focus slots meaning "emit no rule") or `inherit` produced no token; they are recorded with reasons under the component group's `io.civictheme.skipped` extension. The four unthemed `back-to-top` variables (light values serving both themes in 1.x) keep their light alias and pin dark mode to the light literal so rendering is unchanged inside dark scopes.

## Current status / provisional bits

- Theme scope selectors are `.ct-theme-light` / `.ct-theme-dark` (with light also on `:root`) — matches the existing class convention; `[data-theme]` was the alternative (plan §3.4 open item).
- Figma names were reconciled against the file's actual paint-style taxonomy (2026-10-04): variable leaves are the exact style leaf names (`Background/Background Light`, `Highlight/Highlight`, …), so every palette leaf slugifies 1:1 to its token name; groups drop the `" Colours"` suffix.
- Figma import files emit DTCG 2025.10 colour objects (`colorSpace`/`components`/`alpha`/`hex`) — Figma's native *Import mode* rejects legacy hex-string `$value`s. Round-trip proven byte-exact 2026-10-05.
- Component-tier derived literals (the 24 status tint/shade backgrounds) stop tracking palette changes until the Phase 4 generator re-derives them — a sub-theme that changes `error`/`warning`/`information`/`success` must override them too until then.
