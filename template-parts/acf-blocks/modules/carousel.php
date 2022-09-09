<?php
/**
 * MODULE - Carousel
 *
 * Modules are analagous to 'Molecules' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#molecules
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_module;
use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;

$wd_s_defaults = [
	'class'       => [ 'wds-module', 'wds-module-carousel' ],
	'heros'       => [],
	'show_arrows' => true,
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

if ( count( $wd_s_args['heros'] ) ) :

	// Set up element attributes.
	$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );

	wp_enqueue_script( 'wd_s-smoothscroll', 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.js', [], '1.0', true );

	?>
	<div <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

		<div
			tabindex="0"
			role="region"
			aria-labelledby="carousel-label"
		>
			<?php
			if ( $wd_s_args['show_arrows'] ) :
				print_element(
					'button',
					[
						'class' => [ 'carousel-button' ],
						'icon'  => [
							'icon'   => 'chevron-left',
							'height' => '50px',
							'width'  => '50px',
						],
					]
				);
			endif;
			?>

			<span id="carousel-content-label" class="sr-only" hidden>Carousel</span>

			<ul
				tabindex="0"
				role="listbox"
				aria-labelledby="carousel-content-label"
				class="snap-x snap-mandatory"
			>

				<?php foreach ( $args['heros'] as $wd_s_hero ) : ?>
					<li class="snap-start" role="option">
						<?php
						print_module(
							'hero',
							$wd_s_hero
						);
						?>
					</li>
				<?php endforeach; ?>

			</ul>
			<?php
			if ( $wd_s_args['show_arrows'] ) :
				print_element(
					'button',
					[
						'class' => [ 'carousel-button', 'carousel-button-next' ],
						'icon'  => [
							'icon'   => 'chevron-right',
							'height' => '50px',
							'width'  => '50px',
							'color'  => 'ffffff',
						],
					]
				);
			endif;
			?>
		</div>
	</div>
<?php endif; ?>
