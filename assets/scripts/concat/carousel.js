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

		// If we're in an ACF edit page.
		if ( window.acf ) {
			app.doSlick();
		}

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
		app.$c.window.on( 'load', app.doFirstAnimation );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.theCarousel.length;
	};

	// Animate the first slide on window load.
	app.doFirstAnimation = function() {

		// Get the first slide content area and animation attribute.
		let firstSlide = app.$c.theCarousel.find( '[data-slick-index=0]' ),
			firstSlideContent = firstSlide.find( '.slide-content' ),
			firstAnimation = firstSlideContent.attr( 'data-animation' );

		// Add the animation class to the first slide.
		firstSlideContent.addClass( firstAnimation );
	};

	// Allow background videos to autoplay.
	app.playBackgroundVideos = function() {

		// Get all the videos in our slides object.
		$( 'video' ).each( function() {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		} );
	};

	// Initialize our carousel.
	app.initializeCarousel = function() {

		$( '.carousel-block' ).not( '.slick-initialized' ).slick( {
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: true,
			dots: true,
			focusOnSelect: true,
			waitForAnimate: true
		} );
	};

	// Kick off Slick.
	app.doSlick = function() {


		// Render on the frontend.
		$( document ).ready( function() {
			app.playBackgroundVideos;
			app.initializeCarousel();
		} );

		// Render on the backend.
		if ( window.acf ) {
			window.acf.addAction( 'render_block_preview', app.initializeCarousel );
		}
	};

	// Engage!
	$( app.init );
} ( window, jQuery, window.wdsCarousel ) );
