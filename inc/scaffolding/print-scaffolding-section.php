<?php
/**
 * Build a scaffolding section.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Build a scaffolding section.
 *
 * @author Greg Rickaby, Carrie Forde
 *
 * @param array $args The scaffolding defaults.
 */
function print_scaffolding_section( $args = [] ) {
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

	<div class="scaffolding-document tabs <?php echo esc_attr( $class ); ?>">

		<div class="tab">
			<?php if ( $args['title'] ) : ?>
				<input type="checkbox" class="tab-toggle" id="<?php echo esc_attr( 'tab-' . $args['title'] ); ?>">
				<label class="scaffolding-document-title tab-label" for="<?php echo esc_attr( 'tab-' . $args['title'] ); ?>"><?php echo esc_html( $args['title'] ); ?></label>
			<?php endif; ?>


			<div class="scaffolding-document-content tab-content">

				<div class="scaffolding-document-details">

				<?php if ( $args['description'] ) : ?>
					<p><strong><?php esc_html_e( 'Description', 'wd_s' ); ?>:</strong></p>
					<p class="scaffolding-document-description"><?php echo esc_html( $args['description'] ); ?></p>
				<?php endif; ?>

				<?php if ( $args['parameters'] ) : ?>
					<p><strong><?php esc_html_e( 'Parameters', 'wd_s' ); ?>:</strong></p>
					<?php foreach ( $args['parameters'] as $key => $value ) : ?>
						<p><code><?php echo esc_html( $key ); ?></code> <?php echo esc_html( $value ); ?></p>
					<?php endforeach; ?>
				<?php endif; ?>

				<?php if ( $args['arguments'] ) : ?>
					<p><strong><?php esc_html_e( 'Arguments', 'wd_s' ); ?>:</strong></p>
					<?php foreach ( $args['arguments'] as $key => $value ) : ?>
						<p><code><?php echo esc_html( $key ); ?></code> <?php echo esc_html( $value ); ?></p>
					<?php endforeach; ?>
				<?php endif; ?>

				</div><!-- .scaffolding-document-details -->

				<div class="scaffolding-document-usage">

				<?php if ( $args['usage'] ) : ?>
					<p><strong><?php esc_html_e( 'Usage', 'wd_s' ); ?>:</strong></p>
					<pre><?php echo esc_html( $args['usage'] ); ?></pre>
				<?php endif; ?>

				<?php if ( $args['output'] ) : ?>
					<p><strong><?php esc_html_e( 'HTML Output', 'wd_s' ); ?>:</strong></p>
					<pre><?php echo esc_html( $args['output'] ); ?></pre>
				<?php endif; ?>

				</div><!-- .scaffolding-document-usage -->
			</div><!-- .scaffolding-document-content -->
		</div><!-- .tab -->

		<div class="scaffolding-document-live">

			<?php if ( $args['output'] ) : ?>
				<?php echo do_shortcode( wp_kses( $args['output'], $allowed_tags ) ); ?>
			<?php endif; ?>

		</div><!-- .scaffolding-document-live -->
	</div><!-- .scaffolding-document -->

	<?php
}
