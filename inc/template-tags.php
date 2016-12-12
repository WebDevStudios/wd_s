<?php
/**
 * Custom template tags for this theme.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package _s
 */

if ( ! function_exists( '_s_posted_on' ) ) :
	/**
	 * Prints HTML with meta information for the current post-date/time and author.
	 */
	function _s_posted_on() {
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
		}

		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);

		$posted_on = sprintf(
			esc_html_x( 'Posted on %s', 'post date', '_s' ),
			'<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>'
		);

		$byline = sprintf(
			esc_html_x( 'by %s', 'post author', '_s' ),
			'<span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a></span>'
		);

		echo '<span class="posted-on">' . $posted_on . '</span><span class="byline"> ' . $byline . '</span>'; // WPCS: XSS OK.

	}
endif;

if ( ! function_exists( '_s_entry_footer' ) ) :
	/**
	 * Prints HTML with meta information for the categories, tags and comments.
	 */
	function _s_entry_footer() {
		// Hide category and tag text for pages.
		if ( 'post' === get_post_type() ) {
			/* translators: used between list items, there is a space after the comma */
			$categories_list = get_the_category_list( esc_html__( ', ', '_s' ) );
			if ( $categories_list && _s_categorized_blog() ) {
				printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', '_s' ) . '</span>', $categories_list ); // WPCS: XSS OK.
			}

			/* translators: used between list items, there is a space after the comma */
			$tags_list = get_the_tag_list( '', esc_html__( ', ', '_s' ) );
			if ( $tags_list ) {
				printf( '<span class="tags-links">' . esc_html__( 'Tagged %1$s', '_s' ) . '</span>', $tags_list ); // WPCS: XSS OK.
			}
		}

		if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
			echo '<span class="comments-link">';
			comments_popup_link( esc_html__( 'Leave a comment', '_s' ), esc_html__( '1 Comment', '_s' ), esc_html__( '% Comments', '_s' ) );
			echo '</span>';
		}

		edit_post_link(
			sprintf(
				/* translators: %s: Name of current post */
				esc_html__( 'Edit %s', '_s' ),
				the_title( '<span class="screen-reader-text">"', '"</span>', false )
			),
			'<span class="edit-link">',
			'</span>'
		);
	}
endif;

/**
 * Return SVG markup.
 *
 * @param  array  $args {
 *     Parameters needed to display an SVG.
 *
 *     @param string $icon Required. Use the icon filename, e.g. "facebook-square".
 *     @param string $title Optional. SVG title, e.g. "Facebook".
 *     @param string $desc Optional. SVG description, e.g. "Share this post on Facebook".
 * }
 * @return string SVG markup.
 */
