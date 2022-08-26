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

$wd_s_defaults = [
	'class' => [ 'wds-block', 'wds-block-side-by-side' ],
];

$wd_s_side_by_side = get_acf_fields( [ 'column_order', 'image', 'card' ], $block['id'] );

$wd_s_defaults['class'][] = $wd_s_side_by_side['column_order'];

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_defaults );
?>

<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/template-parts/blocks/previews/side-by-side-preview.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Side by Side Block', 'wd_s' ); ?>">
	</figure>
<?php else : ?>
	<section <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
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
