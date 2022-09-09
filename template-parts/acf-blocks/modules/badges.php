<?php
/**
 * MODULE - Badges.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;

$wd_s_defaults = [
	'class'  => [ 'wds-module', 'wds-module-badges' ],
	'badges' => [],
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );
?>
<div <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	foreach ( $wd_s_args['badges'] as $wd_s_badge ) :
		print_element(
			'badge',
			$wd_s_badge
		);
	endforeach;
	?>
</div>
