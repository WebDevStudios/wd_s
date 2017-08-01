<?php
/**
 * The template used for displaying a CTA block.
 *
 * @package _s
 */

// Set up fields.
$headline     = get_sub_field( 'headline' );
$sub_heading  = get_sub_field( 'sub_heading' );
$button_url   = get_sub_field( 'button_url' );
$button_text  = get_sub_field( 'button_text' );

// Set up our animation class for the wrap.
$animation_class = _s_get_animation_class();

// Start a <container> with possible block options.
echo _s_display_block_options( // WPCS: XSS OK.
	array(
		'container' => 'section', // Any HTML5 container: section, div, etc...
		'class'     => 'content-block container cta-block background-silver', // Container class.
	)
);
?>
	<div class="row <?php echo esc_attr( $animation_class ) ?>">
		<div class="col col-l-8">
			<?php if ( $headline) : ?>
				<h2 class="cta-headline color-white"><?php echo esc_html( $headline ); ?></h2>
			<?php endif; ?>

			<?php if ( $sub_heading ) : ?>
				<p class="cta-sub-heading color-white"><?php echo esc_html( $sub_heading ); ?></p>
			<?php endif; ?>
		</div>

		<div class="col col-l-4">
			<?php if ( $button_url ) : ?>

				<a class="cta button" href="<?php echo esc_url( $button_url ); ?>"><?php echo esc_html( $button_text ); ?></a>

			<?php endif; ?>
		</div>
	</div>
</section><!-- .cta-block -->
