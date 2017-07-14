<?php
/**
 * The template used for displaying 50/50 text only.
 *
 * @package _s
 */

// Set up fields.
$content_left = get_sub_field( 'content_left' );
$content_right = get_sub_field( 'content_right' );

// Start a <container> with a possible media background.
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'content-block fifty-fifty fifty-text-text', // The class of the container.
) );
?>
	<div>
		<?php echo force_balance_tags( $content_left ); // WPCS XSS OK. ?>
	</div>

	<div>
		<?php echo force_balance_tags( $content_right ); // WPCS XSS OK. ?>
	</div>
</section><!-- .fifty-text-media -->
