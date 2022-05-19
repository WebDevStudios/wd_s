<?php
/**
 * Shortcode to display copyright year.
 *
 * @package _s
 */

namespace WebDevStudios\wd_s\Shortcodes;

/**
 * Shortcode to display copyright year.
 *
 * @author Haris Zulfiqar
 *
 * @param array $atts Optional attributes.
 *     $starting_year Optional. Define starting year to show starting year and current year e.g. 2015 - 2018.
 *     $separator Optional. Separator between starting year and current year.
 *
 * @return string Copyright year text.
 */
function copyright_year( $atts ) {
	// Setup defaults.
	$args = shortcode_atts(
		[
			'starting_year' => '',
			'separator'     => ' - ',
		],
		$atts
	);

	$current_year = gmdate( 'Y' );

	// Return current year if starting year is empty.
	if ( ! $args['starting_year'] ) {
		return $current_year;
	}

	return esc_html( $args['starting_year'] . $args['separator'] . $current_year );
}

add_shortcode( '_s_copyright_year', __NAMESPACE__ . '\copyright_year', 15 );
