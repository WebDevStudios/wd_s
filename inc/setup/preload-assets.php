<?php
/**
 * Preload assets.
 *
 * @package _s
 */

/**
 * Preload assets.
 *
 * @author Corey Collins
 */

namespace WD_S\Setup;

use WD_S\Functions;

function preload_assets() {
	?>
	<?php if ( Functions\return_custom_logo_url() ) : ?>
		<link rel="preload" href="<?php echo esc_url( Functions\return_custom_logo_url() ); ?>" as="image">
	<?php endif; ?>
	<?php
}
add_action( 'wp_head', 'WD_S\Setup\preload_assets', 1 );
