<?php

declare(strict_types=1);

namespace Drupal\ct_dev\Commands;

use Drupal\Core\Theme\Component\ComponentValidator;
use Drush\Commands\DrushCommands;
use Symfony\Component\Yaml\Yaml;

/**
 * Validates SDC component schemas using Drupal core's ComponentValidator.
 *
 * @package Drupal\ct_dev\Commands
 */
class ValidateComponentCommand extends DrushCommands {
  /**
   * @command ct_dev:validate-components
   */
  public function validate() {
    $component_validator = new ComponentValidator();
    $components_path = DRUPAL_ROOT . '/themes/custom/civictheme_sdc/components';
    $errors = [];

    if (!is_dir($components_path)) {
      throw new \Exception("Components directory not found: {$components_path}");
    }

    foreach (new \DirectoryIterator($components_path) as $fileinfo) {
      if ($fileinfo->isDot() || !$fileinfo->isDir()) continue;

      $component_file = $fileinfo->getPathname() . '/' . $fileinfo->getFilename() . '.component.yml';
      if (file_exists($component_file)) {
        try {
          $definition = Yaml::parseFile($component_file);
        } catch (\Exception $e) {
          $errors[] = "[✘] {$fileinfo->getFilename()} - Invalid YAML: " . $e->getMessage();
          continue;
        }
        try {
          $component_validator->validateDefinition($definition);
          $this->output()->writeln("[✔] {$fileinfo->getFilename()} valid.");
        } catch (\Exception $e) {
          $errors[] = "[✘] {$fileinfo->getFilename()} - " . $e->getMessage();
        }
      }
    }

    if ($errors) {
      foreach ($errors as $error) {
        $this->output()->writeln($error);
      }
      throw new \Exception("Component validation failed.");
    }
    $this->output()->writeln("All components valid.");
  }
}
