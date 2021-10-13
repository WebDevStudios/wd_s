<?php
/**
 * Echo the copyright text saved in the Customizer.
 *
 * @author WebDevStudios
 *
 * @package _s
 */
function _s_display_copyright_text() {
	// Grab our customizer settings.
	$copyright_text = get_theme_mod( '_s_copyright_text' );

	if ( $copyright_text ) {
		echo _s_get_the_content( do_shortcode( $copyright_text ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- XSS OK.
	}
}
