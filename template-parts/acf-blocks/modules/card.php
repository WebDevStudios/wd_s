<?php
/**
 * MODULE - Card.
 *
 * Modules are analagous to 'Molecules' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#molecules
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\print_module;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;

$wd_s_defaults = [
	'class'         => [ 'wds-module', 'wds-module-card' ],
	'eyebrow'       => false,
	'heading'       => false,
	'content'       => false,
	'button_text'   => false,
	'button_url'    => false,
	'attachment_id' => false,
	'src'           => false,
	'meta'          => false,
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );

?>
<div <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	// Image.
	if ( $wd_s_args['attachment_id'] || $wd_s_args['src'] ) :
		print_element(
			'image',
			[
				'attachment_id' => $wd_s_args['attachment_id'],
				'src'           => $wd_s_args['src'],
				'class'         => 'aspectratio-3-2',
			]
		);
	endif;

	// Eyebrow.
	if ( $wd_s_args['eyebrow'] ) :
		print_element(
			'eyebrow',
			[
				'text' => $wd_s_args['eyebrow'],
			]
		);
	endif;

	// Heading.
	if ( $wd_s_args['heading'] ) :
		print_element(
			'heading',
			[
				'text'  => $wd_s_args['heading'],
				'level' => 2,
			]
		);
	endif;

	// Meta - can be passed as an empty array.
	if ( is_array( $wd_s_args['meta'] ) ) :
		print_module( 'meta', $wd_s_args['meta'] );
	endif;

	// Content.
	if ( $wd_s_args['content'] ) :
		print_element(
			'content',
			[
				'content' => $wd_s_args['content'],
			]
		);
	endif;

	// Button.
	if ( $wd_s_args['button'] ) :
		print_element( 'button', $wd_s_args['button'] );
	endif;
	?>
</div>
