<?php
/**
 * The template for displaying your latest blog posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#home-page-display
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_numeric_pagination;
use function WebDevStudios\wd_s\main_classes;

get_header(); ?>
	<div class="wp-site-blocks">
		<main id="main" class="<?php echo esc_attr( main_classes( [] ) ); ?>">

			<?php if ( have_posts() ) : ?>
					<header class="entry-header is-layout-constrained has-global-padding">
						<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
					</header>

				<?php
				/* Start the Loop */
				while ( have_posts() ) :
					the_post();

					get_template_part( 'template-parts/content', get_post_type() );

				endwhile;

				print_numeric_pagination();

			else :
				get_template_part( 'template-parts/content', 'none' );
			endif;
			?>

		</main><!-- #main -->
	</div><!-- .wp-site-blocks -->

<?php get_footer(); ?>
