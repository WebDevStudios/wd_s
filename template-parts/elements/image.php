<?php
/**
 * ELEMENT - Image
 *
 * Elements are analagous to 'Atoms' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#atoms
 *
 * @package ABS
 */

use function abs\functions\return_attachment_id_from_url;
use function abs\functions\return_formatted_atts;
use function abs\functions\return_formatted_args;

$abs_defaults = [
	'class'         => [ 'abs-element', 'abs-element-image' ],
	'attachment_id' => false,
	'src'           => false,
	'size'          => 'large',
	'loading'       => 'lazy',
	'alt'           => '',
];

$abs_args = return_formatted_args( $args, $abs_defaults );

// Determine whether to use wp_get_attachment_image or img tag.
$abs_args['attachment_id'] = $abs_args['attachment_id'] ? $abs_args['attachment_id'] : return_attachment_id_from_url( $abs_args['src'] );

if ( $abs_args['attachment_id'] ) :

	// Get the alt attribute from the image if it is empty.
	if ( ! $abs_args['alt'] ) :
		$abs_args['alt'] = get_post_meta( $abs_args['attachment_id'], '_wp_attachment_image_alt', true );
	endif;

	// Set up element attributes.
	$abs_atts = [];

	foreach ( [ 'loading', 'alt' ] as $abs_att ) :
		if ( $abs_args[ $abs_att ] ) :
			$abs_atts[ $abs_att ] = $abs_args[ $abs_att ];
		endif;
	endforeach;

	// Add classes.
	if ( count( $abs_args['class'] ) ) :
		$abs_atts['class'] = implode( ' ', $abs_args['class'] );
	endif;

	echo wp_get_attachment_image(
		$abs_args['attachment_id'],
		$abs_args['size'],
		false,
		$abs_atts,
	);

else :
	// Set up element attributes.
	$abs_atts = return_formatted_atts( [ 'class', 'src', 'loading', 'alt' ], $abs_args );
	?>
	<img <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>/>
	<?php
endif;
