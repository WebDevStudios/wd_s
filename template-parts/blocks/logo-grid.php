<?php
/**
 * BLOCK - Renders a Logo Grid section
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_module;
use function WebDevStudios\wd_s\return_acf_fields;
use function WebDevStudios\wd_s\get_formatted_atts;

$abs_defaults = [
	'class' => [ 'abs-block', 'abs-block-logo-grid' ],
];

$abs_logo_grid = return_acf_fields( [ 'logos' ], $block['id'] );

// Set up element attributes.
$abs_atts = get_formatted_atts( [ 'class' ], $abs_defaults );
?>

<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/build/images/block-previews/logo-grid.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Logo Grid Block', 'wd_s' ); ?>">
	</figure>
<?php elseif ( $abs_logo_grid['logos'] ) : ?>
	<section <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		foreach ( $abs_logo_grid['logos'] as $abs_logo ) :
			print_module(
				'figure',
				$abs_logo
			);
		endforeach;
		?>
	</section>
<?php endif; ?>
