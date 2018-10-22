<?php
/**
 * The template used for displaying an accordion block.
 *
 * @package _s
 */

// Set up fields.
$title           = get_sub_field( 'title' );
$text            = get_sub_field( 'text' );
$accordion_items = get_sub_field( 'accordion_items' );
$animation_class = _s_get_animation_class();
$row_index       = get_row_index();

// Start a <container> with possible block options.
_s_display_block_options(
	array(
		'container' => 'section', // Any HTML5 container: section, div, etc...
		'class'     => 'content-block grid-container accordion-block', // Container class.
	)
);
?>
	<div class="grid-x<?php echo esc_attr( $animation_class ); ?>">
		<div class="cell">
			<?php if ( $title ) : ?>
				<h2 class="block-title"><?php echo esc_html( $title ); ?></h2>
			<?php endif; ?>

			<?php if ( $text ) : ?>
				<?php echo wp_kses_post( $text ); ?>
			<?php endif; ?>
		</div>

		<?php if ( $accordion_items ) : ?>
			<div class="cell accordion">
				<?php
				$count = 0;
				while ( have_rows( 'accordion_items' ) ) :
					the_row();

					$count++;
					$item_title   = get_sub_field( 'accordion_title' );
					$item_content = get_sub_field( 'accordion_text' );
					?>
					<div class="accordion-item">
						<div class="accordion-item-header">
							<h3 class="accordion-item-title"><?php echo esc_html( $item_title ); ?></h3>
							<button class="accordion-item-toggle">
								<span class="screen-reader-text"><?php esc_html_e( 'Toggle Accordion Item Content', '_s' ); ?></span>
								<span class="accordion-item-toggle-icon" aria-hidden="true">+</span>
							</button>
						</div><!-- .accordion-item-header-->
						<div id="<?php echo esc_attr( 'accordion-' . intval( $row_index ) . '-item-' . $count ); ?>" class="accordion-item-content">
							<?php echo wp_kses_post( $item_content ); ?>
						</div><!-- .accordion-item-content -->
					</div>
				<?php endwhile; ?>
			</div>
		<?php endif; ?>
	</div><!-- .grid-x -->
</section><!-- .accordion-block -->
