<?php
/**
 * ACF/Post Meta Search.
 *
 * Extend WordPress search to include custom fields.
 * https://adambalee.com
 *
 * @package _s
 */

/**
 * Join posts and postmeta tables
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_join
 *
 * @param string $join The SQL query.
 * @return $join The updated query.
 * @author Corey Collins
 */
function _s_search_join( $join ) {
	global $wpdb;

	if ( is_search() ) {
		$join .= ' LEFT JOIN ' . $wpdb->postmeta . ' ON ' . $wpdb->posts . '.ID = ' . $wpdb->postmeta . '.post_id ';
	}

	return $join;
}
add_filter( 'posts_join', '_s_search_join' );

/**
 * Modify the search query with posts_where.
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_where
 *
 * @param string $where The SQL query.
 * @return $where The updated query.
 * @author Corey Collins
 */
function _s_search_where( $where ) {
	global $pagenow, $wpdb;

	if ( is_search() ) {
		$where = preg_replace(
			'/\(\s*' . $wpdb->posts . '.post_title\s+LIKE\s*(\'[^\']+\')\s*\)/',
			'(' . $wpdb->posts . '.post_title LIKE $1) OR (' . $wpdb->postmeta . '.meta_value LIKE $1)',
			$where
		);
	}

	return $where;
}
add_filter( 'posts_where', '_s_search_where' );

/**
 * Prevent duplicates.
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_distinct
 *
 * @param string $where The SQL query.
 * @return $where The updated query.
 * @author Corey Collins
 */
function _s_search_distinct( $where ) {
	global $wpdb;

	if ( is_search() ) {
		return 'DISTINCT';
	}

	return $where;
}
add_filter( 'posts_distinct', '_s_search_distinct' );
