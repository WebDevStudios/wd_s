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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ3aW5kb3ctcmVhZHkuanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJib2R5IiwiY2xhc3NOYW1lIiwicmVwbGFjZSIsIndpbmRvdyIsIndkc01vYmlsZU1lbnUiLCIkIiwiYXBwIiwiaW5pdCIsImNhY2hlIiwibWVldHNSZXF1aXJlbWVudHMiLCJiaW5kRXZlbnRzIiwiJGMiLCJzdWJNZW51Q29udGFpbmVyIiwic3ViTWVudVBhcmVudEl0ZW0iLCJvZmZDYW52YXNDb250YWluZXIiLCJvbiIsImFkZERvd25BcnJvdyIsInRvZ2dsZVN1Ym1lbnUiLCJyZXNldFN1Yk1lbnUiLCJmb3JjZUNsb3NlU3VibWVudXMiLCJsZW5ndGgiLCJlIiwiJHRhcmdldCIsInRhcmdldCIsImlzIiwiaGFzQ2xhc3MiLCJmaW5kIiwicmVtb3ZlQ2xhc3MiLCJzbGlkZU91dFN1Yk1lbnVzIiwiZWFjaCIsInBhcmVudCIsImF0dHIiLCJhZGRDbGFzcyIsInByZXBlbmQiLCJlbCIsInN1Yk1lbnUiLCJjaGlsZHJlbiIsIm9wZW5TdWJtZW51IiwialF1ZXJ5Iiwid2RzTW9kYWwiLCIkbW9kYWxUb2dnbGUiLCIkZm9jdXNhYmxlQ2hpbGRyZW4iLCIkcGxheWVyIiwiJHRhZyIsImNyZWF0ZUVsZW1lbnQiLCIkZmlyc3RTY3JpcHRUYWciLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIllUIiwicGFyZW50Tm9kZSIsImluc2VydEJlZm9yZSIsIm9wZW5Nb2RhbCIsImNsb3NlTW9kYWwiLCJlc2NLZXlDbG9zZSIsImNsb3NlTW9kYWxCeUNsaWNrIiwidHJhcEtleWJvYXJkTWF5YmUiLCIkbW9kYWwiLCJkYXRhIiwiZm9jdXMiLCIkaWZyYW1lIiwidXJsIiwiaW5jbHVkZXMiLCJzdG9wVmlkZW8iLCJldmVudCIsImtleUNvZGUiLCJwYXJlbnRzIiwid2hpY2giLCIkZm9jdXNlZCIsImZvY3VzSW5kZXgiLCJpbmRleCIsInNoaWZ0S2V5IiwicHJldmVudERlZmF1bHQiLCJvbllvdVR1YmVJZnJhbWVBUElSZWFkeSIsIiRpZnJhbWVpZCIsIlBsYXllciIsImV2ZW50cyIsIm9uUGxheWVyUmVhZHkiLCJvblBsYXllclN0YXRlQ2hhbmdlIiwiYSIsImZpcnN0Iiwid2RzUHJpbWFyeU5hdmlnYXRpb24iLCJ0b2dnbGVGb2N1cyIsImFwcGVuZCIsInRvZ2dsZUNsYXNzIiwid2Rzb2ZmQ2FudmFzIiwib2ZmQ2FudmFzQ2xvc2UiLCJvZmZDYW52YXNPcGVuIiwib2ZmQ2FudmFzU2NyZWVuIiwiY2xvc2VvZmZDYW52YXMiLCJ0b2dnbGVvZmZDYW52YXMiLCJvcGVub2ZmQ2FudmFzIiwiaXNXZWJraXQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJpc09wZXJhIiwiaXNJZSIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImlkIiwibG9jYXRpb24iLCJoYXNoIiwic3Vic3RyaW5nIiwiZWxlbWVudCIsInRlc3QiLCJ0YWdOYW1lIiwidGFiSW5kZXgiLCJ3ZHNXaW5kb3dSZWFkeSIsImxvYWQiLCJhZGRCb2R5Q2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7O0FBS0FBLFNBQVNDLElBQVQsQ0FBY0MsU0FBZCxHQUEwQkYsU0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCQyxPQUF4QixDQUFpQyxPQUFqQyxFQUEwQyxJQUExQyxDQUExQjs7O0FDTEE7Ozs7O0FBS0FDLE9BQU9DLGFBQVAsR0FBdUIsRUFBdkI7QUFDQSxDQUFFLFVBQVVELE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUEsTUFBS0YsSUFBSUcsaUJBQUosRUFBTCxF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LEdBQXJCLEVBQTJCOztBQUU1QjtBQUNBQSxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjtBQUNBRixNQUFJSSxVQUFKO0FBQ0EsRUFIRDs7QUFLQTtBQUNBSixLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSUssRUFBSixHQUFTO0FBQ1IsYUFBVU4sRUFBR0YsTUFBSCxDQURGO0FBRVIsV0FBUUUsRUFBR04sU0FBU0MsSUFBWjtBQUZBLEdBQVQ7QUFJQSxFQUxEOztBQU9BO0FBQ0FNLEtBQUlJLFVBQUosR0FBaUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPUixNQUFQLENBQWN5RyxJQUFkLENBQW9CdEcsSUFBSXVHLFlBQXhCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBdkcsS0FBSXVHLFlBQUosR0FBbUIsWUFBVztBQUM3QnZHLE1BQUlLLEVBQUosQ0FBT1gsSUFBUCxDQUFZZ0MsUUFBWixDQUFzQixPQUF0QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQTNCLEdBQUdDLElBQUlDLElBQVA7QUFDQSxDQTVCRCxFQTRCSUosTUE1QkosRUE0QlltQyxNQTVCWixFQTRCb0JuQyxPQUFPd0csY0E1QjNCIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZpbGUganMtZW5hYmxlZC5qc1xuICpcbiAqIElmIEphdmFzY3JpcHQgaXMgZW5hYmxlZCwgcmVwbGFjZSB0aGUgPGJvZHk+IGNsYXNzIFwibm8tanNcIi5cbiAqL1xuZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKCAnbm8tanMnLCAnanMnICk7XG4iLCIvKipcbiAqIEZpbGU6IG1vYmlsZS1tZW51LmpzXG4gKlxuICogQ3JlYXRlIGFuIGFjY29yZGlvbiBzdHlsZSBkcm9wZG93bi5cbiAqL1xud2luZG93Lndkc01vYmlsZU1lbnUgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0c3ViTWVudUNvbnRhaW5lcjogJCggJy5tb2JpbGUtbWVudSAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tb2JpbGUtbWVudSBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApLFxuXHRcdFx0b2ZmQ2FudmFzQ29udGFpbmVyOiAkKCAnLm9mZi1jYW52YXMtY29udGFpbmVyJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRG93bkFycm93ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLm9uKCAnY2xpY2snLCBhcHAudG9nZ2xlU3VibWVudSApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5vbiggJ3RyYW5zaXRpb25lbmQnLCBhcHAucmVzZXRTdWJNZW51ICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5vbiggJ3RyYW5zaXRpb25lbmQnLCBhcHAuZm9yY2VDbG9zZVN1Ym1lbnVzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnN1Yk1lbnVDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIFJlc2V0IHRoZSBzdWJtZW51cyBhZnRlciBpdCdzIGRvbmUgY2xvc2luZy5cblx0YXBwLnJlc2V0U3ViTWVudSA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdGNvbnN0ICR0YXJnZXQgPSAkKCBlLnRhcmdldCApO1xuXG5cdFx0Ly8gV2hlbiB0aGUgbGlzdCBpdGVtIGlzIGRvbmUgdHJhbnNpdGlvbmluZyBpbiBoZWlnaHQsXG5cdFx0Ly8gcmVtb3ZlIHRoZSBjbGFzc2VzIGZyb20gdGhlIHN1Ym1lbnUgc28gaXQgaXMgcmVhZHkgdG8gdG9nZ2xlIGFnYWluLlxuXHRcdGlmICggJHRhcmdldC5pcyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkgJiYgISAkdGFyZ2V0Lmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdCR0YXJnZXQuZmluZCggJ3VsLnN1Yi1tZW51JyApLnJlbW92ZUNsYXNzKCAnc2xpZGVPdXRMZWZ0IGlzLXZpc2libGUnICk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gU2xpZGUgb3V0IHRoZSBzdWJtZW51IGl0ZW1zLlxuXHRhcHAuc2xpZGVPdXRTdWJNZW51cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmVhY2goIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBPbmx5IHRyeSB0byBjbG9zZSBzdWJtZW51cyB0aGF0IGFyZSBhY3R1YWxseSBvcGVuLlxuXHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoICdzbGlkZUluTGVmdCcgKSApIHtcblxuXHRcdFx0XHQvLyBDbG9zZSB0aGUgcGFyZW50IGxpc3QgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byBmYWxzZS5cblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudS5cblx0XHRcdFx0JCggdGhpcyApLnJlbW92ZUNsYXNzKCAnc2xpZGVJbkxlZnQnICkuYWRkQ2xhc3MoICdzbGlkZU91dExlZnQnICk7XG5cdFx0XHR9XG5cblx0XHR9KTtcblx0fTtcblxuXHQvLyBBZGQgdGhlIGRvd24gYXJyb3cgdG8gc3VibWVudSBwYXJlbnRzLlxuXHRhcHAuYWRkRG93bkFycm93ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLnByZXBlbmQoICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBjbGFzcz1cInBhcmVudC1pbmRpY2F0b3JcIiBhcmlhLWxhYmVsPVwiT3BlbiBzdWJtZW51XCI+PHNwYW4gY2xhc3M9XCJkb3duLWFycm93XCI+PC9zcGFuPjwvYnV0dG9uPicgKTtcblx0fTtcblxuXHQvLyBEZWFsIHdpdGggdGhlIHN1Ym1lbnUuXG5cdGFwcC50b2dnbGVTdWJtZW51ID0gZnVuY3Rpb24oIGUgKSB7XG5cblx0XHRsZXQgZWwgPSAkKCB0aGlzICksIC8vIFRoZSBtZW51IGVsZW1lbnQgd2hpY2ggd2FzIGNsaWNrZWQgb24uXG5cdFx0XHRzdWJNZW51ID0gZWwuY2hpbGRyZW4oICd1bC5zdWItbWVudScgKSwgLy8gVGhlIG5lYXJlc3Qgc3VibWVudS5cblx0XHRcdCR0YXJnZXQgPSAkKCBlLnRhcmdldCApOyAvLyB0aGUgZWxlbWVudCB0aGF0J3MgYWN0dWFsbHkgYmVpbmcgY2xpY2tlZCAoY2hpbGQgb2YgdGhlIGxpIHRoYXQgdHJpZ2dlcmVkIHRoZSBjbGljayBldmVudCkuXG5cblx0XHQvLyBGaWd1cmUgb3V0IGlmIHdlJ3JlIGNsaWNraW5nIHRoZSBidXR0b24gb3IgaXRzIGFycm93IGNoaWxkLFxuXHRcdC8vIGlmIHNvLCB3ZSBjYW4ganVzdCBvcGVuIG9yIGNsb3NlIHRoZSBtZW51IGFuZCBiYWlsLlxuXHRcdGlmICggJHRhcmdldC5oYXNDbGFzcyggJ2Rvd24tYXJyb3cnICkgfHwgJHRhcmdldC5oYXNDbGFzcyggJ3BhcmVudC1pbmRpY2F0b3InICkgKSB7XG5cblx0XHRcdC8vIEZpcnN0LCBjb2xsYXBzZSBhbnkgYWxyZWFkeSBvcGVuZWQgc3VibWVudXMuXG5cdFx0XHRhcHAuc2xpZGVPdXRTdWJNZW51cygpO1xuXG5cdFx0XHRpZiAoICEgc3ViTWVudS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cblx0XHRcdFx0Ly8gT3BlbiB0aGUgc3VibWVudS5cblx0XHRcdFx0YXBwLm9wZW5TdWJtZW51KCBlbCwgc3ViTWVudSApO1xuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBPcGVuIGEgc3VibWVudS5cblx0YXBwLm9wZW5TdWJtZW51ID0gZnVuY3Rpb24oIHBhcmVudCwgc3ViTWVudSApIHtcblxuXHRcdC8vIEV4cGFuZCB0aGUgbGlzdCBtZW51IGl0ZW0sIGFuZCBzZXQgdGhlIGNvcnJlc3BvbmRpbmcgYnV0dG9uIGFyaWEgdG8gdHJ1ZS5cblx0XHRwYXJlbnQuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcblxuXHRcdC8vIFNsaWRlIHRoZSBtZW51IGluLlxuXHRcdHN1Yk1lbnUuYWRkQ2xhc3MoICdpcy12aXNpYmxlIGFuaW1hdGVkIHNsaWRlSW5MZWZ0JyApO1xuXG5cdH07XG5cblx0Ly8gRm9yY2UgY2xvc2UgYWxsIHRoZSBzdWJtZW51cyB3aGVuIHRoZSBtYWluIG1lbnUgY29udGFpbmVyIGlzIGNsb3NlZC5cblx0YXBwLmZvcmNlQ2xvc2VTdWJtZW51cyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gVGhlIHRyYW5zaXRpb25lbmQgZXZlbnQgdHJpZ2dlcnMgb24gb3BlbiBhbmQgb24gY2xvc2UsIG5lZWQgdG8gbWFrZSBzdXJlIHdlIG9ubHkgZG8gdGhpcyBvbiBjbG9zZS5cblx0XHRpZiAoICEgJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZSBzbGlkZUluTGVmdCcgKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0pKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc01vYmlsZU1lbnUgKTtcbiIsIi8qKlxuICogRmlsZSBtb2RhbC5qc1xuICpcbiAqIERlYWwgd2l0aCBtdWx0aXBsZSBtb2RhbHMgYW5kIHRoZWlyIG1lZGlhLlxuICovXG53aW5kb3cud2RzTW9kYWwgPSB7fTtcblxuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0bGV0ICRtb2RhbFRvZ2dsZSxcblx0XHQkZm9jdXNhYmxlQ2hpbGRyZW4sXG5cdFx0JHBsYXllcixcblx0XHQkdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NjcmlwdCcgKSxcblx0XHQkZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3NjcmlwdCcgKVswXSxcblx0XHRZVDtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHQkZmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoICR0YWcsICRmaXJzdFNjcmlwdFRhZyApO1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdCdib2R5JzogJCggJ2JvZHknIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQoICcubW9kYWwtdHJpZ2dlcicgKS5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gVHJpZ2dlciBhIG1vZGFsIHRvIG9wZW4uXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJy5tb2RhbC10cmlnZ2VyJywgYXBwLm9wZW5Nb2RhbCApO1xuXG5cdFx0Ly8gVHJpZ2dlciB0aGUgY2xvc2UgYnV0dG9uIHRvIGNsb3NlIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLmNsb3NlJywgYXBwLmNsb3NlTW9kYWwgKTtcblxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIGNsb3NlIHRoZSBtb2RhbCBieSBoaXR0aW5nIHRoZSBlc2Mga2V5LlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC5lc2NLZXlDbG9zZSApO1xuXG5cdFx0Ly8gQWxsb3cgdGhlIHVzZXIgdG8gY2xvc2UgdGhlIG1vZGFsIGJ5IGNsaWNraW5nIG91dHNpZGUgb2YgdGhlIG1vZGFsLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICdkaXYubW9kYWwtb3BlbicsIGFwcC5jbG9zZU1vZGFsQnlDbGljayApO1xuXG5cdFx0Ly8gTGlzdGVuIHRvIHRhYnMsIHRyYXAga2V5Ym9hcmQgaWYgd2UgbmVlZCB0b1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC50cmFwS2V5Ym9hcmRNYXliZSApO1xuXG5cdH07XG5cblx0Ly8gT3BlbiB0aGUgbW9kYWwuXG5cdGFwcC5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFN0b3JlIHRoZSBtb2RhbCB0b2dnbGUgZWxlbWVudFxuXHRcdCRtb2RhbFRvZ2dsZSA9ICQoIHRoaXMgKTtcblxuXHRcdC8vIEZpZ3VyZSBvdXQgd2hpY2ggbW9kYWwgd2UncmUgb3BlbmluZyBhbmQgc3RvcmUgdGhlIG9iamVjdC5cblx0XHRsZXQgJG1vZGFsID0gJCggJCggdGhpcyApLmRhdGEoICd0YXJnZXQnICkgKTtcblxuXHRcdC8vIERpc3BsYXkgdGhlIG1vZGFsLlxuXHRcdCRtb2RhbC5hZGRDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBBZGQgYm9keSBjbGFzcy5cblx0XHRhcHAuJGMuYm9keS5hZGRDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBGaW5kIHRoZSBmb2N1c2FibGUgY2hpbGRyZW4gb2YgdGhlIG1vZGFsLlxuXHRcdC8vIFRoaXMgbGlzdCBtYXkgYmUgaW5jb21wbGV0ZSwgcmVhbGx5IHdpc2ggalF1ZXJ5IGhhZCB0aGUgOmZvY3VzYWJsZSBwc2V1ZG8gbGlrZSBqUXVlcnkgVUkgZG9lcy5cblx0XHQvLyBGb3IgbW9yZSBhYm91dCA6aW5wdXQgc2VlOiBodHRwczovL2FwaS5qcXVlcnkuY29tL2lucHV0LXNlbGVjdG9yL1xuXHRcdCRmb2N1c2FibGVDaGlsZHJlbiA9ICRtb2RhbC5maW5kKCAnYSwgOmlucHV0LCBbdGFiaW5kZXhdJyApO1xuXG5cdFx0Ly8gSWRlYWxseSwgdGhlcmUgaXMgYWx3YXlzIG9uZSAodGhlIGNsb3NlIGJ1dHRvbiksIGJ1dCB5b3UgbmV2ZXIga25vdy5cblx0XHRpZiAoIDAgPCAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoICkge1xuXG5cdFx0XHQvLyBTaGlmdCBmb2N1cyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBDbG9zZSB0aGUgbW9kYWwuXG5cdGFwcC5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBGaWd1cmUgdGhlIG9wZW5lZCBtb2RhbCB3ZSdyZSBjbG9zaW5nIGFuZCBzdG9yZSB0aGUgb2JqZWN0LlxuXHRcdGxldCAkbW9kYWwgPSAkKCAkKCAnZGl2Lm1vZGFsLW9wZW4gLmNsb3NlJyApLmRhdGEoICd0YXJnZXQnICkgKSxcblxuXHRcdFx0Ly8gRmluZCB0aGUgaWZyYW1lIGluIHRoZSAkbW9kYWwgb2JqZWN0LlxuXHRcdFx0JGlmcmFtZSA9ICRtb2RhbC5maW5kKCAnaWZyYW1lJyApO1xuXG5cdFx0Ly8gT25seSBkbyB0aGlzIGlmIHRoZXJlIGFyZSBhbnkgaWZyYW1lcy5cblx0XHRpZiAoICRpZnJhbWUubGVuZ3RoICkge1xuXG5cdFx0XHQvLyBHZXQgdGhlIGlmcmFtZSBzcmMgVVJMLlxuXHRcdFx0bGV0IHVybCA9ICRpZnJhbWUuYXR0ciggJ3NyYycgKTtcblxuXHRcdFx0Ly8gUmVtb3ZpbmcvUmVhZGRpbmcgdGhlIFVSTCB3aWxsIGVmZmVjdGl2ZWx5IGJyZWFrIHRoZSBZb3VUdWJlIEFQSS5cblx0XHRcdC8vIFNvIGxldCdzIG5vdCBkbyB0aGF0IHdoZW4gdGhlIGlmcmFtZSBVUkwgY29udGFpbnMgdGhlIGVuYWJsZWpzYXBpIHBhcmFtZXRlci5cblx0XHRcdGlmICggISB1cmwuaW5jbHVkZXMoICdlbmFibGVqc2FwaT0xJyApICkge1xuXG5cdFx0XHRcdC8vIFJlbW92ZSB0aGUgc291cmNlIFVSTCwgdGhlbiBhZGQgaXQgYmFjaywgc28gdGhlIHZpZGVvIGNhbiBiZSBwbGF5ZWQgYWdhaW4gbGF0ZXIuXG5cdFx0XHRcdCRpZnJhbWUuYXR0ciggJ3NyYycsICcnICkuYXR0ciggJ3NyYycsIHVybCApO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBVc2UgdGhlIFlvdVR1YmUgQVBJIHRvIHN0b3AgdGhlIHZpZGVvLlxuXHRcdFx0XHQkcGxheWVyLnN0b3BWaWRlbygpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEZpbmFsbHksIGhpZGUgdGhlIG1vZGFsLlxuXHRcdCRtb2RhbC5yZW1vdmVDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBSZW1vdmUgdGhlIGJvZHkgY2xhc3MuXG5cdFx0YXBwLiRjLmJvZHkucmVtb3ZlQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gUmV2ZXJ0IGZvY3VzIGJhY2sgdG8gdG9nZ2xlIGVsZW1lbnRcblx0XHQkbW9kYWxUb2dnbGUuZm9jdXMoKTtcblxuXHR9O1xuXG5cdC8vIENsb3NlIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXG5cdGFwcC5lc2NLZXlDbG9zZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0YXBwLmNsb3NlTW9kYWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2xvc2UgaWYgdGhlIHVzZXIgY2xpY2tzIG91dHNpZGUgb2YgdGhlIG1vZGFsXG5cdGFwcC5jbG9zZU1vZGFsQnlDbGljayA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIElmIHRoZSBwYXJlbnQgY29udGFpbmVyIGlzIE5PVCB0aGUgbW9kYWwgZGlhbG9nIGNvbnRhaW5lciwgY2xvc2UgdGhlIG1vZGFsXG5cdFx0aWYgKCAhICQoIGV2ZW50LnRhcmdldCApLnBhcmVudHMoICdkaXYnICkuaGFzQ2xhc3MoICdtb2RhbC1kaWFsb2cnICkgKSB7XG5cdFx0XHRhcHAuY2xvc2VNb2RhbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBUcmFwIHRoZSBrZXlib2FyZCBpbnRvIGEgbW9kYWwgd2hlbiBvbmUgaXMgYWN0aXZlLlxuXHRhcHAudHJhcEtleWJvYXJkTWF5YmUgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHQvLyBXZSBvbmx5IG5lZWQgdG8gZG8gc3R1ZmYgd2hlbiB0aGUgbW9kYWwgaXMgb3BlbiBhbmQgdGFiIGlzIHByZXNzZWQuXG5cdFx0aWYgKCA5ID09PSBldmVudC53aGljaCAmJiAwIDwgJCggJy5tb2RhbC1vcGVuJyApLmxlbmd0aCApIHtcblx0XHRcdGxldCAkZm9jdXNlZCA9ICQoICc6Zm9jdXMnICksXG5cdFx0XHRcdGZvY3VzSW5kZXggPSAkZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXgoICRmb2N1c2VkICk7XG5cblx0XHRcdGlmICggMCA9PT0gZm9jdXNJbmRleCAmJiBldmVudC5zaGlmdEtleSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCwgYW5kIHNoaWZ0IGlzIGhlbGQgd2hlbiBwcmVzc2luZyB0YWIsIGdvIGJhY2sgdG8gbGFzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWyAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSBdLmZvY3VzKCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIGV2ZW50LnNoaWZ0S2V5ICYmIGZvY3VzSW5kZXggPT09ICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxICkge1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnQsIGFuZCBzaGlmdCBpcyBub3QgaGVsZCwgZ28gYmFjayB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBIb29rIGludG8gWW91VHViZSA8aWZyYW1lPi5cblx0YXBwLm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0bGV0ICRtb2RhbCA9ICQoICdkaXYubW9kYWwnICksXG5cdFx0XHQkaWZyYW1laWQgPSAkbW9kYWwuZmluZCggJ2lmcmFtZScgKS5hdHRyKCAnaWQnICk7XG5cblx0XHQkcGxheWVyID0gbmV3IFlULlBsYXllciggJGlmcmFtZWlkLCB7XG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0J29uUmVhZHknOiBhcHAub25QbGF5ZXJSZWFkeSxcblx0XHRcdFx0J29uU3RhdGVDaGFuZ2UnOiBhcHAub25QbGF5ZXJTdGF0ZUNoYW5nZVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIERvIHNvbWV0aGluZyBvbiBwbGF5ZXIgcmVhZHkuXG5cdGFwcC5vblBsYXllclJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciBzdGF0ZSBjaGFuZ2UuXG5cdGFwcC5vblBsYXllclN0YXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTZXQgZm9jdXMgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IGluc2lkZSBvZiB0aGUgbW9kYWwgdGhlIHBsYXllciBpcyBpbi5cblx0XHQkKCBldmVudC50YXJnZXQuYSApLnBhcmVudHMoICcubW9kYWwnICkuZmluZCggJ2EsIDppbnB1dCwgW3RhYmluZGV4XScgKS5maXJzdCgpLmZvY3VzKCk7XG5cdH07XG5cblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59KSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2RhbCApO1xuIiwiLyoqXG4gKiBGaWxlOiBuYXZpZ2F0aW9uLXByaW1hcnkuanNcbiAqXG4gKiBIZWxwZXJzIGZvciB0aGUgcHJpbWFyeSBuYXZpZ2F0aW9uLlxuICovXG53aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0c3ViTWVudUNvbnRhaW5lcjogJCggJy5tYWluLW5hdmlnYXRpb24gLnN1Yi1tZW51JyApLFxuXHRcdFx0c3ViTWVudVBhcmVudEl0ZW06ICQoICcubWFpbi1uYXZpZ2F0aW9uIGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJ2EnICkub24oICdmb2N1c2luIGZvY3Vzb3V0JywgYXBwLnRvZ2dsZUZvY3VzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnN1Yk1lbnVDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJz4gYScgKS5hcHBlbmQoICc8c3BhbiBjbGFzcz1cImNhcmV0LWRvd25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+JyApO1xuXHR9O1xuXG5cdC8vIFRvZ2dsZSB0aGUgZm9jdXMgY2xhc3Mgb24gdGhlIGxpbmsgcGFyZW50LlxuXHRhcHAudG9nZ2xlRm9jdXMgPSBmdW5jdGlvbigpIHtcblx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkudG9nZ2xlQ2xhc3MoICdmb2N1cycgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0pKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1ByaW1hcnlOYXZpZ2F0aW9uICk7XG4iLCIvKipcbiAqIEZpbGU6IG9mZi1jYW52YXMuanNcbiAqXG4gKiBIZWxwIGRlYWwgd2l0aCB0aGUgb2ZmLWNhbnZhcyBtb2JpbGUgbWVudS5cbiAqL1xud2luZG93Lndkc29mZkNhbnZhcyA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxuXHRcdFx0b2ZmQ2FudmFzQ2xvc2U6ICQoICcub2ZmLWNhbnZhcy1jbG9zZScgKSxcblx0XHRcdG9mZkNhbnZhc0NvbnRhaW5lcjogJCggJy5vZmYtY2FudmFzLWNvbnRhaW5lcicgKSxcblx0XHRcdG9mZkNhbnZhc09wZW46ICQoICcub2ZmLWNhbnZhcy1vcGVuJyApLFxuXHRcdFx0b2ZmQ2FudmFzU2NyZWVuOiAkKCAnLm9mZi1jYW52YXMtc2NyZWVuJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLmVzY0tleUNsb3NlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0Nsb3NlLm9uKCAnY2xpY2snLCBhcHAuY2xvc2VvZmZDYW52YXMgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZW9mZkNhbnZhcyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4ub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIFRvIHNob3cgb3Igbm90IHRvIHNob3c/XG5cdGFwcC50b2dnbGVvZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmICggJ3RydWUnID09PSAkKCB0aGlzICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0XHRhcHAuY2xvc2VvZmZDYW52YXMoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXBwLm9wZW5vZmZDYW52YXMoKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBTaG93IHRoYXQgZHJhd2VyIVxuXHRhcHAub3Blbm9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYXR0ciggJ2FyaWEtaGlkZGVuJywgZmFsc2UgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuZmluZCggJ2J1dHRvbicgKS5maXJzdCgpLmZvY3VzKCk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhhdCBkcmF3ZXIhXG5cdGFwcC5jbG9zZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIHRydWUgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmZvY3VzKCk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgZHJhd2VyIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXG5cdGFwcC5lc2NLZXlDbG9zZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSkoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2Rzb2ZmQ2FudmFzICk7XG4iLCIvKipcbiAqIEZpbGUgc2tpcC1saW5rLWZvY3VzLWZpeC5qcy5cbiAqXG4gKiBIZWxwcyB3aXRoIGFjY2Vzc2liaWxpdHkgZm9yIGtleWJvYXJkIG9ubHkgdXNlcnMuXG4gKlxuICogTGVhcm4gbW9yZTogaHR0cHM6Ly9naXQuaW8vdldkcjJcbiAqL1xuKCBmdW5jdGlvbigpIHtcblx0dmFyIGlzV2Via2l0ID0gLTEgPCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ3dlYmtpdCcgKSxcblx0XHRpc09wZXJhID0gLTEgPCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ29wZXJhJyApLFxuXHRcdGlzSWUgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnbXNpZScgKTtcblxuXHRpZiAoICggaXNXZWJraXQgfHwgaXNPcGVyYSB8fCBpc0llICkgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdoYXNoY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaWQgPSBsb2NhdGlvbi5oYXNoLnN1YnN0cmluZyggMSApLFxuXHRcdFx0XHRlbGVtZW50O1xuXG5cdFx0XHRpZiAoICEgKCAvXltBLXowLTlfLV0rJC8gKS50ZXN0KCBpZCApICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggaWQgKTtcblxuXHRcdFx0aWYgKCBlbGVtZW50ICkge1xuXHRcdFx0XHRpZiAoICEgKCAvXig/OmF8c2VsZWN0fGlucHV0fGJ1dHRvbnx0ZXh0YXJlYSkkL2kgKS50ZXN0KCBlbGVtZW50LnRhZ05hbWUgKSApIHtcblx0XHRcdFx0XHRlbGVtZW50LnRhYkluZGV4ID0gLTE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtZW50LmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UgKTtcblx0fVxufSkoKTtcbiIsIi8qKlxuICogRmlsZSB3aW5kb3ctcmVhZHkuanNcbiAqXG4gKiBBZGQgYSBcInJlYWR5XCIgY2xhc3MgdG8gPGJvZHk+IHdoZW4gd2luZG93IGlzIHJlYWR5LlxuICovXG53aW5kb3cud2RzV2luZG93UmVhZHkgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdH07XG5cblx0Ly8gQ2FjaGUgZG9jdW1lbnQgZWxlbWVudHMuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdCd3aW5kb3cnOiAkKCB3aW5kb3cgKSxcblx0XHRcdCdib2R5JzogJCggZG9jdW1lbnQuYm9keSApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5sb2FkKCBhcHAuYWRkQm9keUNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWRkIGEgY2xhc3MgdG8gPGJvZHk+LlxuXHRhcHAuYWRkQm9keUNsYXNzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkuYWRkQ2xhc3MoICdyZWFkeScgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59KSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNXaW5kb3dSZWFkeSApO1xuIl19
