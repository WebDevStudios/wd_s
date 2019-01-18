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
_s_display_block_options( array(
	'container' => 'section', // Any HTML5 container: section, div, etc...
	'class'     => 'content-block accordion-block', // Container class.
) );
?>
	<div class="<?php echo esc_attr( $animation_class ); ?>">
		<div class="container">
			<?php if ( $title ) : ?>
				<h2 class="block-title"><?php echo esc_html( $title ); ?></h2>
			<?php endif; ?>

			<?php if ( $text ) : ?>
				<?php echo wp_kses_post( $text ); ?>
			<?php endif; ?>
		</div>

		<?php if ( $accordion_items ) : ?>
			<div class="container accordion" aria-label="<?php esc_attr_e( 'Accordion Content Block', '_s' ); ?>">
				<?php
				$count = 0;
				while ( have_rows( 'accordion_items' ) ) :
						the_row();

						$count++;
						$item_title      = get_sub_field( 'accordion_title' );
						$item_content    = get_sub_field( 'accordion_text' );
						$item_content_id = 'accordion-' . intval( $row_index ) . '-item-' . intval( $count );
						?>
						<div class="accordion-item">
							<div class="accordion-item-header">
								<h3 class="accordion-item-title"><?php echo esc_html( $item_title ); ?>
									<button class="accordion-item-toggle" aria-expanded="false" aria-controls="<?php echo esc_attr( $item_content_id ); ?>">
										<span class="screen-reader-text"><?php echo sprintf( esc_html( 'Toggle %s', '_s' ), esc_html( $item_title ) ); ?></span>
										<span class="accordion-item-toggle-icon" aria-hidden="true">+</span>
									</button>
								</h3>
							</div><!-- .accordion-item-header-->
							<div id="<?php echo esc_attr( $item_content_id ); ?>" class="accordion-item-content" aria-hidden="true">
								<?php echo _s_get_the_content( $item_content ); // phpcs: xss: ok. ?>
							</div><!-- .accordion-item-content -->
						</div>
				<?php endwhile; ?>
			</div><!-- .container -->
		<?php endif; ?>
	</div><!-- .container -->
</section><!-- .accordion-block -->
