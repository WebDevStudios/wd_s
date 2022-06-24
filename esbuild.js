const postCssPlugin = require( 'esbuild-postcss' );
const glob = require( 'glob' );

const watch = process.argv.includes( '--watch' );

const blockDirs = glob.sync( './src/blocks/**/*/index.js' ),
	blockDirsArray = Object.values( blockDirs ),
	directoryFiles = [ './src/index.js', './src/critical.js' ];

require( 'esbuild' )
	.build( {
		entryPoints: blockDirsArray.concat( directoryFiles ),
		bundle: true,
		outdir: 'build',
		preserveSymlinks: true,
		watch,
		logLevel: 'info',
		minify: true,
		external: [
			'*.svg',
			'*.png',
			'*.jpg',
			'*.jpeg',
			'*.gif',
			'*.woff',
			'*.woff2',
		],
		publicPath: 'build/images',
		plugins: [ postCssPlugin() ],
		sourcemap: 'inline',
	} )
	.catch( () => process.exit( 1 ) );
