<?php
/**
 * Template part for displaying a post in the recent posts block.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _s
 */

?>

<article class="recent-post">

	<?php if ( has_post_thumbnail() ) : ?>
		<div class="post-image-container">
			<a href="<?php echo esc_url( get_the_permalink() ); ?>" tabindex="-1">
				<?php the_post_thumbnail(); ?>
			</a>
		</div><!-- .post-image-container -->
	<?php endif; ?>

	<div class="post-content">

		<header class="post-header">
			<h3 class="post-title">
				<a href="<?php echo esc_url( get_the_permalink() ); ?>" class="post-title">
					<?php echo esc_html( get_the_title() ); ?>
				</a>
			</h3>
			<div class="post-meta">
				<?php _s_posted_on(); ?>
			</div>
		</header>


		<div class="post-excerpt">
			<?php the_excerpt(); ?>
		</div>


		<div class="post-read-more">

			<a href="<?php echo esc_url( get_the_permalink() ); ?>" class="link-read-more">
				<?php esc_html_e( 'Read More &rarr;', '_s' ); ?>
			</a>

		</div><!-- .post-read-more -->

	</div><!-- .post-content -->
</article>
