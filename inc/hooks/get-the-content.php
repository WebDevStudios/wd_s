<?php
/**
 * Filters WYSIWYG content with the_content filter.
 *
 * @package _s
 */

namespace WD_S\Hooks;

/**
 * Filters WYSIWYG content with the_content filter.
 *
 * @author Jo Murgel
 *
 * @param string $content content dump from WYSIWYG.
 *
 * @return string|bool Content string if content exists, else empty.
 */
function get_the_content( $content ) {
	return ! empty( $content ) ? $content : false;
}

add_filter( 'the_content', 'WD_S\Hooks\get_the_content', 20 );
