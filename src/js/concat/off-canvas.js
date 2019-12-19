/**
 * File: off-canvas.js
 *
 * Help deal with the off-canvas mobile menu.
 */

// Make sure everything is loaded first.
if ( ( 'complete' === document.readyState || 'loading' !== document.readyState ) && ! document.documentElement.doScroll ) {
	wdsOffCanvas();
} else {
	document.addEventListener( 'DOMContentLoaded', wdsOffCanvas );
}

function wdsOffCanvas() {
	const offCanvasClose = document.querySelector( '.off-canvas-close' ),
		offCanvasContainer = document.querySelector( '.off-canvas-container' ),
		offCanvasOpen = document.querySelector( '.off-canvas-open' ),
		offCanvasScreen = document.querySelector( '.off-canvas-screen' );

	offCanvasOpen.addEventListener( 'click', toggleOffCanvas );
	offCanvasClose.addEventListener( 'click', closeOffCanvas );
	offCanvasScreen.addEventListener( 'click', closeOffCanvas );
	document.body.addEventListener( 'keydown', closeOnEscape );

	function closeOnEscape( event ) {
		if ( 27 === event.keyCode ) {
			closeOffCanvas();
		}
	}

	function closeOffCanvas() {
		offCanvasContainer.classList.remove( 'is-visible' );
		offCanvasOpen.classList.remove( 'is-visible' );
		offCanvasScreen.classList.remove( 'is-visible' );

		offCanvasContainer.setAttribute( 'aria-hidden', true );
		offCanvasOpen.setAttribute( 'aria-expanded', false );
	}

	function toggleOffCanvas() {
		if ( true === offCanvasOpen.getAttribute( 'aria-expanded' ) ) {
			closeOffCanvas();
		} else {
			openOffCanvas();
		}
	}

	function openOffCanvas() {
		offCanvasContainer.classList.add( 'is-visible' );
		offCanvasOpen.classList.add( 'is-visible' );
		offCanvasScreen.classList.add( 'is-visible' );

		offCanvasContainer.setAttribute( 'aria-hidden', false );
		offCanvasOpen.setAttribute( 'aria-expanded', true );
	}
}
