<?php
/**
 * Template Name: Scaffolding
 * Template Post Type: page, scaffolding, _s_scaffolding
 *
 * @package _s
 */

// Start Template Scaffolding.
get_header(); ?>

	<div class="wrap">
		<div class="primary content-area">
			<main id="main" class="site-main" role="main">

				<?php do_action( '_s_scaffolding_content' ); ?>

			</main><!-- #main -->
		</div><!-- .primary -->
	</div><!-- .wrap -->

<?php get_footer(); ?>
