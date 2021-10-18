<?php
/**
 * Display the comments if the count is more than 0.
 *
 * @package _s
 */

namespace WD_S\TemplateTags;

/**
 * Display the comments if the count is more than 0.
 *
 * @author WebDevStudios
 */
function display_comments() {
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}
}
