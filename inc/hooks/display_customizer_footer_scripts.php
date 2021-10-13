<?php
/**
 * Display the customizer footer scripts.
 *
 * @author Greg Rickaby
 *
 * @return string Footer scripts.
 *
 * @package _s
 */
function _s_display_customizer_footer_scripts() {
	// Check for footer scripts.
	$scripts = get_theme_mod( '_s_footer_scripts' );

	// None? Bail...
	if ( ! $scripts ) {
		return false;
	}

	// Otherwise, echo the scripts!
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- XSS OK.
	echo _s_get_the_content( $scripts );
}

add_action( 'wp_footer', '_s_display_customizer_footer_scripts', 999 );
