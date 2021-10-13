<?php
/**
 * _s functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package _s
 */

/**
 * Get all the include files for the theme.
 *
 * @author WebDevStudios
 */
function _s_get_theme_include_files() {
	return [
		'inc/setup.php', // Theme set up. Should be included first.
		'inc/compat.php', // Backwards Compatibility.
		'inc/customizer/customizer.php', // Customizer additions.
		'inc/extras.php', // Custom functions that act independently of the theme templates.
		'inc/hooks.php', // Load custom filters and hooks.
		'inc/security.php', // WordPress hardening.
		'inc/scaffolding.php', // Scaffolding.
		'inc/scripts.php', // Load styles and scripts.
		'inc/template-tags/', // Custom template tags for this theme.
		'inc/functions/', // Custom template tags for this theme.
		'inc/post-types/', // Custom template tags for this theme.
	];
}

foreach ( _s_get_theme_include_files() as $include ) {
	$include = trailingslashit( get_template_directory() ) . $include;

	// Allows inclusion of individual files or all .php files in a directory.
	if ( is_dir( $include ) ) {
		foreach ( glob( $include . '*.php' ) as $file ) {
			require $file;
		}
	} else {
		require $include;
	}
}
