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

			// Get block other options.
			$other_options = get_sub_field( 'other_options' ) ? get_sub_field( 'other_options' ) : get_field( 'other_options' )['other_options'];

			// If the block has expired,then bail!
			if ( _s_has_block_expired(
				array(
					'start_date' => $other_options['start_date'],
					'end_date'   => $other_options['end_date'],
				)
			) ) {
				continue;
			}

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

	$display_options = get_sub_field( 'display_options' ) ? get_sub_field( 'display_options' ) : get_field( 'display_options' )['display_options'];

	// Get a default ID.
	$default_id = get_row_layout() ? str_replace( '_', '-', get_row_layout() . '-' . get_row_index() ) : '';

	// Setup defaults.
	$defaults = array(
		'background_type'  => $background_options['background_type']['value'],
		'container'        => 'section',
		'class'            => 'content-block',
		'custom_css_class' => $other_options['custom_css_class'],
		'font_color'       => $display_options['font_color'],
		'id'               => $default_id,
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	$background_video_markup = $background_image_markup = '';

	// Only try to get the rest of the settings if the background type is set to anything.
	if ( $args['background_type'] ) {
		if ( 'color' === $args['background_type'] && $background_options['color']['color_picker'] ) {
			$background_color = $background_options['color']['color_picker'];
			$args['class']   .= ' has-background color-as-background background-' . esc_attr( $background_color );
		}

		if ( 'image' === $args['background_type'] && $background_options['background_image'] ) {
			$background_image = $background_options['background_image'];
			$args['class']   .= ' has-background image-as-background';
			ob_start();
			?>
			<figure class="image-background" aria-hidden="true">
				<?php echo wp_get_attachment_image( $background_image['id'], 'full' ); ?>
			</figure>
			<?php
			$background_image_markup = ob_get_clean();
		}

		if ( 'video' === $args['background_type'] ) {
			$background_video      = $background_options['background_video'];
			$background_video_webm = $background_options['background_video_webm'];
			$background_title      = $background_options['background_video_title'];
			$args['class']        .= ' has-background video-as-background';
			// Translators: get the title of the video.
			$background_alt = $background_title ? sprintf( esc_attr( 'Video Background of %s', '_s' ), esc_attr( $background_options['background_video_title'] ) ) : __( 'Video Background', '_s' );

			ob_start();
			?>
				<video class="video-background" autoplay muted loop preload="auto" aria-hidden="true"<?php echo $background_title ? ' title="' . esc_attr( $background_title ) . '"' : ''; ?>>
						<?php if ( $background_video_webm['url'] ) : ?>
						<source src="<?php echo esc_url( $background_video_webm['url'] ); ?>" type="video/webm">
						<?php endif; ?>

						<?php if ( $background_video['url'] ) : ?>
						<source src="<?php echo esc_url( $background_video['url'] ); ?>" type="video/mp4">
						<?php endif; ?>
				</video>
				<button class="video-toggle"><span class="screen-reader-text"><?php esc_html_e( 'Toggle video playback', '_s' ); ?></span></button>
			<?php
			$background_video_markup = ob_get_clean();
		}

		if ( 'none' === $args['background_type'] ) {
			$args['class'] .= ' no-background';
		}
	}

	// Set the custom font color.
	if ( $args['font_color']['color_picker'] ) {
		$args['class'] .= ' has-font-color color-' . esc_attr( $args['font_color']['color_picker'] );
	}

	// Set the custom ID.
	if ( isset( $other_options['custom_id'] ) && ! empty( $other_options['custom_id'] ) ) {
		$args['id'] = $other_options['custom_id'];
	}

	// Set the Container width.
	if ( isset( $display_options['block_width'] ) && ! empty( $display_options['block_width'] ) ) {
		$args['class'] .= ' ' . $display_options['block_width'];
	}

	// Set the custom css class.
	if ( $args['custom_css_class'] ) {
		$args['class'] .= ' ' . $args['custom_css_class'];
	}

	// Print our block container with options.
	printf(
		'<%s id="%s" class="%s">',
		esc_attr( $args['container'] ),
		esc_attr( $args['id'] ),
		esc_attr( $args['class'] )
	);

	// If we have a background video, echo our background video markup inside the block container.
	if ( $background_video_markup ) {
		echo $background_video_markup; // WPCS XSS OK.
	}

	// If we have a background image, echo our background image markup inside the block container.
	if ( $background_image_markup ) {
		echo $background_image_markup; // WPCS XSS OK.
	}
}

