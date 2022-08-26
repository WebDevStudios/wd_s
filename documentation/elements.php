<?php
/**
 * Template Name: Documentation (Elements)
 *
 * Generates and displays documentation for all of the included elements.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;

get_header(); ?>

	<div class="container site-main">
		<main id="main" class="content-container">
			<h1>Elements Documentation</h1>
			<?php
			// Anchor.
			$wd_s_elements[] = [
				'type' => 'anchor',
				'args' => [
					'class'  => [ 'anchor-1' ],
					'text'   => esc_html__( 'Demo Anchor', 'wd_s' ),
					'href'   => esc_attr__( '#', 'wd_s' ),
					'target' => esc_attr__( '_blank', 'wd_s' ),
				],
			];

			// Badge.
			$wd_s_elements[] = [
				'type' => 'badge',
				'args' => [
					'class'         => [ 'button-1' ],
					'text'          => esc_html__( 'Demo Button', 'wd_s' ),
					'href'          => esc_attr__( '#', 'wd_s' ),
					'target'        => esc_attr__( '_blank', 'wd_s' ),
					'icon'          => [],
					'icon_position' => 'after',
				],
			];

			// Button.
			$wd_s_elements[] = [
				'type' => 'button',
				'args' => [
					'class'         => [ 'button-1' ],
					'title'         => esc_html__( 'Demo Button', 'wd_s' ),
					'href'          => esc_attr__( '#', 'wd_s' ),
					'target'        => esc_attr__( '_blank', 'wd_s' ),
					'icon'          => [
						'color'        => '#333',
						'icon'         => 'play',
						'title'        => 'Play',
						'desc'         => 'Play icon',
						'stroke-width' => '2',
						'height'       => '12',
						'width'        => '12',
					],
					'icon_position' => 'after',
				],
			];

			// Content.
			$wd_s_elements[] = [
				'type' => 'content',
				'args' => [
					'class'   => [ 'content-1' ],
					'content' => esc_html__( 'Donec sollicitudin molestie malesuada. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Cras ultricies ligula sed magna dictum porta. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Cras ultricies ligula sed magna dictum porta. Curabitur aliquet quam id dui posuere blandit. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.', 'wd_s' ),
				],
			];

			// Eyebrow.
			$wd_s_elements[] = [
				'type' => 'eyebrow',
				'args' => [
					'class' => [ 'eyebrow-1' ],
					'text'  => esc_html__( 'Eyebrow Text', 'wd_s' ),
				],
			];

			// Heading.
			$wd_s_elements[] = [
				'type' => 'heading',
				'args' => [
					'class' => [ 'heading-1' ],
					'text'  => esc_html__( 'Heading Text', 'wd_s' ),
					'level' => 1,
				],
			];

			// Icon.
			$wd_s_elements[] = [
				'type' => 'icon',
				'args' => [
					'class'    => [],
					'svg_args' => [
						'color'        => '#00f',
						'icon'         => 'hamburger',
						'title'        => 'Hamburger',
						'desc'         => 'hamburger icon',
						'stroke-width' => '2',
						'height'       => '64',
						'width'        => '64',
					],
				],
			];

			// Image by ID.
			$wd_s_elements[] = [
				'type' => 'image',
				'args' => [
					'class'         => [ 'aspectratio-4-3' ],
					'attachment_id' => 9,
					'size'          => 'medium_large',
					'loading'       => 'eager',
					'alt'           => esc_html__( 'Alt text', 'wd_s' ),
				],
			];

			// Image by URL.
			$wd_s_elements[] = [
				'type' => 'image',
				'args' => [
					'class'   => [ 'aspectratio-2-1' ],
					'src'     => 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
					'loading' => 'eager',
					'alt'     => esc_html__( 'Alt text', 'wd_s' ),
				],
			];

			// Input.
			$wd_s_elements[] = [
				'type' => 'input',
				'args' => [
					'class'       => [ 'input-1' ],
					'type'        => 'text',
					'name'        => esc_attr__( 'input_1', 'wd_s' ),
					'value'       => esc_attr__( 'Value', 'wd_s' ),
					'placeholder' => esc_attr__( 'Placeholder', 'wd_s' ),
					'disabled'    => 'disabled',
					'required'    => 'required',
				],
			];

			// Label.
			$wd_s_elements[] = [
				'type' => 'label',
				'args' => [
					'class' => [ 'label-1', 'label-2' ],
					'text'  => esc_html__( 'Label 1', 'wd_s' ),
					'for'   => esc_attr__( 'input_1', 'wd_s' ),
				],
			];

			// Logo.
			$wd_s_elements[] = [
				'type' => 'logo',
				'args' => [
					'logo_name' => 'alt_logo',
					'class'     => [ 'alternate-logo' ],
					'loading'   => 'lazy',
					'alt'       => get_bloginfo( 'name' ) . ' logo',
				],
			];

			// Select.
			$wd_s_elements[] = [
				'type' => 'select',
				'args' => [
					'class'    => [ 'select-1' ],
					'name'     => esc_attr__( 'input_1', 'wd_s' ),
					'value'    => 'option_1',
					'disabled' => '',
					'required' => 'required',
					'options'  => [
						[
							'value' => '',
							'text'  => '',
						],
						[
							'value' => 'option_1',
							'text'  => 'Option 1',
						],
						[
							'value' => 'option_2',
							'text'  => 'Option 2',
						],
					],
				],
			];

			// Input.
			$wd_s_elements[] = [
				'type' => 'textarea',
				'args' => [
					'class'       => [ 'textarea-1' ],
					'name'        => esc_attr__( 'textarea-1', 'wd_s' ),
					'value'       => esc_html__( 'Textarea Value', 'wd_s' ),
					'placeholder' => esc_attr__( 'Placeholder', 'wd_s' ),
					'disabled'    => 'disabled',
					'required'    => 'required',
					'readonly'    => 'readonly',
				],
			];

			?>
			<section class='element-documentation'>
				<?php
				foreach ( $wd_s_elements as $wd_s_element ) :
					?>

					<fieldset class='documentation-section'>
						<legend><?php echo esc_html( ucwords( str_replace( '_', ' ', $wd_s_element['type'] ) ) ); ?></legend>

						<section class='documentation-section-inner'>
							<?php
							print_element(
								'heading',
								[
									'text'  => 'EXAMPLE',
									'level' => 6,
									'class' => [ 'sub-heading' ],
								]
							);

							print_element( $wd_s_element['type'], $wd_s_element['args'] );
							?>
						</section>

						<section class='documentation-section-inner'>
							<?php
							print_element(
								'heading',
								[
									'text'  => 'USAGE (WITHOUT ESCAPES)',
									'level' => 6,
									'class' => [ 'sub-heading' ],
								]
							);
							?>

							<code>
								print_element(<br/>
								&nbsp;&nbsp; '<?php echo esc_html( $wd_s_element['type'] ); ?>',<br/>
								&nbsp;&nbsp; [<br/>
								<?php
								foreach ( $wd_s_element['args'] as $wd_s_key => $wd_s_value ) :
									// Allow for multidimensional array.
									if ( is_array( $wd_s_value ) ) :
										@$wd_s_value = "[ '" . implode( "', '", $wd_s_value ) . "' ]"; //phpcs:ignore
									elseif ( is_string( $wd_s_value ) ) :
										$wd_s_value = "'$wd_s_value'";
									endif;
									// phpcs:ignore
									echo "&nbsp;&nbsp;&nbsp;&nbsp;'$wd_s_key' => $wd_s_value,<br/>";
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
								print_element( $wd_s_element['type'], $wd_s_element['args'] );
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
