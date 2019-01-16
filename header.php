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

		<div class="site-branding">

			<?php the_custom_logo(); ?>

			<?php if ( is_front_page() && is_home() ) : ?>
				<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
			<?php else : ?>
				<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
			<?php endif; ?>

			<?php
			$description = get_bloginfo( 'description', 'display' );
			if ( $description || is_customize_preview() ) :
			?>
				<p class="site-description"><?php echo esc_html( $description ); ?></p>
			<?php endif; ?>
		</div><!-- .site-branding -->

		<?php _s_display_header_button(); ?>

		<?php if ( has_nav_menu( 'primary' ) || has_nav_menu( 'mobile' ) ) : ?>
			<button type="button" class="off-canvas-open" aria-expanded="false" aria-label="<?php esc_html_e( 'Open Menu', '_s' ); ?>">
				<span class="hamburger"></span>
			</button>
		<?php endif; ?>

		<nav id="site-navigation" class="main-navigation" aria-label="<?php esc_html_e( 'Main Menu', '_s' ); ?>">
			<?php
			wp_nav_menu( array(
				'fallback_cb'     => false,
				'theme_location'  => 'primary',
				'menu_id'         => 'primary-menu',
				'menu_class'      => 'menu dropdown',
				'container'       => false,
				'container_class' => '',
				'container_id'    => '',
				'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
			) );
			?>
		</nav>
	</header><!-- .site-header-->

	<div id="content" class="site-content">
