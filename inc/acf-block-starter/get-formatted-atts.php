<?php
/**
 * Returns a string of formatted elemene attributes.
 *
 * @package ABS
 */

namespace abs\functions;

/**
 * Returns a string of formatted element attributes.
 *
 * @author WebDevStudios
 *
 * @param array $atts Array of elements to format from the args.
 * @param array $args Args for the element.
 */
function get_formatted_atts( $atts, $args ) {
	$atts_formatted = [];

	foreach ( $atts as $att ) :
		if ( array_key_exists( $att, $args ) && $args[ $att ] ) :

			// Handle aria attributes.
			if ( 'aria' === $att && is_array( $args['aria'] ) ) :

				foreach ( $args['aria'] as $key => $val ) :
					if ( $val ) :
						$atts_formatted[] = 'aria-' . $key . '="' . esc_attr( $val ) . '"';
					endif;
				endforeach;

			elseif ( 'alpine' === $att && is_array( $args['alpine'] ) ) :

				foreach ( $args['alpine'] as $key => $val ) :
					if ( $val ) :
						$atts_formatted[] = $key . '="' . esc_attr( $val ) . '"';
					endif;
				endforeach;

			else :

				// Handle multiple classes.
				if ( 'class' === $att && is_array( $args['class'] ) ) :
					$args['class'] = implode( ' ', $args['class'] );
				endif;

				$atts_formatted[] = $att . '="' . esc_attr( $args[ $att ] ) . '"';

			endif;

		endif;
	endforeach;

	return implode( ' ', $atts_formatted );
}
