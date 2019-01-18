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

// Omit class if password protected and content is hidden.
$acf_classname = ! post_password_required() ? ' acf-content-blocks' : '';

get_header(); ?>

	<main id="main" class="site-main container<?php echo esc_attr( $acf_classname ); ?>">

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
