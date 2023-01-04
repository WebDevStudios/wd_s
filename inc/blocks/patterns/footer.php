<?php
/**
 * Footer block patterns.
 *
 * @package wd_s
 */

register_block_pattern(
	'wd_s/footer-inline-copyright-and-social-links',
	array(
		'title'      => __( 'Footer Inline: Copyright and Social Links', 'wd_s' ),
		'categories' => array( 'footer' ),
		'blockTypes' => array( 'core/template-part/footer' ),
		'content'    => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"45px","bottom":"45px"}},"color":{"background":"#f5f5f5"}},"textColor":"black","layout":{"inherit":true}} --><div class="wp-block-group has-black-color has-text-color has-background" style="background-color:#f5f5f5;padding-top:45px;padding-bottom:45px"><!-- wp:group {"align":"wide","layout":{"type":"flex","allowOrientation":false,"justifyContent":"space-between"}} --><div class="wp-block-group alignwide"><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">' . esc_html_x( '© 2022 Site Title. Made with wd_s.', 'Block pattern content', 'wd_s' ) . '</p><!-- /wp:paragraph --><!-- wp:social-links {"iconColor":"black","iconColorValue":"#000000","size":"has-small-icon-size","className":"is-style-logos-only","layout":{"type":"flex"},"style":{"spacing":{"blockGap":"20px"}},"twHover":"opacity"} --><ul class="wp-block-social-links has-small-icon-size has-icon-color is-style-logos-only tw-hover-opacity"><!-- wp:social-link {"url":"#","service":"twitter"} /--><!-- wp:social-link {"url":"#","service":"instagram"} /--><!-- wp:social-link {"url":"#","service":"facebook"} /--></ul><!-- /wp:social-links --></div><!-- /wp:group --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/footer-inline-2-rows',
	array(
		'title'      => __( 'Footer Inline: 2 Rows', 'wd_s' ),
		'categories' => array( 'footer' ),
		'blockTypes' => array( 'core/template-part/footer' ),
		'content'    => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"45px","bottom":"45px"}},"color":{"background":"#111111"}},"textColor":"white","layout":{"inherit":false}} --><div class="wp-block-group has-white-color has-text-color has-background" style="background-color:#111111;padding-top:45px;padding-bottom:45px"><!-- wp:group {"layout":{"type":"flex","allowOrientation":false,"justifyContent":"space-between"}} --><div class="wp-block-group"><!-- wp:site-title {"level":2,"isLink":false,"style":{"typography":{"lineHeight":"1.1"}},"fontSize":"large"} /--><!-- wp:social-links {"iconColor":"white","iconColorValue":"#ffffff","size":"has-small-icon-size","className":"is-style-logos-only","layout":{"type":"flex"},"style":{"spacing":{"blockGap":"20px"}},"twHover":"opacity"} --><ul class="wp-block-social-links has-small-icon-size has-icon-color is-style-logos-only tw-hover-opacity"><!-- wp:social-link {"url":"#","service":"twitter"} /--><!-- wp:social-link {"url":"#","service":"instagram"} /--><!-- wp:social-link {"url":"#","service":"facebook"} /--></ul><!-- /wp:social-links --></div><!-- /wp:group --><!-- wp:separator {"customColor":"#383838","className":"is-style-wide"} --><hr class="wp-block-separator has-text-color has-background is-style-wide" style="background-color:#383838;color:#383838"/><!-- /wp:separator --><!-- wp:group {"layout":{"type":"flex","allowOrientation":false,"justifyContent":"space-between"}} --><div class="wp-block-group"><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">' . esc_html_x( '© 2022 Site Title. Made with wd_s.', 'Block pattern content', 'wd_s' ) . '</p><!-- /wp:paragraph --><!-- wp:navigation {"overlayMenu":"never","fontSize":"small","style":{"spacing":{"blockGap":"32px"}} --><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- /wp:navigation --></div><!-- /wp:group --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/footer-stack-navigation',
	array(
		'title'      => __( 'Footer Stack: Navigation', 'wd_s' ),
		'categories' => array( 'footer' ),
		'blockTypes' => array( 'core/template-part/footer' ),
		'content'    => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"65px","bottom":"65px"}},"elements":{"link":{"color":{"text":"var:preset|color|black"}}},"color":{"background":"#f5f5f5"}},"textColor":"black","layout":{"inherit":true}} --><div class="wp-block-group has-black-color has-text-color has-background has-link-color" style="background-color:#f5f5f5;padding-top:65px;padding-bottom:65px"><!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","justifyContent":"center"}} --><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- /wp:navigation --><!-- wp:paragraph {"fontSize":"small","align":"center"} --><p class="has-small-font-size has-text-align-center">' . esc_html_x( '© 2022 Site Title. Made with wd_s.', 'Block pattern content', 'wd_s' ) . '</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/footer-2-columns-text-and-navigation',
	array(
		'title'      => __( 'Footer 2 Columns: Text and Navigation', 'wd_s' ),
		'categories' => array( 'footer' ),
		'blockTypes' => array( 'core/template-part/footer' ),
		'content'    => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"65px","bottom":"45px"},"blockGap":"60px"},"color":{"background":"#f5f5f5"}},"textColor":"black","layout":{"inherit":true}} --><div class="wp-block-group alignfull has-black-color has-text-color has-background" style="background-color:#f5f5f5;padding-top:65px;padding-bottom:45px"><!-- wp:columns {"align":"wide"} --><div class="wp-block-columns alignwide"><!-- wp:column --><div class="wp-block-column"><!-- wp:site-title {"isLink":false,"style":{"typography":{"lineHeight":"1.1"}},"fontSize":"large"} /--><!-- wp:paragraph --><p>16 Thompson Street<br>San Francisco, CA 94102</p><!-- /wp:paragraph --></div><!-- /wp:column --><!-- wp:column {"width":"200px"} --><div class="wp-block-column" style="flex-basis:200px"><!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","orientation":"vertical"},"style":{"spacing":{"blockGap":"12px"}}} --><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- /wp:navigation --></div><!-- /wp:column --></div><!-- /wp:columns --><!-- wp:group {"align":"wide","layout":{"type":"flex","allowOrientation":false}} --><div class="wp-block-group alignwide"><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">' . esc_html_x( '© 2022 Site Title. Made with wd_s.', 'Block pattern content', 'wd_s' ) . '</p><!-- /wp:paragraph --></div><!-- /wp:group --></div><!-- /wp:group -->',
	)
);
