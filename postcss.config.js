module.exports = {
	plugins: [
		require( 'precss' ),
		require( 'autoprefixer' ),
		require( 'css-mqpacker' )(),
		require( 'cssnano' )( {
			preset: 'default'
		} )
	]
};
