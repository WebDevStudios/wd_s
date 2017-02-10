<?php
/**
 * Set up the theme customizer.
 *
 * @package _s
 */

/**
 * Include other customizer files.
 */
function _s_include_custom_controls() {
	require get_template_directory() . '/inc/customizer/panels.php';
	require get_template_directory() . '/inc/customizer/sections.php';
	require get_template_directory() . '/inc/customizer/settings.php';
	require get_template_directory() . '/inc/customizer/tinymce.php';
}
add_action( 'customize_register', '_s_include_custom_controls', -999 );

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function _s_customize_preview_js() {
	wp_enqueue_script( 'tiny_mce' );
	wp_enqueue_script( '_s-customize-tinymce', get_template_directory_uri() . '/inc/customizer/assets/scripts/tinymce.js', array( 'jquery' ), '1.0.0', true );
	wp_enqueue_script( '_s-customizer', get_template_directory_uri() . '/inc/customizer/assets/scripts/customizer.js', array( 'customize-preview' ), '20151215', true );
}
add_action( 'customize_preview_init', '_s_customize_preview_js' );

/**
 * Add live preview support via postMessage.
 *
 * @link https://codex.wordpress.org/Theme_Customization_API#Part_3:_Configure_Live_Preview_.28Optional.29
 * @param object $wp_customize An instance of WP_Customize_Manager class.
 * @author Greg Rickaby
 */
function _s_live_preview_support( $wp_customize ) {

	// Settings to apply live preview to.
	$settings = array(
		'blogname',
		'blogdescription',
		'_s_copyright_text',
	);

	// Loop through and add the live preview to each setting.
	foreach ( (array) $settings as $setting_name ) {

		// Try to get the customizer setting.
		$setting = $wp_customize->get_setting( $setting_name );

		// Skip if it is not an object to avoid notices.
		if ( ! is_object( $setting ) ) {
			continue;
		}

		// Set the transport to avoid page refresh.
		$setting->transport = 'postMessage';
	}
}
add_action( 'customize_register', '_s_live_preview_support', 999 );

/**
 * Add support for the fancy new edit icons.
 *
 * @link https://make.wordpress.org/core/2016/02/16/selective-refresh-in-the-customizer/
 * @param object $wp_customize An instance of WP_Customize_Manager class.
 * @author Greg Rickaby
 */
function _s_selective_refresh_support( $wp_customize ) {

	// The <div> classname to append edit icon too.
	$settings = array(
		'blogname'          => '.site-title a',
		'blogdescription'   => '.site-description',
		'_s_copyright_text' => '.site-info',
	);

	// Loop through, and add selector partials.
	foreach ( (array) $settings as $setting => $selector ) {
		$args = array( 'selector' => $selector );
		$wp_customize->selective_refresh->add_partial( $setting, $args );
	}
}
add_action( 'customize_register', '_s_selective_refresh_support' );
