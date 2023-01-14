
This website is based on the [ickc fork](https://github.com/ickc/gridster-jekyll-theme) of abandoned
[DigitalMindCH/gridster-jekyll-theme](https://github.com/DigitalMindCH/gridster-jekyll-theme)
listed at [jekyllthemes.io](https://jekyllthemes.io/theme/gridster-jekyll-theme).

There's a [live demo of the original](https://gojimmypi.github.io/gridster-jekyll-original/) using a [copy of the code](https://github.com/gojimmypi/gridster-jekyll-original),
as well as the [WIP demo](https://gojimmypi.github.io/gridster-jekyll-theme/) from the [gojimmypi/gridster-jekyll-theme repo](https://github.com/gojimmypi/gridster-jekyll-theme).

A copy of the original documentation from the wayback machine can be found [here]({{site.baseurl}}/gridster_doc.html).

There were many problems that needed attention, as well as new features added:

- [Syntax Highlighting and Code Segments]({{site.baseurl}}/code-segments-andsyntax-higlighting/)
- [Pagination and Scrolling]({{site.baseurl}}/jekyll-pagination-and-scrolling/)
- [GitHub-corners links]({{site.baseurl}}/page-links-to-github-source/)
- [Dark Mode]({{site.baseurl}}/dark-mode/)
- [Migration from BlogSpot to GitHub Pages]({{site.baseurl}}/migration-from-blogspot-to-github-pages/)


{% assign this_github_root = site.github_baseurl  %}
{% assign this_github_filename = page.path %}
{% assign this_github_page = this_github_root | append: 'tree/gh-pages/' | append: this_github_filename %}
<!--
jekyll.environment   = [{{ jekyll.environment }}]
site.github_baseurl  = [{{ site.github_baseurl }}]
page.path            = [{{ page.path }}]
this_github_root     = [{{ this_github_root }}]
this_github_filename = [{{ this_github_filename }}]
this_github_page     = [{{ this_github_page }}]
-->

[//]: # (this is a comment)

This is the `_includes/about.md` file