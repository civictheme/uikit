# @civictheme/tokens

DTCG-format design tokens — the single source of truth for colour in CivicTheme 2.x. SCSS/CSS custom properties and Figma variables are both generated from the JSON here; neither side derives colours itself.

## Layout

```
tokens/
  color.brand.json      # brand1/2/3 primitives — the only hand-edited colour inputs
  color.palette.json    # 18 semantic colours — resolved values (generated, Phase 4 regenerates via Leonardo)
  color.components.json # 409 component tokens — aliases into the palette (captured from the 1.x SCSS; maintained by hand until the Phase 4 generator)
build/                  # token build, the token<->Figma name/scope contract, the Figma->code ingest
dist/
  css/variables.css     # 2.x theme-scoped custom properties (:root/.ct-theme-light + .ct-theme-dark)
  figma/light.tokens.json   # Figma native DTCG mode import files (right-click mode -> Import mode),
  figma/dark.tokens.json    #   all 430 variables incl. the component tier, aliases as references
  figma/name-map.json   # token path <-> Figma variable name contract (all 430)
  resolved.{light,dark}.json  # flat token-path -> hex maps for tooling/CI
tests/
  validate-resolved-values.mjs  # source-resolution sanity + embeds gate vs compiled UIKit CSS
  validate-figma-ingest.mjs     # ingest acceptance gate (fixture round-trip must be byte-identical)
  validate-figma-emit.mjs       # emit acceptance gate (dist == export fixtures, emit->ingest round-trip)
  fixtures/figma-export/        # real Export-mode dump of the 430-variable Colour collection
```

## Token format (DTCG 2025.10)

