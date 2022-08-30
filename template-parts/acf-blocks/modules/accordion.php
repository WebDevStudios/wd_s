<?php
/**
 * MODULE - Accordion
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\get_formatted_args;
use function WebDevStudios\wd_s\get_formatted_atts;

$wd_s_defaults = [
	'class' => [ 'wds-module', 'wds-module-accordion' ],
	'items' => [],
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );
?>

<div <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php foreach ( $wd_s_args['items'] as $wd_s_key => $wd_s_item ) : ?>
		<div class="accordion-item">
			<?php
			print_element(
				'button',
				[
					'class' => [ 'accordion-title' ],
					'id'    => 'accordion-item-' . $wd_s_key,
					'title' => $wd_s_item['text'],
					'aria'  => [
						'controls' => 'accordion-content-' . $wd_s_key,
					],
					'icon'  => [
						'color'  => '#000',
						'icon'   => 'caret-down',
						'height' => '24',
						'width'  => '24',
					],
				]
			);
			?>

			<div
				id="accordion-content-<?php echo esc_attr( $wd_s_key ); ?>"
				role="region"
				aria-labelledby="accordion-item-<?php echo esc_attr( $wd_s_key ); ?>"
			>
			<?php
			print_element(
				'content',
				[
					'class'   => [ 'accordion-content' ],
					'content' => $wd_s_item['content'],
				]
			);
			?>
			</div>
		</div>
	<?php endforeach; ?>
</div>
