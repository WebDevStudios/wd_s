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

$wd_s_defaults = [
	'class'         => [ 'wds-module', 'wds-module-hero' ],
	'attachment_id' => false,
	'overlay'       => false,
	'eyebrow'       => false,
	'heading'       => false,
	'content'       => false,
	'button'        => false,
	'attachment_id' => false,
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );

?>
<div <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="background">
		<?php
		// Image.
		if ( $wd_s_args['attachment_id'] ) :
			print_element(
				'image',
				[
					'attachment_id' => $wd_s_args['attachment_id'],
				]
			);
		endif;
		?>
	</div>

	<?php if ( $wd_s_args['overlay'] ) : ?>
		<div class="overlay"></div>
	<?php endif; ?>

	<div class="container">
		<div class="hero-content">
			<?php
			// Eyebrow.
			if ( $wd_s_args['eyebrow'] ) :
				print_element(
					'eyebrow',
					[
						'text' => $wd_s_args['eyebrow'],
					]
				);
			endif;

			// Heading.
			if ( $wd_s_args['heading'] ) :
				print_element(
					'heading',
					[
						'text'  => $wd_s_args['heading'],
						'level' => 1,
					]
				);
			endif;

			// Content.
			if ( $wd_s_args['content'] ) :
				print_element(
					'content',
					[
						'content' => $wd_s_args['content'],
					]
				);
			endif;

			// Button.
			if ( $wd_s_args['button'] ) :
				print_element(
					'button',
					$wd_s_args['button']
				);
			endif;
			?>
		</div>
	</div>
</div>
