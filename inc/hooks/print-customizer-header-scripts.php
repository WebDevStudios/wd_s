<?php
/**
 * Display the customizer header scripts.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Display the customizer header scripts.
 *
 * @author Greg Rickaby
 *
 * @return string Header scripts.
 */
function print_customizer_header_scripts() {
	// Check for header scripts.
	$scripts = get_theme_mod( 'wd_s_header_scripts' );

	// None? Bail...
	if ( ! $scripts ) {
		return false;
	}

	// Otherwise, echo the scripts!
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- XSS OK.
	echo get_post_content( $scripts );
}

add_action( 'wp_head', __NAMESPACE__ . '\print_customizer_header_scripts', 999 );
