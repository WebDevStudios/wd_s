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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyIsImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ0YWJsZS5qcyIsInZpZGVvLmpzIiwid2luZG93LXJlYWR5LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImFjY29yZGlvbkJsb2NrVG9nZ2xlIiwiJCIsImFwcCIsImluaXQiLCJjYWNoZSIsIm1lZXRzUmVxdWlyZW1lbnRzIiwiYmluZEV2ZW50cyIsIiRjIiwiaHRtbCIsImFjY29yZGlvbiIsIml0ZW1zIiwiaGVhZGVycyIsImNvbnRlbnRzIiwiYnV0dG9uIiwiYW5jaG9ySUQiLCJsb2NhdGlvbiIsImhhc2giLCJvbiIsInRvZ2dsZUFjY29yZGlvbiIsIm9wZW5IYXNoQWNjb3JkaW9uIiwibGVuZ3RoIiwicGFyZW50cyIsInRvZ2dsZUNsYXNzIiwiaXNFeHBhbmRlZCIsImhhc0NsYXNzIiwiZmluZCIsImF0dHIiLCJub3QiLCJyZW1vdmVDbGFzcyIsInNlbGVjdG9yIiwidHJpZ2dlciIsImFkbWluQmFySGVpZ2h0IiwiaGVpZ2h0IiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsImpRdWVyeSIsIndkc0Nhcm91c2VsIiwiY2Fyb3VzZWxPcHRpb25zIiwiYXV0b3BsYXkiLCJhdXRvcGxheVNwZWVkIiwiYXJyb3dzIiwiZG90cyIsImZvY3VzT25TZWxlY3QiLCJ3YWl0Rm9yQW5pbWF0ZSIsInRoZUNhcm91c2VsIiwiZG9TbGljayIsImRvRmlyc3RBbmltYXRpb24iLCJmaXJzdFNsaWRlIiwiZmlyc3RTbGlkZUNvbnRlbnQiLCJmaXJzdEFuaW1hdGlvbiIsImFkZENsYXNzIiwiZG9BbmltYXRpb24iLCJzbGlkZXMiLCJhY3RpdmVTbGlkZSIsImFjdGl2ZUNvbnRlbnQiLCJhbmltYXRpb25DbGFzcyIsInNwbGl0QW5pbWF0aW9uIiwic3BsaXQiLCJhbmltYXRpb25UcmlnZ2VyIiwiZWFjaCIsInNsaWRlQ29udGVudCIsImxhc3RDbGFzcyIsInBvcCIsInBsYXlCYWNrZ3JvdW5kVmlkZW9zIiwicGxheSIsImFkZFBhdXNlYnV0dG9uIiwiJHBhdXNlQnV0dG9uIiwidGV4dCIsIiRjYXJvdXNlbCIsInNsaWNrIiwid2RzaTE4biIsInBhdXNlQnV0dG9uVGV4dFBhdXNlIiwid3AiLCJhMTF5Iiwic3BlYWsiLCJwYXVzZUJ1dHRvblNwZWFrUmVzdW1lZCIsInBhdXNlQnV0dG9uVGV4dFBsYXkiLCJwYXVzZUJ1dHRvblNwZWFrUGF1c2VkIiwiYXBwZW5kVG8iLCJiaW5kQnV0dG9uQ2xpY2tFdmVudHMiLCIkYnV0dG9ucyIsIm5vdGlmeVNsaWRlQ2hhbmdlIiwiJHNsaWNrIiwiY3VycmVudFNsaWRlIiwiYWN0aXZlU2xpZGVCdXR0b24iLCJyZXBsYWNlIiwic2xpZGVDb3VudCIsIlNob3dIaWRlU2VhcmNoRm9ybSIsImJvZHkiLCJoZWFkZXJTZWFyY2hGb3JtIiwic2hvd0hpZGVTZWFyY2hGb3JtIiwiaGlkZVNlYXJjaEZvcm0iLCJldmVudCIsInRhcmdldCIsImRvY3VtZW50IiwiY2xhc3NOYW1lIiwid2RzTW9iaWxlTWVudSIsInN1Yk1lbnVDb250YWluZXIiLCJzdWJTdWJNZW51Q29udGFpbmVyIiwic3ViTWVudVBhcmVudEl0ZW0iLCJvZmZDYW52YXNDb250YWluZXIiLCJhZGREb3duQXJyb3ciLCJ0b2dnbGVTdWJtZW51IiwicmVzZXRTdWJNZW51IiwiZm9yY2VDbG9zZVN1Ym1lbnVzIiwiaXMiLCJzbGlkZU91dFN1Yk1lbnVzIiwiZWwiLCJwYXJlbnQiLCJhZnRlciIsImUiLCJzdWJNZW51IiwiY2hpbGRyZW4iLCIkdGFyZ2V0Iiwib3BlblN1Ym1lbnUiLCJmb2N1cyIsImNzcyIsInVuYmluZCIsImJpbmQiLCJwcmV2ZW50RGVmYXVsdCIsIndkc01vZGFsIiwiJG1vZGFsVG9nZ2xlIiwiJGZvY3VzYWJsZUNoaWxkcmVuIiwiJHBsYXllciIsIiR0YWciLCJjcmVhdGVFbGVtZW50IiwiJGZpcnN0U2NyaXB0VGFnIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJZVCIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJvcGVuTW9kYWwiLCJjbG9zZU1vZGFsIiwiZXNjS2V5Q2xvc2UiLCJjbG9zZU1vZGFsQnlDbGljayIsInRyYXBLZXlib2FyZE1heWJlIiwiJG1vZGFsIiwiZGF0YSIsIiRpZnJhbWUiLCJ1cmwiLCJpbmNsdWRlcyIsInN0b3BWaWRlbyIsImtleUNvZGUiLCJ3aGljaCIsIiRmb2N1c2VkIiwiZm9jdXNJbmRleCIsImluZGV4Iiwic2hpZnRLZXkiLCJvbllvdVR1YmVJZnJhbWVBUElSZWFkeSIsIiRpZnJhbWVpZCIsIlBsYXllciIsImV2ZW50cyIsIm9uUGxheWVyUmVhZHkiLCJvblBsYXllclN0YXRlQ2hhbmdlIiwiYSIsImZpcnN0Iiwid2RzUHJpbWFyeU5hdmlnYXRpb24iLCJ0b2dnbGVGb2N1cyIsImFwcGVuZCIsIndkc29mZkNhbnZhcyIsIm9mZkNhbnZhc0Nsb3NlIiwib2ZmQ2FudmFzT3BlbiIsIm9mZkNhbnZhc1NjcmVlbiIsImNsb3Nlb2ZmQ2FudmFzIiwidG9nZ2xlb2ZmQ2FudmFzIiwib3Blbm9mZkNhbnZhcyIsImlzV2Via2l0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwiaXNPcGVyYSIsImlzSWUiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZCIsInN1YnN0cmluZyIsImVsZW1lbnQiLCJ0ZXN0IiwidGFnTmFtZSIsInRhYkluZGV4Iiwid2RzVGFibGVzIiwidGFibGUiLCJhZGREYXRhTGFiZWwiLCJ0YWJsZUhlYWRlcnMiLCJ0YWJsZVJvdyIsInRkIiwiZ2V0IiwiV0RTVmlkZW9CYWNrZ3JvdW5kT2JqZWN0IiwidmlkZW9CdXR0b24iLCJkb1RvZ2dsZVBsYXliYWNr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QUFKLENBQU9SLE1BQVAsQ0FBY29NLElBQWQsQ0FBb0JqTSxJQUFJa00sWUFBeEI7QUFDQSxFQUZEOztBQUlBO0FBQ0FsTSxLQUFJa00sWUFBSixHQUFtQixZQUFXO0FBQzdCbE0sTUFBSUssRUFBSixDQUFPbUYsSUFBUCxDQUFZdEMsUUFBWixDQUFzQixPQUF0QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQW5ELEdBQUdDLElBQUlDLElBQVA7QUFDQSxDQTVCQyxFQTRCQ0osTUE1QkQsRUE0QlNzQyxNQTVCVCxFQTRCaUJ0QyxPQUFPbU0sY0E1QnhCLENBQUYiLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBBY2NvcmRpb24gYmxvY2sgZnVuY3Rpb25hbGl0eVxyXG4gKlxyXG4gKiBAYXV0aG9yIFNoYW5ub24gTWFjTWlsbGFuLCBDb3JleSBDb2xsaW5zXHJcbiAqL1xyXG53aW5kb3cuYWNjb3JkaW9uQmxvY2tUb2dnbGUgPSB7fTtcclxuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XHJcblxyXG5cdC8vIENvbnN0cnVjdG9yXHJcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC5jYWNoZSgpO1xyXG5cclxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XHJcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3NcclxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC4kYyA9IHtcclxuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcclxuXHRcdFx0aHRtbDogJCggJ2h0bWwnICksXHJcblx0XHRcdGFjY29yZGlvbjogJCggJy5hY2NvcmRpb24nICksXHJcblx0XHRcdGl0ZW1zOiAkKCAnLmFjY29yZGlvbi1pdGVtJyApLFxyXG5cdFx0XHRoZWFkZXJzOiAkKCAnLmFjY29yZGlvbi1pdGVtLWhlYWRlcicgKSxcclxuXHRcdFx0Y29udGVudHM6ICQoICcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcgKSxcclxuXHRcdFx0YnV0dG9uOiAkKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKSxcclxuXHRcdFx0YW5jaG9ySUQ6ICQoIHdpbmRvdy5sb2NhdGlvbi5oYXNoIClcclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXHJcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC4kYy5oZWFkZXJzLm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsIGFwcC50b2dnbGVBY2NvcmRpb24gKTtcclxuXHRcdGFwcC4kYy5idXR0b24ub24oICdjbGljayB0b3VjaHN0YXJ0JywgYXBwLnRvZ2dsZUFjY29yZGlvbiApO1xyXG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAub3Blbkhhc2hBY2NvcmRpb24gKTtcclxuXHR9O1xyXG5cclxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XHJcblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gYXBwLiRjLmFjY29yZGlvbi5sZW5ndGg7XHJcblx0fTtcclxuXHJcblx0YXBwLnRvZ2dsZUFjY29yZGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vIEFkZCB0aGUgb3BlbiBjbGFzcyB0byB0aGUgaXRlbS5cclxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnb3BlbicgKTtcclxuXHJcblx0XHQvLyBJcyB0aGlzIG9uZSBleHBhbmRlZD9cclxuXHRcdGxldCBpc0V4cGFuZGVkID0gJCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuaGFzQ2xhc3MoICdvcGVuJyApO1xyXG5cclxuXHRcdC8vIFNldCB0aGlzIGJ1dHRvbidzIGFyaWEtZXhwYW5kZWQgdmFsdWUuXHJcblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGlzRXhwYW5kZWQgPyAndHJ1ZScgOiAnZmFsc2UnICk7XHJcblxyXG5cdFx0Ly8gU2V0IGFsbCBvdGhlciBpdGVtcyBpbiB0aGlzIGJsb2NrIHRvIGFyaWEtaGlkZGVuPXRydWUuXHJcblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24tYmxvY2snICkuZmluZCggJy5hY2NvcmRpb24taXRlbS1jb250ZW50JyApLm5vdCggJCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkgKS5hdHRyKCAnYXJpYS1oaWRkZW4nLCAndHJ1ZScgKTtcclxuXHJcblx0XHQvLyBTZXQgdGhpcyBpdGVtIHRvIGFyaWEtaGlkZGVuPWZhbHNlLlxyXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuZmluZCggJy5hY2NvcmRpb24taXRlbS1jb250ZW50JyApLmF0dHIoICdhcmlhLWhpZGRlbicsIGlzRXhwYW5kZWQgPyAnZmFsc2UnIDogJ3RydWUnICk7XHJcblxyXG5cdFx0Ly8gSGlkZSB0aGUgb3RoZXIgcGFuZWxzLlxyXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWJsb2NrJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0nICkubm90KCAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKSApLnJlbW92ZUNsYXNzKCAnb3BlbicgKTtcclxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS5ub3QoICQoIHRoaXMgKSApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cclxuXHRhcHAub3Blbkhhc2hBY2NvcmRpb24gPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRpZiAoICEgYXBwLiRjLmFuY2hvcklELnNlbGVjdG9yICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVHJpZ2dlciBhIGNsaWNrIG9uIHRoZSBidXR0b24gY2xvc2VzdCB0byB0aGlzIGFjY29yZGlvbi5cclxuXHRcdGFwcC4kYy5hbmNob3JJRC5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLnRyaWdnZXIoICdjbGljaycgKTtcclxuXHJcblx0XHQvLyBOb3Qgc2V0dGluZyBhIGNhY2hlZCB2YXJpYWJsZSBhcyBpdCBkb2Vzbid0IHNlZW0gdG8gZ3JhYiB0aGUgaGVpZ2h0IHByb3Blcmx5LlxyXG5cdFx0Y29uc3QgYWRtaW5CYXJIZWlnaHQgPSAkKCAnI3dwYWRtaW5iYXInICkubGVuZ3RoID8gJCggJyN3cGFkbWluYmFyJyApLmhlaWdodCgpIDogMDtcclxuXHJcblx0XHQvLyBBbmltYXRlIHRvIHRoZSBkaXYgZm9yIGEgbmljZXIgZXhwZXJpZW5jZS5cclxuXHRcdGFwcC4kYy5odG1sLmFuaW1hdGUoIHtcclxuXHRcdFx0c2Nyb2xsVG9wOiBhcHAuJGMuYW5jaG9ySUQub2Zmc2V0KCkudG9wIC0gYWRtaW5CYXJIZWlnaHRcclxuXHRcdH0sICdzbG93JyApO1xyXG5cdH07XHJcblxyXG5cdC8vIEVuZ2FnZVxyXG5cdGFwcC5pbml0KCk7XHJcblxyXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy5hY2NvcmRpb25CbG9ja1RvZ2dsZSApICk7XHJcbiIsIi8qIGdsb2JhbCB3ZHNpMThuOiB0cnVlICovXG4vKipcbiAqIEZpbGUgY2Fyb3VzZWwuanNcbiAqXG4gKiBEZWFsIHdpdGggdGhlIFNsaWNrIGNhcm91c2VsLlxuICovXG53aW5kb3cud2RzQ2Fyb3VzZWwgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdGNvbnN0IGNhcm91c2VsT3B0aW9ucyA9IHtcblx0XHRhdXRvcGxheTogdHJ1ZSxcblx0XHRhdXRvcGxheVNwZWVkOiA1MDAwLFxuXHRcdGFycm93czogdHJ1ZSxcblx0XHRkb3RzOiB0cnVlLFxuXHRcdGZvY3VzT25TZWxlY3Q6IHRydWUsXG5cdFx0d2FpdEZvckFuaW1hdGU6IHRydWVcblx0fTtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHRoZUNhcm91c2VsOiAkKCAnLmNhcm91c2VsLWJsb2NrJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuZG9TbGljayApO1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmRvRmlyc3RBbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMudGhlQ2Fyb3VzZWwubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFuaW1hdGUgdGhlIGZpcnN0IHNsaWRlIG9uIHdpbmRvdyBsb2FkLlxuXHRhcHAuZG9GaXJzdEFuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IHRoZSBmaXJzdCBzbGlkZSBjb250ZW50IGFyZWEgYW5kIGFuaW1hdGlvbiBhdHRyaWJ1dGUuXG5cdFx0bGV0IGZpcnN0U2xpZGUgPSBhcHAuJGMudGhlQ2Fyb3VzZWwuZmluZCggJ1tkYXRhLXNsaWNrLWluZGV4PTBdJyApLFxuXHRcdFx0Zmlyc3RTbGlkZUNvbnRlbnQgPSBmaXJzdFNsaWRlLmZpbmQoICcuc2xpZGUtY29udGVudCcgKSxcblx0XHRcdGZpcnN0QW5pbWF0aW9uID0gZmlyc3RTbGlkZUNvbnRlbnQuYXR0ciggJ2RhdGEtYW5pbWF0aW9uJyApO1xuXG5cdFx0Ly8gQWRkIHRoZSBhbmltYXRpb24gY2xhc3MgdG8gdGhlIGZpcnN0IHNsaWRlLlxuXHRcdGZpcnN0U2xpZGVDb250ZW50LmFkZENsYXNzKCBmaXJzdEFuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIEFuaW1hdGUgdGhlIHNsaWRlIGNvbnRlbnQuXG5cdGFwcC5kb0FuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCBzbGlkZXMgPSAkKCAnLnNsaWRlJyApLFxuXHRcdFx0YWN0aXZlU2xpZGUgPSAkKCAnLnNsaWNrLWN1cnJlbnQnICksXG5cdFx0XHRhY3RpdmVDb250ZW50ID0gYWN0aXZlU2xpZGUuZmluZCggJy5zbGlkZS1jb250ZW50JyApLFxuXG5cdFx0XHQvLyBUaGlzIGlzIGEgc3RyaW5nIGxpa2Ugc286ICdhbmltYXRlZCBzb21lQ3NzQ2xhc3MnLlxuXHRcdFx0YW5pbWF0aW9uQ2xhc3MgPSBhY3RpdmVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKSxcblx0XHRcdHNwbGl0QW5pbWF0aW9uID0gYW5pbWF0aW9uQ2xhc3Muc3BsaXQoICcgJyApLFxuXG5cdFx0XHQvLyBUaGlzIGlzIHRoZSAnYW5pbWF0ZWQnIGNsYXNzLlxuXHRcdFx0YW5pbWF0aW9uVHJpZ2dlciA9IHNwbGl0QW5pbWF0aW9uWzBdO1xuXG5cdFx0Ly8gR28gdGhyb3VnaCBlYWNoIHNsaWRlIHRvIHNlZSBpZiB3ZSd2ZSBhbHJlYWR5IHNldCBhbmltYXRpb24gY2xhc3Nlcy5cblx0XHRzbGlkZXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRsZXQgc2xpZGVDb250ZW50ID0gJCggdGhpcyApLmZpbmQoICcuc2xpZGUtY29udGVudCcgKTtcblxuXHRcdFx0Ly8gSWYgd2UndmUgc2V0IGFuaW1hdGlvbiBjbGFzc2VzIG9uIGEgc2xpZGUsIHJlbW92ZSB0aGVtLlxuXHRcdFx0aWYgKCBzbGlkZUNvbnRlbnQuaGFzQ2xhc3MoICdhbmltYXRlZCcgKSApIHtcblxuXHRcdFx0XHQvLyBHZXQgdGhlIGxhc3QgY2xhc3MsIHdoaWNoIGlzIHRoZSBhbmltYXRlLmNzcyBjbGFzcy5cblx0XHRcdFx0bGV0IGxhc3RDbGFzcyA9IHNsaWRlQ29udGVudFxuXHRcdFx0XHRcdC5hdHRyKCAnY2xhc3MnIClcblx0XHRcdFx0XHQuc3BsaXQoICcgJyApXG5cdFx0XHRcdFx0LnBvcCgpO1xuXG5cdFx0XHRcdC8vIFJlbW92ZSBib3RoIGFuaW1hdGlvbiBjbGFzc2VzLlxuXHRcdFx0XHRzbGlkZUNvbnRlbnQucmVtb3ZlQ2xhc3MoIGxhc3RDbGFzcyApLnJlbW92ZUNsYXNzKCBhbmltYXRpb25UcmlnZ2VyICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gQWRkIGFuaW1hdGlvbiBjbGFzc2VzIGFmdGVyIHNsaWRlIGlzIGluIHZpZXcuXG5cdFx0YWN0aXZlQ29udGVudC5hZGRDbGFzcyggYW5pbWF0aW9uQ2xhc3MgKTtcblx0fTtcblxuXHQvLyBBbGxvdyBiYWNrZ3JvdW5kIHZpZGVvcyB0byBhdXRvcGxheS5cblx0YXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBHZXQgYWxsIHRoZSB2aWRlb3MgaW4gb3VyIHNsaWRlcyBvYmplY3QuXG5cdFx0JCggJ3ZpZGVvJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBMZXQgdGhlbSBhdXRvcGxheS4gVE9ETzogUG9zc2libHkgY2hhbmdlIHRoaXMgbGF0ZXIgdG8gb25seSBwbGF5IHRoZSB2aXNpYmxlIHNsaWRlIHZpZGVvLlxuXHRcdFx0dGhpcy5wbGF5KCk7XG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIEFwcGVuZCBhIHBhdXNlIGJ1dHRvbiB0byB0aGUgY2Fyb3VzZWwuXG5cdGFwcC5hZGRQYXVzZWJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRwYXVzZUJ1dHRvbiA9ICQoICc8YnV0dG9uPicsIHsgJ2NsYXNzJzogJ3NsaWNrLXBhdXNlJywgJ3R5cGUnOiAnYnV0dG9uJyB9ICkudGV4dCggJ1BhdXNlJyApLFxuXHRcdFx0JGNhcm91c2VsID0gJCggdGhpcyApO1xuXG5cdFx0JHBhdXNlQnV0dG9uLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKCAoICRjYXJvdXNlbCApLmhhc0NsYXNzKCAncGF1c2VkJyApICkge1xuXHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soICdwbGF5JyApLnJlbW92ZUNsYXNzKCAncGF1c2VkJyApO1xuXHRcdFx0XHQkcGF1c2VCdXR0b24udGV4dCggd2RzaTE4bi5wYXVzZUJ1dHRvblRleHRQYXVzZSApO1xuXHRcdFx0XHR3cC5hMTF5LnNwZWFrKCB3ZHNpMThuLnBhdXNlQnV0dG9uU3BlYWtSZXN1bWVkICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soICdwYXVzZScgKS5hZGRDbGFzcyggJ3BhdXNlZCcgKTtcblx0XHRcdFx0JHBhdXNlQnV0dG9uLnRleHQoIHdkc2kxOG4ucGF1c2VCdXR0b25UZXh0UGxheSApO1xuXHRcdFx0XHR3cC5hMTF5LnNwZWFrKCB3ZHNpMThuLnBhdXNlQnV0dG9uU3BlYWtQYXVzZWQgKTtcblx0XHRcdH1cblxuXHRcdH0gKTtcblxuXHRcdCRwYXVzZUJ1dHRvbi5hcHBlbmRUbyggJGNhcm91c2VsICk7XG5cdH07XG5cblx0Ly8gQmluZCBjbGljayBldmVudHMgdG8gYnV0dG9ucyBhZnRlciBTbGljayBpbml0aWFsaXplcy5cblx0YXBwLmJpbmRCdXR0b25DbGlja0V2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRidXR0b25zID0gJCggdGhpcyApLmZpbmQoICcuc2xpY2stYXJyb3cnICk7XG5cblx0XHQkYnV0dG9ucy5vbiggJ2NsaWNrJywgYXBwLm5vdGlmeVNsaWRlQ2hhbmdlICk7XG5cdH07XG5cblx0Ly8gVXNlIHdwLmExMXkuc3BlYWsgdG8gbm90aWZ5IHNjcmVlbiByZWFkZXJzIG9mIGFjdGl2ZSBzbGlkZXMuXG5cdGFwcC5ub3RpZnlTbGlkZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRzbGljayA9ICQoIHRoaXMgKS5wYXJlbnRzKCAnLnNsaWNrLXNsaWRlcicgKS5zbGljayggJ2dldFNsaWNrJyApO1xuXG5cdFx0Ly8gY3VycmVudFNsaWRlIGlzIDAgYmFzZWQsIHNvIHdlIG5lZWQgdG8gYWRkIDEgdG8gbWFrZSBpdCBodW1hbi5cblx0XHRsZXQgY3VycmVudFNsaWRlID0gJHNsaWNrLmN1cnJlbnRTbGlkZSArIDE7XG5cblx0XHQvLyBTdHJpbmcgcmVwbGFjZSB0aGUgdGhpbmdzLlxuXHRcdHdwLmExMXkuc3BlYWsoIHdkc2kxOG4uYWN0aXZlU2xpZGVCdXR0b24ucmVwbGFjZSggJyUxJHMnLCBjdXJyZW50U2xpZGUgKS5yZXBsYWNlKCAnJTIkcycsICRzbGljay5zbGlkZUNvdW50ICkgKTtcblx0fTtcblxuXHQvLyBLaWNrIG9mZiBTbGljay5cblx0YXBwLmRvU2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdpbml0JywgYXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zICk7XG5cdFx0YXBwLiRjLnRoZUNhcm91c2VsLm9uKCAnaW5pdCcsIGFwcC5iaW5kQnV0dG9uQ2xpY2tFdmVudHMgKTtcblxuXHRcdC8vIFdlIG9ubHkgbmVlZCBhIHBhdXNlIGJ1dHRvbiB3aGVuIGF1dG9wbGF5IGlzIGVuYWJsZWQgYWJvdmUuXG5cdFx0aWYgKCBjYXJvdXNlbE9wdGlvbnMuYXV0b3BsYXkgKSB7XG5cdFx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdpbml0JywgYXBwLmFkZFBhdXNlYnV0dG9uICk7XG5cdFx0fVxuXG5cdFx0YXBwLiRjLnRoZUNhcm91c2VsLnNsaWNrKCBjYXJvdXNlbE9wdGlvbnMgKTtcblxuXHRcdGFwcC4kYy50aGVDYXJvdXNlbC5vbiggJ2FmdGVyQ2hhbmdlJywgYXBwLmRvQW5pbWF0aW9uICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzQ2Fyb3VzZWwgKSApO1xuIiwiLyoqXHJcbiAqIFNob3cvSGlkZSB0aGUgU2VhcmNoIEZvcm0gaW4gdGhlIGhlYWRlci5cclxuICpcclxuICogQGF1dGhvciBDb3JleSBDb2xsaW5zXHJcbiAqL1xyXG53aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtID0ge307XHJcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xyXG5cclxuXHQvLyBDb25zdHJ1Y3RvclxyXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuY2FjaGUoKTtcclxuXHJcblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xyXG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXHJcblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMgPSB7XHJcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXHJcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxyXG5cdFx0XHRoZWFkZXJTZWFyY2hGb3JtOiAkKCAnLnNpdGUtaGVhZGVyLWFjdGlvbiAuY3RhLWJ1dHRvbicgKVxyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcclxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwLiRjLmhlYWRlclNlYXJjaEZvcm0ub24oICdrZXl1cCB0b3VjaHN0YXJ0IGNsaWNrJywgYXBwLnNob3dIaWRlU2VhcmNoRm9ybSApO1xyXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXl1cCB0b3VjaHN0YXJ0IGNsaWNrJywgYXBwLmhpZGVTZWFyY2hGb3JtICk7XHJcblx0fTtcclxuXHJcblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xyXG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGFwcC4kYy5oZWFkZXJTZWFyY2hGb3JtLmxlbmd0aDtcclxuXHR9O1xyXG5cclxuXHQvLyBBZGRzIHRoZSB0b2dnbGUgY2xhc3MgZm9yIHRoZSBzZWFyY2ggZm9ybS5cclxuXHRhcHAuc2hvd0hpZGVTZWFyY2hGb3JtID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMuYm9keS50b2dnbGVDbGFzcyggJ3NlYXJjaC1mb3JtLXZpc2libGUnICk7XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH07XHJcblxyXG5cdC8vIEhpZGVzIHRoZSBzZWFyY2ggZm9ybSBpZiB3ZSBjbGljayBvdXRzaWRlIG9mIGl0cyBjb250YWluZXIuXHJcblx0YXBwLmhpZGVTZWFyY2hGb3JtID0gZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cclxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnc2l0ZS1oZWFkZXItYWN0aW9uJyApICkge1xyXG5cdFx0XHRhcHAuJGMuYm9keS5yZW1vdmVDbGFzcyggJ3NlYXJjaC1mb3JtLXZpc2libGUnICk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gRW5nYWdlXHJcblx0JCggYXBwLmluaXQgKTtcclxuXHJcbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93LlNob3dIaWRlU2VhcmNoRm9ybSApICk7XHJcbiIsIi8qKlxuICogRmlsZSBqcy1lbmFibGVkLmpzXG4gKlxuICogSWYgSmF2YXNjcmlwdCBpcyBlbmFibGVkLCByZXBsYWNlIHRoZSA8Ym9keT4gY2xhc3MgXCJuby1qc1wiLlxuICovXG5kb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoICduby1qcycsICdqcycgKTtcbiIsIi8qKlxyXG4gKiBGaWxlOiBtb2JpbGUtbWVudS5qc1xyXG4gKlxyXG4gKiBDcmVhdGUgYW4gYWNjb3JkaW9uIHN0eWxlIGRyb3Bkb3duLlxyXG4gKi9cclxud2luZG93Lndkc01vYmlsZU1lbnUgPSB7fTtcclxuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XHJcblxyXG5cdC8vIENvbnN0cnVjdG9yLlxyXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuY2FjaGUoKTtcclxuXHJcblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xyXG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxyXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwLiRjID0ge1xyXG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcclxuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcclxuXHRcdFx0c3ViTWVudUNvbnRhaW5lcjogJCggJy5tb2JpbGUtbWVudSAuc3ViLW1lbnUsIC51dGlsaXR5LW5hdmlnYXRpb24gLnN1Yi1tZW51JyApLFxyXG5cdFx0XHRzdWJTdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudSAuc3ViLW1lbnUnICksXHJcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1vYmlsZS1tZW51IGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4sIC51dGlsaXR5LW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKSxcclxuXHRcdFx0b2ZmQ2FudmFzQ29udGFpbmVyOiAkKCAnLm9mZi1jYW52YXMtY29udGFpbmVyJyApXHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cclxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRG93bkFycm93ICk7XHJcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICdjbGljaycsIGFwcC50b2dnbGVTdWJtZW51ICk7XHJcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLnJlc2V0U3ViTWVudSApO1xyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5vbiggJ3RyYW5zaXRpb25lbmQnLCBhcHAuZm9yY2VDbG9zZVN1Ym1lbnVzICk7XHJcblx0fTtcclxuXHJcblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xyXG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmxlbmd0aDtcclxuXHR9O1xyXG5cclxuXHQvLyBSZXNldCB0aGUgc3VibWVudXMgYWZ0ZXIgaXQncyBkb25lIGNsb3NpbmcuXHJcblx0YXBwLnJlc2V0U3ViTWVudSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vIFdoZW4gdGhlIGxpc3QgaXRlbSBpcyBkb25lIHRyYW5zaXRpb25pbmcgaW4gaGVpZ2h0LFxyXG5cdFx0Ly8gcmVtb3ZlIHRoZSBjbGFzc2VzIGZyb20gdGhlIHN1Ym1lbnUgc28gaXQgaXMgcmVhZHkgdG8gdG9nZ2xlIGFnYWluLlxyXG5cdFx0aWYgKCAkKCB0aGlzICkuaXMoICdsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApICYmICEgJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcclxuXHRcdFx0JCggdGhpcyApLmZpbmQoICd1bC5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlT3V0TGVmdCBpcy12aXNpYmxlJyApO1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUgaXRlbXMuXHJcblx0YXBwLnNsaWRlT3V0U3ViTWVudXMgPSBmdW5jdGlvbiggZWwgKSB7XHJcblxyXG5cdFx0Ly8gSWYgdGhpcyBpdGVtJ3MgcGFyZW50IGlzIHZpc2libGUgYW5kIHRoaXMgaXMgbm90LCBiYWlsLlxyXG5cdFx0aWYgKCBlbC5wYXJlbnQoKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgJiYgISBlbC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZiB0aGlzIGl0ZW0ncyBwYXJlbnQgaXMgdmlzaWJsZSBhbmQgdGhpcyBpdGVtIGlzIHZpc2libGUsIGhpZGUgaXRzIHN1Ym1lbnUgdGhlbiBiYWlsLlxyXG5cdFx0aWYgKCBlbC5wYXJlbnQoKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgJiYgZWwuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xyXG5cdFx0XHRlbC5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0YXBwLiRjLnN1Yk1lbnVDb250YWluZXIuZWFjaCggZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHQvLyBPbmx5IHRyeSB0byBjbG9zZSBzdWJtZW51cyB0aGF0IGFyZSBhY3R1YWxseSBvcGVuLlxyXG5cdFx0XHRpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ3NsaWRlSW5MZWZ0JyApICkge1xyXG5cclxuXHRcdFx0XHQvLyBDbG9zZSB0aGUgcGFyZW50IGxpc3QgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byBmYWxzZS5cclxuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XHJcblxyXG5cdFx0XHRcdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudS5cclxuXHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlQ2xhc3MoICdzbGlkZUluTGVmdCcgKS5hZGRDbGFzcyggJ3NsaWRlT3V0TGVmdCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gKTtcclxuXHR9O1xyXG5cclxuXHQvLyBBZGQgdGhlIGRvd24gYXJyb3cgdG8gc3VibWVudSBwYXJlbnRzLlxyXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJ2E6Zmlyc3QnICkuYWZ0ZXIoICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBjbGFzcz1cInBhcmVudC1pbmRpY2F0b3JcIiBhcmlhLWxhYmVsPVwiT3BlbiBzdWJtZW51XCI+PHNwYW4gY2xhc3M9XCJkb3duLWFycm93XCI+PC9zcGFuPjwvYnV0dG9uPicgKTtcclxuXHR9O1xyXG5cclxuXHQvLyBEZWFsIHdpdGggdGhlIHN1Ym1lbnUuXHJcblx0YXBwLnRvZ2dsZVN1Ym1lbnUgPSBmdW5jdGlvbiggZSApIHtcclxuXHJcblx0XHRsZXQgZWwgPSAkKCB0aGlzICksIC8vIFRoZSBtZW51IGVsZW1lbnQgd2hpY2ggd2FzIGNsaWNrZWQgb24uXHJcblx0XHRcdHN1Yk1lbnUgPSBlbC5jaGlsZHJlbiggJ3VsLnN1Yi1tZW51JyApLCAvLyBUaGUgbmVhcmVzdCBzdWJtZW51LlxyXG5cdFx0XHQkdGFyZ2V0ID0gJCggZS50YXJnZXQgKTsgLy8gdGhlIGVsZW1lbnQgdGhhdCdzIGFjdHVhbGx5IGJlaW5nIGNsaWNrZWQgKGNoaWxkIG9mIHRoZSBsaSB0aGF0IHRyaWdnZXJlZCB0aGUgY2xpY2sgZXZlbnQpLlxyXG5cclxuXHRcdC8vIEZpZ3VyZSBvdXQgaWYgd2UncmUgY2xpY2tpbmcgdGhlIGJ1dHRvbiBvciBpdHMgYXJyb3cgY2hpbGQsXHJcblx0XHQvLyBpZiBzbywgd2UgY2FuIGp1c3Qgb3BlbiBvciBjbG9zZSB0aGUgbWVudSBhbmQgYmFpbC5cclxuXHRcdGlmICggJHRhcmdldC5oYXNDbGFzcyggJ2Rvd24tYXJyb3cnICkgfHwgJHRhcmdldC5oYXNDbGFzcyggJ3BhcmVudC1pbmRpY2F0b3InICkgKSB7XHJcblxyXG5cdFx0XHQvLyBGaXJzdCwgY29sbGFwc2UgYW55IGFscmVhZHkgb3BlbmVkIHN1Ym1lbnVzLlxyXG5cdFx0XHRhcHAuc2xpZGVPdXRTdWJNZW51cyggZWwgKTtcclxuXHJcblx0XHRcdGlmICggISBzdWJNZW51Lmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcclxuXHJcblx0XHRcdFx0Ly8gT3BlbiB0aGUgc3VibWVudS5cclxuXHRcdFx0XHRhcHAub3BlblN1Ym1lbnUoIGVsLCBzdWJNZW51ICk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdH07XHJcblxyXG5cdC8vIE9wZW4gYSBzdWJtZW51LlxyXG5cdGFwcC5vcGVuU3VibWVudSA9IGZ1bmN0aW9uKCBwYXJlbnQsIHN1Yk1lbnUgKSB7XHJcblxyXG5cdFx0Ly8gRXhwYW5kIHRoZSBsaXN0IG1lbnUgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byB0cnVlLlxyXG5cdFx0cGFyZW50LmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XHJcblxyXG5cdFx0Ly8gU2xpZGUgdGhlIG1lbnUgaW4uXHJcblx0XHRzdWJNZW51LmFkZENsYXNzKCAnaXMtdmlzaWJsZSBhbmltYXRlZCBzbGlkZUluTGVmdCcgKTtcclxuXHR9O1xyXG5cclxuXHQvLyBGb3JjZSBjbG9zZSBhbGwgdGhlIHN1Ym1lbnVzIHdoZW4gdGhlIG1haW4gbWVudSBjb250YWluZXIgaXMgY2xvc2VkLlxyXG5cdGFwcC5mb3JjZUNsb3NlU3VibWVudXMgPSBmdW5jdGlvbiggZXZlbnQgKSB7XHJcblx0XHRpZiAoICQoIGV2ZW50LnRhcmdldCApLmhhc0NsYXNzKCAnb2ZmLWNhbnZhcy1jb250YWluZXInICkgKSB7XHJcblxyXG5cdFx0XHQvLyBGb2N1cyBvZmZjYW52YXMgbWVudSBmb3IgYTExeS5cclxuXHRcdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5mb2N1cygpO1xyXG5cclxuXHRcdFx0Ly8gVGhlIHRyYW5zaXRpb25lbmQgZXZlbnQgdHJpZ2dlcnMgb24gb3BlbiBhbmQgb24gY2xvc2UsIG5lZWQgdG8gbWFrZSBzdXJlIHdlIG9ubHkgZG8gdGhpcyBvbiBjbG9zZS5cclxuXHRcdFx0aWYgKCAhICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XHJcblx0XHRcdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xyXG5cdFx0XHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZSBzbGlkZUluTGVmdCcgKTtcclxuXHRcdFx0XHRhcHAuJGMuYm9keS5jc3MoICdvdmVyZmxvdycsICd2aXNpYmxlJyApO1xyXG5cdFx0XHRcdGFwcC4kYy5ib2R5LnVuYmluZCggJ3RvdWNoc3RhcnQnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcclxuXHRcdFx0XHRhcHAuJGMuYm9keS5jc3MoICdvdmVyZmxvdycsICdoaWRkZW4nICk7XHJcblx0XHRcdFx0YXBwLiRjLmJvZHkuYmluZCggJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdFx0XHRcdGlmICggISAkKCBlLnRhcmdldCApLnBhcmVudHMoICcuY29udGFjdC1tb2RhbCcgKVswXSApIHtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIEVuZ2FnZSFcclxuXHQkKCBhcHAuaW5pdCApO1xyXG5cclxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2JpbGVNZW51ICkgKTtcclxuIiwiLyoqXG4gKiBGaWxlIG1vZGFsLmpzXG4gKlxuICogRGVhbCB3aXRoIG11bHRpcGxlIG1vZGFscyBhbmQgdGhlaXIgbWVkaWEuXG4gKi9cbndpbmRvdy53ZHNNb2RhbCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0bGV0ICRtb2RhbFRvZ2dsZSxcblx0XHQkZm9jdXNhYmxlQ2hpbGRyZW4sXG5cdFx0JHBsYXllcixcblx0XHQkdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NjcmlwdCcgKSxcblx0XHQkZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3NjcmlwdCcgKVswXSxcblx0XHRZVDtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHQkZmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoICR0YWcsICRmaXJzdFNjcmlwdFRhZyApO1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdCdib2R5JzogJCggJ2JvZHknIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQoICcubW9kYWwtdHJpZ2dlcicgKS5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gVHJpZ2dlciBhIG1vZGFsIHRvIG9wZW4uXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJy5tb2RhbC10cmlnZ2VyJywgYXBwLm9wZW5Nb2RhbCApO1xuXG5cdFx0Ly8gVHJpZ2dlciB0aGUgY2xvc2UgYnV0dG9uIHRvIGNsb3NlIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLmNsb3NlJywgYXBwLmNsb3NlTW9kYWwgKTtcblxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIGNsb3NlIHRoZSBtb2RhbCBieSBoaXR0aW5nIHRoZSBlc2Mga2V5LlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC5lc2NLZXlDbG9zZSApO1xuXG5cdFx0Ly8gQWxsb3cgdGhlIHVzZXIgdG8gY2xvc2UgdGhlIG1vZGFsIGJ5IGNsaWNraW5nIG91dHNpZGUgb2YgdGhlIG1vZGFsLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICdkaXYubW9kYWwtb3BlbicsIGFwcC5jbG9zZU1vZGFsQnlDbGljayApO1xuXG5cdFx0Ly8gTGlzdGVuIHRvIHRhYnMsIHRyYXAga2V5Ym9hcmQgaWYgd2UgbmVlZCB0b1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC50cmFwS2V5Ym9hcmRNYXliZSApO1xuXG5cdH07XG5cblx0Ly8gT3BlbiB0aGUgbW9kYWwuXG5cdGFwcC5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFN0b3JlIHRoZSBtb2RhbCB0b2dnbGUgZWxlbWVudFxuXHRcdCRtb2RhbFRvZ2dsZSA9ICQoIHRoaXMgKTtcblxuXHRcdC8vIEZpZ3VyZSBvdXQgd2hpY2ggbW9kYWwgd2UncmUgb3BlbmluZyBhbmQgc3RvcmUgdGhlIG9iamVjdC5cblx0XHRsZXQgJG1vZGFsID0gJCggJCggdGhpcyApLmRhdGEoICd0YXJnZXQnICkgKTtcblxuXHRcdC8vIERpc3BsYXkgdGhlIG1vZGFsLlxuXHRcdCRtb2RhbC5hZGRDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBBZGQgYm9keSBjbGFzcy5cblx0XHRhcHAuJGMuYm9keS5hZGRDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBGaW5kIHRoZSBmb2N1c2FibGUgY2hpbGRyZW4gb2YgdGhlIG1vZGFsLlxuXHRcdC8vIFRoaXMgbGlzdCBtYXkgYmUgaW5jb21wbGV0ZSwgcmVhbGx5IHdpc2ggalF1ZXJ5IGhhZCB0aGUgOmZvY3VzYWJsZSBwc2V1ZG8gbGlrZSBqUXVlcnkgVUkgZG9lcy5cblx0XHQvLyBGb3IgbW9yZSBhYm91dCA6aW5wdXQgc2VlOiBodHRwczovL2FwaS5qcXVlcnkuY29tL2lucHV0LXNlbGVjdG9yL1xuXHRcdCRmb2N1c2FibGVDaGlsZHJlbiA9ICRtb2RhbC5maW5kKCAnYSwgOmlucHV0LCBbdGFiaW5kZXhdJyApO1xuXG5cdFx0Ly8gSWRlYWxseSwgdGhlcmUgaXMgYWx3YXlzIG9uZSAodGhlIGNsb3NlIGJ1dHRvbiksIGJ1dCB5b3UgbmV2ZXIga25vdy5cblx0XHRpZiAoIDAgPCAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoICkge1xuXG5cdFx0XHQvLyBTaGlmdCBmb2N1cyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBDbG9zZSB0aGUgbW9kYWwuXG5cdGFwcC5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBGaWd1cmUgdGhlIG9wZW5lZCBtb2RhbCB3ZSdyZSBjbG9zaW5nIGFuZCBzdG9yZSB0aGUgb2JqZWN0LlxuXHRcdGxldCAkbW9kYWwgPSAkKCAkKCAnZGl2Lm1vZGFsLW9wZW4gLmNsb3NlJyApLmRhdGEoICd0YXJnZXQnICkgKSxcblxuXHRcdFx0Ly8gRmluZCB0aGUgaWZyYW1lIGluIHRoZSAkbW9kYWwgb2JqZWN0LlxuXHRcdFx0JGlmcmFtZSA9ICRtb2RhbC5maW5kKCAnaWZyYW1lJyApO1xuXG5cdFx0Ly8gT25seSBkbyB0aGlzIGlmIHRoZXJlIGFyZSBhbnkgaWZyYW1lcy5cblx0XHRpZiAoICRpZnJhbWUubGVuZ3RoICkge1xuXG5cdFx0XHQvLyBHZXQgdGhlIGlmcmFtZSBzcmMgVVJMLlxuXHRcdFx0bGV0IHVybCA9ICRpZnJhbWUuYXR0ciggJ3NyYycgKTtcblxuXHRcdFx0Ly8gUmVtb3ZpbmcvUmVhZGRpbmcgdGhlIFVSTCB3aWxsIGVmZmVjdGl2ZWx5IGJyZWFrIHRoZSBZb3VUdWJlIEFQSS5cblx0XHRcdC8vIFNvIGxldCdzIG5vdCBkbyB0aGF0IHdoZW4gdGhlIGlmcmFtZSBVUkwgY29udGFpbnMgdGhlIGVuYWJsZWpzYXBpIHBhcmFtZXRlci5cblx0XHRcdGlmICggISB1cmwuaW5jbHVkZXMoICdlbmFibGVqc2FwaT0xJyApICkge1xuXG5cdFx0XHRcdC8vIFJlbW92ZSB0aGUgc291cmNlIFVSTCwgdGhlbiBhZGQgaXQgYmFjaywgc28gdGhlIHZpZGVvIGNhbiBiZSBwbGF5ZWQgYWdhaW4gbGF0ZXIuXG5cdFx0XHRcdCRpZnJhbWUuYXR0ciggJ3NyYycsICcnICkuYXR0ciggJ3NyYycsIHVybCApO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBVc2UgdGhlIFlvdVR1YmUgQVBJIHRvIHN0b3AgdGhlIHZpZGVvLlxuXHRcdFx0XHQkcGxheWVyLnN0b3BWaWRlbygpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEZpbmFsbHksIGhpZGUgdGhlIG1vZGFsLlxuXHRcdCRtb2RhbC5yZW1vdmVDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBSZW1vdmUgdGhlIGJvZHkgY2xhc3MuXG5cdFx0YXBwLiRjLmJvZHkucmVtb3ZlQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gUmV2ZXJ0IGZvY3VzIGJhY2sgdG8gdG9nZ2xlIGVsZW1lbnRcblx0XHQkbW9kYWxUb2dnbGUuZm9jdXMoKTtcblxuXHR9O1xuXG5cdC8vIENsb3NlIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXG5cdGFwcC5lc2NLZXlDbG9zZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0YXBwLmNsb3NlTW9kYWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2xvc2UgaWYgdGhlIHVzZXIgY2xpY2tzIG91dHNpZGUgb2YgdGhlIG1vZGFsXG5cdGFwcC5jbG9zZU1vZGFsQnlDbGljayA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIElmIHRoZSBwYXJlbnQgY29udGFpbmVyIGlzIE5PVCB0aGUgbW9kYWwgZGlhbG9nIGNvbnRhaW5lciwgY2xvc2UgdGhlIG1vZGFsXG5cdFx0aWYgKCAhICQoIGV2ZW50LnRhcmdldCApLnBhcmVudHMoICdkaXYnICkuaGFzQ2xhc3MoICdtb2RhbC1kaWFsb2cnICkgKSB7XG5cdFx0XHRhcHAuY2xvc2VNb2RhbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBUcmFwIHRoZSBrZXlib2FyZCBpbnRvIGEgbW9kYWwgd2hlbiBvbmUgaXMgYWN0aXZlLlxuXHRhcHAudHJhcEtleWJvYXJkTWF5YmUgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHQvLyBXZSBvbmx5IG5lZWQgdG8gZG8gc3R1ZmYgd2hlbiB0aGUgbW9kYWwgaXMgb3BlbiBhbmQgdGFiIGlzIHByZXNzZWQuXG5cdFx0aWYgKCA5ID09PSBldmVudC53aGljaCAmJiAwIDwgJCggJy5tb2RhbC1vcGVuJyApLmxlbmd0aCApIHtcblx0XHRcdGxldCAkZm9jdXNlZCA9ICQoICc6Zm9jdXMnICksXG5cdFx0XHRcdGZvY3VzSW5kZXggPSAkZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXgoICRmb2N1c2VkICk7XG5cblx0XHRcdGlmICggMCA9PT0gZm9jdXNJbmRleCAmJiBldmVudC5zaGlmdEtleSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCwgYW5kIHNoaWZ0IGlzIGhlbGQgd2hlbiBwcmVzc2luZyB0YWIsIGdvIGJhY2sgdG8gbGFzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWyAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSBdLmZvY3VzKCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIGV2ZW50LnNoaWZ0S2V5ICYmIGZvY3VzSW5kZXggPT09ICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxICkge1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnQsIGFuZCBzaGlmdCBpcyBub3QgaGVsZCwgZ28gYmFjayB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBIb29rIGludG8gWW91VHViZSA8aWZyYW1lPi5cblx0YXBwLm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0bGV0ICRtb2RhbCA9ICQoICdkaXYubW9kYWwnICksXG5cdFx0XHQkaWZyYW1laWQgPSAkbW9kYWwuZmluZCggJ2lmcmFtZScgKS5hdHRyKCAnaWQnICk7XG5cblx0XHQkcGxheWVyID0gbmV3IFlULlBsYXllciggJGlmcmFtZWlkLCB7XG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0J29uUmVhZHknOiBhcHAub25QbGF5ZXJSZWFkeSxcblx0XHRcdFx0J29uU3RhdGVDaGFuZ2UnOiBhcHAub25QbGF5ZXJTdGF0ZUNoYW5nZVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBEbyBzb21ldGhpbmcgb24gcGxheWVyIHJlYWR5LlxuXHRhcHAub25QbGF5ZXJSZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHR9O1xuXG5cdC8vIERvIHNvbWV0aGluZyBvbiBwbGF5ZXIgc3RhdGUgY2hhbmdlLlxuXHRhcHAub25QbGF5ZXJTdGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gU2V0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCBpbnNpZGUgb2YgdGhlIG1vZGFsIHRoZSBwbGF5ZXIgaXMgaW4uXG5cdFx0JCggZXZlbnQudGFyZ2V0LmEgKS5wYXJlbnRzKCAnLm1vZGFsJyApLmZpbmQoICdhLCA6aW5wdXQsIFt0YWJpbmRleF0nICkuZmlyc3QoKS5mb2N1cygpO1xuXHR9O1xuXG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2RhbCApICk7XG4iLCIvKipcbiAqIEZpbGU6IG5hdmlnYXRpb24tcHJpbWFyeS5qc1xuICpcbiAqIEhlbHBlcnMgZm9yIHRoZSBwcmltYXJ5IG5hdmlnYXRpb24uXG4gKi9cbndpbmRvdy53ZHNQcmltYXJ5TmF2aWdhdGlvbiA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1haW4tbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tYWluLW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnYScgKS5vbiggJ2ZvY3VzaW4gZm9jdXNvdXQnLCBhcHAudG9nZ2xlRm9jdXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnPiBhJyApLmFwcGVuZCggJzxzcGFuIGNsYXNzPVwiY2FyZXQtZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nICk7XG5cdH07XG5cblx0Ly8gVG9nZ2xlIHRoZSBmb2N1cyBjbGFzcyBvbiB0aGUgbGluayBwYXJlbnQuXG5cdGFwcC50b2dnbGVGb2N1cyA9IGZ1bmN0aW9uKCkge1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKS50b2dnbGVDbGFzcyggJ2ZvY3VzJyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNQcmltYXJ5TmF2aWdhdGlvbiApICk7XG4iLCIvKipcclxuICogRmlsZTogb2ZmLWNhbnZhcy5qc1xyXG4gKlxyXG4gKiBIZWxwIGRlYWwgd2l0aCB0aGUgb2ZmLWNhbnZhcyBtb2JpbGUgbWVudS5cclxuICovXHJcbndpbmRvdy53ZHNvZmZDYW52YXMgPSB7fTtcclxuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XHJcblxyXG5cdC8vIENvbnN0cnVjdG9yLlxyXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuY2FjaGUoKTtcclxuXHJcblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xyXG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxyXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwLiRjID0ge1xyXG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcclxuXHRcdFx0b2ZmQ2FudmFzQ2xvc2U6ICQoICcub2ZmLWNhbnZhcy1jbG9zZScgKSxcclxuXHRcdFx0b2ZmQ2FudmFzQ29udGFpbmVyOiAkKCAnLm9mZi1jYW52YXMtY29udGFpbmVyJyApLFxyXG5cdFx0XHRvZmZDYW52YXNPcGVuOiAkKCAnLm9mZi1jYW52YXMtb3BlbicgKSxcclxuXHRcdFx0b2ZmQ2FudmFzU2NyZWVuOiAkKCAnLm9mZi1jYW52YXMtc2NyZWVuJyApXHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cclxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLmVzY0tleUNsb3NlICk7XHJcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ2xvc2Uub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4ub24oICdjbGljaycsIGFwcC50b2dnbGVvZmZDYW52YXMgKTtcclxuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4ub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xyXG5cdH07XHJcblxyXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cclxuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmxlbmd0aDtcclxuXHR9O1xyXG5cclxuXHQvLyBUbyBzaG93IG9yIG5vdCB0byBzaG93P1xyXG5cdGFwcC50b2dnbGVvZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRpZiAoICd0cnVlJyA9PT0gJCggdGhpcyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApICkge1xyXG5cdFx0XHRhcHAuY2xvc2VvZmZDYW52YXMoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFwcC5vcGVub2ZmQ2FudmFzKCk7XHJcblx0XHR9XHJcblxyXG5cdH07XHJcblxyXG5cdC8vIFNob3cgdGhhdCBkcmF3ZXIhXHJcblx0YXBwLm9wZW5vZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XHJcblxyXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XHJcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIGZhbHNlICk7XHJcblx0fTtcclxuXHJcblx0Ly8gQ2xvc2UgdGhhdCBkcmF3ZXIhXHJcblx0YXBwLmNsb3Nlb2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcclxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcclxuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xyXG5cclxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcclxuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYXR0ciggJ2FyaWEtaGlkZGVuJywgdHJ1ZSApO1xyXG5cclxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmZvY3VzKCk7XHJcblx0fTtcclxuXHJcblx0Ly8gQ2xvc2UgZHJhd2VyIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXHJcblx0YXBwLmVzY0tleUNsb3NlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cdFx0aWYgKCAyNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcclxuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gRW5nYWdlIVxyXG5cdCQoIGFwcC5pbml0ICk7XHJcblxyXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc29mZkNhbnZhcyApICk7XHJcbiIsIi8qKlxuICogRmlsZSBza2lwLWxpbmstZm9jdXMtZml4LmpzLlxuICpcbiAqIEhlbHBzIHdpdGggYWNjZXNzaWJpbGl0eSBmb3Iga2V5Ym9hcmQgb25seSB1c2Vycy5cbiAqXG4gKiBMZWFybiBtb3JlOiBodHRwczovL2dpdC5pby92V2RyMlxuICovXG4oIGZ1bmN0aW9uKCkge1xuXHR2YXIgaXNXZWJraXQgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnd2Via2l0JyApLFxuXHRcdGlzT3BlcmEgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICksXG5cdFx0aXNJZSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApO1xuXG5cdGlmICggKCBpc1dlYmtpdCB8fCBpc09wZXJhIHx8IGlzSWUgKSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpZCA9IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICksXG5cdFx0XHRcdGVsZW1lbnQ7XG5cblx0XHRcdGlmICggISAoIC9eW0EtejAtOV8tXSskLyApLnRlc3QoIGlkICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGlmICggISAoIC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaSApLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSApO1xuXHR9XG59KCkgKTtcbiIsIi8qKlxyXG4gKiBNYWtlIHRhYmxlcyByZXNwb25zaXZlIGFnYWluLlxyXG4gKlxyXG4gKiBAYXV0aG9yIEhhcmlzIFp1bGZpcWFyXHJcbiAqL1xyXG53aW5kb3cud2RzVGFibGVzID0ge307XHJcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xyXG5cclxuXHQvLyBDb25zdHJ1Y3RvclxyXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuY2FjaGUoKTtcclxuXHJcblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xyXG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXHJcblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMgPSB7XHJcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXHJcblx0XHRcdHRhYmxlOiAkKCAndGFibGUnIClcclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXHJcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERhdGFMYWJlbCApO1xyXG5cdH07XHJcblxyXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cclxuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBhcHAuJGMudGFibGUubGVuZ3RoO1xyXG5cdH07XHJcblxyXG5cdC8vIEFkZHMgZGF0YS1sYWJlbCB0byB0ZCBiYXNlZCBvbiB0aC5cclxuXHRhcHAuYWRkRGF0YUxhYmVsID0gZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zdCB0YWJsZSA9IGFwcC4kYy50YWJsZTtcclxuXHRcdGNvbnN0IHRhYmxlSGVhZGVycyA9IHRhYmxlLmZpbmQoICd0aGVhZCB0aCcgKTtcclxuXHRcdGNvbnN0IHRhYmxlUm93ID0gdGFibGUuZmluZCggJ3Rib2R5IHRyJyApO1xyXG5cclxuXHRcdHRhYmxlUm93LmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRjb25zdCB0ZCA9ICQoIHRoaXMgKS5maW5kKCAndGQnICk7XHJcblxyXG5cdFx0XHR0ZC5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XHJcblx0XHRcdFx0aWYgKCAkKCB0YWJsZUhlYWRlcnMuZ2V0KCBpbmRleCApICkgKSB7XHJcblx0XHRcdFx0XHQkKCB0aGlzICkuYXR0ciggJ2RhdGEtbGFiZWwnLCAkKCB0YWJsZUhlYWRlcnMuZ2V0KCBpbmRleCApICkudGV4dCgpICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ICk7XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH07XHJcblxyXG5cdC8vIEVuZ2FnZVxyXG5cdCQoIGFwcC5pbml0ICk7XHJcblxyXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNUYWJsZXMgKSApO1xyXG4iLCIvKipcclxuICogVmlkZW8gUGxheWJhY2sgU2NyaXB0LlxyXG4gKi9cclxud2luZG93LldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCA9IHt9O1xyXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcclxuXHJcblx0Ly8gQ29uc3RydWN0b3IuXHJcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC5jYWNoZSgpO1xyXG5cclxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XHJcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXHJcblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRhcHAuJGMgPSB7XHJcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXHJcblx0XHRcdHZpZGVvQnV0dG9uOiAkKCAnLnZpZGVvLXRvZ2dsZScgKVxyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXHJcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdGFwcC4kYy52aWRlb0J1dHRvbi5vbiggJ2NsaWNrJywgYXBwLmRvVG9nZ2xlUGxheWJhY2sgKTtcclxuXHR9O1xyXG5cclxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XHJcblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gYXBwLiRjLnZpZGVvQnV0dG9uLmxlbmd0aDtcclxuXHR9O1xyXG5cclxuXHQvLyBWaWRlbyBQbGF5YmFjay5cclxuXHRhcHAuZG9Ub2dnbGVQbGF5YmFjayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuY29udGVudC1ibG9jaycgKS50b2dnbGVDbGFzcyggJ3ZpZGVvLXRvZ2dsZWQnICk7XHJcblxyXG5cdFx0aWYgKCAkKCB0aGlzICkucGFyZW50cyggJy5jb250ZW50LWJsb2NrJyApLmhhc0NsYXNzKCAndmlkZW8tdG9nZ2xlZCcgKSApIHtcclxuXHRcdFx0JCggdGhpcyApLnNpYmxpbmdzKCAnLnZpZGVvLWJhY2tncm91bmQnICkudHJpZ2dlciggJ3BhdXNlJyApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0JCggdGhpcyApLnNpYmxpbmdzKCAnLnZpZGVvLWJhY2tncm91bmQnICkudHJpZ2dlciggJ3BsYXknICk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gRW5nYWdlIVxyXG5cdCQoIGFwcC5pbml0ICk7XHJcblxyXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93LldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCApICk7XHJcbiIsIi8qKlxuICogRmlsZSB3aW5kb3ctcmVhZHkuanNcbiAqXG4gKiBBZGQgYSBcInJlYWR5XCIgY2xhc3MgdG8gPGJvZHk+IHdoZW4gd2luZG93IGlzIHJlYWR5LlxuICovXG53aW5kb3cud2RzV2luZG93UmVhZHkgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdH07XG5cblx0Ly8gQ2FjaGUgZG9jdW1lbnQgZWxlbWVudHMuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdCd3aW5kb3cnOiAkKCB3aW5kb3cgKSxcblx0XHRcdCdib2R5JzogJCggZG9jdW1lbnQuYm9keSApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5sb2FkKCBhcHAuYWRkQm9keUNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWRkIGEgY2xhc3MgdG8gPGJvZHk+LlxuXHRhcHAuYWRkQm9keUNsYXNzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkuYWRkQ2xhc3MoICdyZWFkeScgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1dpbmRvd1JlYWR5ICkgKTtcbiJdfQ==
