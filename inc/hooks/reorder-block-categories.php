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
 * @param {array}  $categories - The existing array of block categories.
 * @param {object} $post - The post object being edited.
 * @returns {array} - The modified array of block categories.
 *
 * @author JC Palmes <jc@webdevstudios.com>
 * @since  2023-06-02
 */
function reorder_block_categories( $categories, $post ) {
	if ( 'page' !== $post->post_type ) {
		return $categories;
	}

	$wds_block_category = [
		'slug'  => 'wds-blocks-category',
		'title' => __( 'WDS Blocks', 'wd_s' ),
	];

	array_unshift( $categories, $wds_block_category );
	return $categories;
}
add_filter( 'block_categories', __NAMESPACE__ . '\reorder_block_categories', 10, 2 );
