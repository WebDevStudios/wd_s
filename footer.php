<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package wd_s
 */

use function WebDevStudios\wd_s\print_footer_block;

?>
	<div class="wp-site-blocks">
		<footer class="wp-block-template-part site-footer">
			<?php block_footer_area(); ?>
		</footer>
	</div><!-- .wp-site-blocks -->

	<?php wp_footer(); ?>

</body>

</html>
