<?php
/**
 *  The template used for displaying fifty/fifty text/text.
 *
 * @package _s
 *
 */
// Set up our animation class for the wrap.
$animation_class = _s_get_animation_class();


// Start a <container> with a possible media background.
echo _s_display_block_options( array( // WPCS: XSS OK.
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'fifty-text-only', // The container class.
) );
?>
	<div class="row <?php echo esc_attr( $animation_class ) ?>">
		<div class="col-l-6">
			<?php echo force_balance_tags( get_sub_field( 'text_primary' ) ); // WPCS: XSS OK. ?>
		</div><!-- .fifty-text-left-->

		<div class="col-l-6">
			<?php echo force_balance_tags( get_sub_field( 'text_secondary' ) ); // WPCS: XSS OK. ?>
		</div><!-- .fifty-text-right-->
	</div><!-- .fifty-wrap-->
</section><!-- .fifty-text-only -->
