[![Stories in Ready](https://badge.waffle.io/WebDevStudios/wd_s.png?label=ready&title=Ready)](https://waffle.io/WebDevStudios/wd_s)

# wd_s

This is [WebDevStudios](http://webdevstudios.com) fork of Automattic's [_s](https://github.com/Automattic/_s). wd_s is used as a theme boilerplate for new projects. It contains modern build tools to help developers spin up a bare bones theme quickly. To get started, see the instructions below. As always, your pull requests are welcome!

# Features

* [Gulp](http://gulpjs.com/)
* [LibSass](http://sass-lang.com/)
* [PostCSS](https://github.com/postcss/postcss)
* [Bourbon](http://bourbon.io/)
* [Neat](http://neat.bourbon.io/)
* [BrowserSync](https://www.browsersync.io/)
* and more!

# Pre-Installation

Basic knowledge of the command line and the following dependencies are required to use wd_s:

* [Node](http://nodejs.org/)

# Installation

1) [Download](https://github.com/WebDevStudios/wd_s/archive/master.zip) and extract the zip into your project's `wp-content/themes` directory and rename `wd_s-master` to fit your needs.

2) From the command line, change directories to your new theme directory

```bash
cd /your-project/wordpress/wp-content/themes/your-theme
```

3) Find & Replace

You'll need to change all instances of the names: `_s`. While this can be a tedious chore, editors like SublimeText can do a global "find & replace" allowing you to do this in under 60 seconds.

* Search for: `'_s'` and replace with: `'project-name'` (inside single quotations) to capture the text domain
* Search for: `_s_` and replace with: `project-name_` to capture all the function names
* Search for: `Text Domain: _s` and replace with: `Text Domain: project-name` in style.css
* Search for (and include the leading space): <code>&nbsp;_s</code> and replace with: <code>&nbsp;Project Name</code> (with a space before it) to capture DocBlocks
* Search for: `_s-` and replace with: `project-name-` to capture prefixed handles
* Search for `_s.pot` and replace with: `project-name.pot` to capture translation files
* Search for `_s.com` and replace with: `project-name.dev` to match your local development URL
* Edit the theme information in the header of style.scss to meet your needs

4) Install Node dependencies

```bash
npm install
```
![Install and Gulp](https://dl.dropbox.com/s/cj1p6xjz51cpckq/wd_s-install.gif?dl=0)

You are now ready to use wd_s!

# Gulp Tasks

From the command line, type any of the following Grunt tasks to perform an action:

`gulp watch` - Automatically handle changes to CSS, JS, SVGs, and image sprites. Also kicks off BrowserSync.

`gulp icons` - Minify, concatenate, and clean SVG icons.

`gulp i18n` - Scan the theme and create a POT file

`gulp sass:lint` - Run Sass against WordPress code standards

`gulp scripts` - Concatenate and minify javascript files

`gulp sprites` - Generate an image sprite and the associated Sass (sprite.png)

`gulp styles` - Compile, prefix, combine media queries, and minify CSS files

`gulp` - Runs the following tasks at the same time: i18n, icons, scripts, styles, sprites

### What about Grunt?

We're currently making the transition from Grunt to Gulp. For the time being will continue to support both. If you'd prefer to use Grunt:

* Delete package.json
* Rename package.json-grunt to package.json
* Type `npm install`

See [Gruntfile.js](https://github.com/WebDevStudios/wd_s/blob/master/Gruntfile.js) for a list of tasks.

# Contributing and Support

Your contributions and [support tickets](https://github.com/WebDevStudios/wd_s/issues) are welcome. Please see our [guidelines](https://github.com/WebDevStudios/wd_s/blob/master/CONTRIBUTING.md) before submitting a pull request.

