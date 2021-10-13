<?php
/**
 * Display the comments if the count is more than 0.
 *
 * @author WebDevStudios
 *
 * @package _s
 */
function _s_display_comments() {
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}
}
