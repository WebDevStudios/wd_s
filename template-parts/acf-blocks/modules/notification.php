<?php
/**
 * MODULE - Notification Banner.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

/**
 * Expected values for 'position' are 'top' or 'bottom'.
 * 'Sticky' notifications bar will be set to 'position: fixed'.
 * Icon is not necessary if 'dismissible' is true as Close icon will be rendered automatically.
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;

$wd_s_defaults = [
	'class'       => [ 'wds-module', 'wds-module-notification' ],
	'text_args'   => [],
	'icon'        => [],
	'dismissible' => false,
	'type'        => [
		'sticky'   => true,
		'position' => 'top',
	],
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Add default classes.
$wd_s_args['class'][] = $wd_s_args['type']['sticky'] ? 'is-sticky' : '';
$wd_s_args['class'][] = $wd_s_args['type']['sticky'] ? 'position-' . $wd_s_args['type']['position'] : '';

// Add an id.
$wd_s_args['id'] = 'notification-banner';

// Add the correct role.
$wd_s_args['role'] = $wd_s_args['dismissible'] ? 'alertdialog' : 'alert';

// Set up ARIA attributes.
$wd_s_args['aria']['labelledby'] = 'notification-title';

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class', 'role', 'aria', 'id' ], $wd_s_args );

// Make sure the notification title has an id for accessibility.
if ( empty( $wd_s_args['text_args']['id'] ) ) :
	$wd_s_args['text_args']['id'] = 'notification-title';
endif;

?>
<aside <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	if ( $wd_s_args['text_args'] ) :
		print_element( 'heading', $wd_s_args['text_args'] );
	endif;
	if ( $wd_s_args['dismissible'] || $wd_s_args['icon'] ) :
		if ( $wd_s_args['dismissible'] ) :
			// This is dismissible, so let's render a close button.
			print_element(
				'button',
				[
					'icon' => [
						'color'        => '#c00',
						'icon'         => 'circle-x',
						'stroke-width' => '2px',
						'height'       => '32px',
						'width'        => '32px',
					],
					'aria' => [
						'controls' => $wd_s_args['id'],
					],
				]
			);
		else :
			print_element(
				'icon',
				[
					'svg_args' => $wd_s_args['icon'],
				]
			);
		endif;
	endif;
	?>
</aside>
