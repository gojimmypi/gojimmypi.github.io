#!/usr/bin/env bash

DIR="$1"

if [ -z "$DIR" ]; then
    echo "Usage: $0 <directory>"
    exit 2
fi

if find "$DIR" -maxdepth 1 -type f -name "*_*" | grep -q .; then
    echo "ERROR: Files with underscores found in $DIR"
    find "$DIR" -maxdepth 1 -type f -name "*_*"
    exit 1
fi

echo "OK: No filenames with underscores in $DIR"
