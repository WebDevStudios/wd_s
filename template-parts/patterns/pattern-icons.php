<?php
/**
 * The template used for displaying icons in the pattern library.
 *
 * @package _s
 */
?>

<section class="section-pattern">

	<h2 class="pattern-heading"><?php esc_html_e( 'Icons', '_s' ); ?></h2>

	<?php // SVG
	_s_display_pattern_section( array(
		'title'       => 'SVG',
		'description' => 'Display inline SVGs.',
		'usage'       => '<?php _s_get_svg( array( \'icon\' => \'facebook-square\' ) ); ?>',
		'parameters'  => array(
			'$args' => '(required) Configuration arguments.',
		),
		'arguments'    => array(
			'icon'  => '(required) The SVG icon file name. Default none',
			'title' => '(optional) The title of the icon. Default: none',
			'desc'  => '(optional) The description of the icon. Default: none',
		),
		'output'       => _s_get_svg( array( 'icon' => 'facebook-square' ) ),
	) ); ?>
</section>
