wd_s
===

Hi. I'm a starter theme called `wd_s`, or `wdunderscores`. I'm a theme meant for hacking so don't use me as a Parent Theme. Instead, try turning me into the next, most awesome, WordPress theme out there. That's what I'm here for!

I feature some of the web's most exciting technologies like: [Gulp](http://gulpjs.com/), [LibSass](http://sass-lang.com/), [PostCSS](https://github.com/postcss/postcss), [Bourbon](http://bourbon.io/), [Neat](http://neat.bourbon.io/), and [BrowserSync](https://www.browsersync.io/) to help make your development process fast and efficient. I'm also accessible, passing both WCAG 2.0AA and Section 508 standards out of the box.

## Getting Started

### Prerequisites

Because I'm bundled with Gulp, basic knowledge of the command line and the following dependencies are required: [Node](http://nodejs.org/) and [Gulp CLI](https://github.com/gulpjs/gulp-cli) (`npm install -g gulp-cli`).

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

2) Install Node dependencies

```bash
npm install
```
![Install and Gulp](https://dl.dropbox.com/s/cj1p6xjz51cpckq/wd_s-install.gif?dl=0)

### Gulp Tasks

From the command line, type any of the following to perform an action:

`gulp watch` - Automatically handle changes to CSS, JS, SVGs, and image sprites. Also kicks off BrowserSync.

`gulp icons` - Minify, concatenate, and clean SVG icons.

`gulp i18n` - Scan the theme and create a POT file

`gulp sass:lint` - Run Sass against WordPress code standards

`gulp scripts` - Concatenate and minify javascript files

`gulp sprites` - Generate an image sprite and the associated Sass (sprite.png)

`gulp styles` - Compile, prefix, combine media queries, and minify CSS files

`gulp` - Runs the following tasks at the same time: i18n, icons, scripts, styles, sprites

## Contributing and Support

Your contributions and [support tickets](https://github.com/WebDevStudios/wd_s/issues) are welcome. Please see our [guidelines](https://github.com/WebDevStudios/wd_s/blob/master/CONTRIBUTING.md) before submitting a pull request.

