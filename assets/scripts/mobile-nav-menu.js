/**
 * file mobile-nav-menu.js
 *
 * Mobile Navigation Menu
 */
window.wdsMobileNav = {};
( function ( window, $, app ) {
	// Constructor
	app.init = function () {
		app.cache();

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			'window': $( window ),
			'body': $( 'body' ),
			'mobileNavMenuContainer': $( '.mobile-nav-menu' ),
			'menuItemCount': $( '.mobile-nav-menu .mobile-nav > li' ).length
		};
	};

	// Combine all events
	app.bindEvents = function () {
		// Do nothing if there are not more than 5 links
		if ( app.$c.menuItemCount <= 5 ) {
			return;
		}

		// Replace the fifth menu item with a "more" link
		app.replaceLastMenuItem();

		// Show more items when the "more" item is clicked
		app.$c.body.on( 'click', '.mobile-menu-more-link', app.displayMoreItems );

		// Add the more classes when hovering a parent menu item
		app.$c.body.on( 'click', '.mobile-nav-menu .menu-item-has-children > a', app.setSecondClick );

		// Hide the menu when the close button is clicked
		app.$c.body.on( 'click', '.close-mobile-menu', app.hideMoreItems );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.mobileNavMenuContainer.length;
	};

	// Replace the fifth menu item with a "more" link
	app.replaceLastMenuItem = function () {
		// By this point, we know we have at least 5 items
		// Add our "more" link
		$( '.mobile-nav-menu .mobile-nav > li:nth-child(4)' ).after( '<li class="mobile-menu-more-link"><a href="#"><span><i class="more-icon"></i>More</span></a></li>' );

		var boundary = $( '.mobile-nav-menu .mobile-nav > li:nth-child(6)' );

		$( '<ul class="menu mobile-nav-menu-hidden">' ).insertAfter( boundary.parent() ).append( boundary.nextAll().andSelf() );
	};

	// Toggle the menu items on a click of the "more" link
	app.displayMoreItems = function ( event ) {
		event.preventDefault();

		// Hide the menu if it's already opened
		if ( app.$c.body.hasClass( 'mobile-menu-more' ) && !app.$c.body.hasClass( 'sub-menu-more' ) ) {
			app.removeMenuClasses();
			return;
		}

		// Remove any instances of classes already in place
		// This makes sure we can click to switch between submenus
		app.removeMenuClasses();

		app.$c.mobileNavMenuContainer.toggleClass( 'more' );
		app.$c.body.toggleClass( 'mobile-menu-more' );
	};

	// Let the submenu parent be a normal link on the second click
	app.setSecondClick = function ( event ) {
		// Check to see if this parent has the visible class
		if( !$( this ).parent( 'li' ).hasClass( 'visible' ) ) {
			// Don't let the link fire as a normal link
			event.preventDefault();
		}

		// Remove any instances of classes already in place
		// This makes sure we can click to switch between submenus
		app.removeMenuClasses();

		// Toggle the class to display the submenu
		$( this ).parent( 'li' ).toggleClass( 'visible' );

		// Add our "more" classes as we do when clicking the "More" link
		app.$c.mobileNavMenuContainer.toggleClass( 'more' );
		app.$c.body.toggleClass( 'mobile-menu-more sub-menu-more' );
	};

	// Hide the menu items
	app.hideMoreItems = function () {
		app.removeMenuClasses();
	};

	app.removeMenuClasses = function () {
		// Remove any instances of classes already in place
		// This makes sure we can click to switch between submenus
		app.$c.body.removeClass( 'mobile-menu-more sub-menu-more' );
		app.$c.mobileNavMenuContainer.removeClass( 'more' );
		$( '.menu-item-has-children' ).removeClass( 'visible' );
	};

	// Engage
	$( app.init );
} )( window, jQuery, window.wdsMobileNav );
