/**
 * Tests for the formatDisplayName function.
 */

import { describe, expect, test } from '@jest/globals';

// Import the function we want to test

import {formatDisplayName} from "../lib/utils.mjs";

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
