<?php
/**
 * The template used for displaying Buttons in the pattern library.
 *
 * @package _s
 */
?>

<section class="section-pattern">

	<h2 class="pattern-heading"><?php esc_html_e( 'Buttons', '_s' ); ?></h2>

	<?php // Button.
	_s_display_pattern_section( array(
		'title'       => 'Button',
		'description' => 'Display a button.',
		'usage'       => '<button class="button" href="#">Click Me</button>',
		'output'      => '<button class="button">Click Me</button>',
	) ); ?>
</section>