/**
 * Get the animate.css classes for an element.
 *
 * @return string $classes Animate.css classes for our element.
 */
function _s_get_animation_class() {

	// Get block other options for our animation data.
	$display_options = get_sub_field( 'display_options' );

	// Get out of here if we don't have other options.
	if ( ! $display_options ) {
		return '';
	}

	// Set up our animation class for the wrapping element.
	$classes = 'not-animated';

	// If we have an animation set...
	if ( $display_options['animation'] ) {
		$classes = 'animated ' . $display_options['animation'];
	}

	return $classes;
}

/**
 * Decide whether or not a block has expired.
 *
 * @param array $args start and end dates.
 *
 * @return bool
 */
function _s_has_block_expired( $args = array() ) {

	// Setup defaults.
	$defaults = array(
		'start_date' => '',
		'end_date'   => '',
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	// Get (Unix) times and convert to integer.
	$now   = (int) date( 'U' );
	$start = (int) $args['start_date'];
	$end   = (int) $args['end_date'];

	// No dates? Cool, they're optional.
	if ( empty( $start ) || empty( $end ) ) {
		return false;
	}

	// The block has started, but hasn't expired yet.
	if ( $start <= $now && $end >= $now ) {
		return false;
	}

	// Yes, the block has expired.
	return true;
}

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

	// Set an expired var.
	$expired = '';

	// Get other options.
	$other_options = get_sub_field( 'other_options' ) ? get_sub_field( 'other_options' ) : get_field( 'other_options' )['other_options'];

	// Get Background Type.
	$background = get_sub_field( 'background_options' )['background_type']['value'];

	// If there's no background, just move along...
	if ( ! 'none' === $background ) {
		$background_repeater = get_sub_field( 'hero_slides' )[0]['background_options']['background_type']['value'];
		$background_type     = $background ? $background : $background_repeater;

		$type = _s_return_flexible_content_layout_value( $background_type );

		// Load image from non-repeater sub field background image, if it exists else Load image from repeater sub field background image, if it exists — Hero.
		if ( 'image' === $background_type ) {
			$title .= '<img src="' . esc_url( $type['sizes']['thumbnail'] ) . '" height="30" width="30" class="acf-flexible-title-image" />';
		}

		if ( 'color' === $background_type ) {
			$title .= '<div style="background-color: ' . esc_attr( $type ) . '; height: 30px; width: 30px;" class="acf-flexible-title-image"><span class="screen-reader-text">' . esc_html( $type ) . '</span></div>';
		}

		if ( 'video' === $background_type ) {
			$title .= '<div style="font-size: 30px; height: 26px; width: 30px;" class="dashicons dashicons-format-video acf-flexible-title-image"><span class="screen-reader-text">' . esc_html__( 'Video', '_s' ) . '</span></div>';
		}
	}

	// Set default field title. Don't want to lose this.
	$title .= '<strong>' . esc_html( $current_title ) . '</strong>';

	// ACF Flexible Content Title Fields.
	$block_title = get_sub_field( 'title' );
	$headline    = get_sub_field( 'hero_slides' )[0]['headline'];
	$text        = $block_title ? $block_title : $headline;
	$start_date  = $other_options['start_date'];
	$end_date    = $other_options['end_date'];

	// If the block has expired, add "(expired)" to the title.
	if ( _s_has_block_expired(
			array(
				'start_date' => $start_date,
				'end_date'   => $end_date,
			)
		)
	) {
		$expired .= '<span style="color: red;">&nbsp;(' . esc_html__( 'expired', '_s' ) . ')</span>';
	}

	// Load title field text else Load headline text — Hero.
	if ( $text ) {
		$title .= '<span class="acf-flexible-content-headline-title"> — ' . $text . '</span>';
	}

	// Return New Title.
	return $title . $expired;
}
add_filter( 'acf/fields/flexible_content/layout_title/name=content_blocks', '_s_acf_flexible_content_layout_title', 10, 4 );

