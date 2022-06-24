<?php
/**
 * Merges the element defaults with the passed args.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Merges the element defaults with the passed args.
 *
 * @author WebDevStudios
 *
 * @param array $args Array of settings passed to the element.
 * @param array $defaults Array of default settings for the element.
 */
function get_formatted_args( $args = [], $defaults ) {

	// Set the 'class' array key if it doesn't exist.
	$args['class'] = array_key_exists( 'class', $args ) ? $args['class'] : [];

	// Allow class to be passed as a string or an array.
	$args['class'] = ( $args['class'] && ! is_array( $args['class'] ) ) ? explode( ' ', $args['class'] ) : $args['class'];

	// Merge with defaults.
	$classes = is_array( $args['class'] ) ? array_merge( $defaults['class'], $args['class'] ) : $defaults['class'];

	$formatted_args = wp_parse_args( $args, $defaults );

	$formatted_args['class'] = $classes;

	return $formatted_args;
}
