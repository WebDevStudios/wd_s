<?php
/**
 * The template used for displaying a recent posts block.
 * This block will either display all recent posts or posts from a specific category.
 * The amount of posts can be limited through the admin.
 *
 * @package _s
 */

 // Get the index of this instance of the layout so we can set a proper transient.
$row_index = get_row_index();

// Set up fields.
$paginated = get_sub_field( 'display_pagination' );
$number_of_posts = get_sub_field( 'number_of_posts' );
$categories = get_sub_field( 'categories' );
$tags = get_sub_field( 'tags' );

// Variable to hold query args.
$args = array();

// Only if there are either categories or tags.
if ( $categories || $tags ) {
	$args = _s_get_recent_posts_query_arguments( $categories, $tags );
}

// Adjust the button URL if we have a category
$button_url = $categories && ! empty( $categories[0] ) ? get_category_link( $categories[0] ) : get_post_type_archive_link( 'post' );

// Always merge in the number of posts.
$args['posts_per_page'] = is_numeric( $number_of_posts ) ? $number_of_posts : 3;

// Get the index of this instance of the layout so we can set a proper transient.
$args['row_index'] = $row_index;

// If this is supposed to be paginated, we need to pass the page as well.
if ( 'true' === $paginated[0] ) {
	$args['paged'] = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
}

// Get the recent posts.
$recent_posts = _s_get_recent_posts( $args );

// Display section if we have any posts.
if ( $recent_posts->have_posts() ) :

	// Start a <container> with possible block options.
	echo _s_display_block_options( // WPCS: XSS OK.
		array(
			'container' => 'section', // Any HTML5 container: section, div, etc...
			'class'     => 'content-section recent-posts recent-posts-cards', // Container class.
		)
	);
?>

	<div class="wrap">

		<div class="posts-flex-wrap">

			<?php

			while ( $recent_posts->have_posts() ) : $recent_posts->the_post();

				get_template_part( 'template-parts/content', 'recent_post' );

			endwhile;

			wp_reset_postdata();

			?>

		</div>

		<div class="button-container">
			<a href="<?php echo esc_url( $button_url ); ?>" class="button button-green recent-posts-button">
				<?php esc_html_e( 'See All Posts', '_s' ); ?>
			</a>

		</div>

	</div>

</section><!-- .recent-posts -->

<?php endif; ?>
