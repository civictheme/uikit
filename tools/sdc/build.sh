#!/usr/bin/env bash
##
# Combined script for CivicTheme SDC environment.
#
# Usage:
#   ./build.sh                   # Run assemble, start, provision
#   ./build.sh assemble          # Run only assemble
#   ./build.sh provision         # Run only provision
#   ./build.sh start             # Run only start
#   ./build.sh stop              # Run only stop
#
# shellcheck disable=SC2015,SC2094,SC2002

set -eu
[ -n "${DEBUG:-}" ] && set -x

#-------------------------------------------------------------------------------
# Variables (passed from environment; provided for reference only).
#-------------------------------------------------------------------------------

# Drupal core version to use.
DRUPAL_VERSION="${DRUPAL_VERSION:-11}"

# Webserver hostname.
WEBSERVER_HOST="${WEBSERVER_HOST:-localhost}"

# Webserver port.
WEBSERVER_PORT="${WEBSERVER_PORT:-8000}"

# Webserver wait timeout.
WEBSERVER_WAIT_TIMEOUT="${WEBSERVER_WAIT_TIMEOUT:-5}"

# Drupal profile to use when installing the site.
DRUPAL_PROFILE="${DRUPAL_PROFILE:-standard}"

#-------------------------------------------------------------------------------

# @formatter:off
note() { printf "       %s\n" "${1}"; }
info() { [ "${TERM:-}" != "dumb" ] && tput colors >/dev/null 2>&1 && printf "\033[34m[INFO] %s\033[0m\n" "${1}" || printf "[INFO] %s\n" "${1}"; }
pass() { [ "${TERM:-}" != "dumb" ] && tput colors >/dev/null 2>&1 && printf "\033[32m[ OK ] %s\033[0m\n" "${1}" || printf "[ OK ] %s\n" "${1}"; }
fail() { [ "${TERM:-}" != "dumb" ] && tput colors >/dev/null 2>&1 && printf "\033[31m[FAIL] %s\033[0m\n" "${1}" || printf "[FAIL] %s\n" "${1}"; }
# @formatter:on

drush() { "build/vendor/bin/drush" -r "$(pwd)/build/web" -y "$@"; }

extension="civictheme_sdc"

#-------------------------------------------------------------------------------
# ASSEMBLE FUNCTION
#-------------------------------------------------------------------------------
run_assemble() {
  echo "==============================="
  echo "         🏗️ ASSEMBLE           "
  echo "==============================="
  echo

  info "Validate tools."
  ! command -v git >/dev/null && fail "ERROR: Git is required for this script to run." && exit 1
  ! command -v php >/dev/null && fail "ERROR: PHP is required for this script to run." && exit 1
  php -r 'exit(version_compare(PHP_VERSION, "8.3.0", ">=") ? 0 : (fwrite(STDERR, "ERROR: PHP 8.3.0 or higher is required. Found: " . PHP_VERSION . "\n") || 1));'
  ! command -v composer >/dev/null && fail "ERROR: Composer (https://getcomposer.org/) is required for this script to run." && exit 1
  ! command -v sqlite3 >/dev/null && fail "ERROR: sqlite3 is required for this script to run." && exit 1
  pass "Tools are valid."

  # Make sure Composer doesn't run out of memory.
  export COMPOSER_MEMORY_LIMIT=-1

  # Reset the environment.
  if [ -d "build" ]; then
    info "Removing existing build directory."
    chmod -Rf 777 "build" >/dev/null || true
    rm -rf "build" >/dev/null || true
    pass "Existing build directory removed."
  fi

  info "Creating Drupal ${DRUPAL_VERSION} codebase."
  composer create-project --no-interaction --no-scripts --no-progress --prefer-dist --no-install "drupal/recommended-project:${DRUPAL_VERSION}" "build"
  rm build/composer.lock >/dev/null || true

  info "Merging configuration from extension's composer.json."
  php -r "echo json_encode(array_replace_recursive(json_decode(file_get_contents('../../composer.json'), true),json_decode(file_get_contents('build/composer.json'), true)),JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);" >"build/composer2.json" && mv -f "build/composer2.json" "build/composer.json"

  composer --working-dir="build" config allow-plugins.cweagans/composer-patches true
  composer --working-dir="build" config --json extra.patches.drupal/sdc_devel '{"Allow attributes": "../patches/sdc_devel-allow-attributes.patch"}'

  if [ -n "${GITHUB_TOKEN:-}" ]; then
    info "Adding GitHub authentication token if provided."
    composer --working-dir="build" config --global github-oauth.github.com "${GITHUB_TOKEN}"
    composer --working-dir="build" config --global github-oauth.github.com | grep -q "gh" || fail "GitHub token not added."
    pass "GitHub token added."
  fi

  info "Creating custom directories."
  mkdir -p build/web/modules/custom build/web/themes/custom

  info "Installing dependencies."
  composer --working-dir="build" install

  info "Installing development dependencies."
  composer --working-dir="build" require cweagans/composer-patches:^1.7 drupal/sdc_devel drush/drush

  info "Creating custom theme"
  mkdir -p build/web/themes/custom/civictheme_sdc
  cat <<EOF >build/web/themes/custom/civictheme_sdc/civictheme_sdc.info.yml
name: CivicTheme SDC
type: theme
description: 'A theme for testing SDC components'
base theme: stark
core_version_requirement: ^$DRUPAL_VERSION
EOF

  info "Symlinking SDC components into custom theme"
  ln -s "$(pwd)/../../packages/sdc/components" build/web/themes/custom/civictheme_sdc/components

  info "Symlinking development module"
  ln -s "$(pwd)/ct_dev" build/web/modules/custom/ct_dev

  echo
  echo "==============================="
  echo "    🏗 ASSEMBLE COMPLETE ✅   "
  echo "==============================="
  echo
}

