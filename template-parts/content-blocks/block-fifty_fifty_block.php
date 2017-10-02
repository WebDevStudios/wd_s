<?php
/**
 * The template used for displaying fifty/fifty blocks.
 *
 * @package _s
 */

// Get the block layout field so block template is conditionally loaded.
$block_layout = get_sub_field( 'block_layout' );

switch ( $block_layout ) {

	case 'text_media':
		get_template_part( 'template-parts/content-blocks/block', 'fifty_text_media' );
		break;

	case 'media_text':
		get_template_part( 'template-parts/content-blocks/block', 'fifty_media_text' );
		break;

	case 'text_text':
		get_template_part( 'template-parts/content-blocks/block', 'fifty_text_only' );
		break;

	default:
		get_template_part( 'template-parts/content-blocks/block', 'fifty_text_media' );
}


