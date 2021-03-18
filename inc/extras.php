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
 * @author WDS
 * @return bool Whether the blog has more than one category.
 */
function _s_categorized_blog() {

	$category_count = get_transient( '_s_categories' );

	if ( false === $category_count ) {

		$category_count_query = get_categories(
			array(
				'fields' => 'count',
			)
		);

		$category_count = (int) $category_count_query[0];

		set_transient( '_s_categories', $category_count );
	}

	return $category_count > 1;
}

/**
 * Get an attachment ID from it's URL.
 *
 * @author WDS
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
		// phpcs:ignore phpcs:ignore WordPress.DB -- db call ok, cache ok, placeholder ok.
		$attachment_id = $wpdb->get_var( $wpdb->prepare( "SELECT wposts.ID FROM $wpdb->posts wposts, $wpdb->postmeta wpostmeta WHERE wposts.ID = wpostmeta.post_id AND wpostmeta.meta_key = '_wp_attached_file' AND wpostmeta.meta_value = %s AND wposts.post_type = 'attachment'", $attachment_url ) );
	}

	return $attachment_id;
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
	$args = shortcode_atts(
		array(
			'starting_year' => '',
			'separator'     => ' - ',
		),
		$atts
	);

	$current_year = gmdate( 'Y' );

	// Return current year if starting year is empty.
	if ( ! $args['starting_year'] ) {
		return $current_year;
	}

	return esc_html( $args['starting_year'] . $args['separator'] . $current_year );
}
add_shortcode( '_s_copyright_year', '_s_copyright_year', 15 );
