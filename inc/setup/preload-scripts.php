<?php
/**
 * Preload styles and scripts.
 *
 * @package _s
 */

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
