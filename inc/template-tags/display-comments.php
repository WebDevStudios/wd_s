<?php
/**
 * Display the comments if the count is more than 0.
 *
 * @package _s
 */

/**
 * Display the comments if the count is more than 0.
 *
 * @author WebDevStudios
 */

namespace WD_S\TemplateTags;

function display_comments() {
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}
}
