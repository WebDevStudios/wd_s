<?php
/**
 * Template part for displaying posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_post_date;
use function WebDevStudios\wd_s\print_post_author;
use function WebDevStudios\wd_s\print_entry_footer;
use function WebDevStudios\wd_s\print_post_taxonomies;
?>

<article <?php post_class( 'post-container' ); ?>>

	<header class="entry-header is-layout-constrained has-global-padding">
		<?php
		if ( is_single() ) :
			the_title( '<h1 class="entry-title">', '</h1>' );
		else :
			the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif;

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
		<?php
		the_content(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. */
					esc_html__( 'Continue reading %s <span class="meta-nav">&rarr;</span>', 'wd_s' ),
					[
						'span' => [
							'class' => [],
						],
					]
				),
				the_title( '<span class="screen-reader-text">"', '"</span>', false )
			)
		);

		wp_link_pages(
			[
				'before' => '<div class="page-links is-layout-constrained has-global-padding">' . esc_attr__( 'Pages:', 'wd_s' ),
				'after'  => '</div>',
			]
		);
		?>
	</div><!-- .entry-content -->

	<footer class="entry-footer is-layout-constrained has-global-padding">
		<?php print_entry_footer(); ?>
	</footer><!-- .entry-footer -->

</article><!-- #post-## -->
