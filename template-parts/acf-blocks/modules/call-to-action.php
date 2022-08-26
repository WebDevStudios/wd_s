<?php
/**
 * MODULE - Call to Action
 *
 * Modules are analagous to 'Molecules' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#molecules
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;

$wd_s_defaults = [
	'class'        => [ 'wds-module', 'wds-module-cta' ],
	'eyebrow'      => false,
	'heading_args' => false,
	'button'       => false,
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );

?>
<div <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
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
	if ( $wd_s_args['heading_args'] ) :
		print_element( 'heading', $wd_s_args['heading_args'] );
	endif;

	// Button.
	if ( $wd_s_args['button'] ) :
		print_element(
			'button',
			$wd_s_args['button']
		);
	endif;
	?>
</div>
