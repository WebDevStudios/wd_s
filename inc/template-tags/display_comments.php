<?php
/**
 * Display the comments if the count is more than 0.
 *
 * @author WebDevStudios
 */
function _s_display_comments() {
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}
}
