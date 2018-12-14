<?php
/**
 * The template used for displaying a CTA block.
 *
 * @package _s
 */

// Set up fields.
$title           = get_sub_field( 'title' );
$text            = get_sub_field( 'text' );
$button_url      = get_sub_field( 'button_url' );
$button_text     = get_sub_field( 'button_text' );
$animation_class = _s_get_animation_class();

// Start a <container> with possible block options.
_s_display_block_options( array(
	'container' => 'aside', // Any HTML5 container: section, div, etc...
	'class'     => 'content-block cta-block', // Container class.
) );
?>
	<div class="container display-flex align-center <?php echo esc_attr( $animation_class ); ?>">
		<header>
			<?php if ( $title ) : ?>
				<h1 class="cta-title"><?php echo esc_html( $title ); ?></h1>
			<?php endif; ?>

			<?php if ( $text ) : ?>
				<h2 class="cta-text"><?php echo esc_html( $text ); ?></h2>
			<?php endif; ?>
		</header>

		<?php if ( $button_url && $button_text ) : ?>
			<a class="button cta-button" href="<?php echo esc_url( $button_url ); ?>"><?php echo esc_html( $button_text ); ?></a>
		<?php endif; ?>
	</div><!-- .container -->
</aside><!-- .cta-block -->
