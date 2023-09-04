<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package wd_s
 */

?>

	<footer class="site-footer">

		<div class="site-info">
			<?php the_custom_logo(); ?>
			<p><?php echo esc_html__( ' Copyright &copy; ', 'wd_s' ) . esc_attr( gmdate( 'Y' ) ); ?></p>
		</div><!-- .site-info -->

	</footer><!-- .site-footer-->

	<?php wp_footer(); ?>

</body>

</html>
