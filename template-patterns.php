<?php
/**
 * Template Name: Patterns
 * Template Post Type: page, pattern, _s_pattern
 *
 * @package _s
 */

// Start Template Partterns.
get_header(); ?>

	<div class="wrap">
		<div class="primary content-area">
			<main id="main" class="site-main" role="main">

				<?php do_action( '_s_pattern_content' ); ?>

				<?php
				/**
				 * Possible patterns baked in with wd_s...
				 *
				 * Colors
				 * Buttons
				 * Input
				 * Dropdown
				 * Fonts
				 * Search Form
				 * Hero
				 * Cards
				 * Modal
				 * Imitate a Gravity Form??
				 * SVG Icon
				 */

				/**
				 * SVGs.
				 */


				/**
				 * Button.
				 */


				/**
				 * Search Form.
				 */
				echo _s_get_pattern_section( array( // WPCS: XSS OK.
					'title'       => 'Search Form',
					'description' => 'Display the search form.',
					'usage'       => '<?php get_search_form(); ?>',
					'output'      => get_search_form(),
				) );

				?>

			</main><!-- #main -->
		</div><!-- .primary -->
	</div><!-- .wrap -->

<?php get_footer(); ?>
