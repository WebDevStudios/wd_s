<?php
/**
 * Display the customizer header scripts.
 *
 * @package _s
 */

/**
 * Display the customizer header scripts.
 *
 * @author Greg Rickaby
 *
 * @return string Header scripts.
 */
function _s_display_customizer_header_scripts() {
	// Check for header scripts.
	$scripts = get_theme_mod( '_s_header_scripts' );

	// None? Bail...
	if ( ! $scripts ) {
		return false;
	}

	// Otherwise, echo the scripts!
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- XSS OK.
	echo _s_get_the_content( $scripts );
}

add_action( 'wp_head', '_s_display_customizer_header_scripts', 999 );
