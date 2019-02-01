/**
 * Show or hide the URL field in the Header Button options when the select option is changed.
 *
 * @author Corey Collins
 */
window.CustomizerHeaderOptions = {};
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
			headerButtonSelect: $( '#customize-control-_s_header_button select' ),
			headerLinkButton: $( '#customize-control-_s_header_button_url' ),
			headerLinkText: $( '#customize-control-_s_header_button_text' )
		};
	};

	// Combine all events
	app.bindEvents = function() {
		app.$c.window.on( 'load', app.showLinkField );
		app.$c.headerButtonSelect.on( 'change', app.showHideLinkField );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.headerButtonSelect.length;
	};

	// Show/Hide the Link field when the select value changes.
	app.showHideLinkField = function() {

		if ( 'link' === app.$c.headerButtonSelect.val() ) {
			app.$c.headerLinkButton.show();
			app.$c.headerLinkText.show();
		} else {
			app.$c.headerLinkButton.hide();
			app.$c.headerLinkText.hide();
		}
	};

	// If the value is set and is already 'link', make sure the field is displayed.
	app.showLinkField = function() {

		if ( 'link' === app.$c.headerButtonSelect.val() ) {
			app.$c.headerLinkButton.show();
			app.$c.headerLinkText.show();
		}
	};

	// Engage
	$( app.init );

} ( window, jQuery, window.CustomizerHeaderOptions ) );
