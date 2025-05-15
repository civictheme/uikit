# CivicTheme UI Kit Package Publishing Discussion Paper / Plan

## Current Status

Currently, CivicTheme UI Kit is published as a single UI Kit package `@civictheme/uikit` but from the 1.11 release it will support two distinct frameworks:

1. **Twig Components** (`packages/twig`) - The original Twig implementation of CivicTheme integrations
2. **Single Directory Components** (`packages/sdc`) - Used for CivicTheme 1.11 and on. Utilising the Drupal Single Directory Component framework.

While these components are maintained together and share design specifications,
consumers often only need one implementation.

For the majority of Drupal users, the SDC implementation is what is required for and will be used within CivicTheme.
The original twig component library can still be used by any system that can implement Twig templates.

## Proposed Change

We propose splitting the package publishing into separate NPM packages:

- **@civictheme/twig** - Twig component library
- **@civictheme/sdc** - Drupal Single Directory Component implementation with Component schemas

Both packages will continue to be developed within the same monorepo, ensuring design consistency and synchronized updates,
but will be published independently to NPM.

## Benefits

1. **Reduced Package Size**: Consumers only download the implementation they need, reducing dependency bloat in projects.

2. **Better Dependency Management**: Each package can have its own specific dependencies tailored to its implementation needs.


## Implementation Details

1. **Package Renaming**:
   - Rename `@civictheme/uikit` to `@civictheme/sdc` in your Drupal installation if you are using CivicTheme
   - Rename `@civictheme/uikit` to `@civictheme/twig` if you are using the twig implentation elsewhere

2. **Maintenance Strategy**:
   - Both packages will continue to be developed in the same repository
   - Component updates will be synchronized between implementations
   - Testing, linting, and building will be performed for both packages before publishing


## Migration Path for Consumers


**Note for most consumers CivicTheme manages the UIKit dependency and will be automatically updated.
The below is for users who have custom setups.**

1. **For SDC Users**:
   ```bash
   # Remove old package
   npm uninstall @civictheme/uikit

   # Install new package
   npm install @civictheme/sdc

   # Update import paths in code from
   # @civictheme/uikit/packages/twig/* to @civictheme/twig/*
   ```

2. **For Users who want the twig implementation (note the CivicTheme Drupal Theme will use SDC going forward)**:
   ```bash
   # Remove old package
   npm uninstall @civictheme/uikit

   # Install new package
   npm install @civictheme/twig

   ```
