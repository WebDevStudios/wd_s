<?php
/**
 * Declare HTML tags allowed for scaffolding.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Declare HTML tags allowed for scaffolding.
 *
 * @author Carrie Forde
 *
 * @return array The allowed tags and attributes.
 */
function scaffolding_allowed_html() {
	// Add additional HTML tags to the wp_kses() allowed html filter.
	return array_merge(
		wp_kses_allowed_html( 'post' ),
		[
			'svg'    => [
				'aria-hidden' => true,
				'class'       => true,
				'id'          => true,
				'role'        => true,
				'title'       => true,
				'fill'        => true,
				'height'      => true,
				'width'       => true,
				'use'         => true,
				'path'        => true,
			],
			'use'    => [
				'xlink:href' => true,
			],
			'title'  => [
				'id' => true,
			],
			'desc'   => [
				'id' => true,
			],
			'select' => [
				'class' => true,
			],
			'option' => [
				'option'   => true,
				'value'    => true,
				'selected' => true,
				'disabled' => true,
			],
			'input'  => [
				'type'        => true,
				'name'        => true,
				'value'       => true,
				'placeholder' => true,
				'class'       => true,
			],
			'iframe' => [
				'src'             => [],
				'height'          => [],
				'width'           => [],
				'frameborder'     => [],
				'allowfullscreen' => [],
			],
		]
	);
}
