<?php
/**
 * Adds custom classes to apply to <main>
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Adds custom classes to apply to <main>
 *
 * @author WebDevStudios
 *
 * @param array $classes Classes for the <main> element.
 *
 * @return array main classes.
 */
function main_classes( $classes ) {
	$classes[] = 'site-main';

	if ( ! is_plugin_active( 'wds-acf-blocks/wds-acf-blocks.php' ) ) {
		$classes[] = 'container';
	}

	if ( is_single() || is_page_template( 'page-templates/scaffolding.php' ) || is_page_template( 'page-templates/sidebar-right.php' ) ) {
		$classes[] = 'container';
	}

	return implode( ' ', $classes );
}
