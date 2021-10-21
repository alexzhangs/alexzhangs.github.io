---
title: Welcome to Alex's Personal Blog
layout: post
summary: A note about how to set a blog up like this one.
author: Alex Zhang
categories: software
banner: /assets/images/banners/thinkpad.png
tags: blog, github-pages, jekyll, elasticsearch
revised: 2021-10-21 21:08:00
---

## Welcome to Alex's Personal Blog

This blog is powered by [Jekyll](http://jekyllrb.com/), themed by [jekyll-theme-yat](https://github.com/jeffreytse/jekyll-theme-yat) and hosted on [Github Pages](https://pages.github.com).

To avoid info fragmentation, this page is being continuously updated as this blog evolves.

## Elasticsearch
Server-side site search ([Elasticsearch](https://www.elastic.co/)) is added by the guidance in [this blog post](https://blog.omc.io/elasticsearch-for-jekyll-part-1-ab456ac7c093), but I have to rebuild the [Searchkit](https://searchkit.co/) client parts since the tech world has been moving forward.

### Indexing
[Searchyll](https://github.com/omc/searchyll) is used to index the site.

Searchyll seems to be out of maintenance, the master branch is not merged and released for years.

You will be happy to refer to the below repo to get the recent fixes, at least until they are merged and released to official Gem.

This repo is based on `omc/Searchyll` master plus my [fix](https://github.com/omc/searchyll/pull/53) to overcome the annoying updating alias error when running into multiple indices. 

```yaml
group :jekyll_plugins do
  gem "searchyll", git: "https://github.com/alexforks/searchyll", ref: "fix-update-alias-404"
end
```

### Search UI
[Searchkit](https://searchkit.co/) is used to search the Elasticsearch server to build the search result.

I built a new search UI component with `Searchkit v2`. The layout and style are sticky with Searchkit as much as possible, but being overridden to suit well with `jekyll-them-yat`.

I'm not a React guy, just knowing enough to get it to work. Considering making this a Jekyll plugin, but there is some work to make the layout and style universe enough to be configurable.

### Server Credential
There are two places where the Elasticsearch URL and credential will be needed.

#### 1. Searchyll

An URL with a credential with `write` permission is necessary.
Don't put the credential within `_config.yml`, use environment variable to test locally, like below:

```shell
$ bundle update && ELASTICSEARCH_URL="https://yourusername:yourpassword@yourserver.com" bundle exec jekyll serve
```

And configure the same URL and credential as environment variables in the `yourname.github.io -> Github Environments -> github-pages` for the server-side.

#### 2. Searchkit

An URL and a credential with read-only permission are enough.

A file with below content named `.env` in the site root is needed to build webpack components:

```ini
REACT_APP_ES_CREDENTIAL = readonly_username:password
REACT_APP_ES_URL = https://your_elasticsearch_server_url
```

> ⚠️ WARNING: The credential and URL that are given in the `.env` file:
> * will be exposed to the Internet in a .js file.
> * should only have the read-only permission to the Elasticsearch server.
>
> Remember to add `.env` file to `.gitignore` and don't push it to Github.

Put the file under the root of the site. Webpack will read it and generate `/assets/js/search.js` by executing the below command in the site root:

```shell
$ webpack
```

Github Pages won't handle this, execute the command before pushing the site to Github.



### Where to get an Elasticsearch service?

To minimize the maintenance needs, mine is powered by [Bonsai](https://app.bonsai.io/) for free.

Use [my referral link to sign up](https://app.bonsai.io/r/A1ZgIcepiGs4Q56DnmBl), the free plan is enough. But when you start using a paid plan, you and I will both get $50 credit.

### How to build?

All you need is `npm`, get it ready. And run in your site root:

```shell
$ npm install
$ webpack -w
```

Related environment:

```shell
$ ruby --version
ruby 2.7.3p183 (2021-04-05 revision 6847ee089d) [x86_64-darwin20]

$ npm --version
7.10.0
```

## Jekyll Plugins that Github Pages doesn't Support?

There are a lot of [Jekyll plugins](https://github.com/topics/jekyll-plugin) out there giving you the features that Jekyll and your theme don't have.
But the truth is most of them won't work with Github Pages.

Github Pages has [this dependency list](https://pages.github.com/versions/).
The unlisted Jekyll plugins will work only if you run `jekyll build` locally.
Github Pages is ignoring them on remote as they are don't exist.

But this is not all the picture.

If you are using the `yourusername.github.io` repo, the only thing you want to be pushed to the configured branch is the generated `_site`, nothing else.
If the Jekyll source is pushed to this branch, the remote jekyll build is overriding your pushed local build.
To what end? you end up with a solution without the remote build capability!

### What's the Solution?

To get the unlisted Jekyll plugins functional on Github Pages, you need a CI, such as Travis and Github Workflow, to gain control of the remote build.

Here it is, [jekyll-deploy-action](https://github.com/jeffreytse/jekyll-deploy-action), A Github Action, will help to simplify the process with Github Workflow.

Just follow the usage document, after that, your plugins will work both locally and remotely.

## Reference Links

* [http://jekyllrb.com/](http://jekyllrb.com/)
* [https://github.com/jeffreytse/jekyll-theme-yat](https://github.com/jeffreytse/jekyll-theme-yat)
* [https://github.com/jeffreytse/jekyll-spaceship](https://github.com/jeffreytse/jekyll-spaceship)
* [https://blog.omc.io/elasticsearch-for-jekyll-part-1-ab456ac7c093](https://blog.omc.io/elasticsearch-for-jekyll-part-1-ab456ac7c093)
* [https://github.com/searchkit/searchkit](https://github.com/searchkit/searchkit)
* [https://github.com/omc/searchyll](https://github.com/omc/searchyll)
* [https://app.bonsai.io/](https://app.bonsai.io/)
* [https://github.com/jeffreytse/jekyll-deploy-action](https://github.com/jeffreytse/jekyll-deploy-action)
* [https://github.com/vfeskov/vanilla-back-to-top](https://github.com/vfeskov/vanilla-back-to-top)
