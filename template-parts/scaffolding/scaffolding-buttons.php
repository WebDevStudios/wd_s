<?php
/**
 * The template used for displaying Buttons in the scaffolding library.
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_scaffolding_section;

?>

<section class="section-scaffolding">

	<h2 class="scaffolding-heading" id="<?php esc_html_e( 'buttons', 'wd_s' ); ?>"><?php esc_html_e( 'Buttons', 'wd_s' ); ?></h2>
	<?php
		// Button.
		print_scaffolding_section(
			[
				'title'       => 'Button',
				'description' => 'Display a button.',
				'usage'       => '<button class="button" href="#">Click Me</button>',
				'output'      => '<button class="button">Click Me</button>',
			]
		);
		?>
</section>
