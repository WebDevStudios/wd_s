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

	<div class="footer-area">
		<?php wds_page_builder_area( 'after_content' ); ?>
	</div>

	<footer id="colophon" class="site-footer">
		<div class="wrap">

			<div class="site-info">
				<?php _s_do_copyright_text(); ?>
			</div><!-- .site-info -->

		</div><!-- .wrap -->
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php _s_do_mobile_navigation_menu(); ?>

<?php wp_footer(); ?>

</body>
</html>
