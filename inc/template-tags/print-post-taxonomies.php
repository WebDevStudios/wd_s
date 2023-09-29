<?php
/**
 * Display post taxonomies template function.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Print the taxonomies associated with a post.
 *
 * @param int $post_id The ID of the post.
 * @author WebDevStudios
 */
function print_post_taxonomies( $post_id ) {
	$post_taxonomies = get_post_taxonomies( $post_id );

	if ( $post_taxonomies ) {
		echo '<div class="post-taxonomies-list">';
		foreach ( $post_taxonomies as $taxonomy ) {
			$terms = get_the_terms( $post_id, $taxonomy );
			if ( $terms && ! is_wp_error( $terms ) ) {
				echo '<p>' . esc_html( ucfirst( $taxonomy ) ) . ': ';
				$term_links = array();
				foreach ( $terms as $term ) {
					$term_links[] = '<a href="' . esc_url( get_term_link( $term ) ) . '">' . esc_html( $term->name ) . '</a>';
				}
				$imploded_terms = implode( ', ', $term_links );
				echo wp_kses_post( $imploded_terms );
				echo '</p>';
			}
		}
		echo '</div>';
	}
}
