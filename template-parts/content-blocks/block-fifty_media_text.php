<?php
/**
 *  The template used for displaying fifty/fifty media/text.
 *
 * @package _s
 */
// Get <img> data.
$image_data = get_sub_field( 'media_left' );

// Set up our animation class for the wrap.
$animation_class = _s_get_animation_class();

// Start a <container> with a possible media background.
echo _S_display_block_options( array( // WPCS: XSS ok.
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'content-block container fifty-media-text', // The class of the container.
) );
?>

	<div class="row">
		<div class="fifty-media-wrap col col-l-6 <?php echo esc_attr( $animation_class ) ?>">
			<img class="fifty-media-image" src="<?php echo esc_url( $image_data['url'] );  ?>" alt="<?php echo esc_html( $image_data['alt'] ); ?>">
		</div><!-- .fifty-media-wrap -->

		<div class="fifty-text-wrap col col-l-6">
			<?php echo force_balance_tags( get_sub_field( 'text_primary' ) ); // WPCS XSS OK. ?>
		</div><!-- .fifty-text-wrap -->
	</div><!-- .fifty-wrap -->

</section><!-- .fifty-media-text -->
