<?php
/**
 * Filters WYSIWYG content with the_content filter.
 *
 * @package _s
 */

/**
 * Filters WYSIWYG content with the_content filter.
 *
 * @author Jo Murgel
 *
 * @param string $content content dump from WYSIWYG.
 *
 * @return string|bool Content string if content exists, else empty.
 */
function _s_get_the_content( $content ) {
	return ! empty( $content ) ? $content : false;
}

add_filter( 'the_content', '_s_get_the_content', 20 );
