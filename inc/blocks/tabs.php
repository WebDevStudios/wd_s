<?php
/**
 * Register the Tabs block.
 *
 * @package wd_s
 */

acf_register_block_type(
	[
		'name'            => 'tabs',
		'title'           => __( 'Tabs', 'wd_s' ),
		'description'     => __( 'A block used to show an Tabs and Content.', 'wd_s' ),
		'render_template' => get_template_directory() . '/template-parts/blocks/tabs.php',
		'category'        => 'wd_s',
		'icon'            => 'open-folder',
		'keywords'        => [ 'tabs', 'block' ],
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
