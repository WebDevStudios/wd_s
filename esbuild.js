const postCssPlugin = require( 'esbuild-postcss' );
const { globPlugin } = require( 'esbuild-plugin-glob' );

const watch = process.argv.includes( '--watch' );

require( 'esbuild' )
	.build( {
		entryPoints: [
			'src/index.js',
			'src/critical.js',
			'./src/blocks/**/*/index.js',
		],
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
		plugins: [ postCssPlugin(), globPlugin() ],
		sourcemap: 'inline',
	} )
	.catch( () => process.exit( 1 ) );
