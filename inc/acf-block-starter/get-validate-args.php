<?php
/**
 * Validates args passed to an element/module/block.
 *
 * @package ABS
 */

namespace abs\functions;

/**
 * Validates args passed to an element/module/block.
 *
 * @author WebDevStudios
 *
 * @param array $abs_required_args Array of required args.
 * @param array $abs_args Array of args passed to the element.
 *
 * @return string    The error message or false.
 */
function get_validate_args( $abs_required_args = [], $abs_args = [] ) {
	$abs_missing_fields = [];
	foreach ( $abs_required_args as $abs_required_arg ) :
		if ( ! $abs_args[ $abs_required_arg ] ) :
			$abs_missing_fields[] = $abs_required_arg;
		endif;
	endforeach;

	if ( count( $abs_missing_fields ) ) :
		return '<span class="abs-args-error">Missing required args. [ args: ' . implode( ', ', $abs_missing_fields ) . ' ][ file: template-parts' . explode( 'template-parts', debug_backtrace()[0]['file'] )[1] . ' ]</span>'; //phpcs:ignore
	endif;

	return false;
}
