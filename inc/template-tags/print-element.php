<?php
/**
 * Render an element.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Render an element.
 *
 * @author WebDevStudios
 *
 * @param string $element_name The name of the block.
 * @param array  $args Args for the block.
 */
function print_element( $element_name = '', $args = [] ) {
	get_template_part( 'template-parts/acf-blocks/elements/' . $element_name, '', $args );
}
