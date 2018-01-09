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
		this.focusableItems = `a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])
		button:not([disabled]), iframe, object, embed, [tabindex="0"]`;
		this.firstStop = null;
		this.lastStop = null;

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
	 * Keyboard trapping ideas. https://www.youtube.com/watch?v=BoAsayPVogE.
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

		this.$targetModal.on( 'keydown', trapKeys.bind( this ) );

		// Add classes to the modal and body.
		this.$targetModal.addClass( 'modal-open' );
		this.$c.body.addClass( 'modal-open' );

		// Find all focusable elements inside the modal.
		this.$c.focusElements = this.$targetModal.find( this.focusableItems );

		// Set first and last elements.
		this.firstStop = this.$c.focusElements[0];
		this.lastStop = this.$c.focusElements[this.$c.focusElements.length - 1];

		// Focus first element.
		this.firstStop.focus();
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
	 * Close the modal by clicking outside of it.
	 *
	 * @param {Object} e The event.
	 */
	Modal.prototype.closeModalByClick = function( e ) {

		// If the parent container is NOT the modal dialog container, close the modal
		if ( ! $( e.target ).parents( 'div' ).hasClass( 'modal-dialog' ) ) {
			this.closeModal();
		}
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

		// Allow the user to close the modal by clicking outside of the modal.
		this.$c.body.on( 'click touchstart', 'div.modal-open', this.closeModalByClick.bind( this ) );

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

	/**
	 * Trap the focus inside an open modal.
	 *
	 * @param {Object} e The event.
	 */
	function trapKeys( e ) {
		// If pressing the Tab key.
		if ( 9 === e.keyCode ) {

			// If pressing Shift + Tab.
			if ( e.shiftKey ) {
				if ( this.firstStop === document.activeElement ) {
					e.preventDefault();
					this.lastStop.focus();
				}
			} else {
				if ( this.lastStop === document.activeElement ) {
					e.preventDefault();
					this.firstStop.focus();
				}
			}
		}
	}

	// Attach the Modal constructor to the window.
	window.WDSModal = Modal;
})( window, jQuery );
