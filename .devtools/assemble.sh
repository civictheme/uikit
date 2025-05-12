#!/usr/bin/env bash
##
# Assemble a codebase using project code and all required dependencies.
#
# Allows to use the latest Drupal core as well as specified versions (for
# testing backward compatibility).
#
# - Retrieves the scaffold from drupal-composer/drupal-project or custom scaffold.
# - Builds Drupal site codebase with the current extension and it's dependencies.
# - Adds development dependencies.
# - Installs composer dependencies.
#
# This script will re-build the codebase from scratch every time it runs.

# shellcheck disable=SC2015,SC2094,SC2002

set -eu
[ -n "${DEBUG:-}" ] && set -x

#-------------------------------------------------------------------------------
# Variables (passed from environment; provided for reference only).
#-------------------------------------------------------------------------------

# Drupal core version to use.
DRUPAL_VERSION="${DRUPAL_VERSION:-11}"

# Commit SHA of the drupal-project to install custom core version. If not
# provided - will be calculated from `$DRUPAL_VERSION` above.
DRUPAL_PROJECT_SHA="${DRUPAL_PROJECT_SHA:-}"

# Repository for "drupal-composer/drupal-project" project.
# May be overwritten to use forked repos that may have not been accepted
# yet (i.e., when major Drupal version is about to be released).
DRUPAL_PROJECT_REPO="${DRUPAL_PROJECT_REPO:-https://github.com/drupal-composer/drupal-project.git}"

#-------------------------------------------------------------------------------

# @formatter:off
note() { printf "       %s\n" "${1}"; }
info() { [ "${TERM:-}" != "dumb" ] && tput colors >/dev/null 2>&1 && printf "\033[34m[INFO] %s\033[0m\n" "${1}" || printf "[INFO] %s\n" "${1}"; }
pass() { [ "${TERM:-}" != "dumb" ] && tput colors >/dev/null 2>&1 && printf "\033[32m[ OK ] %s\033[0m\n" "${1}" || printf "[ OK ] %s\n" "${1}"; }
fail() { [ "${TERM:-}" != "dumb" ] && tput colors >/dev/null 2>&1 && printf "\033[31m[FAIL] %s\033[0m\n" "${1}" || printf "[FAIL] %s\n" "${1}"; }
# @formatter:on

#-------------------------------------------------------------------------------

echo "==============================="
echo "         🏗️ ASSEMBLE           "
echo "==============================="
echo

# Validate required variables.
if [ -z "${DRUPAL_VERSION}" ]; then
  fail "ERROR: DRUPAL_VERSION is not set."
  exit 1
fi

if [ -z "${DRUPAL_PROJECT_REPO}" ]; then
  fail "ERROR: DRUPAL_PROJECT_REPO is not set."
  exit 1
fi

# Make sure Composer doesn't run out of memory.
export COMPOSER_MEMORY_LIMIT=-1

info "Validate tools."
! command -v git >/dev/null && fail "ERROR: Git is required for this script to run." && exit 1
! command -v php >/dev/null && fail "ERROR: PHP is required for this script to run." && exit 1
! command -v composer >/dev/null && fail "ERROR: Composer (https://getcomposer.org/) is required for this script to run." && exit 1
! command -v jq >/dev/null && fail "ERROR: jq (https://stedolan.github.io/jq/) is required for this script to run." && exit 1
pass "Tools are valid."

# Set the sed options based on the OS.
sed_opts=(-i) && [ "$(uname)" == "Darwin" ] && sed_opts=(-i '')

extension="civictheme_sdc"
type="themes"

info "Validate Composer configuration."
composer validate --ansi --strict

# Reset the environment.
if [ -d "build" ]; then
  info "Removing existing build directory."
  chmod -Rf 777 "build" >/dev/null || true
  rm -rf "build" >/dev/null || true
  pass "Existing build directory removed."
fi

info "Creating Drupal codebase."

drupal_version_major="$(echo "${DRUPAL_VERSION}" | cut -d '.' -f 1 | cut -d '@' -f 1)"
drupal_version_stability="$(echo "${DRUPAL_VERSION}" | sed -n 's/.*@\(.*\)/\1/p')"
drupal_version_stability="${drupal_version_stability:-stable}"

DRUPAL_PROJECT_SHA="${DRUPAL_PROJECT_SHA:-"${drupal_version_major}.x"}"

