<?php
/**
 * BLOCK - Quotes
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package ABS
 */

use function abs\functions\render_element;
use function abs\functions\render_module;
use function abs\functions\return_formatted_atts;
use function abs\functions\return_acf_fields;

$abs_defaults = [
	'class' => [ 'abs-block', 'abs-block-quotes' ],
];

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class' ], $abs_defaults );

$abs_quotes = return_acf_fields( [ 'quotes' ], $block['id'] );

?>

<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/build/images/block-previews/quotes.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Quotes Block', 'abs' ); ?>">
	</figure>
<?php elseif ( $abs_quotes['quotes'] ) : ?>
	<section <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php foreach ( $abs_quotes['quotes'] as $abs_quote ) : ?>
			<div class="quote">
				<?php
				render_element(
					'blockquote',
					[
						'quote' => $abs_quote['quote'],
						'cite'  => $abs_quote['cite'],
						'class' => [ 'block-content' ],
					]
				);
				?>
			</div>
		<?php endforeach; ?>
	</section>
<?php endif; ?>
