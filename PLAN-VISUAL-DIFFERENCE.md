# Visual Difference Testing System Plan

## Overview

This plan outlines the steps to enhance the current visual regression testing system to support:
- Multiple baseline sources (main branch, last release, current branch)
- Configurable target directories
- Saved configurations and results for comparison

## Architecture

The enhanced system will use:
- Commander.js for CLI interface
- Configuration system to track baselines, targets, and results
- Modular approach for screenshot capture, comparison, and reporting

## Implementation Steps

### Phase 1: Project Setup

1. **Install Dependencies**
   - Add Commander.js for CLI interface
   - Add other necessary dependencies for configuration management

2. **Create CLI Architecture**
   - Define command structure for the tool
   - Implement basic command routing
   - Set up configuration file structure

### Phase 2: Configuration System

3. **Implement Configuration Management**
   - Create configuration file format
   - Implement saving/loading of configurations
   - Support for multiple configurations

4. **Setup Output Directory Structure**
   - Define organization for baseline screenshots
   - Structure for target screenshots
   - Directory for comparison results

### Phase 3: Screenshot Generation

5. **Refactor Current Screenshot Logic**
   - Extract core functionality into reusable modules
   - Support for custom output directories
   - Implement parallel processing improvements

6. **Implement Baseline Sources**
   - Main branch checkout and build
   - Last release fetch and build
   - Current branch build
   - Screenshot capture for each source

### Phase 4: Comparison System

7. **Enhanced Comparison Logic**
   - Support for comparing any baseline with any target
   - Configuration tracking for completed comparisons
   - Report generation improvements

8. **Reporting Enhancements**
   - Generate comparison reports
   - Track historical comparisons
   - Summary statistics

### Phase 5: CLI Commands

9. **Implement Core Commands**
   - `capture`: Take screenshots from a specified source
   - `compare`: Compare two sets of screenshots
   - `list`: Show available baselines and targets
   - `clean`: Remove screenshots or comparison results

10. **Advanced Command Options**
    - Support for filtering components
    - Control over parallelism
    - Verbosity options

### Phase 6: Testing and Documentation

11. **Testing**
    - Test all commands and options
    - Verify configuration persistence
    - Ensure proper error handling

12. **Documentation**
    - Update README with usage instructions
    - Add examples for common scenarios
    - Document configuration options

## Detailed Technical Implementation

### Configuration File Structure

```json
{
  "baselines": {
    "main-20250415": {
      "type": "main",
      "date": "2025-04-15",
      "directory": "./screenshots/baseline-main-20250415",
      "commit": "abc123"
    },
    "release-1.2.0": {
      "type": "release",
      "version": "1.2.0",
      "directory": "./screenshots/baseline-release-1.2.0"
    }
  },
  "targets": {
    "sdc-20250415": {
      "type": "sdc",
      "date": "2025-04-15",
      "directory": "./screenshots/target-sdc-20250415"
    },
    "components-20250415": {
      "type": "components",
      "date": "2025-04-15",
      "directory": "./screenshots/target-components-20250415"
    }
  },
  "comparisons": {
    "main-vs-sdc-20250415": {
      "baseline": "main-20250415",
      "target": "sdc-20250415",
      "date": "2025-04-15",
      "reportDirectory": "./screenshots/diff-main-vs-sdc-20250415",
      "completed": true
    }
  }
}
```

### CLI Command Structure

```
regviz capture [options]
  --source <source>       Source for screenshots (main|release|current)
  --target <target>       Target directory (components|components-sdc)
  --name <name>           Name for this capture set

regviz compare [options]
  --baseline <name>       Baseline screenshots name
  --target <name>         Target screenshots name
  --name <name>           Name for this comparison

regviz list [options]
  --baselines             List available baselines
  --targets               List available targets
  --comparisons           List completed comparisons

regviz clean [options]
  --baseline <name>       Remove baseline
  --target <name>         Remove target
  --comparison <name>     Remove comparison
  --all                   Remove all data
```

## Implementation Schedule

1. Project Setup & Configuration System (Steps 1-4)
2. Screenshot Generation System (Steps 5-6)
3. Comparison System (Steps 7-8)
4. CLI Commands Implementation (Steps 9-10)
5. Testing and Documentation (Steps 11-12)

Each implementation step will be committed separately with clear descriptions of the changes.