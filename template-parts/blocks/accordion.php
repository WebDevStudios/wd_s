<?php
/**
 * BLOCK - Renders an Accordion
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_element;
use function WebDevStudios\wd_s\print_module;
use function WebDevStudios\wd_s\get_acf_fields;
use function WebDevStudios\wd_s\get_formatted_atts;

$abs_defaults = [
	'class' => [ 'abs-block', 'abs-block-accordion' ],
];

// Set up element attributes.
$abs_atts = get_formatted_atts( [ 'class' ], $abs_defaults );

$abs_accordion = get_acf_fields( [ 'block_heading', 'block_content', 'accordion_items' ], $block['id'] );
?>
<?php if ( ! empty( $block['data']['_is_preview'] ) ) : ?>
	<figure>
		<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/build/images/block-previews/accordion-preview.jpg' ); ?>" alt="<?php esc_html_e( 'Preview of the Accordion Block', 'wd_s' ); ?>">
	</figure>
<?php elseif ( $abs_accordion['accordion_items']['items'] ) : ?>
	<section <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php
		if ( $abs_accordion['block_heading'] ) :
			print_element(
				'heading',
				[
					'text'  => $abs_accordion['block_heading'],
					'class' => [ 'block-heading' ],
				]
			);
		endif;

		if ( $abs_accordion['block_content'] ) :
			print_element(
				'content',
				[
					'content' => $abs_accordion['block_content'],
					'class'   => [ 'block-content' ],
				]
			);
		endif;

		print_module( 'accordion', $abs_accordion['accordion_items'] );
		?>
	</section>
<?php endif; ?>
