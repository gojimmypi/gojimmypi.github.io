---
layout: post
title: "Jekyll GitHub Pages Search"
description: "The first search result from 2015 was this little [gem](https://github.com/slashdotdash/jekyll-lunr-js-search/issues/82#issuecomment-156757982): >GitHub pages runs Jekyll in safe mode which disables all plugins. This is also noted at the [jekyllrb"
date: '2021-07-21'
author: gojimmypi
tags:
- Jekyll
- Blog
- Search
---

The first search result from 2015 was this little [gem](https://github.com/slashdotdash/jekyll-lunr-js-search/issues/82#issuecomment-156757982):
>GitHub pages runs Jekyll in safe mode which disables all plugins.
This is also noted at the [jekyllrb docs](https://jekyllrb.com/docs/plugins/installation/)

I tried the [jekyll-lunr-js-search](https://github.com/slashdotdash/jekyll-lunr-js-search) like this:
{% include code_header.html %}
```bash
gem install jekyll-lunr-js-search
gem install jquery-rails
```
I saw this output. Note on WSL thhere was a file warning, and a few other gems installed.\:
```
gojimmypi:/mnt/c/workspace/gojimmypi.github.io
$ gem install jekyll-lunr-js-search
Fetching: libv8-3.16.14.19-x86_64-linux.gem (100%)
Successfully installed libv8-3.16.14.19-x86_64-linux
Fetching: ref-2.0.0.gem (100%)
Successfully installed ref-2.0.0
Fetching: therubyracer-0.12.3.gem (100%)
Building native extensions. This could take a while...
/usr/lib/ruby/2.5.0/rubygems/ext/builder.rb:76: warning: Insecure world writable dir /home/gojimmypi/.local/bin in PATH, mode 040777
Successfully installed therubyracer-0.12.3
Fetching: jekyll-lunr-js-search-3.3.0.gem (100%)
Successfully installed jekyll-lunr-js-search-3.3.0
Parsing documentation for libv8-3.16.14.19-x86_64-linux
Installing ri documentation for libv8-3.16.14.19-x86_64-linux
Parsing documentation for ref-2.0.0
Installing ri documentation for ref-2.0.0
Parsing documentation for therubyracer-0.12.3
Installing ri documentation for therubyracer-0.12.3
Parsing documentation for jekyll-lunr-js-search-3.3.0
Installing ri documentation for jekyll-lunr-js-search-3.3.0
Done installing documentation for libv8, ref, therubyracer, jekyll-lunr-js-search after 2 seconds
4 gems installed
```

I saw this error:
```
$  bundle exec jekyll build --trace
Configuration file: /mnt/c/workspace/gojimmypi.github.io/_config.yml
Traceback (most recent call last):
        32: from /home/gojimmypi/gems/bin/jekyll:23:in `<main>'
        31: from /home/gojimmypi/gems/bin/jekyll:23:in `load'
        30: from /home/gojimmypi/gems/gems/jekyll-3.9.0/exe/jekyll:15:in `<top (required)>'
        29: from /var/lib/gems/2.5.0/gems/mercenary-0.3.6/lib/mercenary.rb:19:in `program'
        28: from /var/lib/gems/2.5.0/gems/mercenary-0.3.6/lib/mercenary/program.rb:42:in `go'
        27: from /var/lib/gems/2.5.0/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `execute'
        26: from /var/lib/gems/2.5.0/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `each'
        25: from /var/lib/gems/2.5.0/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `block in execute'
        24: from /home/gojimmypi/gems/gems/jekyll-3.9.0/lib/jekyll/commands/build.rb:18:in `block (2 levels) in init_with_program'
        23: from /home/gojimmypi/gems/gems/jekyll-3.9.0/lib/jekyll/commands/build.rb:30:in `process'
        22: from /home/gojimmypi/gems/gems/jekyll-3.9.0/lib/jekyll/commands/build.rb:30:in `new'
        21: from /home/gojimmypi/gems/gems/jekyll-3.9.0/lib/jekyll/site.rb:32:in `initialize'
        20: from /home/gojimmypi/gems/gems/jekyll-3.9.0/lib/jekyll/site.rb:117:in `setup'
        19: from /home/gojimmypi/gems/gems/jekyll-3.9.0/lib/jekyll/site.rb:294:in `instantiate_subclasses'
        18: from /home/gojimmypi/gems/gems/jekyll-3.9.0/lib/jekyll/site.rb:294:in `map'
        17: from /home/gojimmypi/gems/gems/jekyll-3.9.0/lib/jekyll/site.rb:295:in `block in instantiate_subclasses'
        16: from /home/gojimmypi/gems/gems/jekyll-3.9.0/lib/jekyll/site.rb:295:in `new'
        15: from /mnt/c/workspace/gojimmypi.github.io/_plugins/jekyll_lunr_js_search.rb:36:in `initialize'
        14: from /home/gojimmypi/gems/gems/execjs-2.7.0/lib/execjs/module.rb:27:in `compile'
        13: from /home/gojimmypi/gems/gems/execjs-2.7.0/lib/execjs/runtime.rb:57:in `compile'
        12: from /home/gojimmypi/gems/gems/execjs-2.7.0/lib/execjs/runtime.rb:57:in `new'
        11: from /home/gojimmypi/gems/gems/execjs-2.7.0/lib/execjs/external_runtime.rb:14:in `initialize'
        10: from /home/gojimmypi/gems/gems/execjs-2.7.0/lib/execjs/external_runtime.rb:39:in `exec'
         9: from Function.Module.runMain (module.js:693:10)
         8: from Function.Module._load (module.js:497:3)
         7: from tryModuleLoad (module.js:505:12)
         6: from Module.load (module.js:565:32)
         5: from Object.Module._extensions..js (module.js:663:10)
         4: from Module._compile (module.js:652:30)
         3: from Object.<anonymous> ((execjs):1:120)
         2: from slice ((execjs):1:102)
         1: from (execjs):173:14
(execjs):166:4: ReferenceError: jQuery is not defined (ExecJS::ProgramError)
```

Things then got worse:
```
gojimmypi:/mnt/c/workspace/gojimmypi.github.io
$ bundle exec jekyll serve --incremental
Bundler could not find compatible versions for gem "activesupport":
  In snapshot (Gemfile.lock):
    activesupport (= 6.0.3.6)

  In Gemfile:
    github-pages was resolved to 214, which depends on
      jekyll-mentions (= 1.6.0) was resolved to 1.6.0, which depends on
        html-pipeline (~> 2.3) was resolved to 2.14.0, which depends on
          activesupport (>= 2)

    jquery-rails was resolved to 4.4.0, which depends on
      railties (>= 4.2.0) was resolved to 6.1.4, which depends on
        activesupport (= 6.1.4)

Running `bundle update` will rebuild your snapshot from scratch, using only
the gems in your Gemfile, which may resolve the conflict.
gojimmypi:/mnt/c/workspace/gojimmypi.github.io
```
So, ok:
```
gojimmypi:/mnt/c/workspace/gojimmypi.github.io
$ bundle update
Fetching gem metadata from https://rubygems.org/...........
Fetching gem metadata from https://rubygems.org/.
Resolving dependencies.....
Fetching rake 13.0.6
Installing rake 13.0.6
Fetching concurrent-ruby 1.1.9 (was 1.1.8)
Installing concurrent-ruby 1.1.9 (was 1.1.8)
Using i18n 0.9.5
Using minitest 5.14.4
Using thread_safe 0.3.6
Using tzinfo 1.2.9
Using zeitwerk 2.4.2
Fetching activesupport 6.0.4 (was 6.0.3.6)
Installing activesupport 6.0.4 (was 6.0.3.6)
Using builder 3.2.4
Using erubi 1.10.0
Fetching mini_portile2 2.5.3
Installing mini_portile2 2.5.3
Using racc 1.5.2
Fetching nokogiri 1.11.7 (x86_64-linux) (was 1.11.3)
Installing nokogiri 1.11.7 (x86_64-linux) (was 1.11.3)
Using rails-dom-testing 2.0.3
Using crass 1.0.6
Using loofah 2.10.0
Using rails-html-sanitizer 1.3.0
Fetching actionview 6.0.4
Installing actionview 6.0.4
Using rack 2.2.3
Using rack-test 1.1.0
Fetching actionpack 6.0.4
Installing actionpack 6.0.4
Using public_suffix 4.0.6
Fetching addressable 2.8.0 (was 2.7.0)
Installing addressable 2.8.0 (was 2.7.0)
Using bundler 2.1.4
Using coffee-script-source 1.11.1
Fetching execjs 2.8.1 (was 2.7.0)
Installing execjs 2.8.1 (was 2.7.0)
Using coffee-script 2.4.1
Using colorator 1.1.0
Using ruby-enum 0.9.0
Using commonmarker 0.17.13
Using unf_ext 0.0.7.7
Using unf 0.1.4
Using simpleidn 0.2.1
Fetching dnsruby 1.61.7 (was 1.61.5)
Installing dnsruby 1.61.7 (was 1.61.5)
Using eventmachine 1.2.7
Using http_parser.rb 0.6.0
Using em-websocket 0.5.2
Fetching ffi 1.15.3 (was 1.15.0)
Installing ffi 1.15.3 (was 1.15.0) with native extensions
Fetching ethon 0.14.0 (was 0.13.0)
Installing ethon 0.14.0 (was 0.13.0)
Fetching faraday-em_http 1.0.0
Installing faraday-em_http 1.0.0
Fetching faraday-em_synchrony 1.0.0
Installing faraday-em_synchrony 1.0.0
Using faraday-excon 1.1.0
Fetching faraday-httpclient 1.0.1
Installing faraday-httpclient 1.0.1
Using faraday-net_http 1.0.1
Fetching faraday-net_http_persistent 1.2.0 (was 1.1.0)
Installing faraday-net_http_persistent 1.2.0 (was 1.1.0)
Fetching faraday-patron 1.0.0
Installing faraday-patron 1.0.0
Using multipart-post 2.1.1
Fetching ruby2_keywords 0.0.5 (was 0.0.4)
Installing ruby2_keywords 0.0.5 (was 0.0.4)
Fetching faraday 1.5.1 (was 1.4.1)
Installing faraday 1.5.1 (was 1.4.1)
Using forwardable-extended 2.6.0
Using gemoji 3.0.1
Using sawyer 0.8.2
Fetching octokit 4.21.0 (was 4.20.0)
Installing octokit 4.21.0 (was 4.20.0)
Using typhoeus 1.4.0
Fetching github-pages-health-check 1.17.2 (was 1.17.0)
Installing github-pages-health-check 1.17.2 (was 1.17.0)
Fetching rb-fsevent 0.11.0 (was 0.10.4)
Installing rb-fsevent 0.11.0 (was 0.10.4)
Using rb-inotify 0.10.1
Using sass-listen 4.0.0
Using sass 3.7.4
Using jekyll-sass-converter 1.5.2
Fetching listen 3.6.0 (was 3.5.1)
Installing listen 3.6.0 (was 3.5.1)
Using jekyll-watch 2.2.1
Using rexml 3.2.5
Using kramdown 2.3.1
Using liquid 4.0.3
Using mercenary 0.3.6
Using pathutil 0.16.2
Using rouge 3.26.0
Using safe_yaml 1.0.5
Using jekyll 3.9.0
Using jekyll-avatar 0.7.0
Using jekyll-coffeescript 1.1.1
Using jekyll-commonmark 1.3.1
Using jekyll-commonmark-ghpages 0.1.6
Using jekyll-default-layout 0.1.4
Using jekyll-feed 0.15.1
Using jekyll-gist 1.5.0
Using jekyll-github-metadata 2.13.0
Using html-pipeline 2.14.0
Using jekyll-mentions 1.6.0
Using jekyll-optional-front-matter 0.3.2
Using jekyll-paginate 1.1.0
Using jekyll-readme-index 0.3.0
Using jekyll-redirect-from 0.16.0
Using jekyll-relative-links 0.6.1
Fetching rubyzip 2.3.2 (was 2.3.0)
Installing rubyzip 2.3.2 (was 2.3.0)
Using jekyll-remote-theme 0.4.3
Using jekyll-seo-tag 2.7.1
Using jekyll-sitemap 1.4.0
Using jekyll-swiss 1.0.0
Using jekyll-theme-architect 0.1.1
Using jekyll-theme-cayman 0.1.1
Using jekyll-theme-dinky 0.1.1
Using jekyll-theme-hacker 0.1.2
Using jekyll-theme-leap-day 0.1.1
Using jekyll-theme-merlot 0.1.1
Using jekyll-theme-midnight 0.1.1
Using jekyll-theme-minimal 0.1.1
Using jekyll-theme-modernist 0.1.1
Using jekyll-theme-primer 0.5.4
Using jekyll-theme-slate 0.1.1
Using jekyll-theme-tactile 0.1.1
Using jekyll-theme-time-machine 0.1.1
Using jekyll-titles-from-headings 0.5.3
Using jemoji 0.12.0
Using kramdown-parser-gfm 1.1.0
Using minima 2.5.1
Using unicode-display_width 1.7.0
Using terminal-table 1.8.0
Fetching github-pages 215 (was 214)
Installing github-pages 215 (was 214)
Using jekyll-archives 2.2.1
Using method_source 1.0.0
Using thor 1.1.0
Fetching railties 6.0.4
Installing railties 6.0.4
Using jquery-rails 4.4.0
Bundle updated!
Post-install message from dnsruby:
Installing dnsruby...
  For issues and source code: https://github.com/alexdalitz/dnsruby
  For general discussion (please tell us how you use dnsruby): https://groups.google.com/forum/#!forum/dnsruby
Post-install message from rubyzip:
RubyZip 3.0 is coming!
**********************

The public API of some Rubyzip classes has been modernized to use named
parameters for optional arguments. Please check your usage of the
following classes:
  * `Zip::File`
  * `Zip::Entry`
  * `Zip::InputStream`
  * `Zip::OutputStream`

Please ensure that your Gemfiles and .gemspecs are suitably restrictive
to avoid an unexpected breakage when 3.0 is released (e.g. ~> 2.3.0).
See https://github.com/rubyzip/rubyzip for details. The Changelog also
lists other enhancements and bugfixes that have been implemented since
version 2.3.0.
gojimmypi:/mnt/c/workspace/gojimmypi.github.io
$
```
But no:
```
gojimmypi:/mnt/c/workspace/gojimmypi.github.io
$ bundle exec jekyll serve --incremental
Configuration file: /mnt/c/workspace/gojimmypi.github.io/_config.yml
jekyll 3.9.0 | Error:  ReferenceError: jQuery is not defined
gojimmypi:/mnt/c/workspace/gojimmypi.github.io
$
```




The install for `jquery-rails` also installed many dependencies:
```
$ gem install jquery-rails
Fetching: tzinfo-2.0.4.gem (100%)
Successfully installed tzinfo-2.0.4
Fetching: activesupport-6.1.4.gem (100%)
Successfully installed activesupport-6.1.4
Fetching: rack-2.2.3.gem (100%)
Successfully installed rack-2.2.3
Fetching: rack-test-1.1.0.gem (100%)
Successfully installed rack-test-1.1.0
Fetching: crass-1.0.6.gem (100%)
Successfully installed crass-1.0.6
Fetching: loofah-2.10.0.gem (100%)
Successfully installed loofah-2.10.0
Fetching: rails-html-sanitizer-1.3.0.gem (100%)
Successfully installed rails-html-sanitizer-1.3.0
Fetching: rails-dom-testing-2.0.3.gem (100%)
Successfully installed rails-dom-testing-2.0.3
Fetching: builder-3.2.4.gem (100%)
Successfully installed builder-3.2.4
Fetching: erubi-1.10.0.gem (100%)
Successfully installed erubi-1.10.0
Fetching: actionview-6.1.4.gem (100%)
Successfully installed actionview-6.1.4
Fetching: actionpack-6.1.4.gem (100%)
Successfully installed actionpack-6.1.4
Fetching: thor-1.1.0.gem (100%)
Successfully installed thor-1.1.0
Fetching: method_source-1.0.0.gem (100%)
Successfully installed method_source-1.0.0
Fetching: railties-6.1.4.gem (100%)
Successfully installed railties-6.1.4
Fetching: jquery-rails-4.4.0.gem (100%)
Successfully installed jquery-rails-4.4.0
Parsing documentation for tzinfo-2.0.4
Installing ri documentation for tzinfo-2.0.4
Parsing documentation for activesupport-6.1.4
Installing ri documentation for activesupport-6.1.4
Parsing documentation for rack-2.2.3
Installing ri documentation for rack-2.2.3
Parsing documentation for rack-test-1.1.0
Installing ri documentation for rack-test-1.1.0
Parsing documentation for crass-1.0.6
Installing ri documentation for crass-1.0.6
Parsing documentation for loofah-2.10.0
Installing ri documentation for loofah-2.10.0
Parsing documentation for rails-html-sanitizer-1.3.0
Installing ri documentation for rails-html-sanitizer-1.3.0
Parsing documentation for rails-dom-testing-2.0.3
Installing ri documentation for rails-dom-testing-2.0.3
Parsing documentation for builder-3.2.4
Installing ri documentation for builder-3.2.4
Parsing documentation for erubi-1.10.0
Installing ri documentation for erubi-1.10.0
Parsing documentation for actionview-6.1.4
Installing ri documentation for actionview-6.1.4
Parsing documentation for actionpack-6.1.4
Installing ri documentation for actionpack-6.1.4
Parsing documentation for thor-1.1.0
Installing ri documentation for thor-1.1.0
Parsing documentation for method_source-1.0.0
Installing ri documentation for method_source-1.0.0
Parsing documentation for railties-6.1.4
Installing ri documentation for railties-6.1.4
Parsing documentation for jquery-rails-4.4.0
Installing ri documentation for jquery-rails-4.4.0
Done installing documentation for tzinfo, activesupport, rack, rack-test, crass, loofah, rails-html-sanitizer, rails-dom-testing, builder, erubi, actionview, actionpack, thor, method_source, railties, jquery-rails after 30 seconds
16 gems installed
```