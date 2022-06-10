<?php
/**
 * MODULE - Accordion
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package ABS
 */

use function abs\functions\render_element;
use function abs\functions\return_formatted_args;
use function abs\functions\return_formatted_atts;

$abs_defaults = [
	'class' => [ 'abs-module', 'abs-module-accordion' ],
	'items' => [],
];

$abs_args = return_formatted_args( $args, $abs_defaults );

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class' ], $abs_args );
?>

<div <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> x-data="{ active: 0 }">
	<?php foreach ( $abs_args['items'] as $abs_key => $abs_item ) : ?>
		<div
			x-data="{
				id: <?php echo esc_attr( $abs_key ); ?>,
				get expanded() {
					return this.active === this.id
				},
				set expanded(value) {
					this.active = value ? this.id : null
				},
			}"
			class="accordion-item"
		>
			<?php
			render_element(
				'button',
				[
					'class'  => [ 'accordion-title' ],
					'id'     => 'accordion-item-' . $abs_key,
					'title'  => $abs_item['text'],
					'aria'   => [
						'controls' => 'accordion-content-' . $abs_key,
					],
					'alpine' => [
						'x-on:click'     => 'expanded = !expanded',
						':aria-expanded' => 'expanded',
					],
					'icon'   => [
						'color'  => '#000',
						'icon'   => 'caret-down',
						'height' => '24',
						'width'  => '24',
					],
				]
			);
			?>

			<div
				id="accordion-content-<?php echo esc_attr( $abs_key ); ?>"
				x-show="expanded"
				x-collapse
				role="region"
				aria-labelledby="accordion-item-<?php echo esc_attr( $abs_key ); ?>"
			>
			<?php
			render_element(
				'content',
				[
					'class'   => [ 'accordion-content' ],
					'content' => $abs_item['content'],
				]
			);
			?>
			</div>
		</div>
	<?php endforeach; ?>
</div>
