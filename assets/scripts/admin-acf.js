/**
 * Filter the colors available in the ACF Color Picker.
 *
 * @author Corey Collins
 */
window.ACFColorPickerOptions = {};
( function( window, $, app, acf ) {

	// Constructor
	app.init = function() {
		app.cache();

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function() {
		app.$c = {
			window: $( window ),
			acfFieldsContainer: $( '.acf-fields' ),
			colorPicker: $( '.wp-color-picker' ),
			colorPalette: [ '#21759b', '#fff9c0', '#000', '#fff', '#808080', '#111', '#333', '#666', '#929292', '#aaa', '#ccc', '#ddd', '#eee', '#f1f1f1' ]
		};
	};

	// Combine all events
	app.bindEvents = function() {

		// Only do things if color pickers exist.
		if ( acf.fields.color_picker ) {
			acf.add_action( 'load', app.setExistingPickers );
			acf.add_action( 'append', app.setNewPickers );
		}
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.acfFieldsContainer.length;
	};

	// Adjust our color pickers that already exist.
	app.setExistingPickers = function() {

		// Loop through each existing color picker on the page.
		app.$c.colorPicker.each( function() {

			// Find each existing color picker and update its pallete.
			$( this ).iris( 'option', 'palettes', app.$c.colorPalette );

			// Add a class to the parent container so we can modify the output.
			$( this ).parents( '.acf-field' ).addClass( 'color-picker-customizations' );
		} );
	};

	// Adjust new color pickers.
	app.setNewPickers = function( element ) {

		// Set the palette for a new color picker.
		$( element ).find( 'input.wp-color-picker' ).iris( 'option', 'palettes', app.$c.colorPalette );

		// Add a class to the parent container so we can modify the output.
		$( element ).parents( '.acf-field' ).addClass( 'color-picker-customizations' );
	};

	// Engage
	$( app.init );

}( window, jQuery, window.ACFColorPickerOptions, window.acf ) );
