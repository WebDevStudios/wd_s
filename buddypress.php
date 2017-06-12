<?php
/**
 * The template for displaying buddypress pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package _s
 */

get_header(); ?>

<div class="row">
	<div class="primary content-area">
		<?php while ( have_posts() ) :
			the_post(); ?>

			<?php get_template_part( 'template-parts/content', 'buddypress' ); ?>
		<?php endwhile; ?>
	</div><!-- .primary -->
</div><!-- .row -->

<?php get_footer(); ?>
