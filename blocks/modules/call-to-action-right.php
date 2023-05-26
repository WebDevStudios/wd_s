<?php
/**
 * MODULE - Call to Action
 *
 * Modules are analagous to 'Molecules' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#molecules
 *
 * @package abs
 */

$wds_defaults = [
	'class'       => [ 'wds-module', 'wds-module-call-to-action' ],
	'eyebrow'     => false,
	'heading'     => false,
	'content'     => false,
	'button_args' => false,
];

$wds_args = wp_parse_args( $args, $wds_defaults );

// Set up element attributes.
$wds_atts = $wds_args['class'];

?>
<div class="<?php echo esc_attr( implode( ' ', $wds_atts ) ); ?>">
	<div class="right-content">
		<?php
		// Eyebrow.
		if ( $wds_args['eyebrow'] ) :
			?>
			<span class="wds-element wds-element-eyebrow"><?php echo wp_kses_post( $wds_args['eyebrow'] ); ?></span>
			<?php
		endif;

		// Heading.
		if ( $wds_args['heading'] ) :
			?>
			<h2 class="wds-element wds-element-heading"><?php echo wp_kses_post( $wds_args['heading'] ); ?></h2>
			<?php
		endif;

		// Content.
		if ( $wds_args['content'] ) :
			?>
			<section class="wds-element wds-element-content"><?php echo wp_kses_post( $wds_args['content'] ); ?></section>
			<?php
		endif;

		// Button.
		if ( ! empty( $wds_args['button_args']['button'] ) ) :
			?>
			<button class="wds-element wds-element-button"><?php echo wp_kses_post( $wds_args['button_args']['title'] ); ?></button>
		<?php endif; ?>
	</div>
</div>
