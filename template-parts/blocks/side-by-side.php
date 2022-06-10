<?php
/**
 * BLOCK - Renders a Side-by-Side section
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package ABS
 */

use function abs\functions\render_module;
use function abs\functions\return_acf_fields;
use function abs\functions\return_formatted_atts;

$abs_defaults = [
	'class' => [ 'abs-block', 'abs-block-side-by-side' ],
];

$abs_side_by_side = return_acf_fields( [ 'column_order', 'image', 'card' ], $block['id'] );

$abs_defaults['class'][] = $abs_side_by_side['column_order'];

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class' ], $abs_defaults );
?>

<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/template-parts/blocks/previews/side-by-side-preview.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Side by Side Block', 'abs' ); ?>">
	</figure>
<?php else : ?>
	<section <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		render_module(
			'figure',
			$abs_side_by_side['image'],
		);

		render_module(
			'card',
			$abs_side_by_side['card']
		);
		?>
	</section>
<?php endif; ?>
