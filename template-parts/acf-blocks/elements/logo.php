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

$wd_s_defaults = [
	'class'     => [ 'wds-element', 'wds-element-logo' ],
	'logo_name' => '',
	'loading'   => 'eager',
	'alt'       => get_bloginfo( 'name' ) . ' logo',
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Set up element attributes.
$wd_s_logo_atts = [];

foreach ( [ 'loading', 'alt' ] as $wd_s_att ) :
	if ( $wd_s_args[ $wd_s_att ] ) :
		$wd_s_logo_atts[ $wd_s_att ] = $wd_s_args[ $wd_s_att ];
	endif;
endforeach;

// Get the logo id.
if ( ! $wd_s_args['logo_name'] ) :
	$wd_s_logo_id = get_theme_mod( 'custom_logo' );
else :
	$wd_s_logo_id = get_attachment_id_from_url( get_theme_mod( $wd_s_args['logo_name'] ) );
endif;

// Set up logo class.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );
?>

<span <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	echo wp_get_attachment_image(
		$wd_s_logo_id,
		'fullsize',
		false,
		$wd_s_logo_atts
	);
	?>
</span>
