<?php
/**
 * Block patterns.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Registers the block pattern categories.
 */
function register_block_pattern_categories() {
	if ( function_exists( 'register_block_pattern_category' ) ) {
		register_block_pattern_category( 'columns', array( 'label' => esc_html_x( 'Columns', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'text-image', array( 'label' => esc_html_x( 'Text and Image', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'text', array( 'label' => esc_html_x( 'Text', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'hero', array( 'label' => esc_html_x( 'Hero', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'cover', array( 'label' => esc_html_x( 'Cover', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'cta', array( 'label' => esc_html_x( 'Call to Action', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'list', array( 'label' => esc_html_x( 'List', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'numbers', array( 'label' => esc_html_x( 'Numbers, Stats', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'gallery', array( 'label' => esc_html_x( 'Gallery', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'video-audio', array( 'label' => esc_html_x( 'Video, Audio', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'latest-posts', array( 'label' => esc_html_x( 'Latest Posts', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'contact', array( 'label' => esc_html_x( 'Contact', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'team', array( 'label' => esc_html_x( 'Team', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'testimonials', array( 'label' => esc_html_x( 'Testimonials', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'logos', array( 'label' => esc_html_x( 'Logos, Clients', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'pricing', array( 'label' => esc_html_x( 'Pricing', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'faq', array( 'label' => esc_html_x( 'FAQ', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'events', array( 'label' => esc_html_x( 'Events, Schedule', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'buttons', array( 'label' => _x( 'Buttons', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'pages', array( 'label' => _x( 'Pages', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'page-single', array( 'label' => _x( 'Single Pages', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'query', array( 'label' => _x( 'Query', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'header', array( 'label' => _x( 'Headers', 'Block pattern category', 'wd_s' ) ) );
		register_block_pattern_category( 'footer', array( 'label' => _x( 'Footers', 'Block pattern category', 'wd_s' ) ) );
	}
}
add_action( 'init', __NAMESPACE__ . '\register_block_pattern_categories' );


/**
 * Registers the block patterns.
 */
function register_block_patterns() {

	$files = array(
		'columns.php',
		'text.php',
		'contact.php',
		'text-image.php',
		'cover.php',
		'cta.php',
		'events.php',
		'faq.php',
		'gallery.php',
		'hero.php',
		'latest-posts.php',
		'list.php',
		'logos.php',
		'numbers.php',
		'pricing.php',
		'team.php',
		'testimonials.php',
		'video-audio.php',
		'pages.php',
		'single-page.php',
		'header.php',
		'footer.php',
		'query.php',
	);

	$path = trailingslashit( get_template_directory() ) . 'inc/blocks/patterns/';

	foreach ( $files as $file ) {
		if ( file_exists( $path . $file ) ) {
			require_once $path . $file;
		}
	}
}
add_action( 'init', __NAMESPACE__ . '\register_block_patterns' );

/**
 * Retrieves the url of asset stored inside the plugin that can be used in block patterns.
 *
 * @param string $asset_name Asset name.
 */
function get_pattern_asset( $asset_name ) {
	return esc_url( trailingslashit( get_template_directory_uri() ) . '/build/images/patterns/' . $asset_name );
}
