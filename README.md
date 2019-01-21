wd_s
===
[![Build Status](https://travis-ci.org/WebDevStudios/wd_s.svg?branch=master)](https://travis-ci.org/WebDevStudios/wd_s)

Hi. I'm a starter theme called `wd_s`, or `wdunderscores`. I'm a theme meant for hacking so don't use me as a Parent Theme. Instead, try turning me into the next, most awesome, WordPress theme out there. That's what I'm here for!

## Features
- [Gulp](http://gulpjs.com/) + [Webpack](https://webpack.js.org/)
- [LibSass](http://sass-lang.com/) & [PostCSS](https://github.com/postcss/postcss)
- `ES6` & [React](https://reactjs.org/) compatible
- [Bourbon 4.3](http://bourbon.io/) & [Neat v1.9](http://neat.bourbon.io/docs/1.9.0/)
- [BrowserSync](https://www.browsersync.io/)
- [WordPress standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/)
- [Sass Lint](https://github.com/sasstools/sass-lint), [ESLint](https://eslint.org/), and [PHPCS](https://github.com/squizlabs/PHP_CodeSniffer) linting
- Accessible - WCAG 2.0AA & Section 508

If that weren't enough, I also support [synchronized JSON](https://www.advancedcustomfields.com/resources/synchronized-json/) for [Advanced Custom Fields](https://www.advancedcustomfields.com/) and support both [Selective Refresh](https://make.wordpress.org/core/2016/03/22/implementing-selective-refresh-support-for-widgets/) and [Live Preview](https://codex.wordpress.org/Theme_Customization_API#Part_3:_Configure_Live_Preview_.28Optional.29) in the Theme Customizer.

If you have the latest version of [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/), then you can take advantage of our [ACF Content Blocks](https://github.com/WebDevStudios/wd_s/wiki/ACF-Content-Blocks) system. Content Blocks are great way to "visually manage blocks of content" throughout your website.

<a href="https://webdevstudios.com/contact/"><img src="https://webdevstudios.com/wp-content/uploads/2018/04/wds-github-banner.png" alt="WebDevStudios. WordPress for big brands."></a>

## Getting Started

### Prerequisites

Because I'm bundled with Gulp, basic knowledge of the command line and the following dependencies are required: either [Yarn](https://yarnpkg.com) or [Node](https://nodejs.org), [Gulp CLI](https://github.com/gulpjs/gulp-cli) (`npm install -g gulp-cli`), and [Bower](https://bower.io/) (`npm install -g bower`).

### Quick Start
1) Head over to [https://wdunderscores.com](https://wdunderscores.com) and generate your `wd_s` based theme from there. You just input the name of the theme you want to create, click the "Generate" button, and you get your ready-to-awesomize starter theme.

2) Set the [theme configuration settings.](#theme-configuration)

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
* Edit the theme information in the header of style.scss to meet your needs

## Theme Configuration
Whether you used the **quick start** or **advanced option**, to get the best development experience, you will need to configure the [tasks/theme-config.js](tasks/theme-config.js) settings to match your local development environment.

Here is what a sample configuration looks like:

```
localURL: 'https://testing.test',
paths: {
	'css': [ './*.css', '!*.min.css' ],
	'icons': 'assets/images/svg-icons/*.svg',
	'images': [ 'assets/images/*', '!assets/images/*.svg' ],
	'php': [ './*.php', './**/*.php' ],
	'js': 'assets/scripts/src/**/*.js',
	'sass': 'assets/sass/**/*.scss'
},
themeName: 'wd_s',
watchURL: 'https://localhost:3000'
```

**Options:**

`localURL` - The URL for your local development server.

`paths` - File locations by type.

`themeName` - The active theme name.

`watchURL` - The URL you want browsersync to run on.

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

### Scripts

From the command line, type any of the following to perform an action:

`npm run build` - Build all files for production.

`npm run build:js` - Build JavaScript files for production.

`npm run dev` - Build all files in development mode.

`npm run dev:js` Build JavaScript files in development mode.

`npm run eslint` - Run Javascript against WordPress code standards.

`npm run eslint:fix` - Run Javascript against WordPress code standards and fix errors.

`npm run icons` - Minify, concatenate, and clean SVG icons.

`npm run i18n` - Scan the theme and create a POT file.

`npm run phpcs` - Run PHP files against WebDevStudios code standards.

`npm run sasslint` - Run Sass files against WordPress code standards.

`npm run sasslint:fix` - Run Sass files against Wordpress code standards and fix errors.

`npm run styles` - Compile, prefix, combine media queries, and minify CSS files.

`npm run watch` - Automatically handle changes to CSS, JS, and SVGs. Also kicks off BrowserSync.

## Contributing and Support

Your contributions and [support tickets](https://github.com/WebDevStudios/wd_s/issues) are welcome. Please see our [guidelines](https://github.com/WebDevStudios/wd_s/blob/master/.github/CONTRIBUTING.md) before submitting a pull request.
