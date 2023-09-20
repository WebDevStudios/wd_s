<?php
/**
 * Prints the header block content.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Generates the header block content.
 *
 * This function generates the HTML content for the header block in a WordPress theme.
 * It includes site title and navigation.
 *
 * @return string The generated header block content.
 */
function print_header_block() {
	// Determine whether to display site logo or site title.
	$site_logo = has_custom_logo() ? '<!-- wp:site-logo /-->' : '<!-- wp:site-title /-->';

	$header_content = <<<HTML
	<!-- wp:group {"align":"full","layout":{"type":"constrained"}} -->
	<div class="wp-block-group alignfull">
		<!-- wp:columns {"verticalAlignment":"center","isStackedOnMobile":false,"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
		<div class="wp-block-columns alignwide are-vertically-aligned-center is-not-stacked-on-mobile" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
			<!-- wp:column {"verticalAlignment":"center","width":"100%"} -->
			<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:100%">
				$site_logo
			</div>
			<!-- /wp:column -->

			<!-- wp:column {"verticalAlignment":"center","width":"100%"} -->
			<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:100%">
				<!-- wp:navigation {"ref":540,"layout":{"type":"flex","setCascadingProperties":true,"justifyContent":"right"},"style":{"spacing":{"blockGap":"var:preset|spacing|60"}}} /-->
			</div>
			<!-- /wp:column -->
		</div>
		<!-- /wp:columns -->
	</div>
	<!-- /wp:group -->
HTML;

	// Render the block content using do_blocks() function.
	$block_header = do_blocks( $header_content );

	return $block_header;
}
