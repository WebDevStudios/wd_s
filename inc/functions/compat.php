<?php
/**
 * Backwards compatibility fills for older WP versions.
 *
 * @package wd_s
 */

if ( ! function_exists( 'wd_s_wp_body_open' ) ) {

	/**
	 * Fire the wd_s_wp_body_open action.
	 *
	 * Back-fill wd_s_wp_body_open for prior to 5.2 WP versions.
	 *
	 * @author WebDevStudios
	 */
	function wd_s_wp_body_open() {

		/**
		 * Triggered after the opening body tag.
		 *
		 * @since 5.2.0
		 */
		do_action( 'wd_s_wp_body_open' );
	}
}
