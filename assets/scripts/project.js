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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlcm8tY2Fyb3VzZWwuanMiLCJqcy1lbmFibGVkLmpzIiwibW9iaWxlLW1lbnUuanMiLCJtb2RhbC5qcyIsIm5hdmlnYXRpb24tcHJpbWFyeS5qcyIsIm9mZi1jYW52YXMuanMiLCJza2lwLWxpbmstZm9jdXMtZml4LmpzIiwid2luZG93LXJlYWR5LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIndkc0hlcm9DYXJvdXNlbCIsIiQiLCJhcHAiLCJpbml0IiwiY2FjaGUiLCJtZWV0c1JlcXVpcmVtZW50cyIsImJpbmRFdmVudHMiLCIkYyIsImhlcm9DYXJvdXNlbCIsIm9uIiwiZG9TbGljayIsImRvRmlyc3RBbmltYXRpb24iLCJsZW5ndGgiLCJmaXJzdFNsaWRlIiwiZmluZCIsImZpcnN0U2xpZGVDb250ZW50IiwiZmlyc3RBbmltYXRpb24iLCJhdHRyIiwiYWRkQ2xhc3MiLCJkb0FuaW1hdGlvbiIsImV2ZW50Iiwic2xpY2siLCJzbGlkZXMiLCJhY3RpdmVTbGlkZSIsImFjdGl2ZUNvbnRlbnQiLCJhbmltYXRpb25DbGFzcyIsInNwbGl0QW5pbWF0aW9uIiwic3BsaXQiLCJhbmltYXRpb25UcmlnZ2VyIiwiYW5pbWF0ZUNzcyIsImVhY2giLCJpbmRleCIsImVsZW1lbnQiLCJzbGlkZUNvbnRlbnQiLCJoYXNDbGFzcyIsImxhc3RDbGFzcyIsInBvcCIsInJlbW92ZUNsYXNzIiwicGxheUJhY2tncm91bmRWaWRlb3MiLCJwbGF5IiwiYXV0b3BsYXkiLCJhdXRvcGxheVNwZWVkIiwiYXJyb3dzIiwiZG90cyIsImZvY3VzT25TZWxlY3QiLCJ3YWl0Rm9yQW5pbWF0ZSIsImpRdWVyeSIsImRvY3VtZW50IiwiYm9keSIsImNsYXNzTmFtZSIsInJlcGxhY2UiLCJ3ZHNNb2JpbGVNZW51Iiwic3ViTWVudUNvbnRhaW5lciIsInN1Yk1lbnVQYXJlbnRJdGVtIiwib2ZmQ2FudmFzQ29udGFpbmVyIiwiYWRkRG93bkFycm93IiwidG9nZ2xlU3VibWVudSIsInJlc2V0U3ViTWVudSIsImZvcmNlQ2xvc2VTdWJtZW51cyIsImUiLCIkdGFyZ2V0IiwidGFyZ2V0IiwiaXMiLCJzbGlkZU91dFN1Yk1lbnVzIiwicGFyZW50IiwicHJlcGVuZCIsImVsIiwic3ViTWVudSIsImNoaWxkcmVuIiwib3BlblN1Ym1lbnUiLCJ3ZHNNb2RhbCIsIiRtb2RhbFRvZ2dsZSIsIiRmb2N1c2FibGVDaGlsZHJlbiIsIiRwbGF5ZXIiLCIkdGFnIiwiY3JlYXRlRWxlbWVudCIsIiRmaXJzdFNjcmlwdFRhZyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiWVQiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwib3Blbk1vZGFsIiwiY2xvc2VNb2RhbCIsImVzY0tleUNsb3NlIiwiY2xvc2VNb2RhbEJ5Q2xpY2siLCJ0cmFwS2V5Ym9hcmRNYXliZSIsIiRtb2RhbCIsImRhdGEiLCJmb2N1cyIsIiRpZnJhbWUiLCJ1cmwiLCJpbmNsdWRlcyIsInN0b3BWaWRlbyIsImtleUNvZGUiLCJwYXJlbnRzIiwid2hpY2giLCIkZm9jdXNlZCIsImZvY3VzSW5kZXgiLCJzaGlmdEtleSIsInByZXZlbnREZWZhdWx0Iiwib25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkiLCIkaWZyYW1laWQiLCJQbGF5ZXIiLCJldmVudHMiLCJvblBsYXllclJlYWR5Iiwib25QbGF5ZXJTdGF0ZUNoYW5nZSIsImEiLCJmaXJzdCIsIndkc1ByaW1hcnlOYXZpZ2F0aW9uIiwidG9nZ2xlRm9jdXMiLCJhcHBlbmQiLCJ0b2dnbGVDbGFzcyIsIndkc29mZkNhbnZhcyIsIm9mZkNhbnZhc0Nsb3NlIiwib2ZmQ2FudmFzT3BlbiIsIm9mZkNhbnZhc1NjcmVlbiIsImNsb3Nlb2ZmQ2FudmFzIiwidG9nZ2xlb2ZmQ2FudmFzIiwib3Blbm9mZkNhbnZhcyIsImlzV2Via2l0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwiaXNPcGVyYSIsImlzSWUiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZCIsImxvY2F0aW9uIiwiaGFzaCIsInN1YnN0cmluZyIsInRlc3QiLCJ0YWdOYW1lIiwidGFiSW5kZXgiLCJ3ZHNXaW5kb3dSZWFkeSIsImxvYWQiLCJhZGRCb2R5Q2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7O0FBS0FBLE9BQU9DLGVBQVAsR0FBeUIsRUFBekI7QUFDQSxDQUFFLFVBQVVELE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUEsTUFBS0YsSUFBSUcsaUJBQUosRUFBTCxFQUErQjtBQUM5QkgsT0FBSUksVUFBSjtBQUNBO0FBQ0QsRUFORDs7QUFRQTtBQUNBSixLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSUssRUFBSixHQUFTO0FBQ1JSLFdBQVFFLEVBQUdGLE1BQUgsQ0FEQTtBQUVSUyxpQkFBY1AsRUFBRyxXQUFIO0FBRk4sR0FBVDtBQUlBLEVBTEQ7O0FBT0E7QUFDQUMsS0FBSUksVUFBSixHQUFpQixZQUFXO0FBQzNCSixNQUFJSyxFQUFKLENBQU9SLE1BQVAsQ0FBY1UsRUFBZCxDQUFrQixNQUFsQixFQUEwQlAsSUFBSVEsT0FBOUI7QUFDQVIsTUFBSUssRUFBSixDQUFPUixNQUFQLENBQWNVLEVBQWQsQ0FBa0IsTUFBbEIsRUFBMEJQLElBQUlTLGdCQUE5QjtBQUVBLEVBSkQ7O0FBTUE7QUFDQVQsS0FBSUcsaUJBQUosR0FBd0IsWUFBVztBQUNsQyxTQUFPSCxJQUFJSyxFQUFKLENBQU9DLFlBQVAsQ0FBb0JJLE1BQTNCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBVixLQUFJUyxnQkFBSixHQUF1QixZQUFXOztBQUVqQztBQUNBLE1BQUlFLGFBQWFYLElBQUlLLEVBQUosQ0FBT0MsWUFBUCxDQUFvQk0sSUFBcEIsQ0FBMEIsc0JBQTFCLENBQWpCO0FBQUEsTUFDQ0Msb0JBQW9CRixXQUFXQyxJQUFYLENBQWlCLGVBQWpCLENBRHJCO0FB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LENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7QUFDQUYsTUFBSUksVUFBSjtBQUNBLEVBSEQ7O0FBS0E7QUFDQUosS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlLLEVBQUosR0FBUztBQUNSLGFBQVVOLEVBQUdGLE1BQUgsQ0FERjtBQUVSLFdBQVFFLEVBQUc4QyxTQUFTQyxJQUFaO0FBRkEsR0FBVDtBQUlBLEVBTEQ7O0FBT0E7QUFDQTlDLEtBQUlJLFVBQUosR0FBaUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPUixNQUFQLENBQWN5SSxJQUFkLENBQW9CdEksSUFBSXVJLFlBQXhCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBdkksS0FBSXVJLFlBQUosR0FBbUIsWUFBVztBQUM3QnZJLE1BQUlLLEVBQUosQ0FBT3lDLElBQVAsQ0FBWTlCLFFBQVosQ0FBc0IsT0FBdEI7QUFDQSxFQUZEOztBQUlBO0FBQ0FqQixHQUFHQyxJQUFJQyxJQUFQO0FBQ0EsQ0E1QkQsRUE0QklKLE1BNUJKLEVBNEJZK0MsTUE1QlosRUE0Qm9CL0MsT0FBT3dJLGNBNUIzQiIsImZpbGUiOiJwcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGaWxlIGhlcm8tY2Fyb3VzZWwuanNcbiAqXG4gKiBDcmVhdGUgYSBjYXJvdXNlbCBpZiB3ZSBoYXZlIG1vcmUgdGhhbiBvbmUgaGVybyBzbGlkZS5cbiAqL1xud2luZG93Lndkc0hlcm9DYXJvdXNlbCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRoZXJvQ2Fyb3VzZWw6ICQoICcuY2Fyb3VzZWwnIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5kb1NsaWNrICk7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuZG9GaXJzdEFuaW1hdGlvbiApO1xuXG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLmhlcm9DYXJvdXNlbC5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQW5pbWF0ZSB0aGUgZmlyc3Qgc2xpZGUgb24gd2luZG93IGxvYWQuXG5cdGFwcC5kb0ZpcnN0QW5pbWF0aW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBHZXQgdGhlIGZpcnN0IHNsaWRlIGNvbnRlbnQgYXJlYSBhbmQgYW5pbWF0aW9uIGF0dHJpYnV0ZS5cblx0XHRsZXQgZmlyc3RTbGlkZSA9IGFwcC4kYy5oZXJvQ2Fyb3VzZWwuZmluZCggJ1tkYXRhLXNsaWNrLWluZGV4PTBdJyApLFxuXHRcdFx0Zmlyc3RTbGlkZUNvbnRlbnQgPSBmaXJzdFNsaWRlLmZpbmQoICcuaGVyby1jb250ZW50JyApLFxuXHRcdFx0Zmlyc3RBbmltYXRpb24gPSBmaXJzdFNsaWRlQ29udGVudC5hdHRyKCAnZGF0YS1hbmltYXRpb24nICk7XG5cblx0XHQvLyBBZGQgdGhlIGFuaW1hdGlvbiBjbGFzcyB0byB0aGUgZmlyc3Qgc2xpZGUuXG5cdFx0Zmlyc3RTbGlkZUNvbnRlbnQuYWRkQ2xhc3MoIGZpcnN0QW5pbWF0aW9uICk7XG5cdH07XG5cblx0Ly8gQW5pbWF0ZSB0aGUgc2xpZGUgY29udGVudC5cblx0YXBwLmRvQW5pbWF0aW9uID0gZnVuY3Rpb24oIGV2ZW50LCBzbGljayApIHtcblxuXHRcdGxldCBzbGlkZXMgPSAkKCAnLnNsaWRlJyApLFxuXHRcdFx0YWN0aXZlU2xpZGUgPSAkKCAnLnNsaWNrLWN1cnJlbnQnICksXG5cdFx0XHRhY3RpdmVDb250ZW50ID0gYWN0aXZlU2xpZGUuZmluZCggJy5oZXJvLWNvbnRlbnQnICksXG5cblx0XHRcdC8vIFRoaXMgaXMgYSBzdHJpbmcgbGlrZSBzbzogJ2FuaW1hdGVkIHNvbWVDc3NDbGFzcycuXG5cdFx0XHRhbmltYXRpb25DbGFzcyA9IGFjdGl2ZUNvbnRlbnQuYXR0ciggJ2RhdGEtYW5pbWF0aW9uJyApLFxuXHRcdFx0c3BsaXRBbmltYXRpb24gPSBhbmltYXRpb25DbGFzcy5zcGxpdCggJyAnICksXG5cblx0XHRcdC8vIFRoaXMgaXMgdGhlICdhbmltYXRlZCcgY2xhc3MuXG5cdFx0XHRhbmltYXRpb25UcmlnZ2VyID0gc3BsaXRBbmltYXRpb25bMF0sXG5cblx0XHQvLyBUaGlzIGlzIHRoZSBhbmltYXRlLmNzcyBjbGFzcy5cblx0XHRhbmltYXRlQ3NzID0gc3BsaXRBbmltYXRpb25bMV07XG5cblx0XHQvLyBHbyB0aHJvdWdoIGVhY2ggc2xpZGUgdG8gc2VlIGlmIHdlJ3ZlIGFscmVhZHkgc2V0IGFuaW1hdGlvbiBjbGFzc2VzLlxuXHRcdHNsaWRlcy5lYWNoKCBmdW5jdGlvbiggaW5kZXgsIGVsZW1lbnQgKSB7XG5cblx0XHRcdGxldCBzbGlkZUNvbnRlbnQgPSAkKCB0aGlzICkuZmluZCggJy5oZXJvLWNvbnRlbnQnICk7XG5cblx0XHRcdC8vIElmIHdlJ3ZlIHNldCBhbmltYXRpb24gY2xhc3NlcyBvbiBhIHNsaWRlLCByZW1vdmUgdGhlbS5cblx0XHRcdGlmICggc2xpZGVDb250ZW50Lmhhc0NsYXNzKCAnYW5pbWF0ZWQnICkgKSB7XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBsYXN0IGNsYXNzLCB3aGljaCBpcyB0aGUgYW5pbWF0ZS5jc3MgY2xhc3MuXG5cdFx0XHRcdGxldCBsYXN0Q2xhc3MgPSBzbGlkZUNvbnRlbnQuYXR0ciggJ2NsYXNzJyApLnNwbGl0KCAnICcgKS5wb3AoICk7XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIGJvdGggYW5pbWF0aW9uIGNsYXNzZXMuXG5cdFx0XHRcdHNsaWRlQ29udGVudC5yZW1vdmVDbGFzcyggbGFzdENsYXNzICkucmVtb3ZlQ2xhc3MoIGFuaW1hdGlvblRyaWdnZXIgKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIEFkZCBhbmltYXRpb24gY2xhc3NlcyBhZnRlciBzbGlkZSBpcyBpbiB2aWV3LlxuXHRcdGFjdGl2ZUNvbnRlbnQuYWRkQ2xhc3MoIGFuaW1hdGlvbkNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWxsb3cgYmFja2dyb3VuZCB2aWRlb3MgdG8gYXV0b3BsYXkuXG5cdGFwcC5wbGF5QmFja2dyb3VuZFZpZGVvcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IGFsbCB0aGUgdmlkZW9zIGluIG91ciBzbGlkZXMgb2JqZWN0LlxuXHRcdCQoICd2aWRlbycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gTGV0IHRoZW0gYXV0b3BsYXkuIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0aGlzIGxhdGVyIHRvIG9ubHkgcGxheSB0aGUgdmlzaWJsZSBzbGlkZSB2aWRlby5cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIEtpY2sgb2ZmIFNsaWNrLlxuXHRhcHAuZG9TbGljayA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLiRjLmhlcm9DYXJvdXNlbC5vbiggJ2luaXQnLCBhcHAucGxheUJhY2tncm91bmRWaWRlb3MgKTtcblxuXHRcdGFwcC4kYy5oZXJvQ2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0YXV0b3BsYXk6IHRydWUsXG5cdFx0XHRhdXRvcGxheVNwZWVkOiA1MDAwLFxuXHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdGRvdHM6IGZhbHNlLFxuXHRcdFx0Zm9jdXNPblNlbGVjdDogdHJ1ZSxcblx0XHRcdHdhaXRGb3JBbmltYXRlOiB0cnVlXG5cdFx0fSk7XG5cblx0XHRhcHAuJGMuaGVyb0Nhcm91c2VsLm9uKCAnYWZ0ZXJDaGFuZ2UnLCBhcHAuZG9BbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0pKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc0hlcm9DYXJvdXNlbCApO1xuIiwiLyoqXG4gKiBGaWxlIGpzLWVuYWJsZWQuanNcbiAqXG4gKiBJZiBKYXZhc2NyaXB0IGlzIGVuYWJsZWQsIHJlcGxhY2UgdGhlIDxib2R5PiBjbGFzcyBcIm5vLWpzXCIuXG4gKi9cbmRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSggJ25vLWpzJywgJ2pzJyApO1xuIiwiLyoqXG4gKiBGaWxlOiBtb2JpbGUtbWVudS5qc1xuICpcbiAqIENyZWF0ZSBhbiBhY2NvcmRpb24gc3R5bGUgZHJvcGRvd24uXG4gKi9cbndpbmRvdy53ZHNNb2JpbGVNZW51ID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHN1Yk1lbnVDb250YWluZXI6ICQoICcubW9iaWxlLW1lbnUgLnN1Yi1tZW51JyApLFxuXHRcdFx0c3ViTWVudVBhcmVudEl0ZW06ICQoICcubW9iaWxlLW1lbnUgbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKSxcblx0XHRcdG9mZkNhbnZhc0NvbnRhaW5lcjogJCggJy5vZmYtY2FudmFzLWNvbnRhaW5lcicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZVN1Ym1lbnUgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLnJlc2V0U3ViTWVudSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLmZvcmNlQ2xvc2VTdWJtZW51cyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBSZXNldCB0aGUgc3VibWVudXMgYWZ0ZXIgaXQncyBkb25lIGNsb3NpbmcuXG5cdGFwcC5yZXNldFN1Yk1lbnUgPSBmdW5jdGlvbiggZSApIHtcblx0XHRjb25zdCAkdGFyZ2V0ID0gJCggZS50YXJnZXQgKTtcblxuXHRcdC8vIFdoZW4gdGhlIGxpc3QgaXRlbSBpcyBkb25lIHRyYW5zaXRpb25pbmcgaW4gaGVpZ2h0LFxuXHRcdC8vIHJlbW92ZSB0aGUgY2xhc3NlcyBmcm9tIHRoZSBzdWJtZW51IHNvIGl0IGlzIHJlYWR5IHRvIHRvZ2dsZSBhZ2Fpbi5cblx0XHRpZiAoICR0YXJnZXQuaXMoICdsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApICYmICEgJHRhcmdldC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHQkdGFyZ2V0LmZpbmQoICd1bC5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlT3V0TGVmdCBpcy12aXNpYmxlJyApO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudSBpdGVtcy5cblx0YXBwLnNsaWRlT3V0U3ViTWVudXMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gT25seSB0cnkgdG8gY2xvc2Ugc3VibWVudXMgdGhhdCBhcmUgYWN0dWFsbHkgb3Blbi5cblx0XHRcdGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnc2xpZGVJbkxlZnQnICkgKSB7XG5cblx0XHRcdFx0Ly8gQ2xvc2UgdGhlIHBhcmVudCBsaXN0IGl0ZW0sIGFuZCBzZXQgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9uIGFyaWEgdG8gZmFsc2UuXG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUuXG5cdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5wcmVwZW5kKCAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgY2xhc3M9XCJwYXJlbnQtaW5kaWNhdG9yXCIgYXJpYS1sYWJlbD1cIk9wZW4gc3VibWVudVwiPjxzcGFuIGNsYXNzPVwiZG93bi1hcnJvd1wiPjwvc3Bhbj48L2J1dHRvbj4nICk7XG5cdH07XG5cblx0Ly8gRGVhbCB3aXRoIHRoZSBzdWJtZW51LlxuXHRhcHAudG9nZ2xlU3VibWVudSA9IGZ1bmN0aW9uKCBlICkge1xuXG5cdFx0bGV0IGVsID0gJCggdGhpcyApLCAvLyBUaGUgbWVudSBlbGVtZW50IHdoaWNoIHdhcyBjbGlja2VkIG9uLlxuXHRcdFx0c3ViTWVudSA9IGVsLmNoaWxkcmVuKCAndWwuc3ViLW1lbnUnICksIC8vIFRoZSBuZWFyZXN0IHN1Ym1lbnUuXG5cdFx0XHQkdGFyZ2V0ID0gJCggZS50YXJnZXQgKTsgLy8gdGhlIGVsZW1lbnQgdGhhdCdzIGFjdHVhbGx5IGJlaW5nIGNsaWNrZWQgKGNoaWxkIG9mIHRoZSBsaSB0aGF0IHRyaWdnZXJlZCB0aGUgY2xpY2sgZXZlbnQpLlxuXG5cdFx0Ly8gRmlndXJlIG91dCBpZiB3ZSdyZSBjbGlja2luZyB0aGUgYnV0dG9uIG9yIGl0cyBhcnJvdyBjaGlsZCxcblx0XHQvLyBpZiBzbywgd2UgY2FuIGp1c3Qgb3BlbiBvciBjbG9zZSB0aGUgbWVudSBhbmQgYmFpbC5cblx0XHRpZiAoICR0YXJnZXQuaGFzQ2xhc3MoICdkb3duLWFycm93JyApIHx8ICR0YXJnZXQuaGFzQ2xhc3MoICdwYXJlbnQtaW5kaWNhdG9yJyApICkge1xuXG5cdFx0XHQvLyBGaXJzdCwgY29sbGFwc2UgYW55IGFscmVhZHkgb3BlbmVkIHN1Ym1lbnVzLlxuXHRcdFx0YXBwLnNsaWRlT3V0U3ViTWVudXMoKTtcblxuXHRcdFx0aWYgKCAhIHN1Yk1lbnUuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXG5cdFx0XHRcdC8vIE9wZW4gdGhlIHN1Ym1lbnUuXG5cdFx0XHRcdGFwcC5vcGVuU3VibWVudSggZWwsIHN1Yk1lbnUgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gT3BlbiBhIHN1Ym1lbnUuXG5cdGFwcC5vcGVuU3VibWVudSA9IGZ1bmN0aW9uKCBwYXJlbnQsIHN1Yk1lbnUgKSB7XG5cblx0XHQvLyBFeHBhbmQgdGhlIGxpc3QgbWVudSBpdGVtLCBhbmQgc2V0IHRoZSBjb3JyZXNwb25kaW5nIGJ1dHRvbiBhcmlhIHRvIHRydWUuXG5cdFx0cGFyZW50LmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cblx0XHQvLyBTbGlkZSB0aGUgbWVudSBpbi5cblx0XHRzdWJNZW51LmFkZENsYXNzKCAnaXMtdmlzaWJsZSBhbmltYXRlZCBzbGlkZUluTGVmdCcgKTtcblxuXHR9O1xuXG5cdC8vIEZvcmNlIGNsb3NlIGFsbCB0aGUgc3VibWVudXMgd2hlbiB0aGUgbWFpbiBtZW51IGNvbnRhaW5lciBpcyBjbG9zZWQuXG5cdGFwcC5mb3JjZUNsb3NlU3VibWVudXMgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50IHRyaWdnZXJzIG9uIG9wZW4gYW5kIG9uIGNsb3NlLCBuZWVkIHRvIG1ha2Ugc3VyZSB3ZSBvbmx5IGRvIHRoaXMgb24gY2xvc2UuXG5cdFx0aWYgKCAhICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUgc2xpZGVJbkxlZnQnICk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2JpbGVNZW51ICk7XG4iLCIvKipcbiAqIEZpbGUgbW9kYWwuanNcbiAqXG4gKiBEZWFsIHdpdGggbXVsdGlwbGUgbW9kYWxzIGFuZCB0aGVpciBtZWRpYS5cbiAqL1xud2luZG93Lndkc01vZGFsID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHRsZXQgJG1vZGFsVG9nZ2xlLFxuXHRcdCRmb2N1c2FibGVDaGlsZHJlbixcblx0XHQkcGxheWVyLFxuXHRcdCR0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc2NyaXB0JyApLFxuXHRcdCRmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnc2NyaXB0JyApWzBdLFxuXHRcdFlUO1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdCRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggJHRhZywgJGZpcnN0U2NyaXB0VGFnICk7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J2JvZHknOiAkKCAnYm9keScgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJCggJy5tb2RhbC10cmlnZ2VyJyApLmxlbmd0aDtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBUcmlnZ2VyIGEgbW9kYWwgdG8gb3Blbi5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLm1vZGFsLXRyaWdnZXInLCBhcHAub3Blbk1vZGFsICk7XG5cblx0XHQvLyBUcmlnZ2VyIHRoZSBjbG9zZSBidXR0b24gdG8gY2xvc2UgdGhlIG1vZGFsLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICcuY2xvc2UnLCBhcHAuY2xvc2VNb2RhbCApO1xuXG5cdFx0Ly8gQWxsb3cgdGhlIHVzZXIgdG8gY2xvc2UgdGhlIG1vZGFsIGJ5IGhpdHRpbmcgdGhlIGVzYyBrZXkuXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLmVzY0tleUNsb3NlICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgY2xpY2tpbmcgb3V0c2lkZSBvZiB0aGUgbW9kYWwuXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJ2Rpdi5tb2RhbC1vcGVuJywgYXBwLmNsb3NlTW9kYWxCeUNsaWNrICk7XG5cblx0XHQvLyBMaXN0ZW4gdG8gdGFicywgdHJhcCBrZXlib2FyZCBpZiB3ZSBuZWVkIHRvXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLnRyYXBLZXlib2FyZE1heWJlICk7XG5cblx0fTtcblxuXHQvLyBPcGVuIHRoZSBtb2RhbC5cblx0YXBwLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gU3RvcmUgdGhlIG1vZGFsIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlID0gJCggdGhpcyApO1xuXG5cdFx0Ly8gRmlndXJlIG91dCB3aGljaCBtb2RhbCB3ZSdyZSBvcGVuaW5nIGFuZCBzdG9yZSB0aGUgb2JqZWN0LlxuXHRcdGxldCAkbW9kYWwgPSAkKCAkKCB0aGlzICkuZGF0YSggJ3RhcmdldCcgKSApO1xuXG5cdFx0Ly8gRGlzcGxheSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEFkZCBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEZpbmQgdGhlIGZvY3VzYWJsZSBjaGlsZHJlbiBvZiB0aGUgbW9kYWwuXG5cdFx0Ly8gVGhpcyBsaXN0IG1heSBiZSBpbmNvbXBsZXRlLCByZWFsbHkgd2lzaCBqUXVlcnkgaGFkIHRoZSA6Zm9jdXNhYmxlIHBzZXVkbyBsaWtlIGpRdWVyeSBVSSBkb2VzLlxuXHRcdC8vIEZvciBtb3JlIGFib3V0IDppbnB1dCBzZWU6IGh0dHBzOi8vYXBpLmpxdWVyeS5jb20vaW5wdXQtc2VsZWN0b3IvXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuID0gJG1vZGFsLmZpbmQoICdhLCA6aW5wdXQsIFt0YWJpbmRleF0nICk7XG5cblx0XHQvLyBJZGVhbGx5LCB0aGVyZSBpcyBhbHdheXMgb25lICh0aGUgY2xvc2UgYnV0dG9uKSwgYnV0IHlvdSBuZXZlciBrbm93LlxuXHRcdGlmICggMCA8ICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggKSB7XG5cblx0XHRcdC8vIFNoaWZ0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIENsb3NlIHRoZSBtb2RhbC5cblx0YXBwLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEZpZ3VyZSB0aGUgb3BlbmVkIG1vZGFsIHdlJ3JlIGNsb3NpbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoICdkaXYubW9kYWwtb3BlbiAuY2xvc2UnICkuZGF0YSggJ3RhcmdldCcgKSApLFxuXG5cdFx0XHQvLyBGaW5kIHRoZSBpZnJhbWUgaW4gdGhlICRtb2RhbCBvYmplY3QuXG5cdFx0XHQkaWZyYW1lID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICk7XG5cblx0XHQvLyBPbmx5IGRvIHRoaXMgaWYgdGhlcmUgYXJlIGFueSBpZnJhbWVzLlxuXHRcdGlmICggJGlmcmFtZS5sZW5ndGggKSB7XG5cblx0XHRcdC8vIEdldCB0aGUgaWZyYW1lIHNyYyBVUkwuXG5cdFx0XHRsZXQgdXJsID0gJGlmcmFtZS5hdHRyKCAnc3JjJyApO1xuXG5cdFx0XHQvLyBSZW1vdmluZy9SZWFkZGluZyB0aGUgVVJMIHdpbGwgZWZmZWN0aXZlbHkgYnJlYWsgdGhlIFlvdVR1YmUgQVBJLlxuXHRcdFx0Ly8gU28gbGV0J3Mgbm90IGRvIHRoYXQgd2hlbiB0aGUgaWZyYW1lIFVSTCBjb250YWlucyB0aGUgZW5hYmxlanNhcGkgcGFyYW1ldGVyLlxuXHRcdFx0aWYgKCAhIHVybC5pbmNsdWRlcyggJ2VuYWJsZWpzYXBpPTEnICkgKSB7XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBzb3VyY2UgVVJMLCB0aGVuIGFkZCBpdCBiYWNrLCBzbyB0aGUgdmlkZW8gY2FuIGJlIHBsYXllZCBhZ2FpbiBsYXRlci5cblx0XHRcdFx0JGlmcmFtZS5hdHRyKCAnc3JjJywgJycgKS5hdHRyKCAnc3JjJywgdXJsICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFVzZSB0aGUgWW91VHViZSBBUEkgdG8gc3RvcCB0aGUgdmlkZW8uXG5cdFx0XHRcdCRwbGF5ZXIuc3RvcFZpZGVvKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmluYWxseSwgaGlkZSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgYm9keSBjbGFzcy5cblx0XHRhcHAuJGMuYm9keS5yZW1vdmVDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBSZXZlcnQgZm9jdXMgYmFjayB0byB0b2dnbGUgZWxlbWVudFxuXHRcdCRtb2RhbFRvZ2dsZS5mb2N1cygpO1xuXG5cdH07XG5cblx0Ly8gQ2xvc2UgaWYgXCJlc2NcIiBrZXkgaXMgcHJlc3NlZC5cblx0YXBwLmVzY0tleUNsb3NlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggMjcgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRhcHAuY2xvc2VNb2RhbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDbG9zZSBpZiB0aGUgdXNlciBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgbW9kYWxcblx0YXBwLmNsb3NlTW9kYWxCeUNsaWNrID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gSWYgdGhlIHBhcmVudCBjb250YWluZXIgaXMgTk9UIHRoZSBtb2RhbCBkaWFsb2cgY29udGFpbmVyLCBjbG9zZSB0aGUgbW9kYWxcblx0XHRpZiAoICEgJCggZXZlbnQudGFyZ2V0ICkucGFyZW50cyggJ2RpdicgKS5oYXNDbGFzcyggJ21vZGFsLWRpYWxvZycgKSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIFRyYXAgdGhlIGtleWJvYXJkIGludG8gYSBtb2RhbCB3aGVuIG9uZSBpcyBhY3RpdmUuXG5cdGFwcC50cmFwS2V5Ym9hcmRNYXliZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIFdlIG9ubHkgbmVlZCB0byBkbyBzdHVmZiB3aGVuIHRoZSBtb2RhbCBpcyBvcGVuIGFuZCB0YWIgaXMgcHJlc3NlZC5cblx0XHRpZiAoIDkgPT09IGV2ZW50LndoaWNoICYmIDAgPCAkKCAnLm1vZGFsLW9wZW4nICkubGVuZ3RoICkge1xuXHRcdFx0bGV0ICRmb2N1c2VkID0gJCggJzpmb2N1cycgKSxcblx0XHRcdFx0Zm9jdXNJbmRleCA9ICRmb2N1c2FibGVDaGlsZHJlbi5pbmRleCggJGZvY3VzZWQgKTtcblxuXHRcdFx0aWYgKCAwID09PSBmb2N1c0luZGV4ICYmIGV2ZW50LnNoaWZ0S2V5ICkge1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgaGVsZCB3aGVuIHByZXNzaW5nIHRhYiwgZ28gYmFjayB0byBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxIF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZXZlbnQuc2hpZnRLZXkgJiYgZm9jdXNJbmRleCA9PT0gJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgbGFzdCBmb2N1c2FibGUgZWxlbWVudCwgYW5kIHNoaWZ0IGlzIG5vdCBoZWxkLCBnbyBiYWNrIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEhvb2sgaW50byBZb3VUdWJlIDxpZnJhbWU+LlxuXHRhcHAub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgJG1vZGFsID0gJCggJ2Rpdi5tb2RhbCcgKSxcblx0XHRcdCRpZnJhbWVpZCA9ICRtb2RhbC5maW5kKCAnaWZyYW1lJyApLmF0dHIoICdpZCcgKTtcblxuXHRcdCRwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCAkaWZyYW1laWQsIHtcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHQnb25SZWFkeSc6IGFwcC5vblBsYXllclJlYWR5LFxuXHRcdFx0XHQnb25TdGF0ZUNoYW5nZSc6IGFwcC5vblBsYXllclN0YXRlQ2hhbmdlXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciByZWFkeS5cblx0YXBwLm9uUGxheWVyUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0fTtcblxuXHQvLyBEbyBzb21ldGhpbmcgb24gcGxheWVyIHN0YXRlIGNoYW5nZS5cblx0YXBwLm9uUGxheWVyU3RhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFNldCBmb2N1cyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgaW5zaWRlIG9mIHRoZSBtb2RhbCB0aGUgcGxheWVyIGlzIGluLlxuXHRcdCQoIGV2ZW50LnRhcmdldC5hICkucGFyZW50cyggJy5tb2RhbCcgKS5maW5kKCAnYSwgOmlucHV0LCBbdGFiaW5kZXhdJyApLmZpcnN0KCkuZm9jdXMoKTtcblx0fTtcblxuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0pKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc01vZGFsICk7XG4iLCIvKipcbiAqIEZpbGU6IG5hdmlnYXRpb24tcHJpbWFyeS5qc1xuICpcbiAqIEhlbHBlcnMgZm9yIHRoZSBwcmltYXJ5IG5hdmlnYXRpb24uXG4gKi9cbndpbmRvdy53ZHNQcmltYXJ5TmF2aWdhdGlvbiA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1haW4tbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tYWluLW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnYScgKS5vbiggJ2ZvY3VzaW4gZm9jdXNvdXQnLCBhcHAudG9nZ2xlRm9jdXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnPiBhJyApLmFwcGVuZCggJzxzcGFuIGNsYXNzPVwiY2FyZXQtZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nICk7XG5cdH07XG5cblx0Ly8gVG9nZ2xlIHRoZSBmb2N1cyBjbGFzcyBvbiB0aGUgbGluayBwYXJlbnQuXG5cdGFwcC50b2dnbGVGb2N1cyA9IGZ1bmN0aW9uKCkge1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKS50b2dnbGVDbGFzcyggJ2ZvY3VzJyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSkoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gKTtcbiIsIi8qKlxuICogRmlsZTogb2ZmLWNhbnZhcy5qc1xuICpcbiAqIEhlbHAgZGVhbCB3aXRoIHRoZSBvZmYtY2FudmFzIG1vYmlsZSBtZW51LlxuICovXG53aW5kb3cud2Rzb2ZmQ2FudmFzID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0Ym9keTogJCggJ2JvZHknICksXG5cdFx0XHRvZmZDYW52YXNDbG9zZTogJCggJy5vZmYtY2FudmFzLWNsb3NlJyApLFxuXHRcdFx0b2ZmQ2FudmFzQ29udGFpbmVyOiAkKCAnLm9mZi1jYW52YXMtY29udGFpbmVyJyApLFxuXHRcdFx0b2ZmQ2FudmFzT3BlbjogJCggJy5vZmYtY2FudmFzLW9wZW4nICksXG5cdFx0XHRvZmZDYW52YXNTY3JlZW46ICQoICcub2ZmLWNhbnZhcy1zY3JlZW4nIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ2xvc2Uub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLm9uKCAnY2xpY2snLCBhcHAudG9nZ2xlb2ZmQ2FudmFzICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gVG8gc2hvdyBvciBub3QgdG8gc2hvdz9cblx0YXBwLnRvZ2dsZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCAndHJ1ZScgPT09ICQoIHRoaXMgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSApIHtcblx0XHRcdGFwcC5jbG9zZW9mZkNhbnZhcygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhcHAub3Blbm9mZkNhbnZhcygpO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIFNob3cgdGhhdCBkcmF3ZXIhXG5cdGFwcC5vcGVub2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hdHRyKCAnYXJpYS1oaWRkZW4nLCBmYWxzZSApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5maW5kKCAnYnV0dG9uJyApLmZpcnN0KCkuZm9jdXMoKTtcblx0fTtcblxuXHQvLyBDbG9zZSB0aGF0IGRyYXdlciFcblx0YXBwLmNsb3Nlb2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYXR0ciggJ2FyaWEtaGlkZGVuJywgdHJ1ZSApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uZm9jdXMoKTtcblx0fTtcblxuXHQvLyBDbG9zZSBkcmF3ZXIgaWYgXCJlc2NcIiBrZXkgaXMgcHJlc3NlZC5cblx0YXBwLmVzY0tleUNsb3NlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggMjcgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRhcHAuY2xvc2VvZmZDYW52YXMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNvZmZDYW52YXMgKTtcbiIsIi8qKlxuICogRmlsZSBza2lwLWxpbmstZm9jdXMtZml4LmpzLlxuICpcbiAqIEhlbHBzIHdpdGggYWNjZXNzaWJpbGl0eSBmb3Iga2V5Ym9hcmQgb25seSB1c2Vycy5cbiAqXG4gKiBMZWFybiBtb3JlOiBodHRwczovL2dpdC5pby92V2RyMlxuICovXG4oIGZ1bmN0aW9uKCkge1xuXHR2YXIgaXNXZWJraXQgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnd2Via2l0JyApLFxuXHRcdGlzT3BlcmEgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICksXG5cdFx0aXNJZSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApO1xuXG5cdGlmICggKCBpc1dlYmtpdCB8fCBpc09wZXJhIHx8IGlzSWUgKSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpZCA9IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICksXG5cdFx0XHRcdGVsZW1lbnQ7XG5cblx0XHRcdGlmICggISAoIC9eW0EtejAtOV8tXSskLyApLnRlc3QoIGlkICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGlmICggISAoIC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaSApLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSApO1xuXHR9XG59KSgpO1xuIiwiLyoqXG4gKiBGaWxlIHdpbmRvdy1yZWFkeS5qc1xuICpcbiAqIEFkZCBhIFwicmVhZHlcIiBjbGFzcyB0byA8Ym9keT4gd2hlbiB3aW5kb3cgaXMgcmVhZHkuXG4gKi9cbndpbmRvdy53ZHNXaW5kb3dSZWFkeSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0fTtcblxuXHQvLyBDYWNoZSBkb2N1bWVudCBlbGVtZW50cy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J3dpbmRvdyc6ICQoIHdpbmRvdyApLFxuXHRcdFx0J2JvZHknOiAkKCBkb2N1bWVudC5ib2R5IClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93LmxvYWQoIGFwcC5hZGRCb2R5Q2xhc3MgKTtcblx0fTtcblxuXHQvLyBBZGQgYSBjbGFzcyB0byA8Ym9keT4uXG5cdGFwcC5hZGRCb2R5Q2xhc3MgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5hZGRDbGFzcyggJ3JlYWR5JyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0pKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1dpbmRvd1JlYWR5ICk7XG4iXX0=
