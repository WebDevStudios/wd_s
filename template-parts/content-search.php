<?php
/**
 * Template part for displaying results in search pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_post_date;
use function WebDevStudios\wd_s\print_post_author;
use function WebDevStudios\wd_s\print_entry_footer;

?>

<article <?php post_class( 'has-global-padding' ); ?>>

	<header class="entry-header is-layout-constrained">
		<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>

		<?php if ( 'post' === get_post_type() ) : ?>
			<div class="entry-meta">
				<?php print_post_date(); ?>
				<?php print_post_author(); ?>
			</div><!-- .entry-meta -->
		<?php endif; ?>
	</header><!-- .entry-header -->

	<div class="entry-summary is-layout-constrained">
		<?php the_excerpt(); ?>
	</div><!-- .entry-summary -->

	<footer class="entry-footer is-layout-constrained">
		<?php print_entry_footer(); ?>
	</footer><!-- .entry-footer -->

</article><!-- #post-## -->
