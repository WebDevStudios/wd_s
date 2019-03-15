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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/scripts/scaffolding/scaffolding.js":
/*!***************************************************!*\
  !*** ./assets/scripts/scaffolding/scaffolding.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * WDS Scaffolding.\n */\nwindow.wdsScaffolding = {};\n\n(function (window, $, app) {\n  // Constructor.\n  app.init = function () {\n    app.cache();\n\n    if (app.meetsRequirements()) {\n      app.bindEvents();\n    }\n  }; // Cache elements.\n\n\n  app.cache = function () {\n    app.$c = {\n      window: $(window),\n      scaffoldingButton: $('.scaffolding-button'),\n      scaffoldingContent: $('.scaffolding-document-content')\n    };\n  }; // Combine all events.\n\n\n  app.bindEvents = function () {\n    app.$c.scaffoldingButton.on('click', app.toggleScaffoldingContent);\n  }; // Do we meet the requirements?\n\n\n  app.meetsRequirements = function () {\n    return app.$c.scaffoldingButton.length;\n  };\n  /**\n   * Toggle the display of the scaffolding documentation content.\n   *\n   * @author Carrie Forde\n   */\n\n\n  app.toggleScaffoldingContent = function () {\n    $(this).parent().siblings('.scaffolding-document-content').slideToggle('slow');\n  }; // Engage!\n\n\n  $(app.init);\n})(window, jQuery, window.wdsScaffolding);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc2NyaXB0cy9zY2FmZm9sZGluZy9zY2FmZm9sZGluZy5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9zY3JpcHRzL3NjYWZmb2xkaW5nL3NjYWZmb2xkaW5nLmpzPzljMjQiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBXRFMgU2NhZmZvbGRpbmcuXG4gKi9cbndpbmRvdy53ZHNTY2FmZm9sZGluZyA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgZWxlbWVudHMuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzY2FmZm9sZGluZ0J1dHRvbjogJCggJy5zY2FmZm9sZGluZy1idXR0b24nICksXG5cdFx0XHRzY2FmZm9sZGluZ0NvbnRlbnQ6ICQoICcuc2NhZmZvbGRpbmctZG9jdW1lbnQtY29udGVudCcgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5zY2FmZm9sZGluZ0J1dHRvbi5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZVNjYWZmb2xkaW5nQ29udGVudCApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5zY2FmZm9sZGluZ0J1dHRvbi5sZW5ndGg7XG5cdH07XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSB0aGUgZGlzcGxheSBvZiB0aGUgc2NhZmZvbGRpbmcgZG9jdW1lbnRhdGlvbiBjb250ZW50LlxuXHQgKlxuXHQgKiBAYXV0aG9yIENhcnJpZSBGb3JkZVxuXHQgKi9cblx0YXBwLnRvZ2dsZVNjYWZmb2xkaW5nQ29udGVudCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0JCggdGhpcyApLnBhcmVudCgpLnNpYmxpbmdzKCAnLnNjYWZmb2xkaW5nLWRvY3VtZW50LWNvbnRlbnQnICkuc2xpZGVUb2dnbGUoICdzbG93JyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzU2NhZmZvbGRpbmcgKSApO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTs7O0FBR0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7QUFLQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./assets/scripts/scaffolding/scaffolding.js\n");

/***/ }),

/***/ 2:
/*!*********************************************************!*\
  !*** multi ./assets/scripts/scaffolding/scaffolding.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./assets/scripts/scaffolding/scaffolding.js */"./assets/scripts/scaffolding/scaffolding.js");


/***/ })

/******/ });