<?php
/**
 * Template Name: Page w/ ACF
 *
 * The template for displaying pages with ACF components.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _s
 */

get_header(); ?>

<div class="row">
	<div class="medium-12 columns primary content-area">
		<?php _s_display_content_blocks(); ?>
	</div><!-- .primary -->
</div><!-- .row -->

<?php get_footer(); ?>
