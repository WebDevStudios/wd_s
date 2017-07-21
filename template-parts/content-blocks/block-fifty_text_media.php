<?php
/**
 *  The template used for displaying fifty/fifty text/media.
 *
 * @package _s
 *
 */
// Get <img> data.
$image_data = get_sub_field( 'media_right' );

// Set up our animation class for the wrap.
$animation_class = _s_get_animation_class();

// Start a <container> with a possible media background.
echo _s_display_block_options( array( // WPCS: XSS OK.
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'fifty-text-media', // Container class.
) );
?>
	<div class="fifty-wrap row<?php echo esc_attr( $animation_class ) ?>">
		<div class="fifty-text-wrap col col-l-6">
			<?php echo force_balance_tags( get_sub_field( 'text_primary' ) ); // WPCS: XSS OK. ?>
		</div><!-- .fifty-text-wrap -->

		<div class="fifty-media-wrap col col-l-6 ">
			<img class="fifty-media-image" src="<?php echo esc_url( $image_data['url'] );  ?>" alt="<?php echo esc_html( $image_data['alt'] ); ?>">
		</div><!-- .fifty-media-wrap -->
	</div><!-- .fifty-wrap -->
</section><!-- .fifty-text-media -->
