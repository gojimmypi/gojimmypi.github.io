#!/bin/bash
set -euo pipefail

POSTS_DIR="_posts"
ARCHIVE_ROOT="archive"
TEMPLATE="templates/archive-year-index.html.in"

usage() {
    echo "Usage: $0 [--check]"
    echo "  --check   Do not write files; exit nonzero if any are missing."
}

MODE="write"
if [[ "${1-}" == "--check" ]]; then
    MODE="check"
elif [[ "${1-}" != "" ]]; then
    usage
    exit 2
fi

echo "Checking archive directories"

if [[ ! -d "$POSTS_DIR" ]]; then
    echo "ERROR: missing $POSTS_DIR directory"
    exit 2
fi

if [[ ! -f "$TEMPLATE" ]]; then
    echo "ERROR: missing template file: $TEMPLATE"
    exit 2
fi

# Extract years from filenames beginning with YYYY-MM-DD-
# Example: _posts/2022-06-14-something.md -> 2022
mapfile -t YEARS < <(ls -1 "$POSTS_DIR" \
    | sed -n 's/^\([0-9][0-9][0-9][0-9]\)-[0-9][0-9]-[0-9][0-9]-.*$/\1/p' \
    | sort -u)

if [[ ${#YEARS[@]} -eq 0 ]]; then
    echo "No years found in $POSTS_DIR filenames."
    exit 0
fi

missing_count=0
created_count=0

for year in "${YEARS[@]}"; do
    out_dir="$ARCHIVE_ROOT/$year"
    out_file="$out_dir/index.html"

    if [[ -f "$out_file" ]]; then
        continue
    fi

    if [[ "$MODE" == "check" ]]; then
        echo "Missing: $out_file"
        missing_count=$((missing_count + 1))
        continue
    fi

    mkdir -p "$out_dir"
    sed "s/__YEAR__/$year/g" "$TEMPLATE" > "$out_file"
    created_count=$((created_count + 1))
    echo "Created: $out_file"
done

if [[ "$MODE" == "check" ]]; then
    if [[ $missing_count -ne 0 ]]; then
        echo "ERROR: $missing_count archive page(s) missing."
        exit 2
    fi
    echo "All archive pages present."
else
    echo "Done. Created $created_count page(s)."
fi
