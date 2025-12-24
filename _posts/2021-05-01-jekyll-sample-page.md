---
layout: post
title: "Jekyll Sample Page Notes"
description: "A sample HTML file called [testpage2](https://github.com/gojimmypi/gridster-jekyll-theme/blob/gh-pages/testpage2.html) in the root: ``` --- layout: test_layout sidebar: false sitemap: false --- this is some test page content {% include test_include.html %}"
date: 2021-05-01
---

A sample HTML file called [testpage2](https://github.com/gojimmypi/gridster-jekyll-theme/blob/gh-pages/testpage2.html) in the root:

```
---
layout: test_layout
sidebar: false
sitemap: false
---
this is some test page content
{% include test_include.html %}
```

This will deploy to the [../testpage2/](../testpage2/) directory, and NOT `testpage2.html` as one might expect.

Note the layout called `test_layout`: this is found in the [_layouts](https://github.com/gojimmypi/gridster-jekyll-theme/tree/gh-pages/_layouts) directory 
and is called [test_layout.html](https://github.com/gojimmypi/gridster-jekyll-theme/blob/gh-pages/_layouts/test_layout.html)
