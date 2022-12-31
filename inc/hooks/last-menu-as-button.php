<?php
/**
 * Convert last main navigation item to button
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Convert last main navigation item to button
 *
 * @author Thong Dang
 *
 * @param array  $items navigation item.
 * @param object $args navigation arguments.
 *
 * @return array main classes.
 */
function filter_primary_nav_menu_objects( $items, $args ) {
	$has_button = get_theme_mod( 'wd_s_convert_last_menu_item_to_button' );

	if ( 'primary' === $args->theme_location && $has_button ) {
		foreach ( $items as $index => &$item ) {
			if ( $has_button && count( $items ) === $index ) {
				$item->classes[] = 'menu-button';
			}
		}
	}
	return $items;
}

add_filter( 'wp_nav_menu_objects', __NAMESPACE__ . '\filter_primary_nav_menu_objects', 10, 2 );
