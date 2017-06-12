'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function ($) {

  "use strict";

  var FOUNDATION_VERSION = '6.3.1';

  // Global Foundation object
  // This is attached to the window, or used as a module for AMD/Browserify
  var Foundation = {
    version: FOUNDATION_VERSION,

    /**
     * Stores initialized plugins.
     */
    _plugins: {},

    /**
     * Stores generated unique ids for plugin instances
     */
    _uuids: [],

    /**
     * Returns a boolean for RTL support
     */
    rtl: function rtl() {
      return $('html').attr('dir') === 'rtl';
    },
    /**
     * Defines a Foundation plugin, adding it to the `Foundation` namespace and the list of plugins to initialize when reflowing.
     * @param {Object} plugin - The constructor of the plugin.
     */
    plugin: function plugin(_plugin, name) {
      // Object key to use when adding to global Foundation object
      // Examples: Foundation.Reveal, Foundation.OffCanvas
      var className = name || functionName(_plugin);
      // Object key to use when storing the plugin, also used to create the identifying data attribute for the plugin
      // Examples: data-reveal, data-off-canvas
      var attrName = hyphenate(className);

      // Add to the Foundation object and the plugins list (for reflowing)
      this._plugins[attrName] = this[className] = _plugin;
    },
    /**
     * @function
     * Populates the _uuids array with pointers to each individual plugin instance.
     * Adds the `zfPlugin` data-attribute to programmatically created plugins to allow use of $(selector).foundation(method) calls.
     * Also fires the initialization event for each plugin, consolidating repetitive code.
     * @param {Object} plugin - an instance of a plugin, usually `this` in context.
     * @param {String} name - the name of the plugin, passed as a camelCased string.
     * @fires Plugin#init
     */
    registerPlugin: function registerPlugin(plugin, name) {
      var pluginName = name ? hyphenate(name) : functionName(plugin.constructor).toLowerCase();
      plugin.uuid = this.GetYoDigits(6, pluginName);

      if (!plugin.$element.attr('data-' + pluginName)) {
        plugin.$element.attr('data-' + pluginName, plugin.uuid);
      }
      if (!plugin.$element.data('zfPlugin')) {
        plugin.$element.data('zfPlugin', plugin);
      }
      /**
       * Fires when the plugin has initialized.
       * @event Plugin#init
       */
      plugin.$element.trigger('init.zf.' + pluginName);

      this._uuids.push(plugin.uuid);

      return;
    },
    /**
     * @function
     * Removes the plugins uuid from the _uuids array.
     * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
     * Also fires the destroyed event for the plugin, consolidating repetitive code.
     * @param {Object} plugin - an instance of a plugin, usually `this` in context.
     * @fires Plugin#destroyed
     */
    unregisterPlugin: function unregisterPlugin(plugin) {
      var pluginName = hyphenate(functionName(plugin.$element.data('zfPlugin').constructor));

      this._uuids.splice(this._uuids.indexOf(plugin.uuid), 1);
      plugin.$element.removeAttr('data-' + pluginName).removeData('zfPlugin'
      /**
       * Fires when the plugin has been destroyed.
       * @event Plugin#destroyed
       */
      ).trigger('destroyed.zf.' + pluginName);
      for (var prop in plugin) {
        plugin[prop] = null; //clean up script to prep for garbage collection.
      }
      return;
    },

    /**
     * @function
     * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
     * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
     * @default If no argument is passed, reflow all currently active plugins.
     */
    reInit: function reInit(plugins) {
      var isJQ = plugins instanceof $;
      try {
        if (isJQ) {
          plugins.each(function () {
            $(this).data('zfPlugin')._init();
          });
        } else {
          var type = typeof plugins === 'undefined' ? 'undefined' : _typeof(plugins),
              _this = this,
              fns = {
            'object': function object(plgs) {
              plgs.forEach(function (p) {
                p = hyphenate(p);
                $('[data-' + p + ']').foundation('_init');
              });
            },
            'string': function string() {
              plugins = hyphenate(plugins);
              $('[data-' + plugins + ']').foundation('_init');
            },
            'undefined': function undefined() {
              this['object'](Object.keys(_this._plugins));
            }
          };
          fns[type](plugins);
        }
      } catch (err) {
        console.error(err);
      } finally {
        return plugins;
      }
    },

    /**
     * returns a random base-36 uid with namespacing
     * @function
     * @param {Number} length - number of random base-36 digits desired. Increase for more random strings.
     * @param {String} namespace - name of plugin to be incorporated in uid, optional.
     * @default {String} '' - if no plugin name is provided, nothing is appended to the uid.
     * @returns {String} - unique id
     */
    GetYoDigits: function GetYoDigits(length, namespace) {
      length = length || 6;
      return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)).toString(36).slice(1) + (namespace ? '-' + namespace : '');
    },
    /**
     * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
     * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
     * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
     */
    reflow: function reflow(elem, plugins) {

      // If plugins is undefined, just grab everything
      if (typeof plugins === 'undefined') {
        plugins = Object.keys(this._plugins);
      }
      // If plugins is a string, convert it to an array with one item
      else if (typeof plugins === 'string') {
          plugins = [plugins];
        }

      var _this = this;

      // Iterate through each plugin
      $.each(plugins, function (i, name) {
        // Get the current plugin
        var plugin = _this._plugins[name];

        // Localize the search to all elements inside elem, as well as elem itself, unless elem === document
        var $elem = $(elem).find('[data-' + name + ']').addBack('[data-' + name + ']');

        // For each plugin found, initialize it
        $elem.each(function () {
          var $el = $(this),
              opts = {};
          // Don't double-dip on plugins
          if ($el.data('zfPlugin')) {
            console.warn("Tried to initialize " + name + " on an element that already has a Foundation plugin.");
            return;
          }

          if ($el.attr('data-options')) {
            var thing = $el.attr('data-options').split(';').forEach(function (e, i) {
              var opt = e.split(':').map(function (el) {
                return el.trim();
              });
              if (opt[0]) opts[opt[0]] = parseValue(opt[1]);
            });
          }
          try {
            $el.data('zfPlugin', new plugin($(this), opts));
          } catch (er) {
            console.error(er);
          } finally {
            return;
          }
        });
      });
    },
    getFnName: functionName,
    transitionend: function transitionend($elem) {
      var transitions = {
        'transition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'otransitionend'
      };
      var elem = document.createElement('div'),
          end;

      for (var t in transitions) {
        if (typeof elem.style[t] !== 'undefined') {
          end = transitions[t];
        }
      }
      if (end) {
        return end;
      } else {
        end = setTimeout(function () {
          $elem.triggerHandler('transitionend', [$elem]);
        }, 1);
        return 'transitionend';
      }
    }
  };

  Foundation.util = {
    /**
     * Function for applying a debounce effect to a function call.
     * @function
     * @param {Function} func - Function to be called at end of timeout.
     * @param {Number} delay - Time in ms to delay the call of `func`.
     * @returns function
     */
    throttle: function throttle(func, delay) {
      var timer = null;

      return function () {
        var context = this,
            args = arguments;

        if (timer === null) {
          timer = setTimeout(function () {
            func.apply(context, args);
            timer = null;
          }, delay);
        }
      };
    }
  };

  // TODO: consider not making this a jQuery function
  // TODO: need way to reflow vs. re-initialize
  /**
   * The Foundation jQuery method.
   * @param {String|Array} method - An action to perform on the current jQuery object.
   */
  var foundation = function foundation(method) {
    var type = typeof method === 'undefined' ? 'undefined' : _typeof(method),
        $meta = $('meta.foundation-mq'),
        $noJS = $('.no-js');

    if (!$meta.length) {
      $('<meta class="foundation-mq">').appendTo(document.head);
    }
    if ($noJS.length) {
      $noJS.removeClass('no-js');
    }

    if (type === 'undefined') {
      //needs to initialize the Foundation object, or an individual plugin.
      Foundation.MediaQuery._init();
      Foundation.reflow(this);
    } else if (type === 'string') {
      //an individual method to invoke on a plugin or group of plugins
      var args = Array.prototype.slice.call(arguments, 1); //collect all the arguments, if necessary
      var plugClass = this.data('zfPlugin'); //determine the class of plugin

      if (plugClass !== undefined && plugClass[method] !== undefined) {
        //make sure both the class and method exist
        if (this.length === 1) {
          //if there's only one, call it directly.
          plugClass[method].apply(plugClass, args);
        } else {
          this.each(function (i, el) {
            //otherwise loop through the jQuery collection and invoke the method on each
            plugClass[method].apply($(el).data('zfPlugin'), args);
          });
        }
      } else {
        //error for no class or no method
        throw new ReferenceError("We're sorry, '" + method + "' is not an available method for " + (plugClass ? functionName(plugClass) : 'this element') + '.');
      }
    } else {
      //error for invalid argument type
      throw new TypeError('We\'re sorry, ' + type + ' is not a valid parameter. You must use a string representing the method you wish to invoke.');
    }
    return this;
  };

  window.Foundation = Foundation;
  $.fn.foundation = foundation;

  // Polyfill for requestAnimationFrame
  (function () {
    if (!Date.now || !window.Date.now) window.Date.now = Date.now = function () {
      return new Date().getTime();
    };

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      var vp = vendors[i];
      window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
      var lastTime = 0;
      window.requestAnimationFrame = function (callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function () {
          callback(lastTime = nextTime);
        }, nextTime - now);
      };
      window.cancelAnimationFrame = clearTimeout;
    }
    /**
     * Polyfill for performance.now, required by rAF
     */
    if (!window.performance || !window.performance.now) {
      window.performance = {
        start: Date.now(),
        now: function now() {
          return Date.now() - this.start;
        }
      };
    }
  })();
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function fNOP() {},
          fBound = function fBound() {
        return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
      };

      if (this.prototype) {
        // native functions don't have a prototype
        fNOP.prototype = this.prototype;
      }
      fBound.prototype = new fNOP();

      return fBound;
    };
  }
  // Polyfill to get the name of a function in IE9
  function functionName(fn) {
    if (Function.prototype.name === undefined) {
      var funcNameRegex = /function\s([^(]{1,})\(/;
      var results = funcNameRegex.exec(fn.toString());
      return results && results.length > 1 ? results[1].trim() : "";
    } else if (fn.prototype === undefined) {
      return fn.constructor.name;
    } else {
      return fn.prototype.constructor.name;
    }
  }
  function parseValue(str) {
    if ('true' === str) return true;else if ('false' === str) return false;else if (!isNaN(str * 1)) return parseFloat(str);
    return str;
  }
  // Convert PascalCase to kebab-case
  // Thank you: http://stackoverflow.com/a/8955580
  function hyphenate(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}(jQuery);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function ($) {

  // Default set of media queries
  var defaultQueries = {
    'default': 'only screen',
    landscape: 'only screen and (orientation: landscape)',
    portrait: 'only screen and (orientation: portrait)',
    retina: 'only screen and (-webkit-min-device-pixel-ratio: 2),' + 'only screen and (min--moz-device-pixel-ratio: 2),' + 'only screen and (-o-min-device-pixel-ratio: 2/1),' + 'only screen and (min-device-pixel-ratio: 2),' + 'only screen and (min-resolution: 192dpi),' + 'only screen and (min-resolution: 2dppx)'
  };

  var MediaQuery = {
    queries: [],

    current: '',

    /**
     * Initializes the media query helper, by extracting the breakpoint list from the CSS and activating the breakpoint watcher.
     * @function
     * @private
     */
    _init: function _init() {
      var self = this;
      var extractedStyles = $('.foundation-mq').css('font-family');
      var namedQueries;

      namedQueries = parseStyleToObject(extractedStyles);

      for (var key in namedQueries) {
        if (namedQueries.hasOwnProperty(key)) {
          self.queries.push({
            name: key,
            value: 'only screen and (min-width: ' + namedQueries[key] + ')'
          });
        }
      }

      this.current = this._getCurrentSize();

      this._watcher();
    },


    /**
     * Checks if the screen is at least as wide as a breakpoint.
     * @function
     * @param {String} size - Name of the breakpoint to check.
     * @returns {Boolean} `true` if the breakpoint matches, `false` if it's smaller.
     */
    atLeast: function atLeast(size) {
      var query = this.get(size);

      if (query) {
        return window.matchMedia(query).matches;
      }

      return false;
    },


    /**
     * Checks if the screen matches to a breakpoint.
     * @function
     * @param {String} size - Name of the breakpoint to check, either 'small only' or 'small'. Omitting 'only' falls back to using atLeast() method.
     * @returns {Boolean} `true` if the breakpoint matches, `false` if it does not.
     */
    is: function is(size) {
      size = size.trim().split(' ');
      if (size.length > 1 && size[1] === 'only') {
        if (size[0] === this._getCurrentSize()) return true;
      } else {
        return this.atLeast(size[0]);
      }
      return false;
    },


    /**
     * Gets the media query of a breakpoint.
     * @function
     * @param {String} size - Name of the breakpoint to get.
     * @returns {String|null} - The media query of the breakpoint, or `null` if the breakpoint doesn't exist.
     */
    get: function get(size) {
      for (var i in this.queries) {
        if (this.queries.hasOwnProperty(i)) {
          var query = this.queries[i];
          if (size === query.name) return query.value;
        }
      }

      return null;
    },


    /**
     * Gets the current breakpoint name by testing every breakpoint and returning the last one to match (the biggest one).
     * @function
     * @private
     * @returns {String} Name of the current breakpoint.
     */
    _getCurrentSize: function _getCurrentSize() {
      var matched;

      for (var i = 0; i < this.queries.length; i++) {
        var query = this.queries[i];

        if (window.matchMedia(query.value).matches) {
          matched = query;
        }
      }

      if ((typeof matched === 'undefined' ? 'undefined' : _typeof(matched)) === 'object') {
        return matched.name;
      } else {
        return matched;
      }
    },


    /**
     * Activates the breakpoint watcher, which fires an event on the window whenever the breakpoint changes.
     * @function
     * @private
     */
    _watcher: function _watcher() {
      var _this = this;

      $(window).on('resize.zf.mediaquery', function () {
        var newSize = _this._getCurrentSize(),
            currentSize = _this.current;

        if (newSize !== currentSize) {
          // Change the current media query
          _this.current = newSize;

          // Broadcast the media query change on the window
          $(window).trigger('changed.zf.mediaquery', [newSize, currentSize]);
        }
      });
    }
  };

  Foundation.MediaQuery = MediaQuery;

  // matchMedia() polyfill - Test a CSS media type/query in JS.
  // Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license
  window.matchMedia || (window.matchMedia = function () {
    'use strict';

    // For browsers that support matchMedium api such as IE 9 and webkit

    var styleMedia = window.styleMedia || window.media;

    // For those that don't support matchMedium
    if (!styleMedia) {
      var style = document.createElement('style'),
          script = document.getElementsByTagName('script')[0],
          info = null;

      style.type = 'text/css';
      style.id = 'matchmediajs-test';

      script && script.parentNode && script.parentNode.insertBefore(style, script);

      // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
      info = 'getComputedStyle' in window && window.getComputedStyle(style, null) || style.currentStyle;

      styleMedia = {
        matchMedium: function matchMedium(media) {
          var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

          // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
          if (style.styleSheet) {
            style.styleSheet.cssText = text;
          } else {
            style.textContent = text;
          }

          // Test if media query is true or false
          return info.width === '1px';
        }
      };
    }

    return function (media) {
      return {
        matches: styleMedia.matchMedium(media || 'all'),
        media: media || 'all'
      };
    };
  }());

  // Thank you: https://github.com/sindresorhus/query-string
  function parseStyleToObject(str) {
    var styleObject = {};

    if (typeof str !== 'string') {
      return styleObject;
    }

    str = str.trim().slice(1, -1); // browsers re-quote string style values

    if (!str) {
      return styleObject;
    }

    styleObject = str.split('&').reduce(function (ret, param) {
      var parts = param.replace(/\+/g, ' ').split('=');
      var key = parts[0];
      var val = parts[1];
      key = decodeURIComponent(key);

      // missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
      val = val === undefined ? null : decodeURIComponent(val);

      if (!ret.hasOwnProperty(key)) {
        ret[key] = val;
      } else if (Array.isArray(ret[key])) {
        ret[key].push(val);
      } else {
        ret[key] = [ret[key], val];
      }
      return ret;
    }, {});

    return styleObject;
  }

  Foundation.MediaQuery = MediaQuery;
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Abide module.
   * @module foundation.abide
   */

  var Abide = function () {
    /**
     * Creates a new instance of Abide.
     * @class
     * @fires Abide#init
     * @param {Object} element - jQuery object to add the trigger to.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function Abide(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Abide);

      this.$element = element;
      this.options = $.extend({}, Abide.defaults, this.$element.data(), options);

      this._init();

      Foundation.registerPlugin(this, 'Abide');
    }

    /**
     * Initializes the Abide plugin and calls functions to get Abide functioning on load.
     * @private
     */


    _createClass(Abide, [{
      key: '_init',
      value: function _init() {
        this.$inputs = this.$element.find('input, textarea, select');

        this._events();
      }

      /**
       * Initializes events for Abide.
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this2 = this;

        this.$element.off('.abide').on('reset.zf.abide', function () {
          _this2.resetForm();
        }).on('submit.zf.abide', function () {
          return _this2.validateForm();
        });

        if (this.options.validateOn === 'fieldChange') {
          this.$inputs.off('change.zf.abide').on('change.zf.abide', function (e) {
            _this2.validateInput($(e.target));
          });
        }

        if (this.options.liveValidate) {
          this.$inputs.off('input.zf.abide').on('input.zf.abide', function (e) {
            _this2.validateInput($(e.target));
          });
        }

        if (this.options.validateOnBlur) {
          this.$inputs.off('blur.zf.abide').on('blur.zf.abide', function (e) {
            _this2.validateInput($(e.target));
          });
        }
      }

      /**
       * Calls necessary functions to update Abide upon DOM change
       * @private
       */

    }, {
      key: '_reflow',
      value: function _reflow() {
        this._init();
      }

      /**
       * Checks whether or not a form element has the required attribute and if it's checked or not
       * @param {Object} element - jQuery object to check for required attribute
       * @returns {Boolean} Boolean value depends on whether or not attribute is checked or empty
       */

    }, {
      key: 'requiredCheck',
      value: function requiredCheck($el) {
        if (!$el.attr('required')) return true;

        var isGood = true;

        switch ($el[0].type) {
          case 'checkbox':
            isGood = $el[0].checked;
            break;

          case 'select':
          case 'select-one':
          case 'select-multiple':
            var opt = $el.find('option:selected');
            if (!opt.length || !opt.val()) isGood = false;
            break;

          default:
            if (!$el.val() || !$el.val().length) isGood = false;
        }

        return isGood;
      }

      /**
       * Based on $el, get the first element with selector in this order:
       * 1. The element's direct sibling('s).
       * 3. The element's parent's children.
       *
       * This allows for multiple form errors per input, though if none are found, no form errors will be shown.
       *
       * @param {Object} $el - jQuery object to use as reference to find the form error selector.
       * @returns {Object} jQuery object with the selector.
       */

    }, {
      key: 'findFormError',
      value: function findFormError($el) {
        var $error = $el.siblings(this.options.formErrorSelector);

        if (!$error.length) {
          $error = $el.parent().find(this.options.formErrorSelector);
        }

        return $error;
      }

      /**
       * Get the first element in this order:
       * 2. The <label> with the attribute `[for="someInputId"]`
       * 3. The `.closest()` <label>
       *
       * @param {Object} $el - jQuery object to check for required attribute
       * @returns {Boolean} Boolean value depends on whether or not attribute is checked or empty
       */

    }, {
      key: 'findLabel',
      value: function findLabel($el) {
        var id = $el[0].id;
        var $label = this.$element.find('label[for="' + id + '"]');

        if (!$label.length) {
          return $el.closest('label');
        }

        return $label;
      }

      /**
       * Get the set of labels associated with a set of radio els in this order
       * 2. The <label> with the attribute `[for="someInputId"]`
       * 3. The `.closest()` <label>
       *
       * @param {Object} $el - jQuery object to check for required attribute
       * @returns {Boolean} Boolean value depends on whether or not attribute is checked or empty
       */

    }, {
      key: 'findRadioLabels',
      value: function findRadioLabels($els) {
        var _this3 = this;

        var labels = $els.map(function (i, el) {
          var id = el.id;
          var $label = _this3.$element.find('label[for="' + id + '"]');

          if (!$label.length) {
            $label = $(el).closest('label');
          }
          return $label[0];
        });

        return $(labels);
      }

      /**
       * Adds the CSS error class as specified by the Abide settings to the label, input, and the form
       * @param {Object} $el - jQuery object to add the class to
       */

    }, {
      key: 'addErrorClasses',
      value: function addErrorClasses($el) {
        var $label = this.findLabel($el);
        var $formError = this.findFormError($el);

        if ($label.length) {
          $label.addClass(this.options.labelErrorClass);
        }

        if ($formError.length) {
          $formError.addClass(this.options.formErrorClass);
        }

        $el.addClass(this.options.inputErrorClass).attr('data-invalid', '');
      }

      /**
       * Remove CSS error classes etc from an entire radio button group
       * @param {String} groupName - A string that specifies the name of a radio button group
       *
       */

    }, {
      key: 'removeRadioErrorClasses',
      value: function removeRadioErrorClasses(groupName) {
        var $els = this.$element.find(':radio[name="' + groupName + '"]');
        var $labels = this.findRadioLabels($els);
        var $formErrors = this.findFormError($els);

        if ($labels.length) {
          $labels.removeClass(this.options.labelErrorClass);
        }

        if ($formErrors.length) {
          $formErrors.removeClass(this.options.formErrorClass);
        }

        $els.removeClass(this.options.inputErrorClass).removeAttr('data-invalid');
      }

      /**
       * Removes CSS error class as specified by the Abide settings from the label, input, and the form
       * @param {Object} $el - jQuery object to remove the class from
       */

    }, {
      key: 'removeErrorClasses',
      value: function removeErrorClasses($el) {
        // radios need to clear all of the els
        if ($el[0].type == 'radio') {
          return this.removeRadioErrorClasses($el.attr('name'));
        }

        var $label = this.findLabel($el);
        var $formError = this.findFormError($el);

        if ($label.length) {
          $label.removeClass(this.options.labelErrorClass);
        }

        if ($formError.length) {
          $formError.removeClass(this.options.formErrorClass);
        }

        $el.removeClass(this.options.inputErrorClass).removeAttr('data-invalid');
      }

      /**
       * Goes through a form to find inputs and proceeds to validate them in ways specific to their type. 
       * Ignores inputs with data-abide-ignore, type="hidden" or disabled attributes set
       * @fires Abide#invalid
       * @fires Abide#valid
       * @param {Object} element - jQuery object to validate, should be an HTML input
       * @returns {Boolean} goodToGo - If the input is valid or not.
       */

    }, {
      key: 'validateInput',
      value: function validateInput($el) {
        var clearRequire = this.requiredCheck($el),
            validated = false,
            customValidator = true,
            validator = $el.attr('data-validator'),
            equalTo = true;

        // don't validate ignored inputs or hidden inputs or disabled inputs
        if ($el.is('[data-abide-ignore]') || $el.is('[type="hidden"]') || $el.is('[disabled]')) {
          return true;
        }

        switch ($el[0].type) {
          case 'radio':
            validated = this.validateRadio($el.attr('name'));
            break;

          case 'checkbox':
            validated = clearRequire;
            break;

          case 'select':
          case 'select-one':
          case 'select-multiple':
            validated = clearRequire;
            break;

          default:
            validated = this.validateText($el);
        }

        if (validator) {
          customValidator = this.matchValidation($el, validator, $el.attr('required'));
        }

        if ($el.attr('data-equalto')) {
          equalTo = this.options.validators.equalTo($el);
        }

        var goodToGo = [clearRequire, validated, customValidator, equalTo].indexOf(false) === -1;
        var message = (goodToGo ? 'valid' : 'invalid') + '.zf.abide';

        if (goodToGo) {
          // Re-validate inputs that depend on this one with equalto
          var dependentElements = this.$element.find('[data-equalto="' + $el.attr('id') + '"]');
          if (dependentElements.length) {
            var _this = this;
            dependentElements.each(function () {
              if ($(this).val()) {
                _this.validateInput($(this));
              }
            });
          }
        }

        this[goodToGo ? 'removeErrorClasses' : 'addErrorClasses']($el);

        /**
         * Fires when the input is done checking for validation. Event trigger is either `valid.zf.abide` or `invalid.zf.abide`
         * Trigger includes the DOM element of the input.
         * @event Abide#valid
         * @event Abide#invalid
         */
        $el.trigger(message, [$el]);

        return goodToGo;
      }

      /**
       * Goes through a form and if there are any invalid inputs, it will display the form error element
       * @returns {Boolean} noError - true if no errors were detected...
       * @fires Abide#formvalid
       * @fires Abide#forminvalid
       */

    }, {
      key: 'validateForm',
      value: function validateForm() {
        var acc = [];
        var _this = this;

        this.$inputs.each(function () {
          acc.push(_this.validateInput($(this)));
        });

        var noError = acc.indexOf(false) === -1;

        this.$element.find('[data-abide-error]').css('display', noError ? 'none' : 'block');

        /**
         * Fires when the form is finished validating. Event trigger is either `formvalid.zf.abide` or `forminvalid.zf.abide`.
         * Trigger includes the element of the form.
         * @event Abide#formvalid
         * @event Abide#forminvalid
         */
        this.$element.trigger((noError ? 'formvalid' : 'forminvalid') + '.zf.abide', [this.$element]);

        return noError;
      }

      /**
       * Determines whether or a not a text input is valid based on the pattern specified in the attribute. If no matching pattern is found, returns true.
       * @param {Object} $el - jQuery object to validate, should be a text input HTML element
       * @param {String} pattern - string value of one of the RegEx patterns in Abide.options.patterns
       * @returns {Boolean} Boolean value depends on whether or not the input value matches the pattern specified
       */

    }, {
      key: 'validateText',
      value: function validateText($el, pattern) {
        // A pattern can be passed to this function, or it will be infered from the input's "pattern" attribute, or it's "type" attribute
        pattern = pattern || $el.attr('pattern') || $el.attr('type');
        var inputText = $el.val();
        var valid = false;

        if (inputText.length) {
          // If the pattern attribute on the element is in Abide's list of patterns, then test that regexp
          if (this.options.patterns.hasOwnProperty(pattern)) {
            valid = this.options.patterns[pattern].test(inputText);
          }
          // If the pattern name isn't also the type attribute of the field, then test it as a regexp
          else if (pattern !== $el.attr('type')) {
              valid = new RegExp(pattern).test(inputText);
            } else {
              valid = true;
            }
        }
        // An empty field is valid if it's not required
        else if (!$el.prop('required')) {
            valid = true;
          }

        return valid;
      }

      /**
       * Determines whether or a not a radio input is valid based on whether or not it is required and selected. Although the function targets a single `<input>`, it validates by checking the `required` and `checked` properties of all radio buttons in its group.
       * @param {String} groupName - A string that specifies the name of a radio button group
       * @returns {Boolean} Boolean value depends on whether or not at least one radio input has been selected (if it's required)
       */

    }, {
      key: 'validateRadio',
      value: function validateRadio(groupName) {
        // If at least one radio in the group has the `required` attribute, the group is considered required
        // Per W3C spec, all radio buttons in a group should have `required`, but we're being nice
        var $group = this.$element.find(':radio[name="' + groupName + '"]');
        var valid = false,
            required = false;

        // For the group to be required, at least one radio needs to be required
        $group.each(function (i, e) {
          if ($(e).attr('required')) {
            required = true;
          }
        });
        if (!required) valid = true;

        if (!valid) {
          // For the group to be valid, at least one radio needs to be checked
          $group.each(function (i, e) {
            if ($(e).prop('checked')) {
              valid = true;
            }
          });
        };

        return valid;
      }

      /**
       * Determines if a selected input passes a custom validation function. Multiple validations can be used, if passed to the element with `data-validator="foo bar baz"` in a space separated listed.
       * @param {Object} $el - jQuery input element.
       * @param {String} validators - a string of function names matching functions in the Abide.options.validators object.
       * @param {Boolean} required - self explanatory?
       * @returns {Boolean} - true if validations passed.
       */

    }, {
      key: 'matchValidation',
      value: function matchValidation($el, validators, required) {
        var _this4 = this;

        required = required ? true : false;

        var clear = validators.split(' ').map(function (v) {
          return _this4.options.validators[v]($el, required, $el.parent());
        });
        return clear.indexOf(false) === -1;
      }

      /**
       * Resets form inputs and styles
       * @fires Abide#formreset
       */

    }, {
      key: 'resetForm',
      value: function resetForm() {
        var $form = this.$element,
            opts = this.options;

        $('.' + opts.labelErrorClass, $form).not('small').removeClass(opts.labelErrorClass);
        $('.' + opts.inputErrorClass, $form).not('small').removeClass(opts.inputErrorClass);
        $(opts.formErrorSelector + '.' + opts.formErrorClass).removeClass(opts.formErrorClass);
        $form.find('[data-abide-error]').css('display', 'none');
        $(':input', $form).not(':button, :submit, :reset, :hidden, :radio, :checkbox, [data-abide-ignore]').val('').removeAttr('data-invalid');
        $(':input:radio', $form).not('[data-abide-ignore]').prop('checked', false).removeAttr('data-invalid');
        $(':input:checkbox', $form).not('[data-abide-ignore]').prop('checked', false).removeAttr('data-invalid');
        /**
         * Fires when the form has been reset.
         * @event Abide#formreset
         */
        $form.trigger('formreset.zf.abide', [$form]);
      }

      /**
       * Destroys an instance of Abide.
       * Removes error styles and classes from elements, without resetting their values.
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        var _this = this;
        this.$element.off('.abide').find('[data-abide-error]').css('display', 'none');

        this.$inputs.off('.abide').each(function () {
          _this.removeErrorClasses($(this));
        });

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Abide;
  }();

  /**
   * Default settings for plugin
   */


  Abide.defaults = {
    /**
     * The default event to validate inputs. Checkboxes and radios validate immediately.
     * Remove or change this value for manual validation.
     * @option
     * @type {?string}
     * @default 'fieldChange'
     */
    validateOn: 'fieldChange',

    /**
     * Class to be applied to input labels on failed validation.
     * @option
     * @type {string}
     * @default 'is-invalid-label'
     */
    labelErrorClass: 'is-invalid-label',

    /**
     * Class to be applied to inputs on failed validation.
     * @option
     * @type {string}
     * @default 'is-invalid-input'
     */
    inputErrorClass: 'is-invalid-input',

    /**
     * Class selector to use to target Form Errors for show/hide.
     * @option
     * @type {string}
     * @default '.form-error'
     */
    formErrorSelector: '.form-error',

    /**
     * Class added to Form Errors on failed validation.
     * @option
     * @type {string}
     * @default 'is-visible'
     */
    formErrorClass: 'is-visible',

    /**
     * Set to true to validate text inputs on any value change.
     * @option
     * @type {boolean}
     * @default false
     */
    liveValidate: false,

    /**
     * Set to true to validate inputs on blur.
     * @option
     * @type {boolean}
     * @default false
     */
    validateOnBlur: false,

    patterns: {
      alpha: /^[a-zA-Z]+$/,
      alpha_numeric: /^[a-zA-Z0-9]+$/,
      integer: /^[-+]?\d+$/,
      number: /^[-+]?\d*(?:[\.\,]\d+)?$/,

      // amex, visa, diners
      card: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
      cvv: /^([0-9]){3,4}$/,

      // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
      email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,

      url: /^(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
      // abc.de
      domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,8}$/,

      datetime: /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
      // YYYY-MM-DD
      date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
      // HH:MM:SS
      time: /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
      dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
      // MM/DD/YYYY
      month_day_year: /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
      // DD/MM/YYYY
      day_month_year: /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,

      // #FFF or #FFFFFF
      color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
    },

    /**
     * Optional validation functions to be used. `equalTo` being the only default included function.
     * Functions should return only a boolean if the input is valid or not. Functions are given the following arguments:
     * el : The jQuery element to validate.
     * required : Boolean value of the required attribute be present or not.
     * parent : The direct parent of the input.
     * @option
     */
    validators: {
      equalTo: function equalTo(el, required, parent) {
        return $('#' + el.attr('data-equalto')).val() === el.val();
      }
    }

    // Window exports
  };Foundation.plugin(Abide, 'Abide');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Accordion module.
   * @module foundation.accordion
   * @requires foundation.util.keyboard
   * @requires foundation.util.motion
   */

  var Accordion = function () {
    /**
     * Creates a new instance of an accordion.
     * @class
     * @fires Accordion#init
     * @param {jQuery} element - jQuery object to make into an accordion.
     * @param {Object} options - a plain object with settings to override the default options.
     */
    function Accordion(element, options) {
      _classCallCheck(this, Accordion);

      this.$element = element;
      this.options = $.extend({}, Accordion.defaults, this.$element.data(), options);

      this._init();

      Foundation.registerPlugin(this, 'Accordion');
      Foundation.Keyboard.register('Accordion', {
        'ENTER': 'toggle',
        'SPACE': 'toggle',
        'ARROW_DOWN': 'next',
        'ARROW_UP': 'previous'
      });
    }

    /**
     * Initializes the accordion by animating the preset active pane(s).
     * @private
     */


    _createClass(Accordion, [{
      key: '_init',
      value: function _init() {
        this.$element.attr('role', 'tablist');
        this.$tabs = this.$element.children('[data-accordion-item]');

        this.$tabs.each(function (idx, el) {
          var $el = $(el),
              $content = $el.children('[data-tab-content]'),
              id = $content[0].id || Foundation.GetYoDigits(6, 'accordion'),
              linkId = el.id || id + '-label';

          $el.find('a:first').attr({
            'aria-controls': id,
            'role': 'tab',
            'id': linkId,
            'aria-expanded': false,
            'aria-selected': false
          });

          $content.attr({ 'role': 'tabpanel', 'aria-labelledby': linkId, 'aria-hidden': true, 'id': id });
        });
        var $initActive = this.$element.find('.is-active').children('[data-tab-content]');
        if ($initActive.length) {
          this.down($initActive, true);
        }
        this._events();
      }

      /**
       * Adds event handlers for items within the accordion.
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this;

        this.$tabs.each(function () {
          var $elem = $(this);
          var $tabContent = $elem.children('[data-tab-content]');
          if ($tabContent.length) {
            $elem.children('a').off('click.zf.accordion keydown.zf.accordion').on('click.zf.accordion', function (e) {
              e.preventDefault();
              _this.toggle($tabContent);
            }).on('keydown.zf.accordion', function (e) {
              Foundation.Keyboard.handleKey(e, 'Accordion', {
                toggle: function toggle() {
                  _this.toggle($tabContent);
                },
                next: function next() {
                  var $a = $elem.next().find('a').focus();
                  if (!_this.options.multiExpand) {
                    $a.trigger('click.zf.accordion');
                  }
                },
                previous: function previous() {
                  var $a = $elem.prev().find('a').focus();
                  if (!_this.options.multiExpand) {
                    $a.trigger('click.zf.accordion');
                  }
                },
                handled: function handled() {
                  e.preventDefault();
                  e.stopPropagation();
                }
              });
            });
          }
        });
      }

      /**
       * Toggles the selected content pane's open/close state.
       * @param {jQuery} $target - jQuery object of the pane to toggle (`.accordion-content`).
       * @function
       */

    }, {
      key: 'toggle',
      value: function toggle($target) {
        if ($target.parent().hasClass('is-active')) {
          this.up($target);
        } else {
          this.down($target);
        }
      }

      /**
       * Opens the accordion tab defined by `$target`.
       * @param {jQuery} $target - Accordion pane to open (`.accordion-content`).
       * @param {Boolean} firstTime - flag to determine if reflow should happen.
       * @fires Accordion#down
       * @function
       */

    }, {
      key: 'down',
      value: function down($target, firstTime) {
        var _this2 = this;

        $target.attr('aria-hidden', false).parent('[data-tab-content]').addBack().parent().addClass('is-active');

        if (!this.options.multiExpand && !firstTime) {
          var $currentActive = this.$element.children('.is-active').children('[data-tab-content]');
          if ($currentActive.length) {
            this.up($currentActive.not($target));
          }
        }

        $target.slideDown(this.options.slideSpeed, function () {
          /**
           * Fires when the tab is done opening.
           * @event Accordion#down
           */
          _this2.$element.trigger('down.zf.accordion', [$target]);
        });

        $('#' + $target.attr('aria-labelledby')).attr({
          'aria-expanded': true,
          'aria-selected': true
        });
      }

      /**
       * Closes the tab defined by `$target`.
       * @param {jQuery} $target - Accordion tab to close (`.accordion-content`).
       * @fires Accordion#up
       * @function
       */

    }, {
      key: 'up',
      value: function up($target) {
        var $aunts = $target.parent().siblings(),
            _this = this;

        if (!this.options.allowAllClosed && !$aunts.hasClass('is-active') || !$target.parent().hasClass('is-active')) {
          return;
        }

        // Foundation.Move(this.options.slideSpeed, $target, function(){
        $target.slideUp(_this.options.slideSpeed, function () {
          /**
           * Fires when the tab is done collapsing up.
           * @event Accordion#up
           */
          _this.$element.trigger('up.zf.accordion', [$target]);
        });
        // });

        $target.attr('aria-hidden', true).parent().removeClass('is-active');

        $('#' + $target.attr('aria-labelledby')).attr({
          'aria-expanded': false,
          'aria-selected': false
        });
      }

      /**
       * Destroys an instance of an accordion.
       * @fires Accordion#destroyed
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.$element.find('[data-tab-content]').stop(true).slideUp(0).css('display', '');
        this.$element.find('a').off('.zf.accordion');

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Accordion;
  }();

  Accordion.defaults = {
    /**
     * Amount of time to animate the opening of an accordion pane.
     * @option
     * @type {number}
     * @default 250
     */
    slideSpeed: 250,
    /**
     * Allow the accordion to have multiple open panes.
     * @option
     * @type {boolean}
     * @default false
     */
    multiExpand: false,
    /**
     * Allow the accordion to close all panes.
     * @option
     * @type {boolean}
     * @default false
     */
    allowAllClosed: false
  };

  // Window exports
  Foundation.plugin(Accordion, 'Accordion');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * AccordionMenu module.
   * @module foundation.accordionMenu
   * @requires foundation.util.keyboard
   * @requires foundation.util.motion
   * @requires foundation.util.nest
   */

  var AccordionMenu = function () {
    /**
     * Creates a new instance of an accordion menu.
     * @class
     * @fires AccordionMenu#init
     * @param {jQuery} element - jQuery object to make into an accordion menu.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function AccordionMenu(element, options) {
      _classCallCheck(this, AccordionMenu);

      this.$element = element;
      this.options = $.extend({}, AccordionMenu.defaults, this.$element.data(), options);

      Foundation.Nest.Feather(this.$element, 'accordion');

      this._init();

      Foundation.registerPlugin(this, 'AccordionMenu');
      Foundation.Keyboard.register('AccordionMenu', {
        'ENTER': 'toggle',
        'SPACE': 'toggle',
        'ARROW_RIGHT': 'open',
        'ARROW_UP': 'up',
        'ARROW_DOWN': 'down',
        'ARROW_LEFT': 'close',
        'ESCAPE': 'closeAll'
      });
    }

    /**
     * Initializes the accordion menu by hiding all nested menus.
     * @private
     */


    _createClass(AccordionMenu, [{
      key: '_init',
      value: function _init() {
        this.$element.find('[data-submenu]').not('.is-active').slideUp(0); //.find('a').css('padding-left', '1rem');
        this.$element.attr({
          'role': 'menu',
          'aria-multiselectable': this.options.multiOpen
        });

        this.$menuLinks = this.$element.find('.is-accordion-submenu-parent');
        this.$menuLinks.each(function () {
          var linkId = this.id || Foundation.GetYoDigits(6, 'acc-menu-link'),
              $elem = $(this),
              $sub = $elem.children('[data-submenu]'),
              subId = $sub[0].id || Foundation.GetYoDigits(6, 'acc-menu'),
              isActive = $sub.hasClass('is-active');
          $elem.attr({
            'aria-controls': subId,
            'aria-expanded': isActive,
            'role': 'menuitem',
            'id': linkId
          });
          $sub.attr({
            'aria-labelledby': linkId,
            'aria-hidden': !isActive,
            'role': 'menu',
            'id': subId
          });
        });
        var initPanes = this.$element.find('.is-active');
        if (initPanes.length) {
          var _this = this;
          initPanes.each(function () {
            _this.down($(this));
          });
        }
        this._events();
      }

      /**
       * Adds event handlers for items within the menu.
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this;

        this.$element.find('li').each(function () {
          var $submenu = $(this).children('[data-submenu]');

          if ($submenu.length) {
            $(this).children('a').off('click.zf.accordionMenu').on('click.zf.accordionMenu', function (e) {
              e.preventDefault();

              _this.toggle($submenu);
            });
          }
        }).on('keydown.zf.accordionmenu', function (e) {
          var $element = $(this),
              $elements = $element.parent('ul').children('li'),
              $prevElement,
              $nextElement,
              $target = $element.children('[data-submenu]');

          $elements.each(function (i) {
            if ($(this).is($element)) {
              $prevElement = $elements.eq(Math.max(0, i - 1)).find('a').first();
              $nextElement = $elements.eq(Math.min(i + 1, $elements.length - 1)).find('a').first();

              if ($(this).children('[data-submenu]:visible').length) {
                // has open sub menu
                $nextElement = $element.find('li:first-child').find('a').first();
              }
              if ($(this).is(':first-child')) {
                // is first element of sub menu
                $prevElement = $element.parents('li').first().find('a').first();
              } else if ($prevElement.parents('li').first().children('[data-submenu]:visible').length) {
                // if previous element has open sub menu
                $prevElement = $prevElement.parents('li').find('li:last-child').find('a').first();
              }
              if ($(this).is(':last-child')) {
                // is last element of sub menu
                $nextElement = $element.parents('li').first().next('li').find('a').first();
              }

              return;
            }
          });

          Foundation.Keyboard.handleKey(e, 'AccordionMenu', {
            open: function open() {
              if ($target.is(':hidden')) {
                _this.down($target);
                $target.find('li').first().find('a').first().focus();
              }
            },
            close: function close() {
              if ($target.length && !$target.is(':hidden')) {
                // close active sub of this item
                _this.up($target);
              } else if ($element.parent('[data-submenu]').length) {
                // close currently open sub
                _this.up($element.parent('[data-submenu]'));
                $element.parents('li').first().find('a').first().focus();
              }
            },
            up: function up() {
              $prevElement.focus();
              return true;
            },
            down: function down() {
              $nextElement.focus();
              return true;
            },
            toggle: function toggle() {
              if ($element.children('[data-submenu]').length) {
                _this.toggle($element.children('[data-submenu]'));
              }
            },
            closeAll: function closeAll() {
              _this.hideAll();
            },
            handled: function handled(preventDefault) {
              if (preventDefault) {
                e.preventDefault();
              }
              e.stopImmediatePropagation();
            }
          });
        }); //.attr('tabindex', 0);
      }

      /**
       * Closes all panes of the menu.
       * @function
       */

    }, {
      key: 'hideAll',
      value: function hideAll() {
        this.up(this.$element.find('[data-submenu]'));
      }

      /**
       * Opens all panes of the menu.
       * @function
       */

    }, {
      key: 'showAll',
      value: function showAll() {
        this.down(this.$element.find('[data-submenu]'));
      }

      /**
       * Toggles the open/close state of a submenu.
       * @function
       * @param {jQuery} $target - the submenu to toggle
       */

    }, {
      key: 'toggle',
      value: function toggle($target) {
        if (!$target.is(':animated')) {
          if (!$target.is(':hidden')) {
            this.up($target);
          } else {
            this.down($target);
          }
        }
      }

      /**
       * Opens the sub-menu defined by `$target`.
       * @param {jQuery} $target - Sub-menu to open.
       * @fires AccordionMenu#down
       */

    }, {
      key: 'down',
      value: function down($target) {
        var _this = this;

        if (!this.options.multiOpen) {
          this.up(this.$element.find('.is-active').not($target.parentsUntil(this.$element).add($target)));
        }

        $target.addClass('is-active').attr({ 'aria-hidden': false }).parent('.is-accordion-submenu-parent').attr({ 'aria-expanded': true });

        //Foundation.Move(this.options.slideSpeed, $target, function() {
        $target.slideDown(_this.options.slideSpeed, function () {
          /**
           * Fires when the menu is done opening.
           * @event AccordionMenu#down
           */
          _this.$element.trigger('down.zf.accordionMenu', [$target]);
        });
        //});
      }

      /**
       * Closes the sub-menu defined by `$target`. All sub-menus inside the target will be closed as well.
       * @param {jQuery} $target - Sub-menu to close.
       * @fires AccordionMenu#up
       */

    }, {
      key: 'up',
      value: function up($target) {
        var _this = this;
        //Foundation.Move(this.options.slideSpeed, $target, function(){
        $target.slideUp(_this.options.slideSpeed, function () {
          /**
           * Fires when the menu is done collapsing up.
           * @event AccordionMenu#up
           */
          _this.$element.trigger('up.zf.accordionMenu', [$target]);
        });
        //});

        var $menus = $target.find('[data-submenu]').slideUp(0).addBack().attr('aria-hidden', true);

        $menus.parent('.is-accordion-submenu-parent').attr('aria-expanded', false);
      }

      /**
       * Destroys an instance of accordion menu.
       * @fires AccordionMenu#destroyed
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.$element.find('[data-submenu]').slideDown(0).css('display', '');
        this.$element.find('a').off('click.zf.accordionMenu');

        Foundation.Nest.Burn(this.$element, 'accordion');
        Foundation.unregisterPlugin(this);
      }
    }]);

    return AccordionMenu;
  }();

  AccordionMenu.defaults = {
    /**
     * Amount of time to animate the opening of a submenu in ms.
     * @option
     * @type {number}
     * @default 250
     */
    slideSpeed: 250,
    /**
     * Allow the menu to have multiple open panes.
     * @option
     * @type {boolean}
     * @default true
     */
    multiOpen: true
  };

  // Window exports
  Foundation.plugin(AccordionMenu, 'AccordionMenu');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Drilldown module.
   * @module foundation.drilldown
   * @requires foundation.util.keyboard
   * @requires foundation.util.motion
   * @requires foundation.util.nest
   */

  var Drilldown = function () {
    /**
     * Creates a new instance of a drilldown menu.
     * @class
     * @param {jQuery} element - jQuery object to make into an accordion menu.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function Drilldown(element, options) {
      _classCallCheck(this, Drilldown);

      this.$element = element;
      this.options = $.extend({}, Drilldown.defaults, this.$element.data(), options);

      Foundation.Nest.Feather(this.$element, 'drilldown');

      this._init();

      Foundation.registerPlugin(this, 'Drilldown');
      Foundation.Keyboard.register('Drilldown', {
        'ENTER': 'open',
        'SPACE': 'open',
        'ARROW_RIGHT': 'next',
        'ARROW_UP': 'up',
        'ARROW_DOWN': 'down',
        'ARROW_LEFT': 'previous',
        'ESCAPE': 'close',
        'TAB': 'down',
        'SHIFT_TAB': 'up'
      });
    }

    /**
     * Initializes the drilldown by creating jQuery collections of elements
     * @private
     */


    _createClass(Drilldown, [{
      key: '_init',
      value: function _init() {
        this.$submenuAnchors = this.$element.find('li.is-drilldown-submenu-parent').children('a');
        this.$submenus = this.$submenuAnchors.parent('li').children('[data-submenu]');
        this.$menuItems = this.$element.find('li').not('.js-drilldown-back').attr('role', 'menuitem').find('a');
        this.$element.attr('data-mutate', this.$element.attr('data-drilldown') || Foundation.GetYoDigits(6, 'drilldown'));

        this._prepareMenu();
        this._registerEvents();

        this._keyboardEvents();
      }

      /**
       * prepares drilldown menu by setting attributes to links and elements
       * sets a min height to prevent content jumping
       * wraps the element if not already wrapped
       * @private
       * @function
       */

    }, {
      key: '_prepareMenu',
      value: function _prepareMenu() {
        var _this = this;
        // if(!this.options.holdOpen){
        //   this._menuLinkEvents();
        // }
        this.$submenuAnchors.each(function () {
          var $link = $(this);
          var $sub = $link.parent();
          if (_this.options.parentLink) {
            $link.clone().prependTo($sub.children('[data-submenu]')).wrap('<li class="is-submenu-parent-item is-submenu-item is-drilldown-submenu-item" role="menu-item"></li>');
          }
          $link.data('savedHref', $link.attr('href')).removeAttr('href').attr('tabindex', 0);
          $link.children('[data-submenu]').attr({
            'aria-hidden': true,
            'tabindex': 0,
            'role': 'menu'
          });
          _this._events($link);
        });
        this.$submenus.each(function () {
          var $menu = $(this),
              $back = $menu.find('.js-drilldown-back');
          if (!$back.length) {
            switch (_this.options.backButtonPosition) {
              case "bottom":
                $menu.append(_this.options.backButton);
                break;
              case "top":
                $menu.prepend(_this.options.backButton);
                break;
              default:
                console.error("Unsupported backButtonPosition value '" + _this.options.backButtonPosition + "'");
            }
          }
          _this._back($menu);
        });

        this.$submenus.addClass('invisible');
        if (!this.options.autoHeight) {
          this.$submenus.addClass('drilldown-submenu-cover-previous');
        }

        // create a wrapper on element if it doesn't exist.
        if (!this.$element.parent().hasClass('is-drilldown')) {
          this.$wrapper = $(this.options.wrapper).addClass('is-drilldown');
          if (this.options.animateHeight) this.$wrapper.addClass('animate-height');
          this.$element.wrap(this.$wrapper);
        }
        // set wrapper
        this.$wrapper = this.$element.parent();
        this.$wrapper.css(this._getMaxDims());
      }
    }, {
      key: '_resize',
      value: function _resize() {
        this.$wrapper.css({ 'max-width': 'none', 'min-height': 'none' });
        // _getMaxDims has side effects (boo) but calling it should update all other necessary heights & widths
        this.$wrapper.css(this._getMaxDims());
      }

      /**
       * Adds event handlers to elements in the menu.
       * @function
       * @private
       * @param {jQuery} $elem - the current menu item to add handlers to.
       */

    }, {
      key: '_events',
      value: function _events($elem) {
        var _this = this;

        $elem.off('click.zf.drilldown').on('click.zf.drilldown', function (e) {
          if ($(e.target).parentsUntil('ul', 'li').hasClass('is-drilldown-submenu-parent')) {
            e.stopImmediatePropagation();
            e.preventDefault();
          }

          // if(e.target !== e.currentTarget.firstElementChild){
          //   return false;
          // }
          _this._show($elem.parent('li'));

          if (_this.options.closeOnClick) {
            var $body = $('body');
            $body.off('.zf.drilldown').on('click.zf.drilldown', function (e) {
              if (e.target === _this.$element[0] || $.contains(_this.$element[0], e.target)) {
                return;
              }
              e.preventDefault();
              _this._hideAll();
              $body.off('.zf.drilldown');
            });
          }
        });
        this.$element.on('mutateme.zf.trigger', this._resize.bind(this));
      }

      /**
       * Adds event handlers to the menu element.
       * @function
       * @private
       */

    }, {
      key: '_registerEvents',
      value: function _registerEvents() {
        if (this.options.scrollTop) {
          this._bindHandler = this._scrollTop.bind(this);
          this.$element.on('open.zf.drilldown hide.zf.drilldown closed.zf.drilldown', this._bindHandler);
        }
      }

      /**
       * Scroll to Top of Element or data-scroll-top-element
       * @function
       * @fires Drilldown#scrollme
       */

    }, {
      key: '_scrollTop',
      value: function _scrollTop() {
        var _this = this;
        var $scrollTopElement = _this.options.scrollTopElement != '' ? $(_this.options.scrollTopElement) : _this.$element,
            scrollPos = parseInt($scrollTopElement.offset().top + _this.options.scrollTopOffset);
        $('html, body').stop(true).animate({ scrollTop: scrollPos }, _this.options.animationDuration, _this.options.animationEasing, function () {
          /**
            * Fires after the menu has scrolled
            * @event Drilldown#scrollme
            */
          if (this === $('html')[0]) _this.$element.trigger('scrollme.zf.drilldown');
        });
      }

      /**
       * Adds keydown event listener to `li`'s in the menu.
       * @private
       */

    }, {
      key: '_keyboardEvents',
      value: function _keyboardEvents() {
        var _this = this;

        this.$menuItems.add(this.$element.find('.js-drilldown-back > a, .is-submenu-parent-item > a')).on('keydown.zf.drilldown', function (e) {
          var $element = $(this),
              $elements = $element.parent('li').parent('ul').children('li').children('a'),
              $prevElement,
              $nextElement;

          $elements.each(function (i) {
            if ($(this).is($element)) {
              $prevElement = $elements.eq(Math.max(0, i - 1));
              $nextElement = $elements.eq(Math.min(i + 1, $elements.length - 1));
              return;
            }
          });

          Foundation.Keyboard.handleKey(e, 'Drilldown', {
            next: function next() {
              if ($element.is(_this.$submenuAnchors)) {
                _this._show($element.parent('li'));
                $element.parent('li').one(Foundation.transitionend($element), function () {
                  $element.parent('li').find('ul li a').filter(_this.$menuItems).first().focus();
                });
                return true;
              }
            },
            previous: function previous() {
              _this._hide($element.parent('li').parent('ul'));
              $element.parent('li').parent('ul').one(Foundation.transitionend($element), function () {
                setTimeout(function () {
                  $element.parent('li').parent('ul').parent('li').children('a').first().focus();
                }, 1);
              });
              return true;
            },
            up: function up() {
              $prevElement.focus();
              // Don't tap focus on first element in root ul
              return !$element.is(_this.$element.find('> li:first-child > a'));
            },
            down: function down() {
              $nextElement.focus();
              // Don't tap focus on last element in root ul
              return !$element.is(_this.$element.find('> li:last-child > a'));
            },
            close: function close() {
              // Don't close on element in root ul
              if (!$element.is(_this.$element.find('> li > a'))) {
                _this._hide($element.parent().parent());
                $element.parent().parent().siblings('a').focus();
              }
            },
            open: function open() {
              if (!$element.is(_this.$menuItems)) {
                // not menu item means back button
                _this._hide($element.parent('li').parent('ul'));
                $element.parent('li').parent('ul').one(Foundation.transitionend($element), function () {
                  setTimeout(function () {
                    $element.parent('li').parent('ul').parent('li').children('a').first().focus();
                  }, 1);
                });
                return true;
              } else if ($element.is(_this.$submenuAnchors)) {
                _this._show($element.parent('li'));
                $element.parent('li').one(Foundation.transitionend($element), function () {
                  $element.parent('li').find('ul li a').filter(_this.$menuItems).first().focus();
                });
                return true;
              }
            },
            handled: function handled(preventDefault) {
              if (preventDefault) {
                e.preventDefault();
              }
              e.stopImmediatePropagation();
            }
          });
        }); // end keyboardAccess
      }

      /**
       * Closes all open elements, and returns to root menu.
       * @function
       * @fires Drilldown#closed
       */

    }, {
      key: '_hideAll',
      value: function _hideAll() {
        var $elem = this.$element.find('.is-drilldown-submenu.is-active').addClass('is-closing');
        if (this.options.autoHeight) this.$wrapper.css({ height: $elem.parent().closest('ul').data('calcHeight') });
        $elem.one(Foundation.transitionend($elem), function (e) {
          $elem.removeClass('is-active is-closing');
        });
        /**
         * Fires when the menu is fully closed.
         * @event Drilldown#closed
         */
        this.$element.trigger('closed.zf.drilldown');
      }

      /**
       * Adds event listener for each `back` button, and closes open menus.
       * @function
       * @fires Drilldown#back
       * @param {jQuery} $elem - the current sub-menu to add `back` event.
       */

    }, {
      key: '_back',
      value: function _back($elem) {
        var _this = this;
        $elem.off('click.zf.drilldown');
        $elem.children('.js-drilldown-back').on('click.zf.drilldown', function (e) {
          e.stopImmediatePropagation();
          // console.log('mouseup on back');
          _this._hide($elem);

          // If there is a parent submenu, call show
          var parentSubMenu = $elem.parent('li').parent('ul').parent('li');
          if (parentSubMenu.length) {
            _this._show(parentSubMenu);
          }
        });
      }

      /**
       * Adds event listener to menu items w/o submenus to close open menus on click.
       * @function
       * @private
       */

    }, {
      key: '_menuLinkEvents',
      value: function _menuLinkEvents() {
        var _this = this;
        this.$menuItems.not('.is-drilldown-submenu-parent').off('click.zf.drilldown').on('click.zf.drilldown', function (e) {
          // e.stopImmediatePropagation();
          setTimeout(function () {
            _this._hideAll();
          }, 0);
        });
      }

      /**
       * Opens a submenu.
       * @function
       * @fires Drilldown#open
       * @param {jQuery} $elem - the current element with a submenu to open, i.e. the `li` tag.
       */

    }, {
      key: '_show',
      value: function _show($elem) {
        if (this.options.autoHeight) this.$wrapper.css({ height: $elem.children('[data-submenu]').data('calcHeight') });
        $elem.attr('aria-expanded', true);
        $elem.children('[data-submenu]').addClass('is-active').removeClass('invisible').attr('aria-hidden', false);
        /**
         * Fires when the submenu has opened.
         * @event Drilldown#open
         */
        this.$element.trigger('open.zf.drilldown', [$elem]);
      }
    }, {
      key: '_hide',


      /**
       * Hides a submenu
       * @function
       * @fires Drilldown#hide
       * @param {jQuery} $elem - the current sub-menu to hide, i.e. the `ul` tag.
       */
      value: function _hide($elem) {
        if (this.options.autoHeight) this.$wrapper.css({ height: $elem.parent().closest('ul').data('calcHeight') });
        var _this = this;
        $elem.parent('li').attr('aria-expanded', false);
        $elem.attr('aria-hidden', true).addClass('is-closing');
        $elem.addClass('is-closing').one(Foundation.transitionend($elem), function () {
          $elem.removeClass('is-active is-closing');
          $elem.blur().addClass('invisible');
        });
        /**
         * Fires when the submenu has closed.
         * @event Drilldown#hide
         */
        $elem.trigger('hide.zf.drilldown', [$elem]);
      }

      /**
       * Iterates through the nested menus to calculate the min-height, and max-width for the menu.
       * Prevents content jumping.
       * @function
       * @private
       */

    }, {
      key: '_getMaxDims',
      value: function _getMaxDims() {
        var maxHeight = 0,
            result = {},
            _this = this;
        this.$submenus.add(this.$element).each(function () {
          var numOfElems = $(this).children('li').length;
          var height = Foundation.Box.GetDimensions(this).height;
          maxHeight = height > maxHeight ? height : maxHeight;
          if (_this.options.autoHeight) {
            $(this).data('calcHeight', height);
            if (!$(this).hasClass('is-drilldown-submenu')) result['height'] = height;
          }
        });

        if (!this.options.autoHeight) result['min-height'] = maxHeight + 'px';

        result['max-width'] = this.$element[0].getBoundingClientRect().width + 'px';

        return result;
      }

      /**
       * Destroys the Drilldown Menu
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        if (this.options.scrollTop) this.$element.off('.zf.drilldown', this._bindHandler);
        this._hideAll();
        this.$element.off('mutateme.zf.trigger');
        Foundation.Nest.Burn(this.$element, 'drilldown');
        this.$element.unwrap().find('.js-drilldown-back, .is-submenu-parent-item').remove().end().find('.is-active, .is-closing, .is-drilldown-submenu').removeClass('is-active is-closing is-drilldown-submenu').end().find('[data-submenu]').removeAttr('aria-hidden tabindex role');
        this.$submenuAnchors.each(function () {
          $(this).off('.zf.drilldown');
        });

        this.$submenus.removeClass('drilldown-submenu-cover-previous');

        this.$element.find('a').each(function () {
          var $link = $(this);
          $link.removeAttr('tabindex');
          if ($link.data('savedHref')) {
            $link.attr('href', $link.data('savedHref')).removeData('savedHref');
          } else {
            return;
          }
        });
        Foundation.unregisterPlugin(this);
      }
    }]);

    return Drilldown;
  }();

  Drilldown.defaults = {
    /**
     * Markup used for JS generated back button. Prepended  or appended (see backButtonPosition) to submenu lists and deleted on `destroy` method, 'js-drilldown-back' class required. Remove the backslash (`\`) if copy and pasting.
     * @option
     * @type {string}
     * @default '<li class="js-drilldown-back"><a tabindex="0">Back</a></li>'
     */
    backButton: '<li class="js-drilldown-back"><a tabindex="0">Back</a></li>',
    /**
     * Position the back button either at the top or bottom of drilldown submenus. Can be `'left'` or `'bottom'`.
     * @option
     * @type {string}
     * @default top
     */
    backButtonPosition: 'top',
    /**
     * Markup used to wrap drilldown menu. Use a class name for independent styling; the JS applied class: `is-drilldown` is required. Remove the backslash (`\`) if copy and pasting.
     * @option
     * @type {string}
     * @default '<div></div>'
     */
    wrapper: '<div></div>',
    /**
     * Adds the parent link to the submenu.
     * @option
     * @type {boolean}
     * @default false
     */
    parentLink: false,
    /**
     * Allow the menu to return to root list on body click.
     * @option
     * @type {boolean}
     * @default false
     */
    closeOnClick: false,
    /**
     * Allow the menu to auto adjust height.
     * @option
     * @type {boolean}
     * @default false
     */
    autoHeight: false,
    /**
     * Animate the auto adjust height.
     * @option
     * @type {boolean}
     * @default false
     */
    animateHeight: false,
    /**
     * Scroll to the top of the menu after opening a submenu or navigating back using the menu back button
     * @option
     * @type {boolean}
     * @default false
     */
    scrollTop: false,
    /**
     * String jquery selector (for example 'body') of element to take offset().top from, if empty string the drilldown menu offset().top is taken
     * @option
     * @type {string}
     * @default ''
     */
    scrollTopElement: '',
    /**
     * ScrollTop offset
     * @option
     * @type {number}
     * @default 0
     */
    scrollTopOffset: 0,
    /**
     * Scroll animation duration
     * @option
     * @type {number}
     * @default 500
     */
    animationDuration: 500,
    /**
     * Scroll animation easing. Can be `'swing'` or `'linear'`.
     * @option
     * @type {string}
     * @see {@link https://api.jquery.com/animate|JQuery animate}
     * @default 'swing'
     */
    animationEasing: 'swing'
    // holdOpen: false
  };

  // Window exports
  Foundation.plugin(Drilldown, 'Drilldown');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Dropdown module.
   * @module foundation.dropdown
   * @requires foundation.util.keyboard
   * @requires foundation.util.box
   * @requires foundation.util.triggers
   */

  var Dropdown = function () {
    /**
     * Creates a new instance of a dropdown.
     * @class
     * @param {jQuery} element - jQuery object to make into a dropdown.
     *        Object should be of the dropdown panel, rather than its anchor.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function Dropdown(element, options) {
      _classCallCheck(this, Dropdown);

      this.$element = element;
      this.options = $.extend({}, Dropdown.defaults, this.$element.data(), options);
      this._init();

      Foundation.registerPlugin(this, 'Dropdown');
      Foundation.Keyboard.register('Dropdown', {
        'ENTER': 'open',
        'SPACE': 'open',
        'ESCAPE': 'close'
      });
    }

    /**
     * Initializes the plugin by setting/checking options and attributes, adding helper variables, and saving the anchor.
     * @function
     * @private
     */


    _createClass(Dropdown, [{
      key: '_init',
      value: function _init() {
        var $id = this.$element.attr('id');

        this.$anchor = $('[data-toggle="' + $id + '"]').length ? $('[data-toggle="' + $id + '"]') : $('[data-open="' + $id + '"]');
        this.$anchor.attr({
          'aria-controls': $id,
          'data-is-focus': false,
          'data-yeti-box': $id,
          'aria-haspopup': true,
          'aria-expanded': false

        });

        if (this.options.parentClass) {
          this.$parent = this.$element.parents('.' + this.options.parentClass);
        } else {
          this.$parent = null;
        }
        this.options.positionClass = this.getPositionClass();
        this.counter = 4;
        this.usedPositions = [];
        this.$element.attr({
          'aria-hidden': 'true',
          'data-yeti-box': $id,
          'data-resize': $id,
          'aria-labelledby': this.$anchor[0].id || Foundation.GetYoDigits(6, 'dd-anchor')
        });
        this._events();
      }

      /**
       * Helper function to determine current orientation of dropdown pane.
       * @function
       * @returns {String} position - string value of a position class.
       */

    }, {
      key: 'getPositionClass',
      value: function getPositionClass() {
        var verticalPosition = this.$element[0].className.match(/(top|left|right|bottom)/g);
        verticalPosition = verticalPosition ? verticalPosition[0] : '';
        var horizontalPosition = /float-(\S+)/.exec(this.$anchor[0].className);
        horizontalPosition = horizontalPosition ? horizontalPosition[1] : '';
        var position = horizontalPosition ? horizontalPosition + ' ' + verticalPosition : verticalPosition;

        return position;
      }

      /**
       * Adjusts the dropdown panes orientation by adding/removing positioning classes.
       * @function
       * @private
       * @param {String} position - position class to remove.
       */

    }, {
      key: '_reposition',
      value: function _reposition(position) {
        this.usedPositions.push(position ? position : 'bottom');
        //default, try switching to opposite side
        if (!position && this.usedPositions.indexOf('top') < 0) {
          this.$element.addClass('top');
        } else if (position === 'top' && this.usedPositions.indexOf('bottom') < 0) {
          this.$element.removeClass(position);
        } else if (position === 'left' && this.usedPositions.indexOf('right') < 0) {
          this.$element.removeClass(position).addClass('right');
        } else if (position === 'right' && this.usedPositions.indexOf('left') < 0) {
          this.$element.removeClass(position).addClass('left');
        }

        //if default change didn't work, try bottom or left first
        else if (!position && this.usedPositions.indexOf('top') > -1 && this.usedPositions.indexOf('left') < 0) {
            this.$element.addClass('left');
          } else if (position === 'top' && this.usedPositions.indexOf('bottom') > -1 && this.usedPositions.indexOf('left') < 0) {
            this.$element.removeClass(position).addClass('left');
          } else if (position === 'left' && this.usedPositions.indexOf('right') > -1 && this.usedPositions.indexOf('bottom') < 0) {
            this.$element.removeClass(position);
          } else if (position === 'right' && this.usedPositions.indexOf('left') > -1 && this.usedPositions.indexOf('bottom') < 0) {
            this.$element.removeClass(position);
          }
          //if nothing cleared, set to bottom
          else {
              this.$element.removeClass(position);
            }
        this.classChanged = true;
        this.counter--;
      }

      /**
       * Sets the position and orientation of the dropdown pane, checks for collisions.
       * Recursively calls itself if a collision is detected, with a new position class.
       * @function
       * @private
       */

    }, {
      key: '_setPosition',
      value: function _setPosition() {
        if (this.$anchor.attr('aria-expanded') === 'false') {
          return false;
        }
        var position = this.getPositionClass(),
            $eleDims = Foundation.Box.GetDimensions(this.$element),
            $anchorDims = Foundation.Box.GetDimensions(this.$anchor),
            _this = this,
            direction = position === 'left' ? 'left' : position === 'right' ? 'left' : 'top',
            param = direction === 'top' ? 'height' : 'width',
            offset = param === 'height' ? this.options.vOffset : this.options.hOffset;

        if ($eleDims.width >= $eleDims.windowDims.width || !this.counter && !Foundation.Box.ImNotTouchingYou(this.$element, this.$parent)) {
          var newWidth = $eleDims.windowDims.width,
              parentHOffset = 0;
          if (this.$parent) {
            var $parentDims = Foundation.Box.GetDimensions(this.$parent),
                parentHOffset = $parentDims.offset.left;
            if ($parentDims.width < newWidth) {
              newWidth = $parentDims.width;
            }
          }

          this.$element.offset(Foundation.Box.GetOffsets(this.$element, this.$anchor, 'center bottom', this.options.vOffset, this.options.hOffset + parentHOffset, true)).css({
            'width': newWidth - this.options.hOffset * 2,
            'height': 'auto'
          });
          this.classChanged = true;
          return false;
        }

        this.$element.offset(Foundation.Box.GetOffsets(this.$element, this.$anchor, position, this.options.vOffset, this.options.hOffset));

        while (!Foundation.Box.ImNotTouchingYou(this.$element, this.$parent, true) && this.counter) {
          this._reposition(position);
          this._setPosition();
        }
      }

      /**
       * Adds event listeners to the element utilizing the triggers utility library.
       * @function
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this;
        this.$element.on({
          'open.zf.trigger': this.open.bind(this),
          'close.zf.trigger': this.close.bind(this),
          'toggle.zf.trigger': this.toggle.bind(this),
          'resizeme.zf.trigger': this._setPosition.bind(this)
        });

        if (this.options.hover) {
          this.$anchor.off('mouseenter.zf.dropdown mouseleave.zf.dropdown').on('mouseenter.zf.dropdown', function () {
            var bodyData = $('body').data();
            if (typeof bodyData.whatinput === 'undefined' || bodyData.whatinput === 'mouse') {
              clearTimeout(_this.timeout);
              _this.timeout = setTimeout(function () {
                _this.open();
                _this.$anchor.data('hover', true);
              }, _this.options.hoverDelay);
            }
          }).on('mouseleave.zf.dropdown', function () {
            clearTimeout(_this.timeout);
            _this.timeout = setTimeout(function () {
              _this.close();
              _this.$anchor.data('hover', false);
            }, _this.options.hoverDelay);
          });
          if (this.options.hoverPane) {
            this.$element.off('mouseenter.zf.dropdown mouseleave.zf.dropdown').on('mouseenter.zf.dropdown', function () {
              clearTimeout(_this.timeout);
            }).on('mouseleave.zf.dropdown', function () {
              clearTimeout(_this.timeout);
              _this.timeout = setTimeout(function () {
                _this.close();
                _this.$anchor.data('hover', false);
              }, _this.options.hoverDelay);
            });
          }
        }
        this.$anchor.add(this.$element).on('keydown.zf.dropdown', function (e) {

          var $target = $(this),
              visibleFocusableElements = Foundation.Keyboard.findFocusable(_this.$element);

          Foundation.Keyboard.handleKey(e, 'Dropdown', {
            open: function open() {
              if ($target.is(_this.$anchor)) {
                _this.open();
                _this.$element.attr('tabindex', -1).focus();
                e.preventDefault();
              }
            },
            close: function close() {
              _this.close();
              _this.$anchor.focus();
            }
          });
        });
      }

      /**
       * Adds an event handler to the body to close any dropdowns on a click.
       * @function
       * @private
       */

    }, {
      key: '_addBodyHandler',
      value: function _addBodyHandler() {
        var $body = $(document.body).not(this.$element),
            _this = this;
        $body.off('click.zf.dropdown').on('click.zf.dropdown', function (e) {
          if (_this.$anchor.is(e.target) || _this.$anchor.find(e.target).length) {
            return;
          }
          if (_this.$element.find(e.target).length) {
            return;
          }
          _this.close();
          $body.off('click.zf.dropdown');
        });
      }

      /**
       * Opens the dropdown pane, and fires a bubbling event to close other dropdowns.
       * @function
       * @fires Dropdown#closeme
       * @fires Dropdown#show
       */

    }, {
      key: 'open',
      value: function open() {
        // var _this = this;
        /**
         * Fires to close other open dropdowns, typically when dropdown is opening
         * @event Dropdown#closeme
         */
        this.$element.trigger('closeme.zf.dropdown', this.$element.attr('id'));
        this.$anchor.addClass('hover').attr({ 'aria-expanded': true });
        // this.$element/*.show()*/;
        this._setPosition();
        this.$element.addClass('is-open').attr({ 'aria-hidden': false });

        if (this.options.autoFocus) {
          var $focusable = Foundation.Keyboard.findFocusable(this.$element);
          if ($focusable.length) {
            $focusable.eq(0).focus();
          }
        }

        if (this.options.closeOnClick) {
          this._addBodyHandler();
        }

        if (this.options.trapFocus) {
          Foundation.Keyboard.trapFocus(this.$element);
        }

        /**
         * Fires once the dropdown is visible.
         * @event Dropdown#show
         */
        this.$element.trigger('show.zf.dropdown', [this.$element]);
      }

      /**
       * Closes the open dropdown pane.
       * @function
       * @fires Dropdown#hide
       */

    }, {
      key: 'close',
      value: function close() {
        if (!this.$element.hasClass('is-open')) {
          return false;
        }
        this.$element.removeClass('is-open').attr({ 'aria-hidden': true });

        this.$anchor.removeClass('hover').attr('aria-expanded', false);

        if (this.classChanged) {
          var curPositionClass = this.getPositionClass();
          if (curPositionClass) {
            this.$element.removeClass(curPositionClass);
          }
          this.$element.addClass(this.options.positionClass
          /*.hide()*/).css({ height: '', width: '' });
          this.classChanged = false;
          this.counter = 4;
          this.usedPositions.length = 0;
        }
        /**
         * Fires once the dropdown is no longer visible.
         * @event Dropdown#hide
         */
        this.$element.trigger('hide.zf.dropdown', [this.$element]);

        if (this.options.trapFocus) {
          Foundation.Keyboard.releaseFocus(this.$element);
        }
      }

      /**
       * Toggles the dropdown pane's visibility.
       * @function
       */

    }, {
      key: 'toggle',
      value: function toggle() {
        if (this.$element.hasClass('is-open')) {
          if (this.$anchor.data('hover')) return;
          this.close();
        } else {
          this.open();
        }
      }

      /**
       * Destroys the dropdown.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.$element.off('.zf.trigger').hide();
        this.$anchor.off('.zf.dropdown');

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Dropdown;
  }();

  Dropdown.defaults = {
    /**
     * Class that designates bounding container of Dropdown (default: window)
     * @option
     * @type {?string}
     * @default null
     */
    parentClass: null,
    /**
     * Amount of time to delay opening a submenu on hover event.
     * @option
     * @type {number}
     * @default 250
     */
    hoverDelay: 250,
    /**
     * Allow submenus to open on hover events
     * @option
     * @type {boolean}
     * @default false
     */
    hover: false,
    /**
     * Don't close dropdown when hovering over dropdown pane
     * @option
     * @type {boolean}
     * @default false
     */
    hoverPane: false,
    /**
     * Number of pixels between the dropdown pane and the triggering element on open.
     * @option
     * @type {number}
     * @default 1
     */
    vOffset: 1,
    /**
     * Number of pixels between the dropdown pane and the triggering element on open.
     * @option
     * @type {number}
     * @default 1
     */
    hOffset: 1,
    /**
     * Class applied to adjust open position. JS will test and fill this in.
     * @option
     * @type {string}
     * @default ''
     */
    positionClass: '',
    /**
     * Allow the plugin to trap focus to the dropdown pane if opened with keyboard commands.
     * @option
     * @type {boolean}
     * @default false
     */
    trapFocus: false,
    /**
     * Allow the plugin to set focus to the first focusable element within the pane, regardless of method of opening.
     * @option
     * @type {boolean}
     * @default false
     */
    autoFocus: false,
    /**
     * Allows a click on the body to close the dropdown.
     * @option
     * @type {boolean}
     * @default false
     */
    closeOnClick: false

    // Window exports
  };Foundation.plugin(Dropdown, 'Dropdown');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * DropdownMenu module.
   * @module foundation.dropdown-menu
   * @requires foundation.util.keyboard
   * @requires foundation.util.box
   * @requires foundation.util.nest
   */

  var DropdownMenu = function () {
    /**
     * Creates a new instance of DropdownMenu.
     * @class
     * @fires DropdownMenu#init
     * @param {jQuery} element - jQuery object to make into a dropdown menu.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function DropdownMenu(element, options) {
      _classCallCheck(this, DropdownMenu);

      this.$element = element;
      this.options = $.extend({}, DropdownMenu.defaults, this.$element.data(), options);

      Foundation.Nest.Feather(this.$element, 'dropdown');
      this._init();

      Foundation.registerPlugin(this, 'DropdownMenu');
      Foundation.Keyboard.register('DropdownMenu', {
        'ENTER': 'open',
        'SPACE': 'open',
        'ARROW_RIGHT': 'next',
        'ARROW_UP': 'up',
        'ARROW_DOWN': 'down',
        'ARROW_LEFT': 'previous',
        'ESCAPE': 'close'
      });
    }

    /**
     * Initializes the plugin, and calls _prepareMenu
     * @private
     * @function
     */


    _createClass(DropdownMenu, [{
      key: '_init',
      value: function _init() {
        var subs = this.$element.find('li.is-dropdown-submenu-parent');
        this.$element.children('.is-dropdown-submenu-parent').children('.is-dropdown-submenu').addClass('first-sub');

        this.$menuItems = this.$element.find('[role="menuitem"]');
        this.$tabs = this.$element.children('[role="menuitem"]');
        this.$tabs.find('ul.is-dropdown-submenu').addClass(this.options.verticalClass);

        if (this.$element.hasClass(this.options.rightClass) || this.options.alignment === 'right' || Foundation.rtl() || this.$element.parents('.top-bar-right').is('*')) {
          this.options.alignment = 'right';
          subs.addClass('opens-left');
        } else {
          subs.addClass('opens-right');
        }
        this.changed = false;
        this._events();
      }
    }, {
      key: '_isVertical',
      value: function _isVertical() {
        return this.$tabs.css('display') === 'block';
      }

      /**
       * Adds event listeners to elements within the menu
       * @private
       * @function
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this,
            hasTouch = 'ontouchstart' in window || typeof window.ontouchstart !== 'undefined',
            parClass = 'is-dropdown-submenu-parent';

        // used for onClick and in the keyboard handlers
        var handleClickFn = function handleClickFn(e) {
          var $elem = $(e.target).parentsUntil('ul', '.' + parClass),
              hasSub = $elem.hasClass(parClass),
              hasClicked = $elem.attr('data-is-click') === 'true',
              $sub = $elem.children('.is-dropdown-submenu');

          if (hasSub) {
            if (hasClicked) {
              if (!_this.options.closeOnClick || !_this.options.clickOpen && !hasTouch || _this.options.forceFollow && hasTouch) {
                return;
              } else {
                e.stopImmediatePropagation();
                e.preventDefault();
                _this._hide($elem);
              }
            } else {
              e.preventDefault();
              e.stopImmediatePropagation();
              _this._show($sub);
              $elem.add($elem.parentsUntil(_this.$element, '.' + parClass)).attr('data-is-click', true);
            }
          }
        };

        if (this.options.clickOpen || hasTouch) {
          this.$menuItems.on('click.zf.dropdownmenu touchstart.zf.dropdownmenu', handleClickFn);
        }

        // Handle Leaf element Clicks
        if (_this.options.closeOnClickInside) {
          this.$menuItems.on('click.zf.dropdownmenu', function (e) {
            var $elem = $(this),
                hasSub = $elem.hasClass(parClass);
            if (!hasSub) {
              _this._hide();
            }
          });
        }

        if (!this.options.disableHover) {
          this.$menuItems.on('mouseenter.zf.dropdownmenu', function (e) {
            var $elem = $(this),
                hasSub = $elem.hasClass(parClass);

            if (hasSub) {
              clearTimeout($elem.data('_delay'));
              $elem.data('_delay', setTimeout(function () {
                _this._show($elem.children('.is-dropdown-submenu'));
              }, _this.options.hoverDelay));
            }
          }).on('mouseleave.zf.dropdownmenu', function (e) {
            var $elem = $(this),
                hasSub = $elem.hasClass(parClass);
            if (hasSub && _this.options.autoclose) {
              if ($elem.attr('data-is-click') === 'true' && _this.options.clickOpen) {
                return false;
              }

              clearTimeout($elem.data('_delay'));
              $elem.data('_delay', setTimeout(function () {
                _this._hide($elem);
              }, _this.options.closingTime));
            }
          });
        }
        this.$menuItems.on('keydown.zf.dropdownmenu', function (e) {
          var $element = $(e.target).parentsUntil('ul', '[role="menuitem"]'),
              isTab = _this.$tabs.index($element) > -1,
              $elements = isTab ? _this.$tabs : $element.siblings('li').add($element),
              $prevElement,
              $nextElement;

          $elements.each(function (i) {
            if ($(this).is($element)) {
              $prevElement = $elements.eq(i - 1);
              $nextElement = $elements.eq(i + 1);
              return;
            }
          });

          var nextSibling = function nextSibling() {
            if (!$element.is(':last-child')) {
              $nextElement.children('a:first').focus();
              e.preventDefault();
            }
          },
              prevSibling = function prevSibling() {
            $prevElement.children('a:first').focus();
            e.preventDefault();
          },
              openSub = function openSub() {
            var $sub = $element.children('ul.is-dropdown-submenu');
            if ($sub.length) {
              _this._show($sub);
              $element.find('li > a:first').focus();
              e.preventDefault();
            } else {
              return;
            }
          },
              closeSub = function closeSub() {
            //if ($element.is(':first-child')) {
            var close = $element.parent('ul').parent('li');
            close.children('a:first').focus();
            _this._hide(close);
            e.preventDefault();
            //}
          };
          var functions = {
            open: openSub,
            close: function close() {
              _this._hide(_this.$element);
              _this.$menuItems.find('a:first').focus(); // focus to first element
              e.preventDefault();
            },
            handled: function handled() {
              e.stopImmediatePropagation();
            }
          };

          if (isTab) {
            if (_this._isVertical()) {
              // vertical menu
              if (Foundation.rtl()) {
                // right aligned
                $.extend(functions, {
                  down: nextSibling,
                  up: prevSibling,
                  next: closeSub,
                  previous: openSub
                });
              } else {
                // left aligned
                $.extend(functions, {
                  down: nextSibling,
                  up: prevSibling,
                  next: openSub,
                  previous: closeSub
                });
              }
            } else {
              // horizontal menu
              if (Foundation.rtl()) {
                // right aligned
                $.extend(functions, {
                  next: prevSibling,
                  previous: nextSibling,
                  down: openSub,
                  up: closeSub
                });
              } else {
                // left aligned
                $.extend(functions, {
                  next: nextSibling,
                  previous: prevSibling,
                  down: openSub,
                  up: closeSub
                });
              }
            }
          } else {
            // not tabs -> one sub
            if (Foundation.rtl()) {
              // right aligned
              $.extend(functions, {
                next: closeSub,
                previous: openSub,
                down: nextSibling,
                up: prevSibling
              });
            } else {
              // left aligned
              $.extend(functions, {
                next: openSub,
                previous: closeSub,
                down: nextSibling,
                up: prevSibling
              });
            }
          }
          Foundation.Keyboard.handleKey(e, 'DropdownMenu', functions);
        });
      }

      /**
       * Adds an event handler to the body to close any dropdowns on a click.
       * @function
       * @private
       */

    }, {
      key: '_addBodyHandler',
      value: function _addBodyHandler() {
        var $body = $(document.body),
            _this = this;
        $body.off('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu').on('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu', function (e) {
          var $link = _this.$element.find(e.target);
          if ($link.length) {
            return;
          }

          _this._hide();
          $body.off('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu');
        });
      }

      /**
       * Opens a dropdown pane, and checks for collisions first.
       * @param {jQuery} $sub - ul element that is a submenu to show
       * @function
       * @private
       * @fires DropdownMenu#show
       */

    }, {
      key: '_show',
      value: function _show($sub) {
        var idx = this.$tabs.index(this.$tabs.filter(function (i, el) {
          return $(el).find($sub).length > 0;
        }));
        var $sibs = $sub.parent('li.is-dropdown-submenu-parent').siblings('li.is-dropdown-submenu-parent');
        this._hide($sibs, idx);
        $sub.css('visibility', 'hidden').addClass('js-dropdown-active').parent('li.is-dropdown-submenu-parent').addClass('is-active');
        var clear = Foundation.Box.ImNotTouchingYou($sub, null, true);
        if (!clear) {
          var oldClass = this.options.alignment === 'left' ? '-right' : '-left',
              $parentLi = $sub.parent('.is-dropdown-submenu-parent');
          $parentLi.removeClass('opens' + oldClass).addClass('opens-' + this.options.alignment);
          clear = Foundation.Box.ImNotTouchingYou($sub, null, true);
          if (!clear) {
            $parentLi.removeClass('opens-' + this.options.alignment).addClass('opens-inner');
          }
          this.changed = true;
        }
        $sub.css('visibility', '');
        if (this.options.closeOnClick) {
          this._addBodyHandler();
        }
        /**
         * Fires when the new dropdown pane is visible.
         * @event DropdownMenu#show
         */
        this.$element.trigger('show.zf.dropdownmenu', [$sub]);
      }

      /**
       * Hides a single, currently open dropdown pane, if passed a parameter, otherwise, hides everything.
       * @function
       * @param {jQuery} $elem - element with a submenu to hide
       * @param {Number} idx - index of the $tabs collection to hide
       * @private
       */

    }, {
      key: '_hide',
      value: function _hide($elem, idx) {
        var $toClose;
        if ($elem && $elem.length) {
          $toClose = $elem;
        } else if (idx !== undefined) {
          $toClose = this.$tabs.not(function (i, el) {
            return i === idx;
          });
        } else {
          $toClose = this.$element;
        }
        var somethingToClose = $toClose.hasClass('is-active') || $toClose.find('.is-active').length > 0;

        if (somethingToClose) {
          $toClose.find('li.is-active').add($toClose).attr({
            'data-is-click': false
          }).removeClass('is-active');

          $toClose.find('ul.js-dropdown-active').removeClass('js-dropdown-active');

          if (this.changed || $toClose.find('opens-inner').length) {
            var oldClass = this.options.alignment === 'left' ? 'right' : 'left';
            $toClose.find('li.is-dropdown-submenu-parent').add($toClose).removeClass('opens-inner opens-' + this.options.alignment).addClass('opens-' + oldClass);
            this.changed = false;
          }
          /**
           * Fires when the open menus are closed.
           * @event DropdownMenu#hide
           */
          this.$element.trigger('hide.zf.dropdownmenu', [$toClose]);
        }
      }

      /**
       * Destroys the plugin.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.$menuItems.off('.zf.dropdownmenu').removeAttr('data-is-click').removeClass('is-right-arrow is-left-arrow is-down-arrow opens-right opens-left opens-inner');
        $(document.body).off('.zf.dropdownmenu');
        Foundation.Nest.Burn(this.$element, 'dropdown');
        Foundation.unregisterPlugin(this);
      }
    }]);

    return DropdownMenu;
  }();

  /**
   * Default settings for plugin
   */


  DropdownMenu.defaults = {
    /**
     * Disallows hover events from opening submenus
     * @option
     * @type {boolean}
     * @default false
     */
    disableHover: false,
    /**
     * Allow a submenu to automatically close on a mouseleave event, if not clicked open.
     * @option
     * @type {boolean}
     * @default true
     */
    autoclose: true,
    /**
     * Amount of time to delay opening a submenu on hover event.
     * @option
     * @type {number}
     * @default 50
     */
    hoverDelay: 50,
    /**
     * Allow a submenu to open/remain open on parent click event. Allows cursor to move away from menu.
     * @option
     * @type {boolean}
     * @default false
     */
    clickOpen: false,
    /**
     * Amount of time to delay closing a submenu on a mouseleave event.
     * @option
     * @type {number}
     * @default 500
     */

    closingTime: 500,
    /**
     * Position of the menu relative to what direction the submenus should open. Handled by JS. Can be `'left'` or `'right'`.
     * @option
     * @type {string}
     * @default 'left'
     */
    alignment: 'left',
    /**
     * Allow clicks on the body to close any open submenus.
     * @option
     * @type {boolean}
     * @default true
     */
    closeOnClick: true,
    /**
     * Allow clicks on leaf anchor links to close any open submenus.
     * @option
     * @type {boolean}
     * @default true
     */
    closeOnClickInside: true,
    /**
     * Class applied to vertical oriented menus, Foundation default is `vertical`. Update this if using your own class.
     * @option
     * @type {string}
     * @default 'vertical'
     */
    verticalClass: 'vertical',
    /**
     * Class applied to right-side oriented menus, Foundation default is `align-right`. Update this if using your own class.
     * @option
     * @type {string}
     * @default 'align-right'
     */
    rightClass: 'align-right',
    /**
     * Boolean to force overide the clicking of links to perform default action, on second touch event for mobile.
     * @option
     * @type {boolean}
     * @default true
     */
    forceFollow: true
  };

  // Window exports
  Foundation.plugin(DropdownMenu, 'DropdownMenu');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Equalizer module.
   * @module foundation.equalizer
   * @requires foundation.util.mediaQuery
   * @requires foundation.util.timerAndImageLoader if equalizer contains images
   */

  var Equalizer = function () {
    /**
     * Creates a new instance of Equalizer.
     * @class
     * @fires Equalizer#init
     * @param {Object} element - jQuery object to add the trigger to.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function Equalizer(element, options) {
      _classCallCheck(this, Equalizer);

      this.$element = element;
      this.options = $.extend({}, Equalizer.defaults, this.$element.data(), options);

      this._init();

      Foundation.registerPlugin(this, 'Equalizer');
    }

    /**
     * Initializes the Equalizer plugin and calls functions to get equalizer functioning on load.
     * @private
     */


    _createClass(Equalizer, [{
      key: '_init',
      value: function _init() {
        var eqId = this.$element.attr('data-equalizer') || '';
        var $watched = this.$element.find('[data-equalizer-watch="' + eqId + '"]');

        this.$watched = $watched.length ? $watched : this.$element.find('[data-equalizer-watch]');
        this.$element.attr('data-resize', eqId || Foundation.GetYoDigits(6, 'eq'));
        this.$element.attr('data-mutate', eqId || Foundation.GetYoDigits(6, 'eq'));

        this.hasNested = this.$element.find('[data-equalizer]').length > 0;
        this.isNested = this.$element.parentsUntil(document.body, '[data-equalizer]').length > 0;
        this.isOn = false;
        this._bindHandler = {
          onResizeMeBound: this._onResizeMe.bind(this),
          onPostEqualizedBound: this._onPostEqualized.bind(this)
        };

        var imgs = this.$element.find('img');
        var tooSmall;
        if (this.options.equalizeOn) {
          tooSmall = this._checkMQ();
          $(window).on('changed.zf.mediaquery', this._checkMQ.bind(this));
        } else {
          this._events();
        }
        if (tooSmall !== undefined && tooSmall === false || tooSmall === undefined) {
          if (imgs.length) {
            Foundation.onImagesLoaded(imgs, this._reflow.bind(this));
          } else {
            this._reflow();
          }
        }
      }

      /**
       * Removes event listeners if the breakpoint is too small.
       * @private
       */

    }, {
      key: '_pauseEvents',
      value: function _pauseEvents() {
        this.isOn = false;
        this.$element.off({
          '.zf.equalizer': this._bindHandler.onPostEqualizedBound,
          'resizeme.zf.trigger': this._bindHandler.onResizeMeBound,
          'mutateme.zf.trigger': this._bindHandler.onResizeMeBound
        });
      }

      /**
       * function to handle $elements resizeme.zf.trigger, with bound this on _bindHandler.onResizeMeBound
       * @private
       */

    }, {
      key: '_onResizeMe',
      value: function _onResizeMe(e) {
        this._reflow();
      }

      /**
       * function to handle $elements postequalized.zf.equalizer, with bound this on _bindHandler.onPostEqualizedBound
       * @private
       */

    }, {
      key: '_onPostEqualized',
      value: function _onPostEqualized(e) {
        if (e.target !== this.$element[0]) {
          this._reflow();
        }
      }

      /**
       * Initializes events for Equalizer.
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this;
        this._pauseEvents();
        if (this.hasNested) {
          this.$element.on('postequalized.zf.equalizer', this._bindHandler.onPostEqualizedBound);
        } else {
          this.$element.on('resizeme.zf.trigger', this._bindHandler.onResizeMeBound);
          this.$element.on('mutateme.zf.trigger', this._bindHandler.onResizeMeBound);
        }
        this.isOn = true;
      }

      /**
       * Checks the current breakpoint to the minimum required size.
       * @private
       */

    }, {
      key: '_checkMQ',
      value: function _checkMQ() {
        var tooSmall = !Foundation.MediaQuery.is(this.options.equalizeOn);
        if (tooSmall) {
          if (this.isOn) {
            this._pauseEvents();
            this.$watched.css('height', 'auto');
          }
        } else {
          if (!this.isOn) {
            this._events();
          }
        }
        return tooSmall;
      }

      /**
       * A noop version for the plugin
       * @private
       */

    }, {
      key: '_killswitch',
      value: function _killswitch() {
        return;
      }

      /**
       * Calls necessary functions to update Equalizer upon DOM change
       * @private
       */

    }, {
      key: '_reflow',
      value: function _reflow() {
        if (!this.options.equalizeOnStack) {
          if (this._isStacked()) {
            this.$watched.css('height', 'auto');
            return false;
          }
        }
        if (this.options.equalizeByRow) {
          this.getHeightsByRow(this.applyHeightByRow.bind(this));
        } else {
          this.getHeights(this.applyHeight.bind(this));
        }
      }

      /**
       * Manually determines if the first 2 elements are *NOT* stacked.
       * @private
       */

    }, {
      key: '_isStacked',
      value: function _isStacked() {
        if (!this.$watched[0] || !this.$watched[1]) {
          return true;
        }
        return this.$watched[0].getBoundingClientRect().top !== this.$watched[1].getBoundingClientRect().top;
      }

      /**
       * Finds the outer heights of children contained within an Equalizer parent and returns them in an array
       * @param {Function} cb - A non-optional callback to return the heights array to.
       * @returns {Array} heights - An array of heights of children within Equalizer container
       */

    }, {
      key: 'getHeights',
      value: function getHeights(cb) {
        var heights = [];
        for (var i = 0, len = this.$watched.length; i < len; i++) {
          this.$watched[i].style.height = 'auto';
          heights.push(this.$watched[i].offsetHeight);
        }
        cb(heights);
      }

      /**
       * Finds the outer heights of children contained within an Equalizer parent and returns them in an array
       * @param {Function} cb - A non-optional callback to return the heights array to.
       * @returns {Array} groups - An array of heights of children within Equalizer container grouped by row with element,height and max as last child
       */

    }, {
      key: 'getHeightsByRow',
      value: function getHeightsByRow(cb) {
        var lastElTopOffset = this.$watched.length ? this.$watched.first().offset().top : 0,
            groups = [],
            group = 0;
        //group by Row
        groups[group] = [];
        for (var i = 0, len = this.$watched.length; i < len; i++) {
          this.$watched[i].style.height = 'auto';
          //maybe could use this.$watched[i].offsetTop
          var elOffsetTop = $(this.$watched[i]).offset().top;
          if (elOffsetTop != lastElTopOffset) {
            group++;
            groups[group] = [];
            lastElTopOffset = elOffsetTop;
          }
          groups[group].push([this.$watched[i], this.$watched[i].offsetHeight]);
        }

        for (var j = 0, ln = groups.length; j < ln; j++) {
          var heights = $(groups[j]).map(function () {
            return this[1];
          }).get();
          var max = Math.max.apply(null, heights);
          groups[j].push(max);
        }
        cb(groups);
      }

      /**
       * Changes the CSS height property of each child in an Equalizer parent to match the tallest
       * @param {array} heights - An array of heights of children within Equalizer container
       * @fires Equalizer#preequalized
       * @fires Equalizer#postequalized
       */

    }, {
      key: 'applyHeight',
      value: function applyHeight(heights) {
        var max = Math.max.apply(null, heights);
        /**
         * Fires before the heights are applied
         * @event Equalizer#preequalized
         */
        this.$element.trigger('preequalized.zf.equalizer');

        this.$watched.css('height', max);

        /**
         * Fires when the heights have been applied
         * @event Equalizer#postequalized
         */
        this.$element.trigger('postequalized.zf.equalizer');
      }

      /**
       * Changes the CSS height property of each child in an Equalizer parent to match the tallest by row
       * @param {array} groups - An array of heights of children within Equalizer container grouped by row with element,height and max as last child
       * @fires Equalizer#preequalized
       * @fires Equalizer#preequalizedrow
       * @fires Equalizer#postequalizedrow
       * @fires Equalizer#postequalized
       */

    }, {
      key: 'applyHeightByRow',
      value: function applyHeightByRow(groups) {
        /**
         * Fires before the heights are applied
         */
        this.$element.trigger('preequalized.zf.equalizer');
        for (var i = 0, len = groups.length; i < len; i++) {
          var groupsILength = groups[i].length,
              max = groups[i][groupsILength - 1];
          if (groupsILength <= 2) {
            $(groups[i][0][0]).css({ 'height': 'auto' });
            continue;
          }
          /**
            * Fires before the heights per row are applied
            * @event Equalizer#preequalizedrow
            */
          this.$element.trigger('preequalizedrow.zf.equalizer');
          for (var j = 0, lenJ = groupsILength - 1; j < lenJ; j++) {
            $(groups[i][j][0]).css({ 'height': max });
          }
          /**
            * Fires when the heights per row have been applied
            * @event Equalizer#postequalizedrow
            */
          this.$element.trigger('postequalizedrow.zf.equalizer');
        }
        /**
         * Fires when the heights have been applied
         */
        this.$element.trigger('postequalized.zf.equalizer');
      }

      /**
       * Destroys an instance of Equalizer.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this._pauseEvents();
        this.$watched.css('height', 'auto');

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Equalizer;
  }();

  /**
   * Default settings for plugin
   */


  Equalizer.defaults = {
    /**
     * Enable height equalization when stacked on smaller screens.
     * @option
     * @type {boolean}
     * @default false
     */
    equalizeOnStack: false,
    /**
     * Enable height equalization row by row.
     * @option
     * @type {boolean}
     * @default false
     */
    equalizeByRow: false,
    /**
     * String representing the minimum breakpoint size the plugin should equalize heights on.
     * @option
     * @type {string}
     * @default ''
     */
    equalizeOn: ''
  };

  // Window exports
  Foundation.plugin(Equalizer, 'Equalizer');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Interchange module.
   * @module foundation.interchange
   * @requires foundation.util.mediaQuery
   * @requires foundation.util.timerAndImageLoader
   */

  var Interchange = function () {
    /**
     * Creates a new instance of Interchange.
     * @class
     * @fires Interchange#init
     * @param {Object} element - jQuery object to add the trigger to.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function Interchange(element, options) {
      _classCallCheck(this, Interchange);

      this.$element = element;
      this.options = $.extend({}, Interchange.defaults, options);
      this.rules = [];
      this.currentPath = '';

      this._init();
      this._events();

      Foundation.registerPlugin(this, 'Interchange');
    }

    /**
     * Initializes the Interchange plugin and calls functions to get interchange functioning on load.
     * @function
     * @private
     */


    _createClass(Interchange, [{
      key: '_init',
      value: function _init() {
        this._addBreakpoints();
        this._generateRules();
        this._reflow();
      }

      /**
       * Initializes events for Interchange.
       * @function
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this2 = this;

        $(window).on('resize.zf.interchange', Foundation.util.throttle(function () {
          _this2._reflow();
        }, 50));
      }

      /**
       * Calls necessary functions to update Interchange upon DOM change
       * @function
       * @private
       */

    }, {
      key: '_reflow',
      value: function _reflow() {
        var match;

        // Iterate through each rule, but only save the last match
        for (var i in this.rules) {
          if (this.rules.hasOwnProperty(i)) {
            var rule = this.rules[i];
            if (window.matchMedia(rule.query).matches) {
              match = rule;
            }
          }
        }

        if (match) {
          this.replace(match.path);
        }
      }

      /**
       * Gets the Foundation breakpoints and adds them to the Interchange.SPECIAL_QUERIES object.
       * @function
       * @private
       */

    }, {
      key: '_addBreakpoints',
      value: function _addBreakpoints() {
        for (var i in Foundation.MediaQuery.queries) {
          if (Foundation.MediaQuery.queries.hasOwnProperty(i)) {
            var query = Foundation.MediaQuery.queries[i];
            Interchange.SPECIAL_QUERIES[query.name] = query.value;
          }
        }
      }

      /**
       * Checks the Interchange element for the provided media query + content pairings
       * @function
       * @private
       * @param {Object} element - jQuery object that is an Interchange instance
       * @returns {Array} scenarios - Array of objects that have 'mq' and 'path' keys with corresponding keys
       */

    }, {
      key: '_generateRules',
      value: function _generateRules(element) {
        var rulesList = [];
        var rules;

        if (this.options.rules) {
          rules = this.options.rules;
        } else {
          rules = this.$element.data('interchange');
        }

        rules = typeof rules === 'string' ? rules.match(/\[.*?\]/g) : rules;

        for (var i in rules) {
          if (rules.hasOwnProperty(i)) {
            var rule = rules[i].slice(1, -1).split(', ');
            var path = rule.slice(0, -1).join('');
            var query = rule[rule.length - 1];

            if (Interchange.SPECIAL_QUERIES[query]) {
              query = Interchange.SPECIAL_QUERIES[query];
            }

            rulesList.push({
              path: path,
              query: query
            });
          }
        }

        this.rules = rulesList;
      }

      /**
       * Update the `src` property of an image, or change the HTML of a container, to the specified path.
       * @function
       * @param {String} path - Path to the image or HTML partial.
       * @fires Interchange#replaced
       */

    }, {
      key: 'replace',
      value: function replace(path) {
        if (this.currentPath === path) return;

        var _this = this,
            trigger = 'replaced.zf.interchange';

        // Replacing images
        if (this.$element[0].nodeName === 'IMG') {
          this.$element.attr('src', path).on('load', function () {
            _this.currentPath = path;
          }).trigger(trigger);
        }
        // Replacing background images
        else if (path.match(/\.(gif|jpg|jpeg|png|svg|tiff)([?#].*)?/i)) {
            this.$element.css({ 'background-image': 'url(' + path + ')' }).trigger(trigger);
          }
          // Replacing HTML
          else {
              $.get(path, function (response) {
                _this.$element.html(response).trigger(trigger);
                $(response).foundation();
                _this.currentPath = path;
              });
            }

        /**
         * Fires when content in an Interchange element is done being loaded.
         * @event Interchange#replaced
         */
        // this.$element.trigger('replaced.zf.interchange');
      }

      /**
       * Destroys an instance of interchange.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        //TODO this.
      }
    }]);

    return Interchange;
  }();

  /**
   * Default settings for plugin
   */


  Interchange.defaults = {
    /**
     * Rules to be applied to Interchange elements. Set with the `data-interchange` array notation.
     * @option
     * @type {?array}
     * @default null
     */
    rules: null
  };

  Interchange.SPECIAL_QUERIES = {
    'landscape': 'screen and (orientation: landscape)',
    'portrait': 'screen and (orientation: portrait)',
    'retina': 'only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)'
  };

  // Window exports
  Foundation.plugin(Interchange, 'Interchange');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Magellan module.
   * @module foundation.magellan
   */

  var Magellan = function () {
    /**
     * Creates a new instance of Magellan.
     * @class
     * @fires Magellan#init
     * @param {Object} element - jQuery object to add the trigger to.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function Magellan(element, options) {
      _classCallCheck(this, Magellan);

      this.$element = element;
      this.options = $.extend({}, Magellan.defaults, this.$element.data(), options);

      this._init();
      this.calcPoints();

      Foundation.registerPlugin(this, 'Magellan');
    }

    /**
     * Initializes the Magellan plugin and calls functions to get equalizer functioning on load.
     * @private
     */


    _createClass(Magellan, [{
      key: '_init',
      value: function _init() {
        var id = this.$element[0].id || Foundation.GetYoDigits(6, 'magellan');
        var _this = this;
        this.$targets = $('[data-magellan-target]');
        this.$links = this.$element.find('a');
        this.$element.attr({
          'data-resize': id,
          'data-scroll': id,
          'id': id
        });
        this.$active = $();
        this.scrollPos = parseInt(window.pageYOffset, 10);

        this._events();
      }

      /**
       * Calculates an array of pixel values that are the demarcation lines between locations on the page.
       * Can be invoked if new elements are added or the size of a location changes.
       * @function
       */

    }, {
      key: 'calcPoints',
      value: function calcPoints() {
        var _this = this,
            body = document.body,
            html = document.documentElement;

        this.points = [];
        this.winHeight = Math.round(Math.max(window.innerHeight, html.clientHeight));
        this.docHeight = Math.round(Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight));

        this.$targets.each(function () {
          var $tar = $(this),
              pt = Math.round($tar.offset().top - _this.options.threshold);
          $tar.targetPoint = pt;
          _this.points.push(pt);
        });
      }

      /**
       * Initializes events for Magellan.
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this,
            $body = $('html, body'),
            opts = {
          duration: _this.options.animationDuration,
          easing: _this.options.animationEasing
        };
        $(window).one('load', function () {
          if (_this.options.deepLinking) {
            if (location.hash) {
              _this.scrollToLoc(location.hash);
            }
          }
          _this.calcPoints();
          _this._updateActive();
        });

        this.$element.on({
          'resizeme.zf.trigger': this.reflow.bind(this),
          'scrollme.zf.trigger': this._updateActive.bind(this)
        }).on('click.zf.magellan', 'a[href^="#"]', function (e) {
          e.preventDefault();
          var arrival = this.getAttribute('href');
          _this.scrollToLoc(arrival);
        });
        $(window).on('popstate', function (e) {
          if (_this.options.deepLinking) {
            _this.scrollToLoc(window.location.hash);
          }
        });
      }

      /**
       * Function to scroll to a given location on the page.
       * @param {String} loc - a properly formatted jQuery id selector. Example: '#foo'
       * @function
       */

    }, {
      key: 'scrollToLoc',
      value: function scrollToLoc(loc) {
        // Do nothing if target does not exist to prevent errors
        if (!$(loc).length) {
          return false;
        }
        this._inTransition = true;
        var _this = this,
            scrollPos = Math.round($(loc).offset().top - this.options.threshold / 2 - this.options.barOffset);

        $('html, body').stop(true).animate({ scrollTop: scrollPos }, this.options.animationDuration, this.options.animationEasing, function () {
          _this._inTransition = false;_this._updateActive();
        });
      }

      /**
       * Calls necessary functions to update Magellan upon DOM change
       * @function
       */

    }, {
      key: 'reflow',
      value: function reflow() {
        this.calcPoints();
        this._updateActive();
      }

      /**
       * Updates the visibility of an active location link, and updates the url hash for the page, if deepLinking enabled.
       * @private
       * @function
       * @fires Magellan#update
       */

    }, {
      key: '_updateActive',
      value: function _updateActive() /*evt, elem, scrollPos*/{
        if (this._inTransition) {
          return;
        }
        var winPos = /*scrollPos ||*/parseInt(window.pageYOffset, 10),
            curIdx;

        if (winPos + this.winHeight === this.docHeight) {
          curIdx = this.points.length - 1;
        } else if (winPos < this.points[0]) {
          curIdx = undefined;
        } else {
          var isDown = this.scrollPos < winPos,
              _this = this,
              curVisible = this.points.filter(function (p, i) {
            return isDown ? p - _this.options.barOffset <= winPos : p - _this.options.barOffset - _this.options.threshold <= winPos;
          });
          curIdx = curVisible.length ? curVisible.length - 1 : 0;
        }

        this.$active.removeClass(this.options.activeClass);
        this.$active = this.$links.filter('[href="#' + this.$targets.eq(curIdx).data('magellan-target') + '"]').addClass(this.options.activeClass);

        if (this.options.deepLinking) {
          var hash = "";
          if (curIdx != undefined) {
            hash = this.$active[0].getAttribute('href');
          }
          if (hash !== window.location.hash) {
            if (window.history.pushState) {
              window.history.pushState(null, null, hash);
            } else {
              window.location.hash = hash;
            }
          }
        }

        this.scrollPos = winPos;
        /**
         * Fires when magellan is finished updating to the new active element.
         * @event Magellan#update
         */
        this.$element.trigger('update.zf.magellan', [this.$active]);
      }

      /**
       * Destroys an instance of Magellan and resets the url of the window.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.$element.off('.zf.trigger .zf.magellan').find('.' + this.options.activeClass).removeClass(this.options.activeClass);

        if (this.options.deepLinking) {
          var hash = this.$active[0].getAttribute('href');
          window.location.hash.replace(hash, '');
        }

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Magellan;
  }();

  /**
   * Default settings for plugin
   */


  Magellan.defaults = {
    /**
     * Amount of time, in ms, the animated scrolling should take between locations.
     * @option
     * @type {number}
     * @default 500
     */
    animationDuration: 500,
    /**
     * Animation style to use when scrolling between locations. Can be `'swing'` or `'linear'`.
     * @option
     * @type {string}
     * @default 'linear'
     * @see {@link https://api.jquery.com/animate|Jquery animate}
     */
    animationEasing: 'linear',
    /**
     * Number of pixels to use as a marker for location changes.
     * @option
     * @type {number}
     * @default 50
     */
    threshold: 50,
    /**
     * Class applied to the active locations link on the magellan container.
     * @option
     * @type {string}
     * @default 'active'
     */
    activeClass: 'active',
    /**
     * Allows the script to manipulate the url of the current page, and if supported, alter the history.
     * @option
     * @type {boolean}
     * @default false
     */
    deepLinking: false,
    /**
     * Number of pixels to offset the scroll of the page on item click if using a sticky nav bar.
     * @option
     * @type {number}
     * @default 0
     */
    barOffset: 0

    // Window exports
  };Foundation.plugin(Magellan, 'Magellan');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * OffCanvas module.
   * @module foundation.offcanvas
   * @requires foundation.util.keyboard
   * @requires foundation.util.mediaQuery
   * @requires foundation.util.triggers
   * @requires foundation.util.motion
   */

  var OffCanvas = function () {
    /**
     * Creates a new instance of an off-canvas wrapper.
     * @class
     * @fires OffCanvas#init
     * @param {Object} element - jQuery object to initialize.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function OffCanvas(element, options) {
      _classCallCheck(this, OffCanvas);

      this.$element = element;
      this.options = $.extend({}, OffCanvas.defaults, this.$element.data(), options);
      this.$lastTrigger = $();
      this.$triggers = $();

      this._init();
      this._events();

      Foundation.registerPlugin(this, 'OffCanvas');
      Foundation.Keyboard.register('OffCanvas', {
        'ESCAPE': 'close'
      });
    }

    /**
     * Initializes the off-canvas wrapper by adding the exit overlay (if needed).
     * @function
     * @private
     */


    _createClass(OffCanvas, [{
      key: '_init',
      value: function _init() {
        var id = this.$element.attr('id');

        this.$element.attr('aria-hidden', 'true');

        this.$element.addClass('is-transition-' + this.options.transition);

        // Find triggers that affect this element and add aria-expanded to them
        this.$triggers = $(document).find('[data-open="' + id + '"], [data-close="' + id + '"], [data-toggle="' + id + '"]').attr('aria-expanded', 'false').attr('aria-controls', id);

        // Add an overlay over the content if necessary
        if (this.options.contentOverlay === true) {
          var overlay = document.createElement('div');
          var overlayPosition = $(this.$element).css("position") === 'fixed' ? 'is-overlay-fixed' : 'is-overlay-absolute';
          overlay.setAttribute('class', 'js-off-canvas-overlay ' + overlayPosition);
          this.$overlay = $(overlay);
          if (overlayPosition === 'is-overlay-fixed') {
            $('body').append(this.$overlay);
          } else {
            this.$element.siblings('[data-off-canvas-content]').append(this.$overlay);
          }
        }

        this.options.isRevealed = this.options.isRevealed || new RegExp(this.options.revealClass, 'g').test(this.$element[0].className);

        if (this.options.isRevealed === true) {
          this.options.revealOn = this.options.revealOn || this.$element[0].className.match(/(reveal-for-medium|reveal-for-large)/g)[0].split('-')[2];
          this._setMQChecker();
        }
        if (!this.options.transitionTime === true) {
          this.options.transitionTime = parseFloat(window.getComputedStyle($('[data-off-canvas]')[0]).transitionDuration) * 1000;
        }
      }

      /**
       * Adds event handlers to the off-canvas wrapper and the exit overlay.
       * @function
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        this.$element.off('.zf.trigger .zf.offcanvas').on({
          'open.zf.trigger': this.open.bind(this),
          'close.zf.trigger': this.close.bind(this),
          'toggle.zf.trigger': this.toggle.bind(this),
          'keydown.zf.offcanvas': this._handleKeyboard.bind(this)
        });

        if (this.options.closeOnClick === true) {
          var $target = this.options.contentOverlay ? this.$overlay : $('[data-off-canvas-content]');
          $target.on({ 'click.zf.offcanvas': this.close.bind(this) });
        }
      }

      /**
       * Applies event listener for elements that will reveal at certain breakpoints.
       * @private
       */

    }, {
      key: '_setMQChecker',
      value: function _setMQChecker() {
        var _this = this;

        $(window).on('changed.zf.mediaquery', function () {
          if (Foundation.MediaQuery.atLeast(_this.options.revealOn)) {
            _this.reveal(true);
          } else {
            _this.reveal(false);
          }
        }).one('load.zf.offcanvas', function () {
          if (Foundation.MediaQuery.atLeast(_this.options.revealOn)) {
            _this.reveal(true);
          }
        });
      }

      /**
       * Handles the revealing/hiding the off-canvas at breakpoints, not the same as open.
       * @param {Boolean} isRevealed - true if element should be revealed.
       * @function
       */

    }, {
      key: 'reveal',
      value: function reveal(isRevealed) {
        var $closer = this.$element.find('[data-close]');
        if (isRevealed) {
          this.close();
          this.isRevealed = true;
          this.$element.attr('aria-hidden', 'false');
          this.$element.off('open.zf.trigger toggle.zf.trigger');
          if ($closer.length) {
            $closer.hide();
          }
        } else {
          this.isRevealed = false;
          this.$element.attr('aria-hidden', 'true');
          this.$element.on({
            'open.zf.trigger': this.open.bind(this),
            'toggle.zf.trigger': this.toggle.bind(this)
          });
          if ($closer.length) {
            $closer.show();
          }
        }
      }

      /**
       * Stops scrolling of the body when offcanvas is open on mobile Safari and other troublesome browsers.
       * @private
       */

    }, {
      key: '_stopScrolling',
      value: function _stopScrolling(event) {
        return false;
      }

      // Taken and adapted from http://stackoverflow.com/questions/16889447/prevent-full-page-scrolling-ios
      // Only really works for y, not sure how to extend to x or if we need to.

    }, {
      key: '_recordScrollable',
      value: function _recordScrollable(event) {
        var elem = this; // called from event handler context with this as elem

        // If the element is scrollable (content overflows), then...
        if (elem.scrollHeight !== elem.clientHeight) {
          // If we're at the top, scroll down one pixel to allow scrolling up
          if (elem.scrollTop === 0) {
            elem.scrollTop = 1;
          }
          // If we're at the bottom, scroll up one pixel to allow scrolling down
          if (elem.scrollTop === elem.scrollHeight - elem.clientHeight) {
            elem.scrollTop = elem.scrollHeight - elem.clientHeight - 1;
          }
        }
        elem.allowUp = elem.scrollTop > 0;
        elem.allowDown = elem.scrollTop < elem.scrollHeight - elem.clientHeight;
        elem.lastY = event.originalEvent.pageY;
      }
    }, {
      key: '_stopScrollPropagation',
      value: function _stopScrollPropagation(event) {
        var elem = this; // called from event handler context with this as elem
        var up = event.pageY < elem.lastY;
        var down = !up;
        elem.lastY = event.pageY;

        if (up && elem.allowUp || down && elem.allowDown) {
          event.stopPropagation();
        } else {
          event.preventDefault();
        }
      }

      /**
       * Opens the off-canvas menu.
       * @function
       * @param {Object} event - Event object passed from listener.
       * @param {jQuery} trigger - element that triggered the off-canvas to open.
       * @fires OffCanvas#opened
       */

    }, {
      key: 'open',
      value: function open(event, trigger) {
        if (this.$element.hasClass('is-open') || this.isRevealed) {
          return;
        }
        var _this = this;

        if (trigger) {
          this.$lastTrigger = trigger;
        }

        if (this.options.forceTo === 'top') {
          window.scrollTo(0, 0);
        } else if (this.options.forceTo === 'bottom') {
          window.scrollTo(0, document.body.scrollHeight);
        }

        /**
         * Fires when the off-canvas menu opens.
         * @event OffCanvas#opened
         */
        _this.$element.addClass('is-open');

        this.$triggers.attr('aria-expanded', 'true');
        this.$element.attr('aria-hidden', 'false').trigger('opened.zf.offcanvas');

        // If `contentScroll` is set to false, add class and disable scrolling on touch devices.
        if (this.options.contentScroll === false) {
          $('body').addClass('is-off-canvas-open').on('touchmove', this._stopScrolling);
          this.$element.on('touchstart', this._recordScrollable);
          this.$element.on('touchmove', this._stopScrollPropagation);
        }

        if (this.options.contentOverlay === true) {
          this.$overlay.addClass('is-visible');
        }

        if (this.options.closeOnClick === true && this.options.contentOverlay === true) {
          this.$overlay.addClass('is-closable');
        }

        if (this.options.autoFocus === true) {
          this.$element.one(Foundation.transitionend(this.$element), function () {
            _this.$element.find('a, button').eq(0).focus();
          });
        }

        if (this.options.trapFocus === true) {
          this.$element.siblings('[data-off-canvas-content]').attr('tabindex', '-1');
          Foundation.Keyboard.trapFocus(this.$element);
        }
      }

      /**
       * Closes the off-canvas menu.
       * @function
       * @param {Function} cb - optional cb to fire after closure.
       * @fires OffCanvas#closed
       */

    }, {
      key: 'close',
      value: function close(cb) {
        if (!this.$element.hasClass('is-open') || this.isRevealed) {
          return;
        }

        var _this = this;

        _this.$element.removeClass('is-open');

        this.$element.attr('aria-hidden', 'true'
        /**
         * Fires when the off-canvas menu opens.
         * @event OffCanvas#closed
         */
        ).trigger('closed.zf.offcanvas');

        // If `contentScroll` is set to false, remove class and re-enable scrolling on touch devices.
        if (this.options.contentScroll === false) {
          $('body').removeClass('is-off-canvas-open').off('touchmove', this._stopScrolling);
          this.$element.off('touchstart', this._recordScrollable);
          this.$element.off('touchmove', this._stopScrollPropagation);
        }

        if (this.options.contentOverlay === true) {
          this.$overlay.removeClass('is-visible');
        }

        if (this.options.closeOnClick === true && this.options.contentOverlay === true) {
          this.$overlay.removeClass('is-closable');
        }

        this.$triggers.attr('aria-expanded', 'false');

        if (this.options.trapFocus === true) {
          this.$element.siblings('[data-off-canvas-content]').removeAttr('tabindex');
          Foundation.Keyboard.releaseFocus(this.$element);
        }
      }

      /**
       * Toggles the off-canvas menu open or closed.
       * @function
       * @param {Object} event - Event object passed from listener.
       * @param {jQuery} trigger - element that triggered the off-canvas to open.
       */

    }, {
      key: 'toggle',
      value: function toggle(event, trigger) {
        if (this.$element.hasClass('is-open')) {
          this.close(event, trigger);
        } else {
          this.open(event, trigger);
        }
      }

      /**
       * Handles keyboard input when detected. When the escape key is pressed, the off-canvas menu closes, and focus is restored to the element that opened the menu.
       * @function
       * @private
       */

    }, {
      key: '_handleKeyboard',
      value: function _handleKeyboard(e) {
        var _this2 = this;

        Foundation.Keyboard.handleKey(e, 'OffCanvas', {
          close: function close() {
            _this2.close();
            _this2.$lastTrigger.focus();
            return true;
          },
          handled: function handled() {
            e.stopPropagation();
            e.preventDefault();
          }
        });
      }

      /**
       * Destroys the offcanvas plugin.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.close();
        this.$element.off('.zf.trigger .zf.offcanvas');
        this.$overlay.off('.zf.offcanvas');

        Foundation.unregisterPlugin(this);
      }
    }]);

    return OffCanvas;
  }();

  OffCanvas.defaults = {
    /**
     * Allow the user to click outside of the menu to close it.
     * @option
     * @type {boolean}
     * @default true
     */
    closeOnClick: true,

    /**
     * Adds an overlay on top of `[data-off-canvas-content]`.
     * @option
     * @type {boolean}
     * @default true
     */
    contentOverlay: true,

    /**
     * Enable/disable scrolling of the main content when an off canvas panel is open.
     * @option
     * @type {boolean}
     * @default true
     */
    contentScroll: true,

    /**
     * Amount of time in ms the open and close transition requires. If none selected, pulls from body style.
     * @option
     * @type {number}
     * @default 0
     */
    transitionTime: 0,

    /**
     * Type of transition for the offcanvas menu. Options are 'push', 'detached' or 'slide'.
     * @option
     * @type {string}
     * @default push
     */
    transition: 'push',

    /**
     * Force the page to scroll to top or bottom on open.
     * @option
     * @type {?string}
     * @default null
     */
    forceTo: null,

    /**
     * Allow the offcanvas to remain open for certain breakpoints.
     * @option
     * @type {boolean}
     * @default false
     */
    isRevealed: false,

    /**
     * Breakpoint at which to reveal. JS will use a RegExp to target standard classes, if changing classnames, pass your class with the `revealClass` option.
     * @option
     * @type {?string}
     * @default null
     */
    revealOn: null,

    /**
     * Force focus to the offcanvas on open. If true, will focus the opening trigger on close.
     * @option
     * @type {boolean}
     * @default true
     */
    autoFocus: true,

    /**
     * Class used to force an offcanvas to remain open. Foundation defaults for this are `reveal-for-large` & `reveal-for-medium`.
     * @option
     * @type {string}
     * @default reveal-for-
     * @todo improve the regex testing for this.
     */
    revealClass: 'reveal-for-',

    /**
     * Triggers optional focus trapping when opening an offcanvas. Sets tabindex of [data-off-canvas-content] to -1 for accessibility purposes.
     * @option
     * @type {boolean}
     * @default false
     */
    trapFocus: false

    // Window exports
  };Foundation.plugin(OffCanvas, 'OffCanvas');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Orbit module.
   * @module foundation.orbit
   * @requires foundation.util.keyboard
   * @requires foundation.util.motion
   * @requires foundation.util.timerAndImageLoader
   * @requires foundation.util.touch
   */

  var Orbit = function () {
    /**
    * Creates a new instance of an orbit carousel.
    * @class
    * @param {jQuery} element - jQuery object to make into an Orbit Carousel.
    * @param {Object} options - Overrides to the default plugin settings.
    */
    function Orbit(element, options) {
      _classCallCheck(this, Orbit);

      this.$element = element;
      this.options = $.extend({}, Orbit.defaults, this.$element.data(), options);

      this._init();

      Foundation.registerPlugin(this, 'Orbit');
      Foundation.Keyboard.register('Orbit', {
        'ltr': {
          'ARROW_RIGHT': 'next',
          'ARROW_LEFT': 'previous'
        },
        'rtl': {
          'ARROW_LEFT': 'next',
          'ARROW_RIGHT': 'previous'
        }
      });
    }

    /**
    * Initializes the plugin by creating jQuery collections, setting attributes, and starting the animation.
    * @function
    * @private
    */


    _createClass(Orbit, [{
      key: '_init',
      value: function _init() {
        // @TODO: consider discussion on PR #9278 about DOM pollution by changeSlide
        this._reset();

        this.$wrapper = this.$element.find('.' + this.options.containerClass);
        this.$slides = this.$element.find('.' + this.options.slideClass);

        var $images = this.$element.find('img'),
            initActive = this.$slides.filter('.is-active'),
            id = this.$element[0].id || Foundation.GetYoDigits(6, 'orbit');

        this.$element.attr({
          'data-resize': id,
          'id': id
        });

        if (!initActive.length) {
          this.$slides.eq(0).addClass('is-active');
        }

        if (!this.options.useMUI) {
          this.$slides.addClass('no-motionui');
        }

        if ($images.length) {
          Foundation.onImagesLoaded($images, this._prepareForOrbit.bind(this));
        } else {
          this._prepareForOrbit(); //hehe
        }

        if (this.options.bullets) {
          this._loadBullets();
        }

        this._events();

        if (this.options.autoPlay && this.$slides.length > 1) {
          this.geoSync();
        }

        if (this.options.accessible) {
          // allow wrapper to be focusable to enable arrow navigation
          this.$wrapper.attr('tabindex', 0);
        }
      }

      /**
      * Creates a jQuery collection of bullets, if they are being used.
      * @function
      * @private
      */

    }, {
      key: '_loadBullets',
      value: function _loadBullets() {
        this.$bullets = this.$element.find('.' + this.options.boxOfBullets).find('button');
      }

      /**
      * Sets a `timer` object on the orbit, and starts the counter for the next slide.
      * @function
      */

    }, {
      key: 'geoSync',
      value: function geoSync() {
        var _this = this;
        this.timer = new Foundation.Timer(this.$element, {
          duration: this.options.timerDelay,
          infinite: false
        }, function () {
          _this.changeSlide(true);
        });
        this.timer.start();
      }

      /**
      * Sets wrapper and slide heights for the orbit.
      * @function
      * @private
      */

    }, {
      key: '_prepareForOrbit',
      value: function _prepareForOrbit() {
        var _this = this;
        this._setWrapperHeight();
      }

      /**
      * Calulates the height of each slide in the collection, and uses the tallest one for the wrapper height.
      * @function
      * @private
      * @param {Function} cb - a callback function to fire when complete.
      */

    }, {
      key: '_setWrapperHeight',
      value: function _setWrapperHeight(cb) {
        //rewrite this to `for` loop
        var max = 0,
            temp,
            counter = 0,
            _this = this;

        this.$slides.each(function () {
          temp = this.getBoundingClientRect().height;
          $(this).attr('data-slide', counter);

          if (_this.$slides.filter('.is-active')[0] !== _this.$slides.eq(counter)[0]) {
            //if not the active slide, set css position and display property
            $(this).css({ 'position': 'relative', 'display': 'none' });
          }
          max = temp > max ? temp : max;
          counter++;
        });

        if (counter === this.$slides.length) {
          this.$wrapper.css({ 'height': max }); //only change the wrapper height property once.
          if (cb) {
            cb(max);
          } //fire callback with max height dimension.
        }
      }

      /**
      * Sets the max-height of each slide.
      * @function
      * @private
      */

    }, {
      key: '_setSlideHeight',
      value: function _setSlideHeight(height) {
        this.$slides.each(function () {
          $(this).css('max-height', height);
        });
      }

      /**
      * Adds event listeners to basically everything within the element.
      * @function
      * @private
      */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this;

        //***************************************
        //**Now using custom event - thanks to:**
        //**      Yohai Ararat of Toronto      **
        //***************************************
        //
        this.$element.off('.resizeme.zf.trigger').on({
          'resizeme.zf.trigger': this._prepareForOrbit.bind(this)
        });
        if (this.$slides.length > 1) {

          if (this.options.swipe) {
            this.$slides.off('swipeleft.zf.orbit swiperight.zf.orbit').on('swipeleft.zf.orbit', function (e) {
              e.preventDefault();
              _this.changeSlide(true);
            }).on('swiperight.zf.orbit', function (e) {
              e.preventDefault();
              _this.changeSlide(false);
            });
          }
          //***************************************

          if (this.options.autoPlay) {
            this.$slides.on('click.zf.orbit', function () {
              _this.$element.data('clickedOn', _this.$element.data('clickedOn') ? false : true);
              _this.timer[_this.$element.data('clickedOn') ? 'pause' : 'start']();
            });

            if (this.options.pauseOnHover) {
              this.$element.on('mouseenter.zf.orbit', function () {
                _this.timer.pause();
              }).on('mouseleave.zf.orbit', function () {
                if (!_this.$element.data('clickedOn')) {
                  _this.timer.start();
                }
              });
            }
          }

          if (this.options.navButtons) {
            var $controls = this.$element.find('.' + this.options.nextClass + ', .' + this.options.prevClass);
            $controls.attr('tabindex', 0
            //also need to handle enter/return and spacebar key presses
            ).on('click.zf.orbit touchend.zf.orbit', function (e) {
              e.preventDefault();
              _this.changeSlide($(this).hasClass(_this.options.nextClass));
            });
          }

          if (this.options.bullets) {
            this.$bullets.on('click.zf.orbit touchend.zf.orbit', function () {
              if (/is-active/g.test(this.className)) {
                return false;
              } //if this is active, kick out of function.
              var idx = $(this).data('slide'),
                  ltr = idx > _this.$slides.filter('.is-active').data('slide'),
                  $slide = _this.$slides.eq(idx);

              _this.changeSlide(ltr, $slide, idx);
            });
          }

          if (this.options.accessible) {
            this.$wrapper.add(this.$bullets).on('keydown.zf.orbit', function (e) {
              // handle keyboard event with keyboard util
              Foundation.Keyboard.handleKey(e, 'Orbit', {
                next: function next() {
                  _this.changeSlide(true);
                },
                previous: function previous() {
                  _this.changeSlide(false);
                },
                handled: function handled() {
                  // if bullet is focused, make sure focus moves
                  if ($(e.target).is(_this.$bullets)) {
                    _this.$bullets.filter('.is-active').focus();
                  }
                }
              });
            });
          }
        }
      }

      /**
       * Resets Orbit so it can be reinitialized
       */

    }, {
      key: '_reset',
      value: function _reset() {
        // Don't do anything if there are no slides (first run)
        if (typeof this.$slides == 'undefined') {
          return;
        }

        if (this.$slides.length > 1) {
          // Remove old events
          this.$element.off('.zf.orbit').find('*').off('.zf.orbit'

          // Restart timer if autoPlay is enabled
          );if (this.options.autoPlay) {
            this.timer.restart();
          }

          // Reset all sliddes
          this.$slides.each(function (el) {
            $(el).removeClass('is-active is-active is-in').removeAttr('aria-live').hide();
          });

          // Show the first slide
          this.$slides.first().addClass('is-active').show();

          // Triggers when the slide has finished animating
          this.$element.trigger('slidechange.zf.orbit', [this.$slides.first()]);

          // Select first bullet if bullets are present
          if (this.options.bullets) {
            this._updateBullets(0);
          }
        }
      }

      /**
      * Changes the current slide to a new one.
      * @function
      * @param {Boolean} isLTR - flag if the slide should move left to right.
      * @param {jQuery} chosenSlide - the jQuery element of the slide to show next, if one is selected.
      * @param {Number} idx - the index of the new slide in its collection, if one chosen.
      * @fires Orbit#slidechange
      */

    }, {
      key: 'changeSlide',
      value: function changeSlide(isLTR, chosenSlide, idx) {
        if (!this.$slides) {
          return;
        } // Don't freak out if we're in the middle of cleanup
        var $curSlide = this.$slides.filter('.is-active').eq(0);

        if (/mui/g.test($curSlide[0].className)) {
          return false;
        } //if the slide is currently animating, kick out of the function

        var $firstSlide = this.$slides.first(),
            $lastSlide = this.$slides.last(),
            dirIn = isLTR ? 'Right' : 'Left',
            dirOut = isLTR ? 'Left' : 'Right',
            _this = this,
            $newSlide;

        if (!chosenSlide) {
          //most of the time, this will be auto played or clicked from the navButtons.
          $newSlide = isLTR ? //if wrapping enabled, check to see if there is a `next` or `prev` sibling, if not, select the first or last slide to fill in. if wrapping not enabled, attempt to select `next` or `prev`, if there's nothing there, the function will kick out on next step. CRAZY NESTED TERNARIES!!!!!
          this.options.infiniteWrap ? $curSlide.next('.' + this.options.slideClass).length ? $curSlide.next('.' + this.options.slideClass) : $firstSlide : $curSlide.next('.' + this.options.slideClass) : //pick next slide if moving left to right
          this.options.infiniteWrap ? $curSlide.prev('.' + this.options.slideClass).length ? $curSlide.prev('.' + this.options.slideClass) : $lastSlide : $curSlide.prev('.' + this.options.slideClass); //pick prev slide if moving right to left
        } else {
          $newSlide = chosenSlide;
        }

        if ($newSlide.length) {
          /**
          * Triggers before the next slide starts animating in and only if a next slide has been found.
          * @event Orbit#beforeslidechange
          */
          this.$element.trigger('beforeslidechange.zf.orbit', [$curSlide, $newSlide]);

          if (this.options.bullets) {
            idx = idx || this.$slides.index($newSlide); //grab index to update bullets
            this._updateBullets(idx);
          }

          if (this.options.useMUI && !this.$element.is(':hidden')) {
            Foundation.Motion.animateIn($newSlide.addClass('is-active').css({ 'position': 'absolute', 'top': 0 }), this.options['animInFrom' + dirIn], function () {
              $newSlide.css({ 'position': 'relative', 'display': 'block' }).attr('aria-live', 'polite');
            });

            Foundation.Motion.animateOut($curSlide.removeClass('is-active'), this.options['animOutTo' + dirOut], function () {
              $curSlide.removeAttr('aria-live');
              if (_this.options.autoPlay && !_this.timer.isPaused) {
                _this.timer.restart();
              }
              //do stuff?
            });
          } else {
            $curSlide.removeClass('is-active is-in').removeAttr('aria-live').hide();
            $newSlide.addClass('is-active is-in').attr('aria-live', 'polite').show();
            if (this.options.autoPlay && !this.timer.isPaused) {
              this.timer.restart();
            }
          }
          /**
          * Triggers when the slide has finished animating in.
          * @event Orbit#slidechange
          */
          this.$element.trigger('slidechange.zf.orbit', [$newSlide]);
        }
      }

      /**
      * Updates the active state of the bullets, if displayed.
      * @function
      * @private
      * @param {Number} idx - the index of the current slide.
      */

    }, {
      key: '_updateBullets',
      value: function _updateBullets(idx) {
        var $oldBullet = this.$element.find('.' + this.options.boxOfBullets).find('.is-active').removeClass('is-active').blur(),
            span = $oldBullet.find('span:last').detach(),
            $newBullet = this.$bullets.eq(idx).addClass('is-active').append(span);
      }

      /**
      * Destroys the carousel and hides the element.
      * @function
      */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.$element.off('.zf.orbit').find('*').off('.zf.orbit').end().hide();
        Foundation.unregisterPlugin(this);
      }
    }]);

    return Orbit;
  }();

  Orbit.defaults = {
    /**
    * Tells the JS to look for and loadBullets.
    * @option
     * @type {boolean}
    * @default true
    */
    bullets: true,
    /**
    * Tells the JS to apply event listeners to nav buttons
    * @option
     * @type {boolean}
    * @default true
    */
    navButtons: true,
    /**
    * motion-ui animation class to apply
    * @option
     * @type {string}
    * @default 'slide-in-right'
    */
    animInFromRight: 'slide-in-right',
    /**
    * motion-ui animation class to apply
    * @option
     * @type {string}
    * @default 'slide-out-right'
    */
    animOutToRight: 'slide-out-right',
    /**
    * motion-ui animation class to apply
    * @option
     * @type {string}
    * @default 'slide-in-left'
    *
    */
    animInFromLeft: 'slide-in-left',
    /**
    * motion-ui animation class to apply
    * @option
     * @type {string}
    * @default 'slide-out-left'
    */
    animOutToLeft: 'slide-out-left',
    /**
    * Allows Orbit to automatically animate on page load.
    * @option
     * @type {boolean}
    * @default true
    */
    autoPlay: true,
    /**
    * Amount of time, in ms, between slide transitions
    * @option
     * @type {number}
    * @default 5000
    */
    timerDelay: 5000,
    /**
    * Allows Orbit to infinitely loop through the slides
    * @option
     * @type {boolean}
    * @default true
    */
    infiniteWrap: true,
    /**
    * Allows the Orbit slides to bind to swipe events for mobile, requires an additional util library
    * @option
     * @type {boolean}
    * @default true
    */
    swipe: true,
    /**
    * Allows the timing function to pause animation on hover.
    * @option
     * @type {boolean}
    * @default true
    */
    pauseOnHover: true,
    /**
    * Allows Orbit to bind keyboard events to the slider, to animate frames with arrow keys
    * @option
     * @type {boolean}
    * @default true
    */
    accessible: true,
    /**
    * Class applied to the container of Orbit
    * @option
     * @type {string}
    * @default 'orbit-container'
    */
    containerClass: 'orbit-container',
    /**
    * Class applied to individual slides.
    * @option
     * @type {string}
    * @default 'orbit-slide'
    */
    slideClass: 'orbit-slide',
    /**
    * Class applied to the bullet container. You're welcome.
    * @option
     * @type {string}
    * @default 'orbit-bullets'
    */
    boxOfBullets: 'orbit-bullets',
    /**
    * Class applied to the `next` navigation button.
    * @option
     * @type {string}
    * @default 'orbit-next'
    */
    nextClass: 'orbit-next',
    /**
    * Class applied to the `previous` navigation button.
    * @option
     * @type {string}
    * @default 'orbit-previous'
    */
    prevClass: 'orbit-previous',
    /**
    * Boolean to flag the js to use motion ui classes or not. Default to true for backwards compatability.
    * @option
     * @type {boolean}
    * @default true
    */
    useMUI: true
  };

  // Window exports
  Foundation.plugin(Orbit, 'Orbit');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * ResponsiveMenu module.
   * @module foundation.responsiveMenu
   * @requires foundation.util.triggers
   * @requires foundation.util.mediaQuery
   */

  var ResponsiveMenu = function () {
    /**
     * Creates a new instance of a responsive menu.
     * @class
     * @fires ResponsiveMenu#init
     * @param {jQuery} element - jQuery object to make into a dropdown menu.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function ResponsiveMenu(element, options) {
      _classCallCheck(this, ResponsiveMenu);

      this.$element = $(element);
      this.rules = this.$element.data('responsive-menu');
      this.currentMq = null;
      this.currentPlugin = null;

      this._init();
      this._events();

      Foundation.registerPlugin(this, 'ResponsiveMenu');
    }

    /**
     * Initializes the Menu by parsing the classes from the 'data-ResponsiveMenu' attribute on the element.
     * @function
     * @private
     */


    _createClass(ResponsiveMenu, [{
      key: '_init',
      value: function _init() {
        // The first time an Interchange plugin is initialized, this.rules is converted from a string of "classes" to an object of rules
        if (typeof this.rules === 'string') {
          var rulesTree = {};

          // Parse rules from "classes" pulled from data attribute
          var rules = this.rules.split(' ');

          // Iterate through every rule found
          for (var i = 0; i < rules.length; i++) {
            var rule = rules[i].split('-');
            var ruleSize = rule.length > 1 ? rule[0] : 'small';
            var rulePlugin = rule.length > 1 ? rule[1] : rule[0];

            if (MenuPlugins[rulePlugin] !== null) {
              rulesTree[ruleSize] = MenuPlugins[rulePlugin];
            }
          }

          this.rules = rulesTree;
        }

        if (!$.isEmptyObject(this.rules)) {
          this._checkMediaQueries();
        }
        // Add data-mutate since children may need it.
        this.$element.attr('data-mutate', this.$element.attr('data-mutate') || Foundation.GetYoDigits(6, 'responsive-menu'));
      }

      /**
       * Initializes events for the Menu.
       * @function
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this;

        $(window).on('changed.zf.mediaquery', function () {
          _this._checkMediaQueries();
        });
        // $(window).on('resize.zf.ResponsiveMenu', function() {
        //   _this._checkMediaQueries();
        // });
      }

      /**
       * Checks the current screen width against available media queries. If the media query has changed, and the plugin needed has changed, the plugins will swap out.
       * @function
       * @private
       */

    }, {
      key: '_checkMediaQueries',
      value: function _checkMediaQueries() {
        var matchedMq,
            _this = this;
        // Iterate through each rule and find the last matching rule
        $.each(this.rules, function (key) {
          if (Foundation.MediaQuery.atLeast(key)) {
            matchedMq = key;
          }
        });

        // No match? No dice
        if (!matchedMq) return;

        // Plugin already initialized? We good
        if (this.currentPlugin instanceof this.rules[matchedMq].plugin) return;

        // Remove existing plugin-specific CSS classes
        $.each(MenuPlugins, function (key, value) {
          _this.$element.removeClass(value.cssClass);
        });

        // Add the CSS class for the new plugin
        this.$element.addClass(this.rules[matchedMq].cssClass);

        // Create an instance of the new plugin
        if (this.currentPlugin) this.currentPlugin.destroy();
        this.currentPlugin = new this.rules[matchedMq].plugin(this.$element, {});
      }

      /**
       * Destroys the instance of the current plugin on this element, as well as the window resize handler that switches the plugins out.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.currentPlugin.destroy();
        $(window).off('.zf.ResponsiveMenu');
        Foundation.unregisterPlugin(this);
      }
    }]);

    return ResponsiveMenu;
  }();

  ResponsiveMenu.defaults = {};

  // The plugin matches the plugin classes with these plugin instances.
  var MenuPlugins = {
    dropdown: {
      cssClass: 'dropdown',
      plugin: Foundation._plugins['dropdown-menu'] || null
    },
    drilldown: {
      cssClass: 'drilldown',
      plugin: Foundation._plugins['drilldown'] || null
    },
    accordion: {
      cssClass: 'accordion-menu',
      plugin: Foundation._plugins['accordion-menu'] || null
    }
  };

  // Window exports
  Foundation.plugin(ResponsiveMenu, 'ResponsiveMenu');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * ResponsiveToggle module.
   * @module foundation.responsiveToggle
   * @requires foundation.util.mediaQuery
   */

  var ResponsiveToggle = function () {
    /**
     * Creates a new instance of Tab Bar.
     * @class
     * @fires ResponsiveToggle#init
     * @param {jQuery} element - jQuery object to attach tab bar functionality to.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function ResponsiveToggle(element, options) {
      _classCallCheck(this, ResponsiveToggle);

      this.$element = $(element);
      this.options = $.extend({}, ResponsiveToggle.defaults, this.$element.data(), options);

      this._init();
      this._events();

      Foundation.registerPlugin(this, 'ResponsiveToggle');
    }

    /**
     * Initializes the tab bar by finding the target element, toggling element, and running update().
     * @function
     * @private
     */


    _createClass(ResponsiveToggle, [{
      key: '_init',
      value: function _init() {
        var targetID = this.$element.data('responsive-toggle');
        if (!targetID) {
          console.error('Your tab bar needs an ID of a Menu as the value of data-tab-bar.');
        }

        this.$targetMenu = $('#' + targetID);
        this.$toggler = this.$element.find('[data-toggle]').filter(function () {
          var target = $(this).data('toggle');
          return target === targetID || target === "";
        });
        this.options = $.extend({}, this.options, this.$targetMenu.data());

        // If they were set, parse the animation classes
        if (this.options.animate) {
          var input = this.options.animate.split(' ');

          this.animationIn = input[0];
          this.animationOut = input[1] || null;
        }

        this._update();
      }

      /**
       * Adds necessary event handlers for the tab bar to work.
       * @function
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this;

        this._updateMqHandler = this._update.bind(this);

        $(window).on('changed.zf.mediaquery', this._updateMqHandler);

        this.$toggler.on('click.zf.responsiveToggle', this.toggleMenu.bind(this));
      }

      /**
       * Checks the current media query to determine if the tab bar should be visible or hidden.
       * @function
       * @private
       */

    }, {
      key: '_update',
      value: function _update() {
        // Mobile
        if (!Foundation.MediaQuery.atLeast(this.options.hideFor)) {
          this.$element.show();
          this.$targetMenu.hide();
        }

        // Desktop
        else {
            this.$element.hide();
            this.$targetMenu.show();
          }
      }

      /**
       * Toggles the element attached to the tab bar. The toggle only happens if the screen is small enough to allow it.
       * @function
       * @fires ResponsiveToggle#toggled
       */

    }, {
      key: 'toggleMenu',
      value: function toggleMenu() {
        var _this2 = this;

        if (!Foundation.MediaQuery.atLeast(this.options.hideFor)) {
          /**
           * Fires when the element attached to the tab bar toggles.
           * @event ResponsiveToggle#toggled
           */
          if (this.options.animate) {
            if (this.$targetMenu.is(':hidden')) {
              Foundation.Motion.animateIn(this.$targetMenu, this.animationIn, function () {
                _this2.$element.trigger('toggled.zf.responsiveToggle');
                _this2.$targetMenu.find('[data-mutate]').triggerHandler('mutateme.zf.trigger');
              });
            } else {
              Foundation.Motion.animateOut(this.$targetMenu, this.animationOut, function () {
                _this2.$element.trigger('toggled.zf.responsiveToggle');
              });
            }
          } else {
            this.$targetMenu.toggle(0);
            this.$targetMenu.find('[data-mutate]').trigger('mutateme.zf.trigger');
            this.$element.trigger('toggled.zf.responsiveToggle');
          }
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.$element.off('.zf.responsiveToggle');
        this.$toggler.off('.zf.responsiveToggle');

        $(window).off('changed.zf.mediaquery', this._updateMqHandler);

        Foundation.unregisterPlugin(this);
      }
    }]);

    return ResponsiveToggle;
  }();

  ResponsiveToggle.defaults = {
    /**
     * The breakpoint after which the menu is always shown, and the tab bar is hidden.
     * @option
     * @type {string}
     * @default 'medium'
     */
    hideFor: 'medium',

    /**
     * To decide if the toggle should be animated or not.
     * @option
     * @type {boolean}
     * @default false
     */
    animate: false
  };

  // Window exports
  Foundation.plugin(ResponsiveToggle, 'ResponsiveToggle');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Reveal module.
   * @module foundation.reveal
   * @requires foundation.util.keyboard
   * @requires foundation.util.box
   * @requires foundation.util.triggers
   * @requires foundation.util.mediaQuery
   * @requires foundation.util.motion if using animations
   */

  var Reveal = function () {
    /**
     * Creates a new instance of Reveal.
     * @class
     * @param {jQuery} element - jQuery object to use for the modal.
     * @param {Object} options - optional parameters.
     */
    function Reveal(element, options) {
      _classCallCheck(this, Reveal);

      this.$element = element;
      this.options = $.extend({}, Reveal.defaults, this.$element.data(), options);
      this._init();

      Foundation.registerPlugin(this, 'Reveal');
      Foundation.Keyboard.register('Reveal', {
        'ENTER': 'open',
        'SPACE': 'open',
        'ESCAPE': 'close'
      });
    }

    /**
     * Initializes the modal by adding the overlay and close buttons, (if selected).
     * @private
     */


    _createClass(Reveal, [{
      key: '_init',
      value: function _init() {
        this.id = this.$element.attr('id');
        this.isActive = false;
        this.cached = { mq: Foundation.MediaQuery.current };
        this.isMobile = mobileSniff();

        this.$anchor = $('[data-open="' + this.id + '"]').length ? $('[data-open="' + this.id + '"]') : $('[data-toggle="' + this.id + '"]');
        this.$anchor.attr({
          'aria-controls': this.id,
          'aria-haspopup': true,
          'tabindex': 0
        });

        if (this.options.fullScreen || this.$element.hasClass('full')) {
          this.options.fullScreen = true;
          this.options.overlay = false;
        }
        if (this.options.overlay && !this.$overlay) {
          this.$overlay = this._makeOverlay(this.id);
        }

        this.$element.attr({
          'role': 'dialog',
          'aria-hidden': true,
          'data-yeti-box': this.id,
          'data-resize': this.id
        });

        if (this.$overlay) {
          this.$element.detach().appendTo(this.$overlay);
        } else {
          this.$element.detach().appendTo($(this.options.appendTo));
          this.$element.addClass('without-overlay');
        }
        this._events();
        if (this.options.deepLink && window.location.hash === '#' + this.id) {
          $(window).one('load.zf.reveal', this.open.bind(this));
        }
      }

      /**
       * Creates an overlay div to display behind the modal.
       * @private
       */

    }, {
      key: '_makeOverlay',
      value: function _makeOverlay() {
        return $('<div></div>').addClass('reveal-overlay').appendTo(this.options.appendTo);
      }

      /**
       * Updates position of modal
       * TODO:  Figure out if we actually need to cache these values or if it doesn't matter
       * @private
       */

    }, {
      key: '_updatePosition',
      value: function _updatePosition() {
        var width = this.$element.outerWidth();
        var outerWidth = $(window).width();
        var height = this.$element.outerHeight();
        var outerHeight = $(window).height();
        var left, top;
        if (this.options.hOffset === 'auto') {
          left = parseInt((outerWidth - width) / 2, 10);
        } else {
          left = parseInt(this.options.hOffset, 10);
        }
        if (this.options.vOffset === 'auto') {
          if (height > outerHeight) {
            top = parseInt(Math.min(100, outerHeight / 10), 10);
          } else {
            top = parseInt((outerHeight - height) / 4, 10);
          }
        } else {
          top = parseInt(this.options.vOffset, 10);
        }
        this.$element.css({ top: top + 'px' });
        // only worry about left if we don't have an overlay or we havea  horizontal offset,
        // otherwise we're perfectly in the middle
        if (!this.$overlay || this.options.hOffset !== 'auto') {
          this.$element.css({ left: left + 'px' });
          this.$element.css({ margin: '0px' });
        }
      }

      /**
       * Adds event handlers for the modal.
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this2 = this;

        var _this = this;

        this.$element.on({
          'open.zf.trigger': this.open.bind(this),
          'close.zf.trigger': function closeZfTrigger(event, $element) {
            if (event.target === _this.$element[0] || $(event.target).parents('[data-closable]')[0] === $element) {
              // only close reveal when it's explicitly called
              return _this2.close.apply(_this2);
            }
          },
          'toggle.zf.trigger': this.toggle.bind(this),
          'resizeme.zf.trigger': function resizemeZfTrigger() {
            _this._updatePosition();
          }
        });

        if (this.$anchor.length) {
          this.$anchor.on('keydown.zf.reveal', function (e) {
            if (e.which === 13 || e.which === 32) {
              e.stopPropagation();
              e.preventDefault();
              _this.open();
            }
          });
        }

        if (this.options.closeOnClick && this.options.overlay) {
          this.$overlay.off('.zf.reveal').on('click.zf.reveal', function (e) {
            if (e.target === _this.$element[0] || $.contains(_this.$element[0], e.target) || !$.contains(document, e.target)) {
              return;
            }
            _this.close();
          });
        }
        if (this.options.deepLink) {
          $(window).on('popstate.zf.reveal:' + this.id, this._handleState.bind(this));
        }
      }

      /**
       * Handles modal methods on back/forward button clicks or any other event that triggers popstate.
       * @private
       */

    }, {
      key: '_handleState',
      value: function _handleState(e) {
        if (window.location.hash === '#' + this.id && !this.isActive) {
          this.open();
        } else {
          this.close();
        }
      }

      /**
       * Opens the modal controlled by `this.$anchor`, and closes all others by default.
       * @function
       * @fires Reveal#closeme
       * @fires Reveal#open
       */

    }, {
      key: 'open',
      value: function open() {
        var _this3 = this;

        if (this.options.deepLink) {
          var hash = '#' + this.id;

          if (window.history.pushState) {
            window.history.pushState(null, null, hash);
          } else {
            window.location.hash = hash;
          }
        }

        this.isActive = true;

        // Make elements invisible, but remove display: none so we can get size and positioning
        this.$element.css({ 'visibility': 'hidden' }).show().scrollTop(0);
        if (this.options.overlay) {
          this.$overlay.css({ 'visibility': 'hidden' }).show();
        }

        this._updatePosition();

        this.$element.hide().css({ 'visibility': '' });

        if (this.$overlay) {
          this.$overlay.css({ 'visibility': '' }).hide();
          if (this.$element.hasClass('fast')) {
            this.$overlay.addClass('fast');
          } else if (this.$element.hasClass('slow')) {
            this.$overlay.addClass('slow');
          }
        }

        if (!this.options.multipleOpened) {
          /**
           * Fires immediately before the modal opens.
           * Closes any other modals that are currently open
           * @event Reveal#closeme
           */
          this.$element.trigger('closeme.zf.reveal', this.id);
        }

        var _this = this;

        function addRevealOpenClasses() {
          if (_this.isMobile) {
            if (!_this.originalScrollPos) {
              _this.originalScrollPos = window.pageYOffset;
            }
            $('html, body').addClass('is-reveal-open');
          } else {
            $('body').addClass('is-reveal-open');
          }
        }
        // Motion UI method of reveal
        if (this.options.animationIn) {
          var afterAnimation = function afterAnimation() {
            _this.$element.attr({
              'aria-hidden': false,
              'tabindex': -1
            }).focus();
            addRevealOpenClasses();
            Foundation.Keyboard.trapFocus(_this.$element);
          };

          if (this.options.overlay) {
            Foundation.Motion.animateIn(this.$overlay, 'fade-in');
          }
          Foundation.Motion.animateIn(this.$element, this.options.animationIn, function () {
            if (_this3.$element) {
              // protect against object having been removed
              _this3.focusableElements = Foundation.Keyboard.findFocusable(_this3.$element);
              afterAnimation();
            }
          });
        }
        // jQuery method of reveal
        else {
            if (this.options.overlay) {
              this.$overlay.show(0);
            }
            this.$element.show(this.options.showDelay);
          }

        // handle accessibility
        this.$element.attr({
          'aria-hidden': false,
          'tabindex': -1
        }).focus();
        Foundation.Keyboard.trapFocus(this.$element);

        /**
         * Fires when the modal has successfully opened.
         * @event Reveal#open
         */
        this.$element.trigger('open.zf.reveal');

        addRevealOpenClasses();

        setTimeout(function () {
          _this3._extraHandlers();
        }, 0);
      }

      /**
       * Adds extra event handlers for the body and window if necessary.
       * @private
       */

    }, {
      key: '_extraHandlers',
      value: function _extraHandlers() {
        var _this = this;
        if (!this.$element) {
          return;
        } // If we're in the middle of cleanup, don't freak out
        this.focusableElements = Foundation.Keyboard.findFocusable(this.$element);

        if (!this.options.overlay && this.options.closeOnClick && !this.options.fullScreen) {
          $('body').on('click.zf.reveal', function (e) {
            if (e.target === _this.$element[0] || $.contains(_this.$element[0], e.target) || !$.contains(document, e.target)) {
              return;
            }
            _this.close();
          });
        }

        if (this.options.closeOnEsc) {
          $(window).on('keydown.zf.reveal', function (e) {
            Foundation.Keyboard.handleKey(e, 'Reveal', {
              close: function close() {
                if (_this.options.closeOnEsc) {
                  _this.close();
                  _this.$anchor.focus();
                }
              }
            });
          });
        }

        // lock focus within modal while tabbing
        this.$element.on('keydown.zf.reveal', function (e) {
          var $target = $(this);
          // handle keyboard event with keyboard util
          Foundation.Keyboard.handleKey(e, 'Reveal', {
            open: function open() {
              if (_this.$element.find(':focus').is(_this.$element.find('[data-close]'))) {
                setTimeout(function () {
                  // set focus back to anchor if close button has been activated
                  _this.$anchor.focus();
                }, 1);
              } else if ($target.is(_this.focusableElements)) {
                // dont't trigger if acual element has focus (i.e. inputs, links, ...)
                _this.open();
              }
            },
            close: function close() {
              if (_this.options.closeOnEsc) {
                _this.close();
                _this.$anchor.focus();
              }
            },
            handled: function handled(preventDefault) {
              if (preventDefault) {
                e.preventDefault();
              }
            }
          });
        });
      }

      /**
       * Closes the modal.
       * @function
       * @fires Reveal#closed
       */

    }, {
      key: 'close',
      value: function close() {
        if (!this.isActive || !this.$element.is(':visible')) {
          return false;
        }
        var _this = this;

        // Motion UI method of hiding
        if (this.options.animationOut) {
          if (this.options.overlay) {
            Foundation.Motion.animateOut(this.$overlay, 'fade-out', finishUp);
          } else {
            finishUp();
          }

          Foundation.Motion.animateOut(this.$element, this.options.animationOut);
        }
        // jQuery method of hiding
        else {
            if (this.options.overlay) {
              this.$overlay.hide(0, finishUp);
            } else {
              finishUp();
            }

            this.$element.hide(this.options.hideDelay);
          }

        // Conditionals to remove extra event listeners added on open
        if (this.options.closeOnEsc) {
          $(window).off('keydown.zf.reveal');
        }

        if (!this.options.overlay && this.options.closeOnClick) {
          $('body').off('click.zf.reveal');
        }

        this.$element.off('keydown.zf.reveal');

        function finishUp() {
          if (_this.isMobile) {
            $('html, body').removeClass('is-reveal-open');
            if (_this.originalScrollPos) {
              $('body').scrollTop(_this.originalScrollPos);
              _this.originalScrollPos = null;
            }
          } else {
            $('body').removeClass('is-reveal-open');
          }

          Foundation.Keyboard.releaseFocus(_this.$element);

          _this.$element.attr('aria-hidden', true);

          /**
          * Fires when the modal is done closing.
          * @event Reveal#closed
          */
          _this.$element.trigger('closed.zf.reveal');
        }

        /**
        * Resets the modal content
        * This prevents a running video to keep going in the background
        */
        if (this.options.resetOnClose) {
          this.$element.html(this.$element.html());
        }

        this.isActive = false;
        if (_this.options.deepLink) {
          if (window.history.replaceState) {
            window.history.replaceState('', document.title, window.location.href.replace('#' + this.id, ''));
          } else {
            window.location.hash = '';
          }
        }
      }

      /**
       * Toggles the open/closed state of a modal.
       * @function
       */

    }, {
      key: 'toggle',
      value: function toggle() {
        if (this.isActive) {
          this.close();
        } else {
          this.open();
        }
      }
    }, {
      key: 'destroy',


      /**
       * Destroys an instance of a modal.
       * @function
       */
      value: function destroy() {
        if (this.options.overlay) {
          this.$element.appendTo($(this.options.appendTo)); // move $element outside of $overlay to prevent error unregisterPlugin()
          this.$overlay.hide().off().remove();
        }
        this.$element.hide().off();
        this.$anchor.off('.zf');
        $(window).off('.zf.reveal:' + this.id);

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Reveal;
  }();

  Reveal.defaults = {
    /**
     * Motion-UI class to use for animated elements. If none used, defaults to simple show/hide.
     * @option
     * @type {string}
     * @default ''
     */
    animationIn: '',
    /**
     * Motion-UI class to use for animated elements. If none used, defaults to simple show/hide.
     * @option
     * @type {string}
     * @default ''
     */
    animationOut: '',
    /**
     * Time, in ms, to delay the opening of a modal after a click if no animation used.
     * @option
     * @type {number}
     * @default 0
     */
    showDelay: 0,
    /**
     * Time, in ms, to delay the closing of a modal after a click if no animation used.
     * @option
     * @type {number}
     * @default 0
     */
    hideDelay: 0,
    /**
     * Allows a click on the body/overlay to close the modal.
     * @option
     * @type {boolean}
     * @default true
     */
    closeOnClick: true,
    /**
     * Allows the modal to close if the user presses the `ESCAPE` key.
     * @option
     * @type {boolean}
     * @default true
     */
    closeOnEsc: true,
    /**
     * If true, allows multiple modals to be displayed at once.
     * @option
     * @type {boolean}
     * @default false
     */
    multipleOpened: false,
    /**
     * Distance, in pixels, the modal should push down from the top of the screen.
     * @option
     * @type {number|string}
     * @default auto
     */
    vOffset: 'auto',
    /**
     * Distance, in pixels, the modal should push in from the side of the screen.
     * @option
     * @type {number|string}
     * @default auto
     */
    hOffset: 'auto',
    /**
     * Allows the modal to be fullscreen, completely blocking out the rest of the view. JS checks for this as well.
     * @option
     * @type {boolean}
     * @default false
     */
    fullScreen: false,
    /**
     * Percentage of screen height the modal should push up from the bottom of the view.
     * @option
     * @type {number}
     * @default 10
     */
    btmOffsetPct: 10,
    /**
     * Allows the modal to generate an overlay div, which will cover the view when modal opens.
     * @option
     * @type {boolean}
     * @default true
     */
    overlay: true,
    /**
     * Allows the modal to remove and reinject markup on close. Should be true if using video elements w/o using provider's api, otherwise, videos will continue to play in the background.
     * @option
     * @type {boolean}
     * @default false
     */
    resetOnClose: false,
    /**
     * Allows the modal to alter the url on open/close, and allows the use of the `back` button to close modals. ALSO, allows a modal to auto-maniacally open on page load IF the hash === the modal's user-set id.
     * @option
     * @type {boolean}
     * @default false
     */
    deepLink: false,
    /**
    * Allows the modal to append to custom div.
    * @option
    * @type {string}
    * @default "body"
    */
    appendTo: "body"

  };

  // Window exports
  Foundation.plugin(Reveal, 'Reveal');

  function iPhoneSniff() {
    return (/iP(ad|hone|od).*OS/.test(window.navigator.userAgent)
    );
  }

  function androidSniff() {
    return (/Android/.test(window.navigator.userAgent)
    );
  }

  function mobileSniff() {
    return iPhoneSniff() || androidSniff();
  }
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Slider module.
   * @module foundation.slider
   * @requires foundation.util.motion
   * @requires foundation.util.triggers
   * @requires foundation.util.keyboard
   * @requires foundation.util.touch
   */

  var Slider = function () {
    /**
     * Creates a new instance of a slider control.
     * @class
     * @param {jQuery} element - jQuery object to make into a slider control.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function Slider(element, options) {
      _classCallCheck(this, Slider);

      this.$element = element;
      this.options = $.extend({}, Slider.defaults, this.$element.data(), options);

      this._init();

      Foundation.registerPlugin(this, 'Slider');
      Foundation.Keyboard.register('Slider', {
        'ltr': {
          'ARROW_RIGHT': 'increase',
          'ARROW_UP': 'increase',
          'ARROW_DOWN': 'decrease',
          'ARROW_LEFT': 'decrease',
          'SHIFT_ARROW_RIGHT': 'increase_fast',
          'SHIFT_ARROW_UP': 'increase_fast',
          'SHIFT_ARROW_DOWN': 'decrease_fast',
          'SHIFT_ARROW_LEFT': 'decrease_fast'
        },
        'rtl': {
          'ARROW_LEFT': 'increase',
          'ARROW_RIGHT': 'decrease',
          'SHIFT_ARROW_LEFT': 'increase_fast',
          'SHIFT_ARROW_RIGHT': 'decrease_fast'
        }
      });
    }

    /**
     * Initilizes the plugin by reading/setting attributes, creating collections and setting the initial position of the handle(s).
     * @function
     * @private
     */


    _createClass(Slider, [{
      key: '_init',
      value: function _init() {
        this.inputs = this.$element.find('input');
        this.handles = this.$element.find('[data-slider-handle]');

        this.$handle = this.handles.eq(0);
        this.$input = this.inputs.length ? this.inputs.eq(0) : $('#' + this.$handle.attr('aria-controls'));
        this.$fill = this.$element.find('[data-slider-fill]').css(this.options.vertical ? 'height' : 'width', 0);

        var isDbl = false,
            _this = this;
        if (this.options.disabled || this.$element.hasClass(this.options.disabledClass)) {
          this.options.disabled = true;
          this.$element.addClass(this.options.disabledClass);
        }
        if (!this.inputs.length) {
          this.inputs = $().add(this.$input);
          this.options.binding = true;
        }

        this._setInitAttr(0);

        if (this.handles[1]) {
          this.options.doubleSided = true;
          this.$handle2 = this.handles.eq(1);
          this.$input2 = this.inputs.length > 1 ? this.inputs.eq(1) : $('#' + this.$handle2.attr('aria-controls'));

          if (!this.inputs[1]) {
            this.inputs = this.inputs.add(this.$input2);
          }
          isDbl = true;

          // this.$handle.triggerHandler('click.zf.slider');
          this._setInitAttr(1);
        }

        // Set handle positions
        this.setHandles();

        this._events();
      }
    }, {
      key: 'setHandles',
      value: function setHandles() {
        var _this2 = this;

        if (this.handles[1]) {
          this._setHandlePos(this.$handle, this.inputs.eq(0).val(), true, function () {
            _this2._setHandlePos(_this2.$handle2, _this2.inputs.eq(1).val(), true);
          });
        } else {
          this._setHandlePos(this.$handle, this.inputs.eq(0).val(), true);
        }
      }
    }, {
      key: '_reflow',
      value: function _reflow() {
        this.setHandles();
      }
      /**
      * @function
      * @private
      * @param {Number} value - floating point (the value) to be transformed using to a relative position on the slider (the inverse of _value)
      */

    }, {
      key: '_pctOfBar',
      value: function _pctOfBar(value) {
        var pctOfBar = percent(value - this.options.start, this.options.end - this.options.start);

        switch (this.options.positionValueFunction) {
          case "pow":
            pctOfBar = this._logTransform(pctOfBar);
            break;
          case "log":
            pctOfBar = this._powTransform(pctOfBar);
            break;
        }

        return pctOfBar.toFixed(2);
      }

      /**
      * @function
      * @private
      * @param {Number} pctOfBar - floating point, the relative position of the slider (typically between 0-1) to be transformed to a value
      */

    }, {
      key: '_value',
      value: function _value(pctOfBar) {
        switch (this.options.positionValueFunction) {
          case "pow":
            pctOfBar = this._powTransform(pctOfBar);
            break;
          case "log":
            pctOfBar = this._logTransform(pctOfBar);
            break;
        }
        var value = (this.options.end - this.options.start) * pctOfBar + this.options.start;

        return value;
      }

      /**
      * @function
      * @private
      * @param {Number} value - floating point (typically between 0-1) to be transformed using the log function
      */

    }, {
      key: '_logTransform',
      value: function _logTransform(value) {
        return baseLog(this.options.nonLinearBase, value * (this.options.nonLinearBase - 1) + 1);
      }

      /**
      * @function
      * @private
      * @param {Number} value - floating point (typically between 0-1) to be transformed using the power function
      */

    }, {
      key: '_powTransform',
      value: function _powTransform(value) {
        return (Math.pow(this.options.nonLinearBase, value) - 1) / (this.options.nonLinearBase - 1);
      }

      /**
       * Sets the position of the selected handle and fill bar.
       * @function
       * @private
       * @param {jQuery} $hndl - the selected handle to move.
       * @param {Number} location - floating point between the start and end values of the slider bar.
       * @param {Function} cb - callback function to fire on completion.
       * @fires Slider#moved
       * @fires Slider#changed
       */

    }, {
      key: '_setHandlePos',
      value: function _setHandlePos($hndl, location, noInvert, cb) {
        // don't move if the slider has been disabled since its initialization
        if (this.$element.hasClass(this.options.disabledClass)) {
          return;
        }
        //might need to alter that slightly for bars that will have odd number selections.
        location = parseFloat(location); //on input change events, convert string to number...grumble.

        // prevent slider from running out of bounds, if value exceeds the limits set through options, override the value to min/max
        if (location < this.options.start) {
          location = this.options.start;
        } else if (location > this.options.end) {
          location = this.options.end;
        }

        var isDbl = this.options.doubleSided;

        if (isDbl) {
          //this block is to prevent 2 handles from crossing eachother. Could/should be improved.
          if (this.handles.index($hndl) === 0) {
            var h2Val = parseFloat(this.$handle2.attr('aria-valuenow'));
            location = location >= h2Val ? h2Val - this.options.step : location;
          } else {
            var h1Val = parseFloat(this.$handle.attr('aria-valuenow'));
            location = location <= h1Val ? h1Val + this.options.step : location;
          }
        }

        //this is for single-handled vertical sliders, it adjusts the value to account for the slider being "upside-down"
        //for click and drag events, it's weird due to the scale(-1, 1) css property
        if (this.options.vertical && !noInvert) {
          location = this.options.end - location;
        }

        var _this = this,
            vert = this.options.vertical,
            hOrW = vert ? 'height' : 'width',
            lOrT = vert ? 'top' : 'left',
            handleDim = $hndl[0].getBoundingClientRect()[hOrW],
            elemDim = this.$element[0].getBoundingClientRect()[hOrW],

        //percentage of bar min/max value based on click or drag point
        pctOfBar = this._pctOfBar(location),

        //number of actual pixels to shift the handle, based on the percentage obtained above
        pxToMove = (elemDim - handleDim) * pctOfBar,

        //percentage of bar to shift the handle
        movement = (percent(pxToMove, elemDim) * 100).toFixed(this.options.decimal);
        //fixing the decimal value for the location number, is passed to other methods as a fixed floating-point value
        location = parseFloat(location.toFixed(this.options.decimal));
        // declare empty object for css adjustments, only used with 2 handled-sliders
        var css = {};

        this._setValues($hndl, location);

        // TODO update to calculate based on values set to respective inputs??
        if (isDbl) {
          var isLeftHndl = this.handles.index($hndl) === 0,

          //empty variable, will be used for min-height/width for fill bar
          dim,

          //percentage w/h of the handle compared to the slider bar
          handlePct = ~~(percent(handleDim, elemDim) * 100);
          //if left handle, the math is slightly different than if it's the right handle, and the left/top property needs to be changed for the fill bar
          if (isLeftHndl) {
            //left or top percentage value to apply to the fill bar.
            css[lOrT] = movement + '%';
            //calculate the new min-height/width for the fill bar.
            dim = parseFloat(this.$handle2[0].style[lOrT]) - movement + handlePct;
            //this callback is necessary to prevent errors and allow the proper placement and initialization of a 2-handled slider
            //plus, it means we don't care if 'dim' isNaN on init, it won't be in the future.
            if (cb && typeof cb === 'function') {
              cb();
            } //this is only needed for the initialization of 2 handled sliders
          } else {
            //just caching the value of the left/bottom handle's left/top property
            var handlePos = parseFloat(this.$handle[0].style[lOrT]);
            //calculate the new min-height/width for the fill bar. Use isNaN to prevent false positives for numbers <= 0
            //based on the percentage of movement of the handle being manipulated, less the opposing handle's left/top position, plus the percentage w/h of the handle itself
            dim = movement - (isNaN(handlePos) ? (this.options.initialStart - this.options.start) / ((this.options.end - this.options.start) / 100) : handlePos) + handlePct;
          }
          // assign the min-height/width to our css object
          css['min-' + hOrW] = dim + '%';
        }

        this.$element.one('finished.zf.animate', function () {
          /**
           * Fires when the handle is done moving.
           * @event Slider#moved
           */
          _this.$element.trigger('moved.zf.slider', [$hndl]);
        });

        //because we don't know exactly how the handle will be moved, check the amount of time it should take to move.
        var moveTime = this.$element.data('dragging') ? 1000 / 60 : this.options.moveTime;

        Foundation.Move(moveTime, $hndl, function () {
          // adjusting the left/top property of the handle, based on the percentage calculated above
          // if movement isNaN, that is because the slider is hidden and we cannot determine handle width,
          // fall back to next best guess.
          if (isNaN(movement)) {
            $hndl.css(lOrT, pctOfBar * 100 + '%');
          } else {
            $hndl.css(lOrT, movement + '%');
          }

          if (!_this.options.doubleSided) {
            //if single-handled, a simple method to expand the fill bar
            _this.$fill.css(hOrW, pctOfBar * 100 + '%');
          } else {
            //otherwise, use the css object we created above
            _this.$fill.css(css);
          }
        });

        /**
         * Fires when the value has not been change for a given time.
         * @event Slider#changed
         */
        clearTimeout(_this.timeout);
        _this.timeout = setTimeout(function () {
          _this.$element.trigger('changed.zf.slider', [$hndl]);
        }, _this.options.changedDelay);
      }

      /**
       * Sets the initial attribute for the slider element.
       * @function
       * @private
       * @param {Number} idx - index of the current handle/input to use.
       */

    }, {
      key: '_setInitAttr',
      value: function _setInitAttr(idx) {
        var initVal = idx === 0 ? this.options.initialStart : this.options.initialEnd;
        var id = this.inputs.eq(idx).attr('id') || Foundation.GetYoDigits(6, 'slider');
        this.inputs.eq(idx).attr({
          'id': id,
          'max': this.options.end,
          'min': this.options.start,
          'step': this.options.step
        });
        this.inputs.eq(idx).val(initVal);
        this.handles.eq(idx).attr({
          'role': 'slider',
          'aria-controls': id,
          'aria-valuemax': this.options.end,
          'aria-valuemin': this.options.start,
          'aria-valuenow': initVal,
          'aria-orientation': this.options.vertical ? 'vertical' : 'horizontal',
          'tabindex': 0
        });
      }

      /**
       * Sets the input and `aria-valuenow` values for the slider element.
       * @function
       * @private
       * @param {jQuery} $handle - the currently selected handle.
       * @param {Number} val - floating point of the new value.
       */

    }, {
      key: '_setValues',
      value: function _setValues($handle, val) {
        var idx = this.options.doubleSided ? this.handles.index($handle) : 0;
        this.inputs.eq(idx).val(val);
        $handle.attr('aria-valuenow', val);
      }

      /**
       * Handles events on the slider element.
       * Calculates the new location of the current handle.
       * If there are two handles and the bar was clicked, it determines which handle to move.
       * @function
       * @private
       * @param {Object} e - the `event` object passed from the listener.
       * @param {jQuery} $handle - the current handle to calculate for, if selected.
       * @param {Number} val - floating point number for the new value of the slider.
       * TODO clean this up, there's a lot of repeated code between this and the _setHandlePos fn.
       */

    }, {
      key: '_handleEvent',
      value: function _handleEvent(e, $handle, val) {
        var value, hasVal;
        if (!val) {
          //click or drag events
          e.preventDefault();
          var _this = this,
              vertical = this.options.vertical,
              param = vertical ? 'height' : 'width',
              direction = vertical ? 'top' : 'left',
              eventOffset = vertical ? e.pageY : e.pageX,
              halfOfHandle = this.$handle[0].getBoundingClientRect()[param] / 2,
              barDim = this.$element[0].getBoundingClientRect()[param],
              windowScroll = vertical ? $(window).scrollTop() : $(window).scrollLeft();

          var elemOffset = this.$element.offset()[direction];

          // touch events emulated by the touch util give position relative to screen, add window.scroll to event coordinates...
          // best way to guess this is simulated is if clientY == pageY
          if (e.clientY === e.pageY) {
            eventOffset = eventOffset + windowScroll;
          }
          var eventFromBar = eventOffset - elemOffset;
          var barXY;
          if (eventFromBar < 0) {
            barXY = 0;
          } else if (eventFromBar > barDim) {
            barXY = barDim;
          } else {
            barXY = eventFromBar;
          }
          var offsetPct = percent(barXY, barDim);

          value = this._value(offsetPct);

          // turn everything around for RTL, yay math!
          if (Foundation.rtl() && !this.options.vertical) {
            value = this.options.end - value;
          }

          value = _this._adjustValue(null, value);
          //boolean flag for the setHandlePos fn, specifically for vertical sliders
          hasVal = false;

          if (!$handle) {
            //figure out which handle it is, pass it to the next function.
            var firstHndlPos = absPosition(this.$handle, direction, barXY, param),
                secndHndlPos = absPosition(this.$handle2, direction, barXY, param);
            $handle = firstHndlPos <= secndHndlPos ? this.$handle : this.$handle2;
          }
        } else {
          //change event on input
          value = this._adjustValue(null, val);
          hasVal = true;
        }

        this._setHandlePos($handle, value, hasVal);
      }

      /**
       * Adjustes value for handle in regard to step value. returns adjusted value
       * @function
       * @private
       * @param {jQuery} $handle - the selected handle.
       * @param {Number} value - value to adjust. used if $handle is falsy
       */

    }, {
      key: '_adjustValue',
      value: function _adjustValue($handle, value) {
        var val,
            step = this.options.step,
            div = parseFloat(step / 2),
            left,
            prev_val,
            next_val;
        if (!!$handle) {
          val = parseFloat($handle.attr('aria-valuenow'));
        } else {
          val = value;
        }
        left = val % step;
        prev_val = val - left;
        next_val = prev_val + step;
        if (left === 0) {
          return val;
        }
        val = val >= prev_val + div ? next_val : prev_val;
        return val;
      }

      /**
       * Adds event listeners to the slider elements.
       * @function
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        this._eventsForHandle(this.$handle);
        if (this.handles[1]) {
          this._eventsForHandle(this.$handle2);
        }
      }

      /**
       * Adds event listeners a particular handle
       * @function
       * @private
       * @param {jQuery} $handle - the current handle to apply listeners to.
       */

    }, {
      key: '_eventsForHandle',
      value: function _eventsForHandle($handle) {
        var _this = this,
            curHandle,
            timer;

        this.inputs.off('change.zf.slider').on('change.zf.slider', function (e) {
          var idx = _this.inputs.index($(this));
          _this._handleEvent(e, _this.handles.eq(idx), $(this).val());
        });

        if (this.options.clickSelect) {
          this.$element.off('click.zf.slider').on('click.zf.slider', function (e) {
            if (_this.$element.data('dragging')) {
              return false;
            }

            if (!$(e.target).is('[data-slider-handle]')) {
              if (_this.options.doubleSided) {
                _this._handleEvent(e);
              } else {
                _this._handleEvent(e, _this.$handle);
              }
            }
          });
        }

        if (this.options.draggable) {
          this.handles.addTouch();

          var $body = $('body');
          $handle.off('mousedown.zf.slider').on('mousedown.zf.slider', function (e) {
            $handle.addClass('is-dragging');
            _this.$fill.addClass('is-dragging'); //
            _this.$element.data('dragging', true);

            curHandle = $(e.currentTarget);

            $body.on('mousemove.zf.slider', function (e) {
              e.preventDefault();
              _this._handleEvent(e, curHandle);
            }).on('mouseup.zf.slider', function (e) {
              _this._handleEvent(e, curHandle);

              $handle.removeClass('is-dragging');
              _this.$fill.removeClass('is-dragging');
              _this.$element.data('dragging', false);

              $body.off('mousemove.zf.slider mouseup.zf.slider');
            });
          }
          // prevent events triggered by touch
          ).on('selectstart.zf.slider touchmove.zf.slider', function (e) {
            e.preventDefault();
          });
        }

        $handle.off('keydown.zf.slider').on('keydown.zf.slider', function (e) {
          var _$handle = $(this),
              idx = _this.options.doubleSided ? _this.handles.index(_$handle) : 0,
              oldValue = parseFloat(_this.inputs.eq(idx).val()),
              newValue;

          // handle keyboard event with keyboard util
          Foundation.Keyboard.handleKey(e, 'Slider', {
            decrease: function decrease() {
              newValue = oldValue - _this.options.step;
            },
            increase: function increase() {
              newValue = oldValue + _this.options.step;
            },
            decrease_fast: function decrease_fast() {
              newValue = oldValue - _this.options.step * 10;
            },
            increase_fast: function increase_fast() {
              newValue = oldValue + _this.options.step * 10;
            },
            handled: function handled() {
              // only set handle pos when event was handled specially
              e.preventDefault();
              _this._setHandlePos(_$handle, newValue, true);
            }
          });
          /*if (newValue) { // if pressed key has special function, update value
            e.preventDefault();
            _this._setHandlePos(_$handle, newValue);
          }*/
        });
      }

      /**
       * Destroys the slider plugin.
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.handles.off('.zf.slider');
        this.inputs.off('.zf.slider');
        this.$element.off('.zf.slider');

        clearTimeout(this.timeout);

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Slider;
  }();

  Slider.defaults = {
    /**
     * Minimum value for the slider scale.
     * @option
     * @type {number}
     * @default 0
     */
    start: 0,
    /**
     * Maximum value for the slider scale.
     * @option
     * @type {number}
     * @default 100
     */
    end: 100,
    /**
     * Minimum value change per change event.
     * @option
     * @type {number}
     * @default 1
     */
    step: 1,
    /**
     * Value at which the handle/input *(left handle/first input)* should be set to on initialization.
     * @option
     * @type {number}
     * @default 0
     */
    initialStart: 0,
    /**
     * Value at which the right handle/second input should be set to on initialization.
     * @option
     * @type {number}
     * @default 100
     */
    initialEnd: 100,
    /**
     * Allows the input to be located outside the container and visible. Set to by the JS
     * @option
     * @type {boolean}
     * @default false
     */
    binding: false,
    /**
     * Allows the user to click/tap on the slider bar to select a value.
     * @option
     * @type {boolean}
     * @default true
     */
    clickSelect: true,
    /**
     * Set to true and use the `vertical` class to change alignment to vertical.
     * @option
     * @type {boolean}
     * @default false
     */
    vertical: false,
    /**
     * Allows the user to drag the slider handle(s) to select a value.
     * @option
     * @type {boolean}
     * @default true
     */
    draggable: true,
    /**
     * Disables the slider and prevents event listeners from being applied. Double checked by JS with `disabledClass`.
     * @option
     * @type {boolean}
     * @default false
     */
    disabled: false,
    /**
     * Allows the use of two handles. Double checked by the JS. Changes some logic handling.
     * @option
     * @type {boolean}
     * @default false
     */
    doubleSided: false,
    /**
     * Potential future feature.
     */
    // steps: 100,
    /**
     * Number of decimal places the plugin should go to for floating point precision.
     * @option
     * @type {number}
     * @default 2
     */
    decimal: 2,
    /**
     * Time delay for dragged elements.
     */
    // dragDelay: 0,
    /**
     * Time, in ms, to animate the movement of a slider handle if user clicks/taps on the bar. Needs to be manually set if updating the transition time in the Sass settings.
     * @option
     * @type {number}
     * @default 200
     */
    moveTime: 200, //update this if changing the transition time in the sass
    /**
     * Class applied to disabled sliders.
     * @option
     * @type {string}
     * @default 'disabled'
     */
    disabledClass: 'disabled',
    /**
     * Will invert the default layout for a vertical<span data-tooltip title="who would do this???"> </span>slider.
     * @option
     * @type {boolean}
     * @default false
     */
    invertVertical: false,
    /**
     * Milliseconds before the `changed.zf-slider` event is triggered after value change.
     * @option
     * @type {number}
     * @default 500
     */
    changedDelay: 500,
    /**
    * Basevalue for non-linear sliders
    * @option
    * @type {number}
    * @default 5
    */
    nonLinearBase: 5,
    /**
    * Basevalue for non-linear sliders, possible values are: `'linear'`, `'pow'` & `'log'`. Pow and Log use the nonLinearBase setting.
    * @option
    * @type {string}
    * @default 'linear'
    */
    positionValueFunction: 'linear'
  };

  function percent(frac, num) {
    return frac / num;
  }
  function absPosition($handle, dir, clickPos, param) {
    return Math.abs($handle.position()[dir] + $handle[param]() / 2 - clickPos);
  }
  function baseLog(base, value) {
    return Math.log(value) / Math.log(base);
  }

  // Window exports
  Foundation.plugin(Slider, 'Slider');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Sticky module.
   * @module foundation.sticky
   * @requires foundation.util.triggers
   * @requires foundation.util.mediaQuery
   */

  var Sticky = function () {
    /**
     * Creates a new instance of a sticky thing.
     * @class
     * @param {jQuery} element - jQuery object to make sticky.
     * @param {Object} options - options object passed when creating the element programmatically.
     */
    function Sticky(element, options) {
      _classCallCheck(this, Sticky);

      this.$element = element;
      this.options = $.extend({}, Sticky.defaults, this.$element.data(), options);

      this._init();

      Foundation.registerPlugin(this, 'Sticky');
    }

    /**
     * Initializes the sticky element by adding classes, getting/setting dimensions, breakpoints and attributes
     * @function
     * @private
     */


    _createClass(Sticky, [{
      key: '_init',
      value: function _init() {
        var $parent = this.$element.parent('[data-sticky-container]'),
            id = this.$element[0].id || Foundation.GetYoDigits(6, 'sticky'),
            _this = this;

        if (!$parent.length) {
          this.wasWrapped = true;
        }
        this.$container = $parent.length ? $parent : $(this.options.container).wrapInner(this.$element);
        this.$container.addClass(this.options.containerClass);

        this.$element.addClass(this.options.stickyClass).attr({ 'data-resize': id });

        this.scrollCount = this.options.checkEvery;
        this.isStuck = false;
        $(window).one('load.zf.sticky', function () {
          //We calculate the container height to have correct values for anchor points offset calculation.
          _this.containerHeight = _this.$element.css("display") == "none" ? 0 : _this.$element[0].getBoundingClientRect().height;
          _this.$container.css('height', _this.containerHeight);
          _this.elemHeight = _this.containerHeight;
          if (_this.options.anchor !== '') {
            _this.$anchor = $('#' + _this.options.anchor);
          } else {
            _this._parsePoints();
          }

          _this._setSizes(function () {
            var scroll = window.pageYOffset;
            _this._calc(false, scroll);
            //Unstick the element will ensure that proper classes are set.
            if (!_this.isStuck) {
              _this._removeSticky(scroll >= _this.topPoint ? false : true);
            }
          });
          _this._events(id.split('-').reverse().join('-'));
        });
      }

      /**
       * If using multiple elements as anchors, calculates the top and bottom pixel values the sticky thing should stick and unstick on.
       * @function
       * @private
       */

    }, {
      key: '_parsePoints',
      value: function _parsePoints() {
        var top = this.options.topAnchor == "" ? 1 : this.options.topAnchor,
            btm = this.options.btmAnchor == "" ? document.documentElement.scrollHeight : this.options.btmAnchor,
            pts = [top, btm],
            breaks = {};
        for (var i = 0, len = pts.length; i < len && pts[i]; i++) {
          var pt;
          if (typeof pts[i] === 'number') {
            pt = pts[i];
          } else {
            var place = pts[i].split(':'),
                anchor = $('#' + place[0]);

            pt = anchor.offset().top;
            if (place[1] && place[1].toLowerCase() === 'bottom') {
              pt += anchor[0].getBoundingClientRect().height;
            }
          }
          breaks[i] = pt;
        }

        this.points = breaks;
        return;
      }

      /**
       * Adds event handlers for the scrolling element.
       * @private
       * @param {String} id - psuedo-random id for unique scroll event listener.
       */

    }, {
      key: '_events',
      value: function _events(id) {
        var _this = this,
            scrollListener = this.scrollListener = 'scroll.zf.' + id;
        if (this.isOn) {
          return;
        }
        if (this.canStick) {
          this.isOn = true;
          $(window).off(scrollListener).on(scrollListener, function (e) {
            if (_this.scrollCount === 0) {
              _this.scrollCount = _this.options.checkEvery;
              _this._setSizes(function () {
                _this._calc(false, window.pageYOffset);
              });
            } else {
              _this.scrollCount--;
              _this._calc(false, window.pageYOffset);
            }
          });
        }

        this.$element.off('resizeme.zf.trigger').on('resizeme.zf.trigger', function (e, el) {
          _this._setSizes(function () {
            _this._calc(false);
            if (_this.canStick) {
              if (!_this.isOn) {
                _this._events(id);
              }
            } else if (_this.isOn) {
              _this._pauseListeners(scrollListener);
            }
          });
        });
      }

      /**
       * Removes event handlers for scroll and change events on anchor.
       * @fires Sticky#pause
       * @param {String} scrollListener - unique, namespaced scroll listener attached to `window`
       */

    }, {
      key: '_pauseListeners',
      value: function _pauseListeners(scrollListener) {
        this.isOn = false;
        $(window).off(scrollListener);

        /**
         * Fires when the plugin is paused due to resize event shrinking the view.
         * @event Sticky#pause
         * @private
         */
        this.$element.trigger('pause.zf.sticky');
      }

      /**
       * Called on every `scroll` event and on `_init`
       * fires functions based on booleans and cached values
       * @param {Boolean} checkSizes - true if plugin should recalculate sizes and breakpoints.
       * @param {Number} scroll - current scroll position passed from scroll event cb function. If not passed, defaults to `window.pageYOffset`.
       */

    }, {
      key: '_calc',
      value: function _calc(checkSizes, scroll) {
        if (checkSizes) {
          this._setSizes();
        }

        if (!this.canStick) {
          if (this.isStuck) {
            this._removeSticky(true);
          }
          return false;
        }

        if (!scroll) {
          scroll = window.pageYOffset;
        }

        if (scroll >= this.topPoint) {
          if (scroll <= this.bottomPoint) {
            if (!this.isStuck) {
              this._setSticky();
            }
          } else {
            if (this.isStuck) {
              this._removeSticky(false);
            }
          }
        } else {
          if (this.isStuck) {
            this._removeSticky(true);
          }
        }
      }

      /**
       * Causes the $element to become stuck.
       * Adds `position: fixed;`, and helper classes.
       * @fires Sticky#stuckto
       * @function
       * @private
       */

    }, {
      key: '_setSticky',
      value: function _setSticky() {
        var _this = this,
            stickTo = this.options.stickTo,
            mrgn = stickTo === 'top' ? 'marginTop' : 'marginBottom',
            notStuckTo = stickTo === 'top' ? 'bottom' : 'top',
            css = {};

        css[mrgn] = this.options[mrgn] + 'em';
        css[stickTo] = 0;
        css[notStuckTo] = 'auto';
        this.isStuck = true;
        this.$element.removeClass('is-anchored is-at-' + notStuckTo).addClass('is-stuck is-at-' + stickTo).css(css
        /**
         * Fires when the $element has become `position: fixed;`
         * Namespaced to `top` or `bottom`, e.g. `sticky.zf.stuckto:top`
         * @event Sticky#stuckto
         */
        ).trigger('sticky.zf.stuckto:' + stickTo);
        this.$element.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
          _this._setSizes();
        });
      }

      /**
       * Causes the $element to become unstuck.
       * Removes `position: fixed;`, and helper classes.
       * Adds other helper classes.
       * @param {Boolean} isTop - tells the function if the $element should anchor to the top or bottom of its $anchor element.
       * @fires Sticky#unstuckfrom
       * @private
       */

    }, {
      key: '_removeSticky',
      value: function _removeSticky(isTop) {
        var stickTo = this.options.stickTo,
            stickToTop = stickTo === 'top',
            css = {},
            anchorPt = (this.points ? this.points[1] - this.points[0] : this.anchorHeight) - this.elemHeight,
            mrgn = stickToTop ? 'marginTop' : 'marginBottom',
            notStuckTo = stickToTop ? 'bottom' : 'top',
            topOrBottom = isTop ? 'top' : 'bottom';

        css[mrgn] = 0;

        css['bottom'] = 'auto';
        if (isTop) {
          css['top'] = 0;
        } else {
          css['top'] = anchorPt;
        }

        this.isStuck = false;
        this.$element.removeClass('is-stuck is-at-' + stickTo).addClass('is-anchored is-at-' + topOrBottom).css(css
        /**
         * Fires when the $element has become anchored.
         * Namespaced to `top` or `bottom`, e.g. `sticky.zf.unstuckfrom:bottom`
         * @event Sticky#unstuckfrom
         */
        ).trigger('sticky.zf.unstuckfrom:' + topOrBottom);
      }

      /**
       * Sets the $element and $container sizes for plugin.
       * Calls `_setBreakPoints`.
       * @param {Function} cb - optional callback function to fire on completion of `_setBreakPoints`.
       * @private
       */

    }, {
      key: '_setSizes',
      value: function _setSizes(cb) {
        this.canStick = Foundation.MediaQuery.is(this.options.stickyOn);
        if (!this.canStick) {
          if (cb && typeof cb === 'function') {
            cb();
          }
        }
        var _this = this,
            newElemWidth = this.$container[0].getBoundingClientRect().width,
            comp = window.getComputedStyle(this.$container[0]),
            pdngl = parseInt(comp['padding-left'], 10),
            pdngr = parseInt(comp['padding-right'], 10);

        if (this.$anchor && this.$anchor.length) {
          this.anchorHeight = this.$anchor[0].getBoundingClientRect().height;
        } else {
          this._parsePoints();
        }

        this.$element.css({
          'max-width': newElemWidth - pdngl - pdngr + 'px'
        });

        var newContainerHeight = this.$element[0].getBoundingClientRect().height || this.containerHeight;
        if (this.$element.css("display") == "none") {
          newContainerHeight = 0;
        }
        this.containerHeight = newContainerHeight;
        this.$container.css({
          height: newContainerHeight
        });
        this.elemHeight = newContainerHeight;

        if (!this.isStuck) {
          if (this.$element.hasClass('is-at-bottom')) {
            var anchorPt = (this.points ? this.points[1] - this.$container.offset().top : this.anchorHeight) - this.elemHeight;
            this.$element.css('top', anchorPt);
          }
        }

        this._setBreakPoints(newContainerHeight, function () {
          if (cb && typeof cb === 'function') {
            cb();
          }
        });
      }

      /**
       * Sets the upper and lower breakpoints for the element to become sticky/unsticky.
       * @param {Number} elemHeight - px value for sticky.$element height, calculated by `_setSizes`.
       * @param {Function} cb - optional callback function to be called on completion.
       * @private
       */

    }, {
      key: '_setBreakPoints',
      value: function _setBreakPoints(elemHeight, cb) {
        if (!this.canStick) {
          if (cb && typeof cb === 'function') {
            cb();
          } else {
            return false;
          }
        }
        var mTop = emCalc(this.options.marginTop),
            mBtm = emCalc(this.options.marginBottom),
            topPoint = this.points ? this.points[0] : this.$anchor.offset().top,
            bottomPoint = this.points ? this.points[1] : topPoint + this.anchorHeight,

        // topPoint = this.$anchor.offset().top || this.points[0],
        // bottomPoint = topPoint + this.anchorHeight || this.points[1],
        winHeight = window.innerHeight;

        if (this.options.stickTo === 'top') {
          topPoint -= mTop;
          bottomPoint -= elemHeight + mTop;
        } else if (this.options.stickTo === 'bottom') {
          topPoint -= winHeight - (elemHeight + mBtm);
          bottomPoint -= winHeight - mBtm;
        } else {
          //this would be the stickTo: both option... tricky
        }

        this.topPoint = topPoint;
        this.bottomPoint = bottomPoint;

        if (cb && typeof cb === 'function') {
          cb();
        }
      }

      /**
       * Destroys the current sticky element.
       * Resets the element to the top position first.
       * Removes event listeners, JS-added css properties and classes, and unwraps the $element if the JS added the $container.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this._removeSticky(true);

        this.$element.removeClass(this.options.stickyClass + ' is-anchored is-at-top').css({
          height: '',
          top: '',
          bottom: '',
          'max-width': ''
        }).off('resizeme.zf.trigger');
        if (this.$anchor && this.$anchor.length) {
          this.$anchor.off('change.zf.sticky');
        }
        $(window).off(this.scrollListener);

        if (this.wasWrapped) {
          this.$element.unwrap();
        } else {
          this.$container.removeClass(this.options.containerClass).css({
            height: ''
          });
        }
        Foundation.unregisterPlugin(this);
      }
    }]);

    return Sticky;
  }();

  Sticky.defaults = {
    /**
     * Customizable container template. Add your own classes for styling and sizing.
     * @option
     * @type {string}
     * @default '&lt;div data-sticky-container&gt;&lt;/div&gt;'
     */
    container: '<div data-sticky-container></div>',
    /**
     * Location in the view the element sticks to. Can be `'top'` or `'bottom'`.
     * @option
     * @type {string}
     * @default 'top'
     */
    stickTo: 'top',
    /**
     * If anchored to a single element, the id of that element.
     * @option
     * @type {string}
     * @default ''
     */
    anchor: '',
    /**
     * If using more than one element as anchor points, the id of the top anchor.
     * @option
     * @type {string}
     * @default ''
     */
    topAnchor: '',
    /**
     * If using more than one element as anchor points, the id of the bottom anchor.
     * @option
     * @type {string}
     * @default ''
     */
    btmAnchor: '',
    /**
     * Margin, in `em`'s to apply to the top of the element when it becomes sticky.
     * @option
     * @type {number}
     * @default 1
     */
    marginTop: 1,
    /**
     * Margin, in `em`'s to apply to the bottom of the element when it becomes sticky.
     * @option
     * @type {number}
     * @default 1
     */
    marginBottom: 1,
    /**
     * Breakpoint string that is the minimum screen size an element should become sticky.
     * @option
     * @type {string}
     * @default 'medium'
     */
    stickyOn: 'medium',
    /**
     * Class applied to sticky element, and removed on destruction. Foundation defaults to `sticky`.
     * @option
     * @type {string}
     * @default 'sticky'
     */
    stickyClass: 'sticky',
    /**
     * Class applied to sticky container. Foundation defaults to `sticky-container`.
     * @option
     * @type {string}
     * @default 'sticky-container'
     */
    containerClass: 'sticky-container',
    /**
     * Number of scroll events between the plugin's recalculating sticky points. Setting it to `0` will cause it to recalc every scroll event, setting it to `-1` will prevent recalc on scroll.
     * @option
     * @type {number}
     * @default -1
     */
    checkEvery: -1
  };

  /**
   * Helper function to calculate em values
   * @param Number {em} - number of em's to calculate into pixels
   */
  function emCalc(em) {
    return parseInt(window.getComputedStyle(document.body, null).fontSize, 10) * em;
  }

  // Window exports
  Foundation.plugin(Sticky, 'Sticky');
}(jQuery);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Tabs module.
   * @module foundation.tabs
   * @requires foundation.util.keyboard
   * @requires foundation.util.timerAndImageLoader if tabs contain images
   */

  var Tabs = function () {
    /**
     * Creates a new instance of tabs.
     * @class
     * @fires Tabs#init
     * @param {jQuery} element - jQuery object to make into tabs.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function Tabs(element, options) {
      _classCallCheck(this, Tabs);

      this.$element = element;
      this.options = $.extend({}, Tabs.defaults, this.$element.data(), options);

      this._init();
      Foundation.registerPlugin(this, 'Tabs');
      Foundation.Keyboard.register('Tabs', {
        'ENTER': 'open',
        'SPACE': 'open',
        'ARROW_RIGHT': 'next',
        'ARROW_UP': 'previous',
        'ARROW_DOWN': 'next',
        'ARROW_LEFT': 'previous'
        // 'TAB': 'next',
        // 'SHIFT_TAB': 'previous'
      });
    }

    /**
     * Initializes the tabs by showing and focusing (if autoFocus=true) the preset active tab.
     * @private
     */


    _createClass(Tabs, [{
      key: '_init',
      value: function _init() {
        var _this2 = this;

        var _this = this;

        this.$element.attr({ 'role': 'tablist' });
        this.$tabTitles = this.$element.find('.' + this.options.linkClass);
        this.$tabContent = $('[data-tabs-content="' + this.$element[0].id + '"]');

        this.$tabTitles.each(function () {
          var $elem = $(this),
              $link = $elem.find('a'),
              isActive = $elem.hasClass('' + _this.options.linkActiveClass),
              hash = $link[0].hash.slice(1),
              linkId = $link[0].id ? $link[0].id : hash + '-label',
              $tabContent = $('#' + hash);

          $elem.attr({ 'role': 'presentation' });

          $link.attr({
            'role': 'tab',
            'aria-controls': hash,
            'aria-selected': isActive,
            'id': linkId
          });

          $tabContent.attr({
            'role': 'tabpanel',
            'aria-hidden': !isActive,
            'aria-labelledby': linkId
          });

          if (isActive && _this.options.autoFocus) {
            $(window).load(function () {
              $('html, body').animate({ scrollTop: $elem.offset().top }, _this.options.deepLinkSmudgeDelay, function () {
                $link.focus();
              });
            });
          }
        });
        if (this.options.matchHeight) {
          var $images = this.$tabContent.find('img');

          if ($images.length) {
            Foundation.onImagesLoaded($images, this._setHeight.bind(this));
          } else {
            this._setHeight();
          }
        }

        //current context-bound function to open tabs on page load or history popstate
        this._checkDeepLink = function () {
          var anchor = window.location.hash;
          //need a hash and a relevant anchor in this tabset
          if (anchor.length) {
            var $link = _this2.$element.find('[href="' + anchor + '"]');
            if ($link.length) {
              _this2.selectTab($(anchor), true);

              //roll up a little to show the titles
              if (_this2.options.deepLinkSmudge) {
                var offset = _this2.$element.offset();
                $('html, body').animate({ scrollTop: offset.top }, _this2.options.deepLinkSmudgeDelay);
              }

              /**
                * Fires when the zplugin has deeplinked at pageload
                * @event Tabs#deeplink
                */
              _this2.$element.trigger('deeplink.zf.tabs', [$link, $(anchor)]);
            }
          }
        };

        //use browser to open a tab, if it exists in this tabset
        if (this.options.deepLink) {
          this._checkDeepLink();
        }

        this._events();
      }

      /**
       * Adds event handlers for items within the tabs.
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        this._addKeyHandler();
        this._addClickHandler();
        this._setHeightMqHandler = null;

        if (this.options.matchHeight) {
          this._setHeightMqHandler = this._setHeight.bind(this);

          $(window).on('changed.zf.mediaquery', this._setHeightMqHandler);
        }

        if (this.options.deepLink) {
          $(window).on('popstate', this._checkDeepLink);
        }
      }

      /**
       * Adds click handlers for items within the tabs.
       * @private
       */

    }, {
      key: '_addClickHandler',
      value: function _addClickHandler() {
        var _this = this;

        this.$element.off('click.zf.tabs').on('click.zf.tabs', '.' + this.options.linkClass, function (e) {
          e.preventDefault();
          e.stopPropagation();
          _this._handleTabChange($(this));
        });
      }

      /**
       * Adds keyboard event handlers for items within the tabs.
       * @private
       */

    }, {
      key: '_addKeyHandler',
      value: function _addKeyHandler() {
        var _this = this;

        this.$tabTitles.off('keydown.zf.tabs').on('keydown.zf.tabs', function (e) {
          if (e.which === 9) return;

          var $element = $(this),
              $elements = $element.parent('ul').children('li'),
              $prevElement,
              $nextElement;

          $elements.each(function (i) {
            if ($(this).is($element)) {
              if (_this.options.wrapOnKeys) {
                $prevElement = i === 0 ? $elements.last() : $elements.eq(i - 1);
                $nextElement = i === $elements.length - 1 ? $elements.first() : $elements.eq(i + 1);
              } else {
                $prevElement = $elements.eq(Math.max(0, i - 1));
                $nextElement = $elements.eq(Math.min(i + 1, $elements.length - 1));
              }
              return;
            }
          });

          // handle keyboard event with keyboard util
          Foundation.Keyboard.handleKey(e, 'Tabs', {
            open: function open() {
              $element.find('[role="tab"]').focus();
              _this._handleTabChange($element);
            },
            previous: function previous() {
              $prevElement.find('[role="tab"]').focus();
              _this._handleTabChange($prevElement);
            },
            next: function next() {
              $nextElement.find('[role="tab"]').focus();
              _this._handleTabChange($nextElement);
            },
            handled: function handled() {
              e.stopPropagation();
              e.preventDefault();
            }
          });
        });
      }

      /**
       * Opens the tab `$targetContent` defined by `$target`. Collapses active tab.
       * @param {jQuery} $target - Tab to open.
       * @param {boolean} historyHandled - browser has already handled a history update
       * @fires Tabs#change
       * @function
       */

    }, {
      key: '_handleTabChange',
      value: function _handleTabChange($target, historyHandled) {

        /**
         * Check for active class on target. Collapse if exists.
         */
        if ($target.hasClass('' + this.options.linkActiveClass)) {
          if (this.options.activeCollapse) {
            this._collapseTab($target);

            /**
             * Fires when the zplugin has successfully collapsed tabs.
             * @event Tabs#collapse
             */
            this.$element.trigger('collapse.zf.tabs', [$target]);
          }
          return;
        }

        var $oldTab = this.$element.find('.' + this.options.linkClass + '.' + this.options.linkActiveClass),
            $tabLink = $target.find('[role="tab"]'),
            hash = $tabLink[0].hash,
            $targetContent = this.$tabContent.find(hash);

        //close old tab
        this._collapseTab($oldTab);

        //open new tab
        this._openTab($target);

        //either replace or update browser history
        if (this.options.deepLink && !historyHandled) {
          var anchor = $target.find('a').attr('href');

          if (this.options.updateHistory) {
            history.pushState({}, '', anchor);
          } else {
            history.replaceState({}, '', anchor);
          }
        }

        /**
         * Fires when the plugin has successfully changed tabs.
         * @event Tabs#change
         */
        this.$element.trigger('change.zf.tabs', [$target, $targetContent]);

        //fire to children a mutation event
        $targetContent.find("[data-mutate]").trigger("mutateme.zf.trigger");
      }

      /**
       * Opens the tab `$targetContent` defined by `$target`.
       * @param {jQuery} $target - Tab to Open.
       * @function
       */

    }, {
      key: '_openTab',
      value: function _openTab($target) {
        var $tabLink = $target.find('[role="tab"]'),
            hash = $tabLink[0].hash,
            $targetContent = this.$tabContent.find(hash);

        $target.addClass('' + this.options.linkActiveClass);

        $tabLink.attr({ 'aria-selected': 'true' });

        $targetContent.addClass('' + this.options.panelActiveClass).attr({ 'aria-hidden': 'false' });
      }

      /**
       * Collapses `$targetContent` defined by `$target`.
       * @param {jQuery} $target - Tab to Open.
       * @function
       */

    }, {
      key: '_collapseTab',
      value: function _collapseTab($target) {
        var $target_anchor = $target.removeClass('' + this.options.linkActiveClass).find('[role="tab"]').attr({ 'aria-selected': 'false' });

        $('#' + $target_anchor.attr('aria-controls')).removeClass('' + this.options.panelActiveClass).attr({ 'aria-hidden': 'true' });
      }

      /**
       * Public method for selecting a content pane to display.
       * @param {jQuery | String} elem - jQuery object or string of the id of the pane to display.
       * @param {boolean} historyHandled - browser has already handled a history update
       * @function
       */

    }, {
      key: 'selectTab',
      value: function selectTab(elem, historyHandled) {
        var idStr;

        if ((typeof elem === 'undefined' ? 'undefined' : _typeof(elem)) === 'object') {
          idStr = elem[0].id;
        } else {
          idStr = elem;
        }

        if (idStr.indexOf('#') < 0) {
          idStr = '#' + idStr;
        }

        var $target = this.$tabTitles.find('[href="' + idStr + '"]').parent('.' + this.options.linkClass);

        this._handleTabChange($target, historyHandled);
      }
    }, {
      key: '_setHeight',

      /**
       * Sets the height of each panel to the height of the tallest panel.
       * If enabled in options, gets called on media query change.
       * If loading content via external source, can be called directly or with _reflow.
       * If enabled with `data-match-height="true"`, tabs sets to equal height
       * @function
       * @private
       */
      value: function _setHeight() {
        var max = 0,
            _this = this; // Lock down the `this` value for the root tabs object

        this.$tabContent.find('.' + this.options.panelClass).css('height', '').each(function () {

          var panel = $(this),
              isActive = panel.hasClass('' + _this.options.panelActiveClass); // get the options from the parent instead of trying to get them from the child

          if (!isActive) {
            panel.css({ 'visibility': 'hidden', 'display': 'block' });
          }

          var temp = this.getBoundingClientRect().height;

          if (!isActive) {
            panel.css({
              'visibility': '',
              'display': ''
            });
          }

          max = temp > max ? temp : max;
        }).css('height', max + 'px');
      }

      /**
       * Destroys an instance of an tabs.
       * @fires Tabs#destroyed
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.$element.find('.' + this.options.linkClass).off('.zf.tabs').hide().end().find('.' + this.options.panelClass).hide();

        if (this.options.matchHeight) {
          if (this._setHeightMqHandler != null) {
            $(window).off('changed.zf.mediaquery', this._setHeightMqHandler);
          }
        }

        if (this.options.deepLink) {
          $(window).off('popstate', this._checkDeepLink);
        }

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Tabs;
  }();

  Tabs.defaults = {
    /**
     * Allows the window to scroll to content of pane specified by hash anchor
     * @option
     * @type {boolean}
     * @default false
     */
    deepLink: false,

    /**
     * Adjust the deep link scroll to make sure the top of the tab panel is visible
     * @option
     * @type {boolean}
     * @default false
     */
    deepLinkSmudge: false,

    /**
     * Animation time (ms) for the deep link adjustment
     * @option
     * @type {number}
     * @default 300
     */
    deepLinkSmudgeDelay: 300,

    /**
     * Update the browser history with the open tab
     * @option
     * @type {boolean}
     * @default false
     */
    updateHistory: false,

    /**
     * Allows the window to scroll to content of active pane on load if set to true.
     * Not recommended if more than one tab panel per page.
     * @option
     * @type {boolean}
     * @default false
     */
    autoFocus: false,

    /**
     * Allows keyboard input to 'wrap' around the tab links.
     * @option
     * @type {boolean}
     * @default true
     */
    wrapOnKeys: true,

    /**
     * Allows the tab content panes to match heights if set to true.
     * @option
     * @type {boolean}
     * @default false
     */
    matchHeight: false,

    /**
     * Allows active tabs to collapse when clicked.
     * @option
     * @type {boolean}
     * @default false
     */
    activeCollapse: false,

    /**
     * Class applied to `li`'s in tab link list.
     * @option
     * @type {string}
     * @default 'tabs-title'
     */
    linkClass: 'tabs-title',

    /**
     * Class applied to the active `li` in tab link list.
     * @option
     * @type {string}
     * @default 'is-active'
     */
    linkActiveClass: 'is-active',

    /**
     * Class applied to the content containers.
     * @option
     * @type {string}
     * @default 'tabs-panel'
     */
    panelClass: 'tabs-panel',

    /**
     * Class applied to the active content container.
     * @option
     * @type {string}
     * @default 'is-active'
     */
    panelActiveClass: 'is-active'
  };

  // Window exports
  Foundation.plugin(Tabs, 'Tabs');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Toggler module.
   * @module foundation.toggler
   * @requires foundation.util.motion
   * @requires foundation.util.triggers
   */

  var Toggler = function () {
    /**
     * Creates a new instance of Toggler.
     * @class
     * @fires Toggler#init
     * @param {Object} element - jQuery object to add the trigger to.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function Toggler(element, options) {
      _classCallCheck(this, Toggler);

      this.$element = element;
      this.options = $.extend({}, Toggler.defaults, element.data(), options);
      this.className = '';

      this._init();
      this._events();

      Foundation.registerPlugin(this, 'Toggler');
    }

    /**
     * Initializes the Toggler plugin by parsing the toggle class from data-toggler, or animation classes from data-animate.
     * @function
     * @private
     */


    _createClass(Toggler, [{
      key: '_init',
      value: function _init() {
        var input;
        // Parse animation classes if they were set
        if (this.options.animate) {
          input = this.options.animate.split(' ');

          this.animationIn = input[0];
          this.animationOut = input[1] || null;
        }
        // Otherwise, parse toggle class
        else {
            input = this.$element.data('toggler');
            // Allow for a . at the beginning of the string
            this.className = input[0] === '.' ? input.slice(1) : input;
          }

        // Add ARIA attributes to triggers
        var id = this.$element[0].id;
        $('[data-open="' + id + '"], [data-close="' + id + '"], [data-toggle="' + id + '"]').attr('aria-controls', id);
        // If the target is hidden, add aria-hidden
        this.$element.attr('aria-expanded', this.$element.is(':hidden') ? false : true);
      }

      /**
       * Initializes events for the toggle trigger.
       * @function
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        this.$element.off('toggle.zf.trigger').on('toggle.zf.trigger', this.toggle.bind(this));
      }

      /**
       * Toggles the target class on the target element. An event is fired from the original trigger depending on if the resultant state was "on" or "off".
       * @function
       * @fires Toggler#on
       * @fires Toggler#off
       */

    }, {
      key: 'toggle',
      value: function toggle() {
        this[this.options.animate ? '_toggleAnimate' : '_toggleClass']();
      }
    }, {
      key: '_toggleClass',
      value: function _toggleClass() {
        this.$element.toggleClass(this.className);

        var isOn = this.$element.hasClass(this.className);
        if (isOn) {
          /**
           * Fires if the target element has the class after a toggle.
           * @event Toggler#on
           */
          this.$element.trigger('on.zf.toggler');
        } else {
          /**
           * Fires if the target element does not have the class after a toggle.
           * @event Toggler#off
           */
          this.$element.trigger('off.zf.toggler');
        }

        this._updateARIA(isOn);
        this.$element.find('[data-mutate]').trigger('mutateme.zf.trigger');
      }
    }, {
      key: '_toggleAnimate',
      value: function _toggleAnimate() {
        var _this = this;

        if (this.$element.is(':hidden')) {
          Foundation.Motion.animateIn(this.$element, this.animationIn, function () {
            _this._updateARIA(true);
            this.trigger('on.zf.toggler');
            this.find('[data-mutate]').trigger('mutateme.zf.trigger');
          });
        } else {
          Foundation.Motion.animateOut(this.$element, this.animationOut, function () {
            _this._updateARIA(false);
            this.trigger('off.zf.toggler');
            this.find('[data-mutate]').trigger('mutateme.zf.trigger');
          });
        }
      }
    }, {
      key: '_updateARIA',
      value: function _updateARIA(isOn) {
        this.$element.attr('aria-expanded', isOn ? true : false);
      }

      /**
       * Destroys the instance of Toggler on the element.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.$element.off('.zf.toggler');
        Foundation.unregisterPlugin(this);
      }
    }]);

    return Toggler;
  }();

  Toggler.defaults = {
    /**
     * Tells the plugin if the element should animated when toggled.
     * @option
     * @type {boolean}
     * @default false
     */
    animate: false
  };

  // Window exports
  Foundation.plugin(Toggler, 'Toggler');
}(jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * Tooltip module.
   * @module foundation.tooltip
   * @requires foundation.util.box
   * @requires foundation.util.mediaQuery
   * @requires foundation.util.triggers
   */

  var Tooltip = function () {
    /**
     * Creates a new instance of a Tooltip.
     * @class
     * @fires Tooltip#init
     * @param {jQuery} element - jQuery object to attach a tooltip to.
     * @param {Object} options - object to extend the default configuration.
     */
    function Tooltip(element, options) {
      _classCallCheck(this, Tooltip);

      this.$element = element;
      this.options = $.extend({}, Tooltip.defaults, this.$element.data(), options);

      this.isActive = false;
      this.isClick = false;
      this._init();

      Foundation.registerPlugin(this, 'Tooltip');
    }

    /**
     * Initializes the tooltip by setting the creating the tip element, adding it's text, setting private variables and setting attributes on the anchor.
     * @private
     */


    _createClass(Tooltip, [{
      key: '_init',
      value: function _init() {
        var elemId = this.$element.attr('aria-describedby') || Foundation.GetYoDigits(6, 'tooltip');

        this.options.positionClass = this.options.positionClass || this._getPositionClass(this.$element);
        this.options.tipText = this.options.tipText || this.$element.attr('title');
        this.template = this.options.template ? $(this.options.template) : this._buildTemplate(elemId);

        if (this.options.allowHtml) {
          this.template.appendTo(document.body).html(this.options.tipText).hide();
        } else {
          this.template.appendTo(document.body).text(this.options.tipText).hide();
        }

        this.$element.attr({
          'title': '',
          'aria-describedby': elemId,
          'data-yeti-box': elemId,
          'data-toggle': elemId,
          'data-resize': elemId
        }).addClass(this.options.triggerClass);

        //helper variables to track movement on collisions
        this.usedPositions = [];
        this.counter = 4;
        this.classChanged = false;

        this._events();
      }

      /**
       * Grabs the current positioning class, if present, and returns the value or an empty string.
       * @private
       */

    }, {
      key: '_getPositionClass',
      value: function _getPositionClass(element) {
        if (!element) {
          return '';
        }
        // var position = element.attr('class').match(/top|left|right/g);
        var position = element[0].className.match(/\b(top|left|right)\b/g);
        position = position ? position[0] : '';
        return position;
      }
    }, {
      key: '_buildTemplate',

      /**
       * builds the tooltip element, adds attributes, and returns the template.
       * @private
       */
      value: function _buildTemplate(id) {
        var templateClasses = (this.options.tooltipClass + ' ' + this.options.positionClass + ' ' + this.options.templateClasses).trim();
        var $template = $('<div></div>').addClass(templateClasses).attr({
          'role': 'tooltip',
          'aria-hidden': true,
          'data-is-active': false,
          'data-is-focus': false,
          'id': id
        });
        return $template;
      }

      /**
       * Function that gets called if a collision event is detected.
       * @param {String} position - positioning class to try
       * @private
       */

    }, {
      key: '_reposition',
      value: function _reposition(position) {
        this.usedPositions.push(position ? position : 'bottom');

        //default, try switching to opposite side
        if (!position && this.usedPositions.indexOf('top') < 0) {
          this.template.addClass('top');
        } else if (position === 'top' && this.usedPositions.indexOf('bottom') < 0) {
          this.template.removeClass(position);
        } else if (position === 'left' && this.usedPositions.indexOf('right') < 0) {
          this.template.removeClass(position).addClass('right');
        } else if (position === 'right' && this.usedPositions.indexOf('left') < 0) {
          this.template.removeClass(position).addClass('left');
        }

        //if default change didn't work, try bottom or left first
        else if (!position && this.usedPositions.indexOf('top') > -1 && this.usedPositions.indexOf('left') < 0) {
            this.template.addClass('left');
          } else if (position === 'top' && this.usedPositions.indexOf('bottom') > -1 && this.usedPositions.indexOf('left') < 0) {
            this.template.removeClass(position).addClass('left');
          } else if (position === 'left' && this.usedPositions.indexOf('right') > -1 && this.usedPositions.indexOf('bottom') < 0) {
            this.template.removeClass(position);
          } else if (position === 'right' && this.usedPositions.indexOf('left') > -1 && this.usedPositions.indexOf('bottom') < 0) {
            this.template.removeClass(position);
          }
          //if nothing cleared, set to bottom
          else {
              this.template.removeClass(position);
            }
        this.classChanged = true;
        this.counter--;
      }

      /**
       * sets the position class of an element and recursively calls itself until there are no more possible positions to attempt, or the tooltip element is no longer colliding.
       * if the tooltip is larger than the screen width, default to full width - any user selected margin
       * @private
       */

    }, {
      key: '_setPosition',
      value: function _setPosition() {
        var position = this._getPositionClass(this.template),
            $tipDims = Foundation.Box.GetDimensions(this.template),
            $anchorDims = Foundation.Box.GetDimensions(this.$element),
            direction = position === 'left' ? 'left' : position === 'right' ? 'left' : 'top',
            param = direction === 'top' ? 'height' : 'width',
            offset = param === 'height' ? this.options.vOffset : this.options.hOffset,
            _this = this;

        if ($tipDims.width >= $tipDims.windowDims.width || !this.counter && !Foundation.Box.ImNotTouchingYou(this.template)) {
          this.template.offset(Foundation.Box.GetOffsets(this.template, this.$element, 'center bottom', this.options.vOffset, this.options.hOffset, true)).css({
            // this.$element.offset(Foundation.GetOffsets(this.template, this.$element, 'center bottom', this.options.vOffset, this.options.hOffset, true)).css({
            'width': $anchorDims.windowDims.width - this.options.hOffset * 2,
            'height': 'auto'
          });
          return false;
        }

        this.template.offset(Foundation.Box.GetOffsets(this.template, this.$element, 'center ' + (position || 'bottom'), this.options.vOffset, this.options.hOffset));

        while (!Foundation.Box.ImNotTouchingYou(this.template) && this.counter) {
          this._reposition(position);
          this._setPosition();
        }
      }

      /**
       * reveals the tooltip, and fires an event to close any other open tooltips on the page
       * @fires Tooltip#closeme
       * @fires Tooltip#show
       * @function
       */

    }, {
      key: 'show',
      value: function show() {
        if (this.options.showOn !== 'all' && !Foundation.MediaQuery.is(this.options.showOn)) {
          // console.error('The screen is too small to display this tooltip');
          return false;
        }

        var _this = this;
        this.template.css('visibility', 'hidden').show();
        this._setPosition();

        /**
         * Fires to close all other open tooltips on the page
         * @event Closeme#tooltip
         */
        this.$element.trigger('closeme.zf.tooltip', this.template.attr('id'));

        this.template.attr({
          'data-is-active': true,
          'aria-hidden': false
        });
        _this.isActive = true;
        // console.log(this.template);
        this.template.stop().hide().css('visibility', '').fadeIn(this.options.fadeInDuration, function () {
          //maybe do stuff?
        });
        /**
         * Fires when the tooltip is shown
         * @event Tooltip#show
         */
        this.$element.trigger('show.zf.tooltip');
      }

      /**
       * Hides the current tooltip, and resets the positioning class if it was changed due to collision
       * @fires Tooltip#hide
       * @function
       */

    }, {
      key: 'hide',
      value: function hide() {
        // console.log('hiding', this.$element.data('yeti-box'));
        var _this = this;
        this.template.stop().attr({
          'aria-hidden': true,
          'data-is-active': false
        }).fadeOut(this.options.fadeOutDuration, function () {
          _this.isActive = false;
          _this.isClick = false;
          if (_this.classChanged) {
            _this.template.removeClass(_this._getPositionClass(_this.template)).addClass(_this.options.positionClass);

            _this.usedPositions = [];
            _this.counter = 4;
            _this.classChanged = false;
          }
        });
        /**
         * fires when the tooltip is hidden
         * @event Tooltip#hide
         */
        this.$element.trigger('hide.zf.tooltip');
      }

      /**
       * adds event listeners for the tooltip and its anchor
       * TODO combine some of the listeners like focus and mouseenter, etc.
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this;
        var $template = this.template;
        var isFocus = false;

        if (!this.options.disableHover) {

          this.$element.on('mouseenter.zf.tooltip', function (e) {
            if (!_this.isActive) {
              _this.timeout = setTimeout(function () {
                _this.show();
              }, _this.options.hoverDelay);
            }
          }).on('mouseleave.zf.tooltip', function (e) {
            clearTimeout(_this.timeout);
            if (!isFocus || _this.isClick && !_this.options.clickOpen) {
              _this.hide();
            }
          });
        }

        if (this.options.clickOpen) {
          this.$element.on('mousedown.zf.tooltip', function (e) {
            e.stopImmediatePropagation();
            if (_this.isClick) {
              //_this.hide();
              // _this.isClick = false;
            } else {
              _this.isClick = true;
              if ((_this.options.disableHover || !_this.$element.attr('tabindex')) && !_this.isActive) {
                _this.show();
              }
            }
          });
        } else {
          this.$element.on('mousedown.zf.tooltip', function (e) {
            e.stopImmediatePropagation();
            _this.isClick = true;
          });
        }

        if (!this.options.disableForTouch) {
          this.$element.on('tap.zf.tooltip touchend.zf.tooltip', function (e) {
            _this.isActive ? _this.hide() : _this.show();
          });
        }

        this.$element.on({
          // 'toggle.zf.trigger': this.toggle.bind(this),
          // 'close.zf.trigger': this.hide.bind(this)
          'close.zf.trigger': this.hide.bind(this)
        });

        this.$element.on('focus.zf.tooltip', function (e) {
          isFocus = true;
          if (_this.isClick) {
            // If we're not showing open on clicks, we need to pretend a click-launched focus isn't
            // a real focus, otherwise on hover and come back we get bad behavior
            if (!_this.options.clickOpen) {
              isFocus = false;
            }
            return false;
          } else {
            _this.show();
          }
        }).on('focusout.zf.tooltip', function (e) {
          isFocus = false;
          _this.isClick = false;
          _this.hide();
        }).on('resizeme.zf.trigger', function () {
          if (_this.isActive) {
            _this._setPosition();
          }
        });
      }

      /**
       * adds a toggle method, in addition to the static show() & hide() functions
       * @function
       */

    }, {
      key: 'toggle',
      value: function toggle() {
        if (this.isActive) {
          this.hide();
        } else {
          this.show();
        }
      }

      /**
       * Destroys an instance of tooltip, removes template element from the view.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.$element.attr('title', this.template.text()).off('.zf.trigger .zf.tooltip').removeClass('has-tip top right left').removeAttr('aria-describedby aria-haspopup data-disable-hover data-resize data-toggle data-tooltip data-yeti-box');

        this.template.remove();

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Tooltip;
  }();

  Tooltip.defaults = {
    disableForTouch: false,
    /**
     * Time, in ms, before a tooltip should open on hover.
     * @option
     * @type {number}
     * @default 200
     */
    hoverDelay: 200,
    /**
     * Time, in ms, a tooltip should take to fade into view.
     * @option
     * @type {number}
     * @default 150
     */
    fadeInDuration: 150,
    /**
     * Time, in ms, a tooltip should take to fade out of view.
     * @option
     * @type {number}
     * @default 150
     */
    fadeOutDuration: 150,
    /**
     * Disables hover events from opening the tooltip if set to true
     * @option
     * @type {boolean}
     * @default false
     */
    disableHover: false,
    /**
     * Optional addtional classes to apply to the tooltip template on init.
     * @option
     * @type {string}
     * @default ''
     */
    templateClasses: '',
    /**
     * Non-optional class added to tooltip templates. Foundation default is 'tooltip'.
     * @option
     * @type {string}
     * @default 'tooltip'
     */
    tooltipClass: 'tooltip',
    /**
     * Class applied to the tooltip anchor element.
     * @option
     * @type {string}
     * @default 'has-tip'
     */
    triggerClass: 'has-tip',
    /**
     * Minimum breakpoint size at which to open the tooltip.
     * @option
     * @type {string}
     * @default 'small'
     */
    showOn: 'small',
    /**
     * Custom template to be used to generate markup for tooltip.
     * @option
     * @type {string}
     * @default ''
     */
    template: '',
    /**
     * Text displayed in the tooltip template on open.
     * @option
     * @type {string}
     * @default ''
     */
    tipText: '',
    touchCloseText: 'Tap to close.',
    /**
     * Allows the tooltip to remain open if triggered with a click or touch event.
     * @option
     * @type {boolean}
     * @default true
     */
    clickOpen: true,
    /**
     * Additional positioning classes, set by the JS
     * @option
     * @type {string}
     * @default ''
     */
    positionClass: '',
    /**
     * Distance, in pixels, the template should push away from the anchor on the Y axis.
     * @option
     * @type {number}
     * @default 10
     */
    vOffset: 10,
    /**
     * Distance, in pixels, the template should push away from the anchor on the X axis, if aligned to a side.
     * @option
     * @type {number}
     * @default 12
     */
    hOffset: 12,
    /**
    * Allow HTML in tooltip. Warning: If you are loading user-generated content into tooltips,
    * allowing HTML may open yourself up to XSS attacks.
    * @option
    * @type {boolean}
    * @default false
    */
    allowHtml: false
  };

  /**
   * TODO utilize resize event trigger
   */

  // Window exports
  Foundation.plugin(Tooltip, 'Tooltip');
}(jQuery);
'use strict';

!function ($) {

  Foundation.Box = {
    ImNotTouchingYou: ImNotTouchingYou,
    GetDimensions: GetDimensions,
    GetOffsets: GetOffsets

    /**
     * Compares the dimensions of an element to a container and determines collision events with container.
     * @function
     * @param {jQuery} element - jQuery object to test for collisions.
     * @param {jQuery} parent - jQuery object to use as bounding container.
     * @param {Boolean} lrOnly - set to true to check left and right values only.
     * @param {Boolean} tbOnly - set to true to check top and bottom values only.
     * @default if no parent object passed, detects collisions with `window`.
     * @returns {Boolean} - true if collision free, false if a collision in any direction.
     */
  };function ImNotTouchingYou(element, parent, lrOnly, tbOnly) {
    var eleDims = GetDimensions(element),
        top,
        bottom,
        left,
        right;

    if (parent) {
      var parDims = GetDimensions(parent);

      bottom = eleDims.offset.top + eleDims.height <= parDims.height + parDims.offset.top;
      top = eleDims.offset.top >= parDims.offset.top;
      left = eleDims.offset.left >= parDims.offset.left;
      right = eleDims.offset.left + eleDims.width <= parDims.width + parDims.offset.left;
    } else {
      bottom = eleDims.offset.top + eleDims.height <= eleDims.windowDims.height + eleDims.windowDims.offset.top;
      top = eleDims.offset.top >= eleDims.windowDims.offset.top;
      left = eleDims.offset.left >= eleDims.windowDims.offset.left;
      right = eleDims.offset.left + eleDims.width <= eleDims.windowDims.width;
    }

    var allDirs = [bottom, top, left, right];

    if (lrOnly) {
      return left === right === true;
    }

    if (tbOnly) {
      return top === bottom === true;
    }

    return allDirs.indexOf(false) === -1;
  };

  /**
   * Uses native methods to return an object of dimension values.
   * @function
   * @param {jQuery || HTML} element - jQuery object or DOM element for which to get the dimensions. Can be any element other that document or window.
   * @returns {Object} - nested object of integer pixel values
   * TODO - if element is window, return only those values.
   */
  function GetDimensions(elem, test) {
    elem = elem.length ? elem[0] : elem;

    if (elem === window || elem === document) {
      throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");
    }

    var rect = elem.getBoundingClientRect(),
        parRect = elem.parentNode.getBoundingClientRect(),
        winRect = document.body.getBoundingClientRect(),
        winY = window.pageYOffset,
        winX = window.pageXOffset;

    return {
      width: rect.width,
      height: rect.height,
      offset: {
        top: rect.top + winY,
        left: rect.left + winX
      },
      parentDims: {
        width: parRect.width,
        height: parRect.height,
        offset: {
          top: parRect.top + winY,
          left: parRect.left + winX
        }
      },
      windowDims: {
        width: winRect.width,
        height: winRect.height,
        offset: {
          top: winY,
          left: winX
        }
      }
    };
  }

  /**
   * Returns an object of top and left integer pixel values for dynamically rendered elements,
   * such as: Tooltip, Reveal, and Dropdown
   * @function
   * @param {jQuery} element - jQuery object for the element being positioned.
   * @param {jQuery} anchor - jQuery object for the element's anchor point.
   * @param {String} position - a string relating to the desired position of the element, relative to it's anchor
   * @param {Number} vOffset - integer pixel value of desired vertical separation between anchor and element.
   * @param {Number} hOffset - integer pixel value of desired horizontal separation between anchor and element.
   * @param {Boolean} isOverflow - if a collision event is detected, sets to true to default the element to full width - any desired offset.
   * TODO alter/rewrite to work with `em` values as well/instead of pixels
   */
  function GetOffsets(element, anchor, position, vOffset, hOffset, isOverflow) {
    var $eleDims = GetDimensions(element),
        $anchorDims = anchor ? GetDimensions(anchor) : null;

    switch (position) {
      case 'top':
        return {
          left: Foundation.rtl() ? $anchorDims.offset.left - $eleDims.width + $anchorDims.width : $anchorDims.offset.left,
          top: $anchorDims.offset.top - ($eleDims.height + vOffset)
        };
        break;
      case 'left':
        return {
          left: $anchorDims.offset.left - ($eleDims.width + hOffset),
          top: $anchorDims.offset.top
        };
        break;
      case 'right':
        return {
          left: $anchorDims.offset.left + $anchorDims.width + hOffset,
          top: $anchorDims.offset.top
        };
        break;
      case 'center top':
        return {
          left: $anchorDims.offset.left + $anchorDims.width / 2 - $eleDims.width / 2,
          top: $anchorDims.offset.top - ($eleDims.height + vOffset)
        };
        break;
      case 'center bottom':
        return {
          left: isOverflow ? hOffset : $anchorDims.offset.left + $anchorDims.width / 2 - $eleDims.width / 2,
          top: $anchorDims.offset.top + $anchorDims.height + vOffset
        };
        break;
      case 'center left':
        return {
          left: $anchorDims.offset.left - ($eleDims.width + hOffset),
          top: $anchorDims.offset.top + $anchorDims.height / 2 - $eleDims.height / 2
        };
        break;
      case 'center right':
        return {
          left: $anchorDims.offset.left + $anchorDims.width + hOffset + 1,
          top: $anchorDims.offset.top + $anchorDims.height / 2 - $eleDims.height / 2
        };
        break;
      case 'center':
        return {
          left: $eleDims.windowDims.offset.left + $eleDims.windowDims.width / 2 - $eleDims.width / 2,
          top: $eleDims.windowDims.offset.top + $eleDims.windowDims.height / 2 - $eleDims.height / 2
        };
        break;
      case 'reveal':
        return {
          left: ($eleDims.windowDims.width - $eleDims.width) / 2,
          top: $eleDims.windowDims.offset.top + vOffset
        };
      case 'reveal full':
        return {
          left: $eleDims.windowDims.offset.left,
          top: $eleDims.windowDims.offset.top
        };
        break;
      case 'left bottom':
        return {
          left: $anchorDims.offset.left,
          top: $anchorDims.offset.top + $anchorDims.height + vOffset
        };
        break;
      case 'right bottom':
        return {
          left: $anchorDims.offset.left + $anchorDims.width + hOffset - $eleDims.width,
          top: $anchorDims.offset.top + $anchorDims.height + vOffset
        };
        break;
      default:
        return {
          left: Foundation.rtl() ? $anchorDims.offset.left - $eleDims.width + $anchorDims.width : $anchorDims.offset.left + hOffset,
          top: $anchorDims.offset.top + $anchorDims.height + vOffset
        };
    }
  }
}(jQuery);
/*******************************************
 *                                         *
 * This util was created by Marius Olbertz *
 * Please thank Marius on GitHub /owlbertz *
 * or the web http://www.mariusolbertz.de/ *
 *                                         *
 ******************************************/

'use strict';

!function ($) {

  var keyCodes = {
    9: 'TAB',
    13: 'ENTER',
    27: 'ESCAPE',
    32: 'SPACE',
    37: 'ARROW_LEFT',
    38: 'ARROW_UP',
    39: 'ARROW_RIGHT',
    40: 'ARROW_DOWN'
  };

  var commands = {};

  var Keyboard = {
    keys: getKeyCodes(keyCodes),

    /**
     * Parses the (keyboard) event and returns a String that represents its key
     * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
     * @param {Event} event - the event generated by the event handler
     * @return String key - String that represents the key pressed
     */
    parseKey: function parseKey(event) {
      var key = keyCodes[event.which || event.keyCode] || String.fromCharCode(event.which).toUpperCase();

      // Remove un-printable characters, e.g. for `fromCharCode` calls for CTRL only events
      key = key.replace(/\W+/, '');

      if (event.shiftKey) key = 'SHIFT_' + key;
      if (event.ctrlKey) key = 'CTRL_' + key;
      if (event.altKey) key = 'ALT_' + key;

      // Remove trailing underscore, in case only modifiers were used (e.g. only `CTRL_ALT`)
      key = key.replace(/_$/, '');

      return key;
    },


    /**
     * Handles the given (keyboard) event
     * @param {Event} event - the event generated by the event handler
     * @param {String} component - Foundation component's name, e.g. Slider or Reveal
     * @param {Objects} functions - collection of functions that are to be executed
     */
    handleKey: function handleKey(event, component, functions) {
      var commandList = commands[component],
          keyCode = this.parseKey(event),
          cmds,
          command,
          fn;

      if (!commandList) return console.warn('Component not defined!');

      if (typeof commandList.ltr === 'undefined') {
        // this component does not differentiate between ltr and rtl
        cmds = commandList; // use plain list
      } else {
        // merge ltr and rtl: if document is rtl, rtl overwrites ltr and vice versa
        if (Foundation.rtl()) cmds = $.extend({}, commandList.ltr, commandList.rtl);else cmds = $.extend({}, commandList.rtl, commandList.ltr);
      }
      command = cmds[keyCode];

      fn = functions[command];
      if (fn && typeof fn === 'function') {
        // execute function  if exists
        var returnValue = fn.apply();
        if (functions.handled || typeof functions.handled === 'function') {
          // execute function when event was handled
          functions.handled(returnValue);
        }
      } else {
        if (functions.unhandled || typeof functions.unhandled === 'function') {
          // execute function when event was not handled
          functions.unhandled();
        }
      }
    },


    /**
     * Finds all focusable elements within the given `$element`
     * @param {jQuery} $element - jQuery object to search within
     * @return {jQuery} $focusable - all focusable elements within `$element`
     */
    findFocusable: function findFocusable($element) {
      if (!$element) {
        return false;
      }
      return $element.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]').filter(function () {
        if (!$(this).is(':visible') || $(this).attr('tabindex') < 0) {
          return false;
        } //only have visible elements and those that have a tabindex greater or equal 0
        return true;
      });
    },


    /**
     * Returns the component name name
     * @param {Object} component - Foundation component, e.g. Slider or Reveal
     * @return String componentName
     */

    register: function register(componentName, cmds) {
      commands[componentName] = cmds;
    },


    /**
     * Traps the focus in the given element.
     * @param  {jQuery} $element  jQuery object to trap the foucs into.
     */
    trapFocus: function trapFocus($element) {
      var $focusable = Foundation.Keyboard.findFocusable($element),
          $firstFocusable = $focusable.eq(0),
          $lastFocusable = $focusable.eq(-1);

      $element.on('keydown.zf.trapfocus', function (event) {
        if (event.target === $lastFocusable[0] && Foundation.Keyboard.parseKey(event) === 'TAB') {
          event.preventDefault();
          $firstFocusable.focus();
        } else if (event.target === $firstFocusable[0] && Foundation.Keyboard.parseKey(event) === 'SHIFT_TAB') {
          event.preventDefault();
          $lastFocusable.focus();
        }
      });
    },

    /**
     * Releases the trapped focus from the given element.
     * @param  {jQuery} $element  jQuery object to release the focus for.
     */
    releaseFocus: function releaseFocus($element) {
      $element.off('keydown.zf.trapfocus');
    }
  };

  /*
   * Constants for easier comparing.
   * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
   */
  function getKeyCodes(kcs) {
    var k = {};
    for (var kc in kcs) {
      k[kcs[kc]] = kcs[kc];
    }return k;
  }

  Foundation.Keyboard = Keyboard;
}(jQuery);
'use strict';

!function ($) {

  /**
   * Motion module.
   * @module foundation.motion
   */

  var initClasses = ['mui-enter', 'mui-leave'];
  var activeClasses = ['mui-enter-active', 'mui-leave-active'];

  var Motion = {
    animateIn: function animateIn(element, animation, cb) {
      animate(true, element, animation, cb);
    },

    animateOut: function animateOut(element, animation, cb) {
      animate(false, element, animation, cb);
    }
  };

  function Move(duration, elem, fn) {
    var anim,
        prog,
        start = null;
    // console.log('called');

    if (duration === 0) {
      fn.apply(elem);
      elem.trigger('finished.zf.animate', [elem]).triggerHandler('finished.zf.animate', [elem]);
      return;
    }

    function move(ts) {
      if (!start) start = ts;
      // console.log(start, ts);
      prog = ts - start;
      fn.apply(elem);

      if (prog < duration) {
        anim = window.requestAnimationFrame(move, elem);
      } else {
        window.cancelAnimationFrame(anim);
        elem.trigger('finished.zf.animate', [elem]).triggerHandler('finished.zf.animate', [elem]);
      }
    }
    anim = window.requestAnimationFrame(move);
  }

  /**
   * Animates an element in or out using a CSS transition class.
   * @function
   * @private
   * @param {Boolean} isIn - Defines if the animation is in or out.
   * @param {Object} element - jQuery or HTML object to animate.
   * @param {String} animation - CSS class to use.
   * @param {Function} cb - Callback to run when animation is finished.
   */
  function animate(isIn, element, animation, cb) {
    element = $(element).eq(0);

    if (!element.length) return;

    var initClass = isIn ? initClasses[0] : initClasses[1];
    var activeClass = isIn ? activeClasses[0] : activeClasses[1];

    // Set up the animation
    reset();

    element.addClass(animation).css('transition', 'none');

    requestAnimationFrame(function () {
      element.addClass(initClass);
      if (isIn) element.show();
    });

    // Start the animation
    requestAnimationFrame(function () {
      element[0].offsetWidth;
      element.css('transition', '').addClass(activeClass);
    });

    // Clean up the animation when it finishes
    element.one(Foundation.transitionend(element), finish);

    // Hides the element (for out animations), resets the element, and runs a callback
    function finish() {
      if (!isIn) element.hide();
      reset();
      if (cb) cb.apply(element);
    }

    // Resets transitions and removes motion-specific classes
    function reset() {
      element[0].style.transitionDuration = 0;
      element.removeClass(initClass + ' ' + activeClass + ' ' + animation);
    }
  }

  Foundation.Move = Move;
  Foundation.Motion = Motion;
}(jQuery);
'use strict';

!function ($) {

  var Nest = {
    Feather: function Feather(menu) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'zf';

      menu.attr('role', 'menubar');

      var items = menu.find('li').attr({ 'role': 'menuitem' }),
          subMenuClass = 'is-' + type + '-submenu',
          subItemClass = subMenuClass + '-item',
          hasSubClass = 'is-' + type + '-submenu-parent';

      items.each(function () {
        var $item = $(this),
            $sub = $item.children('ul');

        if ($sub.length) {
          $item.addClass(hasSubClass).attr({
            'aria-haspopup': true,
            'aria-label': $item.children('a:first').text()
          });
          // Note:  Drilldowns behave differently in how they hide, and so need
          // additional attributes.  We should look if this possibly over-generalized
          // utility (Nest) is appropriate when we rework menus in 6.4
          if (type === 'drilldown') {
            $item.attr({ 'aria-expanded': false });
          }

          $sub.addClass('submenu ' + subMenuClass).attr({
            'data-submenu': '',
            'role': 'menu'
          });
          if (type === 'drilldown') {
            $sub.attr({ 'aria-hidden': true });
          }
        }

        if ($item.parent('[data-submenu]').length) {
          $item.addClass('is-submenu-item ' + subItemClass);
        }
      });

      return;
    },
    Burn: function Burn(menu, type) {
      var //items = menu.find('li'),
      subMenuClass = 'is-' + type + '-submenu',
          subItemClass = subMenuClass + '-item',
          hasSubClass = 'is-' + type + '-submenu-parent';

      menu.find('>li, .menu, .menu > li').removeClass(subMenuClass + ' ' + subItemClass + ' ' + hasSubClass + ' is-submenu-item submenu is-active').removeAttr('data-submenu').css('display', '');

      // console.log(      menu.find('.' + subMenuClass + ', .' + subItemClass + ', .has-submenu, .is-submenu-item, .submenu, [data-submenu]')
      //           .removeClass(subMenuClass + ' ' + subItemClass + ' has-submenu is-submenu-item submenu')
      //           .removeAttr('data-submenu'));
      // items.each(function(){
      //   var $item = $(this),
      //       $sub = $item.children('ul');
      //   if($item.parent('[data-submenu]').length){
      //     $item.removeClass('is-submenu-item ' + subItemClass);
      //   }
      //   if($sub.length){
      //     $item.removeClass('has-submenu');
      //     $sub.removeClass('submenu ' + subMenuClass).removeAttr('data-submenu');
      //   }
      // });
    }
  };

  Foundation.Nest = Nest;
}(jQuery);
'use strict';

!function ($) {

  function Timer(elem, options, cb) {
    var _this = this,
        duration = options.duration,
        //options is an object for easily adding features later.
    nameSpace = Object.keys(elem.data())[0] || 'timer',
        remain = -1,
        start,
        timer;

    this.isPaused = false;

    this.restart = function () {
      remain = -1;
      clearTimeout(timer);
      this.start();
    };

    this.start = function () {
      this.isPaused = false;
      // if(!elem.data('paused')){ return false; }//maybe implement this sanity check if used for other things.
      clearTimeout(timer);
      remain = remain <= 0 ? duration : remain;
      elem.data('paused', false);
      start = Date.now();
      timer = setTimeout(function () {
        if (options.infinite) {
          _this.restart(); //rerun the timer.
        }
        if (cb && typeof cb === 'function') {
          cb();
        }
      }, remain);
      elem.trigger('timerstart.zf.' + nameSpace);
    };

    this.pause = function () {
      this.isPaused = true;
      //if(elem.data('paused')){ return false; }//maybe implement this sanity check if used for other things.
      clearTimeout(timer);
      elem.data('paused', true);
      var end = Date.now();
      remain = remain - (end - start);
      elem.trigger('timerpaused.zf.' + nameSpace);
    };
  }

  /**
   * Runs a callback function when images are fully loaded.
   * @param {Object} images - Image(s) to check if loaded.
   * @param {Func} callback - Function to execute when image is fully loaded.
   */
  function onImagesLoaded(images, callback) {
    var self = this,
        unloaded = images.length;

    if (unloaded === 0) {
      callback();
    }

    images.each(function () {
      // Check if image is loaded
      if (this.complete || this.readyState === 4 || this.readyState === 'complete') {
        singleImageLoaded();
      }
      // Force load the image
      else {
          // fix for IE. See https://css-tricks.com/snippets/jquery/fixing-load-in-ie-for-cached-images/
          var src = $(this).attr('src');
          $(this).attr('src', src + (src.indexOf('?') >= 0 ? '&' : '?') + new Date().getTime());
          $(this).one('load', function () {
            singleImageLoaded();
          });
        }
    });

    function singleImageLoaded() {
      unloaded--;
      if (unloaded === 0) {
        callback();
      }
    }
  }

  Foundation.Timer = Timer;
  Foundation.onImagesLoaded = onImagesLoaded;
}(jQuery);
'use strict';

//**************************************************
//**Work inspired by multiple jquery swipe plugins**
//**Done by Yohai Ararat ***************************
//**************************************************
(function ($) {

	$.spotSwipe = {
		version: '1.0.0',
		enabled: 'ontouchstart' in document.documentElement,
		preventDefault: false,
		moveThreshold: 75,
		timeThreshold: 200
	};

	var startPosX,
	    startPosY,
	    startTime,
	    elapsedTime,
	    isMoving = false;

	function onTouchEnd() {
		//  alert(this);
		this.removeEventListener('touchmove', onTouchMove);
		this.removeEventListener('touchend', onTouchEnd);
		isMoving = false;
	}

	function onTouchMove(e) {
		if ($.spotSwipe.preventDefault) {
			e.preventDefault();
		}
		if (isMoving) {
			var x = e.touches[0].pageX;
			var y = e.touches[0].pageY;
			var dx = startPosX - x;
			var dy = startPosY - y;
			var dir;
			elapsedTime = new Date().getTime() - startTime;
			if (Math.abs(dx) >= $.spotSwipe.moveThreshold && elapsedTime <= $.spotSwipe.timeThreshold) {
				dir = dx > 0 ? 'left' : 'right';
			}
			// else if(Math.abs(dy) >= $.spotSwipe.moveThreshold && elapsedTime <= $.spotSwipe.timeThreshold) {
			//   dir = dy > 0 ? 'down' : 'up';
			// }
			if (dir) {
				e.preventDefault();
				onTouchEnd.call(this);
				$(this).trigger('swipe', dir).trigger('swipe' + dir);
			}
		}
	}

	function onTouchStart(e) {
		if (e.touches.length == 1) {
			startPosX = e.touches[0].pageX;
			startPosY = e.touches[0].pageY;
			isMoving = true;
			startTime = new Date().getTime();
			this.addEventListener('touchmove', onTouchMove, false);
			this.addEventListener('touchend', onTouchEnd, false);
		}
	}

	function init() {
		this.addEventListener && this.addEventListener('touchstart', onTouchStart, false);
	}

	function teardown() {
		this.removeEventListener('touchstart', onTouchStart);
	}

	$.event.special.swipe = { setup: init };

	$.each(['left', 'up', 'down', 'right'], function () {
		$.event.special['swipe' + this] = { setup: function setup() {
				$(this).on('swipe', $.noop);
			} };
	});
})(jQuery);
/****************************************************
 * Method for adding psuedo drag events to elements *
 ***************************************************/
!function ($) {
	$.fn.addTouch = function () {
		this.each(function (i, el) {
			$(el).bind('touchstart touchmove touchend touchcancel', function () {
				//we pass the original event object because the jQuery event
				//object is normalized to w3c specs and does not provide the TouchList
				handleTouch(event);
			});
		});

		var handleTouch = function handleTouch(event) {
			var touches = event.changedTouches,
			    first = touches[0],
			    eventTypes = {
				touchstart: 'mousedown',
				touchmove: 'mousemove',
				touchend: 'mouseup'
			},
			    type = eventTypes[event.type],
			    simulatedEvent;

			if ('MouseEvent' in window && typeof window.MouseEvent === 'function') {
				simulatedEvent = new window.MouseEvent(type, {
					'bubbles': true,
					'cancelable': true,
					'screenX': first.screenX,
					'screenY': first.screenY,
					'clientX': first.clientX,
					'clientY': first.clientY
				});
			} else {
				simulatedEvent = document.createEvent('MouseEvent');
				simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0 /*left*/, null);
			}
			first.target.dispatchEvent(simulatedEvent);
		};
	};
}(jQuery);

//**********************************
//**From the jQuery Mobile Library**
//**need to recreate functionality**
//**and try to improve if possible**
//**********************************

/* Removing the jQuery function ****
************************************

(function( $, window, undefined ) {

	var $document = $( document ),
		// supportTouch = $.mobile.support.touch,
		touchStartEvent = 'touchstart'//supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = 'touchend'//supportTouch ? "touchend" : "mouseup",
		touchMoveEvent = 'touchmove'//supportTouch ? "touchmove" : "mousemove";

	// setup new event shortcuts
	$.each( ( "touchstart touchmove touchend " +
		"swipe swipeleft swiperight" ).split( " " ), function( i, name ) {

		$.fn[ name ] = function( fn ) {
			return fn ? this.bind( name, fn ) : this.trigger( name );
		};

		// jQuery < 1.8
		if ( $.attrFn ) {
			$.attrFn[ name ] = true;
		}
	});

	function triggerCustomEvent( obj, eventType, event, bubble ) {
		var originalType = event.type;
		event.type = eventType;
		if ( bubble ) {
			$.event.trigger( event, undefined, obj );
		} else {
			$.event.dispatch.call( obj, event );
		}
		event.type = originalType;
	}

	// also handles taphold

	// Also handles swipeleft, swiperight
	$.event.special.swipe = {

		// More than this horizontal displacement, and we will suppress scrolling.
		scrollSupressionThreshold: 30,

		// More time than this, and it isn't a swipe.
		durationThreshold: 1000,

		// Swipe horizontal displacement must be more than this.
		horizontalDistanceThreshold: window.devicePixelRatio >= 2 ? 15 : 30,

		// Swipe vertical displacement must be less than this.
		verticalDistanceThreshold: window.devicePixelRatio >= 2 ? 15 : 30,

		getLocation: function ( event ) {
			var winPageX = window.pageXOffset,
				winPageY = window.pageYOffset,
				x = event.clientX,
				y = event.clientY;

			if ( event.pageY === 0 && Math.floor( y ) > Math.floor( event.pageY ) ||
				event.pageX === 0 && Math.floor( x ) > Math.floor( event.pageX ) ) {

				// iOS4 clientX/clientY have the value that should have been
				// in pageX/pageY. While pageX/page/ have the value 0
				x = x - winPageX;
				y = y - winPageY;
			} else if ( y < ( event.pageY - winPageY) || x < ( event.pageX - winPageX ) ) {

				// Some Android browsers have totally bogus values for clientX/Y
				// when scrolling/zooming a page. Detectable since clientX/clientY
				// should never be smaller than pageX/pageY minus page scroll
				x = event.pageX - winPageX;
				y = event.pageY - winPageY;
			}

			return {
				x: x,
				y: y
			};
		},

		start: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event,
				location = $.event.special.swipe.getLocation( data );
			return {
						time: ( new Date() ).getTime(),
						coords: [ location.x, location.y ],
						origin: $( event.target )
					};
		},

		stop: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event,
				location = $.event.special.swipe.getLocation( data );
			return {
						time: ( new Date() ).getTime(),
						coords: [ location.x, location.y ]
					};
		},

		handleSwipe: function( start, stop, thisObject, origTarget ) {
			if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
				Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
				Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {
				var direction = start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight";

				triggerCustomEvent( thisObject, "swipe", $.Event( "swipe", { target: origTarget, swipestart: start, swipestop: stop }), true );
				triggerCustomEvent( thisObject, direction,$.Event( direction, { target: origTarget, swipestart: start, swipestop: stop } ), true );
				return true;
			}
			return false;

		},

		// This serves as a flag to ensure that at most one swipe event event is
		// in work at any given time
		eventInProgress: false,

		setup: function() {
			var events,
				thisObject = this,
				$this = $( thisObject ),
				context = {};

			// Retrieve the events data for this element and add the swipe context
			events = $.data( this, "mobile-events" );
			if ( !events ) {
				events = { length: 0 };
				$.data( this, "mobile-events", events );
			}
			events.length++;
			events.swipe = context;

			context.start = function( event ) {

				// Bail if we're already working on a swipe event
				if ( $.event.special.swipe.eventInProgress ) {
					return;
				}
				$.event.special.swipe.eventInProgress = true;

				var stop,
					start = $.event.special.swipe.start( event ),
					origTarget = event.target,
					emitted = false;

				context.move = function( event ) {
					if ( !start || event.isDefaultPrevented() ) {
						return;
					}

					stop = $.event.special.swipe.stop( event );
					if ( !emitted ) {
						emitted = $.event.special.swipe.handleSwipe( start, stop, thisObject, origTarget );
						if ( emitted ) {

							// Reset the context to make way for the next swipe event
							$.event.special.swipe.eventInProgress = false;
						}
					}
					// prevent scrolling
					if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
						event.preventDefault();
					}
				};

				context.stop = function() {
						emitted = true;

						// Reset the context to make way for the next swipe event
						$.event.special.swipe.eventInProgress = false;
						$document.off( touchMoveEvent, context.move );
						context.move = null;
				};

				$document.on( touchMoveEvent, context.move )
					.one( touchStopEvent, context.stop );
			};
			$this.on( touchStartEvent, context.start );
		},

		teardown: function() {
			var events, context;

			events = $.data( this, "mobile-events" );
			if ( events ) {
				context = events.swipe;
				delete events.swipe;
				events.length--;
				if ( events.length === 0 ) {
					$.removeData( this, "mobile-events" );
				}
			}

			if ( context ) {
				if ( context.start ) {
					$( this ).off( touchStartEvent, context.start );
				}
				if ( context.move ) {
					$document.off( touchMoveEvent, context.move );
				}
				if ( context.stop ) {
					$document.off( touchStopEvent, context.stop );
				}
			}
		}
	};
	$.each({
		swipeleft: "swipe.left",
		swiperight: "swipe.right"
	}, function( event, sourceEvent ) {

		$.event.special[ event ] = {
			setup: function() {
				$( this ).bind( sourceEvent, $.noop );
			},
			teardown: function() {
				$( this ).unbind( sourceEvent );
			}
		};
	});
})( jQuery, this );
*/
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function ($) {

  var MutationObserver = function () {
    var prefixes = ['WebKit', 'Moz', 'O', 'Ms', ''];
    for (var i = 0; i < prefixes.length; i++) {
      if (prefixes[i] + 'MutationObserver' in window) {
        return window[prefixes[i] + 'MutationObserver'];
      }
    }
    return false;
  }();

  var triggers = function triggers(el, type) {
    el.data(type).split(' ').forEach(function (id) {
      $('#' + id)[type === 'close' ? 'trigger' : 'triggerHandler'](type + '.zf.trigger', [el]);
    });
  };
  // Elements with [data-open] will reveal a plugin that supports it when clicked.
  $(document).on('click.zf.trigger', '[data-open]', function () {
    triggers($(this), 'open');
  });

  // Elements with [data-close] will close a plugin that supports it when clicked.
  // If used without a value on [data-close], the event will bubble, allowing it to close a parent component.
  $(document).on('click.zf.trigger', '[data-close]', function () {
    var id = $(this).data('close');
    if (id) {
      triggers($(this), 'close');
    } else {
      $(this).trigger('close.zf.trigger');
    }
  });

  // Elements with [data-toggle] will toggle a plugin that supports it when clicked.
  $(document).on('click.zf.trigger', '[data-toggle]', function () {
    var id = $(this).data('toggle');
    if (id) {
      triggers($(this), 'toggle');
    } else {
      $(this).trigger('toggle.zf.trigger');
    }
  });

  // Elements with [data-closable] will respond to close.zf.trigger events.
  $(document).on('close.zf.trigger', '[data-closable]', function (e) {
    e.stopPropagation();
    var animation = $(this).data('closable');

    if (animation !== '') {
      Foundation.Motion.animateOut($(this), animation, function () {
        $(this).trigger('closed.zf');
      });
    } else {
      $(this).fadeOut().trigger('closed.zf');
    }
  });

  $(document).on('focus.zf.trigger blur.zf.trigger', '[data-toggle-focus]', function () {
    var id = $(this).data('toggle-focus');
    $('#' + id).triggerHandler('toggle.zf.trigger', [$(this)]);
  });

  /**
  * Fires once after all other scripts have loaded
  * @function
  * @private
  */
  $(window).on('load', function () {
    checkListeners();
  });

  function checkListeners() {
    eventsListener();
    resizeListener();
    scrollListener();
    mutateListener();
    closemeListener();
  }

  //******** only fires this function once on load, if there's something to watch ********
  function closemeListener(pluginName) {
    var yetiBoxes = $('[data-yeti-box]'),
        plugNames = ['dropdown', 'tooltip', 'reveal'];

    if (pluginName) {
      if (typeof pluginName === 'string') {
        plugNames.push(pluginName);
      } else if ((typeof pluginName === 'undefined' ? 'undefined' : _typeof(pluginName)) === 'object' && typeof pluginName[0] === 'string') {
        plugNames.concat(pluginName);
      } else {
        console.error('Plugin names must be strings');
      }
    }
    if (yetiBoxes.length) {
      var listeners = plugNames.map(function (name) {
        return 'closeme.zf.' + name;
      }).join(' ');

      $(window).off(listeners).on(listeners, function (e, pluginId) {
        var plugin = e.namespace.split('.')[0];
        var plugins = $('[data-' + plugin + ']').not('[data-yeti-box="' + pluginId + '"]');

        plugins.each(function () {
          var _this = $(this);

          _this.triggerHandler('close.zf.trigger', [_this]);
        });
      });
    }
  }

  function resizeListener(debounce) {
    var timer = void 0,
        $nodes = $('[data-resize]');
    if ($nodes.length) {
      $(window).off('resize.zf.trigger').on('resize.zf.trigger', function (e) {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(function () {

          if (!MutationObserver) {
            //fallback for IE 9
            $nodes.each(function () {
              $(this).triggerHandler('resizeme.zf.trigger');
            });
          }
          //trigger all listening elements and signal a resize event
          $nodes.attr('data-events', "resize");
        }, debounce || 10); //default time to emit resize event
      });
    }
  }

  function scrollListener(debounce) {
    var timer = void 0,
        $nodes = $('[data-scroll]');
    if ($nodes.length) {
      $(window).off('scroll.zf.trigger').on('scroll.zf.trigger', function (e) {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(function () {

          if (!MutationObserver) {
            //fallback for IE 9
            $nodes.each(function () {
              $(this).triggerHandler('scrollme.zf.trigger');
            });
          }
          //trigger all listening elements and signal a scroll event
          $nodes.attr('data-events', "scroll");
        }, debounce || 10); //default time to emit scroll event
      });
    }
  }

  function mutateListener(debounce) {
    var $nodes = $('[data-mutate]');
    if ($nodes.length && MutationObserver) {
      //trigger all listening elements and signal a mutate event
      //no IE 9 or 10
      $nodes.each(function () {
        $(this).triggerHandler('mutateme.zf.trigger');
      });
    }
  }

  function eventsListener() {
    if (!MutationObserver) {
      return false;
    }
    var nodes = document.querySelectorAll('[data-resize], [data-scroll], [data-mutate]');

    //element callback
    var listeningElementsMutation = function listeningElementsMutation(mutationRecordsList) {
      var $target = $(mutationRecordsList[0].target);

      //trigger the event handler for the element depending on type
      switch (mutationRecordsList[0].type) {

        case "attributes":
          if ($target.attr("data-events") === "scroll" && mutationRecordsList[0].attributeName === "data-events") {
            $target.triggerHandler('scrollme.zf.trigger', [$target, window.pageYOffset]);
          }
          if ($target.attr("data-events") === "resize" && mutationRecordsList[0].attributeName === "data-events") {
            $target.triggerHandler('resizeme.zf.trigger', [$target]);
          }
          if (mutationRecordsList[0].attributeName === "style") {
            $target.closest("[data-mutate]").attr("data-events", "mutate");
            $target.closest("[data-mutate]").triggerHandler('mutateme.zf.trigger', [$target.closest("[data-mutate]")]);
          }
          break;

        case "childList":
          $target.closest("[data-mutate]").attr("data-events", "mutate");
          $target.closest("[data-mutate]").triggerHandler('mutateme.zf.trigger', [$target.closest("[data-mutate]")]);
          break;

        default:
          return false;
        //nothing
      }
    };

    if (nodes.length) {
      //for each element that needs to listen for resizing, scrolling, or mutation add a single observer
      for (var i = 0; i <= nodes.length - 1; i++) {
        var elementObserver = new MutationObserver(listeningElementsMutation);
        elementObserver.observe(nodes[i], { attributes: true, childList: true, characterData: false, subtree: true, attributeFilter: ["data-events", "style"] });
      }
    }
  }

  // ------------------------------------

  // [PH]
  // Foundation.CheckWatchers = checkWatchers;
  Foundation.IHearYou = checkListeners;
  // Foundation.ISeeYou = scrollListener;
  // Foundation.IFeelYou = closemeListener;
}(jQuery);

// function domMutationObserver(debounce) {
//   // !!! This is coming soon and needs more work; not active  !!! //
//   var timer,
//   nodes = document.querySelectorAll('[data-mutate]');
//   //
//   if (nodes.length) {
//     // var MutationObserver = (function () {
//     //   var prefixes = ['WebKit', 'Moz', 'O', 'Ms', ''];
//     //   for (var i=0; i < prefixes.length; i++) {
//     //     if (prefixes[i] + 'MutationObserver' in window) {
//     //       return window[prefixes[i] + 'MutationObserver'];
//     //     }
//     //   }
//     //   return false;
//     // }());
//
//
//     //for the body, we need to listen for all changes effecting the style and class attributes
//     var bodyObserver = new MutationObserver(bodyMutation);
//     bodyObserver.observe(document.body, { attributes: true, childList: true, characterData: false, subtree:true, attributeFilter:["style", "class"]});
//
//
//     //body callback
//     function bodyMutation(mutate) {
//       //trigger all listening elements and signal a mutation event
//       if (timer) { clearTimeout(timer); }
//
//       timer = setTimeout(function() {
//         bodyObserver.disconnect();
//         $('[data-mutate]').attr('data-events',"mutate");
//       }, debounce || 150);
//     }
//   }
// }
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function ($) {

  /**
   * ResponsiveAccordionTabs module.
   * @module foundation.responsiveAccordionTabs
   * @requires foundation.util.keyboard
   * @requires foundation.util.timerAndImageLoader
   * @requires foundation.util.motion
   * @requires foundation.accordion
   * @requires foundation.tabs
   */

  var ResponsiveAccordionTabs = function () {
    /**
     * Creates a new instance of a responsive accordion tabs.
     * @class
     * @fires ResponsiveAccordionTabs#init
     * @param {jQuery} element - jQuery object to make into a dropdown menu.
     * @param {Object} options - Overrides to the default plugin settings.
     */
    function ResponsiveAccordionTabs(element, options) {
      _classCallCheck(this, ResponsiveAccordionTabs);

      this.$element = $(element);
      this.options = $.extend({}, this.$element.data(), options);
      this.rules = this.$element.data('responsive-accordion-tabs');
      this.currentMq = null;
      this.currentPlugin = null;
      if (!this.$element.attr('id')) {
        this.$element.attr('id', Foundation.GetYoDigits(6, 'responsiveaccordiontabs'));
      };

      this._init();
      this._events();

      Foundation.registerPlugin(this, 'ResponsiveAccordionTabs');
    }

    /**
     * Initializes the Menu by parsing the classes from the 'data-responsive-accordion-tabs' attribute on the element.
     * @function
     * @private
     */


    _createClass(ResponsiveAccordionTabs, [{
      key: '_init',
      value: function _init() {
        // The first time an Interchange plugin is initialized, this.rules is converted from a string of "classes" to an object of rules
        if (typeof this.rules === 'string') {
          var rulesTree = {};

          // Parse rules from "classes" pulled from data attribute
          var rules = this.rules.split(' ');

          // Iterate through every rule found
          for (var i = 0; i < rules.length; i++) {
            var rule = rules[i].split('-');
            var ruleSize = rule.length > 1 ? rule[0] : 'small';
            var rulePlugin = rule.length > 1 ? rule[1] : rule[0];

            if (MenuPlugins[rulePlugin] !== null) {
              rulesTree[ruleSize] = MenuPlugins[rulePlugin];
            }
          }

          this.rules = rulesTree;
        }

        this._getAllOptions();

        if (!$.isEmptyObject(this.rules)) {
          this._checkMediaQueries();
        }
      }
    }, {
      key: '_getAllOptions',
      value: function _getAllOptions() {
        //get all defaults and options
        var _this = this;
        _this.allOptions = {};
        for (var key in MenuPlugins) {
          if (MenuPlugins.hasOwnProperty(key)) {
            var obj = MenuPlugins[key];
            try {
              var dummyPlugin = $('<ul></ul>');
              var tmpPlugin = new obj.plugin(dummyPlugin, _this.options);
              for (var keyKey in tmpPlugin.options) {
                if (tmpPlugin.options.hasOwnProperty(keyKey) && keyKey !== 'zfPlugin') {
                  var objObj = tmpPlugin.options[keyKey];
                  _this.allOptions[keyKey] = objObj;
                }
              }
              tmpPlugin.destroy();
            } catch (e) {}
          }
        }
      }

      /**
       * Initializes events for the Menu.
       * @function
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this;

        $(window).on('changed.zf.mediaquery', function () {
          _this._checkMediaQueries();
        });
      }

      /**
       * Checks the current screen width against available media queries. If the media query has changed, and the plugin needed has changed, the plugins will swap out.
       * @function
       * @private
       */

    }, {
      key: '_checkMediaQueries',
      value: function _checkMediaQueries() {
        var matchedMq,
            _this = this;
        // Iterate through each rule and find the last matching rule
        $.each(this.rules, function (key) {
          if (Foundation.MediaQuery.atLeast(key)) {
            matchedMq = key;
          }
        });

        // No match? No dice
        if (!matchedMq) return;

        // Plugin already initialized? We good
        if (this.currentPlugin instanceof this.rules[matchedMq].plugin) return;

        // Remove existing plugin-specific CSS classes
        $.each(MenuPlugins, function (key, value) {
          _this.$element.removeClass(value.cssClass);
        });

        // Add the CSS class for the new plugin
        this.$element.addClass(this.rules[matchedMq].cssClass);

        // Create an instance of the new plugin
        if (this.currentPlugin) {
          //don't know why but on nested elements data zfPlugin get's lost
          if (!this.currentPlugin.$element.data('zfPlugin') && this.storezfData) this.currentPlugin.$element.data('zfPlugin', this.storezfData);
          this.currentPlugin.destroy();
        }
        this._handleMarkup(this.rules[matchedMq].cssClass);
        this.currentPlugin = new this.rules[matchedMq].plugin(this.$element, {});
        this.storezfData = this.currentPlugin.$element.data('zfPlugin');
      }
    }, {
      key: '_handleMarkup',
      value: function _handleMarkup(toSet) {
        var _this = this,
            fromString = 'accordion';
        var $panels = $('[data-tabs-content=' + this.$element.attr('id') + ']');
        if ($panels.length) fromString = 'tabs';
        if (fromString === toSet) {
          return;
        };

        var tabsTitle = _this.allOptions.linkClass ? _this.allOptions.linkClass : 'tabs-title';
        var tabsPanel = _this.allOptions.panelClass ? _this.allOptions.panelClass : 'tabs-panel';

        this.$element.removeAttr('role');
        var $liHeads = this.$element.children('.' + tabsTitle + ',[data-accordion-item]').removeClass(tabsTitle).removeClass('accordion-item').removeAttr('data-accordion-item');
        var $liHeadsA = $liHeads.children('a').removeClass('accordion-title');

        if (fromString === 'tabs') {
          $panels = $panels.children('.' + tabsPanel).removeClass(tabsPanel).removeAttr('role').removeAttr('aria-hidden').removeAttr('aria-labelledby');
          $panels.children('a').removeAttr('role').removeAttr('aria-controls').removeAttr('aria-selected');
        } else {
          $panels = $liHeads.children('[data-tab-content]').removeClass('accordion-content');
        };

        $panels.css({ display: '', visibility: '' });
        $liHeads.css({ display: '', visibility: '' });
        if (toSet === 'accordion') {
          $panels.each(function (key, value) {
            $(value).appendTo($liHeads.get(key)).addClass('accordion-content').attr('data-tab-content', '').removeClass('is-active').css({ height: '' });
            $('[data-tabs-content=' + _this.$element.attr('id') + ']').after('<div id="tabs-placeholder-' + _this.$element.attr('id') + '"></div>').remove();
            $liHeads.addClass('accordion-item').attr('data-accordion-item', '');
            $liHeadsA.addClass('accordion-title');
          });
        } else if (toSet === 'tabs') {
          var $tabsContent = $('[data-tabs-content=' + _this.$element.attr('id') + ']');
          var $placeholder = $('#tabs-placeholder-' + _this.$element.attr('id'));
          if ($placeholder.length) {
            $tabsContent = $('<div class="tabs-content"></div>').insertAfter($placeholder).attr('data-tabs-content', _this.$element.attr('id'));
            $placeholder.remove();
          } else {
            $tabsContent = $('<div class="tabs-content"></div>').insertAfter(_this.$element).attr('data-tabs-content', _this.$element.attr('id'));
          };
          $panels.each(function (key, value) {
            var tempValue = $(value).appendTo($tabsContent).addClass(tabsPanel);
            var hash = $liHeadsA.get(key).hash.slice(1);
            var id = $(value).attr('id') || Foundation.GetYoDigits(6, 'accordion');
            if (hash !== id) {
              if (hash !== '') {
                $(value).attr('id', hash);
              } else {
                hash = id;
                $(value).attr('id', hash);
                $($liHeadsA.get(key)).attr('href', $($liHeadsA.get(key)).attr('href').replace('#', '') + '#' + hash);
              };
            };
            var isActive = $($liHeads.get(key)).hasClass('is-active');
            if (isActive) {
              tempValue.addClass('is-active');
            };
          });
          $liHeads.addClass(tabsTitle);
        };
      }

      /**
       * Destroys the instance of the current plugin on this element, as well as the window resize handler that switches the plugins out.
       * @function
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        if (this.currentPlugin) this.currentPlugin.destroy();
        $(window).off('.zf.ResponsiveAccordionTabs');
        Foundation.unregisterPlugin(this);
      }
    }]);

    return ResponsiveAccordionTabs;
  }();

  ResponsiveAccordionTabs.defaults = {};

  // The plugin matches the plugin classes with these plugin instances.
  var MenuPlugins = {
    tabs: {
      cssClass: 'tabs',
      plugin: Foundation._plugins.tabs || null
    },
    accordion: {
      cssClass: 'accordion',
      plugin: Foundation._plugins.accordion || null
    }
  };

  // Window exports
  Foundation.plugin(ResponsiveAccordionTabs, 'ResponsiveAccordionTabs');
}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvdW5kYXRpb24uY29yZS5qcyIsImZvdW5kYXRpb24udXRpbC5tZWRpYVF1ZXJ5LmpzIiwiZm91bmRhdGlvbi5hYmlkZS5qcyIsImZvdW5kYXRpb24uYWNjb3JkaW9uLmpzIiwiZm91bmRhdGlvbi5hY2NvcmRpb25NZW51LmpzIiwiZm91bmRhdGlvbi5kcmlsbGRvd24uanMiLCJmb3VuZGF0aW9uLmRyb3Bkb3duLmpzIiwiZm91bmRhdGlvbi5kcm9wZG93bk1lbnUuanMiLCJmb3VuZGF0aW9uLmVxdWFsaXplci5qcyIsImZvdW5kYXRpb24uaW50ZXJjaGFuZ2UuanMiLCJmb3VuZGF0aW9uLm1hZ2VsbGFuLmpzIiwiZm91bmRhdGlvbi5vZmZjYW52YXMuanMiLCJmb3VuZGF0aW9uLm9yYml0LmpzIiwiZm91bmRhdGlvbi5yZXNwb25zaXZlTWVudS5qcyIsImZvdW5kYXRpb24ucmVzcG9uc2l2ZVRvZ2dsZS5qcyIsImZvdW5kYXRpb24ucmV2ZWFsLmpzIiwiZm91bmRhdGlvbi5zbGlkZXIuanMiLCJmb3VuZGF0aW9uLnN0aWNreS5qcyIsImZvdW5kYXRpb24udGFicy5qcyIsImZvdW5kYXRpb24udG9nZ2xlci5qcyIsImZvdW5kYXRpb24udG9vbHRpcC5qcyIsImZvdW5kYXRpb24udXRpbC5ib3guanMiLCJmb3VuZGF0aW9uLnV0aWwua2V5Ym9hcmQuanMiLCJmb3VuZGF0aW9uLnV0aWwubW90aW9uLmpzIiwiZm91bmRhdGlvbi51dGlsLm5lc3QuanMiLCJmb3VuZGF0aW9uLnV0aWwudGltZXJBbmRJbWFnZUxvYWRlci5qcyIsImZvdW5kYXRpb24udXRpbC50b3VjaC5qcyIsImZvdW5kYXRpb24udXRpbC50cmlnZ2Vycy5qcyIsImZvdW5kYXRpb24uemYucmVzcG9uc2l2ZUFjY29yZGlvblRhYnMuanMiXSwibmFtZXMiOlsiJCIsIkZPVU5EQVRJT05fVkVSU0lPTiIsIkZvdW5kYXRpb24iLCJ2ZXJzaW9uIiwiX3BsdWdpbnMiLCJfdXVpZHMiLCJydGwiLCJhdHRyIiwicGx1Z2luIiwibmFtZSIsImNsYXNzTmFtZSIsImZ1bmN0aW9uTmFtZSIsImF0dHJOYW1lIiwiaHlwaGVuYXRlIiwicmVnaXN0ZXJQbHVnaW4iLCJwbHVnaW5OYW1lIiwiY29uc3RydWN0b3IiLCJ0b0xvd2VyQ2FzZSIsInV1aWQiLCJHZXRZb0RpZ2l0cyIsIiRlbGVtZW50IiwiZGF0YSIsInRyaWdnZXIiLCJwdXNoIiwidW5yZWdpc3RlclBsdWdpbiIsInNwbGljZSIsImluZGV4T2YiLCJyZW1vdmVBdHRyIiwicmVtb3ZlRGF0YSIsInByb3AiLCJyZUluaXQiLCJwbHVnaW5zIiwiaXNKUSIsImVhY2giLCJfaW5pdCIsInR5cGUiLCJfdGhpcyIsImZucyIsInBsZ3MiLCJmb3JFYWNoIiwicCIsImZvdW5kYXRpb24iLCJPYmplY3QiLCJrZXlzIiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwibGVuZ3RoIiwibmFtZXNwYWNlIiwiTWF0aCIsInJvdW5kIiwicG93IiwicmFuZG9tIiwidG9TdHJpbmciLCJzbGljZSIsInJlZmxvdyIsImVsZW0iLCJpIiwiJGVsZW0iLCJmaW5kIiwiYWRkQmFjayIsIiRlbCIsIm9wdHMiLCJ3YXJuIiwidGhpbmciLCJzcGxpdCIsImUiLCJvcHQiLCJtYXAiLCJlbCIsInRyaW0iLCJwYXJzZVZhbHVlIiwiZXIiLCJnZXRGbk5hbWUiLCJ0cmFuc2l0aW9uZW5kIiwidHJhbnNpdGlvbnMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbmQiLCJ0Iiwic3R5bGUiLCJzZXRUaW1lb3V0IiwidHJpZ2dlckhhbmRsZXIiLCJ1dGlsIiwidGhyb3R0bGUiLCJmdW5jIiwiZGVsYXkiLCJ0aW1lciIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJtZXRob2QiLCIkbWV0YSIsIiRub0pTIiwiYXBwZW5kVG8iLCJoZWFkIiwicmVtb3ZlQ2xhc3MiLCJNZWRpYVF1ZXJ5IiwiQXJyYXkiLCJwcm90b3R5cGUiLCJjYWxsIiwicGx1Z0NsYXNzIiwidW5kZWZpbmVkIiwiUmVmZXJlbmNlRXJyb3IiLCJUeXBlRXJyb3IiLCJ3aW5kb3ciLCJmbiIsIkRhdGUiLCJub3ciLCJnZXRUaW1lIiwidmVuZG9ycyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInZwIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwibGFzdFRpbWUiLCJjYWxsYmFjayIsIm5leHRUaW1lIiwibWF4IiwiY2xlYXJUaW1lb3V0IiwicGVyZm9ybWFuY2UiLCJzdGFydCIsIkZ1bmN0aW9uIiwiYmluZCIsIm9UaGlzIiwiYUFyZ3MiLCJmVG9CaW5kIiwiZk5PUCIsImZCb3VuZCIsImNvbmNhdCIsImZ1bmNOYW1lUmVnZXgiLCJyZXN1bHRzIiwiZXhlYyIsInN0ciIsImlzTmFOIiwicGFyc2VGbG9hdCIsInJlcGxhY2UiLCJqUXVlcnkiLCJkZWZhdWx0UXVlcmllcyIsImxhbmRzY2FwZSIsInBvcnRyYWl0IiwicmV0aW5hIiwicXVlcmllcyIsImN1cnJlbnQiLCJzZWxmIiwiZXh0cmFjdGVkU3R5bGVzIiwiY3NzIiwibmFtZWRRdWVyaWVzIiwicGFyc2VTdHlsZVRvT2JqZWN0Iiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJ2YWx1ZSIsIl9nZXRDdXJyZW50U2l6ZSIsIl93YXRjaGVyIiwiYXRMZWFzdCIsInNpemUiLCJxdWVyeSIsImdldCIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwiaXMiLCJtYXRjaGVkIiwib24iLCJuZXdTaXplIiwiY3VycmVudFNpemUiLCJzdHlsZU1lZGlhIiwibWVkaWEiLCJzY3JpcHQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImluZm8iLCJpZCIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFN0eWxlIiwibWF0Y2hNZWRpdW0iLCJ0ZXh0Iiwic3R5bGVTaGVldCIsImNzc1RleHQiLCJ0ZXh0Q29udGVudCIsIndpZHRoIiwic3R5bGVPYmplY3QiLCJyZWR1Y2UiLCJyZXQiLCJwYXJhbSIsInBhcnRzIiwidmFsIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiaXNBcnJheSIsIkFiaWRlIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJleHRlbmQiLCJkZWZhdWx0cyIsIiRpbnB1dHMiLCJfZXZlbnRzIiwib2ZmIiwicmVzZXRGb3JtIiwidmFsaWRhdGVGb3JtIiwidmFsaWRhdGVPbiIsInZhbGlkYXRlSW5wdXQiLCJ0YXJnZXQiLCJsaXZlVmFsaWRhdGUiLCJ2YWxpZGF0ZU9uQmx1ciIsImlzR29vZCIsImNoZWNrZWQiLCIkZXJyb3IiLCJzaWJsaW5ncyIsImZvcm1FcnJvclNlbGVjdG9yIiwicGFyZW50IiwiJGxhYmVsIiwiY2xvc2VzdCIsIiRlbHMiLCJsYWJlbHMiLCJmaW5kTGFiZWwiLCIkZm9ybUVycm9yIiwiZmluZEZvcm1FcnJvciIsImFkZENsYXNzIiwibGFiZWxFcnJvckNsYXNzIiwiZm9ybUVycm9yQ2xhc3MiLCJpbnB1dEVycm9yQ2xhc3MiLCJncm91cE5hbWUiLCIkbGFiZWxzIiwiZmluZFJhZGlvTGFiZWxzIiwiJGZvcm1FcnJvcnMiLCJyZW1vdmVSYWRpb0Vycm9yQ2xhc3NlcyIsImNsZWFyUmVxdWlyZSIsInJlcXVpcmVkQ2hlY2siLCJ2YWxpZGF0ZWQiLCJjdXN0b21WYWxpZGF0b3IiLCJ2YWxpZGF0b3IiLCJlcXVhbFRvIiwidmFsaWRhdGVSYWRpbyIsInZhbGlkYXRlVGV4dCIsIm1hdGNoVmFsaWRhdGlvbiIsInZhbGlkYXRvcnMiLCJnb29kVG9HbyIsIm1lc3NhZ2UiLCJkZXBlbmRlbnRFbGVtZW50cyIsImFjYyIsIm5vRXJyb3IiLCJwYXR0ZXJuIiwiaW5wdXRUZXh0IiwidmFsaWQiLCJwYXR0ZXJucyIsIlJlZ0V4cCIsIiRncm91cCIsInJlcXVpcmVkIiwiY2xlYXIiLCJ2IiwiJGZvcm0iLCJub3QiLCJyZW1vdmVFcnJvckNsYXNzZXMiLCJhbHBoYSIsImFscGhhX251bWVyaWMiLCJpbnRlZ2VyIiwibnVtYmVyIiwiY2FyZCIsImN2diIsImVtYWlsIiwidXJsIiwiZG9tYWluIiwiZGF0ZXRpbWUiLCJkYXRlIiwidGltZSIsImRhdGVJU08iLCJtb250aF9kYXlfeWVhciIsImRheV9tb250aF95ZWFyIiwiY29sb3IiLCJBY2NvcmRpb24iLCJLZXlib2FyZCIsInJlZ2lzdGVyIiwiJHRhYnMiLCJjaGlsZHJlbiIsImlkeCIsIiRjb250ZW50IiwibGlua0lkIiwiJGluaXRBY3RpdmUiLCJkb3duIiwiJHRhYkNvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInRvZ2dsZSIsImhhbmRsZUtleSIsIm5leHQiLCIkYSIsImZvY3VzIiwibXVsdGlFeHBhbmQiLCJwcmV2aW91cyIsInByZXYiLCJoYW5kbGVkIiwic3RvcFByb3BhZ2F0aW9uIiwiJHRhcmdldCIsImhhc0NsYXNzIiwidXAiLCJmaXJzdFRpbWUiLCIkY3VycmVudEFjdGl2ZSIsInNsaWRlRG93biIsInNsaWRlU3BlZWQiLCIkYXVudHMiLCJhbGxvd0FsbENsb3NlZCIsInNsaWRlVXAiLCJzdG9wIiwiQWNjb3JkaW9uTWVudSIsIk5lc3QiLCJGZWF0aGVyIiwibXVsdGlPcGVuIiwiJG1lbnVMaW5rcyIsIiRzdWIiLCJzdWJJZCIsImlzQWN0aXZlIiwiaW5pdFBhbmVzIiwiJHN1Ym1lbnUiLCIkZWxlbWVudHMiLCIkcHJldkVsZW1lbnQiLCIkbmV4dEVsZW1lbnQiLCJlcSIsImZpcnN0IiwibWluIiwicGFyZW50cyIsIm9wZW4iLCJjbG9zZSIsImNsb3NlQWxsIiwiaGlkZUFsbCIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInBhcmVudHNVbnRpbCIsImFkZCIsIiRtZW51cyIsIkJ1cm4iLCJEcmlsbGRvd24iLCIkc3VibWVudUFuY2hvcnMiLCIkc3VibWVudXMiLCIkbWVudUl0ZW1zIiwiX3ByZXBhcmVNZW51IiwiX3JlZ2lzdGVyRXZlbnRzIiwiX2tleWJvYXJkRXZlbnRzIiwiJGxpbmsiLCJwYXJlbnRMaW5rIiwiY2xvbmUiLCJwcmVwZW5kVG8iLCJ3cmFwIiwiJG1lbnUiLCIkYmFjayIsImJhY2tCdXR0b25Qb3NpdGlvbiIsImFwcGVuZCIsImJhY2tCdXR0b24iLCJwcmVwZW5kIiwiX2JhY2siLCJhdXRvSGVpZ2h0IiwiJHdyYXBwZXIiLCJ3cmFwcGVyIiwiYW5pbWF0ZUhlaWdodCIsIl9nZXRNYXhEaW1zIiwiX3Nob3ciLCJjbG9zZU9uQ2xpY2siLCIkYm9keSIsImNvbnRhaW5zIiwiX2hpZGVBbGwiLCJfcmVzaXplIiwic2Nyb2xsVG9wIiwiX2JpbmRIYW5kbGVyIiwiX3Njcm9sbFRvcCIsIiRzY3JvbGxUb3BFbGVtZW50Iiwic2Nyb2xsVG9wRWxlbWVudCIsInNjcm9sbFBvcyIsInBhcnNlSW50Iiwib2Zmc2V0IiwidG9wIiwic2Nyb2xsVG9wT2Zmc2V0IiwiYW5pbWF0ZSIsImFuaW1hdGlvbkR1cmF0aW9uIiwiYW5pbWF0aW9uRWFzaW5nIiwib25lIiwiZmlsdGVyIiwiX2hpZGUiLCJoZWlnaHQiLCJwYXJlbnRTdWJNZW51IiwiYmx1ciIsIm1heEhlaWdodCIsInJlc3VsdCIsIm51bU9mRWxlbXMiLCJCb3giLCJHZXREaW1lbnNpb25zIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidW53cmFwIiwicmVtb3ZlIiwiRHJvcGRvd24iLCIkaWQiLCIkYW5jaG9yIiwicGFyZW50Q2xhc3MiLCIkcGFyZW50IiwicG9zaXRpb25DbGFzcyIsImdldFBvc2l0aW9uQ2xhc3MiLCJjb3VudGVyIiwidXNlZFBvc2l0aW9ucyIsInZlcnRpY2FsUG9zaXRpb24iLCJtYXRjaCIsImhvcml6b250YWxQb3NpdGlvbiIsInBvc2l0aW9uIiwiY2xhc3NDaGFuZ2VkIiwiJGVsZURpbXMiLCIkYW5jaG9yRGltcyIsImRpcmVjdGlvbiIsInZPZmZzZXQiLCJoT2Zmc2V0Iiwid2luZG93RGltcyIsIkltTm90VG91Y2hpbmdZb3UiLCJuZXdXaWR0aCIsInBhcmVudEhPZmZzZXQiLCIkcGFyZW50RGltcyIsImxlZnQiLCJHZXRPZmZzZXRzIiwiX3JlcG9zaXRpb24iLCJfc2V0UG9zaXRpb24iLCJob3ZlciIsImJvZHlEYXRhIiwid2hhdGlucHV0IiwidGltZW91dCIsImhvdmVyRGVsYXkiLCJob3ZlclBhbmUiLCJ2aXNpYmxlRm9jdXNhYmxlRWxlbWVudHMiLCJmaW5kRm9jdXNhYmxlIiwiYm9keSIsImF1dG9Gb2N1cyIsIiRmb2N1c2FibGUiLCJfYWRkQm9keUhhbmRsZXIiLCJ0cmFwRm9jdXMiLCJjdXJQb3NpdGlvbkNsYXNzIiwicmVsZWFzZUZvY3VzIiwiaGlkZSIsIkRyb3Bkb3duTWVudSIsInN1YnMiLCJ2ZXJ0aWNhbENsYXNzIiwicmlnaHRDbGFzcyIsImFsaWdubWVudCIsImNoYW5nZWQiLCJoYXNUb3VjaCIsIm9udG91Y2hzdGFydCIsInBhckNsYXNzIiwiaGFuZGxlQ2xpY2tGbiIsImhhc1N1YiIsImhhc0NsaWNrZWQiLCJjbGlja09wZW4iLCJmb3JjZUZvbGxvdyIsImNsb3NlT25DbGlja0luc2lkZSIsImRpc2FibGVIb3ZlciIsImF1dG9jbG9zZSIsImNsb3NpbmdUaW1lIiwiaXNUYWIiLCJpbmRleCIsIm5leHRTaWJsaW5nIiwicHJldlNpYmxpbmciLCJvcGVuU3ViIiwiY2xvc2VTdWIiLCJmdW5jdGlvbnMiLCJfaXNWZXJ0aWNhbCIsIiRzaWJzIiwib2xkQ2xhc3MiLCIkcGFyZW50TGkiLCIkdG9DbG9zZSIsInNvbWV0aGluZ1RvQ2xvc2UiLCJFcXVhbGl6ZXIiLCJlcUlkIiwiJHdhdGNoZWQiLCJoYXNOZXN0ZWQiLCJpc05lc3RlZCIsImlzT24iLCJvblJlc2l6ZU1lQm91bmQiLCJfb25SZXNpemVNZSIsIm9uUG9zdEVxdWFsaXplZEJvdW5kIiwiX29uUG9zdEVxdWFsaXplZCIsImltZ3MiLCJ0b29TbWFsbCIsImVxdWFsaXplT24iLCJfY2hlY2tNUSIsIm9uSW1hZ2VzTG9hZGVkIiwiX3JlZmxvdyIsIl9wYXVzZUV2ZW50cyIsImVxdWFsaXplT25TdGFjayIsIl9pc1N0YWNrZWQiLCJlcXVhbGl6ZUJ5Um93IiwiZ2V0SGVpZ2h0c0J5Um93IiwiYXBwbHlIZWlnaHRCeVJvdyIsImdldEhlaWdodHMiLCJhcHBseUhlaWdodCIsImNiIiwiaGVpZ2h0cyIsImxlbiIsIm9mZnNldEhlaWdodCIsImxhc3RFbFRvcE9mZnNldCIsImdyb3VwcyIsImdyb3VwIiwiZWxPZmZzZXRUb3AiLCJqIiwibG4iLCJncm91cHNJTGVuZ3RoIiwibGVuSiIsIkludGVyY2hhbmdlIiwicnVsZXMiLCJjdXJyZW50UGF0aCIsIl9hZGRCcmVha3BvaW50cyIsIl9nZW5lcmF0ZVJ1bGVzIiwicnVsZSIsInBhdGgiLCJTUEVDSUFMX1FVRVJJRVMiLCJydWxlc0xpc3QiLCJqb2luIiwibm9kZU5hbWUiLCJyZXNwb25zZSIsImh0bWwiLCJNYWdlbGxhbiIsImNhbGNQb2ludHMiLCIkdGFyZ2V0cyIsIiRsaW5rcyIsIiRhY3RpdmUiLCJwYWdlWU9mZnNldCIsImRvY3VtZW50RWxlbWVudCIsInBvaW50cyIsIndpbkhlaWdodCIsImlubmVySGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiZG9jSGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiJHRhciIsInB0IiwidGhyZXNob2xkIiwidGFyZ2V0UG9pbnQiLCJkdXJhdGlvbiIsImVhc2luZyIsImRlZXBMaW5raW5nIiwibG9jYXRpb24iLCJoYXNoIiwic2Nyb2xsVG9Mb2MiLCJfdXBkYXRlQWN0aXZlIiwiYXJyaXZhbCIsImdldEF0dHJpYnV0ZSIsImxvYyIsIl9pblRyYW5zaXRpb24iLCJiYXJPZmZzZXQiLCJ3aW5Qb3MiLCJjdXJJZHgiLCJpc0Rvd24iLCJjdXJWaXNpYmxlIiwiYWN0aXZlQ2xhc3MiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiT2ZmQ2FudmFzIiwiJGxhc3RUcmlnZ2VyIiwiJHRyaWdnZXJzIiwidHJhbnNpdGlvbiIsImNvbnRlbnRPdmVybGF5Iiwib3ZlcmxheSIsIm92ZXJsYXlQb3NpdGlvbiIsInNldEF0dHJpYnV0ZSIsIiRvdmVybGF5IiwiaXNSZXZlYWxlZCIsInJldmVhbENsYXNzIiwicmV2ZWFsT24iLCJfc2V0TVFDaGVja2VyIiwidHJhbnNpdGlvblRpbWUiLCJ0cmFuc2l0aW9uRHVyYXRpb24iLCJfaGFuZGxlS2V5Ym9hcmQiLCJyZXZlYWwiLCIkY2xvc2VyIiwic2hvdyIsImV2ZW50IiwiYWxsb3dVcCIsImFsbG93RG93biIsImxhc3RZIiwib3JpZ2luYWxFdmVudCIsInBhZ2VZIiwiZm9yY2VUbyIsInNjcm9sbFRvIiwiY29udGVudFNjcm9sbCIsIl9zdG9wU2Nyb2xsaW5nIiwiX3JlY29yZFNjcm9sbGFibGUiLCJfc3RvcFNjcm9sbFByb3BhZ2F0aW9uIiwiT3JiaXQiLCJfcmVzZXQiLCJjb250YWluZXJDbGFzcyIsIiRzbGlkZXMiLCJzbGlkZUNsYXNzIiwiJGltYWdlcyIsImluaXRBY3RpdmUiLCJ1c2VNVUkiLCJfcHJlcGFyZUZvck9yYml0IiwiYnVsbGV0cyIsIl9sb2FkQnVsbGV0cyIsImF1dG9QbGF5IiwiZ2VvU3luYyIsImFjY2Vzc2libGUiLCIkYnVsbGV0cyIsImJveE9mQnVsbGV0cyIsIlRpbWVyIiwidGltZXJEZWxheSIsImluZmluaXRlIiwiY2hhbmdlU2xpZGUiLCJfc2V0V3JhcHBlckhlaWdodCIsInRlbXAiLCJzd2lwZSIsInBhdXNlT25Ib3ZlciIsInBhdXNlIiwibmF2QnV0dG9ucyIsIiRjb250cm9scyIsIm5leHRDbGFzcyIsInByZXZDbGFzcyIsImx0ciIsIiRzbGlkZSIsInJlc3RhcnQiLCJfdXBkYXRlQnVsbGV0cyIsImlzTFRSIiwiY2hvc2VuU2xpZGUiLCIkY3VyU2xpZGUiLCIkZmlyc3RTbGlkZSIsIiRsYXN0U2xpZGUiLCJsYXN0IiwiZGlySW4iLCJkaXJPdXQiLCIkbmV3U2xpZGUiLCJpbmZpbml0ZVdyYXAiLCJNb3Rpb24iLCJhbmltYXRlSW4iLCJhbmltYXRlT3V0IiwiaXNQYXVzZWQiLCIkb2xkQnVsbGV0Iiwic3BhbiIsImRldGFjaCIsIiRuZXdCdWxsZXQiLCJhbmltSW5Gcm9tUmlnaHQiLCJhbmltT3V0VG9SaWdodCIsImFuaW1JbkZyb21MZWZ0IiwiYW5pbU91dFRvTGVmdCIsIlJlc3BvbnNpdmVNZW51IiwiY3VycmVudE1xIiwiY3VycmVudFBsdWdpbiIsInJ1bGVzVHJlZSIsInJ1bGVTaXplIiwicnVsZVBsdWdpbiIsIk1lbnVQbHVnaW5zIiwiaXNFbXB0eU9iamVjdCIsIl9jaGVja01lZGlhUXVlcmllcyIsIm1hdGNoZWRNcSIsImNzc0NsYXNzIiwiZGVzdHJveSIsImRyb3Bkb3duIiwiZHJpbGxkb3duIiwiYWNjb3JkaW9uIiwiUmVzcG9uc2l2ZVRvZ2dsZSIsInRhcmdldElEIiwiJHRhcmdldE1lbnUiLCIkdG9nZ2xlciIsImlucHV0IiwiYW5pbWF0aW9uSW4iLCJhbmltYXRpb25PdXQiLCJfdXBkYXRlIiwiX3VwZGF0ZU1xSGFuZGxlciIsInRvZ2dsZU1lbnUiLCJoaWRlRm9yIiwiUmV2ZWFsIiwiY2FjaGVkIiwibXEiLCJpc01vYmlsZSIsIm1vYmlsZVNuaWZmIiwiZnVsbFNjcmVlbiIsIl9tYWtlT3ZlcmxheSIsImRlZXBMaW5rIiwib3V0ZXJXaWR0aCIsIm91dGVySGVpZ2h0IiwibWFyZ2luIiwiX3VwZGF0ZVBvc2l0aW9uIiwid2hpY2giLCJfaGFuZGxlU3RhdGUiLCJtdWx0aXBsZU9wZW5lZCIsImFkZFJldmVhbE9wZW5DbGFzc2VzIiwib3JpZ2luYWxTY3JvbGxQb3MiLCJhZnRlckFuaW1hdGlvbiIsImZvY3VzYWJsZUVsZW1lbnRzIiwic2hvd0RlbGF5IiwiX2V4dHJhSGFuZGxlcnMiLCJjbG9zZU9uRXNjIiwiZmluaXNoVXAiLCJoaWRlRGVsYXkiLCJyZXNldE9uQ2xvc2UiLCJyZXBsYWNlU3RhdGUiLCJ0aXRsZSIsImhyZWYiLCJidG1PZmZzZXRQY3QiLCJpUGhvbmVTbmlmZiIsImFuZHJvaWRTbmlmZiIsIlNsaWRlciIsImlucHV0cyIsImhhbmRsZXMiLCIkaGFuZGxlIiwiJGlucHV0IiwiJGZpbGwiLCJ2ZXJ0aWNhbCIsImlzRGJsIiwiZGlzYWJsZWQiLCJkaXNhYmxlZENsYXNzIiwiYmluZGluZyIsIl9zZXRJbml0QXR0ciIsImRvdWJsZVNpZGVkIiwiJGhhbmRsZTIiLCIkaW5wdXQyIiwic2V0SGFuZGxlcyIsIl9zZXRIYW5kbGVQb3MiLCJwY3RPZkJhciIsInBlcmNlbnQiLCJwb3NpdGlvblZhbHVlRnVuY3Rpb24iLCJfbG9nVHJhbnNmb3JtIiwiX3Bvd1RyYW5zZm9ybSIsInRvRml4ZWQiLCJiYXNlTG9nIiwibm9uTGluZWFyQmFzZSIsIiRobmRsIiwibm9JbnZlcnQiLCJoMlZhbCIsInN0ZXAiLCJoMVZhbCIsInZlcnQiLCJoT3JXIiwibE9yVCIsImhhbmRsZURpbSIsImVsZW1EaW0iLCJfcGN0T2ZCYXIiLCJweFRvTW92ZSIsIm1vdmVtZW50IiwiZGVjaW1hbCIsIl9zZXRWYWx1ZXMiLCJpc0xlZnRIbmRsIiwiZGltIiwiaGFuZGxlUGN0IiwiaGFuZGxlUG9zIiwiaW5pdGlhbFN0YXJ0IiwibW92ZVRpbWUiLCJNb3ZlIiwiY2hhbmdlZERlbGF5IiwiaW5pdFZhbCIsImluaXRpYWxFbmQiLCJoYXNWYWwiLCJldmVudE9mZnNldCIsInBhZ2VYIiwiaGFsZk9mSGFuZGxlIiwiYmFyRGltIiwid2luZG93U2Nyb2xsIiwic2Nyb2xsTGVmdCIsImVsZW1PZmZzZXQiLCJjbGllbnRZIiwiZXZlbnRGcm9tQmFyIiwiYmFyWFkiLCJvZmZzZXRQY3QiLCJfdmFsdWUiLCJfYWRqdXN0VmFsdWUiLCJmaXJzdEhuZGxQb3MiLCJhYnNQb3NpdGlvbiIsInNlY25kSG5kbFBvcyIsImRpdiIsInByZXZfdmFsIiwibmV4dF92YWwiLCJfZXZlbnRzRm9ySGFuZGxlIiwiY3VySGFuZGxlIiwiX2hhbmRsZUV2ZW50IiwiY2xpY2tTZWxlY3QiLCJkcmFnZ2FibGUiLCJhZGRUb3VjaCIsImN1cnJlbnRUYXJnZXQiLCJfJGhhbmRsZSIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJkZWNyZWFzZSIsImluY3JlYXNlIiwiZGVjcmVhc2VfZmFzdCIsImluY3JlYXNlX2Zhc3QiLCJpbnZlcnRWZXJ0aWNhbCIsImZyYWMiLCJudW0iLCJkaXIiLCJjbGlja1BvcyIsImFicyIsImJhc2UiLCJsb2ciLCJTdGlja3kiLCJ3YXNXcmFwcGVkIiwiJGNvbnRhaW5lciIsImNvbnRhaW5lciIsIndyYXBJbm5lciIsInN0aWNreUNsYXNzIiwic2Nyb2xsQ291bnQiLCJjaGVja0V2ZXJ5IiwiaXNTdHVjayIsImNvbnRhaW5lckhlaWdodCIsImVsZW1IZWlnaHQiLCJhbmNob3IiLCJfcGFyc2VQb2ludHMiLCJfc2V0U2l6ZXMiLCJzY3JvbGwiLCJfY2FsYyIsIl9yZW1vdmVTdGlja3kiLCJ0b3BQb2ludCIsInJldmVyc2UiLCJ0b3BBbmNob3IiLCJidG0iLCJidG1BbmNob3IiLCJwdHMiLCJicmVha3MiLCJwbGFjZSIsInNjcm9sbExpc3RlbmVyIiwiY2FuU3RpY2siLCJfcGF1c2VMaXN0ZW5lcnMiLCJjaGVja1NpemVzIiwiYm90dG9tUG9pbnQiLCJfc2V0U3RpY2t5Iiwic3RpY2tUbyIsIm1yZ24iLCJub3RTdHVja1RvIiwiaXNUb3AiLCJzdGlja1RvVG9wIiwiYW5jaG9yUHQiLCJhbmNob3JIZWlnaHQiLCJ0b3BPckJvdHRvbSIsInN0aWNreU9uIiwibmV3RWxlbVdpZHRoIiwiY29tcCIsInBkbmdsIiwicGRuZ3IiLCJuZXdDb250YWluZXJIZWlnaHQiLCJfc2V0QnJlYWtQb2ludHMiLCJtVG9wIiwiZW1DYWxjIiwibWFyZ2luVG9wIiwibUJ0bSIsIm1hcmdpbkJvdHRvbSIsImJvdHRvbSIsImVtIiwiZm9udFNpemUiLCJUYWJzIiwiJHRhYlRpdGxlcyIsImxpbmtDbGFzcyIsImxpbmtBY3RpdmVDbGFzcyIsImxvYWQiLCJkZWVwTGlua1NtdWRnZURlbGF5IiwibWF0Y2hIZWlnaHQiLCJfc2V0SGVpZ2h0IiwiX2NoZWNrRGVlcExpbmsiLCJzZWxlY3RUYWIiLCJkZWVwTGlua1NtdWRnZSIsIl9hZGRLZXlIYW5kbGVyIiwiX2FkZENsaWNrSGFuZGxlciIsIl9zZXRIZWlnaHRNcUhhbmRsZXIiLCJfaGFuZGxlVGFiQ2hhbmdlIiwid3JhcE9uS2V5cyIsImhpc3RvcnlIYW5kbGVkIiwiYWN0aXZlQ29sbGFwc2UiLCJfY29sbGFwc2VUYWIiLCIkb2xkVGFiIiwiJHRhYkxpbmsiLCIkdGFyZ2V0Q29udGVudCIsIl9vcGVuVGFiIiwidXBkYXRlSGlzdG9yeSIsInBhbmVsQWN0aXZlQ2xhc3MiLCIkdGFyZ2V0X2FuY2hvciIsImlkU3RyIiwicGFuZWxDbGFzcyIsInBhbmVsIiwiVG9nZ2xlciIsInRvZ2dsZUNsYXNzIiwiX3VwZGF0ZUFSSUEiLCJUb29sdGlwIiwiaXNDbGljayIsImVsZW1JZCIsIl9nZXRQb3NpdGlvbkNsYXNzIiwidGlwVGV4dCIsInRlbXBsYXRlIiwiX2J1aWxkVGVtcGxhdGUiLCJhbGxvd0h0bWwiLCJ0cmlnZ2VyQ2xhc3MiLCJ0ZW1wbGF0ZUNsYXNzZXMiLCJ0b29sdGlwQ2xhc3MiLCIkdGVtcGxhdGUiLCIkdGlwRGltcyIsInNob3dPbiIsImZhZGVJbiIsImZhZGVJbkR1cmF0aW9uIiwiZmFkZU91dCIsImZhZGVPdXREdXJhdGlvbiIsImlzRm9jdXMiLCJkaXNhYmxlRm9yVG91Y2giLCJ0b3VjaENsb3NlVGV4dCIsImxyT25seSIsInRiT25seSIsImVsZURpbXMiLCJyaWdodCIsInBhckRpbXMiLCJhbGxEaXJzIiwiRXJyb3IiLCJyZWN0IiwicGFyUmVjdCIsIndpblJlY3QiLCJ3aW5ZIiwid2luWCIsInBhZ2VYT2Zmc2V0IiwicGFyZW50RGltcyIsImlzT3ZlcmZsb3ciLCJrZXlDb2RlcyIsImNvbW1hbmRzIiwiZ2V0S2V5Q29kZXMiLCJwYXJzZUtleSIsImtleUNvZGUiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJ0b1VwcGVyQ2FzZSIsInNoaWZ0S2V5IiwiY3RybEtleSIsImFsdEtleSIsImNvbXBvbmVudCIsImNvbW1hbmRMaXN0IiwiY21kcyIsImNvbW1hbmQiLCJyZXR1cm5WYWx1ZSIsInVuaGFuZGxlZCIsImNvbXBvbmVudE5hbWUiLCIkZmlyc3RGb2N1c2FibGUiLCIkbGFzdEZvY3VzYWJsZSIsImtjcyIsImsiLCJrYyIsImluaXRDbGFzc2VzIiwiYWN0aXZlQ2xhc3NlcyIsImFuaW1hdGlvbiIsImFuaW0iLCJwcm9nIiwibW92ZSIsInRzIiwiaXNJbiIsImluaXRDbGFzcyIsInJlc2V0Iiwib2Zmc2V0V2lkdGgiLCJmaW5pc2giLCJtZW51IiwiaXRlbXMiLCJzdWJNZW51Q2xhc3MiLCJzdWJJdGVtQ2xhc3MiLCJoYXNTdWJDbGFzcyIsIiRpdGVtIiwibmFtZVNwYWNlIiwicmVtYWluIiwiaW1hZ2VzIiwidW5sb2FkZWQiLCJjb21wbGV0ZSIsInJlYWR5U3RhdGUiLCJzaW5nbGVJbWFnZUxvYWRlZCIsInNyYyIsInNwb3RTd2lwZSIsImVuYWJsZWQiLCJtb3ZlVGhyZXNob2xkIiwidGltZVRocmVzaG9sZCIsInN0YXJ0UG9zWCIsInN0YXJ0UG9zWSIsInN0YXJ0VGltZSIsImVsYXBzZWRUaW1lIiwiaXNNb3ZpbmciLCJvblRvdWNoRW5kIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uVG91Y2hNb3ZlIiwieCIsInRvdWNoZXMiLCJ5IiwiZHgiLCJkeSIsIm9uVG91Y2hTdGFydCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpbml0IiwidGVhcmRvd24iLCJzcGVjaWFsIiwic2V0dXAiLCJub29wIiwiaGFuZGxlVG91Y2giLCJjaGFuZ2VkVG91Y2hlcyIsImV2ZW50VHlwZXMiLCJ0b3VjaHN0YXJ0IiwidG91Y2htb3ZlIiwidG91Y2hlbmQiLCJzaW11bGF0ZWRFdmVudCIsIk1vdXNlRXZlbnQiLCJzY3JlZW5YIiwic2NyZWVuWSIsImNsaWVudFgiLCJjcmVhdGVFdmVudCIsImluaXRNb3VzZUV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJwcmVmaXhlcyIsInRyaWdnZXJzIiwiY2hlY2tMaXN0ZW5lcnMiLCJldmVudHNMaXN0ZW5lciIsInJlc2l6ZUxpc3RlbmVyIiwibXV0YXRlTGlzdGVuZXIiLCJjbG9zZW1lTGlzdGVuZXIiLCJ5ZXRpQm94ZXMiLCJwbHVnTmFtZXMiLCJsaXN0ZW5lcnMiLCJwbHVnaW5JZCIsImRlYm91bmNlIiwiJG5vZGVzIiwibm9kZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwibGlzdGVuaW5nRWxlbWVudHNNdXRhdGlvbiIsIm11dGF0aW9uUmVjb3Jkc0xpc3QiLCJhdHRyaWJ1dGVOYW1lIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsImF0dHJpYnV0ZXMiLCJjaGlsZExpc3QiLCJjaGFyYWN0ZXJEYXRhIiwic3VidHJlZSIsImF0dHJpYnV0ZUZpbHRlciIsIklIZWFyWW91IiwiUmVzcG9uc2l2ZUFjY29yZGlvblRhYnMiLCJfZ2V0QWxsT3B0aW9ucyIsImFsbE9wdGlvbnMiLCJvYmoiLCJkdW1teVBsdWdpbiIsInRtcFBsdWdpbiIsImtleUtleSIsIm9iak9iaiIsInN0b3JlemZEYXRhIiwiX2hhbmRsZU1hcmt1cCIsInRvU2V0IiwiZnJvbVN0cmluZyIsIiRwYW5lbHMiLCJ0YWJzVGl0bGUiLCJ0YWJzUGFuZWwiLCIkbGlIZWFkcyIsIiRsaUhlYWRzQSIsImRpc3BsYXkiLCJ2aXNpYmlsaXR5IiwiYWZ0ZXIiLCIkdGFic0NvbnRlbnQiLCIkcGxhY2Vob2xkZXIiLCJpbnNlcnRBZnRlciIsInRlbXBWYWx1ZSIsInRhYnMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxDQUFDLFVBQVNBLENBQVQsRUFBWTs7QUFFYjs7QUFFQSxNQUFJQyxxQkFBcUIsT0FBekI7O0FBRUE7QUFDQTtBQUNBLE1BQUlDLGFBQWE7QUFDZkMsYUFBU0Ysa0JBRE07O0FBR2Y7OztBQUdBRyxjQUFVLEVBTks7O0FBUWY7OztBQUdBQyxZQUFRLEVBWE87O0FBYWY7OztBQUdBQyxTQUFLLGVBQVU7QUFDYixhQUFPTixFQUFFLE1BQUYsRUFBVU8sSUFBVixDQUFlLEtBQWYsTUFBMEIsS0FBakM7QUFDRCxLQWxCYztBQW1CZjs7OztBQUlBQyxZQUFRLGdCQUFTQSxPQUFULEVBQWlCQyxJQUFqQixFQUF1QjtBQUM3QjtBQUNBO0FBQ0EsVUFBSUMsWUFBYUQsUUFBUUUsYUFBYUgsT0FBYixDQUF6QjtBQUNBO0FBQ0E7QUFDQSxVQUFJSSxXQUFZQyxVQUFVSCxTQUFWLENBQWhCOztBQUVBO0FBQ0EsV0FBS04s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QUk3TixXQUFXeFQsRUFBRTBnQyxTQUFTMTJCLEdBQVQsQ0FBYVIsR0FBYixDQUFGLEVBQXFCK0ksUUFBckIsQ0FBOEIsV0FBOUIsQ0FBZjtBQUNBLGdCQUFJaUIsUUFBSixFQUFjO0FBQ1owdEIsd0JBQVV0ekIsUUFBVixDQUFtQixXQUFuQjtBQUNEO0FBQ0YsV0FqQkQ7QUFrQkE4eUIsbUJBQVM5eUIsUUFBVCxDQUFrQjR5QixTQUFsQjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7O0FBak5XO0FBQUE7QUFBQSxnQ0FxTkQ7QUFDUixZQUFJLEtBQUs1WSxhQUFULEVBQXdCLEtBQUtBLGFBQUwsQ0FBbUJTLE9BQW5CO0FBQ3hCcm9CLFVBQUUwRyxNQUFGLEVBQVU2RixHQUFWLENBQWMsNkJBQWQ7QUFDQXJNLG1CQUFXc0IsZ0JBQVgsQ0FBNEIsSUFBNUI7QUFDRDtBQXpOVTs7QUFBQTtBQUFBOztBQTROYm0rQiwwQkFBd0J2ekIsUUFBeEIsR0FBbUMsRUFBbkM7O0FBRUE7QUFDQSxNQUFJNGIsY0FBYztBQUNoQm1aLFVBQU07QUFDSi9ZLGdCQUFVLE1BRE47QUFFSjVuQixjQUFRTixXQUFXRSxRQUFYLENBQW9CK2dDLElBQXBCLElBQTRCO0FBRmhDLEtBRFU7QUFLaEIzWSxlQUFXO0FBQ1RKLGdCQUFVLFdBREQ7QUFFVDVuQixjQUFRTixXQUFXRSxRQUFYLENBQW9Cb29CLFNBQXBCLElBQWlDO0FBRmhDO0FBTEssR0FBbEI7O0FBV0E7QUFDQXRvQixhQUFXTSxNQUFYLENBQWtCbS9CLHVCQUFsQixFQUEyQyx5QkFBM0M7QUFFQyxDQTdPQSxDQTZPQy8yQixNQTdPRCxDQUFEIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIhZnVuY3Rpb24oJCkge1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIEZPVU5EQVRJT05fVkVSU0lPTiA9ICc2LjMuMSc7XG5cbi8vIEdsb2JhbCBGb3VuZGF0aW9uIG9iamVjdFxuLy8gVGhpcyBpcyBhdHRhY2hlZCB0byB0aGUgd2luZG93LCBvciB1c2VkIGFzIGEgbW9kdWxlIGZvciBBTUQvQnJvd3NlcmlmeVxudmFyIEZvdW5kYXRpb24gPSB7XG4gIHZlcnNpb246IEZPVU5EQVRJT05fVkVSU0lPTixcblxuICAvKipcbiAgICogU3RvcmVzIGluaXRpYWxpemVkIHBsdWdpbnMuXG4gICAqL1xuICBfcGx1Z2luczoge30sXG5cbiAgLyoqXG4gICAqIFN0b3JlcyBnZW5lcmF0ZWQgdW5pcXVlIGlkcyBmb3IgcGx1Z2luIGluc3RhbmNlc1xuICAgKi9cbiAgX3V1aWRzOiBbXSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIGJvb2xlYW4gZm9yIFJUTCBzdXBwb3J0XG4gICAqL1xuICBydGw6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCc7XG4gIH0sXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgRm91bmRhdGlvbiBwbHVnaW4sIGFkZGluZyBpdCB0byB0aGUgYEZvdW5kYXRpb25gIG5hbWVzcGFjZSBhbmQgdGhlIGxpc3Qgb2YgcGx1Z2lucyB0byBpbml0aWFsaXplIHdoZW4gcmVmbG93aW5nLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcGx1Z2luIC0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBwbHVnaW4uXG4gICAqL1xuICBwbHVnaW46IGZ1bmN0aW9uKHBsdWdpbiwgbmFtZSkge1xuICAgIC8vIE9iamVjdCBrZXkgdG8gdXNlIHdoZW4gYWRkaW5nIHRvIGdsb2JhbCBGb3VuZGF0aW9uIG9iamVjdFxuICAgIC8vIEV4YW1wbGVzOiBGb3VuZGF0aW9uLlJldmVhbCwgRm91bmRhdGlvbi5PZmZDYW52YXNcbiAgICB2YXIgY2xhc3NOYW1lID0gKG5hbWUgfHwgZnVuY3Rpb25OYW1lKHBsdWdpbikpO1xuICAgIC8vIE9iamVjdCBrZXkgdG8gdXNlIHdoZW4gc3RvcmluZyB0aGUgcGx1Z2luLCBhbHNvIHVzZWQgdG8gY3JlYXRlIHRoZSBpZGVudGlmeWluZyBkYXRhIGF0dHJpYnV0ZSBmb3IgdGhlIHBsdWdpblxuICAgIC8vIEV4YW1wbGVzOiBkYXRhLXJldmVhbCwgZGF0YS1vZmYtY2FudmFzXG4gICAgdmFyIGF0dHJOYW1lICA9IGh5cGhlbmF0ZShjbGFzc05hbWUpO1xuXG4gICAgLy8gQWRkIHRvIHRoZSBGb3VuZGF0aW9uIG9iamVjdCBhbmQgdGhlIHBsdWdpbnMgbGlzdCAoZm9yIHJlZmxvd2luZylcbiAgICB0aGlzLl9wbHVnaW5zW2F0dHJOYW1lXSA9IHRoaXNbY2xhc3NOYW1lXSA9IHBsdWdpbjtcbiAgfSxcbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKiBQb3B1bGF0ZXMgdGhlIF91dWlkcyBhcnJheSB3aXRoIHBvaW50ZXJzIHRvIGVhY2ggaW5kaXZpZHVhbCBwbHVnaW4gaW5zdGFuY2UuXG4gICAqIEFkZHMgdGhlIGB6ZlBsdWdpbmAgZGF0YS1hdHRyaWJ1dGUgdG8gcHJvZ3JhbW1hdGljYWxseSBjcmVhdGVkIHBsdWdpbnMgdG8gYWxsb3cgdXNlIG9mICQoc2VsZWN0b3IpLmZvdW5kYXRpb24obWV0aG9kKSBjYWxscy5cbiAgICogQWxzbyBmaXJlcyB0aGUgaW5pdGlhbGl6YXRpb24gZXZlbnQgZm9yIGVhY2ggcGx1Z2luLCBjb25zb2xpZGF0aW5nIHJlcGV0aXRpdmUgY29kZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBsdWdpbiAtIGFuIGluc3RhbmNlIG9mIGEgcGx1Z2luLCB1c3VhbGx5IGB0aGlzYCBpbiBjb250ZXh0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBwbHVnaW4sIHBhc3NlZCBhcyBhIGNhbWVsQ2FzZWQgc3RyaW5nLlxuICAgKiBAZmlyZXMgUGx1Z2luI2luaXRcbiAgICovXG4gIHJlZ2lzdGVyUGx1Z2luOiBmdW5jdGlvbihwbHVnaW4sIG5hbWUpe1xuICAgIHZhciBwbHVnaW5OYW1lID0gbmFtZSA/IGh5cGhlbmF0ZShuYW1lKSA6IGZ1bmN0aW9uTmFtZShwbHVnaW4uY29uc3RydWN0b3IpLnRvTG93ZXJDYXNlKCk7XG4gICAgcGx1Z2luLnV1aWQgPSB0aGlzLkdldFlvRGlnaXRzKDYsIHBsdWdpbk5hbWUpO1xuXG4gICAgaWYoIXBsdWdpbi4kZWxlbWVudC5hdHRyKGBkYXRhLSR7cGx1Z2luTmFtZX1gKSl7IHBsdWdpbi4kZWxlbWVudC5hdHRyKGBkYXRhLSR7cGx1Z2luTmFtZX1gLCBwbHVnaW4udXVpZCk7IH1cbiAgICBpZighcGx1Z2luLiRlbGVtZW50LmRhdGEoJ3pmUGx1Z2luJykpeyBwbHVnaW4uJGVsZW1lbnQuZGF0YSgnemZQbHVnaW4nLCBwbHVnaW4pOyB9XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogRmlyZXMgd2hlbiB0aGUgcGx1Z2luIGhhcyBpbml0aWFsaXplZC5cbiAgICAgICAgICAgKiBAZXZlbnQgUGx1Z2luI2luaXRcbiAgICAgICAgICAgKi9cbiAgICBwbHVnaW4uJGVsZW1lbnQudHJpZ2dlcihgaW5pdC56Zi4ke3BsdWdpbk5hbWV9YCk7XG5cbiAgICB0aGlzLl91dWlkcy5wdXNoKHBsdWdpbi51dWlkKTtcblxuICAgIHJldHVybjtcbiAgfSxcbiAgLyoqXG4gICAqIEBmdW5jdGlvblxuICAgKiBSZW1vdmVzIHRoZSBwbHVnaW5zIHV1aWQgZnJvbSB0aGUgX3V1aWRzIGFycmF5LlxuICAgKiBSZW1vdmVzIHRoZSB6ZlBsdWdpbiBkYXRhIGF0dHJpYnV0ZSwgYXMgd2VsbCBhcyB0aGUgZGF0YS1wbHVnaW4tbmFtZSBhdHRyaWJ1dGUuXG4gICAqIEFsc28gZmlyZXMgdGhlIGRlc3Ryb3llZCBldmVudCBmb3IgdGhlIHBsdWdpbiwgY29uc29saWRhdGluZyByZXBldGl0aXZlIGNvZGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwbHVnaW4gLSBhbiBpbnN0YW5jZSBvZiBhIHBsdWdpbiwgdXN1YWxseSBgdGhpc2AgaW4gY29udGV4dC5cbiAgICogQGZpcmVzIFBsdWdpbiNkZXN0cm95ZWRcbiAgICovXG4gIHVucmVnaXN0ZXJQbHVnaW46IGZ1bmN0aW9uKHBsdWdpbil7XG4gICAgdmFyIHBsdWdpbk5hbWUgPSBoeXBoZW5hdGUoZnVuY3Rpb25OYW1lKHBsdWdpbi4kZWxlbWVudC5kYXRhKCd6ZlBsdWdpbicpLmNvbnN0cnVjdG9yKSk7XG5cbiAgICB0aGlzLl91dWlkcy5zcGxpY2UodGhpcy5fdXVpZHMuaW5kZXhPZihwbHVnaW4udXVpZCksIDEpO1xuICAgIHBsdWdpbi4kZWxlbWVudC5yZW1vdmVBdHRyKGBkYXRhLSR7cGx1Z2luTmFtZX1gKS5yZW1vdmVEYXRhKCd6ZlBsdWdpbicpXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogRmlyZXMgd2hlbiB0aGUgcGx1Z2luIGhhcyBiZWVuIGRlc3Ryb3llZC5cbiAgICAgICAgICAgKiBAZXZlbnQgUGx1Z2luI2Rlc3Ryb3llZFxuICAgICAgICAgICAqL1xuICAgICAgICAgIC50cmlnZ2VyKGBkZXN0cm95ZWQuemYuJHtwbHVnaW5OYW1lfWApO1xuICAgIGZvcih2YXIgcHJvcCBpbiBwbHVnaW4pe1xuICAgICAgcGx1Z2luW3Byb3BdID0gbnVsbDsvL2NsZWFuIHVwIHNjcmlwdCB0byBwcmVwIGZvciBnYXJiYWdlIGNvbGxlY3Rpb24uXG4gICAgfVxuICAgIHJldHVybjtcbiAgfSxcblxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqIENhdXNlcyBvbmUgb3IgbW9yZSBhY3RpdmUgcGx1Z2lucyB0byByZS1pbml0aWFsaXplLCByZXNldHRpbmcgZXZlbnQgbGlzdGVuZXJzLCByZWNhbGN1bGF0aW5nIHBvc2l0aW9ucywgZXRjLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGx1Z2lucyAtIG9wdGlvbmFsIHN0cmluZyBvZiBhbiBpbmRpdmlkdWFsIHBsdWdpbiBrZXksIGF0dGFpbmVkIGJ5IGNhbGxpbmcgYCQoZWxlbWVudCkuZGF0YSgncGx1Z2luTmFtZScpYCwgb3Igc3RyaW5nIG9mIGEgcGx1Z2luIGNsYXNzIGkuZS4gYCdkcm9wZG93bidgXG4gICAqIEBkZWZhdWx0IElmIG5vIGFyZ3VtZW50IGlzIHBhc3NlZCwgcmVmbG93IGFsbCBjdXJyZW50bHkgYWN0aXZlIHBsdWdpbnMuXG4gICAqL1xuICAgcmVJbml0OiBmdW5jdGlvbihwbHVnaW5zKXtcbiAgICAgdmFyIGlzSlEgPSBwbHVnaW5zIGluc3RhbmNlb2YgJDtcbiAgICAgdHJ5e1xuICAgICAgIGlmKGlzSlEpe1xuICAgICAgICAgcGx1Z2lucy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICQodGhpcykuZGF0YSgnemZQbHVnaW4nKS5faW5pdCgpO1xuICAgICAgICAgfSk7XG4gICAgICAgfWVsc2V7XG4gICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBwbHVnaW5zLFxuICAgICAgICAgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgZm5zID0ge1xuICAgICAgICAgICAnb2JqZWN0JzogZnVuY3Rpb24ocGxncyl7XG4gICAgICAgICAgICAgcGxncy5mb3JFYWNoKGZ1bmN0aW9uKHApe1xuICAgICAgICAgICAgICAgcCA9IGh5cGhlbmF0ZShwKTtcbiAgICAgICAgICAgICAgICQoJ1tkYXRhLScrIHAgKyddJykuZm91bmRhdGlvbignX2luaXQnKTtcbiAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgJ3N0cmluZyc6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgcGx1Z2lucyA9IGh5cGhlbmF0ZShwbHVnaW5zKTtcbiAgICAgICAgICAgICAkKCdbZGF0YS0nKyBwbHVnaW5zICsnXScpLmZvdW5kYXRpb24oJ19pbml0Jyk7XG4gICAgICAgICAgIH0sXG4gICAgICAgICAgICd1bmRlZmluZWQnOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgIHRoaXNbJ29iamVjdCddKE9iamVjdC5rZXlzKF90aGlzLl9wbHVnaW5zKSk7XG4gICAgICAgICAgIH1cbiAgICAgICAgIH07XG4gICAgICAgICBmbnNbdHlwZV0ocGx1Z2lucyk7XG4gICAgICAgfVxuICAgICB9Y2F0Y2goZXJyKXtcbiAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgIH1maW5hbGx5e1xuICAgICAgIHJldHVybiBwbHVnaW5zO1xuICAgICB9XG4gICB9LFxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgcmFuZG9tIGJhc2UtMzYgdWlkIHdpdGggbmFtZXNwYWNpbmdcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBudW1iZXIgb2YgcmFuZG9tIGJhc2UtMzYgZGlnaXRzIGRlc2lyZWQuIEluY3JlYXNlIGZvciBtb3JlIHJhbmRvbSBzdHJpbmdzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlIC0gbmFtZSBvZiBwbHVnaW4gdG8gYmUgaW5jb3Jwb3JhdGVkIGluIHVpZCwgb3B0aW9uYWwuXG4gICAqIEBkZWZhdWx0IHtTdHJpbmd9ICcnIC0gaWYgbm8gcGx1Z2luIG5hbWUgaXMgcHJvdmlkZWQsIG5vdGhpbmcgaXMgYXBwZW5kZWQgdG8gdGhlIHVpZC5cbiAgICogQHJldHVybnMge1N0cmluZ30gLSB1bmlxdWUgaWRcbiAgICovXG4gIEdldFlvRGlnaXRzOiBmdW5jdGlvbihsZW5ndGgsIG5hbWVzcGFjZSl7XG4gICAgbGVuZ3RoID0gbGVuZ3RoIHx8IDY7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoKE1hdGgucG93KDM2LCBsZW5ndGggKyAxKSAtIE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygzNiwgbGVuZ3RoKSkpLnRvU3RyaW5nKDM2KS5zbGljZSgxKSArIChuYW1lc3BhY2UgPyBgLSR7bmFtZXNwYWNlfWAgOiAnJyk7XG4gIH0sXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHBsdWdpbnMgb24gYW55IGVsZW1lbnRzIHdpdGhpbiBgZWxlbWAgKGFuZCBgZWxlbWAgaXRzZWxmKSB0aGF0IGFyZW4ndCBhbHJlYWR5IGluaXRpYWxpemVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSAtIGpRdWVyeSBvYmplY3QgY29udGFpbmluZyB0aGUgZWxlbWVudCB0byBjaGVjayBpbnNpZGUuIEFsc28gY2hlY2tzIHRoZSBlbGVtZW50IGl0c2VsZiwgdW5sZXNzIGl0J3MgdGhlIGBkb2N1bWVudGAgb2JqZWN0LlxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcGx1Z2lucyAtIEEgbGlzdCBvZiBwbHVnaW5zIHRvIGluaXRpYWxpemUuIExlYXZlIHRoaXMgb3V0IHRvIGluaXRpYWxpemUgZXZlcnl0aGluZy5cbiAgICovXG4gIHJlZmxvdzogZnVuY3Rpb24oZWxlbSwgcGx1Z2lucykge1xuXG4gICAgLy8gSWYgcGx1Z2lucyBpcyB1bmRlZmluZWQsIGp1c3QgZ3JhYiBldmVyeXRoaW5nXG4gICAgaWYgKHR5cGVvZiBwbHVnaW5zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcGx1Z2lucyA9IE9iamVjdC5rZXlzKHRoaXMuX3BsdWdpbnMpO1xuICAgIH1cbiAgICAvLyBJZiBwbHVnaW5zIGlzIGEgc3RyaW5nLCBjb252ZXJ0IGl0IHRvIGFuIGFycmF5IHdpdGggb25lIGl0ZW1cbiAgICBlbHNlIGlmICh0eXBlb2YgcGx1Z2lucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBsdWdpbnMgPSBbcGx1Z2luc107XG4gICAgfVxuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIHBsdWdpblxuICAgICQuZWFjaChwbHVnaW5zLCBmdW5jdGlvbihpLCBuYW1lKSB7XG4gICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgcGx1Z2luXG4gICAgICB2YXIgcGx1Z2luID0gX3RoaXMuX3BsdWdpbnNbbmFtZV07XG5cbiAgICAgIC8vIExvY2FsaXplIHRoZSBzZWFyY2ggdG8gYWxsIGVsZW1lbnRzIGluc2lkZSBlbGVtLCBhcyB3ZWxsIGFzIGVsZW0gaXRzZWxmLCB1bmxlc3MgZWxlbSA9PT0gZG9jdW1lbnRcbiAgICAgIHZhciAkZWxlbSA9ICQoZWxlbSkuZmluZCgnW2RhdGEtJytuYW1lKyddJykuYWRkQmFjaygnW2RhdGEtJytuYW1lKyddJyk7XG5cbiAgICAgIC8vIEZvciBlYWNoIHBsdWdpbiBmb3VuZCwgaW5pdGlhbGl6ZSBpdFxuICAgICAgJGVsZW0uZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICRlbCA9ICQodGhpcyksXG4gICAgICAgICAgICBvcHRzID0ge307XG4gICAgICAgIC8vIERvbid0IGRvdWJsZS1kaXAgb24gcGx1Z2luc1xuICAgICAgICBpZiAoJGVsLmRhdGEoJ3pmUGx1Z2luJykpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJUcmllZCB0byBpbml0aWFsaXplIFwiK25hbWUrXCIgb24gYW4gZWxlbWVudCB0aGF0IGFscmVhZHkgaGFzIGEgRm91bmRhdGlvbiBwbHVnaW4uXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCRlbC5hdHRyKCdkYXRhLW9wdGlvbnMnKSl7XG4gICAgICAgICAgdmFyIHRoaW5nID0gJGVsLmF0dHIoJ2RhdGEtb3B0aW9ucycpLnNwbGl0KCc7JykuZm9yRWFjaChmdW5jdGlvbihlLCBpKXtcbiAgICAgICAgICAgIHZhciBvcHQgPSBlLnNwbGl0KCc6JykubWFwKGZ1bmN0aW9uKGVsKXsgcmV0dXJuIGVsLnRyaW0oKTsgfSk7XG4gICAgICAgICAgICBpZihvcHRbMF0pIG9wdHNbb3B0WzBdXSA9IHBhcnNlVmFsdWUob3B0WzFdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0cnl7XG4gICAgICAgICAgJGVsLmRhdGEoJ3pmUGx1Z2luJywgbmV3IHBsdWdpbigkKHRoaXMpLCBvcHRzKSk7XG4gICAgICAgIH1jYXRjaChlcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcik7XG4gICAgICAgIH1maW5hbGx5e1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGdldEZuTmFtZTogZnVuY3Rpb25OYW1lLFxuICB0cmFuc2l0aW9uZW5kOiBmdW5jdGlvbigkZWxlbSl7XG4gICAgdmFyIHRyYW5zaXRpb25zID0ge1xuICAgICAgJ3RyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAnV2Via2l0VHJhbnNpdGlvbic6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgICdNb3pUcmFuc2l0aW9uJzogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgJ09UcmFuc2l0aW9uJzogJ290cmFuc2l0aW9uZW5kJ1xuICAgIH07XG4gICAgdmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgZW5kO1xuXG4gICAgZm9yICh2YXIgdCBpbiB0cmFuc2l0aW9ucyl7XG4gICAgICBpZiAodHlwZW9mIGVsZW0uc3R5bGVbdF0gIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgZW5kID0gdHJhbnNpdGlvbnNbdF07XG4gICAgICB9XG4gICAgfVxuICAgIGlmKGVuZCl7XG4gICAgICByZXR1cm4gZW5kO1xuICAgIH1lbHNle1xuICAgICAgZW5kID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAkZWxlbS50cmlnZ2VySGFuZGxlcigndHJhbnNpdGlvbmVuZCcsIFskZWxlbV0pO1xuICAgICAgfSwgMSk7XG4gICAgICByZXR1cm4gJ3RyYW5zaXRpb25lbmQnO1xuICAgIH1cbiAgfVxufTtcblxuRm91bmRhdGlvbi51dGlsID0ge1xuICAvKipcbiAgICogRnVuY3Rpb24gZm9yIGFwcGx5aW5nIGEgZGVib3VuY2UgZWZmZWN0IHRvIGEgZnVuY3Rpb24gY2FsbC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgLSBGdW5jdGlvbiB0byBiZSBjYWxsZWQgYXQgZW5kIG9mIHRpbWVvdXQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSAtIFRpbWUgaW4gbXMgdG8gZGVsYXkgdGhlIGNhbGwgb2YgYGZ1bmNgLlxuICAgKiBAcmV0dXJucyBmdW5jdGlvblxuICAgKi9cbiAgdGhyb3R0bGU6IGZ1bmN0aW9uIChmdW5jLCBkZWxheSkge1xuICAgIHZhciB0aW1lciA9IG51bGw7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICBpZiAodGltZXIgPT09IG51bGwpIHtcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG5cbi8vIFRPRE86IGNvbnNpZGVyIG5vdCBtYWtpbmcgdGhpcyBhIGpRdWVyeSBmdW5jdGlvblxuLy8gVE9ETzogbmVlZCB3YXkgdG8gcmVmbG93IHZzLiByZS1pbml0aWFsaXplXG4vKipcbiAqIFRoZSBGb3VuZGF0aW9uIGpRdWVyeSBtZXRob2QuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gbWV0aG9kIC0gQW4gYWN0aW9uIHRvIHBlcmZvcm0gb24gdGhlIGN1cnJlbnQgalF1ZXJ5IG9iamVjdC5cbiAqL1xudmFyIGZvdW5kYXRpb24gPSBmdW5jdGlvbihtZXRob2QpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgbWV0aG9kLFxuICAgICAgJG1ldGEgPSAkKCdtZXRhLmZvdW5kYXRpb24tbXEnKSxcbiAgICAgICRub0pTID0gJCgnLm5vLWpzJyk7XG5cbiAgaWYoISRtZXRhLmxlbmd0aCl7XG4gICAgJCgnPG1ldGEgY2xhc3M9XCJmb3VuZGF0aW9uLW1xXCI+JykuYXBwZW5kVG8oZG9jdW1lbnQuaGVhZCk7XG4gIH1cbiAgaWYoJG5vSlMubGVuZ3RoKXtcbiAgICAkbm9KUy5yZW1vdmVDbGFzcygnbm8tanMnKTtcbiAgfVxuXG4gIGlmKHR5cGUgPT09ICd1bmRlZmluZWQnKXsvL25lZWRzIHRvIGluaXRpYWxpemUgdGhlIEZvdW5kYXRpb24gb2JqZWN0LCBvciBhbiBpbmRpdmlkdWFsIHBsdWdpbi5cbiAgICBGb3VuZGF0aW9uLk1lZGlhUXVlcnkuX2luaXQoKTtcbiAgICBGb3VuZGF0aW9uLnJlZmxvdyh0aGlzKTtcbiAgfWVsc2UgaWYodHlwZSA9PT0gJ3N0cmluZycpey8vYW4gaW5kaXZpZHVhbCBtZXRob2QgdG8gaW52b2tlIG9uIGEgcGx1Z2luIG9yIGdyb3VwIG9mIHBsdWdpbnNcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7Ly9jb2xsZWN0IGFsbCB0aGUgYXJndW1lbnRzLCBpZiBuZWNlc3NhcnlcbiAgICB2YXIgcGx1Z0NsYXNzID0gdGhpcy5kYXRhKCd6ZlBsdWdpbicpOy8vZGV0ZXJtaW5lIHRoZSBjbGFzcyBvZiBwbHVnaW5cblxuICAgIGlmKHBsdWdDbGFzcyAhPT0gdW5kZWZpbmVkICYmIHBsdWdDbGFzc1ttZXRob2RdICE9PSB1bmRlZmluZWQpey8vbWFrZSBzdXJlIGJvdGggdGhlIGNsYXNzIGFuZCBtZXRob2QgZXhpc3RcbiAgICAgIGlmKHRoaXMubGVuZ3RoID09PSAxKXsvL2lmIHRoZXJlJ3Mgb25seSBvbmUsIGNhbGwgaXQgZGlyZWN0bHkuXG4gICAgICAgICAgcGx1Z0NsYXNzW21ldGhvZF0uYXBwbHkocGx1Z0NsYXNzLCBhcmdzKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgZWwpey8vb3RoZXJ3aXNlIGxvb3AgdGhyb3VnaCB0aGUgalF1ZXJ5IGNvbGxlY3Rpb24gYW5kIGludm9rZSB0aGUgbWV0aG9kIG9uIGVhY2hcbiAgICAgICAgICBwbHVnQ2xhc3NbbWV0aG9kXS5hcHBseSgkKGVsKS5kYXRhKCd6ZlBsdWdpbicpLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfWVsc2V7Ly9lcnJvciBmb3Igbm8gY2xhc3Mgb3Igbm8gbWV0aG9kXG4gICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJXZSdyZSBzb3JyeSwgJ1wiICsgbWV0aG9kICsgXCInIGlzIG5vdCBhbiBhdmFpbGFibGUgbWV0aG9kIGZvciBcIiArIChwbHVnQ2xhc3MgPyBmdW5jdGlvbk5hbWUocGx1Z0NsYXNzKSA6ICd0aGlzIGVsZW1lbnQnKSArICcuJyk7XG4gICAgfVxuICB9ZWxzZXsvL2Vycm9yIGZvciBpbnZhbGlkIGFyZ3VtZW50IHR5cGVcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBXZSdyZSBzb3JyeSwgJHt0eXBlfSBpcyBub3QgYSB2YWxpZCBwYXJhbWV0ZXIuIFlvdSBtdXN0IHVzZSBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIG1ldGhvZCB5b3Ugd2lzaCB0byBpbnZva2UuYCk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG53aW5kb3cuRm91bmRhdGlvbiA9IEZvdW5kYXRpb247XG4kLmZuLmZvdW5kYXRpb24gPSBmb3VuZGF0aW9uO1xuXG4vLyBQb2x5ZmlsbCBmb3IgcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4oZnVuY3Rpb24oKSB7XG4gIGlmICghRGF0ZS5ub3cgfHwgIXdpbmRvdy5EYXRlLm5vdylcbiAgICB3aW5kb3cuRGF0ZS5ub3cgPSBEYXRlLm5vdyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cbiAgdmFyIHZlbmRvcnMgPSBbJ3dlYmtpdCcsICdtb3onXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKytpKSB7XG4gICAgICB2YXIgdnAgPSB2ZW5kb3JzW2ldO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2cCsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSAod2luZG93W3ZwKydDYW5jZWxBbmltYXRpb25GcmFtZSddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB3aW5kb3dbdnArJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddKTtcbiAgfVxuICBpZiAoL2lQKGFkfGhvbmV8b2QpLipPUyA2Ly50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KVxuICAgIHx8ICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8ICF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdmFyIG5leHRUaW1lID0gTWF0aC5tYXgobGFzdFRpbWUgKyAxNiwgbm93KTtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGxhc3RUaW1lID0gbmV4dFRpbWUpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGltZSAtIG5vdyk7XG4gICAgfTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBjbGVhclRpbWVvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFBvbHlmaWxsIGZvciBwZXJmb3JtYW5jZS5ub3csIHJlcXVpcmVkIGJ5IHJBRlxuICAgKi9cbiAgaWYoIXdpbmRvdy5wZXJmb3JtYW5jZSB8fCAhd2luZG93LnBlcmZvcm1hbmNlLm5vdyl7XG4gICAgd2luZG93LnBlcmZvcm1hbmNlID0ge1xuICAgICAgc3RhcnQ6IERhdGUubm93KCksXG4gICAgICBub3c6IGZ1bmN0aW9uKCl7IHJldHVybiBEYXRlLm5vdygpIC0gdGhpcy5zdGFydDsgfVxuICAgIH07XG4gIH1cbn0pKCk7XG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XG4gIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24ob1RoaXMpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIGNsb3Nlc3QgdGhpbmcgcG9zc2libGUgdG8gdGhlIEVDTUFTY3JpcHQgNVxuICAgICAgLy8gaW50ZXJuYWwgSXNDYWxsYWJsZSBmdW5jdGlvblxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgLSB3aGF0IGlzIHRyeWluZyB0byBiZSBib3VuZCBpcyBub3QgY2FsbGFibGUnKTtcbiAgICB9XG5cbiAgICB2YXIgYUFyZ3MgICA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG4gICAgICAgIGZUb0JpbmQgPSB0aGlzLFxuICAgICAgICBmTk9QICAgID0gZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgZkJvdW5kICA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmVG9CaW5kLmFwcGx5KHRoaXMgaW5zdGFuY2VvZiBmTk9QXG4gICAgICAgICAgICAgICAgID8gdGhpc1xuICAgICAgICAgICAgICAgICA6IG9UaGlzLFxuICAgICAgICAgICAgICAgICBhQXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICB9O1xuXG4gICAgaWYgKHRoaXMucHJvdG90eXBlKSB7XG4gICAgICAvLyBuYXRpdmUgZnVuY3Rpb25zIGRvbid0IGhhdmUgYSBwcm90b3R5cGVcbiAgICAgIGZOT1AucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XG4gICAgfVxuICAgIGZCb3VuZC5wcm90b3R5cGUgPSBuZXcgZk5PUCgpO1xuXG4gICAgcmV0dXJuIGZCb3VuZDtcbiAgfTtcbn1cbi8vIFBvbHlmaWxsIHRvIGdldCB0aGUgbmFtZSBvZiBhIGZ1bmN0aW9uIGluIElFOVxuZnVuY3Rpb24gZnVuY3Rpb25OYW1lKGZuKSB7XG4gIGlmIChGdW5jdGlvbi5wcm90b3R5cGUubmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb25cXHMoW14oXXsxLH0pXFwoLztcbiAgICB2YXIgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKChmbikudG9TdHJpbmcoKSk7XG4gICAgcmV0dXJuIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSkgPyByZXN1bHRzWzFdLnRyaW0oKSA6IFwiXCI7XG4gIH1cbiAgZWxzZSBpZiAoZm4ucHJvdG90eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZm4uY29uc3RydWN0b3IubmFtZTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gZm4ucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cbn1cbmZ1bmN0aW9uIHBhcnNlVmFsdWUoc3RyKXtcbiAgaWYgKCd0cnVlJyA9PT0gc3RyKSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSBpZiAoJ2ZhbHNlJyA9PT0gc3RyKSByZXR1cm4gZmFsc2U7XG4gIGVsc2UgaWYgKCFpc05hTihzdHIgKiAxKSkgcmV0dXJuIHBhcnNlRmxvYXQoc3RyKTtcbiAgcmV0dXJuIHN0cjtcbn1cbi8vIENvbnZlcnQgUGFzY2FsQ2FzZSB0byBrZWJhYi1jYXNlXG4vLyBUaGFuayB5b3U6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg5NTU1ODBcbmZ1bmN0aW9uIGh5cGhlbmF0ZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xufVxuXG59KGpRdWVyeSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbiFmdW5jdGlvbigkKSB7XG5cbi8vIERlZmF1bHQgc2V0IG9mIG1lZGlhIHF1ZXJpZXNcbmNvbnN0IGRlZmF1bHRRdWVyaWVzID0ge1xuICAnZGVmYXVsdCcgOiAnb25seSBzY3JlZW4nLFxuICBsYW5kc2NhcGUgOiAnb25seSBzY3JlZW4gYW5kIChvcmllbnRhdGlvbjogbGFuZHNjYXBlKScsXG4gIHBvcnRyYWl0IDogJ29ubHkgc2NyZWVuIGFuZCAob3JpZW50YXRpb246IHBvcnRyYWl0KScsXG4gIHJldGluYSA6ICdvbmx5IHNjcmVlbiBhbmQgKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMiksJyArXG4gICAgJ29ubHkgc2NyZWVuIGFuZCAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSwnICtcbiAgICAnb25seSBzY3JlZW4gYW5kICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyLzEpLCcgK1xuICAgICdvbmx5IHNjcmVlbiBhbmQgKG1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLCcgK1xuICAgICdvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAxOTJkcGkpLCcgK1xuICAgICdvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAyZHBweCknXG59O1xuXG52YXIgTWVkaWFRdWVyeSA9IHtcbiAgcXVlcmllczogW10sXG5cbiAgY3VycmVudDogJycsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBtZWRpYSBxdWVyeSBoZWxwZXIsIGJ5IGV4dHJhY3RpbmcgdGhlIGJyZWFrcG9pbnQgbGlzdCBmcm9tIHRoZSBDU1MgYW5kIGFjdGl2YXRpbmcgdGhlIGJyZWFrcG9pbnQgd2F0Y2hlci5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGV4dHJhY3RlZFN0eWxlcyA9ICQoJy5mb3VuZGF0aW9uLW1xJykuY3NzKCdmb250LWZhbWlseScpO1xuICAgIHZhciBuYW1lZFF1ZXJpZXM7XG5cbiAgICBuYW1lZFF1ZXJpZXMgPSBwYXJzZVN0eWxlVG9PYmplY3QoZXh0cmFjdGVkU3R5bGVzKTtcblxuICAgIGZvciAodmFyIGtleSBpbiBuYW1lZFF1ZXJpZXMpIHtcbiAgICAgIGlmKG5hbWVkUXVlcmllcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHNlbGYucXVlcmllcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgICAgdmFsdWU6IGBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogJHtuYW1lZFF1ZXJpZXNba2V5XX0pYFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLl9nZXRDdXJyZW50U2l6ZSgpO1xuXG4gICAgdGhpcy5fd2F0Y2hlcigpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHNjcmVlbiBpcyBhdCBsZWFzdCBhcyB3aWRlIGFzIGEgYnJlYWtwb2ludC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzaXplIC0gTmFtZSBvZiB0aGUgYnJlYWtwb2ludCB0byBjaGVjay5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgYnJlYWtwb2ludCBtYXRjaGVzLCBgZmFsc2VgIGlmIGl0J3Mgc21hbGxlci5cbiAgICovXG4gIGF0TGVhc3Qoc2l6ZSkge1xuICAgIHZhciBxdWVyeSA9IHRoaXMuZ2V0KHNpemUpO1xuXG4gICAgaWYgKHF1ZXJ5KSB7XG4gICAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEocXVlcnkpLm1hdGNoZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHNjcmVlbiBtYXRjaGVzIHRvIGEgYnJlYWtwb2ludC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzaXplIC0gTmFtZSBvZiB0aGUgYnJlYWtwb2ludCB0byBjaGVjaywgZWl0aGVyICdzbWFsbCBvbmx5JyBvciAnc21hbGwnLiBPbWl0dGluZyAnb25seScgZmFsbHMgYmFjayB0byB1c2luZyBhdExlYXN0KCkgbWV0aG9kLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBicmVha3BvaW50IG1hdGNoZXMsIGBmYWxzZWAgaWYgaXQgZG9lcyBub3QuXG4gICAqL1xuICBpcyhzaXplKSB7XG4gICAgc2l6ZSA9IHNpemUudHJpbSgpLnNwbGl0KCcgJyk7XG4gICAgaWYoc2l6ZS5sZW5ndGggPiAxICYmIHNpemVbMV0gPT09ICdvbmx5Jykge1xuICAgICAgaWYoc2l6ZVswXSA9PT0gdGhpcy5fZ2V0Q3VycmVudFNpemUoKSkgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmF0TGVhc3Qoc2l6ZVswXSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogR2V0cyB0aGUgbWVkaWEgcXVlcnkgb2YgYSBicmVha3BvaW50LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpemUgLSBOYW1lIG9mIHRoZSBicmVha3BvaW50IHRvIGdldC5cbiAgICogQHJldHVybnMge1N0cmluZ3xudWxsfSAtIFRoZSBtZWRpYSBxdWVyeSBvZiB0aGUgYnJlYWtwb2ludCwgb3IgYG51bGxgIGlmIHRoZSBicmVha3BvaW50IGRvZXNuJ3QgZXhpc3QuXG4gICAqL1xuICBnZXQoc2l6ZSkge1xuICAgIGZvciAodmFyIGkgaW4gdGhpcy5xdWVyaWVzKSB7XG4gICAgICBpZih0aGlzLnF1ZXJpZXMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW2ldO1xuICAgICAgICBpZiAoc2l6ZSA9PT0gcXVlcnkubmFtZSkgcmV0dXJuIHF1ZXJ5LnZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IGJyZWFrcG9pbnQgbmFtZSBieSB0ZXN0aW5nIGV2ZXJ5IGJyZWFrcG9pbnQgYW5kIHJldHVybmluZyB0aGUgbGFzdCBvbmUgdG8gbWF0Y2ggKHRoZSBiaWdnZXN0IG9uZSkuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBOYW1lIG9mIHRoZSBjdXJyZW50IGJyZWFrcG9pbnQuXG4gICAqL1xuICBfZ2V0Q3VycmVudFNpemUoKSB7XG4gICAgdmFyIG1hdGNoZWQ7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW2ldO1xuXG4gICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEocXVlcnkudmFsdWUpLm1hdGNoZXMpIHtcbiAgICAgICAgbWF0Y2hlZCA9IHF1ZXJ5O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbWF0Y2hlZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBtYXRjaGVkLm5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtYXRjaGVkO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQWN0aXZhdGVzIHRoZSBicmVha3BvaW50IHdhdGNoZXIsIHdoaWNoIGZpcmVzIGFuIGV2ZW50IG9uIHRoZSB3aW5kb3cgd2hlbmV2ZXIgdGhlIGJyZWFrcG9pbnQgY2hhbmdlcy5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfd2F0Y2hlcigpIHtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS56Zi5tZWRpYXF1ZXJ5JywgKCkgPT4ge1xuICAgICAgdmFyIG5ld1NpemUgPSB0aGlzLl9nZXRDdXJyZW50U2l6ZSgpLCBjdXJyZW50U2l6ZSA9IHRoaXMuY3VycmVudDtcblxuICAgICAgaWYgKG5ld1NpemUgIT09IGN1cnJlbnRTaXplKSB7XG4gICAgICAgIC8vIENoYW5nZSB0aGUgY3VycmVudCBtZWRpYSBxdWVyeVxuICAgICAgICB0aGlzLmN1cnJlbnQgPSBuZXdTaXplO1xuXG4gICAgICAgIC8vIEJyb2FkY2FzdCB0aGUgbWVkaWEgcXVlcnkgY2hhbmdlIG9uIHRoZSB3aW5kb3dcbiAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoYW5nZWQuemYubWVkaWFxdWVyeScsIFtuZXdTaXplLCBjdXJyZW50U2l6ZV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG5Gb3VuZGF0aW9uLk1lZGlhUXVlcnkgPSBNZWRpYVF1ZXJ5O1xuXG4vLyBtYXRjaE1lZGlhKCkgcG9seWZpbGwgLSBUZXN0IGEgQ1NTIG1lZGlhIHR5cGUvcXVlcnkgaW4gSlMuXG4vLyBBdXRob3JzICYgY29weXJpZ2h0IChjKSAyMDEyOiBTY290dCBKZWhsLCBQYXVsIElyaXNoLCBOaWNob2xhcyBaYWthcywgRGF2aWQgS25pZ2h0LiBEdWFsIE1JVC9CU0QgbGljZW5zZVxud2luZG93Lm1hdGNoTWVkaWEgfHwgKHdpbmRvdy5tYXRjaE1lZGlhID0gZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBGb3IgYnJvd3NlcnMgdGhhdCBzdXBwb3J0IG1hdGNoTWVkaXVtIGFwaSBzdWNoIGFzIElFIDkgYW5kIHdlYmtpdFxuICB2YXIgc3R5bGVNZWRpYSA9ICh3aW5kb3cuc3R5bGVNZWRpYSB8fCB3aW5kb3cubWVkaWEpO1xuXG4gIC8vIEZvciB0aG9zZSB0aGF0IGRvbid0IHN1cHBvcnQgbWF0Y2hNZWRpdW1cbiAgaWYgKCFzdHlsZU1lZGlhKSB7XG4gICAgdmFyIHN0eWxlICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpLFxuICAgIHNjcmlwdCAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdLFxuICAgIGluZm8gICAgICAgID0gbnVsbDtcblxuICAgIHN0eWxlLnR5cGUgID0gJ3RleHQvY3NzJztcbiAgICBzdHlsZS5pZCAgICA9ICdtYXRjaG1lZGlhanMtdGVzdCc7XG5cbiAgICBzY3JpcHQgJiYgc2NyaXB0LnBhcmVudE5vZGUgJiYgc2NyaXB0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHN0eWxlLCBzY3JpcHQpO1xuXG4gICAgLy8gJ3N0eWxlLmN1cnJlbnRTdHlsZScgaXMgdXNlZCBieSBJRSA8PSA4IGFuZCAnd2luZG93LmdldENvbXB1dGVkU3R5bGUnIGZvciBhbGwgb3RoZXIgYnJvd3NlcnNcbiAgICBpbmZvID0gKCdnZXRDb21wdXRlZFN0eWxlJyBpbiB3aW5kb3cpICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHN0eWxlLCBudWxsKSB8fCBzdHlsZS5jdXJyZW50U3R5bGU7XG5cbiAgICBzdHlsZU1lZGlhID0ge1xuICAgICAgbWF0Y2hNZWRpdW0obWVkaWEpIHtcbiAgICAgICAgdmFyIHRleHQgPSBgQG1lZGlhICR7bWVkaWF9eyAjbWF0Y2htZWRpYWpzLXRlc3QgeyB3aWR0aDogMXB4OyB9IH1gO1xuXG4gICAgICAgIC8vICdzdHlsZS5zdHlsZVNoZWV0JyBpcyB1c2VkIGJ5IElFIDw9IDggYW5kICdzdHlsZS50ZXh0Q29udGVudCcgZm9yIGFsbCBvdGhlciBicm93c2Vyc1xuICAgICAgICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGVzdCBpZiBtZWRpYSBxdWVyeSBpcyB0cnVlIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBpbmZvLndpZHRoID09PSAnMXB4JztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24obWVkaWEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWF0Y2hlczogc3R5bGVNZWRpYS5tYXRjaE1lZGl1bShtZWRpYSB8fCAnYWxsJyksXG4gICAgICBtZWRpYTogbWVkaWEgfHwgJ2FsbCdcbiAgICB9O1xuICB9XG59KCkpO1xuXG4vLyBUaGFuayB5b3U6IGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvcXVlcnktc3RyaW5nXG5mdW5jdGlvbiBwYXJzZVN0eWxlVG9PYmplY3Qoc3RyKSB7XG4gIHZhciBzdHlsZU9iamVjdCA9IHt9O1xuXG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzdHlsZU9iamVjdDtcbiAgfVxuXG4gIHN0ciA9IHN0ci50cmltKCkuc2xpY2UoMSwgLTEpOyAvLyBicm93c2VycyByZS1xdW90ZSBzdHJpbmcgc3R5bGUgdmFsdWVzXG5cbiAgaWYgKCFzdHIpIHtcbiAgICByZXR1cm4gc3R5bGVPYmplY3Q7XG4gIH1cblxuICBzdHlsZU9iamVjdCA9IHN0ci5zcGxpdCgnJicpLnJlZHVjZShmdW5jdGlvbihyZXQsIHBhcmFtKSB7XG4gICAgdmFyIHBhcnRzID0gcGFyYW0ucmVwbGFjZSgvXFwrL2csICcgJykuc3BsaXQoJz0nKTtcbiAgICB2YXIga2V5ID0gcGFydHNbMF07XG4gICAgdmFyIHZhbCA9IHBhcnRzWzFdO1xuICAgIGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChrZXkpO1xuXG4gICAgLy8gbWlzc2luZyBgPWAgc2hvdWxkIGJlIGBudWxsYDpcbiAgICAvLyBodHRwOi8vdzMub3JnL1RSLzIwMTIvV0QtdXJsLTIwMTIwNTI0LyNjb2xsZWN0LXVybC1wYXJhbWV0ZXJzXG4gICAgdmFsID0gdmFsID09PSB1bmRlZmluZWQgPyBudWxsIDogZGVjb2RlVVJJQ29tcG9uZW50KHZhbCk7XG5cbiAgICBpZiAoIXJldC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXRba2V5XSA9IHZhbDtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmV0W2tleV0pKSB7XG4gICAgICByZXRba2V5XS5wdXNoKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldFtrZXldID0gW3JldFtrZXldLCB2YWxdO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIHN0eWxlT2JqZWN0O1xufVxuXG5Gb3VuZGF0aW9uLk1lZGlhUXVlcnkgPSBNZWRpYVF1ZXJ5O1xuXG59KGpRdWVyeSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbiFmdW5jdGlvbigkKSB7XG5cbi8qKlxuICogQWJpZGUgbW9kdWxlLlxuICogQG1vZHVsZSBmb3VuZGF0aW9uLmFiaWRlXG4gKi9cblxuY2xhc3MgQWJpZGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBBYmlkZS5cbiAgICogQGNsYXNzXG4gICAqIEBmaXJlcyBBYmlkZSNpbml0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IC0galF1ZXJ5IG9iamVjdCB0byBhZGQgdGhlIHRyaWdnZXIgdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGVzIHRvIHRoZSBkZWZhdWx0IHBsdWdpbiBzZXR0aW5ncy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuJGVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyAgPSAkLmV4dGVuZCh7fSwgQWJpZGUuZGVmYXVsdHMsIHRoaXMuJGVsZW1lbnQuZGF0YSgpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2luaXQoKTtcblxuICAgIEZvdW5kYXRpb24ucmVnaXN0ZXJQbHVnaW4odGhpcywgJ0FiaWRlJyk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIEFiaWRlIHBsdWdpbiBhbmQgY2FsbHMgZnVuY3Rpb25zIHRvIGdldCBBYmlkZSBmdW5jdGlvbmluZyBvbiBsb2FkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXQoKSB7XG4gICAgdGhpcy4kaW5wdXRzID0gdGhpcy4kZWxlbWVudC5maW5kKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpO1xuXG4gICAgdGhpcy5fZXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgZXZlbnRzIGZvciBBYmlkZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ldmVudHMoKSB7XG4gICAgdGhpcy4kZWxlbWVudC5vZmYoJy5hYmlkZScpXG4gICAgICAub24oJ3Jlc2V0LnpmLmFiaWRlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnJlc2V0Rm9ybSgpO1xuICAgICAgfSlcbiAgICAgIC5vbignc3VibWl0LnpmLmFiaWRlJywgKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy52YWxpZGF0ZU9uID09PSAnZmllbGRDaGFuZ2UnKSB7XG4gICAgICB0aGlzLiRpbnB1dHNcbiAgICAgICAgLm9mZignY2hhbmdlLnpmLmFiaWRlJylcbiAgICAgICAgLm9uKCdjaGFuZ2UuemYuYWJpZGUnLCAoZSkgPT4ge1xuICAgICAgICAgIHRoaXMudmFsaWRhdGVJbnB1dCgkKGUudGFyZ2V0KSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMubGl2ZVZhbGlkYXRlKSB7XG4gICAgICB0aGlzLiRpbnB1dHNcbiAgICAgICAgLm9mZignaW5wdXQuemYuYWJpZGUnKVxuICAgICAgICAub24oJ2lucHV0LnpmLmFiaWRlJywgKGUpID0+IHtcbiAgICAgICAgICB0aGlzLnZhbGlkYXRlSW5wdXQoJChlLnRhcmdldCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnZhbGlkYXRlT25CbHVyKSB7XG4gICAgICB0aGlzLiRpbnB1dHNcbiAgICAgICAgLm9mZignYmx1ci56Zi5hYmlkZScpXG4gICAgICAgIC5vbignYmx1ci56Zi5hYmlkZScsIChlKSA9PiB7XG4gICAgICAgICAgdGhpcy52YWxpZGF0ZUlucHV0KCQoZS50YXJnZXQpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIG5lY2Vzc2FyeSBmdW5jdGlvbnMgdG8gdXBkYXRlIEFiaWRlIHVwb24gRE9NIGNoYW5nZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlZmxvdygpIHtcbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IGEgZm9ybSBlbGVtZW50IGhhcyB0aGUgcmVxdWlyZWQgYXR0cmlidXRlIGFuZCBpZiBpdCdzIGNoZWNrZWQgb3Igbm90XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IC0galF1ZXJ5IG9iamVjdCB0byBjaGVjayBmb3IgcmVxdWlyZWQgYXR0cmlidXRlXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBCb29sZWFuIHZhbHVlIGRlcGVuZHMgb24gd2hldGhlciBvciBub3QgYXR0cmlidXRlIGlzIGNoZWNrZWQgb3IgZW1wdHlcbiAgICovXG4gIHJlcXVpcmVkQ2hlY2soJGVsKSB7XG4gICAgaWYgKCEkZWwuYXR0cigncmVxdWlyZWQnKSkgcmV0dXJuIHRydWU7XG5cbiAgICB2YXIgaXNHb29kID0gdHJ1ZTtcblxuICAgIHN3aXRjaCAoJGVsWzBdLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2NoZWNrYm94JzpcbiAgICAgICAgaXNHb29kID0gJGVsWzBdLmNoZWNrZWQ7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgY2FzZSAnc2VsZWN0LW9uZSc6XG4gICAgICBjYXNlICdzZWxlY3QtbXVsdGlwbGUnOlxuICAgICAgICB2YXIgb3B0ID0gJGVsLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xuICAgICAgICBpZiAoIW9wdC5sZW5ndGggfHwgIW9wdC52YWwoKSkgaXNHb29kID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZighJGVsLnZhbCgpIHx8ICEkZWwudmFsKCkubGVuZ3RoKSBpc0dvb2QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXNHb29kO1xuICB9XG5cbiAgLyoqXG4gICAqIEJhc2VkIG9uICRlbCwgZ2V0IHRoZSBmaXJzdCBlbGVtZW50IHdpdGggc2VsZWN0b3IgaW4gdGhpcyBvcmRlcjpcbiAgICogMS4gVGhlIGVsZW1lbnQncyBkaXJlY3Qgc2libGluZygncykuXG4gICAqIDMuIFRoZSBlbGVtZW50J3MgcGFyZW50J3MgY2hpbGRyZW4uXG4gICAqXG4gICAqIFRoaXMgYWxsb3dzIGZvciBtdWx0aXBsZSBmb3JtIGVycm9ycyBwZXIgaW5wdXQsIHRob3VnaCBpZiBub25lIGFyZSBmb3VuZCwgbm8gZm9ybSBlcnJvcnMgd2lsbCBiZSBzaG93bi5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9ICRlbCAtIGpRdWVyeSBvYmplY3QgdG8gdXNlIGFzIHJlZmVyZW5jZSB0byBmaW5kIHRoZSBmb3JtIGVycm9yIHNlbGVjdG9yLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBqUXVlcnkgb2JqZWN0IHdpdGggdGhlIHNlbGVjdG9yLlxuICAgKi9cbiAgZmluZEZvcm1FcnJvcigkZWwpIHtcbiAgICB2YXIgJGVycm9yID0gJGVsLnNpYmxpbmdzKHRoaXMub3B0aW9ucy5mb3JtRXJyb3JTZWxlY3Rvcik7XG5cbiAgICBpZiAoISRlcnJvci5sZW5ndGgpIHtcbiAgICAgICRlcnJvciA9ICRlbC5wYXJlbnQoKS5maW5kKHRoaXMub3B0aW9ucy5mb3JtRXJyb3JTZWxlY3Rvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlcnJvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhpcyBvcmRlcjpcbiAgICogMi4gVGhlIDxsYWJlbD4gd2l0aCB0aGUgYXR0cmlidXRlIGBbZm9yPVwic29tZUlucHV0SWRcIl1gXG4gICAqIDMuIFRoZSBgLmNsb3Nlc3QoKWAgPGxhYmVsPlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gJGVsIC0galF1ZXJ5IG9iamVjdCB0byBjaGVjayBmb3IgcmVxdWlyZWQgYXR0cmlidXRlXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBCb29sZWFuIHZhbHVlIGRlcGVuZHMgb24gd2hldGhlciBvciBub3QgYXR0cmlidXRlIGlzIGNoZWNrZWQgb3IgZW1wdHlcbiAgICovXG4gIGZpbmRMYWJlbCgkZWwpIHtcbiAgICB2YXIgaWQgPSAkZWxbMF0uaWQ7XG4gICAgdmFyICRsYWJlbCA9IHRoaXMuJGVsZW1lbnQuZmluZChgbGFiZWxbZm9yPVwiJHtpZH1cIl1gKTtcblxuICAgIGlmICghJGxhYmVsLmxlbmd0aCkge1xuICAgICAgcmV0dXJuICRlbC5jbG9zZXN0KCdsYWJlbCcpO1xuICAgIH1cblxuICAgIHJldHVybiAkbGFiZWw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzZXQgb2YgbGFiZWxzIGFzc29jaWF0ZWQgd2l0aCBhIHNldCBvZiByYWRpbyBlbHMgaW4gdGhpcyBvcmRlclxuICAgKiAyLiBUaGUgPGxhYmVsPiB3aXRoIHRoZSBhdHRyaWJ1dGUgYFtmb3I9XCJzb21lSW5wdXRJZFwiXWBcbiAgICogMy4gVGhlIGAuY2xvc2VzdCgpYCA8bGFiZWw+XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAkZWwgLSBqUXVlcnkgb2JqZWN0IHRvIGNoZWNrIGZvciByZXF1aXJlZCBhdHRyaWJ1dGVcbiAgICogQHJldHVybnMge0Jvb2xlYW59IEJvb2xlYW4gdmFsdWUgZGVwZW5kcyBvbiB3aGV0aGVyIG9yIG5vdCBhdHRyaWJ1dGUgaXMgY2hlY2tlZCBvciBlbXB0eVxuICAgKi9cbiAgZmluZFJhZGlvTGFiZWxzKCRlbHMpIHtcbiAgICB2YXIgbGFiZWxzID0gJGVscy5tYXAoKGksIGVsKSA9PiB7XG4gICAgICB2YXIgaWQgPSBlbC5pZDtcbiAgICAgIHZhciAkbGFiZWwgPSB0aGlzLiRlbGVtZW50LmZpbmQoYGxhYmVsW2Zvcj1cIiR7aWR9XCJdYCk7XG5cbiAgICAgIGlmICghJGxhYmVsLmxlbmd0aCkge1xuICAgICAgICAkbGFiZWwgPSAkKGVsKS5jbG9zZXN0KCdsYWJlbCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICRsYWJlbFswXTtcbiAgICB9KTtcblxuICAgIHJldHVybiAkKGxhYmVscyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgQ1NTIGVycm9yIGNsYXNzIGFzIHNwZWNpZmllZCBieSB0aGUgQWJpZGUgc2V0dGluZ3MgdG8gdGhlIGxhYmVsLCBpbnB1dCwgYW5kIHRoZSBmb3JtXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAkZWwgLSBqUXVlcnkgb2JqZWN0IHRvIGFkZCB0aGUgY2xhc3MgdG9cbiAgICovXG4gIGFkZEVycm9yQ2xhc3NlcygkZWwpIHtcbiAgICB2YXIgJGxhYmVsID0gdGhpcy5maW5kTGFiZWwoJGVsKTtcbiAgICB2YXIgJGZvcm1FcnJvciA9IHRoaXMuZmluZEZvcm1FcnJvcigkZWwpO1xuXG4gICAgaWYgKCRsYWJlbC5sZW5ndGgpIHtcbiAgICAgICRsYWJlbC5hZGRDbGFzcyh0aGlzLm9wdGlvbnMubGFiZWxFcnJvckNsYXNzKTtcbiAgICB9XG5cbiAgICBpZiAoJGZvcm1FcnJvci5sZW5ndGgpIHtcbiAgICAgICRmb3JtRXJyb3IuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmZvcm1FcnJvckNsYXNzKTtcbiAgICB9XG5cbiAgICAkZWwuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmlucHV0RXJyb3JDbGFzcykuYXR0cignZGF0YS1pbnZhbGlkJywgJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBDU1MgZXJyb3IgY2xhc3NlcyBldGMgZnJvbSBhbiBlbnRpcmUgcmFkaW8gYnV0dG9uIGdyb3VwXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBncm91cE5hbWUgLSBBIHN0cmluZyB0aGF0IHNwZWNpZmllcyB0aGUgbmFtZSBvZiBhIHJhZGlvIGJ1dHRvbiBncm91cFxuICAgKlxuICAgKi9cblxuICByZW1vdmVSYWRpb0Vycm9yQ2xhc3Nlcyhncm91cE5hbWUpIHtcbiAgICB2YXIgJGVscyA9IHRoaXMuJGVsZW1lbnQuZmluZChgOnJhZGlvW25hbWU9XCIke2dyb3VwTmFtZX1cIl1gKTtcbiAgICB2YXIgJGxhYmVscyA9IHRoaXMuZmluZFJhZGlvTGFiZWxzKCRlbHMpO1xuICAgIHZhciAkZm9ybUVycm9ycyA9IHRoaXMuZmluZEZvcm1FcnJvcigkZWxzKTtcblxuICAgIGlmICgkbGFiZWxzLmxlbmd0aCkge1xuICAgICAgJGxhYmVscy5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMubGFiZWxFcnJvckNsYXNzKTtcbiAgICB9XG5cbiAgICBpZiAoJGZvcm1FcnJvcnMubGVuZ3RoKSB7XG4gICAgICAkZm9ybUVycm9ycy5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuZm9ybUVycm9yQ2xhc3MpO1xuICAgIH1cblxuICAgICRlbHMucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmlucHV0RXJyb3JDbGFzcykucmVtb3ZlQXR0cignZGF0YS1pbnZhbGlkJyk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIENTUyBlcnJvciBjbGFzcyBhcyBzcGVjaWZpZWQgYnkgdGhlIEFiaWRlIHNldHRpbmdzIGZyb20gdGhlIGxhYmVsLCBpbnB1dCwgYW5kIHRoZSBmb3JtXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAkZWwgLSBqUXVlcnkgb2JqZWN0IHRvIHJlbW92ZSB0aGUgY2xhc3MgZnJvbVxuICAgKi9cbiAgcmVtb3ZlRXJyb3JDbGFzc2VzKCRlbCkge1xuICAgIC8vIHJhZGlvcyBuZWVkIHRvIGNsZWFyIGFsbCBvZiB0aGUgZWxzXG4gICAgaWYoJGVsWzBdLnR5cGUgPT0gJ3JhZGlvJykge1xuICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlUmFkaW9FcnJvckNsYXNzZXMoJGVsLmF0dHIoJ25hbWUnKSk7XG4gICAgfVxuXG4gICAgdmFyICRsYWJlbCA9IHRoaXMuZmluZExhYmVsKCRlbCk7XG4gICAgdmFyICRmb3JtRXJyb3IgPSB0aGlzLmZpbmRGb3JtRXJyb3IoJGVsKTtcblxuICAgIGlmICgkbGFiZWwubGVuZ3RoKSB7XG4gICAgICAkbGFiZWwucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmxhYmVsRXJyb3JDbGFzcyk7XG4gICAgfVxuXG4gICAgaWYgKCRmb3JtRXJyb3IubGVuZ3RoKSB7XG4gICAgICAkZm9ybUVycm9yLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5mb3JtRXJyb3JDbGFzcyk7XG4gICAgfVxuXG4gICAgJGVsLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5pbnB1dEVycm9yQ2xhc3MpLnJlbW92ZUF0dHIoJ2RhdGEtaW52YWxpZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdvZXMgdGhyb3VnaCBhIGZvcm0gdG8gZmluZCBpbnB1dHMgYW5kIHByb2NlZWRzIHRvIHZhbGlkYXRlIHRoZW0gaW4gd2F5cyBzcGVjaWZpYyB0byB0aGVpciB0eXBlLiBcbiAgICogSWdub3JlcyBpbnB1dHMgd2l0aCBkYXRhLWFiaWRlLWlnbm9yZSwgdHlwZT1cImhpZGRlblwiIG9yIGRpc2FibGVkIGF0dHJpYnV0ZXMgc2V0XG4gICAqIEBmaXJlcyBBYmlkZSNpbnZhbGlkXG4gICAqIEBmaXJlcyBBYmlkZSN2YWxpZFxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCAtIGpRdWVyeSBvYmplY3QgdG8gdmFsaWRhdGUsIHNob3VsZCBiZSBhbiBIVE1MIGlucHV0XG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBnb29kVG9HbyAtIElmIHRoZSBpbnB1dCBpcyB2YWxpZCBvciBub3QuXG4gICAqL1xuICB2YWxpZGF0ZUlucHV0KCRlbCkge1xuICAgIHZhciBjbGVhclJlcXVpcmUgPSB0aGlzLnJlcXVpcmVkQ2hlY2soJGVsKSxcbiAgICAgICAgdmFsaWRhdGVkID0gZmFsc2UsXG4gICAgICAgIGN1c3RvbVZhbGlkYXRvciA9IHRydWUsXG4gICAgICAgIHZhbGlkYXRvciA9ICRlbC5hdHRyKCdkYXRhLXZhbGlkYXRvcicpLFxuICAgICAgICBlcXVhbFRvID0gdHJ1ZTtcblxuICAgIC8vIGRvbid0IHZhbGlkYXRlIGlnbm9yZWQgaW5wdXRzIG9yIGhpZGRlbiBpbnB1dHMgb3IgZGlzYWJsZWQgaW5wdXRzXG4gICAgaWYgKCRlbC5pcygnW2RhdGEtYWJpZGUtaWdub3JlXScpIHx8ICRlbC5pcygnW3R5cGU9XCJoaWRkZW5cIl0nKSB8fCAkZWwuaXMoJ1tkaXNhYmxlZF0nKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgc3dpdGNoICgkZWxbMF0udHlwZSkge1xuICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICB2YWxpZGF0ZWQgPSB0aGlzLnZhbGlkYXRlUmFkaW8oJGVsLmF0dHIoJ25hbWUnKSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdjaGVja2JveCc6XG4gICAgICAgIHZhbGlkYXRlZCA9IGNsZWFyUmVxdWlyZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICBjYXNlICdzZWxlY3Qtb25lJzpcbiAgICAgIGNhc2UgJ3NlbGVjdC1tdWx0aXBsZSc6XG4gICAgICAgIHZhbGlkYXRlZCA9IGNsZWFyUmVxdWlyZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhbGlkYXRlZCA9IHRoaXMudmFsaWRhdGVUZXh0KCRlbCk7XG4gICAgfVxuXG4gICAgaWYgKHZhbGlkYXRvcikge1xuICAgICAgY3VzdG9tVmFsaWRhdG9yID0gdGhpcy5tYXRjaFZhbGlkYXRpb24oJGVsLCB2YWxpZGF0b3IsICRlbC5hdHRyKCdyZXF1aXJlZCcpKTtcbiAgICB9XG5cbiAgICBpZiAoJGVsLmF0dHIoJ2RhdGEtZXF1YWx0bycpKSB7XG4gICAgICBlcXVhbFRvID0gdGhpcy5vcHRpb25zLnZhbGlkYXRvcnMuZXF1YWxUbygkZWwpO1xuICAgIH1cblxuXG4gICAgdmFyIGdvb2RUb0dvID0gW2NsZWFyUmVxdWlyZSwgdmFsaWRhdGVkLCBjdXN0b21WYWxpZGF0b3IsIGVxdWFsVG9dLmluZGV4T2YoZmFsc2UpID09PSAtMTtcbiAgICB2YXIgbWVzc2FnZSA9IChnb29kVG9HbyA/ICd2YWxpZCcgOiAnaW52YWxpZCcpICsgJy56Zi5hYmlkZSc7XG5cbiAgICBpZiAoZ29vZFRvR28pIHtcbiAgICAgIC8vIFJlLXZhbGlkYXRlIGlucHV0cyB0aGF0IGRlcGVuZCBvbiB0aGlzIG9uZSB3aXRoIGVxdWFsdG9cbiAgICAgIGNvbnN0IGRlcGVuZGVudEVsZW1lbnRzID0gdGhpcy4kZWxlbWVudC5maW5kKGBbZGF0YS1lcXVhbHRvPVwiJHskZWwuYXR0cignaWQnKX1cIl1gKTtcbiAgICAgIGlmIChkZXBlbmRlbnRFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcbiAgICAgICAgZGVwZW5kZW50RWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSkge1xuICAgICAgICAgICAgX3RoaXMudmFsaWRhdGVJbnB1dCgkKHRoaXMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXNbZ29vZFRvR28gPyAncmVtb3ZlRXJyb3JDbGFzc2VzJyA6ICdhZGRFcnJvckNsYXNzZXMnXSgkZWwpO1xuXG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiB0aGUgaW5wdXQgaXMgZG9uZSBjaGVja2luZyBmb3IgdmFsaWRhdGlvbi4gRXZlbnQgdHJpZ2dlciBpcyBlaXRoZXIgYHZhbGlkLnpmLmFiaWRlYCBvciBgaW52YWxpZC56Zi5hYmlkZWBcbiAgICAgKiBUcmlnZ2VyIGluY2x1ZGVzIHRoZSBET00gZWxlbWVudCBvZiB0aGUgaW5wdXQuXG4gICAgICogQGV2ZW50IEFiaWRlI3ZhbGlkXG4gICAgICogQGV2ZW50IEFiaWRlI2ludmFsaWRcbiAgICAgKi9cbiAgICAkZWwudHJpZ2dlcihtZXNzYWdlLCBbJGVsXSk7XG5cbiAgICByZXR1cm4gZ29vZFRvR287XG4gIH1cblxuICAvKipcbiAgICogR29lcyB0aHJvdWdoIGEgZm9ybSBhbmQgaWYgdGhlcmUgYXJlIGFueSBpbnZhbGlkIGlucHV0cywgaXQgd2lsbCBkaXNwbGF5IHRoZSBmb3JtIGVycm9yIGVsZW1lbnRcbiAgICogQHJldHVybnMge0Jvb2xlYW59IG5vRXJyb3IgLSB0cnVlIGlmIG5vIGVycm9ycyB3ZXJlIGRldGVjdGVkLi4uXG4gICAqIEBmaXJlcyBBYmlkZSNmb3JtdmFsaWRcbiAgICogQGZpcmVzIEFiaWRlI2Zvcm1pbnZhbGlkXG4gICAqL1xuICB2YWxpZGF0ZUZvcm0oKSB7XG4gICAgdmFyIGFjYyA9IFtdO1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLiRpbnB1dHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGFjYy5wdXNoKF90aGlzLnZhbGlkYXRlSW5wdXQoJCh0aGlzKSkpO1xuICAgIH0pO1xuXG4gICAgdmFyIG5vRXJyb3IgPSBhY2MuaW5kZXhPZihmYWxzZSkgPT09IC0xO1xuXG4gICAgdGhpcy4kZWxlbWVudC5maW5kKCdbZGF0YS1hYmlkZS1lcnJvcl0nKS5jc3MoJ2Rpc3BsYXknLCAobm9FcnJvciA/ICdub25lJyA6ICdibG9jaycpKTtcblxuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gdGhlIGZvcm0gaXMgZmluaXNoZWQgdmFsaWRhdGluZy4gRXZlbnQgdHJpZ2dlciBpcyBlaXRoZXIgYGZvcm12YWxpZC56Zi5hYmlkZWAgb3IgYGZvcm1pbnZhbGlkLnpmLmFiaWRlYC5cbiAgICAgKiBUcmlnZ2VyIGluY2x1ZGVzIHRoZSBlbGVtZW50IG9mIHRoZSBmb3JtLlxuICAgICAqIEBldmVudCBBYmlkZSNmb3JtdmFsaWRcbiAgICAgKiBAZXZlbnQgQWJpZGUjZm9ybWludmFsaWRcbiAgICAgKi9cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoKG5vRXJyb3IgPyAnZm9ybXZhbGlkJyA6ICdmb3JtaW52YWxpZCcpICsgJy56Zi5hYmlkZScsIFt0aGlzLiRlbGVtZW50XSk7XG5cbiAgICByZXR1cm4gbm9FcnJvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgb3IgYSBub3QgYSB0ZXh0IGlucHV0IGlzIHZhbGlkIGJhc2VkIG9uIHRoZSBwYXR0ZXJuIHNwZWNpZmllZCBpbiB0aGUgYXR0cmlidXRlLiBJZiBubyBtYXRjaGluZyBwYXR0ZXJuIGlzIGZvdW5kLCByZXR1cm5zIHRydWUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAkZWwgLSBqUXVlcnkgb2JqZWN0IHRvIHZhbGlkYXRlLCBzaG91bGQgYmUgYSB0ZXh0IGlucHV0IEhUTUwgZWxlbWVudFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0dGVybiAtIHN0cmluZyB2YWx1ZSBvZiBvbmUgb2YgdGhlIFJlZ0V4IHBhdHRlcm5zIGluIEFiaWRlLm9wdGlvbnMucGF0dGVybnNcbiAgICogQHJldHVybnMge0Jvb2xlYW59IEJvb2xlYW4gdmFsdWUgZGVwZW5kcyBvbiB3aGV0aGVyIG9yIG5vdCB0aGUgaW5wdXQgdmFsdWUgbWF0Y2hlcyB0aGUgcGF0dGVybiBzcGVjaWZpZWRcbiAgICovXG4gIHZhbGlkYXRlVGV4dCgkZWwsIHBhdHRlcm4pIHtcbiAgICAvLyBBIHBhdHRlcm4gY2FuIGJlIHBhc3NlZCB0byB0aGlzIGZ1bmN0aW9uLCBvciBpdCB3aWxsIGJlIGluZmVyZWQgZnJvbSB0aGUgaW5wdXQncyBcInBhdHRlcm5cIiBhdHRyaWJ1dGUsIG9yIGl0J3MgXCJ0eXBlXCIgYXR0cmlidXRlXG4gICAgcGF0dGVybiA9IChwYXR0ZXJuIHx8ICRlbC5hdHRyKCdwYXR0ZXJuJykgfHwgJGVsLmF0dHIoJ3R5cGUnKSk7XG4gICAgdmFyIGlucHV0VGV4dCA9ICRlbC52YWwoKTtcbiAgICB2YXIgdmFsaWQgPSBmYWxzZTtcblxuICAgIGlmIChpbnB1dFRleHQubGVuZ3RoKSB7XG4gICAgICAvLyBJZiB0aGUgcGF0dGVybiBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQgaXMgaW4gQWJpZGUncyBsaXN0IG9mIHBhdHRlcm5zLCB0aGVuIHRlc3QgdGhhdCByZWdleHBcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGF0dGVybnMuaGFzT3duUHJvcGVydHkocGF0dGVybikpIHtcbiAgICAgICAgdmFsaWQgPSB0aGlzLm9wdGlvbnMucGF0dGVybnNbcGF0dGVybl0udGVzdChpbnB1dFRleHQpO1xuICAgICAgfVxuICAgICAgLy8gSWYgdGhlIHBhdHRlcm4gbmFtZSBpc24ndCBhbHNvIHRoZSB0eXBlIGF0dHJpYnV0ZSBvZiB0aGUgZmllbGQsIHRoZW4gdGVzdCBpdCBhcyBhIHJlZ2V4cFxuICAgICAgZWxzZSBpZiAocGF0dGVybiAhPT0gJGVsLmF0dHIoJ3R5cGUnKSkge1xuICAgICAgICB2YWxpZCA9IG5ldyBSZWdFeHAocGF0dGVybikudGVzdChpbnB1dFRleHQpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQW4gZW1wdHkgZmllbGQgaXMgdmFsaWQgaWYgaXQncyBub3QgcmVxdWlyZWRcbiAgICBlbHNlIGlmICghJGVsLnByb3AoJ3JlcXVpcmVkJykpIHtcbiAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWQ7XG4gICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBvciBhIG5vdCBhIHJhZGlvIGlucHV0IGlzIHZhbGlkIGJhc2VkIG9uIHdoZXRoZXIgb3Igbm90IGl0IGlzIHJlcXVpcmVkIGFuZCBzZWxlY3RlZC4gQWx0aG91Z2ggdGhlIGZ1bmN0aW9uIHRhcmdldHMgYSBzaW5nbGUgYDxpbnB1dD5gLCBpdCB2YWxpZGF0ZXMgYnkgY2hlY2tpbmcgdGhlIGByZXF1aXJlZGAgYW5kIGBjaGVja2VkYCBwcm9wZXJ0aWVzIG9mIGFsbCByYWRpbyBidXR0b25zIGluIGl0cyBncm91cC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGdyb3VwTmFtZSAtIEEgc3RyaW5nIHRoYXQgc3BlY2lmaWVzIHRoZSBuYW1lIG9mIGEgcmFkaW8gYnV0dG9uIGdyb3VwXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBCb29sZWFuIHZhbHVlIGRlcGVuZHMgb24gd2hldGhlciBvciBub3QgYXQgbGVhc3Qgb25lIHJhZGlvIGlucHV0IGhhcyBiZWVuIHNlbGVjdGVkIChpZiBpdCdzIHJlcXVpcmVkKVxuICAgKi9cbiAgdmFsaWRhdGVSYWRpbyhncm91cE5hbWUpIHtcbiAgICAvLyBJZiBhdCBsZWFzdCBvbmUgcmFkaW8gaW4gdGhlIGdyb3VwIGhhcyB0aGUgYHJlcXVpcmVkYCBhdHRyaWJ1dGUsIHRoZSBncm91cCBpcyBjb25zaWRlcmVkIHJlcXVpcmVkXG4gICAgLy8gUGVyIFczQyBzcGVjLCBhbGwgcmFkaW8gYnV0dG9ucyBpbiBhIGdyb3VwIHNob3VsZCBoYXZlIGByZXF1aXJlZGAsIGJ1dCB3ZSdyZSBiZWluZyBuaWNlXG4gICAgdmFyICRncm91cCA9IHRoaXMuJGVsZW1lbnQuZmluZChgOnJhZGlvW25hbWU9XCIke2dyb3VwTmFtZX1cIl1gKTtcbiAgICB2YXIgdmFsaWQgPSBmYWxzZSwgcmVxdWlyZWQgPSBmYWxzZTtcblxuICAgIC8vIEZvciB0aGUgZ3JvdXAgdG8gYmUgcmVxdWlyZWQsIGF0IGxlYXN0IG9uZSByYWRpbyBuZWVkcyB0byBiZSByZXF1aXJlZFxuICAgICRncm91cC5lYWNoKChpLCBlKSA9PiB7XG4gICAgICBpZiAoJChlKS5hdHRyKCdyZXF1aXJlZCcpKSB7XG4gICAgICAgIHJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZighcmVxdWlyZWQpIHZhbGlkPXRydWU7XG5cbiAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAvLyBGb3IgdGhlIGdyb3VwIHRvIGJlIHZhbGlkLCBhdCBsZWFzdCBvbmUgcmFkaW8gbmVlZHMgdG8gYmUgY2hlY2tlZFxuICAgICAgJGdyb3VwLmVhY2goKGksIGUpID0+IHtcbiAgICAgICAgaWYgKCQoZSkucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHZhbGlkO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgYSBzZWxlY3RlZCBpbnB1dCBwYXNzZXMgYSBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbi4gTXVsdGlwbGUgdmFsaWRhdGlvbnMgY2FuIGJlIHVzZWQsIGlmIHBhc3NlZCB0byB0aGUgZWxlbWVudCB3aXRoIGBkYXRhLXZhbGlkYXRvcj1cImZvbyBiYXIgYmF6XCJgIGluIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3RlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9ICRlbCAtIGpRdWVyeSBpbnB1dCBlbGVtZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsaWRhdG9ycyAtIGEgc3RyaW5nIG9mIGZ1bmN0aW9uIG5hbWVzIG1hdGNoaW5nIGZ1bmN0aW9ucyBpbiB0aGUgQWJpZGUub3B0aW9ucy52YWxpZGF0b3JzIG9iamVjdC5cbiAgICogQHBhcmFtIHtCb29sZWFufSByZXF1aXJlZCAtIHNlbGYgZXhwbGFuYXRvcnk/XG4gICAqIEByZXR1cm5zIHtCb29sZWFufSAtIHRydWUgaWYgdmFsaWRhdGlvbnMgcGFzc2VkLlxuICAgKi9cbiAgbWF0Y2hWYWxpZGF0aW9uKCRlbCwgdmFsaWRhdG9ycywgcmVxdWlyZWQpIHtcbiAgICByZXF1aXJlZCA9IHJlcXVpcmVkID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgdmFyIGNsZWFyID0gdmFsaWRhdG9ycy5zcGxpdCgnICcpLm1hcCgodikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy52YWxpZGF0b3JzW3ZdKCRlbCwgcmVxdWlyZWQsICRlbC5wYXJlbnQoKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNsZWFyLmluZGV4T2YoZmFsc2UpID09PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgZm9ybSBpbnB1dHMgYW5kIHN0eWxlc1xuICAgKiBAZmlyZXMgQWJpZGUjZm9ybXJlc2V0XG4gICAqL1xuICByZXNldEZvcm0oKSB7XG4gICAgdmFyICRmb3JtID0gdGhpcy4kZWxlbWVudCxcbiAgICAgICAgb3B0cyA9IHRoaXMub3B0aW9ucztcblxuICAgICQoYC4ke29wdHMubGFiZWxFcnJvckNsYXNzfWAsICRmb3JtKS5ub3QoJ3NtYWxsJykucmVtb3ZlQ2xhc3Mob3B0cy5sYWJlbEVycm9yQ2xhc3MpO1xuICAgICQoYC4ke29wdHMuaW5wdXRFcnJvckNsYXNzfWAsICRmb3JtKS5ub3QoJ3NtYWxsJykucmVtb3ZlQ2xhc3Mob3B0cy5pbnB1dEVycm9yQ2xhc3MpO1xuICAgICQoYCR7b3B0cy5mb3JtRXJyb3JTZWxlY3Rvcn0uJHtvcHRzLmZvcm1FcnJvckNsYXNzfWApLnJlbW92ZUNsYXNzKG9wdHMuZm9ybUVycm9yQ2xhc3MpO1xuICAgICRmb3JtLmZpbmQoJ1tkYXRhLWFiaWRlLWVycm9yXScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgJCgnOmlucHV0JywgJGZvcm0pLm5vdCgnOmJ1dHRvbiwgOnN1Ym1pdCwgOnJlc2V0LCA6aGlkZGVuLCA6cmFkaW8sIDpjaGVja2JveCwgW2RhdGEtYWJpZGUtaWdub3JlXScpLnZhbCgnJykucmVtb3ZlQXR0cignZGF0YS1pbnZhbGlkJyk7XG4gICAgJCgnOmlucHV0OnJhZGlvJywgJGZvcm0pLm5vdCgnW2RhdGEtYWJpZGUtaWdub3JlXScpLnByb3AoJ2NoZWNrZWQnLGZhbHNlKS5yZW1vdmVBdHRyKCdkYXRhLWludmFsaWQnKTtcbiAgICAkKCc6aW5wdXQ6Y2hlY2tib3gnLCAkZm9ybSkubm90KCdbZGF0YS1hYmlkZS1pZ25vcmVdJykucHJvcCgnY2hlY2tlZCcsZmFsc2UpLnJlbW92ZUF0dHIoJ2RhdGEtaW52YWxpZCcpO1xuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gdGhlIGZvcm0gaGFzIGJlZW4gcmVzZXQuXG4gICAgICogQGV2ZW50IEFiaWRlI2Zvcm1yZXNldFxuICAgICAqL1xuICAgICRmb3JtLnRyaWdnZXIoJ2Zvcm1yZXNldC56Zi5hYmlkZScsIFskZm9ybV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGFuIGluc3RhbmNlIG9mIEFiaWRlLlxuICAgKiBSZW1vdmVzIGVycm9yIHN0eWxlcyBhbmQgY2xhc3NlcyBmcm9tIGVsZW1lbnRzLCB3aXRob3V0IHJlc2V0dGluZyB0aGVpciB2YWx1ZXMuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLm9mZignLmFiaWRlJylcbiAgICAgIC5maW5kKCdbZGF0YS1hYmlkZS1lcnJvcl0nKVxuICAgICAgICAuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgIHRoaXMuJGlucHV0c1xuICAgICAgLm9mZignLmFiaWRlJylcbiAgICAgIC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5yZW1vdmVFcnJvckNsYXNzZXMoJCh0aGlzKSk7XG4gICAgICB9KTtcblxuICAgIEZvdW5kYXRpb24udW5yZWdpc3RlclBsdWdpbih0aGlzKTtcbiAgfVxufVxuXG4vKipcbiAqIERlZmF1bHQgc2V0dGluZ3MgZm9yIHBsdWdpblxuICovXG5BYmlkZS5kZWZhdWx0cyA9IHtcbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGV2ZW50IHRvIHZhbGlkYXRlIGlucHV0cy4gQ2hlY2tib3hlcyBhbmQgcmFkaW9zIHZhbGlkYXRlIGltbWVkaWF0ZWx5LlxuICAgKiBSZW1vdmUgb3IgY2hhbmdlIHRoaXMgdmFsdWUgZm9yIG1hbnVhbCB2YWxpZGF0aW9uLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHs/c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZmllbGRDaGFuZ2UnXG4gICAqL1xuICB2YWxpZGF0ZU9uOiAnZmllbGRDaGFuZ2UnLFxuXG4gIC8qKlxuICAgKiBDbGFzcyB0byBiZSBhcHBsaWVkIHRvIGlucHV0IGxhYmVscyBvbiBmYWlsZWQgdmFsaWRhdGlvbi5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnaXMtaW52YWxpZC1sYWJlbCdcbiAgICovXG4gIGxhYmVsRXJyb3JDbGFzczogJ2lzLWludmFsaWQtbGFiZWwnLFxuXG4gIC8qKlxuICAgKiBDbGFzcyB0byBiZSBhcHBsaWVkIHRvIGlucHV0cyBvbiBmYWlsZWQgdmFsaWRhdGlvbi5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnaXMtaW52YWxpZC1pbnB1dCdcbiAgICovXG4gIGlucHV0RXJyb3JDbGFzczogJ2lzLWludmFsaWQtaW5wdXQnLFxuXG4gIC8qKlxuICAgKiBDbGFzcyBzZWxlY3RvciB0byB1c2UgdG8gdGFyZ2V0IEZvcm0gRXJyb3JzIGZvciBzaG93L2hpZGUuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJy5mb3JtLWVycm9yJ1xuICAgKi9cbiAgZm9ybUVycm9yU2VsZWN0b3I6ICcuZm9ybS1lcnJvcicsXG5cbiAgLyoqXG4gICAqIENsYXNzIGFkZGVkIHRvIEZvcm0gRXJyb3JzIG9uIGZhaWxlZCB2YWxpZGF0aW9uLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdpcy12aXNpYmxlJ1xuICAgKi9cbiAgZm9ybUVycm9yQ2xhc3M6ICdpcy12aXNpYmxlJyxcblxuICAvKipcbiAgICogU2V0IHRvIHRydWUgdG8gdmFsaWRhdGUgdGV4dCBpbnB1dHMgb24gYW55IHZhbHVlIGNoYW5nZS5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGxpdmVWYWxpZGF0ZTogZmFsc2UsXG5cbiAgLyoqXG4gICAqIFNldCB0byB0cnVlIHRvIHZhbGlkYXRlIGlucHV0cyBvbiBibHVyLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgdmFsaWRhdGVPbkJsdXI6IGZhbHNlLFxuXG4gIHBhdHRlcm5zOiB7XG4gICAgYWxwaGEgOiAvXlthLXpBLVpdKyQvLFxuICAgIGFscGhhX251bWVyaWMgOiAvXlthLXpBLVowLTldKyQvLFxuICAgIGludGVnZXIgOiAvXlstK10/XFxkKyQvLFxuICAgIG51bWJlciA6IC9eWy0rXT9cXGQqKD86W1xcLlxcLF1cXGQrKT8kLyxcblxuICAgIC8vIGFtZXgsIHZpc2EsIGRpbmVyc1xuICAgIGNhcmQgOiAvXig/OjRbMC05XXsxMn0oPzpbMC05XXszfSk/fDVbMS01XVswLTldezE0fXw2KD86MDExfDVbMC05XVswLTldKVswLTldezEyfXwzWzQ3XVswLTldezEzfXwzKD86MFswLTVdfFs2OF1bMC05XSlbMC05XXsxMX18KD86MjEzMXwxODAwfDM1XFxkezN9KVxcZHsxMX0pJC8sXG4gICAgY3Z2IDogL14oWzAtOV0pezMsNH0kLyxcblxuICAgIC8vIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL3N0YXRlcy1vZi10aGUtdHlwZS1hdHRyaWJ1dGUuaHRtbCN2YWxpZC1lLW1haWwtYWRkcmVzc1xuICAgIGVtYWlsIDogL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykrJC8sXG5cbiAgICB1cmwgOiAvXihodHRwcz98ZnRwfGZpbGV8c3NoKTpcXC9cXC8oKCgoW2EtekEtWl18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KCVbXFxkYS1mXXsyfSl8WyFcXCQmJ1xcKFxcKVxcKlxcKyw7PV18OikqQCk/KCgoXFxkfFsxLTldXFxkfDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNV0pXFwuKFxcZHxbMS05XVxcZHwxXFxkXFxkfDJbMC00XVxcZHwyNVswLTVdKVxcLihcXGR8WzEtOV1cXGR8MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC01XSlcXC4oXFxkfFsxLTldXFxkfDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNV0pKXwoKChbYS16QS1aXXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCgoW2EtekEtWl18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16QS1aXXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2EtekEtWl18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpXFwuKSsoKFthLXpBLVpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpBLVpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16QS1aXXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2EtekEtWl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSlcXC4/KSg6XFxkKik/KShcXC8oKChbYS16QS1aXXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoJVtcXGRhLWZdezJ9KXxbIVxcJCYnXFwoXFwpXFwqXFwrLDs9XXw6fEApKyhcXC8oKFthLXpBLVpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCglW1xcZGEtZl17Mn0pfFshXFwkJidcXChcXClcXCpcXCssOz1dfDp8QCkqKSopPyk/KFxcPygoKFthLXpBLVpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCglW1xcZGEtZl17Mn0pfFshXFwkJidcXChcXClcXCpcXCssOz1dfDp8QCl8W1xcdUUwMDAtXFx1RjhGRl18XFwvfFxcPykqKT8oXFwjKCgoW2EtekEtWl18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KCVbXFxkYS1mXXsyfSl8WyFcXCQmJ1xcKFxcKVxcKlxcKyw7PV18OnxAKXxcXC98XFw/KSopPyQvLFxuICAgIC8vIGFiYy5kZVxuICAgIGRvbWFpbiA6IC9eKFthLXpBLVowLTldKFthLXpBLVowLTlcXC1dezAsNjF9W2EtekEtWjAtOV0pP1xcLikrW2EtekEtWl17Miw4fSQvLFxuXG4gICAgZGF0ZXRpbWUgOiAvXihbMC0yXVswLTldezN9KVxcLShbMC0xXVswLTldKVxcLShbMC0zXVswLTldKVQoWzAtNV1bMC05XSlcXDooWzAtNV1bMC05XSlcXDooWzAtNV1bMC05XSkoWnwoW1xcLVxcK10oWzAtMV1bMC05XSlcXDowMCkpJC8sXG4gICAgLy8gWVlZWS1NTS1ERFxuICAgIGRhdGUgOiAvKD86MTl8MjApWzAtOV17Mn0tKD86KD86MFsxLTldfDFbMC0yXSktKD86MFsxLTldfDFbMC05XXwyWzAtOV0pfCg/Oig/ITAyKSg/OjBbMS05XXwxWzAtMl0pLSg/OjMwKSl8KD86KD86MFsxMzU3OF18MVswMl0pLTMxKSkkLyxcbiAgICAvLyBISDpNTTpTU1xuICAgIHRpbWUgOiAvXigwWzAtOV18MVswLTldfDJbMC0zXSkoOlswLTVdWzAtOV0pezJ9JC8sXG4gICAgZGF0ZUlTTyA6IC9eXFxkezR9W1xcL1xcLV1cXGR7MSwyfVtcXC9cXC1dXFxkezEsMn0kLyxcbiAgICAvLyBNTS9ERC9ZWVlZXG4gICAgbW9udGhfZGF5X3llYXIgOiAvXigwWzEtOV18MVswMTJdKVstIFxcLy5dKDBbMS05XXxbMTJdWzAtOV18M1swMV0pWy0gXFwvLl1cXGR7NH0kLyxcbiAgICAvLyBERC9NTS9ZWVlZXG4gICAgZGF5X21vbnRoX3llYXIgOiAvXigwWzEtOV18WzEyXVswLTldfDNbMDFdKVstIFxcLy5dKDBbMS05XXwxWzAxMl0pWy0gXFwvLl1cXGR7NH0kLyxcblxuICAgIC8vICNGRkYgb3IgI0ZGRkZGRlxuICAgIGNvbG9yIDogL14jPyhbYS1mQS1GMC05XXs2fXxbYS1mQS1GMC05XXszfSkkL1xuICB9LFxuXG4gIC8qKlxuICAgKiBPcHRpb25hbCB2YWxpZGF0aW9uIGZ1bmN0aW9ucyB0byBiZSB1c2VkLiBgZXF1YWxUb2AgYmVpbmcgdGhlIG9ubHkgZGVmYXVsdCBpbmNsdWRlZCBmdW5jdGlvbi5cbiAgICogRnVuY3Rpb25zIHNob3VsZCByZXR1cm4gb25seSBhIGJvb2xlYW4gaWYgdGhlIGlucHV0IGlzIHZhbGlkIG9yIG5vdC4gRnVuY3Rpb25zIGFyZSBnaXZlbiB0aGUgZm9sbG93aW5nIGFyZ3VtZW50czpcbiAgICogZWwgOiBUaGUgalF1ZXJ5IGVsZW1lbnQgdG8gdmFsaWRhdGUuXG4gICAqIHJlcXVpcmVkIDogQm9vbGVhbiB2YWx1ZSBvZiB0aGUgcmVxdWlyZWQgYXR0cmlidXRlIGJlIHByZXNlbnQgb3Igbm90LlxuICAgKiBwYXJlbnQgOiBUaGUgZGlyZWN0IHBhcmVudCBvZiB0aGUgaW5wdXQuXG4gICAqIEBvcHRpb25cbiAgICovXG4gIHZhbGlkYXRvcnM6IHtcbiAgICBlcXVhbFRvOiBmdW5jdGlvbiAoZWwsIHJlcXVpcmVkLCBwYXJlbnQpIHtcbiAgICAgIHJldHVybiAkKGAjJHtlbC5hdHRyKCdkYXRhLWVxdWFsdG8nKX1gKS52YWwoKSA9PT0gZWwudmFsKCk7XG4gICAgfVxuICB9XG59XG5cbi8vIFdpbmRvdyBleHBvcnRzXG5Gb3VuZGF0aW9uLnBsdWdpbihBYmlkZSwgJ0FiaWRlJyk7XG5cbn0oalF1ZXJ5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuLyoqXG4gKiBBY2NvcmRpb24gbW9kdWxlLlxuICogQG1vZHVsZSBmb3VuZGF0aW9uLmFjY29yZGlvblxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5rZXlib2FyZFxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5tb3Rpb25cbiAqL1xuXG5jbGFzcyBBY2NvcmRpb24ge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBhbiBhY2NvcmRpb24uXG4gICAqIEBjbGFzc1xuICAgKiBAZmlyZXMgQWNjb3JkaW9uI2luaXRcbiAgICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnQgLSBqUXVlcnkgb2JqZWN0IHRvIG1ha2UgaW50byBhbiBhY2NvcmRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gYSBwbGFpbiBvYmplY3Qgd2l0aCBzZXR0aW5ncyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBBY2NvcmRpb24uZGVmYXVsdHMsIHRoaXMuJGVsZW1lbnQuZGF0YSgpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2luaXQoKTtcblxuICAgIEZvdW5kYXRpb24ucmVnaXN0ZXJQbHVnaW4odGhpcywgJ0FjY29yZGlvbicpO1xuICAgIEZvdW5kYXRpb24uS2V5Ym9hcmQucmVnaXN0ZXIoJ0FjY29yZGlvbicsIHtcbiAgICAgICdFTlRFUic6ICd0b2dnbGUnLFxuICAgICAgJ1NQQUNFJzogJ3RvZ2dsZScsXG4gICAgICAnQVJST1dfRE9XTic6ICduZXh0JyxcbiAgICAgICdBUlJPV19VUCc6ICdwcmV2aW91cydcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgYWNjb3JkaW9uIGJ5IGFuaW1hdGluZyB0aGUgcHJlc2V0IGFjdGl2ZSBwYW5lKHMpLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXQoKSB7XG4gICAgdGhpcy4kZWxlbWVudC5hdHRyKCdyb2xlJywgJ3RhYmxpc3QnKTtcbiAgICB0aGlzLiR0YWJzID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbignW2RhdGEtYWNjb3JkaW9uLWl0ZW1dJyk7XG5cbiAgICB0aGlzLiR0YWJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbCkge1xuICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICRjb250ZW50ID0gJGVsLmNoaWxkcmVuKCdbZGF0YS10YWItY29udGVudF0nKSxcbiAgICAgICAgICBpZCA9ICRjb250ZW50WzBdLmlkIHx8IEZvdW5kYXRpb24uR2V0WW9EaWdpdHMoNiwgJ2FjY29yZGlvbicpLFxuICAgICAgICAgIGxpbmtJZCA9IGVsLmlkIHx8IGAke2lkfS1sYWJlbGA7XG5cbiAgICAgICRlbC5maW5kKCdhOmZpcnN0JykuYXR0cih7XG4gICAgICAgICdhcmlhLWNvbnRyb2xzJzogaWQsXG4gICAgICAgICdyb2xlJzogJ3RhYicsXG4gICAgICAgICdpZCc6IGxpbmtJZCxcbiAgICAgICAgJ2FyaWEtZXhwYW5kZWQnOiBmYWxzZSxcbiAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICAgICRjb250ZW50LmF0dHIoeydyb2xlJzogJ3RhYnBhbmVsJywgJ2FyaWEtbGFiZWxsZWRieSc6IGxpbmtJZCwgJ2FyaWEtaGlkZGVuJzogdHJ1ZSwgJ2lkJzogaWR9KTtcbiAgICB9KTtcbiAgICB2YXIgJGluaXRBY3RpdmUgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5pcy1hY3RpdmUnKS5jaGlsZHJlbignW2RhdGEtdGFiLWNvbnRlbnRdJyk7XG4gICAgaWYoJGluaXRBY3RpdmUubGVuZ3RoKXtcbiAgICAgIHRoaXMuZG93bigkaW5pdEFjdGl2ZSwgdHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuX2V2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgZXZlbnQgaGFuZGxlcnMgZm9yIGl0ZW1zIHdpdGhpbiB0aGUgYWNjb3JkaW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V2ZW50cygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy4kdGFicy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRlbGVtID0gJCh0aGlzKTtcbiAgICAgIHZhciAkdGFiQ29udGVudCA9ICRlbGVtLmNoaWxkcmVuKCdbZGF0YS10YWItY29udGVudF0nKTtcbiAgICAgIGlmICgkdGFiQ29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgJGVsZW0uY2hpbGRyZW4oJ2EnKS5vZmYoJ2NsaWNrLnpmLmFjY29yZGlvbiBrZXlkb3duLnpmLmFjY29yZGlvbicpXG4gICAgICAgICAgICAgICAub24oJ2NsaWNrLnpmLmFjY29yZGlvbicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgX3RoaXMudG9nZ2xlKCR0YWJDb250ZW50KTtcbiAgICAgICAgfSkub24oJ2tleWRvd24uemYuYWNjb3JkaW9uJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgRm91bmRhdGlvbi5LZXlib2FyZC5oYW5kbGVLZXkoZSwgJ0FjY29yZGlvbicsIHtcbiAgICAgICAgICAgIHRvZ2dsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgkdGFiQ29udGVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciAkYSA9ICRlbGVtLm5leHQoKS5maW5kKCdhJykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgaWYgKCFfdGhpcy5vcHRpb25zLm11bHRpRXhwYW5kKSB7XG4gICAgICAgICAgICAgICAgJGEudHJpZ2dlcignY2xpY2suemYuYWNjb3JkaW9uJylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByZXZpb3VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyICRhID0gJGVsZW0ucHJldigpLmZpbmQoJ2EnKS5mb2N1cygpO1xuICAgICAgICAgICAgICBpZiAoIV90aGlzLm9wdGlvbnMubXVsdGlFeHBhbmQpIHtcbiAgICAgICAgICAgICAgICAkYS50cmlnZ2VyKCdjbGljay56Zi5hY2NvcmRpb24nKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFuZGxlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgc2VsZWN0ZWQgY29udGVudCBwYW5lJ3Mgb3Blbi9jbG9zZSBzdGF0ZS5cbiAgICogQHBhcmFtIHtqUXVlcnl9ICR0YXJnZXQgLSBqUXVlcnkgb2JqZWN0IG9mIHRoZSBwYW5lIHRvIHRvZ2dsZSAoYC5hY2NvcmRpb24tY29udGVudGApLlxuICAgKiBAZnVuY3Rpb25cbiAgICovXG4gIHRvZ2dsZSgkdGFyZ2V0KSB7XG4gICAgaWYoJHRhcmdldC5wYXJlbnQoKS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgIHRoaXMudXAoJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG93bigkdGFyZ2V0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIGFjY29yZGlvbiB0YWIgZGVmaW5lZCBieSBgJHRhcmdldGAuXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGFyZ2V0IC0gQWNjb3JkaW9uIHBhbmUgdG8gb3BlbiAoYC5hY2NvcmRpb24tY29udGVudGApLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGZpcnN0VGltZSAtIGZsYWcgdG8gZGV0ZXJtaW5lIGlmIHJlZmxvdyBzaG91bGQgaGFwcGVuLlxuICAgKiBAZmlyZXMgQWNjb3JkaW9uI2Rvd25cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBkb3duKCR0YXJnZXQsIGZpcnN0VGltZSkge1xuICAgICR0YXJnZXRcbiAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsIGZhbHNlKVxuICAgICAgLnBhcmVudCgnW2RhdGEtdGFiLWNvbnRlbnRdJylcbiAgICAgIC5hZGRCYWNrKClcbiAgICAgIC5wYXJlbnQoKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5tdWx0aUV4cGFuZCAmJiAhZmlyc3RUaW1lKSB7XG4gICAgICB2YXIgJGN1cnJlbnRBY3RpdmUgPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCcuaXMtYWN0aXZlJykuY2hpbGRyZW4oJ1tkYXRhLXRhYi1jb250ZW50XScpO1xuICAgICAgaWYgKCRjdXJyZW50QWN0aXZlLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnVwKCRjdXJyZW50QWN0aXZlLm5vdCgkdGFyZ2V0KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJHRhcmdldC5zbGlkZURvd24odGhpcy5vcHRpb25zLnNsaWRlU3BlZWQsICgpID0+IHtcbiAgICAgIC8qKlxuICAgICAgICogRmlyZXMgd2hlbiB0aGUgdGFiIGlzIGRvbmUgb3BlbmluZy5cbiAgICAgICAqIEBldmVudCBBY2NvcmRpb24jZG93blxuICAgICAgICovXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2Rvd24uemYuYWNjb3JkaW9uJywgWyR0YXJnZXRdKTtcbiAgICB9KTtcblxuICAgICQoYCMkeyR0YXJnZXQuYXR0cignYXJpYS1sYWJlbGxlZGJ5Jyl9YCkuYXR0cih7XG4gICAgICAnYXJpYS1leHBhbmRlZCc6IHRydWUsXG4gICAgICAnYXJpYS1zZWxlY3RlZCc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIHRhYiBkZWZpbmVkIGJ5IGAkdGFyZ2V0YC5cbiAgICogQHBhcmFtIHtqUXVlcnl9ICR0YXJnZXQgLSBBY2NvcmRpb24gdGFiIHRvIGNsb3NlIChgLmFjY29yZGlvbi1jb250ZW50YCkuXG4gICAqIEBmaXJlcyBBY2NvcmRpb24jdXBcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICB1cCgkdGFyZ2V0KSB7XG4gICAgdmFyICRhdW50cyA9ICR0YXJnZXQucGFyZW50KCkuc2libGluZ3MoKSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYoKCF0aGlzLm9wdGlvbnMuYWxsb3dBbGxDbG9zZWQgJiYgISRhdW50cy5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHx8ICEkdGFyZ2V0LnBhcmVudCgpLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZvdW5kYXRpb24uTW92ZSh0aGlzLm9wdGlvbnMuc2xpZGVTcGVlZCwgJHRhcmdldCwgZnVuY3Rpb24oKXtcbiAgICAgICR0YXJnZXQuc2xpZGVVcChfdGhpcy5vcHRpb25zLnNsaWRlU3BlZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpcmVzIHdoZW4gdGhlIHRhYiBpcyBkb25lIGNvbGxhcHNpbmcgdXAuXG4gICAgICAgICAqIEBldmVudCBBY2NvcmRpb24jdXBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3VwLnpmLmFjY29yZGlvbicsIFskdGFyZ2V0XSk7XG4gICAgICB9KTtcbiAgICAvLyB9KTtcblxuICAgICR0YXJnZXQuYXR0cignYXJpYS1oaWRkZW4nLCB0cnVlKVxuICAgICAgICAgICAucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG4gICAgJChgIyR7JHRhcmdldC5hdHRyKCdhcmlhLWxhYmVsbGVkYnknKX1gKS5hdHRyKHtcbiAgICAgJ2FyaWEtZXhwYW5kZWQnOiBmYWxzZSxcbiAgICAgJ2FyaWEtc2VsZWN0ZWQnOiBmYWxzZVxuICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgYW4gaW5zdGFuY2Ugb2YgYW4gYWNjb3JkaW9uLlxuICAgKiBAZmlyZXMgQWNjb3JkaW9uI2Rlc3Ryb3llZFxuICAgKiBAZnVuY3Rpb25cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kZWxlbWVudC5maW5kKCdbZGF0YS10YWItY29udGVudF0nKS5zdG9wKHRydWUpLnNsaWRlVXAoMCkuY3NzKCdkaXNwbGF5JywgJycpO1xuICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnYScpLm9mZignLnpmLmFjY29yZGlvbicpO1xuXG4gICAgRm91bmRhdGlvbi51bnJlZ2lzdGVyUGx1Z2luKHRoaXMpO1xuICB9XG59XG5cbkFjY29yZGlvbi5kZWZhdWx0cyA9IHtcbiAgLyoqXG4gICAqIEFtb3VudCBvZiB0aW1lIHRvIGFuaW1hdGUgdGhlIG9wZW5pbmcgb2YgYW4gYWNjb3JkaW9uIHBhbmUuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQGRlZmF1bHQgMjUwXG4gICAqL1xuICBzbGlkZVNwZWVkOiAyNTAsXG4gIC8qKlxuICAgKiBBbGxvdyB0aGUgYWNjb3JkaW9uIHRvIGhhdmUgbXVsdGlwbGUgb3BlbiBwYW5lcy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIG11bHRpRXhwYW5kOiBmYWxzZSxcbiAgLyoqXG4gICAqIEFsbG93IHRoZSBhY2NvcmRpb24gdG8gY2xvc2UgYWxsIHBhbmVzLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgYWxsb3dBbGxDbG9zZWQ6IGZhbHNlXG59O1xuXG4vLyBXaW5kb3cgZXhwb3J0c1xuRm91bmRhdGlvbi5wbHVnaW4oQWNjb3JkaW9uLCAnQWNjb3JkaW9uJyk7XG5cbn0oalF1ZXJ5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuLyoqXG4gKiBBY2NvcmRpb25NZW51IG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi5hY2NvcmRpb25NZW51XG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLmtleWJvYXJkXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLm1vdGlvblxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5uZXN0XG4gKi9cblxuY2xhc3MgQWNjb3JkaW9uTWVudSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGFuIGFjY29yZGlvbiBtZW51LlxuICAgKiBAY2xhc3NcbiAgICogQGZpcmVzIEFjY29yZGlvbk1lbnUjaW5pdFxuICAgKiBAcGFyYW0ge2pRdWVyeX0gZWxlbWVudCAtIGpRdWVyeSBvYmplY3QgdG8gbWFrZSBpbnRvIGFuIGFjY29yZGlvbiBtZW51LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlcyB0byB0aGUgZGVmYXVsdCBwbHVnaW4gc2V0dGluZ3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIEFjY29yZGlvbk1lbnUuZGVmYXVsdHMsIHRoaXMuJGVsZW1lbnQuZGF0YSgpLCBvcHRpb25zKTtcblxuICAgIEZvdW5kYXRpb24uTmVzdC5GZWF0aGVyKHRoaXMuJGVsZW1lbnQsICdhY2NvcmRpb24nKTtcblxuICAgIHRoaXMuX2luaXQoKTtcblxuICAgIEZvdW5kYXRpb24ucmVnaXN0ZXJQbHVnaW4odGhpcywgJ0FjY29yZGlvbk1lbnUnKTtcbiAgICBGb3VuZGF0aW9uLktleWJvYXJkLnJlZ2lzdGVyKCdBY2NvcmRpb25NZW51Jywge1xuICAgICAgJ0VOVEVSJzogJ3RvZ2dsZScsXG4gICAgICAnU1BBQ0UnOiAndG9nZ2xlJyxcbiAgICAgICdBUlJPV19SSUdIVCc6ICdvcGVuJyxcbiAgICAgICdBUlJPV19VUCc6ICd1cCcsXG4gICAgICAnQVJST1dfRE9XTic6ICdkb3duJyxcbiAgICAgICdBUlJPV19MRUZUJzogJ2Nsb3NlJyxcbiAgICAgICdFU0NBUEUnOiAnY2xvc2VBbGwnXG4gICAgfSk7XG4gIH1cblxuXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBhY2NvcmRpb24gbWVudSBieSBoaWRpbmcgYWxsIG5lc3RlZCBtZW51cy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0KCkge1xuICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnW2RhdGEtc3VibWVudV0nKS5ub3QoJy5pcy1hY3RpdmUnKS5zbGlkZVVwKDApOy8vLmZpbmQoJ2EnKS5jc3MoJ3BhZGRpbmctbGVmdCcsICcxcmVtJyk7XG4gICAgdGhpcy4kZWxlbWVudC5hdHRyKHtcbiAgICAgICdyb2xlJzogJ21lbnUnLFxuICAgICAgJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJzogdGhpcy5vcHRpb25zLm11bHRpT3BlblxuICAgIH0pO1xuXG4gICAgdGhpcy4kbWVudUxpbmtzID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXMtYWNjb3JkaW9uLXN1Ym1lbnUtcGFyZW50Jyk7XG4gICAgdGhpcy4kbWVudUxpbmtzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgIHZhciBsaW5rSWQgPSB0aGlzLmlkIHx8IEZvdW5kYXRpb24uR2V0WW9EaWdpdHMoNiwgJ2FjYy1tZW51LWxpbmsnKSxcbiAgICAgICAgICAkZWxlbSA9ICQodGhpcyksXG4gICAgICAgICAgJHN1YiA9ICRlbGVtLmNoaWxkcmVuKCdbZGF0YS1zdWJtZW51XScpLFxuICAgICAgICAgIHN1YklkID0gJHN1YlswXS5pZCB8fCBGb3VuZGF0aW9uLkdldFlvRGlnaXRzKDYsICdhY2MtbWVudScpLFxuICAgICAgICAgIGlzQWN0aXZlID0gJHN1Yi5oYXNDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAkZWxlbS5hdHRyKHtcbiAgICAgICAgJ2FyaWEtY29udHJvbHMnOiBzdWJJZCxcbiAgICAgICAgJ2FyaWEtZXhwYW5kZWQnOiBpc0FjdGl2ZSxcbiAgICAgICAgJ3JvbGUnOiAnbWVudWl0ZW0nLFxuICAgICAgICAnaWQnOiBsaW5rSWRcbiAgICAgIH0pO1xuICAgICAgJHN1Yi5hdHRyKHtcbiAgICAgICAgJ2FyaWEtbGFiZWxsZWRieSc6IGxpbmtJZCxcbiAgICAgICAgJ2FyaWEtaGlkZGVuJzogIWlzQWN0aXZlLFxuICAgICAgICAncm9sZSc6ICdtZW51JyxcbiAgICAgICAgJ2lkJzogc3ViSWRcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHZhciBpbml0UGFuZXMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5pcy1hY3RpdmUnKTtcbiAgICBpZihpbml0UGFuZXMubGVuZ3RoKXtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICBpbml0UGFuZXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICBfdGhpcy5kb3duKCQodGhpcykpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuX2V2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgZXZlbnQgaGFuZGxlcnMgZm9yIGl0ZW1zIHdpdGhpbiB0aGUgbWVudS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ldmVudHMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnbGknKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICRzdWJtZW51ID0gJCh0aGlzKS5jaGlsZHJlbignW2RhdGEtc3VibWVudV0nKTtcblxuICAgICAgaWYgKCRzdWJtZW51Lmxlbmd0aCkge1xuICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKCdhJykub2ZmKCdjbGljay56Zi5hY2NvcmRpb25NZW51Jykub24oJ2NsaWNrLnpmLmFjY29yZGlvbk1lbnUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgX3RoaXMudG9nZ2xlKCRzdWJtZW51KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSkub24oJ2tleWRvd24uemYuYWNjb3JkaW9ubWVudScsIGZ1bmN0aW9uKGUpe1xuICAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKSxcbiAgICAgICAgICAkZWxlbWVudHMgPSAkZWxlbWVudC5wYXJlbnQoJ3VsJykuY2hpbGRyZW4oJ2xpJyksXG4gICAgICAgICAgJHByZXZFbGVtZW50LFxuICAgICAgICAgICRuZXh0RWxlbWVudCxcbiAgICAgICAgICAkdGFyZ2V0ID0gJGVsZW1lbnQuY2hpbGRyZW4oJ1tkYXRhLXN1Ym1lbnVdJyk7XG5cbiAgICAgICRlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgaWYgKCQodGhpcykuaXMoJGVsZW1lbnQpKSB7XG4gICAgICAgICAgJHByZXZFbGVtZW50ID0gJGVsZW1lbnRzLmVxKE1hdGgubWF4KDAsIGktMSkpLmZpbmQoJ2EnKS5maXJzdCgpO1xuICAgICAgICAgICRuZXh0RWxlbWVudCA9ICRlbGVtZW50cy5lcShNYXRoLm1pbihpKzEsICRlbGVtZW50cy5sZW5ndGgtMSkpLmZpbmQoJ2EnKS5maXJzdCgpO1xuXG4gICAgICAgICAgaWYgKCQodGhpcykuY2hpbGRyZW4oJ1tkYXRhLXN1Ym1lbnVdOnZpc2libGUnKS5sZW5ndGgpIHsgLy8gaGFzIG9wZW4gc3ViIG1lbnVcbiAgICAgICAgICAgICRuZXh0RWxlbWVudCA9ICRlbGVtZW50LmZpbmQoJ2xpOmZpcnN0LWNoaWxkJykuZmluZCgnYScpLmZpcnN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgkKHRoaXMpLmlzKCc6Zmlyc3QtY2hpbGQnKSkgeyAvLyBpcyBmaXJzdCBlbGVtZW50IG9mIHN1YiBtZW51XG4gICAgICAgICAgICAkcHJldkVsZW1lbnQgPSAkZWxlbWVudC5wYXJlbnRzKCdsaScpLmZpcnN0KCkuZmluZCgnYScpLmZpcnN0KCk7XG4gICAgICAgICAgfSBlbHNlIGlmICgkcHJldkVsZW1lbnQucGFyZW50cygnbGknKS5maXJzdCgpLmNoaWxkcmVuKCdbZGF0YS1zdWJtZW51XTp2aXNpYmxlJykubGVuZ3RoKSB7IC8vIGlmIHByZXZpb3VzIGVsZW1lbnQgaGFzIG9wZW4gc3ViIG1lbnVcbiAgICAgICAgICAgICRwcmV2RWxlbWVudCA9ICRwcmV2RWxlbWVudC5wYXJlbnRzKCdsaScpLmZpbmQoJ2xpOmxhc3QtY2hpbGQnKS5maW5kKCdhJykuZmlyc3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCQodGhpcykuaXMoJzpsYXN0LWNoaWxkJykpIHsgLy8gaXMgbGFzdCBlbGVtZW50IG9mIHN1YiBtZW51XG4gICAgICAgICAgICAkbmV4dEVsZW1lbnQgPSAkZWxlbWVudC5wYXJlbnRzKCdsaScpLmZpcnN0KCkubmV4dCgnbGknKS5maW5kKCdhJykuZmlyc3QoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBGb3VuZGF0aW9uLktleWJvYXJkLmhhbmRsZUtleShlLCAnQWNjb3JkaW9uTWVudScsIHtcbiAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCR0YXJnZXQuaXMoJzpoaWRkZW4nKSkge1xuICAgICAgICAgICAgX3RoaXMuZG93bigkdGFyZ2V0KTtcbiAgICAgICAgICAgICR0YXJnZXQuZmluZCgnbGknKS5maXJzdCgpLmZpbmQoJ2EnKS5maXJzdCgpLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCR0YXJnZXQubGVuZ3RoICYmICEkdGFyZ2V0LmlzKCc6aGlkZGVuJykpIHsgLy8gY2xvc2UgYWN0aXZlIHN1YiBvZiB0aGlzIGl0ZW1cbiAgICAgICAgICAgIF90aGlzLnVwKCR0YXJnZXQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQucGFyZW50KCdbZGF0YS1zdWJtZW51XScpLmxlbmd0aCkgeyAvLyBjbG9zZSBjdXJyZW50bHkgb3BlbiBzdWJcbiAgICAgICAgICAgIF90aGlzLnVwKCRlbGVtZW50LnBhcmVudCgnW2RhdGEtc3VibWVudV0nKSk7XG4gICAgICAgICAgICAkZWxlbWVudC5wYXJlbnRzKCdsaScpLmZpcnN0KCkuZmluZCgnYScpLmZpcnN0KCkuZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkcHJldkVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJG5leHRFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIHRvZ2dsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCRlbGVtZW50LmNoaWxkcmVuKCdbZGF0YS1zdWJtZW51XScpLmxlbmd0aCkge1xuICAgICAgICAgICAgX3RoaXMudG9nZ2xlKCRlbGVtZW50LmNoaWxkcmVuKCdbZGF0YS1zdWJtZW51XScpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBfdGhpcy5oaWRlQWxsKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZWQ6IGZ1bmN0aW9uKHByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgaWYgKHByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pOy8vLmF0dHIoJ3RhYmluZGV4JywgMCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIGFsbCBwYW5lcyBvZiB0aGUgbWVudS5cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBoaWRlQWxsKCkge1xuICAgIHRoaXMudXAodGhpcy4kZWxlbWVudC5maW5kKCdbZGF0YS1zdWJtZW51XScpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhbGwgcGFuZXMgb2YgdGhlIG1lbnUuXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgc2hvd0FsbCgpIHtcbiAgICB0aGlzLmRvd24odGhpcy4kZWxlbWVudC5maW5kKCdbZGF0YS1zdWJtZW51XScpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBvcGVuL2Nsb3NlIHN0YXRlIG9mIGEgc3VibWVudS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGFyZ2V0IC0gdGhlIHN1Ym1lbnUgdG8gdG9nZ2xlXG4gICAqL1xuICB0b2dnbGUoJHRhcmdldCl7XG4gICAgaWYoISR0YXJnZXQuaXMoJzphbmltYXRlZCcpKSB7XG4gICAgICBpZiAoISR0YXJnZXQuaXMoJzpoaWRkZW4nKSkge1xuICAgICAgICB0aGlzLnVwKCR0YXJnZXQpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuZG93bigkdGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIHN1Yi1tZW51IGRlZmluZWQgYnkgYCR0YXJnZXRgLlxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRhcmdldCAtIFN1Yi1tZW51IHRvIG9wZW4uXG4gICAqIEBmaXJlcyBBY2NvcmRpb25NZW51I2Rvd25cbiAgICovXG4gIGRvd24oJHRhcmdldCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZighdGhpcy5vcHRpb25zLm11bHRpT3Blbikge1xuICAgICAgdGhpcy51cCh0aGlzLiRlbGVtZW50LmZpbmQoJy5pcy1hY3RpdmUnKS5ub3QoJHRhcmdldC5wYXJlbnRzVW50aWwodGhpcy4kZWxlbWVudCkuYWRkKCR0YXJnZXQpKSk7XG4gICAgfVxuXG4gICAgJHRhcmdldC5hZGRDbGFzcygnaXMtYWN0aXZlJykuYXR0cih7J2FyaWEtaGlkZGVuJzogZmFsc2V9KVxuICAgICAgLnBhcmVudCgnLmlzLWFjY29yZGlvbi1zdWJtZW51LXBhcmVudCcpLmF0dHIoeydhcmlhLWV4cGFuZGVkJzogdHJ1ZX0pO1xuXG4gICAgICAvL0ZvdW5kYXRpb24uTW92ZSh0aGlzLm9wdGlvbnMuc2xpZGVTcGVlZCwgJHRhcmdldCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICR0YXJnZXQuc2xpZGVEb3duKF90aGlzLm9wdGlvbnMuc2xpZGVTcGVlZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEZpcmVzIHdoZW4gdGhlIG1lbnUgaXMgZG9uZSBvcGVuaW5nLlxuICAgICAgICAgICAqIEBldmVudCBBY2NvcmRpb25NZW51I2Rvd25cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBfdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdkb3duLnpmLmFjY29yZGlvbk1lbnUnLCBbJHRhcmdldF0pO1xuICAgICAgICB9KTtcbiAgICAgIC8vfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBzdWItbWVudSBkZWZpbmVkIGJ5IGAkdGFyZ2V0YC4gQWxsIHN1Yi1tZW51cyBpbnNpZGUgdGhlIHRhcmdldCB3aWxsIGJlIGNsb3NlZCBhcyB3ZWxsLlxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRhcmdldCAtIFN1Yi1tZW51IHRvIGNsb3NlLlxuICAgKiBAZmlyZXMgQWNjb3JkaW9uTWVudSN1cFxuICAgKi9cbiAgdXAoJHRhcmdldCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgLy9Gb3VuZGF0aW9uLk1vdmUodGhpcy5vcHRpb25zLnNsaWRlU3BlZWQsICR0YXJnZXQsIGZ1bmN0aW9uKCl7XG4gICAgICAkdGFyZ2V0LnNsaWRlVXAoX3RoaXMub3B0aW9ucy5zbGlkZVNwZWVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaXJlcyB3aGVuIHRoZSBtZW51IGlzIGRvbmUgY29sbGFwc2luZyB1cC5cbiAgICAgICAgICogQGV2ZW50IEFjY29yZGlvbk1lbnUjdXBcbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3VwLnpmLmFjY29yZGlvbk1lbnUnLCBbJHRhcmdldF0pO1xuICAgICAgfSk7XG4gICAgLy99KTtcblxuICAgIHZhciAkbWVudXMgPSAkdGFyZ2V0LmZpbmQoJ1tkYXRhLXN1Ym1lbnVdJykuc2xpZGVVcCgwKS5hZGRCYWNrKCkuYXR0cignYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICAgICRtZW51cy5wYXJlbnQoJy5pcy1hY2NvcmRpb24tc3VibWVudS1wYXJlbnQnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGFuIGluc3RhbmNlIG9mIGFjY29yZGlvbiBtZW51LlxuICAgKiBAZmlyZXMgQWNjb3JkaW9uTWVudSNkZXN0cm95ZWRcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kZWxlbWVudC5maW5kKCdbZGF0YS1zdWJtZW51XScpLnNsaWRlRG93bigwKS5jc3MoJ2Rpc3BsYXknLCAnJyk7XG4gICAgdGhpcy4kZWxlbWVudC5maW5kKCdhJykub2ZmKCdjbGljay56Zi5hY2NvcmRpb25NZW51Jyk7XG5cbiAgICBGb3VuZGF0aW9uLk5lc3QuQnVybih0aGlzLiRlbGVtZW50LCAnYWNjb3JkaW9uJyk7XG4gICAgRm91bmRhdGlvbi51bnJlZ2lzdGVyUGx1Z2luKHRoaXMpO1xuICB9XG59XG5cbkFjY29yZGlvbk1lbnUuZGVmYXVsdHMgPSB7XG4gIC8qKlxuICAgKiBBbW91bnQgb2YgdGltZSB0byBhbmltYXRlIHRoZSBvcGVuaW5nIG9mIGEgc3VibWVudSBpbiBtcy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAyNTBcbiAgICovXG4gIHNsaWRlU3BlZWQ6IDI1MCxcbiAgLyoqXG4gICAqIEFsbG93IHRoZSBtZW51IHRvIGhhdmUgbXVsdGlwbGUgb3BlbiBwYW5lcy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgbXVsdGlPcGVuOiB0cnVlXG59O1xuXG4vLyBXaW5kb3cgZXhwb3J0c1xuRm91bmRhdGlvbi5wbHVnaW4oQWNjb3JkaW9uTWVudSwgJ0FjY29yZGlvbk1lbnUnKTtcblxufShqUXVlcnkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4hZnVuY3Rpb24oJCkge1xuXG4vKipcbiAqIERyaWxsZG93biBtb2R1bGUuXG4gKiBAbW9kdWxlIGZvdW5kYXRpb24uZHJpbGxkb3duXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLmtleWJvYXJkXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLm1vdGlvblxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5uZXN0XG4gKi9cblxuY2xhc3MgRHJpbGxkb3duIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgYSBkcmlsbGRvd24gbWVudS5cbiAgICogQGNsYXNzXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSBlbGVtZW50IC0galF1ZXJ5IG9iamVjdCB0byBtYWtlIGludG8gYW4gYWNjb3JkaW9uIG1lbnUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGVzIHRvIHRoZSBkZWZhdWx0IHBsdWdpbiBzZXR0aW5ncy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgRHJpbGxkb3duLmRlZmF1bHRzLCB0aGlzLiRlbGVtZW50LmRhdGEoKSwgb3B0aW9ucyk7XG5cbiAgICBGb3VuZGF0aW9uLk5lc3QuRmVhdGhlcih0aGlzLiRlbGVtZW50LCAnZHJpbGxkb3duJyk7XG5cbiAgICB0aGlzLl9pbml0KCk7XG5cbiAgICBGb3VuZGF0aW9uLnJlZ2lzdGVyUGx1Z2luKHRoaXMsICdEcmlsbGRvd24nKTtcbiAgICBGb3VuZGF0aW9uLktleWJvYXJkLnJlZ2lzdGVyKCdEcmlsbGRvd24nLCB7XG4gICAgICAnRU5URVInOiAnb3BlbicsXG4gICAgICAnU1BBQ0UnOiAnb3BlbicsXG4gICAgICAnQVJST1dfUklHSFQnOiAnbmV4dCcsXG4gICAgICAnQVJST1dfVVAnOiAndXAnLFxuICAgICAgJ0FSUk9XX0RPV04nOiAnZG93bicsXG4gICAgICAnQVJST1dfTEVGVCc6ICdwcmV2aW91cycsXG4gICAgICAnRVNDQVBFJzogJ2Nsb3NlJyxcbiAgICAgICdUQUInOiAnZG93bicsXG4gICAgICAnU0hJRlRfVEFCJzogJ3VwJ1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBkcmlsbGRvd24gYnkgY3JlYXRpbmcgalF1ZXJ5IGNvbGxlY3Rpb25zIG9mIGVsZW1lbnRzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdCgpIHtcbiAgICB0aGlzLiRzdWJtZW51QW5jaG9ycyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnbGkuaXMtZHJpbGxkb3duLXN1Ym1lbnUtcGFyZW50JykuY2hpbGRyZW4oJ2EnKTtcbiAgICB0aGlzLiRzdWJtZW51cyA9IHRoaXMuJHN1Ym1lbnVBbmNob3JzLnBhcmVudCgnbGknKS5jaGlsZHJlbignW2RhdGEtc3VibWVudV0nKTtcbiAgICB0aGlzLiRtZW51SXRlbXMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ2xpJykubm90KCcuanMtZHJpbGxkb3duLWJhY2snKS5hdHRyKCdyb2xlJywgJ21lbnVpdGVtJykuZmluZCgnYScpO1xuICAgIHRoaXMuJGVsZW1lbnQuYXR0cignZGF0YS1tdXRhdGUnLCAodGhpcy4kZWxlbWVudC5hdHRyKCdkYXRhLWRyaWxsZG93bicpIHx8IEZvdW5kYXRpb24uR2V0WW9EaWdpdHMoNiwgJ2RyaWxsZG93bicpKSk7XG5cbiAgICB0aGlzLl9wcmVwYXJlTWVudSgpO1xuICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnRzKCk7XG5cbiAgICB0aGlzLl9rZXlib2FyZEV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIHByZXBhcmVzIGRyaWxsZG93biBtZW51IGJ5IHNldHRpbmcgYXR0cmlidXRlcyB0byBsaW5rcyBhbmQgZWxlbWVudHNcbiAgICogc2V0cyBhIG1pbiBoZWlnaHQgdG8gcHJldmVudCBjb250ZW50IGp1bXBpbmdcbiAgICogd3JhcHMgdGhlIGVsZW1lbnQgaWYgbm90IGFscmVhZHkgd3JhcHBlZFxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG4gIF9wcmVwYXJlTWVudSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIC8vIGlmKCF0aGlzLm9wdGlvbnMuaG9sZE9wZW4pe1xuICAgIC8vICAgdGhpcy5fbWVudUxpbmtFdmVudHMoKTtcbiAgICAvLyB9XG4gICAgdGhpcy4kc3VibWVudUFuY2hvcnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgdmFyICRsaW5rID0gJCh0aGlzKTtcbiAgICAgIHZhciAkc3ViID0gJGxpbmsucGFyZW50KCk7XG4gICAgICBpZihfdGhpcy5vcHRpb25zLnBhcmVudExpbmspe1xuICAgICAgICAkbGluay5jbG9uZSgpLnByZXBlbmRUbygkc3ViLmNoaWxkcmVuKCdbZGF0YS1zdWJtZW51XScpKS53cmFwKCc8bGkgY2xhc3M9XCJpcy1zdWJtZW51LXBhcmVudC1pdGVtIGlzLXN1Ym1lbnUtaXRlbSBpcy1kcmlsbGRvd24tc3VibWVudS1pdGVtXCIgcm9sZT1cIm1lbnUtaXRlbVwiPjwvbGk+Jyk7XG4gICAgICB9XG4gICAgICAkbGluay5kYXRhKCdzYXZlZEhyZWYnLCAkbGluay5hdHRyKCdocmVmJykpLnJlbW92ZUF0dHIoJ2hyZWYnKS5hdHRyKCd0YWJpbmRleCcsIDApO1xuICAgICAgJGxpbmsuY2hpbGRyZW4oJ1tkYXRhLXN1Ym1lbnVdJylcbiAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiB0cnVlLFxuICAgICAgICAgICAgJ3RhYmluZGV4JzogMCxcbiAgICAgICAgICAgICdyb2xlJzogJ21lbnUnXG4gICAgICAgICAgfSk7XG4gICAgICBfdGhpcy5fZXZlbnRzKCRsaW5rKTtcbiAgICB9KTtcbiAgICB0aGlzLiRzdWJtZW51cy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgJG1lbnUgPSAkKHRoaXMpLFxuICAgICAgICAgICRiYWNrID0gJG1lbnUuZmluZCgnLmpzLWRyaWxsZG93bi1iYWNrJyk7XG4gICAgICBpZighJGJhY2subGVuZ3RoKXtcbiAgICAgICAgc3dpdGNoIChfdGhpcy5vcHRpb25zLmJhY2tCdXR0b25Qb3NpdGlvbikge1xuICAgICAgICAgIGNhc2UgXCJib3R0b21cIjpcbiAgICAgICAgICAgICRtZW51LmFwcGVuZChfdGhpcy5vcHRpb25zLmJhY2tCdXR0b24pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInRvcFwiOlxuICAgICAgICAgICAgJG1lbnUucHJlcGVuZChfdGhpcy5vcHRpb25zLmJhY2tCdXR0b24pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbnN1cHBvcnRlZCBiYWNrQnV0dG9uUG9zaXRpb24gdmFsdWUgJ1wiICsgX3RoaXMub3B0aW9ucy5iYWNrQnV0dG9uUG9zaXRpb24gKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF90aGlzLl9iYWNrKCRtZW51KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHN1Ym1lbnVzLmFkZENsYXNzKCdpbnZpc2libGUnKTtcbiAgICBpZighdGhpcy5vcHRpb25zLmF1dG9IZWlnaHQpIHtcbiAgICAgIHRoaXMuJHN1Ym1lbnVzLmFkZENsYXNzKCdkcmlsbGRvd24tc3VibWVudS1jb3Zlci1wcmV2aW91cycpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBhIHdyYXBwZXIgb24gZWxlbWVudCBpZiBpdCBkb2Vzbid0IGV4aXN0LlxuICAgIGlmKCF0aGlzLiRlbGVtZW50LnBhcmVudCgpLmhhc0NsYXNzKCdpcy1kcmlsbGRvd24nKSl7XG4gICAgICB0aGlzLiR3cmFwcGVyID0gJCh0aGlzLm9wdGlvbnMud3JhcHBlcikuYWRkQ2xhc3MoJ2lzLWRyaWxsZG93bicpO1xuICAgICAgaWYodGhpcy5vcHRpb25zLmFuaW1hdGVIZWlnaHQpIHRoaXMuJHdyYXBwZXIuYWRkQ2xhc3MoJ2FuaW1hdGUtaGVpZ2h0Jyk7XG4gICAgICB0aGlzLiRlbGVtZW50LndyYXAodGhpcy4kd3JhcHBlcik7XG4gICAgfVxuICAgIC8vIHNldCB3cmFwcGVyXG4gICAgdGhpcy4kd3JhcHBlciA9IHRoaXMuJGVsZW1lbnQucGFyZW50KCk7XG4gICAgdGhpcy4kd3JhcHBlci5jc3ModGhpcy5fZ2V0TWF4RGltcygpKTtcbiAgfVxuXG4gIF9yZXNpemUoKSB7XG4gICAgdGhpcy4kd3JhcHBlci5jc3MoeydtYXgtd2lkdGgnOiAnbm9uZScsICdtaW4taGVpZ2h0JzogJ25vbmUnfSk7XG4gICAgLy8gX2dldE1heERpbXMgaGFzIHNpZGUgZWZmZWN0cyAoYm9vKSBidXQgY2FsbGluZyBpdCBzaG91bGQgdXBkYXRlIGFsbCBvdGhlciBuZWNlc3NhcnkgaGVpZ2h0cyAmIHdpZHRoc1xuICAgIHRoaXMuJHdyYXBwZXIuY3NzKHRoaXMuX2dldE1heERpbXMoKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBldmVudCBoYW5kbGVycyB0byBlbGVtZW50cyBpbiB0aGUgbWVudS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbSAtIHRoZSBjdXJyZW50IG1lbnUgaXRlbSB0byBhZGQgaGFuZGxlcnMgdG8uXG4gICAqL1xuICBfZXZlbnRzKCRlbGVtKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICRlbGVtLm9mZignY2xpY2suemYuZHJpbGxkb3duJylcbiAgICAub24oJ2NsaWNrLnpmLmRyaWxsZG93bicsIGZ1bmN0aW9uKGUpe1xuICAgICAgaWYoJChlLnRhcmdldCkucGFyZW50c1VudGlsKCd1bCcsICdsaScpLmhhc0NsYXNzKCdpcy1kcmlsbGRvd24tc3VibWVudS1wYXJlbnQnKSl7XG4gICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgLy8gaWYoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldC5maXJzdEVsZW1lbnRDaGlsZCl7XG4gICAgICAvLyAgIHJldHVybiBmYWxzZTtcbiAgICAgIC8vIH1cbiAgICAgIF90aGlzLl9zaG93KCRlbGVtLnBhcmVudCgnbGknKSk7XG5cbiAgICAgIGlmKF90aGlzLm9wdGlvbnMuY2xvc2VPbkNsaWNrKXtcbiAgICAgICAgdmFyICRib2R5ID0gJCgnYm9keScpO1xuICAgICAgICAkYm9keS5vZmYoJy56Zi5kcmlsbGRvd24nKS5vbignY2xpY2suemYuZHJpbGxkb3duJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBfdGhpcy4kZWxlbWVudFswXSB8fCAkLmNvbnRhaW5zKF90aGlzLiRlbGVtZW50WzBdLCBlLnRhcmdldCkpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIF90aGlzLl9oaWRlQWxsKCk7XG4gICAgICAgICAgJGJvZHkub2ZmKCcuemYuZHJpbGxkb3duJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXHQgIHRoaXMuJGVsZW1lbnQub24oJ211dGF0ZW1lLnpmLnRyaWdnZXInLCB0aGlzLl9yZXNpemUuYmluZCh0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBldmVudCBoYW5kbGVycyB0byB0aGUgbWVudSBlbGVtZW50LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZWdpc3RlckV2ZW50cygpIHtcbiAgICBpZih0aGlzLm9wdGlvbnMuc2Nyb2xsVG9wKXtcbiAgICAgIHRoaXMuX2JpbmRIYW5kbGVyID0gdGhpcy5fc2Nyb2xsVG9wLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdvcGVuLnpmLmRyaWxsZG93biBoaWRlLnpmLmRyaWxsZG93biBjbG9zZWQuemYuZHJpbGxkb3duJyx0aGlzLl9iaW5kSGFuZGxlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNjcm9sbCB0byBUb3Agb2YgRWxlbWVudCBvciBkYXRhLXNjcm9sbC10b3AtZWxlbWVudFxuICAgKiBAZnVuY3Rpb25cbiAgICogQGZpcmVzIERyaWxsZG93biNzY3JvbGxtZVxuICAgKi9cbiAgX3Njcm9sbFRvcCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciAkc2Nyb2xsVG9wRWxlbWVudCA9IF90aGlzLm9wdGlvbnMuc2Nyb2xsVG9wRWxlbWVudCE9Jyc/JChfdGhpcy5vcHRpb25zLnNjcm9sbFRvcEVsZW1lbnQpOl90aGlzLiRlbGVtZW50LFxuICAgICAgICBzY3JvbGxQb3MgPSBwYXJzZUludCgkc2Nyb2xsVG9wRWxlbWVudC5vZmZzZXQoKS50b3ArX3RoaXMub3B0aW9ucy5zY3JvbGxUb3BPZmZzZXQpO1xuICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKHRydWUpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IHNjcm9sbFBvcyB9LCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uLCBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbkVhc2luZyxmdW5jdGlvbigpe1xuICAgICAgLyoqXG4gICAgICAgICogRmlyZXMgYWZ0ZXIgdGhlIG1lbnUgaGFzIHNjcm9sbGVkXG4gICAgICAgICogQGV2ZW50IERyaWxsZG93biNzY3JvbGxtZVxuICAgICAgICAqL1xuICAgICAgaWYodGhpcz09PSQoJ2h0bWwnKVswXSlfdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdzY3JvbGxtZS56Zi5kcmlsbGRvd24nKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGtleWRvd24gZXZlbnQgbGlzdGVuZXIgdG8gYGxpYCdzIGluIHRoZSBtZW51LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2tleWJvYXJkRXZlbnRzKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLiRtZW51SXRlbXMuYWRkKHRoaXMuJGVsZW1lbnQuZmluZCgnLmpzLWRyaWxsZG93bi1iYWNrID4gYSwgLmlzLXN1Ym1lbnUtcGFyZW50LWl0ZW0gPiBhJykpLm9uKCdrZXlkb3duLnpmLmRyaWxsZG93bicsIGZ1bmN0aW9uKGUpe1xuICAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKSxcbiAgICAgICAgICAkZWxlbWVudHMgPSAkZWxlbWVudC5wYXJlbnQoJ2xpJykucGFyZW50KCd1bCcpLmNoaWxkcmVuKCdsaScpLmNoaWxkcmVuKCdhJyksXG4gICAgICAgICAgJHByZXZFbGVtZW50LFxuICAgICAgICAgICRuZXh0RWxlbWVudDtcblxuICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICBpZiAoJCh0aGlzKS5pcygkZWxlbWVudCkpIHtcbiAgICAgICAgICAkcHJldkVsZW1lbnQgPSAkZWxlbWVudHMuZXEoTWF0aC5tYXgoMCwgaS0xKSk7XG4gICAgICAgICAgJG5leHRFbGVtZW50ID0gJGVsZW1lbnRzLmVxKE1hdGgubWluKGkrMSwgJGVsZW1lbnRzLmxlbmd0aC0xKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgRm91bmRhdGlvbi5LZXlib2FyZC5oYW5kbGVLZXkoZSwgJ0RyaWxsZG93bicsIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCRlbGVtZW50LmlzKF90aGlzLiRzdWJtZW51QW5jaG9ycykpIHtcbiAgICAgICAgICAgIF90aGlzLl9zaG93KCRlbGVtZW50LnBhcmVudCgnbGknKSk7XG4gICAgICAgICAgICAkZWxlbWVudC5wYXJlbnQoJ2xpJykub25lKEZvdW5kYXRpb24udHJhbnNpdGlvbmVuZCgkZWxlbWVudCksIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICRlbGVtZW50LnBhcmVudCgnbGknKS5maW5kKCd1bCBsaSBhJykuZmlsdGVyKF90aGlzLiRtZW51SXRlbXMpLmZpcnN0KCkuZm9jdXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwcmV2aW91czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgX3RoaXMuX2hpZGUoJGVsZW1lbnQucGFyZW50KCdsaScpLnBhcmVudCgndWwnKSk7XG4gICAgICAgICAgJGVsZW1lbnQucGFyZW50KCdsaScpLnBhcmVudCgndWwnKS5vbmUoRm91bmRhdGlvbi50cmFuc2l0aW9uZW5kKCRlbGVtZW50KSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICRlbGVtZW50LnBhcmVudCgnbGknKS5wYXJlbnQoJ3VsJykucGFyZW50KCdsaScpLmNoaWxkcmVuKCdhJykuZmlyc3QoKS5mb2N1cygpO1xuICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkcHJldkVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAvLyBEb24ndCB0YXAgZm9jdXMgb24gZmlyc3QgZWxlbWVudCBpbiByb290IHVsXG4gICAgICAgICAgcmV0dXJuICEkZWxlbWVudC5pcyhfdGhpcy4kZWxlbWVudC5maW5kKCc+IGxpOmZpcnN0LWNoaWxkID4gYScpKTtcbiAgICAgICAgfSxcbiAgICAgICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJG5leHRFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgLy8gRG9uJ3QgdGFwIGZvY3VzIG9uIGxhc3QgZWxlbWVudCBpbiByb290IHVsXG4gICAgICAgICAgcmV0dXJuICEkZWxlbWVudC5pcyhfdGhpcy4kZWxlbWVudC5maW5kKCc+IGxpOmxhc3QtY2hpbGQgPiBhJykpO1xuICAgICAgICB9LFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgY2xvc2Ugb24gZWxlbWVudCBpbiByb290IHVsXG4gICAgICAgICAgaWYgKCEkZWxlbWVudC5pcyhfdGhpcy4kZWxlbWVudC5maW5kKCc+IGxpID4gYScpKSkge1xuICAgICAgICAgICAgX3RoaXMuX2hpZGUoJGVsZW1lbnQucGFyZW50KCkucGFyZW50KCkpO1xuICAgICAgICAgICAgJGVsZW1lbnQucGFyZW50KCkucGFyZW50KCkuc2libGluZ3MoJ2EnKS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCEkZWxlbWVudC5pcyhfdGhpcy4kbWVudUl0ZW1zKSkgeyAvLyBub3QgbWVudSBpdGVtIG1lYW5zIGJhY2sgYnV0dG9uXG4gICAgICAgICAgICBfdGhpcy5faGlkZSgkZWxlbWVudC5wYXJlbnQoJ2xpJykucGFyZW50KCd1bCcpKTtcbiAgICAgICAgICAgICRlbGVtZW50LnBhcmVudCgnbGknKS5wYXJlbnQoJ3VsJykub25lKEZvdW5kYXRpb24udHJhbnNpdGlvbmVuZCgkZWxlbWVudCksIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQucGFyZW50KCdsaScpLnBhcmVudCgndWwnKS5wYXJlbnQoJ2xpJykuY2hpbGRyZW4oJ2EnKS5maXJzdCgpLmZvY3VzKCk7XG4gICAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmlzKF90aGlzLiRzdWJtZW51QW5jaG9ycykpIHtcbiAgICAgICAgICAgIF90aGlzLl9zaG93KCRlbGVtZW50LnBhcmVudCgnbGknKSk7XG4gICAgICAgICAgICAkZWxlbWVudC5wYXJlbnQoJ2xpJykub25lKEZvdW5kYXRpb24udHJhbnNpdGlvbmVuZCgkZWxlbWVudCksIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICRlbGVtZW50LnBhcmVudCgnbGknKS5maW5kKCd1bCBsaSBhJykuZmlsdGVyKF90aGlzLiRtZW51SXRlbXMpLmZpcnN0KCkuZm9jdXMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBoYW5kbGVkOiBmdW5jdGlvbihwcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgIGlmIChwcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTsgLy8gZW5kIGtleWJvYXJkQWNjZXNzXG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIGFsbCBvcGVuIGVsZW1lbnRzLCBhbmQgcmV0dXJucyB0byByb290IG1lbnUuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAZmlyZXMgRHJpbGxkb3duI2Nsb3NlZFxuICAgKi9cbiAgX2hpZGVBbGwoKSB7XG4gICAgdmFyICRlbGVtID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXMtZHJpbGxkb3duLXN1Ym1lbnUuaXMtYWN0aXZlJykuYWRkQ2xhc3MoJ2lzLWNsb3NpbmcnKTtcbiAgICBpZih0aGlzLm9wdGlvbnMuYXV0b0hlaWdodCkgdGhpcy4kd3JhcHBlci5jc3Moe2hlaWdodDokZWxlbS5wYXJlbnQoKS5jbG9zZXN0KCd1bCcpLmRhdGEoJ2NhbGNIZWlnaHQnKX0pO1xuICAgICRlbGVtLm9uZShGb3VuZGF0aW9uLnRyYW5zaXRpb25lbmQoJGVsZW0pLCBmdW5jdGlvbihlKXtcbiAgICAgICRlbGVtLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUgaXMtY2xvc2luZycpO1xuICAgIH0pO1xuICAgICAgICAvKipcbiAgICAgICAgICogRmlyZXMgd2hlbiB0aGUgbWVudSBpcyBmdWxseSBjbG9zZWQuXG4gICAgICAgICAqIEBldmVudCBEcmlsbGRvd24jY2xvc2VkXG4gICAgICAgICAqL1xuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2xvc2VkLnpmLmRyaWxsZG93bicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgZXZlbnQgbGlzdGVuZXIgZm9yIGVhY2ggYGJhY2tgIGJ1dHRvbiwgYW5kIGNsb3NlcyBvcGVuIG1lbnVzLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQGZpcmVzIERyaWxsZG93biNiYWNrXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkZWxlbSAtIHRoZSBjdXJyZW50IHN1Yi1tZW51IHRvIGFkZCBgYmFja2AgZXZlbnQuXG4gICAqL1xuICBfYmFjaygkZWxlbSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgJGVsZW0ub2ZmKCdjbGljay56Zi5kcmlsbGRvd24nKTtcbiAgICAkZWxlbS5jaGlsZHJlbignLmpzLWRyaWxsZG93bi1iYWNrJylcbiAgICAgIC5vbignY2xpY2suemYuZHJpbGxkb3duJywgZnVuY3Rpb24oZSl7XG4gICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtb3VzZXVwIG9uIGJhY2snKTtcbiAgICAgICAgX3RoaXMuX2hpZGUoJGVsZW0pO1xuXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGEgcGFyZW50IHN1Ym1lbnUsIGNhbGwgc2hvd1xuICAgICAgICBsZXQgcGFyZW50U3ViTWVudSA9ICRlbGVtLnBhcmVudCgnbGknKS5wYXJlbnQoJ3VsJykucGFyZW50KCdsaScpO1xuICAgICAgICBpZiAocGFyZW50U3ViTWVudS5sZW5ndGgpIHtcbiAgICAgICAgICBfdGhpcy5fc2hvdyhwYXJlbnRTdWJNZW51KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBldmVudCBsaXN0ZW5lciB0byBtZW51IGl0ZW1zIHcvbyBzdWJtZW51cyB0byBjbG9zZSBvcGVuIG1lbnVzIG9uIGNsaWNrLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9tZW51TGlua0V2ZW50cygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHRoaXMuJG1lbnVJdGVtcy5ub3QoJy5pcy1kcmlsbGRvd24tc3VibWVudS1wYXJlbnQnKVxuICAgICAgICAub2ZmKCdjbGljay56Zi5kcmlsbGRvd24nKVxuICAgICAgICAub24oJ2NsaWNrLnpmLmRyaWxsZG93bicsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIC8vIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgX3RoaXMuX2hpZGVBbGwoKTtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgc3VibWVudS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBmaXJlcyBEcmlsbGRvd24jb3BlblxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJGVsZW0gLSB0aGUgY3VycmVudCBlbGVtZW50IHdpdGggYSBzdWJtZW51IHRvIG9wZW4sIGkuZS4gdGhlIGBsaWAgdGFnLlxuICAgKi9cbiAgX3Nob3coJGVsZW0pIHtcbiAgICBpZih0aGlzLm9wdGlvbnMuYXV0b0hlaWdodCkgdGhpcy4kd3JhcHBlci5jc3Moe2hlaWdodDokZWxlbS5jaGlsZHJlbignW2RhdGEtc3VibWVudV0nKS5kYXRhKCdjYWxjSGVpZ2h0Jyl9KTtcbiAgICAkZWxlbS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XG4gICAgJGVsZW0uY2hpbGRyZW4oJ1tkYXRhLXN1Ym1lbnVdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpbnZpc2libGUnKS5hdHRyKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIHRoZSBzdWJtZW51IGhhcyBvcGVuZWQuXG4gICAgICogQGV2ZW50IERyaWxsZG93biNvcGVuXG4gICAgICovXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdvcGVuLnpmLmRyaWxsZG93bicsIFskZWxlbV0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIaWRlcyBhIHN1Ym1lbnVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBmaXJlcyBEcmlsbGRvd24jaGlkZVxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJGVsZW0gLSB0aGUgY3VycmVudCBzdWItbWVudSB0byBoaWRlLCBpLmUuIHRoZSBgdWxgIHRhZy5cbiAgICovXG4gIF9oaWRlKCRlbGVtKSB7XG4gICAgaWYodGhpcy5vcHRpb25zLmF1dG9IZWlnaHQpIHRoaXMuJHdyYXBwZXIuY3NzKHtoZWlnaHQ6JGVsZW0ucGFyZW50KCkuY2xvc2VzdCgndWwnKS5kYXRhKCdjYWxjSGVpZ2h0Jyl9KTtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICRlbGVtLnBhcmVudCgnbGknKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuICAgICRlbGVtLmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSkuYWRkQ2xhc3MoJ2lzLWNsb3NpbmcnKVxuICAgICRlbGVtLmFkZENsYXNzKCdpcy1jbG9zaW5nJylcbiAgICAgICAgIC5vbmUoRm91bmRhdGlvbi50cmFuc2l0aW9uZW5kKCRlbGVtKSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgJGVsZW0ucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZSBpcy1jbG9zaW5nJyk7XG4gICAgICAgICAgICRlbGVtLmJsdXIoKS5hZGRDbGFzcygnaW52aXNpYmxlJyk7XG4gICAgICAgICB9KTtcbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIHRoZSBzdWJtZW51IGhhcyBjbG9zZWQuXG4gICAgICogQGV2ZW50IERyaWxsZG93biNoaWRlXG4gICAgICovXG4gICAgJGVsZW0udHJpZ2dlcignaGlkZS56Zi5kcmlsbGRvd24nLCBbJGVsZW1dKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyB0aHJvdWdoIHRoZSBuZXN0ZWQgbWVudXMgdG8gY2FsY3VsYXRlIHRoZSBtaW4taGVpZ2h0LCBhbmQgbWF4LXdpZHRoIGZvciB0aGUgbWVudS5cbiAgICogUHJldmVudHMgY29udGVudCBqdW1waW5nLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9nZXRNYXhEaW1zKCkge1xuICAgIHZhciAgbWF4SGVpZ2h0ID0gMCwgcmVzdWx0ID0ge30sIF90aGlzID0gdGhpcztcbiAgICB0aGlzLiRzdWJtZW51cy5hZGQodGhpcy4kZWxlbWVudCkuZWFjaChmdW5jdGlvbigpe1xuICAgICAgdmFyIG51bU9mRWxlbXMgPSAkKHRoaXMpLmNoaWxkcmVuKCdsaScpLmxlbmd0aDtcbiAgICAgIHZhciBoZWlnaHQgPSBGb3VuZGF0aW9uLkJveC5HZXREaW1lbnNpb25zKHRoaXMpLmhlaWdodDtcbiAgICAgIG1heEhlaWdodCA9IGhlaWdodCA+IG1heEhlaWdodCA/IGhlaWdodCA6IG1heEhlaWdodDtcbiAgICAgIGlmKF90aGlzLm9wdGlvbnMuYXV0b0hlaWdodCkge1xuICAgICAgICAkKHRoaXMpLmRhdGEoJ2NhbGNIZWlnaHQnLGhlaWdodCk7XG4gICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygnaXMtZHJpbGxkb3duLXN1Ym1lbnUnKSkgcmVzdWx0WydoZWlnaHQnXSA9IGhlaWdodDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmKCF0aGlzLm9wdGlvbnMuYXV0b0hlaWdodCkgcmVzdWx0WydtaW4taGVpZ2h0J10gPSBgJHttYXhIZWlnaHR9cHhgO1xuXG4gICAgcmVzdWx0WydtYXgtd2lkdGgnXSA9IGAke3RoaXMuJGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGh9cHhgO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyB0aGUgRHJpbGxkb3duIE1lbnVcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIGlmKHRoaXMub3B0aW9ucy5zY3JvbGxUb3ApIHRoaXMuJGVsZW1lbnQub2ZmKCcuemYuZHJpbGxkb3duJyx0aGlzLl9iaW5kSGFuZGxlcik7XG4gICAgdGhpcy5faGlkZUFsbCgpO1xuXHQgIHRoaXMuJGVsZW1lbnQub2ZmKCdtdXRhdGVtZS56Zi50cmlnZ2VyJyk7XG4gICAgRm91bmRhdGlvbi5OZXN0LkJ1cm4odGhpcy4kZWxlbWVudCwgJ2RyaWxsZG93bicpO1xuICAgIHRoaXMuJGVsZW1lbnQudW53cmFwKClcbiAgICAgICAgICAgICAgICAgLmZpbmQoJy5qcy1kcmlsbGRvd24tYmFjaywgLmlzLXN1Ym1lbnUtcGFyZW50LWl0ZW0nKS5yZW1vdmUoKVxuICAgICAgICAgICAgICAgICAuZW5kKCkuZmluZCgnLmlzLWFjdGl2ZSwgLmlzLWNsb3NpbmcsIC5pcy1kcmlsbGRvd24tc3VibWVudScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUgaXMtY2xvc2luZyBpcy1kcmlsbGRvd24tc3VibWVudScpXG4gICAgICAgICAgICAgICAgIC5lbmQoKS5maW5kKCdbZGF0YS1zdWJtZW51XScpLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIHRhYmluZGV4IHJvbGUnKTtcbiAgICB0aGlzLiRzdWJtZW51QW5jaG9ycy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgJCh0aGlzKS5vZmYoJy56Zi5kcmlsbGRvd24nKTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHN1Ym1lbnVzLnJlbW92ZUNsYXNzKCdkcmlsbGRvd24tc3VibWVudS1jb3Zlci1wcmV2aW91cycpO1xuXG4gICAgdGhpcy4kZWxlbWVudC5maW5kKCdhJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgdmFyICRsaW5rID0gJCh0aGlzKTtcbiAgICAgICRsaW5rLnJlbW92ZUF0dHIoJ3RhYmluZGV4Jyk7XG4gICAgICBpZigkbGluay5kYXRhKCdzYXZlZEhyZWYnKSl7XG4gICAgICAgICRsaW5rLmF0dHIoJ2hyZWYnLCAkbGluay5kYXRhKCdzYXZlZEhyZWYnKSkucmVtb3ZlRGF0YSgnc2F2ZWRIcmVmJyk7XG4gICAgICB9ZWxzZXsgcmV0dXJuOyB9XG4gICAgfSk7XG4gICAgRm91bmRhdGlvbi51bnJlZ2lzdGVyUGx1Z2luKHRoaXMpO1xuICB9O1xufVxuXG5EcmlsbGRvd24uZGVmYXVsdHMgPSB7XG4gIC8qKlxuICAgKiBNYXJrdXAgdXNlZCBmb3IgSlMgZ2VuZXJhdGVkIGJhY2sgYnV0dG9uLiBQcmVwZW5kZWQgIG9yIGFwcGVuZGVkIChzZWUgYmFja0J1dHRvblBvc2l0aW9uKSB0byBzdWJtZW51IGxpc3RzIGFuZCBkZWxldGVkIG9uIGBkZXN0cm95YCBtZXRob2QsICdqcy1kcmlsbGRvd24tYmFjaycgY2xhc3MgcmVxdWlyZWQuIFJlbW92ZSB0aGUgYmFja3NsYXNoIChgXFxgKSBpZiBjb3B5IGFuZCBwYXN0aW5nLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICc8bGkgY2xhc3M9XCJqcy1kcmlsbGRvd24tYmFja1wiPjxhIHRhYmluZGV4PVwiMFwiPkJhY2s8L2E+PC9saT4nXG4gICAqL1xuICBiYWNrQnV0dG9uOiAnPGxpIGNsYXNzPVwianMtZHJpbGxkb3duLWJhY2tcIj48YSB0YWJpbmRleD1cIjBcIj5CYWNrPC9hPjwvbGk+JyxcbiAgLyoqXG4gICAqIFBvc2l0aW9uIHRoZSBiYWNrIGJ1dHRvbiBlaXRoZXIgYXQgdGhlIHRvcCBvciBib3R0b20gb2YgZHJpbGxkb3duIHN1Ym1lbnVzLiBDYW4gYmUgYCdsZWZ0J2Agb3IgYCdib3R0b20nYC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCB0b3BcbiAgICovXG4gIGJhY2tCdXR0b25Qb3NpdGlvbjogJ3RvcCcsXG4gIC8qKlxuICAgKiBNYXJrdXAgdXNlZCB0byB3cmFwIGRyaWxsZG93biBtZW51LiBVc2UgYSBjbGFzcyBuYW1lIGZvciBpbmRlcGVuZGVudCBzdHlsaW5nOyB0aGUgSlMgYXBwbGllZCBjbGFzczogYGlzLWRyaWxsZG93bmAgaXMgcmVxdWlyZWQuIFJlbW92ZSB0aGUgYmFja3NsYXNoIChgXFxgKSBpZiBjb3B5IGFuZCBwYXN0aW5nLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICc8ZGl2PjwvZGl2PidcbiAgICovXG4gIHdyYXBwZXI6ICc8ZGl2PjwvZGl2PicsXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBwYXJlbnQgbGluayB0byB0aGUgc3VibWVudS5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHBhcmVudExpbms6IGZhbHNlLFxuICAvKipcbiAgICogQWxsb3cgdGhlIG1lbnUgdG8gcmV0dXJuIHRvIHJvb3QgbGlzdCBvbiBib2R5IGNsaWNrLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgY2xvc2VPbkNsaWNrOiBmYWxzZSxcbiAgLyoqXG4gICAqIEFsbG93IHRoZSBtZW51IHRvIGF1dG8gYWRqdXN0IGhlaWdodC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGF1dG9IZWlnaHQ6IGZhbHNlLFxuICAvKipcbiAgICogQW5pbWF0ZSB0aGUgYXV0byBhZGp1c3QgaGVpZ2h0LlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgYW5pbWF0ZUhlaWdodDogZmFsc2UsXG4gIC8qKlxuICAgKiBTY3JvbGwgdG8gdGhlIHRvcCBvZiB0aGUgbWVudSBhZnRlciBvcGVuaW5nIGEgc3VibWVudSBvciBuYXZpZ2F0aW5nIGJhY2sgdXNpbmcgdGhlIG1lbnUgYmFjayBidXR0b25cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHNjcm9sbFRvcDogZmFsc2UsXG4gIC8qKlxuICAgKiBTdHJpbmcganF1ZXJ5IHNlbGVjdG9yIChmb3IgZXhhbXBsZSAnYm9keScpIG9mIGVsZW1lbnQgdG8gdGFrZSBvZmZzZXQoKS50b3AgZnJvbSwgaWYgZW1wdHkgc3RyaW5nIHRoZSBkcmlsbGRvd24gbWVudSBvZmZzZXQoKS50b3AgaXMgdGFrZW5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnJ1xuICAgKi9cbiAgc2Nyb2xsVG9wRWxlbWVudDogJycsXG4gIC8qKlxuICAgKiBTY3JvbGxUb3Agb2Zmc2V0XG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgc2Nyb2xsVG9wT2Zmc2V0OiAwLFxuICAvKipcbiAgICogU2Nyb2xsIGFuaW1hdGlvbiBkdXJhdGlvblxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEBkZWZhdWx0IDUwMFxuICAgKi9cbiAgYW5pbWF0aW9uRHVyYXRpb246IDUwMCxcbiAgLyoqXG4gICAqIFNjcm9sbCBhbmltYXRpb24gZWFzaW5nLiBDYW4gYmUgYCdzd2luZydgIG9yIGAnbGluZWFyJ2AuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9hcGkuanF1ZXJ5LmNvbS9hbmltYXRlfEpRdWVyeSBhbmltYXRlfVxuICAgKiBAZGVmYXVsdCAnc3dpbmcnXG4gICAqL1xuICBhbmltYXRpb25FYXNpbmc6ICdzd2luZydcbiAgLy8gaG9sZE9wZW46IGZhbHNlXG59O1xuXG4vLyBXaW5kb3cgZXhwb3J0c1xuRm91bmRhdGlvbi5wbHVnaW4oRHJpbGxkb3duLCAnRHJpbGxkb3duJyk7XG5cbn0oalF1ZXJ5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuLyoqXG4gKiBEcm9wZG93biBtb2R1bGUuXG4gKiBAbW9kdWxlIGZvdW5kYXRpb24uZHJvcGRvd25cbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwua2V5Ym9hcmRcbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwuYm94XG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLnRyaWdnZXJzXG4gKi9cblxuY2xhc3MgRHJvcGRvd24ge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBhIGRyb3Bkb3duLlxuICAgKiBAY2xhc3NcbiAgICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnQgLSBqUXVlcnkgb2JqZWN0IHRvIG1ha2UgaW50byBhIGRyb3Bkb3duLlxuICAgKiAgICAgICAgT2JqZWN0IHNob3VsZCBiZSBvZiB0aGUgZHJvcGRvd24gcGFuZWwsIHJhdGhlciB0aGFuIGl0cyBhbmNob3IuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGVzIHRvIHRoZSBkZWZhdWx0IHBsdWdpbiBzZXR0aW5ncy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgRHJvcGRvd24uZGVmYXVsdHMsIHRoaXMuJGVsZW1lbnQuZGF0YSgpLCBvcHRpb25zKTtcbiAgICB0aGlzLl9pbml0KCk7XG5cbiAgICBGb3VuZGF0aW9uLnJlZ2lzdGVyUGx1Z2luKHRoaXMsICdEcm9wZG93bicpO1xuICAgIEZvdW5kYXRpb24uS2V5Ym9hcmQucmVnaXN0ZXIoJ0Ryb3Bkb3duJywge1xuICAgICAgJ0VOVEVSJzogJ29wZW4nLFxuICAgICAgJ1NQQUNFJzogJ29wZW4nLFxuICAgICAgJ0VTQ0FQRSc6ICdjbG9zZSdcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgcGx1Z2luIGJ5IHNldHRpbmcvY2hlY2tpbmcgb3B0aW9ucyBhbmQgYXR0cmlidXRlcywgYWRkaW5nIGhlbHBlciB2YXJpYWJsZXMsIGFuZCBzYXZpbmcgdGhlIGFuY2hvci5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdCgpIHtcbiAgICB2YXIgJGlkID0gdGhpcy4kZWxlbWVudC5hdHRyKCdpZCcpO1xuXG4gICAgdGhpcy4kYW5jaG9yID0gJChgW2RhdGEtdG9nZ2xlPVwiJHskaWR9XCJdYCkubGVuZ3RoID8gJChgW2RhdGEtdG9nZ2xlPVwiJHskaWR9XCJdYCkgOiAkKGBbZGF0YS1vcGVuPVwiJHskaWR9XCJdYCk7XG4gICAgdGhpcy4kYW5jaG9yLmF0dHIoe1xuICAgICAgJ2FyaWEtY29udHJvbHMnOiAkaWQsXG4gICAgICAnZGF0YS1pcy1mb2N1cyc6IGZhbHNlLFxuICAgICAgJ2RhdGEteWV0aS1ib3gnOiAkaWQsXG4gICAgICAnYXJpYS1oYXNwb3B1cCc6IHRydWUsXG4gICAgICAnYXJpYS1leHBhbmRlZCc6IGZhbHNlXG5cbiAgICB9KTtcblxuICAgIGlmKHRoaXMub3B0aW9ucy5wYXJlbnRDbGFzcyl7XG4gICAgICB0aGlzLiRwYXJlbnQgPSB0aGlzLiRlbGVtZW50LnBhcmVudHMoJy4nICsgdGhpcy5vcHRpb25zLnBhcmVudENsYXNzKTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuJHBhcmVudCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMub3B0aW9ucy5wb3NpdGlvbkNsYXNzID0gdGhpcy5nZXRQb3NpdGlvbkNsYXNzKCk7XG4gICAgdGhpcy5jb3VudGVyID0gNDtcbiAgICB0aGlzLnVzZWRQb3NpdGlvbnMgPSBbXTtcbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoe1xuICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICAgICAgJ2RhdGEteWV0aS1ib3gnOiAkaWQsXG4gICAgICAnZGF0YS1yZXNpemUnOiAkaWQsXG4gICAgICAnYXJpYS1sYWJlbGxlZGJ5JzogdGhpcy4kYW5jaG9yWzBdLmlkIHx8IEZvdW5kYXRpb24uR2V0WW9EaWdpdHMoNiwgJ2RkLWFuY2hvcicpXG4gICAgfSk7XG4gICAgdGhpcy5fZXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGRldGVybWluZSBjdXJyZW50IG9yaWVudGF0aW9uIG9mIGRyb3Bkb3duIHBhbmUuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBwb3NpdGlvbiAtIHN0cmluZyB2YWx1ZSBvZiBhIHBvc2l0aW9uIGNsYXNzLlxuICAgKi9cbiAgZ2V0UG9zaXRpb25DbGFzcygpIHtcbiAgICB2YXIgdmVydGljYWxQb3NpdGlvbiA9IHRoaXMuJGVsZW1lbnRbMF0uY2xhc3NOYW1lLm1hdGNoKC8odG9wfGxlZnR8cmlnaHR8Ym90dG9tKS9nKTtcbiAgICAgICAgdmVydGljYWxQb3NpdGlvbiA9IHZlcnRpY2FsUG9zaXRpb24gPyB2ZXJ0aWNhbFBvc2l0aW9uWzBdIDogJyc7XG4gICAgdmFyIGhvcml6b250YWxQb3NpdGlvbiA9IC9mbG9hdC0oXFxTKykvLmV4ZWModGhpcy4kYW5jaG9yWzBdLmNsYXNzTmFtZSk7XG4gICAgICAgIGhvcml6b250YWxQb3NpdGlvbiA9IGhvcml6b250YWxQb3NpdGlvbiA/IGhvcml6b250YWxQb3NpdGlvblsxXSA6ICcnO1xuICAgIHZhciBwb3NpdGlvbiA9IGhvcml6b250YWxQb3NpdGlvbiA/IGhvcml6b250YWxQb3NpdGlvbiArICcgJyArIHZlcnRpY2FsUG9zaXRpb24gOiB2ZXJ0aWNhbFBvc2l0aW9uO1xuXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkanVzdHMgdGhlIGRyb3Bkb3duIHBhbmVzIG9yaWVudGF0aW9uIGJ5IGFkZGluZy9yZW1vdmluZyBwb3NpdGlvbmluZyBjbGFzc2VzLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBvc2l0aW9uIC0gcG9zaXRpb24gY2xhc3MgdG8gcmVtb3ZlLlxuICAgKi9cbiAgX3JlcG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICB0aGlzLnVzZWRQb3NpdGlvbnMucHVzaChwb3NpdGlvbiA/IHBvc2l0aW9uIDogJ2JvdHRvbScpO1xuICAgIC8vZGVmYXVsdCwgdHJ5IHN3aXRjaGluZyB0byBvcHBvc2l0ZSBzaWRlXG4gICAgaWYoIXBvc2l0aW9uICYmICh0aGlzLnVzZWRQb3NpdGlvbnMuaW5kZXhPZigndG9wJykgPCAwKSl7XG4gICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCd0b3AnKTtcbiAgICB9ZWxzZSBpZihwb3NpdGlvbiA9PT0gJ3RvcCcgJiYgKHRoaXMudXNlZFBvc2l0aW9ucy5pbmRleE9mKCdib3R0b20nKSA8IDApKXtcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MocG9zaXRpb24pO1xuICAgIH1lbHNlIGlmKHBvc2l0aW9uID09PSAnbGVmdCcgJiYgKHRoaXMudXNlZFBvc2l0aW9ucy5pbmRleE9mKCdyaWdodCcpIDwgMCkpe1xuICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhwb3NpdGlvbilcbiAgICAgICAgICAuYWRkQ2xhc3MoJ3JpZ2h0Jyk7XG4gICAgfWVsc2UgaWYocG9zaXRpb24gPT09ICdyaWdodCcgJiYgKHRoaXMudXNlZFBvc2l0aW9ucy5pbmRleE9mKCdsZWZ0JykgPCAwKSl7XG4gICAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKHBvc2l0aW9uKVxuICAgICAgICAgIC5hZGRDbGFzcygnbGVmdCcpO1xuICAgIH1cblxuICAgIC8vaWYgZGVmYXVsdCBjaGFuZ2UgZGlkbid0IHdvcmssIHRyeSBib3R0b20gb3IgbGVmdCBmaXJzdFxuICAgIGVsc2UgaWYoIXBvc2l0aW9uICYmICh0aGlzLnVzZWRQb3NpdGlvbnMuaW5kZXhPZigndG9wJykgPiAtMSkgJiYgKHRoaXMudXNlZFBvc2l0aW9ucy5pbmRleE9mKCdsZWZ0JykgPCAwKSl7XG4gICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdsZWZ0Jyk7XG4gICAgfWVsc2UgaWYocG9zaXRpb24gPT09ICd0b3AnICYmICh0aGlzLnVzZWRQb3NpdGlvbnMuaW5kZXhPZignYm90dG9tJykgPiAtMSkgJiYgKHRoaXMudXNlZFBvc2l0aW9ucy5pbmRleE9mKCdsZWZ0JykgPCAwKSl7XG4gICAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKHBvc2l0aW9uKVxuICAgICAgICAgIC5hZGRDbGFzcygnbGVmdCcpO1xuICAgIH1lbHNlIGlmKHBvc2l0aW9uID09PSAnbGVmdCcgJiYgKHRoaXMudXNlZFBvc2l0aW9ucy5pbmRleE9mKCdyaWdodCcpID4gLTEpICYmICh0aGlzLnVzZWRQb3NpdGlvbnMuaW5kZXhPZignYm90dG9tJykgPCAwKSl7XG4gICAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKHBvc2l0aW9uKTtcbiAgICB9ZWxzZSBpZihwb3NpdGlvbiA9PT0gJ3JpZ2h0JyAmJiAodGhpcy51c2VkUG9zaXRpb25zLmluZGV4T2YoJ2xlZnQnKSA+IC0xKSAmJiAodGhpcy51c2VkUG9zaXRpb25zLmluZGV4T2YoJ2JvdHRvbScpIDwgMCkpe1xuICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhwb3NpdGlvbik7XG4gICAgfVxuICAgIC8vaWYgbm90aGluZyBjbGVhcmVkLCBzZXQgdG8gYm90dG9tXG4gICAgZWxzZXtcbiAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MocG9zaXRpb24pO1xuICAgIH1cbiAgICB0aGlzLmNsYXNzQ2hhbmdlZCA9IHRydWU7XG4gICAgdGhpcy5jb3VudGVyLS07XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcG9zaXRpb24gYW5kIG9yaWVudGF0aW9uIG9mIHRoZSBkcm9wZG93biBwYW5lLCBjaGVja3MgZm9yIGNvbGxpc2lvbnMuXG4gICAqIFJlY3Vyc2l2ZWx5IGNhbGxzIGl0c2VsZiBpZiBhIGNvbGxpc2lvbiBpcyBkZXRlY3RlZCwgd2l0aCBhIG5ldyBwb3NpdGlvbiBjbGFzcy5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2V0UG9zaXRpb24oKSB7XG4gICAgaWYodGhpcy4kYW5jaG9yLmF0dHIoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJyl7IHJldHVybiBmYWxzZTsgfVxuICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25DbGFzcygpLFxuICAgICAgICAkZWxlRGltcyA9IEZvdW5kYXRpb24uQm94LkdldERpbWVuc2lvbnModGhpcy4kZWxlbWVudCksXG4gICAgICAgICRhbmNob3JEaW1zID0gRm91bmRhdGlvbi5Cb3guR2V0RGltZW5zaW9ucyh0aGlzLiRhbmNob3IpLFxuICAgICAgICBfdGhpcyA9IHRoaXMsXG4gICAgICAgIGRpcmVjdGlvbiA9IChwb3NpdGlvbiA9PT0gJ2xlZnQnID8gJ2xlZnQnIDogKChwb3NpdGlvbiA9PT0gJ3JpZ2h0JykgPyAnbGVmdCcgOiAndG9wJykpLFxuICAgICAgICBwYXJhbSA9IChkaXJlY3Rpb24gPT09ICd0b3AnKSA/ICdoZWlnaHQnIDogJ3dpZHRoJyxcbiAgICAgICAgb2Zmc2V0ID0gKHBhcmFtID09PSAnaGVpZ2h0JykgPyB0aGlzLm9wdGlvbnMudk9mZnNldCA6IHRoaXMub3B0aW9ucy5oT2Zmc2V0O1xuXG4gICAgaWYoKCRlbGVEaW1zLndpZHRoID49ICRlbGVEaW1zLndpbmRvd0RpbXMud2lkdGgpIHx8ICghdGhpcy5jb3VudGVyICYmICFGb3VuZGF0aW9uLkJveC5JbU5vdFRvdWNoaW5nWW91KHRoaXMuJGVsZW1lbnQsIHRoaXMuJHBhcmVudCkpKXtcbiAgICAgIHZhciBuZXdXaWR0aCA9ICRlbGVEaW1zLndpbmRvd0RpbXMud2lkdGgsXG4gICAgICAgICAgcGFyZW50SE9mZnNldCA9IDA7XG4gICAgICBpZih0aGlzLiRwYXJlbnQpe1xuICAgICAgICB2YXIgJHBhcmVudERpbXMgPSBGb3VuZGF0aW9uLkJveC5HZXREaW1lbnNpb25zKHRoaXMuJHBhcmVudCksXG4gICAgICAgICAgICBwYXJlbnRIT2Zmc2V0ID0gJHBhcmVudERpbXMub2Zmc2V0LmxlZnQ7XG4gICAgICAgIGlmICgkcGFyZW50RGltcy53aWR0aCA8IG5ld1dpZHRoKXtcbiAgICAgICAgICBuZXdXaWR0aCA9ICRwYXJlbnREaW1zLndpZHRoO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVsZW1lbnQub2Zmc2V0KEZvdW5kYXRpb24uQm94LkdldE9mZnNldHModGhpcy4kZWxlbWVudCwgdGhpcy4kYW5jaG9yLCAnY2VudGVyIGJvdHRvbScsIHRoaXMub3B0aW9ucy52T2Zmc2V0LCB0aGlzLm9wdGlvbnMuaE9mZnNldCArIHBhcmVudEhPZmZzZXQsIHRydWUpKS5jc3Moe1xuICAgICAgICAnd2lkdGgnOiBuZXdXaWR0aCAtICh0aGlzLm9wdGlvbnMuaE9mZnNldCAqIDIpLFxuICAgICAgICAnaGVpZ2h0JzogJ2F1dG8nXG4gICAgICB9KTtcbiAgICAgIHRoaXMuY2xhc3NDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50Lm9mZnNldChGb3VuZGF0aW9uLkJveC5HZXRPZmZzZXRzKHRoaXMuJGVsZW1lbnQsIHRoaXMuJGFuY2hvciwgcG9zaXRpb24sIHRoaXMub3B0aW9ucy52T2Zmc2V0LCB0aGlzLm9wdGlvbnMuaE9mZnNldCkpO1xuXG4gICAgd2hpbGUoIUZvdW5kYXRpb24uQm94LkltTm90VG91Y2hpbmdZb3UodGhpcy4kZWxlbWVudCwgdGhpcy4kcGFyZW50LCB0cnVlKSAmJiB0aGlzLmNvdW50ZXIpe1xuICAgICAgdGhpcy5fcmVwb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgZWxlbWVudCB1dGlsaXppbmcgdGhlIHRyaWdnZXJzIHV0aWxpdHkgbGlicmFyeS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXZlbnRzKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy4kZWxlbWVudC5vbih7XG4gICAgICAnb3Blbi56Zi50cmlnZ2VyJzogdGhpcy5vcGVuLmJpbmQodGhpcyksXG4gICAgICAnY2xvc2UuemYudHJpZ2dlcic6IHRoaXMuY2xvc2UuYmluZCh0aGlzKSxcbiAgICAgICd0b2dnbGUuemYudHJpZ2dlcic6IHRoaXMudG9nZ2xlLmJpbmQodGhpcyksXG4gICAgICAncmVzaXplbWUuemYudHJpZ2dlcic6IHRoaXMuX3NldFBvc2l0aW9uLmJpbmQodGhpcylcbiAgICB9KTtcblxuICAgIGlmKHRoaXMub3B0aW9ucy5ob3Zlcil7XG4gICAgICB0aGlzLiRhbmNob3Iub2ZmKCdtb3VzZWVudGVyLnpmLmRyb3Bkb3duIG1vdXNlbGVhdmUuemYuZHJvcGRvd24nKVxuICAgICAgLm9uKCdtb3VzZWVudGVyLnpmLmRyb3Bkb3duJywgZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGJvZHlEYXRhID0gJCgnYm9keScpLmRhdGEoKTtcbiAgICAgICAgaWYodHlwZW9mKGJvZHlEYXRhLndoYXRpbnB1dCkgPT09ICd1bmRlZmluZWQnIHx8IGJvZHlEYXRhLndoYXRpbnB1dCA9PT0gJ21vdXNlJykge1xuICAgICAgICAgIGNsZWFyVGltZW91dChfdGhpcy50aW1lb3V0KTtcbiAgICAgICAgICBfdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgX3RoaXMub3BlbigpO1xuICAgICAgICAgICAgX3RoaXMuJGFuY2hvci5kYXRhKCdob3ZlcicsIHRydWUpO1xuICAgICAgICAgIH0sIF90aGlzLm9wdGlvbnMuaG92ZXJEZWxheSk7XG4gICAgICAgIH1cbiAgICAgIH0pLm9uKCdtb3VzZWxlYXZlLnpmLmRyb3Bkb3duJywgZnVuY3Rpb24oKXtcbiAgICAgICAgY2xlYXJUaW1lb3V0KF90aGlzLnRpbWVvdXQpO1xuICAgICAgICBfdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgICAgICAgX3RoaXMuJGFuY2hvci5kYXRhKCdob3ZlcicsIGZhbHNlKTtcbiAgICAgICAgfSwgX3RoaXMub3B0aW9ucy5ob3ZlckRlbGF5KTtcbiAgICAgIH0pO1xuICAgICAgaWYodGhpcy5vcHRpb25zLmhvdmVyUGFuZSl7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdtb3VzZWVudGVyLnpmLmRyb3Bkb3duIG1vdXNlbGVhdmUuemYuZHJvcGRvd24nKVxuICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyLnpmLmRyb3Bkb3duJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KF90aGlzLnRpbWVvdXQpO1xuICAgICAgICAgICAgfSkub24oJ21vdXNlbGVhdmUuemYuZHJvcGRvd24nLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoX3RoaXMudGltZW91dCk7XG4gICAgICAgICAgICAgIF90aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy4kYW5jaG9yLmRhdGEoJ2hvdmVyJywgZmFsc2UpO1xuICAgICAgICAgICAgICB9LCBfdGhpcy5vcHRpb25zLmhvdmVyRGVsYXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuJGFuY2hvci5hZGQodGhpcy4kZWxlbWVudCkub24oJ2tleWRvd24uemYuZHJvcGRvd24nLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgIHZhciAkdGFyZ2V0ID0gJCh0aGlzKSxcbiAgICAgICAgdmlzaWJsZUZvY3VzYWJsZUVsZW1lbnRzID0gRm91bmRhdGlvbi5LZXlib2FyZC5maW5kRm9jdXNhYmxlKF90aGlzLiRlbGVtZW50KTtcblxuICAgICAgRm91bmRhdGlvbi5LZXlib2FyZC5oYW5kbGVLZXkoZSwgJ0Ryb3Bkb3duJywge1xuICAgICAgICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoJHRhcmdldC5pcyhfdGhpcy4kYW5jaG9yKSkge1xuICAgICAgICAgICAgX3RoaXMub3BlbigpO1xuICAgICAgICAgICAgX3RoaXMuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnLCAtMSkuZm9jdXMoKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBfdGhpcy5jbG9zZSgpO1xuICAgICAgICAgIF90aGlzLiRhbmNob3IuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBldmVudCBoYW5kbGVyIHRvIHRoZSBib2R5IHRvIGNsb3NlIGFueSBkcm9wZG93bnMgb24gYSBjbGljay5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkQm9keUhhbmRsZXIoKSB7XG4gICAgIHZhciAkYm9keSA9ICQoZG9jdW1lbnQuYm9keSkubm90KHRoaXMuJGVsZW1lbnQpLFxuICAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAkYm9keS5vZmYoJ2NsaWNrLnpmLmRyb3Bkb3duJylcbiAgICAgICAgICAub24oJ2NsaWNrLnpmLmRyb3Bkb3duJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBpZihfdGhpcy4kYW5jaG9yLmlzKGUudGFyZ2V0KSB8fCBfdGhpcy4kYW5jaG9yLmZpbmQoZS50YXJnZXQpLmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihfdGhpcy4kZWxlbWVudC5maW5kKGUudGFyZ2V0KS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICRib2R5Lm9mZignY2xpY2suemYuZHJvcGRvd24nKTtcbiAgICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgZHJvcGRvd24gcGFuZSwgYW5kIGZpcmVzIGEgYnViYmxpbmcgZXZlbnQgdG8gY2xvc2Ugb3RoZXIgZHJvcGRvd25zLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQGZpcmVzIERyb3Bkb3duI2Nsb3NlbWVcbiAgICogQGZpcmVzIERyb3Bkb3duI3Nob3dcbiAgICovXG4gIG9wZW4oKSB7XG4gICAgLy8gdmFyIF90aGlzID0gdGhpcztcbiAgICAvKipcbiAgICAgKiBGaXJlcyB0byBjbG9zZSBvdGhlciBvcGVuIGRyb3Bkb3ducywgdHlwaWNhbGx5IHdoZW4gZHJvcGRvd24gaXMgb3BlbmluZ1xuICAgICAqIEBldmVudCBEcm9wZG93biNjbG9zZW1lXG4gICAgICovXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjbG9zZW1lLnpmLmRyb3Bkb3duJywgdGhpcy4kZWxlbWVudC5hdHRyKCdpZCcpKTtcbiAgICB0aGlzLiRhbmNob3IuYWRkQ2xhc3MoJ2hvdmVyJylcbiAgICAgICAgLmF0dHIoeydhcmlhLWV4cGFuZGVkJzogdHJ1ZX0pO1xuICAgIC8vIHRoaXMuJGVsZW1lbnQvKi5zaG93KCkqLztcbiAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ2lzLW9wZW4nKVxuICAgICAgICAuYXR0cih7J2FyaWEtaGlkZGVuJzogZmFsc2V9KTtcblxuICAgIGlmKHRoaXMub3B0aW9ucy5hdXRvRm9jdXMpe1xuICAgICAgdmFyICRmb2N1c2FibGUgPSBGb3VuZGF0aW9uLktleWJvYXJkLmZpbmRGb2N1c2FibGUodGhpcy4kZWxlbWVudCk7XG4gICAgICBpZigkZm9jdXNhYmxlLmxlbmd0aCl7XG4gICAgICAgICRmb2N1c2FibGUuZXEoMCkuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZih0aGlzLm9wdGlvbnMuY2xvc2VPbkNsaWNrKXsgdGhpcy5fYWRkQm9keUhhbmRsZXIoKTsgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy50cmFwRm9jdXMpIHtcbiAgICAgIEZvdW5kYXRpb24uS2V5Ym9hcmQudHJhcEZvY3VzKHRoaXMuJGVsZW1lbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpcmVzIG9uY2UgdGhlIGRyb3Bkb3duIGlzIHZpc2libGUuXG4gICAgICogQGV2ZW50IERyb3Bkb3duI3Nob3dcbiAgICAgKi9cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3Nob3cuemYuZHJvcGRvd24nLCBbdGhpcy4kZWxlbWVudF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgb3BlbiBkcm9wZG93biBwYW5lLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQGZpcmVzIERyb3Bkb3duI2hpZGVcbiAgICovXG4gIGNsb3NlKCkge1xuICAgIGlmKCF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpcy1vcGVuJykpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKCdpcy1vcGVuJylcbiAgICAgICAgLmF0dHIoeydhcmlhLWhpZGRlbic6IHRydWV9KTtcblxuICAgIHRoaXMuJGFuY2hvci5yZW1vdmVDbGFzcygnaG92ZXInKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcblxuICAgIGlmKHRoaXMuY2xhc3NDaGFuZ2VkKXtcbiAgICAgIHZhciBjdXJQb3NpdGlvbkNsYXNzID0gdGhpcy5nZXRQb3NpdGlvbkNsYXNzKCk7XG4gICAgICBpZihjdXJQb3NpdGlvbkNsYXNzKXtcbiAgICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhjdXJQb3NpdGlvbkNsYXNzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnBvc2l0aW9uQ2xhc3MpXG4gICAgICAgICAgLyouaGlkZSgpKi8uY3NzKHtoZWlnaHQ6ICcnLCB3aWR0aDogJyd9KTtcbiAgICAgIHRoaXMuY2xhc3NDaGFuZ2VkID0gZmFsc2U7XG4gICAgICB0aGlzLmNvdW50ZXIgPSA0O1xuICAgICAgdGhpcy51c2VkUG9zaXRpb25zLmxlbmd0aCA9IDA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpcmVzIG9uY2UgdGhlIGRyb3Bkb3duIGlzIG5vIGxvbmdlciB2aXNpYmxlLlxuICAgICAqIEBldmVudCBEcm9wZG93biNoaWRlXG4gICAgICovXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdoaWRlLnpmLmRyb3Bkb3duJywgW3RoaXMuJGVsZW1lbnRdKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMudHJhcEZvY3VzKSB7XG4gICAgICBGb3VuZGF0aW9uLktleWJvYXJkLnJlbGVhc2VGb2N1cyh0aGlzLiRlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgZHJvcGRvd24gcGFuZSdzIHZpc2liaWxpdHkuXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgdG9nZ2xlKCkge1xuICAgIGlmKHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2lzLW9wZW4nKSl7XG4gICAgICBpZih0aGlzLiRhbmNob3IuZGF0YSgnaG92ZXInKSkgcmV0dXJuO1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBkcm9wZG93bi5cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuJGVsZW1lbnQub2ZmKCcuemYudHJpZ2dlcicpLmhpZGUoKTtcbiAgICB0aGlzLiRhbmNob3Iub2ZmKCcuemYuZHJvcGRvd24nKTtcblxuICAgIEZvdW5kYXRpb24udW5yZWdpc3RlclBsdWdpbih0aGlzKTtcbiAgfVxufVxuXG5Ecm9wZG93bi5kZWZhdWx0cyA9IHtcbiAgLyoqXG4gICAqIENsYXNzIHRoYXQgZGVzaWduYXRlcyBib3VuZGluZyBjb250YWluZXIgb2YgRHJvcGRvd24gKGRlZmF1bHQ6IHdpbmRvdylcbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7P3N0cmluZ31cbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgcGFyZW50Q2xhc3M6IG51bGwsXG4gIC8qKlxuICAgKiBBbW91bnQgb2YgdGltZSB0byBkZWxheSBvcGVuaW5nIGEgc3VibWVudSBvbiBob3ZlciBldmVudC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAyNTBcbiAgICovXG4gIGhvdmVyRGVsYXk6IDI1MCxcbiAgLyoqXG4gICAqIEFsbG93IHN1Ym1lbnVzIHRvIG9wZW4gb24gaG92ZXIgZXZlbnRzXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBob3ZlcjogZmFsc2UsXG4gIC8qKlxuICAgKiBEb24ndCBjbG9zZSBkcm9wZG93biB3aGVuIGhvdmVyaW5nIG92ZXIgZHJvcGRvd24gcGFuZVxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgaG92ZXJQYW5lOiBmYWxzZSxcbiAgLyoqXG4gICAqIE51bWJlciBvZiBwaXhlbHMgYmV0d2VlbiB0aGUgZHJvcGRvd24gcGFuZSBhbmQgdGhlIHRyaWdnZXJpbmcgZWxlbWVudCBvbiBvcGVuLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHZPZmZzZXQ6IDEsXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgcGl4ZWxzIGJldHdlZW4gdGhlIGRyb3Bkb3duIHBhbmUgYW5kIHRoZSB0cmlnZ2VyaW5nIGVsZW1lbnQgb24gb3Blbi5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICBoT2Zmc2V0OiAxLFxuICAvKipcbiAgICogQ2xhc3MgYXBwbGllZCB0byBhZGp1c3Qgb3BlbiBwb3NpdGlvbi4gSlMgd2lsbCB0ZXN0IGFuZCBmaWxsIHRoaXMgaW4uXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJydcbiAgICovXG4gIHBvc2l0aW9uQ2xhc3M6ICcnLFxuICAvKipcbiAgICogQWxsb3cgdGhlIHBsdWdpbiB0byB0cmFwIGZvY3VzIHRvIHRoZSBkcm9wZG93biBwYW5lIGlmIG9wZW5lZCB3aXRoIGtleWJvYXJkIGNvbW1hbmRzLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgdHJhcEZvY3VzOiBmYWxzZSxcbiAgLyoqXG4gICAqIEFsbG93IHRoZSBwbHVnaW4gdG8gc2V0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCB3aXRoaW4gdGhlIHBhbmUsIHJlZ2FyZGxlc3Mgb2YgbWV0aG9kIG9mIG9wZW5pbmcuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBhdXRvRm9jdXM6IGZhbHNlLFxuICAvKipcbiAgICogQWxsb3dzIGEgY2xpY2sgb24gdGhlIGJvZHkgdG8gY2xvc2UgdGhlIGRyb3Bkb3duLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgY2xvc2VPbkNsaWNrOiBmYWxzZVxufVxuXG4vLyBXaW5kb3cgZXhwb3J0c1xuRm91bmRhdGlvbi5wbHVnaW4oRHJvcGRvd24sICdEcm9wZG93bicpO1xuXG59KGpRdWVyeSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbiFmdW5jdGlvbigkKSB7XG5cbi8qKlxuICogRHJvcGRvd25NZW51IG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi5kcm9wZG93bi1tZW51XG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLmtleWJvYXJkXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLmJveFxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5uZXN0XG4gKi9cblxuY2xhc3MgRHJvcGRvd25NZW51IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgRHJvcGRvd25NZW51LlxuICAgKiBAY2xhc3NcbiAgICogQGZpcmVzIERyb3Bkb3duTWVudSNpbml0XG4gICAqIEBwYXJhbSB7alF1ZXJ5fSBlbGVtZW50IC0galF1ZXJ5IG9iamVjdCB0byBtYWtlIGludG8gYSBkcm9wZG93biBtZW51LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlcyB0byB0aGUgZGVmYXVsdCBwbHVnaW4gc2V0dGluZ3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIERyb3Bkb3duTWVudS5kZWZhdWx0cywgdGhpcy4kZWxlbWVudC5kYXRhKCksIG9wdGlvbnMpO1xuXG4gICAgRm91bmRhdGlvbi5OZXN0LkZlYXRoZXIodGhpcy4kZWxlbWVudCwgJ2Ryb3Bkb3duJyk7XG4gICAgdGhpcy5faW5pdCgpO1xuXG4gICAgRm91bmRhdGlvbi5yZWdpc3RlclBsdWdpbih0aGlzLCAnRHJvcGRvd25NZW51Jyk7XG4gICAgRm91bmRhdGlvbi5LZXlib2FyZC5yZWdpc3RlcignRHJvcGRvd25NZW51Jywge1xuICAgICAgJ0VOVEVSJzogJ29wZW4nLFxuICAgICAgJ1NQQUNFJzogJ29wZW4nLFxuICAgICAgJ0FSUk9XX1JJR0hUJzogJ25leHQnLFxuICAgICAgJ0FSUk9XX1VQJzogJ3VwJyxcbiAgICAgICdBUlJPV19ET1dOJzogJ2Rvd24nLFxuICAgICAgJ0FSUk9XX0xFRlQnOiAncHJldmlvdXMnLFxuICAgICAgJ0VTQ0FQRSc6ICdjbG9zZSdcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgcGx1Z2luLCBhbmQgY2FsbHMgX3ByZXBhcmVNZW51XG4gICAqIEBwcml2YXRlXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgX2luaXQoKSB7XG4gICAgdmFyIHN1YnMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ2xpLmlzLWRyb3Bkb3duLXN1Ym1lbnUtcGFyZW50Jyk7XG4gICAgdGhpcy4kZWxlbWVudC5jaGlsZHJlbignLmlzLWRyb3Bkb3duLXN1Ym1lbnUtcGFyZW50JykuY2hpbGRyZW4oJy5pcy1kcm9wZG93bi1zdWJtZW51JykuYWRkQ2xhc3MoJ2ZpcnN0LXN1YicpO1xuXG4gICAgdGhpcy4kbWVudUl0ZW1zID0gdGhpcy4kZWxlbWVudC5maW5kKCdbcm9sZT1cIm1lbnVpdGVtXCJdJyk7XG4gICAgdGhpcy4kdGFicyA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJ1tyb2xlPVwibWVudWl0ZW1cIl0nKTtcbiAgICB0aGlzLiR0YWJzLmZpbmQoJ3VsLmlzLWRyb3Bkb3duLXN1Ym1lbnUnKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMudmVydGljYWxDbGFzcyk7XG5cbiAgICBpZiAodGhpcy4kZWxlbWVudC5oYXNDbGFzcyh0aGlzLm9wdGlvbnMucmlnaHRDbGFzcykgfHwgdGhpcy5vcHRpb25zLmFsaWdubWVudCA9PT0gJ3JpZ2h0JyB8fCBGb3VuZGF0aW9uLnJ0bCgpIHx8IHRoaXMuJGVsZW1lbnQucGFyZW50cygnLnRvcC1iYXItcmlnaHQnKS5pcygnKicpKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuYWxpZ25tZW50ID0gJ3JpZ2h0JztcbiAgICAgIHN1YnMuYWRkQ2xhc3MoJ29wZW5zLWxlZnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3Vicy5hZGRDbGFzcygnb3BlbnMtcmlnaHQnKTtcbiAgICB9XG4gICAgdGhpcy5jaGFuZ2VkID0gZmFsc2U7XG4gICAgdGhpcy5fZXZlbnRzKCk7XG4gIH07XG5cbiAgX2lzVmVydGljYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuJHRhYnMuY3NzKCdkaXNwbGF5JykgPT09ICdibG9jayc7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBldmVudCBsaXN0ZW5lcnMgdG8gZWxlbWVudHMgd2l0aGluIHRoZSBtZW51XG4gICAqIEBwcml2YXRlXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgX2V2ZW50cygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICBoYXNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCAodHlwZW9mIHdpbmRvdy5vbnRvdWNoc3RhcnQgIT09ICd1bmRlZmluZWQnKSxcbiAgICAgICAgcGFyQ2xhc3MgPSAnaXMtZHJvcGRvd24tc3VibWVudS1wYXJlbnQnO1xuXG4gICAgLy8gdXNlZCBmb3Igb25DbGljayBhbmQgaW4gdGhlIGtleWJvYXJkIGhhbmRsZXJzXG4gICAgdmFyIGhhbmRsZUNsaWNrRm4gPSBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgJGVsZW0gPSAkKGUudGFyZ2V0KS5wYXJlbnRzVW50aWwoJ3VsJywgYC4ke3BhckNsYXNzfWApLFxuICAgICAgICAgIGhhc1N1YiA9ICRlbGVtLmhhc0NsYXNzKHBhckNsYXNzKSxcbiAgICAgICAgICBoYXNDbGlja2VkID0gJGVsZW0uYXR0cignZGF0YS1pcy1jbGljaycpID09PSAndHJ1ZScsXG4gICAgICAgICAgJHN1YiA9ICRlbGVtLmNoaWxkcmVuKCcuaXMtZHJvcGRvd24tc3VibWVudScpO1xuXG4gICAgICBpZiAoaGFzU3ViKSB7XG4gICAgICAgIGlmIChoYXNDbGlja2VkKSB7XG4gICAgICAgICAgaWYgKCFfdGhpcy5vcHRpb25zLmNsb3NlT25DbGljayB8fCAoIV90aGlzLm9wdGlvbnMuY2xpY2tPcGVuICYmICFoYXNUb3VjaCkgfHwgKF90aGlzLm9wdGlvbnMuZm9yY2VGb2xsb3cgJiYgaGFzVG91Y2gpKSB7IHJldHVybjsgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLl9oaWRlKCRlbGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgX3RoaXMuX3Nob3coJHN1Yik7XG4gICAgICAgICAgJGVsZW0uYWRkKCRlbGVtLnBhcmVudHNVbnRpbChfdGhpcy4kZWxlbWVudCwgYC4ke3BhckNsYXNzfWApKS5hdHRyKCdkYXRhLWlzLWNsaWNrJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jbGlja09wZW4gfHwgaGFzVG91Y2gpIHtcbiAgICAgIHRoaXMuJG1lbnVJdGVtcy5vbignY2xpY2suemYuZHJvcGRvd25tZW51IHRvdWNoc3RhcnQuemYuZHJvcGRvd25tZW51JywgaGFuZGxlQ2xpY2tGbik7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIExlYWYgZWxlbWVudCBDbGlja3NcbiAgICBpZihfdGhpcy5vcHRpb25zLmNsb3NlT25DbGlja0luc2lkZSl7XG4gICAgICB0aGlzLiRtZW51SXRlbXMub24oJ2NsaWNrLnpmLmRyb3Bkb3dubWVudScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICRlbGVtID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGhhc1N1YiA9ICRlbGVtLmhhc0NsYXNzKHBhckNsYXNzKTtcbiAgICAgICAgaWYoIWhhc1N1Yil7XG4gICAgICAgICAgX3RoaXMuX2hpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuZGlzYWJsZUhvdmVyKSB7XG4gICAgICB0aGlzLiRtZW51SXRlbXMub24oJ21vdXNlZW50ZXIuemYuZHJvcGRvd25tZW51JywgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgJGVsZW0gPSAkKHRoaXMpLFxuICAgICAgICAgICAgaGFzU3ViID0gJGVsZW0uaGFzQ2xhc3MocGFyQ2xhc3MpO1xuXG4gICAgICAgIGlmIChoYXNTdWIpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQoJGVsZW0uZGF0YSgnX2RlbGF5JykpO1xuICAgICAgICAgICRlbGVtLmRhdGEoJ19kZWxheScsIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfdGhpcy5fc2hvdygkZWxlbS5jaGlsZHJlbignLmlzLWRyb3Bkb3duLXN1Ym1lbnUnKSk7XG4gICAgICAgICAgfSwgX3RoaXMub3B0aW9ucy5ob3ZlckRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgIH0pLm9uKCdtb3VzZWxlYXZlLnpmLmRyb3Bkb3dubWVudScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICRlbGVtID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGhhc1N1YiA9ICRlbGVtLmhhc0NsYXNzKHBhckNsYXNzKTtcbiAgICAgICAgaWYgKGhhc1N1YiAmJiBfdGhpcy5vcHRpb25zLmF1dG9jbG9zZSkge1xuICAgICAgICAgIGlmICgkZWxlbS5hdHRyKCdkYXRhLWlzLWNsaWNrJykgPT09ICd0cnVlJyAmJiBfdGhpcy5vcHRpb25zLmNsaWNrT3BlbikgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgICAgIGNsZWFyVGltZW91dCgkZWxlbS5kYXRhKCdfZGVsYXknKSk7XG4gICAgICAgICAgJGVsZW0uZGF0YSgnX2RlbGF5Jywgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF90aGlzLl9oaWRlKCRlbGVtKTtcbiAgICAgICAgICB9LCBfdGhpcy5vcHRpb25zLmNsb3NpbmdUaW1lKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLiRtZW51SXRlbXMub24oJ2tleWRvd24uemYuZHJvcGRvd25tZW51JywgZnVuY3Rpb24oZSkge1xuICAgICAgdmFyICRlbGVtZW50ID0gJChlLnRhcmdldCkucGFyZW50c1VudGlsKCd1bCcsICdbcm9sZT1cIm1lbnVpdGVtXCJdJyksXG4gICAgICAgICAgaXNUYWIgPSBfdGhpcy4kdGFicy5pbmRleCgkZWxlbWVudCkgPiAtMSxcbiAgICAgICAgICAkZWxlbWVudHMgPSBpc1RhYiA/IF90aGlzLiR0YWJzIDogJGVsZW1lbnQuc2libGluZ3MoJ2xpJykuYWRkKCRlbGVtZW50KSxcbiAgICAgICAgICAkcHJldkVsZW1lbnQsXG4gICAgICAgICAgJG5leHRFbGVtZW50O1xuXG4gICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmlzKCRlbGVtZW50KSkge1xuICAgICAgICAgICRwcmV2RWxlbWVudCA9ICRlbGVtZW50cy5lcShpLTEpO1xuICAgICAgICAgICRuZXh0RWxlbWVudCA9ICRlbGVtZW50cy5lcShpKzEpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBuZXh0U2libGluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISRlbGVtZW50LmlzKCc6bGFzdC1jaGlsZCcpKSB7XG4gICAgICAgICAgJG5leHRFbGVtZW50LmNoaWxkcmVuKCdhOmZpcnN0JykuZm9jdXMoKTtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHByZXZTaWJsaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRwcmV2RWxlbWVudC5jaGlsZHJlbignYTpmaXJzdCcpLmZvY3VzKCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0sIG9wZW5TdWIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICRzdWIgPSAkZWxlbWVudC5jaGlsZHJlbigndWwuaXMtZHJvcGRvd24tc3VibWVudScpO1xuICAgICAgICBpZiAoJHN1Yi5sZW5ndGgpIHtcbiAgICAgICAgICBfdGhpcy5fc2hvdygkc3ViKTtcbiAgICAgICAgICAkZWxlbWVudC5maW5kKCdsaSA+IGE6Zmlyc3QnKS5mb2N1cygpO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIHsgcmV0dXJuOyB9XG4gICAgICB9LCBjbG9zZVN1YiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL2lmICgkZWxlbWVudC5pcygnOmZpcnN0LWNoaWxkJykpIHtcbiAgICAgICAgdmFyIGNsb3NlID0gJGVsZW1lbnQucGFyZW50KCd1bCcpLnBhcmVudCgnbGknKTtcbiAgICAgICAgY2xvc2UuY2hpbGRyZW4oJ2E6Zmlyc3QnKS5mb2N1cygpO1xuICAgICAgICBfdGhpcy5faGlkZShjbG9zZSk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy99XG4gICAgICB9O1xuICAgICAgdmFyIGZ1bmN0aW9ucyA9IHtcbiAgICAgICAgb3Blbjogb3BlblN1YixcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIF90aGlzLl9oaWRlKF90aGlzLiRlbGVtZW50KTtcbiAgICAgICAgICBfdGhpcy4kbWVudUl0ZW1zLmZpbmQoJ2E6Zmlyc3QnKS5mb2N1cygpOyAvLyBmb2N1cyB0byBmaXJzdCBlbGVtZW50XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9LFxuICAgICAgICBoYW5kbGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAoaXNUYWIpIHtcbiAgICAgICAgaWYgKF90aGlzLl9pc1ZlcnRpY2FsKCkpIHsgLy8gdmVydGljYWwgbWVudVxuICAgICAgICAgIGlmIChGb3VuZGF0aW9uLnJ0bCgpKSB7IC8vIHJpZ2h0IGFsaWduZWRcbiAgICAgICAgICAgICQuZXh0ZW5kKGZ1bmN0aW9ucywge1xuICAgICAgICAgICAgICBkb3duOiBuZXh0U2libGluZyxcbiAgICAgICAgICAgICAgdXA6IHByZXZTaWJsaW5nLFxuICAgICAgICAgICAgICBuZXh0OiBjbG9zZVN1YixcbiAgICAgICAgICAgICAgcHJldmlvdXM6IG9wZW5TdWJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7IC8vIGxlZnQgYWxpZ25lZFxuICAgICAgICAgICAgJC5leHRlbmQoZnVuY3Rpb25zLCB7XG4gICAgICAgICAgICAgIGRvd246IG5leHRTaWJsaW5nLFxuICAgICAgICAgICAgICB1cDogcHJldlNpYmxpbmcsXG4gICAgICAgICAgICAgIG5leHQ6IG9wZW5TdWIsXG4gICAgICAgICAgICAgIHByZXZpb3VzOiBjbG9zZVN1YlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBob3Jpem9udGFsIG1lbnVcbiAgICAgICAgICBpZiAoRm91bmRhdGlvbi5ydGwoKSkgeyAvLyByaWdodCBhbGlnbmVkXG4gICAgICAgICAgICAkLmV4dGVuZChmdW5jdGlvbnMsIHtcbiAgICAgICAgICAgICAgbmV4dDogcHJldlNpYmxpbmcsXG4gICAgICAgICAgICAgIHByZXZpb3VzOiBuZXh0U2libGluZyxcbiAgICAgICAgICAgICAgZG93bjogb3BlblN1YixcbiAgICAgICAgICAgICAgdXA6IGNsb3NlU3ViXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgeyAvLyBsZWZ0IGFsaWduZWRcbiAgICAgICAgICAgICQuZXh0ZW5kKGZ1bmN0aW9ucywge1xuICAgICAgICAgICAgICBuZXh0OiBuZXh0U2libGluZyxcbiAgICAgICAgICAgICAgcHJldmlvdXM6IHByZXZTaWJsaW5nLFxuICAgICAgICAgICAgICBkb3duOiBvcGVuU3ViLFxuICAgICAgICAgICAgICB1cDogY2xvc2VTdWJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gbm90IHRhYnMgLT4gb25lIHN1YlxuICAgICAgICBpZiAoRm91bmRhdGlvbi5ydGwoKSkgeyAvLyByaWdodCBhbGlnbmVkXG4gICAgICAgICAgJC5leHRlbmQoZnVuY3Rpb25zLCB7XG4gICAgICAgICAgICBuZXh0OiBjbG9zZVN1YixcbiAgICAgICAgICAgIHByZXZpb3VzOiBvcGVuU3ViLFxuICAgICAgICAgICAgZG93bjogbmV4dFNpYmxpbmcsXG4gICAgICAgICAgICB1cDogcHJldlNpYmxpbmdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHsgLy8gbGVmdCBhbGlnbmVkXG4gICAgICAgICAgJC5leHRlbmQoZnVuY3Rpb25zLCB7XG4gICAgICAgICAgICBuZXh0OiBvcGVuU3ViLFxuICAgICAgICAgICAgcHJldmlvdXM6IGNsb3NlU3ViLFxuICAgICAgICAgICAgZG93bjogbmV4dFNpYmxpbmcsXG4gICAgICAgICAgICB1cDogcHJldlNpYmxpbmdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgRm91bmRhdGlvbi5LZXlib2FyZC5oYW5kbGVLZXkoZSwgJ0Ryb3Bkb3duTWVudScsIGZ1bmN0aW9ucyk7XG5cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGV2ZW50IGhhbmRsZXIgdG8gdGhlIGJvZHkgdG8gY2xvc2UgYW55IGRyb3Bkb3ducyBvbiBhIGNsaWNrLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hZGRCb2R5SGFuZGxlcigpIHtcbiAgICB2YXIgJGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgJGJvZHkub2ZmKCdtb3VzZXVwLnpmLmRyb3Bkb3dubWVudSB0b3VjaGVuZC56Zi5kcm9wZG93bm1lbnUnKVxuICAgICAgICAgLm9uKCdtb3VzZXVwLnpmLmRyb3Bkb3dubWVudSB0b3VjaGVuZC56Zi5kcm9wZG93bm1lbnUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgIHZhciAkbGluayA9IF90aGlzLiRlbGVtZW50LmZpbmQoZS50YXJnZXQpO1xuICAgICAgICAgICBpZiAoJGxpbmsubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgIF90aGlzLl9oaWRlKCk7XG4gICAgICAgICAgICRib2R5Lm9mZignbW91c2V1cC56Zi5kcm9wZG93bm1lbnUgdG91Y2hlbmQuemYuZHJvcGRvd25tZW51Jyk7XG4gICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIGRyb3Bkb3duIHBhbmUsIGFuZCBjaGVja3MgZm9yIGNvbGxpc2lvbnMgZmlyc3QuXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkc3ViIC0gdWwgZWxlbWVudCB0aGF0IGlzIGEgc3VibWVudSB0byBzaG93XG4gICAqIEBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKiBAZmlyZXMgRHJvcGRvd25NZW51I3Nob3dcbiAgICovXG4gIF9zaG93KCRzdWIpIHtcbiAgICB2YXIgaWR4ID0gdGhpcy4kdGFicy5pbmRleCh0aGlzLiR0YWJzLmZpbHRlcihmdW5jdGlvbihpLCBlbCkge1xuICAgICAgcmV0dXJuICQoZWwpLmZpbmQoJHN1YikubGVuZ3RoID4gMDtcbiAgICB9KSk7XG4gICAgdmFyICRzaWJzID0gJHN1Yi5wYXJlbnQoJ2xpLmlzLWRyb3Bkb3duLXN1Ym1lbnUtcGFyZW50Jykuc2libGluZ3MoJ2xpLmlzLWRyb3Bkb3duLXN1Ym1lbnUtcGFyZW50Jyk7XG4gICAgdGhpcy5faGlkZSgkc2licywgaWR4KTtcbiAgICAkc3ViLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKS5hZGRDbGFzcygnanMtZHJvcGRvd24tYWN0aXZlJylcbiAgICAgICAgLnBhcmVudCgnbGkuaXMtZHJvcGRvd24tc3VibWVudS1wYXJlbnQnKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgdmFyIGNsZWFyID0gRm91bmRhdGlvbi5Cb3guSW1Ob3RUb3VjaGluZ1lvdSgkc3ViLCBudWxsLCB0cnVlKTtcbiAgICBpZiAoIWNsZWFyKSB7XG4gICAgICB2YXIgb2xkQ2xhc3MgPSB0aGlzLm9wdGlvbnMuYWxpZ25tZW50ID09PSAnbGVmdCcgPyAnLXJpZ2h0JyA6ICctbGVmdCcsXG4gICAgICAgICAgJHBhcmVudExpID0gJHN1Yi5wYXJlbnQoJy5pcy1kcm9wZG93bi1zdWJtZW51LXBhcmVudCcpO1xuICAgICAgJHBhcmVudExpLnJlbW92ZUNsYXNzKGBvcGVucyR7b2xkQ2xhc3N9YCkuYWRkQ2xhc3MoYG9wZW5zLSR7dGhpcy5vcHRpb25zLmFsaWdubWVudH1gKTtcbiAgICAgIGNsZWFyID0gRm91bmRhdGlvbi5Cb3guSW1Ob3RUb3VjaGluZ1lvdSgkc3ViLCBudWxsLCB0cnVlKTtcbiAgICAgIGlmICghY2xlYXIpIHtcbiAgICAgICAgJHBhcmVudExpLnJlbW92ZUNsYXNzKGBvcGVucy0ke3RoaXMub3B0aW9ucy5hbGlnbm1lbnR9YCkuYWRkQ2xhc3MoJ29wZW5zLWlubmVyJyk7XG4gICAgICB9XG4gICAgICB0aGlzLmNoYW5nZWQgPSB0cnVlO1xuICAgIH1cbiAgICAkc3ViLmNzcygndmlzaWJpbGl0eScsICcnKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNsb3NlT25DbGljaykgeyB0aGlzLl9hZGRCb2R5SGFuZGxlcigpOyB9XG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiB0aGUgbmV3IGRyb3Bkb3duIHBhbmUgaXMgdmlzaWJsZS5cbiAgICAgKiBAZXZlbnQgRHJvcGRvd25NZW51I3Nob3dcbiAgICAgKi9cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3Nob3cuemYuZHJvcGRvd25tZW51JywgWyRzdWJdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlcyBhIHNpbmdsZSwgY3VycmVudGx5IG9wZW4gZHJvcGRvd24gcGFuZSwgaWYgcGFzc2VkIGEgcGFyYW1ldGVyLCBvdGhlcndpc2UsIGhpZGVzIGV2ZXJ5dGhpbmcuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJGVsZW0gLSBlbGVtZW50IHdpdGggYSBzdWJtZW51IHRvIGhpZGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGlkeCAtIGluZGV4IG9mIHRoZSAkdGFicyBjb2xsZWN0aW9uIHRvIGhpZGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9oaWRlKCRlbGVtLCBpZHgpIHtcbiAgICB2YXIgJHRvQ2xvc2U7XG4gICAgaWYgKCRlbGVtICYmICRlbGVtLmxlbmd0aCkge1xuICAgICAgJHRvQ2xvc2UgPSAkZWxlbTtcbiAgICB9IGVsc2UgaWYgKGlkeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAkdG9DbG9zZSA9IHRoaXMuJHRhYnMubm90KGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgIHJldHVybiBpID09PSBpZHg7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkdG9DbG9zZSA9IHRoaXMuJGVsZW1lbnQ7XG4gICAgfVxuICAgIHZhciBzb21ldGhpbmdUb0Nsb3NlID0gJHRvQ2xvc2UuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpIHx8ICR0b0Nsb3NlLmZpbmQoJy5pcy1hY3RpdmUnKS5sZW5ndGggPiAwO1xuXG4gICAgaWYgKHNvbWV0aGluZ1RvQ2xvc2UpIHtcbiAgICAgICR0b0Nsb3NlLmZpbmQoJ2xpLmlzLWFjdGl2ZScpLmFkZCgkdG9DbG9zZSkuYXR0cih7XG4gICAgICAgICdkYXRhLWlzLWNsaWNrJzogZmFsc2VcbiAgICAgIH0pLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgJHRvQ2xvc2UuZmluZCgndWwuanMtZHJvcGRvd24tYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2pzLWRyb3Bkb3duLWFjdGl2ZScpO1xuXG4gICAgICBpZiAodGhpcy5jaGFuZ2VkIHx8ICR0b0Nsb3NlLmZpbmQoJ29wZW5zLWlubmVyJykubGVuZ3RoKSB7XG4gICAgICAgIHZhciBvbGRDbGFzcyA9IHRoaXMub3B0aW9ucy5hbGlnbm1lbnQgPT09ICdsZWZ0JyA/ICdyaWdodCcgOiAnbGVmdCc7XG4gICAgICAgICR0b0Nsb3NlLmZpbmQoJ2xpLmlzLWRyb3Bkb3duLXN1Ym1lbnUtcGFyZW50JykuYWRkKCR0b0Nsb3NlKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhgb3BlbnMtaW5uZXIgb3BlbnMtJHt0aGlzLm9wdGlvbnMuYWxpZ25tZW50fWApXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKGBvcGVucy0ke29sZENsYXNzfWApO1xuICAgICAgICB0aGlzLmNoYW5nZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogRmlyZXMgd2hlbiB0aGUgb3BlbiBtZW51cyBhcmUgY2xvc2VkLlxuICAgICAgICogQGV2ZW50IERyb3Bkb3duTWVudSNoaWRlXG4gICAgICAgKi9cbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignaGlkZS56Zi5kcm9wZG93bm1lbnUnLCBbJHRvQ2xvc2VdKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgdGhlIHBsdWdpbi5cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuJG1lbnVJdGVtcy5vZmYoJy56Zi5kcm9wZG93bm1lbnUnKS5yZW1vdmVBdHRyKCdkYXRhLWlzLWNsaWNrJylcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdpcy1yaWdodC1hcnJvdyBpcy1sZWZ0LWFycm93IGlzLWRvd24tYXJyb3cgb3BlbnMtcmlnaHQgb3BlbnMtbGVmdCBvcGVucy1pbm5lcicpO1xuICAgICQoZG9jdW1lbnQuYm9keSkub2ZmKCcuemYuZHJvcGRvd25tZW51Jyk7XG4gICAgRm91bmRhdGlvbi5OZXN0LkJ1cm4odGhpcy4kZWxlbWVudCwgJ2Ryb3Bkb3duJyk7XG4gICAgRm91bmRhdGlvbi51bnJlZ2lzdGVyUGx1Z2luKHRoaXMpO1xuICB9XG59XG5cbi8qKlxuICogRGVmYXVsdCBzZXR0aW5ncyBmb3IgcGx1Z2luXG4gKi9cbkRyb3Bkb3duTWVudS5kZWZhdWx0cyA9IHtcbiAgLyoqXG4gICAqIERpc2FsbG93cyBob3ZlciBldmVudHMgZnJvbSBvcGVuaW5nIHN1Ym1lbnVzXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBkaXNhYmxlSG92ZXI6IGZhbHNlLFxuICAvKipcbiAgICogQWxsb3cgYSBzdWJtZW51IHRvIGF1dG9tYXRpY2FsbHkgY2xvc2Ugb24gYSBtb3VzZWxlYXZlIGV2ZW50LCBpZiBub3QgY2xpY2tlZCBvcGVuLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBhdXRvY2xvc2U6IHRydWUsXG4gIC8qKlxuICAgKiBBbW91bnQgb2YgdGltZSB0byBkZWxheSBvcGVuaW5nIGEgc3VibWVudSBvbiBob3ZlciBldmVudC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCA1MFxuICAgKi9cbiAgaG92ZXJEZWxheTogNTAsXG4gIC8qKlxuICAgKiBBbGxvdyBhIHN1Ym1lbnUgdG8gb3Blbi9yZW1haW4gb3BlbiBvbiBwYXJlbnQgY2xpY2sgZXZlbnQuIEFsbG93cyBjdXJzb3IgdG8gbW92ZSBhd2F5IGZyb20gbWVudS5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGNsaWNrT3BlbjogZmFsc2UsXG4gIC8qKlxuICAgKiBBbW91bnQgb2YgdGltZSB0byBkZWxheSBjbG9zaW5nIGEgc3VibWVudSBvbiBhIG1vdXNlbGVhdmUgZXZlbnQuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQGRlZmF1bHQgNTAwXG4gICAqL1xuXG4gIGNsb3NpbmdUaW1lOiA1MDAsXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBvZiB0aGUgbWVudSByZWxhdGl2ZSB0byB3aGF0IGRpcmVjdGlvbiB0aGUgc3VibWVudXMgc2hvdWxkIG9wZW4uIEhhbmRsZWQgYnkgSlMuIENhbiBiZSBgJ2xlZnQnYCBvciBgJ3JpZ2h0J2AuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2xlZnQnXG4gICAqL1xuICBhbGlnbm1lbnQ6ICdsZWZ0JyxcbiAgLyoqXG4gICAqIEFsbG93IGNsaWNrcyBvbiB0aGUgYm9keSB0byBjbG9zZSBhbnkgb3BlbiBzdWJtZW51cy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgY2xvc2VPbkNsaWNrOiB0cnVlLFxuICAvKipcbiAgICogQWxsb3cgY2xpY2tzIG9uIGxlYWYgYW5jaG9yIGxpbmtzIHRvIGNsb3NlIGFueSBvcGVuIHN1Ym1lbnVzLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBjbG9zZU9uQ2xpY2tJbnNpZGU6IHRydWUsXG4gIC8qKlxuICAgKiBDbGFzcyBhcHBsaWVkIHRvIHZlcnRpY2FsIG9yaWVudGVkIG1lbnVzLCBGb3VuZGF0aW9uIGRlZmF1bHQgaXMgYHZlcnRpY2FsYC4gVXBkYXRlIHRoaXMgaWYgdXNpbmcgeW91ciBvd24gY2xhc3MuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ3ZlcnRpY2FsJ1xuICAgKi9cbiAgdmVydGljYWxDbGFzczogJ3ZlcnRpY2FsJyxcbiAgLyoqXG4gICAqIENsYXNzIGFwcGxpZWQgdG8gcmlnaHQtc2lkZSBvcmllbnRlZCBtZW51cywgRm91bmRhdGlvbiBkZWZhdWx0IGlzIGBhbGlnbi1yaWdodGAuIFVwZGF0ZSB0aGlzIGlmIHVzaW5nIHlvdXIgb3duIGNsYXNzLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdhbGlnbi1yaWdodCdcbiAgICovXG4gIHJpZ2h0Q2xhc3M6ICdhbGlnbi1yaWdodCcsXG4gIC8qKlxuICAgKiBCb29sZWFuIHRvIGZvcmNlIG92ZXJpZGUgdGhlIGNsaWNraW5nIG9mIGxpbmtzIHRvIHBlcmZvcm0gZGVmYXVsdCBhY3Rpb24sIG9uIHNlY29uZCB0b3VjaCBldmVudCBmb3IgbW9iaWxlLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBmb3JjZUZvbGxvdzogdHJ1ZVxufTtcblxuLy8gV2luZG93IGV4cG9ydHNcbkZvdW5kYXRpb24ucGx1Z2luKERyb3Bkb3duTWVudSwgJ0Ryb3Bkb3duTWVudScpO1xuXG59KGpRdWVyeSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbiFmdW5jdGlvbigkKSB7XG5cbi8qKlxuICogRXF1YWxpemVyIG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi5lcXVhbGl6ZXJcbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwubWVkaWFRdWVyeVxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC50aW1lckFuZEltYWdlTG9hZGVyIGlmIGVxdWFsaXplciBjb250YWlucyBpbWFnZXNcbiAqL1xuXG5jbGFzcyBFcXVhbGl6ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBFcXVhbGl6ZXIuXG4gICAqIEBjbGFzc1xuICAgKiBAZmlyZXMgRXF1YWxpemVyI2luaXRcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgLSBqUXVlcnkgb2JqZWN0IHRvIGFkZCB0aGUgdHJpZ2dlciB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZXMgdG8gdGhlIGRlZmF1bHQgcGx1Z2luIHNldHRpbmdzLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucyl7XG4gICAgdGhpcy4kZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zICA9ICQuZXh0ZW5kKHt9LCBFcXVhbGl6ZXIuZGVmYXVsdHMsIHRoaXMuJGVsZW1lbnQuZGF0YSgpLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2luaXQoKTtcblxuICAgIEZvdW5kYXRpb24ucmVnaXN0ZXJQbHVnaW4odGhpcywgJ0VxdWFsaXplcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBFcXVhbGl6ZXIgcGx1Z2luIGFuZCBjYWxscyBmdW5jdGlvbnMgdG8gZ2V0IGVxdWFsaXplciBmdW5jdGlvbmluZyBvbiBsb2FkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXQoKSB7XG4gICAgdmFyIGVxSWQgPSB0aGlzLiRlbGVtZW50LmF0dHIoJ2RhdGEtZXF1YWxpemVyJykgfHwgJyc7XG4gICAgdmFyICR3YXRjaGVkID0gdGhpcy4kZWxlbWVudC5maW5kKGBbZGF0YS1lcXVhbGl6ZXItd2F0Y2g9XCIke2VxSWR9XCJdYCk7XG5cbiAgICB0aGlzLiR3YXRjaGVkID0gJHdhdGNoZWQubGVuZ3RoID8gJHdhdGNoZWQgOiB0aGlzLiRlbGVtZW50LmZpbmQoJ1tkYXRhLWVxdWFsaXplci13YXRjaF0nKTtcbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2RhdGEtcmVzaXplJywgKGVxSWQgfHwgRm91bmRhdGlvbi5HZXRZb0RpZ2l0cyg2LCAnZXEnKSkpO1xuXHR0aGlzLiRlbGVtZW50LmF0dHIoJ2RhdGEtbXV0YXRlJywgKGVxSWQgfHwgRm91bmRhdGlvbi5HZXRZb0RpZ2l0cyg2LCAnZXEnKSkpO1xuXG4gICAgdGhpcy5oYXNOZXN0ZWQgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ1tkYXRhLWVxdWFsaXplcl0nKS5sZW5ndGggPiAwO1xuICAgIHRoaXMuaXNOZXN0ZWQgPSB0aGlzLiRlbGVtZW50LnBhcmVudHNVbnRpbChkb2N1bWVudC5ib2R5LCAnW2RhdGEtZXF1YWxpemVyXScpLmxlbmd0aCA+IDA7XG4gICAgdGhpcy5pc09uID0gZmFsc2U7XG4gICAgdGhpcy5fYmluZEhhbmRsZXIgPSB7XG4gICAgICBvblJlc2l6ZU1lQm91bmQ6IHRoaXMuX29uUmVzaXplTWUuYmluZCh0aGlzKSxcbiAgICAgIG9uUG9zdEVxdWFsaXplZEJvdW5kOiB0aGlzLl9vblBvc3RFcXVhbGl6ZWQuYmluZCh0aGlzKVxuICAgIH07XG5cbiAgICB2YXIgaW1ncyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnaW1nJyk7XG4gICAgdmFyIHRvb1NtYWxsO1xuICAgIGlmKHRoaXMub3B0aW9ucy5lcXVhbGl6ZU9uKXtcbiAgICAgIHRvb1NtYWxsID0gdGhpcy5fY2hlY2tNUSgpO1xuICAgICAgJCh3aW5kb3cpLm9uKCdjaGFuZ2VkLnpmLm1lZGlhcXVlcnknLCB0aGlzLl9jaGVja01RLmJpbmQodGhpcykpO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5fZXZlbnRzKCk7XG4gICAgfVxuICAgIGlmKCh0b29TbWFsbCAhPT0gdW5kZWZpbmVkICYmIHRvb1NtYWxsID09PSBmYWxzZSkgfHwgdG9vU21hbGwgPT09IHVuZGVmaW5lZCl7XG4gICAgICBpZihpbWdzLmxlbmd0aCl7XG4gICAgICAgIEZvdW5kYXRpb24ub25JbWFnZXNMb2FkZWQoaW1ncywgdGhpcy5fcmVmbG93LmJpbmQodGhpcykpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMuX3JlZmxvdygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGV2ZW50IGxpc3RlbmVycyBpZiB0aGUgYnJlYWtwb2ludCBpcyB0b28gc21hbGwuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcGF1c2VFdmVudHMoKSB7XG4gICAgdGhpcy5pc09uID0gZmFsc2U7XG4gICAgdGhpcy4kZWxlbWVudC5vZmYoe1xuICAgICAgJy56Zi5lcXVhbGl6ZXInOiB0aGlzLl9iaW5kSGFuZGxlci5vblBvc3RFcXVhbGl6ZWRCb3VuZCxcbiAgICAgICdyZXNpemVtZS56Zi50cmlnZ2VyJzogdGhpcy5fYmluZEhhbmRsZXIub25SZXNpemVNZUJvdW5kLFxuXHQgICdtdXRhdGVtZS56Zi50cmlnZ2VyJzogdGhpcy5fYmluZEhhbmRsZXIub25SZXNpemVNZUJvdW5kXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogZnVuY3Rpb24gdG8gaGFuZGxlICRlbGVtZW50cyByZXNpemVtZS56Zi50cmlnZ2VyLCB3aXRoIGJvdW5kIHRoaXMgb24gX2JpbmRIYW5kbGVyLm9uUmVzaXplTWVCb3VuZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uUmVzaXplTWUoZSkge1xuICAgIHRoaXMuX3JlZmxvdygpO1xuICB9XG5cbiAgLyoqXG4gICAqIGZ1bmN0aW9uIHRvIGhhbmRsZSAkZWxlbWVudHMgcG9zdGVxdWFsaXplZC56Zi5lcXVhbGl6ZXIsIHdpdGggYm91bmQgdGhpcyBvbiBfYmluZEhhbmRsZXIub25Qb3N0RXF1YWxpemVkQm91bmRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9vblBvc3RFcXVhbGl6ZWQoZSkge1xuICAgIGlmKGUudGFyZ2V0ICE9PSB0aGlzLiRlbGVtZW50WzBdKXsgdGhpcy5fcmVmbG93KCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBldmVudHMgZm9yIEVxdWFsaXplci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ldmVudHMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB0aGlzLl9wYXVzZUV2ZW50cygpO1xuICAgIGlmKHRoaXMuaGFzTmVzdGVkKXtcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3Bvc3RlcXVhbGl6ZWQuemYuZXF1YWxpemVyJywgdGhpcy5fYmluZEhhbmRsZXIub25Qb3N0RXF1YWxpemVkQm91bmQpO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy4kZWxlbWVudC5vbigncmVzaXplbWUuemYudHJpZ2dlcicsIHRoaXMuX2JpbmRIYW5kbGVyLm9uUmVzaXplTWVCb3VuZCk7XG5cdCAgdGhpcy4kZWxlbWVudC5vbignbXV0YXRlbWUuemYudHJpZ2dlcicsIHRoaXMuX2JpbmRIYW5kbGVyLm9uUmVzaXplTWVCb3VuZCk7XG4gICAgfVxuICAgIHRoaXMuaXNPbiA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRoZSBjdXJyZW50IGJyZWFrcG9pbnQgdG8gdGhlIG1pbmltdW0gcmVxdWlyZWQgc2l6ZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGVja01RKCkge1xuICAgIHZhciB0b29TbWFsbCA9ICFGb3VuZGF0aW9uLk1lZGlhUXVlcnkuaXModGhpcy5vcHRpb25zLmVxdWFsaXplT24pO1xuICAgIGlmKHRvb1NtYWxsKXtcbiAgICAgIGlmKHRoaXMuaXNPbil7XG4gICAgICAgIHRoaXMuX3BhdXNlRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuJHdhdGNoZWQuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgaWYoIXRoaXMuaXNPbil7XG4gICAgICAgIHRoaXMuX2V2ZW50cygpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9vU21hbGw7XG4gIH1cblxuICAvKipcbiAgICogQSBub29wIHZlcnNpb24gZm9yIHRoZSBwbHVnaW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9raWxsc3dpdGNoKCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyBuZWNlc3NhcnkgZnVuY3Rpb25zIHRvIHVwZGF0ZSBFcXVhbGl6ZXIgdXBvbiBET00gY2hhbmdlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcmVmbG93KCkge1xuICAgIGlmKCF0aGlzLm9wdGlvbnMuZXF1YWxpemVPblN0YWNrKXtcbiAgICAgIGlmKHRoaXMuX2lzU3RhY2tlZCgpKXtcbiAgICAgICAgdGhpcy4kd2F0Y2hlZC5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5lcXVhbGl6ZUJ5Um93KSB7XG4gICAgICB0aGlzLmdldEhlaWdodHNCeVJvdyh0aGlzLmFwcGx5SGVpZ2h0QnlSb3cuYmluZCh0aGlzKSk7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLmdldEhlaWdodHModGhpcy5hcHBseUhlaWdodC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFudWFsbHkgZGV0ZXJtaW5lcyBpZiB0aGUgZmlyc3QgMiBlbGVtZW50cyBhcmUgKk5PVCogc3RhY2tlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pc1N0YWNrZWQoKSB7XG4gICAgaWYgKCF0aGlzLiR3YXRjaGVkWzBdIHx8ICF0aGlzLiR3YXRjaGVkWzFdKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuJHdhdGNoZWRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICE9PSB0aGlzLiR3YXRjaGVkWzFdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgb3V0ZXIgaGVpZ2h0cyBvZiBjaGlsZHJlbiBjb250YWluZWQgd2l0aGluIGFuIEVxdWFsaXplciBwYXJlbnQgYW5kIHJldHVybnMgdGhlbSBpbiBhbiBhcnJheVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiAtIEEgbm9uLW9wdGlvbmFsIGNhbGxiYWNrIHRvIHJldHVybiB0aGUgaGVpZ2h0cyBhcnJheSB0by5cbiAgICogQHJldHVybnMge0FycmF5fSBoZWlnaHRzIC0gQW4gYXJyYXkgb2YgaGVpZ2h0cyBvZiBjaGlsZHJlbiB3aXRoaW4gRXF1YWxpemVyIGNvbnRhaW5lclxuICAgKi9cbiAgZ2V0SGVpZ2h0cyhjYikge1xuICAgIHZhciBoZWlnaHRzID0gW107XG4gICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy4kd2F0Y2hlZC5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICB0aGlzLiR3YXRjaGVkW2ldLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgIGhlaWdodHMucHVzaCh0aGlzLiR3YXRjaGVkW2ldLm9mZnNldEhlaWdodCk7XG4gICAgfVxuICAgIGNiKGhlaWdodHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIHRoZSBvdXRlciBoZWlnaHRzIG9mIGNoaWxkcmVuIGNvbnRhaW5lZCB3aXRoaW4gYW4gRXF1YWxpemVyIHBhcmVudCBhbmQgcmV0dXJucyB0aGVtIGluIGFuIGFycmF5XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIC0gQSBub24tb3B0aW9uYWwgY2FsbGJhY2sgdG8gcmV0dXJuIHRoZSBoZWlnaHRzIGFycmF5IHRvLlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IGdyb3VwcyAtIEFuIGFycmF5IG9mIGhlaWdodHMgb2YgY2hpbGRyZW4gd2l0aGluIEVxdWFsaXplciBjb250YWluZXIgZ3JvdXBlZCBieSByb3cgd2l0aCBlbGVtZW50LGhlaWdodCBhbmQgbWF4IGFzIGxhc3QgY2hpbGRcbiAgICovXG4gIGdldEhlaWdodHNCeVJvdyhjYikge1xuICAgIHZhciBsYXN0RWxUb3BPZmZzZXQgPSAodGhpcy4kd2F0Y2hlZC5sZW5ndGggPyB0aGlzLiR3YXRjaGVkLmZpcnN0KCkub2Zmc2V0KCkudG9wIDogMCksXG4gICAgICAgIGdyb3VwcyA9IFtdLFxuICAgICAgICBncm91cCA9IDA7XG4gICAgLy9ncm91cCBieSBSb3dcbiAgICBncm91cHNbZ3JvdXBdID0gW107XG4gICAgZm9yKHZhciBpID0gMCwgbGVuID0gdGhpcy4kd2F0Y2hlZC5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgICB0aGlzLiR3YXRjaGVkW2ldLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgIC8vbWF5YmUgY291bGQgdXNlIHRoaXMuJHdhdGNoZWRbaV0ub2Zmc2V0VG9wXG4gICAgICB2YXIgZWxPZmZzZXRUb3AgPSAkKHRoaXMuJHdhdGNoZWRbaV0pLm9mZnNldCgpLnRvcDtcbiAgICAgIGlmIChlbE9mZnNldFRvcCE9bGFzdEVsVG9wT2Zmc2V0KSB7XG4gICAgICAgIGdyb3VwKys7XG4gICAgICAgIGdyb3Vwc1tncm91cF0gPSBbXTtcbiAgICAgICAgbGFzdEVsVG9wT2Zmc2V0PWVsT2Zmc2V0VG9wO1xuICAgICAgfVxuICAgICAgZ3JvdXBzW2dyb3VwXS5wdXNoKFt0aGlzLiR3YXRjaGVkW2ldLHRoaXMuJHdhdGNoZWRbaV0ub2Zmc2V0SGVpZ2h0XSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaiA9IDAsIGxuID0gZ3JvdXBzLmxlbmd0aDsgaiA8IGxuOyBqKyspIHtcbiAgICAgIHZhciBoZWlnaHRzID0gJChncm91cHNbal0pLm1hcChmdW5jdGlvbigpeyByZXR1cm4gdGhpc1sxXTsgfSkuZ2V0KCk7XG4gICAgICB2YXIgbWF4ICAgICAgICAgPSBNYXRoLm1heC5hcHBseShudWxsLCBoZWlnaHRzKTtcbiAgICAgIGdyb3Vwc1tqXS5wdXNoKG1heCk7XG4gICAgfVxuICAgIGNiKGdyb3Vwcyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlcyB0aGUgQ1NTIGhlaWdodCBwcm9wZXJ0eSBvZiBlYWNoIGNoaWxkIGluIGFuIEVxdWFsaXplciBwYXJlbnQgdG8gbWF0Y2ggdGhlIHRhbGxlc3RcbiAgICogQHBhcmFtIHthcnJheX0gaGVpZ2h0cyAtIEFuIGFycmF5IG9mIGhlaWdodHMgb2YgY2hpbGRyZW4gd2l0aGluIEVxdWFsaXplciBjb250YWluZXJcbiAgICogQGZpcmVzIEVxdWFsaXplciNwcmVlcXVhbGl6ZWRcbiAgICogQGZpcmVzIEVxdWFsaXplciNwb3N0ZXF1YWxpemVkXG4gICAqL1xuICBhcHBseUhlaWdodChoZWlnaHRzKSB7XG4gICAgdmFyIG1heCA9IE1hdGgubWF4LmFwcGx5KG51bGwsIGhlaWdodHMpO1xuICAgIC8qKlxuICAgICAqIEZpcmVzIGJlZm9yZSB0aGUgaGVpZ2h0cyBhcmUgYXBwbGllZFxuICAgICAqIEBldmVudCBFcXVhbGl6ZXIjcHJlZXF1YWxpemVkXG4gICAgICovXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdwcmVlcXVhbGl6ZWQuemYuZXF1YWxpemVyJyk7XG5cbiAgICB0aGlzLiR3YXRjaGVkLmNzcygnaGVpZ2h0JywgbWF4KTtcblxuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gdGhlIGhlaWdodHMgaGF2ZSBiZWVuIGFwcGxpZWRcbiAgICAgKiBAZXZlbnQgRXF1YWxpemVyI3Bvc3RlcXVhbGl6ZWRcbiAgICAgKi9cbiAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdwb3N0ZXF1YWxpemVkLnpmLmVxdWFsaXplcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZXMgdGhlIENTUyBoZWlnaHQgcHJvcGVydHkgb2YgZWFjaCBjaGlsZCBpbiBhbiBFcXVhbGl6ZXIgcGFyZW50IHRvIG1hdGNoIHRoZSB0YWxsZXN0IGJ5IHJvd1xuICAgKiBAcGFyYW0ge2FycmF5fSBncm91cHMgLSBBbiBhcnJheSBvZiBoZWlnaHRzIG9mIGNoaWxkcmVuIHdpdGhpbiBFcXVhbGl6ZXIgY29udGFpbmVyIGdyb3VwZWQgYnkgcm93IHdpdGggZWxlbWVudCxoZWlnaHQgYW5kIG1heCBhcyBsYXN0IGNoaWxkXG4gICAqIEBmaXJlcyBFcXVhbGl6ZXIjcHJlZXF1YWxpemVkXG4gICAqIEBmaXJlcyBFcXVhbGl6ZXIjcHJlZXF1YWxpemVkcm93XG4gICAqIEBmaXJlcyBFcXVhbGl6ZXIjcG9zdGVxdWFsaXplZHJvd1xuICAgKiBAZmlyZXMgRXF1YWxpemVyI3Bvc3RlcXVhbGl6ZWRcbiAgICovXG4gIGFwcGx5SGVpZ2h0QnlSb3coZ3JvdXBzKSB7XG4gICAgLyoqXG4gICAgICogRmlyZXMgYmVmb3JlIHRoZSBoZWlnaHRzIGFyZSBhcHBsaWVkXG4gICAgICovXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdwcmVlcXVhbGl6ZWQuemYuZXF1YWxpemVyJyk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGdyb3Vwcy5sZW5ndGg7IGkgPCBsZW4gOyBpKyspIHtcbiAgICAgIHZhciBncm91cHNJTGVuZ3RoID0gZ3JvdXBzW2ldLmxlbmd0aCxcbiAgICAgICAgICBtYXggPSBncm91cHNbaV1bZ3JvdXBzSUxlbmd0aCAtIDFdO1xuICAgICAgaWYgKGdyb3Vwc0lMZW5ndGg8PTIpIHtcbiAgICAgICAgJChncm91cHNbaV1bMF1bMF0pLmNzcyh7J2hlaWdodCc6J2F1dG8nfSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgICogRmlyZXMgYmVmb3JlIHRoZSBoZWlnaHRzIHBlciByb3cgYXJlIGFwcGxpZWRcbiAgICAgICAgKiBAZXZlbnQgRXF1YWxpemVyI3ByZWVxdWFsaXplZHJvd1xuICAgICAgICAqL1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdwcmVlcXVhbGl6ZWRyb3cuemYuZXF1YWxpemVyJyk7XG4gICAgICBmb3IgKHZhciBqID0gMCwgbGVuSiA9IChncm91cHNJTGVuZ3RoLTEpOyBqIDwgbGVuSiA7IGorKykge1xuICAgICAgICAkKGdyb3Vwc1tpXVtqXVswXSkuY3NzKHsnaGVpZ2h0JzptYXh9KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICAqIEZpcmVzIHdoZW4gdGhlIGhlaWdodHMgcGVyIHJvdyBoYXZlIGJlZW4gYXBwbGllZFxuICAgICAgICAqIEBldmVudCBFcXVhbGl6ZXIjcG9zdGVxdWFsaXplZHJvd1xuICAgICAgICAqL1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdwb3N0ZXF1YWxpemVkcm93LnpmLmVxdWFsaXplcicpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIHRoZSBoZWlnaHRzIGhhdmUgYmVlbiBhcHBsaWVkXG4gICAgICovXG4gICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigncG9zdGVxdWFsaXplZC56Zi5lcXVhbGl6ZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyBhbiBpbnN0YW5jZSBvZiBFcXVhbGl6ZXIuXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9wYXVzZUV2ZW50cygpO1xuICAgIHRoaXMuJHdhdGNoZWQuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuXG4gICAgRm91bmRhdGlvbi51bnJlZ2lzdGVyUGx1Z2luKHRoaXMpO1xuICB9XG59XG5cbi8qKlxuICogRGVmYXVsdCBzZXR0aW5ncyBmb3IgcGx1Z2luXG4gKi9cbkVxdWFsaXplci5kZWZhdWx0cyA9IHtcbiAgLyoqXG4gICAqIEVuYWJsZSBoZWlnaHQgZXF1YWxpemF0aW9uIHdoZW4gc3RhY2tlZCBvbiBzbWFsbGVyIHNjcmVlbnMuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBlcXVhbGl6ZU9uU3RhY2s6IGZhbHNlLFxuICAvKipcbiAgICogRW5hYmxlIGhlaWdodCBlcXVhbGl6YXRpb24gcm93IGJ5IHJvdy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGVxdWFsaXplQnlSb3c6IGZhbHNlLFxuICAvKipcbiAgICogU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgbWluaW11bSBicmVha3BvaW50IHNpemUgdGhlIHBsdWdpbiBzaG91bGQgZXF1YWxpemUgaGVpZ2h0cyBvbi5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnJ1xuICAgKi9cbiAgZXF1YWxpemVPbjogJydcbn07XG5cbi8vIFdpbmRvdyBleHBvcnRzXG5Gb3VuZGF0aW9uLnBsdWdpbihFcXVhbGl6ZXIsICdFcXVhbGl6ZXInKTtcblxufShqUXVlcnkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4hZnVuY3Rpb24oJCkge1xuXG4vKipcbiAqIEludGVyY2hhbmdlIG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi5pbnRlcmNoYW5nZVxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5tZWRpYVF1ZXJ5XG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLnRpbWVyQW5kSW1hZ2VMb2FkZXJcbiAqL1xuXG5jbGFzcyBJbnRlcmNoYW5nZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIEludGVyY2hhbmdlLlxuICAgKiBAY2xhc3NcbiAgICogQGZpcmVzIEludGVyY2hhbmdlI2luaXRcbiAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgLSBqUXVlcnkgb2JqZWN0IHRvIGFkZCB0aGUgdHJpZ2dlciB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZXMgdG8gdGhlIGRlZmF1bHQgcGx1Z2luIHNldHRpbmdzLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBJbnRlcmNoYW5nZS5kZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgdGhpcy5ydWxlcyA9IFtdO1xuICAgIHRoaXMuY3VycmVudFBhdGggPSAnJztcblxuICAgIHRoaXMuX2luaXQoKTtcbiAgICB0aGlzLl9ldmVudHMoKTtcblxuICAgIEZvdW5kYXRpb24ucmVnaXN0ZXJQbHVnaW4odGhpcywgJ0ludGVyY2hhbmdlJyk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIEludGVyY2hhbmdlIHBsdWdpbiBhbmQgY2FsbHMgZnVuY3Rpb25zIHRvIGdldCBpbnRlcmNoYW5nZSBmdW5jdGlvbmluZyBvbiBsb2FkLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0KCkge1xuICAgIHRoaXMuX2FkZEJyZWFrcG9pbnRzKCk7XG4gICAgdGhpcy5fZ2VuZXJhdGVSdWxlcygpO1xuICAgIHRoaXMuX3JlZmxvdygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIGV2ZW50cyBmb3IgSW50ZXJjaGFuZ2UuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V2ZW50cygpIHtcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS56Zi5pbnRlcmNoYW5nZScsIEZvdW5kYXRpb24udXRpbC50aHJvdHRsZSgoKSA9PiB7XG4gICAgICB0aGlzLl9yZWZsb3coKTtcbiAgICB9LCA1MCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIG5lY2Vzc2FyeSBmdW5jdGlvbnMgdG8gdXBkYXRlIEludGVyY2hhbmdlIHVwb24gRE9NIGNoYW5nZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZWZsb3coKSB7XG4gICAgdmFyIG1hdGNoO1xuXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggcnVsZSwgYnV0IG9ubHkgc2F2ZSB0aGUgbGFzdCBtYXRjaFxuICAgIGZvciAodmFyIGkgaW4gdGhpcy5ydWxlcykge1xuICAgICAgaWYodGhpcy5ydWxlcy5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICB2YXIgcnVsZSA9IHRoaXMucnVsZXNbaV07XG4gICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShydWxlLnF1ZXJ5KS5tYXRjaGVzKSB7XG4gICAgICAgICAgbWF0Y2ggPSBydWxlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICB0aGlzLnJlcGxhY2UobWF0Y2gucGF0aCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIEZvdW5kYXRpb24gYnJlYWtwb2ludHMgYW5kIGFkZHMgdGhlbSB0byB0aGUgSW50ZXJjaGFuZ2UuU1BFQ0lBTF9RVUVSSUVTIG9iamVjdC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkQnJlYWtwb2ludHMoKSB7XG4gICAgZm9yICh2YXIgaSBpbiBGb3VuZGF0aW9uLk1lZGlhUXVlcnkucXVlcmllcykge1xuICAgICAgaWYgKEZvdW5kYXRpb24uTWVkaWFRdWVyeS5xdWVyaWVzLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgIHZhciBxdWVyeSA9IEZvdW5kYXRpb24uTWVkaWFRdWVyeS5xdWVyaWVzW2ldO1xuICAgICAgICBJbnRlcmNoYW5nZS5TUEVDSUFMX1FVRVJJRVNbcXVlcnkubmFtZV0gPSBxdWVyeS52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRoZSBJbnRlcmNoYW5nZSBlbGVtZW50IGZvciB0aGUgcHJvdmlkZWQgbWVkaWEgcXVlcnkgKyBjb250ZW50IHBhaXJpbmdzXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCAtIGpRdWVyeSBvYmplY3QgdGhhdCBpcyBhbiBJbnRlcmNoYW5nZSBpbnN0YW5jZVxuICAgKiBAcmV0dXJucyB7QXJyYXl9IHNjZW5hcmlvcyAtIEFycmF5IG9mIG9iamVjdHMgdGhhdCBoYXZlICdtcScgYW5kICdwYXRoJyBrZXlzIHdpdGggY29ycmVzcG9uZGluZyBrZXlzXG4gICAqL1xuICBfZ2VuZXJhdGVSdWxlcyhlbGVtZW50KSB7XG4gICAgdmFyIHJ1bGVzTGlzdCA9IFtdO1xuICAgIHZhciBydWxlcztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucnVsZXMpIHtcbiAgICAgIHJ1bGVzID0gdGhpcy5vcHRpb25zLnJ1bGVzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJ1bGVzID0gdGhpcy4kZWxlbWVudC5kYXRhKCdpbnRlcmNoYW5nZScpO1xuICAgIH1cbiAgICBcbiAgICBydWxlcyA9ICB0eXBlb2YgcnVsZXMgPT09ICdzdHJpbmcnID8gcnVsZXMubWF0Y2goL1xcWy4qP1xcXS9nKSA6IHJ1bGVzO1xuXG4gICAgZm9yICh2YXIgaSBpbiBydWxlcykge1xuICAgICAgaWYocnVsZXMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgdmFyIHJ1bGUgPSBydWxlc1tpXS5zbGljZSgxLCAtMSkuc3BsaXQoJywgJyk7XG4gICAgICAgIHZhciBwYXRoID0gcnVsZS5zbGljZSgwLCAtMSkuam9pbignJyk7XG4gICAgICAgIHZhciBxdWVyeSA9IHJ1bGVbcnVsZS5sZW5ndGggLSAxXTtcblxuICAgICAgICBpZiAoSW50ZXJjaGFuZ2UuU1BFQ0lBTF9RVUVSSUVTW3F1ZXJ5XSkge1xuICAgICAgICAgIHF1ZXJ5ID0gSW50ZXJjaGFuZ2UuU1BFQ0lBTF9RVUVSSUVTW3F1ZXJ5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJ1bGVzTGlzdC5wdXNoKHtcbiAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgIHF1ZXJ5OiBxdWVyeVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnJ1bGVzID0gcnVsZXNMaXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgYHNyY2AgcHJvcGVydHkgb2YgYW4gaW1hZ2UsIG9yIGNoYW5nZSB0aGUgSFRNTCBvZiBhIGNvbnRhaW5lciwgdG8gdGhlIHNwZWNpZmllZCBwYXRoLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBQYXRoIHRvIHRoZSBpbWFnZSBvciBIVE1MIHBhcnRpYWwuXG4gICAqIEBmaXJlcyBJbnRlcmNoYW5nZSNyZXBsYWNlZFxuICAgKi9cbiAgcmVwbGFjZShwYXRoKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFBhdGggPT09IHBhdGgpIHJldHVybjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgIHRyaWdnZXIgPSAncmVwbGFjZWQuemYuaW50ZXJjaGFuZ2UnO1xuXG4gICAgLy8gUmVwbGFjaW5nIGltYWdlc1xuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdLm5vZGVOYW1lID09PSAnSU1HJykge1xuICAgICAgdGhpcy4kZWxlbWVudC5hdHRyKCdzcmMnLCBwYXRoKS5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5jdXJyZW50UGF0aCA9IHBhdGg7XG4gICAgICB9KVxuICAgICAgLnRyaWdnZXIodHJpZ2dlcik7XG4gICAgfVxuICAgIC8vIFJlcGxhY2luZyBiYWNrZ3JvdW5kIGltYWdlc1xuICAgIGVsc2UgaWYgKHBhdGgubWF0Y2goL1xcLihnaWZ8anBnfGpwZWd8cG5nfHN2Z3x0aWZmKShbPyNdLiopPy9pKSkge1xuICAgICAgdGhpcy4kZWxlbWVudC5jc3MoeyAnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoJytwYXRoKycpJyB9KVxuICAgICAgICAgIC50cmlnZ2VyKHRyaWdnZXIpO1xuICAgIH1cbiAgICAvLyBSZXBsYWNpbmcgSFRNTFxuICAgIGVsc2Uge1xuICAgICAgJC5nZXQocGF0aCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgX3RoaXMuJGVsZW1lbnQuaHRtbChyZXNwb25zZSlcbiAgICAgICAgICAgICAudHJpZ2dlcih0cmlnZ2VyKTtcbiAgICAgICAgJChyZXNwb25zZSkuZm91bmRhdGlvbigpO1xuICAgICAgICBfdGhpcy5jdXJyZW50UGF0aCA9IHBhdGg7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIGNvbnRlbnQgaW4gYW4gSW50ZXJjaGFuZ2UgZWxlbWVudCBpcyBkb25lIGJlaW5nIGxvYWRlZC5cbiAgICAgKiBAZXZlbnQgSW50ZXJjaGFuZ2UjcmVwbGFjZWRcbiAgICAgKi9cbiAgICAvLyB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3JlcGxhY2VkLnpmLmludGVyY2hhbmdlJyk7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgYW4gaW5zdGFuY2Ugb2YgaW50ZXJjaGFuZ2UuXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvL1RPRE8gdGhpcy5cbiAgfVxufVxuXG4vKipcbiAqIERlZmF1bHQgc2V0dGluZ3MgZm9yIHBsdWdpblxuICovXG5JbnRlcmNoYW5nZS5kZWZhdWx0cyA9IHtcbiAgLyoqXG4gICAqIFJ1bGVzIHRvIGJlIGFwcGxpZWQgdG8gSW50ZXJjaGFuZ2UgZWxlbWVudHMuIFNldCB3aXRoIHRoZSBgZGF0YS1pbnRlcmNoYW5nZWAgYXJyYXkgbm90YXRpb24uXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUgez9hcnJheX1cbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgcnVsZXM6IG51bGxcbn07XG5cbkludGVyY2hhbmdlLlNQRUNJQUxfUVVFUklFUyA9IHtcbiAgJ2xhbmRzY2FwZSc6ICdzY3JlZW4gYW5kIChvcmllbnRhdGlvbjogbGFuZHNjYXBlKScsXG4gICdwb3J0cmFpdCc6ICdzY3JlZW4gYW5kIChvcmllbnRhdGlvbjogcG9ydHJhaXQpJyxcbiAgJ3JldGluYSc6ICdvbmx5IHNjcmVlbiBhbmQgKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMiksIG9ubHkgc2NyZWVuIGFuZCAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSwgb25seSBzY3JlZW4gYW5kICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyLzEpLCBvbmx5IHNjcmVlbiBhbmQgKG1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLCBvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAxOTJkcGkpLCBvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAyZHBweCknXG59O1xuXG4vLyBXaW5kb3cgZXhwb3J0c1xuRm91bmRhdGlvbi5wbHVnaW4oSW50ZXJjaGFuZ2UsICdJbnRlcmNoYW5nZScpO1xuXG59KGpRdWVyeSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbiFmdW5jdGlvbigkKSB7XG5cbi8qKlxuICogTWFnZWxsYW4gbW9kdWxlLlxuICogQG1vZHVsZSBmb3VuZGF0aW9uLm1hZ2VsbGFuXG4gKi9cblxuY2xhc3MgTWFnZWxsYW4ge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBNYWdlbGxhbi5cbiAgICogQGNsYXNzXG4gICAqIEBmaXJlcyBNYWdlbGxhbiNpbml0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IC0galF1ZXJ5IG9iamVjdCB0byBhZGQgdGhlIHRyaWdnZXIgdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGVzIHRvIHRoZSBkZWZhdWx0IHBsdWdpbiBzZXR0aW5ncy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgID0gJC5leHRlbmQoe30sIE1hZ2VsbGFuLmRlZmF1bHRzLCB0aGlzLiRlbGVtZW50LmRhdGEoKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gICAgdGhpcy5jYWxjUG9pbnRzKCk7XG5cbiAgICBGb3VuZGF0aW9uLnJlZ2lzdGVyUGx1Z2luKHRoaXMsICdNYWdlbGxhbicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBNYWdlbGxhbiBwbHVnaW4gYW5kIGNhbGxzIGZ1bmN0aW9ucyB0byBnZXQgZXF1YWxpemVyIGZ1bmN0aW9uaW5nIG9uIGxvYWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdCgpIHtcbiAgICB2YXIgaWQgPSB0aGlzLiRlbGVtZW50WzBdLmlkIHx8IEZvdW5kYXRpb24uR2V0WW9EaWdpdHMoNiwgJ21hZ2VsbGFuJyk7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB0aGlzLiR0YXJnZXRzID0gJCgnW2RhdGEtbWFnZWxsYW4tdGFyZ2V0XScpO1xuICAgIHRoaXMuJGxpbmtzID0gdGhpcy4kZWxlbWVudC5maW5kKCdhJyk7XG4gICAgdGhpcy4kZWxlbWVudC5hdHRyKHtcbiAgICAgICdkYXRhLXJlc2l6ZSc6IGlkLFxuICAgICAgJ2RhdGEtc2Nyb2xsJzogaWQsXG4gICAgICAnaWQnOiBpZFxuICAgIH0pO1xuICAgIHRoaXMuJGFjdGl2ZSA9ICQoKTtcbiAgICB0aGlzLnNjcm9sbFBvcyA9IHBhcnNlSW50KHdpbmRvdy5wYWdlWU9mZnNldCwgMTApO1xuXG4gICAgdGhpcy5fZXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbiBhcnJheSBvZiBwaXhlbCB2YWx1ZXMgdGhhdCBhcmUgdGhlIGRlbWFyY2F0aW9uIGxpbmVzIGJldHdlZW4gbG9jYXRpb25zIG9uIHRoZSBwYWdlLlxuICAgKiBDYW4gYmUgaW52b2tlZCBpZiBuZXcgZWxlbWVudHMgYXJlIGFkZGVkIG9yIHRoZSBzaXplIG9mIGEgbG9jYXRpb24gY2hhbmdlcy5cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBjYWxjUG9pbnRzKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgIGJvZHkgPSBkb2N1bWVudC5ib2R5LFxuICAgICAgICBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgdGhpcy5wb2ludHMgPSBbXTtcbiAgICB0aGlzLndpbkhlaWdodCA9IE1hdGgucm91bmQoTWF0aC5tYXgod2luZG93LmlubmVySGVpZ2h0LCBodG1sLmNsaWVudEhlaWdodCkpO1xuICAgIHRoaXMuZG9jSGVpZ2h0ID0gTWF0aC5yb3VuZChNYXRoLm1heChib2R5LnNjcm9sbEhlaWdodCwgYm9keS5vZmZzZXRIZWlnaHQsIGh0bWwuY2xpZW50SGVpZ2h0LCBodG1sLnNjcm9sbEhlaWdodCwgaHRtbC5vZmZzZXRIZWlnaHQpKTtcblxuICAgIHRoaXMuJHRhcmdldHMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgdmFyICR0YXIgPSAkKHRoaXMpLFxuICAgICAgICAgIHB0ID0gTWF0aC5yb3VuZCgkdGFyLm9mZnNldCgpLnRvcCAtIF90aGlzLm9wdGlvbnMudGhyZXNob2xkKTtcbiAgICAgICR0YXIudGFyZ2V0UG9pbnQgPSBwdDtcbiAgICAgIF90aGlzLnBvaW50cy5wdXNoKHB0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBldmVudHMgZm9yIE1hZ2VsbGFuLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V2ZW50cygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAkYm9keSA9ICQoJ2h0bWwsIGJvZHknKSxcbiAgICAgICAgb3B0cyA9IHtcbiAgICAgICAgICBkdXJhdGlvbjogX3RoaXMub3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbixcbiAgICAgICAgICBlYXNpbmc6ICAgX3RoaXMub3B0aW9ucy5hbmltYXRpb25FYXNpbmdcbiAgICAgICAgfTtcbiAgICAkKHdpbmRvdykub25lKCdsb2FkJywgZnVuY3Rpb24oKXtcbiAgICAgIGlmKF90aGlzLm9wdGlvbnMuZGVlcExpbmtpbmcpe1xuICAgICAgICBpZihsb2NhdGlvbi5oYXNoKXtcbiAgICAgICAgICBfdGhpcy5zY3JvbGxUb0xvYyhsb2NhdGlvbi5oYXNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgX3RoaXMuY2FsY1BvaW50cygpO1xuICAgICAgX3RoaXMuX3VwZGF0ZUFjdGl2ZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kZWxlbWVudC5vbih7XG4gICAgICAncmVzaXplbWUuemYudHJpZ2dlcic6IHRoaXMucmVmbG93LmJpbmQodGhpcyksXG4gICAgICAnc2Nyb2xsbWUuemYudHJpZ2dlcic6IHRoaXMuX3VwZGF0ZUFjdGl2ZS5iaW5kKHRoaXMpXG4gICAgfSkub24oJ2NsaWNrLnpmLm1hZ2VsbGFuJywgJ2FbaHJlZl49XCIjXCJdJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBhcnJpdmFsICAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgICAgICBfdGhpcy5zY3JvbGxUb0xvYyhhcnJpdmFsKTtcbiAgICAgIH0pO1xuICAgICQod2luZG93KS5vbigncG9wc3RhdGUnLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZihfdGhpcy5vcHRpb25zLmRlZXBMaW5raW5nKSB7XG4gICAgICAgIF90aGlzLnNjcm9sbFRvTG9jKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byBzY3JvbGwgdG8gYSBnaXZlbiBsb2NhdGlvbiBvbiB0aGUgcGFnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxvYyAtIGEgcHJvcGVybHkgZm9ybWF0dGVkIGpRdWVyeSBpZCBzZWxlY3Rvci4gRXhhbXBsZTogJyNmb28nXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgc2Nyb2xsVG9Mb2MobG9jKSB7XG4gICAgLy8gRG8gbm90aGluZyBpZiB0YXJnZXQgZG9lcyBub3QgZXhpc3QgdG8gcHJldmVudCBlcnJvcnNcbiAgICBpZiAoISQobG9jKS5sZW5ndGgpIHtyZXR1cm4gZmFsc2U7fVxuICAgIHRoaXMuX2luVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgc2Nyb2xsUG9zID0gTWF0aC5yb3VuZCgkKGxvYykub2Zmc2V0KCkudG9wIC0gdGhpcy5vcHRpb25zLnRocmVzaG9sZCAvIDIgLSB0aGlzLm9wdGlvbnMuYmFyT2Zmc2V0KTtcblxuICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKHRydWUpLmFuaW1hdGUoXG4gICAgICB7IHNjcm9sbFRvcDogc2Nyb2xsUG9zIH0sXG4gICAgICB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb24sXG4gICAgICB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uRWFzaW5nLFxuICAgICAgZnVuY3Rpb24oKSB7X3RoaXMuX2luVHJhbnNpdGlvbiA9IGZhbHNlOyBfdGhpcy5fdXBkYXRlQWN0aXZlKCl9XG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyBuZWNlc3NhcnkgZnVuY3Rpb25zIHRvIHVwZGF0ZSBNYWdlbGxhbiB1cG9uIERPTSBjaGFuZ2VcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICByZWZsb3coKSB7XG4gICAgdGhpcy5jYWxjUG9pbnRzKCk7XG4gICAgdGhpcy5fdXBkYXRlQWN0aXZlKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmlzaWJpbGl0eSBvZiBhbiBhY3RpdmUgbG9jYXRpb24gbGluaywgYW5kIHVwZGF0ZXMgdGhlIHVybCBoYXNoIGZvciB0aGUgcGFnZSwgaWYgZGVlcExpbmtpbmcgZW5hYmxlZC5cbiAgICogQHByaXZhdGVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBmaXJlcyBNYWdlbGxhbiN1cGRhdGVcbiAgICovXG4gIF91cGRhdGVBY3RpdmUoLypldnQsIGVsZW0sIHNjcm9sbFBvcyovKSB7XG4gICAgaWYodGhpcy5faW5UcmFuc2l0aW9uKSB7cmV0dXJuO31cbiAgICB2YXIgd2luUG9zID0gLypzY3JvbGxQb3MgfHwqLyBwYXJzZUludCh3aW5kb3cucGFnZVlPZmZzZXQsIDEwKSxcbiAgICAgICAgY3VySWR4O1xuXG4gICAgaWYod2luUG9zICsgdGhpcy53aW5IZWlnaHQgPT09IHRoaXMuZG9jSGVpZ2h0KXsgY3VySWR4ID0gdGhpcy5wb2ludHMubGVuZ3RoIC0gMTsgfVxuICAgIGVsc2UgaWYod2luUG9zIDwgdGhpcy5wb2ludHNbMF0peyBjdXJJZHggPSB1bmRlZmluZWQ7IH1cbiAgICBlbHNle1xuICAgICAgdmFyIGlzRG93biA9IHRoaXMuc2Nyb2xsUG9zIDwgd2luUG9zLFxuICAgICAgICAgIF90aGlzID0gdGhpcyxcbiAgICAgICAgICBjdXJWaXNpYmxlID0gdGhpcy5wb2ludHMuZmlsdGVyKGZ1bmN0aW9uKHAsIGkpe1xuICAgICAgICAgICAgcmV0dXJuIGlzRG93biA/IHAgLSBfdGhpcy5vcHRpb25zLmJhck9mZnNldCA8PSB3aW5Qb3MgOiBwIC0gX3RoaXMub3B0aW9ucy5iYXJPZmZzZXQgLSBfdGhpcy5vcHRpb25zLnRocmVzaG9sZCA8PSB3aW5Qb3M7XG4gICAgICAgICAgfSk7XG4gICAgICBjdXJJZHggPSBjdXJWaXNpYmxlLmxlbmd0aCA/IGN1clZpc2libGUubGVuZ3RoIC0gMSA6IDA7XG4gICAgfVxuXG4gICAgdGhpcy4kYWN0aXZlLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcyk7XG4gICAgdGhpcy4kYWN0aXZlID0gdGhpcy4kbGlua3MuZmlsdGVyKCdbaHJlZj1cIiMnICsgdGhpcy4kdGFyZ2V0cy5lcShjdXJJZHgpLmRhdGEoJ21hZ2VsbGFuLXRhcmdldCcpICsgJ1wiXScpLmFkZENsYXNzKHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcyk7XG5cbiAgICBpZih0aGlzLm9wdGlvbnMuZGVlcExpbmtpbmcpe1xuICAgICAgdmFyIGhhc2ggPSBcIlwiO1xuICAgICAgaWYoY3VySWR4ICE9IHVuZGVmaW5lZCl7XG4gICAgICAgIGhhc2ggPSB0aGlzLiRhY3RpdmVbMF0uZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICB9XG4gICAgICBpZihoYXNoICE9PSB3aW5kb3cubG9jYXRpb24uaGFzaCkge1xuICAgICAgICBpZih3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpe1xuICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBudWxsLCBoYXNoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBoYXNoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zY3JvbGxQb3MgPSB3aW5Qb3M7XG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiBtYWdlbGxhbiBpcyBmaW5pc2hlZCB1cGRhdGluZyB0byB0aGUgbmV3IGFjdGl2ZSBlbGVtZW50LlxuICAgICAqIEBldmVudCBNYWdlbGxhbiN1cGRhdGVcbiAgICAgKi9cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ3VwZGF0ZS56Zi5tYWdlbGxhbicsIFt0aGlzLiRhY3RpdmVdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyBhbiBpbnN0YW5jZSBvZiBNYWdlbGxhbiBhbmQgcmVzZXRzIHRoZSB1cmwgb2YgdGhlIHdpbmRvdy5cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuJGVsZW1lbnQub2ZmKCcuemYudHJpZ2dlciAuemYubWFnZWxsYW4nKVxuICAgICAgICAuZmluZChgLiR7dGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzfWApLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcyk7XG5cbiAgICBpZih0aGlzLm9wdGlvbnMuZGVlcExpbmtpbmcpe1xuICAgICAgdmFyIGhhc2ggPSB0aGlzLiRhY3RpdmVbMF0uZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKGhhc2gsICcnKTtcbiAgICB9XG5cbiAgICBGb3VuZGF0aW9uLnVucmVnaXN0ZXJQbHVnaW4odGhpcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZhdWx0IHNldHRpbmdzIGZvciBwbHVnaW5cbiAqL1xuTWFnZWxsYW4uZGVmYXVsdHMgPSB7XG4gIC8qKlxuICAgKiBBbW91bnQgb2YgdGltZSwgaW4gbXMsIHRoZSBhbmltYXRlZCBzY3JvbGxpbmcgc2hvdWxkIHRha2UgYmV0d2VlbiBsb2NhdGlvbnMuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQGRlZmF1bHQgNTAwXG4gICAqL1xuICBhbmltYXRpb25EdXJhdGlvbjogNTAwLFxuICAvKipcbiAgICogQW5pbWF0aW9uIHN0eWxlIHRvIHVzZSB3aGVuIHNjcm9sbGluZyBiZXR3ZWVuIGxvY2F0aW9ucy4gQ2FuIGJlIGAnc3dpbmcnYCBvciBgJ2xpbmVhcidgLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdsaW5lYXInXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vYXBpLmpxdWVyeS5jb20vYW5pbWF0ZXxKcXVlcnkgYW5pbWF0ZX1cbiAgICovXG4gIGFuaW1hdGlvbkVhc2luZzogJ2xpbmVhcicsXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgcGl4ZWxzIHRvIHVzZSBhcyBhIG1hcmtlciBmb3IgbG9jYXRpb24gY2hhbmdlcy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCA1MFxuICAgKi9cbiAgdGhyZXNob2xkOiA1MCxcbiAgLyoqXG4gICAqIENsYXNzIGFwcGxpZWQgdG8gdGhlIGFjdGl2ZSBsb2NhdGlvbnMgbGluayBvbiB0aGUgbWFnZWxsYW4gY29udGFpbmVyLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdhY3RpdmUnXG4gICAqL1xuICBhY3RpdmVDbGFzczogJ2FjdGl2ZScsXG4gIC8qKlxuICAgKiBBbGxvd3MgdGhlIHNjcmlwdCB0byBtYW5pcHVsYXRlIHRoZSB1cmwgb2YgdGhlIGN1cnJlbnQgcGFnZSwgYW5kIGlmIHN1cHBvcnRlZCwgYWx0ZXIgdGhlIGhpc3RvcnkuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBkZWVwTGlua2luZzogZmFsc2UsXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgcGl4ZWxzIHRvIG9mZnNldCB0aGUgc2Nyb2xsIG9mIHRoZSBwYWdlIG9uIGl0ZW0gY2xpY2sgaWYgdXNpbmcgYSBzdGlja3kgbmF2IGJhci5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICBiYXJPZmZzZXQ6IDBcbn1cblxuLy8gV2luZG93IGV4cG9ydHNcbkZvdW5kYXRpb24ucGx1Z2luKE1hZ2VsbGFuLCAnTWFnZWxsYW4nKTtcblxufShqUXVlcnkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4hZnVuY3Rpb24oJCkge1xuXG4vKipcbiAqIE9mZkNhbnZhcyBtb2R1bGUuXG4gKiBAbW9kdWxlIGZvdW5kYXRpb24ub2ZmY2FudmFzXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLmtleWJvYXJkXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLm1lZGlhUXVlcnlcbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwudHJpZ2dlcnNcbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwubW90aW9uXG4gKi9cblxuY2xhc3MgT2ZmQ2FudmFzIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgYW4gb2ZmLWNhbnZhcyB3cmFwcGVyLlxuICAgKiBAY2xhc3NcbiAgICogQGZpcmVzIE9mZkNhbnZhcyNpbml0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IC0galF1ZXJ5IG9iamVjdCB0byBpbml0aWFsaXplLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlcyB0byB0aGUgZGVmYXVsdCBwbHVnaW4gc2V0dGluZ3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIE9mZkNhbnZhcy5kZWZhdWx0cywgdGhpcy4kZWxlbWVudC5kYXRhKCksIG9wdGlvbnMpO1xuICAgIHRoaXMuJGxhc3RUcmlnZ2VyID0gJCgpO1xuICAgIHRoaXMuJHRyaWdnZXJzID0gJCgpO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICAgIHRoaXMuX2V2ZW50cygpO1xuXG4gICAgRm91bmRhdGlvbi5yZWdpc3RlclBsdWdpbih0aGlzLCAnT2ZmQ2FudmFzJylcbiAgICBGb3VuZGF0aW9uLktleWJvYXJkLnJlZ2lzdGVyKCdPZmZDYW52YXMnLCB7XG4gICAgICAnRVNDQVBFJzogJ2Nsb3NlJ1xuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIG9mZi1jYW52YXMgd3JhcHBlciBieSBhZGRpbmcgdGhlIGV4aXQgb3ZlcmxheSAoaWYgbmVlZGVkKS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdCgpIHtcbiAgICB2YXIgaWQgPSB0aGlzLiRlbGVtZW50LmF0dHIoJ2lkJyk7XG5cbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoYGlzLXRyYW5zaXRpb24tJHt0aGlzLm9wdGlvbnMudHJhbnNpdGlvbn1gKTtcblxuICAgIC8vIEZpbmQgdHJpZ2dlcnMgdGhhdCBhZmZlY3QgdGhpcyBlbGVtZW50IGFuZCBhZGQgYXJpYS1leHBhbmRlZCB0byB0aGVtXG4gICAgdGhpcy4kdHJpZ2dlcnMgPSAkKGRvY3VtZW50KVxuICAgICAgLmZpbmQoJ1tkYXRhLW9wZW49XCInK2lkKydcIl0sIFtkYXRhLWNsb3NlPVwiJytpZCsnXCJdLCBbZGF0YS10b2dnbGU9XCInK2lkKydcIl0nKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxuICAgICAgLmF0dHIoJ2FyaWEtY29udHJvbHMnLCBpZCk7XG5cbiAgICAvLyBBZGQgYW4gb3ZlcmxheSBvdmVyIHRoZSBjb250ZW50IGlmIG5lY2Vzc2FyeVxuICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGVudE92ZXJsYXkgPT09IHRydWUpIHtcbiAgICAgIHZhciBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB2YXIgb3ZlcmxheVBvc2l0aW9uID0gJCh0aGlzLiRlbGVtZW50KS5jc3MoXCJwb3NpdGlvblwiKSA9PT0gJ2ZpeGVkJyA/ICdpcy1vdmVybGF5LWZpeGVkJyA6ICdpcy1vdmVybGF5LWFic29sdXRlJztcbiAgICAgIG92ZXJsYXkuc2V0QXR0cmlidXRlKCdjbGFzcycsICdqcy1vZmYtY2FudmFzLW92ZXJsYXkgJyArIG92ZXJsYXlQb3NpdGlvbik7XG4gICAgICB0aGlzLiRvdmVybGF5ID0gJChvdmVybGF5KTtcbiAgICAgIGlmKG92ZXJsYXlQb3NpdGlvbiA9PT0gJ2lzLW92ZXJsYXktZml4ZWQnKSB7XG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQodGhpcy4kb3ZlcmxheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRlbGVtZW50LnNpYmxpbmdzKCdbZGF0YS1vZmYtY2FudmFzLWNvbnRlbnRdJykuYXBwZW5kKHRoaXMuJG92ZXJsYXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucy5pc1JldmVhbGVkID0gdGhpcy5vcHRpb25zLmlzUmV2ZWFsZWQgfHwgbmV3IFJlZ0V4cCh0aGlzLm9wdGlvbnMucmV2ZWFsQ2xhc3MsICdnJykudGVzdCh0aGlzLiRlbGVtZW50WzBdLmNsYXNzTmFtZSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmlzUmV2ZWFsZWQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5yZXZlYWxPbiA9IHRoaXMub3B0aW9ucy5yZXZlYWxPbiB8fCB0aGlzLiRlbGVtZW50WzBdLmNsYXNzTmFtZS5tYXRjaCgvKHJldmVhbC1mb3ItbWVkaXVtfHJldmVhbC1mb3ItbGFyZ2UpL2cpWzBdLnNwbGl0KCctJylbMl07XG4gICAgICB0aGlzLl9zZXRNUUNoZWNrZXIoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMudHJhbnNpdGlvblRpbWUgPT09IHRydWUpIHtcbiAgICAgIHRoaXMub3B0aW9ucy50cmFuc2l0aW9uVGltZSA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoJCgnW2RhdGEtb2ZmLWNhbnZhc10nKVswXSkudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIG9mZi1jYW52YXMgd3JhcHBlciBhbmQgdGhlIGV4aXQgb3ZlcmxheS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXZlbnRzKCkge1xuICAgIHRoaXMuJGVsZW1lbnQub2ZmKCcuemYudHJpZ2dlciAuemYub2ZmY2FudmFzJykub24oe1xuICAgICAgJ29wZW4uemYudHJpZ2dlcic6IHRoaXMub3Blbi5iaW5kKHRoaXMpLFxuICAgICAgJ2Nsb3NlLnpmLnRyaWdnZXInOiB0aGlzLmNsb3NlLmJpbmQodGhpcyksXG4gICAgICAndG9nZ2xlLnpmLnRyaWdnZXInOiB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpLFxuICAgICAgJ2tleWRvd24uemYub2ZmY2FudmFzJzogdGhpcy5faGFuZGxlS2V5Ym9hcmQuYmluZCh0aGlzKVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jbG9zZU9uQ2xpY2sgPT09IHRydWUpIHtcbiAgICAgIHZhciAkdGFyZ2V0ID0gdGhpcy5vcHRpb25zLmNvbnRlbnRPdmVybGF5ID8gdGhpcy4kb3ZlcmxheSA6ICQoJ1tkYXRhLW9mZi1jYW52YXMtY29udGVudF0nKTtcbiAgICAgICR0YXJnZXQub24oeydjbGljay56Zi5vZmZjYW52YXMnOiB0aGlzLmNsb3NlLmJpbmQodGhpcyl9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBldmVudCBsaXN0ZW5lciBmb3IgZWxlbWVudHMgdGhhdCB3aWxsIHJldmVhbCBhdCBjZXJ0YWluIGJyZWFrcG9pbnRzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3NldE1RQ2hlY2tlcigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdjaGFuZ2VkLnpmLm1lZGlhcXVlcnknLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChGb3VuZGF0aW9uLk1lZGlhUXVlcnkuYXRMZWFzdChfdGhpcy5vcHRpb25zLnJldmVhbE9uKSkge1xuICAgICAgICBfdGhpcy5yZXZlYWwodHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpcy5yZXZlYWwoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pLm9uZSgnbG9hZC56Zi5vZmZjYW52YXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChGb3VuZGF0aW9uLk1lZGlhUXVlcnkuYXRMZWFzdChfdGhpcy5vcHRpb25zLnJldmVhbE9uKSkge1xuICAgICAgICBfdGhpcy5yZXZlYWwodHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgcmV2ZWFsaW5nL2hpZGluZyB0aGUgb2ZmLWNhbnZhcyBhdCBicmVha3BvaW50cywgbm90IHRoZSBzYW1lIGFzIG9wZW4uXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNSZXZlYWxlZCAtIHRydWUgaWYgZWxlbWVudCBzaG91bGQgYmUgcmV2ZWFsZWQuXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgcmV2ZWFsKGlzUmV2ZWFsZWQpIHtcbiAgICB2YXIgJGNsb3NlciA9IHRoaXMuJGVsZW1lbnQuZmluZCgnW2RhdGEtY2xvc2VdJyk7XG4gICAgaWYgKGlzUmV2ZWFsZWQpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIHRoaXMuaXNSZXZlYWxlZCA9IHRydWU7XG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZignb3Blbi56Zi50cmlnZ2VyIHRvZ2dsZS56Zi50cmlnZ2VyJyk7XG4gICAgICBpZiAoJGNsb3Nlci5sZW5ndGgpIHsgJGNsb3Nlci5oaWRlKCk7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pc1JldmVhbGVkID0gZmFsc2U7XG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oe1xuICAgICAgICAnb3Blbi56Zi50cmlnZ2VyJzogdGhpcy5vcGVuLmJpbmQodGhpcyksXG4gICAgICAgICd0b2dnbGUuemYudHJpZ2dlcic6IHRoaXMudG9nZ2xlLmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgICAgaWYgKCRjbG9zZXIubGVuZ3RoKSB7XG4gICAgICAgICRjbG9zZXIuc2hvdygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wcyBzY3JvbGxpbmcgb2YgdGhlIGJvZHkgd2hlbiBvZmZjYW52YXMgaXMgb3BlbiBvbiBtb2JpbGUgU2FmYXJpIGFuZCBvdGhlciB0cm91Ymxlc29tZSBicm93c2Vycy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zdG9wU2Nyb2xsaW5nKGV2ZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gVGFrZW4gYW5kIGFkYXB0ZWQgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE2ODg5NDQ3L3ByZXZlbnQtZnVsbC1wYWdlLXNjcm9sbGluZy1pb3NcbiAgLy8gT25seSByZWFsbHkgd29ya3MgZm9yIHksIG5vdCBzdXJlIGhvdyB0byBleHRlbmQgdG8geCBvciBpZiB3ZSBuZWVkIHRvLlxuICBfcmVjb3JkU2Nyb2xsYWJsZShldmVudCkge1xuICAgIGxldCBlbGVtID0gdGhpczsgLy8gY2FsbGVkIGZyb20gZXZlbnQgaGFuZGxlciBjb250ZXh0IHdpdGggdGhpcyBhcyBlbGVtXG5cbiAgICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgc2Nyb2xsYWJsZSAoY29udGVudCBvdmVyZmxvd3MpLCB0aGVuLi4uXG4gICAgaWYgKGVsZW0uc2Nyb2xsSGVpZ2h0ICE9PSBlbGVtLmNsaWVudEhlaWdodCkge1xuICAgICAgLy8gSWYgd2UncmUgYXQgdGhlIHRvcCwgc2Nyb2xsIGRvd24gb25lIHBpeGVsIHRvIGFsbG93IHNjcm9sbGluZyB1cFxuICAgICAgaWYgKGVsZW0uc2Nyb2xsVG9wID09PSAwKSB7XG4gICAgICAgIGVsZW0uc2Nyb2xsVG9wID0gMTtcbiAgICAgIH1cbiAgICAgIC8vIElmIHdlJ3JlIGF0IHRoZSBib3R0b20sIHNjcm9sbCB1cCBvbmUgcGl4ZWwgdG8gYWxsb3cgc2Nyb2xsaW5nIGRvd25cbiAgICAgIGlmIChlbGVtLnNjcm9sbFRvcCA9PT0gZWxlbS5zY3JvbGxIZWlnaHQgLSBlbGVtLmNsaWVudEhlaWdodCkge1xuICAgICAgICBlbGVtLnNjcm9sbFRvcCA9IGVsZW0uc2Nyb2xsSGVpZ2h0IC0gZWxlbS5jbGllbnRIZWlnaHQgLSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBlbGVtLmFsbG93VXAgPSBlbGVtLnNjcm9sbFRvcCA+IDA7XG4gICAgZWxlbS5hbGxvd0Rvd24gPSBlbGVtLnNjcm9sbFRvcCA8IChlbGVtLnNjcm9sbEhlaWdodCAtIGVsZW0uY2xpZW50SGVpZ2h0KTtcbiAgICBlbGVtLmxhc3RZID0gZXZlbnQub3JpZ2luYWxFdmVudC5wYWdlWTtcbiAgfVxuXG4gIF9zdG9wU2Nyb2xsUHJvcGFnYXRpb24oZXZlbnQpIHtcbiAgICBsZXQgZWxlbSA9IHRoaXM7IC8vIGNhbGxlZCBmcm9tIGV2ZW50IGhhbmRsZXIgY29udGV4dCB3aXRoIHRoaXMgYXMgZWxlbVxuICAgIGxldCB1cCA9IGV2ZW50LnBhZ2VZIDwgZWxlbS5sYXN0WTtcbiAgICBsZXQgZG93biA9ICF1cDtcbiAgICBlbGVtLmxhc3RZID0gZXZlbnQucGFnZVk7XG5cbiAgICBpZigodXAgJiYgZWxlbS5hbGxvd1VwKSB8fCAoZG93biAmJiBlbGVtLmFsbG93RG93bikpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgb2ZmLWNhbnZhcyBtZW51LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IC0gRXZlbnQgb2JqZWN0IHBhc3NlZCBmcm9tIGxpc3RlbmVyLlxuICAgKiBAcGFyYW0ge2pRdWVyeX0gdHJpZ2dlciAtIGVsZW1lbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIG9mZi1jYW52YXMgdG8gb3Blbi5cbiAgICogQGZpcmVzIE9mZkNhbnZhcyNvcGVuZWRcbiAgICovXG4gIG9wZW4oZXZlbnQsIHRyaWdnZXIpIHtcbiAgICBpZiAodGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaXMtb3BlbicpIHx8IHRoaXMuaXNSZXZlYWxlZCkgeyByZXR1cm47IH1cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRyaWdnZXIpIHtcbiAgICAgIHRoaXMuJGxhc3RUcmlnZ2VyID0gdHJpZ2dlcjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmZvcmNlVG8gPT09ICd0b3AnKSB7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuZm9yY2VUbyA9PT0gJ2JvdHRvbScpIHtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIHRoZSBvZmYtY2FudmFzIG1lbnUgb3BlbnMuXG4gICAgICogQGV2ZW50IE9mZkNhbnZhcyNvcGVuZWRcbiAgICAgKi9cbiAgICBfdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnaXMtb3BlbicpXG5cbiAgICB0aGlzLiR0cmlnZ2Vycy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJylcbiAgICAgICAgLnRyaWdnZXIoJ29wZW5lZC56Zi5vZmZjYW52YXMnKTtcblxuICAgIC8vIElmIGBjb250ZW50U2Nyb2xsYCBpcyBzZXQgdG8gZmFsc2UsIGFkZCBjbGFzcyBhbmQgZGlzYWJsZSBzY3JvbGxpbmcgb24gdG91Y2ggZGV2aWNlcy5cbiAgICBpZiAodGhpcy5vcHRpb25zLmNvbnRlbnRTY3JvbGwgPT09IGZhbHNlKSB7XG4gICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzLW9mZi1jYW52YXMtb3BlbicpLm9uKCd0b3VjaG1vdmUnLCB0aGlzLl9zdG9wU2Nyb2xsaW5nKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3RvdWNoc3RhcnQnLCB0aGlzLl9yZWNvcmRTY3JvbGxhYmxlKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3RvdWNobW92ZScsIHRoaXMuX3N0b3BTY3JvbGxQcm9wYWdhdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb250ZW50T3ZlcmxheSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy4kb3ZlcmxheS5hZGRDbGFzcygnaXMtdmlzaWJsZScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2VPbkNsaWNrID09PSB0cnVlICYmIHRoaXMub3B0aW9ucy5jb250ZW50T3ZlcmxheSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy4kb3ZlcmxheS5hZGRDbGFzcygnaXMtY2xvc2FibGUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9Gb2N1cyA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy4kZWxlbWVudC5vbmUoRm91bmRhdGlvbi50cmFuc2l0aW9uZW5kKHRoaXMuJGVsZW1lbnQpLCBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMuJGVsZW1lbnQuZmluZCgnYSwgYnV0dG9uJykuZXEoMCkuZm9jdXMoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMudHJhcEZvY3VzID09PSB0cnVlKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnNpYmxpbmdzKCdbZGF0YS1vZmYtY2FudmFzLWNvbnRlbnRdJykuYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgIEZvdW5kYXRpb24uS2V5Ym9hcmQudHJhcEZvY3VzKHRoaXMuJGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIG9mZi1jYW52YXMgbWVudS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIC0gb3B0aW9uYWwgY2IgdG8gZmlyZSBhZnRlciBjbG9zdXJlLlxuICAgKiBAZmlyZXMgT2ZmQ2FudmFzI2Nsb3NlZFxuICAgKi9cbiAgY2xvc2UoY2IpIHtcbiAgICBpZiAoIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2lzLW9wZW4nKSB8fCB0aGlzLmlzUmV2ZWFsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKTtcblxuICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpXG4gICAgICAvKipcbiAgICAgICAqIEZpcmVzIHdoZW4gdGhlIG9mZi1jYW52YXMgbWVudSBvcGVucy5cbiAgICAgICAqIEBldmVudCBPZmZDYW52YXMjY2xvc2VkXG4gICAgICAgKi9cbiAgICAgICAgLnRyaWdnZXIoJ2Nsb3NlZC56Zi5vZmZjYW52YXMnKTtcblxuICAgIC8vIElmIGBjb250ZW50U2Nyb2xsYCBpcyBzZXQgdG8gZmFsc2UsIHJlbW92ZSBjbGFzcyBhbmQgcmUtZW5hYmxlIHNjcm9sbGluZyBvbiB0b3VjaCBkZXZpY2VzLlxuICAgIGlmICh0aGlzLm9wdGlvbnMuY29udGVudFNjcm9sbCA9PT0gZmFsc2UpIHtcbiAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtb2ZmLWNhbnZhcy1vcGVuJykub2ZmKCd0b3VjaG1vdmUnLCB0aGlzLl9zdG9wU2Nyb2xsaW5nKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCd0b3VjaHN0YXJ0JywgdGhpcy5fcmVjb3JkU2Nyb2xsYWJsZSk7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZigndG91Y2htb3ZlJywgdGhpcy5fc3RvcFNjcm9sbFByb3BhZ2F0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmNvbnRlbnRPdmVybGF5ID09PSB0cnVlKSB7XG4gICAgICB0aGlzLiRvdmVybGF5LnJlbW92ZUNsYXNzKCdpcy12aXNpYmxlJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jbG9zZU9uQ2xpY2sgPT09IHRydWUgJiYgdGhpcy5vcHRpb25zLmNvbnRlbnRPdmVybGF5ID09PSB0cnVlKSB7XG4gICAgICB0aGlzLiRvdmVybGF5LnJlbW92ZUNsYXNzKCdpcy1jbG9zYWJsZScpO1xuICAgIH1cblxuICAgIHRoaXMuJHRyaWdnZXJzLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMudHJhcEZvY3VzID09PSB0cnVlKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnNpYmxpbmdzKCdbZGF0YS1vZmYtY2FudmFzLWNvbnRlbnRdJykucmVtb3ZlQXR0cigndGFiaW5kZXgnKTtcbiAgICAgIEZvdW5kYXRpb24uS2V5Ym9hcmQucmVsZWFzZUZvY3VzKHRoaXMuJGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBvZmYtY2FudmFzIG1lbnUgb3BlbiBvciBjbG9zZWQuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgLSBFdmVudCBvYmplY3QgcGFzc2VkIGZyb20gbGlzdGVuZXIuXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSB0cmlnZ2VyIC0gZWxlbWVudCB0aGF0IHRyaWdnZXJlZCB0aGUgb2ZmLWNhbnZhcyB0byBvcGVuLlxuICAgKi9cbiAgdG9nZ2xlKGV2ZW50LCB0cmlnZ2VyKSB7XG4gICAgaWYgKHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2lzLW9wZW4nKSkge1xuICAgICAgdGhpcy5jbG9zZShldmVudCwgdHJpZ2dlcik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKGV2ZW50LCB0cmlnZ2VyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBrZXlib2FyZCBpbnB1dCB3aGVuIGRldGVjdGVkLiBXaGVuIHRoZSBlc2NhcGUga2V5IGlzIHByZXNzZWQsIHRoZSBvZmYtY2FudmFzIG1lbnUgY2xvc2VzLCBhbmQgZm9jdXMgaXMgcmVzdG9yZWQgdG8gdGhlIGVsZW1lbnQgdGhhdCBvcGVuZWQgdGhlIG1lbnUuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2hhbmRsZUtleWJvYXJkKGUpIHtcbiAgICBGb3VuZGF0aW9uLktleWJvYXJkLmhhbmRsZUtleShlLCAnT2ZmQ2FudmFzJywge1xuICAgICAgY2xvc2U6ICgpID0+IHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB0aGlzLiRsYXN0VHJpZ2dlci5mb2N1cygpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBoYW5kbGVkOiAoKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyB0aGUgb2ZmY2FudmFzIHBsdWdpbi5cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLiRlbGVtZW50Lm9mZignLnpmLnRyaWdnZXIgLnpmLm9mZmNhbnZhcycpO1xuICAgIHRoaXMuJG92ZXJsYXkub2ZmKCcuemYub2ZmY2FudmFzJyk7XG5cbiAgICBGb3VuZGF0aW9uLnVucmVnaXN0ZXJQbHVnaW4odGhpcyk7XG4gIH1cbn1cblxuT2ZmQ2FudmFzLmRlZmF1bHRzID0ge1xuICAvKipcbiAgICogQWxsb3cgdGhlIHVzZXIgdG8gY2xpY2sgb3V0c2lkZSBvZiB0aGUgbWVudSB0byBjbG9zZSBpdC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgY2xvc2VPbkNsaWNrOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIG92ZXJsYXkgb24gdG9wIG9mIGBbZGF0YS1vZmYtY2FudmFzLWNvbnRlbnRdYC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgY29udGVudE92ZXJsYXk6IHRydWUsXG5cbiAgLyoqXG4gICAqIEVuYWJsZS9kaXNhYmxlIHNjcm9sbGluZyBvZiB0aGUgbWFpbiBjb250ZW50IHdoZW4gYW4gb2ZmIGNhbnZhcyBwYW5lbCBpcyBvcGVuLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBjb250ZW50U2Nyb2xsOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBBbW91bnQgb2YgdGltZSBpbiBtcyB0aGUgb3BlbiBhbmQgY2xvc2UgdHJhbnNpdGlvbiByZXF1aXJlcy4gSWYgbm9uZSBzZWxlY3RlZCwgcHVsbHMgZnJvbSBib2R5IHN0eWxlLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHRyYW5zaXRpb25UaW1lOiAwLFxuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHRyYW5zaXRpb24gZm9yIHRoZSBvZmZjYW52YXMgbWVudS4gT3B0aW9ucyBhcmUgJ3B1c2gnLCAnZGV0YWNoZWQnIG9yICdzbGlkZScuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgcHVzaFxuICAgKi9cbiAgdHJhbnNpdGlvbjogJ3B1c2gnLFxuXG4gIC8qKlxuICAgKiBGb3JjZSB0aGUgcGFnZSB0byBzY3JvbGwgdG8gdG9wIG9yIGJvdHRvbSBvbiBvcGVuLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHs/c3RyaW5nfVxuICAgKiBAZGVmYXVsdCBudWxsXG4gICAqL1xuICBmb3JjZVRvOiBudWxsLFxuXG4gIC8qKlxuICAgKiBBbGxvdyB0aGUgb2ZmY2FudmFzIHRvIHJlbWFpbiBvcGVuIGZvciBjZXJ0YWluIGJyZWFrcG9pbnRzLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgaXNSZXZlYWxlZDogZmFsc2UsXG5cbiAgLyoqXG4gICAqIEJyZWFrcG9pbnQgYXQgd2hpY2ggdG8gcmV2ZWFsLiBKUyB3aWxsIHVzZSBhIFJlZ0V4cCB0byB0YXJnZXQgc3RhbmRhcmQgY2xhc3NlcywgaWYgY2hhbmdpbmcgY2xhc3NuYW1lcywgcGFzcyB5b3VyIGNsYXNzIHdpdGggdGhlIGByZXZlYWxDbGFzc2Agb3B0aW9uLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHs/c3RyaW5nfVxuICAgKiBAZGVmYXVsdCBudWxsXG4gICAqL1xuICByZXZlYWxPbjogbnVsbCxcblxuICAvKipcbiAgICogRm9yY2UgZm9jdXMgdG8gdGhlIG9mZmNhbnZhcyBvbiBvcGVuLiBJZiB0cnVlLCB3aWxsIGZvY3VzIHRoZSBvcGVuaW5nIHRyaWdnZXIgb24gY2xvc2UuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIGF1dG9Gb2N1czogdHJ1ZSxcblxuICAvKipcbiAgICogQ2xhc3MgdXNlZCB0byBmb3JjZSBhbiBvZmZjYW52YXMgdG8gcmVtYWluIG9wZW4uIEZvdW5kYXRpb24gZGVmYXVsdHMgZm9yIHRoaXMgYXJlIGByZXZlYWwtZm9yLWxhcmdlYCAmIGByZXZlYWwtZm9yLW1lZGl1bWAuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgcmV2ZWFsLWZvci1cbiAgICogQHRvZG8gaW1wcm92ZSB0aGUgcmVnZXggdGVzdGluZyBmb3IgdGhpcy5cbiAgICovXG4gIHJldmVhbENsYXNzOiAncmV2ZWFsLWZvci0nLFxuXG4gIC8qKlxuICAgKiBUcmlnZ2VycyBvcHRpb25hbCBmb2N1cyB0cmFwcGluZyB3aGVuIG9wZW5pbmcgYW4gb2ZmY2FudmFzLiBTZXRzIHRhYmluZGV4IG9mIFtkYXRhLW9mZi1jYW52YXMtY29udGVudF0gdG8gLTEgZm9yIGFjY2Vzc2liaWxpdHkgcHVycG9zZXMuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICB0cmFwRm9jdXM6IGZhbHNlXG59XG5cbi8vIFdpbmRvdyBleHBvcnRzXG5Gb3VuZGF0aW9uLnBsdWdpbihPZmZDYW52YXMsICdPZmZDYW52YXMnKTtcblxufShqUXVlcnkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4hZnVuY3Rpb24oJCkge1xuXG4vKipcbiAqIE9yYml0IG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi5vcmJpdFxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5rZXlib2FyZFxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5tb3Rpb25cbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwudGltZXJBbmRJbWFnZUxvYWRlclxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC50b3VjaFxuICovXG5cbmNsYXNzIE9yYml0IHtcbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBhbiBvcmJpdCBjYXJvdXNlbC5cbiAgKiBAY2xhc3NcbiAgKiBAcGFyYW0ge2pRdWVyeX0gZWxlbWVudCAtIGpRdWVyeSBvYmplY3QgdG8gbWFrZSBpbnRvIGFuIE9yYml0IENhcm91c2VsLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGVzIHRvIHRoZSBkZWZhdWx0IHBsdWdpbiBzZXR0aW5ncy5cbiAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucyl7XG4gICAgdGhpcy4kZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIE9yYml0LmRlZmF1bHRzLCB0aGlzLiRlbGVtZW50LmRhdGEoKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9pbml0KCk7XG5cbiAgICBGb3VuZGF0aW9uLnJlZ2lzdGVyUGx1Z2luKHRoaXMsICdPcmJpdCcpO1xuICAgIEZvdW5kYXRpb24uS2V5Ym9hcmQucmVnaXN0ZXIoJ09yYml0Jywge1xuICAgICAgJ2x0cic6IHtcbiAgICAgICAgJ0FSUk9XX1JJR0hUJzogJ25leHQnLFxuICAgICAgICAnQVJST1dfTEVGVCc6ICdwcmV2aW91cydcbiAgICAgIH0sXG4gICAgICAncnRsJzoge1xuICAgICAgICAnQVJST1dfTEVGVCc6ICduZXh0JyxcbiAgICAgICAgJ0FSUk9XX1JJR0hUJzogJ3ByZXZpb3VzJ1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogSW5pdGlhbGl6ZXMgdGhlIHBsdWdpbiBieSBjcmVhdGluZyBqUXVlcnkgY29sbGVjdGlvbnMsIHNldHRpbmcgYXR0cmlidXRlcywgYW5kIHN0YXJ0aW5nIHRoZSBhbmltYXRpb24uXG4gICogQGZ1bmN0aW9uXG4gICogQHByaXZhdGVcbiAgKi9cbiAgX2luaXQoKSB7XG4gICAgLy8gQFRPRE86IGNvbnNpZGVyIGRpc2N1c3Npb24gb24gUFIgIzkyNzggYWJvdXQgRE9NIHBvbGx1dGlvbiBieSBjaGFuZ2VTbGlkZVxuICAgIHRoaXMuX3Jlc2V0KCk7XG5cbiAgICB0aGlzLiR3cmFwcGVyID0gdGhpcy4kZWxlbWVudC5maW5kKGAuJHt0aGlzLm9wdGlvbnMuY29udGFpbmVyQ2xhc3N9YCk7XG4gICAgdGhpcy4kc2xpZGVzID0gdGhpcy4kZWxlbWVudC5maW5kKGAuJHt0aGlzLm9wdGlvbnMuc2xpZGVDbGFzc31gKTtcblxuICAgIHZhciAkaW1hZ2VzID0gdGhpcy4kZWxlbWVudC5maW5kKCdpbWcnKSxcbiAgICAgICAgaW5pdEFjdGl2ZSA9IHRoaXMuJHNsaWRlcy5maWx0ZXIoJy5pcy1hY3RpdmUnKSxcbiAgICAgICAgaWQgPSB0aGlzLiRlbGVtZW50WzBdLmlkIHx8IEZvdW5kYXRpb24uR2V0WW9EaWdpdHMoNiwgJ29yYml0Jyk7XG5cbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoe1xuICAgICAgJ2RhdGEtcmVzaXplJzogaWQsXG4gICAgICAnaWQnOiBpZFxuICAgIH0pO1xuXG4gICAgaWYgKCFpbml0QWN0aXZlLmxlbmd0aCkge1xuICAgICAgdGhpcy4kc2xpZGVzLmVxKDApLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy51c2VNVUkpIHtcbiAgICAgIHRoaXMuJHNsaWRlcy5hZGRDbGFzcygnbm8tbW90aW9udWknKTtcbiAgICB9XG5cbiAgICBpZiAoJGltYWdlcy5sZW5ndGgpIHtcbiAgICAgIEZvdW5kYXRpb24ub25JbWFnZXNMb2FkZWQoJGltYWdlcywgdGhpcy5fcHJlcGFyZUZvck9yYml0LmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wcmVwYXJlRm9yT3JiaXQoKTsvL2hlaGVcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmJ1bGxldHMpIHtcbiAgICAgIHRoaXMuX2xvYWRCdWxsZXRzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fZXZlbnRzKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9QbGF5ICYmIHRoaXMuJHNsaWRlcy5sZW5ndGggPiAxKSB7XG4gICAgICB0aGlzLmdlb1N5bmMoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmFjY2Vzc2libGUpIHsgLy8gYWxsb3cgd3JhcHBlciB0byBiZSBmb2N1c2FibGUgdG8gZW5hYmxlIGFycm93IG5hdmlnYXRpb25cbiAgICAgIHRoaXMuJHdyYXBwZXIuYXR0cigndGFiaW5kZXgnLCAwKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgalF1ZXJ5IGNvbGxlY3Rpb24gb2YgYnVsbGV0cywgaWYgdGhleSBhcmUgYmVpbmcgdXNlZC5cbiAgKiBAZnVuY3Rpb25cbiAgKiBAcHJpdmF0ZVxuICAqL1xuICBfbG9hZEJ1bGxldHMoKSB7XG4gICAgdGhpcy4kYnVsbGV0cyA9IHRoaXMuJGVsZW1lbnQuZmluZChgLiR7dGhpcy5vcHRpb25zLmJveE9mQnVsbGV0c31gKS5maW5kKCdidXR0b24nKTtcbiAgfVxuXG4gIC8qKlxuICAqIFNldHMgYSBgdGltZXJgIG9iamVjdCBvbiB0aGUgb3JiaXQsIGFuZCBzdGFydHMgdGhlIGNvdW50ZXIgZm9yIHRoZSBuZXh0IHNsaWRlLlxuICAqIEBmdW5jdGlvblxuICAqL1xuICBnZW9TeW5jKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy50aW1lciA9IG5ldyBGb3VuZGF0aW9uLlRpbWVyKFxuICAgICAgdGhpcy4kZWxlbWVudCxcbiAgICAgIHtcbiAgICAgICAgZHVyYXRpb246IHRoaXMub3B0aW9ucy50aW1lckRlbGF5LFxuICAgICAgICBpbmZpbml0ZTogZmFsc2VcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgX3RoaXMuY2hhbmdlU2xpZGUodHJ1ZSk7XG4gICAgICB9KTtcbiAgICB0aGlzLnRpbWVyLnN0YXJ0KCk7XG4gIH1cblxuICAvKipcbiAgKiBTZXRzIHdyYXBwZXIgYW5kIHNsaWRlIGhlaWdodHMgZm9yIHRoZSBvcmJpdC5cbiAgKiBAZnVuY3Rpb25cbiAgKiBAcHJpdmF0ZVxuICAqL1xuICBfcHJlcGFyZUZvck9yYml0KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy5fc2V0V3JhcHBlckhlaWdodCgpO1xuICB9XG5cbiAgLyoqXG4gICogQ2FsdWxhdGVzIHRoZSBoZWlnaHQgb2YgZWFjaCBzbGlkZSBpbiB0aGUgY29sbGVjdGlvbiwgYW5kIHVzZXMgdGhlIHRhbGxlc3Qgb25lIGZvciB0aGUgd3JhcHBlciBoZWlnaHQuXG4gICogQGZ1bmN0aW9uXG4gICogQHByaXZhdGVcbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiAtIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gZmlyZSB3aGVuIGNvbXBsZXRlLlxuICAqL1xuICBfc2V0V3JhcHBlckhlaWdodChjYikgey8vcmV3cml0ZSB0aGlzIHRvIGBmb3JgIGxvb3BcbiAgICB2YXIgbWF4ID0gMCwgdGVtcCwgY291bnRlciA9IDAsIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdGVtcCA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgJCh0aGlzKS5hdHRyKCdkYXRhLXNsaWRlJywgY291bnRlcik7XG5cbiAgICAgIGlmIChfdGhpcy4kc2xpZGVzLmZpbHRlcignLmlzLWFjdGl2ZScpWzBdICE9PSBfdGhpcy4kc2xpZGVzLmVxKGNvdW50ZXIpWzBdKSB7Ly9pZiBub3QgdGhlIGFjdGl2ZSBzbGlkZSwgc2V0IGNzcyBwb3NpdGlvbiBhbmQgZGlzcGxheSBwcm9wZXJ0eVxuICAgICAgICAkKHRoaXMpLmNzcyh7J3Bvc2l0aW9uJzogJ3JlbGF0aXZlJywgJ2Rpc3BsYXknOiAnbm9uZSd9KTtcbiAgICAgIH1cbiAgICAgIG1heCA9IHRlbXAgPiBtYXggPyB0ZW1wIDogbWF4O1xuICAgICAgY291bnRlcisrO1xuICAgIH0pO1xuXG4gICAgaWYgKGNvdW50ZXIgPT09IHRoaXMuJHNsaWRlcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuJHdyYXBwZXIuY3NzKHsnaGVpZ2h0JzogbWF4fSk7IC8vb25seSBjaGFuZ2UgdGhlIHdyYXBwZXIgaGVpZ2h0IHByb3BlcnR5IG9uY2UuXG4gICAgICBpZihjYikge2NiKG1heCk7fSAvL2ZpcmUgY2FsbGJhY2sgd2l0aCBtYXggaGVpZ2h0IGRpbWVuc2lvbi5cbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBTZXRzIHRoZSBtYXgtaGVpZ2h0IG9mIGVhY2ggc2xpZGUuXG4gICogQGZ1bmN0aW9uXG4gICogQHByaXZhdGVcbiAgKi9cbiAgX3NldFNsaWRlSGVpZ2h0KGhlaWdodCkge1xuICAgIHRoaXMuJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgJCh0aGlzKS5jc3MoJ21heC1oZWlnaHQnLCBoZWlnaHQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogQWRkcyBldmVudCBsaXN0ZW5lcnMgdG8gYmFzaWNhbGx5IGV2ZXJ5dGhpbmcgd2l0aGluIHRoZSBlbGVtZW50LlxuICAqIEBmdW5jdGlvblxuICAqIEBwcml2YXRlXG4gICovXG4gIF9ldmVudHMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgLy8qKk5vdyB1c2luZyBjdXN0b20gZXZlbnQgLSB0aGFua3MgdG86KipcbiAgICAvLyoqICAgICAgWW9oYWkgQXJhcmF0IG9mIFRvcm9udG8gICAgICAqKlxuICAgIC8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgLy9cbiAgICB0aGlzLiRlbGVtZW50Lm9mZignLnJlc2l6ZW1lLnpmLnRyaWdnZXInKS5vbih7XG4gICAgICAncmVzaXplbWUuemYudHJpZ2dlcic6IHRoaXMuX3ByZXBhcmVGb3JPcmJpdC5iaW5kKHRoaXMpXG4gICAgfSlcbiAgICBpZiAodGhpcy4kc2xpZGVzLmxlbmd0aCA+IDEpIHtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zd2lwZSkge1xuICAgICAgICB0aGlzLiRzbGlkZXMub2ZmKCdzd2lwZWxlZnQuemYub3JiaXQgc3dpcGVyaWdodC56Zi5vcmJpdCcpXG4gICAgICAgIC5vbignc3dpcGVsZWZ0LnpmLm9yYml0JywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIF90aGlzLmNoYW5nZVNsaWRlKHRydWUpO1xuICAgICAgICB9KS5vbignc3dpcGVyaWdodC56Zi5vcmJpdCcsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBfdGhpcy5jaGFuZ2VTbGlkZShmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUGxheSkge1xuICAgICAgICB0aGlzLiRzbGlkZXMub24oJ2NsaWNrLnpmLm9yYml0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgX3RoaXMuJGVsZW1lbnQuZGF0YSgnY2xpY2tlZE9uJywgX3RoaXMuJGVsZW1lbnQuZGF0YSgnY2xpY2tlZE9uJykgPyBmYWxzZSA6IHRydWUpO1xuICAgICAgICAgIF90aGlzLnRpbWVyW190aGlzLiRlbGVtZW50LmRhdGEoJ2NsaWNrZWRPbicpID8gJ3BhdXNlJyA6ICdzdGFydCddKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGF1c2VPbkhvdmVyKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC5vbignbW91c2VlbnRlci56Zi5vcmJpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX3RoaXMudGltZXIucGF1c2UoKTtcbiAgICAgICAgICB9KS5vbignbW91c2VsZWF2ZS56Zi5vcmJpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFfdGhpcy4kZWxlbWVudC5kYXRhKCdjbGlja2VkT24nKSkge1xuICAgICAgICAgICAgICBfdGhpcy50aW1lci5zdGFydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubmF2QnV0dG9ucykge1xuICAgICAgICB2YXIgJGNvbnRyb2xzID0gdGhpcy4kZWxlbWVudC5maW5kKGAuJHt0aGlzLm9wdGlvbnMubmV4dENsYXNzfSwgLiR7dGhpcy5vcHRpb25zLnByZXZDbGFzc31gKTtcbiAgICAgICAgJGNvbnRyb2xzLmF0dHIoJ3RhYmluZGV4JywgMClcbiAgICAgICAgLy9hbHNvIG5lZWQgdG8gaGFuZGxlIGVudGVyL3JldHVybiBhbmQgc3BhY2ViYXIga2V5IHByZXNzZXNcbiAgICAgICAgLm9uKCdjbGljay56Zi5vcmJpdCB0b3VjaGVuZC56Zi5vcmJpdCcsIGZ1bmN0aW9uKGUpe1xuXHQgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBfdGhpcy5jaGFuZ2VTbGlkZSgkKHRoaXMpLmhhc0NsYXNzKF90aGlzLm9wdGlvbnMubmV4dENsYXNzKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmJ1bGxldHMpIHtcbiAgICAgICAgdGhpcy4kYnVsbGV0cy5vbignY2xpY2suemYub3JiaXQgdG91Y2hlbmQuemYub3JiaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoL2lzLWFjdGl2ZS9nLnRlc3QodGhpcy5jbGFzc05hbWUpKSB7IHJldHVybiBmYWxzZTsgfS8vaWYgdGhpcyBpcyBhY3RpdmUsIGtpY2sgb3V0IG9mIGZ1bmN0aW9uLlxuICAgICAgICAgIHZhciBpZHggPSAkKHRoaXMpLmRhdGEoJ3NsaWRlJyksXG4gICAgICAgICAgbHRyID0gaWR4ID4gX3RoaXMuJHNsaWRlcy5maWx0ZXIoJy5pcy1hY3RpdmUnKS5kYXRhKCdzbGlkZScpLFxuICAgICAgICAgICRzbGlkZSA9IF90aGlzLiRzbGlkZXMuZXEoaWR4KTtcblxuICAgICAgICAgIF90aGlzLmNoYW5nZVNsaWRlKGx0ciwgJHNsaWRlLCBpZHgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hY2Nlc3NpYmxlKSB7XG4gICAgICAgIHRoaXMuJHdyYXBwZXIuYWRkKHRoaXMuJGJ1bGxldHMpLm9uKCdrZXlkb3duLnpmLm9yYml0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8vIGhhbmRsZSBrZXlib2FyZCBldmVudCB3aXRoIGtleWJvYXJkIHV0aWxcbiAgICAgICAgICBGb3VuZGF0aW9uLktleWJvYXJkLmhhbmRsZUtleShlLCAnT3JiaXQnLCB7XG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgX3RoaXMuY2hhbmdlU2xpZGUodHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJldmlvdXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBfdGhpcy5jaGFuZ2VTbGlkZShmYWxzZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGFuZGxlZDogZnVuY3Rpb24oKSB7IC8vIGlmIGJ1bGxldCBpcyBmb2N1c2VkLCBtYWtlIHN1cmUgZm9jdXMgbW92ZXNcbiAgICAgICAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKF90aGlzLiRidWxsZXRzKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLiRidWxsZXRzLmZpbHRlcignLmlzLWFjdGl2ZScpLmZvY3VzKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyBPcmJpdCBzbyBpdCBjYW4gYmUgcmVpbml0aWFsaXplZFxuICAgKi9cbiAgX3Jlc2V0KCkge1xuICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIHRoZXJlIGFyZSBubyBzbGlkZXMgKGZpcnN0IHJ1bilcbiAgICBpZiAodHlwZW9mIHRoaXMuJHNsaWRlcyA9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLiRzbGlkZXMubGVuZ3RoID4gMSkge1xuICAgICAgLy8gUmVtb3ZlIG9sZCBldmVudHNcbiAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCcuemYub3JiaXQnKS5maW5kKCcqJykub2ZmKCcuemYub3JiaXQnKVxuXG4gICAgICAvLyBSZXN0YXJ0IHRpbWVyIGlmIGF1dG9QbGF5IGlzIGVuYWJsZWRcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1BsYXkpIHtcbiAgICAgICAgdGhpcy50aW1lci5yZXN0YXJ0KCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlc2V0IGFsbCBzbGlkZGVzXG4gICAgICB0aGlzLiRzbGlkZXMuZWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlIGlzLWFjdGl2ZSBpcy1pbicpXG4gICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtbGl2ZScpXG4gICAgICAgICAgLmhpZGUoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTaG93IHRoZSBmaXJzdCBzbGlkZVxuICAgICAgdGhpcy4kc2xpZGVzLmZpcnN0KCkuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpLnNob3coKTtcblxuICAgICAgLy8gVHJpZ2dlcnMgd2hlbiB0aGUgc2xpZGUgaGFzIGZpbmlzaGVkIGFuaW1hdGluZ1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdzbGlkZWNoYW5nZS56Zi5vcmJpdCcsIFt0aGlzLiRzbGlkZXMuZmlyc3QoKV0pO1xuXG4gICAgICAvLyBTZWxlY3QgZmlyc3QgYnVsbGV0IGlmIGJ1bGxldHMgYXJlIHByZXNlbnRcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYnVsbGV0cykge1xuICAgICAgICB0aGlzLl91cGRhdGVCdWxsZXRzKDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIENoYW5nZXMgdGhlIGN1cnJlbnQgc2xpZGUgdG8gYSBuZXcgb25lLlxuICAqIEBmdW5jdGlvblxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNMVFIgLSBmbGFnIGlmIHRoZSBzbGlkZSBzaG91bGQgbW92ZSBsZWZ0IHRvIHJpZ2h0LlxuICAqIEBwYXJhbSB7alF1ZXJ5fSBjaG9zZW5TbGlkZSAtIHRoZSBqUXVlcnkgZWxlbWVudCBvZiB0aGUgc2xpZGUgdG8gc2hvdyBuZXh0LCBpZiBvbmUgaXMgc2VsZWN0ZWQuXG4gICogQHBhcmFtIHtOdW1iZXJ9IGlkeCAtIHRoZSBpbmRleCBvZiB0aGUgbmV3IHNsaWRlIGluIGl0cyBjb2xsZWN0aW9uLCBpZiBvbmUgY2hvc2VuLlxuICAqIEBmaXJlcyBPcmJpdCNzbGlkZWNoYW5nZVxuICAqL1xuICBjaGFuZ2VTbGlkZShpc0xUUiwgY2hvc2VuU2xpZGUsIGlkeCkge1xuICAgIGlmICghdGhpcy4kc2xpZGVzKSB7cmV0dXJuOyB9IC8vIERvbid0IGZyZWFrIG91dCBpZiB3ZSdyZSBpbiB0aGUgbWlkZGxlIG9mIGNsZWFudXBcbiAgICB2YXIgJGN1clNsaWRlID0gdGhpcy4kc2xpZGVzLmZpbHRlcignLmlzLWFjdGl2ZScpLmVxKDApO1xuXG4gICAgaWYgKC9tdWkvZy50ZXN0KCRjdXJTbGlkZVswXS5jbGFzc05hbWUpKSB7IHJldHVybiBmYWxzZTsgfSAvL2lmIHRoZSBzbGlkZSBpcyBjdXJyZW50bHkgYW5pbWF0aW5nLCBraWNrIG91dCBvZiB0aGUgZnVuY3Rpb25cblxuICAgIHZhciAkZmlyc3RTbGlkZSA9IHRoaXMuJHNsaWRlcy5maXJzdCgpLFxuICAgICRsYXN0U2xpZGUgPSB0aGlzLiRzbGlkZXMubGFzdCgpLFxuICAgIGRpckluID0gaXNMVFIgPyAnUmlnaHQnIDogJ0xlZnQnLFxuICAgIGRpck91dCA9IGlzTFRSID8gJ0xlZnQnIDogJ1JpZ2h0JyxcbiAgICBfdGhpcyA9IHRoaXMsXG4gICAgJG5ld1NsaWRlO1xuXG4gICAgaWYgKCFjaG9zZW5TbGlkZSkgeyAvL21vc3Qgb2YgdGhlIHRpbWUsIHRoaXMgd2lsbCBiZSBhdXRvIHBsYXllZCBvciBjbGlja2VkIGZyb20gdGhlIG5hdkJ1dHRvbnMuXG4gICAgICAkbmV3U2xpZGUgPSBpc0xUUiA/IC8vaWYgd3JhcHBpbmcgZW5hYmxlZCwgY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGEgYG5leHRgIG9yIGBwcmV2YCBzaWJsaW5nLCBpZiBub3QsIHNlbGVjdCB0aGUgZmlyc3Qgb3IgbGFzdCBzbGlkZSB0byBmaWxsIGluLiBpZiB3cmFwcGluZyBub3QgZW5hYmxlZCwgYXR0ZW1wdCB0byBzZWxlY3QgYG5leHRgIG9yIGBwcmV2YCwgaWYgdGhlcmUncyBub3RoaW5nIHRoZXJlLCB0aGUgZnVuY3Rpb24gd2lsbCBraWNrIG91dCBvbiBuZXh0IHN0ZXAuIENSQVpZIE5FU1RFRCBURVJOQVJJRVMhISEhIVxuICAgICAgKHRoaXMub3B0aW9ucy5pbmZpbml0ZVdyYXAgPyAkY3VyU2xpZGUubmV4dChgLiR7dGhpcy5vcHRpb25zLnNsaWRlQ2xhc3N9YCkubGVuZ3RoID8gJGN1clNsaWRlLm5leHQoYC4ke3RoaXMub3B0aW9ucy5zbGlkZUNsYXNzfWApIDogJGZpcnN0U2xpZGUgOiAkY3VyU2xpZGUubmV4dChgLiR7dGhpcy5vcHRpb25zLnNsaWRlQ2xhc3N9YCkpLy9waWNrIG5leHQgc2xpZGUgaWYgbW92aW5nIGxlZnQgdG8gcmlnaHRcbiAgICAgIDpcbiAgICAgICh0aGlzLm9wdGlvbnMuaW5maW5pdGVXcmFwID8gJGN1clNsaWRlLnByZXYoYC4ke3RoaXMub3B0aW9ucy5zbGlkZUNsYXNzfWApLmxlbmd0aCA/ICRjdXJTbGlkZS5wcmV2KGAuJHt0aGlzLm9wdGlvbnMuc2xpZGVDbGFzc31gKSA6ICRsYXN0U2xpZGUgOiAkY3VyU2xpZGUucHJldihgLiR7dGhpcy5vcHRpb25zLnNsaWRlQ2xhc3N9YCkpOy8vcGljayBwcmV2IHNsaWRlIGlmIG1vdmluZyByaWdodCB0byBsZWZ0XG4gICAgfSBlbHNlIHtcbiAgICAgICRuZXdTbGlkZSA9IGNob3NlblNsaWRlO1xuICAgIH1cblxuICAgIGlmICgkbmV3U2xpZGUubGVuZ3RoKSB7XG4gICAgICAvKipcbiAgICAgICogVHJpZ2dlcnMgYmVmb3JlIHRoZSBuZXh0IHNsaWRlIHN0YXJ0cyBhbmltYXRpbmcgaW4gYW5kIG9ubHkgaWYgYSBuZXh0IHNsaWRlIGhhcyBiZWVuIGZvdW5kLlxuICAgICAgKiBAZXZlbnQgT3JiaXQjYmVmb3Jlc2xpZGVjaGFuZ2VcbiAgICAgICovXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2JlZm9yZXNsaWRlY2hhbmdlLnpmLm9yYml0JywgWyRjdXJTbGlkZSwgJG5ld1NsaWRlXSk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYnVsbGV0cykge1xuICAgICAgICBpZHggPSBpZHggfHwgdGhpcy4kc2xpZGVzLmluZGV4KCRuZXdTbGlkZSk7IC8vZ3JhYiBpbmRleCB0byB1cGRhdGUgYnVsbGV0c1xuICAgICAgICB0aGlzLl91cGRhdGVCdWxsZXRzKGlkeCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXNlTVVJICYmICF0aGlzLiRlbGVtZW50LmlzKCc6aGlkZGVuJykpIHtcbiAgICAgICAgRm91bmRhdGlvbi5Nb3Rpb24uYW5pbWF0ZUluKFxuICAgICAgICAgICRuZXdTbGlkZS5hZGRDbGFzcygnaXMtYWN0aXZlJykuY3NzKHsncG9zaXRpb24nOiAnYWJzb2x1dGUnLCAndG9wJzogMH0pLFxuICAgICAgICAgIHRoaXMub3B0aW9uc1tgYW5pbUluRnJvbSR7ZGlySW59YF0sXG4gICAgICAgICAgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRuZXdTbGlkZS5jc3Moeydwb3NpdGlvbic6ICdyZWxhdGl2ZScsICdkaXNwbGF5JzogJ2Jsb2NrJ30pXG4gICAgICAgICAgICAuYXR0cignYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBGb3VuZGF0aW9uLk1vdGlvbi5hbmltYXRlT3V0KFxuICAgICAgICAgICRjdXJTbGlkZS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyksXG4gICAgICAgICAgdGhpcy5vcHRpb25zW2BhbmltT3V0VG8ke2Rpck91dH1gXSxcbiAgICAgICAgICBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJGN1clNsaWRlLnJlbW92ZUF0dHIoJ2FyaWEtbGl2ZScpO1xuICAgICAgICAgICAgaWYoX3RoaXMub3B0aW9ucy5hdXRvUGxheSAmJiAhX3RoaXMudGltZXIuaXNQYXVzZWQpe1xuICAgICAgICAgICAgICBfdGhpcy50aW1lci5yZXN0YXJ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2RvIHN0dWZmP1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGN1clNsaWRlLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUgaXMtaW4nKS5yZW1vdmVBdHRyKCdhcmlhLWxpdmUnKS5oaWRlKCk7XG4gICAgICAgICRuZXdTbGlkZS5hZGRDbGFzcygnaXMtYWN0aXZlIGlzLWluJykuYXR0cignYXJpYS1saXZlJywgJ3BvbGl0ZScpLnNob3coKTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUGxheSAmJiAhdGhpcy50aW1lci5pc1BhdXNlZCkge1xuICAgICAgICAgIHRoaXMudGltZXIucmVzdGFydCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgLyoqXG4gICAgKiBUcmlnZ2VycyB3aGVuIHRoZSBzbGlkZSBoYXMgZmluaXNoZWQgYW5pbWF0aW5nIGluLlxuICAgICogQGV2ZW50IE9yYml0I3NsaWRlY2hhbmdlXG4gICAgKi9cbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignc2xpZGVjaGFuZ2UuemYub3JiaXQnLCBbJG5ld1NsaWRlXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogVXBkYXRlcyB0aGUgYWN0aXZlIHN0YXRlIG9mIHRoZSBidWxsZXRzLCBpZiBkaXNwbGF5ZWQuXG4gICogQGZ1bmN0aW9uXG4gICogQHByaXZhdGVcbiAgKiBAcGFyYW0ge051bWJlcn0gaWR4IC0gdGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IHNsaWRlLlxuICAqL1xuICBfdXBkYXRlQnVsbGV0cyhpZHgpIHtcbiAgICB2YXIgJG9sZEJ1bGxldCA9IHRoaXMuJGVsZW1lbnQuZmluZChgLiR7dGhpcy5vcHRpb25zLmJveE9mQnVsbGV0c31gKVxuICAgIC5maW5kKCcuaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpLmJsdXIoKSxcbiAgICBzcGFuID0gJG9sZEJ1bGxldC5maW5kKCdzcGFuOmxhc3QnKS5kZXRhY2goKSxcbiAgICAkbmV3QnVsbGV0ID0gdGhpcy4kYnVsbGV0cy5lcShpZHgpLmFkZENsYXNzKCdpcy1hY3RpdmUnKS5hcHBlbmQoc3Bhbik7XG4gIH1cblxuICAvKipcbiAgKiBEZXN0cm95cyB0aGUgY2Fyb3VzZWwgYW5kIGhpZGVzIHRoZSBlbGVtZW50LlxuICAqIEBmdW5jdGlvblxuICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuJGVsZW1lbnQub2ZmKCcuemYub3JiaXQnKS5maW5kKCcqJykub2ZmKCcuemYub3JiaXQnKS5lbmQoKS5oaWRlKCk7XG4gICAgRm91bmRhdGlvbi51bnJlZ2lzdGVyUGx1Z2luKHRoaXMpO1xuICB9XG59XG5cbk9yYml0LmRlZmF1bHRzID0ge1xuICAvKipcbiAgKiBUZWxscyB0aGUgSlMgdG8gbG9vayBmb3IgYW5kIGxvYWRCdWxsZXRzLlxuICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICogQGRlZmF1bHQgdHJ1ZVxuICAqL1xuICBidWxsZXRzOiB0cnVlLFxuICAvKipcbiAgKiBUZWxscyB0aGUgSlMgdG8gYXBwbHkgZXZlbnQgbGlzdGVuZXJzIHRvIG5hdiBidXR0b25zXG4gICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgKiBAZGVmYXVsdCB0cnVlXG4gICovXG4gIG5hdkJ1dHRvbnM6IHRydWUsXG4gIC8qKlxuICAqIG1vdGlvbi11aSBhbmltYXRpb24gY2xhc3MgdG8gYXBwbHlcbiAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICogQGRlZmF1bHQgJ3NsaWRlLWluLXJpZ2h0J1xuICAqL1xuICBhbmltSW5Gcm9tUmlnaHQ6ICdzbGlkZS1pbi1yaWdodCcsXG4gIC8qKlxuICAqIG1vdGlvbi11aSBhbmltYXRpb24gY2xhc3MgdG8gYXBwbHlcbiAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICogQGRlZmF1bHQgJ3NsaWRlLW91dC1yaWdodCdcbiAgKi9cbiAgYW5pbU91dFRvUmlnaHQ6ICdzbGlkZS1vdXQtcmlnaHQnLFxuICAvKipcbiAgKiBtb3Rpb24tdWkgYW5pbWF0aW9uIGNsYXNzIHRvIGFwcGx5XG4gICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAqIEBkZWZhdWx0ICdzbGlkZS1pbi1sZWZ0J1xuICAqXG4gICovXG4gIGFuaW1JbkZyb21MZWZ0OiAnc2xpZGUtaW4tbGVmdCcsXG4gIC8qKlxuICAqIG1vdGlvbi11aSBhbmltYXRpb24gY2xhc3MgdG8gYXBwbHlcbiAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICogQGRlZmF1bHQgJ3NsaWRlLW91dC1sZWZ0J1xuICAqL1xuICBhbmltT3V0VG9MZWZ0OiAnc2xpZGUtb3V0LWxlZnQnLFxuICAvKipcbiAgKiBBbGxvd3MgT3JiaXQgdG8gYXV0b21hdGljYWxseSBhbmltYXRlIG9uIHBhZ2UgbG9hZC5cbiAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAqIEBkZWZhdWx0IHRydWVcbiAgKi9cbiAgYXV0b1BsYXk6IHRydWUsXG4gIC8qKlxuICAqIEFtb3VudCBvZiB0aW1lLCBpbiBtcywgYmV0d2VlbiBzbGlkZSB0cmFuc2l0aW9uc1xuICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcn1cbiAgKiBAZGVmYXVsdCA1MDAwXG4gICovXG4gIHRpbWVyRGVsYXk6IDUwMDAsXG4gIC8qKlxuICAqIEFsbG93cyBPcmJpdCB0byBpbmZpbml0ZWx5IGxvb3AgdGhyb3VnaCB0aGUgc2xpZGVzXG4gICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgKiBAZGVmYXVsdCB0cnVlXG4gICovXG4gIGluZmluaXRlV3JhcDogdHJ1ZSxcbiAgLyoqXG4gICogQWxsb3dzIHRoZSBPcmJpdCBzbGlkZXMgdG8gYmluZCB0byBzd2lwZSBldmVudHMgZm9yIG1vYmlsZSwgcmVxdWlyZXMgYW4gYWRkaXRpb25hbCB1dGlsIGxpYnJhcnlcbiAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAqIEBkZWZhdWx0IHRydWVcbiAgKi9cbiAgc3dpcGU6IHRydWUsXG4gIC8qKlxuICAqIEFsbG93cyB0aGUgdGltaW5nIGZ1bmN0aW9uIHRvIHBhdXNlIGFuaW1hdGlvbiBvbiBob3Zlci5cbiAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAqIEBkZWZhdWx0IHRydWVcbiAgKi9cbiAgcGF1c2VPbkhvdmVyOiB0cnVlLFxuICAvKipcbiAgKiBBbGxvd3MgT3JiaXQgdG8gYmluZCBrZXlib2FyZCBldmVudHMgdG8gdGhlIHNsaWRlciwgdG8gYW5pbWF0ZSBmcmFtZXMgd2l0aCBhcnJvdyBrZXlzXG4gICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgKiBAZGVmYXVsdCB0cnVlXG4gICovXG4gIGFjY2Vzc2libGU6IHRydWUsXG4gIC8qKlxuICAqIENsYXNzIGFwcGxpZWQgdG8gdGhlIGNvbnRhaW5lciBvZiBPcmJpdFxuICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgKiBAZGVmYXVsdCAnb3JiaXQtY29udGFpbmVyJ1xuICAqL1xuICBjb250YWluZXJDbGFzczogJ29yYml0LWNvbnRhaW5lcicsXG4gIC8qKlxuICAqIENsYXNzIGFwcGxpZWQgdG8gaW5kaXZpZHVhbCBzbGlkZXMuXG4gICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAqIEBkZWZhdWx0ICdvcmJpdC1zbGlkZSdcbiAgKi9cbiAgc2xpZGVDbGFzczogJ29yYml0LXNsaWRlJyxcbiAgLyoqXG4gICogQ2xhc3MgYXBwbGllZCB0byB0aGUgYnVsbGV0IGNvbnRhaW5lci4gWW91J3JlIHdlbGNvbWUuXG4gICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAqIEBkZWZhdWx0ICdvcmJpdC1idWxsZXRzJ1xuICAqL1xuICBib3hPZkJ1bGxldHM6ICdvcmJpdC1idWxsZXRzJyxcbiAgLyoqXG4gICogQ2xhc3MgYXBwbGllZCB0byB0aGUgYG5leHRgIG5hdmlnYXRpb24gYnV0dG9uLlxuICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgKiBAZGVmYXVsdCAnb3JiaXQtbmV4dCdcbiAgKi9cbiAgbmV4dENsYXNzOiAnb3JiaXQtbmV4dCcsXG4gIC8qKlxuICAqIENsYXNzIGFwcGxpZWQgdG8gdGhlIGBwcmV2aW91c2AgbmF2aWdhdGlvbiBidXR0b24uXG4gICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAqIEBkZWZhdWx0ICdvcmJpdC1wcmV2aW91cydcbiAgKi9cbiAgcHJldkNsYXNzOiAnb3JiaXQtcHJldmlvdXMnLFxuICAvKipcbiAgKiBCb29sZWFuIHRvIGZsYWcgdGhlIGpzIHRvIHVzZSBtb3Rpb24gdWkgY2xhc3NlcyBvciBub3QuIERlZmF1bHQgdG8gdHJ1ZSBmb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdHkuXG4gICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgKiBAZGVmYXVsdCB0cnVlXG4gICovXG4gIHVzZU1VSTogdHJ1ZVxufTtcblxuLy8gV2luZG93IGV4cG9ydHNcbkZvdW5kYXRpb24ucGx1Z2luKE9yYml0LCAnT3JiaXQnKTtcblxufShqUXVlcnkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4hZnVuY3Rpb24oJCkge1xuXG4vKipcbiAqIFJlc3BvbnNpdmVNZW51IG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi5yZXNwb25zaXZlTWVudVxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC50cmlnZ2Vyc1xuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5tZWRpYVF1ZXJ5XG4gKi9cblxuY2xhc3MgUmVzcG9uc2l2ZU1lbnUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBhIHJlc3BvbnNpdmUgbWVudS5cbiAgICogQGNsYXNzXG4gICAqIEBmaXJlcyBSZXNwb25zaXZlTWVudSNpbml0XG4gICAqIEBwYXJhbSB7alF1ZXJ5fSBlbGVtZW50IC0galF1ZXJ5IG9iamVjdCB0byBtYWtlIGludG8gYSBkcm9wZG93biBtZW51LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlcyB0byB0aGUgZGVmYXVsdCBwbHVnaW4gc2V0dGluZ3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgdGhpcy5ydWxlcyA9IHRoaXMuJGVsZW1lbnQuZGF0YSgncmVzcG9uc2l2ZS1tZW51Jyk7XG4gICAgdGhpcy5jdXJyZW50TXEgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFBsdWdpbiA9IG51bGw7XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gICAgdGhpcy5fZXZlbnRzKCk7XG5cbiAgICBGb3VuZGF0aW9uLnJlZ2lzdGVyUGx1Z2luKHRoaXMsICdSZXNwb25zaXZlTWVudScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBNZW51IGJ5IHBhcnNpbmcgdGhlIGNsYXNzZXMgZnJvbSB0aGUgJ2RhdGEtUmVzcG9uc2l2ZU1lbnUnIGF0dHJpYnV0ZSBvbiB0aGUgZWxlbWVudC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdCgpIHtcbiAgICAvLyBUaGUgZmlyc3QgdGltZSBhbiBJbnRlcmNoYW5nZSBwbHVnaW4gaXMgaW5pdGlhbGl6ZWQsIHRoaXMucnVsZXMgaXMgY29udmVydGVkIGZyb20gYSBzdHJpbmcgb2YgXCJjbGFzc2VzXCIgdG8gYW4gb2JqZWN0IG9mIHJ1bGVzXG4gICAgaWYgKHR5cGVvZiB0aGlzLnJ1bGVzID09PSAnc3RyaW5nJykge1xuICAgICAgbGV0IHJ1bGVzVHJlZSA9IHt9O1xuXG4gICAgICAvLyBQYXJzZSBydWxlcyBmcm9tIFwiY2xhc3Nlc1wiIHB1bGxlZCBmcm9tIGRhdGEgYXR0cmlidXRlXG4gICAgICBsZXQgcnVsZXMgPSB0aGlzLnJ1bGVzLnNwbGl0KCcgJyk7XG5cbiAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBldmVyeSBydWxlIGZvdW5kXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBydWxlID0gcnVsZXNbaV0uc3BsaXQoJy0nKTtcbiAgICAgICAgbGV0IHJ1bGVTaXplID0gcnVsZS5sZW5ndGggPiAxID8gcnVsZVswXSA6ICdzbWFsbCc7XG4gICAgICAgIGxldCBydWxlUGx1Z2luID0gcnVsZS5sZW5ndGggPiAxID8gcnVsZVsxXSA6IHJ1bGVbMF07XG5cbiAgICAgICAgaWYgKE1lbnVQbHVnaW5zW3J1bGVQbHVnaW5dICE9PSBudWxsKSB7XG4gICAgICAgICAgcnVsZXNUcmVlW3J1bGVTaXplXSA9IE1lbnVQbHVnaW5zW3J1bGVQbHVnaW5dO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucnVsZXMgPSBydWxlc1RyZWU7XG4gICAgfVxuXG4gICAgaWYgKCEkLmlzRW1wdHlPYmplY3QodGhpcy5ydWxlcykpIHtcbiAgICAgIHRoaXMuX2NoZWNrTWVkaWFRdWVyaWVzKCk7XG4gICAgfVxuICAgIC8vIEFkZCBkYXRhLW11dGF0ZSBzaW5jZSBjaGlsZHJlbiBtYXkgbmVlZCBpdC5cbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2RhdGEtbXV0YXRlJywgKHRoaXMuJGVsZW1lbnQuYXR0cignZGF0YS1tdXRhdGUnKSB8fCBGb3VuZGF0aW9uLkdldFlvRGlnaXRzKDYsICdyZXNwb25zaXZlLW1lbnUnKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIGV2ZW50cyBmb3IgdGhlIE1lbnUuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V2ZW50cygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdjaGFuZ2VkLnpmLm1lZGlhcXVlcnknLCBmdW5jdGlvbigpIHtcbiAgICAgIF90aGlzLl9jaGVja01lZGlhUXVlcmllcygpO1xuICAgIH0pO1xuICAgIC8vICQod2luZG93KS5vbigncmVzaXplLnpmLlJlc3BvbnNpdmVNZW51JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBfdGhpcy5fY2hlY2tNZWRpYVF1ZXJpZXMoKTtcbiAgICAvLyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhlIGN1cnJlbnQgc2NyZWVuIHdpZHRoIGFnYWluc3QgYXZhaWxhYmxlIG1lZGlhIHF1ZXJpZXMuIElmIHRoZSBtZWRpYSBxdWVyeSBoYXMgY2hhbmdlZCwgYW5kIHRoZSBwbHVnaW4gbmVlZGVkIGhhcyBjaGFuZ2VkLCB0aGUgcGx1Z2lucyB3aWxsIHN3YXAgb3V0LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGVja01lZGlhUXVlcmllcygpIHtcbiAgICB2YXIgbWF0Y2hlZE1xLCBfdGhpcyA9IHRoaXM7XG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggcnVsZSBhbmQgZmluZCB0aGUgbGFzdCBtYXRjaGluZyBydWxlXG4gICAgJC5lYWNoKHRoaXMucnVsZXMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKEZvdW5kYXRpb24uTWVkaWFRdWVyeS5hdExlYXN0KGtleSkpIHtcbiAgICAgICAgbWF0Y2hlZE1xID0ga2V5O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTm8gbWF0Y2g/IE5vIGRpY2VcbiAgICBpZiAoIW1hdGNoZWRNcSkgcmV0dXJuO1xuXG4gICAgLy8gUGx1Z2luIGFscmVhZHkgaW5pdGlhbGl6ZWQ/IFdlIGdvb2RcbiAgICBpZiAodGhpcy5jdXJyZW50UGx1Z2luIGluc3RhbmNlb2YgdGhpcy5ydWxlc1ttYXRjaGVkTXFdLnBsdWdpbikgcmV0dXJuO1xuXG4gICAgLy8gUmVtb3ZlIGV4aXN0aW5nIHBsdWdpbi1zcGVjaWZpYyBDU1MgY2xhc3Nlc1xuICAgICQuZWFjaChNZW51UGx1Z2lucywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgX3RoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3ModmFsdWUuY3NzQ2xhc3MpO1xuICAgIH0pO1xuXG4gICAgLy8gQWRkIHRoZSBDU1MgY2xhc3MgZm9yIHRoZSBuZXcgcGx1Z2luXG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyh0aGlzLnJ1bGVzW21hdGNoZWRNcV0uY3NzQ2xhc3MpO1xuXG4gICAgLy8gQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBuZXcgcGx1Z2luXG4gICAgaWYgKHRoaXMuY3VycmVudFBsdWdpbikgdGhpcy5jdXJyZW50UGx1Z2luLmRlc3Ryb3koKTtcbiAgICB0aGlzLmN1cnJlbnRQbHVnaW4gPSBuZXcgdGhpcy5ydWxlc1ttYXRjaGVkTXFdLnBsdWdpbih0aGlzLiRlbGVtZW50LCB7fSk7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgdGhlIGluc3RhbmNlIG9mIHRoZSBjdXJyZW50IHBsdWdpbiBvbiB0aGlzIGVsZW1lbnQsIGFzIHdlbGwgYXMgdGhlIHdpbmRvdyByZXNpemUgaGFuZGxlciB0aGF0IHN3aXRjaGVzIHRoZSBwbHVnaW5zIG91dC5cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY3VycmVudFBsdWdpbi5kZXN0cm95KCk7XG4gICAgJCh3aW5kb3cpLm9mZignLnpmLlJlc3BvbnNpdmVNZW51Jyk7XG4gICAgRm91bmRhdGlvbi51bnJlZ2lzdGVyUGx1Z2luKHRoaXMpO1xuICB9XG59XG5cblJlc3BvbnNpdmVNZW51LmRlZmF1bHRzID0ge307XG5cbi8vIFRoZSBwbHVnaW4gbWF0Y2hlcyB0aGUgcGx1Z2luIGNsYXNzZXMgd2l0aCB0aGVzZSBwbHVnaW4gaW5zdGFuY2VzLlxudmFyIE1lbnVQbHVnaW5zID0ge1xuICBkcm9wZG93bjoge1xuICAgIGNzc0NsYXNzOiAnZHJvcGRvd24nLFxuICAgIHBsdWdpbjogRm91bmRhdGlvbi5fcGx1Z2luc1snZHJvcGRvd24tbWVudSddIHx8IG51bGxcbiAgfSxcbiBkcmlsbGRvd246IHtcbiAgICBjc3NDbGFzczogJ2RyaWxsZG93bicsXG4gICAgcGx1Z2luOiBGb3VuZGF0aW9uLl9wbHVnaW5zWydkcmlsbGRvd24nXSB8fCBudWxsXG4gIH0sXG4gIGFjY29yZGlvbjoge1xuICAgIGNzc0NsYXNzOiAnYWNjb3JkaW9uLW1lbnUnLFxuICAgIHBsdWdpbjogRm91bmRhdGlvbi5fcGx1Z2luc1snYWNjb3JkaW9uLW1lbnUnXSB8fCBudWxsXG4gIH1cbn07XG5cbi8vIFdpbmRvdyBleHBvcnRzXG5Gb3VuZGF0aW9uLnBsdWdpbihSZXNwb25zaXZlTWVudSwgJ1Jlc3BvbnNpdmVNZW51Jyk7XG5cbn0oalF1ZXJ5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuLyoqXG4gKiBSZXNwb25zaXZlVG9nZ2xlIG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi5yZXNwb25zaXZlVG9nZ2xlXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLm1lZGlhUXVlcnlcbiAqL1xuXG5jbGFzcyBSZXNwb25zaXZlVG9nZ2xlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgVGFiIEJhci5cbiAgICogQGNsYXNzXG4gICAqIEBmaXJlcyBSZXNwb25zaXZlVG9nZ2xlI2luaXRcbiAgICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnQgLSBqUXVlcnkgb2JqZWN0IHRvIGF0dGFjaCB0YWIgYmFyIGZ1bmN0aW9uYWxpdHkgdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGVzIHRvIHRoZSBkZWZhdWx0IHBsdWdpbiBzZXR0aW5ncy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgUmVzcG9uc2l2ZVRvZ2dsZS5kZWZhdWx0cywgdGhpcy4kZWxlbWVudC5kYXRhKCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICAgIHRoaXMuX2V2ZW50cygpO1xuXG4gICAgRm91bmRhdGlvbi5yZWdpc3RlclBsdWdpbih0aGlzLCAnUmVzcG9uc2l2ZVRvZ2dsZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSB0YWIgYmFyIGJ5IGZpbmRpbmcgdGhlIHRhcmdldCBlbGVtZW50LCB0b2dnbGluZyBlbGVtZW50LCBhbmQgcnVubmluZyB1cGRhdGUoKS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdCgpIHtcbiAgICB2YXIgdGFyZ2V0SUQgPSB0aGlzLiRlbGVtZW50LmRhdGEoJ3Jlc3BvbnNpdmUtdG9nZ2xlJyk7XG4gICAgaWYgKCF0YXJnZXRJRCkge1xuICAgICAgY29uc29sZS5lcnJvcignWW91ciB0YWIgYmFyIG5lZWRzIGFuIElEIG9mIGEgTWVudSBhcyB0aGUgdmFsdWUgb2YgZGF0YS10YWItYmFyLicpO1xuICAgIH1cblxuICAgIHRoaXMuJHRhcmdldE1lbnUgPSAkKGAjJHt0YXJnZXRJRH1gKTtcbiAgICB0aGlzLiR0b2dnbGVyID0gdGhpcy4kZWxlbWVudC5maW5kKCdbZGF0YS10b2dnbGVdJykuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuZGF0YSgndG9nZ2xlJyk7XG4gICAgICByZXR1cm4gKHRhcmdldCA9PT0gdGFyZ2V0SUQgfHwgdGFyZ2V0ID09PSBcIlwiKTtcbiAgICB9KTtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB0aGlzLiR0YXJnZXRNZW51LmRhdGEoKSk7XG5cbiAgICAvLyBJZiB0aGV5IHdlcmUgc2V0LCBwYXJzZSB0aGUgYW5pbWF0aW9uIGNsYXNzZXNcbiAgICBpZih0aGlzLm9wdGlvbnMuYW5pbWF0ZSkge1xuICAgICAgbGV0IGlucHV0ID0gdGhpcy5vcHRpb25zLmFuaW1hdGUuc3BsaXQoJyAnKTtcblxuICAgICAgdGhpcy5hbmltYXRpb25JbiA9IGlucHV0WzBdO1xuICAgICAgdGhpcy5hbmltYXRpb25PdXQgPSBpbnB1dFsxXSB8fCBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgbmVjZXNzYXJ5IGV2ZW50IGhhbmRsZXJzIGZvciB0aGUgdGFiIGJhciB0byB3b3JrLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ldmVudHMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuX3VwZGF0ZU1xSGFuZGxlciA9IHRoaXMuX3VwZGF0ZS5iaW5kKHRoaXMpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdjaGFuZ2VkLnpmLm1lZGlhcXVlcnknLCB0aGlzLl91cGRhdGVNcUhhbmRsZXIpO1xuXG4gICAgdGhpcy4kdG9nZ2xlci5vbignY2xpY2suemYucmVzcG9uc2l2ZVRvZ2dsZScsIHRoaXMudG9nZ2xlTWVudS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhlIGN1cnJlbnQgbWVkaWEgcXVlcnkgdG8gZGV0ZXJtaW5lIGlmIHRoZSB0YWIgYmFyIHNob3VsZCBiZSB2aXNpYmxlIG9yIGhpZGRlbi5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdXBkYXRlKCkge1xuICAgIC8vIE1vYmlsZVxuICAgIGlmICghRm91bmRhdGlvbi5NZWRpYVF1ZXJ5LmF0TGVhc3QodGhpcy5vcHRpb25zLmhpZGVGb3IpKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnNob3coKTtcbiAgICAgIHRoaXMuJHRhcmdldE1lbnUuaGlkZSgpO1xuICAgIH1cblxuICAgIC8vIERlc2t0b3BcbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQuaGlkZSgpO1xuICAgICAgdGhpcy4kdGFyZ2V0TWVudS5zaG93KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGVsZW1lbnQgYXR0YWNoZWQgdG8gdGhlIHRhYiBiYXIuIFRoZSB0b2dnbGUgb25seSBoYXBwZW5zIGlmIHRoZSBzY3JlZW4gaXMgc21hbGwgZW5vdWdoIHRvIGFsbG93IGl0LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQGZpcmVzIFJlc3BvbnNpdmVUb2dnbGUjdG9nZ2xlZFxuICAgKi9cbiAgdG9nZ2xlTWVudSgpIHtcbiAgICBpZiAoIUZvdW5kYXRpb24uTWVkaWFRdWVyeS5hdExlYXN0KHRoaXMub3B0aW9ucy5oaWRlRm9yKSkge1xuICAgICAgLyoqXG4gICAgICAgKiBGaXJlcyB3aGVuIHRoZSBlbGVtZW50IGF0dGFjaGVkIHRvIHRoZSB0YWIgYmFyIHRvZ2dsZXMuXG4gICAgICAgKiBAZXZlbnQgUmVzcG9uc2l2ZVRvZ2dsZSN0b2dnbGVkXG4gICAgICAgKi9cbiAgICAgIGlmKHRoaXMub3B0aW9ucy5hbmltYXRlKSB7XG4gICAgICAgIGlmICh0aGlzLiR0YXJnZXRNZW51LmlzKCc6aGlkZGVuJykpIHtcbiAgICAgICAgICBGb3VuZGF0aW9uLk1vdGlvbi5hbmltYXRlSW4odGhpcy4kdGFyZ2V0TWVudSwgdGhpcy5hbmltYXRpb25JbiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCd0b2dnbGVkLnpmLnJlc3BvbnNpdmVUb2dnbGUnKTtcbiAgICAgICAgICAgIHRoaXMuJHRhcmdldE1lbnUuZmluZCgnW2RhdGEtbXV0YXRlXScpLnRyaWdnZXJIYW5kbGVyKCdtdXRhdGVtZS56Zi50cmlnZ2VyJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgRm91bmRhdGlvbi5Nb3Rpb24uYW5pbWF0ZU91dCh0aGlzLiR0YXJnZXRNZW51LCB0aGlzLmFuaW1hdGlvbk91dCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCd0b2dnbGVkLnpmLnJlc3BvbnNpdmVUb2dnbGUnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuJHRhcmdldE1lbnUudG9nZ2xlKDApO1xuICAgICAgICB0aGlzLiR0YXJnZXRNZW51LmZpbmQoJ1tkYXRhLW11dGF0ZV0nKS50cmlnZ2VyKCdtdXRhdGVtZS56Zi50cmlnZ2VyJyk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigndG9nZ2xlZC56Zi5yZXNwb25zaXZlVG9nZ2xlJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kZWxlbWVudC5vZmYoJy56Zi5yZXNwb25zaXZlVG9nZ2xlJyk7XG4gICAgdGhpcy4kdG9nZ2xlci5vZmYoJy56Zi5yZXNwb25zaXZlVG9nZ2xlJyk7XG5cbiAgICAkKHdpbmRvdykub2ZmKCdjaGFuZ2VkLnpmLm1lZGlhcXVlcnknLCB0aGlzLl91cGRhdGVNcUhhbmRsZXIpO1xuXG4gICAgRm91bmRhdGlvbi51bnJlZ2lzdGVyUGx1Z2luKHRoaXMpO1xuICB9XG59XG5cblJlc3BvbnNpdmVUb2dnbGUuZGVmYXVsdHMgPSB7XG4gIC8qKlxuICAgKiBUaGUgYnJlYWtwb2ludCBhZnRlciB3aGljaCB0aGUgbWVudSBpcyBhbHdheXMgc2hvd24sIGFuZCB0aGUgdGFiIGJhciBpcyBoaWRkZW4uXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ21lZGl1bSdcbiAgICovXG4gIGhpZGVGb3I6ICdtZWRpdW0nLFxuXG4gIC8qKlxuICAgKiBUbyBkZWNpZGUgaWYgdGhlIHRvZ2dsZSBzaG91bGQgYmUgYW5pbWF0ZWQgb3Igbm90LlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgYW5pbWF0ZTogZmFsc2Vcbn07XG5cbi8vIFdpbmRvdyBleHBvcnRzXG5Gb3VuZGF0aW9uLnBsdWdpbihSZXNwb25zaXZlVG9nZ2xlLCAnUmVzcG9uc2l2ZVRvZ2dsZScpO1xuXG59KGpRdWVyeSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbiFmdW5jdGlvbigkKSB7XG5cbi8qKlxuICogUmV2ZWFsIG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi5yZXZlYWxcbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwua2V5Ym9hcmRcbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwuYm94XG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLnRyaWdnZXJzXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLm1lZGlhUXVlcnlcbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwubW90aW9uIGlmIHVzaW5nIGFuaW1hdGlvbnNcbiAqL1xuXG5jbGFzcyBSZXZlYWwge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBSZXZlYWwuXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0ge2pRdWVyeX0gZWxlbWVudCAtIGpRdWVyeSBvYmplY3QgdG8gdXNlIGZvciB0aGUgbW9kYWwuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gb3B0aW9uYWwgcGFyYW1ldGVycy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgUmV2ZWFsLmRlZmF1bHRzLCB0aGlzLiRlbGVtZW50LmRhdGEoKSwgb3B0aW9ucyk7XG4gICAgdGhpcy5faW5pdCgpO1xuXG4gICAgRm91bmRhdGlvbi5yZWdpc3RlclBsdWdpbih0aGlzLCAnUmV2ZWFsJyk7XG4gICAgRm91bmRhdGlvbi5LZXlib2FyZC5yZWdpc3RlcignUmV2ZWFsJywge1xuICAgICAgJ0VOVEVSJzogJ29wZW4nLFxuICAgICAgJ1NQQUNFJzogJ29wZW4nLFxuICAgICAgJ0VTQ0FQRSc6ICdjbG9zZScsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIG1vZGFsIGJ5IGFkZGluZyB0aGUgb3ZlcmxheSBhbmQgY2xvc2UgYnV0dG9ucywgKGlmIHNlbGVjdGVkKS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0KCkge1xuICAgIHRoaXMuaWQgPSB0aGlzLiRlbGVtZW50LmF0dHIoJ2lkJyk7XG4gICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuY2FjaGVkID0ge21xOiBGb3VuZGF0aW9uLk1lZGlhUXVlcnkuY3VycmVudH07XG4gICAgdGhpcy5pc01vYmlsZSA9IG1vYmlsZVNuaWZmKCk7XG5cbiAgICB0aGlzLiRhbmNob3IgPSAkKGBbZGF0YS1vcGVuPVwiJHt0aGlzLmlkfVwiXWApLmxlbmd0aCA/ICQoYFtkYXRhLW9wZW49XCIke3RoaXMuaWR9XCJdYCkgOiAkKGBbZGF0YS10b2dnbGU9XCIke3RoaXMuaWR9XCJdYCk7XG4gICAgdGhpcy4kYW5jaG9yLmF0dHIoe1xuICAgICAgJ2FyaWEtY29udHJvbHMnOiB0aGlzLmlkLFxuICAgICAgJ2FyaWEtaGFzcG9wdXAnOiB0cnVlLFxuICAgICAgJ3RhYmluZGV4JzogMFxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5mdWxsU2NyZWVuIHx8IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2Z1bGwnKSkge1xuICAgICAgdGhpcy5vcHRpb25zLmZ1bGxTY3JlZW4gPSB0cnVlO1xuICAgICAgdGhpcy5vcHRpb25zLm92ZXJsYXkgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5vdmVybGF5ICYmICF0aGlzLiRvdmVybGF5KSB7XG4gICAgICB0aGlzLiRvdmVybGF5ID0gdGhpcy5fbWFrZU92ZXJsYXkodGhpcy5pZCk7XG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC5hdHRyKHtcbiAgICAgICAgJ3JvbGUnOiAnZGlhbG9nJyxcbiAgICAgICAgJ2FyaWEtaGlkZGVuJzogdHJ1ZSxcbiAgICAgICAgJ2RhdGEteWV0aS1ib3gnOiB0aGlzLmlkLFxuICAgICAgICAnZGF0YS1yZXNpemUnOiB0aGlzLmlkXG4gICAgfSk7XG5cbiAgICBpZih0aGlzLiRvdmVybGF5KSB7XG4gICAgICB0aGlzLiRlbGVtZW50LmRldGFjaCgpLmFwcGVuZFRvKHRoaXMuJG92ZXJsYXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRlbGVtZW50LmRldGFjaCgpLmFwcGVuZFRvKCQodGhpcy5vcHRpb25zLmFwcGVuZFRvKSk7XG4gICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCd3aXRob3V0LW92ZXJsYXknKTtcbiAgICB9XG4gICAgdGhpcy5fZXZlbnRzKCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZWVwTGluayAmJiB3aW5kb3cubG9jYXRpb24uaGFzaCA9PT0gKCBgIyR7dGhpcy5pZH1gKSkge1xuICAgICAgJCh3aW5kb3cpLm9uZSgnbG9hZC56Zi5yZXZlYWwnLCB0aGlzLm9wZW4uYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gb3ZlcmxheSBkaXYgdG8gZGlzcGxheSBiZWhpbmQgdGhlIG1vZGFsLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX21ha2VPdmVybGF5KCkge1xuICAgIHJldHVybiAkKCc8ZGl2PjwvZGl2PicpXG4gICAgICAuYWRkQ2xhc3MoJ3JldmVhbC1vdmVybGF5JylcbiAgICAgIC5hcHBlbmRUbyh0aGlzLm9wdGlvbnMuYXBwZW5kVG8pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgcG9zaXRpb24gb2YgbW9kYWxcbiAgICogVE9ETzogIEZpZ3VyZSBvdXQgaWYgd2UgYWN0dWFsbHkgbmVlZCB0byBjYWNoZSB0aGVzZSB2YWx1ZXMgb3IgaWYgaXQgZG9lc24ndCBtYXR0ZXJcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF91cGRhdGVQb3NpdGlvbigpIHtcbiAgICB2YXIgd2lkdGggPSB0aGlzLiRlbGVtZW50Lm91dGVyV2lkdGgoKTtcbiAgICB2YXIgb3V0ZXJXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuICAgIHZhciBoZWlnaHQgPSB0aGlzLiRlbGVtZW50Lm91dGVySGVpZ2h0KCk7XG4gICAgdmFyIG91dGVySGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgIHZhciBsZWZ0LCB0b3A7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5oT2Zmc2V0ID09PSAnYXV0bycpIHtcbiAgICAgIGxlZnQgPSBwYXJzZUludCgob3V0ZXJXaWR0aCAtIHdpZHRoKSAvIDIsIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVmdCA9IHBhcnNlSW50KHRoaXMub3B0aW9ucy5oT2Zmc2V0LCAxMCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMudk9mZnNldCA9PT0gJ2F1dG8nKSB7XG4gICAgICBpZiAoaGVpZ2h0ID4gb3V0ZXJIZWlnaHQpIHtcbiAgICAgICAgdG9wID0gcGFyc2VJbnQoTWF0aC5taW4oMTAwLCBvdXRlckhlaWdodCAvIDEwKSwgMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9wID0gcGFyc2VJbnQoKG91dGVySGVpZ2h0IC0gaGVpZ2h0KSAvIDQsIDEwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdG9wID0gcGFyc2VJbnQodGhpcy5vcHRpb25zLnZPZmZzZXQsIDEwKTtcbiAgICB9XG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe3RvcDogdG9wICsgJ3B4J30pO1xuICAgIC8vIG9ubHkgd29ycnkgYWJvdXQgbGVmdCBpZiB3ZSBkb24ndCBoYXZlIGFuIG92ZXJsYXkgb3Igd2UgaGF2ZWEgIGhvcml6b250YWwgb2Zmc2V0LFxuICAgIC8vIG90aGVyd2lzZSB3ZSdyZSBwZXJmZWN0bHkgaW4gdGhlIG1pZGRsZVxuICAgIGlmKCF0aGlzLiRvdmVybGF5IHx8ICh0aGlzLm9wdGlvbnMuaE9mZnNldCAhPT0gJ2F1dG8nKSkge1xuICAgICAgdGhpcy4kZWxlbWVudC5jc3Moe2xlZnQ6IGxlZnQgKyAncHgnfSk7XG4gICAgICB0aGlzLiRlbGVtZW50LmNzcyh7bWFyZ2luOiAnMHB4J30pO1xuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgZXZlbnQgaGFuZGxlcnMgZm9yIHRoZSBtb2RhbC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ldmVudHMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuJGVsZW1lbnQub24oe1xuICAgICAgJ29wZW4uemYudHJpZ2dlcic6IHRoaXMub3Blbi5iaW5kKHRoaXMpLFxuICAgICAgJ2Nsb3NlLnpmLnRyaWdnZXInOiAoZXZlbnQsICRlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICgoZXZlbnQudGFyZ2V0ID09PSBfdGhpcy4kZWxlbWVudFswXSkgfHxcbiAgICAgICAgICAgICgkKGV2ZW50LnRhcmdldCkucGFyZW50cygnW2RhdGEtY2xvc2FibGVdJylbMF0gPT09ICRlbGVtZW50KSkgeyAvLyBvbmx5IGNsb3NlIHJldmVhbCB3aGVuIGl0J3MgZXhwbGljaXRseSBjYWxsZWRcbiAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZS5hcHBseSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICd0b2dnbGUuemYudHJpZ2dlcic6IHRoaXMudG9nZ2xlLmJpbmQodGhpcyksXG4gICAgICAncmVzaXplbWUuemYudHJpZ2dlcic6IGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLiRhbmNob3IubGVuZ3RoKSB7XG4gICAgICB0aGlzLiRhbmNob3Iub24oJ2tleWRvd24uemYucmV2ZWFsJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS53aGljaCA9PT0gMTMgfHwgZS53aGljaCA9PT0gMzIpIHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBfdGhpcy5vcGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2VPbkNsaWNrICYmIHRoaXMub3B0aW9ucy5vdmVybGF5KSB7XG4gICAgICB0aGlzLiRvdmVybGF5Lm9mZignLnpmLnJldmVhbCcpLm9uKCdjbGljay56Zi5yZXZlYWwnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gX3RoaXMuJGVsZW1lbnRbMF0gfHxcbiAgICAgICAgICAkLmNvbnRhaW5zKF90aGlzLiRlbGVtZW50WzBdLCBlLnRhcmdldCkgfHxcbiAgICAgICAgICAgICEkLmNvbnRhaW5zKGRvY3VtZW50LCBlLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZWVwTGluaykge1xuICAgICAgJCh3aW5kb3cpLm9uKGBwb3BzdGF0ZS56Zi5yZXZlYWw6JHt0aGlzLmlkfWAsIHRoaXMuX2hhbmRsZVN0YXRlLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIG1vZGFsIG1ldGhvZHMgb24gYmFjay9mb3J3YXJkIGJ1dHRvbiBjbGlja3Mgb3IgYW55IG90aGVyIGV2ZW50IHRoYXQgdHJpZ2dlcnMgcG9wc3RhdGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaGFuZGxlU3RhdGUoZSkge1xuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoID09PSAoICcjJyArIHRoaXMuaWQpICYmICF0aGlzLmlzQWN0aXZlKXsgdGhpcy5vcGVuKCk7IH1cbiAgICBlbHNleyB0aGlzLmNsb3NlKCk7IH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIE9wZW5zIHRoZSBtb2RhbCBjb250cm9sbGVkIGJ5IGB0aGlzLiRhbmNob3JgLCBhbmQgY2xvc2VzIGFsbCBvdGhlcnMgYnkgZGVmYXVsdC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBmaXJlcyBSZXZlYWwjY2xvc2VtZVxuICAgKiBAZmlyZXMgUmV2ZWFsI29wZW5cbiAgICovXG4gIG9wZW4oKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZWVwTGluaykge1xuICAgICAgdmFyIGhhc2ggPSBgIyR7dGhpcy5pZH1gO1xuXG4gICAgICBpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBudWxsLCBoYXNoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaGFzaDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcblxuICAgIC8vIE1ha2UgZWxlbWVudHMgaW52aXNpYmxlLCBidXQgcmVtb3ZlIGRpc3BsYXk6IG5vbmUgc28gd2UgY2FuIGdldCBzaXplIGFuZCBwb3NpdGlvbmluZ1xuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLmNzcyh7ICd2aXNpYmlsaXR5JzogJ2hpZGRlbicgfSlcbiAgICAgICAgLnNob3coKVxuICAgICAgICAuc2Nyb2xsVG9wKDApO1xuICAgIGlmICh0aGlzLm9wdGlvbnMub3ZlcmxheSkge1xuICAgICAgdGhpcy4kb3ZlcmxheS5jc3Moeyd2aXNpYmlsaXR5JzogJ2hpZGRlbid9KS5zaG93KCk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5oaWRlKClcbiAgICAgIC5jc3MoeyAndmlzaWJpbGl0eSc6ICcnIH0pO1xuXG4gICAgaWYodGhpcy4kb3ZlcmxheSkge1xuICAgICAgdGhpcy4kb3ZlcmxheS5jc3Moeyd2aXNpYmlsaXR5JzogJyd9KS5oaWRlKCk7XG4gICAgICBpZih0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYXN0JykpIHtcbiAgICAgICAgdGhpcy4kb3ZlcmxheS5hZGRDbGFzcygnZmFzdCcpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdzbG93JykpIHtcbiAgICAgICAgdGhpcy4kb3ZlcmxheS5hZGRDbGFzcygnc2xvdycpO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMubXVsdGlwbGVPcGVuZWQpIHtcbiAgICAgIC8qKlxuICAgICAgICogRmlyZXMgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBtb2RhbCBvcGVucy5cbiAgICAgICAqIENsb3NlcyBhbnkgb3RoZXIgbW9kYWxzIHRoYXQgYXJlIGN1cnJlbnRseSBvcGVuXG4gICAgICAgKiBAZXZlbnQgUmV2ZWFsI2Nsb3NlbWVcbiAgICAgICAqL1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjbG9zZW1lLnpmLnJldmVhbCcsIHRoaXMuaWQpO1xuICAgIH1cblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBhZGRSZXZlYWxPcGVuQ2xhc3NlcygpIHtcbiAgICAgIGlmIChfdGhpcy5pc01vYmlsZSkge1xuICAgICAgICBpZighX3RoaXMub3JpZ2luYWxTY3JvbGxQb3MpIHtcbiAgICAgICAgICBfdGhpcy5vcmlnaW5hbFNjcm9sbFBvcyA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICAkKCdodG1sLCBib2R5JykuYWRkQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBNb3Rpb24gVUkgbWV0aG9kIG9mIHJldmVhbFxuICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uSW4pIHtcbiAgICAgIGZ1bmN0aW9uIGFmdGVyQW5pbWF0aW9uKCl7XG4gICAgICAgIF90aGlzLiRlbGVtZW50XG4gICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogZmFsc2UsXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAtMVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZvY3VzKCk7XG4gICAgICAgIGFkZFJldmVhbE9wZW5DbGFzc2VzKCk7XG4gICAgICAgIEZvdW5kYXRpb24uS2V5Ym9hcmQudHJhcEZvY3VzKF90aGlzLiRlbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMub3ZlcmxheSkge1xuICAgICAgICBGb3VuZGF0aW9uLk1vdGlvbi5hbmltYXRlSW4odGhpcy4kb3ZlcmxheSwgJ2ZhZGUtaW4nKTtcbiAgICAgIH1cbiAgICAgIEZvdW5kYXRpb24uTW90aW9uLmFuaW1hdGVJbih0aGlzLiRlbGVtZW50LCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uSW4sICgpID0+IHtcbiAgICAgICAgaWYodGhpcy4kZWxlbWVudCkgeyAvLyBwcm90ZWN0IGFnYWluc3Qgb2JqZWN0IGhhdmluZyBiZWVuIHJlbW92ZWRcbiAgICAgICAgICB0aGlzLmZvY3VzYWJsZUVsZW1lbnRzID0gRm91bmRhdGlvbi5LZXlib2FyZC5maW5kRm9jdXNhYmxlKHRoaXMuJGVsZW1lbnQpO1xuICAgICAgICAgIGFmdGVyQW5pbWF0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBqUXVlcnkgbWV0aG9kIG9mIHJldmVhbFxuICAgIGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5vdmVybGF5KSB7XG4gICAgICAgIHRoaXMuJG92ZXJsYXkuc2hvdygwKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGVsZW1lbnQuc2hvdyh0aGlzLm9wdGlvbnMuc2hvd0RlbGF5KTtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgYWNjZXNzaWJpbGl0eVxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5hdHRyKHtcbiAgICAgICAgJ2FyaWEtaGlkZGVuJzogZmFsc2UsXG4gICAgICAgICd0YWJpbmRleCc6IC0xXG4gICAgICB9KVxuICAgICAgLmZvY3VzKCk7XG4gICAgRm91bmRhdGlvbi5LZXlib2FyZC50cmFwRm9jdXModGhpcy4kZWxlbWVudCk7XG5cbiAgICAvKipcbiAgICAgKiBGaXJlcyB3aGVuIHRoZSBtb2RhbCBoYXMgc3VjY2Vzc2Z1bGx5IG9wZW5lZC5cbiAgICAgKiBAZXZlbnQgUmV2ZWFsI29wZW5cbiAgICAgKi9cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ29wZW4uemYucmV2ZWFsJyk7XG5cbiAgICBhZGRSZXZlYWxPcGVuQ2xhc3NlcygpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9leHRyYUhhbmRsZXJzKCk7XG4gICAgfSwgMCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBleHRyYSBldmVudCBoYW5kbGVycyBmb3IgdGhlIGJvZHkgYW5kIHdpbmRvdyBpZiBuZWNlc3NhcnkuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXh0cmFIYW5kbGVycygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIGlmKCF0aGlzLiRlbGVtZW50KSB7IHJldHVybjsgfSAvLyBJZiB3ZSdyZSBpbiB0aGUgbWlkZGxlIG9mIGNsZWFudXAsIGRvbid0IGZyZWFrIG91dFxuICAgIHRoaXMuZm9jdXNhYmxlRWxlbWVudHMgPSBGb3VuZGF0aW9uLktleWJvYXJkLmZpbmRGb2N1c2FibGUodGhpcy4kZWxlbWVudCk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5vdmVybGF5ICYmIHRoaXMub3B0aW9ucy5jbG9zZU9uQ2xpY2sgJiYgIXRoaXMub3B0aW9ucy5mdWxsU2NyZWVuKSB7XG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrLnpmLnJldmVhbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBfdGhpcy4kZWxlbWVudFswXSB8fFxuICAgICAgICAgICQuY29udGFpbnMoX3RoaXMuJGVsZW1lbnRbMF0sIGUudGFyZ2V0KSB8fFxuICAgICAgICAgICAgISQuY29udGFpbnMoZG9jdW1lbnQsIGUudGFyZ2V0KSkgeyByZXR1cm47IH1cbiAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2VPbkVzYykge1xuICAgICAgJCh3aW5kb3cpLm9uKCdrZXlkb3duLnpmLnJldmVhbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgRm91bmRhdGlvbi5LZXlib2FyZC5oYW5kbGVLZXkoZSwgJ1JldmVhbCcsIHtcbiAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5jbG9zZU9uRXNjKSB7XG4gICAgICAgICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgIF90aGlzLiRhbmNob3IuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gbG9jayBmb2N1cyB3aXRoaW4gbW9kYWwgd2hpbGUgdGFiYmluZ1xuICAgIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24uemYucmV2ZWFsJywgZnVuY3Rpb24oZSkge1xuICAgICAgdmFyICR0YXJnZXQgPSAkKHRoaXMpO1xuICAgICAgLy8gaGFuZGxlIGtleWJvYXJkIGV2ZW50IHdpdGgga2V5Ym9hcmQgdXRpbFxuICAgICAgRm91bmRhdGlvbi5LZXlib2FyZC5oYW5kbGVLZXkoZSwgJ1JldmVhbCcsIHtcbiAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKF90aGlzLiRlbGVtZW50LmZpbmQoJzpmb2N1cycpLmlzKF90aGlzLiRlbGVtZW50LmZpbmQoJ1tkYXRhLWNsb3NlXScpKSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgLy8gc2V0IGZvY3VzIGJhY2sgdG8gYW5jaG9yIGlmIGNsb3NlIGJ1dHRvbiBoYXMgYmVlbiBhY3RpdmF0ZWRcbiAgICAgICAgICAgICAgX3RoaXMuJGFuY2hvci5mb2N1cygpO1xuICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgfSBlbHNlIGlmICgkdGFyZ2V0LmlzKF90aGlzLmZvY3VzYWJsZUVsZW1lbnRzKSkgeyAvLyBkb250J3QgdHJpZ2dlciBpZiBhY3VhbCBlbGVtZW50IGhhcyBmb2N1cyAoaS5lLiBpbnB1dHMsIGxpbmtzLCAuLi4pXG4gICAgICAgICAgICBfdGhpcy5vcGVuKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMuY2xvc2VPbkVzYykge1xuICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIF90aGlzLiRhbmNob3IuZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZWQ6IGZ1bmN0aW9uKHByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgaWYgKHByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIG1vZGFsLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQGZpcmVzIFJldmVhbCNjbG9zZWRcbiAgICovXG4gIGNsb3NlKCkge1xuICAgIGlmICghdGhpcy5pc0FjdGl2ZSB8fCAhdGhpcy4kZWxlbWVudC5pcygnOnZpc2libGUnKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gTW90aW9uIFVJIG1ldGhvZCBvZiBoaWRpbmdcbiAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbk91dCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5vdmVybGF5KSB7XG4gICAgICAgIEZvdW5kYXRpb24uTW90aW9uLmFuaW1hdGVPdXQodGhpcy4kb3ZlcmxheSwgJ2ZhZGUtb3V0JywgZmluaXNoVXApO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZpbmlzaFVwKCk7XG4gICAgICB9XG5cbiAgICAgIEZvdW5kYXRpb24uTW90aW9uLmFuaW1hdGVPdXQodGhpcy4kZWxlbWVudCwgdGhpcy5vcHRpb25zLmFuaW1hdGlvbk91dCk7XG4gICAgfVxuICAgIC8vIGpRdWVyeSBtZXRob2Qgb2YgaGlkaW5nXG4gICAgZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLm92ZXJsYXkpIHtcbiAgICAgICAgdGhpcy4kb3ZlcmxheS5oaWRlKDAsIGZpbmlzaFVwKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBmaW5pc2hVcCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRlbGVtZW50LmhpZGUodGhpcy5vcHRpb25zLmhpZGVEZWxheSk7XG4gICAgfVxuXG4gICAgLy8gQ29uZGl0aW9uYWxzIHRvIHJlbW92ZSBleHRyYSBldmVudCBsaXN0ZW5lcnMgYWRkZWQgb24gb3BlblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2VPbkVzYykge1xuICAgICAgJCh3aW5kb3cpLm9mZigna2V5ZG93bi56Zi5yZXZlYWwnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5vdmVybGF5ICYmIHRoaXMub3B0aW9ucy5jbG9zZU9uQ2xpY2spIHtcbiAgICAgICQoJ2JvZHknKS5vZmYoJ2NsaWNrLnpmLnJldmVhbCcpO1xuICAgIH1cblxuICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duLnpmLnJldmVhbCcpO1xuXG4gICAgZnVuY3Rpb24gZmluaXNoVXAoKSB7XG4gICAgICBpZiAoX3RoaXMuaXNNb2JpbGUpIHtcbiAgICAgICAgJCgnaHRtbCwgYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xuICAgICAgICBpZihfdGhpcy5vcmlnaW5hbFNjcm9sbFBvcykge1xuICAgICAgICAgICQoJ2JvZHknKS5zY3JvbGxUb3AoX3RoaXMub3JpZ2luYWxTY3JvbGxQb3MpO1xuICAgICAgICAgIF90aGlzLm9yaWdpbmFsU2Nyb2xsUG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcbiAgICAgIH1cblxuXG4gICAgICBGb3VuZGF0aW9uLktleWJvYXJkLnJlbGVhc2VGb2N1cyhfdGhpcy4kZWxlbWVudCk7XG5cbiAgICAgIF90aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgICAgIC8qKlxuICAgICAgKiBGaXJlcyB3aGVuIHRoZSBtb2RhbCBpcyBkb25lIGNsb3NpbmcuXG4gICAgICAqIEBldmVudCBSZXZlYWwjY2xvc2VkXG4gICAgICAqL1xuICAgICAgX3RoaXMuJGVsZW1lbnQudHJpZ2dlcignY2xvc2VkLnpmLnJldmVhbCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogUmVzZXRzIHRoZSBtb2RhbCBjb250ZW50XG4gICAgKiBUaGlzIHByZXZlbnRzIGEgcnVubmluZyB2aWRlbyB0byBrZWVwIGdvaW5nIGluIHRoZSBiYWNrZ3JvdW5kXG4gICAgKi9cbiAgICBpZiAodGhpcy5vcHRpb25zLnJlc2V0T25DbG9zZSkge1xuICAgICAgdGhpcy4kZWxlbWVudC5odG1sKHRoaXMuJGVsZW1lbnQuaHRtbCgpKTtcbiAgICB9XG5cbiAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgIGlmIChfdGhpcy5vcHRpb25zLmRlZXBMaW5rKSB7XG4gICAgICAgaWYgKHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSkge1xuICAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCcnLCBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZShgIyR7dGhpcy5pZH1gLCAnJykpO1xuICAgICAgIH0gZWxzZSB7XG4gICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcnO1xuICAgICAgIH1cbiAgICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIG9wZW4vY2xvc2VkIHN0YXRlIG9mIGEgbW9kYWwuXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRGVzdHJveXMgYW4gaW5zdGFuY2Ugb2YgYSBtb2RhbC5cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMub3ZlcmxheSkge1xuICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmRUbygkKHRoaXMub3B0aW9ucy5hcHBlbmRUbykpOyAvLyBtb3ZlICRlbGVtZW50IG91dHNpZGUgb2YgJG92ZXJsYXkgdG8gcHJldmVudCBlcnJvciB1bnJlZ2lzdGVyUGx1Z2luKClcbiAgICAgIHRoaXMuJG92ZXJsYXkuaGlkZSgpLm9mZigpLnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLiRlbGVtZW50LmhpZGUoKS5vZmYoKTtcbiAgICB0aGlzLiRhbmNob3Iub2ZmKCcuemYnKTtcbiAgICAkKHdpbmRvdykub2ZmKGAuemYucmV2ZWFsOiR7dGhpcy5pZH1gKTtcblxuICAgIEZvdW5kYXRpb24udW5yZWdpc3RlclBsdWdpbih0aGlzKTtcbiAgfTtcbn1cblxuUmV2ZWFsLmRlZmF1bHRzID0ge1xuICAvKipcbiAgICogTW90aW9uLVVJIGNsYXNzIHRvIHVzZSBmb3IgYW5pbWF0ZWQgZWxlbWVudHMuIElmIG5vbmUgdXNlZCwgZGVmYXVsdHMgdG8gc2ltcGxlIHNob3cvaGlkZS5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnJ1xuICAgKi9cbiAgYW5pbWF0aW9uSW46ICcnLFxuICAvKipcbiAgICogTW90aW9uLVVJIGNsYXNzIHRvIHVzZSBmb3IgYW5pbWF0ZWQgZWxlbWVudHMuIElmIG5vbmUgdXNlZCwgZGVmYXVsdHMgdG8gc2ltcGxlIHNob3cvaGlkZS5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnJ1xuICAgKi9cbiAgYW5pbWF0aW9uT3V0OiAnJyxcbiAgLyoqXG4gICAqIFRpbWUsIGluIG1zLCB0byBkZWxheSB0aGUgb3BlbmluZyBvZiBhIG1vZGFsIGFmdGVyIGEgY2xpY2sgaWYgbm8gYW5pbWF0aW9uIHVzZWQuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgc2hvd0RlbGF5OiAwLFxuICAvKipcbiAgICogVGltZSwgaW4gbXMsIHRvIGRlbGF5IHRoZSBjbG9zaW5nIG9mIGEgbW9kYWwgYWZ0ZXIgYSBjbGljayBpZiBubyBhbmltYXRpb24gdXNlZC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICBoaWRlRGVsYXk6IDAsXG4gIC8qKlxuICAgKiBBbGxvd3MgYSBjbGljayBvbiB0aGUgYm9keS9vdmVybGF5IHRvIGNsb3NlIHRoZSBtb2RhbC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgY2xvc2VPbkNsaWNrOiB0cnVlLFxuICAvKipcbiAgICogQWxsb3dzIHRoZSBtb2RhbCB0byBjbG9zZSBpZiB0aGUgdXNlciBwcmVzc2VzIHRoZSBgRVNDQVBFYCBrZXkuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIGNsb3NlT25Fc2M6IHRydWUsXG4gIC8qKlxuICAgKiBJZiB0cnVlLCBhbGxvd3MgbXVsdGlwbGUgbW9kYWxzIHRvIGJlIGRpc3BsYXllZCBhdCBvbmNlLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgbXVsdGlwbGVPcGVuZWQ6IGZhbHNlLFxuICAvKipcbiAgICogRGlzdGFuY2UsIGluIHBpeGVscywgdGhlIG1vZGFsIHNob3VsZCBwdXNoIGRvd24gZnJvbSB0aGUgdG9wIG9mIHRoZSBzY3JlZW4uXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcnxzdHJpbmd9XG4gICAqIEBkZWZhdWx0IGF1dG9cbiAgICovXG4gIHZPZmZzZXQ6ICdhdXRvJyxcbiAgLyoqXG4gICAqIERpc3RhbmNlLCBpbiBwaXhlbHMsIHRoZSBtb2RhbCBzaG91bGQgcHVzaCBpbiBmcm9tIHRoZSBzaWRlIG9mIHRoZSBzY3JlZW4uXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcnxzdHJpbmd9XG4gICAqIEBkZWZhdWx0IGF1dG9cbiAgICovXG4gIGhPZmZzZXQ6ICdhdXRvJyxcbiAgLyoqXG4gICAqIEFsbG93cyB0aGUgbW9kYWwgdG8gYmUgZnVsbHNjcmVlbiwgY29tcGxldGVseSBibG9ja2luZyBvdXQgdGhlIHJlc3Qgb2YgdGhlIHZpZXcuIEpTIGNoZWNrcyBmb3IgdGhpcyBhcyB3ZWxsLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgZnVsbFNjcmVlbjogZmFsc2UsXG4gIC8qKlxuICAgKiBQZXJjZW50YWdlIG9mIHNjcmVlbiBoZWlnaHQgdGhlIG1vZGFsIHNob3VsZCBwdXNoIHVwIGZyb20gdGhlIGJvdHRvbSBvZiB0aGUgdmlldy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAxMFxuICAgKi9cbiAgYnRtT2Zmc2V0UGN0OiAxMCxcbiAgLyoqXG4gICAqIEFsbG93cyB0aGUgbW9kYWwgdG8gZ2VuZXJhdGUgYW4gb3ZlcmxheSBkaXYsIHdoaWNoIHdpbGwgY292ZXIgdGhlIHZpZXcgd2hlbiBtb2RhbCBvcGVucy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgb3ZlcmxheTogdHJ1ZSxcbiAgLyoqXG4gICAqIEFsbG93cyB0aGUgbW9kYWwgdG8gcmVtb3ZlIGFuZCByZWluamVjdCBtYXJrdXAgb24gY2xvc2UuIFNob3VsZCBiZSB0cnVlIGlmIHVzaW5nIHZpZGVvIGVsZW1lbnRzIHcvbyB1c2luZyBwcm92aWRlcidzIGFwaSwgb3RoZXJ3aXNlLCB2aWRlb3Mgd2lsbCBjb250aW51ZSB0byBwbGF5IGluIHRoZSBiYWNrZ3JvdW5kLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVzZXRPbkNsb3NlOiBmYWxzZSxcbiAgLyoqXG4gICAqIEFsbG93cyB0aGUgbW9kYWwgdG8gYWx0ZXIgdGhlIHVybCBvbiBvcGVuL2Nsb3NlLCBhbmQgYWxsb3dzIHRoZSB1c2Ugb2YgdGhlIGBiYWNrYCBidXR0b24gdG8gY2xvc2UgbW9kYWxzLiBBTFNPLCBhbGxvd3MgYSBtb2RhbCB0byBhdXRvLW1hbmlhY2FsbHkgb3BlbiBvbiBwYWdlIGxvYWQgSUYgdGhlIGhhc2ggPT09IHRoZSBtb2RhbCdzIHVzZXItc2V0IGlkLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgZGVlcExpbms6IGZhbHNlLFxuICAgIC8qKlxuICAgKiBBbGxvd3MgdGhlIG1vZGFsIHRvIGFwcGVuZCB0byBjdXN0b20gZGl2LlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0IFwiYm9keVwiXG4gICAqL1xuICBhcHBlbmRUbzogXCJib2R5XCJcblxufTtcblxuLy8gV2luZG93IGV4cG9ydHNcbkZvdW5kYXRpb24ucGx1Z2luKFJldmVhbCwgJ1JldmVhbCcpO1xuXG5mdW5jdGlvbiBpUGhvbmVTbmlmZigpIHtcbiAgcmV0dXJuIC9pUChhZHxob25lfG9kKS4qT1MvLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xufVxuXG5mdW5jdGlvbiBhbmRyb2lkU25pZmYoKSB7XG4gIHJldHVybiAvQW5kcm9pZC8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG59XG5cbmZ1bmN0aW9uIG1vYmlsZVNuaWZmKCkge1xuICByZXR1cm4gaVBob25lU25pZmYoKSB8fCBhbmRyb2lkU25pZmYoKTtcbn1cblxufShqUXVlcnkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4hZnVuY3Rpb24oJCkge1xuXG4vKipcbiAqIFNsaWRlciBtb2R1bGUuXG4gKiBAbW9kdWxlIGZvdW5kYXRpb24uc2xpZGVyXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLm1vdGlvblxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC50cmlnZ2Vyc1xuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5rZXlib2FyZFxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC50b3VjaFxuICovXG5cbmNsYXNzIFNsaWRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGEgc2xpZGVyIGNvbnRyb2wuXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0ge2pRdWVyeX0gZWxlbWVudCAtIGpRdWVyeSBvYmplY3QgdG8gbWFrZSBpbnRvIGEgc2xpZGVyIGNvbnRyb2wuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGVzIHRvIHRoZSBkZWZhdWx0IHBsdWdpbiBzZXR0aW5ncy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgU2xpZGVyLmRlZmF1bHRzLCB0aGlzLiRlbGVtZW50LmRhdGEoKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9pbml0KCk7XG5cbiAgICBGb3VuZGF0aW9uLnJlZ2lzdGVyUGx1Z2luKHRoaXMsICdTbGlkZXInKTtcbiAgICBGb3VuZGF0aW9uLktleWJvYXJkLnJlZ2lzdGVyKCdTbGlkZXInLCB7XG4gICAgICAnbHRyJzoge1xuICAgICAgICAnQVJST1dfUklHSFQnOiAnaW5jcmVhc2UnLFxuICAgICAgICAnQVJST1dfVVAnOiAnaW5jcmVhc2UnLFxuICAgICAgICAnQVJST1dfRE9XTic6ICdkZWNyZWFzZScsXG4gICAgICAgICdBUlJPV19MRUZUJzogJ2RlY3JlYXNlJyxcbiAgICAgICAgJ1NISUZUX0FSUk9XX1JJR0hUJzogJ2luY3JlYXNlX2Zhc3QnLFxuICAgICAgICAnU0hJRlRfQVJST1dfVVAnOiAnaW5jcmVhc2VfZmFzdCcsXG4gICAgICAgICdTSElGVF9BUlJPV19ET1dOJzogJ2RlY3JlYXNlX2Zhc3QnLFxuICAgICAgICAnU0hJRlRfQVJST1dfTEVGVCc6ICdkZWNyZWFzZV9mYXN0J1xuICAgICAgfSxcbiAgICAgICdydGwnOiB7XG4gICAgICAgICdBUlJPV19MRUZUJzogJ2luY3JlYXNlJyxcbiAgICAgICAgJ0FSUk9XX1JJR0hUJzogJ2RlY3JlYXNlJyxcbiAgICAgICAgJ1NISUZUX0FSUk9XX0xFRlQnOiAnaW5jcmVhc2VfZmFzdCcsXG4gICAgICAgICdTSElGVF9BUlJPV19SSUdIVCc6ICdkZWNyZWFzZV9mYXN0J1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpbGl6ZXMgdGhlIHBsdWdpbiBieSByZWFkaW5nL3NldHRpbmcgYXR0cmlidXRlcywgY3JlYXRpbmcgY29sbGVjdGlvbnMgYW5kIHNldHRpbmcgdGhlIGluaXRpYWwgcG9zaXRpb24gb2YgdGhlIGhhbmRsZShzKS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdCgpIHtcbiAgICB0aGlzLmlucHV0cyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcbiAgICB0aGlzLmhhbmRsZXMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ1tkYXRhLXNsaWRlci1oYW5kbGVdJyk7XG5cbiAgICB0aGlzLiRoYW5kbGUgPSB0aGlzLmhhbmRsZXMuZXEoMCk7XG4gICAgdGhpcy4kaW5wdXQgPSB0aGlzLmlucHV0cy5sZW5ndGggPyB0aGlzLmlucHV0cy5lcSgwKSA6ICQoYCMke3RoaXMuJGhhbmRsZS5hdHRyKCdhcmlhLWNvbnRyb2xzJyl9YCk7XG4gICAgdGhpcy4kZmlsbCA9IHRoaXMuJGVsZW1lbnQuZmluZCgnW2RhdGEtc2xpZGVyLWZpbGxdJykuY3NzKHRoaXMub3B0aW9ucy52ZXJ0aWNhbCA/ICdoZWlnaHQnIDogJ3dpZHRoJywgMCk7XG5cbiAgICB2YXIgaXNEYmwgPSBmYWxzZSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGlzYWJsZWQgfHwgdGhpcy4kZWxlbWVudC5oYXNDbGFzcyh0aGlzLm9wdGlvbnMuZGlzYWJsZWRDbGFzcykpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHRoaXMub3B0aW9ucy5kaXNhYmxlZENsYXNzKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlucHV0cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaW5wdXRzID0gJCgpLmFkZCh0aGlzLiRpbnB1dCk7XG4gICAgICB0aGlzLm9wdGlvbnMuYmluZGluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0SW5pdEF0dHIoMCk7XG5cbiAgICBpZiAodGhpcy5oYW5kbGVzWzFdKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZG91YmxlU2lkZWQgPSB0cnVlO1xuICAgICAgdGhpcy4kaGFuZGxlMiA9IHRoaXMuaGFuZGxlcy5lcSgxKTtcbiAgICAgIHRoaXMuJGlucHV0MiA9IHRoaXMuaW5wdXRzLmxlbmd0aCA+IDEgPyB0aGlzLmlucHV0cy5lcSgxKSA6ICQoYCMke3RoaXMuJGhhbmRsZTIuYXR0cignYXJpYS1jb250cm9scycpfWApO1xuXG4gICAgICBpZiAoIXRoaXMuaW5wdXRzWzFdKSB7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gdGhpcy5pbnB1dHMuYWRkKHRoaXMuJGlucHV0Mik7XG4gICAgICB9XG4gICAgICBpc0RibCA9IHRydWU7XG5cbiAgICAgIC8vIHRoaXMuJGhhbmRsZS50cmlnZ2VySGFuZGxlcignY2xpY2suemYuc2xpZGVyJyk7XG4gICAgICB0aGlzLl9zZXRJbml0QXR0cigxKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgaGFuZGxlIHBvc2l0aW9uc1xuICAgIHRoaXMuc2V0SGFuZGxlcygpO1xuXG4gICAgdGhpcy5fZXZlbnRzKCk7XG4gIH1cblxuICBzZXRIYW5kbGVzKCkge1xuICAgIGlmKHRoaXMuaGFuZGxlc1sxXSkge1xuICAgICAgdGhpcy5fc2V0SGFuZGxlUG9zKHRoaXMuJGhhbmRsZSwgdGhpcy5pbnB1dHMuZXEoMCkudmFsKCksIHRydWUsICgpID0+IHtcbiAgICAgICAgdGhpcy5fc2V0SGFuZGxlUG9zKHRoaXMuJGhhbmRsZTIsIHRoaXMuaW5wdXRzLmVxKDEpLnZhbCgpLCB0cnVlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZXRIYW5kbGVQb3ModGhpcy4kaGFuZGxlLCB0aGlzLmlucHV0cy5lcSgwKS52YWwoKSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgX3JlZmxvdygpIHtcbiAgICB0aGlzLnNldEhhbmRsZXMoKTtcbiAgfVxuICAvKipcbiAgKiBAZnVuY3Rpb25cbiAgKiBAcHJpdmF0ZVxuICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIGZsb2F0aW5nIHBvaW50ICh0aGUgdmFsdWUpIHRvIGJlIHRyYW5zZm9ybWVkIHVzaW5nIHRvIGEgcmVsYXRpdmUgcG9zaXRpb24gb24gdGhlIHNsaWRlciAodGhlIGludmVyc2Ugb2YgX3ZhbHVlKVxuICAqL1xuICBfcGN0T2ZCYXIodmFsdWUpIHtcbiAgICB2YXIgcGN0T2ZCYXIgPSBwZXJjZW50KHZhbHVlIC0gdGhpcy5vcHRpb25zLnN0YXJ0LCB0aGlzLm9wdGlvbnMuZW5kIC0gdGhpcy5vcHRpb25zLnN0YXJ0KVxuXG4gICAgc3dpdGNoKHRoaXMub3B0aW9ucy5wb3NpdGlvblZhbHVlRnVuY3Rpb24pIHtcbiAgICBjYXNlIFwicG93XCI6XG4gICAgICBwY3RPZkJhciA9IHRoaXMuX2xvZ1RyYW5zZm9ybShwY3RPZkJhcik7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibG9nXCI6XG4gICAgICBwY3RPZkJhciA9IHRoaXMuX3Bvd1RyYW5zZm9ybShwY3RPZkJhcik7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gcGN0T2ZCYXIudG9GaXhlZCgyKVxuICB9XG5cbiAgLyoqXG4gICogQGZ1bmN0aW9uXG4gICogQHByaXZhdGVcbiAgKiBAcGFyYW0ge051bWJlcn0gcGN0T2ZCYXIgLSBmbG9hdGluZyBwb2ludCwgdGhlIHJlbGF0aXZlIHBvc2l0aW9uIG9mIHRoZSBzbGlkZXIgKHR5cGljYWxseSBiZXR3ZWVuIDAtMSkgdG8gYmUgdHJhbnNmb3JtZWQgdG8gYSB2YWx1ZVxuICAqL1xuICBfdmFsdWUocGN0T2ZCYXIpIHtcbiAgICBzd2l0Y2godGhpcy5vcHRpb25zLnBvc2l0aW9uVmFsdWVGdW5jdGlvbikge1xuICAgIGNhc2UgXCJwb3dcIjpcbiAgICAgIHBjdE9mQmFyID0gdGhpcy5fcG93VHJhbnNmb3JtKHBjdE9mQmFyKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsb2dcIjpcbiAgICAgIHBjdE9mQmFyID0gdGhpcy5fbG9nVHJhbnNmb3JtKHBjdE9mQmFyKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB2YXIgdmFsdWUgPSAodGhpcy5vcHRpb25zLmVuZCAtIHRoaXMub3B0aW9ucy5zdGFydCkgKiBwY3RPZkJhciArIHRoaXMub3B0aW9ucy5zdGFydDtcblxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgLyoqXG4gICogQGZ1bmN0aW9uXG4gICogQHByaXZhdGVcbiAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBmbG9hdGluZyBwb2ludCAodHlwaWNhbGx5IGJldHdlZW4gMC0xKSB0byBiZSB0cmFuc2Zvcm1lZCB1c2luZyB0aGUgbG9nIGZ1bmN0aW9uXG4gICovXG4gIF9sb2dUcmFuc2Zvcm0odmFsdWUpIHtcbiAgICByZXR1cm4gYmFzZUxvZyh0aGlzLm9wdGlvbnMubm9uTGluZWFyQmFzZSwgKCh2YWx1ZSoodGhpcy5vcHRpb25zLm5vbkxpbmVhckJhc2UtMSkpKzEpKVxuICB9XG5cbiAgLyoqXG4gICogQGZ1bmN0aW9uXG4gICogQHByaXZhdGVcbiAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBmbG9hdGluZyBwb2ludCAodHlwaWNhbGx5IGJldHdlZW4gMC0xKSB0byBiZSB0cmFuc2Zvcm1lZCB1c2luZyB0aGUgcG93ZXIgZnVuY3Rpb25cbiAgKi9cbiAgX3Bvd1RyYW5zZm9ybSh2YWx1ZSkge1xuICAgIHJldHVybiAoTWF0aC5wb3codGhpcy5vcHRpb25zLm5vbkxpbmVhckJhc2UsIHZhbHVlKSAtIDEpIC8gKHRoaXMub3B0aW9ucy5ub25MaW5lYXJCYXNlIC0gMSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwb3NpdGlvbiBvZiB0aGUgc2VsZWN0ZWQgaGFuZGxlIGFuZCBmaWxsIGJhci5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkaG5kbCAtIHRoZSBzZWxlY3RlZCBoYW5kbGUgdG8gbW92ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxvY2F0aW9uIC0gZmxvYXRpbmcgcG9pbnQgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCB2YWx1ZXMgb2YgdGhlIHNsaWRlciBiYXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZmlyZSBvbiBjb21wbGV0aW9uLlxuICAgKiBAZmlyZXMgU2xpZGVyI21vdmVkXG4gICAqIEBmaXJlcyBTbGlkZXIjY2hhbmdlZFxuICAgKi9cbiAgX3NldEhhbmRsZVBvcygkaG5kbCwgbG9jYXRpb24sIG5vSW52ZXJ0LCBjYikge1xuICAgIC8vIGRvbid0IG1vdmUgaWYgdGhlIHNsaWRlciBoYXMgYmVlbiBkaXNhYmxlZCBzaW5jZSBpdHMgaW5pdGlhbGl6YXRpb25cbiAgICBpZiAodGhpcy4kZWxlbWVudC5oYXNDbGFzcyh0aGlzLm9wdGlvbnMuZGlzYWJsZWRDbGFzcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy9taWdodCBuZWVkIHRvIGFsdGVyIHRoYXQgc2xpZ2h0bHkgZm9yIGJhcnMgdGhhdCB3aWxsIGhhdmUgb2RkIG51bWJlciBzZWxlY3Rpb25zLlxuICAgIGxvY2F0aW9uID0gcGFyc2VGbG9hdChsb2NhdGlvbik7Ly9vbiBpbnB1dCBjaGFuZ2UgZXZlbnRzLCBjb252ZXJ0IHN0cmluZyB0byBudW1iZXIuLi5ncnVtYmxlLlxuXG4gICAgLy8gcHJldmVudCBzbGlkZXIgZnJvbSBydW5uaW5nIG91dCBvZiBib3VuZHMsIGlmIHZhbHVlIGV4Y2VlZHMgdGhlIGxpbWl0cyBzZXQgdGhyb3VnaCBvcHRpb25zLCBvdmVycmlkZSB0aGUgdmFsdWUgdG8gbWluL21heFxuICAgIGlmIChsb2NhdGlvbiA8IHRoaXMub3B0aW9ucy5zdGFydCkgeyBsb2NhdGlvbiA9IHRoaXMub3B0aW9ucy5zdGFydDsgfVxuICAgIGVsc2UgaWYgKGxvY2F0aW9uID4gdGhpcy5vcHRpb25zLmVuZCkgeyBsb2NhdGlvbiA9IHRoaXMub3B0aW9ucy5lbmQ7IH1cblxuICAgIHZhciBpc0RibCA9IHRoaXMub3B0aW9ucy5kb3VibGVTaWRlZDtcblxuICAgIGlmIChpc0RibCkgeyAvL3RoaXMgYmxvY2sgaXMgdG8gcHJldmVudCAyIGhhbmRsZXMgZnJvbSBjcm9zc2luZyBlYWNob3RoZXIuIENvdWxkL3Nob3VsZCBiZSBpbXByb3ZlZC5cbiAgICAgIGlmICh0aGlzLmhhbmRsZXMuaW5kZXgoJGhuZGwpID09PSAwKSB7XG4gICAgICAgIHZhciBoMlZhbCA9IHBhcnNlRmxvYXQodGhpcy4kaGFuZGxlMi5hdHRyKCdhcmlhLXZhbHVlbm93JykpO1xuICAgICAgICBsb2NhdGlvbiA9IGxvY2F0aW9uID49IGgyVmFsID8gaDJWYWwgLSB0aGlzLm9wdGlvbnMuc3RlcCA6IGxvY2F0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGgxVmFsID0gcGFyc2VGbG9hdCh0aGlzLiRoYW5kbGUuYXR0cignYXJpYS12YWx1ZW5vdycpKTtcbiAgICAgICAgbG9jYXRpb24gPSBsb2NhdGlvbiA8PSBoMVZhbCA/IGgxVmFsICsgdGhpcy5vcHRpb25zLnN0ZXAgOiBsb2NhdGlvbjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL3RoaXMgaXMgZm9yIHNpbmdsZS1oYW5kbGVkIHZlcnRpY2FsIHNsaWRlcnMsIGl0IGFkanVzdHMgdGhlIHZhbHVlIHRvIGFjY291bnQgZm9yIHRoZSBzbGlkZXIgYmVpbmcgXCJ1cHNpZGUtZG93blwiXG4gICAgLy9mb3IgY2xpY2sgYW5kIGRyYWcgZXZlbnRzLCBpdCdzIHdlaXJkIGR1ZSB0byB0aGUgc2NhbGUoLTEsIDEpIGNzcyBwcm9wZXJ0eVxuICAgIGlmICh0aGlzLm9wdGlvbnMudmVydGljYWwgJiYgIW5vSW52ZXJ0KSB7XG4gICAgICBsb2NhdGlvbiA9IHRoaXMub3B0aW9ucy5lbmQgLSBsb2NhdGlvbjtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICB2ZXJ0ID0gdGhpcy5vcHRpb25zLnZlcnRpY2FsLFxuICAgICAgICBoT3JXID0gdmVydCA/ICdoZWlnaHQnIDogJ3dpZHRoJyxcbiAgICAgICAgbE9yVCA9IHZlcnQgPyAndG9wJyA6ICdsZWZ0JyxcbiAgICAgICAgaGFuZGxlRGltID0gJGhuZGxbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbaE9yV10sXG4gICAgICAgIGVsZW1EaW0gPSB0aGlzLiRlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2hPclddLFxuICAgICAgICAvL3BlcmNlbnRhZ2Ugb2YgYmFyIG1pbi9tYXggdmFsdWUgYmFzZWQgb24gY2xpY2sgb3IgZHJhZyBwb2ludFxuICAgICAgICBwY3RPZkJhciA9IHRoaXMuX3BjdE9mQmFyKGxvY2F0aW9uKSxcbiAgICAgICAgLy9udW1iZXIgb2YgYWN0dWFsIHBpeGVscyB0byBzaGlmdCB0aGUgaGFuZGxlLCBiYXNlZCBvbiB0aGUgcGVyY2VudGFnZSBvYnRhaW5lZCBhYm92ZVxuICAgICAgICBweFRvTW92ZSA9IChlbGVtRGltIC0gaGFuZGxlRGltKSAqIHBjdE9mQmFyLFxuICAgICAgICAvL3BlcmNlbnRhZ2Ugb2YgYmFyIHRvIHNoaWZ0IHRoZSBoYW5kbGVcbiAgICAgICAgbW92ZW1lbnQgPSAocGVyY2VudChweFRvTW92ZSwgZWxlbURpbSkgKiAxMDApLnRvRml4ZWQodGhpcy5vcHRpb25zLmRlY2ltYWwpO1xuICAgICAgICAvL2ZpeGluZyB0aGUgZGVjaW1hbCB2YWx1ZSBmb3IgdGhlIGxvY2F0aW9uIG51bWJlciwgaXMgcGFzc2VkIHRvIG90aGVyIG1ldGhvZHMgYXMgYSBmaXhlZCBmbG9hdGluZy1wb2ludCB2YWx1ZVxuICAgICAgICBsb2NhdGlvbiA9IHBhcnNlRmxvYXQobG9jYXRpb24udG9GaXhlZCh0aGlzLm9wdGlvbnMuZGVjaW1hbCkpO1xuICAgICAgICAvLyBkZWNsYXJlIGVtcHR5IG9iamVjdCBmb3IgY3NzIGFkanVzdG1lbnRzLCBvbmx5IHVzZWQgd2l0aCAyIGhhbmRsZWQtc2xpZGVyc1xuICAgIHZhciBjc3MgPSB7fTtcblxuICAgIHRoaXMuX3NldFZhbHVlcygkaG5kbCwgbG9jYXRpb24pO1xuXG4gICAgLy8gVE9ETyB1cGRhdGUgdG8gY2FsY3VsYXRlIGJhc2VkIG9uIHZhbHVlcyBzZXQgdG8gcmVzcGVjdGl2ZSBpbnB1dHM/P1xuICAgIGlmIChpc0RibCkge1xuICAgICAgdmFyIGlzTGVmdEhuZGwgPSB0aGlzLmhhbmRsZXMuaW5kZXgoJGhuZGwpID09PSAwLFxuICAgICAgICAgIC8vZW1wdHkgdmFyaWFibGUsIHdpbGwgYmUgdXNlZCBmb3IgbWluLWhlaWdodC93aWR0aCBmb3IgZmlsbCBiYXJcbiAgICAgICAgICBkaW0sXG4gICAgICAgICAgLy9wZXJjZW50YWdlIHcvaCBvZiB0aGUgaGFuZGxlIGNvbXBhcmVkIHRvIHRoZSBzbGlkZXIgYmFyXG4gICAgICAgICAgaGFuZGxlUGN0ID0gIH5+KHBlcmNlbnQoaGFuZGxlRGltLCBlbGVtRGltKSAqIDEwMCk7XG4gICAgICAvL2lmIGxlZnQgaGFuZGxlLCB0aGUgbWF0aCBpcyBzbGlnaHRseSBkaWZmZXJlbnQgdGhhbiBpZiBpdCdzIHRoZSByaWdodCBoYW5kbGUsIGFuZCB0aGUgbGVmdC90b3AgcHJvcGVydHkgbmVlZHMgdG8gYmUgY2hhbmdlZCBmb3IgdGhlIGZpbGwgYmFyXG4gICAgICBpZiAoaXNMZWZ0SG5kbCkge1xuICAgICAgICAvL2xlZnQgb3IgdG9wIHBlcmNlbnRhZ2UgdmFsdWUgdG8gYXBwbHkgdG8gdGhlIGZpbGwgYmFyLlxuICAgICAgICBjc3NbbE9yVF0gPSBgJHttb3ZlbWVudH0lYDtcbiAgICAgICAgLy9jYWxjdWxhdGUgdGhlIG5ldyBtaW4taGVpZ2h0L3dpZHRoIGZvciB0aGUgZmlsbCBiYXIuXG4gICAgICAgIGRpbSA9IHBhcnNlRmxvYXQodGhpcy4kaGFuZGxlMlswXS5zdHlsZVtsT3JUXSkgLSBtb3ZlbWVudCArIGhhbmRsZVBjdDtcbiAgICAgICAgLy90aGlzIGNhbGxiYWNrIGlzIG5lY2Vzc2FyeSB0byBwcmV2ZW50IGVycm9ycyBhbmQgYWxsb3cgdGhlIHByb3BlciBwbGFjZW1lbnQgYW5kIGluaXRpYWxpemF0aW9uIG9mIGEgMi1oYW5kbGVkIHNsaWRlclxuICAgICAgICAvL3BsdXMsIGl0IG1lYW5zIHdlIGRvbid0IGNhcmUgaWYgJ2RpbScgaXNOYU4gb24gaW5pdCwgaXQgd29uJ3QgYmUgaW4gdGhlIGZ1dHVyZS5cbiAgICAgICAgaWYgKGNiICYmIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgeyBjYigpOyB9Ly90aGlzIGlzIG9ubHkgbmVlZGVkIGZvciB0aGUgaW5pdGlhbGl6YXRpb24gb2YgMiBoYW5kbGVkIHNsaWRlcnNcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vanVzdCBjYWNoaW5nIHRoZSB2YWx1ZSBvZiB0aGUgbGVmdC9ib3R0b20gaGFuZGxlJ3MgbGVmdC90b3AgcHJvcGVydHlcbiAgICAgICAgdmFyIGhhbmRsZVBvcyA9IHBhcnNlRmxvYXQodGhpcy4kaGFuZGxlWzBdLnN0eWxlW2xPclRdKTtcbiAgICAgICAgLy9jYWxjdWxhdGUgdGhlIG5ldyBtaW4taGVpZ2h0L3dpZHRoIGZvciB0aGUgZmlsbCBiYXIuIFVzZSBpc05hTiB0byBwcmV2ZW50IGZhbHNlIHBvc2l0aXZlcyBmb3IgbnVtYmVycyA8PSAwXG4gICAgICAgIC8vYmFzZWQgb24gdGhlIHBlcmNlbnRhZ2Ugb2YgbW92ZW1lbnQgb2YgdGhlIGhhbmRsZSBiZWluZyBtYW5pcHVsYXRlZCwgbGVzcyB0aGUgb3Bwb3NpbmcgaGFuZGxlJ3MgbGVmdC90b3AgcG9zaXRpb24sIHBsdXMgdGhlIHBlcmNlbnRhZ2Ugdy9oIG9mIHRoZSBoYW5kbGUgaXRzZWxmXG4gICAgICAgIGRpbSA9IG1vdmVtZW50IC0gKGlzTmFOKGhhbmRsZVBvcykgPyAodGhpcy5vcHRpb25zLmluaXRpYWxTdGFydCAtIHRoaXMub3B0aW9ucy5zdGFydCkvKCh0aGlzLm9wdGlvbnMuZW5kLXRoaXMub3B0aW9ucy5zdGFydCkvMTAwKSA6IGhhbmRsZVBvcykgKyBoYW5kbGVQY3Q7XG4gICAgICB9XG4gICAgICAvLyBhc3NpZ24gdGhlIG1pbi1oZWlnaHQvd2lkdGggdG8gb3VyIGNzcyBvYmplY3RcbiAgICAgIGNzc1tgbWluLSR7aE9yV31gXSA9IGAke2RpbX0lYDtcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50Lm9uZSgnZmluaXNoZWQuemYuYW5pbWF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogRmlyZXMgd2hlbiB0aGUgaGFuZGxlIGlzIGRvbmUgbW92aW5nLlxuICAgICAgICAgICAgICAgICAgICAgKiBAZXZlbnQgU2xpZGVyI21vdmVkXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdtb3ZlZC56Zi5zbGlkZXInLCBbJGhuZGxdKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgIC8vYmVjYXVzZSB3ZSBkb24ndCBrbm93IGV4YWN0bHkgaG93IHRoZSBoYW5kbGUgd2lsbCBiZSBtb3ZlZCwgY2hlY2sgdGhlIGFtb3VudCBvZiB0aW1lIGl0IHNob3VsZCB0YWtlIHRvIG1vdmUuXG4gICAgdmFyIG1vdmVUaW1lID0gdGhpcy4kZWxlbWVudC5kYXRhKCdkcmFnZ2luZycpID8gMTAwMC82MCA6IHRoaXMub3B0aW9ucy5tb3ZlVGltZTtcblxuICAgIEZvdW5kYXRpb24uTW92ZShtb3ZlVGltZSwgJGhuZGwsIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gYWRqdXN0aW5nIHRoZSBsZWZ0L3RvcCBwcm9wZXJ0eSBvZiB0aGUgaGFuZGxlLCBiYXNlZCBvbiB0aGUgcGVyY2VudGFnZSBjYWxjdWxhdGVkIGFib3ZlXG4gICAgICAvLyBpZiBtb3ZlbWVudCBpc05hTiwgdGhhdCBpcyBiZWNhdXNlIHRoZSBzbGlkZXIgaXMgaGlkZGVuIGFuZCB3ZSBjYW5ub3QgZGV0ZXJtaW5lIGhhbmRsZSB3aWR0aCxcbiAgICAgIC8vIGZhbGwgYmFjayB0byBuZXh0IGJlc3QgZ3Vlc3MuXG4gICAgICBpZiAoaXNOYU4obW92ZW1lbnQpKSB7XG4gICAgICAgICRobmRsLmNzcyhsT3JULCBgJHtwY3RPZkJhciAqIDEwMH0lYCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJGhuZGwuY3NzKGxPclQsIGAke21vdmVtZW50fSVgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFfdGhpcy5vcHRpb25zLmRvdWJsZVNpZGVkKSB7XG4gICAgICAgIC8vaWYgc2luZ2xlLWhhbmRsZWQsIGEgc2ltcGxlIG1ldGhvZCB0byBleHBhbmQgdGhlIGZpbGwgYmFyXG4gICAgICAgIF90aGlzLiRmaWxsLmNzcyhoT3JXLCBgJHtwY3RPZkJhciAqIDEwMH0lYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL290aGVyd2lzZSwgdXNlIHRoZSBjc3Mgb2JqZWN0IHdlIGNyZWF0ZWQgYWJvdmVcbiAgICAgICAgX3RoaXMuJGZpbGwuY3NzKGNzcyk7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gdGhlIHZhbHVlIGhhcyBub3QgYmVlbiBjaGFuZ2UgZm9yIGEgZ2l2ZW4gdGltZS5cbiAgICAgKiBAZXZlbnQgU2xpZGVyI2NoYW5nZWRcbiAgICAgKi9cbiAgICBjbGVhclRpbWVvdXQoX3RoaXMudGltZW91dCk7XG4gICAgX3RoaXMudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIF90aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZWQuemYuc2xpZGVyJywgWyRobmRsXSk7XG4gICAgfSwgX3RoaXMub3B0aW9ucy5jaGFuZ2VkRGVsYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGluaXRpYWwgYXR0cmlidXRlIGZvciB0aGUgc2xpZGVyIGVsZW1lbnQuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gaWR4IC0gaW5kZXggb2YgdGhlIGN1cnJlbnQgaGFuZGxlL2lucHV0IHRvIHVzZS5cbiAgICovXG4gIF9zZXRJbml0QXR0cihpZHgpIHtcbiAgICB2YXIgaW5pdFZhbCA9IChpZHggPT09IDAgPyB0aGlzLm9wdGlvbnMuaW5pdGlhbFN0YXJ0IDogdGhpcy5vcHRpb25zLmluaXRpYWxFbmQpXG4gICAgdmFyIGlkID0gdGhpcy5pbnB1dHMuZXEoaWR4KS5hdHRyKCdpZCcpIHx8IEZvdW5kYXRpb24uR2V0WW9EaWdpdHMoNiwgJ3NsaWRlcicpO1xuICAgIHRoaXMuaW5wdXRzLmVxKGlkeCkuYXR0cih7XG4gICAgICAnaWQnOiBpZCxcbiAgICAgICdtYXgnOiB0aGlzLm9wdGlvbnMuZW5kLFxuICAgICAgJ21pbic6IHRoaXMub3B0aW9ucy5zdGFydCxcbiAgICAgICdzdGVwJzogdGhpcy5vcHRpb25zLnN0ZXBcbiAgICB9KTtcbiAgICB0aGlzLmlucHV0cy5lcShpZHgpLnZhbChpbml0VmFsKTtcbiAgICB0aGlzLmhhbmRsZXMuZXEoaWR4KS5hdHRyKHtcbiAgICAgICdyb2xlJzogJ3NsaWRlcicsXG4gICAgICAnYXJpYS1jb250cm9scyc6IGlkLFxuICAgICAgJ2FyaWEtdmFsdWVtYXgnOiB0aGlzLm9wdGlvbnMuZW5kLFxuICAgICAgJ2FyaWEtdmFsdWVtaW4nOiB0aGlzLm9wdGlvbnMuc3RhcnQsXG4gICAgICAnYXJpYS12YWx1ZW5vdyc6IGluaXRWYWwsXG4gICAgICAnYXJpYS1vcmllbnRhdGlvbic6IHRoaXMub3B0aW9ucy52ZXJ0aWNhbCA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCcsXG4gICAgICAndGFiaW5kZXgnOiAwXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaW5wdXQgYW5kIGBhcmlhLXZhbHVlbm93YCB2YWx1ZXMgZm9yIHRoZSBzbGlkZXIgZWxlbWVudC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkaGFuZGxlIC0gdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBoYW5kbGUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWwgLSBmbG9hdGluZyBwb2ludCBvZiB0aGUgbmV3IHZhbHVlLlxuICAgKi9cbiAgX3NldFZhbHVlcygkaGFuZGxlLCB2YWwpIHtcbiAgICB2YXIgaWR4ID0gdGhpcy5vcHRpb25zLmRvdWJsZVNpZGVkID8gdGhpcy5oYW5kbGVzLmluZGV4KCRoYW5kbGUpIDogMDtcbiAgICB0aGlzLmlucHV0cy5lcShpZHgpLnZhbCh2YWwpO1xuICAgICRoYW5kbGUuYXR0cignYXJpYS12YWx1ZW5vdycsIHZhbCk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyBldmVudHMgb24gdGhlIHNsaWRlciBlbGVtZW50LlxuICAgKiBDYWxjdWxhdGVzIHRoZSBuZXcgbG9jYXRpb24gb2YgdGhlIGN1cnJlbnQgaGFuZGxlLlxuICAgKiBJZiB0aGVyZSBhcmUgdHdvIGhhbmRsZXMgYW5kIHRoZSBiYXIgd2FzIGNsaWNrZWQsIGl0IGRldGVybWluZXMgd2hpY2ggaGFuZGxlIHRvIG1vdmUuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZSAtIHRoZSBgZXZlbnRgIG9iamVjdCBwYXNzZWQgZnJvbSB0aGUgbGlzdGVuZXIuXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSAkaGFuZGxlIC0gdGhlIGN1cnJlbnQgaGFuZGxlIHRvIGNhbGN1bGF0ZSBmb3IsIGlmIHNlbGVjdGVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsIC0gZmxvYXRpbmcgcG9pbnQgbnVtYmVyIGZvciB0aGUgbmV3IHZhbHVlIG9mIHRoZSBzbGlkZXIuXG4gICAqIFRPRE8gY2xlYW4gdGhpcyB1cCwgdGhlcmUncyBhIGxvdCBvZiByZXBlYXRlZCBjb2RlIGJldHdlZW4gdGhpcyBhbmQgdGhlIF9zZXRIYW5kbGVQb3MgZm4uXG4gICAqL1xuICBfaGFuZGxlRXZlbnQoZSwgJGhhbmRsZSwgdmFsKSB7XG4gICAgdmFyIHZhbHVlLCBoYXNWYWw7XG4gICAgaWYgKCF2YWwpIHsvL2NsaWNrIG9yIGRyYWcgZXZlbnRzXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgIHZlcnRpY2FsID0gdGhpcy5vcHRpb25zLnZlcnRpY2FsLFxuICAgICAgICAgIHBhcmFtID0gdmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCcsXG4gICAgICAgICAgZGlyZWN0aW9uID0gdmVydGljYWwgPyAndG9wJyA6ICdsZWZ0JyxcbiAgICAgICAgICBldmVudE9mZnNldCA9IHZlcnRpY2FsID8gZS5wYWdlWSA6IGUucGFnZVgsXG4gICAgICAgICAgaGFsZk9mSGFuZGxlID0gdGhpcy4kaGFuZGxlWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW3BhcmFtXSAvIDIsXG4gICAgICAgICAgYmFyRGltID0gdGhpcy4kZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVtwYXJhbV0sXG4gICAgICAgICAgd2luZG93U2Nyb2xsID0gdmVydGljYWwgPyAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgOiAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpO1xuXG5cbiAgICAgIHZhciBlbGVtT2Zmc2V0ID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVtkaXJlY3Rpb25dO1xuXG4gICAgICAvLyB0b3VjaCBldmVudHMgZW11bGF0ZWQgYnkgdGhlIHRvdWNoIHV0aWwgZ2l2ZSBwb3NpdGlvbiByZWxhdGl2ZSB0byBzY3JlZW4sIGFkZCB3aW5kb3cuc2Nyb2xsIHRvIGV2ZW50IGNvb3JkaW5hdGVzLi4uXG4gICAgICAvLyBiZXN0IHdheSB0byBndWVzcyB0aGlzIGlzIHNpbXVsYXRlZCBpcyBpZiBjbGllbnRZID09IHBhZ2VZXG4gICAgICBpZiAoZS5jbGllbnRZID09PSBlLnBhZ2VZKSB7IGV2ZW50T2Zmc2V0ID0gZXZlbnRPZmZzZXQgKyB3aW5kb3dTY3JvbGw7IH1cbiAgICAgIHZhciBldmVudEZyb21CYXIgPSBldmVudE9mZnNldCAtIGVsZW1PZmZzZXQ7XG4gICAgICB2YXIgYmFyWFk7XG4gICAgICBpZiAoZXZlbnRGcm9tQmFyIDwgMCkge1xuICAgICAgICBiYXJYWSA9IDA7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50RnJvbUJhciA+IGJhckRpbSkge1xuICAgICAgICBiYXJYWSA9IGJhckRpbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhclhZID0gZXZlbnRGcm9tQmFyO1xuICAgICAgfVxuICAgICAgdmFyIG9mZnNldFBjdCA9IHBlcmNlbnQoYmFyWFksIGJhckRpbSk7XG5cbiAgICAgIHZhbHVlID0gdGhpcy5fdmFsdWUob2Zmc2V0UGN0KTtcblxuICAgICAgLy8gdHVybiBldmVyeXRoaW5nIGFyb3VuZCBmb3IgUlRMLCB5YXkgbWF0aCFcbiAgICAgIGlmIChGb3VuZGF0aW9uLnJ0bCgpICYmICF0aGlzLm9wdGlvbnMudmVydGljYWwpIHt2YWx1ZSA9IHRoaXMub3B0aW9ucy5lbmQgLSB2YWx1ZTt9XG5cbiAgICAgIHZhbHVlID0gX3RoaXMuX2FkanVzdFZhbHVlKG51bGwsIHZhbHVlKTtcbiAgICAgIC8vYm9vbGVhbiBmbGFnIGZvciB0aGUgc2V0SGFuZGxlUG9zIGZuLCBzcGVjaWZpY2FsbHkgZm9yIHZlcnRpY2FsIHNsaWRlcnNcbiAgICAgIGhhc1ZhbCA9IGZhbHNlO1xuXG4gICAgICBpZiAoISRoYW5kbGUpIHsvL2ZpZ3VyZSBvdXQgd2hpY2ggaGFuZGxlIGl0IGlzLCBwYXNzIGl0IHRvIHRoZSBuZXh0IGZ1bmN0aW9uLlxuICAgICAgICB2YXIgZmlyc3RIbmRsUG9zID0gYWJzUG9zaXRpb24odGhpcy4kaGFuZGxlLCBkaXJlY3Rpb24sIGJhclhZLCBwYXJhbSksXG4gICAgICAgICAgICBzZWNuZEhuZGxQb3MgPSBhYnNQb3NpdGlvbih0aGlzLiRoYW5kbGUyLCBkaXJlY3Rpb24sIGJhclhZLCBwYXJhbSk7XG4gICAgICAgICAgICAkaGFuZGxlID0gZmlyc3RIbmRsUG9zIDw9IHNlY25kSG5kbFBvcyA/IHRoaXMuJGhhbmRsZSA6IHRoaXMuJGhhbmRsZTI7XG4gICAgICB9XG5cbiAgICB9IGVsc2Ugey8vY2hhbmdlIGV2ZW50IG9uIGlucHV0XG4gICAgICB2YWx1ZSA9IHRoaXMuX2FkanVzdFZhbHVlKG51bGwsIHZhbCk7XG4gICAgICBoYXNWYWwgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuX3NldEhhbmRsZVBvcygkaGFuZGxlLCB2YWx1ZSwgaGFzVmFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGp1c3RlcyB2YWx1ZSBmb3IgaGFuZGxlIGluIHJlZ2FyZCB0byBzdGVwIHZhbHVlLiByZXR1cm5zIGFkanVzdGVkIHZhbHVlXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJGhhbmRsZSAtIHRoZSBzZWxlY3RlZCBoYW5kbGUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIHZhbHVlIHRvIGFkanVzdC4gdXNlZCBpZiAkaGFuZGxlIGlzIGZhbHN5XG4gICAqL1xuICBfYWRqdXN0VmFsdWUoJGhhbmRsZSwgdmFsdWUpIHtcbiAgICB2YXIgdmFsLFxuICAgICAgc3RlcCA9IHRoaXMub3B0aW9ucy5zdGVwLFxuICAgICAgZGl2ID0gcGFyc2VGbG9hdChzdGVwLzIpLFxuICAgICAgbGVmdCwgcHJldl92YWwsIG5leHRfdmFsO1xuICAgIGlmICghISRoYW5kbGUpIHtcbiAgICAgIHZhbCA9IHBhcnNlRmxvYXQoJGhhbmRsZS5hdHRyKCdhcmlhLXZhbHVlbm93JykpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhbCA9IHZhbHVlO1xuICAgIH1cbiAgICBsZWZ0ID0gdmFsICUgc3RlcDtcbiAgICBwcmV2X3ZhbCA9IHZhbCAtIGxlZnQ7XG4gICAgbmV4dF92YWwgPSBwcmV2X3ZhbCArIHN0ZXA7XG4gICAgaWYgKGxlZnQgPT09IDApIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIHZhbCA9IHZhbCA+PSBwcmV2X3ZhbCArIGRpdiA/IG5leHRfdmFsIDogcHJldl92YWw7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgc2xpZGVyIGVsZW1lbnRzLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ldmVudHMoKSB7XG4gICAgdGhpcy5fZXZlbnRzRm9ySGFuZGxlKHRoaXMuJGhhbmRsZSk7XG4gICAgaWYodGhpcy5oYW5kbGVzWzFdKSB7XG4gICAgICB0aGlzLl9ldmVudHNGb3JIYW5kbGUodGhpcy4kaGFuZGxlMik7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogQWRkcyBldmVudCBsaXN0ZW5lcnMgYSBwYXJ0aWN1bGFyIGhhbmRsZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtqUXVlcnl9ICRoYW5kbGUgLSB0aGUgY3VycmVudCBoYW5kbGUgdG8gYXBwbHkgbGlzdGVuZXJzIHRvLlxuICAgKi9cbiAgX2V2ZW50c0ZvckhhbmRsZSgkaGFuZGxlKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgY3VySGFuZGxlLFxuICAgICAgICB0aW1lcjtcblxuICAgICAgdGhpcy5pbnB1dHMub2ZmKCdjaGFuZ2UuemYuc2xpZGVyJykub24oJ2NoYW5nZS56Zi5zbGlkZXInLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBpZHggPSBfdGhpcy5pbnB1dHMuaW5kZXgoJCh0aGlzKSk7XG4gICAgICAgIF90aGlzLl9oYW5kbGVFdmVudChlLCBfdGhpcy5oYW5kbGVzLmVxKGlkeCksICQodGhpcykudmFsKCkpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2xpY2tTZWxlY3QpIHtcbiAgICAgICAgdGhpcy4kZWxlbWVudC5vZmYoJ2NsaWNrLnpmLnNsaWRlcicpLm9uKCdjbGljay56Zi5zbGlkZXInLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKF90aGlzLiRlbGVtZW50LmRhdGEoJ2RyYWdnaW5nJykpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgICAgICBpZiAoISQoZS50YXJnZXQpLmlzKCdbZGF0YS1zbGlkZXItaGFuZGxlXScpKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5kb3VibGVTaWRlZCkge1xuICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlRXZlbnQoZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlRXZlbnQoZSwgX3RoaXMuJGhhbmRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZHJhZ2dhYmxlKSB7XG4gICAgICB0aGlzLmhhbmRsZXMuYWRkVG91Y2goKTtcblxuICAgICAgdmFyICRib2R5ID0gJCgnYm9keScpO1xuICAgICAgJGhhbmRsZVxuICAgICAgICAub2ZmKCdtb3VzZWRvd24uemYuc2xpZGVyJylcbiAgICAgICAgLm9uKCdtb3VzZWRvd24uemYuc2xpZGVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICRoYW5kbGUuYWRkQ2xhc3MoJ2lzLWRyYWdnaW5nJyk7XG4gICAgICAgICAgX3RoaXMuJGZpbGwuYWRkQ2xhc3MoJ2lzLWRyYWdnaW5nJyk7Ly9cbiAgICAgICAgICBfdGhpcy4kZWxlbWVudC5kYXRhKCdkcmFnZ2luZycsIHRydWUpO1xuXG4gICAgICAgICAgY3VySGFuZGxlID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuXG4gICAgICAgICAgJGJvZHkub24oJ21vdXNlbW92ZS56Zi5zbGlkZXInLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy5faGFuZGxlRXZlbnQoZSwgY3VySGFuZGxlKTtcblxuICAgICAgICAgIH0pLm9uKCdtb3VzZXVwLnpmLnNsaWRlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIF90aGlzLl9oYW5kbGVFdmVudChlLCBjdXJIYW5kbGUpO1xuXG4gICAgICAgICAgICAkaGFuZGxlLnJlbW92ZUNsYXNzKCdpcy1kcmFnZ2luZycpO1xuICAgICAgICAgICAgX3RoaXMuJGZpbGwucmVtb3ZlQ2xhc3MoJ2lzLWRyYWdnaW5nJyk7XG4gICAgICAgICAgICBfdGhpcy4kZWxlbWVudC5kYXRhKCdkcmFnZ2luZycsIGZhbHNlKTtcblxuICAgICAgICAgICAgJGJvZHkub2ZmKCdtb3VzZW1vdmUuemYuc2xpZGVyIG1vdXNldXAuemYuc2xpZGVyJyk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLy8gcHJldmVudCBldmVudHMgdHJpZ2dlcmVkIGJ5IHRvdWNoXG4gICAgICAub24oJ3NlbGVjdHN0YXJ0LnpmLnNsaWRlciB0b3VjaG1vdmUuemYuc2xpZGVyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkaGFuZGxlLm9mZigna2V5ZG93bi56Zi5zbGlkZXInKS5vbigna2V5ZG93bi56Zi5zbGlkZXInLCBmdW5jdGlvbihlKSB7XG4gICAgICB2YXIgXyRoYW5kbGUgPSAkKHRoaXMpLFxuICAgICAgICAgIGlkeCA9IF90aGlzLm9wdGlvbnMuZG91YmxlU2lkZWQgPyBfdGhpcy5oYW5kbGVzLmluZGV4KF8kaGFuZGxlKSA6IDAsXG4gICAgICAgICAgb2xkVmFsdWUgPSBwYXJzZUZsb2F0KF90aGlzLmlucHV0cy5lcShpZHgpLnZhbCgpKSxcbiAgICAgICAgICBuZXdWYWx1ZTtcblxuICAgICAgLy8gaGFuZGxlIGtleWJvYXJkIGV2ZW50IHdpdGgga2V5Ym9hcmQgdXRpbFxuICAgICAgRm91bmRhdGlvbi5LZXlib2FyZC5oYW5kbGVLZXkoZSwgJ1NsaWRlcicsIHtcbiAgICAgICAgZGVjcmVhc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gb2xkVmFsdWUgLSBfdGhpcy5vcHRpb25zLnN0ZXA7XG4gICAgICAgIH0sXG4gICAgICAgIGluY3JlYXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IG9sZFZhbHVlICsgX3RoaXMub3B0aW9ucy5zdGVwO1xuICAgICAgICB9LFxuICAgICAgICBkZWNyZWFzZV9mYXN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IG9sZFZhbHVlIC0gX3RoaXMub3B0aW9ucy5zdGVwICogMTA7XG4gICAgICAgIH0sXG4gICAgICAgIGluY3JlYXNlX2Zhc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gb2xkVmFsdWUgKyBfdGhpcy5vcHRpb25zLnN0ZXAgKiAxMDtcbiAgICAgICAgfSxcbiAgICAgICAgaGFuZGxlZDogZnVuY3Rpb24oKSB7IC8vIG9ubHkgc2V0IGhhbmRsZSBwb3Mgd2hlbiBldmVudCB3YXMgaGFuZGxlZCBzcGVjaWFsbHlcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgX3RoaXMuX3NldEhhbmRsZVBvcyhfJGhhbmRsZSwgbmV3VmFsdWUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8qaWYgKG5ld1ZhbHVlKSB7IC8vIGlmIHByZXNzZWQga2V5IGhhcyBzcGVjaWFsIGZ1bmN0aW9uLCB1cGRhdGUgdmFsdWVcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBfdGhpcy5fc2V0SGFuZGxlUG9zKF8kaGFuZGxlLCBuZXdWYWx1ZSk7XG4gICAgICB9Ki9cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyB0aGUgc2xpZGVyIHBsdWdpbi5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5oYW5kbGVzLm9mZignLnpmLnNsaWRlcicpO1xuICAgIHRoaXMuaW5wdXRzLm9mZignLnpmLnNsaWRlcicpO1xuICAgIHRoaXMuJGVsZW1lbnQub2ZmKCcuemYuc2xpZGVyJyk7XG5cbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblxuICAgIEZvdW5kYXRpb24udW5yZWdpc3RlclBsdWdpbih0aGlzKTtcbiAgfVxufVxuXG5TbGlkZXIuZGVmYXVsdHMgPSB7XG4gIC8qKlxuICAgKiBNaW5pbXVtIHZhbHVlIGZvciB0aGUgc2xpZGVyIHNjYWxlLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHN0YXJ0OiAwLFxuICAvKipcbiAgICogTWF4aW11bSB2YWx1ZSBmb3IgdGhlIHNsaWRlciBzY2FsZS5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAxMDBcbiAgICovXG4gIGVuZDogMTAwLFxuICAvKipcbiAgICogTWluaW11bSB2YWx1ZSBjaGFuZ2UgcGVyIGNoYW5nZSBldmVudC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICBzdGVwOiAxLFxuICAvKipcbiAgICogVmFsdWUgYXQgd2hpY2ggdGhlIGhhbmRsZS9pbnB1dCAqKGxlZnQgaGFuZGxlL2ZpcnN0IGlucHV0KSogc2hvdWxkIGJlIHNldCB0byBvbiBpbml0aWFsaXphdGlvbi5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICBpbml0aWFsU3RhcnQ6IDAsXG4gIC8qKlxuICAgKiBWYWx1ZSBhdCB3aGljaCB0aGUgcmlnaHQgaGFuZGxlL3NlY29uZCBpbnB1dCBzaG91bGQgYmUgc2V0IHRvIG9uIGluaXRpYWxpemF0aW9uLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEBkZWZhdWx0IDEwMFxuICAgKi9cbiAgaW5pdGlhbEVuZDogMTAwLFxuICAvKipcbiAgICogQWxsb3dzIHRoZSBpbnB1dCB0byBiZSBsb2NhdGVkIG91dHNpZGUgdGhlIGNvbnRhaW5lciBhbmQgdmlzaWJsZS4gU2V0IHRvIGJ5IHRoZSBKU1xuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgYmluZGluZzogZmFsc2UsXG4gIC8qKlxuICAgKiBBbGxvd3MgdGhlIHVzZXIgdG8gY2xpY2svdGFwIG9uIHRoZSBzbGlkZXIgYmFyIHRvIHNlbGVjdCBhIHZhbHVlLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBjbGlja1NlbGVjdDogdHJ1ZSxcbiAgLyoqXG4gICAqIFNldCB0byB0cnVlIGFuZCB1c2UgdGhlIGB2ZXJ0aWNhbGAgY2xhc3MgdG8gY2hhbmdlIGFsaWdubWVudCB0byB2ZXJ0aWNhbC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHZlcnRpY2FsOiBmYWxzZSxcbiAgLyoqXG4gICAqIEFsbG93cyB0aGUgdXNlciB0byBkcmFnIHRoZSBzbGlkZXIgaGFuZGxlKHMpIHRvIHNlbGVjdCBhIHZhbHVlLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBkcmFnZ2FibGU6IHRydWUsXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgc2xpZGVyIGFuZCBwcmV2ZW50cyBldmVudCBsaXN0ZW5lcnMgZnJvbSBiZWluZyBhcHBsaWVkLiBEb3VibGUgY2hlY2tlZCBieSBKUyB3aXRoIGBkaXNhYmxlZENsYXNzYC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGRpc2FibGVkOiBmYWxzZSxcbiAgLyoqXG4gICAqIEFsbG93cyB0aGUgdXNlIG9mIHR3byBoYW5kbGVzLiBEb3VibGUgY2hlY2tlZCBieSB0aGUgSlMuIENoYW5nZXMgc29tZSBsb2dpYyBoYW5kbGluZy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGRvdWJsZVNpZGVkOiBmYWxzZSxcbiAgLyoqXG4gICAqIFBvdGVudGlhbCBmdXR1cmUgZmVhdHVyZS5cbiAgICovXG4gIC8vIHN0ZXBzOiAxMDAsXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgdGhlIHBsdWdpbiBzaG91bGQgZ28gdG8gZm9yIGZsb2F0aW5nIHBvaW50IHByZWNpc2lvbi5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAyXG4gICAqL1xuICBkZWNpbWFsOiAyLFxuICAvKipcbiAgICogVGltZSBkZWxheSBmb3IgZHJhZ2dlZCBlbGVtZW50cy5cbiAgICovXG4gIC8vIGRyYWdEZWxheTogMCxcbiAgLyoqXG4gICAqIFRpbWUsIGluIG1zLCB0byBhbmltYXRlIHRoZSBtb3ZlbWVudCBvZiBhIHNsaWRlciBoYW5kbGUgaWYgdXNlciBjbGlja3MvdGFwcyBvbiB0aGUgYmFyLiBOZWVkcyB0byBiZSBtYW51YWxseSBzZXQgaWYgdXBkYXRpbmcgdGhlIHRyYW5zaXRpb24gdGltZSBpbiB0aGUgU2FzcyBzZXR0aW5ncy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAyMDBcbiAgICovXG4gIG1vdmVUaW1lOiAyMDAsLy91cGRhdGUgdGhpcyBpZiBjaGFuZ2luZyB0aGUgdHJhbnNpdGlvbiB0aW1lIGluIHRoZSBzYXNzXG4gIC8qKlxuICAgKiBDbGFzcyBhcHBsaWVkIHRvIGRpc2FibGVkIHNsaWRlcnMuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2Rpc2FibGVkJ1xuICAgKi9cbiAgZGlzYWJsZWRDbGFzczogJ2Rpc2FibGVkJyxcbiAgLyoqXG4gICAqIFdpbGwgaW52ZXJ0IHRoZSBkZWZhdWx0IGxheW91dCBmb3IgYSB2ZXJ0aWNhbDxzcGFuIGRhdGEtdG9vbHRpcCB0aXRsZT1cIndobyB3b3VsZCBkbyB0aGlzPz8/XCI+IDwvc3Bhbj5zbGlkZXIuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBpbnZlcnRWZXJ0aWNhbDogZmFsc2UsXG4gIC8qKlxuICAgKiBNaWxsaXNlY29uZHMgYmVmb3JlIHRoZSBgY2hhbmdlZC56Zi1zbGlkZXJgIGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciB2YWx1ZSBjaGFuZ2UuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQGRlZmF1bHQgNTAwXG4gICAqL1xuICBjaGFuZ2VkRGVsYXk6IDUwMCxcbiAgLyoqXG4gICogQmFzZXZhbHVlIGZvciBub24tbGluZWFyIHNsaWRlcnNcbiAgKiBAb3B0aW9uXG4gICogQHR5cGUge251bWJlcn1cbiAgKiBAZGVmYXVsdCA1XG4gICovXG4gIG5vbkxpbmVhckJhc2U6IDUsXG4gIC8qKlxuICAqIEJhc2V2YWx1ZSBmb3Igbm9uLWxpbmVhciBzbGlkZXJzLCBwb3NzaWJsZSB2YWx1ZXMgYXJlOiBgJ2xpbmVhcidgLCBgJ3BvdydgICYgYCdsb2cnYC4gUG93IGFuZCBMb2cgdXNlIHRoZSBub25MaW5lYXJCYXNlIHNldHRpbmcuXG4gICogQG9wdGlvblxuICAqIEB0eXBlIHtzdHJpbmd9XG4gICogQGRlZmF1bHQgJ2xpbmVhcidcbiAgKi9cbiAgcG9zaXRpb25WYWx1ZUZ1bmN0aW9uOiAnbGluZWFyJyxcbn07XG5cbmZ1bmN0aW9uIHBlcmNlbnQoZnJhYywgbnVtKSB7XG4gIHJldHVybiAoZnJhYyAvIG51bSk7XG59XG5mdW5jdGlvbiBhYnNQb3NpdGlvbigkaGFuZGxlLCBkaXIsIGNsaWNrUG9zLCBwYXJhbSkge1xuICByZXR1cm4gTWF0aC5hYnMoKCRoYW5kbGUucG9zaXRpb24oKVtkaXJdICsgKCRoYW5kbGVbcGFyYW1dKCkgLyAyKSkgLSBjbGlja1Bvcyk7XG59XG5mdW5jdGlvbiBiYXNlTG9nKGJhc2UsIHZhbHVlKSB7XG4gIHJldHVybiBNYXRoLmxvZyh2YWx1ZSkvTWF0aC5sb2coYmFzZSlcbn1cblxuLy8gV2luZG93IGV4cG9ydHNcbkZvdW5kYXRpb24ucGx1Z2luKFNsaWRlciwgJ1NsaWRlcicpO1xuXG59KGpRdWVyeSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuLyoqXG4gKiBTdGlja3kgbW9kdWxlLlxuICogQG1vZHVsZSBmb3VuZGF0aW9uLnN0aWNreVxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC50cmlnZ2Vyc1xuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5tZWRpYVF1ZXJ5XG4gKi9cblxuY2xhc3MgU3RpY2t5IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgYSBzdGlja3kgdGhpbmcuXG4gICAqIEBjbGFzc1xuICAgKiBAcGFyYW0ge2pRdWVyeX0gZWxlbWVudCAtIGpRdWVyeSBvYmplY3QgdG8gbWFrZSBzdGlja3kuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyBvYmplY3QgcGFzc2VkIHdoZW4gY3JlYXRpbmcgdGhlIGVsZW1lbnQgcHJvZ3JhbW1hdGljYWxseS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgU3RpY2t5LmRlZmF1bHRzLCB0aGlzLiRlbGVtZW50LmRhdGEoKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9pbml0KCk7XG5cbiAgICBGb3VuZGF0aW9uLnJlZ2lzdGVyUGx1Z2luKHRoaXMsICdTdGlja3knKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgc3RpY2t5IGVsZW1lbnQgYnkgYWRkaW5nIGNsYXNzZXMsIGdldHRpbmcvc2V0dGluZyBkaW1lbnNpb25zLCBicmVha3BvaW50cyBhbmQgYXR0cmlidXRlc1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0KCkge1xuICAgIHZhciAkcGFyZW50ID0gdGhpcy4kZWxlbWVudC5wYXJlbnQoJ1tkYXRhLXN0aWNreS1jb250YWluZXJdJyksXG4gICAgICAgIGlkID0gdGhpcy4kZWxlbWVudFswXS5pZCB8fCBGb3VuZGF0aW9uLkdldFlvRGlnaXRzKDYsICdzdGlja3knKSxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCEkcGFyZW50Lmxlbmd0aCkge1xuICAgICAgdGhpcy53YXNXcmFwcGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy4kY29udGFpbmVyID0gJHBhcmVudC5sZW5ndGggPyAkcGFyZW50IDogJCh0aGlzLm9wdGlvbnMuY29udGFpbmVyKS53cmFwSW5uZXIodGhpcy4kZWxlbWVudCk7XG4gICAgdGhpcy4kY29udGFpbmVyLmFkZENsYXNzKHRoaXMub3B0aW9ucy5jb250YWluZXJDbGFzcyk7XG5cbiAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKHRoaXMub3B0aW9ucy5zdGlja3lDbGFzcylcbiAgICAgICAgICAgICAgICAgLmF0dHIoeydkYXRhLXJlc2l6ZSc6IGlkfSk7XG5cbiAgICB0aGlzLnNjcm9sbENvdW50ID0gdGhpcy5vcHRpb25zLmNoZWNrRXZlcnk7XG4gICAgdGhpcy5pc1N0dWNrID0gZmFsc2U7XG4gICAgJCh3aW5kb3cpLm9uZSgnbG9hZC56Zi5zdGlja3knLCBmdW5jdGlvbigpe1xuICAgICAgLy9XZSBjYWxjdWxhdGUgdGhlIGNvbnRhaW5lciBoZWlnaHQgdG8gaGF2ZSBjb3JyZWN0IHZhbHVlcyBmb3IgYW5jaG9yIHBvaW50cyBvZmZzZXQgY2FsY3VsYXRpb24uXG4gICAgICBfdGhpcy5jb250YWluZXJIZWlnaHQgPSBfdGhpcy4kZWxlbWVudC5jc3MoXCJkaXNwbGF5XCIpID09IFwibm9uZVwiID8gMCA6IF90aGlzLiRlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgIF90aGlzLiRjb250YWluZXIuY3NzKCdoZWlnaHQnLCBfdGhpcy5jb250YWluZXJIZWlnaHQpO1xuICAgICAgX3RoaXMuZWxlbUhlaWdodCA9IF90aGlzLmNvbnRhaW5lckhlaWdodDtcbiAgICAgIGlmKF90aGlzLm9wdGlvbnMuYW5jaG9yICE9PSAnJyl7XG4gICAgICAgIF90aGlzLiRhbmNob3IgPSAkKCcjJyArIF90aGlzLm9wdGlvbnMuYW5jaG9yKTtcbiAgICAgIH1lbHNle1xuICAgICAgICBfdGhpcy5fcGFyc2VQb2ludHMoKTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuX3NldFNpemVzKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgIF90aGlzLl9jYWxjKGZhbHNlLCBzY3JvbGwpO1xuICAgICAgICAvL1Vuc3RpY2sgdGhlIGVsZW1lbnQgd2lsbCBlbnN1cmUgdGhhdCBwcm9wZXIgY2xhc3NlcyBhcmUgc2V0LlxuICAgICAgICBpZiAoIV90aGlzLmlzU3R1Y2spIHtcbiAgICAgICAgICBfdGhpcy5fcmVtb3ZlU3RpY2t5KChzY3JvbGwgPj0gX3RoaXMudG9wUG9pbnQpID8gZmFsc2UgOiB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBfdGhpcy5fZXZlbnRzKGlkLnNwbGl0KCctJykucmV2ZXJzZSgpLmpvaW4oJy0nKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSWYgdXNpbmcgbXVsdGlwbGUgZWxlbWVudHMgYXMgYW5jaG9ycywgY2FsY3VsYXRlcyB0aGUgdG9wIGFuZCBib3R0b20gcGl4ZWwgdmFsdWVzIHRoZSBzdGlja3kgdGhpbmcgc2hvdWxkIHN0aWNrIGFuZCB1bnN0aWNrIG9uLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9wYXJzZVBvaW50cygpIHtcbiAgICB2YXIgdG9wID0gdGhpcy5vcHRpb25zLnRvcEFuY2hvciA9PSBcIlwiID8gMSA6IHRoaXMub3B0aW9ucy50b3BBbmNob3IsXG4gICAgICAgIGJ0bSA9IHRoaXMub3B0aW9ucy5idG1BbmNob3I9PSBcIlwiID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCA6IHRoaXMub3B0aW9ucy5idG1BbmNob3IsXG4gICAgICAgIHB0cyA9IFt0b3AsIGJ0bV0sXG4gICAgICAgIGJyZWFrcyA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwdHMubGVuZ3RoOyBpIDwgbGVuICYmIHB0c1tpXTsgaSsrKSB7XG4gICAgICB2YXIgcHQ7XG4gICAgICBpZiAodHlwZW9mIHB0c1tpXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcHQgPSBwdHNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcGxhY2UgPSBwdHNbaV0uc3BsaXQoJzonKSxcbiAgICAgICAgICAgIGFuY2hvciA9ICQoYCMke3BsYWNlWzBdfWApO1xuXG4gICAgICAgIHB0ID0gYW5jaG9yLm9mZnNldCgpLnRvcDtcbiAgICAgICAgaWYgKHBsYWNlWzFdICYmIHBsYWNlWzFdLnRvTG93ZXJDYXNlKCkgPT09ICdib3R0b20nKSB7XG4gICAgICAgICAgcHQgKz0gYW5jaG9yWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWtzW2ldID0gcHQ7XG4gICAgfVxuXG5cbiAgICB0aGlzLnBvaW50cyA9IGJyZWFrcztcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBldmVudCBoYW5kbGVycyBmb3IgdGhlIHNjcm9sbGluZyBlbGVtZW50LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBwc3VlZG8tcmFuZG9tIGlkIGZvciB1bmlxdWUgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyLlxuICAgKi9cbiAgX2V2ZW50cyhpZCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgIHNjcm9sbExpc3RlbmVyID0gdGhpcy5zY3JvbGxMaXN0ZW5lciA9IGBzY3JvbGwuemYuJHtpZH1gO1xuICAgIGlmICh0aGlzLmlzT24pIHsgcmV0dXJuOyB9XG4gICAgaWYgKHRoaXMuY2FuU3RpY2spIHtcbiAgICAgIHRoaXMuaXNPbiA9IHRydWU7XG4gICAgICAkKHdpbmRvdykub2ZmKHNjcm9sbExpc3RlbmVyKVxuICAgICAgICAgICAgICAgLm9uKHNjcm9sbExpc3RlbmVyLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgIGlmIChfdGhpcy5zY3JvbGxDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgIF90aGlzLnNjcm9sbENvdW50ID0gX3RoaXMub3B0aW9ucy5jaGVja0V2ZXJ5O1xuICAgICAgICAgICAgICAgICAgIF90aGlzLl9zZXRTaXplcyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9jYWxjKGZhbHNlLCB3aW5kb3cucGFnZVlPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgIF90aGlzLnNjcm9sbENvdW50LS07XG4gICAgICAgICAgICAgICAgICAgX3RoaXMuX2NhbGMoZmFsc2UsIHdpbmRvdy5wYWdlWU9mZnNldCk7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC5vZmYoJ3Jlc2l6ZW1lLnpmLnRyaWdnZXInKVxuICAgICAgICAgICAgICAgICAub24oJ3Jlc2l6ZW1lLnpmLnRyaWdnZXInLCBmdW5jdGlvbihlLCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3NldFNpemVzKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY2FsYyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5jYW5TdGljaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghX3RoaXMuaXNPbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2V2ZW50cyhpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF90aGlzLmlzT24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcGF1c2VMaXN0ZW5lcnMoc2Nyb2xsTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGV2ZW50IGhhbmRsZXJzIGZvciBzY3JvbGwgYW5kIGNoYW5nZSBldmVudHMgb24gYW5jaG9yLlxuICAgKiBAZmlyZXMgU3RpY2t5I3BhdXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzY3JvbGxMaXN0ZW5lciAtIHVuaXF1ZSwgbmFtZXNwYWNlZCBzY3JvbGwgbGlzdGVuZXIgYXR0YWNoZWQgdG8gYHdpbmRvd2BcbiAgICovXG4gIF9wYXVzZUxpc3RlbmVycyhzY3JvbGxMaXN0ZW5lcikge1xuICAgIHRoaXMuaXNPbiA9IGZhbHNlO1xuICAgICQod2luZG93KS5vZmYoc2Nyb2xsTGlzdGVuZXIpO1xuXG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiB0aGUgcGx1Z2luIGlzIHBhdXNlZCBkdWUgdG8gcmVzaXplIGV2ZW50IHNocmlua2luZyB0aGUgdmlldy5cbiAgICAgKiBAZXZlbnQgU3RpY2t5I3BhdXNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdwYXVzZS56Zi5zdGlja3knKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgb24gZXZlcnkgYHNjcm9sbGAgZXZlbnQgYW5kIG9uIGBfaW5pdGBcbiAgICogZmlyZXMgZnVuY3Rpb25zIGJhc2VkIG9uIGJvb2xlYW5zIGFuZCBjYWNoZWQgdmFsdWVzXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2hlY2tTaXplcyAtIHRydWUgaWYgcGx1Z2luIHNob3VsZCByZWNhbGN1bGF0ZSBzaXplcyBhbmQgYnJlYWtwb2ludHMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzY3JvbGwgLSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbiBwYXNzZWQgZnJvbSBzY3JvbGwgZXZlbnQgY2IgZnVuY3Rpb24uIElmIG5vdCBwYXNzZWQsIGRlZmF1bHRzIHRvIGB3aW5kb3cucGFnZVlPZmZzZXRgLlxuICAgKi9cbiAgX2NhbGMoY2hlY2tTaXplcywgc2Nyb2xsKSB7XG4gICAgaWYgKGNoZWNrU2l6ZXMpIHsgdGhpcy5fc2V0U2l6ZXMoKTsgfVxuXG4gICAgaWYgKCF0aGlzLmNhblN0aWNrKSB7XG4gICAgICBpZiAodGhpcy5pc1N0dWNrKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZVN0aWNreSh0cnVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXNjcm9sbCkgeyBzY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7IH1cblxuICAgIGlmIChzY3JvbGwgPj0gdGhpcy50b3BQb2ludCkge1xuICAgICAgaWYgKHNjcm9sbCA8PSB0aGlzLmJvdHRvbVBvaW50KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1N0dWNrKSB7XG4gICAgICAgICAgdGhpcy5fc2V0U3RpY2t5KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3R1Y2spIHtcbiAgICAgICAgICB0aGlzLl9yZW1vdmVTdGlja3koZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmlzU3R1Y2spIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlU3RpY2t5KHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYXVzZXMgdGhlICRlbGVtZW50IHRvIGJlY29tZSBzdHVjay5cbiAgICogQWRkcyBgcG9zaXRpb246IGZpeGVkO2AsIGFuZCBoZWxwZXIgY2xhc3Nlcy5cbiAgICogQGZpcmVzIFN0aWNreSNzdHVja3RvXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3NldFN0aWNreSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICBzdGlja1RvID0gdGhpcy5vcHRpb25zLnN0aWNrVG8sXG4gICAgICAgIG1yZ24gPSBzdGlja1RvID09PSAndG9wJyA/ICdtYXJnaW5Ub3AnIDogJ21hcmdpbkJvdHRvbScsXG4gICAgICAgIG5vdFN0dWNrVG8gPSBzdGlja1RvID09PSAndG9wJyA/ICdib3R0b20nIDogJ3RvcCcsXG4gICAgICAgIGNzcyA9IHt9O1xuXG4gICAgY3NzW21yZ25dID0gYCR7dGhpcy5vcHRpb25zW21yZ25dfWVtYDtcbiAgICBjc3Nbc3RpY2tUb10gPSAwO1xuICAgIGNzc1tub3RTdHVja1RvXSA9ICdhdXRvJztcbiAgICB0aGlzLmlzU3R1Y2sgPSB0cnVlO1xuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoYGlzLWFuY2hvcmVkIGlzLWF0LSR7bm90U3R1Y2tUb31gKVxuICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoYGlzLXN0dWNrIGlzLWF0LSR7c3RpY2tUb31gKVxuICAgICAgICAgICAgICAgICAuY3NzKGNzcylcbiAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAqIEZpcmVzIHdoZW4gdGhlICRlbGVtZW50IGhhcyBiZWNvbWUgYHBvc2l0aW9uOiBmaXhlZDtgXG4gICAgICAgICAgICAgICAgICAqIE5hbWVzcGFjZWQgdG8gYHRvcGAgb3IgYGJvdHRvbWAsIGUuZy4gYHN0aWNreS56Zi5zdHVja3RvOnRvcGBcbiAgICAgICAgICAgICAgICAgICogQGV2ZW50IFN0aWNreSNzdHVja3RvXG4gICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAudHJpZ2dlcihgc3RpY2t5LnpmLnN0dWNrdG86JHtzdGlja1RvfWApO1xuICAgIHRoaXMuJGVsZW1lbnQub24oXCJ0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgTVNUcmFuc2l0aW9uRW5kXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgX3RoaXMuX3NldFNpemVzKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2F1c2VzIHRoZSAkZWxlbWVudCB0byBiZWNvbWUgdW5zdHVjay5cbiAgICogUmVtb3ZlcyBgcG9zaXRpb246IGZpeGVkO2AsIGFuZCBoZWxwZXIgY2xhc3Nlcy5cbiAgICogQWRkcyBvdGhlciBoZWxwZXIgY2xhc3Nlcy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBpc1RvcCAtIHRlbGxzIHRoZSBmdW5jdGlvbiBpZiB0aGUgJGVsZW1lbnQgc2hvdWxkIGFuY2hvciB0byB0aGUgdG9wIG9yIGJvdHRvbSBvZiBpdHMgJGFuY2hvciBlbGVtZW50LlxuICAgKiBAZmlyZXMgU3RpY2t5I3Vuc3R1Y2tmcm9tXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcmVtb3ZlU3RpY2t5KGlzVG9wKSB7XG4gICAgdmFyIHN0aWNrVG8gPSB0aGlzLm9wdGlvbnMuc3RpY2tUbyxcbiAgICAgICAgc3RpY2tUb1RvcCA9IHN0aWNrVG8gPT09ICd0b3AnLFxuICAgICAgICBjc3MgPSB7fSxcbiAgICAgICAgYW5jaG9yUHQgPSAodGhpcy5wb2ludHMgPyB0aGlzLnBvaW50c1sxXSAtIHRoaXMucG9pbnRzWzBdIDogdGhpcy5hbmNob3JIZWlnaHQpIC0gdGhpcy5lbGVtSGVpZ2h0LFxuICAgICAgICBtcmduID0gc3RpY2tUb1RvcCA/ICdtYXJnaW5Ub3AnIDogJ21hcmdpbkJvdHRvbScsXG4gICAgICAgIG5vdFN0dWNrVG8gPSBzdGlja1RvVG9wID8gJ2JvdHRvbScgOiAndG9wJyxcbiAgICAgICAgdG9wT3JCb3R0b20gPSBpc1RvcCA/ICd0b3AnIDogJ2JvdHRvbSc7XG5cbiAgICBjc3NbbXJnbl0gPSAwO1xuXG4gICAgY3NzWydib3R0b20nXSA9ICdhdXRvJztcbiAgICBpZihpc1RvcCkge1xuICAgICAgY3NzWyd0b3AnXSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNzc1sndG9wJ10gPSBhbmNob3JQdDtcbiAgICB9XG5cbiAgICB0aGlzLmlzU3R1Y2sgPSBmYWxzZTtcbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKGBpcy1zdHVjayBpcy1hdC0ke3N0aWNrVG99YClcbiAgICAgICAgICAgICAgICAgLmFkZENsYXNzKGBpcy1hbmNob3JlZCBpcy1hdC0ke3RvcE9yQm90dG9tfWApXG4gICAgICAgICAgICAgICAgIC5jc3MoY3NzKVxuICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICogRmlyZXMgd2hlbiB0aGUgJGVsZW1lbnQgaGFzIGJlY29tZSBhbmNob3JlZC5cbiAgICAgICAgICAgICAgICAgICogTmFtZXNwYWNlZCB0byBgdG9wYCBvciBgYm90dG9tYCwgZS5nLiBgc3RpY2t5LnpmLnVuc3R1Y2tmcm9tOmJvdHRvbWBcbiAgICAgICAgICAgICAgICAgICogQGV2ZW50IFN0aWNreSN1bnN0dWNrZnJvbVxuICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgLnRyaWdnZXIoYHN0aWNreS56Zi51bnN0dWNrZnJvbToke3RvcE9yQm90dG9tfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlICRlbGVtZW50IGFuZCAkY29udGFpbmVyIHNpemVzIGZvciBwbHVnaW4uXG4gICAqIENhbGxzIGBfc2V0QnJlYWtQb2ludHNgLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiAtIG9wdGlvbmFsIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGZpcmUgb24gY29tcGxldGlvbiBvZiBgX3NldEJyZWFrUG9pbnRzYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRTaXplcyhjYikge1xuICAgIHRoaXMuY2FuU3RpY2sgPSBGb3VuZGF0aW9uLk1lZGlhUXVlcnkuaXModGhpcy5vcHRpb25zLnN0aWNreU9uKTtcbiAgICBpZiAoIXRoaXMuY2FuU3RpY2spIHtcbiAgICAgIGlmIChjYiAmJiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHsgY2IoKTsgfVxuICAgIH1cbiAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICBuZXdFbGVtV2lkdGggPSB0aGlzLiRjb250YWluZXJbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXG4gICAgICAgIGNvbXAgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLiRjb250YWluZXJbMF0pLFxuICAgICAgICBwZG5nbCA9IHBhcnNlSW50KGNvbXBbJ3BhZGRpbmctbGVmdCddLCAxMCksXG4gICAgICAgIHBkbmdyID0gcGFyc2VJbnQoY29tcFsncGFkZGluZy1yaWdodCddLCAxMCk7XG5cbiAgICBpZiAodGhpcy4kYW5jaG9yICYmIHRoaXMuJGFuY2hvci5sZW5ndGgpIHtcbiAgICAgIHRoaXMuYW5jaG9ySGVpZ2h0ID0gdGhpcy4kYW5jaG9yWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcGFyc2VQb2ludHMoKTtcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICAnbWF4LXdpZHRoJzogYCR7bmV3RWxlbVdpZHRoIC0gcGRuZ2wgLSBwZG5ncn1weGBcbiAgICB9KTtcblxuICAgIHZhciBuZXdDb250YWluZXJIZWlnaHQgPSB0aGlzLiRlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCB8fCB0aGlzLmNvbnRhaW5lckhlaWdodDtcbiAgICBpZiAodGhpcy4kZWxlbWVudC5jc3MoXCJkaXNwbGF5XCIpID09IFwibm9uZVwiKSB7XG4gICAgICBuZXdDb250YWluZXJIZWlnaHQgPSAwO1xuICAgIH1cbiAgICB0aGlzLmNvbnRhaW5lckhlaWdodCA9IG5ld0NvbnRhaW5lckhlaWdodDtcbiAgICB0aGlzLiRjb250YWluZXIuY3NzKHtcbiAgICAgIGhlaWdodDogbmV3Q29udGFpbmVySGVpZ2h0XG4gICAgfSk7XG4gICAgdGhpcy5lbGVtSGVpZ2h0ID0gbmV3Q29udGFpbmVySGVpZ2h0O1xuXG4gICAgaWYgKCF0aGlzLmlzU3R1Y2spIHtcbiAgICAgIGlmICh0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpcy1hdC1ib3R0b20nKSkge1xuICAgICAgICB2YXIgYW5jaG9yUHQgPSAodGhpcy5wb2ludHMgPyB0aGlzLnBvaW50c1sxXSAtIHRoaXMuJGNvbnRhaW5lci5vZmZzZXQoKS50b3AgOiB0aGlzLmFuY2hvckhlaWdodCkgLSB0aGlzLmVsZW1IZWlnaHQ7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQuY3NzKCd0b3AnLCBhbmNob3JQdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0QnJlYWtQb2ludHMobmV3Q29udGFpbmVySGVpZ2h0LCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjYiAmJiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHsgY2IoKTsgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHVwcGVyIGFuZCBsb3dlciBicmVha3BvaW50cyBmb3IgdGhlIGVsZW1lbnQgdG8gYmVjb21lIHN0aWNreS91bnN0aWNreS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGVsZW1IZWlnaHQgLSBweCB2YWx1ZSBmb3Igc3RpY2t5LiRlbGVtZW50IGhlaWdodCwgY2FsY3VsYXRlZCBieSBgX3NldFNpemVzYC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgLSBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gY29tcGxldGlvbi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRCcmVha1BvaW50cyhlbGVtSGVpZ2h0LCBjYikge1xuICAgIGlmICghdGhpcy5jYW5TdGljaykge1xuICAgICAgaWYgKGNiICYmIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgeyBjYigpOyB9XG4gICAgICBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuICAgIHZhciBtVG9wID0gZW1DYWxjKHRoaXMub3B0aW9ucy5tYXJnaW5Ub3ApLFxuICAgICAgICBtQnRtID0gZW1DYWxjKHRoaXMub3B0aW9ucy5tYXJnaW5Cb3R0b20pLFxuICAgICAgICB0b3BQb2ludCA9IHRoaXMucG9pbnRzID8gdGhpcy5wb2ludHNbMF0gOiB0aGlzLiRhbmNob3Iub2Zmc2V0KCkudG9wLFxuICAgICAgICBib3R0b21Qb2ludCA9IHRoaXMucG9pbnRzID8gdGhpcy5wb2ludHNbMV0gOiB0b3BQb2ludCArIHRoaXMuYW5jaG9ySGVpZ2h0LFxuICAgICAgICAvLyB0b3BQb2ludCA9IHRoaXMuJGFuY2hvci5vZmZzZXQoKS50b3AgfHwgdGhpcy5wb2ludHNbMF0sXG4gICAgICAgIC8vIGJvdHRvbVBvaW50ID0gdG9wUG9pbnQgKyB0aGlzLmFuY2hvckhlaWdodCB8fCB0aGlzLnBvaW50c1sxXSxcbiAgICAgICAgd2luSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zdGlja1RvID09PSAndG9wJykge1xuICAgICAgdG9wUG9pbnQgLT0gbVRvcDtcbiAgICAgIGJvdHRvbVBvaW50IC09IChlbGVtSGVpZ2h0ICsgbVRvcCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc3RpY2tUbyA9PT0gJ2JvdHRvbScpIHtcbiAgICAgIHRvcFBvaW50IC09ICh3aW5IZWlnaHQgLSAoZWxlbUhlaWdodCArIG1CdG0pKTtcbiAgICAgIGJvdHRvbVBvaW50IC09ICh3aW5IZWlnaHQgLSBtQnRtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy90aGlzIHdvdWxkIGJlIHRoZSBzdGlja1RvOiBib3RoIG9wdGlvbi4uLiB0cmlja3lcbiAgICB9XG5cbiAgICB0aGlzLnRvcFBvaW50ID0gdG9wUG9pbnQ7XG4gICAgdGhpcy5ib3R0b21Qb2ludCA9IGJvdHRvbVBvaW50O1xuXG4gICAgaWYgKGNiICYmIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgeyBjYigpOyB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveXMgdGhlIGN1cnJlbnQgc3RpY2t5IGVsZW1lbnQuXG4gICAqIFJlc2V0cyB0aGUgZWxlbWVudCB0byB0aGUgdG9wIHBvc2l0aW9uIGZpcnN0LlxuICAgKiBSZW1vdmVzIGV2ZW50IGxpc3RlbmVycywgSlMtYWRkZWQgY3NzIHByb3BlcnRpZXMgYW5kIGNsYXNzZXMsIGFuZCB1bndyYXBzIHRoZSAkZWxlbWVudCBpZiB0aGUgSlMgYWRkZWQgdGhlICRjb250YWluZXIuXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9yZW1vdmVTdGlja3kodHJ1ZSk7XG5cbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKGAke3RoaXMub3B0aW9ucy5zdGlja3lDbGFzc30gaXMtYW5jaG9yZWQgaXMtYXQtdG9wYClcbiAgICAgICAgICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnJyxcbiAgICAgICAgICAgICAgICAgICB0b3A6ICcnLFxuICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJycsXG4gICAgICAgICAgICAgICAgICAgJ21heC13aWR0aCc6ICcnXG4gICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgIC5vZmYoJ3Jlc2l6ZW1lLnpmLnRyaWdnZXInKTtcbiAgICBpZiAodGhpcy4kYW5jaG9yICYmIHRoaXMuJGFuY2hvci5sZW5ndGgpIHtcbiAgICAgIHRoaXMuJGFuY2hvci5vZmYoJ2NoYW5nZS56Zi5zdGlja3knKTtcbiAgICB9XG4gICAgJCh3aW5kb3cpLm9mZih0aGlzLnNjcm9sbExpc3RlbmVyKTtcblxuICAgIGlmICh0aGlzLndhc1dyYXBwZWQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQudW53cmFwKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGNvbnRhaW5lci5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY29udGFpbmVyQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIEZvdW5kYXRpb24udW5yZWdpc3RlclBsdWdpbih0aGlzKTtcbiAgfVxufVxuXG5TdGlja3kuZGVmYXVsdHMgPSB7XG4gIC8qKlxuICAgKiBDdXN0b21pemFibGUgY29udGFpbmVyIHRlbXBsYXRlLiBBZGQgeW91ciBvd24gY2xhc3NlcyBmb3Igc3R5bGluZyBhbmQgc2l6aW5nLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICcmbHQ7ZGl2IGRhdGEtc3RpY2t5LWNvbnRhaW5lciZndDsmbHQ7L2RpdiZndDsnXG4gICAqL1xuICBjb250YWluZXI6ICc8ZGl2IGRhdGEtc3RpY2t5LWNvbnRhaW5lcj48L2Rpdj4nLFxuICAvKipcbiAgICogTG9jYXRpb24gaW4gdGhlIHZpZXcgdGhlIGVsZW1lbnQgc3RpY2tzIHRvLiBDYW4gYmUgYCd0b3AnYCBvciBgJ2JvdHRvbSdgLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICd0b3AnXG4gICAqL1xuICBzdGlja1RvOiAndG9wJyxcbiAgLyoqXG4gICAqIElmIGFuY2hvcmVkIHRvIGEgc2luZ2xlIGVsZW1lbnQsIHRoZSBpZCBvZiB0aGF0IGVsZW1lbnQuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJydcbiAgICovXG4gIGFuY2hvcjogJycsXG4gIC8qKlxuICAgKiBJZiB1c2luZyBtb3JlIHRoYW4gb25lIGVsZW1lbnQgYXMgYW5jaG9yIHBvaW50cywgdGhlIGlkIG9mIHRoZSB0b3AgYW5jaG9yLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICcnXG4gICAqL1xuICB0b3BBbmNob3I6ICcnLFxuICAvKipcbiAgICogSWYgdXNpbmcgbW9yZSB0aGFuIG9uZSBlbGVtZW50IGFzIGFuY2hvciBwb2ludHMsIHRoZSBpZCBvZiB0aGUgYm90dG9tIGFuY2hvci5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnJ1xuICAgKi9cbiAgYnRtQW5jaG9yOiAnJyxcbiAgLyoqXG4gICAqIE1hcmdpbiwgaW4gYGVtYCdzIHRvIGFwcGx5IHRvIHRoZSB0b3Agb2YgdGhlIGVsZW1lbnQgd2hlbiBpdCBiZWNvbWVzIHN0aWNreS5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICBtYXJnaW5Ub3A6IDEsXG4gIC8qKlxuICAgKiBNYXJnaW4sIGluIGBlbWAncyB0byBhcHBseSB0byB0aGUgYm90dG9tIG9mIHRoZSBlbGVtZW50IHdoZW4gaXQgYmVjb21lcyBzdGlja3kuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQGRlZmF1bHQgMVxuICAgKi9cbiAgbWFyZ2luQm90dG9tOiAxLFxuICAvKipcbiAgICogQnJlYWtwb2ludCBzdHJpbmcgdGhhdCBpcyB0aGUgbWluaW11bSBzY3JlZW4gc2l6ZSBhbiBlbGVtZW50IHNob3VsZCBiZWNvbWUgc3RpY2t5LlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdtZWRpdW0nXG4gICAqL1xuICBzdGlja3lPbjogJ21lZGl1bScsXG4gIC8qKlxuICAgKiBDbGFzcyBhcHBsaWVkIHRvIHN0aWNreSBlbGVtZW50LCBhbmQgcmVtb3ZlZCBvbiBkZXN0cnVjdGlvbi4gRm91bmRhdGlvbiBkZWZhdWx0cyB0byBgc3RpY2t5YC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnc3RpY2t5J1xuICAgKi9cbiAgc3RpY2t5Q2xhc3M6ICdzdGlja3knLFxuICAvKipcbiAgICogQ2xhc3MgYXBwbGllZCB0byBzdGlja3kgY29udGFpbmVyLiBGb3VuZGF0aW9uIGRlZmF1bHRzIHRvIGBzdGlja3ktY29udGFpbmVyYC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnc3RpY2t5LWNvbnRhaW5lcidcbiAgICovXG4gIGNvbnRhaW5lckNsYXNzOiAnc3RpY2t5LWNvbnRhaW5lcicsXG4gIC8qKlxuICAgKiBOdW1iZXIgb2Ygc2Nyb2xsIGV2ZW50cyBiZXR3ZWVuIHRoZSBwbHVnaW4ncyByZWNhbGN1bGF0aW5nIHN0aWNreSBwb2ludHMuIFNldHRpbmcgaXQgdG8gYDBgIHdpbGwgY2F1c2UgaXQgdG8gcmVjYWxjIGV2ZXJ5IHNjcm9sbCBldmVudCwgc2V0dGluZyBpdCB0byBgLTFgIHdpbGwgcHJldmVudCByZWNhbGMgb24gc2Nyb2xsLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEBkZWZhdWx0IC0xXG4gICAqL1xuICBjaGVja0V2ZXJ5OiAtMVxufTtcblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gY2FsY3VsYXRlIGVtIHZhbHVlc1xuICogQHBhcmFtIE51bWJlciB7ZW19IC0gbnVtYmVyIG9mIGVtJ3MgdG8gY2FsY3VsYXRlIGludG8gcGl4ZWxzXG4gKi9cbmZ1bmN0aW9uIGVtQ2FsYyhlbSkge1xuICByZXR1cm4gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSwgbnVsbCkuZm9udFNpemUsIDEwKSAqIGVtO1xufVxuXG4vLyBXaW5kb3cgZXhwb3J0c1xuRm91bmRhdGlvbi5wbHVnaW4oU3RpY2t5LCAnU3RpY2t5Jyk7XG5cbn0oalF1ZXJ5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuLyoqXG4gKiBUYWJzIG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi50YWJzXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLmtleWJvYXJkXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLnRpbWVyQW5kSW1hZ2VMb2FkZXIgaWYgdGFicyBjb250YWluIGltYWdlc1xuICovXG5cbmNsYXNzIFRhYnMge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0YWJzLlxuICAgKiBAY2xhc3NcbiAgICogQGZpcmVzIFRhYnMjaW5pdFxuICAgKiBAcGFyYW0ge2pRdWVyeX0gZWxlbWVudCAtIGpRdWVyeSBvYmplY3QgdG8gbWFrZSBpbnRvIHRhYnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGVzIHRvIHRoZSBkZWZhdWx0IHBsdWdpbiBzZXR0aW5ncy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgVGFicy5kZWZhdWx0cywgdGhpcy4kZWxlbWVudC5kYXRhKCksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICAgIEZvdW5kYXRpb24ucmVnaXN0ZXJQbHVnaW4odGhpcywgJ1RhYnMnKTtcbiAgICBGb3VuZGF0aW9uLktleWJvYXJkLnJlZ2lzdGVyKCdUYWJzJywge1xuICAgICAgJ0VOVEVSJzogJ29wZW4nLFxuICAgICAgJ1NQQUNFJzogJ29wZW4nLFxuICAgICAgJ0FSUk9XX1JJR0hUJzogJ25leHQnLFxuICAgICAgJ0FSUk9XX1VQJzogJ3ByZXZpb3VzJyxcbiAgICAgICdBUlJPV19ET1dOJzogJ25leHQnLFxuICAgICAgJ0FSUk9XX0xFRlQnOiAncHJldmlvdXMnXG4gICAgICAvLyAnVEFCJzogJ25leHQnLFxuICAgICAgLy8gJ1NISUZUX1RBQic6ICdwcmV2aW91cydcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgdGFicyBieSBzaG93aW5nIGFuZCBmb2N1c2luZyAoaWYgYXV0b0ZvY3VzPXRydWUpIHRoZSBwcmVzZXQgYWN0aXZlIHRhYi5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoeydyb2xlJzogJ3RhYmxpc3QnfSk7XG4gICAgdGhpcy4kdGFiVGl0bGVzID0gdGhpcy4kZWxlbWVudC5maW5kKGAuJHt0aGlzLm9wdGlvbnMubGlua0NsYXNzfWApO1xuICAgIHRoaXMuJHRhYkNvbnRlbnQgPSAkKGBbZGF0YS10YWJzLWNvbnRlbnQ9XCIke3RoaXMuJGVsZW1lbnRbMF0uaWR9XCJdYCk7XG5cbiAgICB0aGlzLiR0YWJUaXRsZXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgdmFyICRlbGVtID0gJCh0aGlzKSxcbiAgICAgICAgICAkbGluayA9ICRlbGVtLmZpbmQoJ2EnKSxcbiAgICAgICAgICBpc0FjdGl2ZSA9ICRlbGVtLmhhc0NsYXNzKGAke190aGlzLm9wdGlvbnMubGlua0FjdGl2ZUNsYXNzfWApLFxuICAgICAgICAgIGhhc2ggPSAkbGlua1swXS5oYXNoLnNsaWNlKDEpLFxuICAgICAgICAgIGxpbmtJZCA9ICRsaW5rWzBdLmlkID8gJGxpbmtbMF0uaWQgOiBgJHtoYXNofS1sYWJlbGAsXG4gICAgICAgICAgJHRhYkNvbnRlbnQgPSAkKGAjJHtoYXNofWApO1xuXG4gICAgICAkZWxlbS5hdHRyKHsncm9sZSc6ICdwcmVzZW50YXRpb24nfSk7XG5cbiAgICAgICRsaW5rLmF0dHIoe1xuICAgICAgICAncm9sZSc6ICd0YWInLFxuICAgICAgICAnYXJpYS1jb250cm9scyc6IGhhc2gsXG4gICAgICAgICdhcmlhLXNlbGVjdGVkJzogaXNBY3RpdmUsXG4gICAgICAgICdpZCc6IGxpbmtJZFxuICAgICAgfSk7XG5cbiAgICAgICR0YWJDb250ZW50LmF0dHIoe1xuICAgICAgICAncm9sZSc6ICd0YWJwYW5lbCcsXG4gICAgICAgICdhcmlhLWhpZGRlbic6ICFpc0FjdGl2ZSxcbiAgICAgICAgJ2FyaWEtbGFiZWxsZWRieSc6IGxpbmtJZFxuICAgICAgfSk7XG5cbiAgICAgIGlmKGlzQWN0aXZlICYmIF90aGlzLm9wdGlvbnMuYXV0b0ZvY3VzKXtcbiAgICAgICAgJCh3aW5kb3cpLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICRlbGVtLm9mZnNldCgpLnRvcCB9LCBfdGhpcy5vcHRpb25zLmRlZXBMaW5rU211ZGdlRGVsYXksICgpID0+IHtcbiAgICAgICAgICAgICRsaW5rLmZvY3VzKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gICAgaWYodGhpcy5vcHRpb25zLm1hdGNoSGVpZ2h0KSB7XG4gICAgICB2YXIgJGltYWdlcyA9IHRoaXMuJHRhYkNvbnRlbnQuZmluZCgnaW1nJyk7XG5cbiAgICAgIGlmICgkaW1hZ2VzLmxlbmd0aCkge1xuICAgICAgICBGb3VuZGF0aW9uLm9uSW1hZ2VzTG9hZGVkKCRpbWFnZXMsIHRoaXMuX3NldEhlaWdodC5iaW5kKHRoaXMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NldEhlaWdodCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgICAvL2N1cnJlbnQgY29udGV4dC1ib3VuZCBmdW5jdGlvbiB0byBvcGVuIHRhYnMgb24gcGFnZSBsb2FkIG9yIGhpc3RvcnkgcG9wc3RhdGVcbiAgICB0aGlzLl9jaGVja0RlZXBMaW5rID0gKCkgPT4ge1xuICAgICAgdmFyIGFuY2hvciA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgICAgLy9uZWVkIGEgaGFzaCBhbmQgYSByZWxldmFudCBhbmNob3IgaW4gdGhpcyB0YWJzZXRcbiAgICAgIGlmKGFuY2hvci5sZW5ndGgpIHtcbiAgICAgICAgdmFyICRsaW5rID0gdGhpcy4kZWxlbWVudC5maW5kKCdbaHJlZj1cIicrYW5jaG9yKydcIl0nKTtcbiAgICAgICAgaWYgKCRsaW5rLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0VGFiKCQoYW5jaG9yKSwgdHJ1ZSk7XG5cbiAgICAgICAgICAvL3JvbGwgdXAgYSBsaXR0bGUgdG8gc2hvdyB0aGUgdGl0bGVzXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWVwTGlua1NtdWRnZSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KCk7XG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogb2Zmc2V0LnRvcCB9LCB0aGlzLm9wdGlvbnMuZGVlcExpbmtTbXVkZ2VEZWxheSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICAqIEZpcmVzIHdoZW4gdGhlIHpwbHVnaW4gaGFzIGRlZXBsaW5rZWQgYXQgcGFnZWxvYWRcbiAgICAgICAgICAgICogQGV2ZW50IFRhYnMjZGVlcGxpbmtcbiAgICAgICAgICAgICovXG4gICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignZGVlcGxpbmsuemYudGFicycsIFskbGluaywgJChhbmNob3IpXSk7XG4gICAgICAgICB9XG4gICAgICAgfVxuICAgICB9XG5cbiAgICAvL3VzZSBicm93c2VyIHRvIG9wZW4gYSB0YWIsIGlmIGl0IGV4aXN0cyBpbiB0aGlzIHRhYnNldFxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGVlcExpbmspIHtcbiAgICAgIHRoaXMuX2NoZWNrRGVlcExpbmsoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9ldmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGV2ZW50IGhhbmRsZXJzIGZvciBpdGVtcyB3aXRoaW4gdGhlIHRhYnMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXZlbnRzKCkge1xuICAgIHRoaXMuX2FkZEtleUhhbmRsZXIoKTtcbiAgICB0aGlzLl9hZGRDbGlja0hhbmRsZXIoKTtcbiAgICB0aGlzLl9zZXRIZWlnaHRNcUhhbmRsZXIgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tYXRjaEhlaWdodCkge1xuICAgICAgdGhpcy5fc2V0SGVpZ2h0TXFIYW5kbGVyID0gdGhpcy5fc2V0SGVpZ2h0LmJpbmQodGhpcyk7XG5cbiAgICAgICQod2luZG93KS5vbignY2hhbmdlZC56Zi5tZWRpYXF1ZXJ5JywgdGhpcy5fc2V0SGVpZ2h0TXFIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBpZih0aGlzLm9wdGlvbnMuZGVlcExpbmspIHtcbiAgICAgICQod2luZG93KS5vbigncG9wc3RhdGUnLCB0aGlzLl9jaGVja0RlZXBMaW5rKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBjbGljayBoYW5kbGVycyBmb3IgaXRlbXMgd2l0aGluIHRoZSB0YWJzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FkZENsaWNrSGFuZGxlcigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLm9mZignY2xpY2suemYudGFicycpXG4gICAgICAub24oJ2NsaWNrLnpmLnRhYnMnLCBgLiR7dGhpcy5vcHRpb25zLmxpbmtDbGFzc31gLCBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBfdGhpcy5faGFuZGxlVGFiQ2hhbmdlKCQodGhpcykpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBrZXlib2FyZCBldmVudCBoYW5kbGVycyBmb3IgaXRlbXMgd2l0aGluIHRoZSB0YWJzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2FkZEtleUhhbmRsZXIoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuJHRhYlRpdGxlcy5vZmYoJ2tleWRvd24uemYudGFicycpLm9uKCdrZXlkb3duLnpmLnRhYnMnLCBmdW5jdGlvbihlKXtcbiAgICAgIGlmIChlLndoaWNoID09PSA5KSByZXR1cm47XG5cblxuICAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKSxcbiAgICAgICAgJGVsZW1lbnRzID0gJGVsZW1lbnQucGFyZW50KCd1bCcpLmNoaWxkcmVuKCdsaScpLFxuICAgICAgICAkcHJldkVsZW1lbnQsXG4gICAgICAgICRuZXh0RWxlbWVudDtcblxuICAgICAgJGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICBpZiAoJCh0aGlzKS5pcygkZWxlbWVudCkpIHtcbiAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy53cmFwT25LZXlzKSB7XG4gICAgICAgICAgICAkcHJldkVsZW1lbnQgPSBpID09PSAwID8gJGVsZW1lbnRzLmxhc3QoKSA6ICRlbGVtZW50cy5lcShpLTEpO1xuICAgICAgICAgICAgJG5leHRFbGVtZW50ID0gaSA9PT0gJGVsZW1lbnRzLmxlbmd0aCAtMSA/ICRlbGVtZW50cy5maXJzdCgpIDogJGVsZW1lbnRzLmVxKGkrMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRwcmV2RWxlbWVudCA9ICRlbGVtZW50cy5lcShNYXRoLm1heCgwLCBpLTEpKTtcbiAgICAgICAgICAgICRuZXh0RWxlbWVudCA9ICRlbGVtZW50cy5lcShNYXRoLm1pbihpKzEsICRlbGVtZW50cy5sZW5ndGgtMSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBoYW5kbGUga2V5Ym9hcmQgZXZlbnQgd2l0aCBrZXlib2FyZCB1dGlsXG4gICAgICBGb3VuZGF0aW9uLktleWJvYXJkLmhhbmRsZUtleShlLCAnVGFicycsIHtcbiAgICAgICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJGVsZW1lbnQuZmluZCgnW3JvbGU9XCJ0YWJcIl0nKS5mb2N1cygpO1xuICAgICAgICAgIF90aGlzLl9oYW5kbGVUYWJDaGFuZ2UoJGVsZW1lbnQpO1xuICAgICAgICB9LFxuICAgICAgICBwcmV2aW91czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHByZXZFbGVtZW50LmZpbmQoJ1tyb2xlPVwidGFiXCJdJykuZm9jdXMoKTtcbiAgICAgICAgICBfdGhpcy5faGFuZGxlVGFiQ2hhbmdlKCRwcmV2RWxlbWVudCk7XG4gICAgICAgIH0sXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRuZXh0RWxlbWVudC5maW5kKCdbcm9sZT1cInRhYlwiXScpLmZvY3VzKCk7XG4gICAgICAgICAgX3RoaXMuX2hhbmRsZVRhYkNoYW5nZSgkbmV4dEVsZW1lbnQpO1xuICAgICAgICB9LFxuICAgICAgICBoYW5kbGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIHRhYiBgJHRhcmdldENvbnRlbnRgIGRlZmluZWQgYnkgYCR0YXJnZXRgLiBDb2xsYXBzZXMgYWN0aXZlIHRhYi5cbiAgICogQHBhcmFtIHtqUXVlcnl9ICR0YXJnZXQgLSBUYWIgdG8gb3Blbi5cbiAgICogQHBhcmFtIHtib29sZWFufSBoaXN0b3J5SGFuZGxlZCAtIGJyb3dzZXIgaGFzIGFscmVhZHkgaGFuZGxlZCBhIGhpc3RvcnkgdXBkYXRlXG4gICAqIEBmaXJlcyBUYWJzI2NoYW5nZVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG4gIF9oYW5kbGVUYWJDaGFuZ2UoJHRhcmdldCwgaGlzdG9yeUhhbmRsZWQpIHtcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGZvciBhY3RpdmUgY2xhc3Mgb24gdGFyZ2V0LiBDb2xsYXBzZSBpZiBleGlzdHMuXG4gICAgICovXG4gICAgaWYgKCR0YXJnZXQuaGFzQ2xhc3MoYCR7dGhpcy5vcHRpb25zLmxpbmtBY3RpdmVDbGFzc31gKSkge1xuICAgICAgICBpZih0aGlzLm9wdGlvbnMuYWN0aXZlQ29sbGFwc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxhcHNlVGFiKCR0YXJnZXQpO1xuXG4gICAgICAgICAgIC8qKlxuICAgICAgICAgICAgKiBGaXJlcyB3aGVuIHRoZSB6cGx1Z2luIGhhcyBzdWNjZXNzZnVsbHkgY29sbGFwc2VkIHRhYnMuXG4gICAgICAgICAgICAqIEBldmVudCBUYWJzI2NvbGxhcHNlXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjb2xsYXBzZS56Zi50YWJzJywgWyR0YXJnZXRdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyICRvbGRUYWIgPSB0aGlzLiRlbGVtZW50LlxuICAgICAgICAgIGZpbmQoYC4ke3RoaXMub3B0aW9ucy5saW5rQ2xhc3N9LiR7dGhpcy5vcHRpb25zLmxpbmtBY3RpdmVDbGFzc31gKSxcbiAgICAgICAgICAkdGFiTGluayA9ICR0YXJnZXQuZmluZCgnW3JvbGU9XCJ0YWJcIl0nKSxcbiAgICAgICAgICBoYXNoID0gJHRhYkxpbmtbMF0uaGFzaCxcbiAgICAgICAgICAkdGFyZ2V0Q29udGVudCA9IHRoaXMuJHRhYkNvbnRlbnQuZmluZChoYXNoKTtcblxuICAgIC8vY2xvc2Ugb2xkIHRhYlxuICAgIHRoaXMuX2NvbGxhcHNlVGFiKCRvbGRUYWIpO1xuXG4gICAgLy9vcGVuIG5ldyB0YWJcbiAgICB0aGlzLl9vcGVuVGFiKCR0YXJnZXQpO1xuXG4gICAgLy9laXRoZXIgcmVwbGFjZSBvciB1cGRhdGUgYnJvd3NlciBoaXN0b3J5XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZWVwTGluayAmJiAhaGlzdG9yeUhhbmRsZWQpIHtcbiAgICAgIHZhciBhbmNob3IgPSAkdGFyZ2V0LmZpbmQoJ2EnKS5hdHRyKCdocmVmJyk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXBkYXRlSGlzdG9yeSkge1xuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsIGFuY2hvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgJycsIGFuY2hvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlyZXMgd2hlbiB0aGUgcGx1Z2luIGhhcyBzdWNjZXNzZnVsbHkgY2hhbmdlZCB0YWJzLlxuICAgICAqIEBldmVudCBUYWJzI2NoYW5nZVxuICAgICAqL1xuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlLnpmLnRhYnMnLCBbJHRhcmdldCwgJHRhcmdldENvbnRlbnRdKTtcblxuICAgIC8vZmlyZSB0byBjaGlsZHJlbiBhIG11dGF0aW9uIGV2ZW50XG4gICAgJHRhcmdldENvbnRlbnQuZmluZChcIltkYXRhLW11dGF0ZV1cIikudHJpZ2dlcihcIm11dGF0ZW1lLnpmLnRyaWdnZXJcIik7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIHRhYiBgJHRhcmdldENvbnRlbnRgIGRlZmluZWQgYnkgYCR0YXJnZXRgLlxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRhcmdldCAtIFRhYiB0byBPcGVuLlxuICAgKiBAZnVuY3Rpb25cbiAgICovXG4gIF9vcGVuVGFiKCR0YXJnZXQpIHtcbiAgICAgIHZhciAkdGFiTGluayA9ICR0YXJnZXQuZmluZCgnW3JvbGU9XCJ0YWJcIl0nKSxcbiAgICAgICAgICBoYXNoID0gJHRhYkxpbmtbMF0uaGFzaCxcbiAgICAgICAgICAkdGFyZ2V0Q29udGVudCA9IHRoaXMuJHRhYkNvbnRlbnQuZmluZChoYXNoKTtcblxuICAgICAgJHRhcmdldC5hZGRDbGFzcyhgJHt0aGlzLm9wdGlvbnMubGlua0FjdGl2ZUNsYXNzfWApO1xuXG4gICAgICAkdGFiTGluay5hdHRyKHsnYXJpYS1zZWxlY3RlZCc6ICd0cnVlJ30pO1xuXG4gICAgICAkdGFyZ2V0Q29udGVudFxuICAgICAgICAuYWRkQ2xhc3MoYCR7dGhpcy5vcHRpb25zLnBhbmVsQWN0aXZlQ2xhc3N9YClcbiAgICAgICAgLmF0dHIoeydhcmlhLWhpZGRlbic6ICdmYWxzZSd9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb2xsYXBzZXMgYCR0YXJnZXRDb250ZW50YCBkZWZpbmVkIGJ5IGAkdGFyZ2V0YC5cbiAgICogQHBhcmFtIHtqUXVlcnl9ICR0YXJnZXQgLSBUYWIgdG8gT3Blbi5cbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBfY29sbGFwc2VUYWIoJHRhcmdldCkge1xuICAgIHZhciAkdGFyZ2V0X2FuY2hvciA9ICR0YXJnZXRcbiAgICAgIC5yZW1vdmVDbGFzcyhgJHt0aGlzLm9wdGlvbnMubGlua0FjdGl2ZUNsYXNzfWApXG4gICAgICAuZmluZCgnW3JvbGU9XCJ0YWJcIl0nKVxuICAgICAgLmF0dHIoeyAnYXJpYS1zZWxlY3RlZCc6ICdmYWxzZScgfSk7XG5cbiAgICAkKGAjJHskdGFyZ2V0X2FuY2hvci5hdHRyKCdhcmlhLWNvbnRyb2xzJyl9YClcbiAgICAgIC5yZW1vdmVDbGFzcyhgJHt0aGlzLm9wdGlvbnMucGFuZWxBY3RpdmVDbGFzc31gKVxuICAgICAgLmF0dHIoeyAnYXJpYS1oaWRkZW4nOiAndHJ1ZScgfSk7XG4gIH1cblxuICAvKipcbiAgICogUHVibGljIG1ldGhvZCBmb3Igc2VsZWN0aW5nIGEgY29udGVudCBwYW5lIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7alF1ZXJ5IHwgU3RyaW5nfSBlbGVtIC0galF1ZXJ5IG9iamVjdCBvciBzdHJpbmcgb2YgdGhlIGlkIG9mIHRoZSBwYW5lIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaGlzdG9yeUhhbmRsZWQgLSBicm93c2VyIGhhcyBhbHJlYWR5IGhhbmRsZWQgYSBoaXN0b3J5IHVwZGF0ZVxuICAgKiBAZnVuY3Rpb25cbiAgICovXG4gIHNlbGVjdFRhYihlbGVtLCBoaXN0b3J5SGFuZGxlZCkge1xuICAgIHZhciBpZFN0cjtcblxuICAgIGlmICh0eXBlb2YgZWxlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlkU3RyID0gZWxlbVswXS5pZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWRTdHIgPSBlbGVtO1xuICAgIH1cblxuICAgIGlmIChpZFN0ci5pbmRleE9mKCcjJykgPCAwKSB7XG4gICAgICBpZFN0ciA9IGAjJHtpZFN0cn1gO1xuICAgIH1cblxuICAgIHZhciAkdGFyZ2V0ID0gdGhpcy4kdGFiVGl0bGVzLmZpbmQoYFtocmVmPVwiJHtpZFN0cn1cIl1gKS5wYXJlbnQoYC4ke3RoaXMub3B0aW9ucy5saW5rQ2xhc3N9YCk7XG5cbiAgICB0aGlzLl9oYW5kbGVUYWJDaGFuZ2UoJHRhcmdldCwgaGlzdG9yeUhhbmRsZWQpO1xuICB9O1xuICAvKipcbiAgICogU2V0cyB0aGUgaGVpZ2h0IG9mIGVhY2ggcGFuZWwgdG8gdGhlIGhlaWdodCBvZiB0aGUgdGFsbGVzdCBwYW5lbC5cbiAgICogSWYgZW5hYmxlZCBpbiBvcHRpb25zLCBnZXRzIGNhbGxlZCBvbiBtZWRpYSBxdWVyeSBjaGFuZ2UuXG4gICAqIElmIGxvYWRpbmcgY29udGVudCB2aWEgZXh0ZXJuYWwgc291cmNlLCBjYW4gYmUgY2FsbGVkIGRpcmVjdGx5IG9yIHdpdGggX3JlZmxvdy5cbiAgICogSWYgZW5hYmxlZCB3aXRoIGBkYXRhLW1hdGNoLWhlaWdodD1cInRydWVcImAsIHRhYnMgc2V0cyB0byBlcXVhbCBoZWlnaHRcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2V0SGVpZ2h0KCkge1xuICAgIHZhciBtYXggPSAwLFxuICAgICAgICBfdGhpcyA9IHRoaXM7IC8vIExvY2sgZG93biB0aGUgYHRoaXNgIHZhbHVlIGZvciB0aGUgcm9vdCB0YWJzIG9iamVjdFxuXG4gICAgdGhpcy4kdGFiQ29udGVudFxuICAgICAgLmZpbmQoYC4ke3RoaXMub3B0aW9ucy5wYW5lbENsYXNzfWApXG4gICAgICAuY3NzKCdoZWlnaHQnLCAnJylcbiAgICAgIC5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBwYW5lbCA9ICQodGhpcyksXG4gICAgICAgICAgICBpc0FjdGl2ZSA9IHBhbmVsLmhhc0NsYXNzKGAke190aGlzLm9wdGlvbnMucGFuZWxBY3RpdmVDbGFzc31gKTsgLy8gZ2V0IHRoZSBvcHRpb25zIGZyb20gdGhlIHBhcmVudCBpbnN0ZWFkIG9mIHRyeWluZyB0byBnZXQgdGhlbSBmcm9tIHRoZSBjaGlsZFxuICAgICAgICAgICAgXG4gICAgICAgIGlmICghaXNBY3RpdmUpIHtcbiAgICAgICAgICBwYW5lbC5jc3Moeyd2aXNpYmlsaXR5JzogJ2hpZGRlbicsICdkaXNwbGF5JzogJ2Jsb2NrJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRlbXAgPSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgICAgICBpZiAoIWlzQWN0aXZlKSB7XG4gICAgICAgICAgcGFuZWwuY3NzKHtcbiAgICAgICAgICAgICd2aXNpYmlsaXR5JzogJycsXG4gICAgICAgICAgICAnZGlzcGxheSc6ICcnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYXggPSB0ZW1wID4gbWF4ID8gdGVtcCA6IG1heDtcbiAgICAgIH0pXG4gICAgICAuY3NzKCdoZWlnaHQnLCBgJHttYXh9cHhgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95cyBhbiBpbnN0YW5jZSBvZiBhbiB0YWJzLlxuICAgKiBAZmlyZXMgVGFicyNkZXN0cm95ZWRcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLmZpbmQoYC4ke3RoaXMub3B0aW9ucy5saW5rQ2xhc3N9YClcbiAgICAgIC5vZmYoJy56Zi50YWJzJykuaGlkZSgpLmVuZCgpXG4gICAgICAuZmluZChgLiR7dGhpcy5vcHRpb25zLnBhbmVsQ2xhc3N9YClcbiAgICAgIC5oaWRlKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm1hdGNoSGVpZ2h0KSB7XG4gICAgICBpZiAodGhpcy5fc2V0SGVpZ2h0TXFIYW5kbGVyICE9IG51bGwpIHtcbiAgICAgICAgICQod2luZG93KS5vZmYoJ2NoYW5nZWQuemYubWVkaWFxdWVyeScsIHRoaXMuX3NldEhlaWdodE1xSGFuZGxlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZWVwTGluaykge1xuICAgICAgJCh3aW5kb3cpLm9mZigncG9wc3RhdGUnLCB0aGlzLl9jaGVja0RlZXBMaW5rKTtcbiAgICB9XG5cbiAgICBGb3VuZGF0aW9uLnVucmVnaXN0ZXJQbHVnaW4odGhpcyk7XG4gIH1cbn1cblxuVGFicy5kZWZhdWx0cyA9IHtcbiAgLyoqXG4gICAqIEFsbG93cyB0aGUgd2luZG93IHRvIHNjcm9sbCB0byBjb250ZW50IG9mIHBhbmUgc3BlY2lmaWVkIGJ5IGhhc2ggYW5jaG9yXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBkZWVwTGluazogZmFsc2UsXG5cbiAgLyoqXG4gICAqIEFkanVzdCB0aGUgZGVlcCBsaW5rIHNjcm9sbCB0byBtYWtlIHN1cmUgdGhlIHRvcCBvZiB0aGUgdGFiIHBhbmVsIGlzIHZpc2libGVcbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGRlZXBMaW5rU211ZGdlOiBmYWxzZSxcblxuICAvKipcbiAgICogQW5pbWF0aW9uIHRpbWUgKG1zKSBmb3IgdGhlIGRlZXAgbGluayBhZGp1c3RtZW50XG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQGRlZmF1bHQgMzAwXG4gICAqL1xuICBkZWVwTGlua1NtdWRnZURlbGF5OiAzMDAsXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgYnJvd3NlciBoaXN0b3J5IHdpdGggdGhlIG9wZW4gdGFiXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICB1cGRhdGVIaXN0b3J5OiBmYWxzZSxcblxuICAvKipcbiAgICogQWxsb3dzIHRoZSB3aW5kb3cgdG8gc2Nyb2xsIHRvIGNvbnRlbnQgb2YgYWN0aXZlIHBhbmUgb24gbG9hZCBpZiBzZXQgdG8gdHJ1ZS5cbiAgICogTm90IHJlY29tbWVuZGVkIGlmIG1vcmUgdGhhbiBvbmUgdGFiIHBhbmVsIHBlciBwYWdlLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgYXV0b0ZvY3VzOiBmYWxzZSxcblxuICAvKipcbiAgICogQWxsb3dzIGtleWJvYXJkIGlucHV0IHRvICd3cmFwJyBhcm91bmQgdGhlIHRhYiBsaW5rcy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgd3JhcE9uS2V5czogdHJ1ZSxcblxuICAvKipcbiAgICogQWxsb3dzIHRoZSB0YWIgY29udGVudCBwYW5lcyB0byBtYXRjaCBoZWlnaHRzIGlmIHNldCB0byB0cnVlLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgbWF0Y2hIZWlnaHQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBBbGxvd3MgYWN0aXZlIHRhYnMgdG8gY29sbGFwc2Ugd2hlbiBjbGlja2VkLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgYWN0aXZlQ29sbGFwc2U6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBDbGFzcyBhcHBsaWVkIHRvIGBsaWAncyBpbiB0YWIgbGluayBsaXN0LlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICd0YWJzLXRpdGxlJ1xuICAgKi9cbiAgbGlua0NsYXNzOiAndGFicy10aXRsZScsXG5cbiAgLyoqXG4gICAqIENsYXNzIGFwcGxpZWQgdG8gdGhlIGFjdGl2ZSBgbGlgIGluIHRhYiBsaW5rIGxpc3QuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2lzLWFjdGl2ZSdcbiAgICovXG4gIGxpbmtBY3RpdmVDbGFzczogJ2lzLWFjdGl2ZScsXG5cbiAgLyoqXG4gICAqIENsYXNzIGFwcGxpZWQgdG8gdGhlIGNvbnRlbnQgY29udGFpbmVycy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAndGFicy1wYW5lbCdcbiAgICovXG4gIHBhbmVsQ2xhc3M6ICd0YWJzLXBhbmVsJyxcblxuICAvKipcbiAgICogQ2xhc3MgYXBwbGllZCB0byB0aGUgYWN0aXZlIGNvbnRlbnQgY29udGFpbmVyLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdpcy1hY3RpdmUnXG4gICAqL1xuICBwYW5lbEFjdGl2ZUNsYXNzOiAnaXMtYWN0aXZlJ1xufTtcblxuLy8gV2luZG93IGV4cG9ydHNcbkZvdW5kYXRpb24ucGx1Z2luKFRhYnMsICdUYWJzJyk7XG5cbn0oalF1ZXJ5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuLyoqXG4gKiBUb2dnbGVyIG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi50b2dnbGVyXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLm1vdGlvblxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC50cmlnZ2Vyc1xuICovXG5cbmNsYXNzIFRvZ2dsZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBUb2dnbGVyLlxuICAgKiBAY2xhc3NcbiAgICogQGZpcmVzIFRvZ2dsZXIjaW5pdFxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCAtIGpRdWVyeSBvYmplY3QgdG8gYWRkIHRoZSB0cmlnZ2VyIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlcyB0byB0aGUgZGVmYXVsdCBwbHVnaW4gc2V0dGluZ3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIFRvZ2dsZXIuZGVmYXVsdHMsIGVsZW1lbnQuZGF0YSgpLCBvcHRpb25zKTtcbiAgICB0aGlzLmNsYXNzTmFtZSA9ICcnO1xuXG4gICAgdGhpcy5faW5pdCgpO1xuICAgIHRoaXMuX2V2ZW50cygpO1xuXG4gICAgRm91bmRhdGlvbi5yZWdpc3RlclBsdWdpbih0aGlzLCAnVG9nZ2xlcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBUb2dnbGVyIHBsdWdpbiBieSBwYXJzaW5nIHRoZSB0b2dnbGUgY2xhc3MgZnJvbSBkYXRhLXRvZ2dsZXIsIG9yIGFuaW1hdGlvbiBjbGFzc2VzIGZyb20gZGF0YS1hbmltYXRlLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0KCkge1xuICAgIHZhciBpbnB1dDtcbiAgICAvLyBQYXJzZSBhbmltYXRpb24gY2xhc3NlcyBpZiB0aGV5IHdlcmUgc2V0XG4gICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRlKSB7XG4gICAgICBpbnB1dCA9IHRoaXMub3B0aW9ucy5hbmltYXRlLnNwbGl0KCcgJyk7XG5cbiAgICAgIHRoaXMuYW5pbWF0aW9uSW4gPSBpbnB1dFswXTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uT3V0ID0gaW5wdXRbMV0gfHwgbnVsbDtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlLCBwYXJzZSB0b2dnbGUgY2xhc3NcbiAgICBlbHNlIHtcbiAgICAgIGlucHV0ID0gdGhpcy4kZWxlbWVudC5kYXRhKCd0b2dnbGVyJyk7XG4gICAgICAvLyBBbGxvdyBmb3IgYSAuIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHN0cmluZ1xuICAgICAgdGhpcy5jbGFzc05hbWUgPSBpbnB1dFswXSA9PT0gJy4nID8gaW5wdXQuc2xpY2UoMSkgOiBpbnB1dDtcbiAgICB9XG5cbiAgICAvLyBBZGQgQVJJQSBhdHRyaWJ1dGVzIHRvIHRyaWdnZXJzXG4gICAgdmFyIGlkID0gdGhpcy4kZWxlbWVudFswXS5pZDtcbiAgICAkKGBbZGF0YS1vcGVuPVwiJHtpZH1cIl0sIFtkYXRhLWNsb3NlPVwiJHtpZH1cIl0sIFtkYXRhLXRvZ2dsZT1cIiR7aWR9XCJdYClcbiAgICAgIC5hdHRyKCdhcmlhLWNvbnRyb2xzJywgaWQpO1xuICAgIC8vIElmIHRoZSB0YXJnZXQgaXMgaGlkZGVuLCBhZGQgYXJpYS1oaWRkZW5cbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0aGlzLiRlbGVtZW50LmlzKCc6aGlkZGVuJykgPyBmYWxzZSA6IHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIGV2ZW50cyBmb3IgdGhlIHRvZ2dsZSB0cmlnZ2VyLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ldmVudHMoKSB7XG4gICAgdGhpcy4kZWxlbWVudC5vZmYoJ3RvZ2dsZS56Zi50cmlnZ2VyJykub24oJ3RvZ2dsZS56Zi50cmlnZ2VyJywgdGhpcy50b2dnbGUuYmluZCh0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgdGFyZ2V0IGNsYXNzIG9uIHRoZSB0YXJnZXQgZWxlbWVudC4gQW4gZXZlbnQgaXMgZmlyZWQgZnJvbSB0aGUgb3JpZ2luYWwgdHJpZ2dlciBkZXBlbmRpbmcgb24gaWYgdGhlIHJlc3VsdGFudCBzdGF0ZSB3YXMgXCJvblwiIG9yIFwib2ZmXCIuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAZmlyZXMgVG9nZ2xlciNvblxuICAgKiBAZmlyZXMgVG9nZ2xlciNvZmZcbiAgICovXG4gIHRvZ2dsZSgpIHtcbiAgICB0aGlzWyB0aGlzLm9wdGlvbnMuYW5pbWF0ZSA/ICdfdG9nZ2xlQW5pbWF0ZScgOiAnX3RvZ2dsZUNsYXNzJ10oKTtcbiAgfVxuXG4gIF90b2dnbGVDbGFzcygpIHtcbiAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKHRoaXMuY2xhc3NOYW1lKTtcblxuICAgIHZhciBpc09uID0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcyh0aGlzLmNsYXNzTmFtZSk7XG4gICAgaWYgKGlzT24pIHtcbiAgICAgIC8qKlxuICAgICAgICogRmlyZXMgaWYgdGhlIHRhcmdldCBlbGVtZW50IGhhcyB0aGUgY2xhc3MgYWZ0ZXIgYSB0b2dnbGUuXG4gICAgICAgKiBAZXZlbnQgVG9nZ2xlciNvblxuICAgICAgICovXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ29uLnpmLnRvZ2dsZXInKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvKipcbiAgICAgICAqIEZpcmVzIGlmIHRoZSB0YXJnZXQgZWxlbWVudCBkb2VzIG5vdCBoYXZlIHRoZSBjbGFzcyBhZnRlciBhIHRvZ2dsZS5cbiAgICAgICAqIEBldmVudCBUb2dnbGVyI29mZlxuICAgICAgICovXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ29mZi56Zi50b2dnbGVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlQVJJQShpc09uKTtcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ1tkYXRhLW11dGF0ZV0nKS50cmlnZ2VyKCdtdXRhdGVtZS56Zi50cmlnZ2VyJyk7XG4gIH1cblxuICBfdG9nZ2xlQW5pbWF0ZSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQuaXMoJzpoaWRkZW4nKSkge1xuICAgICAgRm91bmRhdGlvbi5Nb3Rpb24uYW5pbWF0ZUluKHRoaXMuJGVsZW1lbnQsIHRoaXMuYW5pbWF0aW9uSW4sIGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5fdXBkYXRlQVJJQSh0cnVlKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdvbi56Zi50b2dnbGVyJyk7XG4gICAgICAgIHRoaXMuZmluZCgnW2RhdGEtbXV0YXRlXScpLnRyaWdnZXIoJ211dGF0ZW1lLnpmLnRyaWdnZXInKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIEZvdW5kYXRpb24uTW90aW9uLmFuaW1hdGVPdXQodGhpcy4kZWxlbWVudCwgdGhpcy5hbmltYXRpb25PdXQsIGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5fdXBkYXRlQVJJQShmYWxzZSk7XG4gICAgICAgIHRoaXMudHJpZ2dlcignb2ZmLnpmLnRvZ2dsZXInKTtcbiAgICAgICAgdGhpcy5maW5kKCdbZGF0YS1tdXRhdGVdJykudHJpZ2dlcignbXV0YXRlbWUuemYudHJpZ2dlcicpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3VwZGF0ZUFSSUEoaXNPbikge1xuICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsIGlzT24gPyB0cnVlIDogZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBpbnN0YW5jZSBvZiBUb2dnbGVyIG9uIHRoZSBlbGVtZW50LlxuICAgKiBAZnVuY3Rpb25cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kZWxlbWVudC5vZmYoJy56Zi50b2dnbGVyJyk7XG4gICAgRm91bmRhdGlvbi51bnJlZ2lzdGVyUGx1Z2luKHRoaXMpO1xuICB9XG59XG5cblRvZ2dsZXIuZGVmYXVsdHMgPSB7XG4gIC8qKlxuICAgKiBUZWxscyB0aGUgcGx1Z2luIGlmIHRoZSBlbGVtZW50IHNob3VsZCBhbmltYXRlZCB3aGVuIHRvZ2dsZWQuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBhbmltYXRlOiBmYWxzZVxufTtcblxuLy8gV2luZG93IGV4cG9ydHNcbkZvdW5kYXRpb24ucGx1Z2luKFRvZ2dsZXIsICdUb2dnbGVyJyk7XG5cbn0oalF1ZXJ5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuLyoqXG4gKiBUb29sdGlwIG1vZHVsZS5cbiAqIEBtb2R1bGUgZm91bmRhdGlvbi50b29sdGlwXG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLmJveFxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5tZWRpYVF1ZXJ5XG4gKiBAcmVxdWlyZXMgZm91bmRhdGlvbi51dGlsLnRyaWdnZXJzXG4gKi9cblxuY2xhc3MgVG9vbHRpcCB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGEgVG9vbHRpcC5cbiAgICogQGNsYXNzXG4gICAqIEBmaXJlcyBUb29sdGlwI2luaXRcbiAgICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnQgLSBqUXVlcnkgb2JqZWN0IHRvIGF0dGFjaCBhIHRvb2x0aXAgdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gb2JqZWN0IHRvIGV4dGVuZCB0aGUgZGVmYXVsdCBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBUb29sdGlwLmRlZmF1bHRzLCB0aGlzLiRlbGVtZW50LmRhdGEoKSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5pc0NsaWNrID0gZmFsc2U7XG4gICAgdGhpcy5faW5pdCgpO1xuXG4gICAgRm91bmRhdGlvbi5yZWdpc3RlclBsdWdpbih0aGlzLCAnVG9vbHRpcCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSB0b29sdGlwIGJ5IHNldHRpbmcgdGhlIGNyZWF0aW5nIHRoZSB0aXAgZWxlbWVudCwgYWRkaW5nIGl0J3MgdGV4dCwgc2V0dGluZyBwcml2YXRlIHZhcmlhYmxlcyBhbmQgc2V0dGluZyBhdHRyaWJ1dGVzIG9uIHRoZSBhbmNob3IuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdCgpIHtcbiAgICB2YXIgZWxlbUlkID0gdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JykgfHwgRm91bmRhdGlvbi5HZXRZb0RpZ2l0cyg2LCAndG9vbHRpcCcpO1xuXG4gICAgdGhpcy5vcHRpb25zLnBvc2l0aW9uQ2xhc3MgPSB0aGlzLm9wdGlvbnMucG9zaXRpb25DbGFzcyB8fCB0aGlzLl9nZXRQb3NpdGlvbkNsYXNzKHRoaXMuJGVsZW1lbnQpO1xuICAgIHRoaXMub3B0aW9ucy50aXBUZXh0ID0gdGhpcy5vcHRpb25zLnRpcFRleHQgfHwgdGhpcy4kZWxlbWVudC5hdHRyKCd0aXRsZScpO1xuICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMudGVtcGxhdGUgPyAkKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSkgOiB0aGlzLl9idWlsZFRlbXBsYXRlKGVsZW1JZCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmFsbG93SHRtbCkge1xuICAgICAgdGhpcy50ZW1wbGF0ZS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgICAuaHRtbCh0aGlzLm9wdGlvbnMudGlwVGV4dClcbiAgICAgICAgLmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZW1wbGF0ZS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgICAudGV4dCh0aGlzLm9wdGlvbnMudGlwVGV4dClcbiAgICAgICAgLmhpZGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoe1xuICAgICAgJ3RpdGxlJzogJycsXG4gICAgICAnYXJpYS1kZXNjcmliZWRieSc6IGVsZW1JZCxcbiAgICAgICdkYXRhLXlldGktYm94JzogZWxlbUlkLFxuICAgICAgJ2RhdGEtdG9nZ2xlJzogZWxlbUlkLFxuICAgICAgJ2RhdGEtcmVzaXplJzogZWxlbUlkXG4gICAgfSkuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnRyaWdnZXJDbGFzcyk7XG5cbiAgICAvL2hlbHBlciB2YXJpYWJsZXMgdG8gdHJhY2sgbW92ZW1lbnQgb24gY29sbGlzaW9uc1xuICAgIHRoaXMudXNlZFBvc2l0aW9ucyA9IFtdO1xuICAgIHRoaXMuY291bnRlciA9IDQ7XG4gICAgdGhpcy5jbGFzc0NoYW5nZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2V2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYWJzIHRoZSBjdXJyZW50IHBvc2l0aW9uaW5nIGNsYXNzLCBpZiBwcmVzZW50LCBhbmQgcmV0dXJucyB0aGUgdmFsdWUgb3IgYW4gZW1wdHkgc3RyaW5nLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2dldFBvc2l0aW9uQ2xhc3MoZWxlbWVudCkge1xuICAgIGlmICghZWxlbWVudCkgeyByZXR1cm4gJyc7IH1cbiAgICAvLyB2YXIgcG9zaXRpb24gPSBlbGVtZW50LmF0dHIoJ2NsYXNzJykubWF0Y2goL3RvcHxsZWZ0fHJpZ2h0L2cpO1xuICAgIHZhciBwb3NpdGlvbiA9IGVsZW1lbnRbMF0uY2xhc3NOYW1lLm1hdGNoKC9cXGIodG9wfGxlZnR8cmlnaHQpXFxiL2cpO1xuICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uID8gcG9zaXRpb25bMF0gOiAnJztcbiAgICByZXR1cm4gcG9zaXRpb247XG4gIH07XG4gIC8qKlxuICAgKiBidWlsZHMgdGhlIHRvb2x0aXAgZWxlbWVudCwgYWRkcyBhdHRyaWJ1dGVzLCBhbmQgcmV0dXJucyB0aGUgdGVtcGxhdGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYnVpbGRUZW1wbGF0ZShpZCkge1xuICAgIHZhciB0ZW1wbGF0ZUNsYXNzZXMgPSAoYCR7dGhpcy5vcHRpb25zLnRvb2x0aXBDbGFzc30gJHt0aGlzLm9wdGlvbnMucG9zaXRpb25DbGFzc30gJHt0aGlzLm9wdGlvbnMudGVtcGxhdGVDbGFzc2VzfWApLnRyaW0oKTtcbiAgICB2YXIgJHRlbXBsYXRlID0gICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3ModGVtcGxhdGVDbGFzc2VzKS5hdHRyKHtcbiAgICAgICdyb2xlJzogJ3Rvb2x0aXAnLFxuICAgICAgJ2FyaWEtaGlkZGVuJzogdHJ1ZSxcbiAgICAgICdkYXRhLWlzLWFjdGl2ZSc6IGZhbHNlLFxuICAgICAgJ2RhdGEtaXMtZm9jdXMnOiBmYWxzZSxcbiAgICAgICdpZCc6IGlkXG4gICAgfSk7XG4gICAgcmV0dXJuICR0ZW1wbGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIGlmIGEgY29sbGlzaW9uIGV2ZW50IGlzIGRldGVjdGVkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcG9zaXRpb24gLSBwb3NpdGlvbmluZyBjbGFzcyB0byB0cnlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZXBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgdGhpcy51c2VkUG9zaXRpb25zLnB1c2gocG9zaXRpb24gPyBwb3NpdGlvbiA6ICdib3R0b20nKTtcblxuICAgIC8vZGVmYXVsdCwgdHJ5IHN3aXRjaGluZyB0byBvcHBvc2l0ZSBzaWRlXG4gICAgaWYgKCFwb3NpdGlvbiAmJiAodGhpcy51c2VkUG9zaXRpb25zLmluZGV4T2YoJ3RvcCcpIDwgMCkpIHtcbiAgICAgIHRoaXMudGVtcGxhdGUuYWRkQ2xhc3MoJ3RvcCcpO1xuICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPT09ICd0b3AnICYmICh0aGlzLnVzZWRQb3NpdGlvbnMuaW5kZXhPZignYm90dG9tJykgPCAwKSkge1xuICAgICAgdGhpcy50ZW1wbGF0ZS5yZW1vdmVDbGFzcyhwb3NpdGlvbik7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbiA9PT0gJ2xlZnQnICYmICh0aGlzLnVzZWRQb3NpdGlvbnMuaW5kZXhPZigncmlnaHQnKSA8IDApKSB7XG4gICAgICB0aGlzLnRlbXBsYXRlLnJlbW92ZUNsYXNzKHBvc2l0aW9uKVxuICAgICAgICAgIC5hZGRDbGFzcygncmlnaHQnKTtcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uID09PSAncmlnaHQnICYmICh0aGlzLnVzZWRQb3NpdGlvbnMuaW5kZXhPZignbGVmdCcpIDwgMCkpIHtcbiAgICAgIHRoaXMudGVtcGxhdGUucmVtb3ZlQ2xhc3MocG9zaXRpb24pXG4gICAgICAgICAgLmFkZENsYXNzKCdsZWZ0Jyk7XG4gICAgfVxuXG4gICAgLy9pZiBkZWZhdWx0IGNoYW5nZSBkaWRuJ3Qgd29yaywgdHJ5IGJvdHRvbSBvciBsZWZ0IGZpcnN0XG4gICAgZWxzZSBpZiAoIXBvc2l0aW9uICYmICh0aGlzLnVzZWRQb3NpdGlvbnMuaW5kZXhPZigndG9wJykgPiAtMSkgJiYgKHRoaXMudXNlZFBvc2l0aW9ucy5pbmRleE9mKCdsZWZ0JykgPCAwKSkge1xuICAgICAgdGhpcy50ZW1wbGF0ZS5hZGRDbGFzcygnbGVmdCcpO1xuICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPT09ICd0b3AnICYmICh0aGlzLnVzZWRQb3NpdGlvbnMuaW5kZXhPZignYm90dG9tJykgPiAtMSkgJiYgKHRoaXMudXNlZFBvc2l0aW9ucy5pbmRleE9mKCdsZWZ0JykgPCAwKSkge1xuICAgICAgdGhpcy50ZW1wbGF0ZS5yZW1vdmVDbGFzcyhwb3NpdGlvbilcbiAgICAgICAgICAuYWRkQ2xhc3MoJ2xlZnQnKTtcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uID09PSAnbGVmdCcgJiYgKHRoaXMudXNlZFBvc2l0aW9ucy5pbmRleE9mKCdyaWdodCcpID4gLTEpICYmICh0aGlzLnVzZWRQb3NpdGlvbnMuaW5kZXhPZignYm90dG9tJykgPCAwKSkge1xuICAgICAgdGhpcy50ZW1wbGF0ZS5yZW1vdmVDbGFzcyhwb3NpdGlvbik7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbiA9PT0gJ3JpZ2h0JyAmJiAodGhpcy51c2VkUG9zaXRpb25zLmluZGV4T2YoJ2xlZnQnKSA+IC0xKSAmJiAodGhpcy51c2VkUG9zaXRpb25zLmluZGV4T2YoJ2JvdHRvbScpIDwgMCkpIHtcbiAgICAgIHRoaXMudGVtcGxhdGUucmVtb3ZlQ2xhc3MocG9zaXRpb24pO1xuICAgIH1cbiAgICAvL2lmIG5vdGhpbmcgY2xlYXJlZCwgc2V0IHRvIGJvdHRvbVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy50ZW1wbGF0ZS5yZW1vdmVDbGFzcyhwb3NpdGlvbik7XG4gICAgfVxuICAgIHRoaXMuY2xhc3NDaGFuZ2VkID0gdHJ1ZTtcbiAgICB0aGlzLmNvdW50ZXItLTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXRzIHRoZSBwb3NpdGlvbiBjbGFzcyBvZiBhbiBlbGVtZW50IGFuZCByZWN1cnNpdmVseSBjYWxscyBpdHNlbGYgdW50aWwgdGhlcmUgYXJlIG5vIG1vcmUgcG9zc2libGUgcG9zaXRpb25zIHRvIGF0dGVtcHQsIG9yIHRoZSB0b29sdGlwIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGNvbGxpZGluZy5cbiAgICogaWYgdGhlIHRvb2x0aXAgaXMgbGFyZ2VyIHRoYW4gdGhlIHNjcmVlbiB3aWR0aCwgZGVmYXVsdCB0byBmdWxsIHdpZHRoIC0gYW55IHVzZXIgc2VsZWN0ZWQgbWFyZ2luXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2V0UG9zaXRpb24oKSB7XG4gICAgdmFyIHBvc2l0aW9uID0gdGhpcy5fZ2V0UG9zaXRpb25DbGFzcyh0aGlzLnRlbXBsYXRlKSxcbiAgICAgICAgJHRpcERpbXMgPSBGb3VuZGF0aW9uLkJveC5HZXREaW1lbnNpb25zKHRoaXMudGVtcGxhdGUpLFxuICAgICAgICAkYW5jaG9yRGltcyA9IEZvdW5kYXRpb24uQm94LkdldERpbWVuc2lvbnModGhpcy4kZWxlbWVudCksXG4gICAgICAgIGRpcmVjdGlvbiA9IChwb3NpdGlvbiA9PT0gJ2xlZnQnID8gJ2xlZnQnIDogKChwb3NpdGlvbiA9PT0gJ3JpZ2h0JykgPyAnbGVmdCcgOiAndG9wJykpLFxuICAgICAgICBwYXJhbSA9IChkaXJlY3Rpb24gPT09ICd0b3AnKSA/ICdoZWlnaHQnIDogJ3dpZHRoJyxcbiAgICAgICAgb2Zmc2V0ID0gKHBhcmFtID09PSAnaGVpZ2h0JykgPyB0aGlzLm9wdGlvbnMudk9mZnNldCA6IHRoaXMub3B0aW9ucy5oT2Zmc2V0LFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoKCR0aXBEaW1zLndpZHRoID49ICR0aXBEaW1zLndpbmRvd0RpbXMud2lkdGgpIHx8ICghdGhpcy5jb3VudGVyICYmICFGb3VuZGF0aW9uLkJveC5JbU5vdFRvdWNoaW5nWW91KHRoaXMudGVtcGxhdGUpKSkge1xuICAgICAgdGhpcy50ZW1wbGF0ZS5vZmZzZXQoRm91bmRhdGlvbi5Cb3guR2V0T2Zmc2V0cyh0aGlzLnRlbXBsYXRlLCB0aGlzLiRlbGVtZW50LCAnY2VudGVyIGJvdHRvbScsIHRoaXMub3B0aW9ucy52T2Zmc2V0LCB0aGlzLm9wdGlvbnMuaE9mZnNldCwgdHJ1ZSkpLmNzcyh7XG4gICAgICAvLyB0aGlzLiRlbGVtZW50Lm9mZnNldChGb3VuZGF0aW9uLkdldE9mZnNldHModGhpcy50ZW1wbGF0ZSwgdGhpcy4kZWxlbWVudCwgJ2NlbnRlciBib3R0b20nLCB0aGlzLm9wdGlvbnMudk9mZnNldCwgdGhpcy5vcHRpb25zLmhPZmZzZXQsIHRydWUpKS5jc3Moe1xuICAgICAgICAnd2lkdGgnOiAkYW5jaG9yRGltcy53aW5kb3dEaW1zLndpZHRoIC0gKHRoaXMub3B0aW9ucy5oT2Zmc2V0ICogMiksXG4gICAgICAgICdoZWlnaHQnOiAnYXV0bydcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMudGVtcGxhdGUub2Zmc2V0KEZvdW5kYXRpb24uQm94LkdldE9mZnNldHModGhpcy50ZW1wbGF0ZSwgdGhpcy4kZWxlbWVudCwnY2VudGVyICcgKyAocG9zaXRpb24gfHwgJ2JvdHRvbScpLCB0aGlzLm9wdGlvbnMudk9mZnNldCwgdGhpcy5vcHRpb25zLmhPZmZzZXQpKTtcblxuICAgIHdoaWxlKCFGb3VuZGF0aW9uLkJveC5JbU5vdFRvdWNoaW5nWW91KHRoaXMudGVtcGxhdGUpICYmIHRoaXMuY291bnRlcikge1xuICAgICAgdGhpcy5fcmVwb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiByZXZlYWxzIHRoZSB0b29sdGlwLCBhbmQgZmlyZXMgYW4gZXZlbnQgdG8gY2xvc2UgYW55IG90aGVyIG9wZW4gdG9vbHRpcHMgb24gdGhlIHBhZ2VcbiAgICogQGZpcmVzIFRvb2x0aXAjY2xvc2VtZVxuICAgKiBAZmlyZXMgVG9vbHRpcCNzaG93XG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgc2hvdygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dPbiAhPT0gJ2FsbCcgJiYgIUZvdW5kYXRpb24uTWVkaWFRdWVyeS5pcyh0aGlzLm9wdGlvbnMuc2hvd09uKSkge1xuICAgICAgLy8gY29uc29sZS5lcnJvcignVGhlIHNjcmVlbiBpcyB0b28gc21hbGwgdG8gZGlzcGxheSB0aGlzIHRvb2x0aXAnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHRoaXMudGVtcGxhdGUuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpLnNob3coKTtcbiAgICB0aGlzLl9zZXRQb3NpdGlvbigpO1xuXG4gICAgLyoqXG4gICAgICogRmlyZXMgdG8gY2xvc2UgYWxsIG90aGVyIG9wZW4gdG9vbHRpcHMgb24gdGhlIHBhZ2VcbiAgICAgKiBAZXZlbnQgQ2xvc2VtZSN0b29sdGlwXG4gICAgICovXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjbG9zZW1lLnpmLnRvb2x0aXAnLCB0aGlzLnRlbXBsYXRlLmF0dHIoJ2lkJykpO1xuXG5cbiAgICB0aGlzLnRlbXBsYXRlLmF0dHIoe1xuICAgICAgJ2RhdGEtaXMtYWN0aXZlJzogdHJ1ZSxcbiAgICAgICdhcmlhLWhpZGRlbic6IGZhbHNlXG4gICAgfSk7XG4gICAgX3RoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudGVtcGxhdGUpO1xuICAgIHRoaXMudGVtcGxhdGUuc3RvcCgpLmhpZGUoKS5jc3MoJ3Zpc2liaWxpdHknLCAnJykuZmFkZUluKHRoaXMub3B0aW9ucy5mYWRlSW5EdXJhdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAvL21heWJlIGRvIHN0dWZmP1xuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEZpcmVzIHdoZW4gdGhlIHRvb2x0aXAgaXMgc2hvd25cbiAgICAgKiBAZXZlbnQgVG9vbHRpcCNzaG93XG4gICAgICovXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdzaG93LnpmLnRvb2x0aXAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlcyB0aGUgY3VycmVudCB0b29sdGlwLCBhbmQgcmVzZXRzIHRoZSBwb3NpdGlvbmluZyBjbGFzcyBpZiBpdCB3YXMgY2hhbmdlZCBkdWUgdG8gY29sbGlzaW9uXG4gICAqIEBmaXJlcyBUb29sdGlwI2hpZGVcbiAgICogQGZ1bmN0aW9uXG4gICAqL1xuICBoaWRlKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdoaWRpbmcnLCB0aGlzLiRlbGVtZW50LmRhdGEoJ3lldGktYm94JykpO1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpcy50ZW1wbGF0ZS5zdG9wKCkuYXR0cih7XG4gICAgICAnYXJpYS1oaWRkZW4nOiB0cnVlLFxuICAgICAgJ2RhdGEtaXMtYWN0aXZlJzogZmFsc2VcbiAgICB9KS5mYWRlT3V0KHRoaXMub3B0aW9ucy5mYWRlT3V0RHVyYXRpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgX3RoaXMuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgIF90aGlzLmlzQ2xpY2sgPSBmYWxzZTtcbiAgICAgIGlmIChfdGhpcy5jbGFzc0NoYW5nZWQpIHtcbiAgICAgICAgX3RoaXMudGVtcGxhdGVcbiAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoX3RoaXMuX2dldFBvc2l0aW9uQ2xhc3MoX3RoaXMudGVtcGxhdGUpKVxuICAgICAgICAgICAgIC5hZGRDbGFzcyhfdGhpcy5vcHRpb25zLnBvc2l0aW9uQ2xhc3MpO1xuXG4gICAgICAgX3RoaXMudXNlZFBvc2l0aW9ucyA9IFtdO1xuICAgICAgIF90aGlzLmNvdW50ZXIgPSA0O1xuICAgICAgIF90aGlzLmNsYXNzQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIGZpcmVzIHdoZW4gdGhlIHRvb2x0aXAgaXMgaGlkZGVuXG4gICAgICogQGV2ZW50IFRvb2x0aXAjaGlkZVxuICAgICAqL1xuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignaGlkZS56Zi50b29sdGlwJyk7XG4gIH1cblxuICAvKipcbiAgICogYWRkcyBldmVudCBsaXN0ZW5lcnMgZm9yIHRoZSB0b29sdGlwIGFuZCBpdHMgYW5jaG9yXG4gICAqIFRPRE8gY29tYmluZSBzb21lIG9mIHRoZSBsaXN0ZW5lcnMgbGlrZSBmb2N1cyBhbmQgbW91c2VlbnRlciwgZXRjLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V2ZW50cygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHZhciAkdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgIHZhciBpc0ZvY3VzID0gZmFsc2U7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5kaXNhYmxlSG92ZXIpIHtcblxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgLm9uKCdtb3VzZWVudGVyLnpmLnRvb2x0aXAnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICghX3RoaXMuaXNBY3RpdmUpIHtcbiAgICAgICAgICBfdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF90aGlzLnNob3coKTtcbiAgICAgICAgICB9LCBfdGhpcy5vcHRpb25zLmhvdmVyRGVsYXkpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZWxlYXZlLnpmLnRvb2x0aXAnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChfdGhpcy50aW1lb3V0KTtcbiAgICAgICAgaWYgKCFpc0ZvY3VzIHx8IChfdGhpcy5pc0NsaWNrICYmICFfdGhpcy5vcHRpb25zLmNsaWNrT3BlbikpIHtcbiAgICAgICAgICBfdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xpY2tPcGVuKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdtb3VzZWRvd24uemYudG9vbHRpcCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYgKF90aGlzLmlzQ2xpY2spIHtcbiAgICAgICAgICAvL190aGlzLmhpZGUoKTtcbiAgICAgICAgICAvLyBfdGhpcy5pc0NsaWNrID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXMuaXNDbGljayA9IHRydWU7XG4gICAgICAgICAgaWYgKChfdGhpcy5vcHRpb25zLmRpc2FibGVIb3ZlciB8fCAhX3RoaXMuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnKSkgJiYgIV90aGlzLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICBfdGhpcy5zaG93KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZWxlbWVudC5vbignbW91c2Vkb3duLnpmLnRvb2x0aXAnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIF90aGlzLmlzQ2xpY2sgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuZGlzYWJsZUZvclRvdWNoKSB7XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAub24oJ3RhcC56Zi50b29sdGlwIHRvdWNoZW5kLnpmLnRvb2x0aXAnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIF90aGlzLmlzQWN0aXZlID8gX3RoaXMuaGlkZSgpIDogX3RoaXMuc2hvdygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC5vbih7XG4gICAgICAvLyAndG9nZ2xlLnpmLnRyaWdnZXInOiB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpLFxuICAgICAgLy8gJ2Nsb3NlLnpmLnRyaWdnZXInOiB0aGlzLmhpZGUuYmluZCh0aGlzKVxuICAgICAgJ2Nsb3NlLnpmLnRyaWdnZXInOiB0aGlzLmhpZGUuYmluZCh0aGlzKVxuICAgIH0pO1xuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLm9uKCdmb2N1cy56Zi50b29sdGlwJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpc0ZvY3VzID0gdHJ1ZTtcbiAgICAgICAgaWYgKF90aGlzLmlzQ2xpY2spIHtcbiAgICAgICAgICAvLyBJZiB3ZSdyZSBub3Qgc2hvd2luZyBvcGVuIG9uIGNsaWNrcywgd2UgbmVlZCB0byBwcmV0ZW5kIGEgY2xpY2stbGF1bmNoZWQgZm9jdXMgaXNuJ3RcbiAgICAgICAgICAvLyBhIHJlYWwgZm9jdXMsIG90aGVyd2lzZSBvbiBob3ZlciBhbmQgY29tZSBiYWNrIHdlIGdldCBiYWQgYmVoYXZpb3JcbiAgICAgICAgICBpZighX3RoaXMub3B0aW9ucy5jbGlja09wZW4pIHsgaXNGb2N1cyA9IGZhbHNlOyB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLm9uKCdmb2N1c291dC56Zi50b29sdGlwJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpc0ZvY3VzID0gZmFsc2U7XG4gICAgICAgIF90aGlzLmlzQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuaGlkZSgpO1xuICAgICAgfSlcblxuICAgICAgLm9uKCdyZXNpemVtZS56Zi50cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChfdGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgIF90aGlzLl9zZXRQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhZGRzIGEgdG9nZ2xlIG1ldGhvZCwgaW4gYWRkaXRpb24gdG8gdGhlIHN0YXRpYyBzaG93KCkgJiBoaWRlKCkgZnVuY3Rpb25zXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGFuIGluc3RhbmNlIG9mIHRvb2x0aXAsIHJlbW92ZXMgdGVtcGxhdGUgZWxlbWVudCBmcm9tIHRoZSB2aWV3LlxuICAgKiBAZnVuY3Rpb25cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kZWxlbWVudC5hdHRyKCd0aXRsZScsIHRoaXMudGVtcGxhdGUudGV4dCgpKVxuICAgICAgICAgICAgICAgICAub2ZmKCcuemYudHJpZ2dlciAuemYudG9vbHRpcCcpXG4gICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaGFzLXRpcCB0b3AgcmlnaHQgbGVmdCcpXG4gICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWRlc2NyaWJlZGJ5IGFyaWEtaGFzcG9wdXAgZGF0YS1kaXNhYmxlLWhvdmVyIGRhdGEtcmVzaXplIGRhdGEtdG9nZ2xlIGRhdGEtdG9vbHRpcCBkYXRhLXlldGktYm94Jyk7XG5cbiAgICB0aGlzLnRlbXBsYXRlLnJlbW92ZSgpO1xuXG4gICAgRm91bmRhdGlvbi51bnJlZ2lzdGVyUGx1Z2luKHRoaXMpO1xuICB9XG59XG5cblRvb2x0aXAuZGVmYXVsdHMgPSB7XG4gIGRpc2FibGVGb3JUb3VjaDogZmFsc2UsXG4gIC8qKlxuICAgKiBUaW1lLCBpbiBtcywgYmVmb3JlIGEgdG9vbHRpcCBzaG91bGQgb3BlbiBvbiBob3Zlci5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAyMDBcbiAgICovXG4gIGhvdmVyRGVsYXk6IDIwMCxcbiAgLyoqXG4gICAqIFRpbWUsIGluIG1zLCBhIHRvb2x0aXAgc2hvdWxkIHRha2UgdG8gZmFkZSBpbnRvIHZpZXcuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQGRlZmF1bHQgMTUwXG4gICAqL1xuICBmYWRlSW5EdXJhdGlvbjogMTUwLFxuICAvKipcbiAgICogVGltZSwgaW4gbXMsIGEgdG9vbHRpcCBzaG91bGQgdGFrZSB0byBmYWRlIG91dCBvZiB2aWV3LlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEBkZWZhdWx0IDE1MFxuICAgKi9cbiAgZmFkZU91dER1cmF0aW9uOiAxNTAsXG4gIC8qKlxuICAgKiBEaXNhYmxlcyBob3ZlciBldmVudHMgZnJvbSBvcGVuaW5nIHRoZSB0b29sdGlwIGlmIHNldCB0byB0cnVlXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBkaXNhYmxlSG92ZXI6IGZhbHNlLFxuICAvKipcbiAgICogT3B0aW9uYWwgYWRkdGlvbmFsIGNsYXNzZXMgdG8gYXBwbHkgdG8gdGhlIHRvb2x0aXAgdGVtcGxhdGUgb24gaW5pdC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnJ1xuICAgKi9cbiAgdGVtcGxhdGVDbGFzc2VzOiAnJyxcbiAgLyoqXG4gICAqIE5vbi1vcHRpb25hbCBjbGFzcyBhZGRlZCB0byB0b29sdGlwIHRlbXBsYXRlcy4gRm91bmRhdGlvbiBkZWZhdWx0IGlzICd0b29sdGlwJy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAndG9vbHRpcCdcbiAgICovXG4gIHRvb2x0aXBDbGFzczogJ3Rvb2x0aXAnLFxuICAvKipcbiAgICogQ2xhc3MgYXBwbGllZCB0byB0aGUgdG9vbHRpcCBhbmNob3IgZWxlbWVudC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnaGFzLXRpcCdcbiAgICovXG4gIHRyaWdnZXJDbGFzczogJ2hhcy10aXAnLFxuICAvKipcbiAgICogTWluaW11bSBicmVha3BvaW50IHNpemUgYXQgd2hpY2ggdG8gb3BlbiB0aGUgdG9vbHRpcC5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnc21hbGwnXG4gICAqL1xuICBzaG93T246ICdzbWFsbCcsXG4gIC8qKlxuICAgKiBDdXN0b20gdGVtcGxhdGUgdG8gYmUgdXNlZCB0byBnZW5lcmF0ZSBtYXJrdXAgZm9yIHRvb2x0aXAuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJydcbiAgICovXG4gIHRlbXBsYXRlOiAnJyxcbiAgLyoqXG4gICAqIFRleHQgZGlzcGxheWVkIGluIHRoZSB0b29sdGlwIHRlbXBsYXRlIG9uIG9wZW4uXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJydcbiAgICovXG4gIHRpcFRleHQ6ICcnLFxuICB0b3VjaENsb3NlVGV4dDogJ1RhcCB0byBjbG9zZS4nLFxuICAvKipcbiAgICogQWxsb3dzIHRoZSB0b29sdGlwIHRvIHJlbWFpbiBvcGVuIGlmIHRyaWdnZXJlZCB3aXRoIGEgY2xpY2sgb3IgdG91Y2ggZXZlbnQuXG4gICAqIEBvcHRpb25cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIGNsaWNrT3BlbjogdHJ1ZSxcbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgcG9zaXRpb25pbmcgY2xhc3Nlcywgc2V0IGJ5IHRoZSBKU1xuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICcnXG4gICAqL1xuICBwb3NpdGlvbkNsYXNzOiAnJyxcbiAgLyoqXG4gICAqIERpc3RhbmNlLCBpbiBwaXhlbHMsIHRoZSB0ZW1wbGF0ZSBzaG91bGQgcHVzaCBhd2F5IGZyb20gdGhlIGFuY2hvciBvbiB0aGUgWSBheGlzLlxuICAgKiBAb3B0aW9uXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEBkZWZhdWx0IDEwXG4gICAqL1xuICB2T2Zmc2V0OiAxMCxcbiAgLyoqXG4gICAqIERpc3RhbmNlLCBpbiBwaXhlbHMsIHRoZSB0ZW1wbGF0ZSBzaG91bGQgcHVzaCBhd2F5IGZyb20gdGhlIGFuY2hvciBvbiB0aGUgWCBheGlzLCBpZiBhbGlnbmVkIHRvIGEgc2lkZS5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAZGVmYXVsdCAxMlxuICAgKi9cbiAgaE9mZnNldDogMTIsXG4gICAgLyoqXG4gICAqIEFsbG93IEhUTUwgaW4gdG9vbHRpcC4gV2FybmluZzogSWYgeW91IGFyZSBsb2FkaW5nIHVzZXItZ2VuZXJhdGVkIGNvbnRlbnQgaW50byB0b29sdGlwcyxcbiAgICogYWxsb3dpbmcgSFRNTCBtYXkgb3BlbiB5b3Vyc2VsZiB1cCB0byBYU1MgYXR0YWNrcy5cbiAgICogQG9wdGlvblxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGFsbG93SHRtbDogZmFsc2Vcbn07XG5cbi8qKlxuICogVE9ETyB1dGlsaXplIHJlc2l6ZSBldmVudCB0cmlnZ2VyXG4gKi9cblxuLy8gV2luZG93IGV4cG9ydHNcbkZvdW5kYXRpb24ucGx1Z2luKFRvb2x0aXAsICdUb29sdGlwJyk7XG5cbn0oalF1ZXJ5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuRm91bmRhdGlvbi5Cb3ggPSB7XG4gIEltTm90VG91Y2hpbmdZb3U6IEltTm90VG91Y2hpbmdZb3UsXG4gIEdldERpbWVuc2lvbnM6IEdldERpbWVuc2lvbnMsXG4gIEdldE9mZnNldHM6IEdldE9mZnNldHNcbn1cblxuLyoqXG4gKiBDb21wYXJlcyB0aGUgZGltZW5zaW9ucyBvZiBhbiBlbGVtZW50IHRvIGEgY29udGFpbmVyIGFuZCBkZXRlcm1pbmVzIGNvbGxpc2lvbiBldmVudHMgd2l0aCBjb250YWluZXIuXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7alF1ZXJ5fSBlbGVtZW50IC0galF1ZXJ5IG9iamVjdCB0byB0ZXN0IGZvciBjb2xsaXNpb25zLlxuICogQHBhcmFtIHtqUXVlcnl9IHBhcmVudCAtIGpRdWVyeSBvYmplY3QgdG8gdXNlIGFzIGJvdW5kaW5nIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gbHJPbmx5IC0gc2V0IHRvIHRydWUgdG8gY2hlY2sgbGVmdCBhbmQgcmlnaHQgdmFsdWVzIG9ubHkuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRiT25seSAtIHNldCB0byB0cnVlIHRvIGNoZWNrIHRvcCBhbmQgYm90dG9tIHZhbHVlcyBvbmx5LlxuICogQGRlZmF1bHQgaWYgbm8gcGFyZW50IG9iamVjdCBwYXNzZWQsIGRldGVjdHMgY29sbGlzaW9ucyB3aXRoIGB3aW5kb3dgLlxuICogQHJldHVybnMge0Jvb2xlYW59IC0gdHJ1ZSBpZiBjb2xsaXNpb24gZnJlZSwgZmFsc2UgaWYgYSBjb2xsaXNpb24gaW4gYW55IGRpcmVjdGlvbi5cbiAqL1xuZnVuY3Rpb24gSW1Ob3RUb3VjaGluZ1lvdShlbGVtZW50LCBwYXJlbnQsIGxyT25seSwgdGJPbmx5KSB7XG4gIHZhciBlbGVEaW1zID0gR2V0RGltZW5zaW9ucyhlbGVtZW50KSxcbiAgICAgIHRvcCwgYm90dG9tLCBsZWZ0LCByaWdodDtcblxuICBpZiAocGFyZW50KSB7XG4gICAgdmFyIHBhckRpbXMgPSBHZXREaW1lbnNpb25zKHBhcmVudCk7XG5cbiAgICBib3R0b20gPSAoZWxlRGltcy5vZmZzZXQudG9wICsgZWxlRGltcy5oZWlnaHQgPD0gcGFyRGltcy5oZWlnaHQgKyBwYXJEaW1zLm9mZnNldC50b3ApO1xuICAgIHRvcCAgICA9IChlbGVEaW1zLm9mZnNldC50b3AgPj0gcGFyRGltcy5vZmZzZXQudG9wKTtcbiAgICBsZWZ0ICAgPSAoZWxlRGltcy5vZmZzZXQubGVmdCA+PSBwYXJEaW1zLm9mZnNldC5sZWZ0KTtcbiAgICByaWdodCAgPSAoZWxlRGltcy5vZmZzZXQubGVmdCArIGVsZURpbXMud2lkdGggPD0gcGFyRGltcy53aWR0aCArIHBhckRpbXMub2Zmc2V0LmxlZnQpO1xuICB9XG4gIGVsc2Uge1xuICAgIGJvdHRvbSA9IChlbGVEaW1zLm9mZnNldC50b3AgKyBlbGVEaW1zLmhlaWdodCA8PSBlbGVEaW1zLndpbmRvd0RpbXMuaGVpZ2h0ICsgZWxlRGltcy53aW5kb3dEaW1zLm9mZnNldC50b3ApO1xuICAgIHRvcCAgICA9IChlbGVEaW1zLm9mZnNldC50b3AgPj0gZWxlRGltcy53aW5kb3dEaW1zLm9mZnNldC50b3ApO1xuICAgIGxlZnQgICA9IChlbGVEaW1zLm9mZnNldC5sZWZ0ID49IGVsZURpbXMud2luZG93RGltcy5vZmZzZXQubGVmdCk7XG4gICAgcmlnaHQgID0gKGVsZURpbXMub2Zmc2V0LmxlZnQgKyBlbGVEaW1zLndpZHRoIDw9IGVsZURpbXMud2luZG93RGltcy53aWR0aCk7XG4gIH1cblxuICB2YXIgYWxsRGlycyA9IFtib3R0b20sIHRvcCwgbGVmdCwgcmlnaHRdO1xuXG4gIGlmIChsck9ubHkpIHtcbiAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQgPT09IHRydWU7XG4gIH1cblxuICBpZiAodGJPbmx5KSB7XG4gICAgcmV0dXJuIHRvcCA9PT0gYm90dG9tID09PSB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGFsbERpcnMuaW5kZXhPZihmYWxzZSkgPT09IC0xO1xufTtcblxuLyoqXG4gKiBVc2VzIG5hdGl2ZSBtZXRob2RzIHRvIHJldHVybiBhbiBvYmplY3Qgb2YgZGltZW5zaW9uIHZhbHVlcy5cbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtqUXVlcnkgfHwgSFRNTH0gZWxlbWVudCAtIGpRdWVyeSBvYmplY3Qgb3IgRE9NIGVsZW1lbnQgZm9yIHdoaWNoIHRvIGdldCB0aGUgZGltZW5zaW9ucy4gQ2FuIGJlIGFueSBlbGVtZW50IG90aGVyIHRoYXQgZG9jdW1lbnQgb3Igd2luZG93LlxuICogQHJldHVybnMge09iamVjdH0gLSBuZXN0ZWQgb2JqZWN0IG9mIGludGVnZXIgcGl4ZWwgdmFsdWVzXG4gKiBUT0RPIC0gaWYgZWxlbWVudCBpcyB3aW5kb3csIHJldHVybiBvbmx5IHRob3NlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gR2V0RGltZW5zaW9ucyhlbGVtLCB0ZXN0KXtcbiAgZWxlbSA9IGVsZW0ubGVuZ3RoID8gZWxlbVswXSA6IGVsZW07XG5cbiAgaWYgKGVsZW0gPT09IHdpbmRvdyB8fCBlbGVtID09PSBkb2N1bWVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkknbSBzb3JyeSwgRGF2ZS4gSSdtIGFmcmFpZCBJIGNhbid0IGRvIHRoYXQuXCIpO1xuICB9XG5cbiAgdmFyIHJlY3QgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgcGFyUmVjdCA9IGVsZW0ucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgIHdpblJlY3QgPSBkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgd2luWSA9IHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgIHdpblggPSB3aW5kb3cucGFnZVhPZmZzZXQ7XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgIG9mZnNldDoge1xuICAgICAgdG9wOiByZWN0LnRvcCArIHdpblksXG4gICAgICBsZWZ0OiByZWN0LmxlZnQgKyB3aW5YXG4gICAgfSxcbiAgICBwYXJlbnREaW1zOiB7XG4gICAgICB3aWR0aDogcGFyUmVjdC53aWR0aCxcbiAgICAgIGhlaWdodDogcGFyUmVjdC5oZWlnaHQsXG4gICAgICBvZmZzZXQ6IHtcbiAgICAgICAgdG9wOiBwYXJSZWN0LnRvcCArIHdpblksXG4gICAgICAgIGxlZnQ6IHBhclJlY3QubGVmdCArIHdpblhcbiAgICAgIH1cbiAgICB9LFxuICAgIHdpbmRvd0RpbXM6IHtcbiAgICAgIHdpZHRoOiB3aW5SZWN0LndpZHRoLFxuICAgICAgaGVpZ2h0OiB3aW5SZWN0LmhlaWdodCxcbiAgICAgIG9mZnNldDoge1xuICAgICAgICB0b3A6IHdpblksXG4gICAgICAgIGxlZnQ6IHdpblhcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCBvZiB0b3AgYW5kIGxlZnQgaW50ZWdlciBwaXhlbCB2YWx1ZXMgZm9yIGR5bmFtaWNhbGx5IHJlbmRlcmVkIGVsZW1lbnRzLFxuICogc3VjaCBhczogVG9vbHRpcCwgUmV2ZWFsLCBhbmQgRHJvcGRvd25cbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnQgLSBqUXVlcnkgb2JqZWN0IGZvciB0aGUgZWxlbWVudCBiZWluZyBwb3NpdGlvbmVkLlxuICogQHBhcmFtIHtqUXVlcnl9IGFuY2hvciAtIGpRdWVyeSBvYmplY3QgZm9yIHRoZSBlbGVtZW50J3MgYW5jaG9yIHBvaW50LlxuICogQHBhcmFtIHtTdHJpbmd9IHBvc2l0aW9uIC0gYSBzdHJpbmcgcmVsYXRpbmcgdG8gdGhlIGRlc2lyZWQgcG9zaXRpb24gb2YgdGhlIGVsZW1lbnQsIHJlbGF0aXZlIHRvIGl0J3MgYW5jaG9yXG4gKiBAcGFyYW0ge051bWJlcn0gdk9mZnNldCAtIGludGVnZXIgcGl4ZWwgdmFsdWUgb2YgZGVzaXJlZCB2ZXJ0aWNhbCBzZXBhcmF0aW9uIGJldHdlZW4gYW5jaG9yIGFuZCBlbGVtZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IGhPZmZzZXQgLSBpbnRlZ2VyIHBpeGVsIHZhbHVlIG9mIGRlc2lyZWQgaG9yaXpvbnRhbCBzZXBhcmF0aW9uIGJldHdlZW4gYW5jaG9yIGFuZCBlbGVtZW50LlxuICogQHBhcmFtIHtCb29sZWFufSBpc092ZXJmbG93IC0gaWYgYSBjb2xsaXNpb24gZXZlbnQgaXMgZGV0ZWN0ZWQsIHNldHMgdG8gdHJ1ZSB0byBkZWZhdWx0IHRoZSBlbGVtZW50IHRvIGZ1bGwgd2lkdGggLSBhbnkgZGVzaXJlZCBvZmZzZXQuXG4gKiBUT0RPIGFsdGVyL3Jld3JpdGUgdG8gd29yayB3aXRoIGBlbWAgdmFsdWVzIGFzIHdlbGwvaW5zdGVhZCBvZiBwaXhlbHNcbiAqL1xuZnVuY3Rpb24gR2V0T2Zmc2V0cyhlbGVtZW50LCBhbmNob3IsIHBvc2l0aW9uLCB2T2Zmc2V0LCBoT2Zmc2V0LCBpc092ZXJmbG93KSB7XG4gIHZhciAkZWxlRGltcyA9IEdldERpbWVuc2lvbnMoZWxlbWVudCksXG4gICAgICAkYW5jaG9yRGltcyA9IGFuY2hvciA/IEdldERpbWVuc2lvbnMoYW5jaG9yKSA6IG51bGw7XG5cbiAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgIGNhc2UgJ3RvcCc6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsZWZ0OiAoRm91bmRhdGlvbi5ydGwoKSA/ICRhbmNob3JEaW1zLm9mZnNldC5sZWZ0IC0gJGVsZURpbXMud2lkdGggKyAkYW5jaG9yRGltcy53aWR0aCA6ICRhbmNob3JEaW1zLm9mZnNldC5sZWZ0KSxcbiAgICAgICAgdG9wOiAkYW5jaG9yRGltcy5vZmZzZXQudG9wIC0gKCRlbGVEaW1zLmhlaWdodCArIHZPZmZzZXQpXG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6ICRhbmNob3JEaW1zLm9mZnNldC5sZWZ0IC0gKCRlbGVEaW1zLndpZHRoICsgaE9mZnNldCksXG4gICAgICAgIHRvcDogJGFuY2hvckRpbXMub2Zmc2V0LnRvcFxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmlnaHQnOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGVmdDogJGFuY2hvckRpbXMub2Zmc2V0LmxlZnQgKyAkYW5jaG9yRGltcy53aWR0aCArIGhPZmZzZXQsXG4gICAgICAgIHRvcDogJGFuY2hvckRpbXMub2Zmc2V0LnRvcFxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY2VudGVyIHRvcCc6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsZWZ0OiAoJGFuY2hvckRpbXMub2Zmc2V0LmxlZnQgKyAoJGFuY2hvckRpbXMud2lkdGggLyAyKSkgLSAoJGVsZURpbXMud2lkdGggLyAyKSxcbiAgICAgICAgdG9wOiAkYW5jaG9yRGltcy5vZmZzZXQudG9wIC0gKCRlbGVEaW1zLmhlaWdodCArIHZPZmZzZXQpXG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjZW50ZXIgYm90dG9tJzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6IGlzT3ZlcmZsb3cgPyBoT2Zmc2V0IDogKCgkYW5jaG9yRGltcy5vZmZzZXQubGVmdCArICgkYW5jaG9yRGltcy53aWR0aCAvIDIpKSAtICgkZWxlRGltcy53aWR0aCAvIDIpKSxcbiAgICAgICAgdG9wOiAkYW5jaG9yRGltcy5vZmZzZXQudG9wICsgJGFuY2hvckRpbXMuaGVpZ2h0ICsgdk9mZnNldFxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY2VudGVyIGxlZnQnOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGVmdDogJGFuY2hvckRpbXMub2Zmc2V0LmxlZnQgLSAoJGVsZURpbXMud2lkdGggKyBoT2Zmc2V0KSxcbiAgICAgICAgdG9wOiAoJGFuY2hvckRpbXMub2Zmc2V0LnRvcCArICgkYW5jaG9yRGltcy5oZWlnaHQgLyAyKSkgLSAoJGVsZURpbXMuaGVpZ2h0IC8gMilcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NlbnRlciByaWdodCc6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsZWZ0OiAkYW5jaG9yRGltcy5vZmZzZXQubGVmdCArICRhbmNob3JEaW1zLndpZHRoICsgaE9mZnNldCArIDEsXG4gICAgICAgIHRvcDogKCRhbmNob3JEaW1zLm9mZnNldC50b3AgKyAoJGFuY2hvckRpbXMuaGVpZ2h0IC8gMikpIC0gKCRlbGVEaW1zLmhlaWdodCAvIDIpXG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdjZW50ZXInOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGVmdDogKCRlbGVEaW1zLndpbmRvd0RpbXMub2Zmc2V0LmxlZnQgKyAoJGVsZURpbXMud2luZG93RGltcy53aWR0aCAvIDIpKSAtICgkZWxlRGltcy53aWR0aCAvIDIpLFxuICAgICAgICB0b3A6ICgkZWxlRGltcy53aW5kb3dEaW1zLm9mZnNldC50b3AgKyAoJGVsZURpbXMud2luZG93RGltcy5oZWlnaHQgLyAyKSkgLSAoJGVsZURpbXMuaGVpZ2h0IC8gMilcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JldmVhbCc6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsZWZ0OiAoJGVsZURpbXMud2luZG93RGltcy53aWR0aCAtICRlbGVEaW1zLndpZHRoKSAvIDIsXG4gICAgICAgIHRvcDogJGVsZURpbXMud2luZG93RGltcy5vZmZzZXQudG9wICsgdk9mZnNldFxuICAgICAgfVxuICAgIGNhc2UgJ3JldmVhbCBmdWxsJzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6ICRlbGVEaW1zLndpbmRvd0RpbXMub2Zmc2V0LmxlZnQsXG4gICAgICAgIHRvcDogJGVsZURpbXMud2luZG93RGltcy5vZmZzZXQudG9wXG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdsZWZ0IGJvdHRvbSc6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsZWZ0OiAkYW5jaG9yRGltcy5vZmZzZXQubGVmdCxcbiAgICAgICAgdG9wOiAkYW5jaG9yRGltcy5vZmZzZXQudG9wICsgJGFuY2hvckRpbXMuaGVpZ2h0ICsgdk9mZnNldFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JpZ2h0IGJvdHRvbSc6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsZWZ0OiAkYW5jaG9yRGltcy5vZmZzZXQubGVmdCArICRhbmNob3JEaW1zLndpZHRoICsgaE9mZnNldCAtICRlbGVEaW1zLndpZHRoLFxuICAgICAgICB0b3A6ICRhbmNob3JEaW1zLm9mZnNldC50b3AgKyAkYW5jaG9yRGltcy5oZWlnaHQgKyB2T2Zmc2V0XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6IChGb3VuZGF0aW9uLnJ0bCgpID8gJGFuY2hvckRpbXMub2Zmc2V0LmxlZnQgLSAkZWxlRGltcy53aWR0aCArICRhbmNob3JEaW1zLndpZHRoIDogJGFuY2hvckRpbXMub2Zmc2V0LmxlZnQgKyBoT2Zmc2V0KSxcbiAgICAgICAgdG9wOiAkYW5jaG9yRGltcy5vZmZzZXQudG9wICsgJGFuY2hvckRpbXMuaGVpZ2h0ICsgdk9mZnNldFxuICAgICAgfVxuICB9XG59XG5cbn0oalF1ZXJ5KTtcbiIsIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICogVGhpcyB1dGlsIHdhcyBjcmVhdGVkIGJ5IE1hcml1cyBPbGJlcnR6ICpcbiAqIFBsZWFzZSB0aGFuayBNYXJpdXMgb24gR2l0SHViIC9vd2xiZXJ0eiAqXG4gKiBvciB0aGUgd2ViIGh0dHA6Ly93d3cubWFyaXVzb2xiZXJ0ei5kZS8gKlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuY29uc3Qga2V5Q29kZXMgPSB7XG4gIDk6ICdUQUInLFxuICAxMzogJ0VOVEVSJyxcbiAgMjc6ICdFU0NBUEUnLFxuICAzMjogJ1NQQUNFJyxcbiAgMzc6ICdBUlJPV19MRUZUJyxcbiAgMzg6ICdBUlJPV19VUCcsXG4gIDM5OiAnQVJST1dfUklHSFQnLFxuICA0MDogJ0FSUk9XX0RPV04nXG59XG5cbnZhciBjb21tYW5kcyA9IHt9XG5cbnZhciBLZXlib2FyZCA9IHtcbiAga2V5czogZ2V0S2V5Q29kZXMoa2V5Q29kZXMpLFxuXG4gIC8qKlxuICAgKiBQYXJzZXMgdGhlIChrZXlib2FyZCkgZXZlbnQgYW5kIHJldHVybnMgYSBTdHJpbmcgdGhhdCByZXByZXNlbnRzIGl0cyBrZXlcbiAgICogQ2FuIGJlIHVzZWQgbGlrZSBGb3VuZGF0aW9uLnBhcnNlS2V5KGV2ZW50KSA9PT0gRm91bmRhdGlvbi5rZXlzLlNQQUNFXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gdGhlIGV2ZW50IGdlbmVyYXRlZCBieSB0aGUgZXZlbnQgaGFuZGxlclxuICAgKiBAcmV0dXJuIFN0cmluZyBrZXkgLSBTdHJpbmcgdGhhdCByZXByZXNlbnRzIHRoZSBrZXkgcHJlc3NlZFxuICAgKi9cbiAgcGFyc2VLZXkoZXZlbnQpIHtcbiAgICB2YXIga2V5ID0ga2V5Q29kZXNbZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZV0gfHwgU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC53aGljaCkudG9VcHBlckNhc2UoKTtcblxuICAgIC8vIFJlbW92ZSB1bi1wcmludGFibGUgY2hhcmFjdGVycywgZS5nLiBmb3IgYGZyb21DaGFyQ29kZWAgY2FsbHMgZm9yIENUUkwgb25seSBldmVudHNcbiAgICBrZXkgPSBrZXkucmVwbGFjZSgvXFxXKy8sICcnKTtcblxuICAgIGlmIChldmVudC5zaGlmdEtleSkga2V5ID0gYFNISUZUXyR7a2V5fWA7XG4gICAgaWYgKGV2ZW50LmN0cmxLZXkpIGtleSA9IGBDVFJMXyR7a2V5fWA7XG4gICAgaWYgKGV2ZW50LmFsdEtleSkga2V5ID0gYEFMVF8ke2tleX1gO1xuXG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHVuZGVyc2NvcmUsIGluIGNhc2Ugb25seSBtb2RpZmllcnMgd2VyZSB1c2VkIChlLmcuIG9ubHkgYENUUkxfQUxUYClcbiAgICBrZXkgPSBrZXkucmVwbGFjZSgvXyQvLCAnJyk7XG5cbiAgICByZXR1cm4ga2V5O1xuICB9LFxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSBnaXZlbiAoa2V5Ym9hcmQpIGV2ZW50XG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gdGhlIGV2ZW50IGdlbmVyYXRlZCBieSB0aGUgZXZlbnQgaGFuZGxlclxuICAgKiBAcGFyYW0ge1N0cmluZ30gY29tcG9uZW50IC0gRm91bmRhdGlvbiBjb21wb25lbnQncyBuYW1lLCBlLmcuIFNsaWRlciBvciBSZXZlYWxcbiAgICogQHBhcmFtIHtPYmplY3RzfSBmdW5jdGlvbnMgLSBjb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB0aGF0IGFyZSB0byBiZSBleGVjdXRlZFxuICAgKi9cbiAgaGFuZGxlS2V5KGV2ZW50LCBjb21wb25lbnQsIGZ1bmN0aW9ucykge1xuICAgIHZhciBjb21tYW5kTGlzdCA9IGNvbW1hbmRzW2NvbXBvbmVudF0sXG4gICAgICBrZXlDb2RlID0gdGhpcy5wYXJzZUtleShldmVudCksXG4gICAgICBjbWRzLFxuICAgICAgY29tbWFuZCxcbiAgICAgIGZuO1xuXG4gICAgaWYgKCFjb21tYW5kTGlzdCkgcmV0dXJuIGNvbnNvbGUud2FybignQ29tcG9uZW50IG5vdCBkZWZpbmVkIScpO1xuXG4gICAgaWYgKHR5cGVvZiBjb21tYW5kTGlzdC5sdHIgPT09ICd1bmRlZmluZWQnKSB7IC8vIHRoaXMgY29tcG9uZW50IGRvZXMgbm90IGRpZmZlcmVudGlhdGUgYmV0d2VlbiBsdHIgYW5kIHJ0bFxuICAgICAgICBjbWRzID0gY29tbWFuZExpc3Q7IC8vIHVzZSBwbGFpbiBsaXN0XG4gICAgfSBlbHNlIHsgLy8gbWVyZ2UgbHRyIGFuZCBydGw6IGlmIGRvY3VtZW50IGlzIHJ0bCwgcnRsIG92ZXJ3cml0ZXMgbHRyIGFuZCB2aWNlIHZlcnNhXG4gICAgICAgIGlmIChGb3VuZGF0aW9uLnJ0bCgpKSBjbWRzID0gJC5leHRlbmQoe30sIGNvbW1hbmRMaXN0Lmx0ciwgY29tbWFuZExpc3QucnRsKTtcblxuICAgICAgICBlbHNlIGNtZHMgPSAkLmV4dGVuZCh7fSwgY29tbWFuZExpc3QucnRsLCBjb21tYW5kTGlzdC5sdHIpO1xuICAgIH1cbiAgICBjb21tYW5kID0gY21kc1trZXlDb2RlXTtcblxuICAgIGZuID0gZnVuY3Rpb25zW2NvbW1hbmRdO1xuICAgIGlmIChmbiAmJiB0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHsgLy8gZXhlY3V0ZSBmdW5jdGlvbiAgaWYgZXhpc3RzXG4gICAgICB2YXIgcmV0dXJuVmFsdWUgPSBmbi5hcHBseSgpO1xuICAgICAgaWYgKGZ1bmN0aW9ucy5oYW5kbGVkIHx8IHR5cGVvZiBmdW5jdGlvbnMuaGFuZGxlZCA9PT0gJ2Z1bmN0aW9uJykgeyAvLyBleGVjdXRlIGZ1bmN0aW9uIHdoZW4gZXZlbnQgd2FzIGhhbmRsZWRcbiAgICAgICAgICBmdW5jdGlvbnMuaGFuZGxlZChyZXR1cm5WYWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmdW5jdGlvbnMudW5oYW5kbGVkIHx8IHR5cGVvZiBmdW5jdGlvbnMudW5oYW5kbGVkID09PSAnZnVuY3Rpb24nKSB7IC8vIGV4ZWN1dGUgZnVuY3Rpb24gd2hlbiBldmVudCB3YXMgbm90IGhhbmRsZWRcbiAgICAgICAgICBmdW5jdGlvbnMudW5oYW5kbGVkKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbGwgZm9jdXNhYmxlIGVsZW1lbnRzIHdpdGhpbiB0aGUgZ2l2ZW4gYCRlbGVtZW50YFxuICAgKiBAcGFyYW0ge2pRdWVyeX0gJGVsZW1lbnQgLSBqUXVlcnkgb2JqZWN0IHRvIHNlYXJjaCB3aXRoaW5cbiAgICogQHJldHVybiB7alF1ZXJ5fSAkZm9jdXNhYmxlIC0gYWxsIGZvY3VzYWJsZSBlbGVtZW50cyB3aXRoaW4gYCRlbGVtZW50YFxuICAgKi9cbiAgZmluZEZvY3VzYWJsZSgkZWxlbWVudCkge1xuICAgIGlmKCEkZWxlbWVudCkge3JldHVybiBmYWxzZTsgfVxuICAgIHJldHVybiAkZWxlbWVudC5maW5kKCdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCAqW3RhYmluZGV4XSwgKltjb250ZW50ZWRpdGFibGVdJykuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCEkKHRoaXMpLmlzKCc6dmlzaWJsZScpIHx8ICQodGhpcykuYXR0cigndGFiaW5kZXgnKSA8IDApIHsgcmV0dXJuIGZhbHNlOyB9IC8vb25seSBoYXZlIHZpc2libGUgZWxlbWVudHMgYW5kIHRob3NlIHRoYXQgaGF2ZSBhIHRhYmluZGV4IGdyZWF0ZXIgb3IgZXF1YWwgMFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNvbXBvbmVudCBuYW1lIG5hbWVcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbXBvbmVudCAtIEZvdW5kYXRpb24gY29tcG9uZW50LCBlLmcuIFNsaWRlciBvciBSZXZlYWxcbiAgICogQHJldHVybiBTdHJpbmcgY29tcG9uZW50TmFtZVxuICAgKi9cblxuICByZWdpc3Rlcihjb21wb25lbnROYW1lLCBjbWRzKSB7XG4gICAgY29tbWFuZHNbY29tcG9uZW50TmFtZV0gPSBjbWRzO1xuICB9LCAgXG5cbiAgLyoqXG4gICAqIFRyYXBzIHRoZSBmb2N1cyBpbiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICogQHBhcmFtICB7alF1ZXJ5fSAkZWxlbWVudCAgalF1ZXJ5IG9iamVjdCB0byB0cmFwIHRoZSBmb3VjcyBpbnRvLlxuICAgKi9cbiAgdHJhcEZvY3VzKCRlbGVtZW50KSB7XG4gICAgdmFyICRmb2N1c2FibGUgPSBGb3VuZGF0aW9uLktleWJvYXJkLmZpbmRGb2N1c2FibGUoJGVsZW1lbnQpLFxuICAgICAgICAkZmlyc3RGb2N1c2FibGUgPSAkZm9jdXNhYmxlLmVxKDApLFxuICAgICAgICAkbGFzdEZvY3VzYWJsZSA9ICRmb2N1c2FibGUuZXEoLTEpO1xuXG4gICAgJGVsZW1lbnQub24oJ2tleWRvd24uemYudHJhcGZvY3VzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50YXJnZXQgPT09ICRsYXN0Rm9jdXNhYmxlWzBdICYmIEZvdW5kYXRpb24uS2V5Ym9hcmQucGFyc2VLZXkoZXZlbnQpID09PSAnVEFCJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkZmlyc3RGb2N1c2FibGUuZm9jdXMoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gJGZpcnN0Rm9jdXNhYmxlWzBdICYmIEZvdW5kYXRpb24uS2V5Ym9hcmQucGFyc2VLZXkoZXZlbnQpID09PSAnU0hJRlRfVEFCJykge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkbGFzdEZvY3VzYWJsZS5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAvKipcbiAgICogUmVsZWFzZXMgdGhlIHRyYXBwZWQgZm9jdXMgZnJvbSB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICogQHBhcmFtICB7alF1ZXJ5fSAkZWxlbWVudCAgalF1ZXJ5IG9iamVjdCB0byByZWxlYXNlIHRoZSBmb2N1cyBmb3IuXG4gICAqL1xuICByZWxlYXNlRm9jdXMoJGVsZW1lbnQpIHtcbiAgICAkZWxlbWVudC5vZmYoJ2tleWRvd24uemYudHJhcGZvY3VzJyk7XG4gIH1cbn1cblxuLypcbiAqIENvbnN0YW50cyBmb3IgZWFzaWVyIGNvbXBhcmluZy5cbiAqIENhbiBiZSB1c2VkIGxpa2UgRm91bmRhdGlvbi5wYXJzZUtleShldmVudCkgPT09IEZvdW5kYXRpb24ua2V5cy5TUEFDRVxuICovXG5mdW5jdGlvbiBnZXRLZXlDb2RlcyhrY3MpIHtcbiAgdmFyIGsgPSB7fTtcbiAgZm9yICh2YXIga2MgaW4ga2NzKSBrW2tjc1trY11dID0ga2NzW2tjXTtcbiAgcmV0dXJuIGs7XG59XG5cbkZvdW5kYXRpb24uS2V5Ym9hcmQgPSBLZXlib2FyZDtcblxufShqUXVlcnkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4hZnVuY3Rpb24oJCkge1xuXG4vKipcbiAqIE1vdGlvbiBtb2R1bGUuXG4gKiBAbW9kdWxlIGZvdW5kYXRpb24ubW90aW9uXG4gKi9cblxuY29uc3QgaW5pdENsYXNzZXMgICA9IFsnbXVpLWVudGVyJywgJ211aS1sZWF2ZSddO1xuY29uc3QgYWN0aXZlQ2xhc3NlcyA9IFsnbXVpLWVudGVyLWFjdGl2ZScsICdtdWktbGVhdmUtYWN0aXZlJ107XG5cbmNvbnN0IE1vdGlvbiA9IHtcbiAgYW5pbWF0ZUluOiBmdW5jdGlvbihlbGVtZW50LCBhbmltYXRpb24sIGNiKSB7XG4gICAgYW5pbWF0ZSh0cnVlLCBlbGVtZW50LCBhbmltYXRpb24sIGNiKTtcbiAgfSxcblxuICBhbmltYXRlT3V0OiBmdW5jdGlvbihlbGVtZW50LCBhbmltYXRpb24sIGNiKSB7XG4gICAgYW5pbWF0ZShmYWxzZSwgZWxlbWVudCwgYW5pbWF0aW9uLCBjYik7XG4gIH1cbn1cblxuZnVuY3Rpb24gTW92ZShkdXJhdGlvbiwgZWxlbSwgZm4pe1xuICB2YXIgYW5pbSwgcHJvZywgc3RhcnQgPSBudWxsO1xuICAvLyBjb25zb2xlLmxvZygnY2FsbGVkJyk7XG5cbiAgaWYgKGR1cmF0aW9uID09PSAwKSB7XG4gICAgZm4uYXBwbHkoZWxlbSk7XG4gICAgZWxlbS50cmlnZ2VyKCdmaW5pc2hlZC56Zi5hbmltYXRlJywgW2VsZW1dKS50cmlnZ2VySGFuZGxlcignZmluaXNoZWQuemYuYW5pbWF0ZScsIFtlbGVtXSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gbW92ZSh0cyl7XG4gICAgaWYoIXN0YXJ0KSBzdGFydCA9IHRzO1xuICAgIC8vIGNvbnNvbGUubG9nKHN0YXJ0LCB0cyk7XG4gICAgcHJvZyA9IHRzIC0gc3RhcnQ7XG4gICAgZm4uYXBwbHkoZWxlbSk7XG5cbiAgICBpZihwcm9nIDwgZHVyYXRpb24peyBhbmltID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShtb3ZlLCBlbGVtKTsgfVxuICAgIGVsc2V7XG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbSk7XG4gICAgICBlbGVtLnRyaWdnZXIoJ2ZpbmlzaGVkLnpmLmFuaW1hdGUnLCBbZWxlbV0pLnRyaWdnZXJIYW5kbGVyKCdmaW5pc2hlZC56Zi5hbmltYXRlJywgW2VsZW1dKTtcbiAgICB9XG4gIH1cbiAgYW5pbSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobW92ZSk7XG59XG5cbi8qKlxuICogQW5pbWF0ZXMgYW4gZWxlbWVudCBpbiBvciBvdXQgdXNpbmcgYSBDU1MgdHJhbnNpdGlvbiBjbGFzcy5cbiAqIEBmdW5jdGlvblxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNJbiAtIERlZmluZXMgaWYgdGhlIGFuaW1hdGlvbiBpcyBpbiBvciBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCAtIGpRdWVyeSBvciBIVE1MIG9iamVjdCB0byBhbmltYXRlLlxuICogQHBhcmFtIHtTdHJpbmd9IGFuaW1hdGlvbiAtIENTUyBjbGFzcyB0byB1c2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiAtIENhbGxiYWNrIHRvIHJ1biB3aGVuIGFuaW1hdGlvbiBpcyBmaW5pc2hlZC5cbiAqL1xuZnVuY3Rpb24gYW5pbWF0ZShpc0luLCBlbGVtZW50LCBhbmltYXRpb24sIGNiKSB7XG4gIGVsZW1lbnQgPSAkKGVsZW1lbnQpLmVxKDApO1xuXG4gIGlmICghZWxlbWVudC5sZW5ndGgpIHJldHVybjtcblxuICB2YXIgaW5pdENsYXNzID0gaXNJbiA/IGluaXRDbGFzc2VzWzBdIDogaW5pdENsYXNzZXNbMV07XG4gIHZhciBhY3RpdmVDbGFzcyA9IGlzSW4gPyBhY3RpdmVDbGFzc2VzWzBdIDogYWN0aXZlQ2xhc3Nlc1sxXTtcblxuICAvLyBTZXQgdXAgdGhlIGFuaW1hdGlvblxuICByZXNldCgpO1xuXG4gIGVsZW1lbnRcbiAgICAuYWRkQ2xhc3MoYW5pbWF0aW9uKVxuICAgIC5jc3MoJ3RyYW5zaXRpb24nLCAnbm9uZScpO1xuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgZWxlbWVudC5hZGRDbGFzcyhpbml0Q2xhc3MpO1xuICAgIGlmIChpc0luKSBlbGVtZW50LnNob3coKTtcbiAgfSk7XG5cbiAgLy8gU3RhcnQgdGhlIGFuaW1hdGlvblxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGg7XG4gICAgZWxlbWVudFxuICAgICAgLmNzcygndHJhbnNpdGlvbicsICcnKVxuICAgICAgLmFkZENsYXNzKGFjdGl2ZUNsYXNzKTtcbiAgfSk7XG5cbiAgLy8gQ2xlYW4gdXAgdGhlIGFuaW1hdGlvbiB3aGVuIGl0IGZpbmlzaGVzXG4gIGVsZW1lbnQub25lKEZvdW5kYXRpb24udHJhbnNpdGlvbmVuZChlbGVtZW50KSwgZmluaXNoKTtcblxuICAvLyBIaWRlcyB0aGUgZWxlbWVudCAoZm9yIG91dCBhbmltYXRpb25zKSwgcmVzZXRzIHRoZSBlbGVtZW50LCBhbmQgcnVucyBhIGNhbGxiYWNrXG4gIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICBpZiAoIWlzSW4pIGVsZW1lbnQuaGlkZSgpO1xuICAgIHJlc2V0KCk7XG4gICAgaWYgKGNiKSBjYi5hcHBseShlbGVtZW50KTtcbiAgfVxuXG4gIC8vIFJlc2V0cyB0cmFuc2l0aW9ucyBhbmQgcmVtb3ZlcyBtb3Rpb24tc3BlY2lmaWMgY2xhc3Nlc1xuICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICBlbGVtZW50WzBdLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IDA7XG4gICAgZWxlbWVudC5yZW1vdmVDbGFzcyhgJHtpbml0Q2xhc3N9ICR7YWN0aXZlQ2xhc3N9ICR7YW5pbWF0aW9ufWApO1xuICB9XG59XG5cbkZvdW5kYXRpb24uTW92ZSA9IE1vdmU7XG5Gb3VuZGF0aW9uLk1vdGlvbiA9IE1vdGlvbjtcblxufShqUXVlcnkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4hZnVuY3Rpb24oJCkge1xuXG5jb25zdCBOZXN0ID0ge1xuICBGZWF0aGVyKG1lbnUsIHR5cGUgPSAnemYnKSB7XG4gICAgbWVudS5hdHRyKCdyb2xlJywgJ21lbnViYXInKTtcblxuICAgIHZhciBpdGVtcyA9IG1lbnUuZmluZCgnbGknKS5hdHRyKHsncm9sZSc6ICdtZW51aXRlbSd9KSxcbiAgICAgICAgc3ViTWVudUNsYXNzID0gYGlzLSR7dHlwZX0tc3VibWVudWAsXG4gICAgICAgIHN1Ykl0ZW1DbGFzcyA9IGAke3N1Yk1lbnVDbGFzc30taXRlbWAsXG4gICAgICAgIGhhc1N1YkNsYXNzID0gYGlzLSR7dHlwZX0tc3VibWVudS1wYXJlbnRgO1xuXG4gICAgaXRlbXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkaXRlbSA9ICQodGhpcyksXG4gICAgICAgICAgJHN1YiA9ICRpdGVtLmNoaWxkcmVuKCd1bCcpO1xuXG4gICAgICBpZiAoJHN1Yi5sZW5ndGgpIHtcbiAgICAgICAgJGl0ZW1cbiAgICAgICAgICAuYWRkQ2xhc3MoaGFzU3ViQ2xhc3MpXG4gICAgICAgICAgLmF0dHIoe1xuICAgICAgICAgICAgJ2FyaWEtaGFzcG9wdXAnOiB0cnVlLFxuICAgICAgICAgICAgJ2FyaWEtbGFiZWwnOiAkaXRlbS5jaGlsZHJlbignYTpmaXJzdCcpLnRleHQoKVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIE5vdGU6ICBEcmlsbGRvd25zIGJlaGF2ZSBkaWZmZXJlbnRseSBpbiBob3cgdGhleSBoaWRlLCBhbmQgc28gbmVlZFxuICAgICAgICAgIC8vIGFkZGl0aW9uYWwgYXR0cmlidXRlcy4gIFdlIHNob3VsZCBsb29rIGlmIHRoaXMgcG9zc2libHkgb3Zlci1nZW5lcmFsaXplZFxuICAgICAgICAgIC8vIHV0aWxpdHkgKE5lc3QpIGlzIGFwcHJvcHJpYXRlIHdoZW4gd2UgcmV3b3JrIG1lbnVzIGluIDYuNFxuICAgICAgICAgIGlmKHR5cGUgPT09ICdkcmlsbGRvd24nKSB7XG4gICAgICAgICAgICAkaXRlbS5hdHRyKHsnYXJpYS1leHBhbmRlZCc6IGZhbHNlfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICRzdWJcbiAgICAgICAgICAuYWRkQ2xhc3MoYHN1Ym1lbnUgJHtzdWJNZW51Q2xhc3N9YClcbiAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAnZGF0YS1zdWJtZW51JzogJycsXG4gICAgICAgICAgICAncm9sZSc6ICdtZW51J1xuICAgICAgICAgIH0pO1xuICAgICAgICBpZih0eXBlID09PSAnZHJpbGxkb3duJykge1xuICAgICAgICAgICRzdWIuYXR0cih7J2FyaWEtaGlkZGVuJzogdHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICgkaXRlbS5wYXJlbnQoJ1tkYXRhLXN1Ym1lbnVdJykubGVuZ3RoKSB7XG4gICAgICAgICRpdGVtLmFkZENsYXNzKGBpcy1zdWJtZW51LWl0ZW0gJHtzdWJJdGVtQ2xhc3N9YCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm47XG4gIH0sXG5cbiAgQnVybihtZW51LCB0eXBlKSB7XG4gICAgdmFyIC8vaXRlbXMgPSBtZW51LmZpbmQoJ2xpJyksXG4gICAgICAgIHN1Yk1lbnVDbGFzcyA9IGBpcy0ke3R5cGV9LXN1Ym1lbnVgLFxuICAgICAgICBzdWJJdGVtQ2xhc3MgPSBgJHtzdWJNZW51Q2xhc3N9LWl0ZW1gLFxuICAgICAgICBoYXNTdWJDbGFzcyA9IGBpcy0ke3R5cGV9LXN1Ym1lbnUtcGFyZW50YDtcblxuICAgIG1lbnVcbiAgICAgIC5maW5kKCc+bGksIC5tZW51LCAubWVudSA+IGxpJylcbiAgICAgIC5yZW1vdmVDbGFzcyhgJHtzdWJNZW51Q2xhc3N9ICR7c3ViSXRlbUNsYXNzfSAke2hhc1N1YkNsYXNzfSBpcy1zdWJtZW51LWl0ZW0gc3VibWVudSBpcy1hY3RpdmVgKVxuICAgICAgLnJlbW92ZUF0dHIoJ2RhdGEtc3VibWVudScpLmNzcygnZGlzcGxheScsICcnKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCAgICAgIG1lbnUuZmluZCgnLicgKyBzdWJNZW51Q2xhc3MgKyAnLCAuJyArIHN1Ykl0ZW1DbGFzcyArICcsIC5oYXMtc3VibWVudSwgLmlzLXN1Ym1lbnUtaXRlbSwgLnN1Ym1lbnUsIFtkYXRhLXN1Ym1lbnVdJylcbiAgICAvLyAgICAgICAgICAgLnJlbW92ZUNsYXNzKHN1Yk1lbnVDbGFzcyArICcgJyArIHN1Ykl0ZW1DbGFzcyArICcgaGFzLXN1Ym1lbnUgaXMtc3VibWVudS1pdGVtIHN1Ym1lbnUnKVxuICAgIC8vICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1zdWJtZW51JykpO1xuICAgIC8vIGl0ZW1zLmVhY2goZnVuY3Rpb24oKXtcbiAgICAvLyAgIHZhciAkaXRlbSA9ICQodGhpcyksXG4gICAgLy8gICAgICAgJHN1YiA9ICRpdGVtLmNoaWxkcmVuKCd1bCcpO1xuICAgIC8vICAgaWYoJGl0ZW0ucGFyZW50KCdbZGF0YS1zdWJtZW51XScpLmxlbmd0aCl7XG4gICAgLy8gICAgICRpdGVtLnJlbW92ZUNsYXNzKCdpcy1zdWJtZW51LWl0ZW0gJyArIHN1Ykl0ZW1DbGFzcyk7XG4gICAgLy8gICB9XG4gICAgLy8gICBpZigkc3ViLmxlbmd0aCl7XG4gICAgLy8gICAgICRpdGVtLnJlbW92ZUNsYXNzKCdoYXMtc3VibWVudScpO1xuICAgIC8vICAgICAkc3ViLnJlbW92ZUNsYXNzKCdzdWJtZW51ICcgKyBzdWJNZW51Q2xhc3MpLnJlbW92ZUF0dHIoJ2RhdGEtc3VibWVudScpO1xuICAgIC8vICAgfVxuICAgIC8vIH0pO1xuICB9XG59XG5cbkZvdW5kYXRpb24uTmVzdCA9IE5lc3Q7XG5cbn0oalF1ZXJ5KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuZnVuY3Rpb24gVGltZXIoZWxlbSwgb3B0aW9ucywgY2IpIHtcbiAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgIGR1cmF0aW9uID0gb3B0aW9ucy5kdXJhdGlvbiwvL29wdGlvbnMgaXMgYW4gb2JqZWN0IGZvciBlYXNpbHkgYWRkaW5nIGZlYXR1cmVzIGxhdGVyLlxuICAgICAgbmFtZVNwYWNlID0gT2JqZWN0LmtleXMoZWxlbS5kYXRhKCkpWzBdIHx8ICd0aW1lcicsXG4gICAgICByZW1haW4gPSAtMSxcbiAgICAgIHN0YXJ0LFxuICAgICAgdGltZXI7XG5cbiAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuXG4gIHRoaXMucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHJlbWFpbiA9IC0xO1xuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgdGhpcy5zdGFydCgpO1xuICB9XG5cbiAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICAvLyBpZighZWxlbS5kYXRhKCdwYXVzZWQnKSl7IHJldHVybiBmYWxzZTsgfS8vbWF5YmUgaW1wbGVtZW50IHRoaXMgc2FuaXR5IGNoZWNrIGlmIHVzZWQgZm9yIG90aGVyIHRoaW5ncy5cbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIHJlbWFpbiA9IHJlbWFpbiA8PSAwID8gZHVyYXRpb24gOiByZW1haW47XG4gICAgZWxlbS5kYXRhKCdwYXVzZWQnLCBmYWxzZSk7XG4gICAgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgaWYob3B0aW9ucy5pbmZpbml0ZSl7XG4gICAgICAgIF90aGlzLnJlc3RhcnQoKTsvL3JlcnVuIHRoZSB0aW1lci5cbiAgICAgIH1cbiAgICAgIGlmIChjYiAmJiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHsgY2IoKTsgfVxuICAgIH0sIHJlbWFpbik7XG4gICAgZWxlbS50cmlnZ2VyKGB0aW1lcnN0YXJ0LnpmLiR7bmFtZVNwYWNlfWApO1xuICB9XG5cbiAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuICAgIC8vaWYoZWxlbS5kYXRhKCdwYXVzZWQnKSl7IHJldHVybiBmYWxzZTsgfS8vbWF5YmUgaW1wbGVtZW50IHRoaXMgc2FuaXR5IGNoZWNrIGlmIHVzZWQgZm9yIG90aGVyIHRoaW5ncy5cbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIGVsZW0uZGF0YSgncGF1c2VkJywgdHJ1ZSk7XG4gICAgdmFyIGVuZCA9IERhdGUubm93KCk7XG4gICAgcmVtYWluID0gcmVtYWluIC0gKGVuZCAtIHN0YXJ0KTtcbiAgICBlbGVtLnRyaWdnZXIoYHRpbWVycGF1c2VkLnpmLiR7bmFtZVNwYWNlfWApO1xuICB9XG59XG5cbi8qKlxuICogUnVucyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gaW1hZ2VzIGFyZSBmdWxseSBsb2FkZWQuXG4gKiBAcGFyYW0ge09iamVjdH0gaW1hZ2VzIC0gSW1hZ2UocykgdG8gY2hlY2sgaWYgbG9hZGVkLlxuICogQHBhcmFtIHtGdW5jfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiBpbWFnZSBpcyBmdWxseSBsb2FkZWQuXG4gKi9cbmZ1bmN0aW9uIG9uSW1hZ2VzTG9hZGVkKGltYWdlcywgY2FsbGJhY2spe1xuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICB1bmxvYWRlZCA9IGltYWdlcy5sZW5ndGg7XG5cbiAgaWYgKHVubG9hZGVkID09PSAwKSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxuXG4gIGltYWdlcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIC8vIENoZWNrIGlmIGltYWdlIGlzIGxvYWRlZFxuICAgIGlmICh0aGlzLmNvbXBsZXRlIHx8ICh0aGlzLnJlYWR5U3RhdGUgPT09IDQpIHx8ICh0aGlzLnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpKSB7XG4gICAgICBzaW5nbGVJbWFnZUxvYWRlZCgpO1xuICAgIH1cbiAgICAvLyBGb3JjZSBsb2FkIHRoZSBpbWFnZVxuICAgIGVsc2Uge1xuICAgICAgLy8gZml4IGZvciBJRS4gU2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvanF1ZXJ5L2ZpeGluZy1sb2FkLWluLWllLWZvci1jYWNoZWQtaW1hZ2VzL1xuICAgICAgdmFyIHNyYyA9ICQodGhpcykuYXR0cignc3JjJyk7XG4gICAgICAkKHRoaXMpLmF0dHIoJ3NyYycsIHNyYyArIChzcmMuaW5kZXhPZignPycpID49IDAgPyAnJicgOiAnPycpICsgKG5ldyBEYXRlKCkuZ2V0VGltZSgpKSk7XG4gICAgICAkKHRoaXMpLm9uZSgnbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzaW5nbGVJbWFnZUxvYWRlZCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBzaW5nbGVJbWFnZUxvYWRlZCgpIHtcbiAgICB1bmxvYWRlZC0tO1xuICAgIGlmICh1bmxvYWRlZCA9PT0gMCkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cbn1cblxuRm91bmRhdGlvbi5UaW1lciA9IFRpbWVyO1xuRm91bmRhdGlvbi5vbkltYWdlc0xvYWRlZCA9IG9uSW1hZ2VzTG9hZGVkO1xuXG59KGpRdWVyeSk7XG4iLCIvLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyoqV29yayBpbnNwaXJlZCBieSBtdWx0aXBsZSBqcXVlcnkgc3dpcGUgcGx1Z2lucyoqXG4vLyoqRG9uZSBieSBZb2hhaSBBcmFyYXQgKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4oZnVuY3Rpb24oJCkge1xuXG4gICQuc3BvdFN3aXBlID0ge1xuICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgZW5hYmxlZDogJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgIHByZXZlbnREZWZhdWx0OiBmYWxzZSxcbiAgICBtb3ZlVGhyZXNob2xkOiA3NSxcbiAgICB0aW1lVGhyZXNob2xkOiAyMDBcbiAgfTtcblxuICB2YXIgICBzdGFydFBvc1gsXG4gICAgICAgIHN0YXJ0UG9zWSxcbiAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICBlbGFwc2VkVGltZSxcbiAgICAgICAgaXNNb3ZpbmcgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBvblRvdWNoRW5kKCkge1xuICAgIC8vICBhbGVydCh0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlKTtcbiAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XG4gICAgaXNNb3ZpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVG91Y2hNb3ZlKGUpIHtcbiAgICBpZiAoJC5zcG90U3dpcGUucHJldmVudERlZmF1bHQpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB9XG4gICAgaWYoaXNNb3ZpbmcpIHtcbiAgICAgIHZhciB4ID0gZS50b3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgdmFyIHkgPSBlLnRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICB2YXIgZHggPSBzdGFydFBvc1ggLSB4O1xuICAgICAgdmFyIGR5ID0gc3RhcnRQb3NZIC0geTtcbiAgICAgIHZhciBkaXI7XG4gICAgICBlbGFwc2VkVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRUaW1lO1xuICAgICAgaWYoTWF0aC5hYnMoZHgpID49ICQuc3BvdFN3aXBlLm1vdmVUaHJlc2hvbGQgJiYgZWxhcHNlZFRpbWUgPD0gJC5zcG90U3dpcGUudGltZVRocmVzaG9sZCkge1xuICAgICAgICBkaXIgPSBkeCA+IDAgPyAnbGVmdCcgOiAncmlnaHQnO1xuICAgICAgfVxuICAgICAgLy8gZWxzZSBpZihNYXRoLmFicyhkeSkgPj0gJC5zcG90U3dpcGUubW92ZVRocmVzaG9sZCAmJiBlbGFwc2VkVGltZSA8PSAkLnNwb3RTd2lwZS50aW1lVGhyZXNob2xkKSB7XG4gICAgICAvLyAgIGRpciA9IGR5ID4gMCA/ICdkb3duJyA6ICd1cCc7XG4gICAgICAvLyB9XG4gICAgICBpZihkaXIpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvblRvdWNoRW5kLmNhbGwodGhpcyk7XG4gICAgICAgICQodGhpcykudHJpZ2dlcignc3dpcGUnLCBkaXIpLnRyaWdnZXIoYHN3aXBlJHtkaXJ9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGUpIHtcbiAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICBzdGFydFBvc1ggPSBlLnRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICBzdGFydFBvc1kgPSBlLnRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICBpc01vdmluZyA9IHRydWU7XG4gICAgICBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Ub3VjaE1vdmUsIGZhbHNlKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIgJiYgdGhpcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0LCBmYWxzZSk7XG4gIH1cblxuICBmdW5jdGlvbiB0ZWFyZG93bigpIHtcbiAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvblRvdWNoU3RhcnQpO1xuICB9XG5cbiAgJC5ldmVudC5zcGVjaWFsLnN3aXBlID0geyBzZXR1cDogaW5pdCB9O1xuXG4gICQuZWFjaChbJ2xlZnQnLCAndXAnLCAnZG93bicsICdyaWdodCddLCBmdW5jdGlvbiAoKSB7XG4gICAgJC5ldmVudC5zcGVjaWFsW2Bzd2lwZSR7dGhpc31gXSA9IHsgc2V0dXA6IGZ1bmN0aW9uKCl7XG4gICAgICAkKHRoaXMpLm9uKCdzd2lwZScsICQubm9vcCk7XG4gICAgfSB9O1xuICB9KTtcbn0pKGpRdWVyeSk7XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogTWV0aG9kIGZvciBhZGRpbmcgcHN1ZWRvIGRyYWcgZXZlbnRzIHRvIGVsZW1lbnRzICpcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4hZnVuY3Rpb24oJCl7XG4gICQuZm4uYWRkVG91Y2ggPSBmdW5jdGlvbigpe1xuICAgIHRoaXMuZWFjaChmdW5jdGlvbihpLGVsKXtcbiAgICAgICQoZWwpLmJpbmQoJ3RvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsJyxmdW5jdGlvbigpe1xuICAgICAgICAvL3dlIHBhc3MgdGhlIG9yaWdpbmFsIGV2ZW50IG9iamVjdCBiZWNhdXNlIHRoZSBqUXVlcnkgZXZlbnRcbiAgICAgICAgLy9vYmplY3QgaXMgbm9ybWFsaXplZCB0byB3M2Mgc3BlY3MgYW5kIGRvZXMgbm90IHByb3ZpZGUgdGhlIFRvdWNoTGlzdFxuICAgICAgICBoYW5kbGVUb3VjaChldmVudCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBoYW5kbGVUb3VjaCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgIHZhciB0b3VjaGVzID0gZXZlbnQuY2hhbmdlZFRvdWNoZXMsXG4gICAgICAgICAgZmlyc3QgPSB0b3VjaGVzWzBdLFxuICAgICAgICAgIGV2ZW50VHlwZXMgPSB7XG4gICAgICAgICAgICB0b3VjaHN0YXJ0OiAnbW91c2Vkb3duJyxcbiAgICAgICAgICAgIHRvdWNobW92ZTogJ21vdXNlbW92ZScsXG4gICAgICAgICAgICB0b3VjaGVuZDogJ21vdXNldXAnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0eXBlID0gZXZlbnRUeXBlc1tldmVudC50eXBlXSxcbiAgICAgICAgICBzaW11bGF0ZWRFdmVudFxuICAgICAgICA7XG5cbiAgICAgIGlmKCdNb3VzZUV2ZW50JyBpbiB3aW5kb3cgJiYgdHlwZW9mIHdpbmRvdy5Nb3VzZUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHNpbXVsYXRlZEV2ZW50ID0gbmV3IHdpbmRvdy5Nb3VzZUV2ZW50KHR5cGUsIHtcbiAgICAgICAgICAnYnViYmxlcyc6IHRydWUsXG4gICAgICAgICAgJ2NhbmNlbGFibGUnOiB0cnVlLFxuICAgICAgICAgICdzY3JlZW5YJzogZmlyc3Quc2NyZWVuWCxcbiAgICAgICAgICAnc2NyZWVuWSc6IGZpcnN0LnNjcmVlblksXG4gICAgICAgICAgJ2NsaWVudFgnOiBmaXJzdC5jbGllbnRYLFxuICAgICAgICAgICdjbGllbnRZJzogZmlyc3QuY2xpZW50WVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNpbXVsYXRlZEV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnQnKTtcbiAgICAgICAgc2ltdWxhdGVkRXZlbnQuaW5pdE1vdXNlRXZlbnQodHlwZSwgdHJ1ZSwgdHJ1ZSwgd2luZG93LCAxLCBmaXJzdC5zY3JlZW5YLCBmaXJzdC5zY3JlZW5ZLCBmaXJzdC5jbGllbnRYLCBmaXJzdC5jbGllbnRZLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgMC8qbGVmdCovLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIGZpcnN0LnRhcmdldC5kaXNwYXRjaEV2ZW50KHNpbXVsYXRlZEV2ZW50KTtcbiAgICB9O1xuICB9O1xufShqUXVlcnkpO1xuXG5cbi8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8qKkZyb20gdGhlIGpRdWVyeSBNb2JpbGUgTGlicmFyeSoqXG4vLyoqbmVlZCB0byByZWNyZWF0ZSBmdW5jdGlvbmFsaXR5Kipcbi8vKiphbmQgdHJ5IHRvIGltcHJvdmUgaWYgcG9zc2libGUqKlxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8qIFJlbW92aW5nIHRoZSBqUXVlcnkgZnVuY3Rpb24gKioqKlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbihmdW5jdGlvbiggJCwgd2luZG93LCB1bmRlZmluZWQgKSB7XG5cblx0dmFyICRkb2N1bWVudCA9ICQoIGRvY3VtZW50ICksXG5cdFx0Ly8gc3VwcG9ydFRvdWNoID0gJC5tb2JpbGUuc3VwcG9ydC50b3VjaCxcblx0XHR0b3VjaFN0YXJ0RXZlbnQgPSAndG91Y2hzdGFydCcvL3N1cHBvcnRUb3VjaCA/IFwidG91Y2hzdGFydFwiIDogXCJtb3VzZWRvd25cIixcblx0XHR0b3VjaFN0b3BFdmVudCA9ICd0b3VjaGVuZCcvL3N1cHBvcnRUb3VjaCA/IFwidG91Y2hlbmRcIiA6IFwibW91c2V1cFwiLFxuXHRcdHRvdWNoTW92ZUV2ZW50ID0gJ3RvdWNobW92ZScvL3N1cHBvcnRUb3VjaCA/IFwidG91Y2htb3ZlXCIgOiBcIm1vdXNlbW92ZVwiO1xuXG5cdC8vIHNldHVwIG5ldyBldmVudCBzaG9ydGN1dHNcblx0JC5lYWNoKCAoIFwidG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgXCIgK1xuXHRcdFwic3dpcGUgc3dpcGVsZWZ0IHN3aXBlcmlnaHRcIiApLnNwbGl0KCBcIiBcIiApLCBmdW5jdGlvbiggaSwgbmFtZSApIHtcblxuXHRcdCQuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBmbiApIHtcblx0XHRcdHJldHVybiBmbiA/IHRoaXMuYmluZCggbmFtZSwgZm4gKSA6IHRoaXMudHJpZ2dlciggbmFtZSApO1xuXHRcdH07XG5cblx0XHQvLyBqUXVlcnkgPCAxLjhcblx0XHRpZiAoICQuYXR0ckZuICkge1xuXHRcdFx0JC5hdHRyRm5bIG5hbWUgXSA9IHRydWU7XG5cdFx0fVxuXHR9KTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyQ3VzdG9tRXZlbnQoIG9iaiwgZXZlbnRUeXBlLCBldmVudCwgYnViYmxlICkge1xuXHRcdHZhciBvcmlnaW5hbFR5cGUgPSBldmVudC50eXBlO1xuXHRcdGV2ZW50LnR5cGUgPSBldmVudFR5cGU7XG5cdFx0aWYgKCBidWJibGUgKSB7XG5cdFx0XHQkLmV2ZW50LnRyaWdnZXIoIGV2ZW50LCB1bmRlZmluZWQsIG9iaiApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkLmV2ZW50LmRpc3BhdGNoLmNhbGwoIG9iaiwgZXZlbnQgKTtcblx0XHR9XG5cdFx0ZXZlbnQudHlwZSA9IG9yaWdpbmFsVHlwZTtcblx0fVxuXG5cdC8vIGFsc28gaGFuZGxlcyB0YXBob2xkXG5cblx0Ly8gQWxzbyBoYW5kbGVzIHN3aXBlbGVmdCwgc3dpcGVyaWdodFxuXHQkLmV2ZW50LnNwZWNpYWwuc3dpcGUgPSB7XG5cblx0XHQvLyBNb3JlIHRoYW4gdGhpcyBob3Jpem9udGFsIGRpc3BsYWNlbWVudCwgYW5kIHdlIHdpbGwgc3VwcHJlc3Mgc2Nyb2xsaW5nLlxuXHRcdHNjcm9sbFN1cHJlc3Npb25UaHJlc2hvbGQ6IDMwLFxuXG5cdFx0Ly8gTW9yZSB0aW1lIHRoYW4gdGhpcywgYW5kIGl0IGlzbid0IGEgc3dpcGUuXG5cdFx0ZHVyYXRpb25UaHJlc2hvbGQ6IDEwMDAsXG5cblx0XHQvLyBTd2lwZSBob3Jpem9udGFsIGRpc3BsYWNlbWVudCBtdXN0IGJlIG1vcmUgdGhhbiB0aGlzLlxuXHRcdGhvcml6b250YWxEaXN0YW5jZVRocmVzaG9sZDogd2luZG93LmRldmljZVBpeGVsUmF0aW8gPj0gMiA/IDE1IDogMzAsXG5cblx0XHQvLyBTd2lwZSB2ZXJ0aWNhbCBkaXNwbGFjZW1lbnQgbXVzdCBiZSBsZXNzIHRoYW4gdGhpcy5cblx0XHR2ZXJ0aWNhbERpc3RhbmNlVGhyZXNob2xkOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+PSAyID8gMTUgOiAzMCxcblxuXHRcdGdldExvY2F0aW9uOiBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXHRcdFx0dmFyIHdpblBhZ2VYID0gd2luZG93LnBhZ2VYT2Zmc2V0LFxuXHRcdFx0XHR3aW5QYWdlWSA9IHdpbmRvdy5wYWdlWU9mZnNldCxcblx0XHRcdFx0eCA9IGV2ZW50LmNsaWVudFgsXG5cdFx0XHRcdHkgPSBldmVudC5jbGllbnRZO1xuXG5cdFx0XHRpZiAoIGV2ZW50LnBhZ2VZID09PSAwICYmIE1hdGguZmxvb3IoIHkgKSA+IE1hdGguZmxvb3IoIGV2ZW50LnBhZ2VZICkgfHxcblx0XHRcdFx0ZXZlbnQucGFnZVggPT09IDAgJiYgTWF0aC5mbG9vciggeCApID4gTWF0aC5mbG9vciggZXZlbnQucGFnZVggKSApIHtcblxuXHRcdFx0XHQvLyBpT1M0IGNsaWVudFgvY2xpZW50WSBoYXZlIHRoZSB2YWx1ZSB0aGF0IHNob3VsZCBoYXZlIGJlZW5cblx0XHRcdFx0Ly8gaW4gcGFnZVgvcGFnZVkuIFdoaWxlIHBhZ2VYL3BhZ2UvIGhhdmUgdGhlIHZhbHVlIDBcblx0XHRcdFx0eCA9IHggLSB3aW5QYWdlWDtcblx0XHRcdFx0eSA9IHkgLSB3aW5QYWdlWTtcblx0XHRcdH0gZWxzZSBpZiAoIHkgPCAoIGV2ZW50LnBhZ2VZIC0gd2luUGFnZVkpIHx8IHggPCAoIGV2ZW50LnBhZ2VYIC0gd2luUGFnZVggKSApIHtcblxuXHRcdFx0XHQvLyBTb21lIEFuZHJvaWQgYnJvd3NlcnMgaGF2ZSB0b3RhbGx5IGJvZ3VzIHZhbHVlcyBmb3IgY2xpZW50WC9ZXG5cdFx0XHRcdC8vIHdoZW4gc2Nyb2xsaW5nL3pvb21pbmcgYSBwYWdlLiBEZXRlY3RhYmxlIHNpbmNlIGNsaWVudFgvY2xpZW50WVxuXHRcdFx0XHQvLyBzaG91bGQgbmV2ZXIgYmUgc21hbGxlciB0aGFuIHBhZ2VYL3BhZ2VZIG1pbnVzIHBhZ2Ugc2Nyb2xsXG5cdFx0XHRcdHggPSBldmVudC5wYWdlWCAtIHdpblBhZ2VYO1xuXHRcdFx0XHR5ID0gZXZlbnQucGFnZVkgLSB3aW5QYWdlWTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0eDogeCxcblx0XHRcdFx0eTogeVxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0c3RhcnQ6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdHZhciBkYXRhID0gZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzID9cblx0XHRcdFx0XHRldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbIDAgXSA6IGV2ZW50LFxuXHRcdFx0XHRsb2NhdGlvbiA9ICQuZXZlbnQuc3BlY2lhbC5zd2lwZS5nZXRMb2NhdGlvbiggZGF0YSApO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHRpbWU6ICggbmV3IERhdGUoKSApLmdldFRpbWUoKSxcblx0XHRcdFx0XHRcdGNvb3JkczogWyBsb2NhdGlvbi54LCBsb2NhdGlvbi55IF0sXG5cdFx0XHRcdFx0XHRvcmlnaW46ICQoIGV2ZW50LnRhcmdldCApXG5cdFx0XHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0c3RvcDogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0dmFyIGRhdGEgPSBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgP1xuXHRcdFx0XHRcdGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlc1sgMCBdIDogZXZlbnQsXG5cdFx0XHRcdGxvY2F0aW9uID0gJC5ldmVudC5zcGVjaWFsLnN3aXBlLmdldExvY2F0aW9uKCBkYXRhICk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0dGltZTogKCBuZXcgRGF0ZSgpICkuZ2V0VGltZSgpLFxuXHRcdFx0XHRcdFx0Y29vcmRzOiBbIGxvY2F0aW9uLngsIGxvY2F0aW9uLnkgXVxuXHRcdFx0XHRcdH07XG5cdFx0fSxcblxuXHRcdGhhbmRsZVN3aXBlOiBmdW5jdGlvbiggc3RhcnQsIHN0b3AsIHRoaXNPYmplY3QsIG9yaWdUYXJnZXQgKSB7XG5cdFx0XHRpZiAoIHN0b3AudGltZSAtIHN0YXJ0LnRpbWUgPCAkLmV2ZW50LnNwZWNpYWwuc3dpcGUuZHVyYXRpb25UaHJlc2hvbGQgJiZcblx0XHRcdFx0TWF0aC5hYnMoIHN0YXJ0LmNvb3Jkc1sgMCBdIC0gc3RvcC5jb29yZHNbIDAgXSApID4gJC5ldmVudC5zcGVjaWFsLnN3aXBlLmhvcml6b250YWxEaXN0YW5jZVRocmVzaG9sZCAmJlxuXHRcdFx0XHRNYXRoLmFicyggc3RhcnQuY29vcmRzWyAxIF0gLSBzdG9wLmNvb3Jkc1sgMSBdICkgPCAkLmV2ZW50LnNwZWNpYWwuc3dpcGUudmVydGljYWxEaXN0YW5jZVRocmVzaG9sZCApIHtcblx0XHRcdFx0dmFyIGRpcmVjdGlvbiA9IHN0YXJ0LmNvb3Jkc1swXSA+IHN0b3AuY29vcmRzWyAwIF0gPyBcInN3aXBlbGVmdFwiIDogXCJzd2lwZXJpZ2h0XCI7XG5cblx0XHRcdFx0dHJpZ2dlckN1c3RvbUV2ZW50KCB0aGlzT2JqZWN0LCBcInN3aXBlXCIsICQuRXZlbnQoIFwic3dpcGVcIiwgeyB0YXJnZXQ6IG9yaWdUYXJnZXQsIHN3aXBlc3RhcnQ6IHN0YXJ0LCBzd2lwZXN0b3A6IHN0b3AgfSksIHRydWUgKTtcblx0XHRcdFx0dHJpZ2dlckN1c3RvbUV2ZW50KCB0aGlzT2JqZWN0LCBkaXJlY3Rpb24sJC5FdmVudCggZGlyZWN0aW9uLCB7IHRhcmdldDogb3JpZ1RhcmdldCwgc3dpcGVzdGFydDogc3RhcnQsIHN3aXBlc3RvcDogc3RvcCB9ICksIHRydWUgKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHR9LFxuXG5cdFx0Ly8gVGhpcyBzZXJ2ZXMgYXMgYSBmbGFnIHRvIGVuc3VyZSB0aGF0IGF0IG1vc3Qgb25lIHN3aXBlIGV2ZW50IGV2ZW50IGlzXG5cdFx0Ly8gaW4gd29yayBhdCBhbnkgZ2l2ZW4gdGltZVxuXHRcdGV2ZW50SW5Qcm9ncmVzczogZmFsc2UsXG5cblx0XHRzZXR1cDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZXZlbnRzLFxuXHRcdFx0XHR0aGlzT2JqZWN0ID0gdGhpcyxcblx0XHRcdFx0JHRoaXMgPSAkKCB0aGlzT2JqZWN0ICksXG5cdFx0XHRcdGNvbnRleHQgPSB7fTtcblxuXHRcdFx0Ly8gUmV0cmlldmUgdGhlIGV2ZW50cyBkYXRhIGZvciB0aGlzIGVsZW1lbnQgYW5kIGFkZCB0aGUgc3dpcGUgY29udGV4dFxuXHRcdFx0ZXZlbnRzID0gJC5kYXRhKCB0aGlzLCBcIm1vYmlsZS1ldmVudHNcIiApO1xuXHRcdFx0aWYgKCAhZXZlbnRzICkge1xuXHRcdFx0XHRldmVudHMgPSB7IGxlbmd0aDogMCB9O1xuXHRcdFx0XHQkLmRhdGEoIHRoaXMsIFwibW9iaWxlLWV2ZW50c1wiLCBldmVudHMgKTtcblx0XHRcdH1cblx0XHRcdGV2ZW50cy5sZW5ndGgrKztcblx0XHRcdGV2ZW50cy5zd2lwZSA9IGNvbnRleHQ7XG5cblx0XHRcdGNvbnRleHQuc3RhcnQgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHRcdFx0Ly8gQmFpbCBpZiB3ZSdyZSBhbHJlYWR5IHdvcmtpbmcgb24gYSBzd2lwZSBldmVudFxuXHRcdFx0XHRpZiAoICQuZXZlbnQuc3BlY2lhbC5zd2lwZS5ldmVudEluUHJvZ3Jlc3MgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCQuZXZlbnQuc3BlY2lhbC5zd2lwZS5ldmVudEluUHJvZ3Jlc3MgPSB0cnVlO1xuXG5cdFx0XHRcdHZhciBzdG9wLFxuXHRcdFx0XHRcdHN0YXJ0ID0gJC5ldmVudC5zcGVjaWFsLnN3aXBlLnN0YXJ0KCBldmVudCApLFxuXHRcdFx0XHRcdG9yaWdUYXJnZXQgPSBldmVudC50YXJnZXQsXG5cdFx0XHRcdFx0ZW1pdHRlZCA9IGZhbHNlO1xuXG5cdFx0XHRcdGNvbnRleHQubW92ZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRpZiAoICFzdGFydCB8fCBldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzdG9wID0gJC5ldmVudC5zcGVjaWFsLnN3aXBlLnN0b3AoIGV2ZW50ICk7XG5cdFx0XHRcdFx0aWYgKCAhZW1pdHRlZCApIHtcblx0XHRcdFx0XHRcdGVtaXR0ZWQgPSAkLmV2ZW50LnNwZWNpYWwuc3dpcGUuaGFuZGxlU3dpcGUoIHN0YXJ0LCBzdG9wLCB0aGlzT2JqZWN0LCBvcmlnVGFyZ2V0ICk7XG5cdFx0XHRcdFx0XHRpZiAoIGVtaXR0ZWQgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gUmVzZXQgdGhlIGNvbnRleHQgdG8gbWFrZSB3YXkgZm9yIHRoZSBuZXh0IHN3aXBlIGV2ZW50XG5cdFx0XHRcdFx0XHRcdCQuZXZlbnQuc3BlY2lhbC5zd2lwZS5ldmVudEluUHJvZ3Jlc3MgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gcHJldmVudCBzY3JvbGxpbmdcblx0XHRcdFx0XHRpZiAoIE1hdGguYWJzKCBzdGFydC5jb29yZHNbIDAgXSAtIHN0b3AuY29vcmRzWyAwIF0gKSA+ICQuZXZlbnQuc3BlY2lhbC5zd2lwZS5zY3JvbGxTdXByZXNzaW9uVGhyZXNob2xkICkge1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Y29udGV4dC5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRlbWl0dGVkID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0Ly8gUmVzZXQgdGhlIGNvbnRleHQgdG8gbWFrZSB3YXkgZm9yIHRoZSBuZXh0IHN3aXBlIGV2ZW50XG5cdFx0XHRcdFx0XHQkLmV2ZW50LnNwZWNpYWwuc3dpcGUuZXZlbnRJblByb2dyZXNzID0gZmFsc2U7XG5cdFx0XHRcdFx0XHQkZG9jdW1lbnQub2ZmKCB0b3VjaE1vdmVFdmVudCwgY29udGV4dC5tb3ZlICk7XG5cdFx0XHRcdFx0XHRjb250ZXh0Lm1vdmUgPSBudWxsO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRkb2N1bWVudC5vbiggdG91Y2hNb3ZlRXZlbnQsIGNvbnRleHQubW92ZSApXG5cdFx0XHRcdFx0Lm9uZSggdG91Y2hTdG9wRXZlbnQsIGNvbnRleHQuc3RvcCApO1xuXHRcdFx0fTtcblx0XHRcdCR0aGlzLm9uKCB0b3VjaFN0YXJ0RXZlbnQsIGNvbnRleHQuc3RhcnQgKTtcblx0XHR9LFxuXG5cdFx0dGVhcmRvd246IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGV2ZW50cywgY29udGV4dDtcblxuXHRcdFx0ZXZlbnRzID0gJC5kYXRhKCB0aGlzLCBcIm1vYmlsZS1ldmVudHNcIiApO1xuXHRcdFx0aWYgKCBldmVudHMgKSB7XG5cdFx0XHRcdGNvbnRleHQgPSBldmVudHMuc3dpcGU7XG5cdFx0XHRcdGRlbGV0ZSBldmVudHMuc3dpcGU7XG5cdFx0XHRcdGV2ZW50cy5sZW5ndGgtLTtcblx0XHRcdFx0aWYgKCBldmVudHMubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRcdCQucmVtb3ZlRGF0YSggdGhpcywgXCJtb2JpbGUtZXZlbnRzXCIgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIGNvbnRleHQgKSB7XG5cdFx0XHRcdGlmICggY29udGV4dC5zdGFydCApIHtcblx0XHRcdFx0XHQkKCB0aGlzICkub2ZmKCB0b3VjaFN0YXJ0RXZlbnQsIGNvbnRleHQuc3RhcnQgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIGNvbnRleHQubW92ZSApIHtcblx0XHRcdFx0XHQkZG9jdW1lbnQub2ZmKCB0b3VjaE1vdmVFdmVudCwgY29udGV4dC5tb3ZlICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCBjb250ZXh0LnN0b3AgKSB7XG5cdFx0XHRcdFx0JGRvY3VtZW50Lm9mZiggdG91Y2hTdG9wRXZlbnQsIGNvbnRleHQuc3RvcCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHQkLmVhY2goe1xuXHRcdHN3aXBlbGVmdDogXCJzd2lwZS5sZWZ0XCIsXG5cdFx0c3dpcGVyaWdodDogXCJzd2lwZS5yaWdodFwiXG5cdH0sIGZ1bmN0aW9uKCBldmVudCwgc291cmNlRXZlbnQgKSB7XG5cblx0XHQkLmV2ZW50LnNwZWNpYWxbIGV2ZW50IF0gPSB7XG5cdFx0XHRzZXR1cDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS5iaW5kKCBzb3VyY2VFdmVudCwgJC5ub29wICk7XG5cdFx0XHR9LFxuXHRcdFx0dGVhcmRvd246IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkudW5iaW5kKCBzb3VyY2VFdmVudCApO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xufSkoIGpRdWVyeSwgdGhpcyApO1xuKi9cbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuY29uc3QgTXV0YXRpb25PYnNlcnZlciA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBwcmVmaXhlcyA9IFsnV2ViS2l0JywgJ01veicsICdPJywgJ01zJywgJyddO1xuICBmb3IgKHZhciBpPTA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChgJHtwcmVmaXhlc1tpXX1NdXRhdGlvbk9ic2VydmVyYCBpbiB3aW5kb3cpIHtcbiAgICAgIHJldHVybiB3aW5kb3dbYCR7cHJlZml4ZXNbaV19TXV0YXRpb25PYnNlcnZlcmBdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59KCkpO1xuXG5jb25zdCB0cmlnZ2VycyA9IChlbCwgdHlwZSkgPT4ge1xuICBlbC5kYXRhKHR5cGUpLnNwbGl0KCcgJykuZm9yRWFjaChpZCA9PiB7XG4gICAgJChgIyR7aWR9YClbIHR5cGUgPT09ICdjbG9zZScgPyAndHJpZ2dlcicgOiAndHJpZ2dlckhhbmRsZXInXShgJHt0eXBlfS56Zi50cmlnZ2VyYCwgW2VsXSk7XG4gIH0pO1xufTtcbi8vIEVsZW1lbnRzIHdpdGggW2RhdGEtb3Blbl0gd2lsbCByZXZlYWwgYSBwbHVnaW4gdGhhdCBzdXBwb3J0cyBpdCB3aGVuIGNsaWNrZWQuXG4kKGRvY3VtZW50KS5vbignY2xpY2suemYudHJpZ2dlcicsICdbZGF0YS1vcGVuXScsIGZ1bmN0aW9uKCkge1xuICB0cmlnZ2VycygkKHRoaXMpLCAnb3BlbicpO1xufSk7XG5cbi8vIEVsZW1lbnRzIHdpdGggW2RhdGEtY2xvc2VdIHdpbGwgY2xvc2UgYSBwbHVnaW4gdGhhdCBzdXBwb3J0cyBpdCB3aGVuIGNsaWNrZWQuXG4vLyBJZiB1c2VkIHdpdGhvdXQgYSB2YWx1ZSBvbiBbZGF0YS1jbG9zZV0sIHRoZSBldmVudCB3aWxsIGJ1YmJsZSwgYWxsb3dpbmcgaXQgdG8gY2xvc2UgYSBwYXJlbnQgY29tcG9uZW50LlxuJChkb2N1bWVudCkub24oJ2NsaWNrLnpmLnRyaWdnZXInLCAnW2RhdGEtY2xvc2VdJywgZnVuY3Rpb24oKSB7XG4gIGxldCBpZCA9ICQodGhpcykuZGF0YSgnY2xvc2UnKTtcbiAgaWYgKGlkKSB7XG4gICAgdHJpZ2dlcnMoJCh0aGlzKSwgJ2Nsb3NlJyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgJCh0aGlzKS50cmlnZ2VyKCdjbG9zZS56Zi50cmlnZ2VyJyk7XG4gIH1cbn0pO1xuXG4vLyBFbGVtZW50cyB3aXRoIFtkYXRhLXRvZ2dsZV0gd2lsbCB0b2dnbGUgYSBwbHVnaW4gdGhhdCBzdXBwb3J0cyBpdCB3aGVuIGNsaWNrZWQuXG4kKGRvY3VtZW50KS5vbignY2xpY2suemYudHJpZ2dlcicsICdbZGF0YS10b2dnbGVdJywgZnVuY3Rpb24oKSB7XG4gIGxldCBpZCA9ICQodGhpcykuZGF0YSgndG9nZ2xlJyk7XG4gIGlmIChpZCkge1xuICAgIHRyaWdnZXJzKCQodGhpcyksICd0b2dnbGUnKTtcbiAgfSBlbHNlIHtcbiAgICAkKHRoaXMpLnRyaWdnZXIoJ3RvZ2dsZS56Zi50cmlnZ2VyJyk7XG4gIH1cbn0pO1xuXG4vLyBFbGVtZW50cyB3aXRoIFtkYXRhLWNsb3NhYmxlXSB3aWxsIHJlc3BvbmQgdG8gY2xvc2UuemYudHJpZ2dlciBldmVudHMuXG4kKGRvY3VtZW50KS5vbignY2xvc2UuemYudHJpZ2dlcicsICdbZGF0YS1jbG9zYWJsZV0nLCBmdW5jdGlvbihlKXtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgbGV0IGFuaW1hdGlvbiA9ICQodGhpcykuZGF0YSgnY2xvc2FibGUnKTtcblxuICBpZihhbmltYXRpb24gIT09ICcnKXtcbiAgICBGb3VuZGF0aW9uLk1vdGlvbi5hbmltYXRlT3V0KCQodGhpcyksIGFuaW1hdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICAkKHRoaXMpLnRyaWdnZXIoJ2Nsb3NlZC56ZicpO1xuICAgIH0pO1xuICB9ZWxzZXtcbiAgICAkKHRoaXMpLmZhZGVPdXQoKS50cmlnZ2VyKCdjbG9zZWQuemYnKTtcbiAgfVxufSk7XG5cbiQoZG9jdW1lbnQpLm9uKCdmb2N1cy56Zi50cmlnZ2VyIGJsdXIuemYudHJpZ2dlcicsICdbZGF0YS10b2dnbGUtZm9jdXNdJywgZnVuY3Rpb24oKSB7XG4gIGxldCBpZCA9ICQodGhpcykuZGF0YSgndG9nZ2xlLWZvY3VzJyk7XG4gICQoYCMke2lkfWApLnRyaWdnZXJIYW5kbGVyKCd0b2dnbGUuemYudHJpZ2dlcicsIFskKHRoaXMpXSk7XG59KTtcblxuLyoqXG4qIEZpcmVzIG9uY2UgYWZ0ZXIgYWxsIG90aGVyIHNjcmlwdHMgaGF2ZSBsb2FkZWRcbiogQGZ1bmN0aW9uXG4qIEBwcml2YXRlXG4qL1xuJCh3aW5kb3cpLm9uKCdsb2FkJywgKCkgPT4ge1xuICBjaGVja0xpc3RlbmVycygpO1xufSk7XG5cbmZ1bmN0aW9uIGNoZWNrTGlzdGVuZXJzKCkge1xuICBldmVudHNMaXN0ZW5lcigpO1xuICByZXNpemVMaXN0ZW5lcigpO1xuICBzY3JvbGxMaXN0ZW5lcigpO1xuICBtdXRhdGVMaXN0ZW5lcigpO1xuICBjbG9zZW1lTGlzdGVuZXIoKTtcbn1cblxuLy8qKioqKioqKiBvbmx5IGZpcmVzIHRoaXMgZnVuY3Rpb24gb25jZSBvbiBsb2FkLCBpZiB0aGVyZSdzIHNvbWV0aGluZyB0byB3YXRjaCAqKioqKioqKlxuZnVuY3Rpb24gY2xvc2VtZUxpc3RlbmVyKHBsdWdpbk5hbWUpIHtcbiAgdmFyIHlldGlCb3hlcyA9ICQoJ1tkYXRhLXlldGktYm94XScpLFxuICAgICAgcGx1Z05hbWVzID0gWydkcm9wZG93bicsICd0b29sdGlwJywgJ3JldmVhbCddO1xuXG4gIGlmKHBsdWdpbk5hbWUpe1xuICAgIGlmKHR5cGVvZiBwbHVnaW5OYW1lID09PSAnc3RyaW5nJyl7XG4gICAgICBwbHVnTmFtZXMucHVzaChwbHVnaW5OYW1lKTtcbiAgICB9ZWxzZSBpZih0eXBlb2YgcGx1Z2luTmFtZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHBsdWdpbk5hbWVbMF0gPT09ICdzdHJpbmcnKXtcbiAgICAgIHBsdWdOYW1lcy5jb25jYXQocGx1Z2luTmFtZSk7XG4gICAgfWVsc2V7XG4gICAgICBjb25zb2xlLmVycm9yKCdQbHVnaW4gbmFtZXMgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfVxuICB9XG4gIGlmKHlldGlCb3hlcy5sZW5ndGgpe1xuICAgIGxldCBsaXN0ZW5lcnMgPSBwbHVnTmFtZXMubWFwKChuYW1lKSA9PiB7XG4gICAgICByZXR1cm4gYGNsb3NlbWUuemYuJHtuYW1lfWA7XG4gICAgfSkuam9pbignICcpO1xuXG4gICAgJCh3aW5kb3cpLm9mZihsaXN0ZW5lcnMpLm9uKGxpc3RlbmVycywgZnVuY3Rpb24oZSwgcGx1Z2luSWQpe1xuICAgICAgbGV0IHBsdWdpbiA9IGUubmFtZXNwYWNlLnNwbGl0KCcuJylbMF07XG4gICAgICBsZXQgcGx1Z2lucyA9ICQoYFtkYXRhLSR7cGx1Z2lufV1gKS5ub3QoYFtkYXRhLXlldGktYm94PVwiJHtwbHVnaW5JZH1cIl1gKTtcblxuICAgICAgcGx1Z2lucy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgIGxldCBfdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgX3RoaXMudHJpZ2dlckhhbmRsZXIoJ2Nsb3NlLnpmLnRyaWdnZXInLCBbX3RoaXNdKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc2l6ZUxpc3RlbmVyKGRlYm91bmNlKXtcbiAgbGV0IHRpbWVyLFxuICAgICAgJG5vZGVzID0gJCgnW2RhdGEtcmVzaXplXScpO1xuICBpZigkbm9kZXMubGVuZ3RoKXtcbiAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuemYudHJpZ2dlcicpXG4gICAgLm9uKCdyZXNpemUuemYudHJpZ2dlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICh0aW1lcikgeyBjbGVhclRpbWVvdXQodGltZXIpOyB9XG5cbiAgICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgIGlmKCFNdXRhdGlvbk9ic2VydmVyKXsvL2ZhbGxiYWNrIGZvciBJRSA5XG4gICAgICAgICAgJG5vZGVzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQodGhpcykudHJpZ2dlckhhbmRsZXIoJ3Jlc2l6ZW1lLnpmLnRyaWdnZXInKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvL3RyaWdnZXIgYWxsIGxpc3RlbmluZyBlbGVtZW50cyBhbmQgc2lnbmFsIGEgcmVzaXplIGV2ZW50XG4gICAgICAgICRub2Rlcy5hdHRyKCdkYXRhLWV2ZW50cycsIFwicmVzaXplXCIpO1xuICAgICAgfSwgZGVib3VuY2UgfHwgMTApOy8vZGVmYXVsdCB0aW1lIHRvIGVtaXQgcmVzaXplIGV2ZW50XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2Nyb2xsTGlzdGVuZXIoZGVib3VuY2Upe1xuICBsZXQgdGltZXIsXG4gICAgICAkbm9kZXMgPSAkKCdbZGF0YS1zY3JvbGxdJyk7XG4gIGlmKCRub2Rlcy5sZW5ndGgpe1xuICAgICQod2luZG93KS5vZmYoJ3Njcm9sbC56Zi50cmlnZ2VyJylcbiAgICAub24oJ3Njcm9sbC56Zi50cmlnZ2VyJywgZnVuY3Rpb24oZSl7XG4gICAgICBpZih0aW1lcil7IGNsZWFyVGltZW91dCh0aW1lcik7IH1cblxuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgaWYoIU11dGF0aW9uT2JzZXJ2ZXIpey8vZmFsbGJhY2sgZm9yIElFIDlcbiAgICAgICAgICAkbm9kZXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VySGFuZGxlcignc2Nyb2xsbWUuemYudHJpZ2dlcicpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vdHJpZ2dlciBhbGwgbGlzdGVuaW5nIGVsZW1lbnRzIGFuZCBzaWduYWwgYSBzY3JvbGwgZXZlbnRcbiAgICAgICAgJG5vZGVzLmF0dHIoJ2RhdGEtZXZlbnRzJywgXCJzY3JvbGxcIik7XG4gICAgICB9LCBkZWJvdW5jZSB8fCAxMCk7Ly9kZWZhdWx0IHRpbWUgdG8gZW1pdCBzY3JvbGwgZXZlbnRcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtdXRhdGVMaXN0ZW5lcihkZWJvdW5jZSkge1xuICAgIGxldCAkbm9kZXMgPSAkKCdbZGF0YS1tdXRhdGVdJyk7XG4gICAgaWYgKCRub2Rlcy5sZW5ndGggJiYgTXV0YXRpb25PYnNlcnZlcil7XG5cdFx0XHQvL3RyaWdnZXIgYWxsIGxpc3RlbmluZyBlbGVtZW50cyBhbmQgc2lnbmFsIGEgbXV0YXRlIGV2ZW50XG4gICAgICAvL25vIElFIDkgb3IgMTBcblx0XHRcdCRub2Rlcy5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdCAgJCh0aGlzKS50cmlnZ2VySGFuZGxlcignbXV0YXRlbWUuemYudHJpZ2dlcicpO1xuXHRcdFx0fSk7XG4gICAgfVxuIH1cblxuZnVuY3Rpb24gZXZlbnRzTGlzdGVuZXIoKSB7XG4gIGlmKCFNdXRhdGlvbk9ic2VydmVyKXsgcmV0dXJuIGZhbHNlOyB9XG4gIGxldCBub2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXJlc2l6ZV0sIFtkYXRhLXNjcm9sbF0sIFtkYXRhLW11dGF0ZV0nKTtcblxuICAvL2VsZW1lbnQgY2FsbGJhY2tcbiAgdmFyIGxpc3RlbmluZ0VsZW1lbnRzTXV0YXRpb24gPSBmdW5jdGlvbiAobXV0YXRpb25SZWNvcmRzTGlzdCkge1xuICAgICAgdmFyICR0YXJnZXQgPSAkKG11dGF0aW9uUmVjb3Jkc0xpc3RbMF0udGFyZ2V0KTtcblxuXHQgIC8vdHJpZ2dlciB0aGUgZXZlbnQgaGFuZGxlciBmb3IgdGhlIGVsZW1lbnQgZGVwZW5kaW5nIG9uIHR5cGVcbiAgICAgIHN3aXRjaCAobXV0YXRpb25SZWNvcmRzTGlzdFswXS50eXBlKSB7XG5cbiAgICAgICAgY2FzZSBcImF0dHJpYnV0ZXNcIjpcbiAgICAgICAgICBpZiAoJHRhcmdldC5hdHRyKFwiZGF0YS1ldmVudHNcIikgPT09IFwic2Nyb2xsXCIgJiYgbXV0YXRpb25SZWNvcmRzTGlzdFswXS5hdHRyaWJ1dGVOYW1lID09PSBcImRhdGEtZXZlbnRzXCIpIHtcblx0XHQgIFx0JHRhcmdldC50cmlnZ2VySGFuZGxlcignc2Nyb2xsbWUuemYudHJpZ2dlcicsIFskdGFyZ2V0LCB3aW5kb3cucGFnZVlPZmZzZXRdKTtcblx0XHQgIH1cblx0XHQgIGlmICgkdGFyZ2V0LmF0dHIoXCJkYXRhLWV2ZW50c1wiKSA9PT0gXCJyZXNpemVcIiAmJiBtdXRhdGlvblJlY29yZHNMaXN0WzBdLmF0dHJpYnV0ZU5hbWUgPT09IFwiZGF0YS1ldmVudHNcIikge1xuXHRcdCAgXHQkdGFyZ2V0LnRyaWdnZXJIYW5kbGVyKCdyZXNpemVtZS56Zi50cmlnZ2VyJywgWyR0YXJnZXRdKTtcblx0XHQgICB9XG5cdFx0ICBpZiAobXV0YXRpb25SZWNvcmRzTGlzdFswXS5hdHRyaWJ1dGVOYW1lID09PSBcInN0eWxlXCIpIHtcblx0XHRcdCAgJHRhcmdldC5jbG9zZXN0KFwiW2RhdGEtbXV0YXRlXVwiKS5hdHRyKFwiZGF0YS1ldmVudHNcIixcIm11dGF0ZVwiKTtcblx0XHRcdCAgJHRhcmdldC5jbG9zZXN0KFwiW2RhdGEtbXV0YXRlXVwiKS50cmlnZ2VySGFuZGxlcignbXV0YXRlbWUuemYudHJpZ2dlcicsIFskdGFyZ2V0LmNsb3Nlc3QoXCJbZGF0YS1tdXRhdGVdXCIpXSk7XG5cdFx0ICB9XG5cdFx0ICBicmVhaztcblxuICAgICAgICBjYXNlIFwiY2hpbGRMaXN0XCI6XG5cdFx0ICAkdGFyZ2V0LmNsb3Nlc3QoXCJbZGF0YS1tdXRhdGVdXCIpLmF0dHIoXCJkYXRhLWV2ZW50c1wiLFwibXV0YXRlXCIpO1xuXHRcdCAgJHRhcmdldC5jbG9zZXN0KFwiW2RhdGEtbXV0YXRlXVwiKS50cmlnZ2VySGFuZGxlcignbXV0YXRlbWUuemYudHJpZ2dlcicsIFskdGFyZ2V0LmNsb3Nlc3QoXCJbZGF0YS1tdXRhdGVdXCIpXSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIC8vbm90aGluZ1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAobm9kZXMubGVuZ3RoKSB7XG4gICAgICAvL2ZvciBlYWNoIGVsZW1lbnQgdGhhdCBuZWVkcyB0byBsaXN0ZW4gZm9yIHJlc2l6aW5nLCBzY3JvbGxpbmcsIG9yIG11dGF0aW9uIGFkZCBhIHNpbmdsZSBvYnNlcnZlclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gbm9kZXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgIHZhciBlbGVtZW50T2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihsaXN0ZW5pbmdFbGVtZW50c011dGF0aW9uKTtcbiAgICAgICAgZWxlbWVudE9ic2VydmVyLm9ic2VydmUobm9kZXNbaV0sIHsgYXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlLCBjaGFyYWN0ZXJEYXRhOiBmYWxzZSwgc3VidHJlZTogdHJ1ZSwgYXR0cmlidXRlRmlsdGVyOiBbXCJkYXRhLWV2ZW50c1wiLCBcInN0eWxlXCJdIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gW1BIXVxuLy8gRm91bmRhdGlvbi5DaGVja1dhdGNoZXJzID0gY2hlY2tXYXRjaGVycztcbkZvdW5kYXRpb24uSUhlYXJZb3UgPSBjaGVja0xpc3RlbmVycztcbi8vIEZvdW5kYXRpb24uSVNlZVlvdSA9IHNjcm9sbExpc3RlbmVyO1xuLy8gRm91bmRhdGlvbi5JRmVlbFlvdSA9IGNsb3NlbWVMaXN0ZW5lcjtcblxufShqUXVlcnkpO1xuXG4vLyBmdW5jdGlvbiBkb21NdXRhdGlvbk9ic2VydmVyKGRlYm91bmNlKSB7XG4vLyAgIC8vICEhISBUaGlzIGlzIGNvbWluZyBzb29uIGFuZCBuZWVkcyBtb3JlIHdvcms7IG5vdCBhY3RpdmUgICEhISAvL1xuLy8gICB2YXIgdGltZXIsXG4vLyAgIG5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbXV0YXRlXScpO1xuLy8gICAvL1xuLy8gICBpZiAobm9kZXMubGVuZ3RoKSB7XG4vLyAgICAgLy8gdmFyIE11dGF0aW9uT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKCkge1xuLy8gICAgIC8vICAgdmFyIHByZWZpeGVzID0gWydXZWJLaXQnLCAnTW96JywgJ08nLCAnTXMnLCAnJ107XG4vLyAgICAgLy8gICBmb3IgKHZhciBpPTA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuLy8gICAgIC8vICAgICBpZiAocHJlZml4ZXNbaV0gKyAnTXV0YXRpb25PYnNlcnZlcicgaW4gd2luZG93KSB7XG4vLyAgICAgLy8gICAgICAgcmV0dXJuIHdpbmRvd1twcmVmaXhlc1tpXSArICdNdXRhdGlvbk9ic2VydmVyJ107XG4vLyAgICAgLy8gICAgIH1cbi8vICAgICAvLyAgIH1cbi8vICAgICAvLyAgIHJldHVybiBmYWxzZTtcbi8vICAgICAvLyB9KCkpO1xuLy9cbi8vXG4vLyAgICAgLy9mb3IgdGhlIGJvZHksIHdlIG5lZWQgdG8gbGlzdGVuIGZvciBhbGwgY2hhbmdlcyBlZmZlY3RpbmcgdGhlIHN0eWxlIGFuZCBjbGFzcyBhdHRyaWJ1dGVzXG4vLyAgICAgdmFyIGJvZHlPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGJvZHlNdXRhdGlvbik7XG4vLyAgICAgYm9keU9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgeyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IHRydWUsIGNoYXJhY3RlckRhdGE6IGZhbHNlLCBzdWJ0cmVlOnRydWUsIGF0dHJpYnV0ZUZpbHRlcjpbXCJzdHlsZVwiLCBcImNsYXNzXCJdfSk7XG4vL1xuLy9cbi8vICAgICAvL2JvZHkgY2FsbGJhY2tcbi8vICAgICBmdW5jdGlvbiBib2R5TXV0YXRpb24obXV0YXRlKSB7XG4vLyAgICAgICAvL3RyaWdnZXIgYWxsIGxpc3RlbmluZyBlbGVtZW50cyBhbmQgc2lnbmFsIGEgbXV0YXRpb24gZXZlbnRcbi8vICAgICAgIGlmICh0aW1lcikgeyBjbGVhclRpbWVvdXQodGltZXIpOyB9XG4vL1xuLy8gICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICBib2R5T2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuLy8gICAgICAgICAkKCdbZGF0YS1tdXRhdGVdJykuYXR0cignZGF0YS1ldmVudHMnLFwibXV0YXRlXCIpO1xuLy8gICAgICAgfSwgZGVib3VuY2UgfHwgMTUwKTtcbi8vICAgICB9XG4vLyAgIH1cbi8vIH1cbiIsIid1c2Ugc3RyaWN0JztcblxuIWZ1bmN0aW9uKCQpIHtcblxuLyoqXG4gKiBSZXNwb25zaXZlQWNjb3JkaW9uVGFicyBtb2R1bGUuXG4gKiBAbW9kdWxlIGZvdW5kYXRpb24ucmVzcG9uc2l2ZUFjY29yZGlvblRhYnNcbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwua2V5Ym9hcmRcbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLnV0aWwudGltZXJBbmRJbWFnZUxvYWRlclxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udXRpbC5tb3Rpb25cbiAqIEByZXF1aXJlcyBmb3VuZGF0aW9uLmFjY29yZGlvblxuICogQHJlcXVpcmVzIGZvdW5kYXRpb24udGFic1xuICovXG5cbmNsYXNzIFJlc3BvbnNpdmVBY2NvcmRpb25UYWJzIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgYSByZXNwb25zaXZlIGFjY29yZGlvbiB0YWJzLlxuICAgKiBAY2xhc3NcbiAgICogQGZpcmVzIFJlc3BvbnNpdmVBY2NvcmRpb25UYWJzI2luaXRcbiAgICogQHBhcmFtIHtqUXVlcnl9IGVsZW1lbnQgLSBqUXVlcnkgb2JqZWN0IHRvIG1ha2UgaW50byBhIGRyb3Bkb3duIG1lbnUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGVzIHRvIHRoZSBkZWZhdWx0IHBsdWdpbiBzZXR0aW5ncy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICB0aGlzLm9wdGlvbnMgID0gJC5leHRlbmQoe30sIHRoaXMuJGVsZW1lbnQuZGF0YSgpLCBvcHRpb25zKTtcbiAgICB0aGlzLnJ1bGVzID0gdGhpcy4kZWxlbWVudC5kYXRhKCdyZXNwb25zaXZlLWFjY29yZGlvbi10YWJzJyk7XG4gICAgdGhpcy5jdXJyZW50TXEgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFBsdWdpbiA9IG51bGw7XG4gICAgaWYgKCF0aGlzLiRlbGVtZW50LmF0dHIoJ2lkJykpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignaWQnLEZvdW5kYXRpb24uR2V0WW9EaWdpdHMoNiwgJ3Jlc3BvbnNpdmVhY2NvcmRpb250YWJzJykpO1xuICAgIH07XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gICAgdGhpcy5fZXZlbnRzKCk7XG5cbiAgICBGb3VuZGF0aW9uLnJlZ2lzdGVyUGx1Z2luKHRoaXMsICdSZXNwb25zaXZlQWNjb3JkaW9uVGFicycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBNZW51IGJ5IHBhcnNpbmcgdGhlIGNsYXNzZXMgZnJvbSB0aGUgJ2RhdGEtcmVzcG9uc2l2ZS1hY2NvcmRpb24tdGFicycgYXR0cmlidXRlIG9uIHRoZSBlbGVtZW50LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0KCkge1xuICAgIC8vIFRoZSBmaXJzdCB0aW1lIGFuIEludGVyY2hhbmdlIHBsdWdpbiBpcyBpbml0aWFsaXplZCwgdGhpcy5ydWxlcyBpcyBjb252ZXJ0ZWQgZnJvbSBhIHN0cmluZyBvZiBcImNsYXNzZXNcIiB0byBhbiBvYmplY3Qgb2YgcnVsZXNcbiAgICBpZiAodHlwZW9mIHRoaXMucnVsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgcnVsZXNUcmVlID0ge307XG5cbiAgICAgIC8vIFBhcnNlIHJ1bGVzIGZyb20gXCJjbGFzc2VzXCIgcHVsbGVkIGZyb20gZGF0YSBhdHRyaWJ1dGVcbiAgICAgIGxldCBydWxlcyA9IHRoaXMucnVsZXMuc3BsaXQoJyAnKTtcblxuICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGV2ZXJ5IHJ1bGUgZm91bmRcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHJ1bGUgPSBydWxlc1tpXS5zcGxpdCgnLScpO1xuICAgICAgICBsZXQgcnVsZVNpemUgPSBydWxlLmxlbmd0aCA+IDEgPyBydWxlWzBdIDogJ3NtYWxsJztcbiAgICAgICAgbGV0IHJ1bGVQbHVnaW4gPSBydWxlLmxlbmd0aCA+IDEgPyBydWxlWzFdIDogcnVsZVswXTtcblxuICAgICAgICBpZiAoTWVudVBsdWdpbnNbcnVsZVBsdWdpbl0gIT09IG51bGwpIHtcbiAgICAgICAgICBydWxlc1RyZWVbcnVsZVNpemVdID0gTWVudVBsdWdpbnNbcnVsZVBsdWdpbl07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5ydWxlcyA9IHJ1bGVzVHJlZTtcbiAgICB9XG5cbiAgICB0aGlzLl9nZXRBbGxPcHRpb25zKCk7XG5cbiAgICBpZiAoISQuaXNFbXB0eU9iamVjdCh0aGlzLnJ1bGVzKSkge1xuICAgICAgdGhpcy5fY2hlY2tNZWRpYVF1ZXJpZXMoKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0QWxsT3B0aW9ucygpIHtcbiAgICAvL2dldCBhbGwgZGVmYXVsdHMgYW5kIG9wdGlvbnNcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLmFsbE9wdGlvbnMgPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gTWVudVBsdWdpbnMpIHtcbiAgICAgIGlmIChNZW51UGx1Z2lucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHZhciBvYmogPSBNZW51UGx1Z2luc1trZXldO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBkdW1teVBsdWdpbiA9ICQoJzx1bD48L3VsPicpO1xuICAgICAgICAgIHZhciB0bXBQbHVnaW4gPSBuZXcgb2JqLnBsdWdpbihkdW1teVBsdWdpbixfdGhpcy5vcHRpb25zKTtcbiAgICAgICAgICBmb3IgKHZhciBrZXlLZXkgaW4gdG1wUGx1Z2luLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmICh0bXBQbHVnaW4ub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXlLZXkpICYmIGtleUtleSAhPT0gJ3pmUGx1Z2luJykge1xuICAgICAgICAgICAgICB2YXIgb2JqT2JqID0gdG1wUGx1Z2luLm9wdGlvbnNba2V5S2V5XTtcbiAgICAgICAgICAgICAgX3RoaXMuYWxsT3B0aW9uc1trZXlLZXldID0gb2JqT2JqO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0bXBQbHVnaW4uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGUpIHtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyBldmVudHMgZm9yIHRoZSBNZW51LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ldmVudHMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICQod2luZG93KS5vbignY2hhbmdlZC56Zi5tZWRpYXF1ZXJ5JywgZnVuY3Rpb24oKSB7XG4gICAgICBfdGhpcy5fY2hlY2tNZWRpYVF1ZXJpZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhlIGN1cnJlbnQgc2NyZWVuIHdpZHRoIGFnYWluc3QgYXZhaWxhYmxlIG1lZGlhIHF1ZXJpZXMuIElmIHRoZSBtZWRpYSBxdWVyeSBoYXMgY2hhbmdlZCwgYW5kIHRoZSBwbHVnaW4gbmVlZGVkIGhhcyBjaGFuZ2VkLCB0aGUgcGx1Z2lucyB3aWxsIHN3YXAgb3V0LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGVja01lZGlhUXVlcmllcygpIHtcbiAgICB2YXIgbWF0Y2hlZE1xLCBfdGhpcyA9IHRoaXM7XG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggcnVsZSBhbmQgZmluZCB0aGUgbGFzdCBtYXRjaGluZyBydWxlXG4gICAgJC5lYWNoKHRoaXMucnVsZXMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKEZvdW5kYXRpb24uTWVkaWFRdWVyeS5hdExlYXN0KGtleSkpIHtcbiAgICAgICAgbWF0Y2hlZE1xID0ga2V5O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTm8gbWF0Y2g/IE5vIGRpY2VcbiAgICBpZiAoIW1hdGNoZWRNcSkgcmV0dXJuO1xuXG4gICAgLy8gUGx1Z2luIGFscmVhZHkgaW5pdGlhbGl6ZWQ/IFdlIGdvb2RcbiAgICBpZiAodGhpcy5jdXJyZW50UGx1Z2luIGluc3RhbmNlb2YgdGhpcy5ydWxlc1ttYXRjaGVkTXFdLnBsdWdpbikgcmV0dXJuO1xuXG4gICAgLy8gUmVtb3ZlIGV4aXN0aW5nIHBsdWdpbi1zcGVjaWZpYyBDU1MgY2xhc3Nlc1xuICAgICQuZWFjaChNZW51UGx1Z2lucywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgX3RoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3ModmFsdWUuY3NzQ2xhc3MpO1xuICAgIH0pO1xuXG4gICAgLy8gQWRkIHRoZSBDU1MgY2xhc3MgZm9yIHRoZSBuZXcgcGx1Z2luXG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyh0aGlzLnJ1bGVzW21hdGNoZWRNcV0uY3NzQ2xhc3MpO1xuXG4gICAgLy8gQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBuZXcgcGx1Z2luXG4gICAgaWYgKHRoaXMuY3VycmVudFBsdWdpbikge1xuICAgICAgLy9kb24ndCBrbm93IHdoeSBidXQgb24gbmVzdGVkIGVsZW1lbnRzIGRhdGEgemZQbHVnaW4gZ2V0J3MgbG9zdFxuICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQbHVnaW4uJGVsZW1lbnQuZGF0YSgnemZQbHVnaW4nKSAmJiB0aGlzLnN0b3JlemZEYXRhKSB0aGlzLmN1cnJlbnRQbHVnaW4uJGVsZW1lbnQuZGF0YSgnemZQbHVnaW4nLHRoaXMuc3RvcmV6ZkRhdGEpO1xuICAgICAgdGhpcy5jdXJyZW50UGx1Z2luLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5faGFuZGxlTWFya3VwKHRoaXMucnVsZXNbbWF0Y2hlZE1xXS5jc3NDbGFzcyk7XG4gICAgdGhpcy5jdXJyZW50UGx1Z2luID0gbmV3IHRoaXMucnVsZXNbbWF0Y2hlZE1xXS5wbHVnaW4odGhpcy4kZWxlbWVudCwge30pO1xuICAgIHRoaXMuc3RvcmV6ZkRhdGEgPSB0aGlzLmN1cnJlbnRQbHVnaW4uJGVsZW1lbnQuZGF0YSgnemZQbHVnaW4nKTtcblxuICB9XG5cbiAgX2hhbmRsZU1hcmt1cCh0b1NldCl7XG4gICAgdmFyIF90aGlzID0gdGhpcywgZnJvbVN0cmluZyA9ICdhY2NvcmRpb24nO1xuICAgIHZhciAkcGFuZWxzID0gJCgnW2RhdGEtdGFicy1jb250ZW50PScrdGhpcy4kZWxlbWVudC5hdHRyKCdpZCcpKyddJyk7XG4gICAgaWYgKCRwYW5lbHMubGVuZ3RoKSBmcm9tU3RyaW5nID0gJ3RhYnMnO1xuICAgIGlmIChmcm9tU3RyaW5nID09PSB0b1NldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH07XG5cbiAgICB2YXIgdGFic1RpdGxlID0gX3RoaXMuYWxsT3B0aW9ucy5saW5rQ2xhc3M/X3RoaXMuYWxsT3B0aW9ucy5saW5rQ2xhc3M6J3RhYnMtdGl0bGUnO1xuICAgIHZhciB0YWJzUGFuZWwgPSBfdGhpcy5hbGxPcHRpb25zLnBhbmVsQ2xhc3M/X3RoaXMuYWxsT3B0aW9ucy5wYW5lbENsYXNzOid0YWJzLXBhbmVsJztcblxuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQXR0cigncm9sZScpO1xuICAgIHZhciAkbGlIZWFkcyA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJy4nK3RhYnNUaXRsZSsnLFtkYXRhLWFjY29yZGlvbi1pdGVtXScpLnJlbW92ZUNsYXNzKHRhYnNUaXRsZSkucmVtb3ZlQ2xhc3MoJ2FjY29yZGlvbi1pdGVtJykucmVtb3ZlQXR0cignZGF0YS1hY2NvcmRpb24taXRlbScpO1xuICAgIHZhciAkbGlIZWFkc0EgPSAkbGlIZWFkcy5jaGlsZHJlbignYScpLnJlbW92ZUNsYXNzKCdhY2NvcmRpb24tdGl0bGUnKTtcblxuICAgIGlmIChmcm9tU3RyaW5nID09PSAndGFicycpIHtcbiAgICAgICRwYW5lbHMgPSAkcGFuZWxzLmNoaWxkcmVuKCcuJyt0YWJzUGFuZWwpLnJlbW92ZUNsYXNzKHRhYnNQYW5lbCkucmVtb3ZlQXR0cigncm9sZScpLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuJykucmVtb3ZlQXR0cignYXJpYS1sYWJlbGxlZGJ5Jyk7XG4gICAgICAkcGFuZWxzLmNoaWxkcmVuKCdhJykucmVtb3ZlQXR0cigncm9sZScpLnJlbW92ZUF0dHIoJ2FyaWEtY29udHJvbHMnKS5yZW1vdmVBdHRyKCdhcmlhLXNlbGVjdGVkJyk7XG4gICAgfWVsc2V7XG4gICAgICAkcGFuZWxzID0gJGxpSGVhZHMuY2hpbGRyZW4oJ1tkYXRhLXRhYi1jb250ZW50XScpLnJlbW92ZUNsYXNzKCdhY2NvcmRpb24tY29udGVudCcpO1xuICAgIH07XG5cbiAgICAkcGFuZWxzLmNzcyh7ZGlzcGxheTonJyx2aXNpYmlsaXR5OicnfSk7XG4gICAgJGxpSGVhZHMuY3NzKHtkaXNwbGF5OicnLHZpc2liaWxpdHk6Jyd9KTtcbiAgICBpZiAodG9TZXQgPT09ICdhY2NvcmRpb24nKSB7XG4gICAgICAkcGFuZWxzLmVhY2goZnVuY3Rpb24oa2V5LHZhbHVlKXtcbiAgICAgICAgJCh2YWx1ZSkuYXBwZW5kVG8oJGxpSGVhZHMuZ2V0KGtleSkpLmFkZENsYXNzKCdhY2NvcmRpb24tY29udGVudCcpLmF0dHIoJ2RhdGEtdGFiLWNvbnRlbnQnLCcnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJykuY3NzKHtoZWlnaHQ6Jyd9KTtcbiAgICAgICAgJCgnW2RhdGEtdGFicy1jb250ZW50PScrX3RoaXMuJGVsZW1lbnQuYXR0cignaWQnKSsnXScpLmFmdGVyKCc8ZGl2IGlkPVwidGFicy1wbGFjZWhvbGRlci0nK190aGlzLiRlbGVtZW50LmF0dHIoJ2lkJykrJ1wiPjwvZGl2PicpLnJlbW92ZSgpO1xuICAgICAgICAkbGlIZWFkcy5hZGRDbGFzcygnYWNjb3JkaW9uLWl0ZW0nKS5hdHRyKCdkYXRhLWFjY29yZGlvbi1pdGVtJywnJyk7XG4gICAgICAgICRsaUhlYWRzQS5hZGRDbGFzcygnYWNjb3JkaW9uLXRpdGxlJyk7XG4gICAgICB9KTtcbiAgICB9ZWxzZSBpZiAodG9TZXQgPT09ICd0YWJzJyl7XG4gICAgICB2YXIgJHRhYnNDb250ZW50ID0gJCgnW2RhdGEtdGFicy1jb250ZW50PScrX3RoaXMuJGVsZW1lbnQuYXR0cignaWQnKSsnXScpO1xuICAgICAgdmFyICRwbGFjZWhvbGRlciA9ICQoJyN0YWJzLXBsYWNlaG9sZGVyLScrX3RoaXMuJGVsZW1lbnQuYXR0cignaWQnKSk7XG4gICAgICBpZiAoJHBsYWNlaG9sZGVyLmxlbmd0aCkge1xuICAgICAgICAkdGFic0NvbnRlbnQgPSAkKCc8ZGl2IGNsYXNzPVwidGFicy1jb250ZW50XCI+PC9kaXY+JykuaW5zZXJ0QWZ0ZXIoJHBsYWNlaG9sZGVyKS5hdHRyKCdkYXRhLXRhYnMtY29udGVudCcsX3RoaXMuJGVsZW1lbnQuYXR0cignaWQnKSk7XG4gICAgICAgICRwbGFjZWhvbGRlci5yZW1vdmUoKTtcbiAgICAgIH1lbHNle1xuICAgICAgICAkdGFic0NvbnRlbnQgPSAkKCc8ZGl2IGNsYXNzPVwidGFicy1jb250ZW50XCI+PC9kaXY+JykuaW5zZXJ0QWZ0ZXIoX3RoaXMuJGVsZW1lbnQpLmF0dHIoJ2RhdGEtdGFicy1jb250ZW50JyxfdGhpcy4kZWxlbWVudC5hdHRyKCdpZCcpKTtcbiAgICAgIH07XG4gICAgICAkcGFuZWxzLmVhY2goZnVuY3Rpb24oa2V5LHZhbHVlKXtcbiAgICAgICAgdmFyIHRlbXBWYWx1ZSA9ICQodmFsdWUpLmFwcGVuZFRvKCR0YWJzQ29udGVudCkuYWRkQ2xhc3ModGFic1BhbmVsKTtcbiAgICAgICAgdmFyIGhhc2ggPSAkbGlIZWFkc0EuZ2V0KGtleSkuaGFzaC5zbGljZSgxKTtcbiAgICAgICAgdmFyIGlkID0gJCh2YWx1ZSkuYXR0cignaWQnKSB8fCBGb3VuZGF0aW9uLkdldFlvRGlnaXRzKDYsICdhY2NvcmRpb24nKTtcbiAgICAgICAgaWYgKGhhc2ggIT09IGlkKSB7XG4gICAgICAgICAgaWYgKGhhc2ggIT09ICcnKSB7XG4gICAgICAgICAgICAkKHZhbHVlKS5hdHRyKCdpZCcsaGFzaCk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBoYXNoID0gaWQ7XG4gICAgICAgICAgICAkKHZhbHVlKS5hdHRyKCdpZCcsaGFzaCk7XG4gICAgICAgICAgICAkKCRsaUhlYWRzQS5nZXQoa2V5KSkuYXR0cignaHJlZicsJCgkbGlIZWFkc0EuZ2V0KGtleSkpLmF0dHIoJ2hyZWYnKS5yZXBsYWNlKCcjJywnJykrJyMnK2hhc2gpO1xuICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHZhciBpc0FjdGl2ZSA9ICQoJGxpSGVhZHMuZ2V0KGtleSkpLmhhc0NsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgdGVtcFZhbHVlLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgJGxpSGVhZHMuYWRkQ2xhc3ModGFic1RpdGxlKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBpbnN0YW5jZSBvZiB0aGUgY3VycmVudCBwbHVnaW4gb24gdGhpcyBlbGVtZW50LCBhcyB3ZWxsIGFzIHRoZSB3aW5kb3cgcmVzaXplIGhhbmRsZXIgdGhhdCBzd2l0Y2hlcyB0aGUgcGx1Z2lucyBvdXQuXG4gICAqIEBmdW5jdGlvblxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50UGx1Z2luKSB0aGlzLmN1cnJlbnRQbHVnaW4uZGVzdHJveSgpO1xuICAgICQod2luZG93KS5vZmYoJy56Zi5SZXNwb25zaXZlQWNjb3JkaW9uVGFicycpO1xuICAgIEZvdW5kYXRpb24udW5yZWdpc3RlclBsdWdpbih0aGlzKTtcbiAgfVxufVxuXG5SZXNwb25zaXZlQWNjb3JkaW9uVGFicy5kZWZhdWx0cyA9IHt9O1xuXG4vLyBUaGUgcGx1Z2luIG1hdGNoZXMgdGhlIHBsdWdpbiBjbGFzc2VzIHdpdGggdGhlc2UgcGx1Z2luIGluc3RhbmNlcy5cbnZhciBNZW51UGx1Z2lucyA9IHtcbiAgdGFiczoge1xuICAgIGNzc0NsYXNzOiAndGFicycsXG4gICAgcGx1Z2luOiBGb3VuZGF0aW9uLl9wbHVnaW5zLnRhYnMgfHwgbnVsbFxuICB9LFxuICBhY2NvcmRpb246IHtcbiAgICBjc3NDbGFzczogJ2FjY29yZGlvbicsXG4gICAgcGx1Z2luOiBGb3VuZGF0aW9uLl9wbHVnaW5zLmFjY29yZGlvbiB8fCBudWxsXG4gIH1cbn07XG5cbi8vIFdpbmRvdyBleHBvcnRzXG5Gb3VuZGF0aW9uLnBsdWdpbihSZXNwb25zaXZlQWNjb3JkaW9uVGFicywgJ1Jlc3BvbnNpdmVBY2NvcmRpb25UYWJzJyk7XG5cbn0oalF1ZXJ5KTtcbiJdfQ==
