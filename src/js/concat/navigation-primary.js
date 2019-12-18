/**
 * File: navigation-primary.js
 *
 * Helpers for the primary navigation.
 */

( function() {
	const subMenuParentItem = document.querySelectorAll( '.main-navigation .menu-item-has-children' );

	document.addEventListener( 'DOMContentLoaded', addDownArrow );
	document.addEventListener( 'DOMContentLoaded', toggleFocusClass );

	function addDownArrow() {
		subMenuParentItem.forEach( ( parentItem ) => {
			const menuItem = parentItem.querySelector( 'a' );
			menuItem.innerHTML += '<span class="caret-down" aria-hidden="true"></span>';
		} );
	}

	function toggleFocusClass() {
		subMenuParentItem.forEach( ( parentItem ) => {
			parentItem.addEventListener( 'focusin', toggleIn );
			parentItem.addEventListener( 'focusout', toggleOut );
		} );
	}

	function toggleIn( event ) {
		const parentMenuItems = getParents( event.target.parentNode, '.menu-item-has-children' );
		parentMenuItems.forEach( ( parentItem ) => {
			parentItem.classList.add( 'focus' );
		} );
	}

	function toggleOut( event ) {
		const parentMenuItems = getParents( event.target.parentNode, '.menu-item-has-children' );
		parentMenuItems.forEach( ( parentItem ) => {
			parentItem.classList.remove( 'focus' );
		} );
	}

	// Get all of the parents for a matching element and selector.
	// https://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/#getting-all-matches-up-the-tree
	var getParents = function ( elem, selector ) {

		// Element.matches() polyfill
		if (!Element.prototype.matches) {
			Element.prototype.matches =
				Element.prototype.matchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector ||
				Element.prototype.oMatchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				function(s) {
					var matches = (this.document || this.ownerDocument).querySelectorAll(s),
						i = matches.length;
					while (--i >= 0 && matches.item(i) !== this) {}
					return i > -1;
				};
		}

		// Setup parents array
		var parents = [];

		// Get matching parent elements
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// Add matching parents to array
			if ( selector ) {
				if ( elem.matches( selector ) ) {
					parents.push( elem );
				}
			} else {
				parents.push( elem );
			}
		}

		return parents;
	};
}() );
