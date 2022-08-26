<?php
/**
 * Validates args passed to an element/module/block.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Validates args passed to an element/module/block.
 *
 * @author WebDevStudios
 *
 * @param array $wd_s_required_args Array of required args.
 * @param array $wd_s_args Array of args passed to the element.
 *
 * @return string    The error message or false.
 */
function get_validate_args( $wd_s_required_args = [], $wd_s_args = [] ) {
	$wd_s_missing_fields = [];
	foreach ( $wd_s_required_args as $wd_s_required_arg ) :
		if ( ! $wd_s_args[ $wd_s_required_arg ] ) :
			$wd_s_missing_fields[] = $wd_s_required_arg;
		endif;
	endforeach;

	if ( count( $wd_s_missing_fields ) ) :
		return '<span class="abs-args-error">Missing required args. [ args: ' . implode( ', ', $wd_s_missing_fields ) . ' ][ file: template-parts' . explode( 'template-parts', debug_backtrace()[0]['file'] )[1] . ' ]</span>'; //phpcs:ignore
	endif;

	return false;
}
