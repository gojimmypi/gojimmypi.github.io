---
layout: post
title: "git gpg for Visual Studio"
description: "Some notes on setting up git gpg for Visual Studio"
date: '2026-02-24'
author: gojimmypi
tags:
- git
- gpg
- Visual Studio
---

Reminders to self for setting up gpg for Visual Studio.


```
git config --global --get commit.gpgsign
git config --global --get gpg.program
gpgconf --list-options gpg-agent | findstr /i ttl
```

Ensure there's a `gpg` for `git`:

```
git config --show-origin --get gpg.program
```

Find `gpg`

```dos
where gpg
```

Output:

```text
C:\Program Files\Git\usr\bin\gpg.exe
```


Edit or create `%APPDATA%\gnupg\gpg-agent.conf`:

```
mkdir %APPDATA%\gnupg

notepad %APPDATA%\gnupg\gpg-agent.conf
```

Enter timeouts:

```
default-cache-ttl 3600
max-cache-ttl 7200
```

Restart:

```
gpgconf --kill gpg-agent
gpgconf --launch gpg-agent
```