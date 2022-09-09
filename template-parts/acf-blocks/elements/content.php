<?php
/**
 * ELEMENT - Content
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
	'class'   => [ 'wds-element', 'wds-element-content' ],
	'id'      => '',
	'content' => false,
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Make sure element should render.
if ( $wd_s_args['content'] ) :

	// Set up element attributes.
	$wd_s_atts = get_formatted_atts( [ 'class', 'id' ], $wd_s_args );

	?>
	<section <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php echo wp_kses_post( $wd_s_args['content'] ); ?></section>
<?php endif; ?>
