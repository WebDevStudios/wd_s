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

/* global wdsi18n: true */
/**
 * File carousel.js
 *
 * Deal with the Slick carousel.
 */
window.wdsCarousel = {};
(function (window, $, app) {

	var carouselOptions = {
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
		dots: true,
		focusOnSelect: true,
		waitForAnimate: true
	};

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

	// Append a pause button to the carousel.
	app.addPausebutton = function () {
		var $pauseButton = $('<button>', { 'class': 'slick-pause', 'type': 'button' }).text('Pause'),
			$carousel = $(this);

		$pauseButton.on('click', function () {

			if ($carousel.hasClass('paused')) {
				$carousel.slick('play').removeClass('paused');
				$pauseButton.text(wdsi18n.pauseButtonTextPause);
				wp.a11y.speak(wdsi18n.pauseButtonSpeakResumed);
			} else {
				$carousel.slick('pause').addClass('paused');
				$pauseButton.text(wdsi18n.pauseButtonTextPlay);
				wp.a11y.speak(wdsi18n.pauseButtonSpeakPaused);
			}
		});

		$pauseButton.appendTo($carousel);
	};

	// Bind click events to buttons after Slick initializes.
	app.bindButtonClickEvents = function () {
		var $buttons = $(this).find('.slick-arrow');

		$buttons.on('click', app.notifySlideChange);
	};

	// Use wp.a11y.speak to notify screen readers of active slides.
	app.notifySlideChange = function () {
		var $slick = $(this).parents('.slick-slider').slick('getSlick');

		// currentSlide is 0 based, so we need to add 1 to make it human.
		var currentSlide = $slick.currentSlide + 1;

		// String replace the things.
		wp.a11y.speak(wdsi18n.activeSlideButton.replace('%1$s', currentSlide).replace('%2$s', $slick.slideCount));
	};

	// Kick off Slick.
	app.doSlick = function () {
		app.$c.theCarousel.on('init', app.playBackgroundVideos);
		app.$c.theCarousel.on('init', app.bindButtonClickEvents);

		// We only need a pause button when autoplay is enabled above.
		if (carouselOptions.autoplay) {
			app.$c.theCarousel.on('init', app.addPausebutton);
		}

		app.$c.theCarousel.slick(carouselOptions);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyIsImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ0YWJsZS5qcyIsInZpZGVvLmpzIiwid2luZG93LXJlYWR5LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImFjY29yZGlvbkJsb2NrVG9nZ2xlIiwiJCIsImFwcCIsImluaXQiLCJjYWNoZSIsIm1lZXRzUmVxdWlyZW1lbnRzIiwiYmluZEV2ZW50cyIsIiRjIiwiaHRtbCIsImFjY29yZGlvbiIsIml0ZW1zIiwiaGVhZGVycyIsImNvbnRlbnRzIiwiYnV0dG9uIiwiYW5jaG9ySUQiLCJsb2NhdGlvbiIsImhhc2giLCJvbiIsInRvZ2dsZUFjY29yZGlvbiIsIm9wZW5IYXNoQWNjb3JkaW9uIiwibGVuZ3RoIiwicGFyZW50cyIsInRvZ2dsZUNsYXNzIiwiaXNFeHBhbmRlZCIsImhhc0NsYXNzIiwiZmluZCIsImF0dHIiLCJub3QiLCJyZW1vdmVDbGFzcyIsInNlbGVjdG9yIiwidHJpZ2dlciIsImFkbWluQmFySGVpZ2h0IiwiaGVpZ2h0IiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsImpRdWVyeSIsIndkc0Nhcm91c2VsIiwiY2Fyb3VzZWxPcHRpb25zIiwiYXV0b3BsYXkiLCJhdXRvcGxheVNwZWVkIiwiYXJyb3dzIiwiZG90cyIsImZvY3VzT25TZWxlY3QiLCJ3YWl0Rm9yQW5pbWF0ZSIsInRoZUNhcm91c2VsIiwiZG9TbGljayIsImRvRmlyc3RBbmltYXRpb24iLCJmaXJzdFNsaWRlIiwiZmlyc3RTbGlkZUNvbnRlbnQiLCJmaXJzdEFuaW1hdGlvbiIsImFkZENsYXNzIiwiZG9BbmltYXRpb24iLCJzbGlkZXMiLCJhY3RpdmVTbGlkZSIsImFjdGl2ZUNvbnRlbnQiLCJhbmltYXRpb25DbGFzcyIsInVuZGVmaW5lZCIsInNwbGl0QW5pbWF0aW9uIiwic3BsaXQiLCJhbmltYXRpb25UcmlnZ2VyIiwiZWFjaCIsInNsaWRlQ29udGVudCIsImxhc3RDbGFzcyIsInBvcCIsInBsYXlCYWNrZ3JvdW5kVmlkZW9zIiwicGxheSIsImFkZFBhdXNlYnV0dG9uIiwiJHBhdXNlQnV0dG9uIiwidGV4dCIsIiRjYXJvdXNlbCIsInNsaWNrIiwid2RzaTE4biIsInBhdXNlQnV0dG9uVGV4dFBhdXNlIiwid3AiLCJhMTF5Iiwic3BlYWsiLCJwYXVzZUJ1dHRvblNwZWFrUmVzdW1lZCIsInBhdXNlQnV0dG9uVGV4dFBsYXkiLCJwYXVzZUJ1dHRvblNwZWFrUGF1c2VkIiwiYXBwZW5kVG8iLCJiaW5kQnV0dG9uQ2xpY2tFdmVudHMiLCIkYnV0dG9ucyIsIm5vdGlmeVNsaWRlQ2hhbmdlIiwiJHNsaWNrIiwiY3VycmVudFNsaWRlIiwiYWN0aXZlU2xpZGVCdXR0b24iLCJyZXBsYWNlIiwic2xpZGVDb3VudCIsIlNob3dIaWRlU2VhcmNoRm9ybSIsImJvZHkiLCJoZWFkZXJTZWFyY2hUb2dnbGUiLCJoZWFkZXJTZWFyY2hGb3JtIiwic2hvd0hpZGVTZWFyY2hGb3JtIiwiaGlkZVNlYXJjaEZvcm0iLCJzZWFyY2hJc09wZW4iLCJ0b2dnbGVTZWFyY2hGb3JtQXJpYUxhYmVsIiwidG9nZ2xlU2VhcmNoVG9nZ2xlQXJpYUxhYmVsIiwiZXZlbnQiLCJ0YXJnZXQiLCJkb2N1bWVudCIsImNsYXNzTmFtZSIsIndkc01vYmlsZU1lbnUiLCJzdWJNZW51Q29udGFpbmVyIiwic3ViU3ViTWVudUNvbnRhaW5lciIsInN1Yk1lbnVQYXJlbnRJdGVtIiwib2ZmQ2FudmFzQ29udGFpbmVyIiwiYWRkRG93bkFycm93IiwidG9nZ2xlU3VibWVudSIsInJlc2V0U3ViTWVudSIsImZvcmNlQ2xvc2VTdWJtZW51cyIsImlzIiwic2xpZGVPdXRTdWJNZW51cyIsImVsIiwicGFyZW50IiwiYWZ0ZXIiLCJlIiwic3ViTWVudSIsImNoaWxkcmVuIiwiJHRhcmdldCIsIm9wZW5TdWJtZW51IiwiZm9jdXMiLCJjc3MiLCJ1bmJpbmQiLCJiaW5kIiwicHJldmVudERlZmF1bHQiLCJ3ZHNNb2RhbCIsIiRtb2RhbFRvZ2dsZSIsIiRmb2N1c2FibGVDaGlsZHJlbiIsIiRwbGF5ZXIiLCIkdGFnIiwiY3JlYXRlRWxlbWVudCIsIiRmaXJzdFNjcmlwdFRhZyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiWVQiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwib3Blbk1vZGFsIiwiY2xvc2VNb2RhbCIsImVzY0tleUNsb3NlIiwiY2xvc2VNb2RhbEJ5Q2xpY2siLCJ0cmFwS2V5Ym9hcmRNYXliZSIsIiRtb2RhbCIsImRhdGEiLCIkaWZyYW1lIiwidXJsIiwiaW5jbHVkZXMiLCJzdG9wVmlkZW8iLCJrZXlDb2RlIiwid2hpY2giLCIkZm9jdXNlZCIsImZvY3VzSW5kZXgiLCJpbmRleCIsInNoaWZ0S2V5Iiwib25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkiLCIkaWZyYW1laWQiLCJQbGF5ZXIiLCJldmVudHMiLCJvblBsYXllclJlYWR5Iiwib25QbGF5ZXJTdGF0ZUNoYW5nZSIsImEiLCJmaXJzdCIsIndkc1ByaW1hcnlOYXZpZ2F0aW9uIiwidG9nZ2xlRm9jdXMiLCJhcHBlbmQiLCJ3ZHNvZmZDYW52YXMiLCJvZmZDYW52YXNDbG9zZSIsIm9mZkNhbnZhc09wZW4iLCJvZmZDYW52YXNTY3JlZW4iLCJjbG9zZW9mZkNhbnZhcyIsInRvZ2dsZW9mZkNhbnZhcyIsIm9wZW5vZmZDYW52YXMiLCJpc1dlYmtpdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiaW5kZXhPZiIsImlzT3BlcmEiLCJpc0llIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiaWQiLCJzdWJzdHJpbmciLCJlbGVtZW50IiwidGVzdCIsInRhZ05hbWUiLCJ0YWJJbmRleCIsIndkc1RhYmxlcyIsInRhYmxlIiwiYWRkRGF0YUxhYmVsIiwidGFibGVIZWFkZXJzIiwidGFibGVSb3ciLCJ0ZCIsImdldCIsIldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCIsInZpZGVvQnV0dG9uIiwiZG9Ub2dnbGVQbGF5YmFjayIsInNpYmxpbmdzIiwid2RzV2luZG93UmVhZHkiLCJsb2FkIiwiYWRkQm9keUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBQSxPQUFPQyxvQkFBUCxHQUE4QixFQUE5QjtBQUNFLFdBQVVELE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUEsTUFBS0YsSUFBSUcsaUJBQUosRUFBTCxFQUErQjtBQUM5QkgsT0FBSUksVUFBSjtBQUNBO0FBQ0QsRUFORDs7QUFRQTtBQUNBSixLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSUssRUFBSixHQUFTO0FBQ1JSLFdBQVFFLEVBQUdGLE1BQUgsQ0FEQTtBQUVSUyxTQUFNUCxFQUFHLE1BQUgsQ0FGRTtBQUdSUSxjQUFXUixFQUFHLFlBQUgsQ0FISDtBQUlSUyxVQUFPVCxFQUFHLGlCQUFILENBSkM7QUFLUlUsWUFBU1YsRUFBRyx3QkFBSCxDQUxEO0FBTVJXLGFBQVVYLEVBQUcseUJBQUgsQ0FORjtBQU9SWSxXQUFRWixFQUFHLHdCQUFILENBUEE7QUFRUmEsYUFBVWIsRUFBR0YsT0FBT2dCLFFBQVAsQ0FBZ0JDLElBQW5CO0FBUkYsR0FBVDtBQVVBLEVBWEQ7O0FBYUE7QUFDQWQsS0FBSUksVUFBSixHQUFpQixZQUFXO0FBQzNCSixNQUFJSyxFQUFKLENBQU9JLE9BQVAsQ0FBZU0sRUFBZixDQUFtQixrQkFBbkIsRUFBdUNmLElBQUlnQixlQUEzQztBQUNBaEIsTUFBSUssRUFBSixDQUFPTSxNQUFQLENBQWNJLEVBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDZixJQUFJZ0IsZUFBMUM7QUFDQWhCLE1BQUlLLEVBQUosQ0FBT1IsTUFBUCxDQUFja0IsRUFBZCxDQUFrQixNQUFsQixFQUEwQmYsSUFBSWlCLGlCQUE5QjtBQUNBLEVBSkQ7O0FBTUE7QUFDQWpCLEtBQUlHLGlCQUFKLEdBQXdCLFlBQVc7QUFDbEMsU0FBT0gsSUFBSUssRUFBSixDQUFPRSxTQUFQLENBQWlCVyxNQUF4QjtBQUNBLEVBRkQ7O0FBSUFsQixLQUFJZ0IsZUFBSixHQUFzQixZQUFXOztBQUVoQztBQUNBakIsSUFBRyxJQUFILEVBQVVvQixPQUFWLENBQW1CLGlCQUFuQixFQUF1Q0MsV0FBdkMsQ0FBb0QsTUFBcEQ7O0FBRUE7QUFDQSxNQUFJQyxhQUFhdEIsRUFBRyxJQUFILEVBQVVvQixPQUFWLENBQW1CLGlCQUFuQixFQUF1Q0csUUFBdkMsQ0FBaUQsTUFBakQsQ0FBakI7O0FBRUE7QUFDQXZCLElBQUcsSUFBSCxFQUFVb0IsT0FBVixDQUFtQixpQkFBbkIsRUFBdUNJLElBQXZDLENBQTZDLHdCQUE3QyxFQUF3RUMsSUFBeEUsQ0FBOEUsZUFBOUUsRUFBK0ZILGFBQWEsTUFBYixHQUFzQixPQUFySDs7QUFFQTtBQUNBdEIsSUFBRyxJQUFILEVBQVVvQixPQUFWLENBQW1CLGtCQUFuQixFQUF3Q0ksSUFBeEMsQ0FBOEMseUJBQTlDLEVBQTBFRSxHQUExRSxDQUErRTFCLEVBQUcsSUFBSCxFQUFVb0IsT0FBVixDQUFtQixpQkFBbkIsQ0FBL0UsRUFBd0hLLElBQXhILENBQThILGFBQTlILEVBQTZJLE1BQTdJOztBQUVBO0FBQ0F6QixJQUFHLElBQUgsRUFBVW9CLE9BQVYsQ0FBbUIsaUJBQW5CLEVBQXVDSSxJQUF2QyxDQUE2Qyx5QkFBN0MsRUFBeUVDLElBQXpFLENBQStFLGFBQS9FLEVBQThGSCxhQUFhLE9BQWIsR0FBdUIsTUFBckg7O0FBRUE7QUFDQXRCLElBQUcsSUFBSCxFQUFVb0IsT0FBVixDQUFtQixrQkFBbkIsRUFBd0NJLElBQXhDLENBQThDLGlCQUE5QyxFQUFrRUUsR0FBbEUsQ0FBdUUxQixFQUFHLElBQUgsRUFBVW9CLE9BQVYsQ0FBbUIsaUJBQW5CLENBQXZFLEVBQWdITyxXQUFoSCxDQUE2SCxNQUE3SDtBQUNBM0IsSUFBRyxJQUFILEVBQVVvQixPQUFWLENBQW1CLGtCQUFuQixFQUF3Q0ksSUFBeEMsQ0FBOEMsd0JBQTlDLEVBQXlFRSxHQUF6RSxDQUE4RTFCLEVBQUcsSUFBSCxDQUE5RSxFQUEwRnlCLElBQTFGLENBQWdHLGVBQWhHLEVBQWlILE9BQWpIOztBQUVBLFNBQU8sS0FBUDtBQUNBLEVBdEJEOztBQXdCQXhCLEtBQUlpQixpQkFBSixHQUF3QixZQUFXOztBQUVsQyxNQUFLLENBQUVqQixJQUFJSyxFQUFKLENBQU9PLFFBQVAsQ0FBZ0JlLFFBQXZCLEVBQWtDO0FBQ2pDO0FBQ0E7O0FBRUQ7QUFDQTNCLE1BQUlLLEVBQUosQ0FBT08sUUFBUCxDQUFnQk8sT0FBaEIsQ0FBeUIsaUJBQXpCLEVBQTZDSSxJQUE3QyxDQUFtRCx3QkFBbkQsRUFBOEVLLE9BQTlFLENBQXVGLE9BQXZGOztBQUVBO0FBQ0EsTUFBTUMsaUJBQWlCOUIsRUFBRyxhQUFILEVBQW1CbUIsTUFBbkIsR0FBNEJuQixFQUFHLGFBQUgsRUFBbUIrQixNQUFuQixFQUE1QixHQUEwRCxDQUFqRjs7QUFFQTtBQUNBOUIsTUFBSUssRUFBSixDQUFPQyxJQUFQLENBQVl5QixPQUFaLENBQXFCO0FBQ3BCQyxjQUFXaEMsSUFBSUssRUFBSixDQUFPTyxRQUFQLENBQWdCcUIsTUFBaEIsR0FBeUJDLEdBQXpCLEdBQStCTDtBQUR0QixHQUFyQixFQUVHLE1BRkg7QUFHQSxFQWhCRDs7QUFrQkE7QUFDQTdCLEtBQUlDLElBQUo7QUFFQSxDQWxGQyxFQWtGRUosTUFsRkYsRUFrRlVzQyxNQWxGVixFQWtGa0J0QyxPQUFPQyxvQkFsRnpCLENBQUY7OztBQ05BO0FBQ0E7Ozs7O0FBS0FELE9BQU91QyxXQUFQLEdBQXFCLEVBQXJCO0FBQ0UsV0FBVXZDLE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUIsS0FBTXFDLGtCQUFrQjtBQUN2QkMsWUFBVSxJQURhO0FBRXZCQyxpQkFBZSxJQUZRO0FBR3ZCQyxVQUFRLElBSGU7QUFJdkJDLFFBQU0sSUFKaUI7QUFLdkJDLGlCQUFlLElBTFE7QUFNdkJDLGtCQUFnQjtBQU5PLEVBQXhCOztBQVNBO0FBQ0EzQyxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjs7QUFFQSxNQUFLRixJQUFJRyxpQkFBSixFQUFMLEVBQStCO0FBQzlCSCxPQUFJSSxVQUFKO0FBQ0E7QUFDRCxFQU5EOztBQVFBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUlIsV0FBUUUsRUFBR0YsTUFBSCxDQURBO0FBRVIrQyxnQkFBYTdDLEVBQUcsaUJBQUg7QUFGTCxHQUFUO0FBSUEsRUFMRDs7QUFPQTtBQUNBQyxLQUFJSSxVQUFKLEdBQWlCLFlBQVc7QUFDM0JKLE1BQUlLLEVBQUosQ0FBT1IsTUFBUCxDQUFja0IsRUFBZCxDQUFrQixNQUFsQixFQUEwQmYsSUFBSTZDLE9BQTlCO0FBQ0E3QyxNQUFJSyxFQUFKLENBQU9SLE1BQVAsQ0FBY2tCLEVBQWQsQ0FBa0IsTUFBbEIsRUFBMEJmLElBQUk4QyxnQkFBOUI7QUFDQSxFQUhEOztBQUtBO0FBQ0E5QyxLQUFJRyxpQkFBSixHQUF3QixZQUFXO0FBQ2xDLFNBQU9ILElBQUlLLEVBQUosQ0FBT3VDLFdBQVAsQ0FBbUIxQixNQUExQjtBQUNBLEVBRkQ7O0FBSUE7QUFDQWxCLEtBQUk4QyxnQkFBSixHQUF1QixZQUFXOztBQUVqQztBQUNBLE1BQUlDLGFBQWEvQyxJQUFJSyxFQUFKLENBQU91QyxXQUFQLENBQW1CckIsSUFBbkIsQ0FBeUIsc0JBQXpCLENBQWpCO0FBQUEsTUFDQ3lCLG9CQUFvQkQsV0FBV3hCLElBQVgsQ0FBaUIsZ0JBQWpCLENBRHJCO0FBQUEsTUFFQzBCLGlCQUFpQkQsa0JBQWtCeEIsSUFBbEIsQ0FBd0IsZ0JBQXhCLENBRmxCOztBQUlBO0FBQ0F3QixvQkFBa0JFLFFBQWxCLENBQTRCRCxjQUE1QjtBQUNBLEVBVEQ7O0FBV0E7QUFDQWpELEtBQUltRCxXQUFKLEdBQWtCLFlBQVc7QUFDNUIsTUFBSUMsU0FBU3JELEVBQUcsSUFBSCxFQUFVd0IsSUFBVixDQUFnQixRQUFoQixDQUFiO0FBQUEsTUFDQzhCLGNBQWN0RCxFQUFHLElBQUgsRUFBVXdCLElBQVYsQ0FBZ0IsZ0JBQWhCLENBRGY7QUFBQSxNQUVDK0IsZ0JBQWdCRCxZQUFZOUIsSUFBWixDQUFrQixnQkFBbEIsQ0FGakI7OztBQUlDO0FBQ0FnQyxtQkFBaUJELGNBQWM5QixJQUFkLENBQW9CLGdCQUFwQixDQUxsQjs7QUFPQyxNQUFLZ0MsY0FBY0QsY0FBbkIsRUFBb0M7QUFDbkM7QUFDQTs7QUFFRCxNQUFJRSxpQkFBaUJGLGVBQWVHLEtBQWYsQ0FBc0IsR0FBdEIsQ0FBckI7OztBQUVBO0FBQ0FDLHFCQUFtQkYsZUFBZSxDQUFmLENBSG5COztBQUtEO0FBQ0FMLFNBQU9RLElBQVAsQ0FBYSxZQUFXO0FBQ3ZCLE9BQUlDLGVBQWU5RCxFQUFHLElBQUgsRUFBVXdCLElBQVYsQ0FBZ0IsZ0JBQWhCLENBQW5COztBQUVBO0FBQ0EsT0FBS3NDLGFBQWF2QyxRQUFiLENBQXVCLFVBQXZCLENBQUwsRUFBMkM7O0FBRTFDO0FBQ0EsUUFBSXdDLFlBQVlELGFBQ2RyQyxJQURjLENBQ1IsT0FEUSxFQUVka0MsS0FGYyxDQUVQLEdBRk8sRUFHZEssR0FIYyxFQUFoQjs7QUFLQTtBQUNBRixpQkFBYW5DLFdBQWIsQ0FBMEJvQyxTQUExQixFQUFzQ3BDLFdBQXRDLENBQW1EaUMsZ0JBQW5EO0FBQ0E7QUFDRCxHQWZEOztBQWlCQTtBQUNBTCxnQkFBY0osUUFBZCxDQUF3QkssY0FBeEI7QUFDQSxFQXJDRDs7QUF1Q0E7QUFDQXZELEtBQUlnRSxvQkFBSixHQUEyQixZQUFXOztBQUVyQztBQUNBakUsSUFBRyxPQUFILEVBQWE2RCxJQUFiLENBQW1CLFlBQVc7O0FBRTdCO0FBQ0EsUUFBS0ssSUFBTDtBQUNBLEdBSkQ7QUFLQSxFQVJEOztBQVVBO0FBQ0FqRSxLQUFJa0UsY0FBSixHQUFxQixZQUFXO0FBQy9CLE1BQU1DLGVBQWVwRSxFQUFHLFVBQUgsRUFBZSxFQUFFLFNBQVMsYUFBWCxFQUEwQixRQUFRLFFBQWxDLEVBQWYsRUFBOERxRSxJQUE5RCxDQUFvRSxPQUFwRSxDQUFyQjtBQUFBLE1BQ0NDLFlBQVl0RSxFQUFHLElBQUgsQ0FEYjs7QUFHQW9FLGVBQWFwRCxFQUFiLENBQWlCLE9BQWpCLEVBQTBCLFlBQVc7O0FBRXBDLE9BQU9zRCxTQUFGLENBQWMvQyxRQUFkLENBQXdCLFFBQXhCLENBQUwsRUFBMEM7QUFDekMrQyxjQUFVQyxLQUFWLENBQWlCLE1BQWpCLEVBQTBCNUMsV0FBMUIsQ0FBdUMsUUFBdkM7QUFDQXlDLGlCQUFhQyxJQUFiLENBQW1CRyxRQUFRQyxvQkFBM0I7QUFDQUMsT0FBR0MsSUFBSCxDQUFRQyxLQUFSLENBQWVKLFFBQVFLLHVCQUF2QjtBQUNBLElBSkQsTUFJTztBQUNOUCxjQUFVQyxLQUFWLENBQWlCLE9BQWpCLEVBQTJCcEIsUUFBM0IsQ0FBcUMsUUFBckM7QUFDQWlCLGlCQUFhQyxJQUFiLENBQW1CRyxRQUFRTSxtQkFBM0I7QUFDQUosT0FBR0MsSUFBSCxDQUFRQyxLQUFSLENBQWVKLFFBQVFPLHNCQUF2QjtBQUNBO0FBRUQsR0FaRDs7QUFjQVgsZUFBYVksUUFBYixDQUF1QlYsU0FBdkI7QUFDQSxFQW5CRDs7QUFxQkE7QUFDQXJFLEtBQUlnRixxQkFBSixHQUE0QixZQUFXO0FBQ3RDLE1BQU1DLFdBQVdsRixFQUFHLElBQUgsRUFBVXdCLElBQVYsQ0FBZ0IsY0FBaEIsQ0FBakI7O0FBRUEwRCxXQUFTbEUsRUFBVCxDQUFhLE9BQWIsRUFBc0JmLElBQUlrRixpQkFBMUI7QUFDQSxFQUpEOztBQU1BO0FBQ0FsRixLQUFJa0YsaUJBQUosR0FBd0IsWUFBVztBQUNsQyxNQUFNQyxTQUFTcEYsRUFBRyxJQUFILEVBQVVvQixPQUFWLENBQW1CLGVBQW5CLEVBQXFDbUQsS0FBckMsQ0FBNEMsVUFBNUMsQ0FBZjs7QUFFQTtBQUNBLE1BQUljLGVBQWVELE9BQU9DLFlBQVAsR0FBc0IsQ0FBekM7O0FBRUE7QUFDQVgsS0FBR0MsSUFBSCxDQUFRQyxLQUFSLENBQWVKLFFBQVFjLGlCQUFSLENBQTBCQyxPQUExQixDQUFtQyxNQUFuQyxFQUEyQ0YsWUFBM0MsRUFBMERFLE9BQTFELENBQW1FLE1BQW5FLEVBQTJFSCxPQUFPSSxVQUFsRixDQUFmO0FBQ0EsRUFSRDs7QUFVQTtBQUNBdkYsS0FBSTZDLE9BQUosR0FBYyxZQUFXO0FBQ3hCN0MsTUFBSUssRUFBSixDQUFPdUMsV0FBUCxDQUFtQjdCLEVBQW5CLENBQXVCLE1BQXZCLEVBQStCZixJQUFJZ0Usb0JBQW5DO0FBQ0FoRSxNQUFJSyxFQUFKLENBQU91QyxXQUFQLENBQW1CN0IsRUFBbkIsQ0FBdUIsTUFBdkIsRUFBK0JmLElBQUlnRixxQkFBbkM7O0FBRUE7QUFDQSxNQUFLM0MsZ0JBQWdCQyxRQUFyQixFQUFnQztBQUMvQnRDLE9BQUlLLEVBQUosQ0FBT3VDLFdBQVAsQ0FBbUI3QixFQUFuQixDQUF1QixNQUF2QixFQUErQmYsSUFBSWtFLGNBQW5DO0FBQ0E7O0FBRURsRSxNQUFJSyxFQUFKLENBQU91QyxXQUFQLENBQW1CMEIsS0FBbkIsQ0FBMEJqQyxlQUExQjs7QUFFQXJDLE1BQUlLLEVBQUosQ0FBT3VDLFdBQVAsQ0FBbUI3QixFQUFuQixDQUF1QixhQUF2QixFQUFzQ2YsSUFBSW1ELFdBQTFDO0FBQ0EsRUFaRDs7QUFjQTtBQUNBcEQsR0FBR0MsSUFBSUMsSUFBUDtBQUNBLENBL0pDLEVBK0pFSixNQS9KRixFQStKVXNDLE1BL0pWLEVBK0prQnRDLE9BQU91QyxXQS9KekIsQ0FBRjs7O0FDUEE7Ozs7O0FBS0F2QyxPQUFPMkYsa0JBQVAsR0FBNEIsRUFBNUI7QUFDRSxXQUFVM0YsTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUU1QjtBQUNBQSxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjs7QUFFQSxNQUFLRixJQUFJRyxpQkFBSixFQUFMLEVBQStCO0FBQzlCSCxPQUFJSSxVQUFKO0FBQ0E7QUFDRCxFQU5EOztBQVFBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUlIsV0FBUUUsRUFBR0YsTUFBSCxDQURBO0FBRVI0RixTQUFNMUYsRUFBRyxNQUFILENBRkU7QUFHUjJGLHVCQUFvQjNGLEVBQUcsaUNBQUgsQ0FIWjtBQUlSNEYscUJBQWtCNUYsRUFBRyxxQ0FBSDtBQUpWLEdBQVQ7QUFNQSxFQVBEOztBQVNBO0FBQ0FDLEtBQUlJLFVBQUosR0FBaUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPcUYsa0JBQVAsQ0FBMEIzRSxFQUExQixDQUE4Qix3QkFBOUIsRUFBd0RmLElBQUk0RixrQkFBNUQ7QUFDQTVGLE1BQUlLLEVBQUosQ0FBT29GLElBQVAsQ0FBWTFFLEVBQVosQ0FBZ0Isd0JBQWhCLEVBQTBDZixJQUFJNkYsY0FBOUM7QUFDQSxFQUhEOztBQUtBO0FBQ0E3RixLQUFJRyxpQkFBSixHQUF3QixZQUFXO0FBQ2xDLFNBQU9ILElBQUlLLEVBQUosQ0FBT3FGLGtCQUFQLENBQTBCeEUsTUFBakM7QUFDQSxFQUZEOztBQUlBO0FBQ0FsQixLQUFJOEYsWUFBSixHQUFtQixZQUFXOztBQUU3QixNQUFLOUYsSUFBSUssRUFBSixDQUFPb0YsSUFBUCxDQUFZbkUsUUFBWixDQUFzQixxQkFBdEIsQ0FBTCxFQUFxRDtBQUNwRCxVQUFPLElBQVA7QUFDQTs7QUFFRCxTQUFPLEtBQVA7QUFDQSxFQVBEOztBQVNBO0FBQ0F0QixLQUFJNEYsa0JBQUosR0FBeUIsWUFBVztBQUNuQzVGLE1BQUlLLEVBQUosQ0FBT29GLElBQVAsQ0FBWXJFLFdBQVosQ0FBeUIscUJBQXpCOztBQUVBcEIsTUFBSStGLHlCQUFKO0FBQ0EvRixNQUFJZ0csMkJBQUo7O0FBRUEsU0FBTyxLQUFQO0FBQ0EsRUFQRDs7QUFTQTtBQUNBaEcsS0FBSTZGLGNBQUosR0FBcUIsVUFBVUksS0FBVixFQUFrQjs7QUFFdEMsTUFBSyxDQUFFbEcsRUFBR2tHLE1BQU1DLE1BQVQsRUFBa0IvRSxPQUFsQixDQUEyQixLQUEzQixFQUFtQ0csUUFBbkMsQ0FBNkMsb0JBQTdDLENBQVAsRUFBNkU7QUFDNUV0QixPQUFJSyxFQUFKLENBQU9vRixJQUFQLENBQVkvRCxXQUFaLENBQXlCLHFCQUF6QjtBQUNBMUIsT0FBSStGLHlCQUFKO0FBQ0EvRixPQUFJZ0csMkJBQUo7QUFDQTtBQUNELEVBUEQ7O0FBU0E7QUFDQWhHLEtBQUkrRix5QkFBSixHQUFnQyxZQUFXO0FBQzFDL0YsTUFBSUssRUFBSixDQUFPc0YsZ0JBQVAsQ0FBd0JuRSxJQUF4QixDQUE4QixhQUE5QixFQUE2Q3hCLElBQUk4RixZQUFKLEtBQXFCLE9BQXJCLEdBQStCLE1BQTVFO0FBQ0EsRUFGRDs7QUFJQTtBQUNBOUYsS0FBSWdHLDJCQUFKLEdBQWtDLFlBQVc7QUFDNUNoRyxNQUFJSyxFQUFKLENBQU9xRixrQkFBUCxDQUEwQmxFLElBQTFCLENBQWdDLGVBQWhDLEVBQWlEeEIsSUFBSThGLFlBQUosS0FBcUIsTUFBckIsR0FBOEIsT0FBL0U7QUFDQSxFQUZEOztBQUlBO0FBQ0EvRixHQUFHQyxJQUFJQyxJQUFQO0FBRUEsQ0EzRUMsRUEyRUVKLE1BM0VGLEVBMkVVc0MsTUEzRVYsRUEyRWtCdEMsT0FBTzJGLGtCQTNFekIsQ0FBRjs7O0FDTkE7Ozs7O0FBS0FXLFNBQVNWLElBQVQsQ0FBY1csU0FBZCxHQUEwQkQsU0FBU1YsSUFBVCxDQUFjVyxTQUFkLENBQXdCZCxPQUF4QixDQUFpQyxPQUFqQyxFQUEwQyxJQUExQyxDQUExQjs7O0FDTEE7Ozs7O0FBS0F6RixPQUFPd0csYUFBUCxHQUF1QixFQUF2QjtBQUNFLFdBQVV4RyxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKOztBQUVBLE1BQUtGLElBQUlHLGlCQUFKLEVBQUwsRUFBK0I7QUFDOUJILE9BQUlJLFVBQUo7QUFDQTtBQUNELEVBTkQ7O0FBUUE7QUFDQUosS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlLLEVBQUosR0FBUztBQUNSb0YsU0FBTTFGLEVBQUcsTUFBSCxDQURFO0FBRVJGLFdBQVFFLEVBQUdGLE1BQUgsQ0FGQTtBQUdSeUcscUJBQWtCdkcsRUFBRyx1REFBSCxDQUhWO0FBSVJ3Ryx3QkFBcUJ4RyxFQUFHLGtDQUFILENBSmI7QUFLUnlHLHNCQUFtQnpHLEVBQUcsdUZBQUgsQ0FMWDtBQU1SMEcsdUJBQW9CMUcsRUFBRyx1QkFBSDtBQU5aLEdBQVQ7QUFRQSxFQVREOztBQVdBO0FBQ0FDLEtBQUlJLFVBQUosR0FBaUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPUixNQUFQLENBQWNrQixFQUFkLENBQWtCLE1BQWxCLEVBQTBCZixJQUFJMEcsWUFBOUI7QUFDQTFHLE1BQUlLLEVBQUosQ0FBT21HLGlCQUFQLENBQXlCekYsRUFBekIsQ0FBNkIsT0FBN0IsRUFBc0NmLElBQUkyRyxhQUExQztBQUNBM0csTUFBSUssRUFBSixDQUFPbUcsaUJBQVAsQ0FBeUJ6RixFQUF6QixDQUE2QixlQUE3QixFQUE4Q2YsSUFBSTRHLFlBQWxEO0FBQ0E1RyxNQUFJSyxFQUFKLENBQU9vRyxrQkFBUCxDQUEwQjFGLEVBQTFCLENBQThCLGVBQTlCLEVBQStDZixJQUFJNkcsa0JBQW5EO0FBQ0EsRUFMRDs7QUFPQTtBQUNBN0csS0FBSUcsaUJBQUosR0FBd0IsWUFBVztBQUNsQyxTQUFPSCxJQUFJSyxFQUFKLENBQU9pRyxnQkFBUCxDQUF3QnBGLE1BQS9CO0FBQ0EsRUFGRDs7QUFJQTtBQUNBbEIsS0FBSTRHLFlBQUosR0FBbUIsWUFBVzs7QUFFN0I7QUFDQTtBQUNBLE1BQUs3RyxFQUFHLElBQUgsRUFBVStHLEVBQVYsQ0FBYywyQkFBZCxLQUErQyxDQUFFL0csRUFBRyxJQUFILEVBQVV1QixRQUFWLENBQW9CLFlBQXBCLENBQXRELEVBQTJGO0FBQzFGdkIsS0FBRyxJQUFILEVBQVV3QixJQUFWLENBQWdCLGFBQWhCLEVBQWdDRyxXQUFoQyxDQUE2Qyx5QkFBN0M7QUFDQTtBQUVELEVBUkQ7O0FBVUE7QUFDQTFCLEtBQUkrRyxnQkFBSixHQUF1QixVQUFVQyxFQUFWLEVBQWU7O0FBRXJDO0FBQ0EsTUFBS0EsR0FBR0MsTUFBSCxHQUFZM0YsUUFBWixDQUFzQixZQUF0QixLQUF3QyxDQUFFMEYsR0FBRzFGLFFBQUgsQ0FBYSxZQUFiLENBQS9DLEVBQTZFO0FBQzVFO0FBQ0E7O0FBRUQ7QUFDQSxNQUFLMEYsR0FBR0MsTUFBSCxHQUFZM0YsUUFBWixDQUFzQixZQUF0QixLQUF3QzBGLEdBQUcxRixRQUFILENBQWEsWUFBYixDQUE3QyxFQUEyRTtBQUMxRTBGLE1BQUd0RixXQUFILENBQWdCLFlBQWhCLEVBQStCSCxJQUEvQixDQUFxQyxXQUFyQyxFQUFtREcsV0FBbkQsQ0FBZ0UsYUFBaEUsRUFBZ0Z3QixRQUFoRixDQUEwRixjQUExRjtBQUNBO0FBQ0E7O0FBRURsRCxNQUFJSyxFQUFKLENBQU9pRyxnQkFBUCxDQUF3QjFDLElBQXhCLENBQThCLFlBQVc7O0FBRXhDO0FBQ0EsT0FBSzdELEVBQUcsSUFBSCxFQUFVdUIsUUFBVixDQUFvQixhQUFwQixDQUFMLEVBQTJDOztBQUUxQztBQUNBdkIsTUFBRyxJQUFILEVBQVVrSCxNQUFWLEdBQW1CdkYsV0FBbkIsQ0FBZ0MsWUFBaEMsRUFBK0NILElBQS9DLENBQXFELG1CQUFyRCxFQUEyRUMsSUFBM0UsQ0FBaUYsZUFBakYsRUFBa0csS0FBbEc7O0FBRUE7QUFDQXpCLE1BQUcsSUFBSCxFQUFVMkIsV0FBVixDQUF1QixhQUF2QixFQUF1Q3dCLFFBQXZDLENBQWlELGNBQWpEO0FBQ0E7QUFFRCxHQVpEO0FBYUEsRUExQkQ7O0FBNEJBO0FBQ0FsRCxLQUFJMEcsWUFBSixHQUFtQixZQUFXOztBQUU3QjFHLE1BQUlLLEVBQUosQ0FBT21HLGlCQUFQLENBQXlCakYsSUFBekIsQ0FBK0IsU0FBL0IsRUFBMkMyRixLQUEzQyxDQUFrRCwwSUFBbEQ7QUFDQSxFQUhEOztBQUtBO0FBQ0FsSCxLQUFJMkcsYUFBSixHQUFvQixVQUFVUSxDQUFWLEVBQWM7O0FBRWpDLE1BQUlILEtBQUtqSCxFQUFHLElBQUgsQ0FBVDtBQUFBLE1BQW9CO0FBQ25CcUgsWUFBVUosR0FBR0ssUUFBSCxDQUFhLGFBQWIsQ0FEWDtBQUFBLE1BQ3lDO0FBQ3hDQyxZQUFVdkgsRUFBR29ILEVBQUVqQixNQUFMLENBRlgsQ0FGaUMsQ0FJUDs7QUFFMUI7QUFDQTtBQUNBLE1BQUtvQixRQUFRaEcsUUFBUixDQUFrQixZQUFsQixLQUFvQ2dHLFFBQVFoRyxRQUFSLENBQWtCLGtCQUFsQixDQUF6QyxFQUFrRjs7QUFFakY7QUFDQXRCLE9BQUkrRyxnQkFBSixDQUFzQkMsRUFBdEI7O0FBRUEsT0FBSyxDQUFFSSxRQUFROUYsUUFBUixDQUFrQixZQUFsQixDQUFQLEVBQTBDOztBQUV6QztBQUNBdEIsUUFBSXVILFdBQUosQ0FBaUJQLEVBQWpCLEVBQXFCSSxPQUFyQjtBQUVBOztBQUVELFVBQU8sS0FBUDtBQUNBO0FBRUQsRUF2QkQ7O0FBeUJBO0FBQ0FwSCxLQUFJdUgsV0FBSixHQUFrQixVQUFVTixNQUFWLEVBQWtCRyxPQUFsQixFQUE0Qjs7QUFFN0M7QUFDQUgsU0FBTy9ELFFBQVAsQ0FBaUIsWUFBakIsRUFBZ0MzQixJQUFoQyxDQUFzQyxtQkFBdEMsRUFBNERDLElBQTVELENBQWtFLGVBQWxFLEVBQW1GLElBQW5GOztBQUVBO0FBQ0E0RixVQUFRbEUsUUFBUixDQUFrQixpQ0FBbEI7QUFDQSxFQVBEOztBQVNBO0FBQ0FsRCxLQUFJNkcsa0JBQUosR0FBeUIsVUFBVVosS0FBVixFQUFrQjtBQUMxQyxNQUFLbEcsRUFBR2tHLE1BQU1DLE1BQVQsRUFBa0I1RSxRQUFsQixDQUE0QixzQkFBNUIsQ0FBTCxFQUE0RDs7QUFFM0Q7QUFDQXRCLE9BQUlLLEVBQUosQ0FBT29HLGtCQUFQLENBQTBCZSxLQUExQjs7QUFFQTtBQUNBLE9BQUssQ0FBRXpILEVBQUcsSUFBSCxFQUFVdUIsUUFBVixDQUFvQixZQUFwQixDQUFQLEVBQTRDO0FBQzNDdEIsUUFBSUssRUFBSixDQUFPbUcsaUJBQVAsQ0FBeUI5RSxXQUF6QixDQUFzQyxZQUF0QyxFQUFxREgsSUFBckQsQ0FBMkQsbUJBQTNELEVBQWlGQyxJQUFqRixDQUF1RixlQUF2RixFQUF3RyxLQUF4RztBQUNBeEIsUUFBSUssRUFBSixDQUFPaUcsZ0JBQVAsQ0FBd0I1RSxXQUF4QixDQUFxQyx3QkFBckM7QUFDQTFCLFFBQUlLLEVBQUosQ0FBT29GLElBQVAsQ0FBWWdDLEdBQVosQ0FBaUIsVUFBakIsRUFBNkIsU0FBN0I7QUFDQXpILFFBQUlLLEVBQUosQ0FBT29GLElBQVAsQ0FBWWlDLE1BQVosQ0FBb0IsWUFBcEI7QUFDQTs7QUFFRCxPQUFLM0gsRUFBRyxJQUFILEVBQVV1QixRQUFWLENBQW9CLFlBQXBCLENBQUwsRUFBMEM7QUFDekN0QixRQUFJSyxFQUFKLENBQU9vRixJQUFQLENBQVlnQyxHQUFaLENBQWlCLFVBQWpCLEVBQTZCLFFBQTdCO0FBQ0F6SCxRQUFJSyxFQUFKLENBQU9vRixJQUFQLENBQVlrQyxJQUFaLENBQWtCLFlBQWxCLEVBQWdDLFVBQVVSLENBQVYsRUFBYztBQUM3QyxTQUFLLENBQUVwSCxFQUFHb0gsRUFBRWpCLE1BQUwsRUFBYy9FLE9BQWQsQ0FBdUIsZ0JBQXZCLEVBQTBDLENBQTFDLENBQVAsRUFBc0Q7QUFDckRnRyxRQUFFUyxjQUFGO0FBQ0E7QUFDRCxLQUpEO0FBS0E7QUFDRDtBQUNELEVBdkJEOztBQXlCQTtBQUNBN0gsR0FBR0MsSUFBSUMsSUFBUDtBQUVBLENBbkpDLEVBbUpDSixNQW5KRCxFQW1KU3NDLE1BbkpULEVBbUppQnRDLE9BQU93RyxhQW5KeEIsQ0FBRjs7O0FDTkE7Ozs7O0FBS0F4RyxPQUFPZ0ksUUFBUCxHQUFrQixFQUFsQjtBQUNFLFdBQVVoSSxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCLEtBQUk4SCxxQkFBSjtBQUFBLEtBQ0NDLDJCQUREO0FBQUEsS0FFQ0MsZ0JBRkQ7QUFBQSxLQUdDQyxPQUFPOUIsU0FBUytCLGFBQVQsQ0FBd0IsUUFBeEIsQ0FIUjtBQUFBLEtBSUNDLGtCQUFrQmhDLFNBQVNpQyxvQkFBVCxDQUErQixRQUEvQixFQUEwQyxDQUExQyxDQUpuQjtBQUFBLEtBS0NDLFdBTEQ7O0FBT0E7QUFDQXJJLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKOztBQUVBLE1BQUtGLElBQUlHLGlCQUFKLEVBQUwsRUFBK0I7QUFDOUJnSSxtQkFBZ0JHLFVBQWhCLENBQTJCQyxZQUEzQixDQUF5Q04sSUFBekMsRUFBK0NFLGVBQS9DO0FBQ0FuSSxPQUFJSSxVQUFKO0FBQ0E7QUFDRCxFQVBEOztBQVNBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUixXQUFRTixFQUFHLE1BQUg7QUFEQSxHQUFUO0FBR0EsRUFKRDs7QUFNQTtBQUNBQyxLQUFJRyxpQkFBSixHQUF3QixZQUFXO0FBQ2xDLFNBQU9KLEVBQUcsZ0JBQUgsRUFBc0JtQixNQUE3QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQWxCLEtBQUlJLFVBQUosR0FBaUIsWUFBVzs7QUFFM0I7QUFDQUosTUFBSUssRUFBSixDQUFPb0YsSUFBUCxDQUFZMUUsRUFBWixDQUFnQixrQkFBaEIsRUFBb0MsZ0JBQXBDLEVBQXNEZixJQUFJd0ksU0FBMUQ7O0FBRUE7QUFDQXhJLE1BQUlLLEVBQUosQ0FBT29GLElBQVAsQ0FBWTFFLEVBQVosQ0FBZ0Isa0JBQWhCLEVBQW9DLFFBQXBDLEVBQThDZixJQUFJeUksVUFBbEQ7O0FBRUE7QUFDQXpJLE1BQUlLLEVBQUosQ0FBT29GLElBQVAsQ0FBWTFFLEVBQVosQ0FBZ0IsU0FBaEIsRUFBMkJmLElBQUkwSSxXQUEvQjs7QUFFQTtBQUNBMUksTUFBSUssRUFBSixDQUFPb0YsSUFBUCxDQUFZMUUsRUFBWixDQUFnQixrQkFBaEIsRUFBb0MsZ0JBQXBDLEVBQXNEZixJQUFJMkksaUJBQTFEOztBQUVBO0FBQ0EzSSxNQUFJSyxFQUFKLENBQU9vRixJQUFQLENBQVkxRSxFQUFaLENBQWdCLFNBQWhCLEVBQTJCZixJQUFJNEksaUJBQS9CO0FBRUEsRUFqQkQ7O0FBbUJBO0FBQ0E1SSxLQUFJd0ksU0FBSixHQUFnQixZQUFXOztBQUUxQjtBQUNBVixpQkFBZS9ILEVBQUcsSUFBSCxDQUFmOztBQUVBO0FBQ0EsTUFBSThJLFNBQVM5SSxFQUFHQSxFQUFHLElBQUgsRUFBVStJLElBQVYsQ0FBZ0IsUUFBaEIsQ0FBSCxDQUFiOztBQUVBO0FBQ0FELFNBQU8zRixRQUFQLENBQWlCLFlBQWpCOztBQUVBO0FBQ0FsRCxNQUFJSyxFQUFKLENBQU9vRixJQUFQLENBQVl2QyxRQUFaLENBQXNCLFlBQXRCOztBQUVBO0FBQ0E7QUFDQTtBQUNBNkUsdUJBQXFCYyxPQUFPdEgsSUFBUCxDQUFhLHVCQUFiLENBQXJCOztBQUVBO0FBQ0EsTUFBSyxJQUFJd0csbUJBQW1CN0csTUFBNUIsRUFBcUM7O0FBRXBDO0FBQ0E2RyxzQkFBbUIsQ0FBbkIsRUFBc0JQLEtBQXRCO0FBQ0E7QUFFRCxFQTFCRDs7QUE0QkE7QUFDQXhILEtBQUl5SSxVQUFKLEdBQWlCLFlBQVc7O0FBRTNCO0FBQ0EsTUFBSUksU0FBUzlJLEVBQUdBLEVBQUcsdUJBQUgsRUFBNkIrSSxJQUE3QixDQUFtQyxRQUFuQyxDQUFILENBQWI7OztBQUVDO0FBQ0FDLFlBQVVGLE9BQU90SCxJQUFQLENBQWEsUUFBYixDQUhYOztBQUtBO0FBQ0EsTUFBS3dILFFBQVE3SCxNQUFiLEVBQXNCOztBQUVyQjtBQUNBLE9BQUk4SCxNQUFNRCxRQUFRdkgsSUFBUixDQUFjLEtBQWQsQ0FBVjs7QUFFQTtBQUNBO0FBQ0EsT0FBSyxDQUFFd0gsSUFBSUMsUUFBSixDQUFjLGVBQWQsQ0FBUCxFQUF5Qzs7QUFFeEM7QUFDQUYsWUFBUXZILElBQVIsQ0FBYyxLQUFkLEVBQXFCLEVBQXJCLEVBQTBCQSxJQUExQixDQUFnQyxLQUFoQyxFQUF1Q3dILEdBQXZDO0FBQ0EsSUFKRCxNQUlPOztBQUVOO0FBQ0FoQixZQUFRa0IsU0FBUjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQUwsU0FBT25ILFdBQVAsQ0FBb0IsWUFBcEI7O0FBRUE7QUFDQTFCLE1BQUlLLEVBQUosQ0FBT29GLElBQVAsQ0FBWS9ELFdBQVosQ0FBeUIsWUFBekI7O0FBRUE7QUFDQW9HLGVBQWFOLEtBQWI7QUFFQSxFQXBDRDs7QUFzQ0E7QUFDQXhILEtBQUkwSSxXQUFKLEdBQWtCLFVBQVV6QyxLQUFWLEVBQWtCO0FBQ25DLE1BQUssT0FBT0EsTUFBTWtELE9BQWxCLEVBQTRCO0FBQzNCbkosT0FBSXlJLFVBQUo7QUFDQTtBQUNELEVBSkQ7O0FBTUE7QUFDQXpJLEtBQUkySSxpQkFBSixHQUF3QixVQUFVMUMsS0FBVixFQUFrQjs7QUFFekM7QUFDQSxNQUFLLENBQUVsRyxFQUFHa0csTUFBTUMsTUFBVCxFQUFrQi9FLE9BQWxCLENBQTJCLEtBQTNCLEVBQW1DRyxRQUFuQyxDQUE2QyxjQUE3QyxDQUFQLEVBQXVFO0FBQ3RFdEIsT0FBSXlJLFVBQUo7QUFDQTtBQUNELEVBTkQ7O0FBUUE7QUFDQXpJLEtBQUk0SSxpQkFBSixHQUF3QixVQUFVM0MsS0FBVixFQUFrQjs7QUFFekM7QUFDQSxNQUFLLE1BQU1BLE1BQU1tRCxLQUFaLElBQXFCLElBQUlySixFQUFHLGFBQUgsRUFBbUJtQixNQUFqRCxFQUEwRDtBQUN6RCxPQUFJbUksV0FBV3RKLEVBQUcsUUFBSCxDQUFmO0FBQUEsT0FDQ3VKLGFBQWF2QixtQkFBbUJ3QixLQUFuQixDQUEwQkYsUUFBMUIsQ0FEZDs7QUFHQSxPQUFLLE1BQU1DLFVBQU4sSUFBb0JyRCxNQUFNdUQsUUFBL0IsRUFBMEM7O0FBRXpDO0FBQ0F6Qix1QkFBb0JBLG1CQUFtQjdHLE1BQW5CLEdBQTRCLENBQWhELEVBQW9Ec0csS0FBcEQ7QUFDQXZCLFVBQU0yQixjQUFOO0FBQ0EsSUFMRCxNQUtPLElBQUssQ0FBRTNCLE1BQU11RCxRQUFSLElBQW9CRixlQUFldkIsbUJBQW1CN0csTUFBbkIsR0FBNEIsQ0FBcEUsRUFBd0U7O0FBRTlFO0FBQ0E2Ryx1QkFBbUIsQ0FBbkIsRUFBc0JQLEtBQXRCO0FBQ0F2QixVQUFNMkIsY0FBTjtBQUNBO0FBQ0Q7QUFDRCxFQW5CRDs7QUFxQkE7QUFDQTVILEtBQUl5Six1QkFBSixHQUE4QixZQUFXO0FBQ3hDLE1BQUlaLFNBQVM5SSxFQUFHLFdBQUgsQ0FBYjtBQUFBLE1BQ0MySixZQUFZYixPQUFPdEgsSUFBUCxDQUFhLFFBQWIsRUFBd0JDLElBQXhCLENBQThCLElBQTlCLENBRGI7O0FBR0F3RyxZQUFVLElBQUlLLEdBQUdzQixNQUFQLENBQWVELFNBQWYsRUFBMEI7QUFDbkNFLFdBQVE7QUFDUCxlQUFXNUosSUFBSTZKLGFBRFI7QUFFUCxxQkFBaUI3SixJQUFJOEo7QUFGZDtBQUQyQixHQUExQixDQUFWO0FBTUEsRUFWRDs7QUFZQTtBQUNBOUosS0FBSTZKLGFBQUosR0FBb0IsWUFBVyxDQUM5QixDQUREOztBQUdBO0FBQ0E3SixLQUFJOEosbUJBQUosR0FBMEIsWUFBVzs7QUFFcEM7QUFDQS9KLElBQUdrRyxNQUFNQyxNQUFOLENBQWE2RCxDQUFoQixFQUFvQjVJLE9BQXBCLENBQTZCLFFBQTdCLEVBQXdDSSxJQUF4QyxDQUE4Qyx1QkFBOUMsRUFBd0V5SSxLQUF4RSxHQUFnRnhDLEtBQWhGO0FBQ0EsRUFKRDs7QUFPQTtBQUNBekgsR0FBR0MsSUFBSUMsSUFBUDtBQUNBLENBeExDLEVBd0xDSixNQXhMRCxFQXdMU3NDLE1BeExULEVBd0xpQnRDLE9BQU9nSSxRQXhMeEIsQ0FBRjs7O0FDTkE7Ozs7O0FBS0FoSSxPQUFPb0ssb0JBQVAsR0FBOEIsRUFBOUI7QUFDRSxXQUFVcEssTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUU1QjtBQUNBQSxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjs7QUFFQSxNQUFLRixJQUFJRyxpQkFBSixFQUFMLEVBQStCO0FBQzlCSCxPQUFJSSxVQUFKO0FBQ0E7QUFDRCxFQU5EOztBQVFBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUlIsV0FBUUUsRUFBR0YsTUFBSCxDQURBO0FBRVJ5RyxxQkFBa0J2RyxFQUFHLDRCQUFILENBRlY7QUFHUnlHLHNCQUFtQnpHLEVBQUcsNENBQUg7QUFIWCxHQUFUO0FBS0EsRUFORDs7QUFRQTtBQUNBQyxLQUFJSSxVQUFKLEdBQWlCLFlBQVc7QUFDM0JKLE1BQUlLLEVBQUosQ0FBT1IsTUFBUCxDQUFja0IsRUFBZCxDQUFrQixNQUFsQixFQUEwQmYsSUFBSTBHLFlBQTlCO0FBQ0ExRyxNQUFJSyxFQUFKLENBQU9tRyxpQkFBUCxDQUF5QmpGLElBQXpCLENBQStCLEdBQS9CLEVBQXFDUixFQUFyQyxDQUF5QyxrQkFBekMsRUFBNkRmLElBQUlrSyxXQUFqRTtBQUNBLEVBSEQ7O0FBS0E7QUFDQWxLLEtBQUlHLGlCQUFKLEdBQXdCLFlBQVc7QUFDbEMsU0FBT0gsSUFBSUssRUFBSixDQUFPaUcsZ0JBQVAsQ0FBd0JwRixNQUEvQjtBQUNBLEVBRkQ7O0FBSUE7QUFDQWxCLEtBQUkwRyxZQUFKLEdBQW1CLFlBQVc7QUFDN0IxRyxNQUFJSyxFQUFKLENBQU9tRyxpQkFBUCxDQUF5QmpGLElBQXpCLENBQStCLEtBQS9CLEVBQXVDNEksTUFBdkMsQ0FBK0MscURBQS9DO0FBQ0EsRUFGRDs7QUFJQTtBQUNBbkssS0FBSWtLLFdBQUosR0FBa0IsWUFBVztBQUM1Qm5LLElBQUcsSUFBSCxFQUFVb0IsT0FBVixDQUFtQiwyQkFBbkIsRUFBaURDLFdBQWpELENBQThELE9BQTlEO0FBQ0EsRUFGRDs7QUFJQTtBQUNBckIsR0FBR0MsSUFBSUMsSUFBUDtBQUVBLENBNUNDLEVBNENDSixNQTVDRCxFQTRDU3NDLE1BNUNULEVBNENpQnRDLE9BQU9vSyxvQkE1Q3hCLENBQUY7OztBQ05BOzs7OztBQUtBcEssT0FBT3VLLFlBQVAsR0FBc0IsRUFBdEI7QUFDRSxXQUFVdkssTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUU1QjtBQUNBQSxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjs7QUFFQSxNQUFLRixJQUFJRyxpQkFBSixFQUFMLEVBQStCO0FBQzlCSCxPQUFJSSxVQUFKO0FBQ0E7QUFDRCxFQU5EOztBQVFBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUm9GLFNBQU0xRixFQUFHLE1BQUgsQ0FERTtBQUVSc0ssbUJBQWdCdEssRUFBRyxtQkFBSCxDQUZSO0FBR1IwRyx1QkFBb0IxRyxFQUFHLHVCQUFILENBSFo7QUFJUnVLLGtCQUFldkssRUFBRyxrQkFBSCxDQUpQO0FBS1J3SyxvQkFBaUJ4SyxFQUFHLG9CQUFIO0FBTFQsR0FBVDtBQU9BLEVBUkQ7O0FBVUE7QUFDQUMsS0FBSUksVUFBSixHQUFpQixZQUFXO0FBQzNCSixNQUFJSyxFQUFKLENBQU9vRixJQUFQLENBQVkxRSxFQUFaLENBQWdCLFNBQWhCLEVBQTJCZixJQUFJMEksV0FBL0I7QUFDQTFJLE1BQUlLLEVBQUosQ0FBT2dLLGNBQVAsQ0FBc0J0SixFQUF0QixDQUEwQixPQUExQixFQUFtQ2YsSUFBSXdLLGNBQXZDO0FBQ0F4SyxNQUFJSyxFQUFKLENBQU9pSyxhQUFQLENBQXFCdkosRUFBckIsQ0FBeUIsT0FBekIsRUFBa0NmLElBQUl5SyxlQUF0QztBQUNBekssTUFBSUssRUFBSixDQUFPa0ssZUFBUCxDQUF1QnhKLEVBQXZCLENBQTJCLE9BQTNCLEVBQW9DZixJQUFJd0ssY0FBeEM7QUFDQSxFQUxEOztBQU9BO0FBQ0F4SyxLQUFJRyxpQkFBSixHQUF3QixZQUFXO0FBQ2xDLFNBQU9ILElBQUlLLEVBQUosQ0FBT29HLGtCQUFQLENBQTBCdkYsTUFBakM7QUFDQSxFQUZEOztBQUlBO0FBQ0FsQixLQUFJeUssZUFBSixHQUFzQixZQUFXOztBQUVoQyxNQUFLLFdBQVcxSyxFQUFHLElBQUgsRUFBVXlCLElBQVYsQ0FBZ0IsZUFBaEIsQ0FBaEIsRUFBb0Q7QUFDbkR4QixPQUFJd0ssY0FBSjtBQUNBLEdBRkQsTUFFTztBQUNOeEssT0FBSTBLLGFBQUo7QUFDQTtBQUVELEVBUkQ7O0FBVUE7QUFDQTFLLEtBQUkwSyxhQUFKLEdBQW9CLFlBQVc7QUFDOUIxSyxNQUFJSyxFQUFKLENBQU9vRyxrQkFBUCxDQUEwQnZELFFBQTFCLENBQW9DLFlBQXBDO0FBQ0FsRCxNQUFJSyxFQUFKLENBQU9pSyxhQUFQLENBQXFCcEgsUUFBckIsQ0FBK0IsWUFBL0I7QUFDQWxELE1BQUlLLEVBQUosQ0FBT2tLLGVBQVAsQ0FBdUJySCxRQUF2QixDQUFpQyxZQUFqQzs7QUFFQWxELE1BQUlLLEVBQUosQ0FBT2lLLGFBQVAsQ0FBcUI5SSxJQUFyQixDQUEyQixlQUEzQixFQUE0QyxJQUE1QztBQUNBeEIsTUFBSUssRUFBSixDQUFPb0csa0JBQVAsQ0FBMEJqRixJQUExQixDQUFnQyxhQUFoQyxFQUErQyxLQUEvQztBQUNBLEVBUEQ7O0FBU0E7QUFDQXhCLEtBQUl3SyxjQUFKLEdBQXFCLFlBQVc7QUFDL0J4SyxNQUFJSyxFQUFKLENBQU9vRyxrQkFBUCxDQUEwQi9FLFdBQTFCLENBQXVDLFlBQXZDO0FBQ0ExQixNQUFJSyxFQUFKLENBQU9pSyxhQUFQLENBQXFCNUksV0FBckIsQ0FBa0MsWUFBbEM7QUFDQTFCLE1BQUlLLEVBQUosQ0FBT2tLLGVBQVAsQ0FBdUI3SSxXQUF2QixDQUFvQyxZQUFwQzs7QUFFQTFCLE1BQUlLLEVBQUosQ0FBT2lLLGFBQVAsQ0FBcUI5SSxJQUFyQixDQUEyQixlQUEzQixFQUE0QyxLQUE1QztBQUNBeEIsTUFBSUssRUFBSixDQUFPb0csa0JBQVAsQ0FBMEJqRixJQUExQixDQUFnQyxhQUFoQyxFQUErQyxJQUEvQzs7QUFFQXhCLE1BQUlLLEVBQUosQ0FBT2lLLGFBQVAsQ0FBcUI5QyxLQUFyQjtBQUNBLEVBVEQ7O0FBV0E7QUFDQXhILEtBQUkwSSxXQUFKLEdBQWtCLFVBQVV6QyxLQUFWLEVBQWtCO0FBQ25DLE1BQUssT0FBT0EsTUFBTWtELE9BQWxCLEVBQTRCO0FBQzNCbkosT0FBSXdLLGNBQUo7QUFDQTtBQUNELEVBSkQ7O0FBTUE7QUFDQXpLLEdBQUdDLElBQUlDLElBQVA7QUFFQSxDQTlFQyxFQThFQ0osTUE5RUQsRUE4RVNzQyxNQTlFVCxFQThFaUJ0QyxPQUFPdUssWUE5RXhCLENBQUY7OztBQ05BOzs7Ozs7O0FBT0UsYUFBVztBQUNaLEtBQUlPLFdBQVcsQ0FBQyxDQUFELEdBQUtDLFVBQVVDLFNBQVYsQ0FBb0JDLFdBQXBCLEdBQWtDQyxPQUFsQyxDQUEyQyxRQUEzQyxDQUFwQjtBQUFBLEtBQ0NDLFVBQVUsQ0FBQyxDQUFELEdBQUtKLFVBQVVDLFNBQVYsQ0FBb0JDLFdBQXBCLEdBQWtDQyxPQUFsQyxDQUEyQyxPQUEzQyxDQURoQjtBQUFBLEtBRUNFLE9BQU8sQ0FBQyxDQUFELEdBQUtMLFVBQVVDLFNBQVYsQ0FBb0JDLFdBQXBCLEdBQWtDQyxPQUFsQyxDQUEyQyxNQUEzQyxDQUZiOztBQUlBLEtBQUssQ0FBRUosWUFBWUssT0FBWixJQUF1QkMsSUFBekIsS0FBbUM5RSxTQUFTK0UsY0FBNUMsSUFBOERyTCxPQUFPc0wsZ0JBQTFFLEVBQTZGO0FBQzVGdEwsU0FBT3NMLGdCQUFQLENBQXlCLFlBQXpCLEVBQXVDLFlBQVc7QUFDakQsT0FBSUMsS0FBS3ZLLFNBQVNDLElBQVQsQ0FBY3VLLFNBQWQsQ0FBeUIsQ0FBekIsQ0FBVDtBQUFBLE9BQ0NDLE9BREQ7O0FBR0EsT0FBSyxDQUFJLGVBQUYsQ0FBb0JDLElBQXBCLENBQTBCSCxFQUExQixDQUFQLEVBQXdDO0FBQ3ZDO0FBQ0E7O0FBRURFLGFBQVVuRixTQUFTK0UsY0FBVCxDQUF5QkUsRUFBekIsQ0FBVjs7QUFFQSxPQUFLRSxPQUFMLEVBQWU7QUFDZCxRQUFLLENBQUksdUNBQUYsQ0FBNENDLElBQTVDLENBQWtERCxRQUFRRSxPQUExRCxDQUFQLEVBQTZFO0FBQzVFRixhQUFRRyxRQUFSLEdBQW1CLENBQUMsQ0FBcEI7QUFDQTs7QUFFREgsWUFBUTlELEtBQVI7QUFDQTtBQUNELEdBakJELEVBaUJHLEtBakJIO0FBa0JBO0FBQ0QsQ0F6QkMsR0FBRjs7O0FDUEE7Ozs7O0FBS0EzSCxPQUFPNkwsU0FBUCxHQUFtQixFQUFuQjtBQUNFLFdBQVU3TCxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKOztBQUVBLE1BQUtGLElBQUlHLGlCQUFKLEVBQUwsRUFBK0I7QUFDOUJILE9BQUlJLFVBQUo7QUFDQTtBQUNELEVBTkQ7O0FBUUE7QUFDQUosS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlLLEVBQUosR0FBUztBQUNSUixXQUFRRSxFQUFHRixNQUFILENBREE7QUFFUjhMLFVBQU81TCxFQUFHLE9BQUg7QUFGQyxHQUFUO0FBSUEsRUFMRDs7QUFPQTtBQUNBQyxLQUFJSSxVQUFKLEdBQWlCLFlBQVc7QUFDM0JKLE1BQUlLLEVBQUosQ0FBT1IsTUFBUCxDQUFja0IsRUFBZCxDQUFrQixNQUFsQixFQUEwQmYsSUFBSTRMLFlBQTlCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBNUwsS0FBSUcsaUJBQUosR0FBd0IsWUFBVztBQUNsQyxTQUFPSCxJQUFJSyxFQUFKLENBQU9zTCxLQUFQLENBQWF6SyxNQUFwQjtBQUNBLEVBRkQ7O0FBSUE7QUFDQWxCLEtBQUk0TCxZQUFKLEdBQW1CLFlBQVc7QUFDN0IsTUFBTUQsUUFBUTNMLElBQUlLLEVBQUosQ0FBT3NMLEtBQXJCO0FBQ0EsTUFBTUUsZUFBZUYsTUFBTXBLLElBQU4sQ0FBWSxVQUFaLENBQXJCO0FBQ0EsTUFBTXVLLFdBQVdILE1BQU1wSyxJQUFOLENBQVksVUFBWixDQUFqQjs7QUFFQXVLLFdBQVNsSSxJQUFULENBQWUsWUFBVztBQUN6QixPQUFNbUksS0FBS2hNLEVBQUcsSUFBSCxFQUFVd0IsSUFBVixDQUFnQixJQUFoQixDQUFYOztBQUVBd0ssTUFBR25JLElBQUgsQ0FBUyxVQUFVMkYsS0FBVixFQUFrQjtBQUMxQixRQUFLeEosRUFBRzhMLGFBQWFHLEdBQWIsQ0FBa0J6QyxLQUFsQixDQUFILENBQUwsRUFBc0M7QUFDckN4SixPQUFHLElBQUgsRUFBVXlCLElBQVYsQ0FBZ0IsWUFBaEIsRUFBOEJ6QixFQUFHOEwsYUFBYUcsR0FBYixDQUFrQnpDLEtBQWxCLENBQUgsRUFBK0JuRixJQUEvQixFQUE5QjtBQUNBO0FBQ0QsSUFKRDtBQUtBLEdBUkQ7O0FBVUEsU0FBTyxLQUFQO0FBQ0EsRUFoQkQ7O0FBa0JBO0FBQ0FyRSxHQUFHQyxJQUFJQyxJQUFQO0FBRUEsQ0FuREMsRUFtREVKLE1BbkRGLEVBbURVc0MsTUFuRFYsRUFtRGtCdEMsT0FBTzZMLFNBbkR6QixDQUFGOzs7QUNOQTs7O0FBR0E3TCxPQUFPb00sd0JBQVAsR0FBa0MsRUFBbEM7QUFDRSxXQUFVcE0sTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUU1QjtBQUNBQSxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjs7QUFFQSxNQUFLRixJQUFJRyxpQkFBSixFQUFMLEVBQStCO0FBQzlCSCxPQUFJSSxVQUFKO0FBQ0E7QUFDRCxFQU5EOztBQVFBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUlIsV0FBUUUsRUFBR0YsTUFBSCxDQURBO0FBRVJxTSxnQkFBYW5NLEVBQUcsZUFBSDtBQUZMLEdBQVQ7QUFJQSxFQUxEOztBQU9BO0FBQ0FDLEtBQUlJLFVBQUosR0FBaUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPNkwsV0FBUCxDQUFtQm5MLEVBQW5CLENBQXVCLE9BQXZCLEVBQWdDZixJQUFJbU0sZ0JBQXBDO0FBQ0EsRUFGRDs7QUFJQTtBQUNBbk0sS0FBSUcsaUJBQUosR0FBd0IsWUFBVztBQUNsQyxTQUFPSCxJQUFJSyxFQUFKLENBQU82TCxXQUFQLENBQW1CaEwsTUFBMUI7QUFDQSxFQUZEOztBQUlBO0FBQ0FsQixLQUFJbU0sZ0JBQUosR0FBdUIsWUFBVztBQUNqQ3BNLElBQUcsSUFBSCxFQUFVb0IsT0FBVixDQUFtQixnQkFBbkIsRUFBc0NDLFdBQXRDLENBQW1ELGVBQW5EOztBQUVBLE1BQUtyQixFQUFHLElBQUgsRUFBVW9CLE9BQVYsQ0FBbUIsZ0JBQW5CLEVBQXNDRyxRQUF0QyxDQUFnRCxlQUFoRCxDQUFMLEVBQXlFO0FBQ3hFdkIsS0FBRyxJQUFILEVBQVVxTSxRQUFWLENBQW9CLG1CQUFwQixFQUEwQ3hLLE9BQTFDLENBQW1ELE9BQW5EO0FBQ0EsR0FGRCxNQUVPO0FBQ043QixLQUFHLElBQUgsRUFBVXFNLFFBQVYsQ0FBb0IsbUJBQXBCLEVBQTBDeEssT0FBMUMsQ0FBbUQsTUFBbkQ7QUFDQTtBQUNELEVBUkQ7O0FBVUE7QUFDQTdCLEdBQUdDLElBQUlDLElBQVA7QUFFQSxDQTNDQyxFQTJDQ0osTUEzQ0QsRUEyQ1NzQyxNQTNDVCxFQTJDaUJ0QyxPQUFPb00sd0JBM0N4QixDQUFGOzs7QUNKQTs7Ozs7QUFLQXBNLE9BQU93TSxjQUFQLEdBQXdCLEVBQXhCO0FBQ0UsV0FBVXhNLE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7QUFDQUYsTUFBSUksVUFBSjtBQUNBLEVBSEQ7O0FBS0E7QUFDQUosS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlLLEVBQUosR0FBUztBQUNSLGFBQVVOLEVBQUdGLE1BQUgsQ0FERjtBQUVSLFdBQVFFLEVBQUdvRyxTQUFTVixJQUFaO0FBRkEsR0FBVDtBQUlBLEVBTEQ7O0FBT0E7QUFDQXpGLEtBQUlJLFVBQUosR0FBaUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPUixNQUFQLENBQWN5TSxJQUFkLENBQW9CdE0sSUFBSXVNLFlBQXhCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBdk0sS0FBSXVNLFlBQUosR0FBbUIsWUFBVztBQUM3QnZNLE1BQUlLLEVBQUosQ0FBT29GLElBQVAsQ0FBWXZDLFFBQVosQ0FBc0IsT0FBdEI7QUFDQSxFQUZEOztBQUlBO0FBQ0FuRCxHQUFHQyxJQUFJQyxJQUFQO0FBQ0EsQ0E1QkMsRUE0QkNKLE1BNUJELEVBNEJTc0MsTUE1QlQsRUE0QmlCdEMsT0FBT3dNLGNBNUJ4QixDQUFGIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQWNjb3JkaW9uIGJsb2NrIGZ1bmN0aW9uYWxpdHlcclxuICpcclxuICogQGF1dGhvciBTaGFubm9uIE1hY01pbGxhbiwgQ29yZXkgQ29sbGluc1xyXG4gKi9cclxud2luZG93LmFjY29yZGlvbkJsb2NrVG9nZ2xlID0ge307XHJcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xyXG5cclxuXHQvLyBDb25zdHJ1Y3RvclxyXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuY2FjaGUoKTtcclxuXHJcblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xyXG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXHJcblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMgPSB7XHJcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXHJcblx0XHRcdGh0bWw6ICQoICdodG1sJyApLFxyXG5cdFx0XHRhY2NvcmRpb246ICQoICcuYWNjb3JkaW9uJyApLFxyXG5cdFx0XHRpdGVtczogJCggJy5hY2NvcmRpb24taXRlbScgKSxcclxuXHRcdFx0aGVhZGVyczogJCggJy5hY2NvcmRpb24taXRlbS1oZWFkZXInICksXHJcblx0XHRcdGNvbnRlbnRzOiAkKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICksXHJcblx0XHRcdGJ1dHRvbjogJCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICksXHJcblx0XHRcdGFuY2hvcklEOiAkKCB3aW5kb3cubG9jYXRpb24uaGFzaCApXHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50c1xyXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMuaGVhZGVycy5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCBhcHAudG9nZ2xlQWNjb3JkaW9uICk7XHJcblx0XHRhcHAuJGMuYnV0dG9uLm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsIGFwcC50b2dnbGVBY2NvcmRpb24gKTtcclxuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLm9wZW5IYXNoQWNjb3JkaW9uICk7XHJcblx0fTtcclxuXHJcblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xyXG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGFwcC4kYy5hY2NvcmRpb24ubGVuZ3RoO1xyXG5cdH07XHJcblxyXG5cdGFwcC50b2dnbGVBY2NvcmRpb24gPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHQvLyBBZGQgdGhlIG9wZW4gY2xhc3MgdG8gdGhlIGl0ZW0uXHJcblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS50b2dnbGVDbGFzcyggJ29wZW4nICk7XHJcblxyXG5cdFx0Ly8gSXMgdGhpcyBvbmUgZXhwYW5kZWQ/XHJcblx0XHRsZXQgaXNFeHBhbmRlZCA9ICQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmhhc0NsYXNzKCAnb3BlbicgKTtcclxuXHJcblx0XHQvLyBTZXQgdGhpcyBidXR0b24ncyBhcmlhLWV4cGFuZGVkIHZhbHVlLlxyXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuZmluZCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBpc0V4cGFuZGVkID8gJ3RydWUnIDogJ2ZhbHNlJyApO1xyXG5cclxuXHRcdC8vIFNldCBhbGwgb3RoZXIgaXRlbXMgaW4gdGhpcyBibG9jayB0byBhcmlhLWhpZGRlbj10cnVlLlxyXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWJsb2NrJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcgKS5ub3QoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApICkuYXR0ciggJ2FyaWEtaGlkZGVuJywgJ3RydWUnICk7XHJcblxyXG5cdFx0Ly8gU2V0IHRoaXMgaXRlbSB0byBhcmlhLWhpZGRlbj1mYWxzZS5cclxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcgKS5hdHRyKCAnYXJpYS1oaWRkZW4nLCBpc0V4cGFuZGVkID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xyXG5cclxuXHRcdC8vIEhpZGUgdGhlIG90aGVyIHBhbmVscy5cclxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtJyApLm5vdCggJCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkgKS5yZW1vdmVDbGFzcyggJ29wZW4nICk7XHJcblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24tYmxvY2snICkuZmluZCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICkubm90KCAkKCB0aGlzICkgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHJcblx0YXBwLm9wZW5IYXNoQWNjb3JkaW9uID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0aWYgKCAhIGFwcC4kYy5hbmNob3JJRC5zZWxlY3RvciApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRyaWdnZXIgYSBjbGljayBvbiB0aGUgYnV0dG9uIGNsb3Nlc3QgdG8gdGhpcyBhY2NvcmRpb24uXHJcblx0XHRhcHAuJGMuYW5jaG9ySUQucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS50cmlnZ2VyKCAnY2xpY2snICk7XHJcblxyXG5cdFx0Ly8gTm90IHNldHRpbmcgYSBjYWNoZWQgdmFyaWFibGUgYXMgaXQgZG9lc24ndCBzZWVtIHRvIGdyYWIgdGhlIGhlaWdodCBwcm9wZXJseS5cclxuXHRcdGNvbnN0IGFkbWluQmFySGVpZ2h0ID0gJCggJyN3cGFkbWluYmFyJyApLmxlbmd0aCA/ICQoICcjd3BhZG1pbmJhcicgKS5oZWlnaHQoKSA6IDA7XHJcblxyXG5cdFx0Ly8gQW5pbWF0ZSB0byB0aGUgZGl2IGZvciBhIG5pY2VyIGV4cGVyaWVuY2UuXHJcblx0XHRhcHAuJGMuaHRtbC5hbmltYXRlKCB7XHJcblx0XHRcdHNjcm9sbFRvcDogYXBwLiRjLmFuY2hvcklELm9mZnNldCgpLnRvcCAtIGFkbWluQmFySGVpZ2h0XHJcblx0XHR9LCAnc2xvdycgKTtcclxuXHR9O1xyXG5cclxuXHQvLyBFbmdhZ2VcclxuXHRhcHAuaW5pdCgpO1xyXG5cclxufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuYWNjb3JkaW9uQmxvY2tUb2dnbGUgKSApO1xyXG4iLCIvKiBnbG9iYWwgd2RzaTE4bjogdHJ1ZSAqL1xuLyoqXG4gKiBGaWxlIGNhcm91c2VsLmpzXG4gKlxuICogRGVhbCB3aXRoIHRoZSBTbGljayBjYXJvdXNlbC5cbiAqL1xud2luZG93Lndkc0Nhcm91c2VsID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHRjb25zdCBjYXJvdXNlbE9wdGlvbnMgPSB7XG5cdFx0YXV0b3BsYXk6IHRydWUsXG5cdFx0YXV0b3BsYXlTcGVlZDogNTAwMCxcblx0XHRhcnJvd3M6IHRydWUsXG5cdFx0ZG90czogdHJ1ZSxcblx0XHRmb2N1c09uU2VsZWN0OiB0cnVlLFxuXHRcdHdhaXRGb3JBbmltYXRlOiB0cnVlXG5cdH07XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHR0aGVDYXJvdXNlbDogJCggJy5jYXJvdXNlbC1ibG9jaycgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmRvU2xpY2sgKTtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5kb0ZpcnN0QW5pbWF0aW9uICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnRoZUNhcm91c2VsLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBbmltYXRlIHRoZSBmaXJzdCBzbGlkZSBvbiB3aW5kb3cgbG9hZC5cblx0YXBwLmRvRmlyc3RBbmltYXRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEdldCB0aGUgZmlyc3Qgc2xpZGUgY29udGVudCBhcmVhIGFuZCBhbmltYXRpb24gYXR0cmlidXRlLlxuXHRcdGxldCBmaXJzdFNsaWRlID0gYXBwLiRjLnRoZUNhcm91c2VsLmZpbmQoICdbZGF0YS1zbGljay1pbmRleD0wXScgKSxcblx0XHRcdGZpcnN0U2xpZGVDb250ZW50ID0gZmlyc3RTbGlkZS5maW5kKCAnLnNsaWRlLWNvbnRlbnQnICksXG5cdFx0XHRmaXJzdEFuaW1hdGlvbiA9IGZpcnN0U2xpZGVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKTtcblxuXHRcdC8vIEFkZCB0aGUgYW5pbWF0aW9uIGNsYXNzIHRvIHRoZSBmaXJzdCBzbGlkZS5cblx0XHRmaXJzdFNsaWRlQ29udGVudC5hZGRDbGFzcyggZmlyc3RBbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBBbmltYXRlIHRoZSBzbGlkZSBjb250ZW50LlxuXHRhcHAuZG9BbmltYXRpb24gPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgc2xpZGVzID0gJCggdGhpcyApLmZpbmQoICcuc2xpZGUnICksXG5cdFx0XHRhY3RpdmVTbGlkZSA9ICQoIHRoaXMgKS5maW5kKCAnLnNsaWNrLWN1cnJlbnQnICksXG5cdFx0XHRhY3RpdmVDb250ZW50ID0gYWN0aXZlU2xpZGUuZmluZCggJy5zbGlkZS1jb250ZW50JyApLFxuXG5cdFx0XHQvLyBUaGlzIGlzIGEgc3RyaW5nIGxpa2Ugc286ICdhbmltYXRlZCBzb21lQ3NzQ2xhc3MnLlxuXHRcdFx0YW5pbWF0aW9uQ2xhc3MgPSBhY3RpdmVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKTtcblxuXHRcdFx0aWYgKCB1bmRlZmluZWQgPT09IGFuaW1hdGlvbkNsYXNzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBzcGxpdEFuaW1hdGlvbiA9IGFuaW1hdGlvbkNsYXNzLnNwbGl0KCAnICcgKSxcblxuXHRcdFx0Ly8gVGhpcyBpcyB0aGUgJ2FuaW1hdGVkJyBjbGFzcy5cblx0XHRcdGFuaW1hdGlvblRyaWdnZXIgPSBzcGxpdEFuaW1hdGlvblswXTtcblxuXHRcdC8vIEdvIHRocm91Z2ggZWFjaCBzbGlkZSB0byBzZWUgaWYgd2UndmUgYWxyZWFkeSBzZXQgYW5pbWF0aW9uIGNsYXNzZXMuXG5cdFx0c2xpZGVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0bGV0IHNsaWRlQ29udGVudCA9ICQoIHRoaXMgKS5maW5kKCAnLnNsaWRlLWNvbnRlbnQnICk7XG5cblx0XHRcdC8vIElmIHdlJ3ZlIHNldCBhbmltYXRpb24gY2xhc3NlcyBvbiBhIHNsaWRlLCByZW1vdmUgdGhlbS5cblx0XHRcdGlmICggc2xpZGVDb250ZW50Lmhhc0NsYXNzKCAnYW5pbWF0ZWQnICkgKSB7XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBsYXN0IGNsYXNzLCB3aGljaCBpcyB0aGUgYW5pbWF0ZS5jc3MgY2xhc3MuXG5cdFx0XHRcdGxldCBsYXN0Q2xhc3MgPSBzbGlkZUNvbnRlbnRcblx0XHRcdFx0XHQuYXR0ciggJ2NsYXNzJyApXG5cdFx0XHRcdFx0LnNwbGl0KCAnICcgKVxuXHRcdFx0XHRcdC5wb3AoKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgYm90aCBhbmltYXRpb24gY2xhc3Nlcy5cblx0XHRcdFx0c2xpZGVDb250ZW50LnJlbW92ZUNsYXNzKCBsYXN0Q2xhc3MgKS5yZW1vdmVDbGFzcyggYW5pbWF0aW9uVHJpZ2dlciApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEFkZCBhbmltYXRpb24gY2xhc3NlcyBhZnRlciBzbGlkZSBpcyBpbiB2aWV3LlxuXHRcdGFjdGl2ZUNvbnRlbnQuYWRkQ2xhc3MoIGFuaW1hdGlvbkNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWxsb3cgYmFja2dyb3VuZCB2aWRlb3MgdG8gYXV0b3BsYXkuXG5cdGFwcC5wbGF5QmFja2dyb3VuZFZpZGVvcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IGFsbCB0aGUgdmlkZW9zIGluIG91ciBzbGlkZXMgb2JqZWN0LlxuXHRcdCQoICd2aWRlbycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gTGV0IHRoZW0gYXV0b3BsYXkuIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0aGlzIGxhdGVyIHRvIG9ubHkgcGxheSB0aGUgdmlzaWJsZSBzbGlkZSB2aWRlby5cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBBcHBlbmQgYSBwYXVzZSBidXR0b24gdG8gdGhlIGNhcm91c2VsLlxuXHRhcHAuYWRkUGF1c2VidXR0b24gPSBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkcGF1c2VCdXR0b24gPSAkKCAnPGJ1dHRvbj4nLCB7ICdjbGFzcyc6ICdzbGljay1wYXVzZScsICd0eXBlJzogJ2J1dHRvbicgfSApLnRleHQoICdQYXVzZScgKSxcblx0XHRcdCRjYXJvdXNlbCA9ICQoIHRoaXMgKTtcblxuXHRcdCRwYXVzZUJ1dHRvbi5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdGlmICggKCAkY2Fyb3VzZWwgKS5oYXNDbGFzcyggJ3BhdXNlZCcgKSApIHtcblx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCAncGxheScgKS5yZW1vdmVDbGFzcyggJ3BhdXNlZCcgKTtcblx0XHRcdFx0JHBhdXNlQnV0dG9uLnRleHQoIHdkc2kxOG4ucGF1c2VCdXR0b25UZXh0UGF1c2UgKTtcblx0XHRcdFx0d3AuYTExeS5zcGVhayggd2RzaTE4bi5wYXVzZUJ1dHRvblNwZWFrUmVzdW1lZCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCAncGF1c2UnICkuYWRkQ2xhc3MoICdwYXVzZWQnICk7XG5cdFx0XHRcdCRwYXVzZUJ1dHRvbi50ZXh0KCB3ZHNpMThuLnBhdXNlQnV0dG9uVGV4dFBsYXkgKTtcblx0XHRcdFx0d3AuYTExeS5zcGVhayggd2RzaTE4bi5wYXVzZUJ1dHRvblNwZWFrUGF1c2VkICk7XG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cblx0XHQkcGF1c2VCdXR0b24uYXBwZW5kVG8oICRjYXJvdXNlbCApO1xuXHR9O1xuXG5cdC8vIEJpbmQgY2xpY2sgZXZlbnRzIHRvIGJ1dHRvbnMgYWZ0ZXIgU2xpY2sgaW5pdGlhbGl6ZXMuXG5cdGFwcC5iaW5kQnV0dG9uQ2xpY2tFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkYnV0dG9ucyA9ICQoIHRoaXMgKS5maW5kKCAnLnNsaWNrLWFycm93JyApO1xuXG5cdFx0JGJ1dHRvbnMub24oICdjbGljaycsIGFwcC5ub3RpZnlTbGlkZUNoYW5nZSApO1xuXHR9O1xuXG5cdC8vIFVzZSB3cC5hMTF5LnNwZWFrIHRvIG5vdGlmeSBzY3JlZW4gcmVhZGVycyBvZiBhY3RpdmUgc2xpZGVzLlxuXHRhcHAubm90aWZ5U2xpZGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkc2xpY2sgPSAkKCB0aGlzICkucGFyZW50cyggJy5zbGljay1zbGlkZXInICkuc2xpY2soICdnZXRTbGljaycgKTtcblxuXHRcdC8vIGN1cnJlbnRTbGlkZSBpcyAwIGJhc2VkLCBzbyB3ZSBuZWVkIHRvIGFkZCAxIHRvIG1ha2UgaXQgaHVtYW4uXG5cdFx0bGV0IGN1cnJlbnRTbGlkZSA9ICRzbGljay5jdXJyZW50U2xpZGUgKyAxO1xuXG5cdFx0Ly8gU3RyaW5nIHJlcGxhY2UgdGhlIHRoaW5ncy5cblx0XHR3cC5hMTF5LnNwZWFrKCB3ZHNpMThuLmFjdGl2ZVNsaWRlQnV0dG9uLnJlcGxhY2UoICclMSRzJywgY3VycmVudFNsaWRlICkucmVwbGFjZSggJyUyJHMnLCAkc2xpY2suc2xpZGVDb3VudCApICk7XG5cdH07XG5cblx0Ly8gS2ljayBvZmYgU2xpY2suXG5cdGFwcC5kb1NsaWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnRoZUNhcm91c2VsLm9uKCAnaW5pdCcsIGFwcC5wbGF5QmFja2dyb3VuZFZpZGVvcyApO1xuXHRcdGFwcC4kYy50aGVDYXJvdXNlbC5vbiggJ2luaXQnLCBhcHAuYmluZEJ1dHRvbkNsaWNrRXZlbnRzICk7XG5cblx0XHQvLyBXZSBvbmx5IG5lZWQgYSBwYXVzZSBidXR0b24gd2hlbiBhdXRvcGxheSBpcyBlbmFibGVkIGFib3ZlLlxuXHRcdGlmICggY2Fyb3VzZWxPcHRpb25zLmF1dG9wbGF5ICkge1xuXHRcdFx0YXBwLiRjLnRoZUNhcm91c2VsLm9uKCAnaW5pdCcsIGFwcC5hZGRQYXVzZWJ1dHRvbiApO1xuXHRcdH1cblxuXHRcdGFwcC4kYy50aGVDYXJvdXNlbC5zbGljayggY2Fyb3VzZWxPcHRpb25zICk7XG5cblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdhZnRlckNoYW5nZScsIGFwcC5kb0FuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc0Nhcm91c2VsICkgKTtcbiIsIi8qKlxuICogU2hvdy9IaWRlIHRoZSBTZWFyY2ggRm9ybSBpbiB0aGUgaGVhZGVyLlxuICpcbiAqIEBhdXRob3IgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3RvclxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdGhlYWRlclNlYXJjaFRvZ2dsZTogJCggJy5zaXRlLWhlYWRlci1hY3Rpb24gLmN0YS1idXR0b24nICksXG5cdFx0XHRoZWFkZXJTZWFyY2hGb3JtOiAkKCAnLnNpdGUtaGVhZGVyLWFjdGlvbiAuZm9ybS1jb250YWluZXInICksXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoVG9nZ2xlLm9uKCAna2V5dXAgdG91Y2hzdGFydCBjbGljaycsIGFwcC5zaG93SGlkZVNlYXJjaEZvcm0gKTtcblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleXVwIHRvdWNoc3RhcnQgY2xpY2snLCBhcHAuaGlkZVNlYXJjaEZvcm0gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuaGVhZGVyU2VhcmNoVG9nZ2xlLmxlbmd0aDtcblx0fTtcblxuXHQvLyBDaGVja3MgdG8gc2VlIGlmIHRoZSBtZW51IGhhcyBiZWVuIG9wZW5lZC5cblx0YXBwLnNlYXJjaElzT3BlbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCBhcHAuJGMuYm9keS5oYXNDbGFzcyggJ3NlYXJjaC1mb3JtLXZpc2libGUnICkgKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0Ly8gQWRkcyB0aGUgdG9nZ2xlIGNsYXNzIGZvciB0aGUgc2VhcmNoIGZvcm0uXG5cdGFwcC5zaG93SGlkZVNlYXJjaEZvcm0gPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS50b2dnbGVDbGFzcyggJ3NlYXJjaC1mb3JtLXZpc2libGUnICk7XG5cblx0XHRhcHAudG9nZ2xlU2VhcmNoRm9ybUFyaWFMYWJlbCgpO1xuXHRcdGFwcC50b2dnbGVTZWFyY2hUb2dnbGVBcmlhTGFiZWwoKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHQvLyBIaWRlcyB0aGUgc2VhcmNoIGZvcm0gaWYgd2UgY2xpY2sgb3V0c2lkZSBvZiBpdHMgY29udGFpbmVyLlxuXHRhcHAuaGlkZVNlYXJjaEZvcm0gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHRpZiAoICEgJCggZXZlbnQudGFyZ2V0ICkucGFyZW50cyggJ2RpdicgKS5oYXNDbGFzcyggJ3NpdGUtaGVhZGVyLWFjdGlvbicgKSApIHtcblx0XHRcdGFwcC4kYy5ib2R5LnJlbW92ZUNsYXNzKCAnc2VhcmNoLWZvcm0tdmlzaWJsZScgKTtcblx0XHRcdGFwcC50b2dnbGVTZWFyY2hGb3JtQXJpYUxhYmVsKCk7XG5cdFx0XHRhcHAudG9nZ2xlU2VhcmNoVG9nZ2xlQXJpYUxhYmVsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIFRvZ2dsZXMgdGhlIGFyaWEtaGlkZGVuIGxhYmVsIG9uIHRoZSBmb3JtIGNvbnRhaW5lci5cblx0YXBwLnRvZ2dsZVNlYXJjaEZvcm1BcmlhTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoRm9ybS5hdHRyKCAnYXJpYS1oaWRkZW4nLCBhcHAuc2VhcmNoSXNPcGVuKCkgPyAnZmFsc2UnIDogJ3RydWUnICk7XG5cdH07XG5cblx0Ly8gVG9nZ2xlcyB0aGUgYXJpYS1oaWRkZW4gbGFiZWwgb24gdGhlIHRvZ2dsZSBidXR0b24uXG5cdGFwcC50b2dnbGVTZWFyY2hUb2dnbGVBcmlhTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoVG9nZ2xlLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgYXBwLnNlYXJjaElzT3BlbigpID8gJ3RydWUnIDogJ2ZhbHNlJyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZVxuXHQkKCBhcHAuaW5pdCApO1xuXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy5TaG93SGlkZVNlYXJjaEZvcm0gKSApO1xuIiwiLyoqXG4gKiBGaWxlIGpzLWVuYWJsZWQuanNcbiAqXG4gKiBJZiBKYXZhc2NyaXB0IGlzIGVuYWJsZWQsIHJlcGxhY2UgdGhlIDxib2R5PiBjbGFzcyBcIm5vLWpzXCIuXG4gKi9cbmRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSggJ25vLWpzJywgJ2pzJyApO1xuIiwiLyoqXHJcbiAqIEZpbGU6IG1vYmlsZS1tZW51LmpzXHJcbiAqXHJcbiAqIENyZWF0ZSBhbiBhY2NvcmRpb24gc3R5bGUgZHJvcGRvd24uXHJcbiAqL1xyXG53aW5kb3cud2RzTW9iaWxlTWVudSA9IHt9O1xyXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcclxuXHJcblx0Ly8gQ29uc3RydWN0b3IuXHJcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC5jYWNoZSgpO1xyXG5cclxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XHJcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXHJcblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMgPSB7XHJcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxyXG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxyXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudSwgLnV0aWxpdHktbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXHJcblx0XHRcdHN1YlN1Yk1lbnVDb250YWluZXI6ICQoICcubW9iaWxlLW1lbnUgLnN1Yi1tZW51IC5zdWItbWVudScgKSxcclxuXHRcdFx0c3ViTWVudVBhcmVudEl0ZW06ICQoICcubW9iaWxlLW1lbnUgbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbiwgLnV0aWxpdHktbmF2aWdhdGlvbiBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApLFxyXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInIClcclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxyXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcclxuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZVN1Ym1lbnUgKTtcclxuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5vbiggJ3RyYW5zaXRpb25lbmQnLCBhcHAucmVzZXRTdWJNZW51ICk7XHJcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5mb3JjZUNsb3NlU3VibWVudXMgKTtcclxuXHR9O1xyXG5cclxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XHJcblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gYXBwLiRjLnN1Yk1lbnVDb250YWluZXIubGVuZ3RoO1xyXG5cdH07XHJcblxyXG5cdC8vIFJlc2V0IHRoZSBzdWJtZW51cyBhZnRlciBpdCdzIGRvbmUgY2xvc2luZy5cclxuXHRhcHAucmVzZXRTdWJNZW51ID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly8gV2hlbiB0aGUgbGlzdCBpdGVtIGlzIGRvbmUgdHJhbnNpdGlvbmluZyBpbiBoZWlnaHQsXHJcblx0XHQvLyByZW1vdmUgdGhlIGNsYXNzZXMgZnJvbSB0aGUgc3VibWVudSBzbyBpdCBpcyByZWFkeSB0byB0b2dnbGUgYWdhaW4uXHJcblx0XHRpZiAoICQoIHRoaXMgKS5pcyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkgJiYgISAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xyXG5cdFx0XHQkKCB0aGlzICkuZmluZCggJ3VsLnN1Yi1tZW51JyApLnJlbW92ZUNsYXNzKCAnc2xpZGVPdXRMZWZ0IGlzLXZpc2libGUnICk7XHJcblx0XHR9XHJcblxyXG5cdH07XHJcblxyXG5cdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudSBpdGVtcy5cclxuXHRhcHAuc2xpZGVPdXRTdWJNZW51cyA9IGZ1bmN0aW9uKCBlbCApIHtcclxuXHJcblx0XHQvLyBJZiB0aGlzIGl0ZW0ncyBwYXJlbnQgaXMgdmlzaWJsZSBhbmQgdGhpcyBpcyBub3QsIGJhaWwuXHJcblx0XHRpZiAoIGVsLnBhcmVudCgpLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSAmJiAhIGVsLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIHRoaXMgaXRlbSdzIHBhcmVudCBpcyB2aXNpYmxlIGFuZCB0aGlzIGl0ZW0gaXMgdmlzaWJsZSwgaGlkZSBpdHMgc3VibWVudSB0aGVuIGJhaWwuXHJcblx0XHRpZiAoIGVsLnBhcmVudCgpLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSAmJiBlbC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XHJcblx0XHRcdGVsLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnN1Yi1tZW51JyApLnJlbW92ZUNsYXNzKCAnc2xpZGVJbkxlZnQnICkuYWRkQ2xhc3MoICdzbGlkZU91dExlZnQnICk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdC8vIE9ubHkgdHJ5IHRvIGNsb3NlIHN1Ym1lbnVzIHRoYXQgYXJlIGFjdHVhbGx5IG9wZW4uXHJcblx0XHRcdGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnc2xpZGVJbkxlZnQnICkgKSB7XHJcblxyXG5cdFx0XHRcdC8vIENsb3NlIHRoZSBwYXJlbnQgbGlzdCBpdGVtLCBhbmQgc2V0IHRoZSBjb3JyZXNwb25kaW5nIGJ1dHRvbiBhcmlhIHRvIGZhbHNlLlxyXG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcclxuXHJcblx0XHRcdFx0Ly8gU2xpZGUgb3V0IHRoZSBzdWJtZW51LlxyXG5cdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSApO1xyXG5cdH07XHJcblxyXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXHJcblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnYTpmaXJzdCcgKS5hZnRlciggJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGNsYXNzPVwicGFyZW50LWluZGljYXRvclwiIGFyaWEtbGFiZWw9XCJPcGVuIHN1Ym1lbnVcIj48c3BhbiBjbGFzcz1cImRvd24tYXJyb3dcIj48L3NwYW4+PC9idXR0b24+JyApO1xyXG5cdH07XHJcblxyXG5cdC8vIERlYWwgd2l0aCB0aGUgc3VibWVudS5cclxuXHRhcHAudG9nZ2xlU3VibWVudSA9IGZ1bmN0aW9uKCBlICkge1xyXG5cclxuXHRcdGxldCBlbCA9ICQoIHRoaXMgKSwgLy8gVGhlIG1lbnUgZWxlbWVudCB3aGljaCB3YXMgY2xpY2tlZCBvbi5cclxuXHRcdFx0c3ViTWVudSA9IGVsLmNoaWxkcmVuKCAndWwuc3ViLW1lbnUnICksIC8vIFRoZSBuZWFyZXN0IHN1Ym1lbnUuXHJcblx0XHRcdCR0YXJnZXQgPSAkKCBlLnRhcmdldCApOyAvLyB0aGUgZWxlbWVudCB0aGF0J3MgYWN0dWFsbHkgYmVpbmcgY2xpY2tlZCAoY2hpbGQgb2YgdGhlIGxpIHRoYXQgdHJpZ2dlcmVkIHRoZSBjbGljayBldmVudCkuXHJcblxyXG5cdFx0Ly8gRmlndXJlIG91dCBpZiB3ZSdyZSBjbGlja2luZyB0aGUgYnV0dG9uIG9yIGl0cyBhcnJvdyBjaGlsZCxcclxuXHRcdC8vIGlmIHNvLCB3ZSBjYW4ganVzdCBvcGVuIG9yIGNsb3NlIHRoZSBtZW51IGFuZCBiYWlsLlxyXG5cdFx0aWYgKCAkdGFyZ2V0Lmhhc0NsYXNzKCAnZG93bi1hcnJvdycgKSB8fCAkdGFyZ2V0Lmhhc0NsYXNzKCAncGFyZW50LWluZGljYXRvcicgKSApIHtcclxuXHJcblx0XHRcdC8vIEZpcnN0LCBjb2xsYXBzZSBhbnkgYWxyZWFkeSBvcGVuZWQgc3VibWVudXMuXHJcblx0XHRcdGFwcC5zbGlkZU91dFN1Yk1lbnVzKCBlbCApO1xyXG5cclxuXHRcdFx0aWYgKCAhIHN1Yk1lbnUuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xyXG5cclxuXHRcdFx0XHQvLyBPcGVuIHRoZSBzdWJtZW51LlxyXG5cdFx0XHRcdGFwcC5vcGVuU3VibWVudSggZWwsIHN1Yk1lbnUgKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0Ly8gT3BlbiBhIHN1Ym1lbnUuXHJcblx0YXBwLm9wZW5TdWJtZW51ID0gZnVuY3Rpb24oIHBhcmVudCwgc3ViTWVudSApIHtcclxuXHJcblx0XHQvLyBFeHBhbmQgdGhlIGxpc3QgbWVudSBpdGVtLCBhbmQgc2V0IHRoZSBjb3JyZXNwb25kaW5nIGJ1dHRvbiBhcmlhIHRvIHRydWUuXHJcblx0XHRwYXJlbnQuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcclxuXHJcblx0XHQvLyBTbGlkZSB0aGUgbWVudSBpbi5cclxuXHRcdHN1Yk1lbnUuYWRkQ2xhc3MoICdpcy12aXNpYmxlIGFuaW1hdGVkIHNsaWRlSW5MZWZ0JyApO1xyXG5cdH07XHJcblxyXG5cdC8vIEZvcmNlIGNsb3NlIGFsbCB0aGUgc3VibWVudXMgd2hlbiB0aGUgbWFpbiBtZW51IGNvbnRhaW5lciBpcyBjbG9zZWQuXHJcblx0YXBwLmZvcmNlQ2xvc2VTdWJtZW51cyA9IGZ1bmN0aW9uKCBldmVudCApIHtcclxuXHRcdGlmICggJCggZXZlbnQudGFyZ2V0ICkuaGFzQ2xhc3MoICdvZmYtY2FudmFzLWNvbnRhaW5lcicgKSApIHtcclxuXHJcblx0XHRcdC8vIEZvY3VzIG9mZmNhbnZhcyBtZW51IGZvciBhMTF5LlxyXG5cdFx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmZvY3VzKCk7XHJcblxyXG5cdFx0XHQvLyBUaGUgdHJhbnNpdGlvbmVuZCBldmVudCB0cmlnZ2VycyBvbiBvcGVuIGFuZCBvbiBjbG9zZSwgbmVlZCB0byBtYWtlIHN1cmUgd2Ugb25seSBkbyB0aGlzIG9uIGNsb3NlLlxyXG5cdFx0XHRpZiAoICEgJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcclxuXHRcdFx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XHJcblx0XHRcdFx0YXBwLiRjLnN1Yk1lbnVDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlIHNsaWRlSW5MZWZ0JyApO1xyXG5cdFx0XHRcdGFwcC4kYy5ib2R5LmNzcyggJ292ZXJmbG93JywgJ3Zpc2libGUnICk7XHJcblx0XHRcdFx0YXBwLiRjLmJvZHkudW5iaW5kKCAndG91Y2hzdGFydCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xyXG5cdFx0XHRcdGFwcC4kYy5ib2R5LmNzcyggJ292ZXJmbG93JywgJ2hpZGRlbicgKTtcclxuXHRcdFx0XHRhcHAuJGMuYm9keS5iaW5kKCAndG91Y2hzdGFydCcsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0XHRcdFx0aWYgKCAhICQoIGUudGFyZ2V0ICkucGFyZW50cyggJy5jb250YWN0LW1vZGFsJyApWzBdICkge1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gRW5nYWdlIVxyXG5cdCQoIGFwcC5pbml0ICk7XHJcblxyXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc01vYmlsZU1lbnUgKSApO1xyXG4iLCIvKipcbiAqIEZpbGUgbW9kYWwuanNcbiAqXG4gKiBEZWFsIHdpdGggbXVsdGlwbGUgbW9kYWxzIGFuZCB0aGVpciBtZWRpYS5cbiAqL1xud2luZG93Lndkc01vZGFsID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHRsZXQgJG1vZGFsVG9nZ2xlLFxuXHRcdCRmb2N1c2FibGVDaGlsZHJlbixcblx0XHQkcGxheWVyLFxuXHRcdCR0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc2NyaXB0JyApLFxuXHRcdCRmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnc2NyaXB0JyApWzBdLFxuXHRcdFlUO1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdCRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggJHRhZywgJGZpcnN0U2NyaXB0VGFnICk7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J2JvZHknOiAkKCAnYm9keScgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJCggJy5tb2RhbC10cmlnZ2VyJyApLmxlbmd0aDtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBUcmlnZ2VyIGEgbW9kYWwgdG8gb3Blbi5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLm1vZGFsLXRyaWdnZXInLCBhcHAub3Blbk1vZGFsICk7XG5cblx0XHQvLyBUcmlnZ2VyIHRoZSBjbG9zZSBidXR0b24gdG8gY2xvc2UgdGhlIG1vZGFsLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICcuY2xvc2UnLCBhcHAuY2xvc2VNb2RhbCApO1xuXG5cdFx0Ly8gQWxsb3cgdGhlIHVzZXIgdG8gY2xvc2UgdGhlIG1vZGFsIGJ5IGhpdHRpbmcgdGhlIGVzYyBrZXkuXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLmVzY0tleUNsb3NlICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgY2xpY2tpbmcgb3V0c2lkZSBvZiB0aGUgbW9kYWwuXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJ2Rpdi5tb2RhbC1vcGVuJywgYXBwLmNsb3NlTW9kYWxCeUNsaWNrICk7XG5cblx0XHQvLyBMaXN0ZW4gdG8gdGFicywgdHJhcCBrZXlib2FyZCBpZiB3ZSBuZWVkIHRvXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLnRyYXBLZXlib2FyZE1heWJlICk7XG5cblx0fTtcblxuXHQvLyBPcGVuIHRoZSBtb2RhbC5cblx0YXBwLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gU3RvcmUgdGhlIG1vZGFsIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlID0gJCggdGhpcyApO1xuXG5cdFx0Ly8gRmlndXJlIG91dCB3aGljaCBtb2RhbCB3ZSdyZSBvcGVuaW5nIGFuZCBzdG9yZSB0aGUgb2JqZWN0LlxuXHRcdGxldCAkbW9kYWwgPSAkKCAkKCB0aGlzICkuZGF0YSggJ3RhcmdldCcgKSApO1xuXG5cdFx0Ly8gRGlzcGxheSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEFkZCBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEZpbmQgdGhlIGZvY3VzYWJsZSBjaGlsZHJlbiBvZiB0aGUgbW9kYWwuXG5cdFx0Ly8gVGhpcyBsaXN0IG1heSBiZSBpbmNvbXBsZXRlLCByZWFsbHkgd2lzaCBqUXVlcnkgaGFkIHRoZSA6Zm9jdXNhYmxlIHBzZXVkbyBsaWtlIGpRdWVyeSBVSSBkb2VzLlxuXHRcdC8vIEZvciBtb3JlIGFib3V0IDppbnB1dCBzZWU6IGh0dHBzOi8vYXBpLmpxdWVyeS5jb20vaW5wdXQtc2VsZWN0b3IvXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuID0gJG1vZGFsLmZpbmQoICdhLCA6aW5wdXQsIFt0YWJpbmRleF0nICk7XG5cblx0XHQvLyBJZGVhbGx5LCB0aGVyZSBpcyBhbHdheXMgb25lICh0aGUgY2xvc2UgYnV0dG9uKSwgYnV0IHlvdSBuZXZlciBrbm93LlxuXHRcdGlmICggMCA8ICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggKSB7XG5cblx0XHRcdC8vIFNoaWZ0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIENsb3NlIHRoZSBtb2RhbC5cblx0YXBwLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEZpZ3VyZSB0aGUgb3BlbmVkIG1vZGFsIHdlJ3JlIGNsb3NpbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoICdkaXYubW9kYWwtb3BlbiAuY2xvc2UnICkuZGF0YSggJ3RhcmdldCcgKSApLFxuXG5cdFx0XHQvLyBGaW5kIHRoZSBpZnJhbWUgaW4gdGhlICRtb2RhbCBvYmplY3QuXG5cdFx0XHQkaWZyYW1lID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICk7XG5cblx0XHQvLyBPbmx5IGRvIHRoaXMgaWYgdGhlcmUgYXJlIGFueSBpZnJhbWVzLlxuXHRcdGlmICggJGlmcmFtZS5sZW5ndGggKSB7XG5cblx0XHRcdC8vIEdldCB0aGUgaWZyYW1lIHNyYyBVUkwuXG5cdFx0XHRsZXQgdXJsID0gJGlmcmFtZS5hdHRyKCAnc3JjJyApO1xuXG5cdFx0XHQvLyBSZW1vdmluZy9SZWFkZGluZyB0aGUgVVJMIHdpbGwgZWZmZWN0aXZlbHkgYnJlYWsgdGhlIFlvdVR1YmUgQVBJLlxuXHRcdFx0Ly8gU28gbGV0J3Mgbm90IGRvIHRoYXQgd2hlbiB0aGUgaWZyYW1lIFVSTCBjb250YWlucyB0aGUgZW5hYmxlanNhcGkgcGFyYW1ldGVyLlxuXHRcdFx0aWYgKCAhIHVybC5pbmNsdWRlcyggJ2VuYWJsZWpzYXBpPTEnICkgKSB7XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBzb3VyY2UgVVJMLCB0aGVuIGFkZCBpdCBiYWNrLCBzbyB0aGUgdmlkZW8gY2FuIGJlIHBsYXllZCBhZ2FpbiBsYXRlci5cblx0XHRcdFx0JGlmcmFtZS5hdHRyKCAnc3JjJywgJycgKS5hdHRyKCAnc3JjJywgdXJsICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFVzZSB0aGUgWW91VHViZSBBUEkgdG8gc3RvcCB0aGUgdmlkZW8uXG5cdFx0XHRcdCRwbGF5ZXIuc3RvcFZpZGVvKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmluYWxseSwgaGlkZSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgYm9keSBjbGFzcy5cblx0XHRhcHAuJGMuYm9keS5yZW1vdmVDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBSZXZlcnQgZm9jdXMgYmFjayB0byB0b2dnbGUgZWxlbWVudFxuXHRcdCRtb2RhbFRvZ2dsZS5mb2N1cygpO1xuXG5cdH07XG5cblx0Ly8gQ2xvc2UgaWYgXCJlc2NcIiBrZXkgaXMgcHJlc3NlZC5cblx0YXBwLmVzY0tleUNsb3NlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggMjcgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRhcHAuY2xvc2VNb2RhbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDbG9zZSBpZiB0aGUgdXNlciBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgbW9kYWxcblx0YXBwLmNsb3NlTW9kYWxCeUNsaWNrID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gSWYgdGhlIHBhcmVudCBjb250YWluZXIgaXMgTk9UIHRoZSBtb2RhbCBkaWFsb2cgY29udGFpbmVyLCBjbG9zZSB0aGUgbW9kYWxcblx0XHRpZiAoICEgJCggZXZlbnQudGFyZ2V0ICkucGFyZW50cyggJ2RpdicgKS5oYXNDbGFzcyggJ21vZGFsLWRpYWxvZycgKSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIFRyYXAgdGhlIGtleWJvYXJkIGludG8gYSBtb2RhbCB3aGVuIG9uZSBpcyBhY3RpdmUuXG5cdGFwcC50cmFwS2V5Ym9hcmRNYXliZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIFdlIG9ubHkgbmVlZCB0byBkbyBzdHVmZiB3aGVuIHRoZSBtb2RhbCBpcyBvcGVuIGFuZCB0YWIgaXMgcHJlc3NlZC5cblx0XHRpZiAoIDkgPT09IGV2ZW50LndoaWNoICYmIDAgPCAkKCAnLm1vZGFsLW9wZW4nICkubGVuZ3RoICkge1xuXHRcdFx0bGV0ICRmb2N1c2VkID0gJCggJzpmb2N1cycgKSxcblx0XHRcdFx0Zm9jdXNJbmRleCA9ICRmb2N1c2FibGVDaGlsZHJlbi5pbmRleCggJGZvY3VzZWQgKTtcblxuXHRcdFx0aWYgKCAwID09PSBmb2N1c0luZGV4ICYmIGV2ZW50LnNoaWZ0S2V5ICkge1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgaGVsZCB3aGVuIHByZXNzaW5nIHRhYiwgZ28gYmFjayB0byBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxIF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZXZlbnQuc2hpZnRLZXkgJiYgZm9jdXNJbmRleCA9PT0gJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgbGFzdCBmb2N1c2FibGUgZWxlbWVudCwgYW5kIHNoaWZ0IGlzIG5vdCBoZWxkLCBnbyBiYWNrIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEhvb2sgaW50byBZb3VUdWJlIDxpZnJhbWU+LlxuXHRhcHAub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgJG1vZGFsID0gJCggJ2Rpdi5tb2RhbCcgKSxcblx0XHRcdCRpZnJhbWVpZCA9ICRtb2RhbC5maW5kKCAnaWZyYW1lJyApLmF0dHIoICdpZCcgKTtcblxuXHRcdCRwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCAkaWZyYW1laWQsIHtcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHQnb25SZWFkeSc6IGFwcC5vblBsYXllclJlYWR5LFxuXHRcdFx0XHQnb25TdGF0ZUNoYW5nZSc6IGFwcC5vblBsYXllclN0YXRlQ2hhbmdlXG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIERvIHNvbWV0aGluZyBvbiBwbGF5ZXIgcmVhZHkuXG5cdGFwcC5vblBsYXllclJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciBzdGF0ZSBjaGFuZ2UuXG5cdGFwcC5vblBsYXllclN0YXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTZXQgZm9jdXMgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IGluc2lkZSBvZiB0aGUgbW9kYWwgdGhlIHBsYXllciBpcyBpbi5cblx0XHQkKCBldmVudC50YXJnZXQuYSApLnBhcmVudHMoICcubW9kYWwnICkuZmluZCggJ2EsIDppbnB1dCwgW3RhYmluZGV4XScgKS5maXJzdCgpLmZvY3VzKCk7XG5cdH07XG5cblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc01vZGFsICkgKTtcbiIsIi8qKlxuICogRmlsZTogbmF2aWdhdGlvbi1wcmltYXJ5LmpzXG4gKlxuICogSGVscGVycyBmb3IgdGhlIHByaW1hcnkgbmF2aWdhdGlvbi5cbiAqL1xud2luZG93Lndkc1ByaW1hcnlOYXZpZ2F0aW9uID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHN1Yk1lbnVDb250YWluZXI6ICQoICcubWFpbi1uYXZpZ2F0aW9uIC5zdWItbWVudScgKSxcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1haW4tbmF2aWdhdGlvbiBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRG93bkFycm93ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICdhJyApLm9uKCAnZm9jdXNpbiBmb2N1c291dCcsIGFwcC50b2dnbGVGb2N1cyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBZGQgdGhlIGRvd24gYXJyb3cgdG8gc3VibWVudSBwYXJlbnRzLlxuXHRhcHAuYWRkRG93bkFycm93ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICc+IGEnICkuYXBwZW5kKCAnPHNwYW4gY2xhc3M9XCJjYXJldC1kb3duXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPicgKTtcblx0fTtcblxuXHQvLyBUb2dnbGUgdGhlIGZvY3VzIGNsYXNzIG9uIHRoZSBsaW5rIHBhcmVudC5cblx0YXBwLnRvZ2dsZUZvY3VzID0gZnVuY3Rpb24oKSB7XG5cdFx0JCggdGhpcyApLnBhcmVudHMoICdsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApLnRvZ2dsZUNsYXNzKCAnZm9jdXMnICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1ByaW1hcnlOYXZpZ2F0aW9uICkgKTtcbiIsIi8qKlxyXG4gKiBGaWxlOiBvZmYtY2FudmFzLmpzXHJcbiAqXHJcbiAqIEhlbHAgZGVhbCB3aXRoIHRoZSBvZmYtY2FudmFzIG1vYmlsZSBtZW51LlxyXG4gKi9cclxud2luZG93Lndkc29mZkNhbnZhcyA9IHt9O1xyXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcclxuXHJcblx0Ly8gQ29uc3RydWN0b3IuXHJcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC5jYWNoZSgpO1xyXG5cclxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XHJcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXHJcblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMgPSB7XHJcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxyXG5cdFx0XHRvZmZDYW52YXNDbG9zZTogJCggJy5vZmYtY2FudmFzLWNsb3NlJyApLFxyXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInICksXHJcblx0XHRcdG9mZkNhbnZhc09wZW46ICQoICcub2ZmLWNhbnZhcy1vcGVuJyApLFxyXG5cdFx0XHRvZmZDYW52YXNTY3JlZW46ICQoICcub2ZmLWNhbnZhcy1zY3JlZW4nIClcclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxyXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcclxuXHRcdGFwcC4kYy5vZmZDYW52YXNDbG9zZS5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XHJcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZW9mZkNhbnZhcyApO1xyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XHJcblx0fTtcclxuXHJcblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xyXG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIubGVuZ3RoO1xyXG5cdH07XHJcblxyXG5cdC8vIFRvIHNob3cgb3Igbm90IHRvIHNob3c/XHJcblx0YXBwLnRvZ2dsZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdGlmICggJ3RydWUnID09PSAkKCB0aGlzICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XHJcblx0XHRcdGFwcC5jbG9zZW9mZkNhbnZhcygpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YXBwLm9wZW5vZmZDYW52YXMoKTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0Ly8gU2hvdyB0aGF0IGRyYXdlciFcclxuXHRhcHAub3Blbm9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XHJcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XHJcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcclxuXHJcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcclxuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYXR0ciggJ2FyaWEtaGlkZGVuJywgZmFsc2UgKTtcclxuXHR9O1xyXG5cclxuXHQvLyBDbG9zZSB0aGF0IGRyYXdlciFcclxuXHRhcHAuY2xvc2VvZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XHJcblxyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hdHRyKCAnYXJpYS1oaWRkZW4nLCB0cnVlICk7XHJcblxyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uZm9jdXMoKTtcclxuXHR9O1xyXG5cclxuXHQvLyBDbG9zZSBkcmF3ZXIgaWYgXCJlc2NcIiBrZXkgaXMgcHJlc3NlZC5cclxuXHRhcHAuZXNjS2V5Q2xvc2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XHJcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xyXG5cdFx0XHRhcHAuY2xvc2VvZmZDYW52YXMoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBFbmdhZ2UhXHJcblx0JCggYXBwLmluaXQgKTtcclxuXHJcbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2Rzb2ZmQ2FudmFzICkgKTtcclxuIiwiLyoqXG4gKiBGaWxlIHNraXAtbGluay1mb2N1cy1maXguanMuXG4gKlxuICogSGVscHMgd2l0aCBhY2Nlc3NpYmlsaXR5IGZvciBrZXlib2FyZCBvbmx5IHVzZXJzLlxuICpcbiAqIExlYXJuIG1vcmU6IGh0dHBzOi8vZ2l0LmlvL3ZXZHIyXG4gKi9cbiggZnVuY3Rpb24oKSB7XG5cdHZhciBpc1dlYmtpdCA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICd3ZWJraXQnICksXG5cdFx0aXNPcGVyYSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdvcGVyYScgKSxcblx0XHRpc0llID0gLTEgPCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ21zaWUnICk7XG5cblx0aWYgKCAoIGlzV2Via2l0IHx8IGlzT3BlcmEgfHwgaXNJZSApICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGlkID0gbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoIDEgKSxcblx0XHRcdFx0ZWxlbWVudDtcblxuXHRcdFx0aWYgKCAhICggL15bQS16MC05Xy1dKyQvICkudGVzdCggaWQgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cblx0XHRcdGlmICggZWxlbWVudCApIHtcblx0XHRcdFx0aWYgKCAhICggL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pICkudGVzdCggZWxlbWVudC50YWdOYW1lICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50YWJJbmRleCA9IC0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlICk7XG5cdH1cbn0oKSApO1xuIiwiLyoqXHJcbiAqIE1ha2UgdGFibGVzIHJlc3BvbnNpdmUgYWdhaW4uXHJcbiAqXHJcbiAqIEBhdXRob3IgSGFyaXMgWnVsZmlxYXJcclxuICovXHJcbndpbmRvdy53ZHNUYWJsZXMgPSB7fTtcclxuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XHJcblxyXG5cdC8vIENvbnN0cnVjdG9yXHJcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC5jYWNoZSgpO1xyXG5cclxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XHJcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3NcclxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC4kYyA9IHtcclxuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcclxuXHRcdFx0dGFibGU6ICQoICd0YWJsZScgKVxyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcclxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRGF0YUxhYmVsICk7XHJcblx0fTtcclxuXHJcblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xyXG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGFwcC4kYy50YWJsZS5sZW5ndGg7XHJcblx0fTtcclxuXHJcblx0Ly8gQWRkcyBkYXRhLWxhYmVsIHRvIHRkIGJhc2VkIG9uIHRoLlxyXG5cdGFwcC5hZGREYXRhTGFiZWwgPSBmdW5jdGlvbigpIHtcclxuXHRcdGNvbnN0IHRhYmxlID0gYXBwLiRjLnRhYmxlO1xyXG5cdFx0Y29uc3QgdGFibGVIZWFkZXJzID0gdGFibGUuZmluZCggJ3RoZWFkIHRoJyApO1xyXG5cdFx0Y29uc3QgdGFibGVSb3cgPSB0YWJsZS5maW5kKCAndGJvZHkgdHInICk7XHJcblxyXG5cdFx0dGFibGVSb3cuZWFjaCggZnVuY3Rpb24oKSB7XHJcblx0XHRcdGNvbnN0IHRkID0gJCggdGhpcyApLmZpbmQoICd0ZCcgKTtcclxuXHJcblx0XHRcdHRkLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcclxuXHRcdFx0XHRpZiAoICQoIHRhYmxlSGVhZGVycy5nZXQoIGluZGV4ICkgKSApIHtcclxuXHRcdFx0XHRcdCQoIHRoaXMgKS5hdHRyKCAnZGF0YS1sYWJlbCcsICQoIHRhYmxlSGVhZGVycy5nZXQoIGluZGV4ICkgKS50ZXh0KCkgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHJcblx0Ly8gRW5nYWdlXHJcblx0JCggYXBwLmluaXQgKTtcclxuXHJcbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1RhYmxlcyApICk7XHJcbiIsIi8qKlxyXG4gKiBWaWRlbyBQbGF5YmFjayBTY3JpcHQuXHJcbiAqL1xyXG53aW5kb3cuV0RTVmlkZW9CYWNrZ3JvdW5kT2JqZWN0ID0ge307XHJcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xyXG5cclxuXHQvLyBDb25zdHJ1Y3Rvci5cclxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwLmNhY2hlKCk7XHJcblxyXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcclxuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cclxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC4kYyA9IHtcclxuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcclxuXHRcdFx0dmlkZW9CdXR0b246ICQoICcudmlkZW8tdG9nZ2xlJyApXHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cclxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwLiRjLnZpZGVvQnV0dG9uLm9uKCAnY2xpY2snLCBhcHAuZG9Ub2dnbGVQbGF5YmFjayApO1xyXG5cdH07XHJcblxyXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cclxuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBhcHAuJGMudmlkZW9CdXR0b24ubGVuZ3RoO1xyXG5cdH07XHJcblxyXG5cdC8vIFZpZGVvIFBsYXliYWNrLlxyXG5cdGFwcC5kb1RvZ2dsZVBsYXliYWNrID0gZnVuY3Rpb24oKSB7XHJcblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5jb250ZW50LWJsb2NrJyApLnRvZ2dsZUNsYXNzKCAndmlkZW8tdG9nZ2xlZCcgKTtcclxuXHJcblx0XHRpZiAoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmNvbnRlbnQtYmxvY2snICkuaGFzQ2xhc3MoICd2aWRlby10b2dnbGVkJyApICkge1xyXG5cdFx0XHQkKCB0aGlzICkuc2libGluZ3MoICcudmlkZW8tYmFja2dyb3VuZCcgKS50cmlnZ2VyKCAncGF1c2UnICk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCB0aGlzICkuc2libGluZ3MoICcudmlkZW8tYmFja2dyb3VuZCcgKS50cmlnZ2VyKCAncGxheScgKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBFbmdhZ2UhXHJcblx0JCggYXBwLmluaXQgKTtcclxuXHJcbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuV0RTVmlkZW9CYWNrZ3JvdW5kT2JqZWN0ICkgKTtcclxuIiwiLyoqXG4gKiBGaWxlIHdpbmRvdy1yZWFkeS5qc1xuICpcbiAqIEFkZCBhIFwicmVhZHlcIiBjbGFzcyB0byA8Ym9keT4gd2hlbiB3aW5kb3cgaXMgcmVhZHkuXG4gKi9cbndpbmRvdy53ZHNXaW5kb3dSZWFkeSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0fTtcblxuXHQvLyBDYWNoZSBkb2N1bWVudCBlbGVtZW50cy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J3dpbmRvdyc6ICQoIHdpbmRvdyApLFxuXHRcdFx0J2JvZHknOiAkKCBkb2N1bWVudC5ib2R5IClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93LmxvYWQoIGFwcC5hZGRCb2R5Q2xhc3MgKTtcblx0fTtcblxuXHQvLyBBZGQgYSBjbGFzcyB0byA8Ym9keT4uXG5cdGFwcC5hZGRCb2R5Q2xhc3MgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5hZGRDbGFzcyggJ3JlYWR5JyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzV2luZG93UmVhZHkgKSApO1xuIl19
