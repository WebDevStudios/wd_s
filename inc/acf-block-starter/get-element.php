<?php
/**
 * Render an element.
 *
 * @package ABS
 */

namespace abs\functions;

/**
 * Render an element.
 *
 * @author WebDevStudios
 *
 * @param string $element_name The name of the block.
 * @param array  $args Args for the block.
 */
function get_element( $element_name = '', $args ) {
	get_template_part( 'template-parts/elements/' . $element_name, '', $args );
}
