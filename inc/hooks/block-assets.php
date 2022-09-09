<?php
/**
 * Specify if block assets should be loaded regardless of use on page
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Load block assets only if the block exists on the page.
 *
 * @author WebDevStudios
 * @see https://developer.wordpress.org/reference/hooks/should_load_separate_core_block_assets/
 */
add_filter( 'should_load_separate_core_block_assets', '__return_true' );
