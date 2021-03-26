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

	<?php get_template_part( 'template-parts/partial', 'footer' ); ?>

	<?php _s_display_mobile_menu(); ?>

	<?php wp_footer(); ?>
</body>
</html>
