'use strict';

/**
 * File hero-carousel.js
 *
 * Create a carousel if we have more than one hero slide.
 */
window.wdsHeroCarousel = {};
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
			heroCarousel: $('.carousel')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.doSlick);
		app.$c.window.on('load', app.doFirstAnimation);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.heroCarousel.length;
	};

	// Animate the first slide on window load.
	app.doFirstAnimation = function () {

		// Get the first slide content area and animation attribute.
		var firstSlide = app.$c.heroCarousel.find('[data-slick-index=0]'),
		    firstSlideContent = firstSlide.find('.hero-content'),
		    firstAnimation = firstSlideContent.attr('data-animation');

		// Add the animation class to the first slide.
		firstSlideContent.addClass(firstAnimation);
	};

	// Animate the slide content.
	app.doAnimation = function (event, slick) {

		var slides = $('.slide'),
		    activeSlide = $('.slick-current'),
		    activeContent = activeSlide.find('.hero-content'),


		// This is a string like so: 'animated someCssClass'.
		animationClass = activeContent.attr('data-animation'),
		    splitAnimation = animationClass.split(' '),


		// This is the 'animated' class.
		animationTrigger = splitAnimation[0],


		// This is the animate.css class.
		animateCss = splitAnimation[1];

		// Go through each slide to see if we've already set animation classes.
		slides.each(function (index, element) {

			var slideContent = $(this).find('.hero-content');

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

		app.$c.heroCarousel.on('init', app.playBackgroundVideos);

		app.$c.heroCarousel.slick({
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: false,
			dots: false,
			focusOnSelect: true,
			waitForAnimate: true
		});

		app.$c.heroCarousel.on('afterChange', app.doAnimation);
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsHeroCarousel);
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
			window: $(window),
			subMenuContainer: $('.mobile-menu .sub-menu'),
			subMenuParentItem: $('.mobile-menu li.menu-item-has-children'),
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
	app.resetSubMenu = function (e) {
		var $target = $(e.target);

		// When the list item is done transitioning in height,
		// remove the classes from the submenu so it is ready to toggle again.
		if ($target.is('li.menu-item-has-children') && !$target.hasClass('is-visible')) {
			$target.find('ul.sub-menu').removeClass('slideOutLeft is-visible');
		}
	};

	// Slide out the submenu items.
	app.slideOutSubMenus = function () {
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
			app.slideOutSubMenus();

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlcm8tY2Fyb3VzZWwuanMiLCJqcy1lbmFibGVkLmpzIiwibW9iaWxlLW1lbnUuanMiLCJtb2RhbC5qcyIsIm5hdmlnYXRpb24tcHJpbWFyeS5qcyIsIm9mZi1jYW52YXMuanMiLCJza2lwLWxpbmstZm9jdXMtZml4LmpzIiwid2luZG93LXJlYWR5LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIndkc0hlcm9DYXJvdXNlbCIsIiQiLCJhcHAiLCJpbml0IiwiY2FjaGUiLCJtZWV0c1JlcXVpcmVtZW50cyIsImJpbmRFdmVudHMiLCIkYyIsImhlcm9DYXJvdXNlbCIsIm9uIiwiZG9TbGljayIsImRvRmlyc3RBbmltYXRpb24iLCJsZW5ndGgiLCJmaXJzdFNsaWRlIiwiZmluZCIsImZpcnN0U2xpZGVDb250ZW50IiwiZmlyc3RBbmltYXRpb24iLCJhdHRyIiwiYWRkQ2xhc3MiLCJkb0FuaW1hdGlvbiIsImV2ZW50Iiwic2xpY2siLCJzbGlkZXMiLCJhY3RpdmVTbGlkZSIsImFjdGl2ZUNvbnRlbnQiLCJhbmltYXRpb25DbGFzcyIsInNwbGl0QW5pbWF0aW9uIiwic3BsaXQiLCJhbmltYXRpb25UcmlnZ2VyIiwiYW5pbWF0ZUNzcyIsImVhY2giLCJpbmRleCIsImVsZW1lbnQiLCJzbGlkZUNvbnRlbnQiLCJoYXNDbGFzcyIsImxhc3RDbGFzcyIsInBvcCIsInJlbW92ZUNsYXNzIiwicGxheUJhY2tncm91bmRWaWRlb3MiLCJwbGF5IiwiYXV0b3BsYXkiLCJhdXRvcGxheVNwZWVkIiwiYXJyb3dzIiwiZG90cyIsImZvY3VzT25TZWxlY3QiLCJ3YWl0Rm9yQW5pbWF0ZSIsImpRdWVyeSIsImRvY3VtZW50IiwiYm9keSIsImNsYXNzTmFtZSIsInJlcGxhY2UiLCJ3ZHNNb2JpbGVNZW51Iiwic3ViTWVudUNvbnRhaW5lciIsInN1Yk1lbnVQYXJlbnRJdGVtIiwib2ZmQ2FudmFzQ29udGFpbmVyIiwiYWRkRG93bkFycm93IiwidG9nZ2xlU3VibWVudSIsInJlc2V0U3ViTWVudSIsImZvcmNlQ2xvc2VTdWJtZW51cyIsImUiLCIkdGFyZ2V0IiwidGFyZ2V0IiwiaXMiLCJzbGlkZU91dFN1Yk1lbnVzIiwicGFyZW50IiwicHJlcGVuZCIsImVsIiwic3ViTWVudSIsImNoaWxkcmVuIiwib3BlblN1Ym1lbnUiLCJ3ZHNNb2RhbCIsIiRtb2RhbFRvZ2dsZSIsIiRmb2N1c2FibGVDaGlsZHJlbiIsIiRwbGF5ZXIiLCIkdGFnIiwiY3JlYXRlRWxlbWVudCIsIiRmaXJzdFNjcmlwdFRhZyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiWVQiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwib3Blbk1vZGFsIiwiY2xvc2VNb2RhbCIsImVzY0tleUNsb3NlIiwiY2xvc2VNb2RhbEJ5Q2xpY2siLCJ0cmFwS2V5Ym9hcmRNYXliZSIsIiRtb2RhbCIsImRhdGEiLCJmb2N1cyIsIiRpZnJhbWUiLCJ1cmwiLCJpbmNsdWRlcyIsInN0b3BWaWRlbyIsImtleUNvZGUiLCJwYXJlbnRzIiwid2hpY2giLCIkZm9jdXNlZCIsImZvY3VzSW5kZXgiLCJzaGlmdEtleSIsInByZXZlbnREZWZhdWx0Iiwib25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkiLCIkaWZyYW1laWQiLCJQbGF5ZXIiLCJldmVudHMiLCJvblBsYXllclJlYWR5Iiwib25QbGF5ZXJTdGF0ZUNoYW5nZSIsImEiLCJmaXJzdCIsIndkc1ByaW1hcnlOYXZpZ2F0aW9uIiwidG9nZ2xlRm9jdXMiLCJhcHBlbmQiLCJ0b2dnbGVDbGFzcyIsIndkc29mZkNhbnZhcyIsIm9mZkNhbnZhc0Nsb3NlIiwib2ZmQ2FudmFzT3BlbiIsIm9mZkNhbnZhc1NjcmVlbiIsImNsb3Nlb2ZmQ2FudmFzIiwidG9nZ2xlb2ZmQ2FudmFzIiwib3Blbm9mZkNhbnZhcyIsImlzV2Via2l0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwiaXNPcGVyYSIsImlzSWUiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZCIsImxvY2F0aW9uIiwiaGFzaCIsInN1YnN0cmluZyIsInRlc3QiLCJ0YWdOYW1lIiwidGFiSW5kZXgiLCJ3ZHNXaW5kb3dSZWFkeSIsImxvYWQiLCJhZGRCb2R5Q2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7O0FBS0FBLE9BQU9DLGVBQVAsR0FBeUIsRUFBekI7QUFDRSxXQUFVRCxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKOztBQUVBLE1BQUtGLElBQUlHLGlCQUFKLEVBQUwsRUFBK0I7QUFDOUJILE9BQUlJLFVBQUo7QUFDQTtBQUNELEVBTkQ7O0FBUUE7QUFDQUosS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlLLEVBQUosR0FBUztBQUNSUixXQUFRRSxFQUFHRixNQUFILENBREE7QUFFUlMsaUJBQWNQLEVBQUcsV0FBSDtBQUZOLEdBQVQ7QUFJQSxFQUxEOztBQU9BO0FBQ0FDLEtBQUlJLFVBQUosR0FBaUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPUixNQUFQLENBQWNVLEVBQWQsQ0FBa0IsTUFBbEIsRUFBMEJQLElBQUlRLE9BQTlCO0FBQ0FSLE1BQUlLLEVBQUosQ0FBT1IsTUFBUCxDQUFjVSxFQUFkLENBQWtCLE1BQWxCLEVBQTBCUCxJQUFJUyxnQkFBOUI7QUFFQSxFQUpEOztBQU1BO0FBQ0FULEtBQUlHLGlCQUFKLEdBQXdCLFlBQVc7QUFDbEMsU0FBT0gsSUFBSUssRUFBSixDQUFPQyxZQUFQLENBQW9CSSxNQUEzQjtBQUNBLEVBRkQ7O0FBSUE7QUFDQVYsS0FBSVMsZ0JBQUosR0FBdUIsWUFBVzs7QUFFakM7QUFDQSxNQUFJRSxhQUFhWCxJQUFJSyxFQUFKLENBQU9DLFlBQVAsQ0FBb0JNLElBQXBCLENBQTBCLHNCQUExQixDQUFqQjtBQUFBLE1BQ0NDLG9CQUFvQkYsV0FBV0MsSUFBWCxDQUFpQixlQUFqQixDQURyQjtBQUFBLE1B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QixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKO0FBQ0FGLE1BQUlJLFVBQUo7QUFDQSxFQUhEOztBQUtBO0FBQ0FKLEtBQUlFLEtBQUosR0FBWSxZQUFXO0FBQ3RCRixNQUFJSyxFQUFKLEdBQVM7QUFDUixhQUFVTixFQUFHRixNQUFILENBREY7QUFFUixXQUFRRSxFQUFHOEMsU0FBU0MsSUFBWjtBQUZBLEdBQVQ7QUFJQSxFQUxEOztBQU9BO0FBQ0E5QyxLQUFJSSxVQUFKLEdBQWlCLFlBQVc7QUFDM0JKLE1BQUlLLEVBQUosQ0FBT1IsTUFBUCxDQUFjeUksSUFBZCxDQUFvQnRJLElBQUl1SSxZQUF4QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQXZJLEtBQUl1SSxZQUFKLEdBQW1CLFlBQVc7QUFDN0J2SSxNQUFJSyxFQUFKLENBQU95QyxJQUFQLENBQVk5QixRQUFaLENBQXNCLE9BQXRCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBakIsR0FBR0MsSUFBSUMsSUFBUDtBQUNBLENBNUJDLEVBNEJDSixNQTVCRCxFQTRCUytDLE1BNUJULEVBNEJpQi9DLE9BQU93SSxjQTVCeEIsQ0FBRiIsImZpbGUiOiJwcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGaWxlIGhlcm8tY2Fyb3VzZWwuanNcbiAqXG4gKiBDcmVhdGUgYSBjYXJvdXNlbCBpZiB3ZSBoYXZlIG1vcmUgdGhhbiBvbmUgaGVybyBzbGlkZS5cbiAqL1xud2luZG93Lndkc0hlcm9DYXJvdXNlbCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRoZXJvQ2Fyb3VzZWw6ICQoICcuY2Fyb3VzZWwnIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5kb1NsaWNrICk7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuZG9GaXJzdEFuaW1hdGlvbiApO1xuXG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLmhlcm9DYXJvdXNlbC5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQW5pbWF0ZSB0aGUgZmlyc3Qgc2xpZGUgb24gd2luZG93IGxvYWQuXG5cdGFwcC5kb0ZpcnN0QW5pbWF0aW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBHZXQgdGhlIGZpcnN0IHNsaWRlIGNvbnRlbnQgYXJlYSBhbmQgYW5pbWF0aW9uIGF0dHJpYnV0ZS5cblx0XHRsZXQgZmlyc3RTbGlkZSA9IGFwcC4kYy5oZXJvQ2Fyb3VzZWwuZmluZCggJ1tkYXRhLXNsaWNrLWluZGV4PTBdJyApLFxuXHRcdFx0Zmlyc3RTbGlkZUNvbnRlbnQgPSBmaXJzdFNsaWRlLmZpbmQoICcuaGVyby1jb250ZW50JyApLFxuXHRcdFx0Zmlyc3RBbmltYXRpb24gPSBmaXJzdFNsaWRlQ29udGVudC5hdHRyKCAnZGF0YS1hbmltYXRpb24nICk7XG5cblx0XHQvLyBBZGQgdGhlIGFuaW1hdGlvbiBjbGFzcyB0byB0aGUgZmlyc3Qgc2xpZGUuXG5cdFx0Zmlyc3RTbGlkZUNvbnRlbnQuYWRkQ2xhc3MoIGZpcnN0QW5pbWF0aW9uICk7XG5cdH07XG5cblx0Ly8gQW5pbWF0ZSB0aGUgc2xpZGUgY29udGVudC5cblx0YXBwLmRvQW5pbWF0aW9uID0gZnVuY3Rpb24oIGV2ZW50LCBzbGljayApIHtcblxuXHRcdGxldCBzbGlkZXMgPSAkKCAnLnNsaWRlJyApLFxuXHRcdFx0YWN0aXZlU2xpZGUgPSAkKCAnLnNsaWNrLWN1cnJlbnQnICksXG5cdFx0XHRhY3RpdmVDb250ZW50ID0gYWN0aXZlU2xpZGUuZmluZCggJy5oZXJvLWNvbnRlbnQnICksXG5cblx0XHRcdC8vIFRoaXMgaXMgYSBzdHJpbmcgbGlrZSBzbzogJ2FuaW1hdGVkIHNvbWVDc3NDbGFzcycuXG5cdFx0XHRhbmltYXRpb25DbGFzcyA9IGFjdGl2ZUNvbnRlbnQuYXR0ciggJ2RhdGEtYW5pbWF0aW9uJyApLFxuXHRcdFx0c3BsaXRBbmltYXRpb24gPSBhbmltYXRpb25DbGFzcy5zcGxpdCggJyAnICksXG5cblx0XHRcdC8vIFRoaXMgaXMgdGhlICdhbmltYXRlZCcgY2xhc3MuXG5cdFx0XHRhbmltYXRpb25UcmlnZ2VyID0gc3BsaXRBbmltYXRpb25bMF0sXG5cblx0XHQvLyBUaGlzIGlzIHRoZSBhbmltYXRlLmNzcyBjbGFzcy5cblx0XHRhbmltYXRlQ3NzID0gc3BsaXRBbmltYXRpb25bMV07XG5cblx0XHQvLyBHbyB0aHJvdWdoIGVhY2ggc2xpZGUgdG8gc2VlIGlmIHdlJ3ZlIGFscmVhZHkgc2V0IGFuaW1hdGlvbiBjbGFzc2VzLlxuXHRcdHNsaWRlcy5lYWNoKCBmdW5jdGlvbiggaW5kZXgsIGVsZW1lbnQgKSB7XG5cblx0XHRcdGxldCBzbGlkZUNvbnRlbnQgPSAkKCB0aGlzICkuZmluZCggJy5oZXJvLWNvbnRlbnQnICk7XG5cblx0XHRcdC8vIElmIHdlJ3ZlIHNldCBhbmltYXRpb24gY2xhc3NlcyBvbiBhIHNsaWRlLCByZW1vdmUgdGhlbS5cblx0XHRcdGlmICggc2xpZGVDb250ZW50Lmhhc0NsYXNzKCAnYW5pbWF0ZWQnICkgKSB7XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBsYXN0IGNsYXNzLCB3aGljaCBpcyB0aGUgYW5pbWF0ZS5jc3MgY2xhc3MuXG5cdFx0XHRcdGxldCBsYXN0Q2xhc3MgPSBzbGlkZUNvbnRlbnQuYXR0ciggJ2NsYXNzJyApLnNwbGl0KCAnICcgKS5wb3AoICk7XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIGJvdGggYW5pbWF0aW9uIGNsYXNzZXMuXG5cdFx0XHRcdHNsaWRlQ29udGVudC5yZW1vdmVDbGFzcyggbGFzdENsYXNzICkucmVtb3ZlQ2xhc3MoIGFuaW1hdGlvblRyaWdnZXIgKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIEFkZCBhbmltYXRpb24gY2xhc3NlcyBhZnRlciBzbGlkZSBpcyBpbiB2aWV3LlxuXHRcdGFjdGl2ZUNvbnRlbnQuYWRkQ2xhc3MoIGFuaW1hdGlvbkNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWxsb3cgYmFja2dyb3VuZCB2aWRlb3MgdG8gYXV0b3BsYXkuXG5cdGFwcC5wbGF5QmFja2dyb3VuZFZpZGVvcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IGFsbCB0aGUgdmlkZW9zIGluIG91ciBzbGlkZXMgb2JqZWN0LlxuXHRcdCQoICd2aWRlbycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gTGV0IHRoZW0gYXV0b3BsYXkuIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0aGlzIGxhdGVyIHRvIG9ubHkgcGxheSB0aGUgdmlzaWJsZSBzbGlkZSB2aWRlby5cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIEtpY2sgb2ZmIFNsaWNrLlxuXHRhcHAuZG9TbGljayA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLiRjLmhlcm9DYXJvdXNlbC5vbiggJ2luaXQnLCBhcHAucGxheUJhY2tncm91bmRWaWRlb3MgKTtcblxuXHRcdGFwcC4kYy5oZXJvQ2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0YXV0b3BsYXk6IHRydWUsXG5cdFx0XHRhdXRvcGxheVNwZWVkOiA1MDAwLFxuXHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdGRvdHM6IGZhbHNlLFxuXHRcdFx0Zm9jdXNPblNlbGVjdDogdHJ1ZSxcblx0XHRcdHdhaXRGb3JBbmltYXRlOiB0cnVlXG5cdFx0fSk7XG5cblx0XHRhcHAuJGMuaGVyb0Nhcm91c2VsLm9uKCAnYWZ0ZXJDaGFuZ2UnLCBhcHAuZG9BbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzSGVyb0Nhcm91c2VsICkgKTtcbiIsIi8qKlxuICogRmlsZSBqcy1lbmFibGVkLmpzXG4gKlxuICogSWYgSmF2YXNjcmlwdCBpcyBlbmFibGVkLCByZXBsYWNlIHRoZSA8Ym9keT4gY2xhc3MgXCJuby1qc1wiLlxuICovXG5kb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoICduby1qcycsICdqcycgKTtcbiIsIi8qKlxuICogRmlsZTogbW9iaWxlLW1lbnUuanNcbiAqXG4gKiBDcmVhdGUgYW4gYWNjb3JkaW9uIHN0eWxlIGRyb3Bkb3duLlxuICovXG53aW5kb3cud2RzTW9iaWxlTWVudSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudScgKSxcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1vYmlsZS1tZW51IGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICksXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICdjbGljaycsIGFwcC50b2dnbGVTdWJtZW51ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5yZXNldFN1Yk1lbnUgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5mb3JjZUNsb3NlU3VibWVudXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gUmVzZXQgdGhlIHN1Ym1lbnVzIGFmdGVyIGl0J3MgZG9uZSBjbG9zaW5nLlxuXHRhcHAucmVzZXRTdWJNZW51ID0gZnVuY3Rpb24oIGUgKSB7XG5cdFx0Y29uc3QgJHRhcmdldCA9ICQoIGUudGFyZ2V0ICk7XG5cblx0XHQvLyBXaGVuIHRoZSBsaXN0IGl0ZW0gaXMgZG9uZSB0cmFuc2l0aW9uaW5nIGluIGhlaWdodCxcblx0XHQvLyByZW1vdmUgdGhlIGNsYXNzZXMgZnJvbSB0aGUgc3VibWVudSBzbyBpdCBpcyByZWFkeSB0byB0b2dnbGUgYWdhaW4uXG5cdFx0aWYgKCAkdGFyZ2V0LmlzKCAnbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKSAmJiAhICR0YXJnZXQuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0JHRhcmdldC5maW5kKCAndWwuc3ViLW1lbnUnICkucmVtb3ZlQ2xhc3MoICdzbGlkZU91dExlZnQgaXMtdmlzaWJsZScgKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUgaXRlbXMuXG5cdGFwcC5zbGlkZU91dFN1Yk1lbnVzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnN1Yk1lbnVDb250YWluZXIuZWFjaCggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIE9ubHkgdHJ5IHRvIGNsb3NlIHN1Ym1lbnVzIHRoYXQgYXJlIGFjdHVhbGx5IG9wZW4uXG5cdFx0XHRpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ3NsaWRlSW5MZWZ0JyApICkge1xuXG5cdFx0XHRcdC8vIENsb3NlIHRoZSBwYXJlbnQgbGlzdCBpdGVtLCBhbmQgc2V0IHRoZSBjb3JyZXNwb25kaW5nIGJ1dHRvbiBhcmlhIHRvIGZhbHNlLlxuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gU2xpZGUgb3V0IHRoZSBzdWJtZW51LlxuXHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlQ2xhc3MoICdzbGlkZUluTGVmdCcgKS5hZGRDbGFzcyggJ3NsaWRlT3V0TGVmdCcgKTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ucHJlcGVuZCggJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGNsYXNzPVwicGFyZW50LWluZGljYXRvclwiIGFyaWEtbGFiZWw9XCJPcGVuIHN1Ym1lbnVcIj48c3BhbiBjbGFzcz1cImRvd24tYXJyb3dcIj48L3NwYW4+PC9idXR0b24+JyApO1xuXHR9O1xuXG5cdC8vIERlYWwgd2l0aCB0aGUgc3VibWVudS5cblx0YXBwLnRvZ2dsZVN1Ym1lbnUgPSBmdW5jdGlvbiggZSApIHtcblxuXHRcdGxldCBlbCA9ICQoIHRoaXMgKSwgLy8gVGhlIG1lbnUgZWxlbWVudCB3aGljaCB3YXMgY2xpY2tlZCBvbi5cblx0XHRcdHN1Yk1lbnUgPSBlbC5jaGlsZHJlbiggJ3VsLnN1Yi1tZW51JyApLCAvLyBUaGUgbmVhcmVzdCBzdWJtZW51LlxuXHRcdFx0JHRhcmdldCA9ICQoIGUudGFyZ2V0ICk7IC8vIHRoZSBlbGVtZW50IHRoYXQncyBhY3R1YWxseSBiZWluZyBjbGlja2VkIChjaGlsZCBvZiB0aGUgbGkgdGhhdCB0cmlnZ2VyZWQgdGhlIGNsaWNrIGV2ZW50KS5cblxuXHRcdC8vIEZpZ3VyZSBvdXQgaWYgd2UncmUgY2xpY2tpbmcgdGhlIGJ1dHRvbiBvciBpdHMgYXJyb3cgY2hpbGQsXG5cdFx0Ly8gaWYgc28sIHdlIGNhbiBqdXN0IG9wZW4gb3IgY2xvc2UgdGhlIG1lbnUgYW5kIGJhaWwuXG5cdFx0aWYgKCAkdGFyZ2V0Lmhhc0NsYXNzKCAnZG93bi1hcnJvdycgKSB8fCAkdGFyZ2V0Lmhhc0NsYXNzKCAncGFyZW50LWluZGljYXRvcicgKSApIHtcblxuXHRcdFx0Ly8gRmlyc3QsIGNvbGxhcHNlIGFueSBhbHJlYWR5IG9wZW5lZCBzdWJtZW51cy5cblx0XHRcdGFwcC5zbGlkZU91dFN1Yk1lbnVzKCk7XG5cblx0XHRcdGlmICggISBzdWJNZW51Lmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblxuXHRcdFx0XHQvLyBPcGVuIHRoZSBzdWJtZW51LlxuXHRcdFx0XHRhcHAub3BlblN1Ym1lbnUoIGVsLCBzdWJNZW51ICk7XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIE9wZW4gYSBzdWJtZW51LlxuXHRhcHAub3BlblN1Ym1lbnUgPSBmdW5jdGlvbiggcGFyZW50LCBzdWJNZW51ICkge1xuXG5cdFx0Ly8gRXhwYW5kIHRoZSBsaXN0IG1lbnUgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byB0cnVlLlxuXHRcdHBhcmVudC5hZGRDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXG5cdFx0Ly8gU2xpZGUgdGhlIG1lbnUgaW4uXG5cdFx0c3ViTWVudS5hZGRDbGFzcyggJ2lzLXZpc2libGUgYW5pbWF0ZWQgc2xpZGVJbkxlZnQnICk7XG5cblx0fTtcblxuXHQvLyBGb3JjZSBjbG9zZSBhbGwgdGhlIHN1Ym1lbnVzIHdoZW4gdGhlIG1haW4gbWVudSBjb250YWluZXIgaXMgY2xvc2VkLlxuXHRhcHAuZm9yY2VDbG9zZVN1Ym1lbnVzID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBUaGUgdHJhbnNpdGlvbmVuZCBldmVudCB0cmlnZ2VycyBvbiBvcGVuIGFuZCBvbiBjbG9zZSwgbmVlZCB0byBtYWtlIHN1cmUgd2Ugb25seSBkbyB0aGlzIG9uIGNsb3NlLlxuXHRcdGlmICggISAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdFx0YXBwLiRjLnN1Yk1lbnVDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlIHNsaWRlSW5MZWZ0JyApO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2JpbGVNZW51ICkgKTtcbiIsIi8qKlxuICogRmlsZSBtb2RhbC5qc1xuICpcbiAqIERlYWwgd2l0aCBtdWx0aXBsZSBtb2RhbHMgYW5kIHRoZWlyIG1lZGlhLlxuICovXG53aW5kb3cud2RzTW9kYWwgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdGxldCAkbW9kYWxUb2dnbGUsXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuLFxuXHRcdCRwbGF5ZXIsXG5cdFx0JHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzY3JpcHQnICksXG5cdFx0JGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdzY3JpcHQnIClbMF0sXG5cdFx0WVQ7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0JGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCAkdGFnLCAkZmlyc3RTY3JpcHRUYWcgKTtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHQnYm9keSc6ICQoICdib2R5JyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkKCAnLm1vZGFsLXRyaWdnZXInICkubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFRyaWdnZXIgYSBtb2RhbCB0byBvcGVuLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICcubW9kYWwtdHJpZ2dlcicsIGFwcC5vcGVuTW9kYWwgKTtcblxuXHRcdC8vIFRyaWdnZXIgdGhlIGNsb3NlIGJ1dHRvbiB0byBjbG9zZSB0aGUgbW9kYWwuXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJy5jbG9zZScsIGFwcC5jbG9zZU1vZGFsICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgaGl0dGluZyB0aGUgZXNjIGtleS5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIGNsb3NlIHRoZSBtb2RhbCBieSBjbGlja2luZyBvdXRzaWRlIG9mIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnZGl2Lm1vZGFsLW9wZW4nLCBhcHAuY2xvc2VNb2RhbEJ5Q2xpY2sgKTtcblxuXHRcdC8vIExpc3RlbiB0byB0YWJzLCB0cmFwIGtleWJvYXJkIGlmIHdlIG5lZWQgdG9cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAudHJhcEtleWJvYXJkTWF5YmUgKTtcblxuXHR9O1xuXG5cdC8vIE9wZW4gdGhlIG1vZGFsLlxuXHRhcHAub3Blbk1vZGFsID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTdG9yZSB0aGUgbW9kYWwgdG9nZ2xlIGVsZW1lbnRcblx0XHQkbW9kYWxUb2dnbGUgPSAkKCB0aGlzICk7XG5cblx0XHQvLyBGaWd1cmUgb3V0IHdoaWNoIG1vZGFsIHdlJ3JlIG9wZW5pbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoIHRoaXMgKS5kYXRhKCAndGFyZ2V0JyApICk7XG5cblx0XHQvLyBEaXNwbGF5IHRoZSBtb2RhbC5cblx0XHQkbW9kYWwuYWRkQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gQWRkIGJvZHkgY2xhc3MuXG5cdFx0YXBwLiRjLmJvZHkuYWRkQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gRmluZCB0aGUgZm9jdXNhYmxlIGNoaWxkcmVuIG9mIHRoZSBtb2RhbC5cblx0XHQvLyBUaGlzIGxpc3QgbWF5IGJlIGluY29tcGxldGUsIHJlYWxseSB3aXNoIGpRdWVyeSBoYWQgdGhlIDpmb2N1c2FibGUgcHNldWRvIGxpa2UgalF1ZXJ5IFVJIGRvZXMuXG5cdFx0Ly8gRm9yIG1vcmUgYWJvdXQgOmlucHV0IHNlZTogaHR0cHM6Ly9hcGkuanF1ZXJ5LmNvbS9pbnB1dC1zZWxlY3Rvci9cblx0XHQkZm9jdXNhYmxlQ2hpbGRyZW4gPSAkbW9kYWwuZmluZCggJ2EsIDppbnB1dCwgW3RhYmluZGV4XScgKTtcblxuXHRcdC8vIElkZWFsbHksIHRoZXJlIGlzIGFsd2F5cyBvbmUgKHRoZSBjbG9zZSBidXR0b24pLCBidXQgeW91IG5ldmVyIGtub3cuXG5cdFx0aWYgKCAwIDwgJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCApIHtcblxuXHRcdFx0Ly8gU2hpZnQgZm9jdXMgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhlIG1vZGFsLlxuXHRhcHAuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gRmlndXJlIHRoZSBvcGVuZWQgbW9kYWwgd2UncmUgY2xvc2luZyBhbmQgc3RvcmUgdGhlIG9iamVjdC5cblx0XHRsZXQgJG1vZGFsID0gJCggJCggJ2Rpdi5tb2RhbC1vcGVuIC5jbG9zZScgKS5kYXRhKCAndGFyZ2V0JyApICksXG5cblx0XHRcdC8vIEZpbmQgdGhlIGlmcmFtZSBpbiB0aGUgJG1vZGFsIG9iamVjdC5cblx0XHRcdCRpZnJhbWUgPSAkbW9kYWwuZmluZCggJ2lmcmFtZScgKTtcblxuXHRcdC8vIE9ubHkgZG8gdGhpcyBpZiB0aGVyZSBhcmUgYW55IGlmcmFtZXMuXG5cdFx0aWYgKCAkaWZyYW1lLmxlbmd0aCApIHtcblxuXHRcdFx0Ly8gR2V0IHRoZSBpZnJhbWUgc3JjIFVSTC5cblx0XHRcdGxldCB1cmwgPSAkaWZyYW1lLmF0dHIoICdzcmMnICk7XG5cblx0XHRcdC8vIFJlbW92aW5nL1JlYWRkaW5nIHRoZSBVUkwgd2lsbCBlZmZlY3RpdmVseSBicmVhayB0aGUgWW91VHViZSBBUEkuXG5cdFx0XHQvLyBTbyBsZXQncyBub3QgZG8gdGhhdCB3aGVuIHRoZSBpZnJhbWUgVVJMIGNvbnRhaW5zIHRoZSBlbmFibGVqc2FwaSBwYXJhbWV0ZXIuXG5cdFx0XHRpZiAoICEgdXJsLmluY2x1ZGVzKCAnZW5hYmxlanNhcGk9MScgKSApIHtcblxuXHRcdFx0XHQvLyBSZW1vdmUgdGhlIHNvdXJjZSBVUkwsIHRoZW4gYWRkIGl0IGJhY2ssIHNvIHRoZSB2aWRlbyBjYW4gYmUgcGxheWVkIGFnYWluIGxhdGVyLlxuXHRcdFx0XHQkaWZyYW1lLmF0dHIoICdzcmMnLCAnJyApLmF0dHIoICdzcmMnLCB1cmwgKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gVXNlIHRoZSBZb3VUdWJlIEFQSSB0byBzdG9wIHRoZSB2aWRlby5cblx0XHRcdFx0JHBsYXllci5zdG9wVmlkZW8oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBGaW5hbGx5LCBoaWRlIHRoZSBtb2RhbC5cblx0XHQkbW9kYWwucmVtb3ZlQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJldmVydCBmb2N1cyBiYWNrIHRvIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlLmZvY3VzKCk7XG5cblx0fTtcblxuXHQvLyBDbG9zZSBpZiBcImVzY1wiIGtleSBpcyBwcmVzc2VkLlxuXHRhcHAuZXNjS2V5Q2xvc2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENsb3NlIGlmIHRoZSB1c2VyIGNsaWNrcyBvdXRzaWRlIG9mIHRoZSBtb2RhbFxuXHRhcHAuY2xvc2VNb2RhbEJ5Q2xpY2sgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHQvLyBJZiB0aGUgcGFyZW50IGNvbnRhaW5lciBpcyBOT1QgdGhlIG1vZGFsIGRpYWxvZyBjb250YWluZXIsIGNsb3NlIHRoZSBtb2RhbFxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnbW9kYWwtZGlhbG9nJyApICkge1xuXHRcdFx0YXBwLmNsb3NlTW9kYWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gVHJhcCB0aGUga2V5Ym9hcmQgaW50byBhIG1vZGFsIHdoZW4gb25lIGlzIGFjdGl2ZS5cblx0YXBwLnRyYXBLZXlib2FyZE1heWJlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gV2Ugb25seSBuZWVkIHRvIGRvIHN0dWZmIHdoZW4gdGhlIG1vZGFsIGlzIG9wZW4gYW5kIHRhYiBpcyBwcmVzc2VkLlxuXHRcdGlmICggOSA9PT0gZXZlbnQud2hpY2ggJiYgMCA8ICQoICcubW9kYWwtb3BlbicgKS5sZW5ndGggKSB7XG5cdFx0XHRsZXQgJGZvY3VzZWQgPSAkKCAnOmZvY3VzJyApLFxuXHRcdFx0XHRmb2N1c0luZGV4ID0gJGZvY3VzYWJsZUNoaWxkcmVuLmluZGV4KCAkZm9jdXNlZCApO1xuXG5cdFx0XHRpZiAoIDAgPT09IGZvY3VzSW5kZXggJiYgZXZlbnQuc2hpZnRLZXkgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQsIGFuZCBzaGlmdCBpcyBoZWxkIHdoZW4gcHJlc3NpbmcgdGFiLCBnbyBiYWNrIHRvIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblsgJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSBlbHNlIGlmICggISBldmVudC5zaGlmdEtleSAmJiBmb2N1c0luZGV4ID09PSAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGlzIGlzIHRoZSBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgbm90IGhlbGQsIGdvIGJhY2sgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSG9vayBpbnRvIFlvdVR1YmUgPGlmcmFtZT4uXG5cdGFwcC5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCAkbW9kYWwgPSAkKCAnZGl2Lm1vZGFsJyApLFxuXHRcdFx0JGlmcmFtZWlkID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICkuYXR0ciggJ2lkJyApO1xuXG5cdFx0JHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoICRpZnJhbWVpZCwge1xuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdCdvblJlYWR5JzogYXBwLm9uUGxheWVyUmVhZHksXG5cdFx0XHRcdCdvblN0YXRlQ2hhbmdlJzogYXBwLm9uUGxheWVyU3RhdGVDaGFuZ2Vcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHQvLyBEbyBzb21ldGhpbmcgb24gcGxheWVyIHJlYWR5LlxuXHRhcHAub25QbGF5ZXJSZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHR9O1xuXG5cdC8vIERvIHNvbWV0aGluZyBvbiBwbGF5ZXIgc3RhdGUgY2hhbmdlLlxuXHRhcHAub25QbGF5ZXJTdGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gU2V0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCBpbnNpZGUgb2YgdGhlIG1vZGFsIHRoZSBwbGF5ZXIgaXMgaW4uXG5cdFx0JCggZXZlbnQudGFyZ2V0LmEgKS5wYXJlbnRzKCAnLm1vZGFsJyApLmZpbmQoICdhLCA6aW5wdXQsIFt0YWJpbmRleF0nICkuZmlyc3QoKS5mb2N1cygpO1xuXHR9O1xuXG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2RhbCApICk7XG4iLCIvKipcbiAqIEZpbGU6IG5hdmlnYXRpb24tcHJpbWFyeS5qc1xuICpcbiAqIEhlbHBlcnMgZm9yIHRoZSBwcmltYXJ5IG5hdmlnYXRpb24uXG4gKi9cbndpbmRvdy53ZHNQcmltYXJ5TmF2aWdhdGlvbiA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1haW4tbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tYWluLW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnYScgKS5vbiggJ2ZvY3VzaW4gZm9jdXNvdXQnLCBhcHAudG9nZ2xlRm9jdXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnPiBhJyApLmFwcGVuZCggJzxzcGFuIGNsYXNzPVwiY2FyZXQtZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nICk7XG5cdH07XG5cblx0Ly8gVG9nZ2xlIHRoZSBmb2N1cyBjbGFzcyBvbiB0aGUgbGluayBwYXJlbnQuXG5cdGFwcC50b2dnbGVGb2N1cyA9IGZ1bmN0aW9uKCkge1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKS50b2dnbGVDbGFzcyggJ2ZvY3VzJyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNQcmltYXJ5TmF2aWdhdGlvbiApICk7XG4iLCIvKipcbiAqIEZpbGU6IG9mZi1jYW52YXMuanNcbiAqXG4gKiBIZWxwIGRlYWwgd2l0aCB0aGUgb2ZmLWNhbnZhcyBtb2JpbGUgbWVudS5cbiAqL1xud2luZG93Lndkc29mZkNhbnZhcyA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxuXHRcdFx0b2ZmQ2FudmFzQ2xvc2U6ICQoICcub2ZmLWNhbnZhcy1jbG9zZScgKSxcblx0XHRcdG9mZkNhbnZhc0NvbnRhaW5lcjogJCggJy5vZmYtY2FudmFzLWNvbnRhaW5lcicgKSxcblx0XHRcdG9mZkNhbnZhc09wZW46ICQoICcub2ZmLWNhbnZhcy1vcGVuJyApLFxuXHRcdFx0b2ZmQ2FudmFzU2NyZWVuOiAkKCAnLm9mZi1jYW52YXMtc2NyZWVuJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLmVzY0tleUNsb3NlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0Nsb3NlLm9uKCAnY2xpY2snLCBhcHAuY2xvc2VvZmZDYW52YXMgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZW9mZkNhbnZhcyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4ub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIFRvIHNob3cgb3Igbm90IHRvIHNob3c/XG5cdGFwcC50b2dnbGVvZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmICggJ3RydWUnID09PSAkKCB0aGlzICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0XHRhcHAuY2xvc2VvZmZDYW52YXMoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXBwLm9wZW5vZmZDYW52YXMoKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBTaG93IHRoYXQgZHJhd2VyIVxuXHRhcHAub3Blbm9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYXR0ciggJ2FyaWEtaGlkZGVuJywgZmFsc2UgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuZmluZCggJ2J1dHRvbicgKS5maXJzdCgpLmZvY3VzKCk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhhdCBkcmF3ZXIhXG5cdGFwcC5jbG9zZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIHRydWUgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmZvY3VzKCk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgZHJhd2VyIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXG5cdGFwcC5lc2NLZXlDbG9zZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNvZmZDYW52YXMgKSApO1xuIiwiLyoqXG4gKiBGaWxlIHNraXAtbGluay1mb2N1cy1maXguanMuXG4gKlxuICogSGVscHMgd2l0aCBhY2Nlc3NpYmlsaXR5IGZvciBrZXlib2FyZCBvbmx5IHVzZXJzLlxuICpcbiAqIExlYXJuIG1vcmU6IGh0dHBzOi8vZ2l0LmlvL3ZXZHIyXG4gKi9cbiggZnVuY3Rpb24oKSB7XG5cdHZhciBpc1dlYmtpdCA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICd3ZWJraXQnICksXG5cdFx0aXNPcGVyYSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdvcGVyYScgKSxcblx0XHRpc0llID0gLTEgPCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ21zaWUnICk7XG5cblx0aWYgKCAoIGlzV2Via2l0IHx8IGlzT3BlcmEgfHwgaXNJZSApICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGlkID0gbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoIDEgKSxcblx0XHRcdFx0ZWxlbWVudDtcblxuXHRcdFx0aWYgKCAhICggL15bQS16MC05Xy1dKyQvICkudGVzdCggaWQgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cblx0XHRcdGlmICggZWxlbWVudCApIHtcblx0XHRcdFx0aWYgKCAhICggL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pICkudGVzdCggZWxlbWVudC50YWdOYW1lICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50YWJJbmRleCA9IC0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlICk7XG5cdH1cbn0oKSApO1xuIiwiLyoqXG4gKiBGaWxlIHdpbmRvdy1yZWFkeS5qc1xuICpcbiAqIEFkZCBhIFwicmVhZHlcIiBjbGFzcyB0byA8Ym9keT4gd2hlbiB3aW5kb3cgaXMgcmVhZHkuXG4gKi9cbndpbmRvdy53ZHNXaW5kb3dSZWFkeSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0fTtcblxuXHQvLyBDYWNoZSBkb2N1bWVudCBlbGVtZW50cy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J3dpbmRvdyc6ICQoIHdpbmRvdyApLFxuXHRcdFx0J2JvZHknOiAkKCBkb2N1bWVudC5ib2R5IClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93LmxvYWQoIGFwcC5hZGRCb2R5Q2xhc3MgKTtcblx0fTtcblxuXHQvLyBBZGQgYSBjbGFzcyB0byA8Ym9keT4uXG5cdGFwcC5hZGRCb2R5Q2xhc3MgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5hZGRDbGFzcyggJ3JlYWR5JyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzV2luZG93UmVhZHkgKSApO1xuIl19
