<?php
/**
 * Template Name: Page with Content Blocks
 *
 * The template for displaying pages with ACF components.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _s
 */

get_header(); ?>

	<main id="main" class="site-main acf-content-blocks">

		<?php
			// If the page is password protected...
			if ( post_password_required() ) :
				get_template_part( 'template-parts/content', 'password-protected' );
			else :
				_s_display_content_blocks();
			endif;
		?>

	</main><!-- #main -->

<?php get_footer(); ?>
