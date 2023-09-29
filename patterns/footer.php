<?php
/**
 * Title: Footer - Default
 * Slug: wds/footer-default
 * Categories: footer
 * Block Types: core/template-part/footer
 *
 * @package wd_s
 */

// Determine whether to display site logo or site title.
$wds_site_info = has_custom_logo() ? '<!-- wp:site-logo {"align":"center"} /-->' : '<!-- wp:site-title {"level":2,"textAlign":"center"} /-->';

// Generate the copyright information.
$wds_copyright_info = esc_html__( ' Copyright &copy; ', 'wd_s' ) . esc_attr( gmdate( 'Y' ) ) . esc_html__( '. All Rights Reserved.', 'wd_s' );

// Generate the theme attribution.
$wds_theme_info = esc_html__( ' Proudly powered by WordPress. ', 'wd_s' ) . '<a href="' . esc_url( 'https://webdevstudios.com/' ) . '">' . esc_html__( 'WebDevStudios', 'wd_s' ) . '</a>' . esc_html__( ' is a WD3 Party.', 'wd_s' );
?>

<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide">
	<?php echo wp_kses_post( $wds_site_info ); ?>

	<!-- wp:paragraph {"align":"center","style":{"spacing":{"padding":{"top":"0","bottom":"0"},"margin":{"top":"var:preset|spacing|20","bottom":"0"}}},"fontSize":"small"} -->
	<p class="has-text-align-center has-small-font-size" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:0;padding-top:0;padding-bottom:0"><?php echo wp_kses_post( $wds_copyright_info ); ?></p>
	<!-- /wp:paragraph -->

	<!-- wp:paragraph {"align":"center","style":{"spacing":{"padding":{"top":"0","bottom":"0"},"margin":{"top":"var:preset|spacing|20","bottom":"0"}}},"fontSize":"small"} -->
	<p class="has-text-align-center has-small-font-size" style="margin-top:var(--wp--preset--spacing--20);margin-bottom:0;padding-top:0;padding-bottom:0"><?php echo wp_kses_post( $wds_theme_info ); ?></p>
	<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
