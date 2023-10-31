<?php
/**
 * Remove the 'Customize' and 'Menu' links.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Remove the 'Customize' link and 'Menus' submenu item from the 'Appearance' menu in the admin.
 */
function remove_customize_and_menus_links() {
	global $submenu;

	foreach ( $submenu as $menu_slug => $menu_items ) {
		if ( 'themes.php' === $menu_slug ) {
			foreach ( $menu_items as $i => $data ) {
				if ( in_array( 'customize', $data, true ) || in_array( 'nav-menus.php', $data, true ) ) {
					unset( $submenu[ $menu_slug ][ $i ] );
				}
			}
		}
	}
}

// Hook the function to the 'admin_menu' action.
add_action( 'admin_menu', __NAMESPACE__ . '\remove_customize_and_menus_links' );
