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

	function toggleVideoPlayback( event ) {

		const targetParent = event.target.parentNode,
			targetElement = targetParent.querySelector( '.video-background' );

		targetParent.classList.toggle( 'video-toggled' );

		if ( targetParent.classList.contains( 'video-toggled' ) ) {
			console.log( 'toggled' );
			targetElement.pause();
		} else {
			console.log( 'not toggled' );
			targetElement.play();
		}
	}
}() );
