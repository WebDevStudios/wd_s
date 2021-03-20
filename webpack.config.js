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
				{
					from: '*.svg',
					to: 'images/icons/[name].[ext]',
					context: path.resolve( process.cwd(), 'src/images/icons' ),
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
	],
};
