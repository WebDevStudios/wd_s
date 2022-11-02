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
		'heading'   => 'core/heading',
		'paragraph' => 'core/paragraph',
		'html'      => 'core/html',
		'list'      => 'core/list',
	];

	foreach ( $blocks_to_wrap as $block_class => $block_name ) {
		if ( $block_name === $block['blockName'] ) {
			$block_content = '<span class="wp-block-' . $block_class . '">' . $block_content . '</span>';
		}
	}

	// The core/freeform block doesn't have a block name. So we need to check for null to wrap it...
	if ( null === $block['blockName'] && ! empty( $block_content ) && ! ctype_space( $block_content ) ) {
		$block_content = '<span class="wp-block-freeform">' . $block_content . '</span>';
	}

	return $block_content;
}

add_filter( 'render_block', __NAMESPACE__ . '\wrap_core_blocks', 10, 2 );
