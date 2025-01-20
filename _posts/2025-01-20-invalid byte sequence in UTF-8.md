---
layout: post
title: "Invalid byte sequence in UTF-8"
date: '2025-01-20'
author: gojimmypi
tags:
- GitHub Pages
- Invalid byte sequence
- UTF-8
- Blog
- Markdown
- iconv
---

Notes on fixing "invalid byte sequence in UTF-8" message in markdown files. Reminder that the problem is typically caused when copy/paste operation from a non-standard text source (such as a PDF file with unsual encoding) is pasted into a plain-text markdown file in Visusal Studio.

I have a sample of such a file here:

https://github.com/gojimmypi/gojimmypi.github.io/blob/master/_posts/2021-08-10-hello.md

Although it may _look_ like an ordinary text file, when testing with [./_build-development.sh](https://github.com/gojimmypi/gojimmypi.github.io/blob/master/_build-development.sh) this error occurs:

```text
Error: could not read file /mnt/c/workspace/gojimmypi.github.io/_posts/2021-08-10-hello.md: invalid byte sequence in UTF-8
```

I also encountered a problem with a [recent SiFive Unmatched RISC-V blog](https://github.com/gojimmypi/gojimmypi.github.io/blob/3ed6435ce34e7f006697b93af33fee3412eefdff/_posts/2025-01-12-SiFive-Unmatched-RISC-V-build.md?plain=1#L1).

To see the encoding, use the `file -i`:

```
file -i  /mnt/c/workspace/gojimmypi.github.io/_posts/2021-08-10-hello.md
/mnt/c/workspace/gojimmypi.github.io/_posts/2021-08-10-hello.md: text/plain; charset=unknown-8bit

file -i  /mnt/c/workspace/gojimmypi.github.io/_posts/2025-01-12-SiFive-Unmatched-RISC-V-build.md
/mnt/c/workspace/gojimmypi.github.io/_posts/2025-01-12-SiFive-Unmatched-RISC-V-build.md: text/plain; charset=iso-8859-1

file -i  /mnt/c/workspace/gojimmypi.github.io/_posts/2025-01-01-wolfSSL-as-vcpkg.md
/mnt/c/workspace/gojimmypi.github.io/_posts/2025-01-01-wolfSSL-as-vcpkg.md: text/plain; charset=us-ascii
```

The desired encoding for [GitHub Pages](https://pages.github.com/) is `text/plain; charset=us-ascii`.

```
# The file to fix:
MY_FILE=/mnt/c/workspace/gojimmypi.github.io/_posts/2025-01-12-SiFive-Unmatched-RISC-V-build.md

# Repalce with a "best fit" using TRANSLIT in a temporary file
iconv -f iso-8859-1 -t us-ascii//TRANSLIT "$MY_FILE" -o "$MY_FILE".tmp

# Update the original problematic file/
mv "$MY_FILE".tmp $MY_FILE
```

In this example, the problematic [degree symbol was replaced with a space](https://github.com/gojimmypi/gojimmypi.github.io/commit/bd7a8f8eca10834a4a95110e13f0b78df39cb7f0).
