#!/usr/bin/env python3
import argparse
import html
import os
import re
import sys


FRONT_MATTER_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)
DESC_KEY_RE = re.compile(r"^[ \t]*description[ \t]*:", re.MULTILINE)


def strip_html_to_text(s: str) -> str:
    # Remove script/style blocks first.
    s = re.sub(r"(?is)<(script|style)\b.*?>.*?</\1\s*>", " ", s)

    # Replace <br> and <p> with spaces/newlines-ish.
    s = re.sub(r"(?is)<\s*br\s*/?\s*>", " ", s)
    s = re.sub(r"(?is)</\s*p\s*>", " ", s)

    # Remove all other tags.
    s = re.sub(r"(?is)<[^>]+>", " ", s)

    # Decode HTML entities (&nbsp;, &amp;, etc).
    s = html.unescape(s)

    # Collapse whitespace.
    s = re.sub(r"\s+", " ", s).strip()
    return s


def first_n_words(text: str, n: int) -> str:
    # Treat words as runs of non-space.
    words = re.findall(r"\S+", text)
    words = words[:n]
    return " ".join(words).strip()


def yaml_quote_double(s: str) -> str:
    # Escape backslashes and double-quotes for a double-quoted YAML scalar.
    s = s.replace("\\", "\\\\")
    s = s.replace('"', '\\"')
    return '"' + s + '"'


def insert_description(front_matter: str, description_value: str) -> str:
    # Insert description line preferably after the first title: line, else after layout:, else at end.
    lines = front_matter.splitlines(True)  # keep line endings
    desc_line = "description: " + yaml_quote_double(description_value) + "\n"

    title_idx = None
    layout_idx = None

    for i, line in enumerate(lines):
        if title_idx is None and re.match(r"^[ \t]*title[ \t]*:", line):
            title_idx = i
        if layout_idx is None and re.match(r"^[ \t]*layout[ \t]*:", line):
            layout_idx = i

    if title_idx is not None:
        insert_at = title_idx + 1
    elif layout_idx is not None:
        insert_at = layout_idx + 1
    else:
        insert_at = len(lines)

    lines.insert(insert_at, desc_line)
    return "".join(lines)


def process_file(path: str, n_words: int, dry_run: bool, verbose: bool) -> bool:
    with open(path, "rb") as f:
        raw = f.read()

    # Best-effort decode: treat as UTF-8; if it fails, keep going with replacement.
    try:
        content = raw.decode("utf-8")
    except UnicodeDecodeError:
        content = raw.decode("utf-8", errors="replace")

    m = FRONT_MATTER_RE.match(content)
    if not m:
        if verbose:
            print("SKIP(no front matter): " + path)
        return False

    fm = m.group(1)
    if DESC_KEY_RE.search(fm):
        if verbose:
            print("SKIP(has description): " + path)
        return False

    body = content[m.end():]

    # Convert body to plain-ish text for a description.
    plain = strip_html_to_text(body)

    # If body is empty after stripping, do not add garbage.
    desc_text = first_n_words(plain, n_words)
    if not desc_text:
        if verbose:
            print("SKIP(empty body): " + path)
        return False

    new_fm = insert_description(fm, desc_text)
    new_content = "---\n" + new_fm.rstrip("\r\n") + "\n---\n" + body

    if dry_run:
        print("WOULD_UPDATE: " + path)
        if verbose:
            print("  description: " + desc_text)
        return True

    # Write back as UTF-8 (preserves your current typical encoding).
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_content)

    print("UPDATED: " + path)
    return True


def iter_post_files(root: str):
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip generated output folders if they exist inside the tree.
        skip = {"_site", "_tag", "_tags", "_category", "_categories", ".jekyll-cache"}
        dirnames[:] = [d for d in dirnames if d not in skip]

        for name in filenames:
            lower = name.lower()
            if lower.endswith((".md", ".markdown", ".html")):
                yield os.path.join(dirpath, name)


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Add missing YAML front matter description: using first N words from post body."
    )
    ap.add_argument("posts_dir", nargs="?", default="_posts", help="Directory to scan (default: _posts)")
    ap.add_argument("-n", "--words", type=int, default=28, help="Number of words to use (default: 28)")
    ap.add_argument("--dry-run", action="store_true", help="Do not modify files; just print what would change")
    ap.add_argument("-v", "--verbose", action="store_true", help="Verbose output")
    args = ap.parse_args()

    if args.words <= 0:
        print("ERROR: --words must be > 0", file=sys.stderr)
        return 2

    if not os.path.isdir(args.posts_dir):
        print("ERROR: Directory not found: " + args.posts_dir, file=sys.stderr)
        return 2

    changed = 0
    for path in sorted(iter_post_files(args.posts_dir)):
        try:
            if process_file(path, args.words, args.dry_run, args.verbose):
                changed += 1
        except Exception as e:
            print("ERROR: " + path + ": " + str(e), file=sys.stderr)
            return 3

    if args.dry_run:
        print("DRY_RUN_DONE. Files that would be updated: " + str(changed))
    else:
        print("DONE. Files updated: " + str(changed))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
