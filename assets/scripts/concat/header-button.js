/**
 * Show/Hide the Search Form in the header.
 *
 * @author Corey Collins
 */
window.ShowHideSearchForm = {};
( function( window, $, app ) {

	// Constructor
	app.init = function() {
		app.cache();

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function() {
		app.$c = {
			window: $( window ),
			body: $( 'body' ),
			headerSearchForm: $( '.site-header-action .cta-button' )
		};
	};

	// Combine all events
	app.bindEvents = function() {
		app.$c.headerSearchForm.on( 'keyup touchstart click', app.showHideSearchForm );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.headerSearchForm.length;
	};

	// Some function
	app.showHideSearchForm = function() {
		app.$c.body.toggleClass( 'search-form-visible' );
	};

	// Engage
	$( app.init );

})( window, jQuery, window.ShowHideSearchForm );
