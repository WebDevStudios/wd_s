<?php
/**
 * The sidebar containing the main widget area.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _s
 */

$classname = ' container';

if ( ! is_active_sidebar( 'sidebar-1' ) ) {
	return;
}

$classname .= is_page_template( 'template-sidebar-left.php' ) ? ' left-third' : ' right-third';
?>

<aside class="sidebar widget-area<?php echo esc_attr( $classname ); ?>">
	<?php dynamic_sidebar( 'sidebar-1' ); ?>
</aside><!-- .secondary -->
