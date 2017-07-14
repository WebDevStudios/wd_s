<?php
/**
 * The template used for displaying a generic content block.
 *
 * @package _s
 */

// Set up fields.
$content = get_sub_field( 'content' );

// Start a <container> with a possible background media.
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'content-block generic-content', // The class of the container.
) );
?>
	<?php echo force_balance_tags( $content ); // WP XSS OK. ?>
</section><!-- .generic-content -->
