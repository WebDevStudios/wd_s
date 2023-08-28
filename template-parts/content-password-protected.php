<?php
/**
 * Template part for displaying the password protection form.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package wd_s
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'is-layout-constrained' ); ?>>

	<header class="entry-header is-layout-constrained">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->

	<div class="entry-content is-layout-constrained">
		<?php
		echo wp_kses(
			get_the_password_form(),
			[
				'p'     => [],
				'label' => [
					'for' => [],
				],
				'form'  => [
					'action' => [],
					'class'  => [],
					'method' => [],
				],
				'input' => [
					'id'    => [],
					'name'  => [],
					'size'  => [],
					'type'  => [],
					'value' => [],
				],
			]
		);
		?>
	</div><!-- .entry-content -->

</article><!-- #post-## -->
