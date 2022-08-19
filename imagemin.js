const imagemin = import( 'imagemin' );
const imageminJpegtran = require( 'imagemin-jpegtran' );
const imageminPngquant = require( 'imagemin-pngquant' );
const imageminGifsicle = require( 'imagemin-gifsicle' );
const imageminWebp = require( 'imagemin-webp' );
const { lstatSync, readdirSync } = require( 'fs' );
const { join } = require( 'path' );

const watch = process.argv.includes( '--watch' ),
	directory = true === watch ? 'build/images/' : 'src/images/';

/**
 * @description
 * Script for compressing all our static images.
 * Currently, reads images from static/{images_sub_folder}
 * and outputs them into static/compressed/{images_sub_folder}
 *
 * ie. static/images  => static/compressed/static/images
 * ie. static/img     => static/compressed/static/img
 */

/**
 * Output directory
 * Where all the compressed images will go
 */
const OUTPUT_DIR = 'build/images';

/**
 * List of input directories
 */
const INPUT_DIRS = [ directory ];

/**
 * Helper functions to get directories / sub-directories
 *
 * @param {string} source - the source directory to get sub-directories from
 * @see https://stackoverflow.com/a/40896897/4364074
 */
const isDirectory = ( source ) => lstatSync( source ).isDirectory();
const getDirectories = ( source ) =>
	readdirSync( source )
		.map( ( name ) => join( source, name ) )
		.filter( isDirectory );
const getDirectoriesRecursive = ( source ) => [
	source,
	...getDirectories( source )
		.map( getDirectoriesRecursive )
		.reduce( ( a, b ) => a.concat( b ), [] ),
];

try {
	( async () => {
		let imageDirs = [];

		INPUT_DIRS.map(
			( dirname ) =>
				( imageDirs = imageDirs.concat(
					getDirectoriesRecursive( dirname )
				) )
		);

		/**
		 * Loop through all subfolders, and recursively run imagemin,
		 * outputting to the same subfolders inside OUTPUT_DIR folder
		 */
		for ( const i in imageDirs ) {
			const dir = imageDirs[ i ];
			await imagemin(
				[ `${ dir }/*.{jpg,png,svg,gif}` ],
				join( OUTPUT_DIR, dir ),
				{
					plugins: [
						imageminJpegtran(),
						imageminPngquant( {
							quality: [ 0.6, 0.8 ],
						} ),
						imageminGifsicle(),
						imageminWebp(),
					],
				}
			);
		}
	} )();
} catch ( e ) {}
