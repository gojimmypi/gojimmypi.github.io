---
layout: post
title: "Syntax Highlighting and Code Segments"
description: "I'm using the defauly Jekyll sytax highlighter that works well, until it doesn't. Reminder that language tags are CASE SENSTIVE! ````md ```html good sample ``` and NOT: ```HTML"
date: '2021-05-23'
author: gojimmypi
tags:
- CSS
- Blog
- Jekyll
- Syntax highlighting
- Code Segment
---

I'm using the defauly Jekyll sytax highlighter that works well, until it doesn't. Reminder that language tags
are CASE SENSTIVE!

````md
```html
<div>good sample</div>
```
and NOT:

```HTML
<div>bad sample</div>
```
````

All sorts of things seem to go wrong when the language spec, in the above example `HTML` is not lower case.


Thanks Dan Vega for the tip on [How to escape a backtic within a code block in markdown](https://www.danvega.dev/blog/2019/05/31/escape-backtick-markdown/):

> _"The first solution to our problem is to use more backticks. You will need to place 4 of them around your code block that contains 3."_

Next, when using mardown `md` files, note that the liquid `include code_header.html` needs to be manually included. It is missing above, and present below:

{% include code_header.html %}
````md
{% raw %}{% include code_header.html %}{% endraw %}
```html
<div>good sample</div>
```
````

My copy-to-clipboard feature was implemented with thanks once again toAleksandr Hovhannisyan for his 
[How to Add a Copy-to-Clipboard Button to Jekyll](https://www.aleksandrhovhannisyan.com/blog/how-to-add-a-copy-to-clipboard-button-to-your-jekyll-blog/) blog.

