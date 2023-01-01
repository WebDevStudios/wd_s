<?php
/**
 * Template Name: No Title
 *
 * This template displays a page without page title.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_comments;
use function WebDevStudios\wd_s\main_classes;

get_header(); ?>

	<div class="<?php echo esc_attr( main_classes( [] ) ); ?>">
		<main id="main" class="content-container">

			<?php
			while ( have_posts() ) :
				the_post();

				get_template_part( 'template-parts/content', 'no-title' );

				print_comments();

			endwhile; // End of the loop.
			?>

		</main><!-- #main -->

	</div>

<?php get_footer(); ?>
