<?php
/**
 * Action hooks and filters.
 *
 * A place to put hooks and filters that aren't necessarily template tags.
 *
 * @package _s
 */

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
 * Add SVG definitions to footer.
 *
 * @author WDS
 */
function _s_include_svg_icons() {

	// Define SVG sprite file.
	$svg_icons = get_template_directory() . '/build/images/icons/sprite.svg';

	// If it exists, include it.
	if ( file_exists( $svg_icons ) ) {
		require_once $svg_icons;
	}
}
add_action( 'wp_footer', '_s_include_svg_icons', 9999 );

/**
 * Flush out the transients used in _s_categorized_blog.
 *
 * @author WDS
 * @return string
 */
function _s_category_transient_flusher() {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return false;
	}
	// Like, beat it. Dig?
	delete_transient( '_s_categories' );
}
add_action( 'delete_category', '_s_category_transient_flusher' );
add_action( 'save_post', '_s_category_transient_flusher' );
