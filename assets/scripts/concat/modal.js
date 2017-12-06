/**
 * File modal.js
 *
 * Deal with multiple modals and their media.
 */
window.wdsModal = {};
( function( window, $, app ) {

	let $modalToggle,
		$focusableChildren,
		$player,
		$tag = document.createElement( 'script' ),
		$firstScriptTag = document.getElementsByTagName( 'script' )[0],
		YT;

	// Constructor.
	app.init = function() {
		app.cache();

		if ( app.meetsRequirements() ) {
			$firstScriptTag.parentNode.insertBefore( $tag, $firstScriptTag );
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function() {
		app.$c = {
			'body': $( 'body' )
		};
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return $( '.modal-trigger' ).length;
	};

	// Combine all events.
	app.bindEvents = function() {

		// Trigger a modal to open.
		app.$c.body.on( 'click touchstart', '.modal-trigger', app.openModal );

		// Trigger the close button to close the modal.
		app.$c.body.on( 'click touchstart', '.close', app.closeModal );

		// Allow the user to close the modal by hitting the esc key.
		app.$c.body.on( 'keydown', app.escKeyClose );

		// Allow the user to close the modal by clicking outside of the modal.
		app.$c.body.on( 'click touchstart', 'div.modal-open', app.closeModalByClick );

		// Listen to tabs, trap keyboard if we need to
		app.$c.body.on( 'keydown', app.trapKeyboardMaybe );

	};

	// Open the modal.
	app.openModal = function() {

		// Store the modal toggle element
		$modalToggle = $( this );

		// Figure out which modal we're opening and store the object.
		let $modal = $( $( this ).data( 'target' ) );

		// Display the modal.
		$modal.addClass( 'modal-open' );

		// Add body class.
		app.$c.body.addClass( 'modal-open' );

		// Find the focusable children of the modal.
		// This list may be incomplete, really wish jQuery had the :focusable pseudo like jQuery UI does.
		// For more about :input see: https://api.jquery.com/input-selector/
		$focusableChildren = $modal.find( 'a, :input, [tabindex]' );

		// Ideally, there is always one (the close button), but you never know.
		if ( 0 < $focusableChildren.length ) {

			// Shift focus to the first focusable element.
			$focusableChildren[0].focus();
		}

	};

	// Close the modal.
	app.closeModal = function() {

		// Figure the opened modal we're closing and store the object.
		let $modal = $( $( 'div.modal-open .close' ).data( 'target' ) ),

			// Find the iframe in the $modal object.
			$iframe = $modal.find( 'iframe' );

		// Only do this if there are any iframes.
		if ( $iframe.length ) {

			// Get the iframe src URL.
			let url = $iframe.attr( 'src' );

			// Removing/Readding the URL will effectively break the YouTube API.
			// So let's not do that when the iframe URL contains the enablejsapi parameter.
			if ( ! url.includes( 'enablejsapi=1' ) ) {

				// Remove the source URL, then add it back, so the video can be played again later.
				$iframe.attr( 'src', '' ).attr( 'src', url );
			} else {

				// Use the YouTube API to stop the video.
				$player.stopVideo();
			}
		}

		// Finally, hide the modal.
		$modal.removeClass( 'modal-open' );

		// Remove the body class.
		app.$c.body.removeClass( 'modal-open' );

		// Revert focus back to toggle element
		$modalToggle.focus();

	};

	// Close if "esc" key is pressed.
	app.escKeyClose = function( event ) {
		if ( 27 === event.keyCode ) {
			app.closeModal();
		}
	};

	// Close if the user clicks outside of the modal
	app.closeModalByClick = function( event ) {

		// If the parent container is NOT the modal dialog container, close the modal
		if ( ! $( event.target ).parents( 'div' ).hasClass( 'modal-dialog' ) ) {
			app.closeModal();
		}
	};

	// Trap the keyboard into a modal when one is active.
	app.trapKeyboardMaybe = function( event ) {

		// We only need to do stuff when the modal is open and tab is pressed.
		if ( 9 === event.which && 0 < $( '.modal-open' ).length ) {
			let $focused = $( ':focus' ),
				focusIndex = $focusableChildren.index( $focused );

			if ( 0 === focusIndex && event.shiftKey ) {

				// If this is the first focusable element, and shift is held when pressing tab, go back to last focusable element.
				$focusableChildren[ $focusableChildren.length - 1 ].focus();
				event.preventDefault();
			} else if ( ! event.shiftKey && focusIndex === $focusableChildren.length - 1 ) {

				// If this is the last focusable element, and shift is not held, go back to the first focusable element.
				$focusableChildren[0].focus();
				event.preventDefault();
			}
		}
	};

	// Hook into YouTube <iframe>.
	app.onYouTubeIframeAPIReady = function() {
		let $modal = $( 'div.modal' ),
			$iframeid = $modal.find( 'iframe' ).attr( 'id' );

		$player = new YT.Player( $iframeid, {
			events: {
				'onReady': app.onPlayerReady,
				'onStateChange': app.onPlayerStateChange
			}
		} );
	};

	// Do something on player ready.
	app.onPlayerReady = function() {
	};

	// Do something on player state change.
	app.onPlayerStateChange = function() {

		// Set focus to the first focusable element inside of the modal the player is in.
		$( event.target.a ).parents( '.modal' ).find( 'a, :input, [tabindex]' ).first().focus();
	};


	// Engage!
	$( app.init );
}( window, jQuery, window.wdsModal ) );
