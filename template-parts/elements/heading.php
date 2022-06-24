<?php
/**
 * ELEMENT - Heading
 *
 * Elements are analagous to 'Atoms' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#atoms
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;

$abs_defaults = [
	'class' => [ 'abs-element', 'abs-element-heading' ],
	'id'    => '',
	'text'  => false,
	'level' => 2,
];

$abs_args = get_formatted_args( $args, $abs_defaults );

// Make sure element should render.
if ( $abs_args['text'] ) :

	// Set up element attributes.
	$abs_atts = get_formatted_atts( [ 'class', 'id' ], $abs_args );
	?>
	<h<?php echo esc_attr( $abs_args['level'] ); ?> <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php echo esc_html( $abs_args['text'] ); ?></h<?php echo esc_attr( $abs_args['level'] ); ?>>
<?php endif; ?>
