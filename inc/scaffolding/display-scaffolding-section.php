<?php
/**
 * Build a scaffolding section.
 *
 * @package _s
 */

namespace WD_S\Scaffolding;

/**
 * Build a scaffolding section.
 *
 * @author Greg Rickaby, Carrie Forde
 *
 * @param array $args The scaffolding defaults.
 */
function display_scaffolding_section( $args = [] ) {
	// Set defaults.
	$defaults = [
		'title'       => '', // The scaffolding title.
		'description' => '', // The scaffolding description.
		'usage'       => '', // The template tag or markup needed to display the scaffolding.
		'parameters'  => [], // Does the scaffolding have params? Like $args?
		'arguments'   => [], // If the scaffolding has params, what are the $args?
		'output'      => '', // Use the template tag or scaffolding HTML markup here. It will be sanitized displayed.
	];

	// Parse arguments.
	$args = wp_parse_args( $args, $defaults );

	// Grab our allowed tags.
	$allowed_tags = scaffolding_allowed_html();

	// Add a unique class to the wrapper.
	$class = 'scaffolding-' . str_replace( ' ', '-', strtolower( $args['title'] ) ); ?>

	<div class="scaffolding-document accordion <?php echo esc_attr( $class ); ?>">

		<div class="accordion-item">
			<?php if ( $args['title'] ) : ?>
			<header class="scaffolding-document-header display-flex flex-start space-between accordion-item-header">
				<h3 class="scaffolding-document-title accordion-item-title"><?php echo esc_html( $args['title'] ); ?></h3>
				<button type="button" class="scaffolding-button"><?php esc_html_e( 'Details', '_s' ); ?></button>
			</header><!-- .scaffolding-document-header -->
			<?php endif; ?>

			<div class="scaffolding-document-content accordion-item-content">

				<div class="scaffolding-document-details">

				<?php if ( $args['description'] ) : ?>
					<p><strong><?php esc_html_e( 'Description', '_s' ); ?>:</strong></p>
					<p class="scaffolding-document-description"><?php echo esc_html( $args['description'] ); ?></p>
				<?php endif; ?>

				<?php if ( $args['parameters'] ) : ?>
					<p><strong><?php esc_html_e( 'Parameters', '_s' ); ?>:</strong></p>
					<?php foreach ( $args['parameters'] as $key => $value ) : ?>
						<p><code><?php echo esc_html( $key ); ?></code> <?php echo esc_html( $value ); ?></p>
					<?php endforeach; ?>
				<?php endif; ?>

				<?php if ( $args['arguments'] ) : ?>
					<p><strong><?php esc_html_e( 'Arguments', '_s' ); ?>:</strong></p>
					<?php foreach ( $args['arguments'] as $key => $value ) : ?>
						<p><code><?php echo esc_html( $key ); ?></code> <?php echo esc_html( $value ); ?></p>
					<?php endforeach; ?>
				<?php endif; ?>

				</div><!-- .scaffolding-document-details -->

				<div class="scaffolding-document-usage">

				<?php if ( $args['usage'] ) : ?>
					<p><strong><?php esc_html_e( 'Usage', '_s' ); ?>:</strong></p>
					<pre><?php echo esc_html( $args['usage'] ); ?></pre>
				<?php endif; ?>

				<?php if ( $args['output'] ) : ?>
					<p><strong><?php esc_html_e( 'HTML Output', '_s' ); ?>:</strong></p>
					<pre><?php echo esc_html( $args['output'] ); ?></pre>
				<?php endif; ?>

				</div><!-- .scaffolding-document-usage -->
			</div><!-- .scaffolding-document-content -->
		</div>

		<div class="scaffolding-document-live">

		<?php if ( $args['output'] ) : ?>
			<?php echo do_shortcode( wp_kses( $args['output'], $allowed_tags ) ); ?>
		<?php endif; ?>

		</div><!-- .scaffolding-document-live -->
	</div><!-- .scaffolding-document -->

	<?php
}
