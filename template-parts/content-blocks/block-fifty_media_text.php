<?php
/**
 * The template used for displaying fifty/fifty media/text.
 *
 * @package _s
 */

// Set up fields.
$image_data = get_sub_field( 'media_left' );
$content = get_sub_field( 'content_right' );

// Start a <container> with a possible media background.
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'content-block fifty-fifty fifty-media-text', // The class of the container.
) );
?>
	<div>
		<img class="fifty-media-image" src="<?php echo esc_url( $image_data['sizes']['medium'] );  ?>" alt="<?php echo esc_html( $image_data['alt'] ); ?>">
	</div>

	<div>
		<?php echo force_balance_tags( $content ); // WPCS XSS OK. ?>
	</div>
</section><!-- .fifty-media-text -->
