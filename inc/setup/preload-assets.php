<?php
/**
 * Preload assets.
 *
 * @package _s
 */

namespace WD_S\Setup;

use function WD_S\Functions\return_custom_logo_url;

/**
 * Preload assets.
 *
 * @author Corey Collins
 */
function preload_assets() {
	?>
	<?php if ( return_custom_logo_url() ) : ?>
		<link rel="preload" href="<?php echo esc_url( Functions\return_custom_logo_url() ); ?>" as="image">
	<?php endif; ?>
	<?php
}
add_action( 'wp_head', 'WD_S\Setup\preload_assets', 1 );
