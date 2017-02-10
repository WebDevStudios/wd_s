<?php
/**
 * Customizer settings.
 *
 * @package _s
 */

/**
 * Register additional scripts.
 */
function _s_customize_additional_scripts( $wp_customize ) {

	// Register a setting.
	$wp_customize->add_setting(
		'_s_header_scripts',
		array(
			'default'           => '',
			'sanitize_callback' => 'force_balance_tags',
		)
	);

	// Create the setting field.
	$wp_customize->add_control(
		'_s_header_scripts',
		array(
			'label'       => esc_html__( 'Header Scripts', '_s' ),
			'description' => esc_html__( 'Additional scripts to add to the header. Basic HTML tags are allowed.', '_s' ),
			'section'     => '_s_additional_scripts_section',
			'type'        => 'textarea',
		)
	);

	// Register a setting.
	$wp_customize->add_setting(
		'_s_footer_scripts',
		array(
			'default'           => '',
			'sanitize_callback' => 'force_balance_tags',
		)
	);

	// Create the setting field.
	$wp_customize->add_control(
		'_s_footer_scripts',
		array(
			'label'       => esc_html__( 'Footer Scripts', '_s' ),
			'description' => esc_html__( 'Additional scripts to add to the footer. Basic HTML tags are allowed.', '_s' ),
			'section'     => '_s_additional_scripts_section',
			'type'        => 'textarea',
		)
	);
}
add_action( 'customize_register', '_s_customize_additional_scripts' );

/**
 * Register a social icons setting.
 */
function _s_customize_social_icons( $wp_customize ) {

	// Create an array of our social links for ease of setup.
	$social_networks = array( 'facebook', 'googleplus', 'instagram', 'linkedin', 'twitter' );

	// Loop through our networks to setup our fields.
	foreach ( $social_networks as $network ) {

		// Register a setting.
		$wp_customize->add_setting(
			'_s_' . $network . '_link',
			array(
				'default' => '',
				'sanitize_callback' => 'esc_url',
	        )
	    );

	    // Create the setting field.
	    $wp_customize->add_control(
	        '_s_' . $network . '_link',
	        array(
	            'label'   => sprintf( esc_html__( '%s Link', '_s' ), ucwords( $network ) ),
	            'section' => '_s_social_links_section',
	            'type'    => 'text',
	        )
	    );
	}
}
add_action( 'customize_register', '_s_customize_social_icons' );

/**
 * Register copyright text setting.
 */
function _s_customize_copyright_text( $wp_customize ) {

	// Register a setting.
	$wp_customize->add_setting(
		'_s_copyright_text',
		array(
			'default' => '',
		)
	);

	// Create the setting field.
	$wp_customize->add_control(
		new _s_Text_Editor_Custom_Control(
			$wp_customize,
			'_s_copyright_text',
			array(
				'label'       => esc_html__( 'Copyright Text', '_s' ),
				'description' => esc_html__( 'The copyright text will be displayed in the footer. Basic HTML tags allowed.', '_s' ),
				'section'     => '_s_footer_section',
				'type'        => 'textarea',
			)
		)
	);
}
add_action( 'customize_register', '_s_customize_copyright_text' );
