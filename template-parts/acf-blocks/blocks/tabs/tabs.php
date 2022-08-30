<?php
/**
 * BLOCK - Renders a Tab block
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_module;
use function WebDevStudios\wd_s\get_acf_fields;
use function WebDevStudios\wd_s\get_formatted_atts;

$wd_s_defaults = [
	'class'          => [ 'wds-block', 'tabs' ],
	'allowed_blocks' => [ 'core/heading', 'core/paragraph' ],
];

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_defaults );

// Pull in the fields from ACF.
$wd_s_tabs = get_acf_fields( [ 'tab_items' ], $block['id'] );
?>

<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/build/images/block-previews/tabs-preview.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Tabs Block', 'wd_s' ); ?>">
	</figure>
<?php elseif ( $wd_s_tabs['tab_items']['items'] ) : ?>
	<section <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		echo '<InnerBlocks allowedBlocks="' . esc_attr( wp_json_encode( $wd_s_defaults['allowed_blocks'] ) ) . '" />';

		print_module( 'tabs', $wd_s_tabs['tab_items'] );
		?>
	</section>
<?php endif; ?>
