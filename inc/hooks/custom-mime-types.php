<?php
/**
 * Enable custom mime types.
 *
 * @package _s
 */

namespace WebDevStudios\wd_s\Hooks;

/**
 * Enable custom mime types.
 *
 * @author WebDevStudios
 *
 * @param array $mimes Current allowed mime types.
 *
 * @return array Mime types.
 */
function custom_mime_types( $mimes ) {
	$mimes['svg']  = 'image/svg+xml';
	$mimes['svgz'] = 'image/svg+xml';

	return $mimes;
}

add_filter( 'upload_mimes', __NAMESPACE__ . '\custom_mime_types' );
