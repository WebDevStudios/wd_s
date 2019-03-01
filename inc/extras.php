<?php
/**
 * Custom functions that act independently of the theme templates.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package _s
 */

/**
 * Returns true if a blog has more than 1 category, else false.
 *
 * @return bool Whether the blog has more than one category.
 */
function _s_categorized_blog() {

	$category_count = get_transient( '_s_categories' );

	if ( false === $category_count ) {

		$category_count_query = get_categories( array(
			'fields' => 'count',
		) );

		$category_count = (int) $category_count_query[0];

		set_transient( '_s_categories', $category_count );
	}

	return $category_count > 1;
}

/**
 * Get an attachment ID from it's URL.
 *
 * @param string $attachment_url The URL of the attachment.
 * @return int The attachment ID.
 */
function _s_get_attachment_id_from_url( $attachment_url = '' ) {

	global $wpdb;

	$attachment_id = false;

	// If there is no url, return.
	if ( '' === $attachment_url ) {
		return false;
	}

	// Get the upload directory paths.
	$upload_dir_paths = wp_upload_dir();

	// Make sure the upload path base directory exists in the attachment URL, to verify that we're working with a media library image.
	if ( false !== strpos( $attachment_url, $upload_dir_paths['baseurl'] ) ) {

		// If this is the URL of an auto-generated thumbnail, get the URL of the original image.
		$attachment_url = preg_replace( '/-\d+x\d+(?=\.(jpg|jpeg|png|gif)$)/i', '', $attachment_url );

		// Remove the upload path base directory from the attachment URL.
		$attachment_url = str_replace( $upload_dir_paths['baseurl'] . '/', '', $attachment_url );

		// Do something with $result.
		$attachment_id = $wpdb->get_var( $wpdb->prepare( "SELECT wposts.ID FROM $wpdb->posts wposts, $wpdb->postmeta wpostmeta WHERE wposts.ID = wpostmeta.post_id AND wpostmeta.meta_key = '_wp_attached_file' AND wpostmeta.meta_value = %s AND wposts.post_type = 'attachment'", $attachment_url ) ); // WPCS db call ok, cache ok, placeholder ok.
	}

	return $attachment_id;
}

/**
 * Returns an photo from Unsplash.com wrapped in an <img> that can be used
 * in a theme. There are limited category and search capabilities to attempt
 * matching the site subject.
 *
 * @author Ben Lobaugh
 * @throws Exception Details of missing parameters.
 * @param array $args {.
 * @type int $width
 * @type int $height
 * @type string $category Optional. Maybe be one of: buildings, food, nature, people, technology, objects
 * @type string $keywords Optional. Comma seperated list of keywords, such as: sailboat, water
 * }
 * @return string
 */
function _s_get_placeholder_unsplash( $args = array() ) {

	$default_args = array(
		'width'    => 200,
		'height'   => 200,
		'category' => '',
		'keywords' => '',
	);

	$args = wp_parse_args( $args, $default_args );

	$valid_categories = array(
		'buildings',
		'food',
		'nature',
		'people',
		'technology',
		'objects',
	);

	// If there is an invalid category lets erase it.
	if ( ! empty( $args['category'] ) && ! in_array( $args['category'], $valid_categories, true ) ) {
		$args['category'] = '';
	}

	// Perform some quick data validation.
	if ( ! is_numeric( $args['width'] ) ) {
		throw new Exception( esc_html__( 'Width must be an integer', '_s' ) );
	}

	if ( ! is_numeric( $args['height'] ) ) {
		throw new Exception( esc_html__( 'Height must be an integer', '_s' ) );
	}

	// Set up the url to the image.
	$url = 'https://source.unsplash.com/';

	// Apply a category if desired.
	if ( ! empty( $args['category'] ) ) {
		$category = rawurlencode( $args['category'] );
		$url     .= "category/$category/";
	}

	// Dimensions go after category but before search keywords.
	$url .= "{$args['width']}x{$args['height']}";

	if ( ! empty( $args['keywords'] ) ) {
		$keywords = rawurlencode( $args['keywords'] );
		$url     .= "?$keywords";
	}

	// Text that will be utilized by screen readers.
	$alt = apply_filters( '_s_placeholder_image_alt', esc_html__( 'WebDevStudios Placeholder Image', '_s' ) );

	return "<img src='$url' width='{$args['width']}' height='{$args['height']}' alt='$alt' />";
}

/**
 * Shortcode to display copyright year.
 *
 * @author Haris Zulfiqar
 * @param array $atts {.
 * @type string $starting_year Optional. Define starting year to show starting year and current year e.g. 2015 - 2018.
 * @type string $separator Optional. Separator between starting year and current year.
 * }
 * @return string
 */
function _s_copyright_year( $atts ) {

	// Setup defaults.
	$args = shortcode_atts( array(
		'starting_year' => '',
		'separator'     => ' - ',
	), $atts );

	$current_year = date( 'Y' );

	// Return current year if starting year is empty.
	if ( ! $args['starting_year'] ) {
		return $current_year;
	}

	return esc_html( $args['starting_year'] . $args['separator'] . $current_year );
}
add_shortcode( '_s_copyright_year', '_s_copyright_year', 15 );

if ( defined( 'WPSEO_VERSION' ) ) {
	/**
	 * Move Yoast to bottom, below all elements
	 *
	 * @return string 'low' set value.
	 * @author jomurgel <jo@webdevstudios.com>
	 * @since  NEXT
	 */
	function _s_move_yoast_to_bottom() {
		return 'low';
	}
	add_filter( 'wpseo_metabox_prio', '_s_move_yoast_to_bottom' );
}

/**
 * Filters WYSIWYG content with the_content filter.
 *
 * @param string $content content dump from WYSIWYG.
 * @return mixed $content.
 * @author jomurgel
 */
function _s_get_the_content( $content ) {

	// Bail if no content exists.
	if ( empty( $content ) ) {
		return;
	}
	// Returns the content.
	return $content;
}
add_filter( 'the_content', '_s_get_the_content', 20 );

/**
 * Copies our ACF color settings into an array readable by Gutenberg's color picker.
 *
 * @return array $gutenberg_colors The Gutenberg-ready array
 * @author Corey Collins
 */
function _s_get_theme_colors_gutenberg() {

	// Grab our ACF theme colors.
	$colors = _s_get_theme_colors();

	if ( ! $colors ) {
		return array();
	}

	foreach ( $colors as $key => $color ) {
		$gutenberg_colors[] = array(
			'name'  => esc_html( $key ),
			'slug'  => sanitize_title( $key ),
			'color' => esc_attr( $color ),
		);
	}

	return $gutenberg_colors;
}
