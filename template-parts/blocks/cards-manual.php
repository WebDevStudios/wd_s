<?php
/**
 * BLOCK - Renders 3 card modules
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
	'class' => [ 'abs-block', 'abs-block-cards' ],
];

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class' ], $abs_defaults );

$abs_cards = return_acf_fields( [ 'block_heading', 'block_content', 'card' ], $block['id'] );

?>

<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/build/images/block-previews/cards-manual-preview.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Manual Cards Block', 'abs' ); ?>">
	</figure>
<?php elseif ( $abs_cards['card'] ) : ?>
	<section <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		render_element(
			'heading',
			[
				'text'  => $abs_cards['block_heading'],
				'class' => [ 'block-heading' ],
			]
		);

		render_element(
			'content',
			[
				'content' => $abs_cards['block_content'],
				'class'   => [ 'block-content' ],
			]
		);
		?>
		<section class='card-wrap'>
			<?php
			foreach ( $abs_cards['card'] as $abs_card ) :
				render_module(
					'card',
					$abs_card
				);
			endforeach;
			?>
		</section>
	</section>
<?php endif; ?>
