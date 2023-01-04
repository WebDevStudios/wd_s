<?php
/**
 * Gallery block patterns.
 *
 * @package wd_s
 * @phpcs:disable Squiz.Strings.DoubleQuoteUsage.NotRequired
 */

use function WebDevStudios\wd_s\get_pattern_asset;

register_block_pattern(
	'wd_s/gallery-stack',
	array(
		'title'      => __( 'Gallery: Stack', 'wd_s' ),
		'categories' => array( 'gallery' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"bottom":"60px"}}}} --><h2 class="has-text-align-center" style="margin-bottom:60px">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:gallery {"columns":1,"imageCrop":false,"linkTo":"none","sizeSlug":"full","style":{"spacing":{"blockGap":"48px"}}} --><figure class="wp-block-gallery has-nested-images columns-1"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} --><figure class="wp-block-image size-full"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} --><figure class="wp-block-image size-full"><img src="' . get_pattern_asset( 'square2.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} --><figure class="wp-block-image size-full"><img src="' . get_pattern_asset( 'landscape3.jpg' ) . '" alt=""/></figure><!-- /wp:image --></figure><!-- /wp:gallery --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/gallery-2-columns',
	array(
		'title'      => __( 'Gallery 2 Columns', 'wd_s' ),
		'categories' => array( 'gallery' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:gallery {"columns":2,"imageCrop":false,"linkTo":"none","align":"wide","twImageRatio":"3-2","twStackedSm":true} --><figure class="wp-block-gallery alignwide has-nested-images columns-2 tw-img-ratio-3-2 tw-stack-sm"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape3.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape4.jpg' ) . '" alt=""/></figure><!-- /wp:image --></figure><!-- /wp:gallery --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/gallery-alternating-widths',
	array(
		'title'      => __( 'Gallery: Alternating Widths', 'wd_s' ),
		'categories' => array( 'gallery' ),
		'content'    => '<!-- wp:group {"align":"full","style":{"spacing":{"blockGap":"24px"}},"layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"bottom":"60px"}}}} --><h2 class="has-text-align-center" style="margin-bottom:60px">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'wide.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:gallery {"columns":2,"linkTo":"none","align":"wide","style":{"spacing":{"blockGap":"24px"}}} --><figure class="wp-block-gallery alignwide has-nested-images columns-2 is-cropped"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'square3.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'square4.jpg' ) . '" alt=""/></figure><!-- /wp:image --></figure><!-- /wp:gallery --><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/gallery-stretched-images',
	array(
		'title'      => __( 'Gallery: Stretched Images', 'wd_s' ),
		'categories' => array( 'gallery' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:gallery {"linkTo":"none","align":"wide"} --><figure class="wp-block-gallery alignwide has-nested-images columns-default is-cropped"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape3.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape4.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape5.jpg' ) . '" alt=""/></figure><!-- /wp:image --></figure><!-- /wp:gallery --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/gallery-center-alignment',
	array(
		'title'      => __( 'Gallery: Center Alignment', 'wd_s' ),
		'categories' => array( 'gallery' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:gallery {"columns":3,"linkTo":"none","align":"wide","className":"tw-img-center","twFixedWidthCols":true,"style":{"spacing":{"blockGap":"32px"}}} --><figure class="wp-block-gallery alignwide has-nested-images columns-3 is-cropped tw-img-center tw-fixed-cols"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape3.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape4.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape5.jpg' ) . '" alt=""/></figure><!-- /wp:image --></figure><!-- /wp:gallery --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/gallery-3-columns',
	array(
		'title'      => __( 'Gallery 3 Columns', 'wd_s' ),
		'categories' => array( 'gallery' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:gallery {"columns":3,"imageCrop":false,"linkTo":"none","align":"wide","twFixedWidthCols":true,"twImageRatio":"4-3","twStackedSm":true} --><figure class="wp-block-gallery alignwide has-nested-images columns-3 tw-fixed-cols tw-img-ratio-4-3 tw-stack-sm"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape3.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape4.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape5.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape6.jpg' ) . '" alt=""/></figure><!-- /wp:image --></figure><!-- /wp:gallery --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/gallery-3-columns-large-caption',
	array(
		'title'      => __( 'Gallery 3 Columns: Large Caption', 'wd_s' ),
		'categories' => array( 'gallery' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:gallery {"columns":3,"imageCrop":false,"linkTo":"none","align":"wide","className":"tw-caption-large","twFixedWidthCols":true,"twImageRatio":"4-3","twStackedSm":true,"style":{"spacing":{"blockGap":"32px"}}} --><figure class="wp-block-gallery alignwide has-nested-images columns-3 tw-caption-large tw-fixed-cols tw-img-ratio-4-3 tw-stack-sm"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/><figcaption>' . esc_html_x( 'Caption', 'Block pattern content', 'wd_s' ) . '</figcaption></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/><figcaption>' . esc_html_x( 'Caption', 'Block pattern content', 'wd_s' ) . '</figcaption></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape3.jpg' ) . '" alt=""/><figcaption>' . esc_html_x( 'Caption', 'Block pattern content', 'wd_s' ) . '</figcaption></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape4.jpg' ) . '" alt=""/><figcaption>' . esc_html_x( 'Caption', 'Block pattern content', 'wd_s' ) . '</figcaption></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape5.jpg' ) . '" alt=""/><figcaption>' . esc_html_x( 'Caption', 'Block pattern content', 'wd_s' ) . '</figcaption></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape6.jpg' ) . '" alt=""/><figcaption>' . esc_html_x( 'Caption', 'Block pattern content', 'wd_s' ) . '</figcaption></figure><!-- /wp:image --></figure><!-- /wp:gallery --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/gallery-3-columns-full-width-no-gutter',
	array(
		'title'      => __( 'Gallery 3 Columns: Full Width No Gutter', 'wd_s' ),
		'categories' => array( 'gallery' ),
		'content'    => '<!-- wp:gallery {"columns":3,"imageCrop":false,"linkTo":"none","align":"full","style":{"spacing":{"blockGap":"0px"}},"twImageRatio":"3-2","twStackedSm":true} -->
		<figure class="wp-block-gallery alignfull has-nested-images columns-3 tw-img-ratio-3-2 tw-stack-sm"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape3.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape4.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape5.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape6.jpg' ) . '" alt=""/></figure><!-- /wp:image --></figure><!-- /wp:gallery -->',
	)
);

register_block_pattern(
	'wd_s/gallery-4-columns',
	array(
		'title'      => __( 'Gallery 4 Columns', 'wd_s' ),
		'categories' => array( 'gallery' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:gallery {"columns":4,"imageCrop":false,"linkTo":"none","align":"wide","twFixedWidthCols":true,"twImageRatio":"3-4"} --><figure class="wp-block-gallery alignwide has-nested-images columns-4 tw-fixed-cols tw-img-ratio-3-4"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape3.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape4.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape5.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape6.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape7.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'landscape8.jpg' ) . '" alt=""/></figure><!-- /wp:image --></figure><!-- /wp:gallery --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/gallery-4-columns-image-with-frame',
	array(
		'title'      => __( 'Gallery 4 Columns: Image with Frame', 'wd_s' ),
		'categories' => array( 'gallery' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:gallery {"columns":4,"imageCrop":false,"linkTo":"none","align":"wide","className":"is-style-tw-img-frame","twImageRatio":"1-1","twStackedSm":true,"style":{"spacing":{"blockGap":"32px"}}} --><figure class="wp-block-gallery alignwide has-nested-images columns-4 is-style-tw-img-frame tw-img-ratio-1-1 tw-stack-sm"><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'square1.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'square2.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'square3.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"large","linkDestination":"none"} --><figure class="wp-block-image size-large"><img src="' . get_pattern_asset( 'square4.jpg' ) . '" alt=""/></figure><!-- /wp:image --></figure><!-- /wp:gallery --></div><!-- /wp:group -->',
	)
);
