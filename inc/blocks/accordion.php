<?php
/**
 * Register the Accordion block.
 *
 * @package wd_s
 */

acf_register_block_type(
	[
		'name'            => 'accordion',
		'title'           => __( 'Accordion', 'wd_s' ),
		'description'     => __( 'A block used to show an Accordion.', 'wd_s' ),
		'render_template' => get_template_directory() . '/template-parts/blocks/accordion.php',
		'category'        => 'wd_s',
		'icon'            => 'table-row-before',
		'keywords'        => [ 'accordion', 'block' ],
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
