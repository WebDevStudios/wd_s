/**
 * Make tables responsive again.
 *
 * @author Haris Zulfiqar, Corey Collins
 */

( function() {
	document.querySelectorAll( 'table' ).forEach( ( table ) => {
		const tableRow = table.querySelectorAll( 'tbody tr' ),
			tableHeaders = table.querySelectorAll( 'th' );

		tableRow.forEach( ( row ) => {
			const tableCell = row.querySelectorAll( 'td' );

			tableCell.forEach( ( cell, index ) => {
				if ( tableHeaders[ index ].textContent ) {
					cell.setAttribute( 'data-label', tableHeaders[ index ].textContent );
				}
			} );
		} );
	} );
}() );
