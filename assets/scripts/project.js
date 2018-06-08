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
			arrows: false,
			dots: false,
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
		app.$c.subMenuParentItem.prepend('<button type="button" aria-expanded="false" class="parent-indicator" aria-label="Open submenu"><span class="down-arrow"></span></button>');
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
	app.forceCloseSubmenus = function () {

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

		app.$c.offCanvasContainer.find('button').first().focus();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ3aW5kb3ctcmVhZHkuanMiXSwibmFtZXMiOlsid2luZG93Iiwid2RzQ2Fyb3VzZWwiLCIkIiwiYXBwIiwiaW5pdCIsImNhY2hlIiwibWVldHNSZXF1aXJlbWVudHMiLCJiaW5kRXZlbnRzIiwiJGMiLCJ0aGVDYXJvdXNlbCIsIm9uIiwiZG9TbGljayIsImRvRmlyc3RBbmltYXRpb24iLCJsZW5ndGgiLCJmaXJzdFNsaWRlIiwiZmluZCIsImZpcnN0U2xpZGVDb250ZW50IiwiZmlyc3RBbmltYXRpb24iLCJhdHRyIiwiYWRkQ2xhc3MiLCJkb0FuaW1hdGlvbiIsInNsaWRlcyIsImFjdGl2ZVNsaWRlIiwiYWN0aXZlQ29udGVudCIsImFuaW1hdGlvbkNsYXNzIiwic3BsaXRBbmltYXRpb24iLCJzcGxpdCIsImFuaW1hdGlvblRyaWdnZXIiLCJlYWNoIiwic2xpZGVDb250ZW50IiwiaGFzQ2xhc3MiLCJsYXN0Q2xhc3MiLCJwb3AiLCJyZW1vdmVDbGFzcyIsInBsYXlCYWNrZ3JvdW5kVmlkZW9zIiwicGxheSIsInNsaWNrIiwiYXV0b3BsYXkiLCJhdXRvcGxheVNwZWVkIiwiYXJyb3dzIiwiZG90cyIsImZvY3VzT25TZWxlY3QiLCJ3YWl0Rm9yQW5pbWF0ZSIsImpRdWVyeSIsIlNob3dIaWRlU2VhcmNoRm9ybSIsImJvZHkiLCJoZWFkZXJTZWFyY2hGb3JtIiwic2hvd0hpZGVTZWFyY2hGb3JtIiwiaGlkZVNlYXJjaEZvcm0iLCJ0b2dnbGVDbGFzcyIsImV2ZW50IiwidGFyZ2V0IiwicGFyZW50cyIsImRvY3VtZW50IiwiY2xhc3NOYW1lIiwicmVwbGFjZSIsIndkc01vYmlsZU1lbnUiLCJzdWJNZW51Q29udGFpbmVyIiwic3ViU3ViTWVudUNvbnRhaW5lciIsInN1Yk1lbnVQYXJlbnRJdGVtIiwib2ZmQ2FudmFzQ29udGFpbmVyIiwiYWRkRG93bkFycm93IiwidG9nZ2xlU3VibWVudSIsInJlc2V0U3ViTWVudSIsImZvcmNlQ2xvc2VTdWJtZW51cyIsImlzIiwic2xpZGVPdXRTdWJNZW51cyIsImVsIiwicGFyZW50IiwicHJlcGVuZCIsImUiLCJzdWJNZW51IiwiY2hpbGRyZW4iLCIkdGFyZ2V0Iiwib3BlblN1Ym1lbnUiLCJjc3MiLCJ1bmJpbmQiLCJiaW5kIiwicHJldmVudERlZmF1bHQiLCJ3ZHNNb2RhbCIsIiRtb2RhbFRvZ2dsZSIsIiRmb2N1c2FibGVDaGlsZHJlbiIsIiRwbGF5ZXIiLCIkdGFnIiwiY3JlYXRlRWxlbWVudCIsIiRmaXJzdFNjcmlwdFRhZyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiWVQiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwib3Blbk1vZGFsIiwiY2xvc2VNb2RhbCIsImVzY0tleUNsb3NlIiwiY2xvc2VNb2RhbEJ5Q2xpY2siLCJ0cmFwS2V5Ym9hcmRNYXliZSIsIiRtb2RhbCIsImRhdGEiLCJmb2N1cyIsIiRpZnJhbWUiLCJ1cmwiLCJpbmNsdWRlcyIsInN0b3BWaWRlbyIsImtleUNvZGUiLCJ3aGljaCIsIiRmb2N1c2VkIiwiZm9jdXNJbmRleCIsImluZGV4Iiwic2hpZnRLZXkiLCJvbllvdVR1YmVJZnJhbWVBUElSZWFkeSIsIiRpZnJhbWVpZCIsIlBsYXllciIsImV2ZW50cyIsIm9uUGxheWVyUmVhZHkiLCJvblBsYXllclN0YXRlQ2hhbmdlIiwiYSIsImZpcnN0Iiwid2RzUHJpbWFyeU5hdmlnYXRpb24iLCJ0b2dnbGVGb2N1cyIsImFwcGVuZCIsIndkc29mZkNhbnZhcyIsIm9mZkNhbnZhc0Nsb3NlIiwib2ZmQ2FudmFzT3BlbiIsIm9mZkNhbnZhc1NjcmVlbiIsImNsb3Nlb2ZmQ2FudmFzIiwidG9nZ2xlb2ZmQ2FudmFzIiwib3Blbm9mZkNhbnZhcyIsImlzV2Via2l0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwiaXNPcGVyYSIsImlzSWUiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZCIsImxvY2F0aW9uIiwiaGFzaCIsInN1YnN0cmluZyIsImVsZW1lbnQiLCJ0ZXN0IiwidGFnTmFtZSIsInRhYkluZGV4Iiwid2RzV2luZG93UmVhZHkiLCJsb2FkIiwiYWRkQm9keUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBQSxPQUFPQyxXQUFQLEdBQXFCLEVBQXJCO0FBQ0UsV0FBVUQsTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUU1QjtBQUNBQSxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjs7QUFFQSxNQUFLRixJQUFJRyxpQkFBSixFQUFMLEVBQStCO0FBQzlCSCxPQUFJSSxVQUFKO0FBQ0E7QUFDRCxFQU5EOztBQVFBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUlIsV0FBUUUsRUFBR0YsTUFBSCxDQURBO0FBRVJTLGdCQUFhUCxFQUFHLFdBQUg7QUFGTCxHQUFUO0FBSUEsRUFMRDs7QUFPQTtBQUNBQyxLQUFJSSxVQUFKLEdBQWlCLFlBQVc7QUFDM0JKLE1BQUlLLEVBQUosQ0FBT1IsTUFBUCxDQUFjVSxFQUFkLENBQWtCLE1BQWxCLEVBQTBCUCxJQUFJUSxPQUE5QjtBQUNBUixNQUFJSyxFQUFKLENBQU9SLE1BQVAsQ0FBY1UsRUFBZCxDQUFrQixNQUFsQixFQUEwQlAsSUFBSVMsZ0JBQTlCO0FBQ0EsRUFIRDs7QUFLQTtBQUNBVCxLQUFJRyxpQkFBSixHQUF3QixZQUFXO0FBQ2xDLFNBQU9ILElBQUlLLEVBQUosQ0FBT0MsV0FBUCxDQUFtQkksTUFBMUI7QUFDQSxFQUZEOztBQUlBO0FBQ0FWLEtBQUlTLGdCQUFKLEdBQXVCLFlBQVc7O0FBRWpDO0FBQ0EsTUFB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cEI7QUFDQTs7QUFFREgsWUFBUTFDLEtBQVI7QUFDQTtBQUNELEdBakJELEVBaUJHLEtBakJIO0FBa0JBO0FBQ0QsQ0F6QkMsR0FBRjs7O0FDUEE7Ozs7O0FBS0FqRyxPQUFPK0ksY0FBUCxHQUF3QixFQUF4QjtBQUNFLFdBQVUvSSxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKO0FBQ0FGLE1BQUlJLFVBQUo7QUFDQSxFQUhEOztBQUtBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUixhQUFVTixFQUFHRixNQUFILENBREY7QUFFUixXQUFRRSxFQUFHbUQsU0FBU1IsSUFBWjtBQUZBLEdBQVQ7QUFJQSxFQUxEOztBQU9BO0FBQ0ExQyxLQUFJSSxVQUFKLEdBQWlCLFlBQVc7QUFDM0JKLE1BQUlLLEVBQUosQ0FBT1IsTUFBUCxDQUFjZ0osSUFBZCxDQUFvQjdJLElBQUk4SSxZQUF4QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQTlJLEtBQUk4SSxZQUFKLEdBQW1CLFlBQVc7QUFDN0I5SSxNQUFJSyxFQUFKLENBQU9xQyxJQUFQLENBQVkxQixRQUFaLENBQXNCLE9BQXRCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBakIsR0FBR0MsSUFBSUMsSUFBUDtBQUNBLENBNUJDLEVBNEJDSixNQTVCRCxFQTRCUzJDLE1BNUJULEVBNEJpQjNDLE9BQU8rSSxjQTVCeEIsQ0FBRiIsImZpbGUiOiJwcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGaWxlIGNhcm91c2VsLmpzXG4gKlxuICogRGVhbCB3aXRoIHRoZSBTbGljayBjYXJvdXNlbC5cbiAqL1xud2luZG93Lndkc0Nhcm91c2VsID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHRoZUNhcm91c2VsOiAkKCAnLmNhcm91c2VsJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuZG9TbGljayApO1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmRvRmlyc3RBbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMudGhlQ2Fyb3VzZWwubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFuaW1hdGUgdGhlIGZpcnN0IHNsaWRlIG9uIHdpbmRvdyBsb2FkLlxuXHRhcHAuZG9GaXJzdEFuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IHRoZSBmaXJzdCBzbGlkZSBjb250ZW50IGFyZWEgYW5kIGFuaW1hdGlvbiBhdHRyaWJ1dGUuXG5cdFx0bGV0IGZpcnN0U2xpZGUgPSBhcHAuJGMudGhlQ2Fyb3VzZWwuZmluZCggJ1tkYXRhLXNsaWNrLWluZGV4PTBdJyApLFxuXHRcdFx0Zmlyc3RTbGlkZUNvbnRlbnQgPSBmaXJzdFNsaWRlLmZpbmQoICcuc2xpZGUtY29udGVudCcgKSxcblx0XHRcdGZpcnN0QW5pbWF0aW9uID0gZmlyc3RTbGlkZUNvbnRlbnQuYXR0ciggJ2RhdGEtYW5pbWF0aW9uJyApO1xuXG5cdFx0Ly8gQWRkIHRoZSBhbmltYXRpb24gY2xhc3MgdG8gdGhlIGZpcnN0IHNsaWRlLlxuXHRcdGZpcnN0U2xpZGVDb250ZW50LmFkZENsYXNzKCBmaXJzdEFuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIEFuaW1hdGUgdGhlIHNsaWRlIGNvbnRlbnQuXG5cdGFwcC5kb0FuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCBzbGlkZXMgPSAkKCAnLnNsaWRlJyApLFxuXHRcdFx0YWN0aXZlU2xpZGUgPSAkKCAnLnNsaWNrLWN1cnJlbnQnICksXG5cdFx0XHRhY3RpdmVDb250ZW50ID0gYWN0aXZlU2xpZGUuZmluZCggJy5zbGlkZS1jb250ZW50JyApLFxuXG5cdFx0XHQvLyBUaGlzIGlzIGEgc3RyaW5nIGxpa2Ugc286ICdhbmltYXRlZCBzb21lQ3NzQ2xhc3MnLlxuXHRcdFx0YW5pbWF0aW9uQ2xhc3MgPSBhY3RpdmVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKSxcblx0XHRcdHNwbGl0QW5pbWF0aW9uID0gYW5pbWF0aW9uQ2xhc3Muc3BsaXQoICcgJyApLFxuXG5cdFx0XHQvLyBUaGlzIGlzIHRoZSAnYW5pbWF0ZWQnIGNsYXNzLlxuXHRcdFx0YW5pbWF0aW9uVHJpZ2dlciA9IHNwbGl0QW5pbWF0aW9uWzBdO1xuXG5cdFx0Ly8gR28gdGhyb3VnaCBlYWNoIHNsaWRlIHRvIHNlZSBpZiB3ZSd2ZSBhbHJlYWR5IHNldCBhbmltYXRpb24gY2xhc3Nlcy5cblx0XHRzbGlkZXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRsZXQgc2xpZGVDb250ZW50ID0gJCggdGhpcyApLmZpbmQoICcuc2xpZGUtY29udGVudCcgKTtcblxuXHRcdFx0Ly8gSWYgd2UndmUgc2V0IGFuaW1hdGlvbiBjbGFzc2VzIG9uIGEgc2xpZGUsIHJlbW92ZSB0aGVtLlxuXHRcdFx0aWYgKCBzbGlkZUNvbnRlbnQuaGFzQ2xhc3MoICdhbmltYXRlZCcgKSApIHtcblxuXHRcdFx0XHQvLyBHZXQgdGhlIGxhc3QgY2xhc3MsIHdoaWNoIGlzIHRoZSBhbmltYXRlLmNzcyBjbGFzcy5cblx0XHRcdFx0bGV0IGxhc3RDbGFzcyA9IHNsaWRlQ29udGVudFxuXHRcdFx0XHRcdC5hdHRyKCAnY2xhc3MnIClcblx0XHRcdFx0XHQuc3BsaXQoICcgJyApXG5cdFx0XHRcdFx0LnBvcCgpO1xuXG5cdFx0XHRcdC8vIFJlbW92ZSBib3RoIGFuaW1hdGlvbiBjbGFzc2VzLlxuXHRcdFx0XHRzbGlkZUNvbnRlbnQucmVtb3ZlQ2xhc3MoIGxhc3RDbGFzcyApLnJlbW92ZUNsYXNzKCBhbmltYXRpb25UcmlnZ2VyICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gQWRkIGFuaW1hdGlvbiBjbGFzc2VzIGFmdGVyIHNsaWRlIGlzIGluIHZpZXcuXG5cdFx0YWN0aXZlQ29udGVudC5hZGRDbGFzcyggYW5pbWF0aW9uQ2xhc3MgKTtcblx0fTtcblxuXHQvLyBBbGxvdyBiYWNrZ3JvdW5kIHZpZGVvcyB0byBhdXRvcGxheS5cblx0YXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBHZXQgYWxsIHRoZSB2aWRlb3MgaW4gb3VyIHNsaWRlcyBvYmplY3QuXG5cdFx0JCggJ3ZpZGVvJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBMZXQgdGhlbSBhdXRvcGxheS4gVE9ETzogUG9zc2libHkgY2hhbmdlIHRoaXMgbGF0ZXIgdG8gb25seSBwbGF5IHRoZSB2aXNpYmxlIHNsaWRlIHZpZGVvLlxuXHRcdFx0dGhpcy5wbGF5KCk7XG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIEtpY2sgb2ZmIFNsaWNrLlxuXHRhcHAuZG9TbGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy50aGVDYXJvdXNlbC5vbiggJ2luaXQnLCBhcHAucGxheUJhY2tncm91bmRWaWRlb3MgKTtcblxuXHRcdGFwcC4kYy50aGVDYXJvdXNlbC5zbGljaygge1xuXHRcdFx0YXV0b3BsYXk6IHRydWUsXG5cdFx0XHRhdXRvcGxheVNwZWVkOiA1MDAwLFxuXHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdGRvdHM6IGZhbHNlLFxuXHRcdFx0Zm9jdXNPblNlbGVjdDogdHJ1ZSxcblx0XHRcdHdhaXRGb3JBbmltYXRlOiB0cnVlXG5cdFx0fSApO1xuXG5cdFx0YXBwLiRjLnRoZUNhcm91c2VsLm9uKCAnYWZ0ZXJDaGFuZ2UnLCBhcHAuZG9BbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNDYXJvdXNlbCApICk7XG4iLCIvKipcbiAqIFNob3cvSGlkZSB0aGUgU2VhcmNoIEZvcm0gaW4gdGhlIGhlYWRlci5cbiAqXG4gKiBAYXV0aG9yIENvcmV5IENvbGxpbnNcbiAqL1xud2luZG93LlNob3dIaWRlU2VhcmNoRm9ybSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3Jcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5nc1xuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0Ym9keTogJCggJ2JvZHknICksXG5cdFx0XHRoZWFkZXJTZWFyY2hGb3JtOiAkKCAnLnNpdGUtaGVhZGVyLWFjdGlvbiAuY3RhLWJ1dHRvbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmhlYWRlclNlYXJjaEZvcm0ub24oICdrZXl1cCB0b3VjaHN0YXJ0IGNsaWNrJywgYXBwLnNob3dIaWRlU2VhcmNoRm9ybSApO1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5dXAgdG91Y2hzdGFydCBjbGljaycsIGFwcC5oaWRlU2VhcmNoRm9ybSApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5oZWFkZXJTZWFyY2hGb3JtLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBZGRzIHRoZSB0b2dnbGUgY2xhc3MgZm9yIHRoZSBzZWFyY2ggZm9ybS5cblx0YXBwLnNob3dIaWRlU2VhcmNoRm9ybSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5LnRvZ2dsZUNsYXNzKCAnc2VhcmNoLWZvcm0tdmlzaWJsZScgKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHQvLyBIaWRlcyB0aGUgc2VhcmNoIGZvcm0gaWYgd2UgY2xpY2sgb3V0c2lkZSBvZiBpdHMgY29udGFpbmVyLlxuXHRhcHAuaGlkZVNlYXJjaEZvcm0gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHRpZiAoICEgJCggZXZlbnQudGFyZ2V0ICkucGFyZW50cyggJ2RpdicgKS5oYXNDbGFzcyggJ3NpdGUtaGVhZGVyLWFjdGlvbicgKSApIHtcblx0XHRcdGFwcC4kYy5ib2R5LnJlbW92ZUNsYXNzKCAnc2VhcmNoLWZvcm0tdmlzaWJsZScgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRW5nYWdlXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93LlNob3dIaWRlU2VhcmNoRm9ybSApICk7XG4iLCIvKipcbiAqIEZpbGUganMtZW5hYmxlZC5qc1xuICpcbiAqIElmIEphdmFzY3JpcHQgaXMgZW5hYmxlZCwgcmVwbGFjZSB0aGUgPGJvZHk+IGNsYXNzIFwibm8tanNcIi5cbiAqL1xuZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKCAnbm8tanMnLCAnanMnICk7XG4iLCIvKipcbiAqIEZpbGU6IG1vYmlsZS1tZW51LmpzXG4gKlxuICogQ3JlYXRlIGFuIGFjY29yZGlvbiBzdHlsZSBkcm9wZG93bi5cbiAqL1xud2luZG93Lndkc01vYmlsZU1lbnUgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudSwgLnV0aWxpdHktbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJTdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudSAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tb2JpbGUtbWVudSBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuLCAudXRpbGl0eS1uYXZpZ2F0aW9uIGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICksXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICdjbGljaycsIGFwcC50b2dnbGVTdWJtZW51ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5yZXNldFN1Yk1lbnUgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5mb3JjZUNsb3NlU3VibWVudXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gUmVzZXQgdGhlIHN1Ym1lbnVzIGFmdGVyIGl0J3MgZG9uZSBjbG9zaW5nLlxuXHRhcHAucmVzZXRTdWJNZW51ID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBXaGVuIHRoZSBsaXN0IGl0ZW0gaXMgZG9uZSB0cmFuc2l0aW9uaW5nIGluIGhlaWdodCxcblx0XHQvLyByZW1vdmUgdGhlIGNsYXNzZXMgZnJvbSB0aGUgc3VibWVudSBzbyBpdCBpcyByZWFkeSB0byB0b2dnbGUgYWdhaW4uXG5cdFx0aWYgKCAkKCB0aGlzICkuaXMoICdsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApICYmICEgJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdCQoIHRoaXMgKS5maW5kKCAndWwuc3ViLW1lbnUnICkucmVtb3ZlQ2xhc3MoICdzbGlkZU91dExlZnQgaXMtdmlzaWJsZScgKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUgaXRlbXMuXG5cdGFwcC5zbGlkZU91dFN1Yk1lbnVzID0gZnVuY3Rpb24oIGVsICkge1xuXG5cdFx0Ly8gSWYgdGhpcyBpdGVtJ3MgcGFyZW50IGlzIHZpc2libGUgYW5kIHRoaXMgaXMgbm90LCBiYWlsLlxuXHRcdGlmICggZWwucGFyZW50KCkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICYmICEgZWwuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIElmIHRoaXMgaXRlbSdzIHBhcmVudCBpcyB2aXNpYmxlIGFuZCB0aGlzIGl0ZW0gaXMgdmlzaWJsZSwgaGlkZSBpdHMgc3VibWVudSB0aGVuIGJhaWwuXG5cdFx0aWYgKCBlbC5wYXJlbnQoKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgJiYgZWwuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0ZWwucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcuc3ViLW1lbnUnICkucmVtb3ZlQ2xhc3MoICdzbGlkZUluTGVmdCcgKS5hZGRDbGFzcyggJ3NsaWRlT3V0TGVmdCcgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gT25seSB0cnkgdG8gY2xvc2Ugc3VibWVudXMgdGhhdCBhcmUgYWN0dWFsbHkgb3Blbi5cblx0XHRcdGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnc2xpZGVJbkxlZnQnICkgKSB7XG5cblx0XHRcdFx0Ly8gQ2xvc2UgdGhlIHBhcmVudCBsaXN0IGl0ZW0sIGFuZCBzZXQgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9uIGFyaWEgdG8gZmFsc2UuXG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUuXG5cdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xuXHRcdFx0fVxuXG5cdFx0fSApO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ucHJlcGVuZCggJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGNsYXNzPVwicGFyZW50LWluZGljYXRvclwiIGFyaWEtbGFiZWw9XCJPcGVuIHN1Ym1lbnVcIj48c3BhbiBjbGFzcz1cImRvd24tYXJyb3dcIj48L3NwYW4+PC9idXR0b24+JyApO1xuXHR9O1xuXG5cdC8vIERlYWwgd2l0aCB0aGUgc3VibWVudS5cblx0YXBwLnRvZ2dsZVN1Ym1lbnUgPSBmdW5jdGlvbiggZSApIHtcblxuXHRcdGxldCBlbCA9ICQoIHRoaXMgKSwgLy8gVGhlIG1lbnUgZWxlbWVudCB3aGljaCB3YXMgY2xpY2tlZCBvbi5cblx0XHRcdHN1Yk1lbnUgPSBlbC5jaGlsZHJlbiggJ3VsLnN1Yi1tZW51JyApLCAvLyBUaGUgbmVhcmVzdCBzdWJtZW51LlxuXHRcdFx0JHRhcmdldCA9ICQoIGUudGFyZ2V0ICk7IC8vIHRoZSBlbGVtZW50IHRoYXQncyBhY3R1YWxseSBiZWluZyBjbGlja2VkIChjaGlsZCBvZiB0aGUgbGkgdGhhdCB0cmlnZ2VyZWQgdGhlIGNsaWNrIGV2ZW50KS5cblxuXHRcdC8vIEZpZ3VyZSBvdXQgaWYgd2UncmUgY2xpY2tpbmcgdGhlIGJ1dHRvbiBvciBpdHMgYXJyb3cgY2hpbGQsXG5cdFx0Ly8gaWYgc28sIHdlIGNhbiBqdXN0IG9wZW4gb3IgY2xvc2UgdGhlIG1lbnUgYW5kIGJhaWwuXG5cdFx0aWYgKCAkdGFyZ2V0Lmhhc0NsYXNzKCAnZG93bi1hcnJvdycgKSB8fCAkdGFyZ2V0Lmhhc0NsYXNzKCAncGFyZW50LWluZGljYXRvcicgKSApIHtcblxuXHRcdFx0Ly8gRmlyc3QsIGNvbGxhcHNlIGFueSBhbHJlYWR5IG9wZW5lZCBzdWJtZW51cy5cblx0XHRcdGFwcC5zbGlkZU91dFN1Yk1lbnVzKCBlbCApO1xuXG5cdFx0XHRpZiAoICEgc3ViTWVudS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cblx0XHRcdFx0Ly8gT3BlbiB0aGUgc3VibWVudS5cblx0XHRcdFx0YXBwLm9wZW5TdWJtZW51KCBlbCwgc3ViTWVudSApO1xuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBPcGVuIGEgc3VibWVudS5cblx0YXBwLm9wZW5TdWJtZW51ID0gZnVuY3Rpb24oIHBhcmVudCwgc3ViTWVudSApIHtcblxuXHRcdC8vIEV4cGFuZCB0aGUgbGlzdCBtZW51IGl0ZW0sIGFuZCBzZXQgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9uIGFyaWEgdG8gdHJ1ZS5cblx0XHRwYXJlbnQuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcblxuXHRcdC8vIFNsaWRlIHRoZSBtZW51IGluLlxuXHRcdHN1Yk1lbnUuYWRkQ2xhc3MoICdpcy12aXNpYmxlIGFuaW1hdGVkIHNsaWRlSW5MZWZ0JyApO1xuXHR9O1xuXG5cdC8vIEZvcmNlIGNsb3NlIGFsbCB0aGUgc3VibWVudXMgd2hlbiB0aGUgbWFpbiBtZW51IGNvbnRhaW5lciBpcyBjbG9zZWQuXG5cdGFwcC5mb3JjZUNsb3NlU3VibWVudXMgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50IHRyaWdnZXJzIG9uIG9wZW4gYW5kIG9uIGNsb3NlLCBuZWVkIHRvIG1ha2Ugc3VyZSB3ZSBvbmx5IGRvIHRoaXMgb24gY2xvc2UuXG5cdFx0aWYgKCAhICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUgc2xpZGVJbkxlZnQnICk7XG5cdFx0XHRhcHAuJGMuYm9keS5jc3MoICdvdmVyZmxvdycsICd2aXNpYmxlJyApO1xuXHRcdFx0YXBwLiRjLmJvZHkudW5iaW5kKCAndG91Y2hzdGFydCcgKTtcblx0XHR9XG5cblx0XHRpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRhcHAuJGMuYm9keS5jc3MoICdvdmVyZmxvdycsICdoaWRkZW4nICk7XG5cdFx0XHRhcHAuJGMuYm9keS5iaW5kKCAndG91Y2hzdGFydCcsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRpZiAoICEgJCggZS50YXJnZXQgKS5wYXJlbnRzKCAnLmNvbnRhY3QtbW9kYWwnIClbMF0gKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2JpbGVNZW51ICkgKTtcbiIsIi8qKlxuICogRmlsZSBtb2RhbC5qc1xuICpcbiAqIERlYWwgd2l0aCBtdWx0aXBsZSBtb2RhbHMgYW5kIHRoZWlyIG1lZGlhLlxuICovXG53aW5kb3cud2RzTW9kYWwgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdGxldCAkbW9kYWxUb2dnbGUsXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuLFxuXHRcdCRwbGF5ZXIsXG5cdFx0JHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzY3JpcHQnICksXG5cdFx0JGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdzY3JpcHQnIClbMF0sXG5cdFx0WVQ7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0JGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCAkdGFnLCAkZmlyc3RTY3JpcHRUYWcgKTtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHQnYm9keSc6ICQoICdib2R5JyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkKCAnLm1vZGFsLXRyaWdnZXInICkubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFRyaWdnZXIgYSBtb2RhbCB0byBvcGVuLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICcubW9kYWwtdHJpZ2dlcicsIGFwcC5vcGVuTW9kYWwgKTtcblxuXHRcdC8vIFRyaWdnZXIgdGhlIGNsb3NlIGJ1dHRvbiB0byBjbG9zZSB0aGUgbW9kYWwuXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJy5jbG9zZScsIGFwcC5jbG9zZU1vZGFsICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgaGl0dGluZyB0aGUgZXNjIGtleS5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIGNsb3NlIHRoZSBtb2RhbCBieSBjbGlja2luZyBvdXRzaWRlIG9mIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnZGl2Lm1vZGFsLW9wZW4nLCBhcHAuY2xvc2VNb2RhbEJ5Q2xpY2sgKTtcblxuXHRcdC8vIExpc3RlbiB0byB0YWJzLCB0cmFwIGtleWJvYXJkIGlmIHdlIG5lZWQgdG9cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAudHJhcEtleWJvYXJkTWF5YmUgKTtcblxuXHR9O1xuXG5cdC8vIE9wZW4gdGhlIG1vZGFsLlxuXHRhcHAub3Blbk1vZGFsID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTdG9yZSB0aGUgbW9kYWwgdG9nZ2xlIGVsZW1lbnRcblx0XHQkbW9kYWxUb2dnbGUgPSAkKCB0aGlzICk7XG5cblx0XHQvLyBGaWd1cmUgb3V0IHdoaWNoIG1vZGFsIHdlJ3JlIG9wZW5pbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoIHRoaXMgKS5kYXRhKCAndGFyZ2V0JyApICk7XG5cblx0XHQvLyBEaXNwbGF5IHRoZSBtb2RhbC5cblx0XHQkbW9kYWwuYWRkQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gQWRkIGJvZHkgY2xhc3MuXG5cdFx0YXBwLiRjLmJvZHkuYWRkQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gRmluZCB0aGUgZm9jdXNhYmxlIGNoaWxkcmVuIG9mIHRoZSBtb2RhbC5cblx0XHQvLyBUaGlzIGxpc3QgbWF5IGJlIGluY29tcGxldGUsIHJlYWxseSB3aXNoIGpRdWVyeSBoYWQgdGhlIDpmb2N1c2FibGUgcHNldWRvIGxpa2UgalF1ZXJ5IFVJIGRvZXMuXG5cdFx0Ly8gRm9yIG1vcmUgYWJvdXQgOmlucHV0IHNlZTogaHR0cHM6Ly9hcGkuanF1ZXJ5LmNvbS9pbnB1dC1zZWxlY3Rvci9cblx0XHQkZm9jdXNhYmxlQ2hpbGRyZW4gPSAkbW9kYWwuZmluZCggJ2EsIDppbnB1dCwgW3RhYmluZGV4XScgKTtcblxuXHRcdC8vIElkZWFsbHksIHRoZXJlIGlzIGFsd2F5cyBvbmUgKHRoZSBjbG9zZSBidXR0b24pLCBidXQgeW91IG5ldmVyIGtub3cuXG5cdFx0aWYgKCAwIDwgJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCApIHtcblxuXHRcdFx0Ly8gU2hpZnQgZm9jdXMgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhlIG1vZGFsLlxuXHRhcHAuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gRmlndXJlIHRoZSBvcGVuZWQgbW9kYWwgd2UncmUgY2xvc2luZyBhbmQgc3RvcmUgdGhlIG9iamVjdC5cblx0XHRsZXQgJG1vZGFsID0gJCggJCggJ2Rpdi5tb2RhbC1vcGVuIC5jbG9zZScgKS5kYXRhKCAndGFyZ2V0JyApICksXG5cblx0XHRcdC8vIEZpbmQgdGhlIGlmcmFtZSBpbiB0aGUgJG1vZGFsIG9iamVjdC5cblx0XHRcdCRpZnJhbWUgPSAkbW9kYWwuZmluZCggJ2lmcmFtZScgKTtcblxuXHRcdC8vIE9ubHkgZG8gdGhpcyBpZiB0aGVyZSBhcmUgYW55IGlmcmFtZXMuXG5cdFx0aWYgKCAkaWZyYW1lLmxlbmd0aCApIHtcblxuXHRcdFx0Ly8gR2V0IHRoZSBpZnJhbWUgc3JjIFVSTC5cblx0XHRcdGxldCB1cmwgPSAkaWZyYW1lLmF0dHIoICdzcmMnICk7XG5cblx0XHRcdC8vIFJlbW92aW5nL1JlYWRkaW5nIHRoZSBVUkwgd2lsbCBlZmZlY3RpdmVseSBicmVhayB0aGUgWW91VHViZSBBUEkuXG5cdFx0XHQvLyBTbyBsZXQncyBub3QgZG8gdGhhdCB3aGVuIHRoZSBpZnJhbWUgVVJMIGNvbnRhaW5zIHRoZSBlbmFibGVqc2FwaSBwYXJhbWV0ZXIuXG5cdFx0XHRpZiAoICEgdXJsLmluY2x1ZGVzKCAnZW5hYmxlanNhcGk9MScgKSApIHtcblxuXHRcdFx0XHQvLyBSZW1vdmUgdGhlIHNvdXJjZSBVUkwsIHRoZW4gYWRkIGl0IGJhY2ssIHNvIHRoZSB2aWRlbyBjYW4gYmUgcGxheWVkIGFnYWluIGxhdGVyLlxuXHRcdFx0XHQkaWZyYW1lLmF0dHIoICdzcmMnLCAnJyApLmF0dHIoICdzcmMnLCB1cmwgKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gVXNlIHRoZSBZb3VUdWJlIEFQSSB0byBzdG9wIHRoZSB2aWRlby5cblx0XHRcdFx0JHBsYXllci5zdG9wVmlkZW8oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBGaW5hbGx5LCBoaWRlIHRoZSBtb2RhbC5cblx0XHQkbW9kYWwucmVtb3ZlQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJldmVydCBmb2N1cyBiYWNrIHRvIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlLmZvY3VzKCk7XG5cblx0fTtcblxuXHQvLyBDbG9zZSBpZiBcImVzY1wiIGtleSBpcyBwcmVzc2VkLlxuXHRhcHAuZXNjS2V5Q2xvc2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENsb3NlIGlmIHRoZSB1c2VyIGNsaWNrcyBvdXRzaWRlIG9mIHRoZSBtb2RhbFxuXHRhcHAuY2xvc2VNb2RhbEJ5Q2xpY2sgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHQvLyBJZiB0aGUgcGFyZW50IGNvbnRhaW5lciBpcyBOT1QgdGhlIG1vZGFsIGRpYWxvZyBjb250YWluZXIsIGNsb3NlIHRoZSBtb2RhbFxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnbW9kYWwtZGlhbG9nJyApICkge1xuXHRcdFx0YXBwLmNsb3NlTW9kYWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gVHJhcCB0aGUga2V5Ym9hcmQgaW50byBhIG1vZGFsIHdoZW4gb25lIGlzIGFjdGl2ZS5cblx0YXBwLnRyYXBLZXlib2FyZE1heWJlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gV2Ugb25seSBuZWVkIHRvIGRvIHN0dWZmIHdoZW4gdGhlIG1vZGFsIGlzIG9wZW4gYW5kIHRhYiBpcyBwcmVzc2VkLlxuXHRcdGlmICggOSA9PT0gZXZlbnQud2hpY2ggJiYgMCA8ICQoICcubW9kYWwtb3BlbicgKS5sZW5ndGggKSB7XG5cdFx0XHRsZXQgJGZvY3VzZWQgPSAkKCAnOmZvY3VzJyApLFxuXHRcdFx0XHRmb2N1c0luZGV4ID0gJGZvY3VzYWJsZUNoaWxkcmVuLmluZGV4KCAkZm9jdXNlZCApO1xuXG5cdFx0XHRpZiAoIDAgPT09IGZvY3VzSW5kZXggJiYgZXZlbnQuc2hpZnRLZXkgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQsIGFuZCBzaGlmdCBpcyBoZWxkIHdoZW4gcHJlc3NpbmcgdGFiLCBnbyBiYWNrIHRvIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblsgJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSBlbHNlIGlmICggISBldmVudC5zaGlmdEtleSAmJiBmb2N1c0luZGV4ID09PSAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGlzIGlzIHRoZSBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgbm90IGhlbGQsIGdvIGJhY2sgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSG9vayBpbnRvIFlvdVR1YmUgPGlmcmFtZT4uXG5cdGFwcC5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCAkbW9kYWwgPSAkKCAnZGl2Lm1vZGFsJyApLFxuXHRcdFx0JGlmcmFtZWlkID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICkuYXR0ciggJ2lkJyApO1xuXG5cdFx0JHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoICRpZnJhbWVpZCwge1xuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdCdvblJlYWR5JzogYXBwLm9uUGxheWVyUmVhZHksXG5cdFx0XHRcdCdvblN0YXRlQ2hhbmdlJzogYXBwLm9uUGxheWVyU3RhdGVDaGFuZ2Vcblx0XHRcdH1cblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciByZWFkeS5cblx0YXBwLm9uUGxheWVyUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0fTtcblxuXHQvLyBEbyBzb21ldGhpbmcgb24gcGxheWVyIHN0YXRlIGNoYW5nZS5cblx0YXBwLm9uUGxheWVyU3RhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFNldCBmb2N1cyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgaW5zaWRlIG9mIHRoZSBtb2RhbCB0aGUgcGxheWVyIGlzIGluLlxuXHRcdCQoIGV2ZW50LnRhcmdldC5hICkucGFyZW50cyggJy5tb2RhbCcgKS5maW5kKCAnYSwgOmlucHV0LCBbdGFiaW5kZXhdJyApLmZpcnN0KCkuZm9jdXMoKTtcblx0fTtcblxuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzTW9kYWwgKSApO1xuIiwiLyoqXG4gKiBGaWxlOiBuYXZpZ2F0aW9uLXByaW1hcnkuanNcbiAqXG4gKiBIZWxwZXJzIGZvciB0aGUgcHJpbWFyeSBuYXZpZ2F0aW9uLlxuICovXG53aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0c3ViTWVudUNvbnRhaW5lcjogJCggJy5tYWluLW5hdmlnYXRpb24gLnN1Yi1tZW51JyApLFxuXHRcdFx0c3ViTWVudVBhcmVudEl0ZW06ICQoICcubWFpbi1uYXZpZ2F0aW9uIGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJ2EnICkub24oICdmb2N1c2luIGZvY3Vzb3V0JywgYXBwLnRvZ2dsZUZvY3VzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnN1Yk1lbnVDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJz4gYScgKS5hcHBlbmQoICc8c3BhbiBjbGFzcz1cImNhcmV0LWRvd25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+JyApO1xuXHR9O1xuXG5cdC8vIFRvZ2dsZSB0aGUgZm9jdXMgY2xhc3Mgb24gdGhlIGxpbmsgcGFyZW50LlxuXHRhcHAudG9nZ2xlRm9jdXMgPSBmdW5jdGlvbigpIHtcblx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkudG9nZ2xlQ2xhc3MoICdmb2N1cycgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gKSApO1xuIiwiLyoqXG4gKiBGaWxlOiBvZmYtY2FudmFzLmpzXG4gKlxuICogSGVscCBkZWFsIHdpdGggdGhlIG9mZi1jYW52YXMgbW9iaWxlIG1lbnUuXG4gKi9cbndpbmRvdy53ZHNvZmZDYW52YXMgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdG9mZkNhbnZhc0Nsb3NlOiAkKCAnLm9mZi1jYW52YXMtY2xvc2UnICksXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInICksXG5cdFx0XHRvZmZDYW52YXNPcGVuOiAkKCAnLm9mZi1jYW52YXMtb3BlbicgKSxcblx0XHRcdG9mZkNhbnZhc1NjcmVlbjogJCggJy5vZmYtY2FudmFzLXNjcmVlbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC5lc2NLZXlDbG9zZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDbG9zZS5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4ub24oICdjbGljaycsIGFwcC50b2dnbGVvZmZDYW52YXMgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLm9uKCAnY2xpY2snLCBhcHAuY2xvc2VvZmZDYW52YXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBUbyBzaG93IG9yIG5vdCB0byBzaG93P1xuXHRhcHAudG9nZ2xlb2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoICd0cnVlJyA9PT0gJCggdGhpcyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApICkge1xuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFwcC5vcGVub2ZmQ2FudmFzKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gU2hvdyB0aGF0IGRyYXdlciFcblx0YXBwLm9wZW5vZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIGZhbHNlICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmZpbmQoICdidXR0b24nICkuZmlyc3QoKS5mb2N1cygpO1xuXHR9O1xuXG5cdC8vIENsb3NlIHRoYXQgZHJhd2VyIVxuXHRhcHAuY2xvc2VvZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hdHRyKCAnYXJpYS1oaWRkZW4nLCB0cnVlICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5mb2N1cygpO1xuXHR9O1xuXG5cdC8vIENsb3NlIGRyYXdlciBpZiBcImVzY1wiIGtleSBpcyBwcmVzc2VkLlxuXHRhcHAuZXNjS2V5Q2xvc2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdGFwcC5jbG9zZW9mZkNhbnZhcygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2Rzb2ZmQ2FudmFzICkgKTtcbiIsIi8qKlxuICogRmlsZSBza2lwLWxpbmstZm9jdXMtZml4LmpzLlxuICpcbiAqIEhlbHBzIHdpdGggYWNjZXNzaWJpbGl0eSBmb3Iga2V5Ym9hcmQgb25seSB1c2Vycy5cbiAqXG4gKiBMZWFybiBtb3JlOiBodHRwczovL2dpdC5pby92V2RyMlxuICovXG4oIGZ1bmN0aW9uKCkge1xuXHR2YXIgaXNXZWJraXQgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnd2Via2l0JyApLFxuXHRcdGlzT3BlcmEgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICksXG5cdFx0aXNJZSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApO1xuXG5cdGlmICggKCBpc1dlYmtpdCB8fCBpc09wZXJhIHx8IGlzSWUgKSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpZCA9IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICksXG5cdFx0XHRcdGVsZW1lbnQ7XG5cblx0XHRcdGlmICggISAoIC9eW0EtejAtOV8tXSskLyApLnRlc3QoIGlkICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGlmICggISAoIC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaSApLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSApO1xuXHR9XG59KCkgKTtcbiIsIi8qKlxuICogRmlsZSB3aW5kb3ctcmVhZHkuanNcbiAqXG4gKiBBZGQgYSBcInJlYWR5XCIgY2xhc3MgdG8gPGJvZHk+IHdoZW4gd2luZG93IGlzIHJlYWR5LlxuICovXG53aW5kb3cud2RzV2luZG93UmVhZHkgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdH07XG5cblx0Ly8gQ2FjaGUgZG9jdW1lbnQgZWxlbWVudHMuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdCd3aW5kb3cnOiAkKCB3aW5kb3cgKSxcblx0XHRcdCdib2R5JzogJCggZG9jdW1lbnQuYm9keSApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5sb2FkKCBhcHAuYWRkQm9keUNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWRkIGEgY2xhc3MgdG8gPGJvZHk+LlxuXHRhcHAuYWRkQm9keUNsYXNzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkuYWRkQ2xhc3MoICdyZWFkeScgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1dpbmRvd1JlYWR5ICkgKTtcbiJdfQ==
