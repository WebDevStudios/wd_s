<?php
/**
 * Template Name: Scaffolding
 *
 * Template Post Type: page, scaffolding, wd_s_scaffolding
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\main_classes;

get_header(); ?>

	<main id="main" class="<?php echo esc_attr( main_classes( [ 'relative' ] ) ); ?>">

		<?php do_action( 'wd_s_scaffolding_content' ); ?>

	</main><!-- #main -->

<?php get_footer(); ?>
