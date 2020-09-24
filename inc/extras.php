<?php
/**
 * Custom functions that act independently of the theme templates.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package _s
 */

/**
 * Returns true if a blog has more than 1 category, else false.
 *
 * @author WDS
 * @return bool Whether the blog has more than one category.
 */
function _s_categorized_blog() {

	$category_count = get_transient( '_s_categories' );

	if ( false === $category_count ) {

		$category_count_query = get_categories(
			array(
				'fields' => 'count',
			)
		);

		$category_count = (int) $category_count_query[0];

		set_transient( '_s_categories', $category_count );
	}

	return $category_count > 1;
}

/**
 * Shortcode to display copyright year.
 *
 * @author Haris Zulfiqar
 * @param array $atts {.
 * @type string $starting_year Optional. Define starting year to show starting year and current year e.g. 2015 - 2018.
 * @type string $separator Optional. Separator between starting year and current year.
 * }
 * @return string
 */
function _s_copyright_year( $atts ) {

	// Setup defaults.
	$args = shortcode_atts(
		array(
			'starting_year' => '',
			'separator'     => ' - ',
		),
		$atts
	);

	$current_year = date( 'Y' );

	// Return current year if starting year is empty.
	if ( ! $args['starting_year'] ) {
		return $current_year;
	}

	return esc_html( $args['starting_year'] . $args['separator'] . $current_year );
}
add_shortcode( '_s_copyright_year', '_s_copyright_year', 15 );
