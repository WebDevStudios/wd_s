<?php
/**
 * Render a module.
 *
 * @package ABS
 */

namespace abs\functions;

/**
 * Render a module.
 *
 * @author WebDevStudios
 *
 * @param string $module_name The name of the module.
 * @param array  $args Args for the module.
 */
function get_module( $module_name = '', $args ) {
	get_template_part( 'template-parts/modules/' . $module_name, '', $args );
}
