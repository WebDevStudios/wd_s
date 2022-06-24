<?php
/**
 * ELEMENT - Anchor
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
	'class'  => [ 'abs-element', 'abs-element-anchor' ],
	'text'   => false,
	'href'   => false,
	'target' => false,
];

$abs_args = get_formatted_args( $args, $abs_defaults );

// Make sure element should render.
if ( $abs_args['href'] && $abs_args['text'] ) :

	// Set up element attributes.
	$abs_atts = get_formatted_atts( [ 'href', 'target', 'class' ], $abs_args );

	?>
	<a <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php echo esc_html( $abs_args['text'] ); ?></a>

<?php endif; ?>
