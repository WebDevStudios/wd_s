<?php
/**
 * Backwards compatibility fills for older WP versions.
 *
 * @package wd_s
 */

if ( ! function_exists( 'wp_body_open' ) ) {

	/**
	 * Fire the wp_body_open action.
	 *
	 * Back-fill wp_body_open for prior to 5.2 WP versions.
	 *
	 * @author WebDevStudios
	 */
	function wp_body_open() {

		/**
		 * Triggered after the opening body tag.
		 *
		 * @since 5.2.0
		 */
		do_action( 'wp_body_open' );
	}
}
