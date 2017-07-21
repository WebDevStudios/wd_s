<?php
/**
 * The template used for displaying related posts in a carousel.
 *
 * @package _s
 */

// Set up fields.
$title = get_sub_field( 'title' );
$posts = get_sub_field( 'related' );

if ( $posts ) : ?>

	<section class="related-posts">

		<?php if ( $title ) : ?>
		<h2 class="related-posts-title"><?php echo esc_html( $title ); ?></h2>
		<?php endif; ?>

		<?php foreach ( $posts as $key => $post ) :

			setup_postdata( $post );

			// Get the post data.
			$post_title = get_the_title();
			$post_excerpt = get_the_excerpt();
			$post_link = get_the_permalink();
			$post_image = get_the_post_thumbnail( get_the_ID() );
			$post_categories = get_the_category();
			$first_category = '';

			if ( count( $post_categories ) > 0 ) {
				$first_category = $post_categories[0]->name;
			}

			// Trim excerpt down to 170 characters.
			if ( 170 < strlen( $post_excerpt ) ) {
				$post_excerpt = mb_substr( strip_tags( $post_excerpt ), 0, 170 ) . esc_html__( '&hellip;', '_s' );
			}

		?>

			<div class="post">

				<div class="post-content-wrap">

					<?php if ( $first_category ) : ?>
						<span class="category-badge"><?php echo esc_html( $first_category ); ?></span>
					<?php endif; ?>

					<h3 class="post-title"><?php echo esc_html( $post_title ); ?></h3>

					<p class="post-excerpt">
						<?php echo esc_html( $post_excerpt ); ?>
					</p>

					<a href="<?php echo esc_url( $post_link ); ?>" class="button button-orange read-more">
						<?php esc_html_e( 'Read More', '_s' ); ?>
						<span class="screen-reader-text"> <?php echo esc_html( $post_title ); ?></span>
					</a>
				</div>

				<?php

				if ( has_post_thumbnail() ) {
					the_post_thumbnail();
				}

				?>

			</div>

		<?php endforeach; ?>
		<?php wp_reset_postdata(); ?>

	</section><!-- .related-posts -->

<?php endif; ?>
