/**
 * File modal.js
 *
 * Deal with multiple modals and their media.
 */

// Make sure everything is loaded first.
if ( ( 'complete' === document.readyState || 'loading' !== document.readyState ) && ! document.documentElement.doScroll ) {
	wdsModals();
} else {
	document.addEventListener( 'DOMContentLoaded', wdsModals );
}

/**
 * Fire off our modal functions.
 *
 * @since January 31, 2020
 * @author Corey Collins
 */
function wdsModals() {
	const modalTrigger = document.querySelectorAll( '.modal-trigger' ),
		modalClose = document.querySelectorAll( '.modal .close' ),
		pageBody = document.body;

	// Loop through each modal trigger on the page and add a listener for its header.
	modalTrigger.forEach( ( trigger ) => {
		trigger.addEventListener( 'click', openModal );
	} );

	modalClose.forEach( ( trigger ) => {
		trigger.addEventListener( 'click', closeModalOnCloseButton );
	} );

	pageBody.addEventListener( 'keydown', closeOnEscape );
	pageBody.addEventListener( 'click', closeOnClick );

	/**
	 * Open a modal when we trigger it.
	 *
	 * @param {Object} event The triggered event.
	 *
	 * @since January 31, 2020
	 * @author Corey Collins
	 */
	function openModal( event ) {
		const thisTarget = event.target,
			thisModalTarget = thisTarget.getAttribute( 'data-target' ),
			thisModal = document.querySelector( thisModalTarget ),
			focusableChildren = thisModal.querySelectorAll( 'a, input, button' );

		pageBody.classList.add( 'modal-open' );
		thisModal.classList.add( 'modal-open' );
		thisModal.setAttribute( 'aria-hidden', false );

		if ( 0 < focusableChildren.length ) {
			focusableChildren[ 0 ].focus();
		}
	}

	/**
	 * Close a modal when we hit the close button.
	 *
	 * @param {Object} event The triggered event.
	 *
	 * @since January 31, 2020
	 * @author Corey Collins
	 */
	function closeModalOnCloseButton( event ) {
		const thisTarget = event.target,
			thisModalTarget = thisTarget.getAttribute( 'data-target' ),
			thisModal = document.querySelector( thisModalTarget ),
			modalIframe = thisModal.querySelector( 'iframe' );

		pageBody.classList.remove( 'modal-open' );
		thisModal.classList.remove( 'modal-open' );
		thisModal.setAttribute( 'aria-hidden', true );

		if ( modalIframe ) {
			const iframeURL = modalIframe.getAttribute( 'src' );

			modalIframe.setAttribute( 'src', '' );
			modalIframe.setAttribute( 'src', iframeURL );
		}
	}

	/**
	 * Close the modal when we hit the escape key.
	 *
	 * @param {Object} event The triggered event.
	 *
	 * @since January 31, 2020
	 * @author Corey Collins
	 */
	function closeOnEscape( event ) {
		if ( ! pageBody.classList.contains( 'modal-open' ) ) {
			return;
		}

		const currentlyOpenModal = document.querySelector( '.modal.modal-open' ),
			modalIframe = currentlyOpenModal.querySelector( 'iframe' );

		if ( 27 === event.keyCode ) {
			currentlyOpenModal.setAttribute( 'aria-hidden', true );
			currentlyOpenModal.classList.remove( 'modal-open' );
			pageBody.classList.remove( 'modal-open' );

			if ( modalIframe ) {
				const iframeURL = modalIframe.getAttribute( 'src' );
				modalIframe.setAttribute( 'src', '' );
				modalIframe.setAttribute( 'src', iframeURL );
			}
		}
	}

	/**
	 * Close the modal when we hit outside of the modal area.
	 *
	 * @param {Object} event The triggered event.
	 *
	 * @since January 31, 2020
	 * @author Corey Collins
	 */
	function closeOnClick( event ) {
		const clickedElement = event.target;

		if ( pageBody.classList.contains( 'modal-open' ) ) {
			if ( clickedElement.classList.contains( 'modal-open' ) ) {
				const modalIframe = clickedElement.querySelector( 'iframe' );

				pageBody.classList.remove( 'modal-open' );
				clickedElement.classList.remove( 'modal-open' );
				clickedElement.setAttribute( 'aria-hidden', true );

				if ( modalIframe ) {
					const iframeURL = modalIframe.getAttribute( 'src' );

					modalIframe.setAttribute( 'src', '' );
					modalIframe.setAttribute( 'src', iframeURL );
				}
			}
		}
	}
}
