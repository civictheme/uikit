# Vendored Leonardo bundle

`leonardo.mjs` is the committed, pinned browser bundle of
[`@adobe/leonardo-contrast-colors`](https://github.com/adobe/leonardo)
(Apache-2.0) and its dependencies, built by `vendor/build.mjs` (esbuild,
ESM, unminified so diffs stay reviewable). It is the ONLY third-party code
in the picker's browser graph, and palette generation loads it lazily — no
bytes are fetched until Generate is pressed.

Both runtimes use this bundle: `engine/generate.mjs` in the browser and (via
the `engine/derive.mjs` shell) the CLI in Node, so `generate` output is
byte-identical everywhere. The npm package itself is only a devDependency,
needed to rebuild the bundle.

## Why vendored (the P5 reversal)

P5 originally confined Leonardo to Node ("no Leonardo bytes ever reach a
browser") as a supply-chain containment measure, which left the Generate
button dead in embedded copies (e.g. the Drupal theme settings iframe),
where no Node runtime exists. P8 deliberately reversed that decision in
favour of a pinned, committed, reviewable bundle:

- **Pinned**: the version comes from the exact devDependency pin; no
  version ranges, no CDN, no install-time resolution in consumers.
- **Committed**: the bundle is source-controlled, so any change to the
  third-party bytes is a visible diff in review, and consumers get exactly
  the reviewed bytes.
- **Contained**: `tests/validate-ui.mjs` asserts the vendored bundle is the
  only path by which third-party code enters the browser graph.

## Refreshing

1. Bump the `@adobe/leonardo-contrast-colors` devDependency pin.
2. `npm install` at the repo root.
3. `npm run vendor-leonardo` in this package.
4. Review the `leonardo.mjs` diff, run `npm test`, and re-record the
   derive expectations only if solves changed.
