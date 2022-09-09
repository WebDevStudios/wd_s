/**
 * File accordion.js
 *
 */
import './style.scss';
console.log( 'accordion.js' );

// Make sure everything is loaded first.
if (
	( 'complete' === document.readyState ||
		'loading' !== document.readyState ) &&
	! document.documentElement.doScroll
) {
	wdsAccordion();
} else {
	document.addEventListener( 'DOMContentLoaded', wdsAccordion );
}

/**
 * Start Accordion function
 *
 */
function wdsAccordion() {
	const accordionItems = document.querySelectorAll(
			'.wds-module-accordion .accordion-item'
		),
		accordionTriggers = document.querySelectorAll(
			'.wds-module-accordion .accordion-title'
		),
		showClass = 'accordion-item-is-open';

	accordionItems.forEach( ( item ) => {
		const isOpen = item.classList.contains( showClass );
		const trigger = item.querySelector( '.accordion-title' );
		trigger.setAttribute( 'aria-expanded', isOpen );
	} );

	accordionTriggers.forEach( ( trigger ) => {
		trigger.addEventListener( 'click', toggleAccordion );
	} );

	/**
	 * Open or close the accordion.
	 *
	 * @param {Object} event the triggered event.
	 */
	function toggleAccordion( event ) {
		const target = event.target,
			accordionItem = target.closest( '.accordion-item' ),
			isOpen = target.getAttribute( 'aria-expanded' ) === 'true',
			ariaValue = isOpen ? 'false' : 'true';

		if ( ! isOpen ) {
			accordionItem.classList.add( showClass );
		} else {
			accordionItem.classList.remove( showClass );
		}

		target.setAttribute( 'aria-expanded', ariaValue );
	}
}
