<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _s
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

	<?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#main"><?php esc_html_e( 'Skip to content', '_s' ); ?></a>

	<header class="site-header">
		<?php
			do_action( '_s_before_header' );

			if ( class_exists( 'FLThemeBuilder' ) && ! empty( FLThemeBuilderLayoutData::get_current_page_header_ids() ) ) :
				FLThemeBuilderLayoutRenderer::render_header();
			else :
				_s_display_site_header();
			endif;

			do_action( '_s_after_header' );
		?>
	</header><!-- .site-header-->

	<div id="content" class="site-content">
