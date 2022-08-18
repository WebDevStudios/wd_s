<?php
/**
 * Flush out the transients used in wd_s_categorized_blog.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Flush out the transients used in wd_s_categorized_blog.
 *
 * @author WebDevStudios
 *
 * @return bool Whether or not transients were deleted.
 */
function category_transient_flusher() {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return false;
	}

	// Like, beat it. Dig?
	return delete_transient( 'wd_s_categories' );
}

add_action( 'delete_category', __NAMESPACE__ . '\category_transient_flusher' );
add_action( 'save_post', __NAMESPACE__ . '\category_transient_flusher' );
