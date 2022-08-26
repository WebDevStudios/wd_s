<?php
/**
 * MODULE - Meta.
 *
 * Module are analagous to 'Atoms' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#atoms
 *
 * @package wd_s
 */

/**
 * Accepts 'meta_type' of 'date', 'author', or 'taxonomy'.
 * Possible values:
 * 'date'     => [
 *  'date_text'   => '',
 *  'date_format' => '',
 * ],
 * 'author'   => [
 *  'author_text' => '',
 * ],
 * 'taxonomy' => [
 *  'tax_name' => '',
 *  'post_id'  => get_the_ID(),
 *  'linked'   => true,
 *  'in_list'  => true,
 * ],
 */

use function WebDevStudios\wd_s\get_formatted_atts;
use function WebDevStudios\wd_s\get_formatted_args;
use function WebDevStudios\wd_s\print_post_author;
use function WebDevStudios\wd_s\print_post_date;
use function WebDevStudios\wd_s\print_post_taxonomies;

$wd_s_defaults = [
	'class'            => [ 'wds-module', 'wds-module-meta', 'entry-meta' ],
	'display_date'     => true,
	'display_author'   => true,
	'display_taxonomy' => false,
	'date_args'        => [],
	'author_args'      => [],
	'taxonomy_args'    => [],
];

$wd_s_args = get_formatted_args( $args, $wd_s_defaults );

// Set up the meta class.
$wd_s_atts = get_formatted_atts( [ 'class' ], $wd_s_args );
?>

<div <?php echo $wd_s_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	// Display the meta.
	if ( ! empty( $wd_s_args['display_date'] ) ) :
		print_post_date( $wd_s_args['date_args'] );
	endif;

	if ( ! empty( $wd_s_args['display_author'] ) ) :
		print_post_author( $wd_s_args['author_args'] );
	endif;

	if ( ! empty( $wd_s_args['display_taxonomy'] ) ) :
		print_post_taxonomies( $wd_s_args['taxonomy_args'] );
	endif;
	?>
</div>
