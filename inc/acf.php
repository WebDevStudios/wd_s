<?php
/**
 * Custom ACF functions.
 *
 * A place to custom functionality related to Advanced Custom Fields.
 *
 * @package _s
 */

// If ACF isn't activated, then bail.
if ( ! class_exists( 'acf' ) ) {
	return false;
}

/**
 * Loop through and output ACF flexible content blocks for the current page.
 */
function _s_display_content_blocks() {
	if ( have_rows( 'content_blocks' ) ) :
		while ( have_rows( 'content_blocks' ) ) :
			the_row();
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

	// Get block background options.
	$background_options = get_sub_field( 'background_options' ) ? get_sub_field( 'background_options' ) : get_field( 'background_options' )['background_options'];

	// Get block other options.
	$other_options = get_sub_field( 'other_options' ) ? get_sub_field( 'other_options' ) : get_field( 'other_options' )['other_options'];

	// Setup defaults.
	$defaults = array(
		'background_type'  => $background_options['background_type']['value'],
		'font_color'       => $other_options['font_color'],
		'container'        => 'section',
		'class'            => 'content-block',
		'custom_css_class' => $other_options['custom_css_class'],
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	$inline_style = '';

	$background_video_markup = '';

	// Only try to get the rest of the settings if the background type is set to anything.
	if ( $args['background_type'] ) {
		if ( 'color' === $args['background_type'] ) {
			$background_color = $background_options['background_color'];
			$inline_style .= 'background-color: ' . $background_color . '; ';
		}

		if ( 'image' === $args['background_type'] ) {
			$background_image = $background_options['background_image'];
			$inline_style .= 'background-image: url(' . esc_url( $background_image['sizes']['full-width'] ) . ');';
			$args['class'] .= ' image-as-background';
		}

		if ( 'video' === $args['background_type'] ) {
			$background_video = $background_options['background_video'];
			$background_video_markup = '<video class="video-as-background" autoplay muted loop preload="auto"><source src="' . esc_url( $background_video['url'] ) . '" type="video/mp4"></video>';
		}

		if ( 'none' === $args['background_type'] ) {
			$args['class'] .= ' no-background';
		}
	}

	// Set the custom font color.
	if ( $args['font_color'] ) {
		$inline_style .= 'color: ' . $args['font_color'] . '; ';
	}

	// Set the custom css class.
	if ( $args['custom_css_class'] ) {
		$args['class'] .= ' ' . $args['custom_css_class'];
	}

	// Print our block container with options.
	printf( '<%s class="%s" style="%s">', esc_html( $args['container'] ), esc_attr( $args['class'] ), esc_attr( $inline_style ) );

	// If we have a background video, echo our background video markup inside the block container.
	if ( $background_video_markup ) {
		echo $background_video_markup; // WPCS XSS OK.
	}
}

/**
 * Get the animate.css classes for an element.
 *
 * @return string $classes Animate.css classes for our element.
 */
function _s_get_animation_class() {

	// Get block other options for our animation data.
	$other_options = get_sub_field( 'other_options' );

	// Get out of here if we don't have other options.
	if ( ! $other_options ) {
		return '';
	}

	// Set up our animation class for the wrapping element.
	$classes = '';

	// If we have an animation set...
	if ( $other_options['animation'] ) {
		$classes = 'animated ' . $other_options['animation'];
	}

	return $classes;
}

/**
 * Enqueues scripts for ACF.
 *
 * @author Corey Collins, Kellen Mace
 */
function _s_acf_admin_scripts() {

	// If a SCRIPT_DEBUG constant is defined or there is a $_GET param of 'script_debug', load unminified files.
	$suffix = ( defined( 'SCRIPT_DEBUG' ) && true === SCRIPT_DEBUG ) || isset( $_GET['script_debug'] ) ? '' : '.min';

	// Version assets using this value. Bump it to bust old, cached files.
	$version = '1.0.0';

	// Enqueue JS to tweak the color picker swatches.
	wp_enqueue_script( '_s-admin-acf-scripts', get_template_directory_uri() . '/assets/scripts/admin-acf' . $suffix . '.js', array( 'jquery' ), $version, true );

	// Enqueue color picker styles.
	wp_enqueue_style( '_s-admin-acf-styles', get_template_directory_uri() . '/admin-acf-styles.css', array(), $version );
}
add_action( 'acf/input/admin_head', '_s_acf_admin_scripts' );
