<?php
/**
 * Retrieve the URL of the custom logo uploaded, if one exists.
 *
 * @package _s
 */

/**
 * Retrieve the URL of the custom logo uploaded, if one exists.
 *
 * @author Corey Collins
 */

namespace WD_S\Functions;

function return_custom_logo_url() {

	$custom_logo_id = get_theme_mod( 'custom_logo' );

	if ( ! $custom_logo_id ) {
		return;
	}

	$custom_logo_image = wp_get_attachment_image_src( $custom_logo_id, 'full' );

	if ( ! isset( $custom_logo_image[0] ) ) {
		return;
	}

	return $custom_logo_image[0];
}
