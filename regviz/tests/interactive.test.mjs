/**
 * Tests for interactive mode in regviz utility.
 */

import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import inquirer from 'inquirer';

// Mock dependencies
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}));

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

jest.mock('../lib/commands/capture.mjs', () => ({
  executeCaptureCommand: jest.fn().mockResolvedValue({
    name: 'set--test--components',
    exists: false,
  }),
}));

jest.mock('../lib/commands/compare.mjs', () => ({
  executeCompareCommand: jest.fn().mockResolvedValue({
    name: 'diff--test--vs--test',
    exists: false,
  }),
}));

// Import after mocking
import {
  runInteractiveMenu,
  handleCaptureInteractive,
  handleCompareInteractive
} from '../lib/interactive.mjs';
import {formatDisplayName} from "../lib/utils.mjs";

describe('Interactive mode tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock configuration
    fs.readFileSync.mockReturnValue(JSON.stringify({
      screenshot_sets: {
        'set--main--components': {
          source: 'main',
          directory: 'screenshots/set--main--components',
          captureDirectory: 'components'
        },
        'set--current--components': {
          source: 'current',
          branch: 'feature-branch',
          directory: 'screenshots/set--current--components',
          captureDirectory: 'components'
        }
      },
      comparisons: {
        'diff--main--vs--current': {
          source: 'set--main--components',
          target: 'set--current--components',
          completed: true
        }
      }
    }));
    fs.existsSync.mockReturnValue(true);

    // Mock inquirer responses
    inquirer.prompt.mockImplementation(async (questions) => {
      // Default behaviors for different questions
      if (questions[0].name === 'action') {
        return { action: 'exit' };
      } else if (questions[0].name === 'source') {
        return { source: 'main' };
      } else if (questions[0].name === 'target') {
        return { target: 'components' };
      } else if (questions[0].name === 'name') {
        return { name: '' }; // Trigger auto-generated name
      } else if (questions[0].name === 'continueAction') {
        return { continueAction: false };
      }

      // Default empty response for other questions
      return {};
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Main menu', () => {
    test('should exit when exit option is selected', async () => {
      inquirer.prompt.mockResolvedValueOnce({ action: 'exit' });

      await runInteractiveMenu();

      expect(inquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'action',
            type: 'list'
          })
        ])
      );
    });

    test('should call capture handler when capture is selected', async () => {
      // Mock the handleCaptureInteractive function
      const mockHandleCaptureInteractive = jest.fn();
      const originalModule = await import('../lib/interactive.mjs');
      originalModule.handleCaptureInteractive = mockHandleCaptureInteractive;

      inquirer.prompt.mockResolvedValueOnce({ action: 'capture' });

      await runInteractiveMenu();

      expect(mockHandleCaptureInteractive).toHaveBeenCalled();
    });
  });

  describe('Capture interactive', () => {
    // We need to test the auto-generation name feature
    test('should use auto-generated name without confirmation', async () => {
      // Mock inquirer to return specific responses
      inquirer.prompt
        // First prompt for source
        .mockResolvedValueOnce({ source: 'main' })
        // Then prompt for target
        .mockResolvedValueOnce({ target: 'components' })
        // Then prompt for name (empty to trigger auto-generation)
        .mockResolvedValueOnce({ name: '' })
        // Continue action prompt
        .mockResolvedValueOnce({ continueAction: false });

      // Import the original function to test
      const { handleCaptureInteractive, executeCaptureCommand } = await import('../lib/interactive.mjs');

      // Mock the execute function to track calls
      const mockExecuteCaptureCommand = jest.fn().mockResolvedValue({
        name: 'set--main--components',
        exists: false
      });

      // Replace the real implementation temporarily
      const originalExecuteCaptureCommand = executeCaptureCommand;
      global.executeCaptureCommand = mockExecuteCaptureCommand;

      // Call the function under test
      await handleCaptureInteractive();

      // Restore the original implementation
      global.executeCaptureCommand = originalExecuteCaptureCommand;

      // Verify the name pattern was used without confirmation prompt
      expect(mockExecuteCaptureCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'main',
          target: 'components',
          name: 'set--main--components'
        })
      );
    });
  });

  describe('Compare interactive', () => {
    test('should use auto-generated name without confirmation', async () => {
      // Mock inquirer to return specific responses
      inquirer.prompt
        // First prompt for source
        .mockResolvedValueOnce({ source: 'set--main--components' })
        // Then prompt for target
        .mockResolvedValueOnce({ target: 'set--current--components' })
        // Then prompt for name (empty to trigger auto-generation)
        .mockResolvedValueOnce({ name: '' })
        // Continue action prompt
        .mockResolvedValueOnce({ continueAction: false });

      // Import the original function to test
      const { handleCompareInteractive, executeCompareCommand } = await import('../lib/interactive.mjs');

      // Mock the execute function to track calls
      const mockExecuteCompareCommand = jest.fn().mockResolvedValue({
        name: 'diff--main--vs--current',
        exists: false
      });

      // Replace the real implementation temporarily
      const originalExecuteCompareCommand = executeCompareCommand;
      global.executeCompareCommand = mockExecuteCompareCommand;

      // Call the function under test
      await handleCompareInteractive();

      // Restore the original implementation
      global.executeCompareCommand = originalExecuteCompareCommand;

      // Verify the name pattern was used without confirmation prompt
      expect(mockExecuteCompareCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'set--main--components',
          target: 'set--current--components',
          name: expect.stringContaining('diff--')
        })
      );
    });
  });

  describe('formatDisplayName function', () => {
    test('should format main branch names correctly', () => {
      const formatted = formatDisplayName('set--main--components');
      expect(formatted).toBe('Main branch (Components)');
    });

    test('should format current branch names correctly', () => {
      const formatted = formatDisplayName('set--current--feature-branch--components');
      expect(formatted).toBe('Branch: feature-branch (Components)');
    });

    test('should format release versions correctly', () => {
      const formatted = formatDisplayName('set--release--1.2.3--components');
      expect(formatted).toBe('Release: 1.2.3 (Components)');
    });

    test('should handle SDC framework correctly', () => {
      const formatted = formatDisplayName('set--main--sdc');
      expect(formatted).toBe('Main branch (SDC)');
    });

    test('should handle custom frameworks correctly', () => {
      const formatted = formatDisplayName('set--current--feature-branch--custom');
      expect(formatted).toBe('Branch: feature-branch (custom)');
    });

    test('should return original name for non-matching format', () => {
      const formatted = formatDisplayName('some-arbitrary-name');
      expect(formatted).toBe('some-arbitrary-name');
    });

    test('should handle partial patterns gracefully', () => {
      const formatted = formatDisplayName('set--current');
      expect(formatted).toBe('set--current');
    });
  });
});
