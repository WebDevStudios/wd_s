<?php
/**
 * Register custom block category(ies).
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Reorders the block categories and adds a custom block category for 'page' post type.
 *
 * @param {array} $categories - The existing array of block categories.
 * @returns {array} - The modified array of block categories.
 *
 * @author JC Palmes <jc@webdevstudios.com>
 * @since  2023-06-02
 */
function reorder_block_categories( $categories ) {
	$custom_block_category = [
		'slug'  => __( 'wds-blocks-category', 'wd_s' ),
		'title' => __( 'WDS Blocks', 'wd_s' ),
	];

	$categories_sorted    = [];
	$categories_sorted[0] = $custom_block_category;

	foreach ( $categories as $category ) {
		$categories_sorted[] = $category;
	}

	return $categories_sorted;
}
add_filter( 'block_categories_all', __NAMESPACE__ . '\reorder_block_categories', 10, 2 );
