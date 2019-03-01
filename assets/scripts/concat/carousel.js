/* global wdsi18n: true */
/**
 * File carousel.js
 *
 * Deal with the Slick carousel.
 */
window.wdsCarousel = {};
( function( window, $, app ) {

	const carouselOptions = {
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
		dots: true,
		focusOnSelect: true,
		waitForAnimate: true
	};

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

	// Animate the slide content.
	app.doAnimation = function() {
		let slides = $( '.slide' ),
			activeSlide = $( '.slick-current' ),
			activeContent = activeSlide.find( '.slide-content' ),

			// This is a string like so: 'animated someCssClass'.
			animationClass = activeContent.attr( 'data-animation' ),
			splitAnimation = animationClass.split( ' ' ),

			// This is the 'animated' class.
			animationTrigger = splitAnimation[0];

		// Go through each slide to see if we've already set animation classes.
		slides.each( function() {
			let slideContent = $( this ).find( '.slide-content' );

			// If we've set animation classes on a slide, remove them.
			if ( slideContent.hasClass( 'animated' ) ) {

				// Get the last class, which is the animate.css class.
				let lastClass = slideContent
					.attr( 'class' )
					.split( ' ' )
					.pop();

				// Remove both animation classes.
				slideContent.removeClass( lastClass ).removeClass( animationTrigger );
			}
		} );

		// Add animation classes after slide is in view.
		activeContent.addClass( animationClass );
	};

	// Allow background videos to autoplay.
	app.playBackgroundVideos = function() {

		// Get all the videos in our slides object.
		$( 'video' ).each( function() {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		} );
	};

	// Append a pause button to the carousel.
	app.addPausebutton = function() {
		const $pauseButton = $( '<button>', { 'class': 'slick-pause', 'type': 'button' } ).text( 'Pause' ),
			$carousel = $( this );

		$pauseButton.on( 'click', function() {

			if ( ( $carousel ).hasClass( 'paused' ) ) {
				$carousel.slick( 'play' ).removeClass( 'paused' );
				$pauseButton.text( wdsi18n.pauseButtonTextPause );
				wp.a11y.speak( wdsi18n.pauseButtonSpeakResumed );
			} else {
				$carousel.slick( 'pause' ).addClass( 'paused' );
				$pauseButton.text( wdsi18n.pauseButtonTextPlay );
				wp.a11y.speak( wdsi18n.pauseButtonSpeakPaused );
			}

		} );

		$pauseButton.appendTo( $carousel );
	};

	// Bind click events to buttons after Slick initializes.
	app.bindButtonClickEvents = function() {
		const $buttons = $( this ).find( '.slick-arrow' );

		$buttons.on( 'click', app.notifySlideChange );
	};

	// Use wp.a11y.speak to notify screen readers of active slides.
	app.notifySlideChange = function() {
		const $slick = $( this ).parents( '.slick-slider' ).slick( 'getSlick' );

		// currentSlide is 0 based, so we need to add 1 to make it human.
		let currentSlide = $slick.currentSlide + 1;

		// String replace the things.
		wp.a11y.speak( wdsi18n.activeSlideButton.replace( '%1$s', currentSlide ).replace( '%2$s', $slick.slideCount ) );
	};

	// Kick off Slick.
	app.doSlick = function() {
		app.$c.theCarousel.on( 'init', app.playBackgroundVideos );
		app.$c.theCarousel.on( 'init', app.bindButtonClickEvents );

		// We only need a pause button when autoplay is enabled above.
		if ( carouselOptions.autoplay ) {
			app.$c.theCarousel.on( 'init', app.addPausebutton );
		}

		app.$c.theCarousel.slick( carouselOptions );

		app.$c.theCarousel.on( 'afterChange', app.doAnimation );
	};

	// Engage!
	$( app.init );
} ( window, jQuery, window.wdsCarousel ) );