note "Initialising Drupal ${DRUPAL_VERSION} site from the scaffold repo ${DRUPAL_PROJECT_REPO} ref ${DRUPAL_PROJECT_SHA}."

# Clone Drupal project at the specific commit SHA.
git clone -n "${DRUPAL_PROJECT_REPO}" "build"
git --git-dir="build/.git" --work-tree="build" checkout "${DRUPAL_PROJECT_SHA}"
rm -rf "build/.git" >/dev/null

note "Pinning Drupal to a specific version ${DRUPAL_VERSION}."
sed "${sed_opts[@]}" 's|\(.*"drupal\/core.*"\): "\(.*\)",.*|\1: '"\"~$DRUPAL_VERSION\",|" "build/composer.json"
grep '"drupal/core-.*": "' "build/composer.json"

note "Updating stability to ${drupal_version_stability}."
# Do not rely on the values coming from the scaffold and always set them.
sed "${sed_opts[@]}" 's|\(.*"minimum-stability"\): "\(.*\)",.*|\1: '"\"${drupal_version_stability}\",|" "build/composer.json"
grep 'minimum-stability' "build/composer.json"

drupal_version_prefer_stable="true"
if [ "${drupal_version_stability}" != "stable" ]; then
  drupal_version_prefer_stable="false"
fi
sed "${sed_opts[@]}" 's|\(.*"prefer-stable"\): \(.*\),.*|\1: '${drupal_version_prefer_stable}',|' "build/composer.json"
grep 'prefer-stable' "build/composer.json"

#info "Merging configuration from composer.dev.json."
#php -r "echo json_encode(array_replace_recursive(json_decode(file_get_contents('composer.dev.json'), true),json_decode(file_get_contents('build/composer.json'), true)),JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);" >"build/composer2.json" && mv -f "build/composer2.json" "build/composer.json"

info "Merging configuration from extension's composer.json."
php -r "echo json_encode(array_replace_recursive(json_decode(file_get_contents('composer.json'), true),json_decode(file_get_contents('build/composer.json'), true)),JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);" >"build/composer2.json" && mv -f "build/composer2.json" "build/composer.json"

# Asset Packagist sometimes fails, so we remove it by default. If it's needed,
# the lines below can be commented out.
info "Remove asset-packagist"
composer --working-dir="build" config --unset repositories.1 || true

if [ -d "patches" ]; then
  info "Copying patches."
  mkdir -p "build/patches"
  cp -r patches/* "build/patches/"
fi

if [ -n "${GITHUB_TOKEN:-}" ]; then
  info "Adding GitHub authentication token if provided."
  composer config --global github-oauth.github.com "${GITHUB_TOKEN}"
  composer config --global github-oauth.github.com | grep -q "gh" || fail "GitHub token not added."
  pass "GitHub token added."
fi

info "Creating custom directories."
mkdir -p build/web/modules/custom build/web/themes/custom

info "Installing dependencies."
composer --working-dir="build" install
pass "Dependencies installed."

# Suggested dependencies allow to install them for testing without requiring
# them in extension's composer.json.
info "Installing suggested dependencies from extension's composer.json."
composer_suggests=$(cat composer.json | jq -r 'select(.suggest != null) | .suggest | keys[]')
for composer_suggest in $composer_suggests; do
  composer --working-dir="build" require "${composer_suggest}"
done
pass "Suggested dependencies installed."

info "Installing development dependencies."
composer --working-dir="build" require drupal/sdc_devel
pass "Installed development dependencies."

info "Creating custom theme"
mkdir -p build/web/themes/custom/civictheme_sdc/components
cat << EOF > build/web/themes/custom/civictheme_sdc/civictheme_sdc.info.yml
name: CivicTheme SDC
type: theme
description: 'A theme for testing SDC components'
base theme: stark
core_version_requirement: ^$DRUPAL_VERSION
EOF
pass "Created custom theme."

info "Copy SDC components into custom theme"
cp -r packages/sdc/components/* build/web/themes/custom/civictheme_sdc/components/
pass "Copied SDC components into custom theme."

echo
echo "==============================="
echo "    🏗 ASSEMBLE COMPLETE ✅   "
echo "==============================="
echo
echo "> Next steps:"
echo "  .devtools/start.sh        # Start the webserver"
echo "  .devtools/provision.sh    # Provision the website"
echo
