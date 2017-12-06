( function( window, $ ) {

	/**
	 * Modal
	 *
	 * @constructor
	 * @param {Object} options Configuration options.
	 */
	function Modal( options ) {

		// Capture the target modal data attribute.
		this.target = null;

		// Set custom figuration options.
		this.config = Object.assign({
			trigger: '.modal-trigger',
			content: '.modal'
		}, options );

		// Cache DOM elements.
		this.$c = {
			body: $( 'body' ),
			trigger: $( this.config.trigger ),
			content: $( this.config.content )
		};

		// Bind our events.
		bindEvents.call( this );
	}

	/**
	 * Opens the modal.
	 *
	 * @param {Object} e Open modal event.
	 */
	Modal.prototype.openModal = function( e ) {
		e.preventDefault();

		// Store the trigger.
		const $trigger = $( e.target );

		// Get a reference to the target modal
		this.target = $trigger.data( 'target' ) || $trigger.parents().data( 'target' );

		// Get a jQuery instance of the target modal.
		this.$targetModal = this.target ? $( this.target ) : $( this.config.content );

		// Add classes to the modal and body.
		this.$targetModal.addClass( 'modal-open' );
		this.$c.body.addClass( 'modal-open' );
	};

	/**
	 * Close the modal.
	 */
	Modal.prototype.closeModal = function() {

		// Find the iframe in the $modal object.
		const $iframe = this.$targetModal.find( 'iframe' );

		// Only do this if there are any iframes.
		if ( $iframe.length ) {

			// Get the iframe src URL.
			let url = $iframe.attr( 'src' );

			// Removing/Readding the URL will effectively break the YouTube API.
			// So let's not do that when the iframe URL contains the enablejsapi parameter.
			if ( ! url.includes( 'enablejsapi=1' ) ) {

				// Remove the source URL, then add it back, so the video can be played again later.
				$iframe.attr( 'src', '' ).attr( 'src', url );
			}
		}

		// Remove body class.
		this.$c.body.removeClass( 'modal-open' );

		// Remove class from modal.
		this.$targetModal.removeClass( 'modal-open' );
	};

	/**
	 * Bind modal events.
	 *
	 * @private
	 */
	function bindEvents() {

		// Open the modal when clicking a trigger.
		this.$c.body.on( 'click touchstart', this.config.trigger, this.openModal.bind( this ) );

		// Close the modal when clicking the close trigger.
		this.$c.body.on( 'click touchstart', '.close', this.closeModal.bind( this ) );

		// Allow the user to close the modal by hitting the esc key.
		this.$c.body.on( 'keydown', escKeyClose.bind( this ) );
	}

	/**
	 * Close if "esc" key is pressed.
	 *
	 * @param {Object} e The event.
	 */
	function escKeyClose( e ) {
		if ( 27 === e.keyCode ) {
			this.closeModal();
		}
	}

	// Attach the Modal constructor to the window.
	window.WDSModal = Modal;
})( window, jQuery );
