<?php
/**
 * Enable custom mime types.
 *
 * @package _s
 */

/**
 * Enable custom mime types.
 *
 * @author WebDevStudios
 *
 * @param array $mimes Current allowed mime types.
 *
 * @return array Mime types.
 */

namespace WD_S\Hooks;

function custom_mime_types( $mimes ) {
	$mimes['svg']  = 'image/svg+xml';
	$mimes['svgz'] = 'image/svg+xml';

	return $mimes;
}

add_filter( 'upload_mimes', 'WD_S\Hooks\custom_mime_types' );
