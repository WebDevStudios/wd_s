<?php
/**
 * Register the Quotes block.
 *
 * @package wd_s
 */

acf_register_block_type(
	[
		'name'            => 'quotes',
		'title'           => __( 'Quotes', 'wd_s' ),
		'description'     => __( 'A block used to show quotes.', 'wd_s' ),
		'render_template' => get_template_directory() . '/template-parts/blocks/quotes.php',
		'category'        => 'wd_s',
		'icon'            => 'format-quote',
		'keywords'        => [ 'quotes', 'block' ],
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
