const imagemin = require( 'imagemin' );
const imageminJpegtran = require( 'imagemin-jpegtran' );
const imageminPngquant = require( 'imagemin-pngquant' );
const imageminGifsicle = require( 'imagemin-gifsicle' );
const imageminWebp = require( 'imagemin-webp' );

const watch = process.argv.includes( '--watch' ),
	directory =
		true === watch
			? 'build/images/**/*.{jpg,jpeg,png,svg,gif,webp}'
			: 'src/images/**/*.{jpg,jpeg,png,svg,gif,webp}';

( async () => {
	await imagemin( [ directory ], {
		destination: 'build/images',
		preserveDirectories: true,
		plugins: [
			imageminJpegtran(),
			imageminPngquant( {
				quality: [ 0.6, 0.8 ],
			} ),
			imageminGifsicle(),
			imageminWebp(),
		],
	} );
} )();
