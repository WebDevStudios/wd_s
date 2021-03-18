module.exports = {
	plugins: [
		require( 'tailwindcss' ),
		require( 'autoprefixer' ),
		'production' === process.env.NODE_ENV ? require( 'cssnano' )(
			{ preset: 'default' }
		) : false,
	].filter( Boolean ),
};
