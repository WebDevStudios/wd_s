/**
 * File carousel.js
 *
 * Deal with the Slick carousel.
 */
window.wdsCarousel = {};
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
			theCarousel: $( '.carousel-block' )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.window.on( 'load', app.doSlick );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.theCarousel.length;
	};

	// Allow background videos to autoplay.
	app.playBackgroundVideos = function() {

		// Get all the videos in our slides object.
		$( 'video' ).each( function() {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		} );
	};

	// Kick off Slick.
	app.doSlick = function() {
		app.$c.theCarousel.on( 'init', app.playBackgroundVideos );

		var slider = tns( {
			container: '.carousel-block',
			items: 1,
			slideBy: 'page',
			autoplay: true,
			navPosition: 'bottom',
			autoplayPosition: 'bottom',
			autoplayTimeout: "2000",
		} );
	};

	// Engage!
	$( app.init );
} ( window, jQuery, window.wdsCarousel ) );
