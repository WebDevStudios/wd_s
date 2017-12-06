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
	 *
	 * @param {Object} e Close modal event.
	 */
	Modal.prototype.closeModal = function() {

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
	}

	// Attach the Modal constructor to the window.
	window.WDSModal = Modal;
})( window, jQuery );
