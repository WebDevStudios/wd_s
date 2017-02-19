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
				 * H1.
				 */
				echo _s_get_pattern_section( array( // WPCS: XSS OK.
					'title'       => 'H1',
					'description' => 'Display an H1',
					'usage'       => '<h1>This is a headline</h1> or <div class="h1">This is a headline</div>',
					'output'      => '<h1>This is a headline one</h1>',
				) );

				/**
				 * H2.
				 */
				echo _s_get_pattern_section( array( // WPCS: XSS OK.
					'title'       => 'H2',
					'description' => 'Display an H2',
					'usage'       => '<h2>This is a headline</h2> or <div class="h2">This is a headline</div>',
					'output'      => '<h2>This is a headline two</h2>',
				) );

				/**
				 * H3.
				 */
				echo _s_get_pattern_section( array( // WPCS: XSS OK.
					'title'       => 'H3',
					'description' => 'Display an H3',
					'usage'       => '<h3>This is a headline</h3> or <div class="h3">This is a headline</div>',
					'output'      => '<h3>This is a headline three</h3>',
				) );

				/**
				 * H4.
				 */
				echo _s_get_pattern_section( array( // WPCS: XSS OK.
					'title'       => 'H4',
					'description' => 'Display an H4',
					'usage'       => '<h4>This is a headline</h4> or <div class="h4">This is a headline</div>',
					'output'      => '<h4>This is a headline four</h4>',
				) );

				/**
				 * H5.
				 */
				echo _s_get_pattern_section( array( // WPCS: XSS OK.
					'title'       => 'H5',
					'description' => 'Display an H5',
					'usage'       => '<h5>This is a headline</h5> or <div class="h5">This is a headline</div>',
					'output'      => '<h5>This is a headline five</h5>',
				) );

				/**
				 * H6.
				 */
				echo _s_get_pattern_section( array( // WPCS: XSS OK.
					'title'       => 'H6',
					'description' => 'Display an H6',
					'usage'       => '<h6>This is a headline</h6> or <div class="h6">This is a headline</div>',
					'output'      => '<h6>This is a headline six</h6>',
				) );

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
