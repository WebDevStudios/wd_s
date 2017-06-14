<?php
/**
 * The template used for displaying a generic content block.
 *
 * @package _s
 */

// Start a <container> with a possible media background.
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'content-block generic-content', // The class of the container.
) );
?>
	<div class="row">
		<?php echo force_balance_tags( get_sub_field( 'content' ) ); // WP XSS OK. ?>
	</div>
</section><!-- .generic-content -->
