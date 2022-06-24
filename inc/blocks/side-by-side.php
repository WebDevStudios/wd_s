<?php
/**
 * Register the Side by Side block.
 *
 * @package wd_s
 */

acf_register_block_type(
	[
		'name'            => 'side-by-side',
		'title'           => __( 'Side by Side', 'wd_s' ),
		'description'     => __( 'A block used to show side by side content.', 'wd_s' ),
		'render_template' => get_template_directory() . '/template-parts/blocks/side-by-side.php',
		'category'        => 'wd_s',
		'icon'            => 'columns',
		'keywords'        => [ 'side by side', 'block' ],
		'mode'            => 'edit',
		'supports'        => [
			'align' => false,
		],
		'example'         => [
			'attributes' => [
				'mode' => 'preview',
				'data' => [
					'_is_preview' => 'true',
				],
			],
		],
	]
);
