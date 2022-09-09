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

$wd_s_defaults = [
	'class'    => [ 'wds-element', 'wds-element-icon' ],
	'svg_args' => [],
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );

?>
<span <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php print_svg( $wd_s_args['svg_args'] ); ?></span>
