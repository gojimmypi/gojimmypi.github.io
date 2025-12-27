#!/usr/bin/env python3
# file: trim_post_descriptions.py
#
# Shorten only the YAML front matter "description:" field in Jekyll _posts files.
# - Preserves everything else (including other front matter keys and body)
# - Only edits files that have a front matter block and a description key
# - Default max length is 155 characters (typical SEO snippet length)
#
# Usage:
#   python3 trim_post_descriptions.py ./_posts
#   python3 trim_post_descriptions.py ./_posts --max 155 --dry-run
#
# Notes:
# - Trims repeated whitespace inside description to single spaces before truncating
# - If the description is quoted, it will be rewritten as a double-quoted YAML string

import argparse
import os
import re
import sys
from typing import Tuple, Optional


FRONT_MATTER_DELIM = "---"


def split_front_matter(text: str) -> Tuple[Optional[str], Optional[str], str]:
    # Returns (front_matter, delim_line, rest)
    # If no front matter, front_matter=None
    lines = text.splitlines(keepends=True)
    if not lines:
        return None, None, text

    if lines[0].strip() != FRONT_MATTER_DELIM:
        return None, None, text

    # Find closing delimiter
    for i in range(1, len(lines)):
        if lines[i].strip() == FRONT_MATTER_DELIM:
            front = "".join(lines[1:i])
            rest = "".join(lines[i + 1 :])
            return front, lines[i], rest

    # Unclosed front matter
    return None, None, text


def normalize_ws(s: str) -> str:
    # Collapse all whitespace runs to single spaces and strip ends
    return re.sub(r"\s+", " ", s).strip()


def yaml_escape_double_quoted(s: str) -> str:
    # Minimal YAML-safe escaping for a double-quoted scalar
    # Escape backslash and double quote
    s = s.replace("\\", "\\\\")
    s = s.replace('"', '\\"')
    return s


def shorten_description_value(raw_value: str, max_len: int) -> str:
    val = raw_value.strip()

    # Remove surrounding single/double quotes if present
    if len(val) >= 2 and ((val[0] == '"' and val[-1] == '"') or (val[0] == "'" and val[-1] == "'")):
        val = val[1:-1]

    val = normalize_ws(val)

    if len(val) <= max_len:
        return val

    # Truncate and avoid trailing partial word if reasonable
    truncated = val[:max_len].rstrip()

    # If we cut mid-word, back up to last space if it is not too far
    last_space = truncated.rfind(" ")
    if last_space >= 0 and (max_len - last_space) <= 20 and last_space >= 40:
        truncated = truncated[:last_space].rstrip()

    return truncated


def process_front_matter(front: str, max_len: int) -> Tuple[str, bool]:
    changed = False
    out_lines = []

    # Match "description:" preserving indentation and spacing after colon
    # Example: description: "text"
    # Also handles: description: text
    desc_re = re.compile(r"^(\s*description\s*:\s*)(.*?)(\s*)$")

    for line in front.splitlines(keepends=True):
        # Keep newline as-is
        line_wo_nl = line[:-1] if line.endswith("\n") else line
        m = desc_re.match(line_wo_nl)
        if not m:
            out_lines.append(line)
            continue

        prefix = m.group(1)
        raw_value = m.group(2)
        suffix_ws = m.group(3)

        new_value = shorten_description_value(raw_value, max_len)

        # If original was empty, do not invent one; just keep it
        if normalize_ws(raw_value) == "":
            out_lines.append(line)
            continue

        # Only rewrite if it actually changes
        old_norm = normalize_ws(raw_value.strip().strip('"').strip("'"))
        if new_value != old_norm:
            changed = True

        # Always write as double-quoted YAML for consistency/safety
        escaped = yaml_escape_double_quoted(new_value)
        new_line_wo_nl = prefix + '"' + escaped + '"' + suffix_ws
        out_lines.append(new_line_wo_nl + ("\n" if line.endswith("\n") else ""))

    return "".join(out_lines), changed


def is_post_file(path: str) -> bool:
    # Jekyll posts are usually .md or .html, but we'll accept any file in _posts
    base = os.path.basename(path)
    if base.startswith("."):
        return False
    return True


def walk_files(root: str):
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip common junk dirs inside _posts (rare, but safe)
        dirnames[:] = [d for d in dirnames if d not in [".git", ".svn", ".hg", "_site"]]
        for fn in filenames:
            p = os.path.join(dirpath, fn)
            if is_post_file(p):
                yield p


def read_text_preserve(path: str) -> str:
    # Use surrogateescape so we do not corrupt odd bytes
    with open(path, "r", encoding="utf-8", errors="surrogateescape") as f:
        return f.read()


def write_text_preserve(path: str, text: str) -> None:
    with open(path, "w", encoding="utf-8", errors="surrogateescape", newline="") as f:
        f.write(text)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("posts_dir", help="Path to your _posts directory")
    ap.add_argument("--max", type=int, default=155, help="Max description length (default: 155)")
    ap.add_argument("--dry-run", action="store_true", help="Show what would change, but do not write")
    ap.add_argument("--backup-ext", default=".bak", help="Backup extension (default: .bak). Use empty to disable.")
    args = ap.parse_args()

    posts_dir = args.posts_dir
    max_len = args.max

    if not os.path.isdir(posts_dir):
        print("ERROR: not a directory: " + posts_dir, file=sys.stderr)
        return 2

    changed_files = 0
    scanned_files = 0

    for path in walk_files(posts_dir):
        scanned_files += 1

        try:
            original = read_text_preserve(path)
        except Exception as e:
            print("WARN: failed to read: " + path + " (" + str(e) + ")", file=sys.stderr)
            continue

        front, closing_delim_line, rest = split_front_matter(original)
        if front is None:
            continue

        new_front, changed = process_front_matter(front, max_len)
        if not changed:
            continue

        changed_files += 1

        new_text = FRONT_MATTER_DELIM + "\n" + new_front + closing_delim_line + rest

        if args.dry_run:
            print("DRY-RUN: would update: " + path)
            continue

        # Backup
        if args.backup_ext:
            bak_path = path + args.backup_ext
            try:
                # Do not overwrite an existing backup; make it unique
                if os.path.exists(bak_path):
                    i = 1
                    while True:
                        candidate = bak_path + "." + str(i)
                        if not os.path.exists(candidate):
                            bak_path = candidate
                            break
                        i += 1
                write_text_preserve(bak_path, original)
            except Exception as e:
                print("WARN: failed to write backup for: " + path + " (" + str(e) + ")", file=sys.stderr)
                # Continue anyway; do not block updates

        try:
            write_text_preserve(path, new_text)
            print("UPDATED: " + path)
        except Exception as e:
            print("ERROR: failed to write: " + path + " (" + str(e) + ")", file=sys.stderr)

    print("Scanned: " + str(scanned_files) + " files")
    print("Updated: " + str(changed_files) + " files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
