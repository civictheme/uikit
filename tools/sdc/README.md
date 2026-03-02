# SDC tools

This directory contains scripts used for SDC development.

These can be used locally and in the CI environment.

Run the commands from the `tools/sdc` directory.

To build and run a local Drupal site with SDC components, run the following commands:
```bash
./build.sh                   # Run assemble, start, provision
```

Or run these commands separately:
```bash
./build.sh assemble          # Run only assemble
./build.sh provision         # Run only provision
./build.sh start             # Run only start
./build.sh stop              # Run only stop
```

To test the validity of a component definition, use the following command:

```bash
build/vendor/bin/drush ct_dev:validate-component-definition 'themes/custom/civictheme_sdc/components'
```

This command checks the specified component definition files for schema compliance and reports any issues found.
