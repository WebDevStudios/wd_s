<?php
/**
 * The template used for displaying a hero.
 *
 * @package _s
 */

// Set up fields.
$background_image        = get_sub_field( 'background_image' );
$background_video        = get_sub_field( 'background_video' );
$title                   = get_sub_field( 'title' );
$blurb                   = get_sub_field( 'blurb' );
$button_text             = get_sub_field( 'button_text' );
$button_url              = get_sub_field( 'button_url' );
$background_video_markup = '';

// If a background video is uploaded.
if ( $background_video['url'] ) {
	$background_video_markup .= '<video class="video-as-background" autoplay muted loop preload="auto"><source src="' . esc_url( $background_video['url'] ) . '" type="video/mp4"></video>';
}

// Start the markup. ?>
<section class="hero-area image-as-background container full-width" style="background-image: url( <?php echo esc_url( $background_image['url'] ); ?> );" role="dialog" aria-labelledby="hero-title" aria-describedby="hero-description">
	<?php echo $background_video_markup; // WPCS XSS OK. ?>
	<div class="hero-content row">
		<h2 class="hero-title"><?php echo esc_html( $title ); ?></h2>
		<p class="hero-description"><?php echo force_balance_tags( $blurb ); // WP XSS OK. ?></p>
		<a href="<?php echo esc_url( $button_url ); ?>" class="hero-button" title="<?php echo esc_html( $button_text ); ?>"><?php echo esc_html( $button_text ); ?></a>
	</div><!-- .hero-content -->
</section><!-- .hero-area -->
