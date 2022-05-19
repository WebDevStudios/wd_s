<?php
/**
 * Echo the copyright text saved in the Customizer.
 *
 * @package _s
 */

namespace WebDevStudios\wd_s\TemplateTags;

use function WD_S\Hooks\get_the_content;

/**
 * Echo the copyright text saved in the Customizer.
 *
 * @author WebDevStudios
 */
function display_copyright_text() {
	// Grab our customizer settings.
	$copyright_text = get_theme_mod( '_s_copyright_text' );

	if ( $copyright_text ) {
		echo get_the_content( do_shortcode( $copyright_text ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- XSS OK.
	}
}
