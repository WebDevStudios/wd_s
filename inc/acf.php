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
		'background_type'  => get_sub_field( 'background_type' ),
		'font_color'       => get_sub_field( 'font_color' ),
		'container'        => 'section',
		'class'            => 'content-block',
		'custom_css_class' => get_sub_field( 'custom_css_class' ),
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	$inline_style = '';

	if ( '' !== $args['font_color'] ) {
		$inline_style .= 'color: ' . $args['font_color'] . ';';
	}

	// Deal with the background settings, if available.
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

		if ( 'video' === $args['background_type']['value'] ) {
			$background_video = get_sub_field( 'background_video' );
			$background_video_markup = '<video class="video-as-background" autoplay muted loop preload="auto"><source src="' . esc_url( $background_video['url'] ) . '" type="video/mp4"></video>';
		}

		if ( 'none' === $args['background_type']['value'] ) {
			$args['class'] .= ' no-background';
		}
	}

	// Print the opening container and any inline styles.
	printf( '<%s class="%s %s" style="%s">', esc_html( $args['container'] ), esc_attr( $args['class'] ), esc_attr( $args['custom_css_class'] ), esc_attr( $inline_style ) );

	// If video is chosen, add the video markup immediately below opening container.
	if ( 'video' === $args['background_type']['value'] ) {
		echo $background_video_markup; // WPCS XSS OK.
	}
}
