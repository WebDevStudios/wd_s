<?php
/**
 * The template used for displaying 50/50 text only.
 *
 * @package _s
 */

// Start a <container> with a possible media background.
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'row fifty-text-only', // The container class.
) );
?>
	<div class="column small-12 medium-6 fifty-text-left">
		<?php echo force_balance_tags( get_sub_field( 'content_left' ) ); // WPCS: XSS OK. ?>
	</div><!-- .fifty-text-left-->

	<div class="column small-12 medium-6 fifty-text-right">
		<?php echo force_balance_tags( get_sub_field( 'content_right' ) ); // WPCS: XSS OK. ?>
	</div><!-- .fifty-text-right-->
</section><!-- .fifty-text-only -->
