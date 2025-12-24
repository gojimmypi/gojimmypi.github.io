---
layout: post
title: "Jekyll Site Failures"
description: "Here are some tips in creating a new GitHub Pages virtual directory: what didn't work. First, [Creating a GitHub Pages site with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll) Next, I created another repo"
date: '2021-05-26'
author: gojimmypi
tags:
- Jekyll
- Blog
- Tag
---

Here are some tips in creating a new GitHub Pages virtual directory: what didn't work.

First, [Creating a GitHub Pages site with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll)

Next, I created another repo called [jekyll-tag-test](https://github.com/gojimmypi/jekyll-tag-test). I created a new branch called `gh_pages` and then chaged it to be the
[default branch](https://docs.github.com/en/github/administering-a-repository/managing-branches-in-your-repository/changing-the-default-branch).


```
cd /mnt/c/workspace/
git clone https://github.com/gojimmypi/jekyll-tag-test.git
cd jekyll-tag-test
git checkout --orphan gh-pages
jekyll new . --force
```

As I had already manually created the `gh_pages` brnach, I added the `--force` when I saw this error:
```
0 $  jekyll new .
          Conflict: /mnt/c/workspace/jekyll-tag-test exists and is not empty.
                    Ensure /mnt/c/workspace/jekyll-tag-test is empty or else try again with `--force` to proceed and overwrite any files.
```

After the `jekyll new . --force` I saw this output:

```
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages +) gojimmypi/jekyll-tag-test

0 $  jekyll new . --force
Running bundle install in /mnt/c/workspace/jekyll-tag-test...
  Bundler: Fetching gem metadata from https://rubygems.org/..........
  Bundler: Resolving dependencies...
  Bundler: Using public_suffix 4.0.6
  Bundler: Using bundler 2.2.17
  Bundler: Using colorator 1.1.0
  Bundler: Using concurrent-ruby 1.1.8
  Bundler: Using eventmachine 1.2.7
  Bundler: Using http_parser.rb 0.6.0
  Bundler: Using forwardable-extended 2.6.0
  Bundler: Using rb-fsevent 0.11.0
  Bundler: Using rexml 3.2.5
  Bundler: Using liquid 4.0.3
  Bundler: Using mercenary 0.4.0
  Bundler: Using rouge 3.26.0
  Bundler: Using safe_yaml 1.0.5
  Bundler: Using unicode-display_width 1.7.0
  Bundler: Using addressable 2.7.0
  Bundler: Using i18n 1.8.10
  Bundler: Using kramdown 2.3.1
  Bundler: Using terminal-table 2.0.0
  Bundler: Using kramdown-parser-gfm 1.1.0
  Bundler: Using pathutil 0.16.2
  Bundler: Using em-websocket 0.5.2
  Bundler: Fetching ffi 1.15.1
  Bundler: Installing ffi 1.15.1 with native extensions
  Bundler: Using sassc 2.4.0
  Bundler: Using rb-inotify 0.10.1
  Bundler: Using jekyll-sass-converter 2.1.0
  Bundler: Using listen 3.5.1
  Bundler: Using jekyll-watch 2.2.1
  Bundler: Using jekyll 4.2.0
  Bundler: Using jekyll-feed 0.15.1
  Bundler: Using jekyll-seo-tag 2.7.1
  Bundler: Using minima 2.5.1
  Bundler: Bundle complete! 6 Gemfile dependencies, 31 gems now installed.
  Bundler: Use `bundle info [gemname]` to see where a bundled gem is installed.
New jekyll site installed in /mnt/c/workspace/jekyll-tag-test.
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test

0 $
```

Then a quick `git push` resulted in this error, even though I had already created the branch on the GitHub web site and cloned it locally:

```
0 $  git push
fatal: The current branch gh-pages has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin gh-pages

gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test
```

So, ok:

```
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test

0 $  git push --set-upstream origin gh-pages
error: src refspec gh-pages does not match any
error: failed to push some refs to 'https://github.com/gojimmypi/jekyll-tag-test.git'
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test

0 $
```

Perhaps the `any` meant it didn't like having a `main` repo, so I tried to delete it:

```
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test

0 $  git remote -v
origin  https://github.com/gojimmypi/jekyll-tag-test.git (fetch)
origin  https://github.com/gojimmypi/jekyll-tag-test.git (push)
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/


0 $  git branch -d main
fatal: Couldn't look up commit object for HEAD
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test

0 $  git branch
  gh_pages
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test

```

I renamed repo on the web site, and tried again:

```
0 $  git init
Reinitialized existing Git repository in /mnt/c/workspace/jekyll-tag-test/.git/
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test

0 $  git branch
  gh_pages
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test

0 $  git push
fatal: The current branch gh-pages has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin gh-pages

gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test

0 $  git push --set-upstream origin gh-pages
error: src refspec gh-pages does not match any
error: failed to push some refs to 'https://github.com/gojimmypi/jekyll-tag-test.git'
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test (gh-pages *+) gojimmypi/jekyll-tag-test
```

So I tried to completely start over fresh:

```
0 $  cd ../
gojimmypi@DESKTOP(WSL): /mnt/c/workspace ()

0 $  mkdir jekyll-tag-test2
gojimmypi@DESKTOP(WSL): /mnt/c/workspace ()

0 $  cd jekyll-tag-test2
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test2 ()

0 $  git init jekyll-tag-test2
Initialized empty Git repository in /mnt/c/workspace/jekyll-tag-test2/jekyll-tag-test2/.git/
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test2 ()

0 $  git checkout --orphan gh-pages
fatal: not a git repository (or any parent up to mount point /mnt)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test2 ()
```

ok, the problem there was I ran `git init jekyll-tag-test2` *after* `cd jekyll-tag-test2` (not good, it created another `cd jekyll-tag-test2` directory!)

so try again from GitHub sample code:
```
git init
echo "hello world" > README.md
git add README.md
git commit -m "first commit"
git branch -M gh-pages
git remote add origin https://github.com/gojimmypi/jekyll-tag-test2.git
git push -u origin gh-pages

```

I know this is my password, but I hafe 2FA enabled, and I never get a prompt:

```
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test2 (gh-pages) gojimmypi/jekyll-tag-test2

0 $  git push -u origin gh-pages
Username for 'https://github.com': gojimmypi
Password for 'https://gojimmypi@github.com':
remote: Invalid username or password.
fatal: Authentication failed for 'https://github.com/gojimmypi/jekyll-tag-test2.git/'
gojimmypi@DESKTOP(WSL): /mnt/c/workspace/jekyll-tag-test2 (gh-pages) gojimmypi/jekyll-tag-test2
```

Grr... thanks [SO](https://stackoverflow.com/questions/17659206/git-push-results-in-authentication-failed) I forgot I needed to
create an [access token](https://github.com/settings/tokens)

## Lesson Learned

So the lesson learned is that `jekyll new .` apparently needs to be the very first command in an empty directory, and pushed to a completely empty, new repo.

```
cd /mnt/c/workspace/
mkdir jekyll-tag-test4
cd jekyll-tag-test4
jekyll new .
git init
echo "hello world" > README.md
git add README.md
git commit -m "first commit"
git branch -M gh-pages
git remote add origin https://github.com/gojimmypi/jekyll-tag-test4.git
git push -u origin gh-pages

```


https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll