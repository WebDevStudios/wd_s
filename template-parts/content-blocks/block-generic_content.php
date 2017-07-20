<?php
/**
 * The template used for displaying a generic content block.
 *
 * @package _s
 */

// Set up fields.
$title   = get_sub_field( 'title' );
$content = get_sub_field( 'content' );

?>
<section class="generic-content container">
	<div class="row">
		<?php if ( $title ) : ?>
			<p class="generic-content-title"><?php echo esc_html( $title ); ?>
		<?php endif; ?>

		<?php echo force_balance_tags( $content ); // WP XSS OK. ?>
	</div><!-- .row -->
</section><!-- .hero-area -->
