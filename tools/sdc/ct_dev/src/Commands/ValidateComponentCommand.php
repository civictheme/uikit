<?php

declare(strict_types=1);

namespace Drupal\ct_dev\Commands;

use Drupal\Core\Theme\Component\ComponentValidator;
use Drush\Commands\DrushCommands;
use Symfony\Component\Yaml\Yaml;

/**
 * Validates SDC component definitions using Drupal core's ComponentValidator.
 *
 * @package Drupal\ct_dev\Commands
 */
class ValidateComponentCommand extends DrushCommands {

  /**
   * Defines the component validator.
   *
   * @var \Drupal\Core\Theme\Component\ComponentValidator
   */
  protected ComponentValidator $componentValidator;

  /**
   * {@inheritdoc}
   */
  public function __construct() {
    parent::__construct();
    $this->componentValidator = new ComponentValidator();
    $this->componentValidator->setValidator();
  }

  /**
   * Validates all component definitions in a given path.
   *
   * @param string $components_path
   *   Path to the directory containing component folders.
   *
   * @command ct_dev:validate-component-definition
   */
  public function validateComponentDefinitions(string $components_path) {
    if (!is_dir($components_path)) {
      throw new \Exception("Components directory not found: {$components_path}");
    }

    $component_files = [];
    $iterator = new \RecursiveIteratorIterator(
      new \RecursiveDirectoryIterator($components_path),
      \RecursiveIteratorIterator::SELF_FIRST
    );
    foreach ($iterator as $file) {
      if ($file->isFile() && $file->getExtension() === 'yml' && str_ends_with($file->getFilename(), '.component.yml')) {
        $component_files[] = $file->getPathname();
      }
    }

    if (empty($component_files)) {
      throw new \Exception("No component definition files found in: {$components_path}");
    }

    $errors = [];
    foreach ($component_files as $component_file) {
      try {
        $definition = Yaml::parseFile($component_file);
        // Merge with additional required keys.
        $component_name = basename($component_file, '.component.yml');
        $definition = array_merge(
          $definition,
          [
            'machineName' => $component_name,
            'extension_type' => 'theme',
            'id' => 'civictheme:' . $component_name,
            'library' => ['css' => ['component' => ['foo.css' => []]]],
            'path' => '',
            'provider' => 'civictheme',
            'template' => $component_name . '.twig',
            'group' => 'civictheme-group',
            'description' => 'CivicTheme component',
          ]
        );
        $this->validateComponentFile($definition);
        $this->output()->writeln("[✔] " . basename($component_file) . " valid.");
      }
      catch (\Exception $e) {
        $errors[] = "[✘] " . basename($component_file) . " - " . $e->getMessage();
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

  /**
   * Validates a single component definition file.
   *
   * @param array $definition
   *   The component definition.
   *
   * @throws \Drupal\Core\Render\Component\Exception\InvalidComponentException
   */
  public function validateComponentFile(array $definition): void {
    $this->componentValidator->validateDefinition($definition, TRUE);
  }

}
