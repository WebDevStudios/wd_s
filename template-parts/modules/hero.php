<?php
/**
 * MODULE - Hero.
 * Modules are analagous to 'Molecules' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#molecules
 *
 * @package ABS
 */

use function abs\functions\render_element;
use function abs\functions\return_formatted_atts;
use function abs\functions\return_formatted_args;

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

$abs_args = return_formatted_args( $args, $abs_defaults );

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class' ], $abs_args );

?>
<div <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="background">
		<?php
		// Image.
		if ( $abs_args['attachment_id'] ) :
			render_element(
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
				render_element(
					'eyebrow',
					[
						'text' => $abs_args['eyebrow'],
					]
				);
			endif;

			// Heading.
			if ( $abs_args['heading'] ) :
				render_element(
					'heading',
					[
						'text'  => $abs_args['heading'],
						'level' => 1,
					]
				);
			endif;

			// Content.
			if ( $abs_args['content'] ) :
				render_element(
					'content',
					[
						'content' => $abs_args['content'],
					]
				);
			endif;

			// Button.
			if ( $abs_args['button'] ) :
				render_element(
					'button',
					$abs_args['button']
				);
			endif;
			?>
		</div>
	</div>
</div>
