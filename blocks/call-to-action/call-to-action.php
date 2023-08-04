<?php
/**
 * BLOCK - Renders a Call to Action block
 *
 * @link https://developer.wordpress.org/block-editor/
 *
 * @package wd_s
 */

$wds_block = $block ?? '';
$wds_args  = $args ?? get_fields();

$wds_atts = [
	'class'               => [ 'wds-block', 'wds-block-call-to-action' ],
	'allowed_innerblocks' => [ 'core/heading', 'core/paragraph' ],
	'id'                  => ( isset( $wds_block ) && ! empty( $wds_block['anchor'] ) ) ? $wds_block['anchor'] : '',
	'fields'              => [ 'eyebrow', 'heading', 'content', 'button_args', 'layout' ],
];

?>
<section class="<?php echo esc_attr( implode( ' ', $wds_atts['class'] ) ); ?>">
	<?php
	if ( ! empty( $wds_atts['allowed_innerblocks'] ) ) :
		echo '<InnerBlocks allowedBlocks="' . esc_attr( wp_json_encode( $wds_atts['allowed_innerblocks'] ) ) . '" />';
	endif;

	get_template_part( 'blocks/modules/call-to-action-' . get_field( 'layout' ), null, $wds_args );
	?>
</section>
