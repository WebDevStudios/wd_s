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
			headerSearchToggle: $( '.site-header-action .cta-button' ),
			headerSearchForm: $( '.site-header-action .form-container' ),
		};
	};

	// Combine all events
	app.bindEvents = function() {
		app.$c.headerSearchToggle.on( 'keyup touchstart click', app.showHideSearchForm );
		app.$c.body.on( 'keyup touchstart click', app.hideSearchForm );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.headerSearchToggle.length;
	};

	// Checks to see if the menu has been opened.
	app.searchIsOpen = function() {

		if ( app.$c.body.hasClass( 'search-form-visible' ) ) {
			return true;
		}

		return false;
	};

	// Adds the toggle class for the search form.
	app.showHideSearchForm = function() {
		app.$c.body.toggleClass( 'search-form-visible' );

		app.toggleSearchFormAriaLabel();
		app.toggleSearchToggleAriaLabel();

		return false;
	};

	// Hides the search form if we click outside of its container.
	app.hideSearchForm = function( event ) {

		if ( ! $( event.target ).parents( 'div' ).hasClass( 'site-header-action' ) ) {
			app.$c.body.removeClass( 'search-form-visible' );
			app.toggleSearchFormAriaLabel();
			app.toggleSearchToggleAriaLabel();
		}
	};

	// Toggles the aria-hidden label on the form container.
	app.toggleSearchFormAriaLabel = function() {
		app.$c.headerSearchForm.attr( 'aria-hidden', app.searchIsOpen() ? 'false' : 'true' );
	};

	// Toggles the aria-hidden label on the toggle button.
	app.toggleSearchToggleAriaLabel = function() {
		app.$c.headerSearchToggle.attr( 'aria-expanded', app.searchIsOpen() ? 'true' : 'false' );
	};

	// Engage
	$( app.init );

} ( window, jQuery, window.ShowHideSearchForm ) );
