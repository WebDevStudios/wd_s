<?php
/**
 * Register a repeating Cards block.
 *
 * @package wd_s
 */

acf_register_block_type(
	[
		'name'            => 'cards-repeater',
		'title'           => __( 'Cards - Repeater', 'wd_s' ),
		'description'     => __( 'A block used to show Cards with a repeater used to insert content.', 'wd_s' ),
		'render_template' => get_template_directory() . '/template-parts/blocks/cards-repeater.php',
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
