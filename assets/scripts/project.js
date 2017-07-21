'use strict';

/**
 * Create a carousel if we have more than one hero slide.
 */
window.Hero_Carousel = {};
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
})(window, jQuery, window.Hero_Carousel);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlcm8tY2Fyb3VzZWwuanMiLCJqcy1lbmFibGVkLmpzIiwibW9iaWxlLW1lbnUuanMiLCJtb2RhbC5qcyIsIm5hdmlnYXRpb24tcHJpbWFyeS5qcyIsIm9mZi1jYW52YXMuanMiLCJza2lwLWxpbmstZm9jdXMtZml4LmpzIiwid2luZG93LXJlYWR5LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIkhlcm9fQ2Fyb3VzZWwiLCIkIiwiYXBwIiwiaW5pdCIsImNhY2hlIiwibWVldHNSZXF1aXJlbWVudHMiLCJiaW5kRXZlbnRzIiwiJGMiLCJoZXJvQ2Fyb3VzZWwiLCJvbiIsImRvU2xpY2siLCJkb0ZpcnN0QW5pbWF0aW9uIiwibGVuZ3RoIiwiZmlyc3RTbGlkZSIsImZpbmQiLCJmaXJzdFNsaWRlQ29udGVudCIsImZpcnN0QW5pbWF0aW9uIiwiYXR0ciIsImFkZENsYXNzIiwiZG9BbmltYXRpb24iLCJldmVudCIsInNsaWNrIiwic2xpZGVzIiwiYWN0aXZlU2xpZGUiLCJhY3RpdmVDb250ZW50IiwiYW5pbWF0aW9uQ2xhc3MiLCJzcGxpdEFuaW1hdGlvbiIsInNwbGl0IiwiYW5pbWF0aW9uVHJpZ2dlciIsImFuaW1hdGVDc3MiLCJlYWNoIiwiaW5kZXgiLCJlbGVtZW50Iiwic2xpZGVDb250ZW50IiwiaGFzQ2xhc3MiLCJsYXN0Q2xhc3MiLCJwb3AiLCJyZW1vdmVDbGFzcyIsInBsYXlCYWNrZ3JvdW5kVmlkZW9zIiwicGxheSIsImF1dG9wbGF5IiwiYXV0b3BsYXlTcGVlZCIsImFycm93cyIsImRvdHMiLCJmb2N1c09uU2VsZWN0Iiwid2FpdEZvckFuaW1hdGUiLCJqUXVlcnkiLCJkb2N1bWVudCIsImJvZHkiLCJjbGFzc05hbWUiLCJyZXBsYWNlIiwid2RzTW9iaWxlTWVudSIsInN1Yk1lbnVDb250YWluZXIiLCJzdWJNZW51UGFyZW50SXRlbSIsIm9mZkNhbnZhc0NvbnRhaW5lciIsImFkZERvd25BcnJvdyIsInRvZ2dsZVN1Ym1lbnUiLCJyZXNldFN1Yk1lbnUiLCJmb3JjZUNsb3NlU3VibWVudXMiLCJlIiwiJHRhcmdldCIsInRhcmdldCIsImlzIiwic2xpZGVPdXRTdWJNZW51cyIsInBhcmVudCIsInByZXBlbmQiLCJlbCIsInN1Yk1lbnUiLCJjaGlsZHJlbiIsIm9wZW5TdWJtZW51Iiwid2RzTW9kYWwiLCIkbW9kYWxUb2dnbGUiLCIkZm9jdXNhYmxlQ2hpbGRyZW4iLCIkcGxheWVyIiwiJHRhZyIsImNyZWF0ZUVsZW1lbnQiLCIkZmlyc3RTY3JpcHRUYWciLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIllUIiwicGFyZW50Tm9kZSIsImluc2VydEJlZm9yZSIsIm9wZW5Nb2RhbCIsImNsb3NlTW9kYWwiLCJlc2NLZXlDbG9zZSIsImNsb3NlTW9kYWxCeUNsaWNrIiwidHJhcEtleWJvYXJkTWF5YmUiLCIkbW9kYWwiLCJkYXRhIiwiZm9jdXMiLCIkaWZyYW1lIiwidXJsIiwiaW5jbHVkZXMiLCJzdG9wVmlkZW8iLCJrZXlDb2RlIiwicGFyZW50cyIsIndoaWNoIiwiJGZvY3VzZWQiLCJmb2N1c0luZGV4Iiwic2hpZnRLZXkiLCJwcmV2ZW50RGVmYXVsdCIsIm9uWW91VHViZUlmcmFtZUFQSVJlYWR5IiwiJGlmcmFtZWlkIiwiUGxheWVyIiwiZXZlbnRzIiwib25QbGF5ZXJSZWFkeSIsIm9uUGxheWVyU3RhdGVDaGFuZ2UiLCJhIiwiZmlyc3QiLCJ3ZHNQcmltYXJ5TmF2aWdhdGlvbiIsInRvZ2dsZUZvY3VzIiwiYXBwZW5kIiwidG9nZ2xlQ2xhc3MiLCJ3ZHNvZmZDYW52YXMiLCJvZmZDYW52YXNDbG9zZSIsIm9mZkNhbnZhc09wZW4iLCJvZmZDYW52YXNTY3JlZW4iLCJjbG9zZW9mZkNhbnZhcyIsInRvZ2dsZW9mZkNhbnZhcyIsIm9wZW5vZmZDYW52YXMiLCJpc1dlYmtpdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiaW5kZXhPZiIsImlzT3BlcmEiLCJpc0llIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiaWQiLCJsb2NhdGlvbiIsImhhc2giLCJzdWJzdHJpbmciLCJ0ZXN0IiwidGFnTmFtZSIsInRhYkluZGV4Iiwid2RzV2luZG93UmVhZHkiLCJsb2FkIiwiYWRkQm9keUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7QUFHQUEsT0FBT0MsYUFBUCxHQUF1QixFQUF2QjtBQUNBLENBQUUsVUFBVUQsTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUV6QjtBQUNBQSxRQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNsQkQsWUFBSUUsS0FBSjs7QUFFQSxZQUFLRixJQUFJRyxpQkFBSixFQUFMLEVBQStCO0FBQzNCSCxnQkFBSUksVUFBSjtBQUNIO0FBQ0osS0FORDs7QUFRQTtBQUNBSixRQUFJRSxLQUFKLEdBQVksWUFBVztBQUNuQkYsWUFBSUssRUFBSixHQUFTO0FBQ0xSLG9CQUFRRSxFQUFHRixNQUFILENBREg7QUFFTFMsMEJBQWNQLEVBQUcsV0FBSDtBQUZULFNBQVQ7QUFJSCxLQUxEOztBQU9BO0FBQ0FDLFFBQUlJLFVBQUosR0FBaUIsWUFBVztBQUN4QkosWUFBSUssRUFBSixDQUFPUixNQUFQLENBQWNVLEVBQWQsQ0FBa0IsTUFBbEIsRUFBMEJQLElBQUlRLE9BQTlCO0FBQ0FSLFlBQUlLLEVBQUosQ0FBT1IsTUFBUCxDQUFjVSxFQUFkLENBQWtCLE1BQWxCLEVBQTBCUCxJQUFJUyxnQkFBOUI7QUFFSCxLQUpEOztBQU1BO0FBQ0FULFFBQUlHLGlCQUFKLEdBQXdCLFlBQVc7QUFDL0IsZUFBT0gsSUFBSUssRUFBSixDQUFPQyxZQUFQLENBQW9CSSxNQUEzQjtBQUNILEtBRkQ7O0FBSUE7QUFDQVYsUUFBSVMsZ0JBQUosR0FBdUIsWUFBVzs7QUFFOUI7QUFDQSxZQUFJRSxhQUFhWCxJQUFJSyxFQUFKLENBQU9DLFlBQVAsQ0FBb0JNLElBQXBCLENBQTBCLHNCQUExQixDQUFqQjtBQUFBLFlBQ0lDLG9CQUFvQkYsV0FBV0MsSUFBWCxDQUFpQixlQUFqQixDQUR4QjtBQUFBLFlBRUlFLGlCQUFpQkQsa0JBQWtCRSxJQUFsQixDQUF3QixnQkFBeEIsQ0FGckI7O0FBSUk7QUFDQUYsMEJBQWtCRyxRQUFsQixDQUE0QkYsY0FBNUI7QUFDUCxLQVREOztBQVdBO0FBQ0FkLFFBQUlpQixXQUFKLEdBQWtCLFVBQVVDLEtBQVYsRUFBaUJDLEtBQWpCLEVBQXlCOztBQUV2QyxZQUFJQyxTQUFTckIsRUFBRyxRQUFILENBQWI7QUFBQSxZQUNJc0IsY0FBY3RCLEVBQUcsZ0JBQUgsQ0FEbEI7QUFBQSxZQUVMdUIsZ0JBQWdCRCxZQUFZVCxJQUFaLENBQWtCLGVBQWxCLENBRlg7OztBQUlJO0FBQ1RXLHlCQUFpQkQsY0FBY1AsSUFBZCxDQUFvQixnQkFBcEIsQ0FMWjtBQUFBLFlBTUlTLGlCQUFpQkQsZUFBZUUsS0FBZixDQUFzQixHQUF0QixDQU5yQjs7O0FBUUk7QUFDQUMsMkJBQW1CRixlQUFlLENBQWYsQ0FUdkI7OztBQVdJO0FBQ0FHLHFCQUFhSCxlQUFlLENBQWYsQ0FaakI7O0FBY0k7QUFDQUosZUFBT1EsSUFBUCxDQUFhLFVBQVVDLEtBQVYsRUFBaUJDLE9BQWpCLEVBQTJCOztBQUVwQyxnQkFBSUMsZUFBZWhDLEVBQUcsSUFBSCxFQUFVYSxJQUFWLENBQWdCLGVBQWhCLENBQW5COztBQUVBO0FBQ0EsZ0JBQUttQixhQUFhQyxRQUFiLENBQXVCLFVBQXZCLENBQUwsRUFBMkM7O0FBRXZDO0FBQ0Esb0JBQUlDLFlBQVlGLGFBQWFoQixJQUFiLENBQW1CLE9BQW5CLEVBQTZCVSxLQUE3QixDQUFvQyxHQUFwQyxFQUEwQ1MsR0FBMUMsRUFBaEI7O0FBRUE7QUFDQUgsNkJBQWFJLFdBQWIsQ0FBMEJGLFNBQTFCLEVBQXNDRSxXQUF0QyxDQUFtRFQsZ0JBQW5EO0FBQ0g7QUFDSixTQWJEOztBQWVBO0FBQ0FKLHNCQUFjTixRQUFkLENBQXdCTyxjQUF4QjtBQUNQLEtBbENEOztBQW9DQTtBQUNIdkIsUUFBSW9DLG9CQUFKLEdBQTJCLFlBQVc7O0FBRS9CO0FBQ05yQyxVQUFHLE9BQUgsRUFBYTZCLElBQWIsQ0FBbUIsWUFBVzs7QUFFcEI7QUFDVCxpQkFBS1MsSUFBTDtBQUNBLFNBSkQ7QUFLQSxLQVJEOztBQVVHO0FBQ0FyQyxRQUFJUSxPQUFKLEdBQWMsWUFBVzs7QUFFM0JSLFlBQUlLLEVBQUosQ0FBT0MsWUFBUCxDQUFvQkMsRUFBcEIsQ0FBd0IsTUFBeEIsRUFBZ0NQLElBQUlvQyxvQkFBcEM7O0FBRU1wQyxZQUFJSyxFQUFKLENBQU9DLFlBQVAsQ0FBb0JhLEtBQXBCLENBQTBCO0FBQ3RCbUIsc0JBQVUsSUFEWTtBQUUvQkMsMkJBQWUsSUFGZ0I7QUFHdEJDLG9CQUFRLEtBSGM7QUFJdEJDLGtCQUFNLEtBSmdCO0FBSy9CQywyQkFBZSxJQUxnQjtBQU10QkMsNEJBQWdCO0FBTk0sU0FBMUI7O0FBU0EzQyxZQUFJSyxFQUFKLENBQU9DLFlBQVAsQ0FBb0JDLEVBQXBCLENBQXdCLGFBQXhCLEVBQXVDUCxJQUFJaUIsV0FBM0M7QUFFSCxLQWZEOztBQWlCQTtBQUNBbEIsTUFBR0MsSUFBSUMsSUFBUDtBQUVILENBaEhELEVBZ0hJSixNQWhISixFQWdIWStDLE1BaEhaLEVBZ0hvQi9DLE9BQU9DLGFBaEgzQjs7O0FDSkE7Ozs7O0FBS0ErQyxTQUFTQyxJQUFULENBQWNDLFNBQWQsR0FBMEJGLFNBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QkMsT0FBeEIsQ0FBaUMsT0FBakMsRUFBMEMsSUFBMUMsQ0FBMUI7OztBQ0xBOzs7OztBQUtBbkQsT0FBT29ELGFBQVAsR0FBdUIsRUFBdkI7QUFDQSxDQUFFLFVBQVVwRCxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKOztBQUVBLE1BQUtGLElBQUlHLGlCQUFKLEVBQUwsRUFBK0I7QUFDOUJILE9BQUlJLFVBQUo7QUFDQTtBQUNELEVBTkQ7O0FBUUE7QUFDQUosS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlLLEVBQUosR0FBUztBQUNSUixXQUFRRSxFQUFHRixNQUFILENBREE7QUFFUnFELHFCQUFrQm5ELEVBQUcsd0JBQUgsQ0FGVjtBQUdSb0Qsc0JBQW1CcEQsRUFBRyx3Q0FBSCxDQUhYO0FBSVJxRCx1QkFBb0JyRCxFQUFHLHVCQUFIO0FBSlosR0FBVDtBQU1BLEVBUEQ7O0FBU0E7QUFDQUMsS0FBSUksVUFBSixHQUFpQixZQUFXO0FBQzNCSixNQUFJSyxFQUFKLENBQU9SLE1BQVAsQ0FBY1UsRUFBZCxDQUFrQixNQUFsQixFQUEwQlAsSUFBSXFELFlBQTlCO0FBQ0FyRCxNQUFJSyxFQUFKLENBQU84QyxpQkFBUCxDQUF5QjVDLEVBQXpCLENBQTZCLE9BQTdCLEVBQXNDUCxJQUFJc0QsYUFBMUM7QUFDQXRELE1BQUlLLEVBQUosQ0FBTzhDLGlCQUFQLENBQXlCNUMsRUFBekIsQ0FBNkIsZUFBN0IsRUFBOENQLElBQUl1RCxZQUFsRDtBQUNBdkQsTUFBSUssRUFBSixDQUFPK0Msa0JBQVAsQ0FBMEI3QyxFQUExQixDQUE4QixlQUE5QixFQUErQ1AsSUFBSXdELGtCQUFuRDtBQUNBLEVBTEQ7O0FBT0E7QUFDQXhELEtBQUlHLGlCQUFKLEdBQXdCLFlBQVc7QUFDbEMsU0FBT0gsSUFBSUssRUFBSixDQUFPNkMsZ0JBQVAsQ0FBd0J4QyxNQUEvQjtBQUNBLEVBRkQ7O0FBSUE7QUFDQVYsS0FBSXVELFlBQUosR0FBbUIsVUFBVUUsQ0FBVixFQUFjO0FBQ2hDLE1BQU1DLFVBQVUzRCxFQUFHMEQsRUFBRUUsTUFBTCxDQUFoQjs7QUFFQTtBQUNBO0FBQ0EsTUFBS0QsUUFBUUUsRUFBUixDQUFZLDJCQUFaLEtBQTZDLENBQUVGLFFBQVExQixRQUFSLENBQWtCLFlBQWxCLENBQXBELEVBQXVGO0FBQ3RGMEIsV0FBUTlDLElBQVIsQ0FBYyxhQUFkLEVBQThCdUIsV0FBOUIsQ0FBMkMseUJBQTNDO0FBQ0E7QUFFRCxFQVREOztBQVdBO0FBQ0FuQyxLQUFJNkQsZ0JBQUosR0FBdUIsWUFBVztBQUNqQzdELE1BQUlLLEVBQUosQ0FBTzZDLGdCQUFQLENBQXdCdEIsSUFBeEIsQ0FBOEIsWUFBVzs7QUFFeEM7QUFDQSxPQUFLN0IsRUFBRyxJQUFILEVBQVVpQyxRQUFWLENBQW9CLGFBQXBCLENBQUwsRUFBMkM7O0FBRTFDO0FBQ0FqQyxNQUFHLElBQUgsRUFBVStELE1BQVYsR0FBbUIzQixXQUFuQixDQUFnQyxZQUFoQyxFQUErQ3ZCLElBQS9DLENBQXFELG1CQUFyRCxFQUEyRUcsSUFBM0UsQ0FBaUYsZUFBakYsRUFBa0csS0FBbEc7O0FBRUE7QUFDQWhCLE1BQUcsSUFBSCxFQUFVb0MsV0FBVixDQUF1QixhQUF2QixFQUF1Q25CLFFBQXZDLENBQWlELGNBQWpEO0FBQ0E7QUFFRCxHQVpEO0FBYUEsRUFkRDs7QUFnQkE7QUFDQWhCLEtBQUlxRCxZQUFKLEdBQW1CLFlBQVc7QUFDN0JyRCxNQUFJSyxFQUFKLENBQU84QyxpQkFBUCxDQUF5QlksT0FBekIsQ0FBa0MsMElBQWxDO0FBQ0EsRUFGRDs7QUFJQTtBQUNBL0QsS0FBSXNELGFBQUosR0FBb0IsVUFBVUcsQ0FBVixFQUFjOztBQUVqQyxNQUFJTyxLQUFLakUsRUFBRyxJQUFILENBQVQ7QUFBQSxNQUFvQjtBQUNuQmtFLFlBQVVELEdBQUdFLFFBQUgsQ0FBYSxhQUFiLENBRFg7QUFBQSxNQUN5QztBQUN4Q1IsWUFBVTNELEVBQUcwRCxFQUFFRSxNQUFMLENBRlgsQ0FGaUMsQ0FJUDs7QUFFMUI7QUFDQTtBQUNBLE1BQUtELFFBQVExQixRQUFSLENBQWtCLFlBQWxCLEtBQW9DMEIsUUFBUTFCLFFBQVIsQ0FBa0Isa0JBQWxCLENBQXpDLEVBQWtGOztBQUVqRjtBQUNBaEMsT0FBSTZELGdCQUFKOztBQUVBLE9BQUssQ0FBRUksUUFBUWpDLFFBQVIsQ0FBa0IsWUFBbEIsQ0FBUCxFQUEwQzs7QUFFekM7QUFDQWhDLFFBQUltRSxXQUFKLENBQWlCSCxFQUFqQixFQUFxQkMsT0FBckI7QUFFQTs7QUFFRCxVQUFPLEtBQVA7QUFDQTtBQUVELEVBdkJEOztBQXlCQTtBQUNBakUsS0FBSW1FLFdBQUosR0FBa0IsVUFBVUwsTUFBVixFQUFrQkcsT0FBbEIsRUFBNEI7O0FBRTdDO0FBQ0FILFNBQU85QyxRQUFQLENBQWlCLFlBQWpCLEVBQWdDSixJQUFoQyxDQUFzQyxtQkFBdEMsRUFBNERHLElBQTVELENBQWtFLGVBQWxFLEVBQW1GLElBQW5GOztBQUVBO0FBQ0FrRCxVQUFRakQsUUFBUixDQUFrQixpQ0FBbEI7QUFFQSxFQVJEOztBQVVBO0FBQ0FoQixLQUFJd0Qsa0JBQUosR0FBeUIsWUFBVzs7QUFFbkM7QUFDQSxNQUFLLENBQUV6RCxFQUFHLElBQUgsRUFBVWlDLFFBQVYsQ0FBb0IsWUFBcEIsQ0FBUCxFQUE0QztBQUMzQ2hDLE9BQUlLLEVBQUosQ0FBTzhDLGlCQUFQLENBQXlCaEIsV0FBekIsQ0FBc0MsWUFBdEMsRUFBcUR2QixJQUFyRCxDQUEyRCxtQkFBM0QsRUFBaUZHLElBQWpGLENBQXVGLGVBQXZGLEVBQXdHLEtBQXhHO0FBQ0FmLE9BQUlLLEVBQUosQ0FBTzZDLGdCQUFQLENBQXdCZixXQUF4QixDQUFxQyx3QkFBckM7QUFDQTtBQUVELEVBUkQ7O0FBVUE7QUFDQXBDLEdBQUdDLElBQUlDLElBQVA7QUFFQSxDQXZIRCxFQXVISUosTUF2SEosRUF1SFkrQyxNQXZIWixFQXVIb0IvQyxPQUFPb0QsYUF2SDNCOzs7QUNOQTs7Ozs7QUFLQXBELE9BQU91RSxRQUFQLEdBQWtCLEVBQWxCOztBQUVBLENBQUUsVUFBVXZFLE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUIsS0FBSXFFLHFCQUFKO0FBQUEsS0FDQ0MsMkJBREQ7QUFBQSxLQUVDQyxnQkFGRDtBQUFBLEtBR0NDLE9BQU8zQixTQUFTNEIsYUFBVCxDQUF3QixRQUF4QixDQUhSO0FBQUEsS0FJQ0Msa0JBQWtCN0IsU0FBUzhCLG9CQUFULENBQStCLFFBQS9CLEVBQTBDLENBQTFDLENBSm5CO0FBQUEsS0FLQ0MsV0FMRDs7QUFPQTtBQUNBNUUsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUEsTUFBS0YsSUFBSUcsaUJBQUosRUFBTCxFQUErQjtBQUM5QnVFLG1CQUFnQkcsVUFBaEIsQ0FBMkJDLFlBQTNCLENBQXlDTixJQUF6QyxFQUErQ0UsZUFBL0M7QUFDQTFFLE9BQUlJLFVBQUo7QUFDQTtBQUNELEVBUEQ7O0FBU0E7QUFDQUosS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlLLEVBQUosR0FBUztBQUNSLFdBQVFOLEVBQUcsTUFBSDtBQURBLEdBQVQ7QUFHQSxFQUpEOztBQU1BO0FBQ0FDLEtBQUlHLGlCQUFKLEdBQXdCLFlBQVc7QUFDbEMsU0FBT0osRUFBRyxnQkFBSCxFQUFzQlcsTUFBN0I7QUFDQSxFQUZEOztBQUlBO0FBQ0FWLEtBQUlJLFVBQUosR0FBaUIsWUFBVzs7QUFFM0I7QUFDQUosTUFBSUssRUFBSixDQUFPeUMsSUFBUCxDQUFZdkMsRUFBWixDQUFnQixrQkFBaEIsRUFBb0MsZ0JBQXBDLEVBQXNEUCxJQUFJK0UsU0FBMUQ7O0FBRUE7QUFDQS9FLE1BQUlLLEVBQUosQ0FBT3lDLElBQVAsQ0FBWXZDLEVBQVosQ0FBZ0Isa0JBQWhCLEVBQW9DLFFBQXBDLEVBQThDUCxJQUFJZ0YsVUFBbEQ7O0FBRUE7QUFDQWhGLE1BQUlLLEVBQUosQ0FBT3lDLElBQVAsQ0FBWXZDLEVBQVosQ0FBZ0IsU0FBaEIsRUFBMkJQLElBQUlpRixXQUEvQjs7QUFFQTtBQUNBakYsTUFBSUssRUFBSixDQUFPeUMsSUFBUCxDQUFZdkMsRUFBWixDQUFnQixrQkFBaEIsRUFBb0MsZ0JBQXBDLEVBQXNEUCxJQUFJa0YsaUJBQTFEOztBQUVBO0FBQ0FsRixNQUFJSyxFQUFKLENBQU95QyxJQUFQLENBQVl2QyxFQUFaLENBQWdCLFNBQWhCLEVBQTJCUCxJQUFJbUYsaUJBQS9CO0FBRUEsRUFqQkQ7O0FBbUJBO0FBQ0FuRixLQUFJK0UsU0FBSixHQUFnQixZQUFXOztBQUUxQjtBQUNBVixpQkFBZXRFLEVBQUcsSUFBSCxDQUFmOztBQUVBO0FBQ0EsTUFBSXFGLFNBQVNyRixFQUFHQSxFQUFHLElBQUgsRUFBVXNGLElBQVYsQ0FBZ0IsUUFBaEIsQ0FBSCxDQUFiOztBQUVBO0FBQ0FELFNBQU9wRSxRQUFQLENBQWlCLFlBQWpCOztBQUVBO0FBQ0FoQixNQUFJSyxFQUFKLENBQU95QyxJQUFQLENBQVk5QixRQUFaLENBQXNCLFlBQXRCOztBQUVBO0FBQ0E7QUFDQTtBQUNBc0QsdUJBQXFCYyxPQUFPeEUsSUFBUCxDQUFhLHVCQUFiLENBQXJCOztBQUVBO0FBQ0EsTUFBSyxJQUFJMEQsbUJBQW1CNUQsTUFBNUIsRUFBcUM7O0FBRXBDO0FBQ0E0RCxzQkFBbUIsQ0FBbkIsRUFBc0JnQixLQUF0QjtBQUNBO0FBRUQsRUExQkQ7O0FBNEJBO0FBQ0F0RixLQUFJZ0YsVUFBSixHQUFpQixZQUFXOztBQUUzQjtBQUNBLE1BQUlJLFNBQVNyRixFQUFHQSxFQUFHLHVCQUFILEVBQTZCc0YsSUFBN0IsQ0FBbUMsUUFBbkMsQ0FBSCxDQUFiOzs7QUFFQztBQUNBRSxZQUFVSCxPQUFPeEUsSUFBUCxDQUFhLFFBQWIsQ0FIWDs7QUFLQTtBQUNBLE1BQUsyRSxRQUFRN0UsTUFBYixFQUFzQjs7QUFFckI7QUFDQSxPQUFJOEUsTUFBTUQsUUFBUXhFLElBQVIsQ0FBYyxLQUFkLENBQVY7O0FBRUE7QUFDQTtBQUNBLE9BQUssQ0FBRXlFLElBQUlDLFFBQUosQ0FBYyxlQUFkLENBQVAsRUFBeUM7O0FBRXhDO0FBQ0FGLFlBQVF4RSxJQUFSLENBQWMsS0FBZCxFQUFxQixFQUFyQixFQUEwQkEsSUFBMUIsQ0FBZ0MsS0FBaEMsRUFBdUN5RSxHQUF2QztBQUNBLElBSkQsTUFJTzs7QUFFTjtBQUNBakIsWUFBUW1CLFNBQVI7QUFDQTtBQUNEOztBQUVEO0FBQ0FOLFNBQU9qRCxXQUFQLENBQW9CLFlBQXBCOztBQUVBO0FBQ0FuQyxNQUFJSyxFQUFKLENBQU95QyxJQUFQLENBQVlYLFdBQVosQ0FBeUIsWUFBekI7O0FBRUE7QUFDQWtDLGVBQWFpQixLQUFiO0FBRUEsRUFwQ0Q7O0FBc0NBO0FBQ0F0RixLQUFJaUYsV0FBSixHQUFrQixVQUFVL0QsS0FBVixFQUFrQjtBQUNuQyxNQUFLLE9BQU9BLE1BQU15RSxPQUFsQixFQUE0QjtBQUMzQjNGLE9BQUlnRixVQUFKO0FBQ0E7QUFDRCxFQUpEOztBQU1BO0FBQ0FoRixLQUFJa0YsaUJBQUosR0FBd0IsVUFBVWhFLEtBQVYsRUFBa0I7O0FBRXpDO0FBQ0EsTUFBSyxDQUFFbkIsRUFBR21CLE1BQU15QyxNQUFULEVBQWtCaUMsT0FBbEIsQ0FBMkIsS0FBM0IsRUFBbUM1RCxRQUFuQyxDQUE2QyxjQUE3QyxDQUFQLEVBQXVFO0FBQ3RFaEMsT0FBSWdGLFVBQUo7QUFDQTtBQUNELEVBTkQ7O0FBUUE7QUFDQWhGLEtBQUltRixpQkFBSixHQUF3QixVQUFVakUsS0FBVixFQUFrQjs7QUFFekM7QUFDQSxNQUFLLE1BQU1BLE1BQU0yRSxLQUFaLElBQXFCLElBQUk5RixFQUFHLGFBQUgsRUFBbUJXLE1BQWpELEVBQTBEO0FBQ3pELE9BQUlvRixXQUFXL0YsRUFBRyxRQUFILENBQWY7QUFBQSxPQUNDZ0csYUFBYXpCLG1CQUFtQnpDLEtBQW5CLENBQTBCaUUsUUFBMUIsQ0FEZDs7QUFHQSxPQUFLLE1BQU1DLFVBQU4sSUFBb0I3RSxNQUFNOEUsUUFBL0IsRUFBMEM7O0FBRXpDO0FBQ0ExQix1QkFBb0JBLG1CQUFtQjVELE1BQW5CLEdBQTRCLENBQWhELEVBQW9ENEUsS0FBcEQ7QUFDQXBFLFVBQU0rRSxjQUFOO0FBQ0EsSUFMRCxNQUtPLElBQUssQ0FBRS9FLE1BQU04RSxRQUFSLElBQW9CRCxlQUFlekIsbUJBQW1CNUQsTUFBbkIsR0FBNEIsQ0FBcEUsRUFBd0U7O0FBRTlFO0FBQ0E0RCx1QkFBbUIsQ0FBbkIsRUFBc0JnQixLQUF0QjtBQUNBcEUsVUFBTStFLGNBQU47QUFDQTtBQUNEO0FBQ0QsRUFuQkQ7O0FBcUJBO0FBQ0FqRyxLQUFJa0csdUJBQUosR0FBOEIsWUFBVztBQUN4QyxNQUFJZCxTQUFTckYsRUFBRyxXQUFILENBQWI7QUFBQSxNQUNDb0csWUFBWWYsT0FBT3hFLElBQVAsQ0FBYSxRQUFiLEVBQXdCRyxJQUF4QixDQUE4QixJQUE5QixDQURiOztBQUdBd0QsWUFBVSxJQUFJSyxHQUFHd0IsTUFBUCxDQUFlRCxTQUFmLEVBQTBCO0FBQ25DRSxXQUFRO0FBQ1AsZUFBV3JHLElBQUlzRyxhQURSO0FBRVAscUJBQWlCdEcsSUFBSXVHO0FBRmQ7QUFEMkIsR0FBMUIsQ0FBVjtBQU1BLEVBVkQ7O0FBWUE7QUFDQXZHLEtBQUlzRyxhQUFKLEdBQW9CLFlBQVcsQ0FDOUIsQ0FERDs7QUFHQTtBQUNBdEcsS0FBSXVHLG1CQUFKLEdBQTBCLFlBQVc7O0FBRXBDO0FBQ0F4RyxJQUFHbUIsTUFBTXlDLE1BQU4sQ0FBYTZDLENBQWhCLEVBQW9CWixPQUFwQixDQUE2QixRQUE3QixFQUF3Q2hGLElBQXhDLENBQThDLHVCQUE5QyxFQUF3RTZGLEtBQXhFLEdBQWdGbkIsS0FBaEY7QUFDQSxFQUpEOztBQU9BO0FBQ0F2RixHQUFHQyxJQUFJQyxJQUFQO0FBQ0EsQ0F4TEQsRUF3TElKLE1BeExKLEVBd0xZK0MsTUF4TFosRUF3TG9CL0MsT0FBT3VFLFFBeEwzQjs7O0FDUEE7Ozs7O0FBS0F2RSxPQUFPNkcsb0JBQVAsR0FBOEIsRUFBOUI7QUFDQSxDQUFFLFVBQVU3RyxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFKOztBQUVBLE1BQUtGLElBQUlHLGlCQUFKLEVBQUwsRUFBK0I7QUFDOUJILE9BQUlJLFVBQUo7QUFDQTtBQUNELEVBTkQ7O0FBUUE7QUFDQUosS0FBSUUsS0FBSixHQUFZLFlBQVc7QUFDdEJGLE1BQUlLLEVBQUosR0FBUztBQUNSUixXQUFRRSxFQUFHRixNQUFILENBREE7QUFFUnFELHFCQUFrQm5ELEVBQUcsNEJBQUgsQ0FGVjtBQUdSb0Qsc0JBQW1CcEQsRUFBRyw0Q0FBSDtBQUhYLEdBQVQ7QUFLQSxFQU5EOztBQVFBO0FBQ0FDLEtBQUlJLFVBQUosR0FBaUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPUixNQUFQLENBQWNVLEVBQWQsQ0FBa0IsTUFBbEIsRUFBMEJQLElBQUlxRCxZQUE5QjtBQUNBckQsTUFBSUssRUFBSixDQUFPOEMsaUJBQVAsQ0FBeUJ2QyxJQUF6QixDQUErQixHQUEvQixFQUFxQ0wsRUFBckMsQ0FBeUMsa0JBQXpDLEVBQTZEUCxJQUFJMkcsV0FBakU7QUFDQSxFQUhEOztBQUtBO0FBQ0EzRyxLQUFJRyxpQkFBSixHQUF3QixZQUFXO0FBQ2xDLFNBQU9ILElBQUlLLEVBQUosQ0FBTzZDLGdCQUFQLENBQXdCeEMsTUFBL0I7QUFDQSxFQUZEOztBQUlBO0FBQ0FWLEtBQUlxRCxZQUFKLEdBQW1CLFlBQVc7QUFDN0JyRCxNQUFJSyxFQUFKLENBQU84QyxpQkFBUCxDQUF5QnZDLElBQXpCLENBQStCLEtBQS9CLEVBQXVDZ0csTUFBdkMsQ0FBK0MscURBQS9DO0FBQ0EsRUFGRDs7QUFJQTtBQUNBNUcsS0FBSTJHLFdBQUosR0FBa0IsWUFBVztBQUM1QjVHLElBQUcsSUFBSCxFQUFVNkYsT0FBVixDQUFtQiwyQkFBbkIsRUFBaURpQixXQUFqRCxDQUE4RCxPQUE5RDtBQUNBLEVBRkQ7O0FBSUE7QUFDQTlHLEdBQUdDLElBQUlDLElBQVA7QUFFQSxDQTVDRCxFQTRDSUosTUE1Q0osRUE0Q1krQyxNQTVDWixFQTRDb0IvQyxPQUFPNkcsb0JBNUMzQjs7O0FDTkE7Ozs7O0FBS0E3RyxPQUFPaUgsWUFBUCxHQUFzQixFQUF0QjtBQUNBLENBQUUsVUFBVWpILE1BQVYsRUFBa0JFLENBQWxCLEVBQXFCQyxHQUFyQixFQUEyQjs7QUFFNUI7QUFDQUEsS0FBSUMsSUFBSixHQUFXLFlBQVc7QUFDckJELE1BQUlFLEtBQUo7O0FBRUEsTUFBS0YsSUFBSUcsaUJBQUosRUFBTCxFQUErQjtBQUM5QkgsT0FBSUksVUFBSjtBQUNBO0FBQ0QsRUFORDs7QUFRQTtBQUNBSixLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSUssRUFBSixHQUFTO0FBQ1J5QyxTQUFNL0MsRUFBRyxNQUFILENBREU7QUFFUmdILG1CQUFnQmhILEVBQUcsbUJBQUgsQ0FGUjtBQUdScUQsdUJBQW9CckQsRUFBRyx1QkFBSCxDQUhaO0FBSVJpSCxrQkFBZWpILEVBQUcsa0JBQUgsQ0FKUDtBQUtSa0gsb0JBQWlCbEgsRUFBRyxvQkFBSDtBQUxULEdBQVQ7QUFPQSxFQVJEOztBQVVBO0FBQ0FDLEtBQUlJLFVBQUosR0FBaUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPeUMsSUFBUCxDQUFZdkMsRUFBWixDQUFnQixTQUFoQixFQUEyQlAsSUFBSWlGLFdBQS9CO0FBQ0FqRixNQUFJSyxFQUFKLENBQU8wRyxjQUFQLENBQXNCeEcsRUFBdEIsQ0FBMEIsT0FBMUIsRUFBbUNQLElBQUlrSCxjQUF2QztBQUNBbEgsTUFBSUssRUFBSixDQUFPMkcsYUFBUCxDQUFxQnpHLEVBQXJCLENBQXlCLE9BQXpCLEVBQWtDUCxJQUFJbUgsZUFBdEM7QUFDQW5ILE1BQUlLLEVBQUosQ0FBTzRHLGVBQVAsQ0FBdUIxRyxFQUF2QixDQUEyQixPQUEzQixFQUFvQ1AsSUFBSWtILGNBQXhDO0FBQ0EsRUFMRDs7QUFPQTtBQUNBbEgsS0FBSUcsaUJBQUosR0FBd0IsWUFBVztBQUNsQyxTQUFPSCxJQUFJSyxFQUFKLENBQU8rQyxrQkFBUCxDQUEwQjFDLE1BQWpDO0FBQ0EsRUFGRDs7QUFJQTtBQUNBVixLQUFJbUgsZUFBSixHQUFzQixZQUFXOztBQUVoQyxNQUFLLFdBQVdwSCxFQUFHLElBQUgsRUFBVWdCLElBQVYsQ0FBZ0IsZUFBaEIsQ0FBaEIsRUFBb0Q7QUFDbkRmLE9BQUlrSCxjQUFKO0FBQ0EsR0FGRCxNQUVPO0FBQ05sSCxPQUFJb0gsYUFBSjtBQUNBO0FBRUQsRUFSRDs7QUFVQTtBQUNBcEgsS0FBSW9ILGFBQUosR0FBb0IsWUFBVztBQUM5QnBILE1BQUlLLEVBQUosQ0FBTytDLGtCQUFQLENBQTBCcEMsUUFBMUIsQ0FBb0MsWUFBcEM7QUFDQWhCLE1BQUlLLEVBQUosQ0FBTzJHLGFBQVAsQ0FBcUJoRyxRQUFyQixDQUErQixZQUEvQjtBQUNBaEIsTUFBSUssRUFBSixDQUFPNEcsZUFBUCxDQUF1QmpHLFFBQXZCLENBQWlDLFlBQWpDOztBQUVBaEIsTUFBSUssRUFBSixDQUFPMkcsYUFBUCxDQUFxQmpHLElBQXJCLENBQTJCLGVBQTNCLEVBQTRDLElBQTVDO0FBQ0FmLE1BQUlLLEVBQUosQ0FBTytDLGtCQUFQLENBQTBCckMsSUFBMUIsQ0FBZ0MsYUFBaEMsRUFBK0MsS0FBL0M7O0FBRUFmLE1BQUlLLEVBQUosQ0FBTytDLGtCQUFQLENBQTBCeEMsSUFBMUIsQ0FBZ0MsUUFBaEMsRUFBMkM2RixLQUEzQyxHQUFtRG5CLEtBQW5EO0FBQ0EsRUFURDs7QUFXQTtBQUNBdEYsS0FBSWtILGNBQUosR0FBcUIsWUFBVztBQUMvQmxILE1BQUlLLEVBQUosQ0FBTytDLGtCQUFQLENBQTBCakIsV0FBMUIsQ0FBdUMsWUFBdkM7QUFDQW5DLE1BQUlLLEVBQUosQ0FBTzJHLGFBQVAsQ0FBcUI3RSxXQUFyQixDQUFrQyxZQUFsQztBQUNBbkMsTUFBSUssRUFBSixDQUFPNEcsZUFBUCxDQUF1QjlFLFdBQXZCLENBQW9DLFlBQXBDOztBQUVBbkMsTUFBSUssRUFBSixDQUFPMkcsYUFBUCxDQUFxQmpHLElBQXJCLENBQTJCLGVBQTNCLEVBQTRDLEtBQTVDO0FBQ0FmLE1BQUlLLEVBQUosQ0FBTytDLGtCQUFQLENBQTBCckMsSUFBMUIsQ0FBZ0MsYUFBaEMsRUFBK0MsSUFBL0M7O0FBRUFmLE1BQUlLLEVBQUosQ0FBTzJHLGFBQVAsQ0FBcUIxQixLQUFyQjtBQUNBLEVBVEQ7O0FBV0E7QUFDQXRGLEtBQUlpRixXQUFKLEdBQWtCLFVBQVUvRCxLQUFWLEVBQWtCO0FBQ25DLE1BQUssT0FBT0EsTUFBTXlFLE9BQWxCLEVBQTRCO0FBQzNCM0YsT0FBSWtILGNBQUo7QUFDQTtBQUNELEVBSkQ7O0FBTUE7QUFDQW5ILEdBQUdDLElBQUlDLElBQVA7QUFFQSxDQWhGRCxFQWdGSUosTUFoRkosRUFnRlkrQyxNQWhGWixFQWdGb0IvQyxPQUFPaUgsWUFoRjNCOzs7QUNOQTs7Ozs7OztBQU9BLENBQUUsWUFBVztBQUNaLEtBQUlPLFdBQVcsQ0FBQyxDQUFELEdBQUtDLFVBQVVDLFNBQVYsQ0FBb0JDLFdBQXBCLEdBQWtDQyxPQUFsQyxDQUEyQyxRQUEzQyxDQUFwQjtBQUFBLEtBQ0NDLFVBQVUsQ0FBQyxDQUFELEdBQUtKLFVBQVVDLFNBQVYsQ0FBb0JDLFdBQXBCLEdBQWtDQyxPQUFsQyxDQUEyQyxPQUEzQyxDQURoQjtBQUFBLEtBRUNFLE9BQU8sQ0FBQyxDQUFELEdBQUtMLFVBQVVDLFNBQVYsQ0FBb0JDLFdBQXBCLEdBQWtDQyxPQUFsQyxDQUEyQyxNQUEzQyxDQUZiOztBQUlBLEtBQUssQ0FBRUosWUFBWUssT0FBWixJQUF1QkMsSUFBekIsS0FBbUM5RSxTQUFTK0UsY0FBNUMsSUFBOEQvSCxPQUFPZ0ksZ0JBQTFFLEVBQTZGO0FBQzVGaEksU0FBT2dJLGdCQUFQLENBQXlCLFlBQXpCLEVBQXVDLFlBQVc7QUFDakQsT0FBSUMsS0FBS0MsU0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXlCLENBQXpCLENBQVQ7QUFBQSxPQUNDbkcsT0FERDs7QUFHQSxPQUFLLENBQUksZUFBRixDQUFvQm9HLElBQXBCLENBQTBCSixFQUExQixDQUFQLEVBQXdDO0FBQ3ZDO0FBQ0E7O0FBRURoRyxhQUFVZSxTQUFTK0UsY0FBVCxDQUF5QkUsRUFBekIsQ0FBVjs7QUFFQSxPQUFLaEcsT0FBTCxFQUFlO0FBQ2QsUUFBSyxDQUFJLHVDQUFGLENBQTRDb0csSUFBNUMsQ0FBa0RwRyxRQUFRcUcsT0FBMUQsQ0FBUCxFQUE2RTtBQUM1RXJHLGFBQVFzRyxRQUFSLEdBQW1CLENBQUMsQ0FBcEI7QUFDQTs7QUFFRHRHLFlBQVF3RCxLQUFSO0FBQ0E7QUFDRCxHQWpCRCxFQWlCRyxLQWpCSDtBQWtCQTtBQUNELENBekJEOzs7QUNQQTs7Ozs7QUFLQXpGLE9BQU93SSxjQUFQLEdBQXdCLEVBQXhCO0FBQ0EsQ0FBRSxVQUFVeEksTUFBVixFQUFrQkUsQ0FBbEIsRUFBcUJDLEdBQXJCLEVBQTJCOztBQUU1QjtBQUNBQSxLQUFJQyxJQUFKLEdBQVcsWUFBVztBQUNyQkQsTUFBSUUsS0FBSjtBQUNBRixNQUFJSSxVQUFKO0FBQ0EsRUFIRDs7QUFLQTtBQUNBSixLQUFJRSxLQUFKLEdBQVksWUFBVztBQUN0QkYsTUFBSUssRUFBSixHQUFTO0FBQ1IsYUFBVU4sRUFBR0YsTUFBSCxDQURGO0FBRVIsV0FBUUUsRUFBRzhDLFNBQVNDLElBQVo7QUFGQSxHQUFUO0FBSUEsRUFMRDs7QUFPQTtBQUNBOUMsS0FBSUksVUFBSixHQUFpQixZQUFXO0FBQzNCSixNQUFJSyxFQUFKLENBQU9SLE1BQVAsQ0FBY3lJLElBQWQsQ0FBb0J0SSxJQUFJdUksWUFBeEI7QUFDQSxFQUZEOztBQUlBO0FBQ0F2SSxLQUFJdUksWUFBSixHQUFtQixZQUFXO0FBQzdCdkksTUFBSUssRUFBSixDQUFPeUMsSUFBUCxDQUFZOUIsUUFBWixDQUFzQixPQUF0QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQWpCLEdBQUdDLElBQUlDLElBQVA7QUFDQSxDQTVCRCxFQTRCSUosTUE1QkosRUE0QlkrQyxNQTVCWixFQTRCb0IvQyxPQUFPd0ksY0E1QjNCIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZSBhIGNhcm91c2VsIGlmIHdlIGhhdmUgbW9yZSB0aGFuIG9uZSBoZXJvIHNsaWRlLlxuICovXG53aW5kb3cuSGVyb19DYXJvdXNlbCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cbiAgICAvLyBDb25zdHJ1Y3Rvci5cbiAgICBhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBhcHAuY2FjaGUoKTtcblxuICAgICAgICBpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuICAgICAgICAgICAgYXBwLmJpbmRFdmVudHMoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cbiAgICBhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgYXBwLiRjID0ge1xuICAgICAgICAgICAgd2luZG93OiAkKCB3aW5kb3cgKSxcbiAgICAgICAgICAgIGhlcm9DYXJvdXNlbDogJCggJy5jYXJvdXNlbCcgKVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBDb21iaW5lIGFsbCBldmVudHMuXG4gICAgYXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgYXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuZG9TbGljayApO1xuICAgICAgICBhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5kb0ZpcnN0QW5pbWF0aW9uICk7XG5cbiAgICB9O1xuXG4gICAgLy8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuICAgIGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYXBwLiRjLmhlcm9DYXJvdXNlbC5sZW5ndGg7XG4gICAgfTtcblxuICAgIC8vIEFuaW1hdGUgdGhlIGZpcnN0IHNsaWRlIG9uIHdpbmRvdyBsb2FkLlxuICAgIGFwcC5kb0ZpcnN0QW5pbWF0aW9uID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBmaXJzdCBzbGlkZSBjb250ZW50IGFyZWEgYW5kIGFuaW1hdGlvbiBhdHRyaWJ1dGUuXG4gICAgICAgIGxldCBmaXJzdFNsaWRlID0gYXBwLiRjLmhlcm9DYXJvdXNlbC5maW5kKCAnW2RhdGEtc2xpY2staW5kZXg9MF0nICksXG4gICAgICAgICAgICBmaXJzdFNsaWRlQ29udGVudCA9IGZpcnN0U2xpZGUuZmluZCggJy5oZXJvLWNvbnRlbnQnICksXG4gICAgICAgICAgICBmaXJzdEFuaW1hdGlvbiA9IGZpcnN0U2xpZGVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKTtcblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBhbmltYXRpb24gY2xhc3MgdG8gdGhlIGZpcnN0IHNsaWRlLlxuICAgICAgICAgICAgZmlyc3RTbGlkZUNvbnRlbnQuYWRkQ2xhc3MoIGZpcnN0QW5pbWF0aW9uICk7XG4gICAgfTtcblxuICAgIC8vIEFuaW1hdGUgdGhlIHNsaWRlIGNvbnRlbnQuXG4gICAgYXBwLmRvQW5pbWF0aW9uID0gZnVuY3Rpb24oIGV2ZW50LCBzbGljayApIHtcblxuICAgICAgICBsZXQgc2xpZGVzID0gJCggJy5zbGlkZScgKSxcbiAgICAgICAgICAgIGFjdGl2ZVNsaWRlID0gJCggJy5zbGljay1jdXJyZW50JyApLFxuXHRcdFx0YWN0aXZlQ29udGVudCA9IGFjdGl2ZVNsaWRlLmZpbmQoICcuaGVyby1jb250ZW50JyApLFxuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGEgc3RyaW5nIGxpa2Ugc286ICdhbmltYXRlZCBzb21lQ3NzQ2xhc3MnLlxuXHRcdFx0YW5pbWF0aW9uQ2xhc3MgPSBhY3RpdmVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKSxcbiAgICAgICAgICAgIHNwbGl0QW5pbWF0aW9uID0gYW5pbWF0aW9uQ2xhc3Muc3BsaXQoICcgJyApLFxuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSAnYW5pbWF0ZWQnIGNsYXNzLlxuICAgICAgICAgICAgYW5pbWF0aW9uVHJpZ2dlciA9IHNwbGl0QW5pbWF0aW9uWzBdLFxuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBhbmltYXRlLmNzcyBjbGFzcy5cbiAgICAgICAgICAgIGFuaW1hdGVDc3MgPSBzcGxpdEFuaW1hdGlvblsxXTtcblxuICAgICAgICAgICAgLy8gR28gdGhyb3VnaCBlYWNoIHNsaWRlIHRvIHNlZSBpZiB3ZSd2ZSBhbHJlYWR5IHNldCBhbmltYXRpb24gY2xhc3Nlcy5cbiAgICAgICAgICAgIHNsaWRlcy5lYWNoKCBmdW5jdGlvbiggaW5kZXgsIGVsZW1lbnQgKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2xpZGVDb250ZW50ID0gJCggdGhpcyApLmZpbmQoICcuaGVyby1jb250ZW50JyApO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UndmUgc2V0IGFuaW1hdGlvbiBjbGFzc2VzIG9uIGEgc2xpZGUsIHJlbW92ZSB0aGVtLlxuICAgICAgICAgICAgICAgIGlmICggc2xpZGVDb250ZW50Lmhhc0NsYXNzKCAnYW5pbWF0ZWQnICkgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBsYXN0IGNsYXNzLCB3aGljaCBpcyB0aGUgYW5pbWF0ZS5jc3MgY2xhc3MuXG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0Q2xhc3MgPSBzbGlkZUNvbnRlbnQuYXR0ciggJ2NsYXNzJyApLnNwbGl0KCAnICcgKS5wb3AoICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGJvdGggYW5pbWF0aW9uIGNsYXNzZXMuXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlQ29udGVudC5yZW1vdmVDbGFzcyggbGFzdENsYXNzICkucmVtb3ZlQ2xhc3MoIGFuaW1hdGlvblRyaWdnZXIgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQWRkIGFuaW1hdGlvbiBjbGFzc2VzIGFmdGVyIHNsaWRlIGlzIGluIHZpZXcuXG4gICAgICAgICAgICBhY3RpdmVDb250ZW50LmFkZENsYXNzKCBhbmltYXRpb25DbGFzcyApO1xuICAgIH07XG5cbiAgICAvLyBBbGxvdyBiYWNrZ3JvdW5kIHZpZGVvcyB0byBhdXRvcGxheS5cblx0YXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gR2V0IGFsbCB0aGUgdmlkZW9zIGluIG91ciBzbGlkZXMgb2JqZWN0LlxuXHRcdCQoICd2aWRlbycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgLy8gTGV0IHRoZW0gYXV0b3BsYXkuIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0aGlzIGxhdGVyIHRvIG9ubHkgcGxheSB0aGUgdmlzaWJsZSBzbGlkZSB2aWRlby5cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH0pO1xuXHR9O1xuXG4gICAgLy8gS2ljayBvZmYgU2xpY2suXG4gICAgYXBwLmRvU2xpY2sgPSBmdW5jdGlvbigpIHtcblxuXHRcdGFwcC4kYy5oZXJvQ2Fyb3VzZWwub24oICdpbml0JywgYXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zICk7XG5cbiAgICAgICAgYXBwLiRjLmhlcm9DYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICBhdXRvcGxheTogdHJ1ZSxcblx0XHRcdGF1dG9wbGF5U3BlZWQ6IDUwMDAsXG4gICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgZG90czogZmFsc2UsXG5cdFx0XHRmb2N1c09uU2VsZWN0OiB0cnVlLFxuICAgICAgICAgICAgd2FpdEZvckFuaW1hdGU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXBwLiRjLmhlcm9DYXJvdXNlbC5vbiggJ2FmdGVyQ2hhbmdlJywgYXBwLmRvQW5pbWF0aW9uICk7XG5cbiAgICB9O1xuXG4gICAgLy8gRW5nYWdlIVxuICAgICQoIGFwcC5pbml0ICk7XG5cbn0pKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lkhlcm9fQ2Fyb3VzZWwgKTtcbiIsIi8qKlxuICogRmlsZSBqcy1lbmFibGVkLmpzXG4gKlxuICogSWYgSmF2YXNjcmlwdCBpcyBlbmFibGVkLCByZXBsYWNlIHRoZSA8Ym9keT4gY2xhc3MgXCJuby1qc1wiLlxuICovXG5kb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoICduby1qcycsICdqcycgKTtcbiIsIi8qKlxuICogRmlsZTogbW9iaWxlLW1lbnUuanNcbiAqXG4gKiBDcmVhdGUgYW4gYWNjb3JkaW9uIHN0eWxlIGRyb3Bkb3duLlxuICovXG53aW5kb3cud2RzTW9iaWxlTWVudSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1vYmlsZS1tZW51IC5zdWItbWVudScgKSxcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1vYmlsZS1tZW51IGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICksXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICdjbGljaycsIGFwcC50b2dnbGVTdWJtZW51ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5yZXNldFN1Yk1lbnUgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLm9uKCAndHJhbnNpdGlvbmVuZCcsIGFwcC5mb3JjZUNsb3NlU3VibWVudXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gUmVzZXQgdGhlIHN1Ym1lbnVzIGFmdGVyIGl0J3MgZG9uZSBjbG9zaW5nLlxuXHRhcHAucmVzZXRTdWJNZW51ID0gZnVuY3Rpb24oIGUgKSB7XG5cdFx0Y29uc3QgJHRhcmdldCA9ICQoIGUudGFyZ2V0ICk7XG5cblx0XHQvLyBXaGVuIHRoZSBsaXN0IGl0ZW0gaXMgZG9uZSB0cmFuc2l0aW9uaW5nIGluIGhlaWdodCxcblx0XHQvLyByZW1vdmUgdGhlIGNsYXNzZXMgZnJvbSB0aGUgc3VibWVudSBzbyBpdCBpcyByZWFkeSB0byB0b2dnbGUgYWdhaW4uXG5cdFx0aWYgKCAkdGFyZ2V0LmlzKCAnbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKSAmJiAhICR0YXJnZXQuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0JHRhcmdldC5maW5kKCAndWwuc3ViLW1lbnUnICkucmVtb3ZlQ2xhc3MoICdzbGlkZU91dExlZnQgaXMtdmlzaWJsZScgKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBTbGlkZSBvdXQgdGhlIHN1Ym1lbnUgaXRlbXMuXG5cdGFwcC5zbGlkZU91dFN1Yk1lbnVzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLnN1Yk1lbnVDb250YWluZXIuZWFjaCggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIE9ubHkgdHJ5IHRvIGNsb3NlIHN1Ym1lbnVzIHRoYXQgYXJlIGFjdHVhbGx5IG9wZW4uXG5cdFx0XHRpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ3NsaWRlSW5MZWZ0JyApICkge1xuXG5cdFx0XHRcdC8vIENsb3NlIHRoZSBwYXJlbnQgbGlzdCBpdGVtLCBhbmQgc2V0IHRoZSBjb3JyZXNwb25kaW5nIGJ1dHRvbiBhcmlhIHRvIGZhbHNlLlxuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gU2xpZGUgb3V0IHRoZSBzdWJtZW51LlxuXHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlQ2xhc3MoICdzbGlkZUluTGVmdCcgKS5hZGRDbGFzcyggJ3NsaWRlT3V0TGVmdCcgKTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ucHJlcGVuZCggJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGNsYXNzPVwicGFyZW50LWluZGljYXRvclwiIGFyaWEtbGFiZWw9XCJPcGVuIHN1Ym1lbnVcIj48c3BhbiBjbGFzcz1cImRvd24tYXJyb3dcIj48L3NwYW4+PC9idXR0b24+JyApO1xuXHR9O1xuXG5cdC8vIERlYWwgd2l0aCB0aGUgc3VibWVudS5cblx0YXBwLnRvZ2dsZVN1Ym1lbnUgPSBmdW5jdGlvbiggZSApIHtcblxuXHRcdGxldCBlbCA9ICQoIHRoaXMgKSwgLy8gVGhlIG1lbnUgZWxlbWVudCB3aGljaCB3YXMgY2xpY2tlZCBvbi5cblx0XHRcdHN1Yk1lbnUgPSBlbC5jaGlsZHJlbiggJ3VsLnN1Yi1tZW51JyApLCAvLyBUaGUgbmVhcmVzdCBzdWJtZW51LlxuXHRcdFx0JHRhcmdldCA9ICQoIGUudGFyZ2V0ICk7IC8vIHRoZSBlbGVtZW50IHRoYXQncyBhY3R1YWxseSBiZWluZyBjbGlja2VkIChjaGlsZCBvZiB0aGUgbGkgdGhhdCB0cmlnZ2VyZWQgdGhlIGNsaWNrIGV2ZW50KS5cblxuXHRcdC8vIEZpZ3VyZSBvdXQgaWYgd2UncmUgY2xpY2tpbmcgdGhlIGJ1dHRvbiBvciBpdHMgYXJyb3cgY2hpbGQsXG5cdFx0Ly8gaWYgc28sIHdlIGNhbiBqdXN0IG9wZW4gb3IgY2xvc2UgdGhlIG1lbnUgYW5kIGJhaWwuXG5cdFx0aWYgKCAkdGFyZ2V0Lmhhc0NsYXNzKCAnZG93bi1hcnJvdycgKSB8fCAkdGFyZ2V0Lmhhc0NsYXNzKCAncGFyZW50LWluZGljYXRvcicgKSApIHtcblxuXHRcdFx0Ly8gRmlyc3QsIGNvbGxhcHNlIGFueSBhbHJlYWR5IG9wZW5lZCBzdWJtZW51cy5cblx0XHRcdGFwcC5zbGlkZU91dFN1Yk1lbnVzKCk7XG5cblx0XHRcdGlmICggISBzdWJNZW51Lmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblxuXHRcdFx0XHQvLyBPcGVuIHRoZSBzdWJtZW51LlxuXHRcdFx0XHRhcHAub3BlblN1Ym1lbnUoIGVsLCBzdWJNZW51ICk7XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIE9wZW4gYSBzdWJtZW51LlxuXHRhcHAub3BlblN1Ym1lbnUgPSBmdW5jdGlvbiggcGFyZW50LCBzdWJNZW51ICkge1xuXG5cdFx0Ly8gRXhwYW5kIHRoZSBsaXN0IG1lbnUgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byB0cnVlLlxuXHRcdHBhcmVudC5hZGRDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXG5cdFx0Ly8gU2xpZGUgdGhlIG1lbnUgaW4uXG5cdFx0c3ViTWVudS5hZGRDbGFzcyggJ2lzLXZpc2libGUgYW5pbWF0ZWQgc2xpZGVJbkxlZnQnICk7XG5cblx0fTtcblxuXHQvLyBGb3JjZSBjbG9zZSBhbGwgdGhlIHN1Ym1lbnVzIHdoZW4gdGhlIG1haW4gbWVudSBjb250YWluZXIgaXMgY2xvc2VkLlxuXHRhcHAuZm9yY2VDbG9zZVN1Ym1lbnVzID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBUaGUgdHJhbnNpdGlvbmVuZCBldmVudCB0cmlnZ2VycyBvbiBvcGVuIGFuZCBvbiBjbG9zZSwgbmVlZCB0byBtYWtlIHN1cmUgd2Ugb25seSBkbyB0aGlzIG9uIGNsb3NlLlxuXHRcdGlmICggISAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdFx0YXBwLiRjLnN1Yk1lbnVDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlIHNsaWRlSW5MZWZ0JyApO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSkoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzTW9iaWxlTWVudSApO1xuIiwiLyoqXG4gKiBGaWxlIG1vZGFsLmpzXG4gKlxuICogRGVhbCB3aXRoIG11bHRpcGxlIG1vZGFscyBhbmQgdGhlaXIgbWVkaWEuXG4gKi9cbndpbmRvdy53ZHNNb2RhbCA9IHt9O1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHRsZXQgJG1vZGFsVG9nZ2xlLFxuXHRcdCRmb2N1c2FibGVDaGlsZHJlbixcblx0XHQkcGxheWVyLFxuXHRcdCR0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc2NyaXB0JyApLFxuXHRcdCRmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnc2NyaXB0JyApWzBdLFxuXHRcdFlUO1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdCRmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggJHRhZywgJGZpcnN0U2NyaXB0VGFnICk7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J2JvZHknOiAkKCAnYm9keScgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJCggJy5tb2RhbC10cmlnZ2VyJyApLmxlbmd0aDtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBUcmlnZ2VyIGEgbW9kYWwgdG8gb3Blbi5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLm1vZGFsLXRyaWdnZXInLCBhcHAub3Blbk1vZGFsICk7XG5cblx0XHQvLyBUcmlnZ2VyIHRoZSBjbG9zZSBidXR0b24gdG8gY2xvc2UgdGhlIG1vZGFsLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICcuY2xvc2UnLCBhcHAuY2xvc2VNb2RhbCApO1xuXG5cdFx0Ly8gQWxsb3cgdGhlIHVzZXIgdG8gY2xvc2UgdGhlIG1vZGFsIGJ5IGhpdHRpbmcgdGhlIGVzYyBrZXkuXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLmVzY0tleUNsb3NlICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgY2xpY2tpbmcgb3V0c2lkZSBvZiB0aGUgbW9kYWwuXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJ2Rpdi5tb2RhbC1vcGVuJywgYXBwLmNsb3NlTW9kYWxCeUNsaWNrICk7XG5cblx0XHQvLyBMaXN0ZW4gdG8gdGFicywgdHJhcCBrZXlib2FyZCBpZiB3ZSBuZWVkIHRvXG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLnRyYXBLZXlib2FyZE1heWJlICk7XG5cblx0fTtcblxuXHQvLyBPcGVuIHRoZSBtb2RhbC5cblx0YXBwLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gU3RvcmUgdGhlIG1vZGFsIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlID0gJCggdGhpcyApO1xuXG5cdFx0Ly8gRmlndXJlIG91dCB3aGljaCBtb2RhbCB3ZSdyZSBvcGVuaW5nIGFuZCBzdG9yZSB0aGUgb2JqZWN0LlxuXHRcdGxldCAkbW9kYWwgPSAkKCAkKCB0aGlzICkuZGF0YSggJ3RhcmdldCcgKSApO1xuXG5cdFx0Ly8gRGlzcGxheSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEFkZCBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LmFkZENsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIEZpbmQgdGhlIGZvY3VzYWJsZSBjaGlsZHJlbiBvZiB0aGUgbW9kYWwuXG5cdFx0Ly8gVGhpcyBsaXN0IG1heSBiZSBpbmNvbXBsZXRlLCByZWFsbHkgd2lzaCBqUXVlcnkgaGFkIHRoZSA6Zm9jdXNhYmxlIHBzZXVkbyBsaWtlIGpRdWVyeSBVSSBkb2VzLlxuXHRcdC8vIEZvciBtb3JlIGFib3V0IDppbnB1dCBzZWU6IGh0dHBzOi8vYXBpLmpxdWVyeS5jb20vaW5wdXQtc2VsZWN0b3IvXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuID0gJG1vZGFsLmZpbmQoICdhLCA6aW5wdXQsIFt0YWJpbmRleF0nICk7XG5cblx0XHQvLyBJZGVhbGx5LCB0aGVyZSBpcyBhbHdheXMgb25lICh0aGUgY2xvc2UgYnV0dG9uKSwgYnV0IHlvdSBuZXZlciBrbm93LlxuXHRcdGlmICggMCA8ICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggKSB7XG5cblx0XHRcdC8vIFNoaWZ0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIENsb3NlIHRoZSBtb2RhbC5cblx0YXBwLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEZpZ3VyZSB0aGUgb3BlbmVkIG1vZGFsIHdlJ3JlIGNsb3NpbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoICdkaXYubW9kYWwtb3BlbiAuY2xvc2UnICkuZGF0YSggJ3RhcmdldCcgKSApLFxuXG5cdFx0XHQvLyBGaW5kIHRoZSBpZnJhbWUgaW4gdGhlICRtb2RhbCBvYmplY3QuXG5cdFx0XHQkaWZyYW1lID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICk7XG5cblx0XHQvLyBPbmx5IGRvIHRoaXMgaWYgdGhlcmUgYXJlIGFueSBpZnJhbWVzLlxuXHRcdGlmICggJGlmcmFtZS5sZW5ndGggKSB7XG5cblx0XHRcdC8vIEdldCB0aGUgaWZyYW1lIHNyYyBVUkwuXG5cdFx0XHRsZXQgdXJsID0gJGlmcmFtZS5hdHRyKCAnc3JjJyApO1xuXG5cdFx0XHQvLyBSZW1vdmluZy9SZWFkZGluZyB0aGUgVVJMIHdpbGwgZWZmZWN0aXZlbHkgYnJlYWsgdGhlIFlvdVR1YmUgQVBJLlxuXHRcdFx0Ly8gU28gbGV0J3Mgbm90IGRvIHRoYXQgd2hlbiB0aGUgaWZyYW1lIFVSTCBjb250YWlucyB0aGUgZW5hYmxlanNhcGkgcGFyYW1ldGVyLlxuXHRcdFx0aWYgKCAhIHVybC5pbmNsdWRlcyggJ2VuYWJsZWpzYXBpPTEnICkgKSB7XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBzb3VyY2UgVVJMLCB0aGVuIGFkZCBpdCBiYWNrLCBzbyB0aGUgdmlkZW8gY2FuIGJlIHBsYXllZCBhZ2FpbiBsYXRlci5cblx0XHRcdFx0JGlmcmFtZS5hdHRyKCAnc3JjJywgJycgKS5hdHRyKCAnc3JjJywgdXJsICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFVzZSB0aGUgWW91VHViZSBBUEkgdG8gc3RvcCB0aGUgdmlkZW8uXG5cdFx0XHRcdCRwbGF5ZXIuc3RvcFZpZGVvKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRmluYWxseSwgaGlkZSB0aGUgbW9kYWwuXG5cdFx0JG1vZGFsLnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgYm9keSBjbGFzcy5cblx0XHRhcHAuJGMuYm9keS5yZW1vdmVDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBSZXZlcnQgZm9jdXMgYmFjayB0byB0b2dnbGUgZWxlbWVudFxuXHRcdCRtb2RhbFRvZ2dsZS5mb2N1cygpO1xuXG5cdH07XG5cblx0Ly8gQ2xvc2UgaWYgXCJlc2NcIiBrZXkgaXMgcHJlc3NlZC5cblx0YXBwLmVzY0tleUNsb3NlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggMjcgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRhcHAuY2xvc2VNb2RhbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDbG9zZSBpZiB0aGUgdXNlciBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgbW9kYWxcblx0YXBwLmNsb3NlTW9kYWxCeUNsaWNrID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gSWYgdGhlIHBhcmVudCBjb250YWluZXIgaXMgTk9UIHRoZSBtb2RhbCBkaWFsb2cgY29udGFpbmVyLCBjbG9zZSB0aGUgbW9kYWxcblx0XHRpZiAoICEgJCggZXZlbnQudGFyZ2V0ICkucGFyZW50cyggJ2RpdicgKS5oYXNDbGFzcyggJ21vZGFsLWRpYWxvZycgKSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIFRyYXAgdGhlIGtleWJvYXJkIGludG8gYSBtb2RhbCB3aGVuIG9uZSBpcyBhY3RpdmUuXG5cdGFwcC50cmFwS2V5Ym9hcmRNYXliZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIFdlIG9ubHkgbmVlZCB0byBkbyBzdHVmZiB3aGVuIHRoZSBtb2RhbCBpcyBvcGVuIGFuZCB0YWIgaXMgcHJlc3NlZC5cblx0XHRpZiAoIDkgPT09IGV2ZW50LndoaWNoICYmIDAgPCAkKCAnLm1vZGFsLW9wZW4nICkubGVuZ3RoICkge1xuXHRcdFx0bGV0ICRmb2N1c2VkID0gJCggJzpmb2N1cycgKSxcblx0XHRcdFx0Zm9jdXNJbmRleCA9ICRmb2N1c2FibGVDaGlsZHJlbi5pbmRleCggJGZvY3VzZWQgKTtcblxuXHRcdFx0aWYgKCAwID09PSBmb2N1c0luZGV4ICYmIGV2ZW50LnNoaWZ0S2V5ICkge1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgaGVsZCB3aGVuIHByZXNzaW5nIHRhYiwgZ28gYmFjayB0byBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxIF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZXZlbnQuc2hpZnRLZXkgJiYgZm9jdXNJbmRleCA9PT0gJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgbGFzdCBmb2N1c2FibGUgZWxlbWVudCwgYW5kIHNoaWZ0IGlzIG5vdCBoZWxkLCBnbyBiYWNrIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEhvb2sgaW50byBZb3VUdWJlIDxpZnJhbWU+LlxuXHRhcHAub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgJG1vZGFsID0gJCggJ2Rpdi5tb2RhbCcgKSxcblx0XHRcdCRpZnJhbWVpZCA9ICRtb2RhbC5maW5kKCAnaWZyYW1lJyApLmF0dHIoICdpZCcgKTtcblxuXHRcdCRwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCAkaWZyYW1laWQsIHtcblx0XHRcdGV2ZW50czoge1xuXHRcdFx0XHQnb25SZWFkeSc6IGFwcC5vblBsYXllclJlYWR5LFxuXHRcdFx0XHQnb25TdGF0ZUNoYW5nZSc6IGFwcC5vblBsYXllclN0YXRlQ2hhbmdlXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciByZWFkeS5cblx0YXBwLm9uUGxheWVyUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0fTtcblxuXHQvLyBEbyBzb21ldGhpbmcgb24gcGxheWVyIHN0YXRlIGNoYW5nZS5cblx0YXBwLm9uUGxheWVyU3RhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFNldCBmb2N1cyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgaW5zaWRlIG9mIHRoZSBtb2RhbCB0aGUgcGxheWVyIGlzIGluLlxuXHRcdCQoIGV2ZW50LnRhcmdldC5hICkucGFyZW50cyggJy5tb2RhbCcgKS5maW5kKCAnYSwgOmlucHV0LCBbdGFiaW5kZXhdJyApLmZpcnN0KCkuZm9jdXMoKTtcblx0fTtcblxuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0pKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc01vZGFsICk7XG4iLCIvKipcbiAqIEZpbGU6IG5hdmlnYXRpb24tcHJpbWFyeS5qc1xuICpcbiAqIEhlbHBlcnMgZm9yIHRoZSBwcmltYXJ5IG5hdmlnYXRpb24uXG4gKi9cbndpbmRvdy53ZHNQcmltYXJ5TmF2aWdhdGlvbiA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1haW4tbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tYWluLW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnYScgKS5vbiggJ2ZvY3VzaW4gZm9jdXNvdXQnLCBhcHAudG9nZ2xlRm9jdXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnPiBhJyApLmFwcGVuZCggJzxzcGFuIGNsYXNzPVwiY2FyZXQtZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nICk7XG5cdH07XG5cblx0Ly8gVG9nZ2xlIHRoZSBmb2N1cyBjbGFzcyBvbiB0aGUgbGluayBwYXJlbnQuXG5cdGFwcC50b2dnbGVGb2N1cyA9IGZ1bmN0aW9uKCkge1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKS50b2dnbGVDbGFzcyggJ2ZvY3VzJyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSkoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gKTtcbiIsIi8qKlxuICogRmlsZTogb2ZmLWNhbnZhcy5qc1xuICpcbiAqIEhlbHAgZGVhbCB3aXRoIHRoZSBvZmYtY2FudmFzIG1vYmlsZSBtZW51LlxuICovXG53aW5kb3cud2Rzb2ZmQ2FudmFzID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0Ym9keTogJCggJ2JvZHknICksXG5cdFx0XHRvZmZDYW52YXNDbG9zZTogJCggJy5vZmYtY2FudmFzLWNsb3NlJyApLFxuXHRcdFx0b2ZmQ2FudmFzQ29udGFpbmVyOiAkKCAnLm9mZi1jYW52YXMtY29udGFpbmVyJyApLFxuXHRcdFx0b2ZmQ2FudmFzT3BlbjogJCggJy5vZmYtY2FudmFzLW9wZW4nICksXG5cdFx0XHRvZmZDYW52YXNTY3JlZW46ICQoICcub2ZmLWNhbnZhcy1zY3JlZW4nIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ2xvc2Uub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLm9uKCAnY2xpY2snLCBhcHAudG9nZ2xlb2ZmQ2FudmFzICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gVG8gc2hvdyBvciBub3QgdG8gc2hvdz9cblx0YXBwLnRvZ2dsZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCAndHJ1ZScgPT09ICQoIHRoaXMgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSApIHtcblx0XHRcdGFwcC5jbG9zZW9mZkNhbnZhcygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhcHAub3Blbm9mZkNhbnZhcygpO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIFNob3cgdGhhdCBkcmF3ZXIhXG5cdGFwcC5vcGVub2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4uYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5hdHRyKCAnYXJpYS1oaWRkZW4nLCBmYWxzZSApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5maW5kKCAnYnV0dG9uJyApLmZpcnN0KCkuZm9jdXMoKTtcblx0fTtcblxuXHQvLyBDbG9zZSB0aGF0IGRyYXdlciFcblx0YXBwLmNsb3Nlb2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYXR0ciggJ2FyaWEtaGlkZGVuJywgdHJ1ZSApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uZm9jdXMoKTtcblx0fTtcblxuXHQvLyBDbG9zZSBkcmF3ZXIgaWYgXCJlc2NcIiBrZXkgaXMgcHJlc3NlZC5cblx0YXBwLmVzY0tleUNsb3NlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggMjcgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRhcHAuY2xvc2VvZmZDYW52YXMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNvZmZDYW52YXMgKTtcbiIsIi8qKlxuICogRmlsZSBza2lwLWxpbmstZm9jdXMtZml4LmpzLlxuICpcbiAqIEhlbHBzIHdpdGggYWNjZXNzaWJpbGl0eSBmb3Iga2V5Ym9hcmQgb25seSB1c2Vycy5cbiAqXG4gKiBMZWFybiBtb3JlOiBodHRwczovL2dpdC5pby92V2RyMlxuICovXG4oIGZ1bmN0aW9uKCkge1xuXHR2YXIgaXNXZWJraXQgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnd2Via2l0JyApLFxuXHRcdGlzT3BlcmEgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnb3BlcmEnICksXG5cdFx0aXNJZSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdtc2llJyApO1xuXG5cdGlmICggKCBpc1dlYmtpdCB8fCBpc09wZXJhIHx8IGlzSWUgKSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBpZCA9IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKCAxICksXG5cdFx0XHRcdGVsZW1lbnQ7XG5cblx0XHRcdGlmICggISAoIC9eW0EtejAtOV8tXSskLyApLnRlc3QoIGlkICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGlmICggISAoIC9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaSApLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSApO1xuXHR9XG59KSgpO1xuIiwiLyoqXG4gKiBGaWxlIHdpbmRvdy1yZWFkeS5qc1xuICpcbiAqIEFkZCBhIFwicmVhZHlcIiBjbGFzcyB0byA8Ym9keT4gd2hlbiB3aW5kb3cgaXMgcmVhZHkuXG4gKi9cbndpbmRvdy53ZHNXaW5kb3dSZWFkeSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0fTtcblxuXHQvLyBDYWNoZSBkb2N1bWVudCBlbGVtZW50cy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J3dpbmRvdyc6ICQoIHdpbmRvdyApLFxuXHRcdFx0J2JvZHknOiAkKCBkb2N1bWVudC5ib2R5IClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93LmxvYWQoIGFwcC5hZGRCb2R5Q2xhc3MgKTtcblx0fTtcblxuXHQvLyBBZGQgYSBjbGFzcyB0byA8Ym9keT4uXG5cdGFwcC5hZGRCb2R5Q2xhc3MgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5hZGRDbGFzcyggJ3JlYWR5JyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0pKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1dpbmRvd1JlYWR5ICk7XG4iXX0=
