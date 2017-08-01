<?php
/**
 * The template used for displaying a hero.
 *
 * @package _s
 */

// Get the hero field to see if should start a carousel or just show static content.
$hero = get_sub_field( 'hero_slides' );

// Count the rows of slides.
$slide_count = count( $hero );

// Start repeater markup.
if ( have_rows( 'hero_slides' ) ) :

	// If we have more than one slide, wrap them in a container.
	if ( $slide_count > 1 ) {
		echo '<div class="content-block hero-container carousel">';
	}

	while ( have_rows( 'hero_slides' ) ) : the_row();

		// Set up slide fields.
		$title = get_sub_field( 'headline' );

		// Use the page title if no hero title is set and we have a static slide.
		if ( ! $title &&  1 === $slide_count ) {
			$title = get_the_title();
		}

		$blurb = get_sub_field( 'text' );
		$button_text = get_sub_field( 'button_text' );
		$button_url = get_sub_field( 'button_url' );

		// Set up our animation class for the content wrap.
		$animation_class = _s_get_animation_class();

		// Start a <container> with possible block options.
		$hero_container_start = _s_display_block_options( array( // WPCS: XSS OK.
			'container' => 'div', // Any HTML5 container: section, div, etc...
			'class'     => 'content-block hero-area slide', // Container class.
			) );
?>
		<?php echo $hero_container_start; // WPCS: XSS OK. ?>

			<?php
				// If we have a slider, set the animation in a data-attribute.
				if ( $slide_count > 1 ) : ?>
				<div class="hero-content " data-animation="<?php echo esc_attr( $animation_class ) ?>">
			<?php
				// If we don't have a slider, set the animation as classes.
				else : ?>
				<div class="hero-content <?php echo esc_attr( $animation_class ) ?>">

			<?php endif; ?>

				<?php if ( $title ) : ?>
					<h2 class="hero-title"><?php echo esc_html( $title ); ?></h2>
				<?php endif; ?>
				<?php if ( $blurb ) : ?>
					<p class="hero-description"><?php echo force_balance_tags( $blurb ); // WP XSS OK. ?></p>
				<?php endif; ?>
				<?php if ( $button_url ) : ?>
					<a href="<?php echo esc_url( $button_url ); ?>" class="hero-button" title="<?php echo esc_html( $button_text ); ?>"><?php echo esc_html( $button_text ); ?></a>
				<?php endif; ?>
			</div><!-- .hero-content -->
		</div><!-- .hero-area -->

<?php
	endwhile;

	if ( $slide_count > 1 ) {
		echo '</div>';
	}

endif;
?>
