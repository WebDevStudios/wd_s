wd_s
===
[![buddy pipeline](https://app.buddy.works/webdevstudios/wd-s/pipelines/pipeline/154066/badge.svg?token=2471ae60766a1e9a657f772e493188dde748aa18c236d0b1c325e80be13a2ac6 "buddy pipeline")](https://app.buddy.works/webdevstudios/wd-s/pipelines/pipeline/154066)

Hi. I'm a starter theme called `wd_s`, or `wdunderscores`. I'm a theme meant for hacking so don't use me as a Parent Theme. Instead, try turning me into the next, most awesome, WordPress theme out there. That's what I'm here for!

I feature some of the web's most proven technologies like: [Sass](http://sass-lang.com/), [PostCSS](https://github.com/postcss/postcss), and [BrowserSync](https://www.browsersync.io/). To help you write clean code (that meets [WordPress standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/)), I'm also bundled with a [Stylelint](https://stylelint.io/), [ESLint](https://eslint.org/), and [PHPCS](https://github.com/squizlabs/PHP_CodeSniffer) linting rulesets. Did I mention that I'm also accessible? Yup. I pass both WCAG 2.1AA and Section 508 standards out of the box.

If that weren't enough, I also support [synchronized JSON](https://www.advancedcustomfields.com/resources/synchronized-json/) for Advanced Custom Fields and support both [Selective Refresh](https://make.wordpress.org/core/2016/03/22/implementing-selective-refresh-support-for-widgets/) and [Live Preview](https://codex.wordpress.org/Theme_Customization_API#Part_3:_Configure_Live_Preview_.28Optional.29) in the Theme Customizer.

If you have [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/), then you can take advantage of our [ACF Blocks](https://github.com/WebDevStudios/wd_s/wiki/ACF-Blocks) system. ACF Blocks are a powerful PHP-based framework for developing custom block types. Learn more about [ACF Blocks](https://www.advancedcustomfields.com/resources/blocks/).

<a href="https://webdevstudios.com/contact/"><img src="https://webdevstudios.com/wp-content/uploads/2018/04/wds-github-banner.png" alt="WebDevStudios. Your Success is Our Mission."></a>

## Getting Started

### Prerequisites

Because I compile and bundle assets via NPM scripts, basic knowledge of the command line and the following dependencies are required: [Node](https://nodejs.org) (v12+) and [Composer](https://getcomposer.org/).

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
* Search for `_s.test` and replace with: `project-name.test` to match your local development URL
* Edit the theme information in the header of style.scss to meet your needs

## Installation

1. From the command line, change directories to your new theme directory:

```bash
cd /wp-content/themes/your-theme
```

2. Install theme dependencies and trigger an initial build:

```bash
npm i
```

### NPM Scripts

From the command line, type any of the following to perform an action:

`npm run build` - Compile and build all assets.

`npm run watch` - Automatically handle changes to CSS, JS, SVGs, and image sprites. Also kicks off BrowserSync for hot-module reloading.

## Contributing and Support

Your contributions and [support tickets](https://github.com/WebDevStudios/wd_s/issues) are welcome. Please see our [guidelines](https://github.com/WebDevStudios/wd_s/blob/master/.github/CONTRIBUTING.md) before submitting a pull request.
