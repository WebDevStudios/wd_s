/**
 * Show/Hide the Search Form in the header.
 *
 * @author Corey Collins
 */

( function() {
	const headerSearch = document.querySelector( '.site-header-action' ),
		headerSearchToggle = document.querySelector( '.site-header-action .cta-button' ),
		headerSearchForm = document.querySelector( '.site-header-action .form-container' );

	if ( ! headerSearch ) {
		return;
	}

	headerSearchToggle.addEventListener( 'click', toggleSearchForm );
	document.body.addEventListener( 'keyup', hideSearchForm );
	document.body.addEventListener( 'touchstart', hideSearchForm );
	document.body.addEventListener( 'click', hideSearchForm );

	// Check to see if the search is open or not.
	function searchIsOpen() {
		if ( document.body.classList.contains( 'search-form-visible' ) ) {
			return true;
		}

		return false;
	}

	// Toggle our form display by changing body classes and aria labels.
	function toggleSearchForm() {
		document.body.classList.toggle( 'search-form-visible' );
		toggleAriaLabels();
	}

	// Toggle the aria label values.
	function toggleAriaLabels() {
		if ( searchIsOpen() ) {
			headerSearchForm.setAttribute( 'aria-hidden', 'false' );
			headerSearchToggle.setAttribute( 'aria-expanded', 'true' );
		} else {
			headerSearchForm.setAttribute( 'aria-hidden', 'true' );
			headerSearchToggle.setAttribute( 'aria-expanded', 'false' );
		}
	}

	// Hide the form if we click or tab outside of its container.
	function hideSearchForm( event ) {
		const isTargetInside = headerSearch.contains( event.target );

		if ( ! isTargetInside ) {
			document.body.classList.remove( 'search-form-visible' );
			toggleAriaLabels();
		}
	}
}() );
