<?php
/**
 * The Header markup.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package _s
 */

?>
<header class="site-header">

	<div class="container">

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

		<?php if ( has_nav_menu( 'primary' ) || has_nav_menu( 'mobile' ) ) : ?>
			<button type="button" class="off-canvas-open" aria-expanded="false" aria-label="<?php esc_attr_e( 'Open Menu', '_s' ); ?>">
			</button>
		<?php endif; ?>

	</div><!-- .container -->

	<nav id="site-navigation" class="main-navigation navigation-menu" aria-label="<?php esc_attr_e( 'Main Navigation', '_s' ); ?>">
		<?php
		wp_nav_menu(
			array(
				'fallback_cb'    => false,
				'theme_location' => 'primary',
				'menu_id'        => 'primary-menu',
				'menu_class'     => 'menu dropdown container',
				'container'      => false,
			)
		);
		?>
	</nav><!-- #site-navigation-->

</header><!-- .site-header-->
