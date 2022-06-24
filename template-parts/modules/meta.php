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

$abs_defaults = [
	'class'            => [ 'abs-module', 'abs-module-meta', 'entry-meta' ],
	'display_date'     => true,
	'display_author'   => true,
	'display_taxonomy' => false,
	'date_args'        => [],
	'author_args'      => [],
	'taxonomy_args'    => [],
];

$abs_args = get_formatted_args( $args, $abs_defaults );

// Set up the meta class.
$abs_atts = get_formatted_atts( [ 'class' ], $abs_args );
?>

<div <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	// Display the meta.
	if ( ! empty( $abs_args['display_date'] ) ) :
		print_post_date( $abs_args['date_args'] );
	endif;

	if ( ! empty( $abs_args['display_author'] ) ) :
		print_post_author( $abs_args['author_args'] );
	endif;

	if ( ! empty( $abs_args['display_taxonomy'] ) ) :
		print_post_taxonomies( $abs_args['taxonomy_args'] );
	endif;
	?>
</div>
