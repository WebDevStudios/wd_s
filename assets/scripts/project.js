'use strict';

/**
 * Accordion block functionality
 *
 * @author Shannon MacMillan, Corey Collins
 */
window.accordionBlockToggle = {};
( function( window, $, app ) {

	// Constructor
	app.init = function() {
		app.cache();

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function() {
		app.$c = {
			window: $( window ),
			html: $( 'html' ),
			accordion: $( '.accordion' ),
			items: $( '.accordion-item' ),
			headers: $( '.accordion-item-header' ),
			contents: $( '.accordion-item-content' ),
			button: $( '.accordion-item-toggle' ),
			anchorID: $( window.location.hash )
		};
	};

	// Combine all events
	app.bindEvents = function() {
		app.$c.headers.on( 'click touchstart', app.toggleAccordion );
		app.$c.button.on( 'click touchstart', app.toggleAccordion );
		app.$c.window.on( 'load', app.openHashAccordion );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.accordion.length;
	};

	app.toggleAccordion = function() {

		// Add the open class to the item.
		$( this ).parents( '.accordion-item' ).toggleClass( 'open' );

		// Is this one expanded?
		var isExpanded = $( this ).parents( '.accordion-item' ).hasClass( 'open' );

		// Set this button's aria-expanded value.
		$( this ).parents( '.accordion-item' ).find( '.accordion-item-toggle' ).attr( 'aria-expanded', isExpanded ? 'true' : 'false' );

		// Set all other items in this block to aria-hidden=true.
		$( this ).parents( '.accordion-block' ).find( '.accordion-item-content' ).not( $( this ).parents( '.accordion-item' ) ).attr( 'aria-hidden', 'true' );

		// Set this item to aria-hidden=false.
		$( this ).parents( '.accordion-item' ).find( '.accordion-item-content' ).attr( 'aria-hidden', isExpanded ? 'false' : 'true' );

		// Hide the other panels.
		$( this ).parents( '.accordion-block' ).find( '.accordion-item' ).not( $( this ).parents( '.accordion-item' ) ).removeClass( 'open' );
		$( this ).parents( '.accordion-block' ).find( '.accordion-item-toggle' ).not( $( this ) ).attr( 'aria-expanded', 'false' );

		return false;
	};

	app.openHashAccordion = function() {

		if ( ! app.$c.anchorID.selector ) {
			return;
		}

		// Trigger a click on the button closest to this accordion.
		app.$c.anchorID.parents( '.accordion-item' ).find( '.accordion-item-toggle' ).trigger( 'click' );

		// Not setting a cached variable as it doesn't seem to grab the height properly.
		var adminBarHeight = $( '#wpadminbar' ).length ? $( '#wpadminbar' ).height() : 0;

		// Animate to the div for a nicer experience.
		app.$c.html.animate( {
			scrollTop: app.$c.anchorID.offset().top - adminBarHeight
		}, 'slow' );
	};

	// Engage
	app.init();
} ( window, jQuery, window.accordionBlockToggle ) );
'use strict';

/**
 * File carousel.js
 *
 * Deal with the Slick carousel.
 */
window.wdsCarousel = {};
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
			window: $( window ),
			theCarousel: $( '.carousel' )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.window.on( 'load', app.doSlick );
		app.$c.window.on( 'load', app.doFirstAnimation );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.theCarousel.length;
	};

	// Animate the first slide on window load.
	app.doFirstAnimation = function() {

		// Get the first slide content area and animation attribute.
		var firstSlide = app.$c.theCarousel.find( '[data-slick-index=0]' ),
		    firstSlideContent = firstSlide.find( '.slide-content' ),
		    firstAnimation = firstSlideContent.attr( 'data-animation' );

		// Add the animation class to the first slide.
		firstSlideContent.addClass( firstAnimation );
	};

	// Animate the slide content.
	app.doAnimation = function() {
		var slides = $( '.slide' ),
		    activeSlide = $( '.slick-current' ),
		    activeContent = activeSlide.find( '.slide-content' ),


		// This is a string like so: 'animated someCssClass'.
		animationClass = activeContent.attr( 'data-animation' ),
		    splitAnimation = animationClass.split( ' ' ),


		// This is the 'animated' class.
		animationTrigger = splitAnimation[0];

		// Go through each slide to see if we've already set animation classes.
		slides.each( function() {
			var slideContent = $( this ).find( '.slide-content' );

			// If we've set animation classes on a slide, remove them.
			if ( slideContent.hasClass( 'animated' ) ) {

				// Get the last class, which is the animate.css class.
				var lastClass = slideContent.attr( 'class' ).split( ' ' ).pop();

				// Remove both animation classes.
				slideContent.removeClass( lastClass ).removeClass( animationTrigger );
			}
		} );

		// Add animation classes after slide is in view.
		activeContent.addClass( animationClass );
	};

	// Allow background videos to autoplay.
	app.playBackgroundVideos = function() {

		// Get all the videos in our slides object.
		$( 'video' ).each( function() {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		} );
	};

	// Kick off Slick.
	app.doSlick = function() {
		app.$c.theCarousel.on( 'init', app.playBackgroundVideos );

		app.$c.theCarousel.slick( {
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: true,
			dots: true,
			focusOnSelect: true,
			waitForAnimate: true
		} );

		app.$c.theCarousel.on( 'afterChange', app.doAnimation );
	};

	// Engage!
	$( app.init );
} ( window, jQuery, window.wdsCarousel ) );
'use strict';

/**
 * Show/Hide the Search Form in the header.
 *
 * @author Corey Collins
 */
window.ShowHideSearchForm = {};
( function( window, $, app ) {

	// Constructor
	app.init = function() {
		app.cache();

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function() {
		app.$c = {
			window: $( window ),
			body: $( 'body' ),
			headerSearchForm: $( '.site-header-action .cta-button' )
		};
	};

	// Combine all events
	app.bindEvents = function() {
		app.$c.headerSearchForm.on( 'keyup touchstart click', app.showHideSearchForm );
		app.$c.body.on( 'keyup touchstart click', app.hideSearchForm );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.headerSearchForm.length;
	};

	// Adds the toggle class for the search form.
	app.showHideSearchForm = function() {
		app.$c.body.toggleClass( 'search-form-visible' );

		return false;
	};

	// Hides the search form if we click outside of its container.
	app.hideSearchForm = function( event ) {

		if ( ! $( event.target ).parents( 'div' ).hasClass( 'site-header-action' ) ) {
			app.$c.body.removeClass( 'search-form-visible' );
		}
	};

	// Engage
	$( app.init );
} ( window, jQuery, window.ShowHideSearchForm ) );
'use strict';

/**
 * File js-enabled.js
 *
 * If Javascript is enabled, replace the <body> class "no-js".
 */
document.body.className = document.body.className.replace( 'no-js', 'js' );
'use strict';

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
		app.$c.subMenuParentItem.prepend( '<button type="button" aria-expanded="false" class="parent-indicator" aria-label="Open submenu"><span class="down-arrow"></span></button>' );
	};

	// Deal with the submenu.
	app.toggleSubmenu = function( e ) {

		var el = $( this ),

		    // The menu element which was clicked on.
		subMenu = el.children( 'ul.sub-menu' ),

		    // The nearest submenu.
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
	app.forceCloseSubmenus = function() {

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
	};

	// Engage!
	$( app.init );
} ( window, jQuery, window.wdsMobileMenu ) );
'use strict';

/**
 * File modal.js
 *
 * Deal with multiple modals and their media.
 */
