/**
 * Fetch all icons from svg-icons directory
 * @param {string} resource SVG icon
 */
function requireAll( resource ) {
	resource.keys().forEach( resource );
}

requireAll( require.context( '../../images/svg-icons/', true, /\.svg$/ ) );
