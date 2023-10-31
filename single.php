<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\main_classes;
use function WebDevStudios\wd_s\print_comments;
use function WebDevStudios\wd_s\print_entry_footer;
use function WebDevStudios\wd_s\print_post_author;
use function WebDevStudios\wd_s\print_post_date;
use function WebDevStudios\wd_s\print_post_taxonomies;

// Get and parse the content.
$wds_content = get_the_content();
$wds_content = do_blocks( $wds_content );

get_header(); ?>
	<div class="wp-site-blocks">
		<main id="main" class="<?php echo esc_attr( main_classes( [] ) ); ?>">

			<?php
			while ( have_posts() ) :
				the_post();
				?>

				<article <?php post_class( 'post-container' ); ?>>

					<header class="entry-header is-layout-constrained has-global-padding">
						<?php
						the_title( '<h1 class="entry-title">', '</h1>' );

						if ( 'post' === get_post_type() ) :
							?>
							<div class="entry-meta">
								<?php print_post_date(); ?>
								<?php print_post_author(); ?>
								<?php
								// Use the print_post_taxonomies template tag - set up the optional args.
								print_post_taxonomies(
									[
										'post_id'      => $post->ID,
										'in_list'      => 0,
										'primary_only' => true,
										'linked'       => false,
									]
								);
								?>
							</div><!-- .entry-meta -->
						<?php endif; ?>
					</header><!-- .entry-header -->

					<div class="entry-content is-layout-constrained has-global-padding">
						<?php echo wp_kses_post( $wds_content ); ?>
					</div><!-- .entry-content -->

					<footer class="entry-footer is-layout-constrained has-global-padding">
						<?php print_entry_footer(); ?>
					</footer><!-- .entry-footer -->

				</article><!-- #post-## -->

				<?php
				echo wp_kses_post(
					get_the_post_navigation(
						[
							'class' => 'is-layout-constrained',
						]
					)
				);

				print_comments();

			endwhile; // End of the loop.
			?>

		</main><!-- #main -->
	</div><!-- .wp-site-blocks -->

<?php get_footer(); ?>
