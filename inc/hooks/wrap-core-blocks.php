<?php
/**
 * Wrap core blocks with a class.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Wrap core blocks with a wp-block-* class.
 *
 * Not all core blocks have these classes. This function will add these classes
 * to core blocks that don't have them.
 *
 * @author WebDevStudios
 *
 * @param string $block_content The content of the block (what will render).
 * @param string $block         The block's name.
 */
function wrap_core_blocks( $block_content, $block ) {

	$blocks_to_wrap = [
		// Use associative array.
		[ 'core/heading', 'heading' ],
		[ 'core/paragraph', 'paragraph' ],
		[ 'core/html', 'html' ],
		[ 'core/list', 'list' ],
	];

	foreach ( $blocks_to_wrap as $block_to_wrap ) {
		if ( $block_to_wrap[0] === $block['blockName'] ) {
			$block_content = '<span class="wp-block-' . $block_to_wrap[1] . '">' . $block_content . '</span>';
		}
	}

	if ( null === $block['blockName'] ) {
		$block_content = '<span class="wp-block-freeform">' . $block_content . '</span>';
	}

	return $block_content;
}

add_filter( 'render_block', __NAMESPACE__ . '\wrap_core_blocks', 10, 2 );
