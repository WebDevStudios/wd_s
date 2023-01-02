<?php
/**
 * Register widget area.
 *
 * @package wd_s
 */

namespace WebDevStudios\wd_s;

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 *
 * @author WebDevStudios
 */
function widgets_init() {

	// Define sidebars.
	$sidebars = [
		'sidebar-1' => esc_html__( 'Sidebar Page', 'wd_s' ),
		'sidebar-2' => esc_html__( 'Sidebar Blog', 'wd_s' ),
		'sidebar-3' => esc_html__( 'Footer widgets', 'wd_s' ),
	];

	// Loop through each sidebar and register.
	foreach ( $sidebars as $sidebar_id => $sidebar_name ) {
		register_sidebar(
			[
				'name'          => $sidebar_name,
				'id'            => $sidebar_id,
				'description'   => /* translators: the sidebar name */ sprintf( esc_html__( 'Widget area for %s', 'wd_s' ), $sidebar_name ),
				'before_widget' => '<aside class="widget %2$s">',
				'after_widget'  => '</aside>',
				'before_title'  => '<h2 class="widget-title">',
				'after_title'   => '</h2>',
			]
		);
	}

}

add_action( 'widgets_init', __NAMESPACE__ . '\widgets_init' );

/**
 * Setup widget counts.
 *
 * @param string $id The widget area ID.
 * @return int Number of widgets in the widget area.
 */
function custom_count_widgets( $id ) {
	global $sidebars_widgets;
	if ( isset( $sidebars_widgets[ $id ] ) ) {
			return count( $sidebars_widgets[ $id ] );
	}
}
/**
 * Set the widget class for flexible widgets.
 *
 * @param string $id The widget area ID.
 * @return Name of column class.
 */
function custom_widget_area_class( $id ) {
	$count = custom_count_widgets( $id );
	$class = '';
	if ( 1 === $count ) {
		$class .= ' widget-full';
	} elseif ( 0 === $count % 3 ) {
		$class .= ' widget-thirds';
	} elseif ( 0 === $count % 4 ) {
		$class .= ' widget-fourths';
	} elseif ( 1 === $count % 2 ) {
		$class .= ' widget-halves uneven';
	} else {
		$class .= ' widget-halves';
	}
	return $class;
}
