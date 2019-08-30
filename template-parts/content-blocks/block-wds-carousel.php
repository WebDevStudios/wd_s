<?php
/**
 * The template used for displaying a caroursel.
 *
 * @package _s
 */

$alignment    = _s_get_block_alignment( $block );
$classes      = _s_get_block_classes( $block );
$classnames[] = 'content-block carousel-block' . $alignment . $classes;
$classnames[] = get_sub_field( 'block_width' );

_s_acf_gutenberg_display_admin_default_carousel( $block );

// Start repeater markup...
if ( have_rows( 'carousel_slides' ) ) :
	echo '<div class="' . esc_attr( implode( ' ', array_filter( $classnames ) ) ) . '">';

	// Loop through slide slides.
	while ( have_rows( 'carousel_slides' ) ) :
		the_row();

		// Set up fields.
		$color         = get_sub_field( 'font_color' );
		$block_title   = get_sub_field( 'title' );
		$text          = get_sub_field( 'text' );
		$button_text   = get_sub_field( 'button_text' );
		$button_url    = get_sub_field( 'button_url' );
		$other_options = get_sub_field( 'other_options' ) ? get_sub_field( 'other_options' ) : get_field( 'other_options' )['other_options'];
		$classname     = $color && _s_has_array_key( 'color_picker', $color ) ? 'has-font-color color-' . esc_attr( $color['color_picker'] ) : '';

		// If the block has expired, then bail!
		if ( _s_has_block_expired(
			array(
				'start_date' => $other_options['start_date'],
				'end_date'   => $other_options['end_date'],
			)
		) ) {
			continue;
		}

		// Start a <container> with possible block options.
		_s_display_block_options(
			array(
				'block'     => $block,
				'container' => 'section', // Any HTML5 container: section, div, etc...
				'class'     => 'slide', // Container class.
				'id'        => esc_attr( 'carousel-' . get_row_index() ),
			)
		);
		?>
			<div class="slide-content container <?php echo esc_attr( $classname ); ?>">

				<?php if ( $block_title ) : ?>
					<h2 class="slide-title"><?php echo esc_html( $block_title ); ?></h2>
				<?php endif; ?>

				<?php if ( $text ) : ?>
					<p class="slide-description"><?php echo esc_html( $text ); ?></p>
				<?php endif; ?>

				<?php
				_s_display_link(
					array(
						'button' => true,
						'class'  => 'button-slide',
					)
				);
				?>

			</div>
		</section>

<?php
	endwhile;
	echo '</div>';
endif;
