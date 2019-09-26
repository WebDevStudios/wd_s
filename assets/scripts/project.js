'use strict';

/**
 * Accordion block functionality
 *
 * @author Shannon MacMillan, Corey Collins
 */
window.accordionBlockToggle = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		// If we're in an ACF edit page.
		if (window.acf) {
			window.acf.addAction('render_block_preview', app.bindEvents);
		}

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			html: $('html'),
			accordion: $('.accordion'),
			items: $('.accordion-item'),
			headers: $('.accordion-item-header'),
			contents: $('.accordion-item-content'),
			button: $('.accordion-item-toggle'),
			anchorID: $(window.location.hash)
		};
	};

	// Combine all events
	app.bindEvents = function () {
		$('.accordion-item-header').on('click', app.toggleAccordion);
		$('.accordion-item-toggle').on('click', app.toggleAccordion);
		app.$c.window.on('load', app.openHashAccordion);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.accordion.length;
	};

	app.toggleAccordion = function () {

		// Add the open class to the item.
		$(this).parents('.accordion-item').toggleClass('open');

		// Is this one expanded?
		var isExpanded = $(this).parents('.accordion-item').hasClass('open');

		// Set this button's aria-expanded value.
		$(this).parents('.accordion-item').find('.accordion-item-toggle').attr('aria-expanded', isExpanded ? 'true' : 'false');

		// Set all other items in this block to aria-hidden=true.
		$(this).parents('.accordion-block').find('.accordion-item-content').not($(this).parents('.accordion-item')).attr('aria-hidden', 'true');

		// Set this item to aria-hidden=false.
		$(this).parents('.accordion-item').find('.accordion-item-content').attr('aria-hidden', isExpanded ? 'false' : 'true');

		// Hide the other panels.
		$(this).parents('.accordion-block').find('.accordion-item').not($(this).parents('.accordion-item')).removeClass('open');
		$(this).parents('.accordion-block').find('.accordion-item-toggle').not($(this)).attr('aria-expanded', 'false');

		return false;
	};

	app.openHashAccordion = function () {

		if (!app.$c.anchorID.selector) {
			return;
		}

		// Trigger a click on the button closest to this accordion.
		app.$c.anchorID.parents('.accordion-item').find('.accordion-item-toggle').trigger('click');

		// Not setting a cached variable as it doesn't seem to grab the height properly.
		var adminBarHeight = $('#wpadminbar').length ? $('#wpadminbar').height() : 0;

		// Animate to the div for a nicer experience.
		app.$c.html.animate({
			scrollTop: app.$c.anchorID.offset().top - adminBarHeight
		}, 'slow');
	};

	// Engage
	app.init();
})(window, jQuery, window.accordionBlockToggle);
'use strict';

/**
 * File carousel.js
 *
 * Deal with the Slick carousel.
 */
window.wdsCarousel = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		// If we're in an ACF edit page.
		if (window.acf) {
			app.doSlick();
		}

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			theCarousel: $('.carousel-block')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.doSlick);
		app.$c.window.on('load', app.doFirstAnimation);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.theCarousel.length;
	};

	// Animate the first slide on window load.
	app.doFirstAnimation = function () {

		// Get the first slide content area and animation attribute.
		var firstSlide = app.$c.theCarousel.find('[data-slick-index=0]'),
			firstSlideContent = firstSlide.find('.slide-content'),
			firstAnimation = firstSlideContent.attr('data-animation');

		// Add the animation class to the first slide.
		firstSlideContent.addClass(firstAnimation);
	};

	// Allow background videos to autoplay.
	app.playBackgroundVideos = function () {

		// Get all the videos in our slides object.
		$('video').each(function () {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		});
	};

	// Initialize our carousel.
	app.initializeCarousel = function () {

		$('.carousel-block').not('.slick-initialized').slick({
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: true,
			dots: true,
			focusOnSelect: true,
			waitForAnimate: true
		});
	};

	// Kick off Slick.
	app.doSlick = function () {

		// Render on the frontend.
		$(document).ready(function () {
			app.playBackgroundVideos;
			app.initializeCarousel();
		});

		// Render on the backend.
		if (window.acf) {
			window.acf.addAction('render_block_preview', app.initializeCarousel);
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsCarousel);
'use strict';

/**
 * Show/Hide the Search Form in the header.
 *
 * @author Corey Collins
 */
window.ShowHideSearchForm = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			body: $('body'),
			headerSearchToggle: $('.site-header-action .cta-button'),
			headerSearchForm: $('.site-header-action .form-container')
		};
	};

	// Combine all events
	app.bindEvents = function () {
		app.$c.headerSearchToggle.on('keyup click', app.showHideSearchForm);
		app.$c.body.on('keyup touchstart click', app.hideSearchForm);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.headerSearchToggle.length;
	};

	// Checks to see if the menu has been opened.
	app.searchIsOpen = function () {

		if (app.$c.body.hasClass('search-form-visible')) {
			return true;
		}

		return false;
	};

	// Adds the toggle class for the search form.
	app.showHideSearchForm = function () {
		app.$c.body.toggleClass('search-form-visible');

		app.toggleSearchFormAriaLabel();
		app.toggleSearchToggleAriaLabel();

		return false;
	};

	// Hides the search form if we click outside of its container.
	app.hideSearchForm = function (event) {

		if (!$(event.target).parents('div').hasClass('site-header-action')) {
			app.$c.body.removeClass('search-form-visible');
			app.toggleSearchFormAriaLabel();
			app.toggleSearchToggleAriaLabel();
		}
	};

	// Toggles the aria-hidden label on the form container.
	app.toggleSearchFormAriaLabel = function () {
		app.$c.headerSearchForm.attr('aria-hidden', app.searchIsOpen() ? 'false' : 'true');
	};

	// Toggles the aria-hidden label on the toggle button.
	app.toggleSearchToggleAriaLabel = function () {
		app.$c.headerSearchToggle.attr('aria-expanded', app.searchIsOpen() ? 'true' : 'false');
	};

	// Engage
	$(app.init);
})(window, jQuery, window.ShowHideSearchForm);
'use strict';

/**
 * File js-enabled.js
 *
 * If Javascript is enabled, replace the <body> class "no-js".
 */
document.body.className = document.body.className.replace('no-js', 'js');
'use strict';

/**
 * File: mobile-menu.js
 *
 * Create an accordion style dropdown.
 */
