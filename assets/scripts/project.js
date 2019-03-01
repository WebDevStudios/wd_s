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
		var slides = $('.slide'),
			activeSlide = $('.slick-current'),
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyIsImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ0YWJsZS5qcyIsInZpZGVvLmpzIiwid2luZG93LXJlYWR5LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImFjY29yZGlvbkJsb2NrVG9nZ2xlIiwiJCIsImFwcCIsImluaXQiLCJjYWNoZSIsIm1lZXRzUmVxdWlyZW1lbnRzIiwiYmluZEV2ZW50cyIsIiRjIiwiaHRtbCIsImFjY29yZGlvbiIsIml0ZW1zIiwiaGVhZGVycyIsImNvbnRlbnRzIiwiYnV0dG9uIiwiYW5jaG9ySUQiLCJsb2NhdGlvbiIsImhhc2giLCJvbiIsInRvZ2dsZUFjY29yZGlvbiIsIm9wZW5IYXNoQWNjb3JkaW9uIiwibGVuZ3RoIiwicGFyZW50cyIsInRvZ2dsZUNsYXNzIiwiaXNFeHBhbmRlZCIsImhhc0NsYXNzIiwiZmluZCIsImF0dHIiLCJub3QiLCJyZW1vdmVDbGFzcyIsInNlbGVjdG9yIiwidHJpZ2dlciIsImFkbWluQmFySGVpZ2h0IiwiaGVpZ2h0IiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsImpRdWVyeSIsIndkc0Nhcm91c2VsIiwidGhlQ2Fyb3VzZWwiLCJkb1NsaWNrIiwiZG9GaXJzdEFuaW1hdGlvbiIsImZpcnN0U2xpZGUiLCJmaXJzdFNsaWRlQ29udGVudCIsImZpcnN0QW5pbWF0aW9uIiwiYWRkQ2xhc3MiLCJkb0FuaW1hdGlvbiIsInNsaWRlcyIsImFjdGl2ZVNsaWRlIiwiYWN0aXZlQ29udGVudCIsImFuaW1hdGlvbkNsYXNzIiwidW5kZWZpbmVkIiwic3BsaXRBbmltYXRpb24iLCJzcGxpdCIsImFuaW1hdGlvblRyaWdnZXIiLCJlYWNoIiwic2xpZGVDb250ZW50IiwibGFzdENsYXNzIiwicG9wIiwicGxheUJhY2tncm91bmRWaWRlb3MiLCJwbGF5Iiwic2xpY2siLCJhdXRvcGxheSIsImF1dG9wbGF5U3BlZWQiLCJhcnJvd3MiLCJkb3RzIiwiZm9jdXNPblNlbGVjdCIsIndhaXRGb3JBbmltYXRlIiwiU2hvd0hpZGVTZWFyY2hGb3JtIiwiYm9keSIsImhlYWRlclNlYXJjaEZvcm0iLCJzaG93SGlkZVNlYXJjaEZvcm0iLCJoaWRlU2VhcmNoRm9ybSIsImV2ZW50IiwidGFyZ2V0IiwiZG9jdW1lbnQiLCJjbGFzc05hbWUiLCJyZXBsYWNlIiwid2RzTW9iaWxlTWVudSIsInN1Yk1lbnVDb250YWluZXIiLCJzdWJTdWJNZW51Q29udGFpbmVyIiwic3ViTWVudVBhcmVudEl0ZW0iLCJvZmZDYW52YXNDb250YWluZXIiLCJhZGREb3duQXJyb3ciLCJ0b2dnbGVTdWJtZW51IiwicmVzZXRTdWJNZW51IiwiZm9yY2VDbG9zZVN1Ym1lbnVzIiwiaXMiLCJzbGlkZU91dFN1Yk1lbnVzIiwiZWwiLCJwYXJlbnQiLCJhZnRlciIsImUiLCJzdWJNZW51IiwiY2hpbGRyZW4iLCIkdGFyZ2V0Iiwib3BlblN1Ym1lbnUiLCJmb2N1cyIsImNzcyIsInVuYmluZCIsImJpbmQiLCJwcmV2ZW50RGVmYXVsdCIsIndkc01vZGFsIiwiJG1vZGFsVG9nZ2xlIiwiJGZvY3VzYWJsZUNoaWxkcmVuIiwiJHBsYXllciIsIiR0YWciLCJjcmVhdGVFbGVtZW50IiwiJGZpcnN0U2NyaXB0VGFnIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJZVCIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJvcGVuTW9kYWwiLCJjbG9zZU1vZGFsIiwiZXNjS2V5Q2xvc2UiLCJjbG9zZU1vZGFsQnlDbGljayIsInRyYXBLZXlib2FyZE1heWJlIiwiJG1vZGFsIiwiZGF0YSIsIiRpZnJhbWUiLCJ1cmwiLCJpbmNsdWRlcyIsInN0b3BWaWRlbyIsImtleUNvZGUiLCJ3aGljaCIsIiRmb2N1c2VkIiwiZm9jdXNJbmRleCIsImluZGV4Iiwic2hpZnRLZXkiLCJvbllvdVR1YmVJZnJhbWVBUElSZWFkeSIsIiRpZnJhbWVpZCIsIlBsYXllciIsImV2ZW50cyIsIm9uUGxheWVyUmVhZHkiLCJvblBsYXllclN0YXRlQ2hhbmdlIiwiYSIsImZpcnN0Iiwid2RzUHJpbWFyeU5hdmlnYXRpb24iLCJ0b2dnbGVGb2N1cyIsImFwcGVuZCIsIndkc29mZkNhbnZhcyIsIm9mZkNhbnZhc0Nsb3NlIiwib2ZmQ2FudmFzT3BlbiIsIm9mZkNhbnZhc1NjcmVlbiIsImNsb3Nlb2ZmQ2FudmFzIiwidG9nZ2xlb2ZmQ2FudmFzIiwib3Blbm9mZkNhbnZhcyIsImlzV2Via2l0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwiaXNPcGVyYSIsImlzSWUiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZCIsInN1YnN0cmluZyIsImVsZW1lbnQiLCJ0ZXN0IiwidGFnTmFtZSIsInRhYkluZGV4Iiwid2RzVGFibGVzIiwidGFibGUiLCJhZGREYXRhTGFiZWwiLCJ0YWJsZUhlYWRlcnMiLCJ0YWJsZVJvdyIsInRkIiwiZ2V0IiwidGV4dCIsIldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCIsInZpZGVvQnV0dG9uIiwiZG9Ub2dnbGVQbGF5YmFjayIsInNpYmxpbmdzIiwid2RzV2luZG93UmVhZHkiLCJsb2FkIiwiYWRkQm9keUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBQSxPQUFPQyxvQkFBUCxHQUE4QixFQUE5QjtBQUNFLFdBQVVELE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUEsTUFBS0YsSUFBSUcsaUJBQUosRUFBTCxFQUErQjtBQUM5QkgsT0FBSUksVUFBSjtBQUNBO0FBQ0QsRUFORDs7QUFRQTtBQUNBSixLQUFJRSxLQUFKLEdB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S0FBSjtBQUNBRixNQUFJSSxVQUFKO0FBQ0EsRUFIRDs7QUFLQTtBQUNBSixLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSUssRUFBSixHQUFTO0FBQ1IsYUFBVU4sRUFBR0YsTUFBSCxDQURGO0FBRVIsV0FBUUUsRUFBRzBFLFNBQVNOLElBQVo7QUFGQSxHQUFUO0FBSUEsRUFMRDs7QUFPQTtBQUNBbkUsS0FBSUksVUFBSixHQUFpQixZQUFXO0FBQzNCSixNQUFJSyxFQUFKLENBQU9SLE1BQVAsQ0FBY2lMLElBQWQsQ0FBb0I5SyxJQUFJK0ssWUFBeEI7QUFDQSxFQUZEOztBQUlBO0FBQ0EvSyxLQUFJK0ssWUFBSixHQUFtQixZQUFXO0FBQzdCL0ssTUFBSUssRUFBSixDQUFPOEQsSUFBUCxDQUFZeEIsUUFBWixDQUFzQixPQUF0QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQTVDLEdBQUdDLElBQUlDLElBQVA7QUFDQSxDQTVCQyxFQTRCQ0osTUE1QkQsRUE0QlNzQyxNQTVCVCxFQTRCaUJ0QyxPQUFPZ0wsY0E1QnhCLENBQUYiLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQWNjb3JkaW9uIGJsb2NrIGZ1bmN0aW9uYWxpdHlcbiAqXG4gKiBAYXV0aG9yIFNoYW5ub24gTWFjTWlsbGFuLCBDb3JleSBDb2xsaW5zXG4gKi9cbndpbmRvdy5hY2NvcmRpb25CbG9ja1RvZ2dsZSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3Jcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5nc1xuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0aHRtbDogJCggJ2h0bWwnICksXG5cdFx0XHRhY2NvcmRpb246ICQoICcuYWNjb3JkaW9uJyApLFxuXHRcdFx0aXRlbXM6ICQoICcuYWNjb3JkaW9uLWl0ZW0nICksXG5cdFx0XHRoZWFkZXJzOiAkKCAnLmFjY29yZGlvbi1pdGVtLWhlYWRlcicgKSxcblx0XHRcdGNvbnRlbnRzOiAkKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICksXG5cdFx0XHRidXR0b246ICQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLFxuXHRcdFx0YW5jaG9ySUQ6ICQoIHdpbmRvdy5sb2NhdGlvbi5oYXNoIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50c1xuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5oZWFkZXJzLm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsIGFwcC50b2dnbGVBY2NvcmRpb24gKTtcblx0XHRhcHAuJGMuYnV0dG9uLm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsIGFwcC50b2dnbGVBY2NvcmRpb24gKTtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5vcGVuSGFzaEFjY29yZGlvbiApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5hY2NvcmRpb24ubGVuZ3RoO1xuXHR9O1xuXG5cdGFwcC50b2dnbGVBY2NvcmRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEFkZCB0aGUgb3BlbiBjbGFzcyB0byB0aGUgaXRlbS5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS50b2dnbGVDbGFzcyggJ29wZW4nICk7XG5cblx0XHQvLyBJcyB0aGlzIG9uZSBleHBhbmRlZD9cblx0XHRsZXQgaXNFeHBhbmRlZCA9ICQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmhhc0NsYXNzKCAnb3BlbicgKTtcblxuXHRcdC8vIFNldCB0aGlzIGJ1dHRvbidzIGFyaWEtZXhwYW5kZWQgdmFsdWUuXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuZmluZCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBpc0V4cGFuZGVkID8gJ3RydWUnIDogJ2ZhbHNlJyApO1xuXG5cdFx0Ly8gU2V0IGFsbCBvdGhlciBpdGVtcyBpbiB0aGlzIGJsb2NrIHRvIGFyaWEtaGlkZGVuPXRydWUuXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWJsb2NrJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcgKS5ub3QoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApICkuYXR0ciggJ2FyaWEtaGlkZGVuJywgJ3RydWUnICk7XG5cblx0XHQvLyBTZXQgdGhpcyBpdGVtIHRvIGFyaWEtaGlkZGVuPWZhbHNlLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcgKS5hdHRyKCAnYXJpYS1oaWRkZW4nLCBpc0V4cGFuZGVkID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuXG5cdFx0Ly8gSGlkZSB0aGUgb3RoZXIgcGFuZWxzLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtJyApLm5vdCggJCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkgKS5yZW1vdmVDbGFzcyggJ29wZW4nICk7XG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWJsb2NrJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLm5vdCggJCggdGhpcyApICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0YXBwLm9wZW5IYXNoQWNjb3JkaW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoICEgYXBwLiRjLmFuY2hvcklELnNlbGVjdG9yICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFRyaWdnZXIgYSBjbGljayBvbiB0aGUgYnV0dG9uIGNsb3Nlc3QgdG8gdGhpcyBhY2NvcmRpb24uXG5cdFx0YXBwLiRjLmFuY2hvcklELnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuZmluZCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICkudHJpZ2dlciggJ2NsaWNrJyApO1xuXG5cdFx0Ly8gTm90IHNldHRpbmcgYSBjYWNoZWQgdmFyaWFibGUgYXMgaXQgZG9lc24ndCBzZWVtIHRvIGdyYWIgdGhlIGhlaWdodCBwcm9wZXJseS5cblx0XHRjb25zdCBhZG1pbkJhckhlaWdodCA9ICQoICcjd3BhZG1pbmJhcicgKS5sZW5ndGggPyAkKCAnI3dwYWRtaW5iYXInICkuaGVpZ2h0KCkgOiAwO1xuXG5cdFx0Ly8gQW5pbWF0ZSB0byB0aGUgZGl2IGZvciBhIG5pY2VyIGV4cGVyaWVuY2UuXG5cdFx0YXBwLiRjLmh0bWwuYW5pbWF0ZSgge1xuXHRcdFx0c2Nyb2xsVG9wOiBhcHAuJGMuYW5jaG9ySUQub2Zmc2V0KCkudG9wIC0gYWRtaW5CYXJIZWlnaHRcblx0XHR9LCAnc2xvdycgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2Vcblx0YXBwLmluaXQoKTtcblxufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuYWNjb3JkaW9uQmxvY2tUb2dnbGUgKSApO1xuIiwiLyoqXG4gKiBGaWxlIGNhcm91c2VsLmpzXG4gKlxuICogRGVhbCB3aXRoIHRoZSBTbGljayBjYXJvdXNlbC5cbiAqL1xud2luZG93Lndkc0Nhcm91c2VsID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHRoZUNhcm91c2VsOiAkKCAnLmNhcm91c2VsLWJsb2NrJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuZG9TbGljayApO1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmRvRmlyc3RBbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMudGhlQ2Fyb3VzZWwubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFuaW1hdGUgdGhlIGZpcnN0IHNsaWRlIG9uIHdpbmRvdyBsb2FkLlxuXHRhcHAuZG9GaXJzdEFuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IHRoZSBmaXJzdCBzbGlkZSBjb250ZW50IGFyZWEgYW5kIGFuaW1hdGlvbiBhdHRyaWJ1dGUuXG5cdFx0bGV0IGZpcnN0U2xpZGUgPSBhcHAuJGMudGhlQ2Fyb3VzZWwuZmluZCggJ1tkYXRhLXNsaWNrLWluZGV4PTBdJyApLFxuXHRcdFx0Zmlyc3RTbGlkZUNvbnRlbnQgPSBmaXJzdFNsaWRlLmZpbmQoICcuc2xpZGUtY29udGVudCcgKSxcblx0XHRcdGZpcnN0QW5pbWF0aW9uID0gZmlyc3RTbGlkZUNvbnRlbnQuYXR0ciggJ2RhdGEtYW5pbWF0aW9uJyApO1xuXG5cdFx0Ly8gQWRkIHRoZSBhbmltYXRpb24gY2xhc3MgdG8gdGhlIGZpcnN0IHNsaWRlLlxuXHRcdGZpcnN0U2xpZGVDb250ZW50LmFkZENsYXNzKCBmaXJzdEFuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIEFuaW1hdGUgdGhlIHNsaWRlIGNvbnRlbnQuXG5cdGFwcC5kb0FuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCBzbGlkZXMgPSAkKCAnLnNsaWRlJyApLFxuXHRcdFx0YWN0aXZlU2xpZGUgPSAkKCAnLnNsaWNrLWN1cnJlbnQnICksXG5cdFx0XHRhY3RpdmVDb250ZW50ID0gYWN0aXZlU2xpZGUuZmluZCggJy5zbGlkZS1jb250ZW50JyApLFxuXG5cdFx0XHQvLyBUaGlzIGlzIGEgc3RyaW5nIGxpa2Ugc286ICdhbmltYXRlZCBzb21lQ3NzQ2xhc3MnLlxuXHRcdFx0YW5pbWF0aW9uQ2xhc3MgPSBhY3RpdmVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKTtcblxuXHRcdFx0aWYgKCB1bmRlZmluZWQgPT09IGFuaW1hdGlvbkNsYXNzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBzcGxpdEFuaW1hdGlvbiA9IGFuaW1hdGlvbkNsYXNzLnNwbGl0KCAnICcgKSxcblxuXHRcdFx0Ly8gVGhpcyBpcyB0aGUgJ2FuaW1hdGVkJyBjbGFzcy5cblx0XHRcdGFuaW1hdGlvblRyaWdnZXIgPSBzcGxpdEFuaW1hdGlvblswXTtcblxuXHRcdC8vIEdvIHRocm91Z2ggZWFjaCBzbGlkZSB0byBzZWUgaWYgd2UndmUgYWxyZWFkeSBzZXQgYW5pbWF0aW9uIGNsYXNzZXMuXG5cdFx0c2xpZGVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0bGV0IHNsaWRlQ29udGVudCA9ICQoIHRoaXMgKS5maW5kKCAnLnNsaWRlLWNvbnRlbnQnICk7XG5cblx0XHRcdC8vIElmIHdlJ3ZlIHNldCBhbmltYXRpb24gY2xhc3NlcyBvbiBhIHNsaWRlLCByZW1vdmUgdGhlbS5cblx0XHRcdGlmICggc2xpZGVDb250ZW50Lmhhc0NsYXNzKCAnYW5pbWF0ZWQnICkgKSB7XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBsYXN0IGNsYXNzLCB3aGljaCBpcyB0aGUgYW5pbWF0ZS5jc3MgY2xhc3MuXG5cdFx0XHRcdGxldCBsYXN0Q2xhc3MgPSBzbGlkZUNvbnRlbnRcblx0XHRcdFx0XHQuYXR0ciggJ2NsYXNzJyApXG5cdFx0XHRcdFx0LnNwbGl0KCAnICcgKVxuXHRcdFx0XHRcdC5wb3AoKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgYm90aCBhbmltYXRpb24gY2xhc3Nlcy5cblx0XHRcdFx0c2xpZGVDb250ZW50LnJlbW92ZUNsYXNzKCBsYXN0Q2xhc3MgKS5yZW1vdmVDbGFzcyggYW5pbWF0aW9uVHJpZ2dlciApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEFkZCBhbmltYXRpb24gY2xhc3NlcyBhZnRlciBzbGlkZSBpcyBpbiB2aWV3LlxuXHRcdGFjdGl2ZUNvbnRlbnQuYWRkQ2xhc3MoIGFuaW1hdGlvbkNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWxsb3cgYmFja2dyb3VuZCB2aWRlb3MgdG8gYXV0b3BsYXkuXG5cdGFwcC5wbGF5QmFja2dyb3VuZFZpZGVvcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IGFsbCB0aGUgdmlkZW9zIGluIG91ciBzbGlkZXMgb2JqZWN0LlxuXHRcdCQoICd2aWRlbycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gTGV0IHRoZW0gYXV0b3BsYXkuIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0aGlzIGxhdGVyIHRvIG9ubHkgcGxheSB0aGUgdmlzaWJsZSBzbGlkZSB2aWRlby5cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBLaWNrIG9mZiBTbGljay5cblx0YXBwLmRvU2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdpbml0JywgYXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zICk7XG5cblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwuc2xpY2soIHtcblx0XHRcdGF1dG9wbGF5OiB0cnVlLFxuXHRcdFx0YXV0b3BsYXlTcGVlZDogNTAwMCxcblx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRmb2N1c09uU2VsZWN0OiB0cnVlLFxuXHRcdFx0d2FpdEZvckFuaW1hdGU6IHRydWVcblx0XHR9ICk7XG5cblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdhZnRlckNoYW5nZScsIGFwcC5kb0FuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc0Nhcm91c2VsICkgKTtcbiIsIi8qKlxuICogU2hvdy9IaWRlIHRoZSBTZWFyY2ggRm9ybSBpbiB0aGUgaGVhZGVyLlxuICpcbiAqIEBhdXRob3IgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3RvclxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdGhlYWRlclNlYXJjaEZvcm06ICQoICcuc2l0ZS1oZWFkZXItYWN0aW9uIC5jdGEtYnV0dG9uJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoRm9ybS5vbiggJ2tleXVwIHRvdWNoc3RhcnQgY2xpY2snLCBhcHAuc2hvd0hpZGVTZWFyY2hGb3JtICk7XG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXl1cCB0b3VjaHN0YXJ0IGNsaWNrJywgYXBwLmhpZGVTZWFyY2hGb3JtICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLmhlYWRlclNlYXJjaEZvcm0ubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFkZHMgdGhlIHRvZ2dsZSBjbGFzcyBmb3IgdGhlIHNlYXJjaCBmb3JtLlxuXHRhcHAuc2hvd0hpZGVTZWFyY2hGb3JtID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkudG9nZ2xlQ2xhc3MoICdzZWFyY2gtZm9ybS12aXNpYmxlJyApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdC8vIEhpZGVzIHRoZSBzZWFyY2ggZm9ybSBpZiB3ZSBjbGljayBvdXRzaWRlIG9mIGl0cyBjb250YWluZXIuXG5cdGFwcC5oaWRlU2VhcmNoRm9ybSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnc2l0ZS1oZWFkZXItYWN0aW9uJyApICkge1xuXHRcdFx0YXBwLiRjLmJvZHkucmVtb3ZlQ2xhc3MoICdzZWFyY2gtZm9ybS12aXNpYmxlJyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2Vcblx0JCggYXBwLmluaXQgKTtcblxufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtICkgKTtcbiIsIi8qKlxuICogRmlsZSBqcy1lbmFibGVkLmpzXG4gKlxuICogSWYgSmF2YXNjcmlwdCBpcyBlbmFibGVkLCByZXBsYWNlIHRoZSA8Ym9keT4gY2xhc3MgXCJuby1qc1wiLlxuICovXG5kb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoICduby1qcycsICdqcycgKTtcbiIsIi8qKlxuICogRmlsZTogbW9iaWxlLW1lbnUuanNcbiAqXG4gKiBDcmVhdGUgYW4gYWNjb3JkaW9uIHN0eWxlIGRyb3Bkb3duLlxuICovXG53aW5kb3cud2RzTW9iaWxlTWVudSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHN1Yk1lbnVDb250YWluZXI6ICQoICcubW9iaWxlLW1lbnUgLnN1Yi1tZW51LCAudXRpbGl0eS1uYXZpZ2F0aW9uIC5zdWItbWVudScgKSxcblx0XHRcdHN1YlN1Yk1lbnVDb250YWluZXI6ICQoICcubW9iaWxlLW1lbnUgLnN1Yi1tZW51IC5zdWItbWVudScgKSxcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1vYmlsZS1tZW51IGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4sIC51dGlsaXR5LW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKSxcblx0XHRcdG9mZkNhbnZhc0NvbnRhaW5lcjogJCggJy5vZmYtY2FudmFzLWNvbnRhaW5lcicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZVN1Ym1lbnUgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLnJlc2V0U3ViTWVudSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLmZvcmNlQ2xvc2VTdWJtZW51cyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBSZXNldCB0aGUgc3VibWVudXMgYWZ0ZXIgaXQncyBkb25lIGNsb3NpbmcuXG5cdGFwcC5yZXNldFN1Yk1lbnUgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFdoZW4gdGhlIGxpc3QgaXRlbSBpcyBkb25lIHRyYW5zaXRpb25pbmcgaW4gaGVpZ2h0LFxuXHRcdC8vIHJlbW92ZSB0aGUgY2xhc3NlcyBmcm9tIHRoZSBzdWJtZW51IHNvIGl0IGlzIHJlYWR5IHRvIHRvZ2dsZSBhZ2Fpbi5cblx0XHRpZiAoICQoIHRoaXMgKS5pcyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkgJiYgISAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0JCggdGhpcyApLmZpbmQoICd1bC5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlT3V0TGVmdCBpcy12aXNpYmxlJyApO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudSBpdGVtcy5cblx0YXBwLnNsaWRlT3V0U3ViTWVudXMgPSBmdW5jdGlvbiggZWwgKSB7XG5cblx0XHQvLyBJZiB0aGlzIGl0ZW0ncyBwYXJlbnQgaXMgdmlzaWJsZSBhbmQgdGhpcyBpcyBub3QsIGJhaWwuXG5cdFx0aWYgKCBlbC5wYXJlbnQoKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgJiYgISBlbC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhpcyBpdGVtJ3MgcGFyZW50IGlzIHZpc2libGUgYW5kIHRoaXMgaXRlbSBpcyB2aXNpYmxlLCBoaWRlIGl0cyBzdWJtZW51IHRoZW4gYmFpbC5cblx0XHRpZiAoIGVsLnBhcmVudCgpLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSAmJiBlbC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRlbC5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmVhY2goIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBPbmx5IHRyeSB0byBjbG9zZSBzdWJtZW51cyB0aGF0IGFyZSBhY3R1YWxseSBvcGVuLlxuXHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoICdzbGlkZUluTGVmdCcgKSApIHtcblxuXHRcdFx0XHQvLyBDbG9zZSB0aGUgcGFyZW50IGxpc3QgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byBmYWxzZS5cblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudS5cblx0XHRcdFx0JCggdGhpcyApLnJlbW92ZUNsYXNzKCAnc2xpZGVJbkxlZnQnICkuYWRkQ2xhc3MoICdzbGlkZU91dExlZnQnICk7XG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICdhOmZpcnN0JyApLmFmdGVyKCAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgY2xhc3M9XCJwYXJlbnQtaW5kaWNhdG9yXCIgYXJpYS1sYWJlbD1cIk9wZW4gc3VibWVudVwiPjxzcGFuIGNsYXNzPVwiZG93bi1hcnJvd1wiPjwvc3Bhbj48L2J1dHRvbj4nICk7XG5cdH07XG5cblx0Ly8gRGVhbCB3aXRoIHRoZSBzdWJtZW51LlxuXHRhcHAudG9nZ2xlU3VibWVudSA9IGZ1bmN0aW9uKCBlICkge1xuXG5cdFx0bGV0IGVsID0gJCggdGhpcyApLCAvLyBUaGUgbWVudSBlbGVtZW50IHdoaWNoIHdhcyBjbGlja2VkIG9uLlxuXHRcdFx0c3ViTWVudSA9IGVsLmNoaWxkcmVuKCAndWwuc3ViLW1lbnUnICksIC8vIFRoZSBuZWFyZXN0IHN1Ym1lbnUuXG5cdFx0XHQkdGFyZ2V0ID0gJCggZS50YXJnZXQgKTsgLy8gdGhlIGVsZW1lbnQgdGhhdCdzIGFjdHVhbGx5IGJlaW5nIGNsaWNrZWQgKGNoaWxkIG9mIHRoZSBsaSB0aGF0IHRyaWdnZXJlZCB0aGUgY2xpY2sgZXZlbnQpLlxuXG5cdFx0Ly8gRmlndXJlIG91dCBpZiB3ZSdyZSBjbGlja2luZyB0aGUgYnV0dG9uIG9yIGl0cyBhcnJvdyBjaGlsZCxcblx0XHQvLyBpZiBzbywgd2UgY2FuIGp1c3Qgb3BlbiBvciBjbG9zZSB0aGUgbWVudSBhbmQgYmFpbC5cblx0XHRpZiAoICR0YXJnZXQuaGFzQ2xhc3MoICdkb3duLWFycm93JyApIHx8ICR0YXJnZXQuaGFzQ2xhc3MoICdwYXJlbnQtaW5kaWNhdG9yJyApICkge1xuXG5cdFx0XHQvLyBGaXJzdCwgY29sbGFwc2UgYW55IGFscmVhZHkgb3BlbmVkIHN1Ym1lbnVzLlxuXHRcdFx0YXBwLnNsaWRlT3V0U3ViTWVudXMoIGVsICk7XG5cblx0XHRcdGlmICggISBzdWJNZW51Lmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblxuXHRcdFx0XHQvLyBPcGVuIHRoZSBzdWJtZW51LlxuXHRcdFx0XHRhcHAub3BlblN1Ym1lbnUoIGVsLCBzdWJNZW51ICk7XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIE9wZW4gYSBzdWJtZW51LlxuXHRhcHAub3BlblN1Ym1lbnUgPSBmdW5jdGlvbiggcGFyZW50LCBzdWJNZW51ICkge1xuXG5cdFx0Ly8gRXhwYW5kIHRoZSBsaXN0IG1lbnUgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byB0cnVlLlxuXHRcdHBhcmVudC5hZGRDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXG5cdFx0Ly8gU2xpZGUgdGhlIG1lbnUgaW4uXG5cdFx0c3ViTWVudS5hZGRDbGFzcyggJ2lzLXZpc2libGUgYW5pbWF0ZWQgc2xpZGVJbkxlZnQnICk7XG5cdH07XG5cblx0Ly8gRm9yY2UgY2xvc2UgYWxsIHRoZSBzdWJtZW51cyB3aGVuIHRoZSBtYWluIG1lbnUgY29udGFpbmVyIGlzIGNsb3NlZC5cblx0YXBwLmZvcmNlQ2xvc2VTdWJtZW51cyA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoICQoIGV2ZW50LnRhcmdldCApLmhhc0NsYXNzKCAnb2ZmLWNhbnZhcy1jb250YWluZXInICkgKSB7XG5cblx0XHRcdC8vIEZvY3VzIG9mZmNhbnZhcyBtZW51IGZvciBhMTF5LlxuXHRcdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5mb2N1cygpO1xuXG5cdFx0XHQvLyBUaGUgdHJhbnNpdGlvbmVuZCBldmVudCB0cmlnZ2VycyBvbiBvcGVuIGFuZCBvbiBjbG9zZSwgbmVlZCB0byBtYWtlIHN1cmUgd2Ugb25seSBkbyB0aGlzIG9uIGNsb3NlLlxuXHRcdFx0aWYgKCAhICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0YXBwLiRjLnN1Yk1lbnVDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlIHNsaWRlSW5MZWZ0JyApO1xuXHRcdFx0XHRhcHAuJGMuYm9keS5jc3MoICdvdmVyZmxvdycsICd2aXNpYmxlJyApO1xuXHRcdFx0XHRhcHAuJGMuYm9keS51bmJpbmQoICd0b3VjaHN0YXJ0JyApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRcdGFwcC4kYy5ib2R5LmNzcyggJ292ZXJmbG93JywgJ2hpZGRlbicgKTtcblx0XHRcdFx0YXBwLiRjLmJvZHkuYmluZCggJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoICEgJCggZS50YXJnZXQgKS5wYXJlbnRzKCAnLmNvbnRhY3QtbW9kYWwnIClbMF0gKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2JpbGVNZW51ICkgKTtcbiIsIi8qKlxuICogRmlsZSBtb2RhbC5qc1xuICpcbiAqIERlYWwgd2l0aCBtdWx0aXBsZSBtb2RhbHMgYW5kIHRoZWlyIG1lZGlhLlxuICovXG53aW5kb3cud2RzTW9kYWwgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdGxldCAkbW9kYWxUb2dnbGUsXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuLFxuXHRcdCRwbGF5ZXIsXG5cdFx0JHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzY3JpcHQnICksXG5cdFx0JGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdzY3JpcHQnIClbMF0sXG5cdFx0WVQ7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0JGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCAkdGFnLCAkZmlyc3RTY3JpcHRUYWcgKTtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHQnYm9keSc6ICQoICdib2R5JyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkKCAnLm1vZGFsLXRyaWdnZXInICkubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFRyaWdnZXIgYSBtb2RhbCB0byBvcGVuLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICcubW9kYWwtdHJpZ2dlcicsIGFwcC5vcGVuTW9kYWwgKTtcblxuXHRcdC8vIFRyaWdnZXIgdGhlIGNsb3NlIGJ1dHRvbiB0byBjbG9zZSB0aGUgbW9kYWwuXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJy5jbG9zZScsIGFwcC5jbG9zZU1vZGFsICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgaGl0dGluZyB0aGUgZXNjIGtleS5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIGNsb3NlIHRoZSBtb2RhbCBieSBjbGlja2luZyBvdXRzaWRlIG9mIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnZGl2Lm1vZGFsLW9wZW4nLCBhcHAuY2xvc2VNb2RhbEJ5Q2xpY2sgKTtcblxuXHRcdC8vIExpc3RlbiB0byB0YWJzLCB0cmFwIGtleWJvYXJkIGlmIHdlIG5lZWQgdG9cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAudHJhcEtleWJvYXJkTWF5YmUgKTtcblxuXHR9O1xuXG5cdC8vIE9wZW4gdGhlIG1vZGFsLlxuXHRhcHAub3Blbk1vZGFsID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTdG9yZSB0aGUgbW9kYWwgdG9nZ2xlIGVsZW1lbnRcblx0XHQkbW9kYWxUb2dnbGUgPSAkKCB0aGlzICk7XG5cblx0XHQvLyBGaWd1cmUgb3V0IHdoaWNoIG1vZGFsIHdlJ3JlIG9wZW5pbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoIHRoaXMgKS5kYXRhKCAndGFyZ2V0JyApICk7XG5cblx0XHQvLyBEaXNwbGF5IHRoZSBtb2RhbC5cblx0XHQkbW9kYWwuYWRkQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gQWRkIGJvZHkgY2xhc3MuXG5cdFx0YXBwLiRjLmJvZHkuYWRkQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gRmluZCB0aGUgZm9jdXNhYmxlIGNoaWxkcmVuIG9mIHRoZSBtb2RhbC5cblx0XHQvLyBUaGlzIGxpc3QgbWF5IGJlIGluY29tcGxldGUsIHJlYWxseSB3aXNoIGpRdWVyeSBoYWQgdGhlIDpmb2N1c2FibGUgcHNldWRvIGxpa2UgalF1ZXJ5IFVJIGRvZXMuXG5cdFx0Ly8gRm9yIG1vcmUgYWJvdXQgOmlucHV0IHNlZTogaHR0cHM6Ly9hcGkuanF1ZXJ5LmNvbS9pbnB1dC1zZWxlY3Rvci9cblx0XHQkZm9jdXNhYmxlQ2hpbGRyZW4gPSAkbW9kYWwuZmluZCggJ2EsIDppbnB1dCwgW3RhYmluZGV4XScgKTtcblxuXHRcdC8vIElkZWFsbHksIHRoZXJlIGlzIGFsd2F5cyBvbmUgKHRoZSBjbG9zZSBidXR0b24pLCBidXQgeW91IG5ldmVyIGtub3cuXG5cdFx0aWYgKCAwIDwgJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCApIHtcblxuXHRcdFx0Ly8gU2hpZnQgZm9jdXMgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhlIG1vZGFsLlxuXHRhcHAuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gRmlndXJlIHRoZSBvcGVuZWQgbW9kYWwgd2UncmUgY2xvc2luZyBhbmQgc3RvcmUgdGhlIG9iamVjdC5cblx0XHRsZXQgJG1vZGFsID0gJCggJCggJ2Rpdi5tb2RhbC1vcGVuIC5jbG9zZScgKS5kYXRhKCAndGFyZ2V0JyApICksXG5cblx0XHRcdC8vIEZpbmQgdGhlIGlmcmFtZSBpbiB0aGUgJG1vZGFsIG9iamVjdC5cblx0XHRcdCRpZnJhbWUgPSAkbW9kYWwuZmluZCggJ2lmcmFtZScgKTtcblxuXHRcdC8vIE9ubHkgZG8gdGhpcyBpZiB0aGVyZSBhcmUgYW55IGlmcmFtZXMuXG5cdFx0aWYgKCAkaWZyYW1lLmxlbmd0aCApIHtcblxuXHRcdFx0Ly8gR2V0IHRoZSBpZnJhbWUgc3JjIFVSTC5cblx0XHRcdGxldCB1cmwgPSAkaWZyYW1lLmF0dHIoICdzcmMnICk7XG5cblx0XHRcdC8vIFJlbW92aW5nL1JlYWRkaW5nIHRoZSBVUkwgd2lsbCBlZmZlY3RpdmVseSBicmVhayB0aGUgWW91VHViZSBBUEkuXG5cdFx0XHQvLyBTbyBsZXQncyBub3QgZG8gdGhhdCB3aGVuIHRoZSBpZnJhbWUgVVJMIGNvbnRhaW5zIHRoZSBlbmFibGVqc2FwaSBwYXJhbWV0ZXIuXG5cdFx0XHRpZiAoICEgdXJsLmluY2x1ZGVzKCAnZW5hYmxlanNhcGk9MScgKSApIHtcblxuXHRcdFx0XHQvLyBSZW1vdmUgdGhlIHNvdXJjZSBVUkwsIHRoZW4gYWRkIGl0IGJhY2ssIHNvIHRoZSB2aWRlbyBjYW4gYmUgcGxheWVkIGFnYWluIGxhdGVyLlxuXHRcdFx0XHQkaWZyYW1lLmF0dHIoICdzcmMnLCAnJyApLmF0dHIoICdzcmMnLCB1cmwgKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gVXNlIHRoZSBZb3VUdWJlIEFQSSB0byBzdG9wIHRoZSB2aWRlby5cblx0XHRcdFx0JHBsYXllci5zdG9wVmlkZW8oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBGaW5hbGx5LCBoaWRlIHRoZSBtb2RhbC5cblx0XHQkbW9kYWwucmVtb3ZlQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJldmVydCBmb2N1cyBiYWNrIHRvIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlLmZvY3VzKCk7XG5cblx0fTtcblxuXHQvLyBDbG9zZSBpZiBcImVzY1wiIGtleSBpcyBwcmVzc2VkLlxuXHRhcHAuZXNjS2V5Q2xvc2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENsb3NlIGlmIHRoZSB1c2VyIGNsaWNrcyBvdXRzaWRlIG9mIHRoZSBtb2RhbFxuXHRhcHAuY2xvc2VNb2RhbEJ5Q2xpY2sgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHQvLyBJZiB0aGUgcGFyZW50IGNvbnRhaW5lciBpcyBOT1QgdGhlIG1vZGFsIGRpYWxvZyBjb250YWluZXIsIGNsb3NlIHRoZSBtb2RhbFxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnbW9kYWwtZGlhbG9nJyApICkge1xuXHRcdFx0YXBwLmNsb3NlTW9kYWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gVHJhcCB0aGUga2V5Ym9hcmQgaW50byBhIG1vZGFsIHdoZW4gb25lIGlzIGFjdGl2ZS5cblx0YXBwLnRyYXBLZXlib2FyZE1heWJlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gV2Ugb25seSBuZWVkIHRvIGRvIHN0dWZmIHdoZW4gdGhlIG1vZGFsIGlzIG9wZW4gYW5kIHRhYiBpcyBwcmVzc2VkLlxuXHRcdGlmICggOSA9PT0gZXZlbnQud2hpY2ggJiYgMCA8ICQoICcubW9kYWwtb3BlbicgKS5sZW5ndGggKSB7XG5cdFx0XHRsZXQgJGZvY3VzZWQgPSAkKCAnOmZvY3VzJyApLFxuXHRcdFx0XHRmb2N1c0luZGV4ID0gJGZvY3VzYWJsZUNoaWxkcmVuLmluZGV4KCAkZm9jdXNlZCApO1xuXG5cdFx0XHRpZiAoIDAgPT09IGZvY3VzSW5kZXggJiYgZXZlbnQuc2hpZnRLZXkgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQsIGFuZCBzaGlmdCBpcyBoZWxkIHdoZW4gcHJlc3NpbmcgdGFiLCBnbyBiYWNrIHRvIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblsgJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSBlbHNlIGlmICggISBldmVudC5zaGlmdEtleSAmJiBmb2N1c0luZGV4ID09PSAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGlzIGlzIHRoZSBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgbm90IGhlbGQsIGdvIGJhY2sgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSG9vayBpbnRvIFlvdVR1YmUgPGlmcmFtZT4uXG5cdGFwcC5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCAkbW9kYWwgPSAkKCAnZGl2Lm1vZGFsJyApLFxuXHRcdFx0JGlmcmFtZWlkID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICkuYXR0ciggJ2lkJyApO1xuXG5cdFx0JHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoICRpZnJhbWVpZCwge1xuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdCdvblJlYWR5JzogYXBwLm9uUGxheWVyUmVhZHksXG5cdFx0XHRcdCdvblN0YXRlQ2hhbmdlJzogYXBwLm9uUGxheWVyU3RhdGVDaGFuZ2Vcblx0XHRcdH1cblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciByZWFkeS5cblx0YXBwLm9uUGxheWVyUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0fTtcblxuXHQvLyBEbyBzb21ldGhpbmcgb24gcGxheWVyIHN0YXRlIGNoYW5nZS5cblx0YXBwLm9uUGxheWVyU3RhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFNldCBmb2N1cyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgaW5zaWRlIG9mIHRoZSBtb2RhbCB0aGUgcGxheWVyIGlzIGluLlxuXHRcdCQoIGV2ZW50LnRhcmdldC5hICkucGFyZW50cyggJy5tb2RhbCcgKS5maW5kKCAnYSwgOmlucHV0LCBbdGFiaW5kZXhdJyApLmZpcnN0KCkuZm9jdXMoKTtcblx0fTtcblxuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzTW9kYWwgKSApO1xuIiwiLyoqXG4gKiBGaWxlOiBuYXZpZ2F0aW9uLXByaW1hcnkuanNcbiAqXG4gKiBIZWxwZXJzIGZvciB0aGUgcHJpbWFyeSBuYXZpZ2F0aW9uLlxuICovXG53aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0c3ViTWVudUNvbnRhaW5lcjogJCggJy5tYWluLW5hdmlnYXRpb24gLnN1Yi1tZW51JyApLFxuXHRcdFx0c3ViTWVudVBhcmVudEl0ZW06ICQoICcubWFpbi1uYXZpZ2F0aW9uIGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJ2EnICkub24oICdmb2N1c2luIGZvY3Vzb3V0JywgYXBwLnRvZ2dsZUZvY3VzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnN1Yk1lbnVDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJz4gYScgKS5hcHBlbmQoICc8c3BhbiBjbGFzcz1cImNhcmV0LWRvd25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+JyApO1xuXHR9O1xuXG5cdC8vIFRvZ2dsZSB0aGUgZm9jdXMgY2xhc3Mgb24gdGhlIGxpbmsgcGFyZW50LlxuXHRhcHAudG9nZ2xlRm9jdXMgPSBmdW5jdGlvbigpIHtcblx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkudG9nZ2xlQ2xhc3MoICdmb2N1cycgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gKSApO1xuIiwiLyoqXG4gKiBGaWxlOiBvZmYtY2FudmFzLmpzXG4gKlxuICogSGVscCBkZWFsIHdpdGggdGhlIG9mZi1jYW52YXMgbW9iaWxlIG1lbnUuXG4gKi9cbndpbmRvdy53ZHNvZmZDYW52YXMgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdG9mZkNhbnZhc0Nsb3NlOiAkKCAnLm9mZi1jYW52YXMtY2xvc2UnICksXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInICksXG5cdFx0XHRvZmZDYW52YXNPcGVuOiAkKCAnLm9mZi1jYW52YXMtb3BlbicgKSxcblx0XHRcdG9mZkNhbnZhc1NjcmVlbjogJCggJy5vZmYtY2FudmFzLXNjcmVlbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC5lc2NLZXlDbG9zZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDbG9zZS5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4ub24oICdjbGljaycsIGFwcC50b2dnbGVvZmZDYW52YXMgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLm9uKCAnY2xpY2snLCBhcHAuY2xvc2VvZmZDYW52YXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBUbyBzaG93IG9yIG5vdCB0byBzaG93P1xuXHRhcHAudG9nZ2xlb2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoICd0cnVlJyA9PT0gJCggdGhpcyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApICkge1xuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFwcC5vcGVub2ZmQ2FudmFzKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gU2hvdyB0aGF0IGRyYXdlciFcblx0YXBwLm9wZW5vZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIGZhbHNlICk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhhdCBkcmF3ZXIhXG5cdGFwcC5jbG9zZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIHRydWUgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmZvY3VzKCk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgZHJhd2VyIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXG5cdGFwcC5lc2NLZXlDbG9zZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNvZmZDYW52YXMgKSApO1xuIiwiLyoqXG4gKiBGaWxlIHNraXAtbGluay1mb2N1cy1maXguanMuXG4gKlxuICogSGVscHMgd2l0aCBhY2Nlc3NpYmlsaXR5IGZvciBrZXlib2FyZCBvbmx5IHVzZXJzLlxuICpcbiAqIExlYXJuIG1vcmU6IGh0dHBzOi8vZ2l0LmlvL3ZXZHIyXG4gKi9cbiggZnVuY3Rpb24oKSB7XG5cdHZhciBpc1dlYmtpdCA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICd3ZWJraXQnICksXG5cdFx0aXNPcGVyYSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdvcGVyYScgKSxcblx0XHRpc0llID0gLTEgPCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ21zaWUnICk7XG5cblx0aWYgKCAoIGlzV2Via2l0IHx8IGlzT3BlcmEgfHwgaXNJZSApICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGlkID0gbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoIDEgKSxcblx0XHRcdFx0ZWxlbWVudDtcblxuXHRcdFx0aWYgKCAhICggL15bQS16MC05Xy1dKyQvICkudGVzdCggaWQgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cblx0XHRcdGlmICggZWxlbWVudCApIHtcblx0XHRcdFx0aWYgKCAhICggL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pICkudGVzdCggZWxlbWVudC50YWdOYW1lICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50YWJJbmRleCA9IC0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlICk7XG5cdH1cbn0oKSApO1xuIiwiLyoqXG4gKiBNYWtlIHRhYmxlcyByZXNwb25zaXZlIGFnYWluLlxuICpcbiAqIEBhdXRob3IgSGFyaXMgWnVsZmlxYXJcbiAqL1xud2luZG93Lndkc1RhYmxlcyA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3Jcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5nc1xuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0dGFibGU6ICQoICd0YWJsZScgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRGF0YUxhYmVsICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnRhYmxlLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBZGRzIGRhdGEtbGFiZWwgdG8gdGQgYmFzZWQgb24gdGguXG5cdGFwcC5hZGREYXRhTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRjb25zdCB0YWJsZSA9IGFwcC4kYy50YWJsZTtcblx0XHRjb25zdCB0YWJsZUhlYWRlcnMgPSB0YWJsZS5maW5kKCAndGhlYWQgdGgnICk7XG5cdFx0Y29uc3QgdGFibGVSb3cgPSB0YWJsZS5maW5kKCAndGJvZHkgdHInICk7XG5cblx0XHR0YWJsZVJvdy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRkID0gJCggdGhpcyApLmZpbmQoICd0ZCcgKTtcblxuXHRcdFx0dGQuZWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xuXHRcdFx0XHRpZiAoICQoIHRhYmxlSGVhZGVycy5nZXQoIGluZGV4ICkgKSApIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuYXR0ciggJ2RhdGEtbGFiZWwnLCAkKCB0YWJsZUhlYWRlcnMuZ2V0KCBpbmRleCApICkudGV4dCgpICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0Ly8gRW5nYWdlXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1RhYmxlcyApICk7XG4iLCIvKipcbiAqIFZpZGVvIFBsYXliYWNrIFNjcmlwdC5cbiAqL1xud2luZG93LldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHR2aWRlb0J1dHRvbjogJCggJy52aWRlby10b2dnbGUnIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMudmlkZW9CdXR0b24ub24oICdjbGljaycsIGFwcC5kb1RvZ2dsZVBsYXliYWNrICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnZpZGVvQnV0dG9uLmxlbmd0aDtcblx0fTtcblxuXHQvLyBWaWRlbyBQbGF5YmFjay5cblx0YXBwLmRvVG9nZ2xlUGxheWJhY2sgPSBmdW5jdGlvbigpIHtcblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5jb250ZW50LWJsb2NrJyApLnRvZ2dsZUNsYXNzKCAndmlkZW8tdG9nZ2xlZCcgKTtcblxuXHRcdGlmICggJCggdGhpcyApLnBhcmVudHMoICcuY29udGVudC1ibG9jaycgKS5oYXNDbGFzcyggJ3ZpZGVvLXRvZ2dsZWQnICkgKSB7XG5cdFx0XHQkKCB0aGlzICkuc2libGluZ3MoICcudmlkZW8tYmFja2dyb3VuZCcgKS50cmlnZ2VyKCAncGF1c2UnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoIHRoaXMgKS5zaWJsaW5ncyggJy52aWRlby1iYWNrZ3JvdW5kJyApLnRyaWdnZXIoICdwbGF5JyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuV0RTVmlkZW9CYWNrZ3JvdW5kT2JqZWN0ICkgKTtcbiIsIi8qKlxuICogRmlsZSB3aW5kb3ctcmVhZHkuanNcbiAqXG4gKiBBZGQgYSBcInJlYWR5XCIgY2xhc3MgdG8gPGJvZHk+IHdoZW4gd2luZG93IGlzIHJlYWR5LlxuICovXG53aW5kb3cud2RzV2luZG93UmVhZHkgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdH07XG5cblx0Ly8gQ2FjaGUgZG9jdW1lbnQgZWxlbWVudHMuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdCd3aW5kb3cnOiAkKCB3aW5kb3cgKSxcblx0XHRcdCdib2R5JzogJCggZG9jdW1lbnQuYm9keSApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5sb2FkKCBhcHAuYWRkQm9keUNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWRkIGEgY2xhc3MgdG8gPGJvZHk+LlxuXHRhcHAuYWRkQm9keUNsYXNzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkuYWRkQ2xhc3MoICdyZWFkeScgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1dpbmRvd1JlYWR5ICkgKTtcbiJdfQ==
