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
		app.$c.headers.on('click touchstart', app.toggleAccordion);
		app.$c.button.on('click touchstart', app.toggleAccordion);
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

	// Animate the slide content.
	app.doAnimation = function () {
		var slides = $(this).find('.slide'),
			activeSlide = $(this).find('.slick-current'),
			activeContent = activeSlide.find('.slide-content'),


		// This is a string like so: 'animated someCssClass'.
		animationClass = activeContent.attr('data-animation');

		if (undefined === animationClass) {
			return;
		}

		var splitAnimation = animationClass.split(' '),


		// This is the 'animated' class.
		animationTrigger = splitAnimation[0];

		// Go through each slide to see if we've already set animation classes.
		slides.each(function () {
			var slideContent = $(this).find('.slide-content');

			// If we've set animation classes on a slide, remove them.
			if (slideContent.hasClass('animated')) {

				// Get the last class, which is the animate.css class.
				var lastClass = slideContent.attr('class').split(' ').pop();

				// Remove both animation classes.
				slideContent.removeClass(lastClass).removeClass(animationTrigger);
			}
		});

		// Add animation classes after slide is in view.
		activeContent.addClass(animationClass);
	};

	// Allow background videos to autoplay.
	app.playBackgroundVideos = function () {

		// Get all the videos in our slides object.
		$('video').each(function () {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		});
	};

	// Kick off Slick.
	app.doSlick = function () {

		var initializeCarousel = function initializeCarousel($block) {
			$('.carousel-block').not('.slick-initialized').slick({
				autoplay: true,
				autoplaySpeed: 5000,
				arrows: true,
				dots: true,
				focusOnSelect: true,
				waitForAnimate: true
			});
		};

		// Render on the frontend.
		$(document).ready(function () {
			app.playBackgroundVideos;
			initializeCarousel();
		});

		// Render on the backend.
		if (window.acf) {
			window.acf.addAction('render_block_preview', initializeCarousel);
		}

		app.$c.theCarousel.on('afterChange', app.doAnimation);
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
		app.$c.headerSearchToggle.on('keyup touchstart click', app.showHideSearchForm);
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
		app.$c.body.on('click touchstart', '.modal-trigger', app.openModal);

		// Trigger the close button to close the modal.
		app.$c.body.on('click touchstart', '.close', app.closeModal);

		// Allow the user to close the modal by hitting the esc key.
		app.$c.body.on('keydown', app.escKeyClose);

		// Allow the user to close the modal by clicking outside of the modal.
		app.$c.body.on('click touchstart', 'div.modal-open', app.closeModalByClick);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyIsImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ0YWJsZS5qcyIsInZpZGVvLmpzIiwid2luZG93LXJlYWR5LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImFjY29yZGlvbkJsb2NrVG9nZ2xlIiwiJCIsImFwcCIsImluaXQiLCJjYWNoZSIsIm1lZXRzUmVxdWlyZW1lbnRzIiwiYmluZEV2ZW50cyIsIiRjIiwiaHRtbCIsImFjY29yZGlvbiIsIml0ZW1zIiwiaGVhZGVycyIsImNvbnRlbnRzIiwiYnV0dG9uIiwiYW5jaG9ySUQiLCJsb2NhdGlvbiIsImhhc2giLCJvbiIsInRvZ2dsZUFjY29yZGlvbiIsIm9wZW5IYXNoQWNjb3JkaW9uIiwibGVuZ3RoIiwicGFyZW50cyIsInRvZ2dsZUNsYXNzIiwiaXNFeHBhbmRlZCIsImhhc0NsYXNzIiwiZmluZCIsImF0dHIiLCJub3QiLCJyZW1vdmVDbGFzcyIsInNlbGVjdG9yIiwidHJpZ2dlciIsImFkbWluQmFySGVpZ2h0IiwiaGVpZ2h0IiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsImpRdWVyeSIsIndkc0Nhcm91c2VsIiwiYWNmIiwiZG9TbGljayIsInRoZUNhcm91c2VsIiwiZG9GaXJzdEFuaW1hdGlvbiIsImZpcnN0U2xpZGUiLCJmaXJzdFNsaWRlQ29udGVudCIsImZpcnN0QW5pbWF0aW9uIiwiYWRkQ2xhc3MiLCJkb0FuaW1hdGlvbiIsInNsaWRlcyIsImFjdGl2ZVNsaWRlIiwiYWN0aXZlQ29udGVudCIsImFuaW1hdGlvbkNsYXNzIiwidW5kZWZpbmVkIiwic3BsaXRBbmltYXRpb24iLCJzcGxpdCIsImFuaW1hdGlvblRyaWdnZXIiLCJlYWNoIiwic2xpZGVDb250ZW50IiwibGFzdENsYXNzIiwicG9wIiwicGxheUJhY2tncm91bmRWaWRlb3MiLCJwbGF5IiwiaW5pdGlhbGl6ZUNhcm91c2VsIiwiJGJsb2NrIiwic2xpY2siLCJhdXRvcGxheSIsImF1dG9wbGF5U3BlZWQiLCJhcnJvd3MiLCJkb3RzIiwiZm9jdXNPblNlbGVjdCIsIndhaXRGb3JBbmltYXRlIiwiZG9jdW1lbnQiLCJyZWFkeSIsImFkZEFjdGlvbiIsIlNob3dIaWRlU2VhcmNoRm9ybSIsImJvZHkiLCJoZWFkZXJTZWFyY2hUb2dnbGUiLCJoZWFkZXJTZWFyY2hGb3JtIiwic2hvd0hpZGVTZWFyY2hGb3JtIiwiaGlkZVNlYXJjaEZvcm0iLCJzZWFyY2hJc09wZW4iLCJ0b2dnbGVTZWFyY2hGb3JtQXJpYUxhYmVsIiwidG9nZ2xlU2VhcmNoVG9nZ2xlQXJpYUxhYmVsIiwiZXZlbnQiLCJ0YXJnZXQiLCJjbGFzc05hbWUiLCJyZXBsYWNlIiwid2RzTW9iaWxlTWVudSIsInN1Yk1lbnVDb250YWluZXIiLCJzdWJTdWJNZW51Q29udGFpbmVyIiwic3ViTWVudVBhcmVudEl0ZW0iLCJvZmZDYW52YXNDb250YWluZXIiLCJhZGREb3duQXJyb3ciLCJ0b2dnbGVTdWJtZW51IiwicmVzZXRTdWJNZW51IiwiZm9yY2VDbG9zZVN1Ym1lbnVzIiwiaXMiLCJzbGlkZU91dFN1Yk1lbnVzIiwiZWwiLCJwYXJlbnQiLCJhZnRlciIsImUiLCJzdWJNZW51IiwiY2hpbGRyZW4iLCIkdGFyZ2V0Iiwib3BlblN1Ym1lbnUiLCJmb2N1cyIsImNzcyIsInVuYmluZCIsImJpbmQiLCJwcmV2ZW50RGVmYXVsdCIsIndkc01vZGFsIiwiJG1vZGFsVG9nZ2xlIiwiJGZvY3VzYWJsZUNoaWxkcmVuIiwiJHBsYXllciIsIiR0YWciLCJjcmVhdGVFbGVtZW50IiwiJGZpcnN0U2NyaXB0VGFnIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJZVCIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJvcGVuTW9kYWwiLCJjbG9zZU1vZGFsIiwiZXNjS2V5Q2xvc2UiLCJjbG9zZU1vZGFsQnlDbGljayIsInRyYXBLZXlib2FyZE1heWJlIiwiJG1vZGFsIiwiZGF0YSIsIiRpZnJhbWUiLCJ1cmwiLCJpbmNsdWRlcyIsInN0b3BWaWRlbyIsImtleUNvZGUiLCJ3aGljaCIsIiRmb2N1c2VkIiwiZm9jdXNJbmRleCIsImluZGV4Iiwic2hpZnRLZXkiLCJvbllvdVR1YmVJZnJhbWVBUElSZWFkeSIsIiRpZnJhbWVpZCIsIlBsYXllciIsImV2ZW50cyIsIm9uUGxheWVyUmVhZHkiLCJvblBsYXllclN0YXRlQ2hhbmdlIiwiYSIsImZpcnN0Iiwid2RzUHJpbWFyeU5hdmlnYXRpb24iLCJ0b2dnbGVGb2N1cyIsImFwcGVuZCIsIndkc29mZkNhbnZhcyIsIm9mZkNhbnZhc0Nsb3NlIiwib2ZmQ2FudmFzT3BlbiIsIm9mZkNhbnZhc1NjcmVlbiIsImNsb3Nlb2ZmQ2FudmFzIiwidG9nZ2xlb2ZmQ2FudmFzIiwib3Blbm9mZkNhbnZhcyIsImlzV2Via2l0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwiaXNPcGVyYSIsImlzSWUiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZCIsInN1YnN0cmluZyIsImVsZW1lbnQiLCJ0ZXN0IiwidGFnTmFtZSIsInRhYkluZGV4Iiwid2RzVGFibGVzIiwidGFibGUiLCJhZGREYXRhTGFiZWwiLCJ0YWJsZUhlYWRlcnMiLCJ0YWJsZVJvdyIsInRkIiwiZ2V0IiwidGV4dCIsIldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCIsInZpZGVvQnV0dG9uIiwiZG9Ub2dnbGVQbGF5YmFjayIsInNpYmxpbmdzIiwid2RzV2luZG93UmVhZHkiLCJsb2FkIiwiYWRkQm9keUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBQSxPQUFPQyxvQkFBUCxHQUE4QixFQUE5QjtBQUNFLFdBQVVELE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixF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eUwsY0FBUCxHQUF3QixFQUF4QjtBQUNFLFdBQVV6TCxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKO0FBQ0FGLE1BQUlJLFVBQUo7QUFDQSxFQUhEOztBQUtBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUixhQUFVTixFQUFHRixNQUFILENBREY7QUFFUixXQUFRRSxFQUFHc0UsU0FBU0ksSUFBWjtBQUZBLEdBQVQ7QUFJQSxFQUxEOztBQU9BO0FBQ0F6RSxLQUFJSSxVQUFKLEdBQWlCLFlBQVc7QUFDM0JKLE1BQUlLLEVBQUosQ0FBT1IsTUFBUCxDQUFjMEwsSUFBZCxDQUFvQnZMLElBQUl3TCxZQUF4QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQXhMLEtBQUl3TCxZQUFKLEdBQW1CLFlBQVc7QUFDN0J4TCxNQUFJSyxFQUFKLENBQU9vRSxJQUFQLENBQVk3QixRQUFaLENBQXNCLE9BQXRCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBN0MsR0FBR0MsSUFBSUMsSUFBUDtBQUNBLENBNUJDLEVBNEJDSixNQTVCRCxFQTRCU3NDLE1BNUJULEVBNEJpQnRDLE9BQU95TCxjQTVCeEIsQ0FBRiIsImZpbGUiOiJwcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBY2NvcmRpb24gYmxvY2sgZnVuY3Rpb25hbGl0eVxuICpcbiAqIEBhdXRob3IgU2hhbm5vbiBNYWNNaWxsYW4sIENvcmV5IENvbGxpbnNcbiAqL1xud2luZG93LmFjY29yZGlvbkJsb2NrVG9nZ2xlID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3RvclxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRodG1sOiAkKCAnaHRtbCcgKSxcblx0XHRcdGFjY29yZGlvbjogJCggJy5hY2NvcmRpb24nICksXG5cdFx0XHRpdGVtczogJCggJy5hY2NvcmRpb24taXRlbScgKSxcblx0XHRcdGhlYWRlcnM6ICQoICcuYWNjb3JkaW9uLWl0ZW0taGVhZGVyJyApLFxuXHRcdFx0Y29udGVudHM6ICQoICcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcgKSxcblx0XHRcdGJ1dHRvbjogJCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICksXG5cdFx0XHRhbmNob3JJRDogJCggd2luZG93LmxvY2F0aW9uLmhhc2ggKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmhlYWRlcnMub24oICdjbGljayB0b3VjaHN0YXJ0JywgYXBwLnRvZ2dsZUFjY29yZGlvbiApO1xuXHRcdGFwcC4kYy5idXR0b24ub24oICdjbGljayB0b3VjaHN0YXJ0JywgYXBwLnRvZ2dsZUFjY29yZGlvbiApO1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLm9wZW5IYXNoQWNjb3JkaW9uICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLmFjY29yZGlvbi5sZW5ndGg7XG5cdH07XG5cblx0YXBwLnRvZ2dsZUFjY29yZGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gQWRkIHRoZSBvcGVuIGNsYXNzIHRvIHRoZSBpdGVtLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnb3BlbicgKTtcblxuXHRcdC8vIElzIHRoaXMgb25lIGV4cGFuZGVkP1xuXHRcdGxldCBpc0V4cGFuZGVkID0gJCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuaGFzQ2xhc3MoICdvcGVuJyApO1xuXG5cdFx0Ly8gU2V0IHRoaXMgYnV0dG9uJ3MgYXJpYS1leHBhbmRlZCB2YWx1ZS5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGlzRXhwYW5kZWQgPyAndHJ1ZScgOiAnZmFsc2UnICk7XG5cblx0XHQvLyBTZXQgYWxsIG90aGVyIGl0ZW1zIGluIHRoaXMgYmxvY2sgdG8gYXJpYS1oaWRkZW49dHJ1ZS5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24tYmxvY2snICkuZmluZCggJy5hY2NvcmRpb24taXRlbS1jb250ZW50JyApLm5vdCggJCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkgKS5hdHRyKCAnYXJpYS1oaWRkZW4nLCAndHJ1ZScgKTtcblxuXHRcdC8vIFNldCB0aGlzIGl0ZW0gdG8gYXJpYS1oaWRkZW49ZmFsc2UuXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuZmluZCggJy5hY2NvcmRpb24taXRlbS1jb250ZW50JyApLmF0dHIoICdhcmlhLWhpZGRlbicsIGlzRXhwYW5kZWQgPyAnZmFsc2UnIDogJ3RydWUnICk7XG5cblx0XHQvLyBIaWRlIHRoZSBvdGhlciBwYW5lbHMuXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWJsb2NrJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0nICkubm90KCAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKSApLnJlbW92ZUNsYXNzKCAnb3BlbicgKTtcblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24tYmxvY2snICkuZmluZCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICkubm90KCAkKCB0aGlzICkgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHRhcHAub3Blbkhhc2hBY2NvcmRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmICggISBhcHAuJGMuYW5jaG9ySUQuc2VsZWN0b3IgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gVHJpZ2dlciBhIGNsaWNrIG9uIHRoZSBidXR0b24gY2xvc2VzdCB0byB0aGlzIGFjY29yZGlvbi5cblx0XHRhcHAuJGMuYW5jaG9ySUQucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS50cmlnZ2VyKCAnY2xpY2snICk7XG5cblx0XHQvLyBOb3Qgc2V0dGluZyBhIGNhY2hlZCB2YXJpYWJsZSBhcyBpdCBkb2Vzbid0IHNlZW0gdG8gZ3JhYiB0aGUgaGVpZ2h0IHByb3Blcmx5LlxuXHRcdGNvbnN0IGFkbWluQmFySGVpZ2h0ID0gJCggJyN3cGFkbWluYmFyJyApLmxlbmd0aCA/ICQoICcjd3BhZG1pbmJhcicgKS5oZWlnaHQoKSA6IDA7XG5cblx0XHQvLyBBbmltYXRlIHRvIHRoZSBkaXYgZm9yIGEgbmljZXIgZXhwZXJpZW5jZS5cblx0XHRhcHAuJGMuaHRtbC5hbmltYXRlKCB7XG5cdFx0XHRzY3JvbGxUb3A6IGFwcC4kYy5hbmNob3JJRC5vZmZzZXQoKS50b3AgLSBhZG1pbkJhckhlaWdodFxuXHRcdH0sICdzbG93JyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZVxuXHRhcHAuaW5pdCgpO1xuXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy5hY2NvcmRpb25CbG9ja1RvZ2dsZSApICk7XG4iLCIvKipcbiAqIEZpbGUgY2Fyb3VzZWwuanNcbiAqXG4gKiBEZWFsIHdpdGggdGhlIFNsaWNrIGNhcm91c2VsLlxuICovXG53aW5kb3cud2RzQ2Fyb3VzZWwgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0Ly8gSWYgd2UncmUgaW4gYW4gQUNGIGVkaXQgcGFnZS5cblx0XHRpZiAoIHdpbmRvdy5hY2YgKSB7XG5cdFx0XHRhcHAuZG9TbGljaygpO1xuXHRcdH1cblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHRoZUNhcm91c2VsOiAkKCAnLmNhcm91c2VsLWJsb2NrJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuZG9TbGljayApO1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmRvRmlyc3RBbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMudGhlQ2Fyb3VzZWwubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFuaW1hdGUgdGhlIGZpcnN0IHNsaWRlIG9uIHdpbmRvdyBsb2FkLlxuXHRhcHAuZG9GaXJzdEFuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IHRoZSBmaXJzdCBzbGlkZSBjb250ZW50IGFyZWEgYW5kIGFuaW1hdGlvbiBhdHRyaWJ1dGUuXG5cdFx0bGV0IGZpcnN0U2xpZGUgPSBhcHAuJGMudGhlQ2Fyb3VzZWwuZmluZCggJ1tkYXRhLXNsaWNrLWluZGV4PTBdJyApLFxuXHRcdFx0Zmlyc3RTbGlkZUNvbnRlbnQgPSBmaXJzdFNsaWRlLmZpbmQoICcuc2xpZGUtY29udGVudCcgKSxcblx0XHRcdGZpcnN0QW5pbWF0aW9uID0gZmlyc3RTbGlkZUNvbnRlbnQuYXR0ciggJ2RhdGEtYW5pbWF0aW9uJyApO1xuXG5cdFx0Ly8gQWRkIHRoZSBhbmltYXRpb24gY2xhc3MgdG8gdGhlIGZpcnN0IHNsaWRlLlxuXHRcdGZpcnN0U2xpZGVDb250ZW50LmFkZENsYXNzKCBmaXJzdEFuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIEFuaW1hdGUgdGhlIHNsaWRlIGNvbnRlbnQuXG5cdGFwcC5kb0FuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCBzbGlkZXMgPSAkKCB0aGlzICkuZmluZCggJy5zbGlkZScgKSxcblx0XHRcdGFjdGl2ZVNsaWRlID0gJCggdGhpcyApLmZpbmQoICcuc2xpY2stY3VycmVudCcgKSxcblx0XHRcdGFjdGl2ZUNvbnRlbnQgPSBhY3RpdmVTbGlkZS5maW5kKCAnLnNsaWRlLWNvbnRlbnQnICksXG5cblx0XHRcdC8vIFRoaXMgaXMgYSBzdHJpbmcgbGlrZSBzbzogJ2FuaW1hdGVkIHNvbWVDc3NDbGFzcycuXG5cdFx0XHRhbmltYXRpb25DbGFzcyA9IGFjdGl2ZUNvbnRlbnQuYXR0ciggJ2RhdGEtYW5pbWF0aW9uJyApO1xuXG5cdFx0XHRpZiAoIHVuZGVmaW5lZCA9PT0gYW5pbWF0aW9uQ2xhc3MgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHNwbGl0QW5pbWF0aW9uID0gYW5pbWF0aW9uQ2xhc3Muc3BsaXQoICcgJyApLFxuXG5cdFx0XHQvLyBUaGlzIGlzIHRoZSAnYW5pbWF0ZWQnIGNsYXNzLlxuXHRcdFx0YW5pbWF0aW9uVHJpZ2dlciA9IHNwbGl0QW5pbWF0aW9uWzBdO1xuXG5cdFx0Ly8gR28gdGhyb3VnaCBlYWNoIHNsaWRlIHRvIHNlZSBpZiB3ZSd2ZSBhbHJlYWR5IHNldCBhbmltYXRpb24gY2xhc3Nlcy5cblx0XHRzbGlkZXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRsZXQgc2xpZGVDb250ZW50ID0gJCggdGhpcyApLmZpbmQoICcuc2xpZGUtY29udGVudCcgKTtcblxuXHRcdFx0Ly8gSWYgd2UndmUgc2V0IGFuaW1hdGlvbiBjbGFzc2VzIG9uIGEgc2xpZGUsIHJlbW92ZSB0aGVtLlxuXHRcdFx0aWYgKCBzbGlkZUNvbnRlbnQuaGFzQ2xhc3MoICdhbmltYXRlZCcgKSApIHtcblxuXHRcdFx0XHQvLyBHZXQgdGhlIGxhc3QgY2xhc3MsIHdoaWNoIGlzIHRoZSBhbmltYXRlLmNzcyBjbGFzcy5cblx0XHRcdFx0bGV0IGxhc3RDbGFzcyA9IHNsaWRlQ29udGVudFxuXHRcdFx0XHRcdC5hdHRyKCAnY2xhc3MnIClcblx0XHRcdFx0XHQuc3BsaXQoICcgJyApXG5cdFx0XHRcdFx0LnBvcCgpO1xuXG5cdFx0XHRcdC8vIFJlbW92ZSBib3RoIGFuaW1hdGlvbiBjbGFzc2VzLlxuXHRcdFx0XHRzbGlkZUNvbnRlbnQucmVtb3ZlQ2xhc3MoIGxhc3RDbGFzcyApLnJlbW92ZUNsYXNzKCBhbmltYXRpb25UcmlnZ2VyICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gQWRkIGFuaW1hdGlvbiBjbGFzc2VzIGFmdGVyIHNsaWRlIGlzIGluIHZpZXcuXG5cdFx0YWN0aXZlQ29udGVudC5hZGRDbGFzcyggYW5pbWF0aW9uQ2xhc3MgKTtcblx0fTtcblxuXHQvLyBBbGxvdyBiYWNrZ3JvdW5kIHZpZGVvcyB0byBhdXRvcGxheS5cblx0YXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBHZXQgYWxsIHRoZSB2aWRlb3MgaW4gb3VyIHNsaWRlcyBvYmplY3QuXG5cdFx0JCggJ3ZpZGVvJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBMZXQgdGhlbSBhdXRvcGxheS4gVE9ETzogUG9zc2libHkgY2hhbmdlIHRoaXMgbGF0ZXIgdG8gb25seSBwbGF5IHRoZSB2aXNpYmxlIHNsaWRlIHZpZGVvLlxuXHRcdFx0dGhpcy5wbGF5KCk7XG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIEtpY2sgb2ZmIFNsaWNrLlxuXHRhcHAuZG9TbGljayA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0bGV0IGluaXRpYWxpemVDYXJvdXNlbCA9IGZ1bmN0aW9uKCAkYmxvY2sgKSB7XG5cdFx0XHQkKCAnLmNhcm91c2VsLWJsb2NrJyApLm5vdCggJy5zbGljay1pbml0aWFsaXplZCcgKS5zbGljaygge1xuXHRcdFx0XHRhdXRvcGxheTogdHJ1ZSxcblx0XHRcdFx0YXV0b3BsYXlTcGVlZDogNTAwMCxcblx0XHRcdFx0YXJyb3dzOiB0cnVlLFxuXHRcdFx0XHRkb3RzOiB0cnVlLFxuXHRcdFx0XHRmb2N1c09uU2VsZWN0OiB0cnVlLFxuXHRcdFx0XHR3YWl0Rm9yQW5pbWF0ZTogdHJ1ZVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdC8vIFJlbmRlciBvbiB0aGUgZnJvbnRlbmQuXG5cdFx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0XHRhcHAucGxheUJhY2tncm91bmRWaWRlb3M7XG5cdFx0XHRpbml0aWFsaXplQ2Fyb3VzZWwoKTtcblx0XHR9ICk7XG5cblx0XHQvLyBSZW5kZXIgb24gdGhlIGJhY2tlbmQuXG5cdFx0aWYgKCB3aW5kb3cuYWNmICkge1xuXHRcdFx0d2luZG93LmFjZi5hZGRBY3Rpb24oICdyZW5kZXJfYmxvY2tfcHJldmlldycsIGluaXRpYWxpemVDYXJvdXNlbCApO1xuXHRcdH1cblxuXHRcdGFwcC4kYy50aGVDYXJvdXNlbC5vbiggJ2FmdGVyQ2hhbmdlJywgYXBwLmRvQW5pbWF0aW9uICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzQ2Fyb3VzZWwgKSApO1xuIiwiLyoqXG4gKiBTaG93L0hpZGUgdGhlIFNlYXJjaCBGb3JtIGluIHRoZSBoZWFkZXIuXG4gKlxuICogQGF1dGhvciBDb3JleSBDb2xsaW5zXG4gKi9cbndpbmRvdy5TaG93SGlkZVNlYXJjaEZvcm0gPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3Ncblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxuXHRcdFx0aGVhZGVyU2VhcmNoVG9nZ2xlOiAkKCAnLnNpdGUtaGVhZGVyLWFjdGlvbiAuY3RhLWJ1dHRvbicgKSxcblx0XHRcdGhlYWRlclNlYXJjaEZvcm06ICQoICcuc2l0ZS1oZWFkZXItYWN0aW9uIC5mb3JtLWNvbnRhaW5lcicgKSxcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50c1xuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5oZWFkZXJTZWFyY2hUb2dnbGUub24oICdrZXl1cCB0b3VjaHN0YXJ0IGNsaWNrJywgYXBwLnNob3dIaWRlU2VhcmNoRm9ybSApO1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5dXAgdG91Y2hzdGFydCBjbGljaycsIGFwcC5oaWRlU2VhcmNoRm9ybSApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5oZWFkZXJTZWFyY2hUb2dnbGUubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIENoZWNrcyB0byBzZWUgaWYgdGhlIG1lbnUgaGFzIGJlZW4gb3BlbmVkLlxuXHRhcHAuc2VhcmNoSXNPcGVuID0gZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoIGFwcC4kYy5ib2R5Lmhhc0NsYXNzKCAnc2VhcmNoLWZvcm0tdmlzaWJsZScgKSApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHQvLyBBZGRzIHRoZSB0b2dnbGUgY2xhc3MgZm9yIHRoZSBzZWFyY2ggZm9ybS5cblx0YXBwLnNob3dIaWRlU2VhcmNoRm9ybSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5LnRvZ2dsZUNsYXNzKCAnc2VhcmNoLWZvcm0tdmlzaWJsZScgKTtcblxuXHRcdGFwcC50b2dnbGVTZWFyY2hGb3JtQXJpYUxhYmVsKCk7XG5cdFx0YXBwLnRvZ2dsZVNlYXJjaFRvZ2dsZUFyaWFMYWJlbCgpO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdC8vIEhpZGVzIHRoZSBzZWFyY2ggZm9ybSBpZiB3ZSBjbGljayBvdXRzaWRlIG9mIGl0cyBjb250YWluZXIuXG5cdGFwcC5oaWRlU2VhcmNoRm9ybSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnc2l0ZS1oZWFkZXItYWN0aW9uJyApICkge1xuXHRcdFx0YXBwLiRjLmJvZHkucmVtb3ZlQ2xhc3MoICdzZWFyY2gtZm9ybS12aXNpYmxlJyApO1xuXHRcdFx0YXBwLnRvZ2dsZVNlYXJjaEZvcm1BcmlhTGFiZWwoKTtcblx0XHRcdGFwcC50b2dnbGVTZWFyY2hUb2dnbGVBcmlhTGFiZWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gVG9nZ2xlcyB0aGUgYXJpYS1oaWRkZW4gbGFiZWwgb24gdGhlIGZvcm0gY29udGFpbmVyLlxuXHRhcHAudG9nZ2xlU2VhcmNoRm9ybUFyaWFMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5oZWFkZXJTZWFyY2hGb3JtLmF0dHIoICdhcmlhLWhpZGRlbicsIGFwcC5zZWFyY2hJc09wZW4oKSA/ICdmYWxzZScgOiAndHJ1ZScgKTtcblx0fTtcblxuXHQvLyBUb2dnbGVzIHRoZSBhcmlhLWhpZGRlbiBsYWJlbCBvbiB0aGUgdG9nZ2xlIGJ1dHRvbi5cblx0YXBwLnRvZ2dsZVNlYXJjaFRvZ2dsZUFyaWFMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5oZWFkZXJTZWFyY2hUb2dnbGUuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBhcHAuc2VhcmNoSXNPcGVuKCkgPyAndHJ1ZScgOiAnZmFsc2UnICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93LlNob3dIaWRlU2VhcmNoRm9ybSApICk7XG4iLCIvKipcbiAqIEZpbGUganMtZW5hYmxlZC5qc1xuICpcbiAqIElmIEphdmFzY3JpcHQgaXMgZW5hYmxlZCwgcmVwbGFjZSB0aGUgPGJvZHk+IGNsYXNzIFwibm8tanNcIi5cbiAqL1xuZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKCAnbm8tanMnLCAnanMnICk7XG4iLCIvKipcbiAqIEZpbGU6IG1vYmlsZS1tZW51LmpzXG4gKlxuICogQ3JlYXRlIGFuIGFjY29yZGlvbiBzdHlsZSBkcm9wZG93bi5cbiAqL1xud2luZG93Lndkc01vYmlsZU1lbnUgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudSwgLnV0aWxpdHktbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJTdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudSAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tb2JpbGUtbWVudSBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuLCAudXRpbGl0eS1uYXZpZ2F0aW9uIGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICksXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICdjbGljaycsIGFwcC50b2dnbGVTdWJtZW51ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5yZXNldFN1Yk1lbnUgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5mb3JjZUNsb3NlU3VibWVudXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gUmVzZXQgdGhlIHN1Ym1lbnVzIGFmdGVyIGl0J3MgZG9uZSBjbG9zaW5nLlxuXHRhcHAucmVzZXRTdWJNZW51ID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBXaGVuIHRoZSBsaXN0IGl0ZW0gaXMgZG9uZSB0cmFuc2l0aW9uaW5nIGluIGhlaWdodCxcblx0XHQvLyByZW1vdmUgdGhlIGNsYXNzZXMgZnJvbSB0aGUgc3VibWVudSBzbyBpdCBpcyByZWFkeSB0byB0b2dnbGUgYWdhaW4uXG5cdFx0aWYgKCAkKCB0aGlzICkuaXMoICdsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApICYmICEgJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdCQoIHRoaXMgKS5maW5kKCAndWwuc3ViLW1lbnUnICkucmVtb3ZlQ2xhc3MoICdzbGlkZU91dExlZnQgaXMtdmlzaWJsZScgKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUgaXRlbXMuXG5cdGFwcC5zbGlkZU91dFN1Yk1lbnVzID0gZnVuY3Rpb24oIGVsICkge1xuXG5cdFx0Ly8gSWYgdGhpcyBpdGVtJ3MgcGFyZW50IGlzIHZpc2libGUgYW5kIHRoaXMgaXMgbm90LCBiYWlsLlxuXHRcdGlmICggZWwucGFyZW50KCkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICYmICEgZWwuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIElmIHRoaXMgaXRlbSdzIHBhcmVudCBpcyB2aXNpYmxlIGFuZCB0aGlzIGl0ZW0gaXMgdmlzaWJsZSwgaGlkZSBpdHMgc3VibWVudSB0aGVuIGJhaWwuXG5cdFx0aWYgKCBlbC5wYXJlbnQoKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgJiYgZWwuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0ZWwucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcuc3ViLW1lbnUnICkucmVtb3ZlQ2xhc3MoICdzbGlkZUluTGVmdCcgKS5hZGRDbGFzcyggJ3NsaWRlT3V0TGVmdCcgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gT25seSB0cnkgdG8gY2xvc2Ugc3VibWVudXMgdGhhdCBhcmUgYWN0dWFsbHkgb3Blbi5cblx0XHRcdGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnc2xpZGVJbkxlZnQnICkgKSB7XG5cblx0XHRcdFx0Ly8gQ2xvc2UgdGhlIHBhcmVudCBsaXN0IGl0ZW0sIGFuZCBzZXQgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9uIGFyaWEgdG8gZmFsc2UuXG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUuXG5cdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xuXHRcdFx0fVxuXG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblxuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnYTpmaXJzdCcgKS5hZnRlciggJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGNsYXNzPVwicGFyZW50LWluZGljYXRvclwiIGFyaWEtbGFiZWw9XCJPcGVuIHN1Ym1lbnVcIj48c3BhbiBjbGFzcz1cImRvd24tYXJyb3dcIj48L3NwYW4+PC9idXR0b24+JyApO1xuXHR9O1xuXG5cdC8vIERlYWwgd2l0aCB0aGUgc3VibWVudS5cblx0YXBwLnRvZ2dsZVN1Ym1lbnUgPSBmdW5jdGlvbiggZSApIHtcblxuXHRcdGxldCBlbCA9ICQoIHRoaXMgKSwgLy8gVGhlIG1lbnUgZWxlbWVudCB3aGljaCB3YXMgY2xpY2tlZCBvbi5cblx0XHRcdHN1Yk1lbnUgPSBlbC5jaGlsZHJlbiggJ3VsLnN1Yi1tZW51JyApLCAvLyBUaGUgbmVhcmVzdCBzdWJtZW51LlxuXHRcdFx0JHRhcmdldCA9ICQoIGUudGFyZ2V0ICk7IC8vIHRoZSBlbGVtZW50IHRoYXQncyBhY3R1YWxseSBiZWluZyBjbGlja2VkIChjaGlsZCBvZiB0aGUgbGkgdGhhdCB0cmlnZ2VyZWQgdGhlIGNsaWNrIGV2ZW50KS5cblxuXHRcdC8vIEZpZ3VyZSBvdXQgaWYgd2UncmUgY2xpY2tpbmcgdGhlIGJ1dHRvbiBvciBpdHMgYXJyb3cgY2hpbGQsXG5cdFx0Ly8gaWYgc28sIHdlIGNhbiBqdXN0IG9wZW4gb3IgY2xvc2UgdGhlIG1lbnUgYW5kIGJhaWwuXG5cdFx0aWYgKCAkdGFyZ2V0Lmhhc0NsYXNzKCAnZG93bi1hcnJvdycgKSB8fCAkdGFyZ2V0Lmhhc0NsYXNzKCAncGFyZW50LWluZGljYXRvcicgKSApIHtcblxuXHRcdFx0Ly8gRmlyc3QsIGNvbGxhcHNlIGFueSBhbHJlYWR5IG9wZW5lZCBzdWJtZW51cy5cblx0XHRcdGFwcC5zbGlkZU91dFN1Yk1lbnVzKCBlbCApO1xuXG5cdFx0XHRpZiAoICEgc3ViTWVudS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cblx0XHRcdFx0Ly8gT3BlbiB0aGUgc3VibWVudS5cblx0XHRcdFx0YXBwLm9wZW5TdWJtZW51KCBlbCwgc3ViTWVudSApO1xuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBPcGVuIGEgc3VibWVudS5cblx0YXBwLm9wZW5TdWJtZW51ID0gZnVuY3Rpb24oIHBhcmVudCwgc3ViTWVudSApIHtcblxuXHRcdC8vIEV4cGFuZCB0aGUgbGlzdCBtZW51IGl0ZW0sIGFuZCBzZXQgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9uIGFyaWEgdG8gdHJ1ZS5cblx0XHRwYXJlbnQuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcblxuXHRcdC8vIFNsaWRlIHRoZSBtZW51IGluLlxuXHRcdHN1Yk1lbnUuYWRkQ2xhc3MoICdpcy12aXNpYmxlIGFuaW1hdGVkIHNsaWRlSW5MZWZ0JyApO1xuXHR9O1xuXG5cdC8vIEZvcmNlIGNsb3NlIGFsbCB0aGUgc3VibWVudXMgd2hlbiB0aGUgbWFpbiBtZW51IGNvbnRhaW5lciBpcyBjbG9zZWQuXG5cdGFwcC5mb3JjZUNsb3NlU3VibWVudXMgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAkKCBldmVudC50YXJnZXQgKS5oYXNDbGFzcyggJ29mZi1jYW52YXMtY29udGFpbmVyJyApICkge1xuXG5cdFx0XHQvLyBGb2N1cyBvZmZjYW52YXMgbWVudSBmb3IgYTExeS5cblx0XHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuZm9jdXMoKTtcblxuXHRcdFx0Ly8gVGhlIHRyYW5zaXRpb25lbmQgZXZlbnQgdHJpZ2dlcnMgb24gb3BlbiBhbmQgb24gY2xvc2UsIG5lZWQgdG8gbWFrZSBzdXJlIHdlIG9ubHkgZG8gdGhpcyBvbiBjbG9zZS5cblx0XHRcdGlmICggISAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZSBzbGlkZUluTGVmdCcgKTtcblx0XHRcdFx0YXBwLiRjLmJvZHkuY3NzKCAnb3ZlcmZsb3cnLCAndmlzaWJsZScgKTtcblx0XHRcdFx0YXBwLiRjLmJvZHkudW5iaW5kKCAndG91Y2hzdGFydCcgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0XHRhcHAuJGMuYm9keS5jc3MoICdvdmVyZmxvdycsICdoaWRkZW4nICk7XG5cdFx0XHRcdGFwcC4kYy5ib2R5LmJpbmQoICd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCAhICQoIGUudGFyZ2V0ICkucGFyZW50cyggJy5jb250YWN0LW1vZGFsJyApWzBdICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzTW9iaWxlTWVudSApICk7XG4iLCIvKipcbiAqIEZpbGUgbW9kYWwuanNcbiAqXG4gKiBEZWFsIHdpdGggbXVsdGlwbGUgbW9kYWxzIGFuZCB0aGVpciBtZWRpYS5cbiAqL1xud2luZG93Lndkc01vZGFsID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHRsZXQgJG1vZGFsVG9nZ2xlLFxuXHRcdCRmb2N1c2FibGVDaGlsZHJlbixcblx0XHQkcGxheWVyLFxuXHRcdCR0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc2NyaXB0JyApLFxuXHRcdCRmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnc2NyaXB0JyApWzBdLFxuXHRcdFlUO1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdCRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggJHRhZywgJGZpcnN0U2NyaXB0VGFnICk7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J2JvZHknOiAkKCAnYm9keScgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJCggJy5tb2RhbC10cmlnZ2VyJyApLmxlbmd0aDtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBUcmlnZ2VyIGEgbW9kYWwgdG8gb3Blbi5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLm1vZGFsLXRyaWdnZXInLCBhcHAub3Blbk1vZGFsICk7XG5cblx0XHQvLyBUcmlnZ2VyIHRoZSBjbG9zZSBidXR0b24gdG8gY2xvc2UgdGhlIG1vZGFsLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICcuY2xvc2UnLCBhcHAuY2xvc2VNb2RhbCApO1xuXG5cdFx0Ly8gQWxsb3cgdGhlIHVzZXIgdG8gY2xvc2UgdGhlIG1vZGFsIGJ5IGhpdHRpbmcgdGhlIGVzYyBrZXkuXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLmVzY0tleUNsb3NlICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgY2xpY2tpbmcgb3V0c2lkZSBvZiB0aGUgbW9kYWwuXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJ2Rpdi5tb2RhbC1vcGVuJywgYXBwLmNsb3NlTW9kYWxCeUNsaWNrICk7XG5cblx0XHQvLyBMaXN0ZW4gdG8gdGFicywgdHJhcCBrZXlib2FyZCBpZiB3ZSBuZWVkIHRvXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLnRyYXBLZXlib2FyZE1heWJlICk7XG5cblx0fTtcblxuXHQvLyBPcGVuIHRoZSBtb2RhbC5cblx0YXBwLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gU3RvcmUgdGhlIG1vZGFsIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlID0gJCggdGhpcyApO1xuXG5cdFx0Ly8gRmlndXJlIG91dCB3aGljaCBtb2RhbCB3ZSdyZSBvcGVuaW5nIGFuZCBzdG9yZSB0aGUgb2JqZWN0LlxuXHRcdGxldCAkbW9kYWwgPSAkKCAkKCB0aGlzICkuZGF0YSggJ3RhcmdldCcgKSApO1xuXG5cdFx0Ly8gRGlzcGxheSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEFkZCBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEZpbmQgdGhlIGZvY3VzYWJsZSBjaGlsZHJlbiBvZiB0aGUgbW9kYWwuXG5cdFx0Ly8gVGhpcyBsaXN0IG1heSBiZSBpbmNvbXBsZXRlLCByZWFsbHkgd2lzaCBqUXVlcnkgaGFkIHRoZSA6Zm9jdXNhYmxlIHBzZXVkbyBsaWtlIGpRdWVyeSBVSSBkb2VzLlxuXHRcdC8vIEZvciBtb3JlIGFib3V0IDppbnB1dCBzZWU6IGh0dHBzOi8vYXBpLmpxdWVyeS5jb20vaW5wdXQtc2VsZWN0b3IvXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuID0gJG1vZGFsLmZpbmQoICdhLCA6aW5wdXQsIFt0YWJpbmRleF0nICk7XG5cblx0XHQvLyBJZGVhbGx5LCB0aGVyZSBpcyBhbHdheXMgb25lICh0aGUgY2xvc2UgYnV0dG9uKSwgYnV0IHlvdSBuZXZlciBrbm93LlxuXHRcdGlmICggMCA8ICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggKSB7XG5cblx0XHRcdC8vIFNoaWZ0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIENsb3NlIHRoZSBtb2RhbC5cblx0YXBwLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEZpZ3VyZSB0aGUgb3BlbmVkIG1vZGFsIHdlJ3JlIGNsb3NpbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoICdkaXYubW9kYWwtb3BlbiAuY2xvc2UnICkuZGF0YSggJ3RhcmdldCcgKSApLFxuXG5cdFx0XHQvLyBGaW5kIHRoZSBpZnJhbWUgaW4gdGhlICRtb2RhbCBvYmplY3QuXG5cdFx0XHQkaWZyYW1lID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICk7XG5cblx0XHQvLyBPbmx5IGRvIHRoaXMgaWYgdGhlcmUgYXJlIGFueSBpZnJhbWVzLlxuXHRcdGlmICggJGlmcmFtZS5sZW5ndGggKSB7XG5cblx0XHRcdC8vIEdldCB0aGUgaWZyYW1lIHNyYyBVUkwuXG5cdFx0XHRsZXQgdXJsID0gJGlmcmFtZS5hdHRyKCAnc3JjJyApO1xuXG5cdFx0XHQvLyBSZW1vdmluZy9SZWFkZGluZyB0aGUgVVJMIHdpbGwgZWZmZWN0aXZlbHkgYnJlYWsgdGhlIFlvdVR1YmUgQVBJLlxuXHRcdFx0Ly8gU28gbGV0J3Mgbm90IGRvIHRoYXQgd2hlbiB0aGUgaWZyYW1lIFVSTCBjb250YWlucyB0aGUgZW5hYmxlanNhcGkgcGFyYW1ldGVyLlxuXHRcdFx0aWYgKCAhIHVybC5pbmNsdWRlcyggJ2VuYWJsZWpzYXBpPTEnICkgKSB7XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBzb3VyY2UgVVJMLCB0aGVuIGFkZCBpdCBiYWNrLCBzbyB0aGUgdmlkZW8gY2FuIGJlIHBsYXllZCBhZ2FpbiBsYXRlci5cblx0XHRcdFx0JGlmcmFtZS5hdHRyKCAnc3JjJywgJycgKS5hdHRyKCAnc3JjJywgdXJsICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFVzZSB0aGUgWW91VHViZSBBUEkgdG8gc3RvcCB0aGUgdmlkZW8uXG5cdFx0XHRcdCRwbGF5ZXIuc3RvcFZpZGVvKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmluYWxseSwgaGlkZSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgYm9keSBjbGFzcy5cblx0XHRhcHAuJGMuYm9keS5yZW1vdmVDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBSZXZlcnQgZm9jdXMgYmFjayB0byB0b2dnbGUgZWxlbWVudFxuXHRcdCRtb2RhbFRvZ2dsZS5mb2N1cygpO1xuXG5cdH07XG5cblx0Ly8gQ2xvc2UgaWYgXCJlc2NcIiBrZXkgaXMgcHJlc3NlZC5cblx0YXBwLmVzY0tleUNsb3NlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggMjcgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRhcHAuY2xvc2VNb2RhbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDbG9zZSBpZiB0aGUgdXNlciBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgbW9kYWxcblx0YXBwLmNsb3NlTW9kYWxCeUNsaWNrID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gSWYgdGhlIHBhcmVudCBjb250YWluZXIgaXMgTk9UIHRoZSBtb2RhbCBkaWFsb2cgY29udGFpbmVyLCBjbG9zZSB0aGUgbW9kYWxcblx0XHRpZiAoICEgJCggZXZlbnQudGFyZ2V0ICkucGFyZW50cyggJ2RpdicgKS5oYXNDbGFzcyggJ21vZGFsLWRpYWxvZycgKSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIFRyYXAgdGhlIGtleWJvYXJkIGludG8gYSBtb2RhbCB3aGVuIG9uZSBpcyBhY3RpdmUuXG5cdGFwcC50cmFwS2V5Ym9hcmRNYXliZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIFdlIG9ubHkgbmVlZCB0byBkbyBzdHVmZiB3aGVuIHRoZSBtb2RhbCBpcyBvcGVuIGFuZCB0YWIgaXMgcHJlc3NlZC5cblx0XHRpZiAoIDkgPT09IGV2ZW50LndoaWNoICYmIDAgPCAkKCAnLm1vZGFsLW9wZW4nICkubGVuZ3RoICkge1xuXHRcdFx0bGV0ICRmb2N1c2VkID0gJCggJzpmb2N1cycgKSxcblx0XHRcdFx0Zm9jdXNJbmRleCA9ICRmb2N1c2FibGVDaGlsZHJlbi5pbmRleCggJGZvY3VzZWQgKTtcblxuXHRcdFx0aWYgKCAwID09PSBmb2N1c0luZGV4ICYmIGV2ZW50LnNoaWZ0S2V5ICkge1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgaGVsZCB3aGVuIHByZXNzaW5nIHRhYiwgZ28gYmFjayB0byBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxIF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZXZlbnQuc2hpZnRLZXkgJiYgZm9jdXNJbmRleCA9PT0gJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgbGFzdCBmb2N1c2FibGUgZWxlbWVudCwgYW5kIHNoaWZ0IGlzIG5vdCBoZWxkLCBnbyBiYWNrIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEhvb2sgaW50byBZb3VUdWJlIDxpZnJhbWU+LlxuXHRhcHAub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgJG1vZGFsID0gJCggJ2Rpdi5tb2RhbCcgKSxcblx0XHRcdCRpZnJhbWVpZCA9ICRtb2RhbC5maW5kKCAnaWZyYW1lJyApLmF0dHIoICdpZCcgKTtcblxuXHRcdCRwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCAkaWZyYW1laWQsIHtcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHQnb25SZWFkeSc6IGFwcC5vblBsYXllclJlYWR5LFxuXHRcdFx0XHQnb25TdGF0ZUNoYW5nZSc6IGFwcC5vblBsYXllclN0YXRlQ2hhbmdlXG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIERvIHNvbWV0aGluZyBvbiBwbGF5ZXIgcmVhZHkuXG5cdGFwcC5vblBsYXllclJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciBzdGF0ZSBjaGFuZ2UuXG5cdGFwcC5vblBsYXllclN0YXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTZXQgZm9jdXMgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IGluc2lkZSBvZiB0aGUgbW9kYWwgdGhlIHBsYXllciBpcyBpbi5cblx0XHQkKCBldmVudC50YXJnZXQuYSApLnBhcmVudHMoICcubW9kYWwnICkuZmluZCggJ2EsIDppbnB1dCwgW3RhYmluZGV4XScgKS5maXJzdCgpLmZvY3VzKCk7XG5cdH07XG5cblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc01vZGFsICkgKTtcbiIsIi8qKlxuICogRmlsZTogbmF2aWdhdGlvbi1wcmltYXJ5LmpzXG4gKlxuICogSGVscGVycyBmb3IgdGhlIHByaW1hcnkgbmF2aWdhdGlvbi5cbiAqL1xud2luZG93Lndkc1ByaW1hcnlOYXZpZ2F0aW9uID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHN1Yk1lbnVDb250YWluZXI6ICQoICcubWFpbi1uYXZpZ2F0aW9uIC5zdWItbWVudScgKSxcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1haW4tbmF2aWdhdGlvbiBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRG93bkFycm93ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICdhJyApLm9uKCAnZm9jdXNpbiBmb2N1c291dCcsIGFwcC50b2dnbGVGb2N1cyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBZGQgdGhlIGRvd24gYXJyb3cgdG8gc3VibWVudSBwYXJlbnRzLlxuXHRhcHAuYWRkRG93bkFycm93ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICc+IGEnICkuYXBwZW5kKCAnPHNwYW4gY2xhc3M9XCJjYXJldC1kb3duXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPicgKTtcblx0fTtcblxuXHQvLyBUb2dnbGUgdGhlIGZvY3VzIGNsYXNzIG9uIHRoZSBsaW5rIHBhcmVudC5cblx0YXBwLnRvZ2dsZUZvY3VzID0gZnVuY3Rpb24oKSB7XG5cdFx0JCggdGhpcyApLnBhcmVudHMoICdsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApLnRvZ2dsZUNsYXNzKCAnZm9jdXMnICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1ByaW1hcnlOYXZpZ2F0aW9uICkgKTtcbiIsIi8qKlxuICogRmlsZTogb2ZmLWNhbnZhcy5qc1xuICpcbiAqIEhlbHAgZGVhbCB3aXRoIHRoZSBvZmYtY2FudmFzIG1vYmlsZSBtZW51LlxuICovXG53aW5kb3cud2Rzb2ZmQ2FudmFzID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0Ym9keTogJCggJ2JvZHknICksXG5cdFx0XHRvZmZDYW52YXNDbG9zZTogJCggJy5vZmYtY2FudmFzLWNsb3NlJyApLFxuXHRcdFx0b2ZmQ2FudmFzQ29udGFpbmVyOiAkKCAnLm9mZi1jYW52YXMtY29udGFpbmVyJyApLFxuXHRcdFx0b2ZmQ2FudmFzT3BlbjogJCggJy5vZmYtY2FudmFzLW9wZW4nICksXG5cdFx0XHRvZmZDYW52YXNTY3JlZW46ICQoICcub2ZmLWNhbnZhcy1zY3JlZW4nIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ2xvc2Uub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLm9uKCAnY2xpY2snLCBhcHAudG9nZ2xlb2ZmQ2FudmFzICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gVG8gc2hvdyBvciBub3QgdG8gc2hvdz9cblx0YXBwLnRvZ2dsZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCAndHJ1ZScgPT09ICQoIHRoaXMgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSApIHtcblx0XHRcdGFwcC5jbG9zZW9mZkNhbnZhcygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhcHAub3Blbm9mZkNhbnZhcygpO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIFNob3cgdGhhdCBkcmF3ZXIhXG5cdGFwcC5vcGVub2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hdHRyKCAnYXJpYS1oaWRkZW4nLCBmYWxzZSApO1xuXHR9O1xuXG5cdC8vIENsb3NlIHRoYXQgZHJhd2VyIVxuXHRhcHAuY2xvc2VvZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hdHRyKCAnYXJpYS1oaWRkZW4nLCB0cnVlICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5mb2N1cygpO1xuXHR9O1xuXG5cdC8vIENsb3NlIGRyYXdlciBpZiBcImVzY1wiIGtleSBpcyBwcmVzc2VkLlxuXHRhcHAuZXNjS2V5Q2xvc2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdGFwcC5jbG9zZW9mZkNhbnZhcygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2Rzb2ZmQ2FudmFzICkgKTtcbiIsIi8qKlxuICogRmlsZSBza2lwLWxpbmstZm9jdXMtZml4LmpzLlxuICpcbiAqIEhlbHBzIHdpdGggYWNjZXNzaWJpbGl0eSBmb3Iga2V5Ym9hcmQgb25seSB1c2Vycy5cbiAqXG4gKiBMZWFybiBtb3JlOiBodHRwczovL2dpdC5pby92V2RyMlxuICovXG4oIGZ1bmN0aW9uKCkge1xuXHR2YXIgaXNXZWJraXQgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnd2Via2l0JyApLFxuXHRcdGlzT3BlcmEgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICksXG5cdFx0aXNJZSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApO1xuXG5cdGlmICggKCBpc1dlYmtpdCB8fCBpc09wZXJhIHx8IGlzSWUgKSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpZCA9IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICksXG5cdFx0XHRcdGVsZW1lbnQ7XG5cblx0XHRcdGlmICggISAoIC9eW0EtejAtOV8tXSskLyApLnRlc3QoIGlkICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGlmICggISAoIC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaSApLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSApO1xuXHR9XG59KCkgKTtcbiIsIi8qKlxuICogTWFrZSB0YWJsZXMgcmVzcG9uc2l2ZSBhZ2Fpbi5cbiAqXG4gKiBAYXV0aG9yIEhhcmlzIFp1bGZpcWFyXG4gKi9cbndpbmRvdy53ZHNUYWJsZXMgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3Ncblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHRhYmxlOiAkKCAndGFibGUnIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50c1xuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERhdGFMYWJlbCApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy50YWJsZS5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQWRkcyBkYXRhLWxhYmVsIHRvIHRkIGJhc2VkIG9uIHRoLlxuXHRhcHAuYWRkRGF0YUxhYmVsID0gZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgdGFibGUgPSBhcHAuJGMudGFibGU7XG5cdFx0Y29uc3QgdGFibGVIZWFkZXJzID0gdGFibGUuZmluZCggJ3RoZWFkIHRoJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93ID0gdGFibGUuZmluZCggJ3Rib2R5IHRyJyApO1xuXG5cdFx0dGFibGVSb3cuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0ZCA9ICQoIHRoaXMgKS5maW5kKCAndGQnICk7XG5cblx0XHRcdHRkLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdFx0aWYgKCAkKCB0YWJsZUhlYWRlcnMuZ2V0KCBpbmRleCApICkgKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLmF0dHIoICdkYXRhLWxhYmVsJywgJCggdGFibGVIZWFkZXJzLmdldCggaW5kZXggKSApLnRleHQoKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZVxuXHQkKCBhcHAuaW5pdCApO1xuXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNUYWJsZXMgKSApO1xuIiwiLyoqXG4gKiBWaWRlbyBQbGF5YmFjayBTY3JpcHQuXG4gKi9cbndpbmRvdy5XRFNWaWRlb0JhY2tncm91bmRPYmplY3QgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0dmlkZW9CdXR0b246ICQoICcudmlkZW8tdG9nZ2xlJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnZpZGVvQnV0dG9uLm9uKCAnY2xpY2snLCBhcHAuZG9Ub2dnbGVQbGF5YmFjayApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy52aWRlb0J1dHRvbi5sZW5ndGg7XG5cdH07XG5cblx0Ly8gVmlkZW8gUGxheWJhY2suXG5cdGFwcC5kb1RvZ2dsZVBsYXliYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuY29udGVudC1ibG9jaycgKS50b2dnbGVDbGFzcyggJ3ZpZGVvLXRvZ2dsZWQnICk7XG5cblx0XHRpZiAoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmNvbnRlbnQtYmxvY2snICkuaGFzQ2xhc3MoICd2aWRlby10b2dnbGVkJyApICkge1xuXHRcdFx0JCggdGhpcyApLnNpYmxpbmdzKCAnLnZpZGVvLWJhY2tncm91bmQnICkudHJpZ2dlciggJ3BhdXNlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCB0aGlzICkuc2libGluZ3MoICcudmlkZW8tYmFja2dyb3VuZCcgKS50cmlnZ2VyKCAncGxheScgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93LldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCApICk7XG4iLCIvKipcbiAqIEZpbGUgd2luZG93LXJlYWR5LmpzXG4gKlxuICogQWRkIGEgXCJyZWFkeVwiIGNsYXNzIHRvIDxib2R5PiB3aGVuIHdpbmRvdyBpcyByZWFkeS5cbiAqL1xud2luZG93Lndkc1dpbmRvd1JlYWR5ID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHR9O1xuXG5cdC8vIENhY2hlIGRvY3VtZW50IGVsZW1lbnRzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHQnd2luZG93JzogJCggd2luZG93ICksXG5cdFx0XHQnYm9keSc6ICQoIGRvY3VtZW50LmJvZHkgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cubG9hZCggYXBwLmFkZEJvZHlDbGFzcyApO1xuXHR9O1xuXG5cdC8vIEFkZCBhIGNsYXNzIHRvIDxib2R5Pi5cblx0YXBwLmFkZEJvZHlDbGFzcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5LmFkZENsYXNzKCAncmVhZHknICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNXaW5kb3dSZWFkeSApICk7XG4iXX0=
