<?php
/**
 * MODULE - Badges.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package ABS
 */

use function abs\functions\render_element;
use function abs\functions\return_formatted_atts;
use function abs\functions\return_formatted_args;

$abs_defaults = [
	'class'  => [ 'abs-module', 'abs-module-badges' ],
	'badges' => [],
];

$abs_args = return_formatted_args( $args, $abs_defaults );

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class' ], $abs_args );
?>
<div <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	foreach ( $abs_args['badges'] as $abs_badge ) :
		render_element(
			'badge',
			$abs_badge
		);
	endforeach;
	?>
</div>
