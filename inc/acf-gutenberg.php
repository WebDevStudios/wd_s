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
			'mode'            => false,
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'supports'        => array(
				'align' => array( 'wide', 'full' ),
			),
		)
	);

	acf_register_block(
		array(
			'name'            => 'carousel',
			'title'           => __( 'Carousel', '_s' ),
			'description'     => __( 'A carousel with a call to action for each slide.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'slides',
			'keywords'        => array( 'carousel', 'slider', 'wds' ),
			'mode'            => false,
			'enqueue_assets'  => '_s_acf_enqueue_carousel_scripts',
			'supports'        => array(
				'align' => array( 'wide', 'full' ),
			),
		)
	);

	acf_register_block(
		array(
			'name'            => 'cta',
			'title'           => __( 'Call To Action', '_s' ),
			'description'     => __( 'A call to action block.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'megaphone',
			'keywords'        => array( 'call to action', 'cta', 'wds' ),
			'mode'            => false,
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'supports'        => array(
				'align' => array( 'wide', 'full' ),
			),
		)
	);

	acf_register_block(
		array(
			'name'            => 'fifty-fifty',
			'title'           => __( 'Fifty/Fifty Block', '_s' ),
			'description'     => __( 'A split-content block with text and/or media.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'editor-table',
			'keywords'        => array( 'fifty fifty', 'columns', 'wds' ),
			'mode'            => false,
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'supports'        => array(
				'align' => array( 'wide', 'full' ),
			),
		)
	);

	acf_register_block(
		array(
			'name'            => 'hero',
			'title'           => __( 'Hero Block', '_s' ),
			'description'     => __( 'A hero with an optional call to action.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'slides',
			'keywords'        => array( 'hero', 'wds' ),
			'mode'            => false,
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'supports'        => array(
				'align' => array( 'wide', 'full' ),
			),
		)
	);

	acf_register_block(
		array(
			'name'            => 'recent-posts',
			'title'           => __( 'Recent Posts Block', '_s' ),
			'description'     => __( 'A set of recent posts displayed by category and/or tag.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'admin-page',
			'keywords'        => array( 'recent posts', 'posts', 'wds' ),
			'mode'            => false,
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'supports'        => array(
				'align' => array( 'wide', 'full' ),
			),
		)
	);

	acf_register_block(
		array(
			'name'            => 'related-posts',
			'title'           => __( 'Related Posts Block', '_s' ),
			'description'     => __( 'A set of manually selected posts.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'admin-page',
			'keywords'        => array( 'related posts', 'posts', 'wds' ),
			'mode'            => false,
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'supports'        => array(
				'align' => array( 'wide', 'full' ),
			),
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
 * @param array  $categories The existing categories.
 * @param object $post The current post.
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

/**
 * Enqueues a stylesheet for backend block styles.
 *
 * @return void Bail if we're not in the dashboard.
 * @author Corey Collins
 */
function _s_acf_enqueue_backend_block_styles() {

	if ( ! is_admin() ) {
		return;
	}

	// Enqueue styles here, eventually. And scripts. Need to look at a good way of enqueuing things smartly on the backend without having to enqueue the whole of project.js, for instance.
	wp_enqueue_style( 'wds-gutenberg-blocks', get_template_directory_uri() . '/gutenberg-blocks-style.css', array(), '1.0.0' );
}

/**
 * Enqueues carousel scripts.
 *
 * @return void
 * @author Corey Collins
 */
function _s_acf_enqueue_carousel_scripts() {

	if ( ! is_admin() ) {
		return;
	}

	wp_register_style( 'slick-carousel', get_template_directory_uri() . '/assets/bower_components/slick-carousel/slick/slick.css', null, '1.8.1' );
	wp_register_script( 'slick-carousel', get_template_directory_uri() . '/assets/bower_components/slick-carousel/slick/slick.min.js', array( 'jquery' ), '1.8.1', true );
	wp_enqueue_script( 'wds-carousel', get_template_directory_uri() . '/assets/scripts/project.js', array( 'slick-carousel' ), '1.0.0', true );
	wp_enqueue_style( 'slick-carousel' );
}

/**
 * Returns the alignment set for a content block.
 *
 * @param array $block The block settings.
 * @return string The class, if one is set.
 * @author Corey Collins
 */
function _s_get_block_alignment( $block ) {

	if ( ! $block ) {
		return;
	}

	return ! empty( $block['align'] ) ? ' align' . esc_attr( $block['align'] ) : '';
}
