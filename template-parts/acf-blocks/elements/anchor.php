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

$wd_s_defaults = [
	'class'  => [ 'wds-element', 'wds-element-anchor' ],
	'text'   => false,
	'href'   => false,
	'target' => false,
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Make sure element should render.
if ( $wd_s_args['href'] && $wd_s_args['text'] ) :

	// Set up element attributes.
	$wd_s_atts = get_formatted_atts( [ 'href', 'target', 'class' ], $wd_s_args );

	?>
	<a <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php echo esc_html( $wd_s_args['text'] ); ?></a>

<?php endif; ?>
