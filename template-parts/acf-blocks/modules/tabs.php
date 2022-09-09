<?php
/**
 * MODULE - Tabs
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;

$wd_s_defaults = [
	'class' => [ 'wds-module', 'wds-module-tabs' ],
	'items' => [],
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );
?>
<div <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<nav role="tablist">
		<?php foreach ( $wd_s_args['items'] as $wd_s_key => $wd_s_item ) : ?>
			<?php
			print_element(
				'button',
				[
					'class' => [ 'tab-title' ],
					'id'    => 'tab-item-' . $wd_s_key,
					'title' => $wd_s_item['text'],
					'role'  => 'tab',
					'aria'  => [
						'controls' => 'tab-content-' . $wd_s_key,
					],
				]
			);
			?>
		<?php endforeach; ?>
	</nav>

	<div class="tabs-content">
		<?php foreach ( $wd_s_args['items'] as $wd_s_key => $wd_s_item ) : ?>
			<div id="tab-content-<?php echo esc_attr( $wd_s_key ); ?>" role="tabpanel" aria-labelledby="tab-item-<?php echo esc_attr( $wd_s_key ); ?>"><?php echo esc_html( $wd_s_item['content'] ); ?></div>
		<?php endforeach; ?>
	</div>
</div>
