( function( window, $ ) {

	/**
	 * Modal
	 *
	 * @constructor
	 * @param {Object} options Configuration options.
	 */
	function Modal( options ) {
		this.$c = {};

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
	 * @param {Event} e Either click or touchstart event.
	 */
	Modal.prototype.openModal = function( e ) {
		e.preventDefault();
		console.log( 'opening modal' );
	};

	/**
	 * Bind modal events.
	 *
	 * @private
	 */
	function bindEvents() {
		this.$c.body.on( 'click touchstart', '.modal-trigger', this.openModal );
	}

	// Attach the Modal constructor to the window.
	window.WDSModal = Modal;
})( window, jQuery );
