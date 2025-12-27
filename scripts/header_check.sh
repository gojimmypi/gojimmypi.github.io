#!/usr/bin/env bash

set -euo pipefail

usage() {
    echo "Usage:"
    echo "  $0 <markdown-file>"
    echo "  $0 <directory>"
    exit 2
}

if [ "$#" -ne 1 ]; then
    usage
fi

target="$1"
bad_count=0

check_file() {
    local file="$1"
    local in_code_block=0
    local line_no=0

    while IFS= read -r line; do
        line_no=$((line_no + 1))

        # Toggle code block state on triple backticks
        if [[ "$line" == '```'* ]]; then
            if [ "$in_code_block" -eq 0 ]; then
                in_code_block=1
            else
                in_code_block=0
            fi
            continue
        fi

        # Detect H1 only when not in a code block
        if [ "$in_code_block" -eq 0 ]; then
            if [[ "$line" =~ ^#[[:space:]][^#] ]]; then
                echo "BAD H1 HEADER: ${file}:${line_no}: $line"
                bad_count=$((bad_count + 1))
            fi
        fi

    done < "$file"
}

if [ -f "$target" ]; then
    check_file "$target"

elif [ -d "$target" ]; then
    while IFS= read -r -d '' file; do
        check_file "$file"
    done < <(find "$target" -type f -name "*.md" -print0)

else
    echo "Error: '$target' is not a file or directory"
    exit 2
fi

if [ "$bad_count" -ne 0 ]; then
    echo "Detected $bad_count invalid H1 header(s)."
    exit 1
fi

echo "No invalid H1 headers detected."
exit 0
