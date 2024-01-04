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
- Drupal and Wordpress compatible

## Installing

Download the latest release.    

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

### Lint code

    npm run lint

    npm run lint:fix

### Run Storybook

    npm run storybook

---

For additional information, please refer to the [Documentation site](https://docs.civictheme.io/ui-kit)
