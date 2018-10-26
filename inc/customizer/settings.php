<?php
/**
 * Customizer settings.
 *
 * @package _s
 */

/**
 * Register additional scripts.
 *
 * @param object $wp_customize Instance of WP_Customize_Class.
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
 *
 * @param object $wp_customize Instance of WP_Customize_Class.
 */
function _s_customize_social_icons( $wp_customize ) {

	// Create an array of our social links for ease of setup.
	$social_networks = array( 'facebook', 'instagram', 'linkedin', 'twitter' );

	// Loop through our networks to setup our fields.
	foreach ( $social_networks as $network ) {

		// Register a setting.
		$wp_customize->add_setting(
			'_s_' . $network . '_link',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url',
			)
		);

		// Create the setting field.
		$wp_customize->add_control(
			'_s_' . $network . '_link',
			array(
				'label'   => /* translators: the social network name. */ sprintf( esc_html__( '%s URL', '_s' ), ucwords( $network ) ),
				'section' => '_s_social_links_section',
				'type'    => 'text',
			)
		);
	}
}
add_action( 'customize_register', '_s_customize_social_icons' );

/**
 * Register copyright text setting.
 *
 * @param object $wp_customize Instance of WP_Customize_Class.
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
		new Text_Editor_Custom_Control(
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

/**
 * Register header button setting.
 *
 * @param object $wp_customize Instance of WP_Customize_Class.
 */
function _s_customize_header_button( $wp_customize ) {

	// Register a setting.
	$wp_customize->add_setting(
		'_s_header_button',
		array(
			'default'           => '',
			'sanitize_callback' => '_s_sanitize_select',
		)
	);

	// Create the setting field.
	$wp_customize->add_control(
		'_s_header_button',
		array(
			'label'       => esc_html__( 'Header Button', '_s' ),
			'description' => esc_html__( 'Display a custom button in the header.', '_s' ),
			'section'     => '_s_header_section',
			'type'        => 'select',
			'choices'     => array(
				'none'   => esc_html__( 'No button', '_s' ),
				'search' => esc_html__( 'Trigger a search field', '_s' ),
				'link'   => esc_html__( 'Link to a custom URL', '_s' ),
			),
		)
	);

	// Register a setting for the URL.
	$wp_customize->add_setting(
		'_s_header_button_url',
		array(
			'default'           => '',
			'sanitize_callback' => 'esc_url',
		)
	);

	// Display the URL field... maybe!
	$wp_customize->add_control(
		'_s_header_button_url',
		array(
			'label'           => esc_html__( 'Header Button URL', '_s' ),
			'description'     => esc_html__( 'Enter the URL or email address to be used by the button in the header.', '_s' ),
			'section'         => '_s_header_section',
			'type'            => 'url',
			'active_callback' => '_s_customizer_is_header_button_link', // Only displays if the Link option is selected above.
		)
	);

	// Register a setting for the link text.
	$wp_customize->add_setting(
		'_s_header_button_text',
		array(
			'default'           => '',
			'sanitize_callback' => 'wp_filter_nohtml_kses',
		)
	);

	// Display the text field... maybe!
	$wp_customize->add_control(
		'_s_header_button_text',
		array(
			'label'           => esc_html__( 'Header Button Text', '_s' ),
			'description'     => esc_html__( 'Enter the text to be displayed in the button in the header.', '_s' ),
			'section'         => '_s_header_section',
			'type'            => 'text',
			'active_callback' => '_s_customizer_is_header_button_link', // Only displays if the Link option is selected above.
		)
	);
}
add_action( 'customize_register', '_s_customize_header_button' );

/**
 * Sanitizes the select dropdown in the customizer.
 *
 * @param string $input  The input.
 * @param string $setting The setting.
 * @return string
 * @author Corey Collins
 */
function _s_sanitize_select( $input, $setting ) {

	// Ensure input is a slug.
	$input = sanitize_key( $input );

	// Get list of choices from the control associated with the setting.
	$choices = $setting->manager->get_control( $setting->id )->choices;

	// If the input is a valid key, return it; otherwise, return the default.
	return ( array_key_exists( $input, $choices ) ? $input : $setting->default );
}

/**
 * Checks to see if the link option is selected in our button settings.
 *
 * @return boolean True/False whether or not the Link radio is selected.
 * @author Corey Collins
 */
function _s_customizer_is_header_button_link() {

	// Get our button setting.
	$button_setting = get_theme_mod( '_s_header_button' );

	if ( 'link' !== $button_setting ) {
		return false;
	}

	return true;
}
