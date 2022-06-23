<?php
/**
 * Register the 3 Cards block.
 *
 * @package wd_s
 */

acf_register_block_type(
	[
		'name'            => 'cards-manual',
		'title'           => __( 'Cards - Manual', 'wd_s' ),
		'description'     => __( 'A block used to show 3 Cards with manually inserted content.', 'wd_s' ),
		'render_template' => get_template_directory() . '/template-parts/blocks/cards-manual.php',
		'category'        => 'wd_s',
		'icon'            => 'images-alt',
		'keywords'        => [ 'cards', 'block' ],
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
