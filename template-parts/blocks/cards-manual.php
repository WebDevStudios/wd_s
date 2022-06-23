<?php
/**
 * BLOCK - Renders 3 card modules
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\print_module;
use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\return_acf_fields;

$abs_defaults = [
	'class' => [ 'abs-block', 'abs-block-cards' ],
];

// Set up element attributes.
$abs_atts = get_formatted_atts( [ 'class' ], $abs_defaults );

$abs_cards = return_acf_fields( [ 'block_heading', 'block_content', 'card' ], $block['id'] );

?>

<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/build/images/block-previews/cards-manual-preview.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Manual Cards Block', 'wd_s' ); ?>">
	</figure>
<?php elseif ( $abs_cards['card'] ) : ?>
	<section <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		print_element(
			'heading',
			[
				'text'  => $abs_cards['block_heading'],
				'class' => [ 'block-heading' ],
			]
		);

		print_element(
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
				print_module(
					'card',
					$abs_card
				);
			endforeach;
			?>
		</section>
	</section>
<?php endif; ?>
