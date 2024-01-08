<p align="center">
  <a href="" rel="noopener">
  <img height=100px src="assets/logos/logo_secondary_light_mobile.png" alt="CivicTheme logo"></a>
</p>

<h1 align="center">CivicTheme - UI Kit</h1>

<div align="center">

[![GitHub Issues](https://img.shields.io/github/issues/civictheme/uikit.svg)](https://github.com/civictheme/uikit/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/civictheme/uikit.svg)](https://github.com/civictheme/uikit/pulls)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/civictheme/uikit)
[![Test](https://github.com/civictheme/uikit/actions/workflows/test.yml/badge.svg)](https://github.com/civictheme/uikit/actions/workflows/test.yml)
![LICENSE](https://img.shields.io/github/license/civictheme/uikit)
[![RenovateBot](https://img.shields.io/badge/RenovateBot-enabled-brightgreen.svg?logo=renovatebot)](https://renovatebot.com)

</div>

<p align="center">UI component library with Storybook integration</p>

----

## Features

- Atomic design
- Accessible
- Platform-agnostic
- Integrated with Drupal: https://www.drupal.org/project/civictheme

## Installing

```bash
npm install @civictheme/uikit
```

or download the latest release from [GitHub](https://github.com/civictheme/uikit/releases). 

## Maintenance

### Build assets

    npm run build

This will build:

- CSS and JS assets in the `dist` directory. These files can be included
  directly into your HTML page, provided that it has components implemented with
  the same markup as components in the `componets` directory.
- Storybook assets as compiled HTML page in the `storybook-static` directory.
  These files can be served publically to show all components available in the
  library.

### Check and fix code style

    npm run lint

    npm run lint:fix

### Run Storybook

    npm run storybook

## Releasing

Releases to GitHub and NPM are automated via GitHub Actions, but initiated
manually.

To release a new version, go to
the [Release package](https://github.com/civictheme/uikit/actions/workflows/release-manual.yml)
GitHub Action, click on the `Run workflow` button, and enter the release
level: `patch` or `minor`.

After the release is complete, the new version will be available on
[GitHub](https://github.com/civictheme/uikit/releases)
and [NPM](https://www.npmjs.com/package/@civictheme/uikit).

---

For additional information, please refer to
the [Documentation site](https://docs.civictheme.io/ui-kit)
