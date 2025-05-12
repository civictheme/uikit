<p align="center">  
  <picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/logos/logo_secondary_dark_desktop.png">
  <img height=100px src="assets/logos/logo_secondary_light_desktop.png" alt="CivicTheme logo">
  </picture>  
</p>

<h1 align="center">CivicTheme - UI Kit</h1>

<div align="center">

[![GitHub Issues](https://img.shields.io/github/issues/civictheme/uikit.svg)](https://github.com/civictheme/uikit/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/civictheme/uikit.svg)](https://github.com/civictheme/uikit/pulls)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/civictheme/uikit)
[![Test](https://github.com/civictheme/uikit/actions/workflows/test.yml/badge.svg)](https://github.com/civictheme/uikit/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/civictheme/uikit/graph/badge.svg?token=NMJD1RDUVQ)](https://codecov.io/gh/civictheme/uikit)
![LICENSE](https://img.shields.io/github/license/civictheme/uikit)
[![RenovateBot](https://img.shields.io/badge/RenovateBot-enabled-brightgreen.svg?logo=renovatebot)](https://renovatebot.com)

</div>

<p align="center">UI component library with Storybook integration</p>
<p align="center"><a href="https://uikit.civictheme.io/">https://uikit.civictheme.io/</a></p>

----

> [!Tip]
> For support, see [Getting help](https://docs.civictheme.io/getting-help) documentation

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

## Contributing

Contributions are welcome!

If a specific change is being proposed (either a new feature or a bug fix), you 
can [create an issue](https://github.com/civictheme/uikit/issues/new) documenting the proposed 
change.

## Maintenance

### Updating minor dependencies

```bash
npm install -g npm-check-updates
npx npm-check-updates -u --target minor
```

### Pre-release build

All commits to `main` branch are built as a Storybook and automatically deployed to https://civictheme-uikit.netlify.app/

### Visual Regression Testing

CivicTheme UI Kit includes a visual regression testing workflow that automatically captures screenshots of components in both main and feature branches and compares them to detect visual changes.

#### Running Visual Tests Locally

To run visual regression tests locally:

```bash
# Run in interactive mode
npm run diff

# Capture screenshots for main branch components
npm run diff:command -- capture --source main --target components

# Capture screenshots for current branch components
npm run diff:command -- capture --source current --target components

# Capture screenshots for current branch sdc components
npm run diff:command -- capture --source current --target components-sdc

# Compare main vs current branch
npm run diff:command -- compare --source [main-set-name] --target [current-set-name]

# Serve the visual comparison report
npm run diff:serve
```

#### CI Integration

Visual regression tests run automatically on pull requests. The GitHub Action:

1. Captures screenshots from main and PR branches
2. Generates comparison reports
3. Uploads reports as GitHub artifacts
4. Comments on the PR with a summary of visual changes

To view the full report, download the artifacts from the GitHub Actions tab.

### Build assets

    npm run build

This will build:

- CSS and JS assets in the `dist` directory. These files can be included
  directly into your HTML page, provided that it has components implemented with
  the same markup as components in the `components` directory.
- Storybook assets as compiled HTML page in the `storybook-static` directory.
  These files can be served publicly to show all components available in the
  library.

### Updating components

Components schema for both `components/twig` and `components/sdc` directories is
maintained in the `*.component.yml` files within `components/sdc` directory. 
The schema is strict and allows to be a source of truth for the components.

We currently synchronize the entire component implementation between SDC and Twig components, 
not just the docblock headers. This includes proper namespace handling, converting 
`civictheme:` namespaces to path-based references like `@atoms/button/button.twig`.

To update components, run:

```bash
npm run components:update       # Update all components
npm run components:update:sdc   # Update only SDC components
npm run components:update:twig  # Update only Twig components
```

If you only want to update the docblock headers (for when SDC and Twig implementations diverge in the future):

```bash
npm run components:update:twig:headers  # Update only Twig component headers
```

To check that components are up to date without making any changes (useful for CI/CD), run:

```bash
npm run components:check       # Check all components
npm run components:check:sdc   # Check only SDC components
npm run components:check:twig  # Check only Twig components
npm run components:check:twig:headers  # Check only Twig component headers
```

The `components:update` command reads the YAML schema from component definition files and
synchronizes the full component implementation, ensuring consistency across SDC and Twig components.
The `components:check` command verifies this consistency without making changes, exiting with
a non-zero status if any component needs updating.

> Note: If the SDC and Twig implementations significantly diverge in the future, we will switch
> to only updating the docblock headers rather than the entire component.

#### Validating SDC schema

SDC components are validated using `sdc_devel` module running on a vanilla 
Drupal site.

To build and run a local Drupal site with SDC components run the following commands:
```bash
./devtools/assemble.sh     # Assemble the codebase
./devtools/start.sh        # Start the PHP server
./devtools/provision.sh    # Provision the Drupal website
```

You can stop the server with `./devtools/stop.sh`.

To validate the SDC schema, run the following command:

```bash
build/vendor/bin/drush sdc-devel:validate civictheme_sdc
```

### Check and fix code style

    npm run lint

    npm run lint-fix

### Run Storybook for development

    npm run dev

### Run Storybook after build

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
