<?php

declare(strict_types=1);

namespace Drupal\Tests\ct_dev\Kernel;

use Drupal\ct_dev\Commands\ValidateComponentCommand;
use Drupal\KernelTests\KernelTestBase;
use Drupal\Core\File\FileSystemInterface;
use Symfony\Component\Console\Output\BufferedOutput;

/**
 * Tests the ValidateComponentCommand functionality.
 *
 * @group ct_dev
 */
class ValidateComponentCommandTest extends KernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'ct_dev',
  ];

  /**
   * The validate component command instance.
   *
   * @var \Drupal\ct_dev\Commands\ValidateComponentCommand
   */
  protected ValidateComponentCommand $command;

  /**
   * The test components directory.
   *
   * @var string
   */
  protected string $testComponentsDir;

  /**
   * The file system service.
   *
   * @var \Drupal\Core\File\FileSystemInterface
   */
  protected FileSystemInterface $fileSystem;

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    // Get file system service.
    $this->fileSystem = $this->container->get('file_system');

    // Create a temporary directory for test components.
    $this->testComponentsDir = $this->fileSystem->getTempDirectory() . '/test_components_' . uniqid();
    $this->fileSystem->mkdir($this->testComponentsDir);

    // Create command instance with mocked output.
    $this->command = new ValidateComponentCommandMock();
  }

  /**
   * {@inheritdoc}
   */
  protected function tearDown(): void {
    // Clean up test directory.
    if ($this->testComponentsDir && is_dir($this->testComponentsDir)) {
      $this->fileSystem->deleteRecursive($this->testComponentsDir);
    }
    parent::tearDown();
  }

  /**
   * Tests validation of a valid component.
   */
  public function testValidComponent(): void {
    // Create a valid component file.
    file_put_contents(
      $this->testComponentsDir . '/valid.component.yml',
      <<<YAML
\$schema: https://git.drupalcode.org/project/drupal/-/raw/HEAD/core/assets/schemas/v1/metadata.schema.json
name: Valid Component
status: stable
description: A valid test component
props:
  type: object
  properties:
    theme:
      type: string
      enum:
        - light
        - dark
slots:
  content:
    title: Content
    description: Main content slot
YAML
    );

    $this->command->validateComponentDefinitions($this->testComponentsDir);
    $output = $this->command->getOutputBuffer();

    $this->assertStringContainsString('✅ 1 components are valid', $output);
    $this->assertStringContainsString('✨ All components are valid', $output);
  }

  /**
   * Tests validation with invalid YAML syntax.
   */
  public function testInvalidYamlSyntax(): void {
    // Create component with invalid YAML.
    file_put_contents(
      $this->testComponentsDir . '/invalid-yaml.component.yml',
      <<<YAML
\$schema: https://git.drupalcode.org/project/drupal/-/raw/HEAD/core/assets/schemas/v1/metadata.schema.json
name: Invalid YAML Component
status: stable
props:
  type: object
  properties:
    attributes:
      type: string
      test
      title: Attributes
slots:
  content:
    title: Content
YAML
    );

    $this->expectException(\Exception::class);
    $this->expectExceptionMessage('Component validation failed.');

    try {
      $this->command->validateComponentDefinitions($this->testComponentsDir);
    } catch (\Exception $e) {
      $output = $this->command->getOutputBuffer();
      $this->assertStringContainsString('Unable to parse at line', $output);
      throw $e;
    }
  }

  /**
   * Tests validation with empty slots property.
   */
  public function testEmptySlotsProperty(): void {
    // Create component with empty slots.
    file_put_contents(
      $this->testComponentsDir . '/empty-slots.component.yml',
      <<<YAML
\$schema: https://git.drupalcode.org/project/drupal/-/raw/HEAD/core/assets/schemas/v1/metadata.schema.json
name: Empty Slots Component
status: stable
props:
  type: object
slots:
YAML
    );

    $this->expectException(\Exception::class);
    $this->expectExceptionMessage('Component validation failed.');

    try {
      $this->command->validateComponentDefinitions($this->testComponentsDir);
    } catch (\Exception $e) {
      $output = $this->command->getOutputBuffer();
      $this->assertStringContainsString('[slots] NULL value found, but an object is required', $output);
      throw $e;
    }
  }

  /**
   * Tests validation with non-existent directory.
   */
  public function testNonExistentDirectory(): void {
    $this->expectException(\Exception::class);
    $this->expectExceptionMessage('Components directory not found');
    $this->command->validateComponentDefinitions('/non/existent/path');
  }

  /**
   * Tests validation with directory containing no component files.
   */
  public function testNoComponentFiles(): void {
    // Create empty directory.
    $empty_dir = $this->testComponentsDir . '/empty';
    $this->fileSystem->mkdir($empty_dir);

    $this->expectException(\Exception::class);
    $this->expectExceptionMessage('No component definition files found');
    $this->command->validateComponentDefinitions($empty_dir);
  }

  /**
   * Tests validation with multiple components including failures.
   */
  public function testMultipleComponentsWithFailures(): void {
    // Create valid component.
    file_put_contents(
      $this->testComponentsDir . '/valid.component.yml',
      <<<YAML
\$schema: https://git.drupalcode.org/project/drupal/-/raw/HEAD/core/assets/schemas/v1/metadata.schema.json
name: Valid Component
status: stable
description: A valid component
props:
  type: object
slots:
  content:
    title: Content
YAML
    );

    // Create invalid component.
    file_put_contents(
      $this->testComponentsDir . '/invalid.component.yml',
      <<<YAML
\$schema: https://git.drupalcode.org/project/drupal/-/raw/HEAD/core/assets/schemas/v1/metadata.schema.json
name: Invalid Component
status: stable
props:
  type: object
  properties:
    test
      invalid: yaml
slots:
YAML
    );

    $this->expectException(\Exception::class);
    $this->expectExceptionMessage('Component validation failed.');

    try {
      $this->command->validateComponentDefinitions($this->testComponentsDir);
    } catch (\Exception $e) {
      $output = $this->command->getOutputBuffer();
      // Should show 1 valid component.
      $this->assertStringContainsString('✅ 1 components are valid', $output);
      // Should show the failure.
      $this->assertStringContainsString('Failed components:', $output);
      $this->assertStringContainsString('Mapping values are not allowed', $output);
      throw $e;
    }
  }
}

/**
 * Mock class for ValidateComponentCommand that captures output.
 */
class ValidateComponentCommandMock extends ValidateComponentCommand {

  /**
   * Output buffer.
   *
   * @var \Symfony\Component\Console\Output\BufferedOutput
   */
  private BufferedOutput $outputBuffer;

  /**
   * {@inheritdoc}
   */
  public function __construct() {
    parent::__construct();
    $this->outputBuffer = new BufferedOutput();
  }

  /**
   * {@inheritdoc}
   */
  protected function output() {
    return $this->outputBuffer;
  }

  /**
   * Get the output buffer content.
   *
   * @return string
   */
  public function getOutputBuffer(): string {
    return $this->outputBuffer->fetch();
  }
}
