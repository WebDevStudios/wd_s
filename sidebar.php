<?php
/**
 * The sidebar containing the main widget area.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package wd_s
 */

if ( ( is_active_sidebar( 'sidebar-1' ) || is_active_sidebar( 'sidebar-2' ) ) && ! is_post_type_archive() && ! is_singular( 'post' ) ) {
	?>
	<aside class="sidebar widget-area">
		<?php dynamic_sidebar( 'sidebar-1' ); ?>
	</aside><!-- .secondary -->
	<?php
} else {
	?>
	<aside class="sidebar widget-area">
		<?php dynamic_sidebar( 'sidebar-2' ); ?>
	</aside><!-- .secondary -->
	<?php
}
