/**
 * Show/Hide the Search Form in the header.
 *
 * @author Corey Collins
 */

( function() {
	const siteHeaderAction = document.querySelector( '.site-header-action' );

	if ( ! siteHeaderAction ) {
		return;
	}

	const headerSearchToggle = document.querySelector( '.site-header-action .cta-button' ),
		headerSearchForm = document.querySelector( '.site-header-action .form-container' );

	if ( ! headerSearchToggle || ! headerSearchForm ) {
		return;
	}

	headerSearchToggle.addEventListener( 'click', toggleSearchForm );
	document.body.addEventListener( 'keyup', hideSearchForm );
	document.body.addEventListener( 'touchstart', hideSearchForm );
	document.body.addEventListener( 'click', hideSearchForm );

	/**
	 * Check to see if the search is open or not.
	 *
	 * @since January 31, 2020
	 * @author Corey Collins
	 *
	 * @return {boolean} True if search is open, false if not.
	 */
	function searchIsOpen() {
		if ( document.body.classList.contains( 'search-form-visible' ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Toggle our form display by changing body classes and aria labels.
	 *
	 * @since January 31, 2020
	 * @author Corey Collins
	 */
	function toggleSearchForm() {
		document.body.classList.toggle( 'search-form-visible' );
		toggleAriaLabels();
	}

	/**
	 * Toggle the aria label values.
	 *
	 * @since January 31, 2020
	 * @author Corey Collins
	 */
	function toggleAriaLabels() {
		if ( searchIsOpen() ) {
			headerSearchForm.setAttribute( 'aria-hidden', 'false' );
			headerSearchToggle.setAttribute( 'aria-expanded', 'true' );
		} else {
			headerSearchForm.setAttribute( 'aria-hidden', 'true' );
			headerSearchToggle.setAttribute( 'aria-expanded', 'false' );
		}
	}

	/**
	 * Hide the form if we click or tab outside of its container.
	 *
	 * @param {Object} event The targeted element.
	 *
	 * @since January 31, 2020
	 * @author Corey Collins
	 */
	function hideSearchForm( event ) {
		const isTargetInside = siteHeaderAction.contains( event.target );

		if ( ! isTargetInside ) {
			document.body.classList.remove( 'search-form-visible' );
			toggleAriaLabels();
		}
	}
}() );
