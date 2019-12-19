/**
 * Show or hide the URL field in the Header Button options when the select option is changed.
 *
 * @author Corey Collins
 */

if ( ( 'complete' === document.readyState || 'loading' !== document.readyState ) && ! document.documentElement.doScroll ) {
	wdsCustomizer();
} else {
	document.addEventListener( 'DOMContentLoaded', wdsCustomizer );
}

function wdsCustomizer() {
	const headerButtonSelect = document.querySelector( '#customize-control-_s_header_button select' );

	if ( ! headerButtonSelect ) {
		return;
	}

	const headerLinkButton = document.querySelector( '#customize-control-_s_header_button_url' ),
		headerLinkText = document.querySelector( '#customize-control-_s_header_button_text' );

	headerButtonSelect.addEventListener( 'change', showHideLinkField );

	function showHideLinkField() {
		if ( 'link' === headerButtonSelect.value ) {
			headerLinkButton.style.display = '';
			headerLinkText.style.display = '';
		} else {
			headerLinkButton.style.display = 'none';
			headerLinkText.style.display = 'none';
		}
	}
}
