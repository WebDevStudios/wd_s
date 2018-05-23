<?php
/**
 * The template used for displaying a hero.
 *
 * @package _s
 */

// Set up fields.
$hero        = get_sub_field( 'hero_slides' );
$slide_count = count( $hero );

// Start repeater markup...
if ( have_rows( 'hero_slides' ) ) :

	// If there is more than one slide...
	if ( $slide_count > 1 ) :
		echo '<section class="content-block container carousel">';

		// Enqueue Slick.
		wp_enqueue_style( 'slick-carousel' );
		wp_enqueue_script( 'slick-carousel' );
	endif;

	// Loop through hero(s).
	while ( have_rows( 'hero_slides' ) ) :
		the_row();

		// Set up fields.
		$title           = get_sub_field( 'headline' );
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
			return false;
		}

		// Start a <container> with possible block options.
		_s_display_block_options( array(
			'container' => 'section', // Any HTML5 container: section, div, etc...
			'class'     => 'content-block hero slide', // Container class.
		) );

		// If we have a slider, set the animation in a data-attribute.
		if ( $slide_count > 1 ) : ?>
			<div class="hero-content " data-animation="<?php echo esc_attr( $animation_class ); ?>">
		<?php else : ?>
			<div class="hero-content <?php echo esc_attr( $animation_class ); ?>">
		<?php endif; ?>

			<?php if ( $title ) : ?>
				<h2 class="hero-title"><?php echo esc_html( $title ); ?></h2>
			<?php endif; ?>

			<?php if ( $text ) : ?>
				<p class="hero-description"><?php echo esc_html( $text ); ?></p>
			<?php endif; ?>

			<?php if ( $button_url ) : ?>
				<button type="button" class="button button-hero" onclick="location.href='<?php echo esc_url( $button_url ); ?>'"><?php echo esc_html( $button_text ); ?></button>
			<?php endif; ?>

		</div><!-- .hero-content -->
	</section><!-- .hero -->

<?php
	endwhile;

	if ( $slide_count > 1 ) :
		echo '</section>';
	endif;

endif;
?>
