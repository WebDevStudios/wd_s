<?php
/**
 * Prints the footer block content.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Prints the footer block content.
 *
 * This function generates and prints the HTML content for the footer block in a WordPress theme.
 * It includes site information, copyright notice, and theme attribution.
 *
 * @return string The generated footer block content.
 *
 * @author WebDevStudios
 */
function print_footer_block() {
	// Determine whether to display site logo or site title.
	$site_info = has_custom_logo() ? '<!-- wp:site-logo {"align":"center"} /-->' : '<!-- wp:site-title {"textAlign":"center"} /-->';

	// Generate the copyright information.
	$copyright_info = esc_html__( ' Copyright &copy; ', 'wd_s' ) . esc_attr( gmdate( 'Y' ) ) . esc_html__( '. All Rights Reserved.', 'wd_s' );

	// Generate the theme attribution.
	$theme_info = esc_html__( ' Proudly powered by WordPress. ', 'wd_s' ) . '<a href="' . esc_url( 'https://webdevstudios.com/' ) . '">' . esc_html__( 'WebDevStudios', 'wd_s' ) . '</a>' . esc_html__( ' is a WD3 Party.', 'wd_s' );

	// Generate the footer block content.
	$footer_content = <<<HTML
    <!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
    <div class="wp-block-group alignwide">
        $site_info

        <!-- wp:paragraph {"align":"center","style":{"spacing":{"padding":{"top":"0","bottom":"0"},"margin":{"top":"var:preset|spacing|20","bottom":"0"}}},"fontSize":"small"} -->
        <p class="has-text-align-center has-small-font-size" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:0;padding-top:0;padding-bottom:0">$copyright_info</p>
        <!-- /wp:paragraph -->

        <!-- wp:paragraph {"align":"center","style":{"spacing":{"padding":{"top":"0","bottom":"0"},"margin":{"top":"var:preset|spacing|20","bottom":"0"}}},"fontSize":"small"} -->
        <p class="has-text-align-center has-small-font-size" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:0;padding-top:0;padding-bottom:0">$theme_info</p>
        <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->
    HTML;

	// Render the block content using do_blocks() function.
	$block_footer = do_blocks( $footer_content );

	return $block_footer;
}
