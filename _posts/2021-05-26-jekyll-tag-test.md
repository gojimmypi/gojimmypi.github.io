---
layout: post
title: "Jekyll Tag Test"
description: "Here are some tips in creating a new GitHub Pages Jekyll virtual directory First"
date: '2021-05-26'
author: gojimmypi
tags:
- Jekyll
- Blog
- Tag
---

Here are some tips in creating a new GitHub Pages Jekyll virtual directory

First, see [Creating a GitHub Pages site with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll).
My root GitHub page is located at [github.com/gojimmypi/gojimmypi.github.io](https://github.com/gojimmypi/gojimmypi.github.io)
and is hosted at [gojimmypi.github.io/](https://gojimmypi.github.io/)

Now, one could simply create a directory in the `gojimmypi.github.io` repo, but here I have notes on creating a _separate repo_ that will be that virtual subdirectory.

I created another completely blank repo called [jekyll-tag-test](https://github.com/gojimmypi/jekyll-tag-test). (no default files, _nothing_!)
See [prior blog](../jekyll-site-failures/) on some of the problems that could be encountered.


{% include code_header.html %}
```bash
cd /mnt/c/workspace/
mkdir jekyll-tag-test
cd jekyll-tag-test
jekyll new .
git init
echo "hello world" > README.md
git add README.md
git commit -m "first commit"
git branch -M gh-pages
git remote add origin https://github.com/gojimmypi/jekyll-tag-test.git
git push -u origin gh-pages
```

A bunch of files were created, `ls -w1`:

```
404.html
Gemfile
Gemfile.lock
README.md
_config.yml
_posts
about.markdown
index.markdown
```

along with a sample post `ls _posts -w1`
```
2021-05-26-welcome-to-jekyll.markdown
```

but of course only the `README.md` was pushed to the repo, above, with everything else waiting to be added and pushed:

```
0 $  git status
On branch gh-pages
Your branch is up to date with 'origin/gh-pages'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .gitignore
        .vs/
        404.html
        Gemfile
        Gemfile.lock
        _config.yml
        _posts/
        about.markdown
        index.markdown

nothing added to commit but untracked files present (use "git add" to track)
```
The default `_config.yml` file looks like this:


{% include code_header.html %}
```yml
# Welcome to Jekyll!
#
# This config file is meant for settings that affect your whole blog, values
# which you are expected to set up once and rarely edit after that. If you find
# yourself editing this file very often, consider using Jekyll's data files
# feature for the data you need to update frequently.
#
# For technical reasons, this file is *NOT* reloaded automatically when you use
# 'bundle exec jekyll serve'. If you change this file, please restart the server process.
#
# If you need help with YAML syntax, here are some quick references for you:
# https://learn-the-web.algonquindesign.ca/topics/markdown-yaml-cheat-sheet/#yaml
# https://learnxinyminutes.com/docs/yaml/
#
# Site settings
# These are used to personalize your new site. If you look in the HTML files,
# you will see them accessed via {{ site.title }}, {{ site.email }}, and so on.
# You can create any custom variable you would like, and they will be accessible
# in the templates via {{ site.myvariable }}.

title: Your awesome title
email: your-email@example.com
description: >- # this means to ignore newlines until "baseurl:"
  Write an awesome description for your new site here. You can edit this
  line in _config.yml. It will appear in your document head meta (for
  Google search results) and in your feed.xml site description.
baseurl: "" # the subpath of your site, e.g. /blog
url: "" # the base hostname & protocol for your site, e.g. http://example.com
twitter_username: jekyllrb
github_username:  jekyll

# Build settings
theme: minima
plugins:
  - jekyll-feed

# Exclude from processing.
# The following items will not be processed, by default.
# Any item listed under the `exclude:` key here will be automatically added to
# the internal "default list".
#
# Excluded items can be processed by explicitly listing the directories or
# their entries' file path in the `include:` list.
#
# exclude:
#   - .sass-cache/
#   - .jekyll-cache/
#   - gemfiles/
#   - Gemfile
#   - Gemfile.lock
#   - node_modules/
#   - vendor/bundle/
#   - vendor/cache/
#   - vendor/gems/
#   - vendor/ruby/
```

The default `gemfile` looks like this:

{% include code_header.html %}
```ruby
source "https://rubygems.org"
# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!
gem "jekyll", "~> 4.2.0"
# This is the default theme for new Jekyll sites. You may change this to anything you like.
gem "minima", "~> 2.5"
# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
# gem "github-pages", group: :jekyll_plugins
# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
```

Curiously, the locally generated page and the one at GitHub look completely different. It appears that some of the generated files locally
in the `_site` directory to not get generated at the GitHub web site. I have no idea why.
I ended up [asking on the community forum](https://github.community/t/github-page-jekyll-looks-very-different-from-local-from-the-very-beginning/10816/3).
Eventually I figured it out on my own and posted the [answer](https://github.community/t/github-page-jekyll-looks-very-different-from-local-from-the-very-beginning/10816/5?u=gojimmypi),
specifically that I needed to edit the `_config.yml` file:

{% include code_header.html %}
```yml
domain: gojimmypi.github.io      # if you want to force HTTPS, put down the domain without the http: e.g. example.com
url: https://gojimmypi.github.io # the base hostname & protocol for your site, e.g. http://example.com
baseurl: /jekyll-tag-test2/      # place folder name if site is served in subfolder
```

Although 4+ years old, [Long Qian's Jekyll Tags on Github Pages Blog](https://longqian.me/2017/02/09/github-jekyll-tag/) seems to still hold true:

> Github pages do not support customized Ruby plugins for Jekyll site. It is also true that the great jekyll-tagging is not one of Github default jekyll plugins.

There are no tag-related plugins on the [list of supported GitHub plugins](https://pages.github.com/versions/). The one [jekyll-seo-tag](https://rubygems.org/gems/jekyll-seo-tag)
is for metatag [Search Engine Optimization](https://github.com/jekyll/jekyll-seo-tag/blob/master/docs/usage.md#usage) based on `_config.yml` settings.
The [jekyll-paginate](https://github.com/jekyll/jekyll-paginate) is no longer under active development.

[![Gem Version](https://badge.fury.io/rb/jekyll-paginate.svg)](https://badge.fury.io/rb/jekyll-paginate)

## Links

- [Custom Plugins are Ignored](https://github.com/jekyll/jekyll/issues/5265)

https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll