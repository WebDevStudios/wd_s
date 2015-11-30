# SVG's with wd_s

All of the starter SVG icons included in this repo are from [https://icomoon.io/app/](IcoMoon App). The /svg/ directory is a compileable directory, and is associated with the following tasks in wd_s's [Gruntfile.js](../blob/master/Gruntfile.js):

* `svgmin` - minifies and cleans up some extraneous SVG 
* `svgstore` - merges multiple SVGs into single file, e.g. [svg-defs.svg](../blob/master/images/svg-defs.svg)

# Using SVGs with wd_s

## Inline SVG helper functions

[`_s_get_svg( $icon_name ); // Return SVG markup`](../blob/master/inc/template-tags.php#L125) 

Example usage:
`<?php echo _s_get_svg( 'twitter'); ?>`

Output:
```
<svg class="icon icon-twitter">
    <use xlink:href="#icon-twitter"></use>
</svg>
```
[`_s_do_svg( $icon_name ); // Echo SVG markup`](../blob/master/inc/template-tags.php#L139)

Example usage: 
`<?php _s_do_svg( 'facebook' ); ?>`

Output:
```
<svg class="icon icon-facebook">
    <use xlink:href="#icon-facebook"></use>
</svg>
```

SVG icons will now appear inline, and can be styled via CSS!

## Adding and removing icons to /svg/ directory
There are two ways to add and/or remove SVG icons from wd_s:

1) [Fast and Furious](#fast-and-furious) - if you're all pedal to the metal, and just want to drop in a new SVG and get going.
2) [**Recommended**](#recommended) - especially if you're working on a team, and want to have a manifest of all icons, and you're mostly using [https://icomoon.io/app/](IcoMoon App).

### Fast and Furious
If you just want to drop in a new SVG icon (or remove existing one), and be on your way. Then just drop your SVG icon into the /svg/ directory, run `grunt icons`, and be on your merry way.

### Recommended
If your project requires keeping track of the library of icons available, and you want your team to be able to update and maintain via [https://icomoon.io/app/](IcoMoon App), then this is the recommended method.

1) Visit [IcoMoon App's Projects tab](https://icomoon.io/app/#/projects), import the wd_s-icoMoon-FontAwesome.json file, and click 'Load' to launch the imported project.
2) Select (or deselect) to add (or remove) the desired SVG icons.
3) Click the 'Generate SVG, PNG, PDF' link in the sticky footer along the bottom, and then 'Download'.
4) The unzipped directory will contain several files and folders. We're mostly concerned with the selection.json, and the /SVG/ folder with our newly added (or removed) icons. 