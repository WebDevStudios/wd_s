<?php
/**
 * Removes or Adjusts the prefix on category archive page titles.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Removes or Adjusts the prefix on category archive page titles.
 *
 * @author Corey Collins
 *
 * @param string $block_title The default $block_title of the page.
 *
 * @return string The updated $block_title.
 */
function remove_archive_title_prefix( $block_title ) {
	// Get the single category title with no prefix.
	$single_cat_title = single_term_title( '', false );

	if ( is_category() || is_tag() || is_tax() ) {
		return esc_html( $single_cat_title );
	}

	return $block_title;
}

add_filter( 'get_the_archive_title', __NAMESPACE__ . '\remove_archive_title_prefix' );
