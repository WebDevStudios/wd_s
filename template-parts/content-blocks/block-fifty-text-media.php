<?php
/**
 *  The template used for displaying fifty/fifty text/media.
 *
 * @package _s
 */

// Set up fields.
global $fifty_block, $fifty_alignment, $fifty_classes;
$image_data = get_field( 'media_right' );
$text       = get_field( 'text_primary' );

// Start a <container> with a possible media background.
_s_display_block_options(
	array(
		'block'     => $fifty_block,
		'container' => 'section', // Any HTML5 container: section, div, etc...
		'class'     => 'content-block grid-container fifty-fifty-block fifty-text-media' . esc_attr( $fifty_alignment . $fifty_classes ), // Container class.
	)
);
?>
	<div class="display-flex container">

		<div class="half">
			<?php echo _s_get_the_content( $text ); // WPCS: XSS OK. ?>
		</div>

		<div class="half">
			<img class="fifty-media-image" src="<?php echo esc_url( $image_data['url'] ); ?>" alt="<?php echo esc_html( $image_data['alt'] ); ?>">
		</div>

	</div>
</section>
