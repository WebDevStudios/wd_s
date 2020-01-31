/**
 * Accordion block functionality
 *
 * @since January 31, 2020
 * @author Shannon MacMillan, Corey Collins
 */
function wdsAccordion() {
	const accordionItems = document.querySelectorAll( '.accordion-item' ),
		accordionItemContent = document.querySelectorAll( '.accordion-item-content' );

	// Loop through each accordion on the page and add a listener for its header.
	accordionItems.forEach( ( accordion ) => {
		const accordionHeader = accordion.querySelector( '.accordion-item-header' );

		accordionHeader.addEventListener( 'click', toggleAccordion );
	} );

	// Open the hash link if one exists.
	openHashLink();

	/**
	 * Handle toggling the accordion.
	 *
	 * @param {Object} event The targeted element.
	 *
	 * @since January 31, 2020
	 * @author Shannon MacMillan, Corey Collins
	 */
	function toggleAccordion( event ) {
		accordionItemContent.forEach( function( content ) {
			const targetParent = event.target.parentNode.closest( '.accordion-item-header' );

			// If we're clicking on this accordion...
			if ( content.previousElementSibling === targetParent ) {

				// If it's already opened, close it. Otherwise, open it!
				if ( 'false' === content.getAttribute( 'aria-hidden' ) ) {
					content.setAttribute( 'aria-hidden', 'true' );
					content.parentElement.classList.remove( 'open' );
				} else {
					content.setAttribute( 'aria-hidden', 'false' );
					content.parentElement.classList.add( 'open' );
				}
			} else {
				content.setAttribute( 'aria-hidden', 'true' );
				content.parentElement.classList.remove( 'open' );
			}
		} );
	}
}

/**
 * Checks for a hash link in the URL and if one exists and matches an accordion, opens that accordion item.
 *
 * @since January 31, 2020
 * @author Shannon MacMillan, Corey Collins
 */
function openHashLink() {
	if ( ! window.location.hash ) {
		return false;
	}

	const hashAccordionItem = document.querySelector( window.location.hash ),
		hashAccordionItemHeader = hashAccordionItem.previousElementSibling,
		hashAccordionItemButton = hashAccordionItemHeader.querySelector( '.accordion-item-toggle' );

	hashAccordionItemButton.click();
}

// Handles ACF + Goots backend integration.
if ( window.acf ) {
	window.acf.addAction( 'render_block_preview/type=wds-accordion', wdsAccordion );
}

// Fire off our function.
wdsAccordion();
