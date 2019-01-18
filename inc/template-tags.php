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

		$time_string = sprintf(
			$time_string,
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);

		$posted_on = sprintf(
			/* translators: the date the post was published */
			esc_html_x( 'Posted on %s', 'post date', '_s' ),
			'<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>'
		);

		$byline = sprintf(
			/* translators: the post author */
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
				/* translators: the post category */
				printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', '_s' ) . '</span>', $categories_list ); // WPCS: XSS OK.
			}

			/* translators: used between list items, there is a space after the comma */
			$tags_list = get_the_tag_list( '', esc_html__( ', ', '_s' ) );
			if ( $tags_list ) {
				/* translators: the post tags */
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
 * Display SVG Markup.
 *
 * @param array $args The parameters needed to get the SVG.
 */
function _s_display_svg( $args = array() ) {
	echo _s_get_svg( $args ); // WPCS XSS Ok.
}

/**
 * Return SVG markup.
 *
 * @param array $args The parameters needed to display the SVG.
 * @return string
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
		'icon'   => '',
		'title'  => '',
		'desc'   => '',
		'fill'   => '',
		'height' => '',
		'width'  => '',
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	// Figure out which title to use.
	$title = ( $args['title'] ) ? $args['title'] : $args['icon'];

	// Generate random IDs for the title and description.
	$random_number = rand( 0, 99999 );
	$title_id      = 'title-' . sanitize_title( $title ) . '-' . $random_number;
	$desc_id       = 'desc-' . sanitize_title( $title ) . '-' . $random_number;

	// Set ARIA.
	$aria_hidden     = ' aria-hidden="true"';
	$aria_labelledby = '';

	if ( $args['title'] && $args['desc'] ) {
		$aria_labelledby = ' aria-labelledby="' . $title_id . ' ' . $desc_id . '"';
		$aria_hidden     = '';
	}

	// Set SVG parameters.
	$fill   = ( $args['fill'] ) ? ' fill="' . $args['fill'] . '"' : '';
	$height = ( $args['height'] ) ? ' height="' . $args['height'] . '"' : '';
	$width  = ( $args['width'] ) ? ' width="' . $args['width'] . '"' : '';

	// Start a buffer...
	ob_start();
	?>

	<svg
	<?php
		echo _s_get_the_content( $height ); // WPCS XSS OK.
		echo _s_get_the_content( $width ); // WPCS XSS OK.
		echo _s_get_the_content( $fill ); // WPCS XSS OK.
	?>
		class="icon icon-<?php echo esc_attr( $args['icon'] ); ?>"
	<?php
		echo _s_get_the_content( $aria_hidden ); // WPCS XSS OK.
		echo _s_get_the_content( $aria_labelledby ); // WPCS XSS OK.
	?>
		role="img">
		<title id="<?php echo esc_attr( $title_id ); ?>">
			<?php echo esc_html( $title ); ?>
		</title>

		<?php
		// Display description if available.
		if ( $args['desc'] ) :
		?>
			<desc id="<?php echo esc_attr( $desc_id ); ?>">
				<?php echo esc_html( $args['desc'] ); ?>
			</desc>
		<?php endif; ?>

		<?php
		// Use absolute path in the Customizer so that icons show up in there.
		if ( is_customize_preview() ) :
		?>
			<use xlink:href="<?php echo esc_url( get_parent_theme_file_uri( '/assets/images/svg-icons.svg#icon-' . esc_html( $args['icon'] ) ) ); ?>"></use>
		<?php else : ?>
			<use xlink:href="#icon-<?php echo esc_html( $args['icon'] ); ?>"></use>
		<?php endif; ?>

	</svg>

	<?php
	// Get the buffer and return.
	return ob_get_clean();
}

/**
 * Trim the title length.
 *
 * @param array $args Parameters include length and more.
 * @return string
 */
function _s_get_the_title( $args = array() ) {

	// Set defaults.
	$defaults = array(
		'length' => 12,
		'more'   => '...',
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	// Trim the title.
	return wp_trim_words( get_the_title( get_the_ID() ), $args['length'], $args['more'] );
}

/**
 * Limit the excerpt length.
 *
 * @param array $args Parameters include length and more.
 * @return string
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
 * @param string $size The image size to display. Default is thumbnail.
 * @return string
 */
function _s_display_post_image( $size = 'thumbnail' ) {

	// If post has a featured image, display it.
	if ( has_post_thumbnail() ) {
		the_post_thumbnail( $size );
		return false;
	}

	$attached_image_url = _s_get_attached_image_url( $size );

	// Else, display an attached image or placeholder.
	?>
	<img src="<?php echo esc_url( $attached_image_url ); ?>" class="attachment-thumbnail wp-post-image" alt="<?php echo esc_html( get_the_title() ); ?>"/>
	<?php
}

/**
 * Return an image URL, no matter what.
 *
 * @param  string $size The image size to return. Default is thumbnail.
 * @return string
 */
function _s_get_post_image_url( $size = 'thumbnail' ) {

	// If post has a featured image, return its URL.
	if ( has_post_thumbnail() ) {

		$featured_image_id = get_post_thumbnail_id( get_the_ID() );
		$media             = wp_get_attachment_image_src( $featured_image_id, $size );

		if ( is_array( $media ) ) {
			return current( $media );
		}
	}

	// Else, return the URL for an attached image or placeholder.
	return _s_get_attached_image_url( $size );
}

/**
 * Get the URL of an image that's attached to the current post, else a placeholder image URL.
 *
 * @param  string $size The image size to return. Default is thumbnail.
 * @return string
 */
function _s_get_attached_image_url( $size = 'thumbnail' ) {

	// Check for any attached image.
	$media = get_attached_media( 'image', get_the_ID() );
	$media = current( $media );

	// If an image is attached, return its URL.
	if ( is_array( $media ) && $media ) {
		return 'thumbnail' === $size ? wp_get_attachment_thumb_url( $media->ID ) : wp_get_attachment_url( $media->ID );
	}

	// Return URL to a placeholder image as a fallback.
	return get_stylesheet_directory_uri() . '/assets/images/placeholder.png';
}

/**
 * Echo the copyright text saved in the Customizer.
 *
 * @return bool
 */
function _s_display_copyright_text() {

	// Grab our customizer settings.
	$copyright_text = get_theme_mod( '_s_copyright_text' );

	// Stop if there's nothing to display.
	if ( ! $copyright_text ) {
		return false;
	}

	echo _s_get_the_content( do_shortcode( $copyright_text ) ); // phpcs: xss ok.
}

/**
 * Get the Twitter social sharing URL for the current page.
 *
 * @return string
 */
function _s_get_twitter_share_url() {
	return add_query_arg(
		array(
			'text' => rawurlencode( html_entity_decode( get_the_title() ) ),
			'url'  => rawurlencode( get_the_permalink() ),
		), 'https://twitter.com/share'
	);
}

/**
 * Get the Facebook social sharing URL for the current page.
 *
 * @return string
 */
function _s_get_facebook_share_url() {
	return add_query_arg( 'u', rawurlencode( get_the_permalink() ), 'https://www.facebook.com/sharer/sharer.php' );
}

/**
 * Get the LinkedIn social sharing URL for the current page.
 *
 * @return string
 */
function _s_get_linkedin_share_url() {
	return add_query_arg(
		array(
			'title' => rawurlencode( html_entity_decode( get_the_title() ) ),
			'url'   => rawurlencode( get_the_permalink() ),
		), 'https://www.linkedin.com/shareArticle'
	);
}

/**
 * Display the social links saved in the customizer.
 */
function _s_display_social_network_links() {

	// Create an array of our social links for ease of setup.
	// Change the order of the networks in this array to change the output order.
	$social_networks = array( 'facebook', 'instagram', 'linkedin', 'twitter' );

	?>
	<ul class="social-icons">
		<?php
		// Loop through our network array.
		foreach ( $social_networks as $network ) :

			// Look for the social network's URL.
			$network_url = get_theme_mod( '_s_' . $network . '_link' );

			// Only display the list item if a URL is set.
			if ( ! empty( $network_url ) ) :
			?>
				<li class="social-icon <?php echo esc_attr( $network ); ?>">
					<a href="<?php echo esc_url( $network_url ); ?>">
						<?php
						_s_display_svg(
							array(
								'icon' => $network . '-square',
							)
						);
						?>
						<span class="screen-reader-text">
						<?php
							echo /* translators: the social network name */ sprintf( esc_html( 'Link to %s', '_s' ), ucwords( esc_html( $network ) ) ); // WPCS: XSS OK.
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

/**
 * Display a card.
 *
 * @param array $args Card defaults.
 */
function _s_display_card( $args = array() ) {

	// Setup defaults.
	$defaults = array(
		'title' => '',
		'image' => '',
		'text'  => '',
		'url'   => '',
		'class' => '',
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );
	?>
	<div class="<?php echo esc_attr( $args['class'] ); ?> card">

		<?php if ( $args['image'] ) : ?>
			<a href="<?php echo esc_url( $args['url'] ); ?>" tabindex="-1"><img class="card-image" src="<?php echo esc_url( $args['image'] ); ?>" alt="<?php echo esc_attr( $args['title'] . '-image' ); ?>"></a>
		<?php endif; ?>

		<div class="card-section">

		<?php if ( $args['title'] ) : ?>
			<h3 class="card-title"><a href="<?php echo esc_url( $args['url'] ); ?>"><?php echo esc_html( $args['title'] ); ?></a></h3>
		<?php endif; ?>

		<?php if ( $args['text'] ) : ?>
			<p class="card-text"><?php echo esc_html( $args['text'] ); ?></p>
		<?php endif; ?>

		<?php if ( $args['url'] ) : ?>
			<a class="button button-card" href="<?php echo esc_url( $args['url'] ); ?>"><?php esc_html_e( 'Read More', '_s' ); ?></a>
		<?php endif; ?>

		</div><!-- .card-section -->
	</div><!-- .card -->
	<?php
}

/**
 * Display header button.
 *
 * @author Corey Collins
 * @return string
 */
function _s_display_header_button() {

	// Get our button setting.
	$button_setting = get_theme_mod( '_s_header_button' );

	// If we have no button displayed, don't display the markup.
	if ( 'none' === $button_setting ) {
		return '';
	}

	// Grab our button and text values.
	$button_url  = get_theme_mod( '_s_header_button_url' );
	$button_text = get_theme_mod( '_s_header_button_text' );
	?>
	<div class="site-header-action">
		<?php
		// If we're doing a URL, just make this LOOK like a button but be a link.
		if ( 'link' === $button_setting && $button_url ) :
		?>
			<a href="<?php echo esc_url( $button_url ); ?>" class="button button-link"><?php echo esc_html( $button_text ?: __( 'More Information', '_s' ) ); ?></a>
		<?php else : ?>
			<button type="button" class="cta-button" aria-expanded="false" aria-label="<?php esc_html_e( 'Search', '_s' ); ?>">
				<?php esc_html_e( 'Search', '_s' ); ?>
			</button>
			<div class="form-container">
				<?php get_search_form(); ?>
			</div><!-- .form-container -->
		<?php endif; ?>
	</div><!-- .header-trigger -->
	<?php
}

/**
 * Displays numeric pagination on archive pages.
 *
 * @param array $args Array of params to customize output.
 * @return void.
 * @author Corey Collins
 */
function _s_display_numeric_pagination( $args = array() ) {

	// Set defaults.
	$defaults = array(
		'prev_text' => '&laquo;',
		'next_text' => '&raquo;',
		'mid_size'  => 4,
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	if ( is_null( paginate_links( $args ) ) ) {
		return;
	}
	?>

	<nav class="pagination-container container" aria-label="<?php esc_html_e( 'numeric pagination', '_s' ); ?>">
		<?php echo paginate_links( $args ); // WPCS: XSS OK. ?>
	</nav>

	<?php
}

/**
 * Displays the mobile menu with off-canvas background layer.
 *
 * @return string An empty string if no menus are found at all.
 * @author Corey Collins
 */
function _s_display_mobile_menu() {

	// Bail if no mobile or primary menus are set.
	if ( ! has_nav_menu( 'mobile' ) && ! has_nav_menu( 'primary' ) ) {
		return '';
	}

	// Set a default menu location.
	$menu_location = 'primary';

	// If we have a mobile menu explicitly set, use it.
	if ( has_nav_menu( 'mobile' ) ) {
		$menu_location = 'mobile';
	}
	?>
	<div class="off-canvas-screen"></div>
	<nav class="off-canvas-container" aria-label="<?php esc_html_e( 'Mobile Menu', '_s' ); ?>" aria-hidden="true" tabindex="-1">
		<button type="button" class="off-canvas-close" aria-label="<?php esc_html_e( 'Close Menu', '_s' ); ?>">
			<span class="close"></span>
		</button>
		<?php
		// Mobile menu args.
		$mobile_args = array(
			'theme_location'  => $menu_location,
			'container'       => 'div',
			'container_class' => 'off-canvas-content',
			'container_id'    => '',
			'menu_id'         => 'site-mobile-menu',
			'menu_class'      => 'mobile-menu',
			'fallback_cb'     => false,
			'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
		);

		// Display the mobile menu.
		wp_nav_menu( $mobile_args );
		?>
	</nav>
	<?php
}
