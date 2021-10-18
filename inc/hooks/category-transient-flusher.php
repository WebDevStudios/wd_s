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

namespace WD_S\Hooks;

function category_transient_flusher() {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return false;
	}

	// Like, beat it. Dig?
	return delete_transient( '_s_categories' );
}

add_action( 'delete_category', 'WD_S\Hooks\category_transient_flusher' );
add_action( 'save_post', 'WD_S\Hooks\category_transient_flusher' );
