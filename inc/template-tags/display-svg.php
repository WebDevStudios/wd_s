<?php
/**
 * Display SVG Markup.
 *
 * @package _s
 */

namespace WebDevStudios\wd_s\TemplateTags;

use function WD_S\Functions\return_svg;

/**
 * Display SVG Markup.
 *
 * @author WebDevStudios
 *
 * @param array $args The parameters needed to get the SVG.
 */
function display_svg( $args = [] ) {
	$kses_defaults = wp_kses_allowed_html( 'post' );

	$svg_args = [
		'svg'   => [
			'class'           => true,
			'aria-hidden'     => true,
			'aria-labelledby' => true,
			'role'            => true,
			'xmlns'           => true,
			'width'           => true,
			'height'          => true,
			'viewbox'         => true, // <= Must be lower case!
			'color'           => true,
			'stroke-width'    => true,
		],
		'g'     => [ 'color' => true ],
		'title' => [
			'title' => true,
			'id'    => true,
		],
		'path'  => [
			'd'     => true,
			'color' => true,
		],
		'use'   => [
			'xlink:href' => true,
		],
	];

	$allowed_tags = array_merge(
		$kses_defaults,
		$svg_args
	);

	echo wp_kses(
		return_svg( $args ),
		$allowed_tags
	);
}
