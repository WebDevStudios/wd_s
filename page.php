<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\main_classes;
use function WebDevStudios\wd_s\print_numeric_pagination;

// Get and parse the content.
$wds_content = get_the_content();
$wds_content = do_blocks( $wds_content );

get_header(); ?>
	<div class="wp-site-blocks">
		<main id="main" class="<?php echo esc_attr( main_classes( [] ) ); ?>">

			<?php
			if ( have_posts() ) :

				/* Start the Loop */
				while ( have_posts() ) :
					the_post();
					?>

					<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

						<header class="page-header is-layout-constrained has-global-padding">
							<?php the_title( '<h1 class="page-title">', '</h1>' ); ?>
						</header><!-- .page-header -->

						<div class="entry-content is-layout-constrained has-global-padding">
							<?php echo wp_kses_post( $wds_content ); ?>
						</div><!-- .entry-content -->

					</article><!-- #post-## -->

					<?php
				endwhile;

			endif;
			?>

		</main><!-- #main -->
	</div><!-- .wp-site-blocks -->

<?php get_footer(); ?>
