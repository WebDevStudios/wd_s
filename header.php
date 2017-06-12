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

<div class="off-canvas position-left" id="off-canvas-menu" data-off-canvas>
	<ul class="menu vertical" data-accordion-menu>
		<li><a href="#">One</a>
			<ul class="menu vertical">
				<li><a href="#">One</a></li>
				<li><a href="#">Two</a>
					<ul class="menu vertical">
						<li><a href="#">One</a></li>
						<li><a href="#">Two</a>
							<ul class="menu vertical">
								<li><a href="#">One</a></li>
								<li><a href="#">Two</a></li>
								<li><a href="#">Three</a></li>
							</ul>
						</li>
						<li><a href="#">Three</a></li>
					</ul>
				</li>
				<li><a href="#">Three</a></li>
			</ul>
		</li>
		<li><a href="#">Two</a></li>
		<li><a href="#">Three</a></li>
	</ul>
</div>

<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#main"><?php esc_html_e( 'Skip to content', '_s' ); ?></a>

	<header class="site-header">
		<div class="row">
			<div class="site-branding column small-9 medium-2">
				<?php the_custom_logo(); ?>

				<?php if ( is_front_page() && is_home() ) : ?>
					<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
				<?php else : ?>
					<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
				<?php endif; ?>
			</div><!-- .site-branding -->

			<div class="title-bar column small-3" data-responsive-toggle="example-menu" data-hide-for="medium">
				<button class="menu-icon" type="button" data-toggle="off-canvas-menu"></button>
				<div class="title-bar-title">Menu</div>
			</div>

			<div class="column medium-10 align-middle" id="example-menu">
				<div class="top-bar-left medium-8">
					<?php
					// wp_nav_menu( array(
					// 	'theme_location' => 'primary',
					// 	'menu_id'        => 'primary-menu',
					// 	'menu_class'     => 'dropdown menu',
					// ) );
					?>

					<ul class="dropdown menu" data-dropdown-menu>
						<li><a href="#">One</a>
							<ul class="menu vertical">
								<li><a href="#">One</a></li>
								<li><a href="#">Two</a>
									<ul class="menu vertical">
										<li><a href="#">One</a></li>
										<li><a href="#">Two</a>
											<ul class="menu vertical">
												<li><a href="#">One</a></li>
												<li><a href="#">Two</a></li>
												<li><a href="#">Three</a></li>
											</ul>
										</li>
										<li><a href="#">Three</a></li>
									</ul>
								</li>
								<li><a href="#">Three</a></li>
							</ul>
						</li>
						<li><a href="#">Two</a></li>
						<li><a href="#">Three</a></li>
					</ul>
				</div><!-- .top-bar-left -->
				<div class="top-bar-right medium-4">
					<?php get_search_form(); ?>
				</div><!-- .top-bar-right -->
			</div><!-- .top-bar -->
		</div><!-- .row -->
	</header><!-- .site-header -->

	<main id="main" class="site-main" role="main">
		<div id="content" class="site-content">
