<?php
/**
 * The Footer markup.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package _s
 */

?>
<footer class="site-footer">

	<nav id="site-footer-navigation" class="footer-navigation navigation-menu" aria-label="<?php esc_attr_e( 'Footer Navigation', '_s' ); ?>">
		<?php
		wp_nav_menu(
			array(
				'fallback_cb'    => false,
				'theme_location' => 'footer',
				'menu_id'        => 'footer-menu',
				'menu_class'     => 'menu container',
				'container'      => false,
				'depth'          => 1,
			)
		);
		?>
	</nav><!-- #site-navigation-->

	<div class="container site-info">
		<?php _s_display_copyright_text(); ?>
		<?php _s_display_social_network_links(); ?>
	</div><!-- .site-info -->

</footer><!-- .site-footer container-->