function _s_get_svg( $args = array() ) {

	// Make sure $args are an array.
	if ( empty( $args ) ) {
		return esc_html__( 'Please define default parameters in the form of an array.', '_s' );
	}

	// Define an icon.
	if ( false === array_key_exists( 'icon', $args ) ) {
		return esc_html__( 'Please define an SVG icon filename.', '_s' );
	}

	// Set defaults.
	$defaults = array(
		'icon'  => '',
		'title' => '',
		'desc'  => '',
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	// Figure out which title to use.
	$title = ( $args['title'] ) ? $args['title'] : $args['icon'];

	// Set aria hidden.
	$aria_hidden = ' aria-hidden="true"';

	// Set ARIA.
	$aria_labelledby = '';
	if ( $args['title'] && $args['desc'] ) {
		$aria_labelledby = ' aria-labelledby="title-ID desc-ID"';
		$aria_hidden = '';
	}

	// Begin SVG markup.
	$svg = '<svg class="icon icon-' . esc_attr( $args['icon'] ) . '"' . $aria_hidden . $aria_labelledby . ' role="img">';

	// Add title markup.
	$svg .= '<title>' . esc_html( $title ) . '</title>';

	// If there is a description, display it.
	if ( $args['desc'] ) {
		$svg .= '<desc>' . esc_html( $args['desc'] ) . '</desc>';
	}

	// Use absolute path in the Customizer so that icons show up in there.
	if ( is_customize_preview() ) {
		$svg .= '<use xlink:href="' . get_parent_theme_file_uri( '/assets/images/svg-icons.svg#icon-' . esc_html( $args['icon'] ) ) . '"></use>';
	} else {
		$svg .= '<use xlink:href="#icon-' . esc_html( $args['icon'] ) . '"></use>';
	}

	$svg .= '</svg>';

	return $svg;
}

/**
 * Trim the title length.
 *
 * @param array $args Parameters include length and more.
 * @return string        The shortened excerpt.
 */
function _s_get_the_title( $args = array() ) {

	// Set defaults.
	$defaults = array(
		'length'  => 12,
		'more'    => '...',
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	// Trim the title.
	return wp_trim_words( get_the_title( get_the_ID() ), $args['length'], $args['more'] );
}

/**
 * Customize "Read More" string on <!-- more --> with the_content();
 */
function _s_content_more_link() {
	return ' <a class="more-link" href="' . get_permalink() . '">' . esc_html__( 'Read More', '_s' ) . '...</a>';
}
add_filter( 'the_content_more_link', '_s_content_more_link' );

/**
 * Customize the [...] on the_excerpt();
 *
 * @param string $more The current $more string.
 * @return string Replace with "Read More..."
 */
function _s_excerpt_more( $more ) {
	return sprintf( ' <a class="more-link" href="%1$s">%2$s</a>', get_permalink( get_the_ID() ), esc_html__( 'Read more...', '_s' ) );
}
add_filter( 'excerpt_more', '_s_excerpt_more' );

/**
 * Limit the excerpt length.
 *
 * @param array $args Parameters include length and more.
 * @return string The shortened excerpt.
 */
function _s_get_the_excerpt( $args = array() ) {

	// Set defaults.
	$defaults = array(
		'length' => 20,
		'more'   => '...',
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	// Trim the excerpt.
	return wp_trim_words( get_the_excerpt(), absint( $args['length'] ), esc_html( $args['more'] ) );
}

/**
 * Echo an image, no matter what.
 *
 * @param string $size The image size you want to display.
 */
function _s_get_post_image( $size = 'thumbnail' ) {

	// If featured image is present, use that.
	if ( has_post_thumbnail() ) {
		return the_post_thumbnail( $size );
	}

	// Check for any attached image.
	$media = get_attached_media( 'image', get_the_ID() );
	$media = current( $media );

	// Set up default image path.
	$media_url = get_stylesheet_directory_uri() . '/assets/images/placeholder.png';

	// If an image is present, then use it.
	if ( is_array( $media ) && 0 < count( $media ) ) {
		$media_url = ( 'thumbnail' === $size ) ? wp_get_attachment_thumb_url( $media->ID ) : wp_get_attachment_url( $media->ID );
	}

	// Start the markup.
	ob_start(); ?>

	<img src="<?php echo esc_url( $media_url ); ?>" class="attachment-thumbnail wp-post-image" alt="<?php echo esc_html( get_the_title() ); ?>"/>

	<?php
	return ob_get_clean();
}

/**
 * Return an image URI, no matter what.
 *
 * @param  string $size The image size you want to return.
 * @return string The image URI.
 */
function _s_get_post_image_uri( $size = 'thumbnail' ) {

	// If featured image is present, use that.
	if ( has_post_thumbnail() ) {

		$featured_image_id = get_post_thumbnail_id( get_the_ID() );
		$media = wp_get_attachment_image_src( $featured_image_id, $size );

		if ( is_array( $media ) ) {
			return current( $media );
		}
	}

	// Check for any attached image.
	$media = get_attached_media( 'image', get_the_ID() );
	$media = current( $media );

	// Set up default image path.
	$media_url = get_stylesheet_directory_uri() . '/assets/images/placeholder.png';

	// If an image is present, then use it.
	if ( is_array( $media ) && 0 < count( $media ) ) {
		$media_url = ( 'thumbnail' === $size ) ? wp_get_attachment_thumb_url( $media->ID ) : wp_get_attachment_url( $media->ID );
	}

	return $media_url;
}

/**
 * Echo the copyright text saved in the Customizer.
 */
function _s_get_copyright_text() {

	// Grab our customizer settings.
	$copyright_text = get_theme_mod( '_s_copyright_text' );

	// Stop if there's nothing to display.
	if ( ! $copyright_text ) {
		return false;
	}

	// Echo the text.
	echo '<span class="copyright-text">' . wp_kses_post( $copyright_text ) . '</span>';
}

/**
 * Build social sharing icons.
 *
 * @return string
 */
function _s_get_social_share() {

	// Build the sharing URLs.
	$twitter_url  = 'https://twitter.com/share?text=' . rawurlencode( html_entity_decode( get_the_title() ) ) . '&amp;url=' . rawurlencode( get_the_permalink() );
	$facebook_url = 'https://www.facebook.com/sharer/sharer.php?u=' . rawurlencode( get_the_permalink() );
	$linkedin_url = 'https://www.linkedin.com/shareArticle?title=' . rawurlencode( html_entity_decode( get_the_title() ) ) . '&amp;url=' . rawurlencode( get_the_permalink() );

	// Start the markup.
	ob_start(); ?>
	<div class="social-share">
		<h5 class="social-share-title"><?php esc_html_e( 'Share This', '_s' ); ?></h5>
		<ul class="social-icons menu menu-horizontal">
			<li class="social-icon">
				<a href="<?php echo esc_url( $twitter_url ); ?>" onclick="window.open(this.href, 'targetWindow', 'toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, top=150, left=0, width=600, height=300' ); return false;">
					<?php echo _s_get_svg( array( 'icon' => 'twitter-square', 'title' => 'Twitter', 'desc' => __( 'Share on Twitter', '_s' ) ) ); // WPCS: XSS ok. ?>
					<span class="screen-reader-text"><?php esc_html_e( 'Share on Twitter', '_s' ); ?></span>
				</a>
			</li>
			<li class="social-icon">
				<a href="<?php echo esc_url( $facebook_url ); ?>" onclick="window.open(this.href, 'targetWindow', 'toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, top=150, left=0, width=600, height=300' ); return false;">
					<?php echo _s_get_svg( array( 'icon' => 'facebook-square', 'title' => 'Facebook', 'desc' => __( 'Share on Facebook', '_s' ) ) ); // WPCS: XSS ok. ?>
					<span class="screen-reader-text"><?php esc_html_e( 'Share on Facebook', '_s' ); ?></span>
				</a>
			</li>
			<li class="social-icon">
				<a href="<?php echo esc_url( $linkedin_url ); ?>" onclick="window.open(this.href, 'targetWindow', 'toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, top=150, left=0, width=475, height=505' ); return false;">
					<?php echo _s_get_svg( array( 'icon' => 'linkedin-square', 'title' => 'LinkedIn', 'desc' => __( 'Share on LinkedIn', '_s' ) ) ); // WPCS: XSS ok. ?>
					<span class="screen-reader-text"><?php esc_html_e( 'Share on LinkedIn', '_s' ); ?></span>
				</a>
			</li>
		</ul>
	</div><!-- .social-share -->

	<?php
	return ob_get_clean();
}

/**
 * Output the mobile navigation
 */
function _s_get_mobile_navigation_menu() {

	// Figure out which menu we're pulling.
	$mobile_menu = has_nav_menu( 'mobile' ) ? 'mobile' : 'primary';

	// Start the markup.
	ob_start();
	?>

	<nav id="mobile-menu" class="mobile-nav-menu">
		<button class="close-mobile-menu"><span class="screen-reader-text"><?php echo esc_html_e( 'Close menu', '_s' ); ?></span><?php echo _s_get_svg( array( 'icon' => 'close' ) ); // WPCS: XSS ok. ?></button>
		<?php
			wp_nav_menu( array(
				'theme_location' => $mobile_menu,
				'menu_id'        => 'primary-menu',
				'menu_class'     => 'menu dropdown mobile-nav',
				'link_before'    => '<span>',
				'link_after'     => '</span>',
			) );
		?>
	</nav>
	<?php
	return ob_get_clean();
}

/**
 * Retrieve the social links saved in the customizer
 *
 * @return mixed HTML output of social links
 */
function _s_get_social_network_links() {

	// Create an array of our social links for ease of setup.
	// Change the order of the networks in this array to change the output order.
	$social_networks = array( 'facebook', 'googleplus', 'instagram', 'linkedin', 'twitter' );

	// Kickoff our output buffer.
	ob_start(); ?>

	<ul class="social-icons">
	<?php
	// Loop through our network array.
	foreach ( $social_networks as $network ) :

		// Look for the social network's URL.
		$network_url = get_theme_mod( '_s_' . $network . '_link' );

		// Only display the list item if a URL is set.
		if ( isset( $network_url ) && ! empty( $network_url ) ) : ?>
			<li class="social-icon <?php echo esc_attr( $network ); ?>">
				<a href="<?php echo esc_url( $network_url ); ?>">
					<?php echo _s_get_svg( array( 'icon' => $network . '-square', 'title' => sprintf( __( 'Link to %s', '_s' ), ucwords( esc_html( $network ) ) ) ) ); // WPCS: XSS ok. ?>
					<span class="screen-reader-text"><?php echo sprintf( __( 'Link to %s', '_s' ), ucwords( esc_html( $network ) ) ); // WPCS: XSS ok. ?></span>
				</a>
			</li><!-- .social-icon -->
		<?php endif;
	endforeach; ?>
	</ul><!-- .social-icons -->

	<?php
	return ob_get_clean();
}