/**
 * Return flexible content field value by type
 *
 * @param string $type field type.
 *
 * @return string field value.
 */
function _s_return_flexible_content_layout_value( $type ) {

	if ( empty( $type ) ) {
		return;
	}

	$background_type          = get_sub_field( 'background_options' )[ "background_{$type}" ];
	$background_type_repeater = get_sub_field( 'hero_slides' )[0]['background_options'][ "background_{$type}" ];

	return $background_type ? $background_type : $background_type_repeater;
}

if ( function_exists( '_s_acf_flexible_content_layout_title' ) ) {

	/**
	 * Set Admin Styles for Flexible Content Layout Image/Title in _s_acf_flexible_content_layout_title().
	 */
	function _s_flexible_content_layout_title_acf_admin_head() {
	?>
	<style type="text/css">
		.acf-flexible-content .layout .acf-fc-layout-handle {
			display: flex;
			align-items: center;
		}

		.acf-flexible-title-image,
		.acf-flexible-content .layout .acf-fc-layout-order {
			margin-right: 10px;
		}

		.acf-flexible-content-headline-title {
			display: inline-block;
			margin-left: 8px;
		}
	</style>
	<?php
	}
	add_action( 'acf/input/admin_head', '_s_flexible_content_layout_title_acf_admin_head' );
}

/**
 * Load colors dynamically into select field from _s_get_theme_colors()
 *
 * @param array $field field options.
 * @return array new field choices.
 *
 * @author Corey Colins <corey@webdevstudios.com>
 */
function _s_acf_load_color_picker_field_choices( $field ) {

	// Reset choices.
	$field['choices'] = array();

	// Grab our colors array.
	$colors = _s_get_theme_colors();

	// Loop through colors.
	foreach ( $colors as $key => $color ) {

		// Create display markup.
		$color_output = '<div style="display: flex; align-items: center;"><span style="background-color:' . esc_attr( $color ) . '; border: 1px solid #ccc;display:inline-block; height: 15px; margin-right: 10px; width: 15px;"></span>' . esc_html( $key ) . '</div>';

		// Set values.
		$field['choices'][ sanitize_title( $key ) ] = $color_output;
	}

	// Return the field.
	return $field;
}
add_filter( 'acf/load_field/name=color_picker', '_s_acf_load_color_picker_field_choices' );

/**
 * Get the theme colors for this project. Set these first in the Sass partial then migrate them over here.
 *
 * @return array The array of our color names and hex values.
 * @author Corey Collins
 */
function _s_get_theme_colors() {
	return array(
		esc_html__( 'Alto', '_s' )           => '#ddd',
		esc_html__( 'Black', '_s' )          => '#000',
		esc_html__( 'Blue', '_s' )           => '#21759b',
		esc_html__( 'Cod Gray', '_s' )       => '#111',
		esc_html__( 'Dove Gray', '_s' )      => '#666',
		esc_html__( 'Gallery', '_s' )        => '#eee',
		esc_html__( 'Gray', '_s' )           => '#808080',
		esc_html__( 'Gray Alt', '_s' )       => '#929292',
		esc_html__( 'Light Yellow', '_s' )   => '#fff9c0',
		esc_html__( 'Mineshaft', '_s' )      => '#333',
		esc_html__( 'Silver', '_s' )         => '#ccc',
		esc_html__( 'Silver Chalice', '_s' ) => '#aaa',
		esc_html__( 'White', '_s' )          => '#fff',
		esc_html__( 'Whitesmoke', '_s' )     => '#f1f1f1',
	);
}

/**
 * Adds h1 or h2 heading for hero based on location.
 *
 * @param string $title acf value.
 * @author jomurgel <jo@webdevstudios.com>
 * @return void
 */
function _s_display_hero_heading( $title ) {

	// Bail if our title is empty.
	if ( empty( $title ) ) {
		return;
	}

	// Set hero title to h1 if it's the first block not on the homepage.
	$index   = get_row_index();
	$heading = 1 === $index && ! ( is_front_page() && is_home() ) ? 'h1' : 'h2';

	echo sprintf( '<%1$s class="hero-title">%2$s</%1$s>', esc_attr( $heading ), esc_html( $title ) );
}
