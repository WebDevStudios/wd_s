const autoprefixer = require( 'autoprefixer' );
const postCssPlugin = require( 'esbuild-postcss' );
const postCssNested = require( 'postcss-nested' );

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
		entryPoints: [ 'src/tailwind.js', 'src/index.js' ],
		bundle: true,
		outdir: 'build',
		preserveSymlinks: true,
		watch,
		logLevel: 'info',
		minify: true,
		external: [ '*.svg', '*.png', '*.jpg', '*.jpeg', '*.gif' ],
		publicPath: 'build/images',
		plugins: [
			postCssPlugin( {
				plugins: [
					require( 'tailwindcss' ),
					autoprefixer,
					postCssNested,
				],
			} ),
		],
	} )
	.catch( () => process.exit( 1 ) );
