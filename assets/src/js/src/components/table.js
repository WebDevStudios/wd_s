/**
 * Make tables responsive again.
 *
 * @author Haris Zulfiqar
 */
window.wdsTables = {};
( function( window, $, app ) {

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
			table: $( 'table' )
		};
	};

	// Combine all events
	app.bindEvents = function() {
		app.$c.window.on( 'load', app.addDataLabel );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.table.length;
	};

	// Adds data-label to td based on th.
	app.addDataLabel = function() {
		const table = app.$c.table;
		const tableHeaders = table.find( 'thead th' );
		const tableRow = table.find( 'tbody tr' );

		tableRow.each( function() {
			const td = $( this ).find( 'td' );

			td.each( function( index ) {
				if ( $( tableHeaders.get( index ) ) ) {
					$( this ).attr( 'data-label', $( tableHeaders.get( index ) ).text() );
				}
			} );
		} );

		return false;
	};

	// Engage
	$( app.init );

} ( window, jQuery, window.wdsTables ) );
