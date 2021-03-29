---
title:	Gridster Documentation
sidebar_toc:	true
---

This documentation are from the original Gridster. Since the source is not available, I convert it to Markdown file by pandoc:

```shell
pandoc -t markdown_github --normalize -s --wrap=none --atx-headers -o ~/Downloads/temp.md http://gridster.digitalmind.ch/documentation/
```

Some of the features from the original Grdster documentation isn't here. e.g. the links to different sections. However you can expand the Table of Contents on the sidebar to navigate to different sections.

{% raw %}

# Gridster - An Introduction

Gridster is a powerful jekyll theme.

We don’t want to babble about how awesome jekyll is. You already know that. In this documentation we will introduce you to the world of Gridster. A world in which you have all the functionality you might have used in a previous WordPress blog, or dreamt of when using Blogger. Jekyll is fast. Like really fast. Lightning kind of fast in comparison to some of those bloated sites, because it’s basically just static HTML. Fast, secure and really convenient, as there is no annoying WYSIWYG editor, that pretends to give you a sleek layout but actually is some really messed up code. My fellow HTML friends will know what I’m talking about. Jekyll posts are written in markdown. It feels natural and produces some pretty nice (and correct!) code.

Gridster comes with a variety of different post types, which make it suitable for a lot of different sites. It is easy to use once you set up everything and all you have to do is write some markdown, run a max of three grunt commands and you are good to go. Also it’s in the Material Design and you can choose from 5(!) different layouts for each post, static page and index page.

Let us guide you through the basic setup.

# Dependences

Jekyll is awesome, but it has quite a few requirements.

Before going on, you will need to install a few things. We’ll just link you to the docs, because they do a pretty good job, most of the time.

