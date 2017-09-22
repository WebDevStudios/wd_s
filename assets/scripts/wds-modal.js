// Modal Creation - Method 1
	// wdsModal('.modalTriggers', {}))
	// The above call will to be a factor function that returns a 'new wdsModal'

// YouTube iFrame API
	// I don't think our current code for this is being used out of the box. I think it might be there
	// just in case we want to use it.
	// https://developers.google.com/youtube/iframe_api_reference

// Tying the modal trigger and modal content by data attribute is going to have to stay intact. Initially
// I thought that we might be able to do this differently, but I don't think so. Using the data attribute
// gives us the most flexibility.

class wdsModal {

	/**
	 * Constructor
	 *
	 * @param triggerSelector The element that will trigger opening the modal.
	 * @param options Options that will override defaults.
	 */
	constructor( triggerSelector, options ) {

		/**
		 * Configuration options.
		 *
		 * Merge any user defined options into default config.
		 */
		this.config = Object.assign({
			onBefore: null,
			onAfter: null
		}, options );

		// Bind callback functions to the Modal.
		this.config.onBefore = this.config.onBefore.bind( this );
		this.config.onAfter = this.config.onAfter.bind( this );

		// Set open trigger.
		this.triggers = document.querySelectorAll( triggerSelector );

		// Set modal events.
		this.bindEvents();
	}

	// Bind events.
	bindEvents() {

	}
}
