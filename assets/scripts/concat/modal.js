/**
 * File modal.js
 *
 * Deal with multiple modals and their media.
 */
window.wdsModal = {};

( function ( window, $, app ) {

	var $modalToggle;
	var $focusableChildren;

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

		// Listen to tabs, trap keyboard if we need to
		app.$c.body.on( 'keydown', app.trapKeyboardMaybe );

	};

	// Open the modal.
	app.openModal = function () {
		// Store the modal toggle element
		$modalToggle = $( this );

		// Figure out which modal we're opening and store the object.
		var $modal = $( $( this ).data( 'target' ) );

		// Display the modal.
		$modal.addClass( 'modal-open' );

		// Add body class.
		app.$c.body.addClass( 'modal-open' );

		// Find the focusable children of the modal.
		// This list may be incomplete, really wish jQuery had the :focusable pseudo like jQuery UI does.
		// For more about :input see: https://api.jquery.com/input-selector/
		$focusableChildren = $modal.find('a, :input, [tabindex]');

		// Ideally, there is always one (the close button), but you never know.
		if ( $focusableChildren.length > 0 ) {
			// Shift focus to the first focusable element.
			$focusableChildren[0].focus();
		}

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

		// Revert focus back to toggle element
		$modalToggle.focus();

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

	// Trap the keyboard into a modal when one is active.
	app.trapKeyboardMaybe = function ( event ) {

		// We only need to do stuff when the modal is open and tab is pressed.
		if ( 9 === event.which && $( '.modal-open' ).length > 0 ) {
			var $focused = $( ':focus' );
			var focusIndex = $focusableChildren.index( $focused );

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
	}

	// Engage!
	$( app.init );
} )( window, jQuery, window.wdsModal );

// Load the yt iframe api js file from youtube.
// NOTE THE IFRAME URL MUST HAVE 'enablejsapi=1' appended to it.
// example: src="http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1"
// It also _must_ have an ID attribute.
var tag = document.createElement('script');
tag.id = 'iframe-yt';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This var and function have to be available globally due to yt js iframe api.
var player;
function onYouTubeIframeAPIReady() {
	var modal = jQuery('div.modal');
	var iframeid = modal.find('iframe').attr('id');

	player = new YT.Player( iframeid , {
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {

}

function onPlayerStateChange() {
	jQuery( window ).focus();
}
