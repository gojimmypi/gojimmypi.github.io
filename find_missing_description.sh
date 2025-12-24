#!/usr/bin/env bash
set -euo pipefail

POSTS_DIR="${1:-_posts}"

if [[ ! -d "$POSTS_DIR" ]]; then
    echo "ERROR: Directory not found: $POSTS_DIR" >&2
    exit 2
fi

missing_count=0

while IFS= read -r -d '' f; do
    # Only check files that start with front matter.
    if [[ "$(head -n 1 "$f")" != "---" ]]; then
        continue
    fi

    if ! awk '
        BEGIN { fm=0; seen=0; ok=0; }
        NR==1 && $0=="---" { fm=1; next; }
        fm==1 && $0=="---" { exit(ok ? 0 : 1); }

        fm==1 {
            # Match "description:" key (allow leading whitespace)
            if ($0 ~ /^[[:space:]]*description[[:space:]]*:/) {
                seen=1
                line=$0
                sub(/^[[:space:]]*description[[:space:]]*:[[:space:]]*/, "", line)

                # Trim whitespace
                sub(/^[[:space:]]+/, "", line)
                sub(/[[:space:]]+$/, "", line)

                # Remove one pair of surrounding quotes if present
                if (length(line) >= 2) {
                    first=substr(line,1,1)
                    last=substr(line,length(line),1)
                    if ((first=="\"" && last=="\"") || (first=="\047" && last=="\047")) {
                        line=substr(line,2,length(line)-2)
                        sub(/^[[:space:]]+/, "", line)
                        sub(/[[:space:]]+$/, "", line)
                    }
                }

                if (length(line) > 0) { ok=1; exit 0; }  # found non-empty description
                else { ok=0; exit 1; }                    # description present but empty
            }
        }

        END {
            # If no closing --- was found, or no description was seen, treat as missing.
            if (ok) exit 0
            exit 1
        }
    ' "$f"; then
        printf '%s\n' "$f"
        missing_count=$((missing_count + 1))
    fi
done < <(find "$POSTS_DIR" -type f \( -name "*.md" -o -name "*.markdown" -o -name "*.html" \) -print0)

if [[ "$missing_count" -ne 0 ]]; then
    echo "Missing/empty description in $missing_count file(s)." >&2
    exit 1
fi

echo "All posts in $POSTS_DIR have a non-empty description."
