<?php
/**
 * BLOCK - Renders a Tab block
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\print_module;
use function WebDevStudios\wd_s\return_acf_fields;
use function WebDevStudios\wd_s\get_formatted_atts;

$abs_defaults = [
	'class' => [ 'abs-block', 'abs-block-tabs' ],
];

// Set up element attributes.
$abs_atts = get_formatted_atts( [ 'class' ], $abs_defaults );

$abs_tabs = return_acf_fields( [ 'block_heading', 'block_content', 'tab_items' ], $block['id'] );

?>
<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/build/images/block-previews/tabs-preview.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Tabs Block', 'wd_s' ); ?>">
	</figure>
<?php elseif ( $abs_tabs['tab_items']['items'] ) : ?>
	<section <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		if ( $abs_tabs['block_heading'] ) :
			print_element(
				'heading',
				[
					'text'  => $abs_tabs['block_heading'],
					'class' => [ 'block-heading' ],
				]
			);
		endif;

		if ( $abs_tabs['block_content'] ) :
			print_element(
				'content',
				[
					'content' => $abs_tabs['block_content'],
					'class'   => [ 'block-content' ],
				]
			);
		endif;

		print_module( 'tabs', $abs_tabs['tab_items'] );
		?>
	</section>
<?php endif; ?>
