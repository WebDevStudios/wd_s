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

// Start a <container> with possible block options.
_s_display_block_options(
	array(
		'container' => 'section', // Any HTML5 container: section, div, etc...
		'class'     => 'content-block grid-container accordion', // Container class.
	)
);
?>
	<div class="grid-x<?php echo esc_attr( $animation_class ); ?>">
		<div class="cell">
			<?php if ( $title ) : ?>
				<h2 class="cta-title"><?php echo esc_html( $title ); ?></h2>
			<?php endif; ?>

			<?php if ( $text ) : ?>
				<?php echo wp_kses_post( $text ); ?>
			<?php endif; ?>
		</div>

		<?php if ( $accordion_items ) : ?>
			<div class="cell">
				<?php
				$count = 0;
				while ( have_rows( 'accordion_items' ) ) :
					the_row();

					$count++;
					$item_title   = get_sub_field( 'accordion_title' );
					$item_content = get_sub_field( 'accordion_text' );
					?>
					<div class="accordion-item">
						<div class="item-header">
							<h3 class="item-title"><?php echo esc_html( $item_title ); ?></h3>
							<button class="item-toggle"><span>+</span></button>
						</div><!-- .item-header-->
						<div id="<?php echo esc_attr( 'accordion-item-' . $count ); ?>" class="item-content">
							<div class="item-content-inner">
								<?php echo wp_kses_post( $item_content ); ?>
							</div><!-- .item-content-inner -->
						</div><!-- .item-content -->
					</div>
				<?php endwhile; ?>
			</div>
		<?php endif; ?>
	</div><!-- .grid-x -->
</section><!-- .accordion -->
