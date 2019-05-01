<?php
/**
 * ACF block registration for Gutenberg.
 *
 * A place to register blocks for use in Gutenberg.
 *
 * @package _s
 */

// Make sure ACF is active.
if ( ! function_exists( 'acf_register_block' ) ) {
	return;
}

/**
 * Register our ACF Blocks.
 *
 * @author Corey Collins
 */
function _s_acf_init() {

	// Register our Accordion block.
	acf_register_block(
		array(
			'name'            => 'accordion',
			'title'           => __( 'Accordion', '_s' ),
			'description'     => __( 'A custom set of collapsable accordion items.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'keywords'        => array( 'accordion', 'wds' ),
		)
	);
}
add_action( 'acf/init', '_s_acf_init' );

/**
 * Our callback function – this looks for the block based on its given name.
 * Name accordingly to the file name!
 *
 * @param array $block The block details.
 * @author Corey Collins
 */
function _s_acf_block_registration_callback( $block ) {

	// Convert the block name into a handy slug.
	$block_slug = str_replace( 'acf/', '', $block['name'] );

	// Include our template part.
	if ( file_exists( get_theme_file_path( '/template-parts/content-blocks/block-' . $block_slug . '.php' ) ) ) {
		include get_theme_file_path( '/template-parts/content-blocks/block-' . $block_slug . '.php' );
	}
}

/**
 * Adds a WDS Block category to the Gutenberg category list.
 *
 * @param array $categories The existing categories.
 * @param object $post The current post
 * @return array The updated array of categories.
 * @author Corey Collins
 */
function _s_add_block_categories( $categories, $post ) {

	return array_merge(
		$categories,
		array(
			array(
				'slug'  => 'wds-blocks',
				'title' => __( 'WDS Blocks', '_s' ),
			),
		)
	);
}
add_filter( 'block_categories', '_s_add_block_categories', 10, 2 );
