<?php
/**
 * ELEMENT - Button
 *
 * Elements are analagous to 'Atoms' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#atoms
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;
use function WebDevStudios\wd_s\print_svg;

$wd_s_defaults = [
	'class'         => [ 'wds-element', 'wds-element-button' ],
	'id'            => '',
	'title'         => false,
	'href'          => false,
	'target'        => false,
	'type'          => false,
	'icon'          => [],
	'icon_position' => 'after', // before, after.
	'role'          => '',
	'aria'          => [
		'controls' => '',
		'disabled' => false,
		'expanded' => false,
	],
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Make sure element should render.
if ( $wd_s_args['title'] || $wd_s_args['icon'] ) :

	if ( ! empty( $wd_s_args['icon'] ) ) :
		$wd_s_args['class'][] = 'icon';
		$wd_s_args['class'][] = 'icon-' . $wd_s_args['icon_position'];
	endif;

	// Set up element attributes.
	$wd_s_atts = get_formatted_atts( [ 'id', 'href', 'target', 'class', 'type', 'aria', 'role' ], $wd_s_args );

	?>
	<<?php echo $wd_s_args['href'] ? 'a' : 'button'; ?> <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		if ( $wd_s_args['title'] ) :
			echo esc_html( $wd_s_args['title'] );
		endif;

		if ( ! empty( $wd_s_args['icon'] ) ) :
			print_svg( $wd_s_args['icon'] );
		endif;
		?>
	</<?php echo $wd_s_args['href'] ? 'a' : 'button'; ?>>

<?php endif; ?>
