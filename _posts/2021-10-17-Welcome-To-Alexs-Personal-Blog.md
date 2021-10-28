---
title: Welcome to Alex's Personal Blog
layout: post
summary: A note about how to set a blog up like this one.
author: Alex Zhang
categories: software
banner: /assets/images/banners/thinkpad.png
tags: blog, github-pages, jekyll, elasticsearch, responsive-images
revised: 2021-10-28 14:02:00
---

## Welcome to Alex's Blog

This blog is powered by [Jekyll](http://jekyllrb.com/),
themed by [jekyll-theme-yat](https://github.com/jeffreytse/jekyll-theme-yat) and hosted on
[Github Pages](https://pages.github.com).

To avoid info fragmentation, this page is being continuously updated as this blog evolves.

### Links

* [http://jekyllrb.com/](http://jekyllrb.com/)
* [https://github.com/jeffreytse/jekyll-theme-yat](https://github.com/jeffreytse/jekyll-theme-yat)

## Search Box

Server-side site search ([Elasticsearch](https://www.elastic.co/)) is added by the guidance
in [this blog post](https://blog.omc.io/elasticsearch-for-jekyll-part-1-ab456ac7c093),
but I have to rebuild the [Searchkit](https://searchkit.co/) client parts since the tech world has been moving forward.

As a temporary solution, the code is integrated into my fork of jekyll-theme-yat:
[https://github.com/alexforks/jekyll-theme-yat](https://github.com/alexforks/jekyll-theme-yat).
The demo is available on the current site and the config can be found
[here](https://github.com/alexzhangs/alexzhangs.github.io).

### Indexing

[Searchyll](https://github.com/omc/searchyll) is used to index the site.

Searchyll seems to be out of maintenance, the master branch is not merged and released for years.

You will be happy to refer to the below repo to get the recent fixes,
at least until they are merged and released to official Gem.

This repo is based on `omc/Searchyll` master plus my [fix](https://github.com/omc/searchyll/pull/53)
to overcome the annoying updating alias error when running into multiple indices. 

```yaml
# _config.yml
group :jekyll_plugins do
  gem "searchyll", git: "https://github.com/alexforks/searchyll", ref: "fix-update-alias-404"
end
```

### Search UI

[Searchkit](https://searchkit.co/) is used to search the Elasticsearch server to build the search result.

I built a new search UI component with `Searchkit v2`.
The layout and style are sticky with Searchkit as much as possible,
but being overridden to suit well with `jekyll-them-yat`.

I'm not a React guy, just knowing enough to get it to work.
Hope this [universal solution](https://github.com/jeffreytse/jekyll-theme-yat/issues/32#issuecomment-945449981)
is coming soon.

### Credential

There are two places where the Elasticsearch URL and credential will be needed.

1. Searchyll

    An URL with a credential with `write` permission is necessary.
    Don't put the credential within `_config.yml`, use environment variable to test locally, like below:

    ```shell
    $ bundle update && ELASTICSEARCH_URL="https://yourusername:yourpassword@yourserver.com" bundle exec jekyll serve
    ```

    And configure the same URL and credential as environment variables in the
    `yourname.github.io -> Github Environments -> github-pages` for the server-side.

2. Searchkit

    An URL and a credential with read-only permission are enough.

    ```yaml
    # _config.yml
    elasticsearch:
      readonly_url: https://yourusername:yourpassword@yourserver.com
    ```

    > ⚠️ WARNING: The `readonly_url`:
    > * will be exposed to the Internet in site source.
    > * should only have the read-only permission to the Elasticsearch server.

### Elasticsearch Service

Where to get an Elasticsearch service?
To minimize the maintenance needs, mine is powered by [Bonsai](https://app.bonsai.io/) for free.

Use [my referral link to sign up](https://app.bonsai.io/r/A1ZgIcepiGs4Q56DnmBl), the free plan is enough.
But when you start using a paid plan, you and I will both get $50 credit.

### Development

If you would like to make changes to the SearchUI, you will need to deal with
[https://github.com/alexforks/jekyll-theme-yat](https://github.com/alexforks/jekyll-theme-yat).
All you need is `npm`, get it ready. And run in your site root, to get your own `search.js`.

```shell
$ npm install
$ webpack
```

Related environment:

```shell
$ ruby --version
ruby 2.7.3p183 (2021-04-05 revision 6847ee089d) [x86_64-darwin20]

$ npm --version
7.10.0
```

### Links

* [https://github.com/alexforks/jekyll-theme-yat](https://github.com/alexforks/jekyll-theme-yat)
* [https://blog.omc.io/elasticsearch-for-jekyll-part-1-ab456ac7c093](https://blog.omc.io/elasticsearch-for-jekyll-part-1-ab456ac7c093)
* [https://github.com/searchkit/searchkit](https://github.com/searchkit/searchkit)
* [https://github.com/omc/searchyll](https://github.com/omc/searchyll)
* [https://app.bonsai.io/](https://app.bonsai.io/)

## Plugins with Github Pages

There are a lot of [Jekyll plugins](https://github.com/topics/jekyll-plugin)
out there giving you the features that Jekyll and your theme don't have.
But the truth is most of them won't work with Github Pages.

Github Pages has [this dependency list](https://pages.github.com/versions/).
The unlisted Jekyll plugins will work only if you run `jekyll build` locally.
Github Pages is ignoring them on remote as they are don't exist.

But this is not all the picture.

If you are using the `yourusername.github.io` repo,
the only thing you want to be pushed to the configured branch is the generated `_site`, nothing else.
If the Jekyll source is pushed to this branch, the remote Jekyll build is overriding your pushed local build.
To what end? you end up with a solution without the remote build capability!

### Solution

To get the unlisted Jekyll plugins functional on Github Pages, you need a CI,
such as Travis and Github Workflow, to gain control of the remote build.

Here it is, [jekyll-deploy-action](https://github.com/jeffreytse/jekyll-deploy-action),
a Github Action, will help to simplify the process with Github Workflow.

Just follow the usage document, after that, your plugins will work both LOCALLY AND REMOTELY, like a charm!

### Links

* [https://github.com/jeffreytse/jekyll-deploy-action](https://github.com/jeffreytse/jekyll-deploy-action)

## Responsive Images

[Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) is good,
to the readers. But it's hard, to the publishers.
It costs me days to come out with a satisfied solution.
All difficulties are related to Github Pages.

### Solution

> ⚠️ WARNING：The [Zero-Width Space (ZWSP)](https://en.wikipedia.org/wiki/Zero-width_space) is used in below code
>            to [workaround the liquid tags rendering issue](https://ozzieliu.com/2016/04/26/writing-liquid-template-in-markdown-with-jekyll/).
>            So, don't simply copy & paste the code, the ZWSP must be removed.

I tried two well used responsive images plugins:

1. [jekyll_picture_tag](https://github.com/rbuchberger/jekyll_picture_tag)
2. [jekyll-responsive-image](https://github.com/wildlyinaccurate/jekyll-responsive-image)

I take `jekyll_picture_tag` for now. I like its `presets` idea and the way of handling output directory structure.
Both plugins don't support markdown image tags. This is quietly surprising me. 
I don't like the responsive image liquid tags within my content. That is just not the way to write.

To overcome this, I need a transformer to translate markdown image tags, like:

```markdown
!​[Thinkpad](/assets/images/banners/thinkpad.png)
```

to the responsive image liquid tags, like:
 
```
{​% picture banners/thinkpad.png --alt Thinkpad %}
```

I wrote this universal hook plugin [jekyll-hooks](https://github.com/alexzhangs/jekyll-hooks), which does the job.

Then here is `jekyll_picture_tag`. It's rendering the liquid tag to HTML code as below:

```html
{% picture banners/thinkpad.png --alt Thinkpad %}
```

And your browser is rendering the HTML as below.
Change your browser window size and reload the page, to see the different images are being downloaded.

{% picture banners/thinkpad.png --alt Thinkpad %}

The `jekyll-hooks` can do more, such as letting the images be previewable while writing.
I write the markdown image like this:

```markdown
!​[Thinkpad](../assets/images/banners/thinkpad.png)
```

This way the image is referring to a valid relative local path and is previewable while writing.
Then one action will remove the part `..` from the path in a `pre_render` hook.
Which makes it a valid absolute web path.

### Image Compress Lib

Choose [vips](https://en.wikipedia.org/wiki/VIPS_(software))
or [ImageMagick](https://en.wikipedia.org/wiki/ImageMagick)?
With Github Pages, we don't have a choice.

By now (Oct 2021), Github Pages's [pages-gem v221](https://github.com/github/pages-gem) is locking down Jekyll `3.9.0`.
The latest jekyll_picture_tag has dropped the support of Jekyll v3 because of a
[cache_dir issue](https://github.com/rbuchberger/jekyll_picture_tag/issues/192).
We stuck at jekyll_picture_tag `1.10.2`. And this version doesn't support `vips`, it supports `ImageMagick` only.

### Sample Config

jekyll-hooks is not in the official gem yet, for now, use the git URL.

```yaml
# Gemfile

group :jekyll_plugins do
  ...
  gem "jekyll-hooks", git: "https://github.com/alexzhangs/jekyll-hooks"
  gem "jekyll_picture_tag", "~> 1.10.2"
end
```

{% raw %}
```yaml
# _config.yml

plugins:
  - jekyll-hooks
  - jekyll_picture_tag

# jekyll_picture_tag
picture:
  source: assets/images
  output: assets/images/resized

# jekyll-hooks
hooks:
  actions:
    - type: posts
      exts: [markdown,mkdown,mkdn,mkd,md]
      find: >
        (!\[[^\]]*\]\()/assets/images/(.+)
      replace: >
        \1\2
      disabled: false
    - type: posts
      exts: [markdown,mkdown,mkdn,mkd,md]
      # !​[alt](/path/to/image "title"){:.class}
      find: >
        !\[([^\]]*)\]\(((?!http[s]?://)[^"'\n]+)(?:\s['"]([^'"]*)['"])?\)(?:\{:\.([^{]+)\})?
      # both present and non-present quotes matter
      replace: >
        {% picture \2 --alt \1 --img class="\4" title="\3" %}
      case-insensitive: true
      disabled: false
  disabled: false
```
{% endraw %}

Of course, we need `jekyll-deploy-action`.
The last three lines are important, to get ImageMagick and its dependency installed on the docker.
The `jekyll-deploy-action` is running in a separate docker, so the dependencies must be installed with `pre_build_commands`.
I'm using [webp](https://en.wikipedia.org/wiki/WebP) format for my images.
It has an amazing compression ratio in most situations. So it's included in the installation list.

```yaml
# .github/workflows/build-jekyll.yml
      ...
      - uses: jeffreytse/jekyll-deploy-action@v0.3.1
        with:
          ...
          pre_build_commands: |      # Installing additional dependencies (Arch Linux)
            pacman -S --noconfirm imagemagick libwebp
            identify --version
```

### Links

* [jekyll_picture_tag](https://github.com/rbuchberger/jekyll_picture_tag)
* [jekyll-responsive-image](https://github.com/wildlyinaccurate/jekyll-responsive-image)
* [jekyll-hooks](https://github.com/alexzhangs/jekyll-hooks)
* [Images, Correctly](https://robert-buchberger.com/blog/2021/responsive_images.html)
* [Applying srcset: choosing the right sizes for responsive images at different breakpoints](https://medium.com/hceverything/applying-srcset-choosing-the-right-sizes-for-responsive-images-at-different-breakpoints-a0433450a4a3)
* [Automatic Responsive Images on Jekyll without Plugins](https://jetholt.com/jekyll-responsive-images/)
* [Run and debug Github actions locally](https://mauricius.dev/run-and-debug-github-actions-locally/)
* [a Ruby regular expression editor](https://rubular.com)

## Reference Links

* [https://github.com/jeffreytse/jekyll-spaceship](https://github.com/jeffreytse/jekyll-spaceship)
* [https://github.com/vfeskov/vanilla-back-to-top](https://github.com/vfeskov/vanilla-back-to-top)
