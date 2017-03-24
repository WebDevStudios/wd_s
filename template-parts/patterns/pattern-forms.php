<?php
/**
 * The template used for displaying forms in the pattern library.
 *
 * @package _s
 */
?>

<section class="section-pattern">

	<h2 class="pattern-heading"><?php esc_html_e( 'Forms', '_s' ); ?></h2>

	<?php // Search form.
	_s_display_pattern_section( array(
		'title'       => 'Search Form',
		'description' => 'Display the search form.',
		'usage'       => '<?php get_search_form(); ?>',
		'output'      => get_search_form(),
	) ); ?>
</section>
