<?php
/**
 * Echo the copyright text saved in the Customizer.
 *
 * @package _s
 */

namespace WD_S\TemplateTags;

use WD_S\Hooks;

/**
 * Echo the copyright text saved in the Customizer.
 *
 * @author WebDevStudios
 */
function display_copyright_text() {
	// Grab our customizer settings.
	$copyright_text = get_theme_mod( '_s_copyright_text' );

	if ( $copyright_text ) {
		echo Hooks\get_the_content( do_shortcode( $copyright_text ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- XSS OK.
	}
}
