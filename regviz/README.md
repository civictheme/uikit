# RegViz

RegViz is a visual difference testing tool for CivicTheme UIKit, enabling comparison of component screenshots across different sources.

## Features

- Screenshot capture from multiple sources:
  - Main branch
  - Latest release or specific version
  - Current branch
- Configurable target directories (components or SDC components)
- Flexible comparison between any baseline and target
- Configuration management with persistent storage
- Clean command for maintenance

## Usage

### Installation

The tool is built into the CivicTheme UIKit repository and can be used via npm scripts:

```bash
npm run regviz [command] [options]
```

You can also run it directly with Node.js:

```bash
node regviz/index.js [command] [options]
```

### Interactive Mode

For a more user-friendly experience, you can run the tool in interactive mode, which presents menu prompts for all commands and options:

```bash
npm run regviz interactive
# or shorter alias
npm run regviz i
# or use the dedicated script
npm run regviz:interactive
```

Interactive mode guides you through each step with intuitive prompts, making it easier to select sources, targets, and other options without needing to remember command syntax.

### Commands

#### Capture

Capture screenshots from a specific source:

```bash
npm run regviz capture [options]
```

Options:
- `-s, --source <source>`: Source for screenshots (main|release|current). Default: "current"
- `-t, --target <target>`: Target directory (components|components-sdc). Default: "components"
- `-n, --name <name>`: Custom name for this capture set (optional)
- `-v, --version <version>`: Specific release version (only for release source)
- `-f, --force`: Force overwrite if the capture already exists

If you don't specify a name, one will be auto-generated based on the options you've selected:
- For main branch: `main-[components|sdc]`
- For current branch: `current-[branch-name]-[components|sdc]`
- For releases: `release-[version]-[components|sdc]`

If a capture with the same name already exists, you'll be warned and given the option to:
- Use the `--force` flag to overwrite existing captures
- Confirm the overwrite when prompted in interactive mode

In interactive mode, you'll see a preview of the auto-generated name and have the option to customize it.

Examples:
```bash
# Capture current branch components
npm run regviz capture

# Capture main branch SDC components
npm run regviz capture --source main --target components-sdc

# Capture specific release
npm run regviz capture --source release --version 1.8.0 --name release-1.8.0
```

#### Compare

Compare two sets of screenshots:

```bash
npm run regviz compare [options]
```

Options:
- `-b, --baseline <name>`: Baseline screenshots name
- `-t, --target <name>`: Target screenshots name
- `-n, --name <name>`: Custom name for this comparison (optional)
- `-f, --force`: Force overwrite if the comparison already exists

If you don't specify a name, one will be auto-generated based on the selected baseline and target:
- Format: `[baseline-type]-vs-[target-type]`
- Example: `main-vs-branch-feature-add-reg-suit`

If a comparison with the same name already exists, you'll be warned and given the option to:
- Use the `--force` flag to overwrite existing comparisons
- Confirm the overwrite when prompted in interactive mode

In interactive mode, you'll see a preview of the auto-generated name and have the option to customize it.

Examples:
```bash
# Compare main branch to current branch
npm run regviz compare --baseline main-components-20250417 --target current-components-20250417

# Compare specific releases
npm run regviz compare --baseline release-1.8.0 --target release-1.9.0 --name version-comparison
```

#### List

List available baselines, targets, or comparisons:

```bash
npm run regviz list [options]
```

Options:
- `-b, --baselines`: List available baselines
- `-t, --targets`: List available targets
- `-c, --comparisons`: List completed comparisons
- `-a, --all`: List all available data

Examples:
```bash
# List all data
npm run regviz list

# List only baselines
npm run regviz list --baselines
```

#### Clean

Remove baselines, targets, or comparisons:

```bash
npm run regviz clean [options]
```

Options:
- `-b, --baseline <name>`: Remove baseline
- `-t, --target <name>`: Remove target
- `-c, --comparison <name>`: Remove comparison
- `-a, --all`: Remove all data

Examples:
```bash
# Remove a specific baseline
npm run regviz clean --baseline main-components-20250417

# Remove all data
npm run regviz clean --all
```

## Configuration

RegViz stores its configuration in a `.regviz.json` file in the project root. This file tracks all baselines, targets, and comparisons, as well as their respective directories.

Screenshot data is stored in the `screenshots` directory with the following structure:
- `screenshots/baseline-*`: Baseline screenshots
- `screenshots/target-*`: Target screenshots
- `screenshots/diff-*`: Comparison results

## Workflow Example

A typical workflow for comparing current branch to main:

```bash
# Capture main branch components
npm run regviz capture --source main --name main-baseline

# Capture current branch components
npm run regviz capture --name current-feature

# Compare the two
npm run regviz compare --baseline main-baseline --target current-feature
```

After running the compare command, you can view the results in the generated HTML report.