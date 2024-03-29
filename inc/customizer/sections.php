<?php
/**
 * Customizer sections.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Register the section sections.
 *
 * @author WebDevStudios
 * @param object $wp_customize Instance of WP_Customize_Class.
 */
function customize_sections( $wp_customize ) {

	// Register additional scripts section.
	$wp_customize->add_section(
		'wd_s_additional_scripts_section',
		[
			'title'    => esc_html__( 'Additional Scripts', 'wd_s' ),
			'priority' => 10,
			'panel'    => 'site-options',
		]
	);

	// Register a footer section.
	$wp_customize->add_section(
		'wd_s_footer_section',
		[
			'title'    => esc_html__( 'Footer Customizations', 'wd_s' ),
			'priority' => 90,
			'panel'    => 'site-options',
		]
	);
}
add_action( 'customize_register', __NAMESPACE__ . '\customize_sections' );
