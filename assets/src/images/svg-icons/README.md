# SVG's with wd_s

All of the starter SVG icons included in this repo are from [IcoMoon App](https://icomoon.io/app/). The /svg-icons/ directory is a compileable directory, and is associated with the following tasks in wd_s's [Gulpfile.js](../../blob/master/Gulpfile.js):

* `svgmin` - minifies and cleans up some extraneous SVG
* `svgstore` - merges multiple SVGs into single file, e.g. [svg-icons.svg](../blob/master/images/svg-icons.svg)

## Using SVGs with wd_s

### Inline SVG helper functions

[`_s_display_svg( $args = array() ); // Return SVG markup`](../../blob/master/inc/template-tags.php#L125)
```
/**
 * Return SVG markup.
 *
 * @param  array  $args {
 *     Paramenters needed to display an SVG.
 *
 *     @param string $icon Required. Use the icon filename, e.g. "facebook-square".
 *     @param string $title Optional. SVG title, e.g. "Facebook".
 *     @param string $desc Optional. SVG description, e.g. "Share this post on Facebook".
 * }
 * @return string SVG markup.
 */
```

Example usage:
`<?php echo _s_display_svg( array( 'icon' => 'twitter' ) ); ?>`

Output:
```
<svg class="icon icon-twitter">
    <use xlink:href="#icon-twitter"></use>
</svg>
```
[`_s_do_svg( array( 'icon' => $icon_name ) ); // Echo SVG markup`](../blob/master/inc/template-tags.php#L139)

Example usage:
`<?php _s_do_svg( array( 'icon' => 'facebook' ) ); ?>`

Output:
```
<svg class="icon facebook">
    <use xlink:href="#icon-facebook"></use>
</svg>
```

SVG icons will now appear inline, and can be styled via CSS!

### Adding and removing icons to /svg-icons/ directory
There are two ways to add and/or remove SVG icons from wd_s:

1. ["Fast and Furious" method](#fast-and-furious) - if you're all pedal to the metal, and just want to drop in a new SVG and get going.
2. [**Recommended**](#recommended) - especially if you're working on a team, and want to have a manifest of all icons, and you're mostly using [IcoMoon App](https://icomoon.io/app/).

#### "Fast and Furious" method
If you just want to drop in a new SVG icon (or remove existing one), and be on your way. Then just drop your SVG icon into the /svg-icons/ directory, run `gulp icons`, and be on your merry way.

#### Recommended
If your project requires keeping track of the library of icons available, and you want your team to be able to update and maintain via [IcoMoon App](https://icomoon.io/app/), then this is the recommended method.

1. Visit [IcoMoon App's Projects tab](https://icomoon.io/app/#/projects), import the wd_s [_IcoMoon.json](_IcoMoon.json) file, and click 'Load' to launch the imported project.
2. Select (or deselect) to add (or remove) the desired SVG icons.
3. Click the 'Generate SVG, PNG, PDF' link in the sticky footer along the bottom, and then 'Download'.
4. The unzipped directory will contain several files and folders. We're mostly concerned with the selection.json, and the /SVG/ folder with our newly added (or removed) icons. Copy over the selection.json file, rename, and replace your project's _IcoMoon.json file. This ensures your team will have a manifest of all the current SVG files from IcoMoon should they want to further modify the library of icons. Also, copy over and replace all icons in the downloaded /SVG/ folder into your project as well.
5. Rinse, and repeat if further icon changes are required.
6. Have fun! :neckbeard:
