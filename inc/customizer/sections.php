<?php
/**
 * Customizer sections.
 *
 * @package _s
 */

/**
 * Register the section sections.
 */
function _s_customize_sections( $wp_customize ) {

	// Register additional scripts section.
	$wp_customize->add_section(
		'_s_additional_scripts_section',
		array(
			'title'    => esc_html__( 'Additional Scripts', '_s' ),
			'priority' => 10,
			'panel'    => 'site-options',
		)
	);

	// Register a footer section.
	$wp_customize->add_section(
		'_s_footer_section',
		array(
			'title'    => esc_html__( 'Footer Customizations', '_s' ),
			'priority' => 90,
			'panel'    => 'site-options',
		)
	);
}
add_action( 'customize_register', '_s_customize_sections' );
