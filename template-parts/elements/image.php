<?php
/**
 * ELEMENT - Image
 *
 * Elements are analagous to 'Atoms' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#atoms
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\get_attachment_id_from_url;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;

$wd_s_defaults = [
	'class'         => [ 'wds-element', 'wds-element-image' ],
	'attachment_id' => false,
	'src'           => false,
	'size'          => 'large',
	'loading'       => 'lazy',
	'alt'           => '',
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Determine whether to use wp_get_attachment_image or img tag.
$wd_s_args['attachment_id'] = $wd_s_args['attachment_id'] ? $wd_s_args['attachment_id'] : get_attachment_id_from_url( $wd_s_args['src'] );

if ( $wd_s_args['attachment_id'] ) :

	// Get the alt attribute from the image if it is empty.
	if ( ! $wd_s_args['alt'] ) :
		$wd_s_args['alt'] = get_post_meta( $wd_s_args['attachment_id'], '_wp_attachment_image_alt', true );
	endif;

	// Set up element attributes.
	$wd_s_atts = [];

	foreach ( [ 'loading', 'alt' ] as $wd_s_att ) :
		if ( $wd_s_args[ $wd_s_att ] ) :
			$wd_s_atts[ $wd_s_att ] = $wd_s_args[ $wd_s_att ];
		endif;
	endforeach;

	// Add classes.
	if ( count( $wd_s_args['class'] ) ) :
		$wd_s_atts['class'] = implode( ' ', $wd_s_args['class'] );
	endif;

	echo wp_get_attachment_image(
		$wd_s_args['attachment_id'],
		$wd_s_args['size'],
		false,
		$wd_s_atts
	);

else :
	// Set up element attributes.
	$wd_s_atts = get_formatted_atts( [ 'class', 'src', 'loading', 'alt' ], $wd_s_args );
	?>
	<img <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>/>
	<?php
endif;
