<?php
/**
 * The template used for displaying a generic content block.
 *
 * @package _s
 */

// Set up fields.
$title = get_sub_field( 'title' );
$content = get_sub_field( 'content' );

// Start a <container> with possible block options.
echo _s_display_block_options( // WPCS: XSS OK.
	array(
		'container' => 'section', // Any HTML5 container: section, div, etc...
		'class'     => 'generic-content', // Container class.
	)
);
?>
	<div class="wrap">
		<?php if ( $title ) : ?>
			<h2 class="generic-content-title"><?php echo esc_html( $title ); ?></h2>
		<?php endif; ?>

		<?php echo force_balance_tags( $content ); // WP XSS OK. ?>
	</div>
</section><!-- .generic-content -->
