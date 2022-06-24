<?php
/**
 * Template Name: Documentation (Modules)
 *
 * Generates and displays documentation for all of the included modules.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\print_module;

get_header(); ?>

	<div class="container site-main">
		<main id="main" class="content-container">
			<h1>Modules Documentation</h1>
			<?php
			// Accordion.
			$abs_modules[] = [
				'type' => 'accordion',
				'args' => [
					'class' => [ 'anchor-1' ],
					'items' => [
						[
							'text'    => 'Accordion Title 1',
							'content' => 'Accordion item content.',
						],
						[
							'text'    => 'Accordion Title 2',
							'content' => 'Accordion item content.',
						],
						[
							'text'    => 'Accordion Title 3',
							'content' => 'Accordion item content.',
						],
					],
				],
			];

			// Badges.
			$abs_modules[] = [
				'type' => 'badges',
				'args' => [
					'badges' => [
						[
							'text' => esc_html__( 'Badge 1', 'wd_s' ),
							'href' => '#',
						],
						[
							'text' => esc_html__( 'Badge 2', 'wd_s' ),
							'href' => '#',
						],
						[
							'text' => esc_html__( 'Badge 3', 'wd_s' ),
							'href' => '#',
						],
					],
				],
			];

			// Call to Action.
			$abs_modules[] = [
				'type' => 'call-to-action',
				'args' => [
					'class'         => [ 'cta-1' ],
					'attachment_id' => 5,
					'eyebrow'       => esc_html__( 'Eyebrow Text', 'wd_s' ),
					'heading_args'  => [
						'text' => esc_html__( 'Heading Text', 'wd_s' ),
					],
					'button'        => [
						'title' => esc_html__( 'Learn More', 'wd_s' ),
						'href'  => esc_attr__( '#', 'wd_s' ),
					],
				],
			];

			// Card.
			$abs_modules[] = [
				'type' => 'card',
				'args' => [
					'class'         => [ 'card-1' ],
					'attachment_id' => 9,
					'eyebrow'       => esc_html__( 'Eyebrow Text', 'wd_s' ),
					'heading'       => esc_html__( 'Heading Text', 'wd_s' ),
					'content'       => esc_html__( 'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'wd_s' ),
					'button'        => [
						'title' => esc_html__( 'Learn More', 'wd_s' ),
						'href'  => esc_attr__( '#', 'wd_s' ),
					],
				],
			];

			// Carousel.
			$abs_modules[] = [
				'type' => 'carousel',
				'args' => [
					'class' => [ 'carousel-1' ],
					'heros' => [
						[
							'class'         => [ 'cta-1' ],
							'attachment_id' => 5,
							'eyebrow'       => esc_html__( 'Eyebrow Text', 'wd_s' ),
							'heading'       => esc_html__( 'Heading Text', 'wd_s' ),
							'content'       => esc_html__( 'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'wd_s' ),
							'button_text'   => esc_html__( 'Learn More', 'wd_s' ),
							'button_url'    => esc_attr__( '#', 'wd_s' ),
						],
						[
							'class'         => [ 'cta-1' ],
							'attachment_id' => 5,
							'eyebrow'       => esc_html__( 'Eyebrow Text', 'wd_s' ),
							'heading'       => esc_html__( 'Heading Text', 'wd_s' ),
							'content'       => esc_html__( 'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'wd_s' ),
							'button_text'   => esc_html__( 'Learn More', 'wd_s' ),
							'button_url'    => esc_attr__( '#', 'wd_s' ),
						],
						[
							'class'         => [ 'cta-1' ],
							'attachment_id' => 5,
							'eyebrow'       => esc_html__( 'Eyebrow Text', 'wd_s' ),
							'heading'       => esc_html__( 'Heading Text', 'wd_s' ),
							'content'       => esc_html__( 'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'wd_s' ),
							'button_text'   => esc_html__( 'Learn More', 'wd_s' ),
							'button_url'    => esc_attr__( '#', 'wd_s' ),
						],
					],
				],
			];

			// Hero.
			$abs_modules[] = [
				'type' => 'hero',
				'args' => [
					'class'         => [ 'hero-1' ],
					'attachment_id' => 5,
					'overlay'       => true,
					'eyebrow'       => esc_html__( 'Eyebrow Text', 'wd_s' ),
					'heading'       => esc_html__( 'Heading Text', 'wd_s' ),
					'content'       => esc_html__( 'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'wd_s' ),
					'button'        => [
						'title' => esc_html__( 'Learn More', 'wd_s' ),
						'href'  => esc_attr__( '#', 'wd_s' ),
					],
				],
			];

			// Figure.
			$abs_modules[] = [
				'type' => 'figure',
				'args' => [
					'class'         => [ 'image-module-1' ],
					'image_class'   => [ 'aspectratio-3-1' ],
					'attachment_id' => 9,
					'show_caption'  => true,
					'caption'       => esc_attr__( 'Nulla quis lorem ut libero malesuada feugiat. Sed porttitor lectus nibh. Donec rutrum congue leo eget malesuada. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. ', 'wd_s' ),
				],
			];

			// Meta.
			$abs_modules[] = [
				'type' => 'meta',
				'args' => [
					'display_author'   => false,
					'display_taxonomy' => true,
					'taxonomy_args'    => [
						'tax_name' => 'category',
						'post_id'  => '1',
					],
				],
			];

			// Notification.
			$abs_modules[] = [
				'type' => 'notification',
				'args' => [
					'class'       => [],
					'text_args'   => [
						'text'  => 'This is a notification banner',
						'level' => 6,
					],
					'icon'        => [
						'color'        => '#00b',
						'icon'         => 'hamburger',
						'stroke-width' => '3px',
						'height'       => '32px',
						'width'        => '32px',
					],
					'dismissible' => false,
					'type'        => [
						'sticky'   => false,
						'position' => 'top',
					],
				],
			];

			// Search.
			$abs_modules[] = [
				'type' => 'search',
				'args' => [],
			];

			// Tabs.
			$abs_modules[] = [
				'type' => 'tabs',
				'args' => [
					'class' => [ 'tabs-1' ],
					'items' => [
						[
							'title'   => 'Tab Title 1',
							'content' => 'Tab 1 item content.',
						],
						[
							'title'   => 'Tab Title 2',
							'content' => 'Tab 2 item content.',
						],
						[
							'title'   => 'Tab Title 3',
							'content' => 'Tab 3 item content.',
						],
					],
				],
			];

			?>
			<section class='element-documentation'>
				<?php
				foreach ( $abs_modules as $abs_module ) :
					?>

					<fieldset class='documentation-section'>
						<legend><?php echo esc_html( ucwords( str_replace( '-', ' ', $abs_module['type'] ) ) ); ?></legend>

						<section class='documentation-section-inner'>
							<?php
							print_element(
								'heading',
								[
									'text'  => 'EXAMPLE',
									'level' => 4,
									'class' => [ 'sub-heading' ],
								]
							);

							print_module( $abs_module['type'], $abs_module['args'] );
							?>
						</section>

						<section class='documentation-section-inner'>
							<?php
							print_element(
								'heading',
								[
									'text'  => 'USAGE (WITHOUT ESCAPES)',
									'level' => 4,
									'class' => [ 'sub-heading' ],
								]
							);
							?>

							<code>
								print_module(<br/>
								&nbsp;&nbsp; '<?php echo esc_html( $abs_module['type'] ); ?>',<br/>
								&nbsp;&nbsp; [<br/>
								<?php
								foreach ( $abs_module['args'] as $abs_key => $abs_value ) :
									// Allow for multidimensional array.
									if ( is_array( $abs_value ) ) :
										@$abs_value = "[ '" . implode( "', '", $abs_value ) . "' ]"; //phpcs:ignore
									elseif ( is_string( $abs_value ) ) :
										$abs_value = "'$abs_value'";
									endif;
									// phpcs:ignore
									echo "&nbsp;&nbsp;&nbsp;&nbsp;'$abs_key' => $abs_value,<br/>";
								endforeach;
								?>

								&nbsp;&nbsp; ]<br/>
								);
							</code>
						</section>

						<section class='documentation-section-inner'>
							<?php
							print_element(
								'heading',
								[
									'text'  => 'MARKUP',
									'level' => 4,
									'class' => [ 'sub-heading' ],
								]
							);
							?>

							<code>
								<?php
								ob_start();
								print_module( $abs_module['type'], $abs_module['args'] );
								// phpcs:ignore
								echo htmlentities( ob_get_clean() );
								?>
							</code>
						</section>
					</fieldset>
				<?php endforeach; ?>
			</section>


		</main><!-- #main -->
	</div>

<?php get_footer(); ?>
