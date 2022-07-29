<?php
/**
 * Hook the theme's scaffolding template parts into the scaffolding template.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Hook the theme's scaffolding template parts into the scaffolding template.
 *
 * @author Carrie Forde
 */
function hook_theme_scaffolding() {
	$template_dir = 'template-parts/scaffolding/scaffolding';

	print_theme_scaffolding_nav();

	get_template_part( $template_dir, 'globals' );
	get_template_part( $template_dir, 'typography' );
	get_template_part( $template_dir, 'media' );
	get_template_part( $template_dir, 'icons' );
	get_template_part( $template_dir, 'buttons' );
	get_template_part( $template_dir, 'forms' );
	get_template_part( $template_dir, 'elements' );
}

add_action( 'wd_s_scaffolding_content', __NAMESPACE__ . '\hook_theme_scaffolding' );
