<?php
/**
 * BLOCK - Renders a Tab block
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package ABS
 */

use function abs\functions\render_element;
use function abs\functions\render_module;
use function abs\functions\return_acf_fields;
use function abs\functions\return_formatted_atts;

$abs_defaults = [
	'class' => [ 'abs-block', 'abs-block-tabs' ],
];

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class' ], $abs_defaults );

$abs_tabs = return_acf_fields( [ 'block_heading', 'block_content', 'tab_items' ], $block['id'] );

?>
<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/build/images/block-previews/tabs-preview.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Tabs Block', 'abs' ); ?>">
	</figure>
<?php elseif ( $abs_tabs['tab_items']['items'] ) : ?>
	<section <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		if ( $abs_tabs['block_heading'] ) :
			render_element(
				'heading',
				[
					'text'  => $abs_tabs['block_heading'],
					'class' => [ 'block-heading' ],
				]
			);
		endif;

		if ( $abs_tabs['block_content'] ) :
			render_element(
				'content',
				[
					'content' => $abs_tabs['block_content'],
					'class'   => [ 'block-content' ],
				]
			);
		endif;

		render_module( 'tabs', $abs_tabs['tab_items'] );
		?>
	</section>
<?php endif; ?>
