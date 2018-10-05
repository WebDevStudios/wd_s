<?php
/**
 * The template used for displaying a Hero block.
 *
 * @package _s
 */

// Set up fields.
$title           = get_sub_field( 'title' );
$text            = get_sub_field( 'text' );
$button_url      = get_sub_field( 'button_url' );
$button_text     = get_sub_field( 'button_text' );
$animation_class = _s_get_animation_class();

// Start a <container> with possible block options.
_s_display_block_options(
	array(
		'container' => 'section', // Any HTML5 container: section, div, etc...
		'class'     => 'content-block grid-container hero', // Container class.
	)
);
?>
	<div class="hero-content<?php echo esc_attr( $animation_class ); ?>">
		<?php if ( $title ) : ?>
			<h2 class="hero-title"><?php echo esc_html( $title ); ?></h2>
		<?php endif; ?>

		<?php if ( $text ) : ?>
			<p class="hero-description"><?php echo esc_html( $text ); ?></p>
		<?php endif; ?>

		<?php if ( $button_text && $button_url ) : ?>
			<a class="button button-hero" href="<?php echo esc_url( $button_url ); ?>"><?php echo esc_html( $button_text ); ?></a>
		<?php endif; ?>
	</div><!-- .hero-content-->
</section><!-- .hero -->