#-------------------------------------------------------------------------------
# PROVISION FUNCTION
#-------------------------------------------------------------------------------
run_provision() {
  echo "==============================="
  echo "         🚀 PROVISION          "
  echo "==============================="
  echo

  # Database file path.
  db_file="/tmp/site_${extension}.sqlite"

  info "Installing Drupal into SQLite database ${db_file}."
  db_status=$(drush status --field=db-status 2>/dev/null || echo "Not connected")
  if [ "${db_status}" = "Connected" ]; then
    drush sql:drop -y || true >/dev/null
  fi
  drush site-install "${DRUPAL_PROFILE}" -y --db-url="sqlite://localhost/${db_file}" --account-name=admin install_configure_form.enable_update_status_module=NULL install_configure_form.enable_update_status_emails=NULL
  pass "Drupal installed."

  drush status

  info "Enabling extension ${extension}."
  drush theme:enable "${extension}"

  info "Clearing caches."
  drush cr

  info "Enabling development modules."
  drush pm:enable sdc_devel ct_dev
  drush theme:enable civictheme_sdc

  info "Setting the default theme to ${extension}."
  drush config:set system.theme default "${extension}" -y

  info "Pre-warming caches."
  curl -s "http://${WEBSERVER_HOST}:${WEBSERVER_PORT}" >/dev/null

  echo
  echo "==============================="
  echo "   🚀 PROVISION COMPLETE  ✅  "
  echo "==============================="
  echo
  echo "Site URL:            http://${WEBSERVER_HOST}:${WEBSERVER_PORT}"
  echo -n "One-time login link: "
  drush -l "http://${WEBSERVER_HOST}:${WEBSERVER_PORT}" uli --no-browser
  echo
}

#-------------------------------------------------------------------------------
# START FUNCTION
#-------------------------------------------------------------------------------
run_start() {
  echo "==============================="
  echo "      💻 START ENVIRONMENT     "
  echo "==============================="
  echo

  info "Stopping previously started services, if any."
  killall -9 php >/dev/null 2>&1 || true

  info "Starting the PHP webserver."
  nohup php -S "${WEBSERVER_HOST}:${WEBSERVER_PORT}" -t "$(pwd)/build/web" "$(pwd)/build/web/.ht.router.php" >/tmp/php.log 2>&1 &

  note "Waiting ${WEBSERVER_WAIT_TIMEOUT} seconds for the server to be ready."
  sleep "${WEBSERVER_WAIT_TIMEOUT}"

  note "Checking that the server was started."
  if [ "$(uname)" == "Darwin" ]; then
    # macOS uses netstat
    netstat -anv | grep -q "${WEBSERVER_PORT}" || (echo "ERROR: Unable to start inbuilt PHP server" && cat /tmp/php.log && exit 1)
  else
    # Linux (including Ubuntu) uses ss
    command -v ss >/dev/null 2>&1 && ss -tulpn | grep -q ":${WEBSERVER_PORT}" || (echo "ERROR: Unable to start inbuilt PHP server" && cat /tmp/php.log && exit 1)
  fi

  pass "Server started successfully."

  info "Checking that the server can serve content."
  curl -s -o /dev/null -w "%{http_code}" -L -I "http://${WEBSERVER_HOST}:${WEBSERVER_PORT}" | grep -q 200 || (echo "ERROR: Server is started, but site cannot be served" && exit 1)
  pass "Server can serve content."

  echo
  echo "==============================="
  echo "    💻 ENVIRONMENT READY  ✅  "
  echo "==============================="
  echo
  echo "Directory : $(pwd)/build/web"
  echo "URL       : http://${WEBSERVER_HOST}:${WEBSERVER_PORT}"
  echo
}

#-------------------------------------------------------------------------------
# STOP FUNCTION
#-------------------------------------------------------------------------------
run_stop() {
  echo "==============================="
  echo "      💻 STOP ENVIRONMENT      "
  echo "==============================="
  echo

  info "Stopping previously started services, if any."
  killall -9 php >/dev/null 2>&1 || true
  sleep 1
  pass "Services stopped."

  echo
  echo "==============================="
  echo "   💻 ENVIRONMENT STOPPED ✅  "
  echo "==============================="
  echo
}

#-------------------------------------------------------------------------------
# MAIN SCRIPT
#-------------------------------------------------------------------------------
if [ $# -gt 0 ]; then
  case "$1" in
  assemble)
    run_assemble
    ;;
  provision)
    run_provision
    ;;
  start)
    run_start
    ;;
  stop)
    run_stop
    ;;
  *)
    echo "Error: Unknown argument '$1'"
    echo "Usage: $0 [assemble|provision|start|stop]"
    echo "       If no argument is provided, will run assemble, provision, and start in sequence."
    exit 1
    ;;
  esac
else
  run_assemble
  run_start
  run_provision
fi
