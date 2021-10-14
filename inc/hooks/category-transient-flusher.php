<?php
/**
 * Flush out the transients used in _s_categorized_blog.
 *
 * @package _s
 */

/**
 * Flush out the transients used in _s_categorized_blog.
 *
 * @author WebDevStudios
 *
 * @return bool Whether or not transients were deleted.
 */
function _s_category_transient_flusher() {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return false;
	}

	// Like, beat it. Dig?
	return delete_transient( '_s_categories' );
}

add_action( 'delete_category', '_s_category_transient_flusher' );
add_action( 'save_post', '_s_category_transient_flusher' );
