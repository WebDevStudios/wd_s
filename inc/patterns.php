<?php
/**
 * Custom Pattern Library functions.
 *
 * File for custom Pattern Library functionality.
 *
 * @package _s
 */

/**
 * Build a pattern section.
 *
 * @param array $args The pattern defaults.
 * @return string The pattern documentation.
 * @author Greg Rickaby Carrie Forde
 */
function _s_get_pattern_section( $args = array() ) {

	// Set defaults.
	$defaults = array(
		'title'        => '',       // The pattern title.
		'description'  => '',       // The pattern description.
		'usage'        => '',       // The template tag or markup needed to display the pattern.
		'parameters'   => array(),  // Does the pattern have params? Like $args?
		'arguments'    => array(),  // If the pattern has params, what are the $args?
		'output'       => '',       // Use the template tag or pattern HTML markup here. It will be sanitized displayed.
	);

	// Parse arguments.
	$args = wp_parse_args( $args, $defaults );

	// Grab our allowed tags.
	$allowed_tags = _s_pattern_allowed_html();

	// Add a unique class to the wrapper.
	$class = 'pattern-' . str_replace( ' ', '-', strtolower( $args['title'] ) );

	ob_start(); ?>

	<div class="pattern-document <?php echo esc_attr( $class ); ?>">

		<?php if ( $args['title'] ) : ?>
		<header class="pattern-document-header">
			<h2 class="pattern-document-title"><?php echo esc_html( $args['title'] ); ?></h2>
			<button type="button" class="pattern-button"><?php esc_html_e( 'Details', '_s' ); ?></button>
		</header><!-- .pattern-document-header -->
		<?php endif; ?>

		<div class="pattern-document-content">

			<div class="pattern-document-details">

			<?php if ( $args['description'] ) : ?>
				<p><strong><?php esc_html_e( 'Description', '_s' ); ?>:</strong></p>
				<p class="pattern-document-description"><?php echo esc_html( $args['description'] ); ?></p>
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

			</div><!-- .pattern-document-details -->

			<div class="pattern-document-usage">

			<?php if ( $args['usage'] ) : ?>
				<p><strong><?php esc_html_e( 'Usage', '_s' ); ?>:</strong></p>
				<pre><?php echo esc_html( $args['usage'] ); ?></pre>
			<?php endif; ?>

			<?php if ( $args['output'] ) : ?>
				<p><strong><?php esc_html_e( 'HTML Output', '_s' ); ?>:</strong></p>
				<pre><?php echo esc_html( $args['output'] ); ?></pre>
			<?php endif; ?>

			</div><!-- .pattern-document-usage -->
		</div><!-- .pattern-document-content -->

		<div class="pattern-document-live">

		<?php if ( $args['output'] ) : ?>
			<?php echo wp_kses( $args['output'], $allowed_tags ); ?>
		<?php endif; ?>

		</div><!-- .pattern-document-live -->
	</div><!-- .pattern-document -->

	<?php return ob_get_clean();
}

/**
 * Declare HTML tags allowed for patterns.
 *
 * @return array The allowed tags and attributes.
 * @author Carrie Forde
 */
function _s_pattern_allowed_html() {

	// Add additional HTML tags to the wp_kses() allowed html filter.
	$allowed_tags = array_merge( wp_kses_allowed_html( 'post' ), array(
		'svg' => array(
			'aria-hidden' => true,
			'class'       => true,
			'id'          => true,
			'role'        => true,
			'title'       => true,
		),
		'use' => array(
			'xlink:href' => true,
		),
	) );

	return $allowed_tags;
}

/**
 * Build a global pattern element.
 *
 * @param array $args The array of colors or fonts.
 * @return string The pattern documentation.
 * @author Carrie Forde
 */
function _s_get_global_pattern_section( $args = array() ) {

	// Set defaults.
	$defaults = array(
		'global_type' => '',      // Can be 'colors' or 'fonts'.
		'title'       => '',      // Give the section a title.
		'arguments'   => array(), // Use key => value pairs to pass colors or fonts.
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	// Add a unique class to the wrapper.
	$class = 'pattern-' . str_replace( ' ', '-', strtolower( $args['title'] ) );

	ob_start(); ?>

	<div class="pattern-document <?php echo esc_attr( $class ); ?>">
		<header class="pattern-document-header">
			<h2 class="pattern-document-title"><?php echo esc_html( $args['title'] ); ?></h2>
		</header>

		<div class="pattern-document-content">

			<?php // We'll alter the output slightly depending upon the global type.
			switch ( $args['global_type'] ) :

				case 'colors' : ?>

					<div class="swatch-container">

					<?php // Grab the array of colors.
					$colors = $args['arguments'];

					foreach ( $colors as $name => $hex ) :
						$color_var = '$color-' . str_replace( ' ', '-', strtolower( $name ) ); ?>

						<div class="swatch" style="background-color: <?php echo esc_attr( $hex ); ?>;">
							<header><?php echo esc_html( $name ); ?></header>
							<footer><?php echo esc_html( $color_var ); ?></footer>
						</div><!-- .swatch -->

					<?php endforeach; ?>
					</div>
					<?php break;

				case 'fonts' : ?>

					<div class="font-container">

					<?php // Grab the array of fonts.
					$fonts = $args['arguments'];

					foreach ( $fonts as $name => $family ) :
						$font_var = '$font-' . str_replace( ' ', '-', strtolower( $name ) ); ?>

						<p><strong><?php echo esc_html( $font_var ); ?>:</strong> <span style="font-family: <?php echo esc_attr( $family ); ?>"><?php echo esc_html( $family ); ?></span></p>
					<?php endforeach; ?>
					</div>
					<?php break; ?>
			<?php endswitch; ?>
		</div>
	</div>

	<?php return ob_get_clean();
}

/**
 * Hook the theme's pattern template parts into the Pattern template.
 *
 * @author Carrie Forde
 */
function _s_hook_theme_patterns() {

	$template_dir = 'template-parts/patterns/pattern';

	get_template_part( $template_dir, 'globals' );
	get_template_part( $template_dir, 'typography' );
	get_template_part( $template_dir, 'icons' );
	get_template_part( $template_dir, 'buttons' );
	get_template_part( $template_dir, 'forms' );
}
add_action( '_s_pattern_content', '_s_hook_theme_patterns' );
