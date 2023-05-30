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

	$categories[] = array(
		'slug'  => 'wds-blocks-category',
		'title' => 'WDS Blocks',
	);

	return $categories;
}

add_filter( 'block_categories_all', __NAMESPACE__ . '\register_wds_category', 10, 1 );
