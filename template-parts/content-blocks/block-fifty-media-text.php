<?php
/**
 *  The template used for displaying fifty/fifty media/text.
 *
 * @package _s
 */

// Set up fields.
global $fifty_block, $fifty_alignment, $fifty_classes;
$image_data = get_field( 'media_left' );
$text       = get_field( 'text_primary' );

// Start a <container> with a possible media background.
_s_display_block_options(
	array(
		'block'     => $fifty_block,
		'container' => 'section', // Any HTML5 container: section, div, etc...
		'class'     => 'content-block fifty-fifty-block fifty-media-text' . esc_attr( $fifty_alignment . $fifty_classes ), // The class of the container.
	)
);
?>
	<div class="display-flex container">

		<div class="half">
			<img class="fifty-image" src="<?php echo esc_url( $image_data['url'] ); ?>" alt="<?php echo esc_html( $image_data['alt'] ); ?>">
		</div>

		<div class="half">
			<?php echo _s_get_the_content( $text ); // WPCS XSS OK. ?>
		</div>

	</div>
</section>
