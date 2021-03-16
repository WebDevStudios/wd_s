const plugins = [
	require( 'tailwindcss' ),
	require( 'autoprefixer' ),
];

// Include CSS Nano if production mode.
if ( 'production' === process.env.NODE_ENV ) {
	plugins.push(
		require( 'cssnano' )( {
			preset: 'default',
		} ),
	);
}

module.exports = {
	plugins,
};
