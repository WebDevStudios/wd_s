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

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', '_s_scripts' );

/**
 * Preload styles and scripts.
 *
 * Because we're using an asset file (which generates a random version number)
 * to enqueue our theme's styles and scripts, we need to pluck the version
 * number out of the $wp_styles global variable.
 *
 * @author WebDevStudios
 */
function _s_preload_scripts() {
	global $wp_styles;

	// Set defaults.
	$data    = '';
	$version = '';

	/**
	 * Loop over the $wp_styles global variable and pluck the version number.
	 */
	foreach ( $wp_styles as $key => $value ) {
		if ( 'registered' === $key ) {
			$data    = $value['wd_s']; // Note: the array key needs to match the $handle used when enuqueing the main stylesheet.
			$version = $data->ver;
		}
	}
	?>
	<link rel="preload" href="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/build/index.css?ver=<?php echo esc_html( $version ); ?>" as="style">
	<link rel="preload" href="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/build/index.js?ver=<?php echo esc_html( $version ); ?>" as="script">
	<?php
}
add_action( 'wp_head', '_s_preload_scripts', 1 );
