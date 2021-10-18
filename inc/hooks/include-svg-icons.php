<?php
/**
 * Add SVG definitions to footer.
 *
 * @package _s
 */

namespace WD_S\Hooks;

/**
 * Add SVG definitions to footer.
 *
 * @author WebDevStudios
 */
function include_svg_icons() {
	// Define SVG sprite file.
	$svg_icons = get_template_directory() . '/build/images/icons/sprite.svg';

	// If it exists, include it.
	if ( file_exists( $svg_icons ) ) {
		echo '<div class="svg-sprite-wrapper">';
		require_once $svg_icons;
		echo '</div>';
	}
}

add_action( 'wp_footer', 'WD_S\Hooks\include_svg_icons', 9999 );
