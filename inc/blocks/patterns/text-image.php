<?php
/**
 * Text & image block patterns.
 *
 * @package wd_s
 * @phpcs:disable Squiz.Strings.DoubleQuoteUsage.NotRequired
 */

use function WebDevStudios\wd_s\get_pattern_asset;

register_block_pattern(
	'wd_s/text-and-image-on-left',
	array(
		'title'      => __( 'Text and Image on Left', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:media-text {"mediaType":"image","twStackedMd":true} --><div class="wp-block-media-text alignwide is-stacked-on-mobile tw-stack-md"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus, suscipit eu iaculis sed ullamcorper.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/text-and-image-on-right',
	array(
		'title'      => __( 'Text and Image on Right', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:media-text {"mediaPosition":"right","mediaType":"image","twStackedMd":true} --><div class="wp-block-media-text alignwide has-media-on-the-right is-stacked-on-mobile tw-stack-md"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus, suscipit eu iaculis sed ullamcorper.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/alternating-text-and-image',
	array(
		'title'      => __( 'Alternating Text and Image', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:media-text {"mediaType":"image","mediaWidth":48,"imageFill":false,"twStackedMd":true} --><div class="wp-block-media-text alignwide is-stacked-on-mobile tw-stack-md" style="grid-template-columns:48% auto"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed ullamcorper.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --><!-- wp:media-text {"mediaPosition":"right","mediaType":"image","mediaWidth":48,"imageFill":false,"twStackedMd":true} --><div class="wp-block-media-text alignwide has-media-on-the-right is-stacked-on-mobile tw-stack-md" style="grid-template-columns:auto 48%"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading --><h2>' . esc_html_x( 'Write another heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed ullamcorper at metus. Venenatis nec convallis magna eu congue velit. Proin varius libero sit amet tortor volutpat diam tincidunt.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/text-and-image-alternating-colored-backgrounds',
	array(
		'title'      => __( 'Text and Image: Alternating Colored Backgrounds', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"backgroundColor":"background","align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull has-background-background-color has-background"><!-- wp:media-text {"mediaType":"image","mediaWidth":48,"twStackedMd":true} --><div class="wp-block-media-text alignwide is-stacked-on-mobile tw-stack-md" style="grid-template-columns:48% auto"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed ullamcorper.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --></div><!-- /wp:group --><!-- wp:group {"backgroundColor":"tertiary","align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull has-tertiary-background-color has-background"><!-- wp:media-text {"mediaPosition":"right","mediaType":"image","mediaWidth":48,"twStackedMd":true} --><div class="wp-block-media-text alignwide has-media-on-the-right is-stacked-on-mobile tw-stack-md" style="grid-template-columns:auto 48%"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading --><h2>' . esc_html_x( 'Write another heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed ullamcorper at metus. Venenatis nec convallis magna eu congue velit. Proin varius libero sit amet tortor volutpat diam tincidunt.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/text-and-overlap-image',
	array(
		'title'      => __( 'Text and Overlap Image', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:media-text {"backgroundColor":"tertiary","mediaType":"image","mediaWidth":56,"className":"is-style-tw-overlap"} --><div class="wp-block-media-text alignwide has-background has-tertiary-background-color is-stacked-on-mobile is-style-tw-overlap" style="grid-template-columns:56% auto"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'square1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"fontSize":"x-large"} --><h2 class="has-x-large-font-size">' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit iaculis sed ullamcorper metus.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --><!-- wp:media-text {"backgroundColor":"tertiary","mediaPosition":"right","mediaType":"image","mediaWidth":56,"className":"is-style-tw-overlap"} --><div class="wp-block-media-text alignwide has-media-on-the-right has-background has-tertiary-background-color is-stacked-on-mobile is-style-tw-overlap" style="grid-template-columns:auto 56%"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'square2.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"fontSize":"x-large"} --><h2 class="has-x-large-font-size">' . esc_html_x( 'Write another heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Aliquam tempus mi nulla porta luctus. Sed non neque at lectus bibendum blandit. Morbi fringilla sapien libero. Duis enim elit porttitor id feugiat at blandit at erat.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/text-and-wide-image',
	array(
		'title'      => __( 'Text and Wide Image', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus, suscipit eu iaculis sed, ullamcorper at metus. Venenatis nec convallis magna congue. </p><!-- /wp:paragraph --><!-- wp:paragraph --><p>Aliquam tempus mi nulla porta luctus. Sed non neque at lectus bibendum blandit. Morbi fringilla sapien libero. Duis enim elit portitor id feugiat erat.</p><!-- /wp:paragraph --><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'wide.jpg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/text-and-circle-image',
	array(
		'title'      => __( 'Text and Circle Image', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:image {"align":"center","width":160,"height":160,"className":"is-style-rounded"} --><div class="wp-block-image is-style-rounded"><figure class="aligncenter is-resized"><img src="' . get_pattern_asset( 'square1.jpg' ) . '" alt="" width="160" height="160"/></figure></div><!-- /wp:image --><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph {"align":"center"} --><p class="has-text-align-center">Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus, suscipit eu iaculis sed, ullamcorper at metus. Venenatis nec convallis magna congue. </p><!-- /wp:paragraph --><!-- wp:paragraph {"align":"center"} --><p class="has-text-align-center">Aliquam tempus mi nulla porta luctus. Sed non neque at lectus bibendum blandit. Morbi fringilla sapien libero. Duis enim elit portitor id feugiat erat.</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/heading-cover-and-text',
	array(
		'title'      => __( 'Heading Cover and Text', 'wd_s' ),
		'categories' => array( 'text-image', 'cover' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:cover {"url":"' . get_pattern_asset( 'wide.jpg' ) . '","dimRatio":60,"minHeight":500,"align":"wide"} --><div class="wp-block-cover alignwide" style="min-height:500px"><span aria-hidden="true" class="has-background-dim-60 wp-block-cover__gradient-background has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="' . get_pattern_asset( 'wide.jpg' ) . '" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:group {"layout":{"inherit":true}} --><div class="wp-block-group"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --></div><!-- /wp:group --></div></div><!-- /wp:cover --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra. Venenatis nec convallis magna, eu congue velit. Aliquam tempus mi nulla porta luctus. Sed non neque at lectus bibendum blandit.</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/text-columns-and-image-at-the-bottom',
	array(
		'title'      => __( 'Text Columns and Image at the Bottom', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"48px"}},"twStack":"md","twVerticalGap":"small"} --><div class="wp-block-columns alignwide tw-cols-stack-md tw-row-gap-small"><!-- wp:column --><div class="wp-block-column"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus. Class aptent taciti sociosqu ad litora torquent per conubia. Maecenas laoreet sem tellus in fermentum.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'wide.jpg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/text-columns-and-image-at-the-top',
	array(
		'title'      => __( 'Text Columns and Image at the Top', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'wide.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"48px"}},"twStack":"md","twVerticalGap":"small"} --><div class="wp-block-columns alignwide tw-cols-stack-md tw-row-gap-small"><!-- wp:column --><div class="wp-block-column"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus. Class aptent taciti sociosqu ad litora torquent per conubia. Maecenas laoreet sem tellus in fermentum.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/text-and-image-full-width',
	array(
		'title'      => __( 'Text and Image: Full Width', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:media-text {"align":"full","backgroundColor":"background","mediaPosition":"right","mediaType":"image","imageFill":true,"twStackedMd":true} --><div class="wp-block-media-text alignfull has-media-on-the-right has-background has-background-background-color is-stacked-on-mobile is-image-fill tw-stack-md"><figure class="wp-block-media-text__media" style="background-image:url(' . get_pattern_asset( 'landscape1.jpg' ) . ');background-position:50% 50%"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:group {"layout":{"inherit":true}} --><div class="wp-block-group"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra.</p><!-- /wp:paragraph --></div><!-- /wp:group --></div></div><!-- /wp:media-text -->',
	)
);

register_block_pattern(
	'wd_s/alternating-text-and-image-full-width',
	array(
		'title'      => __( 'Alternating Text and Image: Full Width', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:media-text {"align":"full","backgroundColor":"background","mediaType":"image","imageFill":true,"twStackedMd":true} --><div class="wp-block-media-text alignfull has-background has-background-background-color is-stacked-on-mobile is-image-fill tw-stack-md"><figure class="wp-block-media-text__media" style="background-image:url(' . get_pattern_asset( 'landscape1.jpg' ) . ');background-position:50% 50%"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:group {"layout":{"inherit":true}} --><div class="wp-block-group"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed ullamcorper at metus.</p><!-- /wp:paragraph --></div><!-- /wp:group --></div></div><!-- /wp:media-text --><!-- wp:media-text {"align":"full","backgroundColor":"tertiary","mediaPosition":"right","mediaType":"image","imageFill":true,"twStackedMd":true} --><div class="wp-block-media-text alignfull has-media-on-the-right has-background has-tertiary-background-color is-stacked-on-mobile is-image-fill tw-stack-md"><figure class="wp-block-media-text__media" style="background-image:url(' . get_pattern_asset( 'landscape2.jpg' ) . ');background-position:50% 50%"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:group {"layout":{"inherit":true}} --><div class="wp-block-group"><!-- wp:heading --><h2>' . esc_html_x( 'Write another heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed ullamcorper at metus. Venenatis nec convallis magna eu congue velit. Proin varius libero sit amet tortor volutpat diam tincidunt.</p><!-- /wp:paragraph --></div><!-- /wp:group --></div></div><!-- /wp:media-text -->',
	)
);

register_block_pattern(
	'wd_s/text-and-image-fullscreen',
	array(
		'title'      => __( 'Text and Image: Fullscreen', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:media-text {"align":"full","backgroundColor":"background","mediaPosition":"right","mediaType":"image","imageFill":true,"className":"tw-height-full","twStackedMd":true} --><div class="wp-block-media-text alignfull has-media-on-the-right has-background has-background-background-color is-stacked-on-mobile is-image-fill tw-height-full tw-stack-md"><figure class="wp-block-media-text__media" style="background-image:url(' . get_pattern_asset( 'square1.jpg' ) . ');background-position:50% 50%"><img src="' . get_pattern_asset( 'square1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:group {"layout":{"inherit":true}} --><div class="wp-block-group"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph {"align":"center"} --><p class="has-text-align-center">Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus, suscipit eu iaculis sed, ullamcorper at metus. Venenatis nec convallis magna congue.</p><!-- /wp:paragraph --></div><!-- /wp:group --></div></div><!-- /wp:media-text -->',
	)
);

register_block_pattern(
	'wd_s/heading-with-alternating-text-and-image',
	array(
		'title'      => __( 'Heading with Alternating Text and Image', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:media-text {"mediaType":"image","mediaWidth":48} --><div class="wp-block-media-text alignwide is-stacked-on-mobile" style="grid-template-columns:48% auto"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} --><h3>' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed ullamcorper at metus.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --><!-- wp:media-text {"mediaPosition":"right","mediaType":"image","mediaWidth":48} --><div class="wp-block-media-text alignwide has-media-on-the-right is-stacked-on-mobile" style="grid-template-columns:auto 48%"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} --><h3>' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed ullamcorper at metus. Venenatis nec convallis magna eu congue velit. Proin varius libero sit amet tortor volutpat diam tincidunt.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/horizontal-cards',
	array(
		'title'      => __( 'Horizontal Cards', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:media-text {"mediaType":"image","imageFill":true,"className":"is-style-tw-shadow"} --><div class="wp-block-media-text alignwide is-stacked-on-mobile is-image-fill is-style-tw-shadow"><figure class="wp-block-media-text__media" style="background-image:url(' . get_pattern_asset( 'landscape1.jpg' ) . ');background-position:50% 50%"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} --><h3>' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed ullamcorper metus.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --><!-- wp:media-text {"mediaType":"image","imageFill":true,"className":"is-style-tw-shadow"} --><div class="wp-block-media-text alignwide is-stacked-on-mobile is-image-fill is-style-tw-shadow"><figure class="wp-block-media-text__media" style="background-image:url(' . get_pattern_asset( 'landscape2.jpg' ) . ');background-position:50% 50%"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} --><h3>' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed ullamcorper at metus. Venenatis nec convallis magna eu congue velit. Proin varius libero sit amet tortor volutpat diam tincidunt.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/list-with-text-and-image-on-right',
	array(
		'title'      => __( 'List with Text and Image on Right', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:columns {"style":{"spacing":{"blockGap":"24px"}}} --><div class="wp-block-columns"><!-- wp:column {"width":"70%"} --><div class="wp-block-column" style="flex-basis:70%"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed ullamcorper at metus. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"width":"30%"} --><div class="wp-block-column" style="flex-basis:30%"><!-- wp:image --><figure class="wp-block-image"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:column --></div><!-- /wp:columns --><!-- wp:separator {"className":"tw-mt-6 tw-mb-6 is-style-wide"} --><hr class="wp-block-separator tw-mt-6 tw-mb-6 is-style-wide"/><!-- /wp:separator --><!-- wp:columns {"style":{"spacing":{"blockGap":"24px"}}} --><div class="wp-block-columns"><!-- wp:column {"width":"70%"} --><div class="wp-block-column" style="flex-basis:70%"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Venenatis nec convallis magna, eu congue velit. Aliquam tempus mi nulla porta luctus. Sed non neque at lectus bibendum blandit. Cras eget mi tellus. Sed hendrerit purus.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"width":"30%"} --><div class="wp-block-column" style="flex-basis:30%"><!-- wp:image --><figure class="wp-block-image"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:column --></div><!-- /wp:columns --><!-- wp:separator {"className":"tw-mt-6 tw-mb-6 is-style-wide"} --><hr class="wp-block-separator tw-mt-6 tw-mb-6 is-style-wide"/><!-- /wp:separator --><!-- wp:columns {"style":{"spacing":{"blockGap":"24px"}}} --><div class="wp-block-columns"><!-- wp:column {"width":"70%"} --><div class="wp-block-column" style="flex-basis:70%"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Third item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Duis enim elit, porttitor id feugiat at, blandit at erat. Proin varius libero sit amet tortor volutpat diam laoreet. Fusce sed magna eu ligula commodo hendrerit fringilla ac purus.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"width":"30%"} --><div class="wp-block-column" style="flex-basis:30%"><!-- wp:image --><figure class="wp-block-image"><img src="' . get_pattern_asset( 'landscape3.jpg' ) . '" alt=""/></figure><!-- /wp:image --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/list-with-text-and-image-on-left',
	array(
		'title'      => __( 'List with Text and Image on Left', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:columns {"style":{"spacing":{"blockGap":"24px"}}} --><div class="wp-block-columns"><!-- wp:column {"width":"20%"} --><div class="wp-block-column" style="flex-basis:20%"><!-- wp:image {"width":120,"height":80} --><figure class="wp-block-image is-resized"><img src="' . get_pattern_asset( 'illustration1.svg' ) . '" alt="" width="120" height="80"/></figure><!-- /wp:image --></div><!-- /wp:column --><!-- wp:column {"width":"80%"} --><div class="wp-block-column" style="flex-basis:80%"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed ullamcorper at metus. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --><!-- wp:separator {"className":"tw-mt-6 tw-mb-6 is-style-wide"} --><hr class="wp-block-separator tw-mt-6 tw-mb-6 is-style-wide"/><!-- /wp:separator --><!-- wp:columns {"style":{"spacing":{"blockGap":"24px"}}} --><div class="wp-block-columns"><!-- wp:column {"width":"20%"} --><div class="wp-block-column" style="flex-basis:20%"><!-- wp:image {"width":120,"height":80} --><figure class="wp-block-image is-resized"><img src="' . get_pattern_asset( 'illustration2.svg' ) . '" alt="" width="120" height="80"/></figure><!-- /wp:image --></div><!-- /wp:column --><!-- wp:column {"width":"80%"} --><div class="wp-block-column" style="flex-basis:80%"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Venenatis nec convallis magna, eu congue velit. Aliquam tempus mi nulla porta luctus. Sed non neque at lectus bibendum blandit. Cras eget mi tellus. Sed hendrerit purus quam, vel finibus dui eleifend at.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --><!-- wp:separator {"className":"tw-mt-6 tw-mb-6 is-style-wide"} --><hr class="wp-block-separator tw-mt-6 tw-mb-6 is-style-wide"/><!-- /wp:separator --><!-- wp:columns {"style":{"spacing":{"blockGap":"24px"}}} --><div class="wp-block-columns"><!-- wp:column {"width":"20%"} --><div class="wp-block-column" style="flex-basis:20%"><!-- wp:image {"width":120,"height":80} --><figure class="wp-block-image is-resized"><img src="' . get_pattern_asset( 'illustration3.svg' ) . '" alt="" width="120" height="80"/></figure><!-- /wp:image --></div><!-- /wp:column --><!-- wp:column {"width":"80%"} --><div class="wp-block-column" style="flex-basis:80%"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Third item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Duis enim elit, porttitor id feugiat at, blandit at erat. Proin varius libero sit amet tortor volutpat diam laoreet. Fusce sed magna eu ligula commodo hendrerit fringilla ac purus.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/small-headings-and-image-on-left',
	array(
		'title'      => __( 'Small headings and Image on Left', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:media-text {"mediaType":"image","imageFill":false,"twStackedMd":true} --><div class="wp-block-media-text alignwide is-stacked-on-mobile tw-stack-md"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'square1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed ullamcorper at metus. Sed do eiusmod ut tempor incididunt ut labore et dolore.</p><!-- /wp:paragraph --><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Venenatis nec convallis magna, eu congue velit. Aliquam tempus mi nulla porta luctus. Sed non neque at lectus bibendum blandit.</p><!-- /wp:paragraph --><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Third item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Duis enim elit, porttitor id feugiat at, blandit at erat. Proin varius libero sit amet tortor volutpat diam laoreet.</p><!-- /wp:paragraph --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/2-text-columns-and-image',
	array(
		'title'      => __( '2 Text Columns and Image', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'wide.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"48px"}}} --><div class="wp-block-columns alignwide"><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus, suscipit eu iaculis sed ullamcorper at metus. Venenatis nec convallis magna, eu congue velit. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus. Proin varius libero sit amet tortor volutpat.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/3-text-columns-and-image/',
	array(
		'title'      => __( '3 Text Columns and Image', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:image {"align":"wide"} --><figure class="wp-block-image alignwide"><img src="' . get_pattern_asset( 'wide.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:columns {"align":"wide","twStack":"md-2"} --><div class="wp-block-columns alignwide tw-cols-stack-md-2"><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus, suscipit eu iaculis sed, ullamcorper at metus. Venenatis nec convallis magna, eu congue velit.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Third item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Aliquam tempus mi nulla porta luctus. Sed non neque at lectus bibendum blandit. Morbi fringilla sapien libero.</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/2-captioned-images',
	array(
		'title'      => __( '2 Captioned Images', 'wd_s' ),
		'categories' => array( 'text-image' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:columns {"align":"wide","className":"tw-mb-6"} --><div class="wp-block-columns alignwide tw-mb-6"><!-- wp:column --><div class="wp-block-column"><!-- wp:image --><figure class="wp-block-image"><img src="' . get_pattern_asset( 'square1.jpg' ) . '" alt=""/><figcaption>Aliquam tempus mi nulla</figcaption></figure><!-- /wp:image --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:image --><figure class="wp-block-image"><img src="' . get_pattern_asset( 'square2.jpg' ) . '" alt=""/><figcaption>Integer enim risus suscipit</figcaption></figure><!-- /wp:image --></div><!-- /wp:column --></div><!-- /wp:columns --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra.</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
	)
);
