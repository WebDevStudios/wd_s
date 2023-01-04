<?php
/**
 * Hero block patterns.
 *
 * @package wd_s
 * @phpcs:disable Squiz.Strings.DoubleQuoteUsage.NotRequired
 */

use function WebDevStudios\wd_s\get_pattern_asset;

register_block_pattern(
	'wd_s/hero-with-colored-background',
	array(
		'title'      => __( 'Hero with Colored Background', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:group {"backgroundColor":"tertiary","align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull has-tertiary-background-color has-background"><!-- wp:heading {"textAlign":"center","level":1,"align":"wide","style":{"typography":{"lineHeight":"1.1"}}} --><h1 class="alignwide has-text-align-center" style="line-height:1.1">' . esc_html_x( 'Write the page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:paragraph {"fontSize":"large","align":"center","style":{"typography":{"lineHeight":1.4}}} --><p class="has-large-font-size has-text-align-center" style="line-height:1.4">Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt et labore.</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/hero-with-button',
	array(
		'title'      => __( 'Hero with Button', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center","level":1,"align":"wide","style":{"typography":{"lineHeight":"1.1"}}} --><h1 class="alignwide has-text-align-center" style="line-height:1.1">' . esc_html_x( 'Write a page title that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"30px"}}}} --><div class="wp-block-buttons" style="margin-top:30px"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link">' . esc_html_x( 'Get started', 'Block pattern content', 'wd_s' ) . '</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/hero-with-eyebrow-title',
	array(
		'title'      => __( 'Hero with Eyebrow Title', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"fontSize":"small","textAlign":"center","level":1,"style":{"typography":{"textTransform":"uppercase"}}} --><h1 class="has-small-font-size has-text-align-center" style="text-transform:uppercase">' . esc_html_x( 'Page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"top":"20px"}}}} --><h2 class="has-text-align-center" style="margin-top:20px">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph {"align":"center"} --><p class="has-text-align-center">Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit.</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/hero-with-button-and-image-on-right',
	array(
		'title'      => __( 'Hero with Button and Image on Right', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:group {"backgroundColor":"tertiary","align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull has-tertiary-background-color has-background"><!-- wp:media-text {"mediaPosition":"right","mediaType":"image","twStackedMd":true,"twMediaBottom":true} --><div class="wp-block-media-text alignwide has-media-on-the-right is-stacked-on-mobile tw-stack-md tw-media-bottom"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":1,"style":{"typography":{"lineHeight":"1.1"}}} --><h1 style="line-height:1.1">' . esc_html_x( 'Write the page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore.</p><!-- /wp:paragraph --><!-- wp:buttons {"style":{"spacing":{"margin":{"top":"30px"}}}} --><div class="wp-block-buttons" style="margin-top:30px"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link">' . esc_html_x( 'Learn more', 'Block pattern content', 'wd_s' ) . '</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/hero-with-eyebrow-title-and-image-on-right',
	array(
		'title'      => __( 'Hero with Eyebrow Title and Image on Right', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:group {"backgroundColor":"tertiary","align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull has-tertiary-background-color has-background"><!-- wp:media-text {"mediaPosition":"right","mediaType":"image","twStackedMd":true,"twMediaBottom":true} --><div class="wp-block-media-text alignwide has-media-on-the-right is-stacked-on-mobile tw-stack-md tw-media-bottom"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"fontSize":"small","level":1,"style":{"typography":{"textTransform":"uppercase"}}} --><h1 class="has-small-font-size" style="text-transform:uppercase">' . esc_html_x( 'Page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:heading {"style":{"spacing":{"margin":{"top":"20px"}}}} --><h2 style="margin-top:20px">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/full-width-hero-with-image-on-right',
	array(
		'title'      => __( 'Full Width Hero with Image on Right', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:media-text {"align":"full","backgroundColor":"tertiary","mediaPosition":"right","mediaType":"image","imageFill":true,"twStackedMd":true,"twMediaBottom":true} --><div class="wp-block-media-text alignfull has-media-on-the-right has-background has-tertiary-background-color is-stacked-on-mobile is-image-fill tw-stack-md tw-media-bottom"><figure class="wp-block-media-text__media" style="background-image:url(' . get_pattern_asset( 'landscape1.jpg' ) . ');background-position:50% 50%"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:group {"layout":{"inherit":true}} --><div class="wp-block-group"><!-- wp:heading {"level":1,"style":{"typography":{"lineHeight":"1.1"}}} --><h1 style="line-height:1.1">' . esc_html_x( 'Write the page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore.</p><!-- /wp:paragraph --></div><!-- /wp:group --></div></div><!-- /wp:media-text -->',
	)
);

register_block_pattern(
	'wd_s/hero-with-buttons-and-image',
	array(
		'title'      => __( 'Hero with Buttons and Image', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center","level":1,"align":"wide","style":{"typography":{"lineHeight":"1.1"}}} --><h1 class="alignwide has-text-align-center" style="line-height:1.1">' . esc_html_x( 'Write the page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:paragraph {"align":"center"} --><p class="has-text-align-center">Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus.</p><!-- /wp:paragraph --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"30px"}}}} --><div class="wp-block-buttons" style="margin-top:30px"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link">' . esc_html_x( 'Get started', 'Block pattern content', 'wd_s' ) . '</a></div><!-- /wp:button --><!-- wp:button {"className":"is-style-outline"} --><div class="wp-block-button is-style-outline"><a class="wp-block-button__link">' . esc_html_x( 'Learn more', 'Block pattern content', 'wd_s' ) . '</a></div><!-- /wp:button --></div><!-- /wp:buttons --><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'wide.jpg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/hero-with-eyebrow-title-and-image',
	array(
		'title'      => __( 'Hero with Eyebrow Title and Image', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"textTransform":"uppercase"}},"fontSize":"small"} --><h1 class="has-text-align-center has-small-font-size" style="text-transform:uppercase">' . esc_html_x( 'Page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"top":"20px"}}}} --><h2 class="has-text-align-center" style="margin-top:20px">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'wide.jpg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/hero-with-overlap-image',
	array(
		'title'      => __( 'Hero with Overlap Image', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:group {"backgroundColor":"tertiary","align":"full","layout":{"inherit":true},"className":"tw-group-overlap-bottom"} --><div class="wp-block-group alignfull has-tertiary-background-color has-background tw-group-overlap-bottom"><!-- wp:heading {"textAlign":"center","level":1,"align":"wide","style":{"typography":{"lineHeight":"1.1"}}} --><h1 class="alignwide has-text-align-center" style="line-height:1.1">' . esc_html_x( 'Write the page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'wide.jpg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:group --><!-- wp:group {"backgroundColor":"background","align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull has-background-background-color has-background"><!-- wp:paragraph {"align":"center"} --><p class="has-text-align-center">Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed.</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/hero-with-title-on-left-and-image-at-the-bottom',
	array(
		'title'      => __( 'Hero with Title on Left and Image at the Bottom', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"48px"}},"twStack":"md","twVerticalGap":"small"} --><div class="wp-block-columns alignwide tw-cols-stack-md tw-row-gap-small"><!-- wp:column --><div class="wp-block-column "><!-- wp:heading {"level":1,"style":{"typography":{"lineHeight":"1.1"}}} -->
		<h1 style="line-height:1.1">' . esc_html_x( 'Write the page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph -->
		<p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit, eu iaculis sed at metus.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'wide.jpg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/hero-with-cut-off-image',
	array(
		'title'      => __( 'Hero with Cut Off Image', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:group {"backgroundColor":"tertiary","align":"full","layout":{"inherit":true},"style":{"spacing":{"padding":{"bottom":"0px"}}}} --><div class="wp-block-group alignfull has-tertiary-background-color has-background" style="padding-bottom:0px"><!-- wp:heading {"textAlign":"center","level":1,"align":"wide","style":{"typography":{"lineHeight":"1.1"}}} --><h1 class="alignwide has-text-align-center" style="line-height:1.1">' . esc_html_x( 'Write the page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:paragraph {"align":"center"} --><p class="has-text-align-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p><!-- /wp:paragraph --><!-- wp:image {"className":"tw-mt-8"} --><figure class="wp-block-image tw-mt-8"><img src="' . get_pattern_asset( 'illustration.svg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/hero-cover',
	array(
		'title'      => __( 'Hero Cover', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:cover {"url":"' . get_pattern_asset( 'wide.jpg' ) . '","dimRatio":60,"minHeight":70,"minHeightUnit":"vh","align":"full"} --><div class="wp-block-cover alignfull" style="min-height:70vh"><span aria-hidden="true" class="has-background-dim-60 wp-block-cover__gradient-background has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="' . get_pattern_asset( 'wide.jpg' ) . '" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:group {"layout":{"inherit":true}} --><div class="wp-block-group"><!-- wp:heading {"textAlign":"center","level":1,"align":"wide","style":{"typography":{"lineHeight":"1.1"}}} --><h1 class="alignwide has-text-align-center" style="line-height:1.1">' . esc_html_x( 'Write the page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:paragraph {"fontSize":"large","align":"center","style":{"typography":{"lineHeight":"1.4"}}} --><p class="has-text-align-center has-large-font-size" style="line-height:1.4">Lorem ipsum dolor sit amet commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt.</p><!-- /wp:paragraph --></div><!-- /wp:group --></div></div><!-- /wp:cover -->',
	)
);

register_block_pattern(
	'wd_s/hero-cover-with-button',
	array(
		'title'      => __( 'Fullscreen Hero Cover', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:cover {"url":"' . get_pattern_asset( 'wide.jpg' ) . '","dimRatio":60,"minHeight":100,"minHeightUnit":"vh","align":"full"} -->
		<div class="wp-block-cover alignfull" style="min-height:100vh"><span aria-hidden="true" class="has-background-dim-60 wp-block-cover__gradient-background has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="' . get_pattern_asset( 'wide.jpg' ) . '" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:group {"layout":{"inherit":true}} --><div class="wp-block-group"><!-- wp:heading {"textAlign":"center","level":1,"align":"wide","style":{"typography":{"lineHeight":"1.1"}}} --><h1 class="alignwide has-text-align-center" style="line-height:1.1">' . esc_html_x( 'Write a page title that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"30px"}}}} --><div class="wp-block-buttons" style="margin-top:30px"><!-- wp:button {"backgroundColor":"white","textColor":"black"} --><div class="wp-block-button"><a class="wp-block-button__link has-black-color has-white-background-color has-text-color has-background">' . esc_html_x( 'Learn more', 'Block pattern content', 'wd_s' ) . '</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group --></div></div><!-- /wp:cover -->',
	)
);



register_block_pattern(
	'wd_s/hero-cover-with-card',
	array(
		'title'      => __( 'Hero Cover with Card', 'wd_s' ),
		'categories' => array( 'hero' ),
		'content'    => '<!-- wp:cover {"url":"' . get_pattern_asset( 'wide.jpg' ) . '","dimRatio":0,"minHeight":70,"minHeightUnit":"vh","isDark":false,"align":"full"} -->
		<div class="wp-block-cover alignfull is-light" style="min-height:70vh"><span aria-hidden="true" class="has-background-dim-0 wp-block-cover__gradient-background has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="' . get_pattern_asset( 'wide.jpg' ) . '" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:group {"layout":{"inherit":true}} -->
		<div class="wp-block-group"><!-- wp:group {"backgroundColor":"base","textColor":"contrast"} --><div class="wp-block-group has-contrast-color has-base-background-color has-text-color has-background"><!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"textTransform":"uppercase"}},"fontSize":"small"} --><h1 class="has-text-align-center has-small-font-size" style="text-transform:uppercase">' . esc_html_x( 'Page title', 'Block pattern content', 'wd_s' ) . '</h1><!-- /wp:heading --><!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"top":"20px"}}}} --><h2 class="has-text-align-center" style="margin-top:20px">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --></div><!-- /wp:group --></div><!-- /wp:group --></div></div><!-- /wp:cover -->',
	)
);
