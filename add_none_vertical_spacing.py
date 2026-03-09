#!/usr/bin/env python3
"""Add 'none' to vertical_spacing enum in all SDC component YAML files."""

import glob
import re


def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find vertical_spacing enum blocks and check if 'none' is already present.
    # Pattern matches the enum list after vertical_spacing.
    pattern = r'(    vertical_spacing:\s*\n(?:      \w+:.*\n)*      enum:\n)((?:        - \w+\n)+)'

    def add_none(match):
        prefix = match.group(1)
        enum_block = match.group(2)
        enum_values = re.findall(r'- (\w+)', enum_block)

        if 'none' in enum_values:
            return match.group(0)

        # Add 'none' as the last enum value.
        new_enum_block = enum_block.rstrip('\n') + '\n        - none\n'
        print(f'  Updated: {filepath}')
        print(f'    Existing values: {enum_values}')
        print(f'    Added: none')
        return prefix + new_enum_block

    new_content = re.sub(pattern, add_none, content)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False


def main():
    files = sorted(glob.glob('packages/sdc/components/**/*.component.yml', recursive=True))
    print(f'Found {len(files)} component.yml files\n')

    updated = 0
    skipped = 0

    for filepath in files:
        with open(filepath, 'r') as f:
            content = f.read()

        if 'vertical_spacing:' not in content:
            continue

        if process_file(filepath):
            updated += 1
        else:
            skipped += 1

    print(f'\nDone. Updated: {updated}, Already had none: {skipped}')


if __name__ == '__main__':
    main()
