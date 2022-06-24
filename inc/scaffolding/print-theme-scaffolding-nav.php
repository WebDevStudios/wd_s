<?php
/**
 * Add a scaffolding nav for easier access.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Add a scaffolding nav for easier access.
 *
 * @author JC Palmes
 */
function print_theme_scaffolding_nav() {
	?>
	<nav class="scaffolding-nav">
		<span><?php echo esc_html__( 'Scroll to:', 'wd_s' ); ?></span>
		<a href="#globals" class="link"><?php echo esc_html__( 'Globals', 'wd_s' ); ?></a>
		<a href="#typography" class="link"><?php echo esc_html__( 'Typography', 'wd_s' ); ?></a>
		<a href="#media" class="link"><?php echo esc_html__( 'Media', 'wd_s' ); ?></a>
		<a href="#icons" class="link"><?php echo esc_html__( 'Icons', 'wd_s' ); ?></a>
		<a href="#buttons" class="link"><?php echo esc_html__( 'Buttons', 'wd_s' ); ?></a>
		<a href="#forms" class="link"><?php echo esc_html__( 'Forms', 'wd_s' ); ?></a>
		<a href="#elements" class="link"><?php echo esc_html__( 'Elements', 'wd_s' ); ?></a>
	</nav><!-- .scaffolding-nav -->
	<?php
}
