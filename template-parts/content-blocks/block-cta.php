<?php
/**
 * The template used for displaying a CTA block.
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
		'class'     => 'content-block grid-container call-to-action', // Container class.
	)
);
?>
	<div class="grid-x <?php echo esc_attr( $animation_class ); ?>">
		<div class="cell">
			<?php if ( $title ) : ?>
				<h3 class="cta-title"><?php echo esc_html( $title ); ?></h3>
			<?php endif; ?>

			<?php if ( $text ) : ?>
				<h4 class="cta-text"><?php echo esc_html( $text ); ?></h4>
			<?php endif; ?>
		</div>

		<div class="cell">
			<?php if ( $button_url ) : ?>
				<button type="button" class="button cta-button" onclick="location.href='<?php echo esc_url( $button_url ); ?>'"><?php echo esc_html( $button_text ); ?></button>
			<?php endif; ?>
		</div>
	</div><!-- .grid-x -->
</section><!-- .cta-block -->
