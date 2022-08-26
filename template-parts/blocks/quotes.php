<?php
/**
 * BLOCK - Quotes
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\print_module;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_acf_fields;

$wd_s_defaults = [
	'class' => [ 'wds-block', 'wds-block-quotes' ],
];

// Set up element attributes.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_defaults );

$wd_s_quotes = get_acf_fields( [ 'quotes' ], $block['id'] );

?>

<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/build/images/block-previews/quotes.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Quotes Block', 'wd_s' ); ?>">
	</figure>
<?php elseif ( $wd_s_quotes['quotes'] ) : ?>
	<section <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php foreach ( $wd_s_quotes['quotes'] as $wd_s_quote ) : ?>
			<div class="quote">
				<?php
				print_element(
					'blockquote',
					[
						'quote' => $wd_s_quote['quote'],
						'cite'  => $wd_s_quote['cite'],
						'class' => [ 'block-content' ],
					]
				);
				?>
			</div>
		<?php endforeach; ?>
	</section>
<?php endif; ?>
