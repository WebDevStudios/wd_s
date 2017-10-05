( function( window, $ ) {

	/**
	 * Modal
	 *
	 * @constructor
	 * @param {Object} options Configuration options.
	 */
	function Modal( options ) {

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
		const target = $trigger.data( 'target' ) || $trigger.parents().data( 'target' );
		let $targetModal;

		// If there is a specified target. Otherwise default to config.
		if ( target ) {
			$targetModal = $( target );
		} else {
			$targetModal = $( this.config.content );
		}

		// Add classes to the modal and body.
		$targetModal.addClass( 'modal-open' );
		this.$c.body.addClass( 'modal-open' );
	};

	/**
	 * Close the modal.
	 *
	 * @param {Object} e Close modal event.
	 */
	Modal.prototype.closeModal = function( e ) {

	};

	/**
	 * Bind modal events.
	 *
	 * @private
	 */
	function bindEvents() {
		this.$c.body.on( 'click touchstart', this.config.trigger, this.openModal.bind( this ) );
	}

	// Attach the Modal constructor to the window.
	window.WDSModal = Modal;
})( window, jQuery );
