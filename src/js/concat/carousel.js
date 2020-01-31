/**
 * File carousel.js
 *
 * Deal with the Slick carousel.
 */
window.wdsCarousel = {};
( function( window, $, app ) {

	/**
	 * Initialize our functionality.
	 *
	 * @since January 31, 2020
	 */
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

	/**
	 * Cache our variables.
	 *
	 * @since January 31, 2020
	 */
	app.cache = function() {
		app.$c = {
			window: $( window ),
			theCarousel: $( '.carousel-block' ),
		};
	};

	/**
	 * Bind events.
	 *
	 * @since January 31, 2020
	 */
	app.bindEvents = function() {
		app.$c.window.on( 'load', app.doSlick );
		app.$c.window.on( 'load', app.doFirstAnimation );
	};

	/**
	 * Determine if a carousel exists on the page.
	 *
	 * @since January 31, 2020
	 */
	app.meetsRequirements = function() {
		return app.$c.theCarousel.length;
	};

	/**
	 * Fire off animations when the first slide loads.
	 *
	 * @since January 31, 2020
	 */
	app.doFirstAnimation = function() {

		// Get the first slide content area and animation attribute.
		const firstSlide = app.$c.theCarousel.find( '[data-slick-index=0]' ),
			firstSlideContent = firstSlide.find( '.slide-content' ),
			firstAnimation = firstSlideContent.attr( 'data-animation' );

		// Add the animation class to the first slide.
		firstSlideContent.addClass( firstAnimation );
	};

	/**
	 * Enable video background autoplay.
	 *
	 * @since January 31, 2020
	 */
	app.playBackgroundVideos = function() {

		// Get all the videos in our slides object.
		$( 'video' ).each( function() {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		} );
	};

	/**
	 * Initialize the carousel.
	 *
	 * @since January 31, 2020
	 */
	app.initializeCarousel = function() {
		$( '.carousel-block' ).not( '.slick-initialized' ).slick( {
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: true,
			dots: true,
			focusOnSelect: true,
			waitForAnimate: true,
		} );
	};

	/**
	 * Initialize Slick.
	 *
	 * @since January 31, 2020
	 */
	app.doSlick = function() {

		// Render on the frontend.
		$( document ).ready( function() {
			app.playBackgroundVideos();
			app.initializeCarousel();
		} );

		// Render on the backend.
		if ( window.acf ) {
			window.acf.addAction( 'render_block_preview', app.initializeCarousel );
		}
	};

	// Engage!
	$( app.init );
}( window, jQuery, window.wdsCarousel ) );
