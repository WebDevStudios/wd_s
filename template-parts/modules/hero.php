<?php
/**
 * MODULE - Hero.
 * Modules are analagous to 'Molecules' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#molecules
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;

$abs_defaults = [
	'class'         => [ 'abs-module', 'abs-module-hero' ],
	'attachment_id' => false,
	'overlay'       => false,
	'eyebrow'       => false,
	'heading'       => false,
	'content'       => false,
	'button'        => false,
	'attachment_id' => false,
];

$abs_args = get_formatted_args( $args, $abs_defaults );

// Set up element attributes.
$abs_atts = get_formatted_atts( [ 'class' ], $abs_args );

?>
<div <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="background">
		<?php
		// Image.
		if ( $abs_args['attachment_id'] ) :
			print_element(
				'image',
				[
					'attachment_id' => $abs_args['attachment_id'],
				]
			);
		endif;
		?>
	</div>

	<?php if ( $abs_args['overlay'] ) : ?>
		<div class="overlay"></div>
	<?php endif; ?>

	<div class="container">
		<div class="hero-content">
			<?php
			// Eyebrow.
			if ( $abs_args['eyebrow'] ) :
				print_element(
					'eyebrow',
					[
						'text' => $abs_args['eyebrow'],
					]
				);
			endif;

			// Heading.
			if ( $abs_args['heading'] ) :
				print_element(
					'heading',
					[
						'text'  => $abs_args['heading'],
						'level' => 1,
					]
				);
			endif;

			// Content.
			if ( $abs_args['content'] ) :
				print_element(
					'content',
					[
						'content' => $abs_args['content'],
					]
				);
			endif;

			// Button.
			if ( $abs_args['button'] ) :
				print_element(
					'button',
					$abs_args['button']
				);
			endif;
			?>
		</div>
	</div>
</div>
