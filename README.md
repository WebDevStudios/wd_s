wd_s
===

[WebDevStudios](http://webdevstudios.com) fork of Automattic's [_s](https://github.com/Automattic/_s). Used as our new project theme boilerplate. Pull requests are welcome!

# Features
[Gulp](http://gulpjs.com/), [Sass](http://sass-lang.com/), [PostCSS](https://github.com/postcss/postcss),  [Bourbon](http://bourbon.io/), [Neat](http://neat.bourbon.io/), [BrowserSync](https://www.browsersync.io/), [Animate.scss](assets/sass/utilities/animate/README.md), [WDS Simple Page Builder support](https://github.com/WebDevStudios/WDS-Simple-Page-Builder), [SVG support](assets/images/svg-icons/README.md), [Image sprite support](assets/images/sprites/README.md), Script linting and CSS minifcation.

## Jump to:
[Pre-Installation](#pre-installation) | [Theme Setup](#theme-setup) | [Installation](#installation) | [Gulp Tasks](#gulp-tasks)

# Pre-Installation

Basic knowledge of the command line and the following dependencies are required to use wd_s:

* [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* [Node](http://nodejs.org/)

# Theme Setup

To get started, we'll download the files and then to do some finding and replacing:

1) [Download](https://github.com/WebDevStudios/wd_s/archive/master.zip) and extract the zip into your project's `wp-content/themes` directory and rename `wd_s` to fit your needs

2) Find & Replace

You'll need to change all instances of the names: `_s` to your project name. While this can be a tedious chore, SublimeText 3 can do a global "find & replace" allowing you to do this in under 60 seconds.

* Search for: `'_s'` and replace with: `'project-name'` (inside single quotations) to capture the text domain
* Search for: `_s_` and replace with: `project-name_` to capture all the function names
* Search for: `Text Domain: _s` and replace with: `Text Domain: project-name` in style.css
* Search for (and include the leading space): <code>&nbsp;_s</code> and replace with: <code>&nbsp;Project Name</code> (with a space before it) to capture DocBlocks
* Search for: `_s-` and replace with: `project-name-` to capture prefixed handles
* Search for `_s.pot` and replace with: `project-name.pot` to capture translation files

Once you've setup the theme, you can start the [install](https://github.com/WebDevStudios/wd_s#installation).

# Installation

1) From the command line, change directories to your new theme directory

```bash
cd /your-project/wordpress/wp-content/themes/your-theme
```

2) Install dependencies

```bash
npm install
```

You are now ready to use wd_s!

# Gulp Tasks

1) From the command line, navigate to your theme

```bash
cd /your-project/wordpress/wp-content/themes/your-theme
```

2) Type any of the following Grunt tasks to perform an action:

`gulp watch` - Automatically handle changes to CSS, JS, SVGs, and image sprites. Plus live reload!

`gulp icons` - Minify, concatenate, and clean SVG icons.

`gulp i18n` - Scan the theme and create a POT file

`gulp scripts` - Concatenate and minify javascript files

`gulp sprites` - Generate an image sprite and the associated Sass (sprite.png)

`gulp styles` - Comb, compile, prefix, combine media queries, and minify CSS files

`gulp` - Runs the following tasks at the same time: i18n, icons, scripts, styles, sprites
