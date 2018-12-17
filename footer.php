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

	<footer class="site-footer background-gallery">

		<div class="site-info">
			<?php _s_display_copyright_text(); ?>
			<?php _s_display_social_network_links(); ?>
		</div><!-- .site-info -->
	</footer><!-- .site-footer container-->

	<?php wp_footer(); ?>

	<?php _s_display_mobile_menu(); ?>

</body>
</html>
