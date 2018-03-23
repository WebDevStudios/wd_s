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
	$background_options = get_sub_field( 'background_options' );

	// Get block other options.
	$other_options = get_sub_field( 'other_options' );

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

/**
 * Update Layout Titles with Subfield Image and Text Fields
 *
 * @param string $title Default Field Title.
 * @param array  $field Field array.
 * @param string $layout Layout type.
 * @param int    $i number.
 *
 * @url https://support.advancedcustomfields.com/forums/topic/flexible-content-blocks-friendlycustom-collapsed-name/
 *
 * @return string new ACF title.
 */
function _s_acf_flexible_content_layout_title( $title, $field, $layout, $i ) {

	// Current ACF field name.
	$current_title = $title;

	// Remove layout title from text.
	$title = '';

	// Get Background Type.
	$background          = get_sub_field( 'background_options' )['background_type']['value'];
	$background_repeater = get_sub_field( 'hero_slides' )[0]['background_options']['background_type']['value'];
	$background_type     = $background ? $background : $background_repeater;

	$type = _s_return_flexible_content_layout_value( $background_type );

	// Load image from non-repeater sub field background image, if it exists else Load image from repeater sub field background image, if it exists — Hero.
	if ( 'image' === $background && $type ) {
		$title .= '<img src="' . esc_url( $type['sizes']['thumbnail'] ) . '" height="30" width="30" class="acf-flexible-title-image" />';
	}

	if ( 'color' === $background && $type ) {
		$title .= '<div style="background-color: ' . esc_attr( $type ) . '; height: 30px; width: 30px;" class="acf-flexible-title-image"><span class="screen-reader-text">' . esc_html( $type ) . '</span></div>';
	}

	if ( 'video' === $background && $type ) {
		$title .= '<div style="font-size: 30px; height: 26px; width: 30px;" class="dashicons dashicons-format-video acf-flexible-title-image"><span class="screen-reader-text">' . esc_html__( 'Video', '_s' ) . '</span></div>';
	}

	// Set default field title. Don't want to lose this.
	$title .= '<strong>' . esc_html( $current_title ) . '</strong>';

	// ACF Flexible Content Title Fields.
	$block_title = get_sub_field( 'title' );
	$headline    = get_sub_field( 'hero_slides' )[0]['headline'];
	$text        = $block_title ? $block_title : $headline;

	// Load title field text else Load headline text — Hero.
	if ( $text ) { // WPCS: XSS ok.
		$title .= '<span class="acf-flexible-content-headline-title"> — ' . $text . '</span>';
	}

	// Return New Title.
	return $title;
}
add_filter( 'acf/fields/flexible_content/layout_title/name=content_blocks', '_s_acf_flexible_content_layout_title', 10, 4 );
