<?php
/**
 *  The template used for displaying fifty/fifty text/text.
 *
 * @package _s
 */

// Set up fields.
$text_primary    = get_sub_field( 'text_primary' );
$text_secondary  = get_sub_field( 'text_secondary' );
$animation_class = _s_get_animation_class();

// Start a <container> with a possible media background.
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'content-block grid-container fifty-fifty fifty-text-only', // The container class.
) );
?>
	<div class="grid-x <?php echo esc_attr( $animation_class ); ?>">

		<div class="cell">
			<?php
				echo force_balance_tags( $text_primary ); // WPCS: XSS OK.
			?>
		</div>

		<div class="cell">
			<?php
				echo force_balance_tags( $text_secondary ); // WPCS: XSS OK.
			?>
		</div>

	</div><!-- .grid-x -->
</section><!-- .fifty-text-only -->
