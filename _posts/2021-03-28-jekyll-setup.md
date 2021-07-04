---
layout: post
title: "Jekyll Gridster Migration Notes"
date: 2021-03-28
---

The [gojimmypi gridster-jekyll-theme demo site](https://gojimmypi.github.io/gridster-jekyll-theme) is a submodule created from a [the gojimmypi fork](https://github.com/gojimmypi/gridster-jekyll-theme) of the [ickc Gridster/gridster-jekyll-theme](https://github.com/ickc/gridster-jekyll-theme), which itself was a fork from the [DigitalMindCH/gridster-jekyll-theme](DigitalMindCH/gridster-jekyll-theme)

The [gojimmypi preview](https://gojimmypi.github.io/gridster-jekyll-theme) contains a snapshot history of the [original DigitalMindCH/gridster-jekyll-theme](DigitalMindCH/gridster-jekyll-theme), along with ickc changes. 
This will be th eventual home for testing changes to https://gojimmypi.github.io

test 10:

{:.my-custom-class}
``` powershell
function Write-Stuff {
    Write-Output $Stuff
    }
Get-Process | Get-Member | Out-Host -Paging
```

For a new `jekyll` page, a file called `Gemfile` is needed in the root, like this:

{% include code_header.html %}
``` ruby
source 'https://rubygems.org'
gem 'github-pages'

group :jekyll_plugins do
  gem 'jekyll-archives'
end
```

To initialize:
{% include code_header.html %}
```bash
bundle install
bundle update github-pages
bundle exec jekyll serve

# see https://rubygems.org/gems/jekyll-paginate
gem install rouge
gem install rake
gem install rspec
gem install jekyll-paginate
```
Or better, see the build scripts:
```
./_build-development.sh
```

https://search.google.com/search-console

Edit `_config.yml` 
```yml
baseurl: /gridster-jekyll-theme #place folder name if site is served in subfolder   
```

Thanks Aleksandr Hovhannisyan for [tips on code segment copy](https://www.aleksandrhovhannisyan.com/blog/how-to-add-a-copy-to-clipboard-button-to-your-jekyll-blog/)
even though I [stumbled a bit](https://github.com/AleksandrHovhannisyan/aleksandrhovhannisyan.com/issues/35#issuecomment-812950323) at first.    

# Maintenance

```
bundle update
bundle update kramdown
```

# BareBones New Jekyll Page

```
 jekyll new .
```

## Troubleshooting

A message like this means Visual Studio decided to add a Carriage Return, and `bash` doesn't like those. See the `\r` in the `invalid option: --drafts\r`:
```
0 $  ./_build-development.sh

jekyll 3.9.0 | Error:  Whoops, we can't understand your command.
jekyll 3.9.0 | Error:  invalid option: --drafts
Did you mean?  drafts
jekyll 3.9.0 | Error:  Run your command again with the --help switch to see available options.
Traceback (most recent call last):
        4: from /home/gojimmypi/gems/bin/jekyll:23:in `<main>'
        3: from /home/gojimmypi/gems/bin/jekyll:23:in `load'
        2: from /home/gojimmypi/gems/gems/jekyll-3.9.0/exe/jekyll:15:in `<top (required)>'
        1: from /home/gojimmypi/gems/gems/mercenary-0.3.6/lib/mercenary.rb:19:in `program'
/home/gojimmypi/gems/gems/mercenary-0.3.6/lib/mercenary/program.rb:31:in `go': invalid option: --drafts\r (OptionParser::InvalidOption)
Did you mean?  drafts
```
To fix:
```
dos2unix ./_build-development.sh
```

see also: http://faviconit.com/en

http://jmcglone.com/guides/github-pages/

https://docs.github.com/en/github/working-with-github-pages/adding-content-to-your-github-pages-site-using-jekyll

https://www.colorzilla.com/gradient-editor/


https://www.aleksandrhovhannisyan.com/blog/how-to-add-a-copy-to-clipboard-button-to-your-jekyll-blog/