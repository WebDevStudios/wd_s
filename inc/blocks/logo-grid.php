<?php
/**
 * Register the Logo Grid block.
 *
 * @package wd_s
 */

acf_register_block_type(
	[
		'name'            => 'logo-grid',
		'title'           => __( 'Logo Grid', 'wd_s' ),
		'description'     => __( 'A block used to show a logo grid.', 'wd_s' ),
		'render_template' => get_template_directory() . '/template-parts/blocks/logo-grid.php',
		'category'        => 'wd_s',
		'icon'            => 'grid-view',
		'keywords'        => [ 'logo grid', 'block' ],
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
