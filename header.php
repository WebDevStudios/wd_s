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
	<a class="skip-link show-for-sr" href="#main"><?php esc_html_e( 'Skip to content', '_s' ); ?></a>

	<header class="site-header">
		<div class="row">
			<div class="site-branding column small-12 large-2 text-center large-text-left">
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

			<div class="title-bar column small-12 text-center" data-responsive-toggle="main-site-navigation" data-hide-for="large">
				<button class="menu-icon" type="button" data-toggle="off-canvas-menu"></button>
				<div class="title-bar-title"><?php esc_html_e( 'Menu', '_s' ); ?></div>
			</div><!-- .title-bar -->

			<div class="column large-10 align-middle" id="main-site-navigation">
				<div class="top-bar-left medium-8">
					<?php
					wp_nav_menu( array(
						'theme_location' => 'primary',
						'menu_id'        => 'primary-menu',
						'menu_class'     => 'dropdown menu',
						'items_wrap'     => '<ul id="%1$s" class="%2$s" data-dropdown-menu>%3$s</ul>',
						'walker'         => new WDS_Submenu_Classes(),
					) );
					?>
				</div><!-- .top-bar-left -->
				<div class="top-bar-right medium-4">
					<?php get_search_form(); ?>
				</div><!-- .top-bar-right -->
			</div><!-- #main-site-navigation -->
		</div><!-- .row -->
	</header><!-- .site-header -->

	<main id="main" class="site-main" role="main">
		<div id="content" class="site-content">
