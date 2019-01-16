/**
 * File: mobile-menu.js
 *
 * Create an accordion style dropdown.
 */
window.wdsMobileMenu = {};
( function( window, $, app ) {

	// Constructor.
	app.init = function() {
		app.cache();

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function() {
		app.$c = {
			body: $( 'body' ),
			window: $( window ),
			subMenuContainer: $( '.mobile-menu .sub-menu, .utility-navigation .sub-menu' ),
			subSubMenuContainer: $( '.mobile-menu .sub-menu .sub-menu' ),
			subMenuParentItem: $( '.mobile-menu li.menu-item-has-children, .utility-navigation li.menu-item-has-children' ),
			offCanvasContainer: $( '.off-canvas-container' )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.window.on( 'load', app.addDownArrow );
		app.$c.subMenuParentItem.on( 'click', app.toggleSubmenu );
		app.$c.subMenuParentItem.on( 'transitionend', app.resetSubMenu );
		app.$c.offCanvasContainer.on( 'transitionend', app.forceCloseSubmenus );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.subMenuContainer.length;
	};

	// Reset the submenus after it's done closing.
	app.resetSubMenu = function() {

		// When the list item is done transitioning in height,
		// remove the classes from the submenu so it is ready to toggle again.
		if ( $( this ).is( 'li.menu-item-has-children' ) && ! $( this ).hasClass( 'is-visible' ) ) {
			$( this ).find( 'ul.sub-menu' ).removeClass( 'slideOutLeft is-visible' );
		}

	};

	// Slide out the submenu items.
	app.slideOutSubMenus = function( el ) {

		// If this item's parent is visible and this is not, bail.
		if ( el.parent().hasClass( 'is-visible' ) && ! el.hasClass( 'is-visible' ) ) {
			return;
		}

		// If this item's parent is visible and this item is visible, hide its submenu then bail.
		if ( el.parent().hasClass( 'is-visible' ) && el.hasClass( 'is-visible' ) ) {
			el.removeClass( 'is-visible' ).find( '.sub-menu' ).removeClass( 'slideInLeft' ).addClass( 'slideOutLeft' );
			return;
		}

		app.$c.subMenuContainer.each( function() {

			// Only try to close submenus that are actually open.
			if ( $( this ).hasClass( 'slideInLeft' ) ) {

				// Close the parent list item, and set the corresponding button aria to false.
				$( this ).parent().removeClass( 'is-visible' ).find( '.parent-indicator' ).attr( 'aria-expanded', false );

				// Slide out the submenu.
				$( this ).removeClass( 'slideInLeft' ).addClass( 'slideOutLeft' );
			}

		} );
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function() {

		app.$c.subMenuParentItem.find( 'a:first' ).after( '<button type="button" aria-expanded="false" class="parent-indicator" aria-label="Open submenu"><span class="down-arrow"></span></button>' );
	};

	// Deal with the submenu.
	app.toggleSubmenu = function( e ) {

		let el = $( this ), // The menu element which was clicked on.
			subMenu = el.children( 'ul.sub-menu' ), // The nearest submenu.
			$target = $( e.target ); // the element that's actually being clicked (child of the li that triggered the click event).

		// Figure out if we're clicking the button or its arrow child,
		// if so, we can just open or close the menu and bail.
		if ( $target.hasClass( 'down-arrow' ) || $target.hasClass( 'parent-indicator' ) ) {

			// First, collapse any already opened submenus.
			app.slideOutSubMenus( el );

			if ( ! subMenu.hasClass( 'is-visible' ) ) {

				// Open the submenu.
				app.openSubmenu( el, subMenu );

			}

			return false;
		}

	};

	// Open a submenu.
	app.openSubmenu = function( parent, subMenu ) {

		// Expand the list menu item, and set the corresponding button aria to true.
		parent.addClass( 'is-visible' ).find( '.parent-indicator' ).attr( 'aria-expanded', true );

		// Slide the menu in.
		subMenu.addClass( 'is-visible animated slideInLeft' );
	};

	// Force close all the submenus when the main menu container is closed.
	app.forceCloseSubmenus = function( event ) {
		if ( $( event.target ).hasClass( 'off-canvas-container' ) ) {

			// Focus offcanvas menu for a11y.
			app.$c.offCanvasContainer.focus();

			// The transitionend event triggers on open and on close, need to make sure we only do this on close.
			if ( ! $( this ).hasClass( 'is-visible' ) ) {
				app.$c.subMenuParentItem.removeClass( 'is-visible' ).find( '.parent-indicator' ).attr( 'aria-expanded', false );
				app.$c.subMenuContainer.removeClass( 'is-visible slideInLeft' );
				app.$c.body.css( 'overflow', 'visible' );
				app.$c.body.unbind( 'touchstart' );
			}

			if ( $( this ).hasClass( 'is-visible' ) ) {
				app.$c.body.css( 'overflow', 'hidden' );
				app.$c.body.bind( 'touchstart', function( e ) {
					if ( ! $( e.target ).parents( '.contact-modal' )[0] ) {
						e.preventDefault();
					}
				} );
			}
		}
	};

	// Engage!
	$( app.init );

}( window, jQuery, window.wdsMobileMenu ) );
