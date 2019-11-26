/**
* WDS Scaffolding.
*/
window.wdsScaffolding = {};
( function( window, $, app ) {

	// Constructor.
	app.init = function() {
		app.cache();

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache elements.
	app.cache = function() {
		app.$c = {
			window: $( window ),
			scaffoldingButton: $( '.scaffolding-button' ),
			scaffoldingContent: $( '.scaffolding-document-content' )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.scaffoldingButton.on( 'click', app.toggleScaffoldingContent );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.scaffoldingButton.length;
	};

	/**
	 * Toggle the display of the scaffolding documentation content.
	 *
	 * @author Carrie Forde
	 */
	app.toggleScaffoldingContent = function() {

		$( this ).parent().siblings( '.scaffolding-document-content' ).slideToggle( 'slow' );
	};

	// Engage!
	$( app.init );

} ( window, jQuery, window.wdsScaffolding ) );
