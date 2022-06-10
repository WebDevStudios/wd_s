<?php
/**
 * MODULE - Call to Action
 *
 * Modules are analagous to 'Molecules' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#molecules
 *
 * @package ABS
 */

use function abs\functions\render_element;
use function abs\functions\return_formatted_atts;
use function abs\functions\return_formatted_args;

$abs_defaults = [
	'class'        => [ 'abs-module', 'abs-module-cta' ],
	'eyebrow'      => false,
	'heading_args' => false,
	'button'       => false,
];

$abs_args = return_formatted_args( $args, $abs_defaults );

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class' ], $abs_args );

?>
<div <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	// Eyebrow.
	if ( $abs_args['eyebrow'] ) :
		render_element(
			'eyebrow',
			[
				'text' => $abs_args['eyebrow'],
			]
		);
	endif;

	// Heading.
	if ( $abs_args['heading_args'] ) :
		render_element( 'heading', $abs_args['heading_args'] );
	endif;

	// Button.
	if ( $abs_args['button'] ) :
		render_element(
			'button',
			$abs_args['button']
		);
	endif;
	?>
</div>