window.wdsMobileMenu = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			body: $('body'),
			window: $(window),
			subMenuContainer: $('.mobile-menu .sub-menu, .utility-navigation .sub-menu'),
			subSubMenuContainer: $('.mobile-menu .sub-menu .sub-menu'),
			subMenuParentItem: $('.mobile-menu li.menu-item-has-children, .utility-navigation li.menu-item-has-children'),
			offCanvasContainer: $('.off-canvas-container')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDownArrow);
		app.$c.subMenuParentItem.on('click', app.toggleSubmenu);
		app.$c.subMenuParentItem.on('transitionend', app.resetSubMenu);
		app.$c.offCanvasContainer.on('transitionend', app.forceCloseSubmenus);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.subMenuContainer.length;
	};

	// Reset the submenus after it's done closing.
	app.resetSubMenu = function () {

		// When the list item is done transitioning in height,
		// remove the classes from the submenu so it is ready to toggle again.
		if ($(this).is('li.menu-item-has-children') && !$(this).hasClass('is-visible')) {
			$(this).find('ul.sub-menu').removeClass('slideOutLeft is-visible');
		}
	};

	// Slide out the submenu items.
	app.slideOutSubMenus = function (el) {

		// If this item's parent is visible and this is not, bail.
		if (el.parent().hasClass('is-visible') && !el.hasClass('is-visible')) {
			return;
		}

		// If this item's parent is visible and this item is visible, hide its submenu then bail.
		if (el.parent().hasClass('is-visible') && el.hasClass('is-visible')) {
			el.removeClass('is-visible').find('.sub-menu').removeClass('slideInLeft').addClass('slideOutLeft');
			return;
		}

		app.$c.subMenuContainer.each(function () {

			// Only try to close submenus that are actually open.
			if ($(this).hasClass('slideInLeft')) {

				// Close the parent list item, and set the corresponding button aria to false.
				$(this).parent().removeClass('is-visible').find('.parent-indicator').attr('aria-expanded', false);

				// Slide out the submenu.
				$(this).removeClass('slideInLeft').addClass('slideOutLeft');
			}
		});
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function () {

		app.$c.subMenuParentItem.find('a:first').after('<button type="button" aria-expanded="false" class="parent-indicator" aria-label="Open submenu"><span class="down-arrow"></span></button>');
	};

	// Deal with the submenu.
	app.toggleSubmenu = function (e) {

		var el = $(this),
			// The menu element which was clicked on.
		subMenu = el.children('ul.sub-menu'),
			// The nearest submenu.
		$target = $(e.target); // the element that's actually being clicked (child of the li that triggered the click event).

		// Figure out if we're clicking the button or its arrow child,
		// if so, we can just open or close the menu and bail.
		if ($target.hasClass('down-arrow') || $target.hasClass('parent-indicator')) {

			// First, collapse any already opened submenus.
			app.slideOutSubMenus(el);

			if (!subMenu.hasClass('is-visible')) {

				// Open the submenu.
				app.openSubmenu(el, subMenu);
			}

			return false;
		}
	};

	// Open a submenu.
	app.openSubmenu = function (parent, subMenu) {

		// Expand the list menu item, and set the corresponding button aria to true.
		parent.addClass('is-visible').find('.parent-indicator').attr('aria-expanded', true);

		// Slide the menu in.
		subMenu.addClass('is-visible animated slideInLeft');
	};

	// Force close all the submenus when the main menu container is closed.
	app.forceCloseSubmenus = function (event) {
		if ($(event.target).hasClass('off-canvas-container')) {

			// Focus offcanvas menu for a11y.
			app.$c.offCanvasContainer.focus();

			// The transitionend event triggers on open and on close, need to make sure we only do this on close.
			if (!$(this).hasClass('is-visible')) {
				app.$c.subMenuParentItem.removeClass('is-visible').find('.parent-indicator').attr('aria-expanded', false);
				app.$c.subMenuContainer.removeClass('is-visible slideInLeft');
				app.$c.body.css('overflow', 'visible');
				app.$c.body.unbind('touchstart');
			}

			if ($(this).hasClass('is-visible')) {
				app.$c.body.css('overflow', 'hidden');
				app.$c.body.bind('touchstart', function (e) {
					if (!$(e.target).parents('.contact-modal')[0]) {
						e.preventDefault();
					}
				});
			}
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsMobileMenu);
'use strict';

/**
 * File modal.js
 *
 * Deal with multiple modals and their media.
 */
window.wdsModal = {};
(function (window, $, app) {

	var $modalToggle = void 0,
		$focusableChildren = void 0,
		$player = void 0,
		$tag = document.createElement('script'),
		$firstScriptTag = document.getElementsByTagName('script')[0],
		YT = void 0;

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			$firstScriptTag.parentNode.insertBefore($tag, $firstScriptTag);
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			'body': $('body')
		};
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return $('.modal-trigger').length;
	};

	// Combine all events.
	app.bindEvents = function () {

		// Trigger a modal to open.
		app.$c.body.on('click', '.modal-trigger', app.openModal);

		// Trigger the close button to close the modal.
		app.$c.body.on('click', '.close', app.closeModal);

		// Allow the user to close the modal by hitting the esc key.
		app.$c.body.on('keydown', app.escKeyClose);

		// Allow the user to close the modal by clicking outside of the modal.
		app.$c.body.on('click', 'div.modal-open', app.closeModalByClick);

		// Listen to tabs, trap keyboard if we need to
		app.$c.body.on('keydown', app.trapKeyboardMaybe);
	};

	// Open the modal.
	app.openModal = function () {

		// Store the modal toggle element
		$modalToggle = $(this);

		// Figure out which modal we're opening and store the object.
		var $modal = $($(this).data('target'));

		// Display the modal.
		$modal.addClass('modal-open');

		// Add body class.
		app.$c.body.addClass('modal-open');

		// Find the focusable children of the modal.
		// This list may be incomplete, really wish jQuery had the :focusable pseudo like jQuery UI does.
		// For more about :input see: https://api.jquery.com/input-selector/
		$focusableChildren = $modal.find('a, :input, [tabindex]');

		// Ideally, there is always one (the close button), but you never know.
		if (0 < $focusableChildren.length) {

			// Shift focus to the first focusable element.
			$focusableChildren[0].focus();
		}

		return false;
	};

	// Close the modal.
	app.closeModal = function () {

		// Figure the opened modal we're closing and store the object.
		var $modal = $($('div.modal-open .close').data('target')),


		// Find the iframe in the $modal object.
		$iframe = $modal.find('iframe');

		// Only do this if there are any iframes.
		if ($iframe.length) {

			// Get the iframe src URL.
			var url = $iframe.attr('src');

			// Removing/Readding the URL will effectively break the YouTube API.
			// So let's not do that when the iframe URL contains the enablejsapi parameter.
			if (!url.includes('enablejsapi=1')) {

				// Remove the source URL, then add it back, so the video can be played again later.
				$iframe.attr('src', '').attr('src', url);
			} else {

				// Use the YouTube API to stop the video.
				$player.stopVideo();
			}
		}

		// Finally, hide the modal.
		$modal.removeClass('modal-open');

		// Remove the body class.
		app.$c.body.removeClass('modal-open');

		// Revert focus back to toggle element
		$modalToggle.focus();

		return false;
	};

	// Close if "esc" key is pressed.
	app.escKeyClose = function (event) {
		if (27 === event.keyCode) {
			app.closeModal();
		}
	};

	// Close if the user clicks outside of the modal
	app.closeModalByClick = function (event) {

		// If the parent container is NOT the modal dialog container, close the modal
		if (!$(event.target).parents('div').hasClass('modal-dialog')) {
			app.closeModal();
		}
	};

	// Trap the keyboard into a modal when one is active.
	app.trapKeyboardMaybe = function (event) {

		// We only need to do stuff when the modal is open and tab is pressed.
		if (9 === event.which && 0 < $('.modal-open').length) {
			var $focused = $(':focus'),
				focusIndex = $focusableChildren.index($focused);

			if (0 === focusIndex && event.shiftKey) {

				// If this is the first focusable element, and shift is held when pressing tab, go back to last focusable element.
				$focusableChildren[$focusableChildren.length - 1].focus();
				event.preventDefault();
			} else if (!event.shiftKey && focusIndex === $focusableChildren.length - 1) {

				// If this is the last focusable element, and shift is not held, go back to the first focusable element.
				$focusableChildren[0].focus();
				event.preventDefault();
			}
		}
	};

	// Hook into YouTube <iframe>.
	app.onYouTubeIframeAPIReady = function () {
		var $modal = $('div.modal'),
			$iframeid = $modal.find('iframe').attr('id');

		$player = new YT.Player($iframeid, {
			events: {
				'onReady': app.onPlayerReady,
				'onStateChange': app.onPlayerStateChange
			}
		});
	};

	// Do something on player ready.
	app.onPlayerReady = function () {};

	// Do something on player state change.
	app.onPlayerStateChange = function () {

		// Set focus to the first focusable element inside of the modal the player is in.
		$(event.target.a).parents('.modal').find('a, :input, [tabindex]').first().focus();
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsModal);
'use strict';

/**
 * File: navigation-primary.js
 *
 * Helpers for the primary navigation.
 */
window.wdsPrimaryNavigation = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			subMenuContainer: $('.main-navigation .sub-menu'),
			subMenuParentItem: $('.main-navigation li.menu-item-has-children')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDownArrow);
		app.$c.subMenuParentItem.find('a').on('focusin focusout', app.toggleFocus);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.subMenuContainer.length;
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function () {
		app.$c.subMenuParentItem.find('> a').append('<span class="caret-down" aria-hidden="true"></span>');
	};

	// Toggle the focus class on the link parent.
	app.toggleFocus = function () {
		$(this).parents('li.menu-item-has-children').toggleClass('focus');
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsPrimaryNavigation);
'use strict';

/**
 * File: off-canvas.js
 *
 * Help deal with the off-canvas mobile menu.
 */
window.wdsoffCanvas = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			body: $('body'),
			offCanvasClose: $('.off-canvas-close'),
			offCanvasContainer: $('.off-canvas-container'),
			offCanvasOpen: $('.off-canvas-open'),
			offCanvasScreen: $('.off-canvas-screen')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.body.on('keydown', app.escKeyClose);
		app.$c.offCanvasClose.on('click', app.closeoffCanvas);
		app.$c.offCanvasOpen.on('click', app.toggleoffCanvas);
		app.$c.offCanvasScreen.on('click', app.closeoffCanvas);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.offCanvasContainer.length;
	};

	// To show or not to show?
	app.toggleoffCanvas = function () {

		if ('true' === $(this).attr('aria-expanded')) {
			app.closeoffCanvas();
		} else {
			app.openoffCanvas();
		}
	};

	// Show that drawer!
	app.openoffCanvas = function () {
		app.$c.offCanvasContainer.addClass('is-visible');
		app.$c.offCanvasOpen.addClass('is-visible');
		app.$c.offCanvasScreen.addClass('is-visible');

		app.$c.offCanvasOpen.attr('aria-expanded', true);
		app.$c.offCanvasContainer.attr('aria-hidden', false);
	};

	// Close that drawer!
	app.closeoffCanvas = function () {
		app.$c.offCanvasContainer.removeClass('is-visible');
		app.$c.offCanvasOpen.removeClass('is-visible');
		app.$c.offCanvasScreen.removeClass('is-visible');

		app.$c.offCanvasOpen.attr('aria-expanded', false);
		app.$c.offCanvasContainer.attr('aria-hidden', true);

		app.$c.offCanvasOpen.focus();
	};

	// Close drawer if "esc" key is pressed.
	app.escKeyClose = function (event) {
		if (27 === event.keyCode) {
			app.closeoffCanvas();
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsoffCanvas);
'use strict';

/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function () {
	var isWebkit = -1 < navigator.userAgent.toLowerCase().indexOf('webkit'),
		isOpera = -1 < navigator.userAgent.toLowerCase().indexOf('opera'),
		isIe = -1 < navigator.userAgent.toLowerCase().indexOf('msie');

	if ((isWebkit || isOpera || isIe) && document.getElementById && window.addEventListener) {
		window.addEventListener('hashchange', function () {
			var id = location.hash.substring(1),
				element;

			if (!/^[A-z0-9_-]+$/.test(id)) {
				return;
			}

			element = document.getElementById(id);

			if (element) {
				if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false);
	}
})();
'use strict';

/**
 * Make tables responsive again.
 *
 * @author Haris Zulfiqar
 */
window.wdsTables = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			table: $('table')
		};
	};

	// Combine all events
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDataLabel);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.table.length;
	};

	// Adds data-label to td based on th.
	app.addDataLabel = function () {
		var table = app.$c.table;
		var tableHeaders = table.find('thead th');
		var tableRow = table.find('tbody tr');

		tableRow.each(function () {
			var td = $(this).find('td');

			td.each(function (index) {
				if ($(tableHeaders.get(index))) {
					$(this).attr('data-label', $(tableHeaders.get(index)).text());
				}
			});
		});

		return false;
	};

	// Engage
	$(app.init);
})(window, jQuery, window.wdsTables);
'use strict';

