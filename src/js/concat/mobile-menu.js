/**
 * File: mobile-menu.js
 *
 * Create an accordion style dropdown.
 */

// Make sure everything is loaded first.
if ( 'complete' === document.readyState || 'loading' !== document.readyState && ! document.documentElement.doScroll ) {
	wdsMobileMenu();
} else {
	document.addEventListener( 'DOMContentLoaded', wdsMobileMenu );
}

// Handle our mobile menus.
function wdsMobileMenu() {
	const subMenuParentItem = document.querySelectorAll( '.mobile-menu li.menu-item-has-children, .utility-navigation li.menu-item-has-children' );

	subMenuParentItem.forEach( ( subMenuParent ) => {
		const menuItem = subMenuParent.querySelector( 'a' );

		menuItem.innerHTML += '<button type="button" aria-expanded="false" class="parent-indicator" aria-label="Open submenu"><span class="down-arrow"></span></button>';

		const subMenuTrigger = document.querySelectorAll( '.parent-indicator' );

		subMenuTrigger.forEach( ( trigger ) => {
			trigger.addEventListener( 'click', toggleSubmenu );
		} );
	} );

	// Open/Close a submenu.
	function toggleSubmenu( event ) {
		event.preventDefault();

		const targetElement = event.target,
			targetParent = targetElement.parentNode.closest( '.menu-item-has-children' ),
			subMenu = targetParent.querySelector( 'ul.sub-menu' );

		closeAllSubmenus( targetParent );
		maybeOpenSubmenu( targetParent, subMenu );
	}

	// Open a submenu.
	function maybeOpenSubmenu( parent, subMenu ) {

		if ( parent.classList.contains( 'is-visible' ) ) {
			closeSubmenu( parent, subMenu );
			return;
		}

		// Expand the list menu item, and set the corresponding button aria to true.
		parent.classList.add( 'is-visible' );
		parent.querySelector( '.parent-indicator' ).setAttribute( 'aria-expanded', true );

		// Slide the menu in.
		subMenu.classList.add( 'is-visible', 'animated', 'slideInLeft' );
	};

	// Close a submenu.
	function closeSubmenu( parent, subMenu ) {
		parent.classList.remove( 'is-visible' );
		parent.querySelector( '.parent-indicator' ).setAttribute( 'aria-expanded', false );
		subMenu.classList.remove( 'is-visible', 'animated', 'slideInLeft' );
	};

	// Close all open submenus on the same level/hierarchy as the menu we're trying to open.
	function closeAllSubmenus( targetParent ) {

		const submenuSiblings = getSiblings( targetParent );

		submenuSiblings.forEach( ( sibling ) => {
			sibling.classList.remove( 'is-visible' );

			if ( sibling.querySelector( '.parent-indicator' ) ) {
				sibling.querySelector( '.parent-indicator' ).setAttribute( 'aria-expanded', false );
			}

			if ( sibling.querySelector( '.sub-menu' ) ) {
				sibling.querySelector( '.sub-menu' ).classList.remove( 'is-visible', 'animated', 'slideInLeft' );
			}
		} );
	}

	// Find siblings of an item.
	let getSiblings = function( element ) {

		let siblings = [];
		let sibling = element.parentNode.firstChild;

		while ( sibling ) {

			if ( sibling.nodeType === 1 && sibling !== element ) {
				siblings.push( sibling );
			}

			sibling = sibling.nextSibling;
		}

		return siblings;
	};
}
