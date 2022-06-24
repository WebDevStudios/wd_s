<?php
/**
 * Build a global scaffolding element.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Build a global scaffolding element.
 *
 * @author Carrie Forde
 *
 * @param array $args The array of colors or fonts.
 */
function print_global_scaffolding_section( $args = [] ) {
	// Set defaults.
	$defaults = [
		'global_type' => '', // Can be 'colors' or 'fonts'.
		'title'       => '', // Give the section a title.
		'arguments'   => [], // Use key => value pairs to pass colors or fonts.
	];

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	// Add a unique class to the wrapper.
	$class = 'scaffolding-' . str_replace( ' ', '-', strtolower( $args['title'] ) );
	?>

	<div class="scaffolding-document <?php echo esc_attr( $class ); ?>">
		<header class="scaffolding-document-header">
			<h3 class="scaffolding-document-title"><?php echo esc_html( $args['title'] ); ?></h3>
		</header>

		<div class="scaffolding-document-content">

			<?php
			// We'll alter the output slightly depending upon the global type.
			switch ( $args['global_type'] ) :
				case 'colors':
					?>

					<div class="swatch-container display-flex">

						<?php
						// Grab the array of colors.
						$colors = $args['arguments'];

						foreach ( $colors as $name => $hex ) :
							$color_var = '$color-' . str_replace( ' ', '-', strtolower( $name ) );
							?>

							<div class="swatch quarter" style="background-color: <?php echo esc_attr( $hex ); ?>;">
								<header><?php echo esc_html( $name ); ?></header>
								<footer><?php echo esc_html( $color_var ); ?></footer>
							</div><!-- .swatch -->

						<?php endforeach; ?>
					</div>

					<?php
					break;
				case 'fonts':
					?>

					<div class="font-container">

						<?php
						// Grab the array of fonts.
						$fonts = $args['arguments'];

						foreach ( $fonts as $name => $family ) :
							$font_var = '$font-' . str_replace( ' ', '-', strtolower( $name ) );
							?>

							<p><strong><?php echo esc_html( $font_var ); ?>:</strong> <span
							style="font-family: <?php echo esc_attr( $family ); ?>"><?php echo esc_html( $family ); ?></span></p>
						<?php endforeach; ?>
					</div>
					<?php
					break;
				default:
			endswitch;
			?>
		</div>
	</div>
	<?php
}
