const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const SVGSpritemapPlugin = require( 'svg-spritemap-webpack-plugin' );
const ImageminPlugin = require( 'imagemin-webpack-plugin' ).default;

/**
 * Webpack config (Development mode)
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-scripts/#provide-your-own-webpack-config
 */
module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins,

		/**
		 * Copy source files/directories to a build directory.
		 *
		 * @see https://www.npmjs.com/package/copy-webpack-plugin
		 */
		new CopyPlugin( {
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

		/**
		 * Generate an SVG sprite.
		 *
		 * @see https://github.com/cascornelissen/svg-spritemap-webpack-plugin
		 */
		new SVGSpritemapPlugin( 'src/images/icons/*.svg', {
			output: {
				filename: 'images/icons/sprite.svg',
			},
			sprite: {
				prefix: false,
			},
		} ),

		/**
		 * Uses Imagemin to compress SVG.
		 *
		 * @see https://www.npmjs.com/package/imagemin-webpack-plugin
		 */
		new ImageminPlugin( {
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
