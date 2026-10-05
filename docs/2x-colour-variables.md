# 2.x colour variables — the theme-less architecture

CivicTheme 2.x restructures how components consume colour. This document
explains the mechanism, why it is built the way it is, and how to convert a
component. The token side (DTCG source files, build, Figma sync) is documented
in [`packages/tokens/README.md`](../packages/tokens/README.md).

## What 1.x did

Theme was baked into every variable name. Each colour role existed twice
(`$ct-chip-light-background-color` / `$ct-chip-dark-background-color`), and
every component emitted its colour rules twice, once per theme selector:

```css
.ct-chip.ct-theme-light { background-color: var(--ct-chip-light-background-color); }
.ct-chip.ct-theme-dark  { background-color: var(--ct-chip-dark-background-color); }
```

That is 568 doubled Sass variables, doubled rules in every component, and
theme logic repeated through every component file.

## What 2.x does: one name per colour role, theme is a scope

The generated stylesheet (`civictheme.variables.css`, emitted from
`@civictheme/tokens`) declares every colour property under two theme scope
blocks:

```css
:root,
.ct-theme-light {
  /* palette tier: literal values per scope */
  --ct-color-interaction-text: #fafbfb;
  /* component tier: aliases into the palette */
  --ct-chip-background-color: var(--ct-color-interaction-text);
}

.ct-theme-dark {
  --ct-color-interaction-text: #003a4f;
  --ct-chip-background-color: var(--ct-color-interaction-text);
}
```

A component references only its own component property, once, with no theme
anywhere in the rule:

```css
.ct-chip { background-color: var(--ct-chip-background-color); }
```

## How resolution works in the browser

Every component root carries a `ct-theme-light` or `ct-theme-dark` class (the
templates always emit one; `light` is the default). When the browser styles
that element, the matching theme block's declarations apply to it, and the
`var(--ct-color-…)` reference inside each component property substitutes using
*that element's* palette values — light or dark depending on which block
matched. The substituted result then inherits to every descendant, so inner
elements (wrappers, labels, icons) see the right value without carrying any
theme class themselves.

One stylesheet, no duplicated rules, and the theme class on the component root
is the only switch.

### Why component properties are declared in BOTH theme blocks

CSS substitutes `var()` inside a custom property **where that property is
declared**, and what inherits is the already-substituted result. If the
component aliases were declared only on `:root`, they would substitute against
root's (light) palette once, and descendants of a `.ct-theme-dark` scope would
inherit frozen light values. Re-declaring every component property in both
scope blocks makes substitution re-happen on each theme-scope element, which
is what makes the alias graph theme-aware. (This is a deliberate correction to
the original design, which declared them once.)

## The non-uniform cases

The token source encodes three deviations from the simple "same alias in both
blocks" shape, and the generated CSS follows them:

- **Mode-split roles** — some 1.x variables aliased *different* palette slots
  per theme (e.g. popover content background: `background-light` in light,
  `background` in dark). The two scope blocks carry different aliases.
- **Pinned roles** — the `back-to-top` variables were unthemed in 1.x (one
  variable, light palette values, rendered identically inside dark sections).
  To preserve that behaviour, the light block holds the alias and the dark
  block holds the light value as a literal.
- **`false` slots** — 1.x used `$ct-…-focus-background-color: false` to mean
  "emit no rule". These produce no custom property and no rule, exactly as
  before. (`inherit` values are likewise not tokens; the component keeps a
  literal `inherit`.)

## What this buys

- **Half the names**: 568 doubled Sass variables become ~409 single
  properties, and token path ↔ CSS property ↔ Figma variable are the same
  name modulo separators (`color.component.chip.background-color` ↔
  `--ct-chip-background-color` ↔ `Chip/Background Color`).
- **The alias graph survives into devtools**: inspecting an element shows
  `--ct-chip-background-color → var(--ct-color-interaction-text) → #fafbfb`.
- **Runtime re-theming**: overriding a custom property restyles everything
  that aliases it, with no Sass recompile —

  ```css
  .ct-theme-light { --ct-color-highlight: #ffcc00; }
  ```

  This is the foundation for 2.x sub-theme recipes and for runtime overrides
  (e.g. driven by Drupal theme settings), neither of which is possible in the
  1.x compile-time model.
- **Single source of truth**: the values come from `packages/tokens` (DTCG
  JSON), the same source that generates the Figma variable import files — the
  SCSS/Figma drift class of bugs is eliminated at the root.

## Converting a component (the recipe)

The conversion is mechanical. Per component:

1. **Theme wrappers go.** `@include ct-component-theme($root) using (…)`
   blocks unwrap into the component's base rules; `&.ct-theme-#{$theme}`
   loops disappear.
2. **Names lose the theme segment.** `var(--ct-chip-light-hover-color)` →
   `var(--ct-chip-hover-color)`; `ct-component-var($root, $theme, stripe,
   background-color)` → `ct-component-var($root, stripe, background-color)`.
3. **Light/dark map branches collapse.** They are symmetric by construction;
   keep one, theme-lessly named (see `chip.scss` and the `ct-button-type`
   mixin for the pattern). When emitting bare declarations where nested rules
   already exist, wrap them in `& { … }`.
4. **Sass colour variables become literals or vanish.** `$ct-…-focus-…: false`
   slots become literal `false` in maps (no rule emitted); `inherit` stays a
   literal.
5. **Gates:** the tokens resolved-value test must stay at zero drift, and a
   visual-regression capture against the frozen `baseline--2x--*` sets must
   show no colour change in either theme.

During the transition both generations coexist: `civictheme.variables.css`
carries the token-generated properties *and* the Sass-generated 1.x-structure
properties, so unconverted components keep working untouched. The 1.x colour
variables and their emission are deleted in one cleanup change once every
component is converted.

## Testing strategy

Two layers, because each sees what the other cannot:

- **Resolved-value equality** (`npm run test -w packages/tokens`): every token
  resolved through its alias graph must equal the compiled CSS value, per
  theme, for sdc and twig. This covers *all* states — hover, focus, invalid —
  which screenshots never render.
- **Visual regression**: captures of every story in both themes compared
  against baselines frozen at the 2.x branch point; the refactor must not
  shift a pixel. CI additionally compares each PR against the `main` (1.x)
  render and publishes the report, since 2.x promises identical rendering
  until the deliberate palette regeneration (with designer sign-off) much
  later in the programme.
