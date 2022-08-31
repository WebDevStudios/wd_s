<?php
/**
 * BLOCK - Renders an Accordion
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_module;
use function WebDevStudios\wd_s\get_acf_fields;
use function WebDevStudios\wd_s\get_formatted_atts;

$wd_s_defaults = [
	'class'               => [ 'wds-block', 'cards-repeater' ],
	'allowed_innerblocks' => [ 'core/heading', 'core/paragraph' ],
	'id'                  => ! empty( $block['anchor'] ) ? $block['anchor'] : '',
];

if ( ! empty( $block['className'] ) ) :
	$wd_s_defaults['class'] = array_merge( $wd_s_defaults['class'], explode( ' ', $block['className'] ) );
endif;

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class', 'id' ], $wd_s_defaults );

// Pull in the fields from ACF.
$wd_s_accordion = get_acf_fields( [ 'accordion_items' ], $block['id'] );
?>

<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img
			src="<?php echo esc_url( get_theme_file_uri( 'build/images/block-previews/accordion-preview.jpg' ) ); ?>"
			alt="<?php esc_html_e( 'Preview of the Accordion Block', 'wd_s' ); ?>"
		>
	</figure>
<?php elseif ( $wd_s_accordion['accordion_items']['items'] ) : ?>
	<section <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		echo '<InnerBlocks allowedBlocks="' . esc_attr( wp_json_encode( $wd_s_defaults['allowed_innerblocks'] ) ) . '" />';

		print_module( 'accordion', $wd_s_accordion['accordion_items'] );
		?>
	</section>
<?php endif; ?>
