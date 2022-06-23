<?php
/**
 * ELEMENT - Icon
 *
 * Elements are analagous to 'Atoms' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#atoms
 *
 * @package wd_s
 */

/**
 * Expected SVG Attributes are the same as for print_svg():
 *
 * 'color'        => '',
 * 'icon'         => '',
 * 'title'        => '',
 * 'desc'         => '',
 * 'stroke-width' => '',
 * 'height'       => '',
 * 'width'        => '',
 */

use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;
use function WebDevStudios\wd_s\print_svg;

$abs_defaults = [
	'class'    => [ 'abs-element', 'abs-element-icon' ],
	'svg_args' => [],
];

$abs_args = get_formatted_args( $args, $abs_defaults );

// Set up element attributes.
$abs_atts = get_formatted_atts( [ 'class' ], $abs_args );

?>
<span <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php print_svg( $abs_args['svg_args'] ); ?></span>