/**
 * Video Playback Script.
 */
window.WDSVideoBackgroundObject = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			videoButton: $('.video-toggle')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.videoButton.on('click', app.doTogglePlayback);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.videoButton.length;
	};

	// Video Playback.
	app.doTogglePlayback = function () {
		$(this).parents('.content-block').toggleClass('video-toggled');

		if ($(this).parents('.content-block').hasClass('video-toggled')) {
			$(this).siblings('.video-background').trigger('pause');
		} else {
			$(this).siblings('.video-background').trigger('play');
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.WDSVideoBackgroundObject);
'use strict';

/**
 * File window-ready.js
 *
 * Add a "ready" class to <body> when window is ready.
 */
window.wdsWindowReady = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();
		app.bindEvents();
	};

	// Cache document elements.
	app.cache = function () {
		app.$c = {
			'window': $(window),
			'body': $(document.body)
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.load(app.addBodyClass);
	};

	// Add a class to <body>.
	app.addBodyClass = function () {
		app.$c.body.addClass('ready');
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsWindowReady);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyIsImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ0YWJsZS5qcyIsInZpZGVvLmpzIiwid2luZG93LXJlYWR5LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImFjY29yZGlvbkJsb2NrVG9nZ2xlIiwiJCIsImFwcCIsImluaXQiLCJjYWNoZSIsImFjZiIsImFkZEFjdGlvbiIsImJpbmRFdmVudHMiLCJtZWV0c1JlcXVpcmVtZW50cyIsIiRjIiwiaHRtbCIsImFjY29yZGlvbiIsIml0ZW1zIiwiaGVhZGVycyIsImNvbnRlbnRzIiwiYnV0dG9uIiwiYW5jaG9ySUQiLCJsb2NhdGlvbiIsImhhc2giLCJvbiIsInRvZ2dsZUFjY29yZGlvbiIsIm9wZW5IYXNoQWNjb3JkaW9uIiwibGVuZ3RoIiwicGFyZW50cyIsInRvZ2dsZUNsYXNzIiwiaXNFeHBhbmRlZCIsImhhc0NsYXNzIiwiZmluZCIsImF0dHIiLCJub3QiLCJyZW1vdmVDbGFzcyIsInNlbGVjdG9yIiwidHJpZ2dlciIsImFkbWluQmFySGVpZ2h0IiwiaGVpZ2h0IiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsImpRdWVyeSIsIndkc0Nhcm91c2VsIiwiZG9TbGljayIsInRoZUNhcm91c2VsIiwiZG9GaXJzdEFuaW1hdGlvbiIsImZpcnN0U2xpZGUiLCJmaXJzdFNsaWRlQ29udGVudCIsImZpcnN0QW5pbWF0aW9uIiwiYWRkQ2xhc3MiLCJwbGF5QmFja2dyb3VuZFZpZGVvcyIsImVhY2giLCJwbGF5IiwiaW5pdGlhbGl6ZUNhcm91c2VsIiwic2xpY2siLCJhdXRvcGxheSIsImF1dG9wbGF5U3BlZWQiLCJhcnJvd3MiLCJkb3RzIiwiZm9jdXNPblNlbGVjdCIsIndhaXRGb3JBbmltYXRlIiwiZG9jdW1lbnQiLCJyZWFkeSIsIlNob3dIaWRlU2VhcmNoRm9ybSIsImJvZHkiLCJoZWFkZXJTZWFyY2hUb2dnbGUiLCJoZWFkZXJTZWFyY2hGb3JtIiwic2hvd0hpZGVTZWFyY2hGb3JtIiwiaGlkZVNlYXJjaEZvcm0iLCJzZWFyY2hJc09wZW4iLCJ0b2dnbGVTZWFyY2hGb3JtQXJpYUxhYmVsIiwidG9nZ2xlU2VhcmNoVG9nZ2xlQXJpYUxhYmVsIiwiZXZlbnQiLCJ0YXJnZXQiLCJjbGFzc05hbWUiLCJyZXBsYWNlIiwid2RzTW9iaWxlTWVudSIsInN1Yk1lbnVDb250YWluZXIiLCJzdWJTdWJNZW51Q29udGFpbmVyIiwic3ViTWVudVBhcmVudEl0ZW0iLCJvZmZDYW52YXNDb250YWluZXIiLCJhZGREb3duQXJyb3ciLCJ0b2dnbGVTdWJtZW51IiwicmVzZXRTdWJNZW51IiwiZm9yY2VDbG9zZVN1Ym1lbnVzIiwiaXMiLCJzbGlkZU91dFN1Yk1lbnVzIiwiZWwiLCJwYXJlbnQiLCJhZnRlciIsImUiLCJzdWJNZW51IiwiY2hpbGRyZW4iLCIkdGFyZ2V0Iiwib3BlblN1Ym1lbnUiLCJmb2N1cyIsImNzcyIsInVuYmluZCIsImJpbmQiLCJwcmV2ZW50RGVmYXVsdCIsIndkc01vZGFsIiwiJG1vZGFsVG9nZ2xlIiwiJGZvY3VzYWJsZUNoaWxkcmVuIiwiJHBsYXllciIsIiR0YWciLCJjcmVhdGVFbGVtZW50IiwiJGZpcnN0U2NyaXB0VGFnIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJZVCIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJvcGVuTW9kYWwiLCJjbG9zZU1vZGFsIiwiZXNjS2V5Q2xvc2UiLCJjbG9zZU1vZGFsQnlDbGljayIsInRyYXBLZXlib2FyZE1heWJlIiwiJG1vZGFsIiwiZGF0YSIsIiRpZnJhbWUiLCJ1cmwiLCJpbmNsdWRlcyIsInN0b3BWaWRlbyIsImtleUNvZGUiLCJ3aGljaCIsIiRmb2N1c2VkIiwiZm9jdXNJbmRleCIsImluZGV4Iiwic2hpZnRLZXkiLCJvbllvdVR1YmVJZnJhbWVBUElSZWFkeSIsIiRpZnJhbWVpZCIsIlBsYXllciIsImV2ZW50cyIsIm9uUGxheWVyUmVhZHkiLCJvblBsYXllclN0YXRlQ2hhbmdlIiwiYSIsImZpcnN0Iiwid2RzUHJpbWFyeU5hdmlnYXRpb24iLCJ0b2dnbGVGb2N1cyIsImFwcGVuZCIsIndkc29mZkNhbnZhcyIsIm9mZkNhbnZhc0Nsb3NlIiwib2ZmQ2FudmFzT3BlbiIsIm9mZkNhbnZhc1NjcmVlbiIsImNsb3Nlb2ZmQ2FudmFzIiwidG9nZ2xlb2ZmQ2FudmFzIiwib3Blbm9mZkNhbnZhcyIsImlzV2Via2l0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwiaXNPcGVyYSIsImlzSWUiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZCIsInN1YnN0cmluZyIsImVsZW1lbnQiLCJ0ZXN0IiwidGFnTmFtZSIsInRhYkluZGV4Iiwid2RzVGFibGVzIiwidGFibGUiLCJhZGREYXRhTGFiZWwiLCJ0YWJsZUhlYWRlcnMiLCJ0YWJsZVJvdyIsInRkIiwiZ2V0IiwidGV4dCIsIldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCIsInZpZGVvQnV0dG9uIiwiZG9Ub2dnbGVQbGF5YmFjayIsInNpYmxpbmdzIiwid2RzV2luZG93UmVhZHkiLCJsb2FkIiwiYWRkQm9keUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBQSxPQUFPQyxvQkFBUCxHQUE4QixFQUE5QjtBQUNFLFdBQVVELE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUE7QUFDQSxNQUFLTCxPQUFPTSxHQUFaLEVBQWtCO0FBQ2pCTixVQUFPTSxHQUFQLENBQVdDLFNBQVgsQ0FBc0Isc0JBQXRCLEVBQThDSixJQUFJSyxVQUFsRDtBQUNBOztBQUVELE1BQUtM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d0ssd0JBM0N4QixDQUFGOzs7QUNKQTs7Ozs7QUFLQXhLLE9BQU80SyxjQUFQLEdBQXdCLEVBQXhCO0FBQ0UsV0FBVTVLLE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7QUFDQUYsTUFBSUssVUFBSjtBQUNBLEVBSEQ7O0FBS0E7QUFDQUwsS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlPLEVBQUosR0FBUztBQUNSLGFBQVVSLEVBQUdGLE1BQUgsQ0FERjtBQUVSLFdBQVFFLEVBQUcwRCxTQUFTRyxJQUFaO0FBRkEsR0FBVDtBQUlBLEVBTEQ7O0FBT0E7QUFDQTVELEtBQUlLLFVBQUosR0FBaUIsWUFBVztBQUMzQkwsTUFBSU8sRUFBSixDQUFPVixNQUFQLENBQWM2SyxJQUFkLENBQW9CMUssSUFBSTJLLFlBQXhCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBM0ssS0FBSTJLLFlBQUosR0FBbUIsWUFBVztBQUM3QjNLLE1BQUlPLEVBQUosQ0FBT3FELElBQVAsQ0FBWWYsUUFBWixDQUFzQixPQUF0QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQTlDLEdBQUdDLElBQUlDLElBQVA7QUFDQSxDQTVCQyxFQTRCQ0osTUE1QkQsRUE0QlN3QyxNQTVCVCxFQTRCaUJ4QyxPQUFPNEssY0E1QnhCLENBQUYiLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQWNjb3JkaW9uIGJsb2NrIGZ1bmN0aW9uYWxpdHlcbiAqXG4gKiBAYXV0aG9yIFNoYW5ub24gTWFjTWlsbGFuLCBDb3JleSBDb2xsaW5zXG4gKi9cbndpbmRvdy5hY2NvcmRpb25CbG9ja1RvZ2dsZSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3Jcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdC8vIElmIHdlJ3JlIGluIGFuIEFDRiBlZGl0IHBhZ2UuXG5cdFx0aWYgKCB3aW5kb3cuYWNmICkge1xuXHRcdFx0d2luZG93LmFjZi5hZGRBY3Rpb24oICdyZW5kZXJfYmxvY2tfcHJldmlldycsIGFwcC5iaW5kRXZlbnRzICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRodG1sOiAkKCAnaHRtbCcgKSxcblx0XHRcdGFjY29yZGlvbjogJCggJy5hY2NvcmRpb24nICksXG5cdFx0XHRpdGVtczogJCggJy5hY2NvcmRpb24taXRlbScgKSxcblx0XHRcdGhlYWRlcnM6ICQoICcuYWNjb3JkaW9uLWl0ZW0taGVhZGVyJyApLFxuXHRcdFx0Y29udGVudHM6ICQoICcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcgKSxcblx0XHRcdGJ1dHRvbjogJCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICksXG5cdFx0XHRhbmNob3JJRDogJCggd2luZG93LmxvY2F0aW9uLmhhc2ggKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0JCggJy5hY2NvcmRpb24taXRlbS1oZWFkZXInICkub24oICdjbGljaycsIGFwcC50b2dnbGVBY2NvcmRpb24gKTtcblx0XHQkKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZUFjY29yZGlvbiApO1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLm9wZW5IYXNoQWNjb3JkaW9uICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLmFjY29yZGlvbi5sZW5ndGg7XG5cdH07XG5cblx0YXBwLnRvZ2dsZUFjY29yZGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gQWRkIHRoZSBvcGVuIGNsYXNzIHRvIHRoZSBpdGVtLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnb3BlbicgKTtcblxuXHRcdC8vIElzIHRoaXMgb25lIGV4cGFuZGVkP1xuXHRcdGxldCBpc0V4cGFuZGVkID0gJCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuaGFzQ2xhc3MoICdvcGVuJyApO1xuXG5cdFx0Ly8gU2V0IHRoaXMgYnV0dG9uJ3MgYXJpYS1leHBhbmRlZCB2YWx1ZS5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGlzRXhwYW5kZWQgPyAndHJ1ZScgOiAnZmFsc2UnICk7XG5cblx0XHQvLyBTZXQgYWxsIG90aGVyIGl0ZW1zIGluIHRoaXMgYmxvY2sgdG8gYXJpYS1oaWRkZW49dHJ1ZS5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24tYmxvY2snICkuZmluZCggJy5hY2NvcmRpb24taXRlbS1jb250ZW50JyApLm5vdCggJCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkgKS5hdHRyKCAnYXJpYS1oaWRkZW4nLCAndHJ1ZScgKTtcblxuXHRcdC8vIFNldCB0aGlzIGl0ZW0gdG8gYXJpYS1oaWRkZW49ZmFsc2UuXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuZmluZCggJy5hY2NvcmRpb24taXRlbS1jb250ZW50JyApLmF0dHIoICdhcmlhLWhpZGRlbicsIGlzRXhwYW5kZWQgPyAnZmFsc2UnIDogJ3RydWUnICk7XG5cblx0XHQvLyBIaWRlIHRoZSBvdGhlciBwYW5lbHMuXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWJsb2NrJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0nICkubm90KCAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKSApLnJlbW92ZUNsYXNzKCAnb3BlbicgKTtcblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24tYmxvY2snICkuZmluZCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICkubm90KCAkKCB0aGlzICkgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHRhcHAub3Blbkhhc2hBY2NvcmRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmICggISBhcHAuJGMuYW5jaG9ySUQuc2VsZWN0b3IgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gVHJpZ2dlciBhIGNsaWNrIG9uIHRoZSBidXR0b24gY2xvc2VzdCB0byB0aGlzIGFjY29yZGlvbi5cblx0XHRhcHAuJGMuYW5jaG9ySUQucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS50cmlnZ2VyKCAnY2xpY2snICk7XG5cblx0XHQvLyBOb3Qgc2V0dGluZyBhIGNhY2hlZCB2YXJpYWJsZSBhcyBpdCBkb2Vzbid0IHNlZW0gdG8gZ3JhYiB0aGUgaGVpZ2h0IHByb3Blcmx5LlxuXHRcdGNvbnN0IGFkbWluQmFySGVpZ2h0ID0gJCggJyN3cGFkbWluYmFyJyApLmxlbmd0aCA/ICQoICcjd3BhZG1pbmJhcicgKS5oZWlnaHQoKSA6IDA7XG5cblx0XHQvLyBBbmltYXRlIHRvIHRoZSBkaXYgZm9yIGEgbmljZXIgZXhwZXJpZW5jZS5cblx0XHRhcHAuJGMuaHRtbC5hbmltYXRlKCB7XG5cdFx0XHRzY3JvbGxUb3A6IGFwcC4kYy5hbmNob3JJRC5vZmZzZXQoKS50b3AgLSBhZG1pbkJhckhlaWdodFxuXHRcdH0sICdzbG93JyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZVxuXHRhcHAuaW5pdCgpO1xuXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy5hY2NvcmRpb25CbG9ja1RvZ2dsZSApICk7XG4iLCIvKipcbiAqIEZpbGUgY2Fyb3VzZWwuanNcbiAqXG4gKiBEZWFsIHdpdGggdGhlIFNsaWNrIGNhcm91c2VsLlxuICovXG53aW5kb3cud2RzQ2Fyb3VzZWwgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0Ly8gSWYgd2UncmUgaW4gYW4gQUNGIGVkaXQgcGFnZS5cblx0XHRpZiAoIHdpbmRvdy5hY2YgKSB7XG5cdFx0XHRhcHAuZG9TbGljaygpO1xuXHRcdH1cblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHRoZUNhcm91c2VsOiAkKCAnLmNhcm91c2VsLWJsb2NrJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuZG9TbGljayApO1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmRvRmlyc3RBbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMudGhlQ2Fyb3VzZWwubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFuaW1hdGUgdGhlIGZpcnN0IHNsaWRlIG9uIHdpbmRvdyBsb2FkLlxuXHRhcHAuZG9GaXJzdEFuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IHRoZSBmaXJzdCBzbGlkZSBjb250ZW50IGFyZWEgYW5kIGFuaW1hdGlvbiBhdHRyaWJ1dGUuXG5cdFx0bGV0IGZpcnN0U2xpZGUgPSBhcHAuJGMudGhlQ2Fyb3VzZWwuZmluZCggJ1tkYXRhLXNsaWNrLWluZGV4PTBdJyApLFxuXHRcdFx0Zmlyc3RTbGlkZUNvbnRlbnQgPSBmaXJzdFNsaWRlLmZpbmQoICcuc2xpZGUtY29udGVudCcgKSxcblx0XHRcdGZpcnN0QW5pbWF0aW9uID0gZmlyc3RTbGlkZUNvbnRlbnQuYXR0ciggJ2RhdGEtYW5pbWF0aW9uJyApO1xuXG5cdFx0Ly8gQWRkIHRoZSBhbmltYXRpb24gY2xhc3MgdG8gdGhlIGZpcnN0IHNsaWRlLlxuXHRcdGZpcnN0U2xpZGVDb250ZW50LmFkZENsYXNzKCBmaXJzdEFuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIEFsbG93IGJhY2tncm91bmQgdmlkZW9zIHRvIGF1dG9wbGF5LlxuXHRhcHAucGxheUJhY2tncm91bmRWaWRlb3MgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEdldCBhbGwgdGhlIHZpZGVvcyBpbiBvdXIgc2xpZGVzIG9iamVjdC5cblx0XHQkKCAndmlkZW8nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIExldCB0aGVtIGF1dG9wbGF5LiBUT0RPOiBQb3NzaWJseSBjaGFuZ2UgdGhpcyBsYXRlciB0byBvbmx5IHBsYXkgdGhlIHZpc2libGUgc2xpZGUgdmlkZW8uXG5cdFx0XHR0aGlzLnBsYXkoKTtcblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gSW5pdGlhbGl6ZSBvdXIgY2Fyb3VzZWwuXG5cdGFwcC5pbml0aWFsaXplQ2Fyb3VzZWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdCQoICcuY2Fyb3VzZWwtYmxvY2snICkubm90KCAnLnNsaWNrLWluaXRpYWxpemVkJyApLnNsaWNrKCB7XG5cdFx0XHRhdXRvcGxheTogdHJ1ZSxcblx0XHRcdGF1dG9wbGF5U3BlZWQ6IDUwMDAsXG5cdFx0XHRhcnJvd3M6IHRydWUsXG5cdFx0XHRkb3RzOiB0cnVlLFxuXHRcdFx0Zm9jdXNPblNlbGVjdDogdHJ1ZSxcblx0XHRcdHdhaXRGb3JBbmltYXRlOiB0cnVlXG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIEtpY2sgb2ZmIFNsaWNrLlxuXHRhcHAuZG9TbGljayA9IGZ1bmN0aW9uKCkge1xuXG5cblx0XHQvLyBSZW5kZXIgb24gdGhlIGZyb250ZW5kLlxuXHRcdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdFx0YXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zO1xuXHRcdFx0YXBwLmluaXRpYWxpemVDYXJvdXNlbCgpO1xuXHRcdH0gKTtcblxuXHRcdC8vIFJlbmRlciBvbiB0aGUgYmFja2VuZC5cblx0XHRpZiAoIHdpbmRvdy5hY2YgKSB7XG5cdFx0XHR3aW5kb3cuYWNmLmFkZEFjdGlvbiggJ3JlbmRlcl9ibG9ja19wcmV2aWV3JywgYXBwLmluaXRpYWxpemVDYXJvdXNlbCApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNDYXJvdXNlbCApICk7XG4iLCIvKipcbiAqIFNob3cvSGlkZSB0aGUgU2VhcmNoIEZvcm0gaW4gdGhlIGhlYWRlci5cbiAqXG4gKiBAYXV0aG9yIENvcmV5IENvbGxpbnNcbiAqL1xud2luZG93LlNob3dIaWRlU2VhcmNoRm9ybSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3Jcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5nc1xuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0Ym9keTogJCggJ2JvZHknICksXG5cdFx0XHRoZWFkZXJTZWFyY2hUb2dnbGU6ICQoICcuc2l0ZS1oZWFkZXItYWN0aW9uIC5jdGEtYnV0dG9uJyApLFxuXHRcdFx0aGVhZGVyU2VhcmNoRm9ybTogJCggJy5zaXRlLWhlYWRlci1hY3Rpb24gLmZvcm0tY29udGFpbmVyJyApLFxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmhlYWRlclNlYXJjaFRvZ2dsZS5vbiggJ2tleXVwIGNsaWNrJywgYXBwLnNob3dIaWRlU2VhcmNoRm9ybSApO1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5dXAgdG91Y2hzdGFydCBjbGljaycsIGFwcC5oaWRlU2VhcmNoRm9ybSApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5oZWFkZXJTZWFyY2hUb2dnbGUubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIENoZWNrcyB0byBzZWUgaWYgdGhlIG1lbnUgaGFzIGJlZW4gb3BlbmVkLlxuXHRhcHAuc2VhcmNoSXNPcGVuID0gZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoIGFwcC4kYy5ib2R5Lmhhc0NsYXNzKCAnc2VhcmNoLWZvcm0tdmlzaWJsZScgKSApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHQvLyBBZGRzIHRoZSB0b2dnbGUgY2xhc3MgZm9yIHRoZSBzZWFyY2ggZm9ybS5cblx0YXBwLnNob3dIaWRlU2VhcmNoRm9ybSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5LnRvZ2dsZUNsYXNzKCAnc2VhcmNoLWZvcm0tdmlzaWJsZScgKTtcblxuXHRcdGFwcC50b2dnbGVTZWFyY2hGb3JtQXJpYUxhYmVsKCk7XG5cdFx0YXBwLnRvZ2dsZVNlYXJjaFRvZ2dsZUFyaWFMYWJlbCgpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdC8vIEhpZGVzIHRoZSBzZWFyY2ggZm9ybSBpZiB3ZSBjbGljayBvdXRzaWRlIG9mIGl0cyBjb250YWluZXIuXG5cdGFwcC5oaWRlU2VhcmNoRm9ybSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnc2l0ZS1oZWFkZXItYWN0aW9uJyApICkge1xuXHRcdFx0YXBwLiRjLmJvZHkucmVtb3ZlQ2xhc3MoICdzZWFyY2gtZm9ybS12aXNpYmxlJyApO1xuXHRcdFx0YXBwLnRvZ2dsZVNlYXJjaEZvcm1BcmlhTGFiZWwoKTtcblx0XHRcdGFwcC50b2dnbGVTZWFyY2hUb2dnbGVBcmlhTGFiZWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gVG9nZ2xlcyB0aGUgYXJpYS1oaWRkZW4gbGFiZWwgb24gdGhlIGZvcm0gY29udGFpbmVyLlxuXHRhcHAudG9nZ2xlU2VhcmNoRm9ybUFyaWFMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5oZWFkZXJTZWFyY2hGb3JtLmF0dHIoICdhcmlhLWhpZGRlbicsIGFwcC5zZWFyY2hJc09wZW4oKSA/ICdmYWxzZScgOiAndHJ1ZScgKTtcblx0fTtcblxuXHQvLyBUb2dnbGVzIHRoZSBhcmlhLWhpZGRlbiBsYWJlbCBvbiB0aGUgdG9nZ2xlIGJ1dHRvbi5cblx0YXBwLnRvZ2dsZVNlYXJjaFRvZ2dsZUFyaWFMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5oZWFkZXJTZWFyY2hUb2dnbGUuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBhcHAuc2VhcmNoSXNPcGVuKCkgPyAndHJ1ZScgOiAnZmFsc2UnICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93LlNob3dIaWRlU2VhcmNoRm9ybSApICk7XG4iLCIvKipcbiAqIEZpbGUganMtZW5hYmxlZC5qc1xuICpcbiAqIElmIEphdmFzY3JpcHQgaXMgZW5hYmxlZCwgcmVwbGFjZSB0aGUgPGJvZHk+IGNsYXNzIFwibm8tanNcIi5cbiAqL1xuZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKCAnbm8tanMnLCAnanMnICk7XG4iLCIvKipcbiAqIEZpbGU6IG1vYmlsZS1tZW51LmpzXG4gKlxuICogQ3JlYXRlIGFuIGFjY29yZGlvbiBzdHlsZSBkcm9wZG93bi5cbiAqL1xud2luZG93Lndkc01vYmlsZU1lbnUgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudSwgLnV0aWxpdHktbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJTdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudSAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tb2JpbGUtbWVudSBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuLCAudXRpbGl0eS1uYXZpZ2F0aW9uIGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICksXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICdjbGljaycsIGFwcC50b2dnbGVTdWJtZW51ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5yZXNldFN1Yk1lbnUgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5mb3JjZUNsb3NlU3VibWVudXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gUmVzZXQgdGhlIHN1Ym1lbnVzIGFmdGVyIGl0J3MgZG9uZSBjbG9zaW5nLlxuXHRhcHAucmVzZXRTdWJNZW51ID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBXaGVuIHRoZSBsaXN0IGl0ZW0gaXMgZG9uZSB0cmFuc2l0aW9uaW5nIGluIGhlaWdodCxcblx0XHQvLyByZW1vdmUgdGhlIGNsYXNzZXMgZnJvbSB0aGUgc3VibWVudSBzbyBpdCBpcyByZWFkeSB0byB0b2dnbGUgYWdhaW4uXG5cdFx0aWYgKCAkKCB0aGlzICkuaXMoICdsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApICYmICEgJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdCQoIHRoaXMgKS5maW5kKCAndWwuc3ViLW1lbnUnICkucmVtb3ZlQ2xhc3MoICdzbGlkZU91dExlZnQgaXMtdmlzaWJsZScgKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUgaXRlbXMuXG5cdGFwcC5zbGlkZU91dFN1Yk1lbnVzID0gZnVuY3Rpb24oIGVsICkge1xuXG5cdFx0Ly8gSWYgdGhpcyBpdGVtJ3MgcGFyZW50IGlzIHZpc2libGUgYW5kIHRoaXMgaXMgbm90LCBiYWlsLlxuXHRcdGlmICggZWwucGFyZW50KCkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICYmICEgZWwuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIElmIHRoaXMgaXRlbSdzIHBhcmVudCBpcyB2aXNpYmxlIGFuZCB0aGlzIGl0ZW0gaXMgdmlzaWJsZSwgaGlkZSBpdHMgc3VibWVudSB0aGVuIGJhaWwuXG5cdFx0aWYgKCBlbC5wYXJlbnQoKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgJiYgZWwuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0ZWwucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcuc3ViLW1lbnUnICkucmVtb3ZlQ2xhc3MoICdzbGlkZUluTGVmdCcgKS5hZGRDbGFzcyggJ3NsaWRlT3V0TGVmdCcgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gT25seSB0cnkgdG8gY2xvc2Ugc3VibWVudXMgdGhhdCBhcmUgYWN0dWFsbHkgb3Blbi5cblx0XHRcdGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnc2xpZGVJbkxlZnQnICkgKSB7XG5cblx0XHRcdFx0Ly8gQ2xvc2UgdGhlIHBhcmVudCBsaXN0IGl0ZW0sIGFuZCBzZXQgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9uIGFyaWEgdG8gZmFsc2UuXG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUuXG5cdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xuXHRcdFx0fVxuXG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblxuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnYTpmaXJzdCcgKS5hZnRlciggJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGNsYXNzPVwicGFyZW50LWluZGljYXRvclwiIGFyaWEtbGFiZWw9XCJPcGVuIHN1Ym1lbnVcIj48c3BhbiBjbGFzcz1cImRvd24tYXJyb3dcIj48L3NwYW4+PC9idXR0b24+JyApO1xuXHR9O1xuXG5cdC8vIERlYWwgd2l0aCB0aGUgc3VibWVudS5cblx0YXBwLnRvZ2dsZVN1Ym1lbnUgPSBmdW5jdGlvbiggZSApIHtcblxuXHRcdGxldCBlbCA9ICQoIHRoaXMgKSwgLy8gVGhlIG1lbnUgZWxlbWVudCB3aGljaCB3YXMgY2xpY2tlZCBvbi5cblx0XHRcdHN1Yk1lbnUgPSBlbC5jaGlsZHJlbiggJ3VsLnN1Yi1tZW51JyApLCAvLyBUaGUgbmVhcmVzdCBzdWJtZW51LlxuXHRcdFx0JHRhcmdldCA9ICQoIGUudGFyZ2V0ICk7IC8vIHRoZSBlbGVtZW50IHRoYXQncyBhY3R1YWxseSBiZWluZyBjbGlja2VkIChjaGlsZCBvZiB0aGUgbGkgdGhhdCB0cmlnZ2VyZWQgdGhlIGNsaWNrIGV2ZW50KS5cblxuXHRcdC8vIEZpZ3VyZSBvdXQgaWYgd2UncmUgY2xpY2tpbmcgdGhlIGJ1dHRvbiBvciBpdHMgYXJyb3cgY2hpbGQsXG5cdFx0Ly8gaWYgc28sIHdlIGNhbiBqdXN0IG9wZW4gb3IgY2xvc2UgdGhlIG1lbnUgYW5kIGJhaWwuXG5cdFx0aWYgKCAkdGFyZ2V0Lmhhc0NsYXNzKCAnZG93bi1hcnJvdycgKSB8fCAkdGFyZ2V0Lmhhc0NsYXNzKCAncGFyZW50LWluZGljYXRvcicgKSApIHtcblxuXHRcdFx0Ly8gRmlyc3QsIGNvbGxhcHNlIGFueSBhbHJlYWR5IG9wZW5lZCBzdWJtZW51cy5cblx0XHRcdGFwcC5zbGlkZU91dFN1Yk1lbnVzKCBlbCApO1xuXG5cdFx0XHRpZiAoICEgc3ViTWVudS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cblx0XHRcdFx0Ly8gT3BlbiB0aGUgc3VibWVudS5cblx0XHRcdFx0YXBwLm9wZW5TdWJtZW51KCBlbCwgc3ViTWVudSApO1xuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBPcGVuIGEgc3VibWVudS5cblx0YXBwLm9wZW5TdWJtZW51ID0gZnVuY3Rpb24oIHBhcmVudCwgc3ViTWVudSApIHtcblxuXHRcdC8vIEV4cGFuZCB0aGUgbGlzdCBtZW51IGl0ZW0sIGFuZCBzZXQgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9uIGFyaWEgdG8gdHJ1ZS5cblx0XHRwYXJlbnQuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcblxuXHRcdC8vIFNsaWRlIHRoZSBtZW51IGluLlxuXHRcdHN1Yk1lbnUuYWRkQ2xhc3MoICdpcy12aXNpYmxlIGFuaW1hdGVkIHNsaWRlSW5MZWZ0JyApO1xuXHR9O1xuXG5cdC8vIEZvcmNlIGNsb3NlIGFsbCB0aGUgc3VibWVudXMgd2hlbiB0aGUgbWFpbiBtZW51IGNvbnRhaW5lciBpcyBjbG9zZWQuXG5cdGFwcC5mb3JjZUNsb3NlU3VibWVudXMgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAkKCBldmVudC50YXJnZXQgKS5oYXNDbGFzcyggJ29mZi1jYW52YXMtY29udGFpbmVyJyApICkge1xuXG5cdFx0XHQvLyBGb2N1cyBvZmZjYW52YXMgbWVudSBmb3IgYTExeS5cblx0XHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuZm9jdXMoKTtcblxuXHRcdFx0Ly8gVGhlIHRyYW5zaXRpb25lbmQgZXZlbnQgdHJpZ2dlcnMgb24gb3BlbiBhbmQgb24gY2xvc2UsIG5lZWQgdG8gbWFrZSBzdXJlIHdlIG9ubHkgZG8gdGhpcyBvbiBjbG9zZS5cblx0XHRcdGlmICggISAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZSBzbGlkZUluTGVmdCcgKTtcblx0XHRcdFx0YXBwLiRjLmJvZHkuY3NzKCAnb3ZlcmZsb3cnLCAndmlzaWJsZScgKTtcblx0XHRcdFx0YXBwLiRjLmJvZHkudW5iaW5kKCAndG91Y2hzdGFydCcgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0XHRhcHAuJGMuYm9keS5jc3MoICdvdmVyZmxvdycsICdoaWRkZW4nICk7XG5cdFx0XHRcdGFwcC4kYy5ib2R5LmJpbmQoICd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCAhICQoIGUudGFyZ2V0ICkucGFyZW50cyggJy5jb250YWN0LW1vZGFsJyApWzBdICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzTW9iaWxlTWVudSApICk7XG4iLCIvKipcbiAqIEZpbGUgbW9kYWwuanNcbiAqXG4gKiBEZWFsIHdpdGggbXVsdGlwbGUgbW9kYWxzIGFuZCB0aGVpciBtZWRpYS5cbiAqL1xud2luZG93Lndkc01vZGFsID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHRsZXQgJG1vZGFsVG9nZ2xlLFxuXHRcdCRmb2N1c2FibGVDaGlsZHJlbixcblx0XHQkcGxheWVyLFxuXHRcdCR0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc2NyaXB0JyApLFxuXHRcdCRmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnc2NyaXB0JyApWzBdLFxuXHRcdFlUO1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdCRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggJHRhZywgJGZpcnN0U2NyaXB0VGFnICk7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J2JvZHknOiAkKCAnYm9keScgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJCggJy5tb2RhbC10cmlnZ2VyJyApLmxlbmd0aDtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBUcmlnZ2VyIGEgbW9kYWwgdG8gb3Blbi5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrJywgJy5tb2RhbC10cmlnZ2VyJywgYXBwLm9wZW5Nb2RhbCApO1xuXG5cdFx0Ly8gVHJpZ2dlciB0aGUgY2xvc2UgYnV0dG9uIHRvIGNsb3NlIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrJywgJy5jbG9zZScsIGFwcC5jbG9zZU1vZGFsICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgaGl0dGluZyB0aGUgZXNjIGtleS5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIGNsb3NlIHRoZSBtb2RhbCBieSBjbGlja2luZyBvdXRzaWRlIG9mIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrJywgJ2Rpdi5tb2RhbC1vcGVuJywgYXBwLmNsb3NlTW9kYWxCeUNsaWNrICk7XG5cblx0XHQvLyBMaXN0ZW4gdG8gdGFicywgdHJhcCBrZXlib2FyZCBpZiB3ZSBuZWVkIHRvXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLnRyYXBLZXlib2FyZE1heWJlICk7XG5cblx0fTtcblxuXHQvLyBPcGVuIHRoZSBtb2RhbC5cblx0YXBwLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gU3RvcmUgdGhlIG1vZGFsIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlID0gJCggdGhpcyApO1xuXG5cdFx0Ly8gRmlndXJlIG91dCB3aGljaCBtb2RhbCB3ZSdyZSBvcGVuaW5nIGFuZCBzdG9yZSB0aGUgb2JqZWN0LlxuXHRcdGxldCAkbW9kYWwgPSAkKCAkKCB0aGlzICkuZGF0YSggJ3RhcmdldCcgKSApO1xuXG5cdFx0Ly8gRGlzcGxheSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEFkZCBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEZpbmQgdGhlIGZvY3VzYWJsZSBjaGlsZHJlbiBvZiB0aGUgbW9kYWwuXG5cdFx0Ly8gVGhpcyBsaXN0IG1heSBiZSBpbmNvbXBsZXRlLCByZWFsbHkgd2lzaCBqUXVlcnkgaGFkIHRoZSA6Zm9jdXNhYmxlIHBzZXVkbyBsaWtlIGpRdWVyeSBVSSBkb2VzLlxuXHRcdC8vIEZvciBtb3JlIGFib3V0IDppbnB1dCBzZWU6IGh0dHBzOi8vYXBpLmpxdWVyeS5jb20vaW5wdXQtc2VsZWN0b3IvXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuID0gJG1vZGFsLmZpbmQoICdhLCA6aW5wdXQsIFt0YWJpbmRleF0nICk7XG5cblx0XHQvLyBJZGVhbGx5LCB0aGVyZSBpcyBhbHdheXMgb25lICh0aGUgY2xvc2UgYnV0dG9uKSwgYnV0IHlvdSBuZXZlciBrbm93LlxuXHRcdGlmICggMCA8ICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggKSB7XG5cblx0XHRcdC8vIFNoaWZ0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblxuXHR9O1xuXG5cdC8vIENsb3NlIHRoZSBtb2RhbC5cblx0YXBwLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEZpZ3VyZSB0aGUgb3BlbmVkIG1vZGFsIHdlJ3JlIGNsb3NpbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoICdkaXYubW9kYWwtb3BlbiAuY2xvc2UnICkuZGF0YSggJ3RhcmdldCcgKSApLFxuXG5cdFx0XHQvLyBGaW5kIHRoZSBpZnJhbWUgaW4gdGhlICRtb2RhbCBvYmplY3QuXG5cdFx0XHQkaWZyYW1lID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICk7XG5cblx0XHQvLyBPbmx5IGRvIHRoaXMgaWYgdGhlcmUgYXJlIGFueSBpZnJhbWVzLlxuXHRcdGlmICggJGlmcmFtZS5sZW5ndGggKSB7XG5cblx0XHRcdC8vIEdldCB0aGUgaWZyYW1lIHNyYyBVUkwuXG5cdFx0XHRsZXQgdXJsID0gJGlmcmFtZS5hdHRyKCAnc3JjJyApO1xuXG5cdFx0XHQvLyBSZW1vdmluZy9SZWFkZGluZyB0aGUgVVJMIHdpbGwgZWZmZWN0aXZlbHkgYnJlYWsgdGhlIFlvdVR1YmUgQVBJLlxuXHRcdFx0Ly8gU28gbGV0J3Mgbm90IGRvIHRoYXQgd2hlbiB0aGUgaWZyYW1lIFVSTCBjb250YWlucyB0aGUgZW5hYmxlanNhcGkgcGFyYW1ldGVyLlxuXHRcdFx0aWYgKCAhIHVybC5pbmNsdWRlcyggJ2VuYWJsZWpzYXBpPTEnICkgKSB7XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBzb3VyY2UgVVJMLCB0aGVuIGFkZCBpdCBiYWNrLCBzbyB0aGUgdmlkZW8gY2FuIGJlIHBsYXllZCBhZ2FpbiBsYXRlci5cblx0XHRcdFx0JGlmcmFtZS5hdHRyKCAnc3JjJywgJycgKS5hdHRyKCAnc3JjJywgdXJsICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFVzZSB0aGUgWW91VHViZSBBUEkgdG8gc3RvcCB0aGUgdmlkZW8uXG5cdFx0XHRcdCRwbGF5ZXIuc3RvcFZpZGVvKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmluYWxseSwgaGlkZSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgYm9keSBjbGFzcy5cblx0XHRhcHAuJGMuYm9keS5yZW1vdmVDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBSZXZlcnQgZm9jdXMgYmFjayB0byB0b2dnbGUgZWxlbWVudFxuXHRcdCRtb2RhbFRvZ2dsZS5mb2N1cygpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdH07XG5cblx0Ly8gQ2xvc2UgaWYgXCJlc2NcIiBrZXkgaXMgcHJlc3NlZC5cblx0YXBwLmVzY0tleUNsb3NlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggMjcgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRhcHAuY2xvc2VNb2RhbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDbG9zZSBpZiB0aGUgdXNlciBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgbW9kYWxcblx0YXBwLmNsb3NlTW9kYWxCeUNsaWNrID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gSWYgdGhlIHBhcmVudCBjb250YWluZXIgaXMgTk9UIHRoZSBtb2RhbCBkaWFsb2cgY29udGFpbmVyLCBjbG9zZSB0aGUgbW9kYWxcblx0XHRpZiAoICEgJCggZXZlbnQudGFyZ2V0ICkucGFyZW50cyggJ2RpdicgKS5oYXNDbGFzcyggJ21vZGFsLWRpYWxvZycgKSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIFRyYXAgdGhlIGtleWJvYXJkIGludG8gYSBtb2RhbCB3aGVuIG9uZSBpcyBhY3RpdmUuXG5cdGFwcC50cmFwS2V5Ym9hcmRNYXliZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIFdlIG9ubHkgbmVlZCB0byBkbyBzdHVmZiB3aGVuIHRoZSBtb2RhbCBpcyBvcGVuIGFuZCB0YWIgaXMgcHJlc3NlZC5cblx0XHRpZiAoIDkgPT09IGV2ZW50LndoaWNoICYmIDAgPCAkKCAnLm1vZGFsLW9wZW4nICkubGVuZ3RoICkge1xuXHRcdFx0bGV0ICRmb2N1c2VkID0gJCggJzpmb2N1cycgKSxcblx0XHRcdFx0Zm9jdXNJbmRleCA9ICRmb2N1c2FibGVDaGlsZHJlbi5pbmRleCggJGZvY3VzZWQgKTtcblxuXHRcdFx0aWYgKCAwID09PSBmb2N1c0luZGV4ICYmIGV2ZW50LnNoaWZ0S2V5ICkge1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgaGVsZCB3aGVuIHByZXNzaW5nIHRhYiwgZ28gYmFjayB0byBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxIF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZXZlbnQuc2hpZnRLZXkgJiYgZm9jdXNJbmRleCA9PT0gJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgbGFzdCBmb2N1c2FibGUgZWxlbWVudCwgYW5kIHNoaWZ0IGlzIG5vdCBoZWxkLCBnbyBiYWNrIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEhvb2sgaW50byBZb3VUdWJlIDxpZnJhbWU+LlxuXHRhcHAub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgJG1vZGFsID0gJCggJ2Rpdi5tb2RhbCcgKSxcblx0XHRcdCRpZnJhbWVpZCA9ICRtb2RhbC5maW5kKCAnaWZyYW1lJyApLmF0dHIoICdpZCcgKTtcblxuXHRcdCRwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCAkaWZyYW1laWQsIHtcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHQnb25SZWFkeSc6IGFwcC5vblBsYXllclJlYWR5LFxuXHRcdFx0XHQnb25TdGF0ZUNoYW5nZSc6IGFwcC5vblBsYXllclN0YXRlQ2hhbmdlXG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIERvIHNvbWV0aGluZyBvbiBwbGF5ZXIgcmVhZHkuXG5cdGFwcC5vblBsYXllclJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciBzdGF0ZSBjaGFuZ2UuXG5cdGFwcC5vblBsYXllclN0YXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTZXQgZm9jdXMgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IGluc2lkZSBvZiB0aGUgbW9kYWwgdGhlIHBsYXllciBpcyBpbi5cblx0XHQkKCBldmVudC50YXJnZXQuYSApLnBhcmVudHMoICcubW9kYWwnICkuZmluZCggJ2EsIDppbnB1dCwgW3RhYmluZGV4XScgKS5maXJzdCgpLmZvY3VzKCk7XG5cdH07XG5cblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc01vZGFsICkgKTtcbiIsIi8qKlxuICogRmlsZTogbmF2aWdhdGlvbi1wcmltYXJ5LmpzXG4gKlxuICogSGVscGVycyBmb3IgdGhlIHByaW1hcnkgbmF2aWdhdGlvbi5cbiAqL1xud2luZG93Lndkc1ByaW1hcnlOYXZpZ2F0aW9uID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHN1Yk1lbnVDb250YWluZXI6ICQoICcubWFpbi1uYXZpZ2F0aW9uIC5zdWItbWVudScgKSxcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1haW4tbmF2aWdhdGlvbiBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRG93bkFycm93ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICdhJyApLm9uKCAnZm9jdXNpbiBmb2N1c291dCcsIGFwcC50b2dnbGVGb2N1cyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBZGQgdGhlIGRvd24gYXJyb3cgdG8gc3VibWVudSBwYXJlbnRzLlxuXHRhcHAuYWRkRG93bkFycm93ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICc+IGEnICkuYXBwZW5kKCAnPHNwYW4gY2xhc3M9XCJjYXJldC1kb3duXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPicgKTtcblx0fTtcblxuXHQvLyBUb2dnbGUgdGhlIGZvY3VzIGNsYXNzIG9uIHRoZSBsaW5rIHBhcmVudC5cblx0YXBwLnRvZ2dsZUZvY3VzID0gZnVuY3Rpb24oKSB7XG5cdFx0JCggdGhpcyApLnBhcmVudHMoICdsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApLnRvZ2dsZUNsYXNzKCAnZm9jdXMnICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1ByaW1hcnlOYXZpZ2F0aW9uICkgKTtcbiIsIi8qKlxuICogRmlsZTogb2ZmLWNhbnZhcy5qc1xuICpcbiAqIEhlbHAgZGVhbCB3aXRoIHRoZSBvZmYtY2FudmFzIG1vYmlsZSBtZW51LlxuICovXG53aW5kb3cud2Rzb2ZmQ2FudmFzID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0Ym9keTogJCggJ2JvZHknICksXG5cdFx0XHRvZmZDYW52YXNDbG9zZTogJCggJy5vZmYtY2FudmFzLWNsb3NlJyApLFxuXHRcdFx0b2ZmQ2FudmFzQ29udGFpbmVyOiAkKCAnLm9mZi1jYW52YXMtY29udGFpbmVyJyApLFxuXHRcdFx0b2ZmQ2FudmFzT3BlbjogJCggJy5vZmYtY2FudmFzLW9wZW4nICksXG5cdFx0XHRvZmZDYW52YXNTY3JlZW46ICQoICcub2ZmLWNhbnZhcy1zY3JlZW4nIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ2xvc2Uub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLm9uKCAnY2xpY2snLCBhcHAudG9nZ2xlb2ZmQ2FudmFzICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gVG8gc2hvdyBvciBub3QgdG8gc2hvdz9cblx0YXBwLnRvZ2dsZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCAndHJ1ZScgPT09ICQoIHRoaXMgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSApIHtcblx0XHRcdGFwcC5jbG9zZW9mZkNhbnZhcygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhcHAub3Blbm9mZkNhbnZhcygpO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIFNob3cgdGhhdCBkcmF3ZXIhXG5cdGFwcC5vcGVub2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hdHRyKCAnYXJpYS1oaWRkZW4nLCBmYWxzZSApO1xuXHR9O1xuXG5cdC8vIENsb3NlIHRoYXQgZHJhd2VyIVxuXHRhcHAuY2xvc2VvZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hdHRyKCAnYXJpYS1oaWRkZW4nLCB0cnVlICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5mb2N1cygpO1xuXHR9O1xuXG5cdC8vIENsb3NlIGRyYXdlciBpZiBcImVzY1wiIGtleSBpcyBwcmVzc2VkLlxuXHRhcHAuZXNjS2V5Q2xvc2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdGFwcC5jbG9zZW9mZkNhbnZhcygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2Rzb2ZmQ2FudmFzICkgKTtcbiIsIi8qKlxuICogRmlsZSBza2lwLWxpbmstZm9jdXMtZml4LmpzLlxuICpcbiAqIEhlbHBzIHdpdGggYWNjZXNzaWJpbGl0eSBmb3Iga2V5Ym9hcmQgb25seSB1c2Vycy5cbiAqXG4gKiBMZWFybiBtb3JlOiBodHRwczovL2dpdC5pby92V2RyMlxuICovXG4oIGZ1bmN0aW9uKCkge1xuXHR2YXIgaXNXZWJraXQgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnd2Via2l0JyApLFxuXHRcdGlzT3BlcmEgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICksXG5cdFx0aXNJZSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApO1xuXG5cdGlmICggKCBpc1dlYmtpdCB8fCBpc09wZXJhIHx8IGlzSWUgKSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpZCA9IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICksXG5cdFx0XHRcdGVsZW1lbnQ7XG5cblx0XHRcdGlmICggISAoIC9eW0EtejAtOV8tXSskLyApLnRlc3QoIGlkICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGlmICggISAoIC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaSApLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSApO1xuXHR9XG59KCkgKTtcbiIsIi8qKlxuICogTWFrZSB0YWJsZXMgcmVzcG9uc2l2ZSBhZ2Fpbi5cbiAqXG4gKiBAYXV0aG9yIEhhcmlzIFp1bGZpcWFyXG4gKi9cbndpbmRvdy53ZHNUYWJsZXMgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3Ncblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHRhYmxlOiAkKCAndGFibGUnIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50c1xuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERhdGFMYWJlbCApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy50YWJsZS5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQWRkcyBkYXRhLWxhYmVsIHRvIHRkIGJhc2VkIG9uIHRoLlxuXHRhcHAuYWRkRGF0YUxhYmVsID0gZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgdGFibGUgPSBhcHAuJGMudGFibGU7XG5cdFx0Y29uc3QgdGFibGVIZWFkZXJzID0gdGFibGUuZmluZCggJ3RoZWFkIHRoJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93ID0gdGFibGUuZmluZCggJ3Rib2R5IHRyJyApO1xuXG5cdFx0dGFibGVSb3cuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0ZCA9ICQoIHRoaXMgKS5maW5kKCAndGQnICk7XG5cblx0XHRcdHRkLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdFx0aWYgKCAkKCB0YWJsZUhlYWRlcnMuZ2V0KCBpbmRleCApICkgKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLmF0dHIoICdkYXRhLWxhYmVsJywgJCggdGFibGVIZWFkZXJzLmdldCggaW5kZXggKSApLnRleHQoKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZVxuXHQkKCBhcHAuaW5pdCApO1xuXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNUYWJsZXMgKSApO1xuIiwiLyoqXG4gKiBWaWRlbyBQbGF5YmFjayBTY3JpcHQuXG4gKi9cbndpbmRvdy5XRFNWaWRlb0JhY2tncm91bmRPYmplY3QgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0dmlkZW9CdXR0b246ICQoICcudmlkZW8tdG9nZ2xlJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnZpZGVvQnV0dG9uLm9uKCAnY2xpY2snLCBhcHAuZG9Ub2dnbGVQbGF5YmFjayApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy52aWRlb0J1dHRvbi5sZW5ndGg7XG5cdH07XG5cblx0Ly8gVmlkZW8gUGxheWJhY2suXG5cdGFwcC5kb1RvZ2dsZVBsYXliYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuY29udGVudC1ibG9jaycgKS50b2dnbGVDbGFzcyggJ3ZpZGVvLXRvZ2dsZWQnICk7XG5cblx0XHRpZiAoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmNvbnRlbnQtYmxvY2snICkuaGFzQ2xhc3MoICd2aWRlby10b2dnbGVkJyApICkge1xuXHRcdFx0JCggdGhpcyApLnNpYmxpbmdzKCAnLnZpZGVvLWJhY2tncm91bmQnICkudHJpZ2dlciggJ3BhdXNlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCB0aGlzICkuc2libGluZ3MoICcudmlkZW8tYmFja2dyb3VuZCcgKS50cmlnZ2VyKCAncGxheScgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93LldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCApICk7XG4iLCIvKipcbiAqIEZpbGUgd2luZG93LXJlYWR5LmpzXG4gKlxuICogQWRkIGEgXCJyZWFkeVwiIGNsYXNzIHRvIDxib2R5PiB3aGVuIHdpbmRvdyBpcyByZWFkeS5cbiAqL1xud2luZG93Lndkc1dpbmRvd1JlYWR5ID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHR9O1xuXG5cdC8vIENhY2hlIGRvY3VtZW50IGVsZW1lbnRzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHQnd2luZG93JzogJCggd2luZG93ICksXG5cdFx0XHQnYm9keSc6ICQoIGRvY3VtZW50LmJvZHkgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cubG9hZCggYXBwLmFkZEJvZHlDbGFzcyApO1xuXHR9O1xuXG5cdC8vIEFkZCBhIGNsYXNzIHRvIDxib2R5Pi5cblx0YXBwLmFkZEJvZHlDbGFzcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5LmFkZENsYXNzKCAncmVhZHknICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNXaW5kb3dSZWFkeSApICk7XG4iXX0=
