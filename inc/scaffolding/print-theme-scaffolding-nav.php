<?php
/**
 * Add a scaffolding nav for easier access.
 *
 * @package _s
 */

namespace WebDevStudios\wd_s;

/**
 * Add a scaffolding nav for easier access.
 *
 * @author JC Palmes
 */
function theme_scaffolding_nav() {
	?>
	<nav class="scaffolding-nav">
		<span><?php echo esc_html__( 'Scroll to:', '_s' ); ?></span>
		<a href="#globals" class="link"><?php echo esc_html__( 'Globals', '_s' ); ?></a>
		<a href="#typography" class="link"><?php echo esc_html__( 'Typography', '_s' ); ?></a>
		<a href="#media" class="link"><?php echo esc_html__( 'Media', '_s' ); ?></a>
		<a href="#icons" class="link"><?php echo esc_html__( 'Icons', '_s' ); ?></a>
		<a href="#buttons" class="link"><?php echo esc_html__( 'Buttons', '_s' ); ?></a>
		<a href="#forms" class="link"><?php echo esc_html__( 'Forms', '_s' ); ?></a>
		<a href="#elements" class="link"><?php echo esc_html__( 'Elements', '_s' ); ?></a>
	</nav><!-- .scaffolding-nav -->
	<?php
}
