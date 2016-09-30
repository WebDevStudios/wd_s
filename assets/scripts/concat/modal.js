/**
 * File modal.js
 *
 * Deal with multiple modals and their media.
 */
window.wdsModal = {};

( function ( window, $, app ) {
	// Constructor.
	app.init = function () {
		app.cache();

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			'body': $( 'body' )
		};
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return $( '.modal-trigger' ).length;
	};

	// Combine all events.
	app.bindEvents = function () {
		// Trigger a modal to open.
		app.$c.body.on( 'click touchstart', '.modal-trigger', app.openModal );

		// Trigger the close button to close the modal.
		app.$c.body.on( 'click touchstart', '.close', app.closeModal );

		// Allow the user to close the modal by hitting the esc key.
		app.$c.body.on( 'keydown', app.escKeyClose );

		// Allow the user to close the modal by clicking outside of the modal.
		app.$c.body.on( 'click touchstart', 'div.modal-open', app.closeModalByClick );
	};

	// Open the modal.
	app.openModal = function () {
		// Figure out which modal we're opening and store the object.
		var $modal = $( $( this ).data( 'target' ) );

		// Display the modal.
		$modal.addClass( 'modal-open' );

		// Add body class.
		app.$c.body.addClass( 'modal-open' );
	};

	// Close the modal.
	app.closeModal = function () {
		// Figure the opened modal we're closing and store the object.
		var $modal = $( $( 'div.modal-open .close' ).data( 'target' ) );

		// Find the iframe in the $modal object.
		var $iframe = $modal.find( 'iframe' );

		// Get the iframe src URL.
		var url = $iframe.attr( 'src' );

		// Remove the source URL, then add it back, so the video can be played again later.
		$iframe.attr( 'src', '' ).attr( 'src', url );

		// Finally, hide the modal.
		$modal.removeClass( 'modal-open' );

		// Remove the body class.
		app.$c.body.removeClass( 'modal-open' );
	};

	// Close if "esc" key is pressed.
	app.escKeyClose = function ( event ) {
		if ( 27 === event.keyCode ) {
			app.closeModal();
		}
	};

	// Close if the user clicks outside of the modal
	app.closeModalByClick = function ( event ) {
		// If the parent container is NOT the modal dialog container, close the modal
		if ( !$( event.target ).parents( 'div' ).hasClass( 'modal-dialog' ) ) {
			app.closeModal();
		}
	};

	// Engage!
	$( app.init );
} )( window, jQuery, window.wdsModal );
