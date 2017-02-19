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
				echo _s_get_pattern_section( array( // WPCS: XSS OK.
					'title'       => 'SVG',
					'description' => 'Display inline SVGs.',
					'usage'       => '<?php _s_get_svg( array( \'icon\' => \'facebook-square\' ) ); ?>',
					'parameters'  => array(
						'$args' => '(required) Configuration arguments.',
					),
					'arguments'    => array(
						'icon'  => '(required) The SVG icon file name. Default none',
						'title' => '(optional) The title of the icon. Default: none',
						'desc'  => '(optional) The description of the icon. Default: none',
					),
					'output'       => _s_get_svg( array( 'icon' => 'facebook-square' ) ),
				) );

				/**
				 * Button.
				 */
				echo _s_get_pattern_section( array( // WPCS: XSS OK.
					'title'       => 'Button',
					'description' => 'Display a button.',
					'usage'       => '<button class="button" href="#">Click Me</button>',
					'output'      => '<button class="button">Click Me</button>',
				) );

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
