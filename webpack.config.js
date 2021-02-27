/**
 * wd_s Webpack config.
 *
 * This config includes the `@wordpress/scripts` defaults, along with
 * imagemin-webpack-plugin for optimizing images present in the theme.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-scripts/#provide-your-own-webpack-config
 */
const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const ImageminPlugin = require( 'imagemin-webpack-plugin' ).default;
const { mode } = defaultConfig;
const { sync: spawn } = require( 'cross-spawn' );
const { sync: resolveBin } = require( 'resolve-bin' );

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins,

		// Copy the all types of images present in `src/images` directory to build directory.
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: '**/*.{jpg,jpeg,png,gif,svg}',
					to: 'images/[path][name].[ext]',
					context: path.resolve( process.cwd(), 'src/images' ),
				},
			],
		} ),

		// This should run after CopyWebpackPlugin.
		// This plugin optimizes the images copied in the previous step build directory.
		new ImageminPlugin( {
			disable: 'production' !== mode,
			test: /\.(jpe?g|png|gif|svg)$/i,
			svgo: {
				plugins: [
					{ removeViewBox: false },
					{ removeDimensions: true },
					{
						removeAttrs: {
							attrs: '*:(stroke|fill):((?!^none$).)*',
						},
					},
				],
			},
		} ),

		// Ad-hoc plugin.
		{ apply: ( compiler ) => {

			// After we build.
			compiler.hooks.afterEmit.tap( 'wd_sAfterEmit', () => {

				// Run anything in `npm run theme` so pot files and sprites are generated.
				spawn(
					resolveBin( 'npm' ),
					[ 'run', 'theme' ],
					{
						stdio: 'inherit',
					}
				);
			} );
		} },
	],
};
