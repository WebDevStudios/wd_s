<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _s
 */

?>

	</div><!-- #content -->

	<footer class="site-footer">

		<div class="site-info">
			<?php _s_display_copyright_text(); ?>
			<?php _s_display_social_network_links(); ?>
		</div><!-- .site-info -->
	</footer><!-- .site-footer container-->
</div><!-- #page -->

<?php wp_footer(); ?>

<nav class="off-canvas-container" aria-hidden="true">
	<button type="button" class="off-canvas-close" aria-label="<?php esc_html_e( 'Close Menu', '_s' ); ?>">
		<span class="close"></span>
	</button>
	<?php
		// Mobile menu args.
		$mobile_args = array(
			'theme_location'  => 'mobile',
			'container'       => 'div',
			'container_class' => 'off-canvas-content',
			'container_id'    => '',
			'menu_id'         => 'mobile-menu',
			'menu_class'      => 'mobile-menu',
		);

		// Display the mobile menu.
		wp_nav_menu( $mobile_args );
	?>
</nav>
<div class="off-canvas-screen"></div>
</body>
</html>
