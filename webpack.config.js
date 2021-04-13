const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const SVGSpritemapPlugin = require( 'svg-spritemap-webpack-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const ImageminPlugin = require( 'imagemin-webpack-plugin' ).default;
const MiniCSSExtractPlugin = require( 'mini-css-extract-plugin' );
const ESLintPlugin = require( 'eslint-webpack-plugin' );

/**
 * Webpack config (Development mode)
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-scripts/#provide-your-own-webpack-config
 */
module.exports = {
	...defaultConfig,
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: '/node_modules',
				use: [
					MiniCSSExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.svg$/,
				use: [ '@svgr/webpack', 'url-loader' ],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'fonts/[name].[hash:8].[ext]',
						},
					},
				],
			},
		],
	},
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
		 * Uses Imagemin to clean SVGs.
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

		/**
		 * Clean build directory.
		 *
		 * @see https://www.npmjs.com/package/clean-webpack-plugin
		 */
		new CleanWebpackPlugin(),

		/**
		 * Report JS warnings and errors to the command line.
		 *
		 * @see https://www.npmjs.com/package/eslint-webpack-plugin
		 */
		new ESLintPlugin(),
	],
};
