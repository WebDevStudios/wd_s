<?php
/**
 * The template used for displaying a hero.
 *
 * @package _s
 */

// Set up fields.
$headline = get_sub_field( 'headline' );
$text = get_sub_field( 'text' );
$button_text = get_sub_field( 'button_text' );
$button_url = get_sub_field( 'button_url' );

// Start a <container> with a possible background media.
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'content-block hero', // The class of the container.
) );
?>
	<div class="hero-content">
		<?php if ( $headline ) : ?>
			<h2 class="hero-headline"><?php echo esc_html( $headline ); ?></h2>
		<?php endif; ?>
		<?php if ( $text ) : ?>
			<p class="hero-text"><?php echo force_balance_tags( $text ); // WPCS xss ok. ?></p>
		<?php endif; ?>
		<?php if ( $button_text ) : ?>
			<a href="<?php echo esc_url( $button_url ); ?>" class="button large hero-button" title="<?php echo esc_attr( $button_text ); ?>"><?php echo esc_html( $button_text ); ?></a>
		<?php endif; ?>
	</div><!-- .hero-content -->
</section><!-- .hero -->
