<?php
/**
 * Template Name: Patterns
 * Template Post Type: page, pattern, _s_pattern
 *
 * @package _s
 */

// Start Template Patterns.
get_header(); ?>

	<div class="wrap">
		<div class="primary content-area">
			<main id="main" class="site-main" role="main">

				<?php do_action( '_s_pattern_content' ); ?>

			</main><!-- #main -->
		</div><!-- .primary -->
	</div><!-- .wrap -->

<?php get_footer(); ?>
