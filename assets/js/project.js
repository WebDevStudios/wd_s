/**
 * Replace the <body> class "no-js" if javascript is enabled.
 */
document.body.className = document.body.className.replace( 'no-js', 'js' );
/**
 * Helps with accessibility for keyboard only users.
 */
( function() {
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	    is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	    is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var id = location.hash.substring( 1 ),
				element;

			if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
				return;
			}

			element = document.getElementById( id );

			if ( element ) {
				if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
})();
/**
 * After everything has loaded, add a "ready" class to <body>.
 */
window.Window_Ready = {};
( function( window, $, that ) {

	// Constructor
	that.init = function() {
		that.cache();
		that.bindEvents();
	};

	// Cache document elements
	that.cache = function() {
		that.$c = {
			window: $(window),
			body: $(document.body),
		};
	};

	// Combine all events
	that.bindEvents = function() {
		that.$c.window.load( that.addBodyClass );
	};

	// Add a class to <body>
	that.addBodyClass = function() {
		that.$c.body.addClass( 'ready' );
	};

	// Engage
	$( that.init );

})( window, jQuery, window.Window_Ready );