<?php
/**
 * Returns an array of classes from a block's Gutenberg fields.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Returns an updated array of classes.
 *
 * @author WebDevStudios
 *
 * @param array $classes Array of classes from block defaults.
 * @param array $block Array of block attributes.
 *
 * return array The updated array of classes.
 */
function get_block_classes( $block ) {
	$wd_s_block_classes = [];

	if ( ! empty( $block['className'] ) ) :
		$wd_s_block_classes[] = $block['className'];
	endif;

	if ( ! empty( $block['backgroundColor'] ) ) {
		$wd_s_block_classes[] = 'has-background';
		$wd_s_block_classes[] = 'has-' . $block['backgroundColor'] . '-background-color';
	}

	if ( ! empty( $block['textColor'] ) ) {
		$wd_s_block_classes[] = 'has-text-color';
		$wd_s_block_classes[] = 'has-' . $block['textColor'] . '-color';
	}

	return $wd_s_block_classes;
}
