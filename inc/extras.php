<?php
/**
 * Custom functions that act independently of the theme templates.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package _s
 */

/**
 * Returns true if a blog has more than 1 category.
 *
 * @return bool
 */
function _s_categorized_blog() {

	// Get the categories.
	$all_the_cool_cats = get_transient( '_s_categories' );
	if ( false === $all_the_cool_cats ) {
		// Create an array of all the categories that are attached to posts.
		$all_the_cool_cats = get_categories( array(
			'fields'     => 'ids',
			'hide_empty' => 1,
			// We only need to know if there is more than one category.
			'number'     => 2,
		) );

		// Count the number of categories that are attached to the posts.
		$all_the_cool_cats = count( $all_the_cool_cats );

		set_transient( '_s_categories', $all_the_cool_cats );
	}

	if ( $all_the_cool_cats > 1 ) {
		// This blog has more than 1 category so _s_categorized_blog should return true.
		return true;
	} else {
		// This blog has only 1 category so _s_categorized_blog should return false.
		return false;
	}
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
		$attachment_id = $wpdb->get_var( $wpdb->prepare( "SELECT wposts.ID FROM $wpdb->posts wposts, $wpdb->postmeta wpostmeta WHERE wposts.ID = wpostmeta.post_id AND wpostmeta.meta_key = '_wp_attached_file' AND wpostmeta.meta_value = '%s' AND wposts.post_type = 'attachment'", $attachment_url ) ); // WPCS: db call ok , cache ok.
	}

	return $attachment_id;
}

/**
 * Returns an <img> that can be used anywhere a placeholder image is needed
 * in a theme. The image is a simple colored block with the image dimensions
 * displayed in the middle.
 *
 * @author Ben Lobaugh
 * @throws Exception Details of missing parameters.
 * @param array $args {.
 * @type int $width
 * @type int $height
 * @type string $background_color
 * @type string $text_color
 * }
 * @return string
 */
function _s_get_placeholder_image( $args = array() ) {
	$default_args = array(
		'width'            => '',
		'height'           => '',
		'background_color' => 'dddddd',
		'text_color'       => '000000',
	);

	$args = wp_parse_args( $args, $default_args );

	// Extract the vars we want to work with.
	$width              = $args['width'];
	$height             = $args['height'];
	$background_color   = $args['background_color'];
	$text_color         = $args['text_color'];

	// Perform some quick data validation.
	if ( ! is_numeric( $width ) ) {
		throw new Exception( esc_html__( 'Width must be an integer', '_s' ) );
	}

	if ( ! is_numeric( $height ) ) {
		throw new Exception( esc_html__( 'Height must be an integer', '_s' ) );
	}

	if ( ! ctype_xdigit( $background_color ) ) {
		throw new Exception( esc_html__( 'Please provide a valid hex color value for background_color', '_s' ) );
	}

	if ( ! ctype_xdigit( $text_color ) ) {
		throw new Exception( esc_html__( 'Please provide a valid hex color value for text_color', '_s' ) );
	}

	// Set up the url to the image.
	$url = "http://placeholder.wdslab.com/i/{$width}x$height/$background_color/$text_color";

	// Text that will be utilized by screen readers.
	$alt = apply_filters( '_s_placeholder_image_alt', esc_html__( 'WebDevStudios Placeholder Image', '_s' ) );

	return "<img src='$url' width='$width' height='$height' alt='$alt' />";
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
		'width'    => '',
		'height'   => '',
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
	if ( ! empty( $args['category'] )  && ! in_array( $args['category'], $valid_categories, true ) ) {
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
		$url .= "category/$category/";
	}

	// Dimensions go after category but before search keywords.
	$url .= "{$args['width']}x{$args['height']}";

	if ( ! empty( $args['keywords'] ) ) {
		$keywords = rawurlencode( $args['keywords'] );
		$url .= "?$keywords";
	}

	// Text that will be utilized by screen readers.
	$alt = apply_filters( '_s_placeholder_image_alt', esc_html__( 'WebDevStudios Placeholder Image', '_s' ) );

	return "<img src='$url' width='{$args['width']}' height='{$args['height']}' alt='$alt' />";
}

/**
 * Menu walker class extends the menu.
 *
 * This allows us to add Foundation helper classes to submenus.
 *
 * @author Corey Collins
 */
class WDS_Submenu_Classes extends Walker_Nav_Menu {

	/**
	 * Starts the list before the elements are added.
	 *
	 * Adds classes to the unordered list sub-menus.
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param int    $depth  Depth of menu item. Used for padding.
	 * @param array  $args   An array of arguments. @see wp_nav_menu().
	 */
	function start_lvl( &$output, $depth = 0, $args = array() ) {

		// Set our default submenu classes.
		$sub_menu_classes = 'is-accordion-submenu';

		// If we're in a vertical menu, use vertical menu classes.
		if ( strpos( $args->menu_class, 'vertical' ) ) {
			$sub_menu_classes = 'is-dropdown-submenu';
		}

		// Depth-dependent classes.
		$indent        = ( $depth > 0  ? str_repeat( "\t", $depth ) : '' ); // code indent.
		$display_depth = ( $depth + 1); // because it counts the first submenu as 0.

		// Build our classes.
		$classes = array(
			'menu vertical submenu ' . $sub_menu_classes,
			( 1 == $display_depth ? 'first-sub' : '' ),
		);

		// Break our classes array into a string.
		$class_names = implode( ' ', $classes );

		// Build HTML for output.
		$output .= "\n" . $indent . '<ul class="' . $class_names . '">' . "\n";
	}
}