- Colour `$value`s are structured objects (`colorSpace`/`components`/`alpha`/`hex`). `hex` is always carried and is the canonical comparison key — Figma stores float32 components.
- **Theme is a mode, never part of the token path.** A token's `$value` is the light (default) mode value; the dark value lives under `$extensions["io.civictheme.modes"].dark`. The build emits one single-mode file per mode for Figma, and both scopes into one CSS file.
- Token path ↔ CSS custom property ↔ Figma variable differ only by separators/case: `color.palette.interaction-background` ↔ `--ct-color-interaction-background` ↔ `Interaction/Background`. The explicit map lives in `build/figma-names.mjs` (group assignment, e.g. `heading` → `Typography/`, is a lookup, not string mechanics).
- Brand tokens are generator inputs only — they ship in Figma for designers, but never in CSS.
- **Component tokens** (`color.component.chip.background-color` ↔ `--ct-chip-background-color`) are aliases into the palette — `"$value": "{color.palette.interaction-text}"` — or into other component tokens, mirroring the 1.x SCSS alias graph. Where 1.x derived values (`ct-color-tint`/`ct-color-shade` on status colours) or hardcoded them (`transparent`), the token is a captured literal with the derivation recorded in `$description`. Each token's 1.x source variables sit under `$extensions["io.civictheme.scss"]` — the bridge used by the validation test, the Phase 2b component refactor, and sub-theme migration tooling. The component tier exists as Figma variables since Phase 3b (`Component/<Comp>/<Prop>` in the same `Colour` collection, names via the mechanical rule in `build/figma-names.mjs`), and the dist *import* files carry all 430 variables — see "Code → Figma" below.
- In the generated CSS, component properties are emitted as `var()` references so the alias graph survives into devtools, and they are re-declared in **both** theme scope blocks (a deliberate deviation from plan §3.4's ":root once"): `var()` substitution inside a custom property happens where that property is *declared*, and the substituted result is what inherits — declared only on `:root`, every component property would freeze at its light value for descendants of a `.ct-theme-dark` scope.

## Commands

```
npm run dist -w packages/tokens     # build dist/ from tokens/
npm run test -w packages/tokens     # source-resolution sanity + embeds gate + ingest + emit acceptance
npm run ingest -w packages/tokens -- <Light.tokens.json> <Dark.tokens.json> [--out <dir>] [--dry-run]
```

## Code → Figma (the dist import files)

`dist/figma/{light,dark}.tokens.json` mirror the proven Export-mode shape for **all 430 variables**: brand + palette + component, grouped by Figma name, aliases emitted as DTCG reference strings (`"{Interaction.Interaction Text}"`, dot-separated Figma paths), literals as DTCG 2025.10 colour objects, per-variable `com.figma.scopes` and `WEB` `codeSyntax` (brand carries no codeSyntax — it ships nowhere in CSS), and doc-level `com.figma.modeName`. `com.figma.variableId` is deliberately absent: Figma's Import mode matches by **name**.

That makes native import the whole code→Figma push (rehearsed on the real 430-variable collection, 2026-10-06): importing both files into an empty collection *creates* the full alias graph with correct scopes and codeSyntax; importing into an existing collection updates only changed values, preserves variable ids (so node bindings survive), and is an idempotent no-op when values are equal. The scripted `use_figma` creation path remains as fallback only. Palette/brand scopes live in `FIGMA_SCOPES` (`build/figma-names.mjs`); the component tier is uniformly `SHAPE_FILL`+`TEXT_FILL` until designers decide narrowed scopes — changing the table rolls out via the next import.

The emit acceptance test (`validate-figma-emit.mjs`) holds the dist files semantically identical to the committed real-export fixtures (the only tolerated differences being `variableId` and float formatting) and requires ingesting them to reproduce `tokens/*.json` byte-for-byte with zero changes — the code → Figma → code loop closes on the dist artifacts themselves.

## Figma → code ingest (Phase 2c)

`npm run ingest` consumes the two files of a Figma native **Export mode** dump of the `Colour` collection (the UI downloads both modes together as `Colour.zip`) and merges the values back into `tokens/*.json`, so designer edits in Figma flow to code. It is a **merge, never a regeneration**: only `$value` and the `io.civictheme.modes` dark override are rewritten (an explicit dark entry stays explicit even when equal to light); `$description` and every `io.civictheme.*` extension are preserved — the export does not carry them. Export aliases (`"{Interaction.Interaction Text}"`, dot-separated Figma paths) become token references (`{color.palette.interaction-text}`); colour objects are byte-rounded and normalised to the file convention (6-decimal components, lowercase hex); `com.figma.*` extensions are dropped.

The drift guard fails the whole run loudly — writing nothing — on any unknown, missing or renamed variable (a `Component/` name must round-trip the mechanical name rule exactly), swapped mode files (checked via `com.figma.modeName`), or non-`srgb` colour. After a successful run it prints every value change; rebuild dist and run the normal gates before committing the result.

The acceptance test ingests the committed fixture dump (the real 430-variable export whose values are exactly the committed token values — proven in the 2026-10-06 round-trip rehearsal) and requires the output to be **byte-identical** to `tokens/*.json` with zero reported changes, plus change-application and drift-guard cases.

The test resolves every token through its alias graph for both modes (cycles, unknown aliases and malformed values fail), checks the component tier keeps its `io.civictheme.scss` source-variable bridge (used by sub-theme migration tooling), and asserts the compiled UIKit stylesheets (`sdc/civictheme.variables.css`, `twig/civictheme.{variables,storybook,}.css`) embed the current `dist/css/variables.css` byte-for-byte. Since 2.x components consume only the token-generated custom properties, byte-equal embedding is the whole colour contract between the packages.

`color.components.json` was captured from the 1.x SCSS by a deterministic extractor (removed with the 1.x colour variables in the Phase 2b cleanup — see git history for `build/extract-components.mjs`); it is maintained by hand until the Phase 4 generator takes over. 1.x variables set to `false` (focus slots meaning "emit no rule") or `inherit` produced no token; they are recorded with reasons under the component group's `io.civictheme.skipped` extension. The four unthemed `back-to-top` variables (light values serving both themes in 1.x) keep their light alias and pin dark mode to the light literal so rendering is unchanged inside dark scopes.

## Current status / provisional bits

- Theme scope selectors are `.ct-theme-light` / `.ct-theme-dark` (with light also on `:root`) — matches the existing class convention; `[data-theme]` was the alternative (plan §3.4 open item).
- Figma names were reconciled against the file's actual paint-style taxonomy (2026-10-04): variable leaves are the exact style leaf names (`Background/Background Light`, `Highlight/Highlight`, …), so every palette leaf slugifies 1:1 to its token name; groups drop the `" Colours"` suffix.
- Figma import files emit DTCG 2025.10 colour objects (`colorSpace`/`components`/`alpha`/`hex`) — Figma's native *Import mode* rejects legacy hex-string `$value`s. Palette round-trip proven byte-exact 2026-10-05; the full 430-variable export/import round-trip (aliases as references, ids preserved on in-place import) proven 2026-10-06; the dist files cover all 430 variables since the Figma-emit extension (same day).
- Component-tier derived literals (the 24 status tint/shade backgrounds) stop tracking palette changes until the Phase 4 generator re-derives them — a sub-theme that changes `error`/`warning`/`information`/`success` must override them too until then.