1.  **Git**
    if you plan on using this theme on your own server and don’t like version control (we sincerely hope that is not the case, version control is awesome!) this is not required:
    [Installing Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    You also wanna [sign up on GitHub](https://github.com/), if you want to host there.
2.  **Sass**
    Sass is the preprocessor of our choice. We write all of our stylesheets in Sass. Because it’s fast, sassy and awesome!
    [Installing Sass](http://sass-lang.com/install)
3.  **Grunt**
    Grunt makes our life easier. We use it to serve our jekyll, minify and concatenate our javascript, compile our Sass, prefix the CSS, minimize and crop images and deploy the site to GitHub. “Making our life easier” not even closely describes how vital the job is, grunt carries out for us. You’ll see.
    [Installing Grunt](http://gruntjs.com/getting-started)
4.  **jekyll**
    Of course, nothing could happen without the star of the show.
    [Installing jekyll](http://jekyllrb.com/docs/installation/)

In order for Sass, grunt and jekyll to work you need [**Ruby**](https://www.ruby-lang.org/en/downloads/), [**RubyGems**](https://rubygems.org/pages/download) as well as [**NodeJS**](http://nodejs.org/) installed.

For the liverefresh, you will need livereload for your browser of choice. ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/livereload/?src=userprofile) • [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) if your browser of choice is something other than that: make a new choice, a better one (okay, [Opera](https://addons.opera.com/de/extensions/details/livereload-201-beta/?display=en) is allowed as well…))

Once you’ve mastered all of these installations, the rest will be a piece of cake.

# Set Up

As soon as you have all of the dependences installed, you are ready to set up your site.

Create a new folder and copy our demo site into this folder. Open the folder in your favorite editor (ours is [Brackets](http://brackets.io/)) to check out the files and make the necessary changes.

Other than the editor you will need a browser and a terminal. Don’t be scared, the terminal is here to help you.

## Grunt

We use grunt with Gridster, because it saves us a lot of tedious steps. As you can see, the theme you got comes with a `gruntfile.js`. So other than installing grunt, you only have to execute one command to get it up and running.

To install all of the node modules, navigate into the folder and run the following command:

``` highlight
npm install
```

In the following section we’ll quickly go over the three main grunt tasks we’ve created and what each of them does.

``` highlight
grunt serve
```

This command will get a server running. Basically it executes the `jekyll serve` command.

So, to get the site running, you will need to open a terminal window in your website folder location and type this command. The server will start and you will be able to see the page at <http://localhost:4000>

The terminal window you use, will then be blocked for typing. You will need to open another one for the next command. (tip: if you are on a windows machine and hate to retype your file path, add `start` before the grunt command and it will be executed in a new window, without affecting the current cmd)

``` highlight
grunt
```

This is the default task, which is the watch task.

Once you got your server up and running, you can start grunt. It will watch over your files for changes and make sure, that your site will always be up to date. With liveReload enabled your browser also updates, as soon as the site is rebuilt. Can we have a hip hip hooray for not having to vigorously hit the F5 button anymore? (Hip Hip - HORRAY!)

``` highlight
grunt deploy
```

If you are not hosting on a Git Server or decide to run Gridster without plugins you won’t need this task. It takes care of deployment for a site hosted on GitHub with plugins. We’ll come to that later<sup>\[[7.4](#yp)\]</sup>.

## Configuration

Okay, now enough of installations and setups, let’s get working on your site.

We start off with one of the most important files in the theme - if not *the* most important file. `_config.yml`

This file sets all of the jekyll configurations and global variables.

### Settings

In the following section we’ll go over the variables settings.

First of all you want to set the `name` of your site, as well as the `description`, kinda like your tagline.

Then there are `url` and `baseurl`. The `url` is mostly just for the rss feed, so just add the url here for that. The `baseurl` is used only if you’re site is in a subfolder. Then you want to add this folder name in the `baseurl`.
So for example, if your github username is `user` and the project this site lives in is called `project` you would fill the variables as follows (the address of the site would then be: http://user.github.io/project )

``` highlight
url: http://user.github.io
baseurl: /project
```

**Note**: if you set up a custom domain, you will need to adjust this setting to your custom domain, not the underlying GitHub address.

**Some of the variables with their default settings and comments explained**

``` highlight
name: Gridster # place site name
description: the material experience for jekyll # put slogan here
destination: jekyllbuild #destination folder, not the default _site, because grunt has problems with sites starting with an underscore
url: #place url
baseurl: #place folder name if site is served in subfolder
permalink: /:title/ # permalink structure
paginate: 8 # how many items are shown on the index page
paginate_path: /page/:num/ # pagination url structure
gems: [jekyll-paginate]
author_title_prefix: 'Posted by ' # title for the author pages (this is followed by the author name)
author_default_avatar: /profile-pic.jpg #default profile picture for authors when there is no author image
# default settings
encoding: utf-8
defaults:
  -
    scope:
      path: ""
      type: "posts"
    values:
      layout: "post-material-sidebar-left"
      type: "standard"
      homedisplay: "featimg"
```

Also, gridster comes with the possibility to use infinite scroll or pagination on the home page.
By default infinite scroll is activated. If you want to use the pagination, just find the variable for the infinite scroll within the config and change the value from `true` to `false`

``` highlight
infinite_scroll: true
```

### Directories

These variables handle the folder structure.

The `media_folder` is the place where all of the compressed images are stored (this will be handled by grunt) (featured images, galleries etc.)

The other variables handle URLs. The folders in which tags, categories and author pages will be placed.

``` highlight
tag_dir: /tag
category_dir: /category
author_dir: /author
media_folder: /media/compressed
```

### Social Media

This is where you can place all of your social media accounts. If you remove the variable, it will vanish from the main menu. Just place the URLs here and the social media icons in the navigation will take you to the provided link when clicked.

``` highlight
tumblr: "#"
pinterest: "#"
instagram: "#"
twitter: "#"
facebook: "#"
youtube: "#"
vimeo: "#"
soundcloud: "#"
```

### Authors

This setting is only relevant for a site with multiple authors. If you don’t want to have any author information, just make sure not to put any author variable in your front matter and nothing should show up.

For everyone else, here is how you set up multiple authors.

First you want to open `_data/authors.yml`

This is where you set all of the information. There are quite a few available variables that will be used on the author pages in the author box.

All of them are optional; except the id. This is what you want to use within the post front matter, to assign a post to an author.

So in your post file it would look like this (of course replace id with the actual author id)

``` highlight
---
author: id
---
```

You want to make sure that the profile picture is placed within the `img`-folder, so grunt can compress it.

So the default variables for authors are:

``` highlight
  id: someone
  name: Some Person
  avatar: /profile-pic.jpg
  bio: this is some more information about the author.
  facebook: https://www.facebook.com/someone
  twitter: https://twitter.com/someone
  instagram: http://instagram.com/someone
  email: someone@something.com
```

# Customization

Of course customizing is endless, especially since jekyll is HTML and not PHP and people like to fiddle with HTML a lot more. We love HTML for its simplicity and we always look forward to playing with it.

So yeah, we won’t go too much into detail on how much you can actually make gridster look different, because we like the way we designed it. But still, changing colors and adjusting the logo obviously is something you might want to change, and of course we won’t interfere with that.

## Header

The header is like a business card for your website. So we totally get that you want to add your own logo.

We are big fans of SVG, not because it is so scalable, but also because it is a lot easier to make your site responsive.

If your different versions are contained within the same format you can just remove a path with media queries. (There’s a really good post about this on codrops: [Making SVGs Responsive with CSS](http://tympanus.net/codrops/2014/08/19/making-svgs-responsive-with-css/).)

If you’re logo works like ours and relies on different viewBoxes, just do it like us, throw all three svgs in there and display it with media queries.

We are not going to cover how you should go about creating your logo. If you just want to use an image or headings, by all means, go ahead!

But this is about where to do your changes.

The main place to start would be `_includes/header.html`, which is the basic outline of the upper header part, since technically the whole header contains the navbar as well.
You can see that there are three includes that are our three different logo SVG’s. We like to keep them all separate, because code is always easier to handle if it’s shorter. (and if you know what a complex SVG looks like, you know how quickly this stuff get’s out of hand.) We also like to extract our styling into the actual Sass, so that we save a few lines.

**Clean up your SVGs!** we wrote this in bold, because it is something that we would really ,definitely recommend. If you see what horror illustrator or inkscape can spit out, Freddy Krüger is a teddy bear in comparison. In inkscape there is the option to save as plain svg and in illustrator you can turn off the editing capabilities. Both options get rid of a lot junk the web does not need (make sure to still save a version that you can edit.) Then just make sure to remove all of the styletags and add classes (especially for the paths that do use the same styles.) Also check that height and width attributes are gone and the viewBox is set.

All of those styles can be placed within `sass/partials/components/_logo.scss`.

For the right sizing, you need to adjust the padding hack, to your viewBox. So get the two last values of the viewBox and set them within `sass/partials/layout/_header.scss` in the padding hack mixin:

``` highlight
.logo {
    @include paddinghack(100%, 127.27984, 28.97019, 'svg'); // use your logo dimensions here
```

Within the header file there are a few other steps to consider as well. You might need to adjust the classes of your elements and the media query breakpoints. Just read through it, we did add comments to make it more understandable.

## Sidebar

Gridster comes with two different sidebars. The Material sidebar and the classic sidebar. Depending on what layout you use, one either one of the sidebars will be used. Both files can be found within the `_includes`folder. `material-sidebar.html` and `classic-sidebar.html`

Both allow you to place whatever content you want.

Widgets follow some simple rules to process basic markup in order that styles get applied correctly

The HTML structure for a widget looks like this:

``` highlight
<div class="widget">
    <h3 class="title">Widget Title</h3>
    <!-- your widget content -->
</div>
```

Place your title in the h3 tag and place your content underneath your title. You can include whatever HTML you like.

## Code

So, now your favorite piece: The code. Of course you can customize it.
Change whatever you like. The basic structure is simple.

We have an index layout that is used for the home page, category pages, tag pages and author pages. Category, author and tag layouts are integrated as extensions of the index page with a few restrictions. They don’t have pagination the way the home pages do, because those pages come with plugins to modify the amount of posts rendered and jekyll’s pagination feature is restricted to the full set of posts only.

There is one general `article_index` include, that styles the articles for the index pages. So we use this style across all of these sites. If you would like something a little shorter, which would make sense if you have something around 100 posts in a category, you might want to change that.

We wrote an alternative `article_index`, which displays just the title and date.

You do need to make two small adjustments if you want to use it. Replace the include.

Open either `_layouts/author_index.html`, `_layouts/category_index.html` or `_layouts/tag_index.html` (or the main `index.html` file for that matter, if you want your homepage short as well) and find the article loop with the include:

``` highlight
{% include article_index.html %}
```

replace this with

``` highlight
{% include article_index_short.html %}
```

This adaption will result in the short article index version.

# Add content

As soon as you are happy with how the site looks like, you can start to focus on what makes for a good website: The content!

In this section we’ll guide you through the process of filling pages and adding posts.

Gridster comes with all these fancy post types that are very useful and make for a pretty multimedia site within minutes.

Read on and see how easy it can be to set up your content with Gridster.

## Pages

There are two different ways of adding content to your site. The static one is adding content as a page.

Pages can be html or markdown documents that get placed in the root directory. If you don’t like file-endings in your URLs, create a folder and an index-file in there. The URL will then be the folder name.

### Layouts

For the pages you also use the classic jekyll front matter.

Here is what it looks like for one of our pages

``` highlight
---
layout: page-full
featimg: 6.jpg
title: Page
---
```

The `layout` options are `page-full`, `page-classic-sidebar-right`, `page-classic-sidebar-left`, `page-material-sidebar-right` and `page-material-sidebar-left`.

The title is self-explanatory. Add a title if you want your page to have like - a name (no anonymous pages out there guys, please!). You might want to make it relatable to the folder name as well. Just a tip.

The `featimg` variable is for the featured image. It will be added above the content (and title). The image has to be within the `img`-folder.

And then just go about adding your content underneath the front matter. And if it is just for writing, we highly recommend using markdown since it’s much easier and more fun to write in markdown than having to write a lot of HTML-tags for paragraphs.

### Archives

Archives are usually something you want to put in a page. At least we do.

So while we were creating the page layouts, we also created two includes that help you create archive pages.

To create an archive page, you would complete the same steps as you do when you make a page. Then just add one of the includes within your content.

There are two different archive possibilities. One of them sorts the posts by month, the other one by year. It will mostly depend on your preference (or on how many posts you write) which preference you will want use.

They do work pretty similarly, though.

To use the archive page, just paste the include into the content section. Archives can be placed in pages or posts.

For an archive by month:

``` highlight
{% include monthly_archive.html %}
```

and the archive by year:

``` highlight
{% include yearly_archive.html %}
```

## Posts

This is where your blog receives the Frankenstein lightning shocks and starts living.

A new post is created within the `_posts` folder and has to follow a specific naming scheme.

``` highlight
YEAR-MONTH-DAY-title.FILEFORMAT

// example: 
2015-01-01-happy-new-year.md
```

It starts with the front-matter, where most of the magic for our post types happen.

Every post has a few variable requirements. Some variables need to be integrated, some can be integrated and some are type specific. This section will go over every variable:

**defaults**

``` highlight
---
layout: post-material-sidebar-left
type: standard
homedisplay: featimg
---
```

These are the variables that shouldn’t change too much (you can change the defaults in the `_config.yml`-file <sup>\[[3.2.1](#sets)\]</sup>). \]). The layout by default is with the Material sidebar, the post type will be standard and usually the featured image will be displayed instead of an iFrame. These three includes are part of the required variables.

Layout options are: `post-full`, `post-material-sidebar-left`, `post-material-sidebar-right`, `post-classic-sidebar-left`, `post-classic-sidebar-right`.

**required variables**

``` highlight
---
layout: post-full
type: standard
homedisplay: featimg
featimg: 1.jpg # (not required)
author: someone # leave this out if you don't want to work with authors, otherwise use author id as set within _data/authors.yml
title: post title # this is important
description: describing the post # this will be used in the meta-tag. SEO-wise pretty important
tags: [tag1, tag2, tag3] # tags, leave them out if you don't work with tags
category: [category] # categories, leave out if you don't work with categories
---
```

As you can see here there are a few variables that are not as *demanded* as others. They are variables, that we’ve integrated to unlock Gridster’s full capacity. If you don’t want to use plugins, you obviously would leave out categories, tags and the author. The description is good for any Google bots (SEO), but you won’t see anything and the featured image is just there if you want to include one.

### Standard

The standard post type is just for plain posts.

It does not come with the “featured section” that we use with other post-types, which means the featured image is not placed above the content but after the post title.

A standard front matter would look like this:

**Note**: The defaults are already set, so you don’t have to include them a second time.

``` highlight
---
featimg: 2.jpg
author: someone
title: standard post
description: describing the post
tags: [tag1, tag2, tag3]
category: [category]
---
```

### Image

For an image post, the post type needs to be changed.

It looks just slightly different than the standard post. The featured image is above the content since that is the main part of an image post.

For the image post type, obviously `featimg` becomes a requirement.

Image post type front matter:

``` highlight
---
type: image
featimg: 3.jpg
author: someone
title: image post
description: describing the post
tags: [tag1, tag2, tag3]
category: [category]
---
```

### Gallery

A gallery does require a bit more work. The thing we do here is similar to a WordPress shortcode.

We define images and titles within the front-matter and do an include in the end.

So in the front-matter you would do something like this:

``` highlight
---
type: gallery
featimg: gallery-5.jpg
title: Gallery
tags: [gallery, image]
category: [image]
gallery:
    - images:
      - filename: gallery-1.jpg
        alttext: Bloom Flat
      - filename: gallery-2.jpg
        alttext: Bloom
      - filename: gallery-3.jpg
        alttext: Blossom in a Star
      - filename: gallery-4.jpg
        alttext: Blossom
      - filename: gallery-5.jpg
        alttext: Bubbly Bloom
      - filename: gallery-6.jpg
        alttext: Rays of Gold
      - filename: gallery-7.jpg
        alttext: Exotic
      - filename: gallery-8.jpg
        alttext: Filled out
---
```

There are two different options how to include the gallery. The first is a scroll-through, that places all of the images at full-width within the content. The second creates a box with thumbnails, which reveals a lightbox when clicked on and can be navigated by touch, arrow-keys or plain old mouse commands.

In the content section you will need to integrate one of the includes:

**Scroll-Through:**

``` highlight
{% include gallery.html %}
```

**Lightbox:**

``` highlight
{% include gallery_lightbox.html %}
```

### Vimeo

Creating a Vimeo video post is quite simple.

It is one of the three post types, that allows for the iFrame to be on the index pages. If you decide to go with the Vimeo post type, you won’t need to include a featured image, as it will not be displayed anywhere.

The type has to be Vimeo and then just include the embed code as well as the featured image `homedisplay: iframe`

``` highlight
---
type: vimeo
vimeo-embed: <iframe src="//player.vimeo.com/video/118589137" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
homedisplay: iframe
author: someone
title: Vimeo
description: describing the post
tags: [tag1, tag2, tag3]
category: [category]
---
```

### YouTube

YouTube is a little bit different from Vimeo. Since the URL structure is always the same you don’t need to add the entire embed code.

Find the video ID of your video (the part of the URL after `/watch?v=VIDEOID`) and put that in the front matter.

also use homedisplay to display the iFrame, otherwise set the featured image as you do it with the other post types.

``` highlight
---
type: youtube
yt-video-id: e0RFirBWQsE
author: someone
title: YouTube
description: describing the post
tags: [tag1, tag2, tag3]
category: [category]
---
```

### Audio

An audio post is technically the same as a Vimeo post. You just place the iframe embed code in the front matter.

The front matter follows the same rules:

``` highlight
---
type: audio
audio-embed: <iframe width=100% height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188464611&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>
homedisplay: iframe
author: someone
title: Audio
description: describing the post
tags: [tag1, tag2, tag3]
category: [category]
---
```

## Navigation

After your pages are set, you might as well just go ahead and work on your navigation.

The menu is a responsive off-canvas menu. It offers a two-level dropdown menu. Since the parent elements work as triggers, you will not be able to link them, so make sure your parent element’s `href` is pointing to a hashtag.

Otherwise it’s just your basic list.

Keep the toggle-links for the functionality to work.

The navigation is located in `_includes/nav.html`

We went with the static navigation, but feel free to create a dynamic one. There are tutorials out there that go over the steps. Just type the question into the search engine of your choice.

# Additional Functionality

Jekyll is fantastic, but it comes with a few restrictions.

First and probably biggest bummer of all is the lack of a comment function.

But it’s not that bad, because there are possibilities to include comments. One of the most popular comment systems, is actually just embedded through HTML and that’s the one we will use. We’re looking at you Disqus.

The other thing is a search function. If you don’t feel the need of integrating a search function that users actually utilize, just leave it out. If you think a search function is a necessity, there are different options you can use.

## Comment Form

The comment system that’s most popular is [disqus](https://disqus.com/).

You need to create an account and register your site.

Then access the universal code and create a new include.

Then include it in the layouts you want to use it with.

IT’s that simple.

## Search function

When it comes to search functions, there are several different options and opinions. Some people don’t like certain search functions, others love them, etc.

We did include a dummy search form, jut for design purposes in case you want to include a search function.

There are possibilities floating around on the internet using javascript. Another option would be to create a Google custom search.

We don’t set any rules or recommendations. It is totally up to you what you want to use.

Also, the world of inter webs provides much better instructions on that matter than we could ever write. So please Google it.

# Deployment

When you are ready to go live, you have to think about a few things.

We’re gonna touch upon some of them, help you with your decision and assist you with the step into the public.

## GitHub or Server?

[GitHub pages](https://pages.github.com/) is free and it runs jekyll. Perfect. But of course you might not want to choose GitHub to host your site on.

A reason for that might be, that you own a server or don’t mind paying. Or you just don’t want your page to be open sourced.

But GitHub has a downside as well. It runs jekyll in save-mode. This means no plugins. We do use plugins in Gridster for category pages, tag pages and author pages. If you don’t want to use that, GitHub might work as a CMS for you. We did include support for [prose.io](http://prose.io), which kinda turns it all into a pretty CMS, that looks definitely better than Blogger or WordPress.

If you want to use plugins, you still can host your site on GitHub but you will need to compile the site manually. It actually would take even more steps than just regenerating, quite a few git commands are involved. But grunt is here to save the day and you can still enjoy free hosting. It just needs a bit more time and is a littlebit less flexible.

But if you are like us and never leave the house without your laptop anyway, you’re just as flexible as can be.

If you choose the server you will just need to compile your site and host the `_site` folder like you would do it with any other HTML site.

If you decide to go with GitHub hosting, read on.

## Plugins: Yes or No?

It is a decision, an endless back and forth. Or maybe not?

If you want to have several people contributing on the site with plugins you will have to act as a moderator. So people can create posts on GitHub, but in order for the blog posts to go live, you will have to pull the changes, rebuild the site with grunt and push the live site back up with grunt deploy. If that is not a step you want to take, you might just sacrifice the plugins (no author pages, no category pages, no tag pages) and have new posts going live automatically.

There are a lot of pros and cons for every method, and the decision is personal. Even if you go without the plugins, the site will still have a lot of nice features. And the archive will still work.

After you’ve made a decision, you are ready to deploy.

If you decided to go with the plugins, skip the next section. If you go without plugins, skip the section after the next one.

## Deploy on GitHub Without Plugins

Deployment without plugins is actually really easy.

Grab the URL you will be hosting your site on as well as the subfolder. If you are going to host your site on GitHub, set the two variables `url` and `baseurl` in the `_config.yml` file.

Put all of the files not listed below (especially the `node_modules` and `_site` folders) to your `.gitignore`, because you definitely won’t need those up there. If you don’t use plugins you just want to push the following files to GitHub (file in brackets means these might have changed or you might not need them)

``` highlight
├── _data/
│   └── galleries.yml 
│
├── _includes
│   ├── article_index.html
│   ├── ( article_index_short.html ) // you might not need it, with no plugins
│   ├── footer.html
│   ├── ( full.html )
│   ├── gallery.html
│   ├── gallery_lightbox.html
│   ├── head.html
│   ├── header.html
│   ├── ( icon.html )
│   ├── ( logo.html )
│   ├── monthly_archive.html
│   ├── nav.html
│   ├── sidebar.html
│   ├── ( svg.html )
│   └── yearly_archive.html
│
├── _layouts
│   ├── index.html
│   ├── ( index_alt.html ) // again, you only need it for the short index
│   ├── page.html
│   ├── page_full.html
│   ├── post.html
│   └── post_full.html
│
├── _posts
│   └── // all your posts
│
├── css
│   ├── classic.css
│   ├── grid.css
│   └── main.css
│
├── fonts
│   └── // all of the font files
│
├── img
│   └── // all your images
│
├── js
│   └── build/
│       └── global.min.js 
│ 
├── _config.yml
│
├── feed.xml
│
├── index.html
│
├── pagename // symbolically for all your static pages
│   └── index.md
│
├── .gitignore
└── ( README.md )
```

When that is done, GitHub will run jekyll and serve the resulting site under the URL.

If you want to publish a new post, just create a new one in the `_posts` directory and push. Or just log into GitHub and write it directly on there.

This will work for new content

If you want to change something in your design though (new js stuff, new stylesheets, everything grunt does for you) you will have to pull it all down and run grunt again, to compile sass, run autoprefixer and uglify and merge all of the script files.

## Deploy with Plugins

If you want to deploy with plugins, you will need to follow a few steps.

The basic idea is to push the built `_site` folder with all of your other source files and then copy that site onto the main branch that GitHub will serve. So in case you use the user-repository: username.github.io, you want to create a branch called source and push all of the things there. The site will then be copied into the master branch.

For every other repository, a branch called `gh-pages` is required.

If the site will be located within a subfolder, make sure to add baseurl and url (set url in any case) for the site in the `_config.yml` file.

Now for deployment.

You might not want to push your `node_modules` folder, because it takes a lot of space and is not relevant, even if people want to check out the source.

But make sure that *under no circumstances*, your `_site` folder ends up on your `.gitignore` file, because you need to build it yourself, as the jekyll GitHub runs, would end up being a save build, so no plugins.

The git commands you would need to execute would take quite some time, so we let grunt do the work. But we need to set that up first.

Open your `gruntfile.js` and find the following section:

Put your remote url here and choose to what branch the \_site should be pushed to.

``` highlight
buildcontrol: {
    options: {
        dir: '_site',
        commit: true,
        push: true,
        message: 'Built _site from commit %sourceCommit% on branch %sourceBranch%'
    },
    pages: {
        options: {
            remote: 'https://github.com/user/reponame.git', // change that
            branch: 'gh-pages' // adjust here
        }
    }
}
```

After you did that, build your site, and commit all of your changes to the source branch. After all of your changes are commited, run the grunt command in your terminal.

``` highlight
grunt deploy
```

grunt buildcontrol will do it’s thing. Enter your credentials when you are asked to and then your site should be live.

Yeahy!

{% endraw %}