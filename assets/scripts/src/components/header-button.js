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
		app.$c.body.on( 'keyup touchstart click', app.hideSearchForm );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.headerSearchForm.length;
	};

	// Adds the toggle class for the search form.
	app.showHideSearchForm = function() {
		app.$c.body.toggleClass( 'search-form-visible' );

		return false;
	};

	// Hides the search form if we click outside of its container.
	app.hideSearchForm = function( event ) {

		if ( ! $( event.target ).parents( 'div' ).hasClass( 'site-header-action' ) ) {
			app.$c.body.removeClass( 'search-form-visible' );
		}
	};

	// Engage
	$( app.init );

} ( window, jQuery, window.ShowHideSearchForm ) );
