<?php
/**
 * Registers custom block pattern categories for the WD_S theme.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Registers custom block pattern categories for the WD_S theme.
 */
function wd_s_register_block_pattern_category() {

	register_block_pattern_category(
		'wds-patterns',
		[
			'label' => __( 'WDS Patterns', 'wd_s' ),
		]
	);
}
add_action( 'init', __NAMESPACE__ . '\wd_s_register_block_pattern_category', 9 );
