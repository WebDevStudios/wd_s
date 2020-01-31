/**
 * Video Playback Script.
 *
 * @author Jo Murgel, Corey Collins
 */

( function() {
	const videoButtons = document.querySelectorAll( '.video-toggle' );

	// Toggle playback on background videos.
	videoButtons.forEach( ( videoButton ) => {
		videoButton.addEventListener( 'click', toggleVideoPlayback );
	} );

	/**
	 * Toggle video playback when the button is pressed.
	 *
	 * @param {Object} event The triggered event.
	 *
	 * @since January 31, 2020
	 * @author Jo Murgel, Corey Collins
	 */
	function toggleVideoPlayback( event ) {
		const targetParent = event.target.parentNode,
			targetElement = targetParent.querySelector( '.video-background' );

		targetParent.classList.toggle( 'video-toggled' );

		if ( targetParent.classList.contains( 'video-toggled' ) ) {
			targetElement.pause();
		} else {
			targetElement.play();
		}
	}
}() );
