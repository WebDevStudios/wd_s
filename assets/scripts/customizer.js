/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3000/wp-content/themes/wd_s/assets/scripts/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/scripts/customizer/customizer.js":
/*!*************************************************!*\
  !*** ./assets/scripts/customizer/customizer.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Show or hide the URL field in the Header Button options when the select option is changed.\n *\n * @author Corey Collins\n */\nwindow.CustomizerHeaderOptions = {};\n\n(function (window, $, app) {\n  // Constructor\n  app.init = function () {\n    app.cache();\n\n    if (app.meetsRequirements()) {\n      app.bindEvents();\n    }\n  }; // Cache all the things\n\n\n  app.cache = function () {\n    app.$c = {\n      window: $(window),\n      headerButtonSelect: $('#customize-control-_s_header_button select'),\n      headerLinkButton: $('#customize-control-_s_header_button_url'),\n      headerLinkText: $('#customize-control-_s_header_button_text')\n    };\n  }; // Combine all events\n\n\n  app.bindEvents = function () {\n    app.$c.window.on('load', app.showLinkField);\n    app.$c.headerButtonSelect.on('change', app.showHideLinkField);\n  }; // Do we meet the requirements?\n\n\n  app.meetsRequirements = function () {\n    return app.$c.headerButtonSelect.length;\n  }; // Show/Hide the Link field when the select value changes.\n\n\n  app.showHideLinkField = function () {\n    if ('link' === app.$c.headerButtonSelect.val()) {\n      app.$c.headerLinkButton.show();\n      app.$c.headerLinkText.show();\n    } else {\n      app.$c.headerLinkButton.hide();\n      app.$c.headerLinkText.hide();\n    }\n  }; // If the value is set and is already 'link', make sure the field is displayed.\n\n\n  app.showLinkField = function () {\n    if ('link' === app.$c.headerButtonSelect.val()) {\n      app.$c.headerLinkButton.show();\n      app.$c.headerLinkText.show();\n    }\n  }; // Engage\n\n\n  $(app.init);\n})(window, jQuery, window.CustomizerHeaderOptions);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc2NyaXB0cy9jdXN0b21pemVyL2N1c3RvbWl6ZXIuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvc2NyaXB0cy9jdXN0b21pemVyL2N1c3RvbWl6ZXIuanM/NTNmNyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNob3cgb3IgaGlkZSB0aGUgVVJMIGZpZWxkIGluIHRoZSBIZWFkZXIgQnV0dG9uIG9wdGlvbnMgd2hlbiB0aGUgc2VsZWN0IG9wdGlvbiBpcyBjaGFuZ2VkLlxuICpcbiAqIEBhdXRob3IgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuQ3VzdG9taXplckhlYWRlck9wdGlvbnMgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5nc1xuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0aGVhZGVyQnV0dG9uU2VsZWN0OiAkKCAnI2N1c3RvbWl6ZS1jb250cm9sLV9zX2hlYWRlcl9idXR0b24gc2VsZWN0JyApLFxuXHRcdFx0aGVhZGVyTGlua0J1dHRvbjogJCggJyNjdXN0b21pemUtY29udHJvbC1fc19oZWFkZXJfYnV0dG9uX3VybCcgKSxcblx0XHRcdGhlYWRlckxpbmtUZXh0OiAkKCAnI2N1c3RvbWl6ZS1jb250cm9sLV9zX2hlYWRlcl9idXR0b25fdGV4dCcgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuc2hvd0xpbmtGaWVsZCApO1xuXHRcdGFwcC4kYy5oZWFkZXJCdXR0b25TZWxlY3Qub24oICdjaGFuZ2UnLCBhcHAuc2hvd0hpZGVMaW5rRmllbGQgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuaGVhZGVyQnV0dG9uU2VsZWN0Lmxlbmd0aDtcblx0fTtcblxuXHQvLyBTaG93L0hpZGUgdGhlIExpbmsgZmllbGQgd2hlbiB0aGUgc2VsZWN0IHZhbHVlIGNoYW5nZXMuXG5cdGFwcC5zaG93SGlkZUxpbmtGaWVsZCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCAnbGluaycgPT09IGFwcC4kYy5oZWFkZXJCdXR0b25TZWxlY3QudmFsKCkgKSB7XG5cdFx0XHRhcHAuJGMuaGVhZGVyTGlua0J1dHRvbi5zaG93KCk7XG5cdFx0XHRhcHAuJGMuaGVhZGVyTGlua1RleHQuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhcHAuJGMuaGVhZGVyTGlua0J1dHRvbi5oaWRlKCk7XG5cdFx0XHRhcHAuJGMuaGVhZGVyTGlua1RleHQuaGlkZSgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBJZiB0aGUgdmFsdWUgaXMgc2V0IGFuZCBpcyBhbHJlYWR5ICdsaW5rJywgbWFrZSBzdXJlIHRoZSBmaWVsZCBpcyBkaXNwbGF5ZWQuXG5cdGFwcC5zaG93TGlua0ZpZWxkID0gZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoICdsaW5rJyA9PT0gYXBwLiRjLmhlYWRlckJ1dHRvblNlbGVjdC52YWwoKSApIHtcblx0XHRcdGFwcC4kYy5oZWFkZXJMaW5rQnV0dG9uLnNob3coKTtcblx0XHRcdGFwcC4kYy5oZWFkZXJMaW5rVGV4dC5zaG93KCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZVxuXHQkKCBhcHAuaW5pdCApO1xuXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy5DdXN0b21pemVySGVhZGVyT3B0aW9ucyApICk7XG4iXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQUtBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./assets/scripts/customizer/customizer.js\n");

/***/ }),

/***/ 1:
/*!*******************************************************!*\
  !*** multi ./assets/scripts/customizer/customizer.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./assets/scripts/customizer/customizer.js */"./assets/scripts/customizer/customizer.js");


/***/ })

/******/ });