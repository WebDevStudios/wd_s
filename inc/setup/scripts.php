<?php
/**
 * Enqueue scripts and styles.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Enqueue scripts and styles.
 *
 * @author WebDevStudios
 */
function scripts() {
	$asset_file_path = dirname( __DIR__ ) . '/build/index.asset.php';

	if ( is_readable( $asset_file_path ) ) {
		$asset_file = include $asset_file_path;
	} else {
		$asset_file = [
			'version'      => '1.0.0',
			'dependencies' => [ 'wp-polyfill' ],
		];
	}

	// Register styles & scripts.
	wp_enqueue_style( 'wd_s', get_stylesheet_directory_uri() . '/build/index.css', [], $asset_file['version'] );
	wp_enqueue_script( 'wds-scripts', get_stylesheet_directory_uri() . '/build/index.js', $asset_file['dependencies'], $asset_file['version'], true );
	wp_enqueue_script( 'abs-alpine', 'https://unpkg.com/alpinejs@3.7.1/dist/cdn.min.js', $asset_file['dependencies'], $asset_file['version'], true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\scripts' );
