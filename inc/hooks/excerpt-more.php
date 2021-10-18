<?php
/**
 * Customize the [...] on the_excerpt();
 *
 * @package _s
 */

namespace WD_S\Hooks;

/**
 * Customize the [...] on the_excerpt();
 *
 * @author WebDevStudios
 *
 * @param string $more The current $more string.
 *
 * @return string Read more link.
 */
function excerpt_more( $more ) {
	return sprintf( ' <a class="more-link" href="%1$s">%2$s</a>', get_permalink( get_the_ID() ), esc_html__( 'Read more...', '_s' ) );
}

add_filter( 'excerpt_more', 'WD_S\Hooks\excerpt_more' );
