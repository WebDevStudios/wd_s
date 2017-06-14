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
	</main><!-- #main -->

	<footer class="site-footer">
		<div class="row small-up-2 large-up-4">
			<div class="column">
				<?php dynamic_sidebar( 'footer-1' ); ?>
			</div>

			<div class="column">
				<?php dynamic_sidebar( 'footer-2' ); ?>
			</div>

			<div class="column">
				<?php dynamic_sidebar( 'footer-3' ); ?>
			</div>

			<div class="column">
				<?php dynamic_sidebar( 'footer-4' ); ?>
			</div>
		</div>

		<div class="row">
			<div class="small-12 site-info text-center">
				<?php _s_display_copyright_text(); ?>
			</div>
		</div><!-- .row -->
	</footer><!-- .site-footer -->
</div><!-- #page -->

<div class="off-canvas position-left" id="off-canvas-menu" data-off-canvas>
	<?php
	wp_nav_menu( array(
		'theme_location' => 'mobile',
		'menu_id'        => 'mobile-menu',
		'menu_class'     => 'vertical menu',
		'items_wrap'     => '<ul id="%1$s" class="%2$s" data-accordion-menu>%3$s</ul>',
		'walker'         => new WDS_Submenu_Classes(),
	) );
	?>
</div>

<?php wp_footer(); ?>

<div class="off-canvas-screen"></div>

</body>
</html>
