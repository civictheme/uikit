# SDC tools

This directory contains scripts used for SDC development.

These can be used locally and in the CI environment.

SDC components are validated using `sdc_devel` module running on a vanilla
Drupal site. 

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

To validate the SDC schema, run the following command:

```bash
build/vendor/bin/drush sdc-devel:validate civictheme_sdc
```

To add exclusions to the validation rules, update the `ct_dev/ct_dev.module` file.
This module is symlinked into the built Drupal site, so changes will be reflected
momentarily. Do not forget to clear Drupal cache after making changes to this file.

To test the validity of a component definition, use the following command:

```bash
build/vendor/bin/drush ct_dev:validate-component-definition <components_path>
```

This command checks the specified component definition files for schema compliance and reports any issues found.
