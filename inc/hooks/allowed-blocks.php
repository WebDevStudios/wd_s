<?php
/**
 * Specify which blocks are allowed.
 *
 * @package ABS
 */

namespace WebDevStudios\wd_s;

/**
 * Specify which blocks are allowed.
 *
 * @author WebDevStudios
 *
 * @param array $wd_s_allowed_blocks Current list of allowed blocks.
 *
 * @return array Allowed block types.
 */
function allowed_blocks( $wd_s_allowed_blocks ) {

	$wd_s_allowed_blocks = [
		'core/columns',
		'core/freeform',
		'core/gallery',
		'core/heading',
		'core/html',
		'core/image',
		'core/list',
		'core/paragraph',
		'core/separator',
		'core/spacer',
		'core/table',
	];

	// Add ACF blocks.
	$wd_s_acf_blocks = acf_get_block_types();

	foreach ( array_keys( $wd_s_acf_blocks ) as $wd_s_block_name ) :
		$wd_s_allowed_blocks[] = $wd_s_block_name;
	endforeach;

	return $wd_s_allowed_blocks;
}

// Filter changed at WordPress 5.8.
// See https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#allowed_block_types_all .
$wd_s_block_filter_name = class_exists( 'WP_Block_Editor_Context' ) ? 'allowed_block_types_all' : 'allowed_block_types';

// add_filter( $wd_s_block_filter_name, __NAMESPACE__ . '\allowed_blocks', 99 );.
