<?php
/**
 * ELEMENT - Input
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
	'class'       => [ 'wds-element', 'wds-element-button' ],
	'type'        => 'text',
	'name'        => '',
	'value'       => '',
	'placeholder' => false,
	'disabled'    => false,
	'required'    => false,
];


$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Add ID for <label> tags.
if ( $wd_s_args['name'] ) :
	$wd_s_args['id'] = $wd_s_args['name'];
endif;

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'id', 'name', 'placeholder', 'class', 'type', 'disabled', 'required', 'value' ], $wd_s_args );

?>
<input <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>/>
