<?php
/**
 * ELEMENT - Content
 *
 * Elements are analagous to 'Atoms' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#atoms
 *
 * @package ABS
 */

use function abs\functions\return_formatted_atts;
use function abs\functions\return_formatted_args;

$abs_defaults = [
	'class'   => [ 'abs-element', 'abs-element-content' ],
	'id'      => '',
	'content' => false,
];

$abs_args = return_formatted_args( $args, $abs_defaults );

// Make sure element should render.
if ( $abs_args['content'] ) :

	// Set up element attributes.
	$abs_atts = return_formatted_atts( [ 'class', 'id' ], $abs_args );

	?>
	<section <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php echo wp_kses_post( $abs_args['content'] ); ?></section>
<?php endif; ?>