window.wdsModal = {};
( function( window, $, app ) {

	var $modalToggle = void 0,
	    $focusableChildren = void 0,
	    $player = void 0,
	    $tag = document.createElement( 'script' ),
	    $firstScriptTag = document.getElementsByTagName( 'script' )[0],
	    YT = void 0;

	// Constructor.
	app.init = function() {
		app.cache();

		if ( app.meetsRequirements() ) {
			$firstScriptTag.parentNode.insertBefore( $tag, $firstScriptTag );
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function() {
		app.$c = {
			'body': $( 'body' )
		};
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return $( '.modal-trigger' ).length;
	};

	// Combine all events.
	app.bindEvents = function() {

		// Trigger a modal to open.
		app.$c.body.on( 'click touchstart', '.modal-trigger', app.openModal );

		// Trigger the close button to close the modal.
		app.$c.body.on( 'click touchstart', '.close', app.closeModal );

		// Allow the user to close the modal by hitting the esc key.
		app.$c.body.on( 'keydown', app.escKeyClose );

		// Allow the user to close the modal by clicking outside of the modal.
		app.$c.body.on( 'click touchstart', 'div.modal-open', app.closeModalByClick );

		// Listen to tabs, trap keyboard if we need to
		app.$c.body.on( 'keydown', app.trapKeyboardMaybe );
	};

	// Open the modal.
	app.openModal = function() {

		// Store the modal toggle element
		$modalToggle = $( this );

		// Figure out which modal we're opening and store the object.
		var $modal = $( $( this ).data( 'target' ) );

		// Display the modal.
		$modal.addClass( 'modal-open' );

		// Add body class.
		app.$c.body.addClass( 'modal-open' );

		// Find the focusable children of the modal.
		// This list may be incomplete, really wish jQuery had the :focusable pseudo like jQuery UI does.
		// For more about :input see: https://api.jquery.com/input-selector/
		$focusableChildren = $modal.find( 'a, :input, [tabindex]' );

		// Ideally, there is always one (the close button), but you never know.
		if ( 0 < $focusableChildren.length ) {

			// Shift focus to the first focusable element.
			$focusableChildren[0].focus();
		}
	};

	// Close the modal.
	app.closeModal = function() {

		// Figure the opened modal we're closing and store the object.
		var $modal = $( $( 'div.modal-open .close' ).data( 'target' ) ),


		// Find the iframe in the $modal object.
		$iframe = $modal.find( 'iframe' );

		// Only do this if there are any iframes.
		if ( $iframe.length ) {

			// Get the iframe src URL.
			var url = $iframe.attr( 'src' );

			// Removing/Readding the URL will effectively break the YouTube API.
			// So let's not do that when the iframe URL contains the enablejsapi parameter.
			if ( ! url.includes( 'enablejsapi=1' ) ) {

				// Remove the source URL, then add it back, so the video can be played again later.
				$iframe.attr( 'src', '' ).attr( 'src', url );
			} else {

				// Use the YouTube API to stop the video.
				$player.stopVideo();
			}
		}

		// Finally, hide the modal.
		$modal.removeClass( 'modal-open' );

		// Remove the body class.
		app.$c.body.removeClass( 'modal-open' );

		// Revert focus back to toggle element
		$modalToggle.focus();
	};

	// Close if "esc" key is pressed.
	app.escKeyClose = function( event ) {
		if ( 27 === event.keyCode ) {
			app.closeModal();
		}
	};

	// Close if the user clicks outside of the modal
	app.closeModalByClick = function( event ) {

		// If the parent container is NOT the modal dialog container, close the modal
		if ( ! $( event.target ).parents( 'div' ).hasClass( 'modal-dialog' ) ) {
			app.closeModal();
		}
	};

	// Trap the keyboard into a modal when one is active.
	app.trapKeyboardMaybe = function( event ) {

		// We only need to do stuff when the modal is open and tab is pressed.
		if ( 9 === event.which && 0 < $( '.modal-open' ).length ) {
			var $focused = $( ':focus' ),
			    focusIndex = $focusableChildren.index( $focused );

			if ( 0 === focusIndex && event.shiftKey ) {

				// If this is the first focusable element, and shift is held when pressing tab, go back to last focusable element.
				$focusableChildren[$focusableChildren.length - 1].focus();
				event.preventDefault();
			} else if ( ! event.shiftKey && focusIndex === $focusableChildren.length - 1 ) {

				// If this is the last focusable element, and shift is not held, go back to the first focusable element.
				$focusableChildren[0].focus();
				event.preventDefault();
			}
		}
	};

	// Hook into YouTube <iframe>.
	app.onYouTubeIframeAPIReady = function() {
		var $modal = $( 'div.modal' ),
		    $iframeid = $modal.find( 'iframe' ).attr( 'id' );

		$player = new YT.Player( $iframeid, {
			events: {
				'onReady': app.onPlayerReady,
				'onStateChange': app.onPlayerStateChange
			}
		} );
	};

	// Do something on player ready.
	app.onPlayerReady = function() {};

	// Do something on player state change.
	app.onPlayerStateChange = function() {

		// Set focus to the first focusable element inside of the modal the player is in.
		$( event.target.a ).parents( '.modal' ).find( 'a, :input, [tabindex]' ).first().focus();
	};

	// Engage!
	$( app.init );
} ( window, jQuery, window.wdsModal ) );
'use strict';

/**
 * File: navigation-primary.js
 *
 * Helpers for the primary navigation.
 */
window.wdsPrimaryNavigation = {};
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
			window: $( window ),
			subMenuContainer: $( '.main-navigation .sub-menu' ),
			subMenuParentItem: $( '.main-navigation li.menu-item-has-children' )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.window.on( 'load', app.addDownArrow );
		app.$c.subMenuParentItem.find( 'a' ).on( 'focusin focusout', app.toggleFocus );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.subMenuContainer.length;
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function() {
		app.$c.subMenuParentItem.find( '> a' ).append( '<span class="caret-down" aria-hidden="true"></span>' );
	};

	// Toggle the focus class on the link parent.
	app.toggleFocus = function() {
		$( this ).parents( 'li.menu-item-has-children' ).toggleClass( 'focus' );
	};

	// Engage!
	$( app.init );
} ( window, jQuery, window.wdsPrimaryNavigation ) );
'use strict';

/**
 * File: off-canvas.js
 *
 * Help deal with the off-canvas mobile menu.
 */
window.wdsoffCanvas = {};
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
			offCanvasClose: $( '.off-canvas-close' ),
			offCanvasContainer: $( '.off-canvas-container' ),
			offCanvasOpen: $( '.off-canvas-open' ),
			offCanvasScreen: $( '.off-canvas-screen' )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.body.on( 'keydown', app.escKeyClose );
		app.$c.offCanvasClose.on( 'click', app.closeoffCanvas );
		app.$c.offCanvasOpen.on( 'click', app.toggleoffCanvas );
		app.$c.offCanvasScreen.on( 'click', app.closeoffCanvas );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.offCanvasContainer.length;
	};

	// To show or not to show?
	app.toggleoffCanvas = function() {

		if ( 'true' === $( this ).attr( 'aria-expanded' ) ) {
			app.closeoffCanvas();
		} else {
			app.openoffCanvas();
		}
	};

	// Show that drawer!
	app.openoffCanvas = function() {
		app.$c.offCanvasContainer.addClass( 'is-visible' );
		app.$c.offCanvasOpen.addClass( 'is-visible' );
		app.$c.offCanvasScreen.addClass( 'is-visible' );

		app.$c.offCanvasOpen.attr( 'aria-expanded', true );
		app.$c.offCanvasContainer.attr( 'aria-hidden', false );

		app.$c.offCanvasContainer.find( 'button' ).first().focus();
	};

	// Close that drawer!
	app.closeoffCanvas = function() {
		app.$c.offCanvasContainer.removeClass( 'is-visible' );
		app.$c.offCanvasOpen.removeClass( 'is-visible' );
		app.$c.offCanvasScreen.removeClass( 'is-visible' );

		app.$c.offCanvasOpen.attr( 'aria-expanded', false );
		app.$c.offCanvasContainer.attr( 'aria-hidden', true );

		app.$c.offCanvasOpen.focus();
	};

	// Close drawer if "esc" key is pressed.
	app.escKeyClose = function( event ) {
		if ( 27 === event.keyCode ) {
			app.closeoffCanvas();
		}
	};

	// Engage!
	$( app.init );
} ( window, jQuery, window.wdsoffCanvas ) );
'use strict';

