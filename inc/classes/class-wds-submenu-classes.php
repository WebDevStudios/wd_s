<?php
/**
 * Menu walker class extends the menu.
 *
 * @package _s
 */

/**
 * Menu walker class extends the menu.
 *
 * This allows us to add Foundation helper classes to submenus.
 *
 * @author Corey Collins
 */
class WDS_Submenu_Classes extends Walker_Nav_Menu {

	/**
	 * Starts the list before the elements are added.
	 *
	 * Adds classes to the unordered list sub-menus.
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param int    $depth  Depth of menu item. Used for padding.
	 * @param array  $args   An array of arguments. @see wp_nav_menu().
	 */
	function start_lvl( &$output, $depth = 0, $args = array() ) {

		// Set our default submenu classes.
		$sub_menu_classes = 'is-accordion-submenu';

		// If we're in a vertical menu, use vertical menu classes.
		if ( strpos( $args->menu_class, 'vertical' ) ) {
			$sub_menu_classes = 'is-dropdown-submenu';
		}

		// Depth-dependent classes.
		$indent        = ( $depth > 0  ? str_repeat( "\t", $depth ) : '' ); // code indent.
		$display_depth = ( $depth + 1); // because it counts the first submenu as 0.

		// Build our classes.
		$classes = array(
			'menu vertical submenu ' . $sub_menu_classes,
			( 1 === $display_depth ? 'first-sub' : '' ),
		);

		// Break our classes array into a string.
		$class_names = implode( ' ', $classes );

		// Build HTML for output.
		$output .= "\n" . $indent . '<ul class="' . $class_names . '">' . "\n";
	}
}
