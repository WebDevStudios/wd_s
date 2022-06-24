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

$abs_defaults = [
	'class'       => [ 'abs-module', 'abs-module-carousel' ],
	'heros'       => [],
	'show_arrows' => true,
];

$abs_args = get_formatted_args( $args, $abs_defaults );

if ( count( $abs_args['heros'] ) ) :

	// Set up element attributes.
	$abs_atts = get_formatted_atts( [ 'class' ], $abs_args );

	wp_enqueue_script( 'abs-smoothscroll', 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.js', [ 'abs-alpine' ], '1.0', true );

	?>
	<div
		<?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		x-data="{
			skip: 1,
			currentIndex: 0,
			next() {
				this.to((current, offset) => current + (offset * this.skip))
			},
			prev() {
				this.to((current, offset) => current - (offset * this.skip))
			},
			to(strategy) {
				let slider = this.$refs.slider
				let current = slider.scrollLeft
				let offset = slider.firstElementChild.getBoundingClientRect().width
				slider.scrollTo({ left: strategy(current, offset), behavior: 'smooth' })
			},
			focusableWhenVisible: {
				'x-intersect:enter'() {
					this.$el.removeAttribute('tabindex')
				},
				'x-intersect:leave'() {
					this.$el.setAttribute('tabindex', '-1')
				},
			}
		}">

		<div
			x-on:keydown.right="next"
			x-on:keydown.left="prev"
			tabindex="0"
			role="region"
			aria-labelledby="carousel-label"

		>
			<?php
			if ( $abs_args['show_arrows'] ) :
				print_element(
					'button',
					[
						'class'  => [ 'carousel-button' ],
						'icon'   => [
							'icon'   => 'chevron-left',
							'height' => '50px',
							'width'  => '50px',
						],
						'alpine' => [
							'x-on:click' => 'prev',
						],
					]
				);
			endif;
			?>

			<span id="carousel-content-label" class="sr-only" hidden>Carousel</span>

			<ul
				x-ref="slider"
				tabindex="0"
				role="listbox"
				aria-labelledby="carousel-content-label"
				class="snap-x snap-mandatory"
			>

				<?php foreach ( $args['heros'] as $abs_hero ) : ?>
					<li class="snap-start" role="option">
						<?php
						print_module(
							'hero',
							$abs_hero
						);
						?>
					</li>
				<?php endforeach; ?>

			</ul>
			<?php
			if ( $abs_args['show_arrows'] ) :
				print_element(
					'button',
					[
						'class'  => [ 'carousel-button', 'carousel-button-next' ],
						'icon'   => [
							'icon'   => 'chevron-right',
							'height' => '50px',
							'width'  => '50px',
							'color'  => 'ffffff',
						],
						'alpine' => [
							'x-on:click' => 'next',
						],
					]
				);
			endif;
			?>
		</div>
	</div>
<?php endif; ?>
