/**
 * Accordion block functionality
 *
 * @author Shannon MacMillan, Corey Collins
 */
window.accordionBlockToggle = {};
( function( window, $, app ) {

	// Constructor
	app.init = function() {
		app.cache();

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function() {
		app.$c = {
			window: $( window ),
			html: $( 'html' ),
			accordion: $( '.accordion' ),
			items: $( '.accordion-item' ),
			headers: $( '.accordion-item-header' ),
			contents: $( '.accordion-item-content' ),
			button: $( '.accordion-item-toggle' ),
			anchorID: $( window.location.hash )
		};
	};

	// Combine all events
	app.bindEvents = function() {
		app.$c.headers.on( 'click touchstart', app.toggleAccordion );
		app.$c.button.on( 'click touchstart', app.toggleAccordion );
		app.$c.window.on( 'load', app.openHashAccordion );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.accordion.length;
	};

	app.toggleAccordion = function() {

		// Add the open class to the item.
		$( this ).parents( '.accordion-item' ).toggleClass( 'open' );

		// Is this one expanded?
		let isExpanded = $( this ).parents( '.accordion-item' ).hasClass( 'open' );

		// Set this button's aria-expanded value.
		$( this ).parents( '.accordion-item' ).find( '.accordion-item-toggle' ).attr( 'aria-expanded', isExpanded ? 'true' : 'false' );

		// Set all other items in this block to aria-hidden=true.
		$( this ).parents( '.accordion-block' ).find( '.accordion-item-content' ).not( $( this ).parents( '.accordion-item' ) ).attr( 'aria-hidden', 'true' );

		// Set this item to aria-hidden=false.
		$( this ).parents( '.accordion-item' ).find( '.accordion-item-content' ).attr( 'aria-hidden', isExpanded ? 'false' : 'true' );

		// Hide the other panels.
		$( this ).parents( '.accordion-block' ).find( '.accordion-item' ).not( $( this ).parents( '.accordion-item' ) ).removeClass( 'open' );
		$( this ).parents( '.accordion-block' ).find( '.accordion-item-toggle' ).not( $( this ) ).attr( 'aria-expanded', 'false' );

		return false;
	};

	app.openHashAccordion = function() {

		if ( ! app.$c.anchorID.selector ) {
			return;
		}

		// Trigger a click on the button closest to this accordion.
		app.$c.anchorID.parents( '.accordion-item' ).find( '.accordion-item-toggle' ).trigger( 'click' );

		// Not setting a cached variable as it doesn't seem to grab the height properly.
		const adminBarHeight = $( '#wpadminbar' ).length ? $( '#wpadminbar' ).height() : 0;

		// Animate to the div for a nicer experience.
		app.$c.html.animate( {
			scrollTop: app.$c.anchorID.offset().top - adminBarHeight
		}, 'slow' );
	};

	// Engage
	app.init();

} ( window, jQuery, window.accordionBlockToggle ) );
