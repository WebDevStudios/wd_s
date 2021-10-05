const imagemin = require( 'imagemin' );
const imageminJpegtran = require( 'imagemin-jpegtran' );
const imageminPngquant = require( 'imagemin-pngquant' );

( async () => {
	await imagemin( [ 'src/images/**/*.{jpg,jpeg,png,svg,gif}' ], {
		destination: 'build/images',
		preserveDirectories: true,
		plugins: [
			imageminJpegtran(),
			imageminPngquant( {
				quality: [ 0.6, 0.8 ],
			} ),
		],
	} );
} )();
