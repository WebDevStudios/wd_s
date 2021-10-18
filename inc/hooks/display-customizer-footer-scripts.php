<?php
/**
 * Display the customizer footer scripts.
 *
 * @package _s
 */

/**
 * Display the customizer footer scripts.
 *
 * @author Greg Rickaby
 *
 * @return string Footer scripts.
 */

namespace WD_S\Hooks;

function display_customizer_footer_scripts() {
	// Check for footer scripts.
	$scripts = get_theme_mod( '_s_footer_scripts' );

	// None? Bail...
	if ( ! $scripts ) {
		return false;
	}

	// Otherwise, echo the scripts!
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- XSS OK.
	echo get_the_content( $scripts );
}

add_action( 'wp_footer', 'WD_S\Hooks\display_customizer_footer_scripts', 999 );
