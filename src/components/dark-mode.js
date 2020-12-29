/**
 * File: dark-mode.js
 *
 * Enables dark mode switching.
 */
function wdsDarkMode() {
	const darkModeToggles = document.querySelectorAll( '#color-mode-switch input' );

	darkModeToggles.forEach( ( toggle ) => {
		toggle.addEventListener( 'change', () => changeMode( toggle.value ) );
	} );

	document.addEventListener( 'DOMContentLoaded', checkDarkMode );

	// Listen for a change in the system settings.
	window.matchMedia( '(prefers-color-scheme: dark)' ).addEventListener( 'change', event => {
		changeSystemMode();
	});

	/**
	 * Change the mode when the user selects an option.
	 *
	 * @param {String} value The value of the current mode.
	 *
	 * @since November 19, 2020
	 * @author Corey Collins
	 */
	function changeMode( value ) {
		if ( 'dark' == value ) {
			document.querySelector( 'html' ).classList.add( 'dark' );
			localStorage.theme = 'dark';
		} else if ( 'light' == value ) {
			document.querySelector( 'html' ).classList.remove( 'dark' );
			localStorage.theme = 'light';
		} else {
			localStorage.removeItem( 'theme' );
			changeSystemMode();
		}
	}

	/**
	 * Check to see if we have a mode set on page load so the mode is always used.
	 *
	 * @since November 19, 2020
	 * @author Corey Collins
	 */
	function checkDarkMode() {
		if ( 'dark' === localStorage.theme ) {
			document.querySelector( '#dark-switch' ).checked = true;
			document.querySelector( 'html' ).classList.add( 'dark' );
			localStorage.theme = 'dark';
		} else if ( 'light' === localStorage.theme ) {
			document.querySelector( '#light-switch' ).checked = true;
			document.querySelector( 'html' ).classList.remove( 'dark' );
			localStorage.theme = 'light';
		} else {
			document.querySelector( '#system-switch' ).checked = true;
			changeSystemMode();
			localStorage.theme = 'system';
		}
	}

	/**
	 * Changes the color mode of the site when the system mode is changed, only if the system option is selected.
	 *
	 * @since November 19, 2020
	 * @author Corey Collins
	 */
	function changeSystemMode() {
		if ( true == document.querySelector( '#system-switch' ).checked ) {
			localStorage.removeItem( 'theme' );

			if ( window.matchMedia && window.matchMedia( '(prefers-color-scheme: dark)' ).matches ) {
				document.querySelector( 'html' ).classList.add( 'dark' );
			} else if ( window.matchMedia && window.matchMedia( '(prefers-color-scheme: light)' ).matches ) {
				document.querySelector( 'html' ).classList.remove( 'dark' );
			} else if ( window.matchMedia && window.matchMedia( '(prefers-color-scheme: no-preference)' ).matches ) {
				document.querySelector( 'html' ).classList.remove( 'dark' );
			}
		}
	}
}

// Fire off our function.
wdsDarkMode();
