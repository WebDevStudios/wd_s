<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package wd_s
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>

	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

	<?php wp_head(); ?>

</head>

<body <?php body_class( 'site-wrapper' ); ?>>

	<?php wp_body_open(); ?>

	<a class="skip-link screen-reader-text" href="#main"><?php esc_html_e( 'Skip to content', 'wd_s' ); ?></a>

	<header class="site-header">

		<div class="site-header-content">

			<div class="site-branding">

				<?php the_custom_logo(); ?>

				<?php if ( is_front_page() && is_home() ) : ?>
					<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
				<?php else : ?>
					<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
				<?php endif; ?>

				<?php

				$wd_s_description = get_bloginfo( 'description', 'display' );
				if ( $wd_s_description || is_customize_preview() ) :
					?>
					<p class="site-description"><?php echo esc_html( $wd_s_description ); ?></p>
				<?php endif; ?>

			</div><!-- .site-branding -->

			<?php if ( has_nav_menu( 'primary' ) || has_nav_menu( 'mobile' ) ) : ?>
				<button type="button" class="off-canvas-open" aria-expanded="false" aria-label="<?php esc_attr_e( 'Open Menu', 'wd_s' ); ?>"></button>
			<?php endif; ?>

		</div><!-- .site-header-content -->

		<nav id="site-navigation" class="main-navigation navigation-menu" aria-label="<?php esc_attr_e( 'Main Navigation', 'wd_s' ); ?>">
			<?php
			wp_nav_menu(
				[
					'fallback_cb'    => false,
					'theme_location' => 'primary',
					'menu_id'        => 'primary-menu',
					'menu_class'     => 'menu dropdown container',
					'container'      => false,
				]
			);
			?>
		</nav><!-- #site-navigation-->

	</header><!-- .site-header-->
