<?php
/**
 *  The template used for displaying fifty/fifty text/text.
 *
 * @package _s
 */

// Set up fields.
global $fifty_block, $fifty_alignment, $fifty_classes;
$text_primary   = get_field( 'text_primary' );
$text_secondary = get_field( 'text_secondary' );

// Start a <container> with a possible media background.
_s_display_block_options(
	array(
		'block'     => $fifty_block,
		'container' => 'section', // Any HTML5 container: section, div, etc...
		'class'     => 'content-block grid-container fifty-fifty-block fifty-text-only' . esc_attr( $fifty_alignment . $fifty_classes ), // The container class.
	)
);
?>
	<div class="display-flex container">

		<div class="half">
			<?php echo _s_get_the_content( $text_primary ); // WPCS: XSS OK. ?>
		</div>

		<div class="half">
			<?php echo _s_get_the_content( $text_secondary ); // WPCS: XSS OK. ?>
		</div>

	</div>
</section>
