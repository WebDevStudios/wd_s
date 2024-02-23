<?php
/**
 * Register custom blocks for the WD_S theme.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Register Blocks
 *
 * @return void
 *
 * @author Jenna Hines
 * @since  2.0.0
 */
function acf_register_blocks() {
	$wds_acf_blocks = glob( ROOT_PATH . 'build/*/block.json' );

	foreach ( $wds_acf_blocks as $block ) {
		register_block_type( $block );
	}
}
add_action( 'init', __NAMESPACE__ . '\acf_register_blocks' );
