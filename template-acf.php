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

	<div class="content-area">
		<main id="main" class="site-main">
		<?php
			// If the page is password protected...
			if ( post_password_required() ) :
				get_template_part( 'template-parts/content', 'password-protected' );
			else :
				_s_display_content_blocks();
			endif;
		?>
		</main><!-- #main -->
	</div><!-- .primary -->

<?php get_footer(); ?>
