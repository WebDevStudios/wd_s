/**
 * Video Playback Script.
 */
window.WDSVideoBackgroundObject = {};
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
			videoButton: $( '.video-toggle' )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.videoButton.on( 'click', app.doTogglePlayback );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.videoButton.length;
	};

	// Video Playback.
	app.doTogglePlayback = function() {
		$( this ).parents( '.content-block' ).toggleClass( 'video-toggled' );

		if ( $( this ).parents( '.content-block' ).hasClass( 'video-toggled' ) ) {
			$( this ).siblings( '.video-background' ).trigger( 'pause' );
		} else {
			$( this ).siblings( '.video-background' ).trigger( 'play' );
		}
	};

	// Engage!
	$( app.init );

}( window, jQuery, window.WDSVideoBackgroundObject ) );
