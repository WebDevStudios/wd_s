<?php
/**
 * Customizer sections.
 *
 * @package _s
 */

namespace WD_S\Customizer;

/**
 * Register the section sections.
 *
 * @author WebDevStudios
 * @param object $wp_customize Instance of WP_Customize_Class.
 */
function customize_sections( $wp_customize ) {

	// Register additional scripts section.
	$wp_customize->add_section(
		'_s_additional_scripts_section',
		[
			'title'    => esc_html__( 'Additional Scripts', '_s' ),
			'priority' => 10,
			'panel'    => 'site-options',
		]
	);

	// Register a social links section.
	$wp_customize->add_section(
		'_s_social_links_section',
		[
			'title'       => esc_html__( 'Social Media', '_s' ),
			'description' => esc_html__( 'Links here power the display_social_network_links() template tag.', '_s' ),
			'priority'    => 90,
			'panel'       => 'site-options',
		]
	);

	// Register a header section.
	$wp_customize->add_section(
		'_s_header_section',
		[
			'title'    => esc_html__( 'Header Customizations', '_s' ),
			'priority' => 90,
			'panel'    => 'site-options',
		]
	);

	// Register a footer section.
	$wp_customize->add_section(
		'_s_footer_section',
		[
			'title'    => esc_html__( 'Footer Customizations', '_s' ),
			'priority' => 90,
			'panel'    => 'site-options',
		]
	);
}
add_action( 'customize_register', 'WD_S\Customizer\customize_sections' );
