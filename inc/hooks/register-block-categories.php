<?php
/**
 * Register custom block category(ies).
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Register_wds_category
 *
 * @param array $categories block categories.
 * @return array $categories block categories.
 * @author Inna Gutnik <inna.Gutnik@webdevstudios.com>
 * @since  2023-05-30
 */
function register_wds_category( $categories ) {
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

add_filter( 'block_categories_all', __NAMESPACE__ . '\register_wds_category', 10, 1 );
