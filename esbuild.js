const postCssPlugin = require( 'esbuild-postcss' );

const watch = process.argv.includes( '--watch' );

require( 'esbuild' )
	.build( {
		entryPoints: [ 'src/index.js' ],
		bundle: true,
		outdir: 'build',
		preserveSymlinks: true,
		watch,
		logLevel: 'info',
		minify: true,
		external: [ '*.svg', '*.png', '*.jpg', '*.jpeg', '*.gif' ],
		publicPath: 'build/images',
		plugins: [ postCssPlugin() ],
		sourcemap: 'inline',
	} )
	.catch( () => process.exit( 1 ) );
