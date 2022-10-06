<?php
/**
 * The template for displaying comments.
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

/**
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */

if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-area">
	<h2 class="screen-reader-text"><?php esc_html_e( 'Comment section', 'wd_s' ); ?></h2>

	<?php
	// You can start editing here -- including this comment!
	if ( have_comments() ) :
		?>
		<h3 class="comments-title">
			<?php
			printf(
				/* translators: the number of comments */
				esc_html( _nx( '%1$s thought on &ldquo;%2$s&rdquo;', '%1$s thoughts on &ldquo;%2$s&rdquo;', get_comments_number(), 'comments title', 'wd_s' ) ),
				number_format_i18n( get_comments_number() ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- XSS OK.
				'<span>' . wp_kses_post( get_the_title() ) . '</span>' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- XSS OK.
			);
			?>
		</h3>

		<?php
		if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // Are there comments to navigate through?
			?>
			<nav id="comment-nav-above" class="navigation comment-navigation" role="navigation">
				<h3 class="screen-reader-text"><?php esc_html_e( 'Comment navigation', 'wd_s' ); ?></h3>
				<div class="nav-links">

					<div class="nav-previous"><?php previous_comments_link( esc_html__( 'Older Comments', 'wd_s' ) ); ?></div>
					<div class="nav-next"><?php next_comments_link( esc_html__( 'Newer Comments', 'wd_s' ) ); ?></div>

				</div><!-- .nav-links -->
			</nav><!-- #comment-nav-above -->
		<?php endif; // Check for comment navigation. ?>

		<ol class="comment-list">
			<?php
				wp_list_comments(
					[
						'style'       => 'ol',
						'short_ping'  => true,
						'avatar_size' => 66,
					]
				);
			?>
		</ol><!-- .comment-list -->

		<?php
		if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // Are there comments to navigate through?
			?>
			<nav id="comment-nav-below" class="navigation comment-navigation" role="navigation">
				<h2 class="screen-reader-text"><?php esc_html_e( 'Comment navigation', 'wd_s' ); ?></h2>
				<div class="nav-links">

					<div class="nav-previous"><?php previous_comments_link( esc_html__( 'Older Comments', 'wd_s' ) ); ?></div>
					<div class="nav-next"><?php next_comments_link( esc_html__( 'Newer Comments', 'wd_s' ) ); ?></div>

				</div><!-- .nav-links -->
			</nav><!-- #comment-nav-below -->

		<?php endif; // Check for comment navigation. ?>
	<?php endif; // Check for have_comments(). ?>

	<?php
	// If comments are closed and there are comments, let's leave a little note, shall we?
	if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) :
		?>
		<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'wd_s' ); ?></p>
	<?php endif; ?>

	<?php
	// @link https://codex.wordpress.org/Function_Reference/comment_form#Default_.24args_array.
	// Spit out the comment form.
	comment_form( [ 'class_submit' => 'button' ] );
	?>

</div><!-- #comments -->
