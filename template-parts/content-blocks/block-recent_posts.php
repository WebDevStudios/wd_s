<?php
/**
 * The template used for displaying a recent posts block.
 *
 * This block will either display all recent posts or posts
 * from a specific category. The amount of posts can be
 * limited through the admin.
 *
 * @package _s
 */

// Set up fields.
$title = get_sub_field( 'title' );
$post_count = get_sub_field( 'number_of_posts' );
$categories = get_sub_field( 'categories' );
$tags = get_sub_field( 'tags' );

// Variable to hold query args.
$args = array();

// Only if there are either categories or tags.
if ( $categories || $tags ) {
	$args = _s_get_recent_posts_query_arguments( $categories, $tags );
}

// Always merge in the number of posts.
$args['posts_per_page'] = is_numeric( $post_count ) ? $post_count : 3;

// Get the recent posts.
$recent_posts = _s_get_recent_posts( $args );

// Display section if we have any posts.
if ( $recent_posts->have_posts() ) :

	// Start a <container> with possible block options.
	_s_display_block_options(
		array(
			'container' => 'section', // Any HTML5 container: section, div, etc...
			'class'     => 'content-block container recent-posts', // Container class.
		)
	);
	?>

	<div class="row">

		<?php if ( $title ) : ?>
		<h2 class="content-block-title"><?php echo esc_html( $title ); ?></h2>
		<?php endif; ?>

		<?php
		// Loop through recent posts.
		while ( $recent_posts->have_posts() ) : $recent_posts->the_post();

			// Display a card.
			_s_display_card( array(
					'title' => get_the_title(),
					'image' => _s_get_post_image_url( 'medium' ),
					'text'  => _s_get_the_excerpt( array(
							'length' => 20,
							'more'   => '...',
						)
					),
					'url'   => get_the_permalink(),
					'class' => 'col col-m-6 col-l-4',
				)
			);
		endwhile;
		wp_reset_postdata();
	?>
	</div><!-- .row -->
</section><!-- .recent-posts -->
<?php endif; ?>
