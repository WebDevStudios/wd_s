<?php
/**
 *  The template used for displaying fifty/fifty media/text.
 *
 * @package _s
 */

// Set up fields.
$image_data = get_sub_field( 'media_left' );
$text = get_sub_field( 'text_primary' );
$animation_class = _s_get_animation_class();

// Start a <container> with a possible media background.
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'content-block container fifty-fifty fifty-media-text', // The class of the container.
) );
?>
	<div class="row <?php echo esc_attr( $animation_class ) ?>">

		<div class="col col-l-6">
			<img class="fifty-image" src="<?php echo esc_url( $image_data['url'] ); ?>" alt="<?php echo esc_html( $image_data['alt'] ); ?>">
		</div>

		<div class="col col-l-6">
			<?php echo force_balance_tags( $text ); // WPCS XSS OK. ?>
		</div>

	</div><!-- .row -->
</section><!-- .fifty-media-text -->
