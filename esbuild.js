const autoprefixer = require( 'autoprefixer' );
const postCssPlugin = require( 'esbuild-postcss' );

const watch = process.argv.includes( '--watch' ) && {
	onRebuild( error ) {
		/* eslint-disable no-console */
		if ( error ) console.error( '[watch] build failed', error );
		else console.log( '[watch] build finished' );
		/* eslint-enable no-console */
	},
};

require( 'esbuild' )
	.build( {
		entryPoints: [ 'src/index.js' ],
		bundle: true,
		outdir: 'build',
		watch,
		minify: true,
		plugins: [
			postCssPlugin( {
				plugins: [ autoprefixer, require( 'tailwindcss' ) ],
			} ),
		],
	} )
	.catch( () => process.exit( 1 ) );
