<?php
/**
 * The template used for displaying a caroursel.
 *
 * @package _s
 */

// Start repeater markup...
if ( have_rows( 'carousel_slides' ) ) :
	echo '<section class="content-block container carousel">';

	// Enqueue Slick carousel.
	wp_enqueue_style( 'slick-carousel' );
	wp_enqueue_script( 'slick-carousel' );

	// Loop through slide slides.
	while ( have_rows( 'carousel_slides' ) ) :
		the_row();

		// Set up fields.
		$title           = get_sub_field( 'title' );
		$text            = get_sub_field( 'text' );
		$button_text     = get_sub_field( 'button_text' );
		$button_url      = get_sub_field( 'button_url' );
		$animation_class = _s_get_animation_class();
		$other_options   = get_sub_field( 'other_options' ) ? get_sub_field( 'other_options' ) : get_field( 'other_options' )['other_options'];

		// If the block has expired, then bail!
		if ( _s_has_block_expired( array(
			'start_date' => $other_options['start_date'],
			'end_date'   => $other_options['end_date'],
		) ) ) {
			continue;
		}

		// Start a <container> with possible block options.
		_s_display_block_options( array(
			'container' => 'section', // Any HTML5 container: section, div, etc...
			'class'     => 'content-block slide', // Container class.
		) );

		?>
			<div class="slide-content " data-animation="<?php echo esc_attr( $animation_class ); ?>">

				<?php if ( $title ) : ?>
					<h2 class="slide-title"><?php echo esc_html( $title ); ?></h2>
				<?php endif; ?>

				<?php if ( $text ) : ?>
					<p class="slide-description"><?php echo esc_html( $text ); ?></p>
				<?php endif; ?>

				<?php if ( $button_text && $button_url ) : ?>
					<a class="button button-slide" href="<?php echo esc_url( $button_url ); ?>"><?php echo esc_html( $button_text ); ?></a>
				<?php endif; ?>

			</div><!-- .slide-content -->
		</section><!-- .slide -->

<?php
	endwhile;
	echo '</section><!-- .carousel -->';
endif;
