<?php
/**
 * The template used for displaying a hero.
 *
 * @package _s
 */

// Set up fields.
$background_image = get_sub_field( 'background_image' );
$background_video = get_sub_field( 'background_video' );
$headline = get_sub_field( 'headline' );
$text = get_sub_field( 'text' );
$button_text = get_sub_field( 'button_text' );
$button_url = get_sub_field( 'button_url' );

// Start a <container> with a possible media background.
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'hero content-block', // The class of the container.
) );
?>
	<div class="row align-center hero-content">
		<div class="small-8 large-11 align-self-middle text-center">
		<?php if ( $headline ) : ?>
			<h1 class="hero-headline"><?php echo esc_html( $headline ); ?></h2>
		<?php endif; ?>
		<?php if ( $text ) : ?>
			<h2 class="hero-text"><?php echo force_balance_tags( $text ); // WPCS xss ok. ?></h2>
		<?php endif; ?>
		<?php if ( $button_text ) : ?>
			<a href="<?php echo esc_url( $button_url ); ?>" class="button large hero-button" title="<?php echo esc_attr( $button_text ); ?>"><?php echo esc_html( $button_text ); ?></a>
		<?php endif; ?>
	</div><!-- .hero-content -->
</section><!-- .hero -->
