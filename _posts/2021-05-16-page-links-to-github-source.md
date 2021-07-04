---
layout: post
title: "Page Links to GitHub Source"
date: '2021-05-16'
author: gojimmypi
tags:
- CSS
- Blog
- Jekyll
- Link
---
<style>
.github-corner:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
right: 0px;
    top: 0px;
    z-index: 1;
    border-bottom: 0px;
    text-decoration: none;
}

@keyframes octocat-wave {
    0% {
        transform: rotate(0deg);
    }

    20% {
        transform: rotate(-25deg);
    }

    40% {
        transform: rotate(10deg);
    }

    60% {
        transform: rotate(-25deg);
    }

    80% {
        transform: rotate(10deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

@media (max-width: 500px) {
    .github-corner:hover .octo-arm {
        animation: none;
    }

    .github-corner .octo-arm {
        animation: octocat-wave 560ms ease-in-out;
    }
}
</style>


I was inspired by the little icon on the <a href="https://jscroll.com/#/usage">jscroll site</a>. I'd like to have a similar link on
all of my pages that links directly to the respective source on GitHub.

All by itself, it is just an SVG file inside of an anchor tag. I've wrapped it in a 120px div to keep it from filling the canvas:

<div style="width:120px; text-align:center;" >
<a href="https://github.com/pklauzinski/jscroll" target="_blank" class="github-corner" aria-label="View source on Github"><svg viewBox="0 0 250 250" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
</div>

The source code looks like this:

{% include code_header.html %}
```html
<a href="https://github.com/pklauzinski/jscroll" 
	target="_blank" 
	class="github-corner" 
	aria-label="View source on Github">
	<svg viewBox="0 0 250 250" aria-hidden="true">
		<path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
		<path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" 
			fill="currentColor" 
			style="transform-origin: 130px 106px;" 
			class="octo-arm">
		</path>
		<path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" 
			fill="currentColor" 
			class="octo-body">
		</path>
	</svg>
</a>
```

One of the first things to notice is the `github-corner` CSS class. So instead of fully reverse engineering it, 
a quick [google search for "github-corner" css](https://www.google.com/search?q=%22github-corner%22+css&oq=%22github-corner%22+css) resulted 
in of course an entire repo for [github-corners](https://github.com/tholman/github-corners) by Tim Holman.

That's just excellent. I really didn't want to spend the morning trying to figure it all out. So Tim's repo, there's a [CSS style](https://github.com/tholman/github-corners/blob/master/css/styles.css)
that looks like this (and I included on this page) that does the little octo-wave:

{% include code_header.html %}
``` css
<style>
.github-corner:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
}

@keyframes octocat-wave {
    0% {
        transform: rotate(0deg);
    }

    20% {
        transform: rotate(-25deg);
    }

    40% {
        transform: rotate(10deg);
    }

    60% {
        transform: rotate(-25deg);
    }

    80% {
        transform: rotate(10deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

@media (max-width: 500px) {
    .github-corner:hover .octo-arm {
        animation: none;
    }

    .github-corner .octo-arm {
        animation: octocat-wave 560ms ease-in-out;
    }
}
</style>
```

The source I found on Tim's page was a bit different from my original ispration from the jscroll site, as it includes the style in the anchor:

{% include code_header.html %}
``` html
<a href="https://your-url" 
    class="github-corner" 
    aria-label="View source on GitHub">
    <svg width="80" height="80" 
        viewBox="0 0 250 250" 
        style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" 
        aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" 
            fill="currentColor" 
            style="transform-origin: 130px 106px;" 
            class="octo-arm">
        </path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" 
            fill="currentColor" 
            class="octo-body">
        </path>
    </svg>
</a>
<style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
```

The only thing remaining is positioning and links. [This question](https://stackoverflow.com/questions/13243469/how-can-a-jekyll-page-access-its-filename) is relevant:

> _My goal is to create links from any published jekyll page back to its location on Github._

Key here is the `{% raw  %}{{page.path}}{% endraw %}` value. Here's what I included on my [github corner include file](https://github.com/gojimmypi/gridster-jekyll-theme/blob/gh-pages/_include/github-corner.html):


{% include code_header.html %}
```liquid
{% raw  %}
{% assign this_github_root = site.github_baseurl | append: '/' | replace: '//', '/' %}
{% assign this_github_filename = page.path %}
{% assign this_github_page = this_github_root | append: 'tree/gh-pages/' | append: this_github_filename %}

<a href="{{ this_github_page }}"
  ...etc
{% endraw %}
```

Then on respective link, we'll have the `<a href=''` value be the dynamic `{% raw  %}{{ this_github_page }}{% endraw %}` name. 
(see [How to escape liquid template tags](https://stackoverflow.com/questions/3426182/how-to-escape-liquid-template-tags))
