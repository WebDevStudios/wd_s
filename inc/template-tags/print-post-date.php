<?php
/**
 * Custom template tags for this theme.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Prints HTML with date information for the current post.
 *
 * @author WebDevStudios
 *
 * @param array $args Configuration args.
 */
function print_post_date( $args = [] ) {

	// Set defaults.
	$defaults = [
		'date_text'   => esc_html__( 'Posted on', 'wd_s' ),
		'date_format' => get_option( 'date_format' ),
	];

	// Parse args.
	$args = wp_parse_args( $args, $defaults );
	?>
	<span class="posted-on">
		<?php echo esc_html( $args['date_text'] . ' ' ); ?>
		<a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark"><time class="entry-date published" datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_time( $args['date_format'] ) ); ?></time></a>
	</span>
	<?php
}