/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
( function() {
	var isWebkit = -1 < navigator.userAgent.toLowerCase().indexOf( 'webkit' ),
	    isOpera = -1 < navigator.userAgent.toLowerCase().indexOf( 'opera' ),
	    isIe = -1 < navigator.userAgent.toLowerCase().indexOf( 'msie' );

	if ( ( isWebkit || isOpera || isIe ) && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var id = location.hash.substring( 1 ),
			    element;

			if ( ! /^[A-z0-9_-]+$/.test( id ) ) {
				return;
			}

			element = document.getElementById( id );

			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
} () );
'use strict';

/**
 * File window-ready.js
 *
 * Add a "ready" class to <body> when window is ready.
 */
window.wdsWindowReady = {};
( function( window, $, app ) {

	// Constructor.
	app.init = function() {
		app.cache();
		app.bindEvents();
	};

	// Cache document elements.
	app.cache = function() {
		app.$c = {
			'window': $( window ),
			'body': $( document.body )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.window.load( app.addBodyClass );
	};

	// Add a class to <body>.
	app.addBodyClass = function() {
		app.$c.body.addClass( 'ready' );
	};

	// Engage!
	$( app.init );
} ( window, jQuery, window.wdsWindowReady ) );

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyIsImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ3aW5kb3ctcmVhZHkuanMiXSwibmFtZXMiOlsid2luZG93IiwiYWNjb3JkaW9uQmxvY2tUb2dnbGUiLCIkIiwiYXBwIiwiaW5pdCIsImNhY2hlIiwibWVldHNSZXF1aXJlbWVudHMiLCJiaW5kRXZlbnRzIiwiJGMiLCJodG1sIiwiYWNjb3JkaW9uIiwiaXRlbXMiLCJoZWFkZXJzIiwiY29udGVudHMiLCJidXR0b24iLCJhbmNob3JJRCIsImxvY2F0aW9uIiwiaGFzaCIsIm9uIiwidG9nZ2xlQWNjb3JkaW9uIiwib3Blbkhhc2hBY2NvcmRpb24iLCJsZW5ndGgiLCJwYXJlbnRzIiwidG9nZ2xlQ2xhc3MiLCJpc0V4cGFuZGVkIiwiaGFzQ2xhc3MiLCJmaW5kIiwiYXR0ciIsIm5vdCIsInJlbW92ZUNsYXNzIiwic2VsZWN0b3IiLCJ0cmlnZ2VyIiwiYWRtaW5CYXJIZWlnaHQiLCJoZWlnaHQiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwib2Zmc2V0IiwidG9wIiwialF1ZXJ5Iiwid2RzQ2Fyb3VzZWwiLCJ0aGVDYXJvdXNlbCIsImRvU2xpY2siLCJkb0ZpcnN0QW5pbWF0aW9uIiwiZmlyc3RTbGlkZSIsImZpcnN0U2xpZGVDb250ZW50IiwiZmlyc3RBbmltYXRpb24iLCJhZGRDbGFzcyIsImRvQW5pbWF0aW9uIiwic2xpZGVzIiwiYWN0aXZlU2xpZGUiLCJhY3RpdmVDb250ZW50IiwiYW5pbWF0aW9uQ2xhc3MiLCJzcGxpdEFuaW1hdGlvbiIsInNwbGl0IiwiYW5pbWF0aW9uVHJpZ2dlciIsImVhY2giLCJzbGlkZUNvbnRlbnQiLCJsYXN0Q2xhc3MiLCJwb3AiLCJwbGF5QmFja2dyb3VuZFZpZGVvcyIsInBsYXkiLCJzbGljayIsImF1dG9wbGF5IiwiYXV0b3BsYXlTcGVlZCIsImFycm93cyIsImRvdHMiLCJmb2N1c09uU2VsZWN0Iiwid2FpdEZvckFuaW1hdGUiLCJTaG93SGlkZVNlYXJjaEZvcm0iLCJib2R5IiwiaGVhZGVyU2VhcmNoRm9ybSIsInNob3dIaWRlU2VhcmNoRm9ybSIsImhpZGVTZWFyY2hGb3JtIiwiZXZlbnQiLCJ0YXJnZXQiLCJkb2N1bWVudCIsImNsYXNzTmFtZSIsInJlcGxhY2UiLCJ3ZHNNb2JpbGVNZW51Iiwic3ViTWVudUNvbnRhaW5lciIsInN1YlN1Yk1lbnVDb250YWluZXIiLCJzdWJNZW51UGFyZW50SXRlbSIsIm9mZkNhbnZhc0NvbnRhaW5lciIsImFkZERvd25BcnJvdyIsInRvZ2dsZVN1Ym1lbnUiLCJyZXNldFN1Yk1lbnUiLCJmb3JjZUNsb3NlU3VibWVudXMiLCJpcyIsInNsaWRlT3V0U3ViTWVudXMiLCJlbCIsInBhcmVudCIsInByZXBlbmQiLCJlIiwic3ViTWVudSIsImNoaWxkcmVuIiwiJHRhcmdldCIsIm9wZW5TdWJtZW51IiwiY3NzIiwidW5iaW5kIiwiYmluZCIsInByZXZlbnREZWZhdWx0Iiwid2RzTW9kYWwiLCIkbW9kYWxUb2dnbGUiLCIkZm9jdXNhYmxlQ2hpbGRyZW4iLCIkcGxheWVyIiwiJHRhZyIsImNyZWF0ZUVsZW1lbnQiLCIkZmlyc3RTY3JpcHRUYWciLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIllUIiwicGFyZW50Tm9kZSIsImluc2VydEJlZm9yZSIsIm9wZW5Nb2RhbCIsImNsb3NlTW9kYWwiLCJlc2NLZXlDbG9zZSIsImNsb3NlTW9kYWxCeUNsaWNrIiwidHJhcEtleWJvYXJkTWF5YmUiLCIkbW9kYWwiLCJkYXRhIiwiZm9jdXMiLCIkaWZyYW1lIiwidXJsIiwiaW5jbHVkZXMiLCJzdG9wVmlkZW8iLCJrZXlDb2RlIiwid2hpY2giLCIkZm9jdXNlZCIsImZvY3VzSW5kZXgiLCJpbmRleCIsInNoaWZ0S2V5Iiwib25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkiLCIkaWZyYW1laWQiLCJQbGF5ZXIiLCJldmVudHMiLCJvblBsYXllclJlYWR5Iiwib25QbGF5ZXJTdGF0ZUNoYW5nZSIsImEiLCJmaXJzdCIsIndkc1ByaW1hcnlOYXZpZ2F0aW9uIiwidG9nZ2xlRm9jdXMiLCJhcHBlbmQiLCJ3ZHNvZmZDYW52YXMiLCJvZmZDYW52YXNDbG9zZSIsIm9mZkNhbnZhc09wZW4iLCJvZmZDYW52YXNTY3JlZW4iLCJjbG9zZW9mZkNhbnZhcyIsInRvZ2dsZW9mZkNhbnZhcyIsIm9wZW5vZmZDYW52YXMiLCJpc1dlYmtpdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiaW5kZXhPZiIsImlzT3BlcmEiLCJpc0llIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiaWQiLCJzdWJzdHJpbmciLCJlbGVtZW50IiwidGVzdCIsInRhZ05hbWUiLCJ0YWJJbmRleCIsIndkc1dpbmRvd1JlYWR5IiwibG9hZCIsImFkZEJvZHlDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7QUFLQUEsT0FBT0Msb0JBQVAsR0FBOEIsRUFBOUI7QUFDRSxXQUFVRCxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKOztBQUVBLE1BQUtGLElBQUlHLGlCQUFKLEVBQUwsRUFBK0I7QUFDOUJILE9BQUlJLFVBQUo7QUFDQTtBQUNELEVBTkQ7O0FBUUE7QUFDQUosS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlLLEVBQUosR0FBUztBQUNSUixXQUFRRSxFQUFHRixNQUFILENBREE7QUFFUlMsU0FBTVAsRUFBRyxNQUFILENBRkU7QUFHUlEsY0FBV1IsRUFBRyxZQUFILENBSEg7QUFJUlMsVUFBT1QsRUFBRyxpQkFBSCxDQUpDO0FBS1JVLFlBQVNWLEVBQUcsd0JBQUgsQ0FMRDtBQU1SVyxhQUFVWCxF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Q0FBQyxDQUFwQjtBQUNBOztBQUVESCxZQUFReEMsS0FBUjtBQUNBO0FBQ0QsR0FqQkQsRUFpQkcsS0FqQkg7QUFrQkE7QUFDRCxDQXpCQyxHQUFGOzs7QUNQQTs7Ozs7QUFLQXZILE9BQU9tSyxjQUFQLEdBQXdCLEVBQXhCO0FBQ0UsV0FBVW5LLE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7QUFDQUYsTUFBSUksVUFBSjtBQUNBLEVBSEQ7O0FBS0E7QUFDQUosS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlLLEVBQUosR0FBUztBQUNSLGFBQVVOLEVBQUdGLE1BQUgsQ0FERjtBQUVSLFdBQVFFLEVBQUd5RSxTQUFTTixJQUFaO0FBRkEsR0FBVDtBQUlBLEVBTEQ7O0FBT0E7QUFDQWxFLEtBQUlJLFVBQUosR0FBaUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPUixNQUFQLENBQWNvSyxJQUFkLENBQW9CakssSUFBSWtLLFlBQXhCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBbEssS0FBSWtLLFlBQUosR0FBbUIsWUFBVztBQUM3QmxLLE1BQUlLLEVBQUosQ0FBTzZELElBQVAsQ0FBWXZCLFFBQVosQ0FBc0IsT0FBdEI7QUFDQSxFQUZEOztBQUlBO0FBQ0E1QyxHQUFHQyxJQUFJQyxJQUFQO0FBQ0EsQ0E1QkMsRUE0QkNKLE1BNUJELEVBNEJTc0MsTUE1QlQsRUE0QmlCdEMsT0FBT21LLGNBNUJ4QixDQUFGIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFjY29yZGlvbiBibG9jayBmdW5jdGlvbmFsaXR5XG4gKlxuICogQGF1dGhvciBTaGFubm9uIE1hY01pbGxhbiwgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuYWNjb3JkaW9uQmxvY2tUb2dnbGUgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3Ncblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdGh0bWw6ICQoICdodG1sJyApLFxuXHRcdFx0YWNjb3JkaW9uOiAkKCAnLmFjY29yZGlvbicgKSxcblx0XHRcdGl0ZW1zOiAkKCAnLmFjY29yZGlvbi1pdGVtJyApLFxuXHRcdFx0aGVhZGVyczogJCggJy5hY2NvcmRpb24taXRlbS1oZWFkZXInICksXG5cdFx0XHRjb250ZW50czogJCggJy5hY2NvcmRpb24taXRlbS1jb250ZW50JyApLFxuXHRcdFx0YnV0dG9uOiAkKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKSxcblx0XHRcdGFuY2hvcklEOiAkKCB3aW5kb3cubG9jYXRpb24uaGFzaCApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVycy5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCBhcHAudG9nZ2xlQWNjb3JkaW9uICk7XG5cdFx0YXBwLiRjLmJ1dHRvbi5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCBhcHAudG9nZ2xlQWNjb3JkaW9uICk7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAub3Blbkhhc2hBY2NvcmRpb24gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuYWNjb3JkaW9uLmxlbmd0aDtcblx0fTtcblxuXHRhcHAudG9nZ2xlQWNjb3JkaW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBBZGQgdGhlIG9wZW4gY2xhc3MgdG8gdGhlIGl0ZW0uXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdvcGVuJyApO1xuXG5cdFx0Ly8gSXMgdGhpcyBvbmUgZXhwYW5kZWQ/XG5cdFx0bGV0IGlzRXhwYW5kZWQgPSAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5oYXNDbGFzcyggJ29wZW4nICk7XG5cblx0XHQvLyBTZXQgdGhpcyBidXR0b24ncyBhcmlhLWV4cGFuZGVkIHZhbHVlLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgaXNFeHBhbmRlZCA/ICd0cnVlJyA6ICdmYWxzZScgKTtcblxuXHRcdC8vIFNldCBhbGwgb3RoZXIgaXRlbXMgaW4gdGhpcyBibG9jayB0byBhcmlhLWhpZGRlbj10cnVlLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICkubm90KCAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKSApLmF0dHIoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO1xuXG5cdFx0Ly8gU2V0IHRoaXMgaXRlbSB0byBhcmlhLWhpZGRlbj1mYWxzZS5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICkuYXR0ciggJ2FyaWEtaGlkZGVuJywgaXNFeHBhbmRlZCA/ICdmYWxzZScgOiAndHJ1ZScgKTtcblxuXHRcdC8vIEhpZGUgdGhlIG90aGVyIHBhbmVscy5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24tYmxvY2snICkuZmluZCggJy5hY2NvcmRpb24taXRlbScgKS5ub3QoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApICkucmVtb3ZlQ2xhc3MoICdvcGVuJyApO1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS5ub3QoICQoIHRoaXMgKSApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdGFwcC5vcGVuSGFzaEFjY29yZGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCAhIGFwcC4kYy5hbmNob3JJRC5zZWxlY3RvciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBUcmlnZ2VyIGEgY2xpY2sgb24gdGhlIGJ1dHRvbiBjbG9zZXN0IHRvIHRoaXMgYWNjb3JkaW9uLlxuXHRcdGFwcC4kYy5hbmNob3JJRC5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLnRyaWdnZXIoICdjbGljaycgKTtcblxuXHRcdC8vIE5vdCBzZXR0aW5nIGEgY2FjaGVkIHZhcmlhYmxlIGFzIGl0IGRvZXNuJ3Qgc2VlbSB0byBncmFiIHRoZSBoZWlnaHQgcHJvcGVybHkuXG5cdFx0Y29uc3QgYWRtaW5CYXJIZWlnaHQgPSAkKCAnI3dwYWRtaW5iYXInICkubGVuZ3RoID8gJCggJyN3cGFkbWluYmFyJyApLmhlaWdodCgpIDogMDtcblxuXHRcdC8vIEFuaW1hdGUgdG8gdGhlIGRpdiBmb3IgYSBuaWNlciBleHBlcmllbmNlLlxuXHRcdGFwcC4kYy5odG1sLmFuaW1hdGUoIHtcblx0XHRcdHNjcm9sbFRvcDogYXBwLiRjLmFuY2hvcklELm9mZnNldCgpLnRvcCAtIGFkbWluQmFySGVpZ2h0XG5cdFx0fSwgJ3Nsb3cnICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlXG5cdGFwcC5pbml0KCk7XG5cbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93LmFjY29yZGlvbkJsb2NrVG9nZ2xlICkgKTtcbiIsIi8qKlxuICogRmlsZSBjYXJvdXNlbC5qc1xuICpcbiAqIERlYWwgd2l0aCB0aGUgU2xpY2sgY2Fyb3VzZWwuXG4gKi9cbndpbmRvdy53ZHNDYXJvdXNlbCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHR0aGVDYXJvdXNlbDogJCggJy5jYXJvdXNlbCcgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmRvU2xpY2sgKTtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5kb0ZpcnN0QW5pbWF0aW9uICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnRoZUNhcm91c2VsLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBbmltYXRlIHRoZSBmaXJzdCBzbGlkZSBvbiB3aW5kb3cgbG9hZC5cblx0YXBwLmRvRmlyc3RBbmltYXRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEdldCB0aGUgZmlyc3Qgc2xpZGUgY29udGVudCBhcmVhIGFuZCBhbmltYXRpb24gYXR0cmlidXRlLlxuXHRcdGxldCBmaXJzdFNsaWRlID0gYXBwLiRjLnRoZUNhcm91c2VsLmZpbmQoICdbZGF0YS1zbGljay1pbmRleD0wXScgKSxcblx0XHRcdGZpcnN0U2xpZGVDb250ZW50ID0gZmlyc3RTbGlkZS5maW5kKCAnLnNsaWRlLWNvbnRlbnQnICksXG5cdFx0XHRmaXJzdEFuaW1hdGlvbiA9IGZpcnN0U2xpZGVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKTtcblxuXHRcdC8vIEFkZCB0aGUgYW5pbWF0aW9uIGNsYXNzIHRvIHRoZSBmaXJzdCBzbGlkZS5cblx0XHRmaXJzdFNsaWRlQ29udGVudC5hZGRDbGFzcyggZmlyc3RBbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBBbmltYXRlIHRoZSBzbGlkZSBjb250ZW50LlxuXHRhcHAuZG9BbmltYXRpb24gPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgc2xpZGVzID0gJCggJy5zbGlkZScgKSxcblx0XHRcdGFjdGl2ZVNsaWRlID0gJCggJy5zbGljay1jdXJyZW50JyApLFxuXHRcdFx0YWN0aXZlQ29udGVudCA9IGFjdGl2ZVNsaWRlLmZpbmQoICcuc2xpZGUtY29udGVudCcgKSxcblxuXHRcdFx0Ly8gVGhpcyBpcyBhIHN0cmluZyBsaWtlIHNvOiAnYW5pbWF0ZWQgc29tZUNzc0NsYXNzJy5cblx0XHRcdGFuaW1hdGlvbkNsYXNzID0gYWN0aXZlQ29udGVudC5hdHRyKCAnZGF0YS1hbmltYXRpb24nICksXG5cdFx0XHRzcGxpdEFuaW1hdGlvbiA9IGFuaW1hdGlvbkNsYXNzLnNwbGl0KCAnICcgKSxcblxuXHRcdFx0Ly8gVGhpcyBpcyB0aGUgJ2FuaW1hdGVkJyBjbGFzcy5cblx0XHRcdGFuaW1hdGlvblRyaWdnZXIgPSBzcGxpdEFuaW1hdGlvblswXTtcblxuXHRcdC8vIEdvIHRocm91Z2ggZWFjaCBzbGlkZSB0byBzZWUgaWYgd2UndmUgYWxyZWFkeSBzZXQgYW5pbWF0aW9uIGNsYXNzZXMuXG5cdFx0c2xpZGVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0bGV0IHNsaWRlQ29udGVudCA9ICQoIHRoaXMgKS5maW5kKCAnLnNsaWRlLWNvbnRlbnQnICk7XG5cblx0XHRcdC8vIElmIHdlJ3ZlIHNldCBhbmltYXRpb24gY2xhc3NlcyBvbiBhIHNsaWRlLCByZW1vdmUgdGhlbS5cblx0XHRcdGlmICggc2xpZGVDb250ZW50Lmhhc0NsYXNzKCAnYW5pbWF0ZWQnICkgKSB7XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBsYXN0IGNsYXNzLCB3aGljaCBpcyB0aGUgYW5pbWF0ZS5jc3MgY2xhc3MuXG5cdFx0XHRcdGxldCBsYXN0Q2xhc3MgPSBzbGlkZUNvbnRlbnRcblx0XHRcdFx0XHQuYXR0ciggJ2NsYXNzJyApXG5cdFx0XHRcdFx0LnNwbGl0KCAnICcgKVxuXHRcdFx0XHRcdC5wb3AoKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgYm90aCBhbmltYXRpb24gY2xhc3Nlcy5cblx0XHRcdFx0c2xpZGVDb250ZW50LnJlbW92ZUNsYXNzKCBsYXN0Q2xhc3MgKS5yZW1vdmVDbGFzcyggYW5pbWF0aW9uVHJpZ2dlciApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEFkZCBhbmltYXRpb24gY2xhc3NlcyBhZnRlciBzbGlkZSBpcyBpbiB2aWV3LlxuXHRcdGFjdGl2ZUNvbnRlbnQuYWRkQ2xhc3MoIGFuaW1hdGlvbkNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWxsb3cgYmFja2dyb3VuZCB2aWRlb3MgdG8gYXV0b3BsYXkuXG5cdGFwcC5wbGF5QmFja2dyb3VuZFZpZGVvcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IGFsbCB0aGUgdmlkZW9zIGluIG91ciBzbGlkZXMgb2JqZWN0LlxuXHRcdCQoICd2aWRlbycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gTGV0IHRoZW0gYXV0b3BsYXkuIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0aGlzIGxhdGVyIHRvIG9ubHkgcGxheSB0aGUgdmlzaWJsZSBzbGlkZSB2aWRlby5cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBLaWNrIG9mZiBTbGljay5cblx0YXBwLmRvU2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdpbml0JywgYXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zICk7XG5cblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwuc2xpY2soIHtcblx0XHRcdGF1dG9wbGF5OiB0cnVlLFxuXHRcdFx0YXV0b3BsYXlTcGVlZDogNTAwMCxcblx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRmb2N1c09uU2VsZWN0OiB0cnVlLFxuXHRcdFx0d2FpdEZvckFuaW1hdGU6IHRydWVcblx0XHR9ICk7XG5cblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdhZnRlckNoYW5nZScsIGFwcC5kb0FuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc0Nhcm91c2VsICkgKTtcbiIsIi8qKlxuICogU2hvdy9IaWRlIHRoZSBTZWFyY2ggRm9ybSBpbiB0aGUgaGVhZGVyLlxuICpcbiAqIEBhdXRob3IgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3RvclxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdGhlYWRlclNlYXJjaEZvcm06ICQoICcuc2l0ZS1oZWFkZXItYWN0aW9uIC5jdGEtYnV0dG9uJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoRm9ybS5vbiggJ2tleXVwIHRvdWNoc3RhcnQgY2xpY2snLCBhcHAuc2hvd0hpZGVTZWFyY2hGb3JtICk7XG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXl1cCB0b3VjaHN0YXJ0IGNsaWNrJywgYXBwLmhpZGVTZWFyY2hGb3JtICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLmhlYWRlclNlYXJjaEZvcm0ubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFkZHMgdGhlIHRvZ2dsZSBjbGFzcyBmb3IgdGhlIHNlYXJjaCBmb3JtLlxuXHRhcHAuc2hvd0hpZGVTZWFyY2hGb3JtID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkudG9nZ2xlQ2xhc3MoICdzZWFyY2gtZm9ybS12aXNpYmxlJyApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdC8vIEhpZGVzIHRoZSBzZWFyY2ggZm9ybSBpZiB3ZSBjbGljayBvdXRzaWRlIG9mIGl0cyBjb250YWluZXIuXG5cdGFwcC5oaWRlU2VhcmNoRm9ybSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnc2l0ZS1oZWFkZXItYWN0aW9uJyApICkge1xuXHRcdFx0YXBwLiRjLmJvZHkucmVtb3ZlQ2xhc3MoICdzZWFyY2gtZm9ybS12aXNpYmxlJyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2Vcblx0JCggYXBwLmluaXQgKTtcblxufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtICkgKTtcbiIsIi8qKlxuICogRmlsZSBqcy1lbmFibGVkLmpzXG4gKlxuICogSWYgSmF2YXNjcmlwdCBpcyBlbmFibGVkLCByZXBsYWNlIHRoZSA8Ym9keT4gY2xhc3MgXCJuby1qc1wiLlxuICovXG5kb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoICduby1qcycsICdqcycgKTtcbiIsIi8qKlxuICogRmlsZTogbW9iaWxlLW1lbnUuanNcbiAqXG4gKiBDcmVhdGUgYW4gYWNjb3JkaW9uIHN0eWxlIGRyb3Bkb3duLlxuICovXG53aW5kb3cud2RzTW9iaWxlTWVudSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHN1Yk1lbnVDb250YWluZXI6ICQoICcubW9iaWxlLW1lbnUgLnN1Yi1tZW51LCAudXRpbGl0eS1uYXZpZ2F0aW9uIC5zdWItbWVudScgKSxcblx0XHRcdHN1YlN1Yk1lbnVDb250YWluZXI6ICQoICcubW9iaWxlLW1lbnUgLnN1Yi1tZW51IC5zdWItbWVudScgKSxcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1vYmlsZS1tZW51IGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4sIC51dGlsaXR5LW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKSxcblx0XHRcdG9mZkNhbnZhc0NvbnRhaW5lcjogJCggJy5vZmYtY2FudmFzLWNvbnRhaW5lcicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZVN1Ym1lbnUgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLnJlc2V0U3ViTWVudSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLmZvcmNlQ2xvc2VTdWJtZW51cyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBSZXNldCB0aGUgc3VibWVudXMgYWZ0ZXIgaXQncyBkb25lIGNsb3NpbmcuXG5cdGFwcC5yZXNldFN1Yk1lbnUgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFdoZW4gdGhlIGxpc3QgaXRlbSBpcyBkb25lIHRyYW5zaXRpb25pbmcgaW4gaGVpZ2h0LFxuXHRcdC8vIHJlbW92ZSB0aGUgY2xhc3NlcyBmcm9tIHRoZSBzdWJtZW51IHNvIGl0IGlzIHJlYWR5IHRvIHRvZ2dsZSBhZ2Fpbi5cblx0XHRpZiAoICQoIHRoaXMgKS5pcyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkgJiYgISAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0JCggdGhpcyApLmZpbmQoICd1bC5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlT3V0TGVmdCBpcy12aXNpYmxlJyApO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudSBpdGVtcy5cblx0YXBwLnNsaWRlT3V0U3ViTWVudXMgPSBmdW5jdGlvbiggZWwgKSB7XG5cblx0XHQvLyBJZiB0aGlzIGl0ZW0ncyBwYXJlbnQgaXMgdmlzaWJsZSBhbmQgdGhpcyBpcyBub3QsIGJhaWwuXG5cdFx0aWYgKCBlbC5wYXJlbnQoKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgJiYgISBlbC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhpcyBpdGVtJ3MgcGFyZW50IGlzIHZpc2libGUgYW5kIHRoaXMgaXRlbSBpcyB2aXNpYmxlLCBoaWRlIGl0cyBzdWJtZW51IHRoZW4gYmFpbC5cblx0XHRpZiAoIGVsLnBhcmVudCgpLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSAmJiBlbC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRlbC5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmVhY2goIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBPbmx5IHRyeSB0byBjbG9zZSBzdWJtZW51cyB0aGF0IGFyZSBhY3R1YWxseSBvcGVuLlxuXHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoICdzbGlkZUluTGVmdCcgKSApIHtcblxuXHRcdFx0XHQvLyBDbG9zZSB0aGUgcGFyZW50IGxpc3QgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byBmYWxzZS5cblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudS5cblx0XHRcdFx0JCggdGhpcyApLnJlbW92ZUNsYXNzKCAnc2xpZGVJbkxlZnQnICkuYWRkQ2xhc3MoICdzbGlkZU91dExlZnQnICk7XG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5wcmVwZW5kKCAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgY2xhc3M9XCJwYXJlbnQtaW5kaWNhdG9yXCIgYXJpYS1sYWJlbD1cIk9wZW4gc3VibWVudVwiPjxzcGFuIGNsYXNzPVwiZG93bi1hcnJvd1wiPjwvc3Bhbj48L2J1dHRvbj4nICk7XG5cdH07XG5cblx0Ly8gRGVhbCB3aXRoIHRoZSBzdWJtZW51LlxuXHRhcHAudG9nZ2xlU3VibWVudSA9IGZ1bmN0aW9uKCBlICkge1xuXG5cdFx0bGV0IGVsID0gJCggdGhpcyApLCAvLyBUaGUgbWVudSBlbGVtZW50IHdoaWNoIHdhcyBjbGlja2VkIG9uLlxuXHRcdFx0c3ViTWVudSA9IGVsLmNoaWxkcmVuKCAndWwuc3ViLW1lbnUnICksIC8vIFRoZSBuZWFyZXN0IHN1Ym1lbnUuXG5cdFx0XHQkdGFyZ2V0ID0gJCggZS50YXJnZXQgKTsgLy8gdGhlIGVsZW1lbnQgdGhhdCdzIGFjdHVhbGx5IGJlaW5nIGNsaWNrZWQgKGNoaWxkIG9mIHRoZSBsaSB0aGF0IHRyaWdnZXJlZCB0aGUgY2xpY2sgZXZlbnQpLlxuXG5cdFx0Ly8gRmlndXJlIG91dCBpZiB3ZSdyZSBjbGlja2luZyB0aGUgYnV0dG9uIG9yIGl0cyBhcnJvdyBjaGlsZCxcblx0XHQvLyBpZiBzbywgd2UgY2FuIGp1c3Qgb3BlbiBvciBjbG9zZSB0aGUgbWVudSBhbmQgYmFpbC5cblx0XHRpZiAoICR0YXJnZXQuaGFzQ2xhc3MoICdkb3duLWFycm93JyApIHx8ICR0YXJnZXQuaGFzQ2xhc3MoICdwYXJlbnQtaW5kaWNhdG9yJyApICkge1xuXG5cdFx0XHQvLyBGaXJzdCwgY29sbGFwc2UgYW55IGFscmVhZHkgb3BlbmVkIHN1Ym1lbnVzLlxuXHRcdFx0YXBwLnNsaWRlT3V0U3ViTWVudXMoIGVsICk7XG5cblx0XHRcdGlmICggISBzdWJNZW51Lmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblxuXHRcdFx0XHQvLyBPcGVuIHRoZSBzdWJtZW51LlxuXHRcdFx0XHRhcHAub3BlblN1Ym1lbnUoIGVsLCBzdWJNZW51ICk7XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIE9wZW4gYSBzdWJtZW51LlxuXHRhcHAub3BlblN1Ym1lbnUgPSBmdW5jdGlvbiggcGFyZW50LCBzdWJNZW51ICkge1xuXG5cdFx0Ly8gRXhwYW5kIHRoZSBsaXN0IG1lbnUgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byB0cnVlLlxuXHRcdHBhcmVudC5hZGRDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXG5cdFx0Ly8gU2xpZGUgdGhlIG1lbnUgaW4uXG5cdFx0c3ViTWVudS5hZGRDbGFzcyggJ2lzLXZpc2libGUgYW5pbWF0ZWQgc2xpZGVJbkxlZnQnICk7XG5cdH07XG5cblx0Ly8gRm9yY2UgY2xvc2UgYWxsIHRoZSBzdWJtZW51cyB3aGVuIHRoZSBtYWluIG1lbnUgY29udGFpbmVyIGlzIGNsb3NlZC5cblx0YXBwLmZvcmNlQ2xvc2VTdWJtZW51cyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gVGhlIHRyYW5zaXRpb25lbmQgZXZlbnQgdHJpZ2dlcnMgb24gb3BlbiBhbmQgb24gY2xvc2UsIG5lZWQgdG8gbWFrZSBzdXJlIHdlIG9ubHkgZG8gdGhpcyBvbiBjbG9zZS5cblx0XHRpZiAoICEgJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZSBzbGlkZUluTGVmdCcgKTtcblx0XHRcdGFwcC4kYy5ib2R5LmNzcyggJ292ZXJmbG93JywgJ3Zpc2libGUnICk7XG5cdFx0XHRhcHAuJGMuYm9keS51bmJpbmQoICd0b3VjaHN0YXJ0JyApO1xuXHRcdH1cblxuXHRcdGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdGFwcC4kYy5ib2R5LmNzcyggJ292ZXJmbG93JywgJ2hpZGRlbicgKTtcblx0XHRcdGFwcC4kYy5ib2R5LmJpbmQoICd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGlmICggISAkKCBlLnRhcmdldCApLnBhcmVudHMoICcuY29udGFjdC1tb2RhbCcgKVswXSApIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc01vYmlsZU1lbnUgKSApO1xuIiwiLyoqXG4gKiBGaWxlIG1vZGFsLmpzXG4gKlxuICogRGVhbCB3aXRoIG11bHRpcGxlIG1vZGFscyBhbmQgdGhlaXIgbWVkaWEuXG4gKi9cbndpbmRvdy53ZHNNb2RhbCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0bGV0ICRtb2RhbFRvZ2dsZSxcblx0XHQkZm9jdXNhYmxlQ2hpbGRyZW4sXG5cdFx0JHBsYXllcixcblx0XHQkdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NjcmlwdCcgKSxcblx0XHQkZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3NjcmlwdCcgKVswXSxcblx0XHRZVDtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHQkZmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoICR0YWcsICRmaXJzdFNjcmlwdFRhZyApO1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdCdib2R5JzogJCggJ2JvZHknIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQoICcubW9kYWwtdHJpZ2dlcicgKS5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gVHJpZ2dlciBhIG1vZGFsIHRvIG9wZW4uXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJy5tb2RhbC10cmlnZ2VyJywgYXBwLm9wZW5Nb2RhbCApO1xuXG5cdFx0Ly8gVHJpZ2dlciB0aGUgY2xvc2UgYnV0dG9uIHRvIGNsb3NlIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLmNsb3NlJywgYXBwLmNsb3NlTW9kYWwgKTtcblxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIGNsb3NlIHRoZSBtb2RhbCBieSBoaXR0aW5nIHRoZSBlc2Mga2V5LlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC5lc2NLZXlDbG9zZSApO1xuXG5cdFx0Ly8gQWxsb3cgdGhlIHVzZXIgdG8gY2xvc2UgdGhlIG1vZGFsIGJ5IGNsaWNraW5nIG91dHNpZGUgb2YgdGhlIG1vZGFsLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICdkaXYubW9kYWwtb3BlbicsIGFwcC5jbG9zZU1vZGFsQnlDbGljayApO1xuXG5cdFx0Ly8gTGlzdGVuIHRvIHRhYnMsIHRyYXAga2V5Ym9hcmQgaWYgd2UgbmVlZCB0b1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC50cmFwS2V5Ym9hcmRNYXliZSApO1xuXG5cdH07XG5cblx0Ly8gT3BlbiB0aGUgbW9kYWwuXG5cdGFwcC5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFN0b3JlIHRoZSBtb2RhbCB0b2dnbGUgZWxlbWVudFxuXHRcdCRtb2RhbFRvZ2dsZSA9ICQoIHRoaXMgKTtcblxuXHRcdC8vIEZpZ3VyZSBvdXQgd2hpY2ggbW9kYWwgd2UncmUgb3BlbmluZyBhbmQgc3RvcmUgdGhlIG9iamVjdC5cblx0XHRsZXQgJG1vZGFsID0gJCggJCggdGhpcyApLmRhdGEoICd0YXJnZXQnICkgKTtcblxuXHRcdC8vIERpc3BsYXkgdGhlIG1vZGFsLlxuXHRcdCRtb2RhbC5hZGRDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBBZGQgYm9keSBjbGFzcy5cblx0XHRhcHAuJGMuYm9keS5hZGRDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBGaW5kIHRoZSBmb2N1c2FibGUgY2hpbGRyZW4gb2YgdGhlIG1vZGFsLlxuXHRcdC8vIFRoaXMgbGlzdCBtYXkgYmUgaW5jb21wbGV0ZSwgcmVhbGx5IHdpc2ggalF1ZXJ5IGhhZCB0aGUgOmZvY3VzYWJsZSBwc2V1ZG8gbGlrZSBqUXVlcnkgVUkgZG9lcy5cblx0XHQvLyBGb3IgbW9yZSBhYm91dCA6aW5wdXQgc2VlOiBodHRwczovL2FwaS5qcXVlcnkuY29tL2lucHV0LXNlbGVjdG9yL1xuXHRcdCRmb2N1c2FibGVDaGlsZHJlbiA9ICRtb2RhbC5maW5kKCAnYSwgOmlucHV0LCBbdGFiaW5kZXhdJyApO1xuXG5cdFx0Ly8gSWRlYWxseSwgdGhlcmUgaXMgYWx3YXlzIG9uZSAodGhlIGNsb3NlIGJ1dHRvbiksIGJ1dCB5b3UgbmV2ZXIga25vdy5cblx0XHRpZiAoIDAgPCAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoICkge1xuXG5cdFx0XHQvLyBTaGlmdCBmb2N1cyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBDbG9zZSB0aGUgbW9kYWwuXG5cdGFwcC5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBGaWd1cmUgdGhlIG9wZW5lZCBtb2RhbCB3ZSdyZSBjbG9zaW5nIGFuZCBzdG9yZSB0aGUgb2JqZWN0LlxuXHRcdGxldCAkbW9kYWwgPSAkKCAkKCAnZGl2Lm1vZGFsLW9wZW4gLmNsb3NlJyApLmRhdGEoICd0YXJnZXQnICkgKSxcblxuXHRcdFx0Ly8gRmluZCB0aGUgaWZyYW1lIGluIHRoZSAkbW9kYWwgb2JqZWN0LlxuXHRcdFx0JGlmcmFtZSA9ICRtb2RhbC5maW5kKCAnaWZyYW1lJyApO1xuXG5cdFx0Ly8gT25seSBkbyB0aGlzIGlmIHRoZXJlIGFyZSBhbnkgaWZyYW1lcy5cblx0XHRpZiAoICRpZnJhbWUubGVuZ3RoICkge1xuXG5cdFx0XHQvLyBHZXQgdGhlIGlmcmFtZSBzcmMgVVJMLlxuXHRcdFx0bGV0IHVybCA9ICRpZnJhbWUuYXR0ciggJ3NyYycgKTtcblxuXHRcdFx0Ly8gUmVtb3ZpbmcvUmVhZGRpbmcgdGhlIFVSTCB3aWxsIGVmZmVjdGl2ZWx5IGJyZWFrIHRoZSBZb3VUdWJlIEFQSS5cblx0XHRcdC8vIFNvIGxldCdzIG5vdCBkbyB0aGF0IHdoZW4gdGhlIGlmcmFtZSBVUkwgY29udGFpbnMgdGhlIGVuYWJsZWpzYXBpIHBhcmFtZXRlci5cblx0XHRcdGlmICggISB1cmwuaW5jbHVkZXMoICdlbmFibGVqc2FwaT0xJyApICkge1xuXG5cdFx0XHRcdC8vIFJlbW92ZSB0aGUgc291cmNlIFVSTCwgdGhlbiBhZGQgaXQgYmFjaywgc28gdGhlIHZpZGVvIGNhbiBiZSBwbGF5ZWQgYWdhaW4gbGF0ZXIuXG5cdFx0XHRcdCRpZnJhbWUuYXR0ciggJ3NyYycsICcnICkuYXR0ciggJ3NyYycsIHVybCApO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBVc2UgdGhlIFlvdVR1YmUgQVBJIHRvIHN0b3AgdGhlIHZpZGVvLlxuXHRcdFx0XHQkcGxheWVyLnN0b3BWaWRlbygpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEZpbmFsbHksIGhpZGUgdGhlIG1vZGFsLlxuXHRcdCRtb2RhbC5yZW1vdmVDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBSZW1vdmUgdGhlIGJvZHkgY2xhc3MuXG5cdFx0YXBwLiRjLmJvZHkucmVtb3ZlQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gUmV2ZXJ0IGZvY3VzIGJhY2sgdG8gdG9nZ2xlIGVsZW1lbnRcblx0XHQkbW9kYWxUb2dnbGUuZm9jdXMoKTtcblxuXHR9O1xuXG5cdC8vIENsb3NlIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXG5cdGFwcC5lc2NLZXlDbG9zZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0YXBwLmNsb3NlTW9kYWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2xvc2UgaWYgdGhlIHVzZXIgY2xpY2tzIG91dHNpZGUgb2YgdGhlIG1vZGFsXG5cdGFwcC5jbG9zZU1vZGFsQnlDbGljayA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIElmIHRoZSBwYXJlbnQgY29udGFpbmVyIGlzIE5PVCB0aGUgbW9kYWwgZGlhbG9nIGNvbnRhaW5lciwgY2xvc2UgdGhlIG1vZGFsXG5cdFx0aWYgKCAhICQoIGV2ZW50LnRhcmdldCApLnBhcmVudHMoICdkaXYnICkuaGFzQ2xhc3MoICdtb2RhbC1kaWFsb2cnICkgKSB7XG5cdFx0XHRhcHAuY2xvc2VNb2RhbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBUcmFwIHRoZSBrZXlib2FyZCBpbnRvIGEgbW9kYWwgd2hlbiBvbmUgaXMgYWN0aXZlLlxuXHRhcHAudHJhcEtleWJvYXJkTWF5YmUgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHQvLyBXZSBvbmx5IG5lZWQgdG8gZG8gc3R1ZmYgd2hlbiB0aGUgbW9kYWwgaXMgb3BlbiBhbmQgdGFiIGlzIHByZXNzZWQuXG5cdFx0aWYgKCA5ID09PSBldmVudC53aGljaCAmJiAwIDwgJCggJy5tb2RhbC1vcGVuJyApLmxlbmd0aCApIHtcblx0XHRcdGxldCAkZm9jdXNlZCA9ICQoICc6Zm9jdXMnICksXG5cdFx0XHRcdGZvY3VzSW5kZXggPSAkZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXgoICRmb2N1c2VkICk7XG5cblx0XHRcdGlmICggMCA9PT0gZm9jdXNJbmRleCAmJiBldmVudC5zaGlmdEtleSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCwgYW5kIHNoaWZ0IGlzIGhlbGQgd2hlbiBwcmVzc2luZyB0YWIsIGdvIGJhY2sgdG8gbGFzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWyAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSBdLmZvY3VzKCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIGV2ZW50LnNoaWZ0S2V5ICYmIGZvY3VzSW5kZXggPT09ICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxICkge1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnQsIGFuZCBzaGlmdCBpcyBub3QgaGVsZCwgZ28gYmFjayB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBIb29rIGludG8gWW91VHViZSA8aWZyYW1lPi5cblx0YXBwLm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0bGV0ICRtb2RhbCA9ICQoICdkaXYubW9kYWwnICksXG5cdFx0XHQkaWZyYW1laWQgPSAkbW9kYWwuZmluZCggJ2lmcmFtZScgKS5hdHRyKCAnaWQnICk7XG5cblx0XHQkcGxheWVyID0gbmV3IFlULlBsYXllciggJGlmcmFtZWlkLCB7XG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0J29uUmVhZHknOiBhcHAub25QbGF5ZXJSZWFkeSxcblx0XHRcdFx0J29uU3RhdGVDaGFuZ2UnOiBhcHAub25QbGF5ZXJTdGF0ZUNoYW5nZVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBEbyBzb21ldGhpbmcgb24gcGxheWVyIHJlYWR5LlxuXHRhcHAub25QbGF5ZXJSZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHR9O1xuXG5cdC8vIERvIHNvbWV0aGluZyBvbiBwbGF5ZXIgc3RhdGUgY2hhbmdlLlxuXHRhcHAub25QbGF5ZXJTdGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gU2V0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCBpbnNpZGUgb2YgdGhlIG1vZGFsIHRoZSBwbGF5ZXIgaXMgaW4uXG5cdFx0JCggZXZlbnQudGFyZ2V0LmEgKS5wYXJlbnRzKCAnLm1vZGFsJyApLmZpbmQoICdhLCA6aW5wdXQsIFt0YWJpbmRleF0nICkuZmlyc3QoKS5mb2N1cygpO1xuXHR9O1xuXG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2RhbCApICk7XG4iLCIvKipcbiAqIEZpbGU6IG5hdmlnYXRpb24tcHJpbWFyeS5qc1xuICpcbiAqIEhlbHBlcnMgZm9yIHRoZSBwcmltYXJ5IG5hdmlnYXRpb24uXG4gKi9cbndpbmRvdy53ZHNQcmltYXJ5TmF2aWdhdGlvbiA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1haW4tbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tYWluLW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnYScgKS5vbiggJ2ZvY3VzaW4gZm9jdXNvdXQnLCBhcHAudG9nZ2xlRm9jdXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnPiBhJyApLmFwcGVuZCggJzxzcGFuIGNsYXNzPVwiY2FyZXQtZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nICk7XG5cdH07XG5cblx0Ly8gVG9nZ2xlIHRoZSBmb2N1cyBjbGFzcyBvbiB0aGUgbGluayBwYXJlbnQuXG5cdGFwcC50b2dnbGVGb2N1cyA9IGZ1bmN0aW9uKCkge1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKS50b2dnbGVDbGFzcyggJ2ZvY3VzJyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNQcmltYXJ5TmF2aWdhdGlvbiApICk7XG4iLCIvKipcbiAqIEZpbGU6IG9mZi1jYW52YXMuanNcbiAqXG4gKiBIZWxwIGRlYWwgd2l0aCB0aGUgb2ZmLWNhbnZhcyBtb2JpbGUgbWVudS5cbiAqL1xud2luZG93Lndkc29mZkNhbnZhcyA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxuXHRcdFx0b2ZmQ2FudmFzQ2xvc2U6ICQoICcub2ZmLWNhbnZhcy1jbG9zZScgKSxcblx0XHRcdG9mZkNhbnZhc0NvbnRhaW5lcjogJCggJy5vZmYtY2FudmFzLWNvbnRhaW5lcicgKSxcblx0XHRcdG9mZkNhbnZhc09wZW46ICQoICcub2ZmLWNhbnZhcy1vcGVuJyApLFxuXHRcdFx0b2ZmQ2FudmFzU2NyZWVuOiAkKCAnLm9mZi1jYW52YXMtc2NyZWVuJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLmVzY0tleUNsb3NlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0Nsb3NlLm9uKCAnY2xpY2snLCBhcHAuY2xvc2VvZmZDYW52YXMgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZW9mZkNhbnZhcyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4ub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIFRvIHNob3cgb3Igbm90IHRvIHNob3c/XG5cdGFwcC50b2dnbGVvZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmICggJ3RydWUnID09PSAkKCB0aGlzICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0XHRhcHAuY2xvc2VvZmZDYW52YXMoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXBwLm9wZW5vZmZDYW52YXMoKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBTaG93IHRoYXQgZHJhd2VyIVxuXHRhcHAub3Blbm9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYXR0ciggJ2FyaWEtaGlkZGVuJywgZmFsc2UgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuZmluZCggJ2J1dHRvbicgKS5maXJzdCgpLmZvY3VzKCk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhhdCBkcmF3ZXIhXG5cdGFwcC5jbG9zZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIHRydWUgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmZvY3VzKCk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgZHJhd2VyIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXG5cdGFwcC5lc2NLZXlDbG9zZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNvZmZDYW52YXMgKSApO1xuIiwiLyoqXG4gKiBGaWxlIHNraXAtbGluay1mb2N1cy1maXguanMuXG4gKlxuICogSGVscHMgd2l0aCBhY2Nlc3NpYmlsaXR5IGZvciBrZXlib2FyZCBvbmx5IHVzZXJzLlxuICpcbiAqIExlYXJuIG1vcmU6IGh0dHBzOi8vZ2l0LmlvL3ZXZHIyXG4gKi9cbiggZnVuY3Rpb24oKSB7XG5cdHZhciBpc1dlYmtpdCA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICd3ZWJraXQnICksXG5cdFx0aXNPcGVyYSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdvcGVyYScgKSxcblx0XHRpc0llID0gLTEgPCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ21zaWUnICk7XG5cblx0aWYgKCAoIGlzV2Via2l0IHx8IGlzT3BlcmEgfHwgaXNJZSApICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGlkID0gbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoIDEgKSxcblx0XHRcdFx0ZWxlbWVudDtcblxuXHRcdFx0aWYgKCAhICggL15bQS16MC05Xy1dKyQvICkudGVzdCggaWQgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cblx0XHRcdGlmICggZWxlbWVudCApIHtcblx0XHRcdFx0aWYgKCAhICggL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pICkudGVzdCggZWxlbWVudC50YWdOYW1lICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50YWJJbmRleCA9IC0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlICk7XG5cdH1cbn0oKSApO1xuIiwiLyoqXG4gKiBGaWxlIHdpbmRvdy1yZWFkeS5qc1xuICpcbiAqIEFkZCBhIFwicmVhZHlcIiBjbGFzcyB0byA8Ym9keT4gd2hlbiB3aW5kb3cgaXMgcmVhZHkuXG4gKi9cbndpbmRvdy53ZHNXaW5kb3dSZWFkeSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0fTtcblxuXHQvLyBDYWNoZSBkb2N1bWVudCBlbGVtZW50cy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J3dpbmRvdyc6ICQoIHdpbmRvdyApLFxuXHRcdFx0J2JvZHknOiAkKCBkb2N1bWVudC5ib2R5IClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93LmxvYWQoIGFwcC5hZGRCb2R5Q2xhc3MgKTtcblx0fTtcblxuXHQvLyBBZGQgYSBjbGFzcyB0byA8Ym9keT4uXG5cdGFwcC5hZGRCb2R5Q2xhc3MgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5hZGRDbGFzcyggJ3JlYWR5JyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzV2luZG93UmVhZHkgKSApO1xuIl19
