<?php
/**
 * ELEMENT - Icon
 *
 * Elements are analagous to 'Atoms' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#atoms
 *
 * @package ABS
 */

/**
 * Expected SVG Attributes are the same as for display_svg():
 *
 * 'color'        => '',
 * 'icon'         => '',
 * 'title'        => '',
 * 'desc'         => '',
 * 'stroke-width' => '',
 * 'height'       => '',
 * 'width'        => '',
 */

use function abs\functions\return_formatted_atts;
use function abs\functions\return_formatted_args;
use function abs\template_tags\display_svg;

$abs_defaults = [
	'class'    => [ 'abs-element', 'abs-element-icon' ],
	'svg_args' => [],
];

$abs_args = return_formatted_args( $args, $abs_defaults );

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class' ], $abs_args );

?>
<span <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php display_svg( $abs_args['svg_args'] ); ?></span>
