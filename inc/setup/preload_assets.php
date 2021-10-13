<?php
/**
 * Preload assets.
 *
 * @author Corey Collins
 *
 * @package _s
 */
function _s_preload_assets() {
	?>
	<?php if ( _s_get_custom_logo_url() ) : ?>
		<link rel="preload" href="<?php echo esc_url( _s_get_custom_logo_url() ); ?>" as="image">
	<?php endif; ?>
	<?php
}
add_action( 'wp_head', '_s_preload_assets', 1 );
