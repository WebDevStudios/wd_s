<?php
/**
 * Custom ACF functions.
 *
 * A place to custom functionality related to Advanced Custom Fields.
 *
 * @package _s
 */

/**
 * Loop through and output ACF flexible content blocks for the current page.
 */
function _s_display_content_blocks() {
	if ( have_rows( 'content_blocks' ) ) :
		while ( have_rows( 'content_blocks' ) ) : the_row();
			get_template_part( 'template-parts/content-blocks/block', get_row_layout() ); // Template part name MUST match layout ID.
		endwhile;
		wp_reset_postdata();
	endif;
}

/**
 * Associate the possible block options with the appropriate section.
 *
 * @param  array $args Possible arguments.
 */
function _s_display_block_options( $args = array() ) {

	// Setup defaults.
	$defaults = array(
		'background_type' => get_sub_field( 'background_type' ),
		'font_color'      => get_sub_field( 'font_color' ),
		'container'       => 'section',
		'class'           => 'content-block',
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	$inline_style = '';

	if ( '' !== $args['font_color'] ) {
		$inline_style = 'color: ' . $args['font_color'] . ';';
	}

	// Only try to get the rest of the settings if the background type is set to anything.
	if ( $args['background_type'] ) {
		if ( 'color' === $args['background_type']['value'] ) {
			$background_color = get_sub_field( 'background_color' );
			$inline_style .= 'background-color: ' . $background_color . ';';
		}

		if ( 'image' === $args['background_type']['value'] ) {
			$background_image = get_sub_field( 'background_image' );
			$inline_style .= 'background-image: url(' . esc_url( $background_image['sizes']['full-width'] ) . ');';
			$args['class'] .= ' image-as-background';
		}

		if ( 'none' === $args['background_type']['value'] ) {
			$args['class'] .= ' no-background';
		}
	}

	printf( '<%s class="%s" style="%s">', esc_html( $args['container'] ), esc_attr( $args['class'] ), esc_attr( $inline_style ) );
}
