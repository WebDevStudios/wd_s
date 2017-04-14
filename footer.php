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
		<div class="wrap">

			<div class="site-info">
				<?php echo wp_kses_post( _s_get_copyright_text() ); ?>
			</div>

		</div><!-- .wrap -->
	</footer><!-- .site-footer -->
</div><!-- #page -->

<nav id="mobile-menu" class="mobile-nav-menu">
	<button class="close-mobile-menu"><span class="screen-reader-text"><?php echo esc_html_e( 'Close menu', '_s' ); ?></span><?php echo _s_get_svg( array( 'icon' => 'close' ) ); // WPCS: XSS ok. ?></button>
	<?php
		wp_nav_menu( array(
			'theme_location' => $mobile_menu,
			'menu_id'        => 'primary-menu',
			'menu_class'     => 'menu dropdown mobile-nav',
			'link_before'    => '<span>',
			'link_after'     => '</span>',
		) );
	?>
</nav>

<?php wp_footer(); ?>

</body>
</html>
