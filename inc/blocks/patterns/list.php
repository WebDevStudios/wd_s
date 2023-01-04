<?php
/**
 * List block patterns.
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\get_pattern_asset;

register_block_pattern(
	'wd_s/list-and-text-aligned',
	array(
		'title'      => __( 'List and Text Aligned', 'wd_s' ),
		'categories' => array( 'list' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra.</p><!-- /wp:paragraph --><!-- wp:list --><ul><li>Integer enim risus suscipit eu iaculis</li><li>Quisque lorem sapien, egestas sed venenatis</li><li>Aliquam tempus mi nulla porta luctus nec congue velit</li><li>Sed non neque at lectus bibendum blandit</li></ul><!-- /wp:list --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/list-and-heading-on-left',
	array(
		'title'      => __( 'List and Heading on Left', 'wd_s' ),
		'categories' => array( 'list' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":"48px"}},"twStack":"md","twVerticalGap":"small"} --><div class="wp-block-columns alignwide tw-cols-stack-md tw-row-gap-small"><!-- wp:column --><div class="wp-block-column"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:list {"ordered":true,"className":"is-style-tw-border-inner tw-list-spacing-medium"} --><ol class="is-style-tw-border-inner tw-list-spacing-medium"><li>Lorem ipsum dolor sit amet, commodo erat adipiscing</li><li>Integer enim risus suscipit eu iaculis sed ullamcorper</li><li>Aliquam tempus mi nulla porta luctus</li><li>Duis enim elit, porttitor id feugiat at blandit at erat</li><li>Fusce sed magna eu ligula commodo hendrerit ac purus</li></ol><!-- /wp:list --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/emphasized-list-and-heading-on-left',
	array(
		'title'      => __( 'Emphasized List and Heading on Left', 'wd_s' ),
		'categories' => array( 'list' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":"48px"}},"twStack":"md"} --><div class="wp-block-columns alignwide are-vertically-aligned-center tw-cols-stack-md"><!-- wp:column {"verticalAlignment":"center"} --><div class="wp-block-column is-vertically-aligned-center"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore. Integer enim risus suscipit eu iaculis sed, ullamcorper at metus.</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"verticalAlignment":"center"} --><div class="wp-block-column is-vertically-aligned-center"><!-- wp:group {"backgroundColor":"white","textColor":"black","twDecoration":"shadow"} --><div class="wp-block-group has-black-color has-white-background-color has-text-color has-background tw-shadow"><!-- wp:list {"className":"is-style-tw-checkmark tw-list-spacing-loose"} --><ul class="is-style-tw-checkmark tw-list-spacing-loose"><li>Integer enim risus suscipit eu iaculis</li><li>Quisque lorem sapien egestas sed venenatis</li><li>Aliquam tempus mi nulla porta luctus</li><li>Sed non neque at lectus bibendum blandit</li><li>Proin varius libero sit amet tortor volutpat diam</li></ul><!-- /wp:list --></div><!-- /wp:group --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/list-and-image-on-left',
	array(
		'title'      => __( 'List and Image on Left', 'wd_s' ),
		'categories' => array( 'list' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:media-text {"mediaType":"image","twStackedMd":true} --><div class="wp-block-media-text alignwide is-stacked-on-mobile tw-stack-md"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'square1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading --><h2>' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore.</p><!-- /wp:paragraph --><!-- wp:list --><ul><li>Integer enim risus suscipit eu iaculis</li><li>Quisque lorem sapien, egestas sed venenatis</li><li>Aliquam tempus mi nulla porta luctus</li><li>Sed non neque at lectus bibendum blandit</li></ul><!-- /wp:list --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/bold-list-and-image-on-left',
	array(
		'title'      => __( 'Bold List and Image on Left', 'wd_s' ),
		'categories' => array( 'list' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:media-text {"mediaType":"image","twStackedMd":true} --><div class="wp-block-media-text alignwide is-stacked-on-mobile tw-stack-md"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:list {"className":"is-style-tw-checkmark tw-list-spacing-loose"} --><ul class="is-style-tw-checkmark tw-list-spacing-loose"><li><strong>Lorem ipsum dolor sit amet</strong><br>Sed do eiusmod ut tempor incididunt ut labore et dolore.</li><li><strong>Integer enim risus</strong><br>Venenatis nec convallis magna eu congue velit. Fusce sed magna eu ligula commodo hendrerit fringilla.</li><li><strong>Aliquam tempus mi nulla porta luctus</strong><br>Duis enim elit porttitor id feugiat at blandit at erat.</li></ul><!-- /wp:list --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/alternating-list-and-image',
	array(
		'title'      => __( 'Alternating List and Image', 'wd_s' ),
		'categories' => array( 'list' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:media-text {"mediaType":"image","mediaWidth":48,"imageFill":false,"twStackedMd":true} --><div class="wp-block-media-text alignwide is-stacked-on-mobile tw-stack-md" style="grid-template-columns:48% auto"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} --><h3>' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit. Sed do eiusmod ut tempor incididunt ut labore et dolore.</p><!-- /wp:paragraph --><!-- wp:list --><ul><li>Proin varius libero sit amet tortor volutpat diam</li><li>Venenatis nec convallis magna eu congue velit</li><li>Duis enim elit porttitor id feugiat blandit</li></ul><!-- /wp:list --></div></div><!-- /wp:media-text --><!-- wp:media-text {"mediaPosition":"right","mediaType":"image","mediaWidth":48,"imageFill":false,"twStackedMd":true} --><div class="wp-block-media-text alignwide has-media-on-the-right is-stacked-on-mobile tw-stack-md" style="grid-template-columns:auto 48%"><figure class="wp-block-media-text__media"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><div class="wp-block-media-text__content"><!-- wp:heading {"level":3} --><h3>' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed ullamcorper at metus. Venenatis nec convallis magna eu congue velit.</p><!-- /wp:paragraph --><!-- wp:list --><ul><li>Aliquam tempus mi eu nulla porta luctus</li><li>Fusce sed magna eu ligula commodo</li><li>Mauris dui tellus mollis quis varius amet ultrices</li></ul><!-- /wp:list --></div></div><!-- /wp:media-text --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/lists-2-columns',
	array(
		'title'      => __( 'Lists: 2 Columns', 'wd_s' ),
		'categories' => array( 'list' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:columns {"style":{"spacing":{"blockGap":"48px"}}} --><div class="wp-block-columns"><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit.</p><!-- /wp:paragraph --><!-- wp:list {"className":"is-style-tw-dash"} --><ul class="is-style-tw-dash"><li>Venenatis convallis</li><li>Sed eiusmod</li><li>Integer enim</li><li>Aliquam tempus</li><li>Sed non neque</li></ul><!-- /wp:list --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed, ullamcorper at metus.</p><!-- /wp:paragraph --><!-- wp:list {"className":"is-style-tw-dash"} --><ul class="is-style-tw-dash"><li>Morbi fringilla</li><li>Duis enim elit</li><li>Proin varius libero</li><li>Fusce magna</li></ul><!-- /wp:list --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/lists-3-columns',
	array(
		'title'      => __( 'Lists: 3 Columns', 'wd_s' ),
		'categories' => array( 'list' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:columns {"align":"wide","twStack":"md-2"} --><div class="wp-block-columns alignwide tw-cols-stack-md-2"><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Lorem ipsum dolor sit amet, commodo erat adipiscing elit tempor.</p><!-- /wp:paragraph --><!-- wp:list {"className":"is-style-tw-arrow"} --><ul class="is-style-tw-arrow"><li>Venenatis convallis</li><li>Sed eiusmod</li><li>Integer enim</li><li>Aliquam tempus </li></ul><!-- /wp:list --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Integer enim risus suscipit eu iaculis sed, ullamcorper at metus.</p><!-- /wp:paragraph --><!-- wp:list {"className":"is-style-tw-arrow"} --><ul class="is-style-tw-arrow"><li>Sed non neque</li><li>Morbi fringilla</li><li>Duis enim elit</li><li>Proin varius libero</li></ul><!-- /wp:list --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Third item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Aliquam tempus mi nulla porta luctus. Sed non neque at lectus bibendum.</p><!-- /wp:paragraph --><!-- wp:list {"className":"is-style-tw-arrow"} --><ul class="is-style-tw-arrow"><li>Fusce magna</li><li>Integer sagittis</li><li>Mauris dui tellus</li><li>Class aptent </li></ul><!-- /wp:list --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/lists-3-columns-with-border',
	array(
		'title'      => __( 'Lists: 3 Columns with Border', 'wd_s' ),
		'categories' => array( 'list' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading that captivates your audience', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:columns {"align":"wide","twStack":"md-2","style":{"spacing":{"blockGap":"48px"}}} --><div class="wp-block-columns alignwide tw-cols-stack-md-2"><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:list {"className":"is-style-tw-border-inner"} --><ul class="is-style-tw-border-inner"><li>Venenatis convallis</li><li>Sed eiusmod</li><li>Integer enim</li><li>Aliquam tempus</li></ul><!-- /wp:list --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:list {"className":"is-style-tw-border-inner"} --><ul class="is-style-tw-border-inner"><li>Sed non neque</li><li>Morbi fringilla</li><li>Duis enim elit</li><li>Proin varius libero</li></ul><!-- /wp:list --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Third item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:list {"className":"is-style-tw-border-inner"} --><ul class="is-style-tw-border-inner"><li>Fusce magna</li><li>Integer sagittis</li><li>Mauris dui tellus</li><li>Class aptent</li></ul><!-- /wp:list --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/lists-4-columns-with-image',
	array(
		'title'      => __( 'Lists: 4 Columns with Image', 'wd_s' ),
		'categories' => array( 'list' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Write a heading', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:columns {"align":"wide","twStack":"md-2"} --><div class="wp-block-columns alignwide tw-cols-stack-md-2"><!-- wp:column --><div class="wp-block-column"><!-- wp:image --><figure class="wp-block-image"><img src="' . get_pattern_asset( 'landscape1.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'First item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:list --><ul><li>Venenatis convallis</li><li>Sed eiusmod</li><li>Integer enim</li><li>Aliquam tempus </li></ul><!-- /wp:list --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:image --><figure class="wp-block-image"><img src="' . get_pattern_asset( 'landscape2.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Second item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:list --><ul><li>Sed non neque</li><li>Morbi fringilla</li><li>Duis enim elit</li><li>Proin varius libero </li></ul><!-- /wp:list --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:image --><figure class="wp-block-image"><img src="' . get_pattern_asset( 'landscape3.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Third item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:list --><ul><li>Fusce magna</li><li>Integer sagittis</li><li>Mauris dui tellus</li><li>Class aptent </li></ul><!-- /wp:list --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:image --><figure class="wp-block-image"><img src="' . get_pattern_asset( 'landscape4.jpg' ) . '" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3,"fontSize":"large"} --><h3 class="has-large-font-size">' . esc_html_x( 'Fourth item', 'Block pattern content', 'wd_s' ) . '</h3><!-- /wp:heading --><!-- wp:list --><ul><li>Rhoncus justo </li><li>Amet velit</li><li>Erat vitae</li><li>Maecenas convallis </li></ul><!-- /wp:list --></div><!-- /wp:column --></div><!-- /wp:columns --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/inline-list',
	array(
		'title'      => __( 'Inline List', 'wd_s' ),
		'categories' => array( 'list', 'logos' ),
		'content'    => '<!-- wp:group {"align":"full","layout":{"inherit":true}} --><div class="wp-block-group alignfull"><!-- wp:heading {"textAlign":"center"} --><h2 class="has-text-align-center">' . esc_html_x( 'Our clients', 'Block pattern content', 'wd_s' ) . '</h2><!-- /wp:heading --><!-- wp:list {"className":"has-text-align-center is-style-tw-inline","fontSize":"large"} --><ul class="has-text-align-center is-style-tw-inline has-large-font-size"><li>Airbnb</li><li>Apple</li><li>Dropbox</li><li>Figma</li><li>Github</li><li>Google</li><li>LinkedIn</li><li>Microsoft</li><li>Netflix</li><li>Slack</li><li>Spotify</li><li>Twitter</li><li>Uber</li><li>Zoom</li></ul><!-- /wp:list --></div><!-- /wp:group -->',
	)
);
