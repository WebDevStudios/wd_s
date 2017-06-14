<?php
/**
 * The template used for displaying fifty-fifty text/media.
 *
 * @package _s
 */

// Get <img> data.
$image_data = get_sub_field( 'right_content' );

// Start a <container> with a possible media background.
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'row fifty-text-media', // Container class.
) );
?>
	<div class="column small-12 medium-6 fifty-text-wrap">
		<?php echo force_balance_tags( get_sub_field( 'left_content' ) ); // WPCS: XSS OK. ?>
	</div><!-- .fifty-text-wrap -->

	<div class="column small-12 medium-6 fifty-media-wrap">
		<img class="fifty-media-image" src="<?php echo esc_url( $image_data['sizes']['medium'] );  ?>" alt="<?php echo esc_html( $image_data['alt'] ); ?>">
	</div><!-- .fifty-media-wrap -->
</section><!-- .fifty-text-media -->
