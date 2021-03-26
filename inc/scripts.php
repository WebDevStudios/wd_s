<?php
/**
 * Custom scripts and styles.
 *
 * @package _s
 */

/**
 * Enqueue scripts and styles.
 *
 * @author WDS
 */
function _s_scripts() {
	/**
	 * Global variable for IE.
	 */
	global $is_IE; // @codingStandardsIgnoreLine

	/**
	 * If WP is in script debug, or we pass ?script_debug in a URL - set debug to true.
	 */
	// phpcs:ignore WordPress.Security.NonceVerification -- CSRF OK
	$debug = ( defined( 'SCRIPT_DEBUG' ) && true === SCRIPT_DEBUG ) || ( isset( $_GET['script_debug'] ) ) ? true : false;
	/**
	 * If we are debugging the site, use a unique version every page load so as to ensure no cache issues.
	 */
	$version = '1.0.0';

	/**
	 * Should we load minified files?
	 */
	$suffix = ( true === $debug ) ? '' : '.min';

	$asset_file = include( __DIR__ . '/../build/index.asset.php' );

	// Register styles & scripts.
	wp_enqueue_style( 'wd_s', get_stylesheet_directory_uri() . '/build/index.css', array(), $asset_file['version'] );
	wp_enqueue_script( 'wds-scripts', get_stylesheet_directory_uri() . '/build/index.js', $asset_file['dependencies'], $asset_file['version'], true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', '_s_scripts' );

/**
 * Enqueue editor styles.
 *
 * @author WDS
 */
function _s_editor_styles() {

	$asset_file = include( __DIR__ . '/../build/editor.asset.php' );

	// Register styles & scripts.
	wp_enqueue_style( 'wd_s-editor', get_stylesheet_directory_uri() . '/build/editor.css', array(), $asset_file['version'] );
}
add_action( 'enqueue_block_editor_assets', '_s_editor_styles' );
