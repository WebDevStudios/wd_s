<?php
/**
 * Header block patterns.
 *
 * @package wd_s
 */

register_block_pattern(
	'wd_s/full-width-header-with-border',
	array(
		'title'      => __( 'Full Width Header with Border', 'wd_s' ),
		'categories' => array( 'header' ),
		'blockTypes' => array( 'core/template-part/header' ),
		'content'    => '<!-- wp:group {"style":{"border":{"bottom":{"style":"solid","width":"1px","color":"#d6d6d6"}},"spacing":{"padding":{"top":"30px","bottom":"30px"}}},"layout":{"inherit":true},"backgroundColor":"background"} --><div class="wp-block-group has-background-background-color has-background" style="border-bottom-color:#d6d6d6;border-bottom-style:solid;border-bottom-width:1px;padding-top:30px;padding-bottom:30px"><!-- wp:group {"align":"full","layout":{"type":"flex","allowOrientation":false,"justifyContent":"space-between"}} --><div class="wp-block-group alignfull"><!-- wp:site-title {"fontSize":"large","style":{"typography":{"fontStyle":"normal","fontWeight":"600","lineHeight":"1.1"},"elements":{"link":{"color":{"text":"var:preset|color|constrast"}}}},"className":"tw-link-no-underline"} /--><!-- wp:navigation {"textColor":"constrast","style":{"spacing":{"blockGap":"32px"}},"twBreakpoint":"tablet"} --><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:social-links {"iconColor":"constrast","iconColorValue":"var(--wp--preset--color--constrast)","size":"has-small-icon-size","className":"is-style-logos-only","layout":{"type":"flex"},"style":{"spacing":{"blockGap":"20px"}},"twHover":"opacity"} --><ul class="wp-block-social-links has-small-icon-size has-icon-color is-style-logos-only tw-hover-opacity"><!-- wp:social-link {"url":"#","service":"twitter"} /--><!-- wp:social-link {"url":"#","service":"instagram"} /--></ul><!-- /wp:social-links --><!-- /wp:navigation --></div><!-- /wp:group --></div><!-- /wp:group -->',
	)
);

register_block_pattern(
	'wd_s/wide-width-header-with-shadow',
	array(
		'title'      => __( 'Wide Width Header with Shadow', 'wd_s' ),
		'categories' => array( 'header' ),
		'blockTypes' => array( 'core/template-part/header' ),
		'content'    => '<!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px"}}},"backgroundColor":"background","layout":{"inherit":true},"twDecoration":"shadow"} --><div class="wp-block-group has-background-background-color has-background tw-shadow" style="padding-top:30px;padding-bottom:30px"><!-- wp:group {"align":"wide","layout":{"type":"flex","allowOrientation":false,"justifyContent":"space-between"}} --><div class="wp-block-group alignwide"><!-- wp:site-title {"fontSize":"large","style":{"typography":{"fontStyle":"normal","fontWeight":"600","lineHeight":"1.1"},"elements":{"link":{"color":{"text":"var:preset|color|constrast"}}}},"className":"tw-link-no-underline"} /--><!-- wp:navigation {"textColor":"constrast","style":{"spacing":{"blockGap":"32px"}},"twBreakpoint":"tablet"} --><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- wp:navigation-link {"isTopLevelLink":true} /--><!-- /wp:navigation --></div><!-- /wp:group --></div><!-- /wp:group -->',
	)
);
