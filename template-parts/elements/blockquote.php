<?php
/**
 * ELEMENT - Blockquote
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
	'class' => [ 'wds-element', 'wds-element-blockquote' ],
	'id'    => '',
	'cite'  => false,
	'quote' => false,
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Make sure element should render.
if ( $wd_s_args['quote'] ) :

	// Set up element attributes.
	$wd_s_atts = get_formatted_atts( [ 'class', 'id' ], $wd_s_args );
	?>
	<blockquote>
		<p><?php echo esc_html( $wd_s_args['quote'] ); ?></p>
		<cite><?php echo esc_html( $wd_s_args['cite'] ); ?></cite>
	</blockquote>
<?php endif; ?>
