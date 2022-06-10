<?php
/**
 * Returns an array of ACF fields.
 *
 * @package Troy Bank
 */

namespace abs\functions;

/**
 * Returns an array of ACF fields.
 *
 * @param array $fields Array of field names ie: [ 'layout', 'eyebrow_heading', 'content', 'heading' ].
 * @param int   $post_id (optional) ID of the post or of the block ($block[id]).
 *
 * @author Adam Bates <adam.bates@webdevstudios.com>
 */
function get_acf_fields( $fields = [], $post_id = false ) {

	if ( ! function_exists( 'get_field' ) ) :
		return;
	endif;

	$post_id       = $post_id ? $post_id : get_the_ID();
	$return_fields = [];
	foreach ( $fields as $field ) :
		$value                   = get_field( $field, $post_id );
		$return_fields[ $field ] = $value;
	endforeach;

	return $return_fields;
}
