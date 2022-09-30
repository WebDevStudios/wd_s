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
 * @param array $new_classes Classes for the <main> element.
 *
 * @return array main classes.
 */
function main_classes( $new_classes ) {

	$classes = [ 'site-main' ];

	if ( ! is_plugin_active( 'wds-acf-blocks/wds-acf-blocks.php' ) || is_single() || is_page_template( 'page-templates/scaffolding.php' ) || is_page_template( 'page-templates/sidebar-right.php' ) ) {
		$classes[] = 'container';
	}

	if ( ! empty( $new_classes ) ) {
		$classes = array_merge( $classes, $new_classes );
	}

	$classes = apply_filters( 'wd_s_main_classes', $classes );

	return implode( ' ', $classes );
}
