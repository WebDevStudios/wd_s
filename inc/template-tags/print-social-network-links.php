<?php
/**
 * Display the social links saved in the customizer.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Display the social links saved in the customizer.
 *
 * @author WebDevStudios
 */
function print_social_network_links() {
	// Create an array of our social links for ease of setup.
	// Change the order of the networks in this array to change the output order.
	$social_networks = [
		'facebook',
		'instagram',
		'linkedin',
		'twitter',
	];

	?>
	<ul class="flex social-icons menu">
		<?php
		// Loop through our network array.
		foreach ( $social_networks as $network ) :

			// Look for the social network's URL.
			$network_url = get_theme_mod( 'wd_s_' . $network . '_link' );

			// Only display the list item if a URL is set.
			if ( ! empty( $network_url ) ) :
				?>
				<li class="social-icon <?php echo esc_attr( $network ); ?> mr-2">
					<a href="<?php echo esc_url( $network_url ); ?>">
						<?php
						print_svg(
							[
								'icon'   => $network . '-square',
								'width'  => '24',
								'height' => '24',
							]
						);
						?>
						<span class="screen-reader-text">
						<?php
						/* translators: the social network name */
						printf( esc_attr__( 'Link to %s', 'wd_s' ), ucwords( esc_html( $network ) ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- XSS OK.
						?>
						</span>
					</a>
				</li><!-- .social-icon -->
				<?php
			endif;
		endforeach;
		?>
	</ul><!-- .social-icons -->
	<?php
}
