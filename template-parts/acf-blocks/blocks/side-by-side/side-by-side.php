<?php
/**
 * BLOCK - Renders a Side-by-Side section
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_module;
use function WebDevStudios\wd_s\get_acf_fields;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_block_classes;

$wd_s_defaults = [
	'class'               => [ 'wds-block', 'cards-repeater' ],
	'allowed_innerblocks' => [ 'core/heading', 'core/paragraph' ],
	'id'                  => ! empty( $block['anchor'] ) ? $block['anchor'] : '',
];

// Get custom classes for the block and/or for block colors.
$wd_s_block_classes = [];
$wd_s_block_classes = get_block_classes( $block );

if ( ! empty( $wd_s_block_classes ) ) :
	$wd_s_defaults['class'] = array_merge( $wd_s_defaults['class'], $wd_s_block_classes );
endif;

$wd_s_defaults['class'][] = $wd_s_side_by_side['column_order'];

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class', 'id' ], $wd_s_defaults );

// Pull in the fields from ACF.
$wd_s_side_by_side = get_acf_fields( [ 'column_order', 'image', 'card' ], $block['id'] );
?>

<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img
			src="<?php echo esc_url( get_theme_file_uri( 'build/images/block-previews/side-by-side-preview.jpg' ) ); ?>"
			alt="<?php esc_html_e( 'Preview of the Side by Side Block', 'wd_s' ); ?>"
		>
	</figure>
<?php else : ?>
	<section <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		echo '<InnerBlocks allowedBlocks="' . esc_attr( wp_json_encode( $wd_s_defaults['allowed_innerblocks'] ) ) . '" />';

		print_module(
			'figure',
			$wd_s_side_by_side['image']
		);

		print_module(
			'card',
			$wd_s_side_by_side['card']
		);
		?>
	</section>
<?php endif; ?>
