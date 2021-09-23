<?php
/**
 * Custom scripts and styles.
 *
 * @package _s
 */

/**
 * Enqueue scripts and styles.
 *
 * @author WebDevStudios
 */
function _s_scripts() {
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

	s_enqueue_template_part_styles();

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', '_s_scripts' );

/**
 * Preload styles and scripts.
 *
 * @author WebDevStudios
 */
function _s_preload_scripts() {
	$asset_file_path = dirname( __DIR__ ) . '/build/index.asset.php';

	if ( is_readable( $asset_file_path ) ) {
		$asset_file = include $asset_file_path;
	} else {
		$asset_file = [
			'version'      => '1.0.0',
			'dependencies' => [ 'wp-polyfill' ],
		];
	}

	?>
	<link rel="preload" href="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/build/index.css?ver=<?php echo esc_html( $asset_file['version'] ); ?>" as="style">
	<link rel="preload" href="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/build/index.js?ver=<?php echo esc_html( $asset_file['version'] ); ?>" as="script">
	<?php
}
add_action( 'wp_head', '_s_preload_scripts', 1 );

/**
 * Preload assets.
 *
 * @author Corey Collins
 */
function _s_preload_assets() {
	?>
	<?php if ( _s_get_custom_logo_url() ) : ?>
		<link rel="preload" href="<?php echo esc_url( _s_get_custom_logo_url() ); ?>" as="image">
	<?php endif; ?>
	<?php
}
add_action( 'wp_head', '_s_preload_assets', 1 );

/**
 * Return the current template path for enqueuing Template Module stylesheets.
 *
 * @author Corey Collins
 */
function _s_get_current_template_file_path() {
	global $template;

	return pathinfo( basename( $template ), PATHINFO_FILENAME );
}

/**
 * Enqueues a specific stylesheet for our Template Module.
 *
 * @author Corey Collins
 */
function s_enqueue_template_part_styles() {
	$asset_file_path  = dirname( __DIR__ ) . '/build/index.asset.php';
	$current_template = _s_get_current_template_file_path();

	// Set index for page.
	$current_template = 'index' && ! is_front_page() && is_page() ? 'page' : $current_template;

	if ( ! is_dir( get_stylesheet_directory() . '/template-parts/' . $current_template ) ) {
		return;
	}

	wp_enqueue_style( $current_template, get_stylesheet_directory_uri() . '/build/template-parts/' . $current_template . '.css', [], $asset_file['version'] );
}
