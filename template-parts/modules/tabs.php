<?php
/**
 * MODULE - Tabs
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package ABS
 */

use function abs\functions\render_element;
use function abs\functions\return_formatted_atts;
use function abs\functions\return_formatted_args;

$abs_defaults = [
	'class' => [ 'abs-module', 'abs-module-tabs' ],
	'items' => [],
];

$abs_args = return_formatted_args( $args, $abs_defaults );

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class' ], $abs_args );
?>
<div <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> x-data="{ tab: window.location.hash ? window.location.hash.substring(1) : 'tab-0' }">
	<nav role="tablist">
		<?php foreach ( $abs_args['items'] as $abs_key => $abs_item ) : ?>
			<?php
			render_element(
				'button',
				[
					'class'  => [ 'tab-title' ],
					'id'     => 'tab-item-' . $abs_key,
					'title'  => $abs_item['text'],
					'role'   => 'tab',
					'aria'   => [
						'controls' => 'tab-content-' . $abs_key,
					],
					'alpine' => [
						':class'         => "{ 'active': tab === 'tab-" . $abs_key . "' }",
						'@click.prevent' => "tab = 'tab-" . $abs_key . "'; window.location.hash = 'tab-" . $abs_key . "'",
					],
				]
			);
			?>
		<?php endforeach; ?>
	</nav>

	<div class="tabs-content">
		<?php foreach ( $abs_args['items'] as $abs_key => $abs_item ) : ?>
			<div x-show="tab === 'tab-<?php echo esc_attr( $abs_key ); ?>'" id="tab-content-<?php echo esc_attr( $abs_key ); ?> role="tabpanel" aria-labelledby="tab-item-<?php echo esc_attr( $abs_key ); ?>"><?php echo esc_html( $abs_item['content'] ); ?></div>
		<?php endforeach; ?>
	</div>
</div>
