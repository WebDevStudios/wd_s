<?php
/**
 * MODULE - Figure
 *
 * Modules are analagous to 'Molecules' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#molecules
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;

$wd_s_defaults = [
	'class'         => [ 'wds-module', 'wds-module-figure' ],
	'image_class'   => [],
	'attachment_id' => false,
	'src'           => false,
	'size'          => 'fullsize',
	'loading'       => 'lazy',
	'alt'           => false,
	'show_caption'  => false,
	'caption'       => false,
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

if ( $wd_s_args['show_caption'] && $wd_s_args['caption'] ) :
	$wd_s_args['class'][] = 'has-caption';
endif;

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );
?>

<figure <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	print_element(
		'image',
		[
			'attachment_id' => $wd_s_args['attachment_id'],
			'class'         => $wd_s_args['image_class'],
			'src'           => $wd_s_args['src'],
			'size'          => $wd_s_args['size'],
			'loading'       => $wd_s_args['loading'],
			'alt'           => $wd_s_args['alt'],
		]
	);
	?>

	<?php if ( $wd_s_args['show_caption'] && $wd_s_args['caption'] ) : ?>
		<figcaption><?php echo esc_html( $wd_s_args['caption'] ); ?></figcaption>
	<?php endif; ?>
</figure>
