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

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			theCarousel: $('.carousel')
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
		var slides = $('.slide'),
			activeSlide = $('.slick-current'),
			activeContent = activeSlide.find('.slide-content'),


		// This is a string like so: 'animated someCssClass'.
		animationClass = activeContent.attr('data-animation'),
			splitAnimation = animationClass.split(' '),


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
		app.$c.theCarousel.on('init', app.playBackgroundVideos);

		app.$c.theCarousel.slick({
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: true,
			dots: true,
			focusOnSelect: true,
			waitForAnimate: true
		});

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
			headerSearchForm: $('.site-header-action .cta-button')
		};
	};

	// Combine all events
	app.bindEvents = function () {
		app.$c.headerSearchForm.on('keyup touchstart click', app.showHideSearchForm);
		app.$c.body.on('keyup touchstart click', app.hideSearchForm);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.headerSearchForm.length;
	};

	// Adds the toggle class for the search form.
	app.showHideSearchForm = function () {
		app.$c.body.toggleClass('search-form-visible');

		return false;
	};

	// Hides the search form if we click outside of its container.
	app.hideSearchForm = function (event) {

		if (!$(event.target).parents('div').hasClass('site-header-action')) {
			app.$c.body.removeClass('search-form-visible');
		}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyIsImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ0YWJsZS5qcyIsIndpbmRvdy1yZWFkeS5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJhY2NvcmRpb25CbG9ja1RvZ2dsZSIsIiQiLCJhcHAiLCJpbml0IiwiY2FjaGUiLCJtZWV0c1JlcXVpcmVtZW50cyIsImJpbmRFdmVudHMiLCIkYyIsImh0bWwiLCJhY2NvcmRpb24iLCJpdGVtcyIsImhlYWRlcnMiLCJjb250ZW50cyIsImJ1dHRvbiIsImFuY2hvcklEIiwibG9jYXRpb24iLCJoYXNoIiwib24iLCJ0b2dnbGVBY2NvcmRpb24iLCJvcGVuSGFzaEFjY29yZGlvbiIsImxlbmd0aCIsInBhcmVudHMiLCJ0b2dnbGVDbGFzcyIsImlzRXhwYW5kZWQiLCJoYXNDbGFzcyIsImZpbmQiLCJhdHRyIiwibm90IiwicmVtb3ZlQ2xhc3MiLCJzZWxlY3RvciIsInRyaWdnZXIiLCJhZG1pbkJhckhlaWdodCIsImhlaWdodCIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJvZmZzZXQiLCJ0b3AiLCJqUXVlcnkiLCJ3ZHNDYXJvdXNlbCIsInRoZUNhcm91c2VsIiwiZG9TbGljayIsImRvRmlyc3RBbmltYXRpb24iLCJmaXJzdFNsaWRlIiwiZmlyc3RTbGlkZUNvbnRlbnQiLCJmaXJzdEFuaW1hdGlvbiIsImFkZENsYXNzIiwiZG9BbmltYXRpb24iLCJzbGlkZXMiLCJhY3RpdmVTbGlkZSIsImFjdGl2ZUNvbnRlbnQiLCJhbmltYXRpb25DbGFzcyIsInNwbGl0QW5pbWF0aW9uIiwic3BsaXQiLCJhbmltYXRpb25UcmlnZ2VyIiwiZWFjaCIsInNsaWRlQ29udGVudCIsImxhc3RDbGFzcyIsInBvcCIsInBsYXlCYWNrZ3JvdW5kVmlkZW9zIiwicGxheSIsInNsaWNrIiwiYXV0b3BsYXkiLCJhdXRvcGxheVNwZWVkIiwiYXJyb3dzIiwiZG90cyIsImZvY3VzT25TZWxlY3QiLCJ3YWl0Rm9yQW5pbWF0ZSIsIlNob3dIaWRlU2VhcmNoRm9ybSIsImJvZHkiLCJoZWFkZXJTZWFyY2hGb3JtIiwic2hvd0hpZGVTZWFyY2hGb3JtIiwiaGlkZVNlYXJjaEZvcm0iLCJldmVudCIsInRhcmdldCIsImRvY3VtZW50IiwiY2xhc3NOYW1lIiwicmVwbGFjZSIsIndkc01vYmlsZU1lbnUiLCJzdWJNZW51Q29udGFpbmVyIiwic3ViU3ViTWVudUNvbnRhaW5lciIsInN1Yk1lbnVQYXJlbnRJdGVtIiwib2ZmQ2FudmFzQ29udGFpbmVyIiwiYWRkRG93bkFycm93IiwidG9nZ2xlU3VibWVudSIsInJlc2V0U3ViTWVudSIsImZvcmNlQ2xvc2VTdWJtZW51cyIsImlzIiwic2xpZGVPdXRTdWJNZW51cyIsImVsIiwicGFyZW50IiwiYWZ0ZXIiLCJlIiwic3ViTWVudSIsImNoaWxkcmVuIiwiJHRhcmdldCIsIm9wZW5TdWJtZW51IiwiZm9jdXMiLCJjc3MiLCJ1bmJpbmQiLCJiaW5kIiwicHJldmVudERlZmF1bHQiLCJ3ZHNNb2RhbCIsIiRtb2RhbFRvZ2dsZSIsIiRmb2N1c2FibGVDaGlsZHJlbiIsIiRwbGF5ZXIiLCIkdGFnIiwiY3JlYXRlRWxlbWVudCIsIiRmaXJzdFNjcmlwdFRhZyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiWVQiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwib3Blbk1vZGFsIiwiY2xvc2VNb2RhbCIsImVzY0tleUNsb3NlIiwiY2xvc2VNb2RhbEJ5Q2xpY2siLCJ0cmFwS2V5Ym9hcmRNYXliZSIsIiRtb2RhbCIsImRhdGEiLCIkaWZyYW1lIiwidXJsIiwiaW5jbHVkZXMiLCJzdG9wVmlkZW8iLCJrZXlDb2RlIiwid2hpY2giLCIkZm9jdXNlZCIsImZvY3VzSW5kZXgiLCJpbmRleCIsInNoaWZ0S2V5Iiwib25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkiLCIkaWZyYW1laWQiLCJQbGF5ZXIiLCJldmVudHMiLCJvblBsYXllclJlYWR5Iiwib25QbGF5ZXJTdGF0ZUNoYW5nZSIsImEiLCJmaXJzdCIsIndkc1ByaW1hcnlOYXZpZ2F0aW9uIiwidG9nZ2xlRm9jdXMiLCJhcHBlbmQiLCJ3ZHNvZmZDYW52YXMiLCJvZmZDYW52YXNDbG9zZSIsIm9mZkNhbnZhc09wZW4iLCJvZmZDYW52YXNTY3JlZW4iLCJjbG9zZW9mZkNhbnZhcyIsInRvZ2dsZW9mZkNhbnZhcyIsIm9wZW5vZmZDYW52YXMiLCJpc1dlYmtpdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiaW5kZXhPZiIsImlzT3BlcmEiLCJpc0llIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiaWQiLCJzdWJzdHJpbmciLCJlbGVtZW50IiwidGVzdCIsInRhZ05hbWUiLCJ0YWJJbmRleCIsIndkc1RhYmxlcyIsInRhYmxlIiwiYWRkRGF0YUxhYmVsIiwidGFibGVIZWFkZXJzIiwidGFibGVSb3ciLCJ0ZCIsImdldCIsInRleHQiLCJ3ZHNXaW5kb3dSZWFkeSIsImxvYWQiLCJhZGRCb2R5Q2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7O0FBS0FBLE9BQU9DLG9CQUFQLEdBQThCLEVBQTlCO0FBQ0UsV0FBVUQsTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUU1QjtBQUNBQSxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjs7QUFFQSxNQUFLRixJQUFJRyxpQkFBSixFQUFMLEVBQStCO0FBQzlCSCxPQUFJSSxVQUFKO0FBQ0E7QUFDRCxFQU5EOztBQVFBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUlIsV0FBUUUsRUFBR0YsTUFBSCxDQURBO0FBRVJTLFNBQU1QLEVBQUcsTUFBSCxDQUZFO0FBR1JRLGNB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ekssSUFBSTBLLFlBQXhCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBMUssS0FBSTBLLFlBQUosR0FBbUIsWUFBVztBQUM3QjFLLE1BQUlLLEVBQUosQ0FBTzZELElBQVAsQ0FBWXZCLFFBQVosQ0FBc0IsT0FBdEI7QUFDQSxFQUZEOztBQUlBO0FBQ0E1QyxHQUFHQyxJQUFJQyxJQUFQO0FBQ0EsQ0E1QkMsRUE0QkNKLE1BNUJELEVBNEJTc0MsTUE1QlQsRUE0QmlCdEMsT0FBTzJLLGNBNUJ4QixDQUFGIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFjY29yZGlvbiBibG9jayBmdW5jdGlvbmFsaXR5XG4gKlxuICogQGF1dGhvciBTaGFubm9uIE1hY01pbGxhbiwgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuYWNjb3JkaW9uQmxvY2tUb2dnbGUgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3Ncblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdGh0bWw6ICQoICdodG1sJyApLFxuXHRcdFx0YWNjb3JkaW9uOiAkKCAnLmFjY29yZGlvbicgKSxcblx0XHRcdGl0ZW1zOiAkKCAnLmFjY29yZGlvbi1pdGVtJyApLFxuXHRcdFx0aGVhZGVyczogJCggJy5hY2NvcmRpb24taXRlbS1oZWFkZXInICksXG5cdFx0XHRjb250ZW50czogJCggJy5hY2NvcmRpb24taXRlbS1jb250ZW50JyApLFxuXHRcdFx0YnV0dG9uOiAkKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKSxcblx0XHRcdGFuY2hvcklEOiAkKCB3aW5kb3cubG9jYXRpb24uaGFzaCApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVycy5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCBhcHAudG9nZ2xlQWNjb3JkaW9uICk7XG5cdFx0YXBwLiRjLmJ1dHRvbi5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCBhcHAudG9nZ2xlQWNjb3JkaW9uICk7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAub3Blbkhhc2hBY2NvcmRpb24gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuYWNjb3JkaW9uLmxlbmd0aDtcblx0fTtcblxuXHRhcHAudG9nZ2xlQWNjb3JkaW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBBZGQgdGhlIG9wZW4gY2xhc3MgdG8gdGhlIGl0ZW0uXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdvcGVuJyApO1xuXG5cdFx0Ly8gSXMgdGhpcyBvbmUgZXhwYW5kZWQ/XG5cdFx0bGV0IGlzRXhwYW5kZWQgPSAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5oYXNDbGFzcyggJ29wZW4nICk7XG5cblx0XHQvLyBTZXQgdGhpcyBidXR0b24ncyBhcmlhLWV4cGFuZGVkIHZhbHVlLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgaXNFeHBhbmRlZCA/ICd0cnVlJyA6ICdmYWxzZScgKTtcblxuXHRcdC8vIFNldCBhbGwgb3RoZXIgaXRlbXMgaW4gdGhpcyBibG9jayB0byBhcmlhLWhpZGRlbj10cnVlLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICkubm90KCAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKSApLmF0dHIoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO1xuXG5cdFx0Ly8gU2V0IHRoaXMgaXRlbSB0byBhcmlhLWhpZGRlbj1mYWxzZS5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICkuYXR0ciggJ2FyaWEtaGlkZGVuJywgaXNFeHBhbmRlZCA/ICdmYWxzZScgOiAndHJ1ZScgKTtcblxuXHRcdC8vIEhpZGUgdGhlIG90aGVyIHBhbmVscy5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24tYmxvY2snICkuZmluZCggJy5hY2NvcmRpb24taXRlbScgKS5ub3QoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApICkucmVtb3ZlQ2xhc3MoICdvcGVuJyApO1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS5ub3QoICQoIHRoaXMgKSApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdGFwcC5vcGVuSGFzaEFjY29yZGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCAhIGFwcC4kYy5hbmNob3JJRC5zZWxlY3RvciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBUcmlnZ2VyIGEgY2xpY2sgb24gdGhlIGJ1dHRvbiBjbG9zZXN0IHRvIHRoaXMgYWNjb3JkaW9uLlxuXHRcdGFwcC4kYy5hbmNob3JJRC5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLnRyaWdnZXIoICdjbGljaycgKTtcblxuXHRcdC8vIE5vdCBzZXR0aW5nIGEgY2FjaGVkIHZhcmlhYmxlIGFzIGl0IGRvZXNuJ3Qgc2VlbSB0byBncmFiIHRoZSBoZWlnaHQgcHJvcGVybHkuXG5cdFx0Y29uc3QgYWRtaW5CYXJIZWlnaHQgPSAkKCAnI3dwYWRtaW5iYXInICkubGVuZ3RoID8gJCggJyN3cGFkbWluYmFyJyApLmhlaWdodCgpIDogMDtcblxuXHRcdC8vIEFuaW1hdGUgdG8gdGhlIGRpdiBmb3IgYSBuaWNlciBleHBlcmllbmNlLlxuXHRcdGFwcC4kYy5odG1sLmFuaW1hdGUoIHtcblx0XHRcdHNjcm9sbFRvcDogYXBwLiRjLmFuY2hvcklELm9mZnNldCgpLnRvcCAtIGFkbWluQmFySGVpZ2h0XG5cdFx0fSwgJ3Nsb3cnICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlXG5cdGFwcC5pbml0KCk7XG5cbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93LmFjY29yZGlvbkJsb2NrVG9nZ2xlICkgKTtcbiIsIi8qKlxuICogRmlsZSBjYXJvdXNlbC5qc1xuICpcbiAqIERlYWwgd2l0aCB0aGUgU2xpY2sgY2Fyb3VzZWwuXG4gKi9cbndpbmRvdy53ZHNDYXJvdXNlbCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHR0aGVDYXJvdXNlbDogJCggJy5jYXJvdXNlbCcgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmRvU2xpY2sgKTtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5kb0ZpcnN0QW5pbWF0aW9uICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnRoZUNhcm91c2VsLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBbmltYXRlIHRoZSBmaXJzdCBzbGlkZSBvbiB3aW5kb3cgbG9hZC5cblx0YXBwLmRvRmlyc3RBbmltYXRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEdldCB0aGUgZmlyc3Qgc2xpZGUgY29udGVudCBhcmVhIGFuZCBhbmltYXRpb24gYXR0cmlidXRlLlxuXHRcdGxldCBmaXJzdFNsaWRlID0gYXBwLiRjLnRoZUNhcm91c2VsLmZpbmQoICdbZGF0YS1zbGljay1pbmRleD0wXScgKSxcblx0XHRcdGZpcnN0U2xpZGVDb250ZW50ID0gZmlyc3RTbGlkZS5maW5kKCAnLnNsaWRlLWNvbnRlbnQnICksXG5cdFx0XHRmaXJzdEFuaW1hdGlvbiA9IGZpcnN0U2xpZGVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKTtcblxuXHRcdC8vIEFkZCB0aGUgYW5pbWF0aW9uIGNsYXNzIHRvIHRoZSBmaXJzdCBzbGlkZS5cblx0XHRmaXJzdFNsaWRlQ29udGVudC5hZGRDbGFzcyggZmlyc3RBbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBBbmltYXRlIHRoZSBzbGlkZSBjb250ZW50LlxuXHRhcHAuZG9BbmltYXRpb24gPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgc2xpZGVzID0gJCggJy5zbGlkZScgKSxcblx0XHRcdGFjdGl2ZVNsaWRlID0gJCggJy5zbGljay1jdXJyZW50JyApLFxuXHRcdFx0YWN0aXZlQ29udGVudCA9IGFjdGl2ZVNsaWRlLmZpbmQoICcuc2xpZGUtY29udGVudCcgKSxcblxuXHRcdFx0Ly8gVGhpcyBpcyBhIHN0cmluZyBsaWtlIHNvOiAnYW5pbWF0ZWQgc29tZUNzc0NsYXNzJy5cblx0XHRcdGFuaW1hdGlvbkNsYXNzID0gYWN0aXZlQ29udGVudC5hdHRyKCAnZGF0YS1hbmltYXRpb24nICksXG5cdFx0XHRzcGxpdEFuaW1hdGlvbiA9IGFuaW1hdGlvbkNsYXNzLnNwbGl0KCAnICcgKSxcblxuXHRcdFx0Ly8gVGhpcyBpcyB0aGUgJ2FuaW1hdGVkJyBjbGFzcy5cblx0XHRcdGFuaW1hdGlvblRyaWdnZXIgPSBzcGxpdEFuaW1hdGlvblswXTtcblxuXHRcdC8vIEdvIHRocm91Z2ggZWFjaCBzbGlkZSB0byBzZWUgaWYgd2UndmUgYWxyZWFkeSBzZXQgYW5pbWF0aW9uIGNsYXNzZXMuXG5cdFx0c2xpZGVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0bGV0IHNsaWRlQ29udGVudCA9ICQoIHRoaXMgKS5maW5kKCAnLnNsaWRlLWNvbnRlbnQnICk7XG5cblx0XHRcdC8vIElmIHdlJ3ZlIHNldCBhbmltYXRpb24gY2xhc3NlcyBvbiBhIHNsaWRlLCByZW1vdmUgdGhlbS5cblx0XHRcdGlmICggc2xpZGVDb250ZW50Lmhhc0NsYXNzKCAnYW5pbWF0ZWQnICkgKSB7XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBsYXN0IGNsYXNzLCB3aGljaCBpcyB0aGUgYW5pbWF0ZS5jc3MgY2xhc3MuXG5cdFx0XHRcdGxldCBsYXN0Q2xhc3MgPSBzbGlkZUNvbnRlbnRcblx0XHRcdFx0XHQuYXR0ciggJ2NsYXNzJyApXG5cdFx0XHRcdFx0LnNwbGl0KCAnICcgKVxuXHRcdFx0XHRcdC5wb3AoKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgYm90aCBhbmltYXRpb24gY2xhc3Nlcy5cblx0XHRcdFx0c2xpZGVDb250ZW50LnJlbW92ZUNsYXNzKCBsYXN0Q2xhc3MgKS5yZW1vdmVDbGFzcyggYW5pbWF0aW9uVHJpZ2dlciApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEFkZCBhbmltYXRpb24gY2xhc3NlcyBhZnRlciBzbGlkZSBpcyBpbiB2aWV3LlxuXHRcdGFjdGl2ZUNvbnRlbnQuYWRkQ2xhc3MoIGFuaW1hdGlvbkNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWxsb3cgYmFja2dyb3VuZCB2aWRlb3MgdG8gYXV0b3BsYXkuXG5cdGFwcC5wbGF5QmFja2dyb3VuZFZpZGVvcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IGFsbCB0aGUgdmlkZW9zIGluIG91ciBzbGlkZXMgb2JqZWN0LlxuXHRcdCQoICd2aWRlbycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gTGV0IHRoZW0gYXV0b3BsYXkuIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0aGlzIGxhdGVyIHRvIG9ubHkgcGxheSB0aGUgdmlzaWJsZSBzbGlkZSB2aWRlby5cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBLaWNrIG9mZiBTbGljay5cblx0YXBwLmRvU2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdpbml0JywgYXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zICk7XG5cblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwuc2xpY2soIHtcblx0XHRcdGF1dG9wbGF5OiB0cnVlLFxuXHRcdFx0YXV0b3BsYXlTcGVlZDogNTAwMCxcblx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRmb2N1c09uU2VsZWN0OiB0cnVlLFxuXHRcdFx0d2FpdEZvckFuaW1hdGU6IHRydWVcblx0XHR9ICk7XG5cblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdhZnRlckNoYW5nZScsIGFwcC5kb0FuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc0Nhcm91c2VsICkgKTtcbiIsIi8qKlxuICogU2hvdy9IaWRlIHRoZSBTZWFyY2ggRm9ybSBpbiB0aGUgaGVhZGVyLlxuICpcbiAqIEBhdXRob3IgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3RvclxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdGhlYWRlclNlYXJjaEZvcm06ICQoICcuc2l0ZS1oZWFkZXItYWN0aW9uIC5jdGEtYnV0dG9uJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoRm9ybS5vbiggJ2tleXVwIHRvdWNoc3RhcnQgY2xpY2snLCBhcHAuc2hvd0hpZGVTZWFyY2hGb3JtICk7XG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXl1cCB0b3VjaHN0YXJ0IGNsaWNrJywgYXBwLmhpZGVTZWFyY2hGb3JtICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLmhlYWRlclNlYXJjaEZvcm0ubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFkZHMgdGhlIHRvZ2dsZSBjbGFzcyBmb3IgdGhlIHNlYXJjaCBmb3JtLlxuXHRhcHAuc2hvd0hpZGVTZWFyY2hGb3JtID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkudG9nZ2xlQ2xhc3MoICdzZWFyY2gtZm9ybS12aXNpYmxlJyApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdC8vIEhpZGVzIHRoZSBzZWFyY2ggZm9ybSBpZiB3ZSBjbGljayBvdXRzaWRlIG9mIGl0cyBjb250YWluZXIuXG5cdGFwcC5oaWRlU2VhcmNoRm9ybSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnc2l0ZS1oZWFkZXItYWN0aW9uJyApICkge1xuXHRcdFx0YXBwLiRjLmJvZHkucmVtb3ZlQ2xhc3MoICdzZWFyY2gtZm9ybS12aXNpYmxlJyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2Vcblx0JCggYXBwLmluaXQgKTtcblxufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtICkgKTtcbiIsIi8qKlxuICogRmlsZSBqcy1lbmFibGVkLmpzXG4gKlxuICogSWYgSmF2YXNjcmlwdCBpcyBlbmFibGVkLCByZXBsYWNlIHRoZSA8Ym9keT4gY2xhc3MgXCJuby1qc1wiLlxuICovXG5kb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoICduby1qcycsICdqcycgKTtcbiIsIi8qKlxuICogRmlsZTogbW9iaWxlLW1lbnUuanNcbiAqXG4gKiBDcmVhdGUgYW4gYWNjb3JkaW9uIHN0eWxlIGRyb3Bkb3duLlxuICovXG53aW5kb3cud2RzTW9iaWxlTWVudSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHN1Yk1lbnVDb250YWluZXI6ICQoICcubW9iaWxlLW1lbnUgLnN1Yi1tZW51LCAudXRpbGl0eS1uYXZpZ2F0aW9uIC5zdWItbWVudScgKSxcblx0XHRcdHN1YlN1Yk1lbnVDb250YWluZXI6ICQoICcubW9iaWxlLW1lbnUgLnN1Yi1tZW51IC5zdWItbWVudScgKSxcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1vYmlsZS1tZW51IGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4sIC51dGlsaXR5LW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKSxcblx0XHRcdG9mZkNhbnZhc0NvbnRhaW5lcjogJCggJy5vZmYtY2FudmFzLWNvbnRhaW5lcicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZVN1Ym1lbnUgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLnJlc2V0U3ViTWVudSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLmZvcmNlQ2xvc2VTdWJtZW51cyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBSZXNldCB0aGUgc3VibWVudXMgYWZ0ZXIgaXQncyBkb25lIGNsb3NpbmcuXG5cdGFwcC5yZXNldFN1Yk1lbnUgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFdoZW4gdGhlIGxpc3QgaXRlbSBpcyBkb25lIHRyYW5zaXRpb25pbmcgaW4gaGVpZ2h0LFxuXHRcdC8vIHJlbW92ZSB0aGUgY2xhc3NlcyBmcm9tIHRoZSBzdWJtZW51IHNvIGl0IGlzIHJlYWR5IHRvIHRvZ2dsZSBhZ2Fpbi5cblx0XHRpZiAoICQoIHRoaXMgKS5pcyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkgJiYgISAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0JCggdGhpcyApLmZpbmQoICd1bC5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlT3V0TGVmdCBpcy12aXNpYmxlJyApO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudSBpdGVtcy5cblx0YXBwLnNsaWRlT3V0U3ViTWVudXMgPSBmdW5jdGlvbiggZWwgKSB7XG5cblx0XHQvLyBJZiB0aGlzIGl0ZW0ncyBwYXJlbnQgaXMgdmlzaWJsZSBhbmQgdGhpcyBpcyBub3QsIGJhaWwuXG5cdFx0aWYgKCBlbC5wYXJlbnQoKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgJiYgISBlbC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhpcyBpdGVtJ3MgcGFyZW50IGlzIHZpc2libGUgYW5kIHRoaXMgaXRlbSBpcyB2aXNpYmxlLCBoaWRlIGl0cyBzdWJtZW51IHRoZW4gYmFpbC5cblx0XHRpZiAoIGVsLnBhcmVudCgpLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSAmJiBlbC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRlbC5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmVhY2goIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBPbmx5IHRyeSB0byBjbG9zZSBzdWJtZW51cyB0aGF0IGFyZSBhY3R1YWxseSBvcGVuLlxuXHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoICdzbGlkZUluTGVmdCcgKSApIHtcblxuXHRcdFx0XHQvLyBDbG9zZSB0aGUgcGFyZW50IGxpc3QgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byBmYWxzZS5cblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudS5cblx0XHRcdFx0JCggdGhpcyApLnJlbW92ZUNsYXNzKCAnc2xpZGVJbkxlZnQnICkuYWRkQ2xhc3MoICdzbGlkZU91dExlZnQnICk7XG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICdhOmZpcnN0JyApLmFmdGVyKCAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgY2xhc3M9XCJwYXJlbnQtaW5kaWNhdG9yXCIgYXJpYS1sYWJlbD1cIk9wZW4gc3VibWVudVwiPjxzcGFuIGNsYXNzPVwiZG93bi1hcnJvd1wiPjwvc3Bhbj48L2J1dHRvbj4nICk7XG5cdH07XG5cblx0Ly8gRGVhbCB3aXRoIHRoZSBzdWJtZW51LlxuXHRhcHAudG9nZ2xlU3VibWVudSA9IGZ1bmN0aW9uKCBlICkge1xuXG5cdFx0bGV0IGVsID0gJCggdGhpcyApLCAvLyBUaGUgbWVudSBlbGVtZW50IHdoaWNoIHdhcyBjbGlja2VkIG9uLlxuXHRcdFx0c3ViTWVudSA9IGVsLmNoaWxkcmVuKCAndWwuc3ViLW1lbnUnICksIC8vIFRoZSBuZWFyZXN0IHN1Ym1lbnUuXG5cdFx0XHQkdGFyZ2V0ID0gJCggZS50YXJnZXQgKTsgLy8gdGhlIGVsZW1lbnQgdGhhdCdzIGFjdHVhbGx5IGJlaW5nIGNsaWNrZWQgKGNoaWxkIG9mIHRoZSBsaSB0aGF0IHRyaWdnZXJlZCB0aGUgY2xpY2sgZXZlbnQpLlxuXG5cdFx0Ly8gRmlndXJlIG91dCBpZiB3ZSdyZSBjbGlja2luZyB0aGUgYnV0dG9uIG9yIGl0cyBhcnJvdyBjaGlsZCxcblx0XHQvLyBpZiBzbywgd2UgY2FuIGp1c3Qgb3BlbiBvciBjbG9zZSB0aGUgbWVudSBhbmQgYmFpbC5cblx0XHRpZiAoICR0YXJnZXQuaGFzQ2xhc3MoICdkb3duLWFycm93JyApIHx8ICR0YXJnZXQuaGFzQ2xhc3MoICdwYXJlbnQtaW5kaWNhdG9yJyApICkge1xuXG5cdFx0XHQvLyBGaXJzdCwgY29sbGFwc2UgYW55IGFscmVhZHkgb3BlbmVkIHN1Ym1lbnVzLlxuXHRcdFx0YXBwLnNsaWRlT3V0U3ViTWVudXMoIGVsICk7XG5cblx0XHRcdGlmICggISBzdWJNZW51Lmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblxuXHRcdFx0XHQvLyBPcGVuIHRoZSBzdWJtZW51LlxuXHRcdFx0XHRhcHAub3BlblN1Ym1lbnUoIGVsLCBzdWJNZW51ICk7XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIE9wZW4gYSBzdWJtZW51LlxuXHRhcHAub3BlblN1Ym1lbnUgPSBmdW5jdGlvbiggcGFyZW50LCBzdWJNZW51ICkge1xuXG5cdFx0Ly8gRXhwYW5kIHRoZSBsaXN0IG1lbnUgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byB0cnVlLlxuXHRcdHBhcmVudC5hZGRDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXG5cdFx0Ly8gU2xpZGUgdGhlIG1lbnUgaW4uXG5cdFx0c3ViTWVudS5hZGRDbGFzcyggJ2lzLXZpc2libGUgYW5pbWF0ZWQgc2xpZGVJbkxlZnQnICk7XG5cdH07XG5cblx0Ly8gRm9yY2UgY2xvc2UgYWxsIHRoZSBzdWJtZW51cyB3aGVuIHRoZSBtYWluIG1lbnUgY29udGFpbmVyIGlzIGNsb3NlZC5cblx0YXBwLmZvcmNlQ2xvc2VTdWJtZW51cyA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoICQoIGV2ZW50LnRhcmdldCApLmhhc0NsYXNzKCAnb2ZmLWNhbnZhcy1jb250YWluZXInICkgKSB7XG5cblx0XHRcdC8vIEZvY3VzIG9mZmNhbnZhcyBtZW51IGZvciBhMTF5LlxuXHRcdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5mb2N1cygpO1xuXG5cdFx0XHQvLyBUaGUgdHJhbnNpdGlvbmVuZCBldmVudCB0cmlnZ2VycyBvbiBvcGVuIGFuZCBvbiBjbG9zZSwgbmVlZCB0byBtYWtlIHN1cmUgd2Ugb25seSBkbyB0aGlzIG9uIGNsb3NlLlxuXHRcdFx0aWYgKCAhICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0YXBwLiRjLnN1Yk1lbnVDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlIHNsaWRlSW5MZWZ0JyApO1xuXHRcdFx0XHRhcHAuJGMuYm9keS5jc3MoICdvdmVyZmxvdycsICd2aXNpYmxlJyApO1xuXHRcdFx0XHRhcHAuJGMuYm9keS51bmJpbmQoICd0b3VjaHN0YXJ0JyApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRcdGFwcC4kYy5ib2R5LmNzcyggJ292ZXJmbG93JywgJ2hpZGRlbicgKTtcblx0XHRcdFx0YXBwLiRjLmJvZHkuYmluZCggJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoICEgJCggZS50YXJnZXQgKS5wYXJlbnRzKCAnLmNvbnRhY3QtbW9kYWwnIClbMF0gKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2JpbGVNZW51ICkgKTtcbiIsIi8qKlxuICogRmlsZSBtb2RhbC5qc1xuICpcbiAqIERlYWwgd2l0aCBtdWx0aXBsZSBtb2RhbHMgYW5kIHRoZWlyIG1lZGlhLlxuICovXG53aW5kb3cud2RzTW9kYWwgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdGxldCAkbW9kYWxUb2dnbGUsXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuLFxuXHRcdCRwbGF5ZXIsXG5cdFx0JHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzY3JpcHQnICksXG5cdFx0JGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdzY3JpcHQnIClbMF0sXG5cdFx0WVQ7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0JGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCAkdGFnLCAkZmlyc3RTY3JpcHRUYWcgKTtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHQnYm9keSc6ICQoICdib2R5JyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkKCAnLm1vZGFsLXRyaWdnZXInICkubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFRyaWdnZXIgYSBtb2RhbCB0byBvcGVuLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICcubW9kYWwtdHJpZ2dlcicsIGFwcC5vcGVuTW9kYWwgKTtcblxuXHRcdC8vIFRyaWdnZXIgdGhlIGNsb3NlIGJ1dHRvbiB0byBjbG9zZSB0aGUgbW9kYWwuXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJy5jbG9zZScsIGFwcC5jbG9zZU1vZGFsICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgaGl0dGluZyB0aGUgZXNjIGtleS5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIGNsb3NlIHRoZSBtb2RhbCBieSBjbGlja2luZyBvdXRzaWRlIG9mIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnZGl2Lm1vZGFsLW9wZW4nLCBhcHAuY2xvc2VNb2RhbEJ5Q2xpY2sgKTtcblxuXHRcdC8vIExpc3RlbiB0byB0YWJzLCB0cmFwIGtleWJvYXJkIGlmIHdlIG5lZWQgdG9cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAudHJhcEtleWJvYXJkTWF5YmUgKTtcblxuXHR9O1xuXG5cdC8vIE9wZW4gdGhlIG1vZGFsLlxuXHRhcHAub3Blbk1vZGFsID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTdG9yZSB0aGUgbW9kYWwgdG9nZ2xlIGVsZW1lbnRcblx0XHQkbW9kYWxUb2dnbGUgPSAkKCB0aGlzICk7XG5cblx0XHQvLyBGaWd1cmUgb3V0IHdoaWNoIG1vZGFsIHdlJ3JlIG9wZW5pbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoIHRoaXMgKS5kYXRhKCAndGFyZ2V0JyApICk7XG5cblx0XHQvLyBEaXNwbGF5IHRoZSBtb2RhbC5cblx0XHQkbW9kYWwuYWRkQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gQWRkIGJvZHkgY2xhc3MuXG5cdFx0YXBwLiRjLmJvZHkuYWRkQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gRmluZCB0aGUgZm9jdXNhYmxlIGNoaWxkcmVuIG9mIHRoZSBtb2RhbC5cblx0XHQvLyBUaGlzIGxpc3QgbWF5IGJlIGluY29tcGxldGUsIHJlYWxseSB3aXNoIGpRdWVyeSBoYWQgdGhlIDpmb2N1c2FibGUgcHNldWRvIGxpa2UgalF1ZXJ5IFVJIGRvZXMuXG5cdFx0Ly8gRm9yIG1vcmUgYWJvdXQgOmlucHV0IHNlZTogaHR0cHM6Ly9hcGkuanF1ZXJ5LmNvbS9pbnB1dC1zZWxlY3Rvci9cblx0XHQkZm9jdXNhYmxlQ2hpbGRyZW4gPSAkbW9kYWwuZmluZCggJ2EsIDppbnB1dCwgW3RhYmluZGV4XScgKTtcblxuXHRcdC8vIElkZWFsbHksIHRoZXJlIGlzIGFsd2F5cyBvbmUgKHRoZSBjbG9zZSBidXR0b24pLCBidXQgeW91IG5ldmVyIGtub3cuXG5cdFx0aWYgKCAwIDwgJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCApIHtcblxuXHRcdFx0Ly8gU2hpZnQgZm9jdXMgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhlIG1vZGFsLlxuXHRhcHAuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gRmlndXJlIHRoZSBvcGVuZWQgbW9kYWwgd2UncmUgY2xvc2luZyBhbmQgc3RvcmUgdGhlIG9iamVjdC5cblx0XHRsZXQgJG1vZGFsID0gJCggJCggJ2Rpdi5tb2RhbC1vcGVuIC5jbG9zZScgKS5kYXRhKCAndGFyZ2V0JyApICksXG5cblx0XHRcdC8vIEZpbmQgdGhlIGlmcmFtZSBpbiB0aGUgJG1vZGFsIG9iamVjdC5cblx0XHRcdCRpZnJhbWUgPSAkbW9kYWwuZmluZCggJ2lmcmFtZScgKTtcblxuXHRcdC8vIE9ubHkgZG8gdGhpcyBpZiB0aGVyZSBhcmUgYW55IGlmcmFtZXMuXG5cdFx0aWYgKCAkaWZyYW1lLmxlbmd0aCApIHtcblxuXHRcdFx0Ly8gR2V0IHRoZSBpZnJhbWUgc3JjIFVSTC5cblx0XHRcdGxldCB1cmwgPSAkaWZyYW1lLmF0dHIoICdzcmMnICk7XG5cblx0XHRcdC8vIFJlbW92aW5nL1JlYWRkaW5nIHRoZSBVUkwgd2lsbCBlZmZlY3RpdmVseSBicmVhayB0aGUgWW91VHViZSBBUEkuXG5cdFx0XHQvLyBTbyBsZXQncyBub3QgZG8gdGhhdCB3aGVuIHRoZSBpZnJhbWUgVVJMIGNvbnRhaW5zIHRoZSBlbmFibGVqc2FwaSBwYXJhbWV0ZXIuXG5cdFx0XHRpZiAoICEgdXJsLmluY2x1ZGVzKCAnZW5hYmxlanNhcGk9MScgKSApIHtcblxuXHRcdFx0XHQvLyBSZW1vdmUgdGhlIHNvdXJjZSBVUkwsIHRoZW4gYWRkIGl0IGJhY2ssIHNvIHRoZSB2aWRlbyBjYW4gYmUgcGxheWVkIGFnYWluIGxhdGVyLlxuXHRcdFx0XHQkaWZyYW1lLmF0dHIoICdzcmMnLCAnJyApLmF0dHIoICdzcmMnLCB1cmwgKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gVXNlIHRoZSBZb3VUdWJlIEFQSSB0byBzdG9wIHRoZSB2aWRlby5cblx0XHRcdFx0JHBsYXllci5zdG9wVmlkZW8oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBGaW5hbGx5LCBoaWRlIHRoZSBtb2RhbC5cblx0XHQkbW9kYWwucmVtb3ZlQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJldmVydCBmb2N1cyBiYWNrIHRvIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlLmZvY3VzKCk7XG5cblx0fTtcblxuXHQvLyBDbG9zZSBpZiBcImVzY1wiIGtleSBpcyBwcmVzc2VkLlxuXHRhcHAuZXNjS2V5Q2xvc2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENsb3NlIGlmIHRoZSB1c2VyIGNsaWNrcyBvdXRzaWRlIG9mIHRoZSBtb2RhbFxuXHRhcHAuY2xvc2VNb2RhbEJ5Q2xpY2sgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHQvLyBJZiB0aGUgcGFyZW50IGNvbnRhaW5lciBpcyBOT1QgdGhlIG1vZGFsIGRpYWxvZyBjb250YWluZXIsIGNsb3NlIHRoZSBtb2RhbFxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnbW9kYWwtZGlhbG9nJyApICkge1xuXHRcdFx0YXBwLmNsb3NlTW9kYWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gVHJhcCB0aGUga2V5Ym9hcmQgaW50byBhIG1vZGFsIHdoZW4gb25lIGlzIGFjdGl2ZS5cblx0YXBwLnRyYXBLZXlib2FyZE1heWJlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gV2Ugb25seSBuZWVkIHRvIGRvIHN0dWZmIHdoZW4gdGhlIG1vZGFsIGlzIG9wZW4gYW5kIHRhYiBpcyBwcmVzc2VkLlxuXHRcdGlmICggOSA9PT0gZXZlbnQud2hpY2ggJiYgMCA8ICQoICcubW9kYWwtb3BlbicgKS5sZW5ndGggKSB7XG5cdFx0XHRsZXQgJGZvY3VzZWQgPSAkKCAnOmZvY3VzJyApLFxuXHRcdFx0XHRmb2N1c0luZGV4ID0gJGZvY3VzYWJsZUNoaWxkcmVuLmluZGV4KCAkZm9jdXNlZCApO1xuXG5cdFx0XHRpZiAoIDAgPT09IGZvY3VzSW5kZXggJiYgZXZlbnQuc2hpZnRLZXkgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQsIGFuZCBzaGlmdCBpcyBoZWxkIHdoZW4gcHJlc3NpbmcgdGFiLCBnbyBiYWNrIHRvIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblsgJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSBlbHNlIGlmICggISBldmVudC5zaGlmdEtleSAmJiBmb2N1c0luZGV4ID09PSAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGlzIGlzIHRoZSBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgbm90IGhlbGQsIGdvIGJhY2sgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSG9vayBpbnRvIFlvdVR1YmUgPGlmcmFtZT4uXG5cdGFwcC5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCAkbW9kYWwgPSAkKCAnZGl2Lm1vZGFsJyApLFxuXHRcdFx0JGlmcmFtZWlkID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICkuYXR0ciggJ2lkJyApO1xuXG5cdFx0JHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoICRpZnJhbWVpZCwge1xuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdCdvblJlYWR5JzogYXBwLm9uUGxheWVyUmVhZHksXG5cdFx0XHRcdCdvblN0YXRlQ2hhbmdlJzogYXBwLm9uUGxheWVyU3RhdGVDaGFuZ2Vcblx0XHRcdH1cblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciByZWFkeS5cblx0YXBwLm9uUGxheWVyUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0fTtcblxuXHQvLyBEbyBzb21ldGhpbmcgb24gcGxheWVyIHN0YXRlIGNoYW5nZS5cblx0YXBwLm9uUGxheWVyU3RhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFNldCBmb2N1cyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgaW5zaWRlIG9mIHRoZSBtb2RhbCB0aGUgcGxheWVyIGlzIGluLlxuXHRcdCQoIGV2ZW50LnRhcmdldC5hICkucGFyZW50cyggJy5tb2RhbCcgKS5maW5kKCAnYSwgOmlucHV0LCBbdGFiaW5kZXhdJyApLmZpcnN0KCkuZm9jdXMoKTtcblx0fTtcblxuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzTW9kYWwgKSApO1xuIiwiLyoqXG4gKiBGaWxlOiBuYXZpZ2F0aW9uLXByaW1hcnkuanNcbiAqXG4gKiBIZWxwZXJzIGZvciB0aGUgcHJpbWFyeSBuYXZpZ2F0aW9uLlxuICovXG53aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0c3ViTWVudUNvbnRhaW5lcjogJCggJy5tYWluLW5hdmlnYXRpb24gLnN1Yi1tZW51JyApLFxuXHRcdFx0c3ViTWVudVBhcmVudEl0ZW06ICQoICcubWFpbi1uYXZpZ2F0aW9uIGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJ2EnICkub24oICdmb2N1c2luIGZvY3Vzb3V0JywgYXBwLnRvZ2dsZUZvY3VzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnN1Yk1lbnVDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJz4gYScgKS5hcHBlbmQoICc8c3BhbiBjbGFzcz1cImNhcmV0LWRvd25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+JyApO1xuXHR9O1xuXG5cdC8vIFRvZ2dsZSB0aGUgZm9jdXMgY2xhc3Mgb24gdGhlIGxpbmsgcGFyZW50LlxuXHRhcHAudG9nZ2xlRm9jdXMgPSBmdW5jdGlvbigpIHtcblx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkudG9nZ2xlQ2xhc3MoICdmb2N1cycgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gKSApO1xuIiwiLyoqXG4gKiBGaWxlOiBvZmYtY2FudmFzLmpzXG4gKlxuICogSGVscCBkZWFsIHdpdGggdGhlIG9mZi1jYW52YXMgbW9iaWxlIG1lbnUuXG4gKi9cbndpbmRvdy53ZHNvZmZDYW52YXMgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdG9mZkNhbnZhc0Nsb3NlOiAkKCAnLm9mZi1jYW52YXMtY2xvc2UnICksXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInICksXG5cdFx0XHRvZmZDYW52YXNPcGVuOiAkKCAnLm9mZi1jYW52YXMtb3BlbicgKSxcblx0XHRcdG9mZkNhbnZhc1NjcmVlbjogJCggJy5vZmYtY2FudmFzLXNjcmVlbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC5lc2NLZXlDbG9zZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDbG9zZS5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4ub24oICdjbGljaycsIGFwcC50b2dnbGVvZmZDYW52YXMgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLm9uKCAnY2xpY2snLCBhcHAuY2xvc2VvZmZDYW52YXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBUbyBzaG93IG9yIG5vdCB0byBzaG93P1xuXHRhcHAudG9nZ2xlb2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoICd0cnVlJyA9PT0gJCggdGhpcyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApICkge1xuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFwcC5vcGVub2ZmQ2FudmFzKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gU2hvdyB0aGF0IGRyYXdlciFcblx0YXBwLm9wZW5vZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIGZhbHNlICk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhhdCBkcmF3ZXIhXG5cdGFwcC5jbG9zZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIHRydWUgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmZvY3VzKCk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgZHJhd2VyIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXG5cdGFwcC5lc2NLZXlDbG9zZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNvZmZDYW52YXMgKSApO1xuIiwiLyoqXG4gKiBGaWxlIHNraXAtbGluay1mb2N1cy1maXguanMuXG4gKlxuICogSGVscHMgd2l0aCBhY2Nlc3NpYmlsaXR5IGZvciBrZXlib2FyZCBvbmx5IHVzZXJzLlxuICpcbiAqIExlYXJuIG1vcmU6IGh0dHBzOi8vZ2l0LmlvL3ZXZHIyXG4gKi9cbiggZnVuY3Rpb24oKSB7XG5cdHZhciBpc1dlYmtpdCA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICd3ZWJraXQnICksXG5cdFx0aXNPcGVyYSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdvcGVyYScgKSxcblx0XHRpc0llID0gLTEgPCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ21zaWUnICk7XG5cblx0aWYgKCAoIGlzV2Via2l0IHx8IGlzT3BlcmEgfHwgaXNJZSApICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGlkID0gbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoIDEgKSxcblx0XHRcdFx0ZWxlbWVudDtcblxuXHRcdFx0aWYgKCAhICggL15bQS16MC05Xy1dKyQvICkudGVzdCggaWQgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cblx0XHRcdGlmICggZWxlbWVudCApIHtcblx0XHRcdFx0aWYgKCAhICggL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pICkudGVzdCggZWxlbWVudC50YWdOYW1lICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50YWJJbmRleCA9IC0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlICk7XG5cdH1cbn0oKSApO1xuIiwiLyoqXG4gKiBNYWtlIHRhYmxlcyByZXNwb25zaXZlIGFnYWluLlxuICpcbiAqIEBhdXRob3IgSGFyaXMgWnVsZmlxYXJcbiAqL1xud2luZG93Lndkc1RhYmxlcyA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3Jcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5nc1xuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0dGFibGU6ICQoICd0YWJsZScgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRGF0YUxhYmVsICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnRhYmxlLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBZGRzIGRhdGEtbGFiZWwgdG8gdGQgYmFzZWQgb24gdGguXG5cdGFwcC5hZGREYXRhTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRjb25zdCB0YWJsZSA9IGFwcC4kYy50YWJsZTtcblx0XHRjb25zdCB0YWJsZUhlYWRlcnMgPSB0YWJsZS5maW5kKCAndGhlYWQgdGgnICk7XG5cdFx0Y29uc3QgdGFibGVSb3cgPSB0YWJsZS5maW5kKCAndGJvZHkgdHInICk7XG5cblx0XHR0YWJsZVJvdy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRkID0gJCggdGhpcyApLmZpbmQoICd0ZCcgKTtcblxuXHRcdFx0dGQuZWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xuXHRcdFx0XHRpZiAoICQoIHRhYmxlSGVhZGVycy5nZXQoIGluZGV4ICkgKSApIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuYXR0ciggJ2RhdGEtbGFiZWwnLCAkKCB0YWJsZUhlYWRlcnMuZ2V0KCBpbmRleCApICkudGV4dCgpICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0Ly8gRW5nYWdlXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1RhYmxlcyApICk7XG4iLCIvKipcbiAqIEZpbGUgd2luZG93LXJlYWR5LmpzXG4gKlxuICogQWRkIGEgXCJyZWFkeVwiIGNsYXNzIHRvIDxib2R5PiB3aGVuIHdpbmRvdyBpcyByZWFkeS5cbiAqL1xud2luZG93Lndkc1dpbmRvd1JlYWR5ID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHR9O1xuXG5cdC8vIENhY2hlIGRvY3VtZW50IGVsZW1lbnRzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHQnd2luZG93JzogJCggd2luZG93ICksXG5cdFx0XHQnYm9keSc6ICQoIGRvY3VtZW50LmJvZHkgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cubG9hZCggYXBwLmFkZEJvZHlDbGFzcyApO1xuXHR9O1xuXG5cdC8vIEFkZCBhIGNsYXNzIHRvIDxib2R5Pi5cblx0YXBwLmFkZEJvZHlDbGFzcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5LmFkZENsYXNzKCAncmVhZHknICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNXaW5kb3dSZWFkeSApICk7XG4iXX0=
