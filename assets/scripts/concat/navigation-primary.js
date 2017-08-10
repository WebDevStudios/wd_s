/**
 * File: navigation-primary.js
 *
 * Helpers for the primary navigation.
 */
window.wdsPrimaryNavigation = {};
( function( window, $, app ) {

	// Constructor.
	app.init = function() {
		app.cache();

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function() {
		app.$c = {
			window: $( window ),
			subMenuContainer: $( '.main-navigation .sub-menu' ),
			subMenuParentItem: $( '.main-navigation li.menu-item-has-children' )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.window.on( 'load', app.addDownArrow );
		app.$c.subMenuParentItem.find( 'a' ).on( 'focusin focusout', app.toggleFocus );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.subMenuContainer.length;
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function() {
		app.$c.subMenuParentItem.find( '> a' ).append( '<span class="caret-down" aria-hidden="true"></span>' );
	};

	// Toggle the focus class on the link parent.
	app.toggleFocus = function() {
		$( this ).parents( 'li.menu-item-has-children' ).toggleClass( 'focus' );
	};

	// Engage!
	$( app.init );

}( window, jQuery, window.wdsPrimaryNavigation ) );
