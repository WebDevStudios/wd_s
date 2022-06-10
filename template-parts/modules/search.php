<?php
/**
 * MODULE - Search.
 *
 * Modules are analagous to 'Molecules' in Brad Frost's Atomic Design Methodology.
 *
 * @link https://atomicdesign.bradfrost.com/chapter-2/#molecules
 *
 * @package ABS
 */

use function abs\functions\render_element;
use function abs\functions\return_formatted_atts;
use function abs\functions\return_formatted_args;

$abs_defaults = [
	'class'       => [ 'abs-module', 'abs-module-search' ],
	'action'      => home_url( '/' ),
	'method'      => 'get',
	'placeholder' => false,
	'button_text' => false,
];

$abs_args = return_formatted_args( $args, $abs_defaults );

// Set up element attributes.
$abs_atts = return_formatted_atts( [ 'class', 'method', 'action' ], $abs_args );

?>
<form <?php echo $abs_atts; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	// Input.
	render_element(
		'input',
		[
			'class'       => [],
			'type'        => 'text',
			'name'        => 's',
			'value'       => get_search_query(),
			'placeholder' => esc_html__( 'Search', 'abs' ),
		]
	);

	// Submit.
	render_element(
		'button',
		[
			'class' => [],
			'type'  => 'submit',
			'text'  => esc_html__( 'Search', 'abs' ),
		]
	);
	?>
</form>
