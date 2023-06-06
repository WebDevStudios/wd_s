<?php
/**
 * Re-order block categories
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Change_block_category_order
 *
 * @param array   $categories An array of block categories.
 * @param WP_Post $post The post object being edited.
 * @return array The modified array of block categories.
 * @author JC Palmes <jc@webdevstudios.com>
 * @since 2023-06-02
 */
function change_block_category_order( $categories, $post ) {
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
add_filter( 'block_categories', __NAMESPACE__ . '\change_block_category_order', 10, 2 );
