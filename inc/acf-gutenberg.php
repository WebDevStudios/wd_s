<?php
/**
 * ACF block registration for Gutenberg.
 *
 * A place to register blocks for use in Gutenberg.
 *
 * @package _s
 */

// Make sure ACF is active.
if ( ! function_exists( 'acf_register_block_type' ) ) {
	return;
}

/**
 * Register our ACF Blocks.
 *
 * @author Corey Collins
 */
function _s_acf_init() {

	$supports = array(
		'align'  => array( 'wide', 'full' ),
		'anchor' => true,
	);

	// Register our Accordion block.
	acf_register_block_type(
		array(
			'name'            => 'wds-accordion',
			'title'           => esc_html__( 'Accordion', '_s' ),
			'description'     => esc_html__( 'A custom set of collapsable accordion items.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'sort',
			'keywords'        => array( 'accordion', 'wds' ),
			'mode'            => 'preview',
			'enqueue_assets'  => '_s_acf_enqueue_accordion_scripts',
			'align'           => 'wide',
			'supports'        => $supports,
			'example'         => array(
				'attributes' => array(
					'data' => array(
						'title'           => esc_html__( 'Accordion Block Title', '_s' ),
						'text'            => esc_html__( 'Accordion Block Content', '_s' ),
						'accordion_items' => array(
							'0' => array(
								'accordion_title' => esc_html__( 'Accordion Item Title', '_s' ),
								'accordion_text'  => esc_html__( 'Accordion Item Content', '_s' ),
							),
						),
					),
				),
			),
		)
	);

	acf_register_block_type(
		array(
			'name'            => 'wds-carousel',
			'title'           => esc_html__( 'Carousel', '_s' ),
			'description'     => esc_html__( 'A carousel with a call to action for each slide.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'slides',
			'keywords'        => array( 'carousel', 'slider', 'wds' ),
			'mode'            => 'preview',
			'enqueue_assets'  => '_s_acf_enqueue_carousel_scripts',
			'align'           => 'wide',
			'supports'        => $supports,
		)
	);

	acf_register_block_type(
		array(
			'name'            => 'wds-cta',
			'title'           => esc_html__( 'Call To Action', '_s' ),
			'description'     => esc_html__( 'A call to action block.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'megaphone',
			'keywords'        => array( 'call to action', 'cta', 'wds' ),
			'mode'            => 'preview',
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'align'           => 'wide',
			'supports'        => $supports,
		)
	);

	acf_register_block_type(
		array(
			'name'            => 'wds-fifty-fifty',
			'title'           => esc_html__( 'Fifty/Fifty Block', '_s' ),
			'description'     => esc_html__( 'A split-content block with text and/or media.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'editor-table',
			'keywords'        => array( 'fifty fifty', 'columns', 'wds' ),
			'mode'            => 'preview',
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'align'           => 'wide',
			'supports'        => $supports,
		)
	);

	acf_register_block_type(
		array(
			'name'            => 'wds-hero',
			'title'           => esc_html__( 'Hero Block', '_s' ),
			'description'     => esc_html__( 'A hero with an optional call to action.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'slides',
			'keywords'        => array( 'hero', 'wds' ),
			'mode'            => 'preview',
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'align'           => 'wide',
			'supports'        => $supports,
		)
	);

	acf_register_block_type(
		array(
			'name'            => 'wds-recent-posts',
			'title'           => esc_html__( 'Recent Posts Block', '_s' ),
			'description'     => esc_html__( 'A set of recent posts displayed by category and/or tag.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'admin-page',
			'keywords'        => array( 'recent posts', 'posts', 'wds' ),
			'mode'            => 'preview',
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'align'           => 'wide',
			'supports'        => $supports,
		)
	);

	acf_register_block_type(
		array(
			'name'            => 'wds-related-posts',
			'title'           => esc_html__( 'Related Posts Block', '_s' ),
			'description'     => esc_html__( 'A set of manually selected posts.', '_s' ),
			'render_callback' => '_s_acf_block_registration_callback',
			'category'        => 'wds-blocks',
			'icon'            => 'admin-page',
			'keywords'        => array( 'related posts', 'posts', 'wds' ),
			'mode'            => 'preview',
			'enqueue_assets'  => '_s_acf_enqueue_backend_block_styles',
			'align'           => 'wide',
			'supports'        => $supports,
		)
	);
}
add_action( 'acf/init', '_s_acf_init' );

/**
 * Our callback function – this looks for the block based on its given name.
 * Name accordingly to the file name!
 *
 * @param array $block The block details.
 * @return void Bail if the block has expired.
 * @author Corey Collins
 */
function _s_acf_block_registration_callback( $block ) {

	// Convert the block name into a handy slug.
	$block_slug = str_replace( 'acf/', '', $block['name'] );

	// If the block has expired, then bail! But only on the frontend, so we can still see and edit the block in the backend.
	if ( ! is_admin() && _s_has_block_expired(
		array(
			'start_date' => strtotime( $block['data']['other_options_start_date'], true ),
			'end_date'   => strtotime( $block['data']['other_options_end_date'], true ),
		)
	) ) {
		return;
	}

	_s_display_expired_block_message();

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
				'title' => esc_html__( 'WDS Blocks', '_s' ),
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

	_s_acf_enqueue_backend_block_styles();
	wp_register_style( 'slick-carousel', get_template_directory_uri() . '/assets/bower_components/slick-carousel/slick/slick.css', null, '1.8.1' );
	wp_register_script( 'slick-carousel-js', get_template_directory_uri() . '/assets/bower_components/slick-carousel/slick/slick.min.js', array( 'jquery' ), '1.8.1', true );
	wp_enqueue_style( 'slick-carousel' );
	wp_enqueue_script( 'slick-carousel-js' );
	wp_enqueue_script( 'wds-block-js', get_template_directory_uri() . '/assets/scripts/project.js', array( 'slick-carousel-js' ), '1.0.0', true );
}

/**
 * Enqueues accordion scripts.
 *
 * @return void
 * @author Corey Collins
 */
function _s_acf_enqueue_accordion_scripts() {

	if ( ! is_admin() ) {
		return;
	}

	_s_acf_enqueue_backend_block_styles();
	wp_enqueue_script( 'wds-block-js', get_template_directory_uri() . '/assets/scripts/project.js', array( 'jquery' ), '1.0.0', true );
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

	return ! empty( $block['align'] ) ? ' align' . esc_attr( $block['align'] ) : 'alignwide';
}

/**
 * Returns the class names set for a content block.
 *
 * @param array $block The block settings.
 * @return string The class, if one is set.
 * @author Corey Collins
 */
function _s_get_block_classes( $block ) {

	if ( ! $block ) {
		return;
	}

	$classes  = '';
	$classes  = _s_get_block_expired_class();
	$classes .= ! empty( $block['className'] ) ? ' ' . esc_attr( $block['className'] ) : '';

	return $classes;
}

/**
 * Returns a class to be used for expired blocks.
 *
 * @return string The class, if one is set.
 * @author Corey Collins
 */
function _s_get_block_expired_class() {

	if ( ! is_admin() ) {
		return;
	}

	$other_options = get_sub_field( 'other_options' ) ? get_sub_field( 'other_options' ) : get_field( 'other_options' )['other_options'];

	if ( _s_has_block_expired(
		array(
			'start_date' => $other_options['start_date'],
			'end_date'   => $other_options['end_date'],
		)
	) ) {
		return ' block-expired';
	}
}

/**
 * Displays a message for the user on the backend if a block is expired.
 *
 * @return void Bail if the block isn't expired.
 * @author Corey Collins
 */
function _s_display_expired_block_message() {

	if ( ! _s_get_block_expired_class() ) {
		return;
	}

	?>
	<div class="block-expired-message">
		<span class="block-expired-text"><?php esc_html_e( 'Your block has expired. Please change or remove the Start and End dates under Other Options to display your block on the frontend.', '_s' ); ?></span>
	</div>
	<?php
}

/**
 * Returns the ID (anchor link field) set for a content block.
 *
 * @param array $block The block settings.
 * @return string The ID, if one is set.
 * @author Corey Collins
 */
function _s_get_block_id( $block ) {

	if ( ! $block ) {
		return;
	}

	return empty( $block['anchor'] ) ? str_replace( '_', '-', $block['id'] ) : esc_attr( $block['anchor'] );
}

/**
 * Displays a dummy carousel on the backend, since there won't be any rows to load when first adding.
 *
 * @param array $block The block settings.
 * @return void Bail if we have to.
 * @author Corey Collins
 */
function _s_acf_gutenberg_display_admin_default_carousel( $block ) {

	// Only in the dashboard.
	if ( ! is_admin() ) {
		return;
	}

	// Only if we don't have rows added manually.
	if ( have_rows( 'carousel_slides' ) ) {
		return;
	}

	echo '<div class="content-block carousel-block">';

	for ( $slides = 0; $slides < 2; $slides++ ) :
		?>
		<section class-"slide">
			<div class="slide-content container">
				<h2 class="slide-title"><?php esc_html_e( 'Slide Title', '_s' ); ?></h2>
				<p class="slide-description"><?php esc_html_e( 'Slide Content', '_s' ); ?></p>
			</div>
		</section>
	<?php
	endfor;

	echo '</div>';
}
