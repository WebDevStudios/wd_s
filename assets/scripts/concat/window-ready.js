/**
 * File window-ready.js
 *
 * Add a "ready" class to <body> when window is ready.
 */
window.wdsWindowReady = {};
( function( window, $, app ) {

	// Constructor.
	app.init = function() {
		app.cache();
		app.bindEvents();
	};

	// Cache document elements.
	app.cache = function() {
		app.$c = {
			'window': $( window ),
			'body': $( document.body )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.window.load( app.addBodyClass );
	};

	// Add a class to <body>.
	app.addBodyClass = function() {
		app.$c.body.addClass( 'ready' );
	};

	// Engage!
	$( app.init );
}( window, jQuery, window.wdsWindowReady ) );
