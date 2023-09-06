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

use function WebDevStudios\wd_s\print_copyright_text;
?>

	<footer class="site-footer">

		<div class="site-info">
			<?php
			if ( get_theme_mod( 'wd_s_copyright_text' ) ) :
				print_copyright_text();
			else :
				the_custom_logo();
				echo '<p>' . esc_html__( ' Copyright &copy; ', 'wd_s' ) . esc_attr( gmdate( 'Y' ) ) . '</p>';
			endif;
			?>
		</div><!-- .site-info -->

	</footer><!-- .site-footer-->

	<?php wp_footer(); ?>

</body>

</html>
