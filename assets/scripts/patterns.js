/**
* WDS Patterns.
*/
window.WDS_Patterns = {};
( function( window, $, app ) {

	// Private variable.
	var fooVariable = 'varName';

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
			patternButton: $( '.pattern-button' ),
			patternContent: $( '.pattern-document-content' ),
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.patternButton.on( 'click', app.togglePatternContent );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.patternButton.length;
	};

	/**
	 * Toggle the display of the pattern documentation content.
	 *
	 * @return
	 * @author Carrie Forde
	 */
	app.togglePatternContent = function() {

		$( this ).parent().siblings( '.pattern-document-content' ).slideToggle( 'slow' );
	};

	// Engage!
	$( app.init );

})( window, jQuery, window.WDS_Patterns );
