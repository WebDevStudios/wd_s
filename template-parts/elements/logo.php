<?php
/**
 * ELEMENT - Logo.
 *
 * Elements are analagous to 'Atoms' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#atoms
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;
use function WebDevStudios\wd_s\get_attachment_id_from_url;

$abs_defaults = [
	'class'     => [ 'abs-element', 'abs-element-logo' ],
	'logo_name' => '',
	'loading'   => 'eager',
	'alt'       => get_bloginfo( 'name' ) . ' logo',
];

$abs_args = get_formatted_args( $args, $abs_defaults );

// Set up element attributes.
$abs_logo_atts = [];

foreach ( [ 'loading', 'alt' ] as $abs_att ) :
	if ( $abs_args[ $abs_att ] ) :
		$abs_logo_atts[ $abs_att ] = $abs_args[ $abs_att ];
	endif;
endforeach;

// Get the logo id.
if ( ! $abs_args['logo_name'] ) :
	$abs_logo_id = get_theme_mod( 'custom_logo' );
else :
	$abs_logo_id = get_attachment_id_from_url( get_theme_mod( $abs_args['logo_name'] ) );
endif;

// Set up logo class.
$abs_atts = get_formatted_atts( [ 'class' ], $abs_args );
?>

<span <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	echo wp_get_attachment_image(
		$abs_logo_id,
		'fullsize',
		false,
		$abs_logo_atts
	);
	?>
</span>
