wd_s
===
[![Build Status](https://travis-ci.org/WebDevStudios/wd_s.svg?branch=master)](https://travis-ci.org/WebDevStudios/wd_s)

Hi. I'm a starter theme called `wd_s`, or `wdunderscores`. I'm a theme meant for hacking so don't use me as a Parent Theme. Instead, try turning me into the next, most awesome, WordPress theme out there. That's what I'm here for!

I feature some of the web's most proven technologies like: [Gulp](http://gulpjs.com/), [LibSass](http://sass-lang.com/), [Babel](https://babeljs.io/), [PostCSS](https://github.com/postcss/postcss), and [BrowserSync](https://www.browsersync.io/). To help you write clean code (that meets [WordPress standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/)), I'm also bundled with a [Sass Lint](https://github.com/sasstools/sass-lint), [ESLint](https://eslint.org/), and [PHPCS](https://github.com/squizlabs/PHP_CodeSniffer) linting rulesets. Did I mention that I'm also accessible? Yup. I pass both WCAG 2.0AA and Section 508 standards out of the box.


If that weren't enough, I also support [synchronized JSON](https://www.advancedcustomfields.com/resources/synchronized-json/) for [Advanced Custom Fields](https://www.advancedcustomfields.com/) and support both [Selective Refresh](https://make.wordpress.org/core/2016/03/22/implementing-selective-refresh-support-for-widgets/) and [Live Preview](https://codex.wordpress.org/Theme_Customization_API#Part_3:_Configure_Live_Preview_.28Optional.29) in the Theme Customizer.

If you have the latest version of [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/), then you can take advantage of our [ACF Content Blocks](https://github.com/WebDevStudios/wd_s/wiki/ACF-Content-Blocks) system. Content Blocks are great way to "visually manage blocks of content" throughout your website.

<a href="https://webdevstudios.com/contact/"><img src="https://webdevstudios.com/wp-content/uploads/2018/04/wds-github-banner.png" alt="WebDevStudios. WordPress for big brands."></a>

## Getting Started

### Prerequisites

Because I'm bundled with Gulp, basic knowledge of the command line and the following dependencies are required: either [Yarn](https://yarnpkg.com) or [Node](https://nodejs.org), [Gulp CLI](https://github.com/gulpjs/gulp-cli) (`npm install -g gulp-cli`), and [Bower](https://bower.io/) (`npm install -g bower`).

### Quick Start
If you want to keep it simple, head over to [https://wdunderscores.com](https://wdunderscores.com) and generate your `wd_s` based theme from there. You just input the name of the theme you want to create, click the "Generate" button, and you get your ready-to-awesomize starter theme.

### Advanced

If you want to set me up manually:

1) [Download](https://github.com/WebDevStudios/wd_s/archive/master.zip) and extract the zip into your `wp-content/themes` directory and rename `wd_s-master` to fit your needs.

2) Find & Replace

You'll need to change all instances of the names: `_s`.

* Search for: `'_s'` and replace with: `'project-name'` (inside single quotations) to capture the text domain
* Search for: `_s_` and replace with: `project-name_` to capture all the function names
* Search for: `Text Domain: _s` and replace with: `Text Domain: project-name` in style.css
* Search for (and include the leading space): <code>&nbsp;_s</code> and replace with: <code>&nbsp;Project Name</code> (with a space before it) to capture DocBlocks
* Search for: `_s-` and replace with: `project-name-` to capture prefixed handles
* Search for `_s.pot` and replace with: `project-name.pot` to capture translation files
* Search for `_s.com` and replace with: `project-name.dev` to match your local development URL
* Edit the theme information in the header of style.scss to meet your needs

## Development

After you've installed and activated me. It's time to setup Gulp.

1) From the command line, change directories to your new theme directory

```bash
cd /your-project/wordpress/wp-content/themes/your-theme
```

2) Install theme dependencies (use either Yarn or NPM)

Yarn
```bash
yarn install && bower install
```
NPM
```bash
npm install && bower install
```
![Install and Gulp](https://dl.dropboxusercontent.com/s/cj1p6xjz51cpckq/wd_s-install.gif?dl=0)

### Gulp Tasks

From the command line, type any of the following to perform an action:

`gulp watch` - Automatically handle changes to CSS, JS, SVGs, and image sprites. Also kicks off BrowserSync.

`gulp icons` - Minify, concatenate, and clean SVG icons.

`gulp i18n` - Scan the theme and create a POT file.

`gulp sass:lint` - Run Sass against WordPress code standards.

`gulp js:lint` - Run Javascript against WordPress code standards.

`gulp scripts` - Concatenate and minify javascript files.

`gulp sprites` - Generate an image sprite and the associated Sass (sprite.png).

`gulp styles` - Compile, prefix, combine media queries, and minify CSS files.

`gulp` - Runs the following tasks at the same time: i18n, icons, scripts, styles, sprites.

## Contributing and Support

Your contributions and [support tickets](https://github.com/WebDevStudios/wd_s/issues) are welcome. Please see our [guidelines](https://github.com/WebDevStudios/wd_s/blob/master/.github/CONTRIBUTING.md) before submitting a pull request.
