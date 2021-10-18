<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package _s
 */

namespace WD_S;

use WD_S\TemplateTags;

get_header(); ?>

	<main id="main" class="container site-main">

		<?php
		while ( have_posts() ) :
			the_post();



			get_template_part( 'template-parts/content', get_post_format() );

			the_post_navigation();

			TemplateTags\display_comments();

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php get_footer(); ?>
