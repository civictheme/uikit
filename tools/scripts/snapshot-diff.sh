#!/bin/bash

# Define your directories
TWIG_COMPONENTS="packages/twig/components"
SDC_TWIG_COMPONENTS="packages/sdc/components"

# Flag to track if any differences were found
found_differences=0

# Find all snapshot files and compare them
while IFS= read -r -d '' file1; do
    # Get the relative path to use for comparison
    relative_path="${file1#$TWIG_COMPONENTS/}"
    file2="$SDC_TWIG_COMPONENTS/$relative_path"

    if [ -f "$file2" ]; then
        # Store diff output in a variable
        diff_output=$(diff -u "$file1" "$file2")

        # Check if there are differences
        if [ -n "$diff_output" ]; then
            echo "Error: Difference found between $file1 and $file2"
            echo "$diff_output"
            found_differences=1
        fi
    else
        echo "Warning: File doesn't exist in second directory: $relative_path"
        found_differences=1
    fi
done < <(find "$TWIG_COMPONENTS" -name "*.test.js.snap" -print0)


# Exit with non-zero status if differences were found
if [ $found_differences -eq 1 ]; then
    echo "Differences were found between snapshot files."
    exit 1
else
    echo "All snapshot files match."
    exit 0
fi
