/**
 * File: off-canvas.js
 *
 * Help deal with the off-canvas mobile menu.
 */
window.wdsoffCanvas = {};
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
			body: $( 'body' ),
			offCanvasClose: $( '.off-canvas-close' ),
			offCanvasContainer: $( '.off-canvas-container' ),
			offCanvasOpen: $( '.off-canvas-open' ),
			offCanvasScreen: $( '.off-canvas-screen' )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.body.on( 'keydown', app.escKeyClose );
		app.$c.offCanvasClose.on( 'click', app.closeoffCanvas );
		app.$c.offCanvasOpen.on( 'click', app.toggleoffCanvas );
		app.$c.offCanvasScreen.on( 'click', app.closeoffCanvas );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.offCanvasContainer.length;
	};

	// To show or not to show?
	app.toggleoffCanvas = function() {

		if ( 'true' === $( this ).attr( 'aria-expanded' ) ) {
			app.closeoffCanvas();
		} else {
			app.openoffCanvas();
		}

	};

	// Show that drawer!
	app.openoffCanvas = function() {
		app.$c.offCanvasContainer.addClass( 'is-visible' );
		app.$c.offCanvasOpen.addClass( 'is-visible' );
		app.$c.offCanvasScreen.addClass( 'is-visible' );

		app.$c.offCanvasOpen.attr( 'aria-expanded', true );
		app.$c.offCanvasContainer.attr( 'aria-hidden', false );
	};

	// Close that drawer!
	app.closeoffCanvas = function() {
		app.$c.offCanvasContainer.removeClass( 'is-visible' );
		app.$c.offCanvasOpen.removeClass( 'is-visible' );
		app.$c.offCanvasScreen.removeClass( 'is-visible' );

		app.$c.offCanvasOpen.attr( 'aria-expanded', false );
		app.$c.offCanvasContainer.attr( 'aria-hidden', true );

		app.$c.offCanvasOpen.focus();
	};

	// Close drawer if "esc" key is pressed.
	app.escKeyClose = function( event ) {
		if ( 27 === event.keyCode ) {
			app.closeoffCanvas();
		}
	};

	// Engage!
	$( app.init );

}( window, jQuery, window.wdsoffCanvas ) );
