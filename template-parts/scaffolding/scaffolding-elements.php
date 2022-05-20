<?php
/**
 * The template used for displaying generic elements in the scaffolding library.
 *
 * @package _s
 */

namespace WebDevStudios\wd_s;

?>

<section class="section-scaffolding">

	<h2 class="scaffolding-heading" id="<?php esc_html_e( 'elements', '_s' ); ?>"><?php esc_html_e( 'Generic Elements', '_s' ); ?></h2>

	<?php
	// Right-aligned Image.
	print_scaffolding_section(
		[
			'title'       => 'Numeric Pagination',
			'description' => 'Display numeric pagination.',
			'usage'       => '_s_print_numeric_pagination()',
			'output'      => '
				<nav class="pagination-container">
					<a class="prev page-numbers" href="#>&laquo;</a>
					<a class="page-numbers" href="#">1</a>
					<span aria-current="page" class="page-numbers current">2</span>
					<a class="page-numbers" href="#">3</a>
					<a class="next page-numbers" href="#">&raquo;</a>
				</nav>
			',
		]
	);

	?>
</section>
