<?php
/**
 * ELEMENT - Select
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
	'class'    => [ 'wds-element', 'wds-element-select' ],
	'name'     => false,
	'value'    => false,
	'disabled' => false,
	'required' => false,
	'options'  => [],
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Add ID for <label> tags.
if ( $wd_s_args['name'] ) :
	$wd_s_args['id'] = $wd_s_args['name'];
endif;

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'id', 'name', 'class', 'disabled', 'required' ], $wd_s_args );

?>
<select <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php foreach ( $wd_s_args['options'] as $wd_s_option ) : ?>
		<option value='<?php echo esc_attr( $wd_s_option['value'] ); ?>' <?php echo $wd_s_args['value'] === $wd_s_option['value'] ? 'selected' : ''; ?>><?php echo esc_attr( $wd_s_option['text'] ); ?></option>
	<?php endforeach; ?>
</select>
