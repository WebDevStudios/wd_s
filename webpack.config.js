const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const SVGSpritemapPlugin = require( 'svg-spritemap-webpack-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const ESLintPlugin = require( 'eslint-webpack-plugin' );
const StylelintPlugin = require( 'stylelint-webpack-plugin' );

/**
 * Webpack config (Development mode)
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-scripts/#provide-your-own-webpack-config
 */
module.exports = {
	...defaultConfig,
	entry: {
		index: './src/index.js',
		critical: './src/critical.js',
	},
	module: {
		rules: [
			{
				test: /\.(webp|png|jpe?g|gif)$/,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext]',
				},
			},
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: '/node_modules',
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'svg-transform-loader/encode-query',
					'sass-loader',
				],
			},
			{
				test: /\.svg$/,
				type: 'asset/inline',
				use: 'svg-transform-loader',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
		],
	},
	plugins: [
		...defaultConfig.plugins,

		new MiniCssExtractPlugin(),

		/**
		 * Copy source files/directories to a build directory.
		 *
		 * @see https://www.npmjs.com/package/copy-webpack-plugin
		 */
		new CopyPlugin( {
			patterns: [
				{
					from: '**/*.{jpg,jpeg,png,gif,svg}',
					to: 'images/[path][name][ext]',
					context: path.resolve( process.cwd(), 'src/images' ),
					noErrorOnMissing: true,
				},
				{
					from: '*.svg',
					to: 'images/icons/[name][ext]',
					context: path.resolve( process.cwd(), 'src/images/icons' ),
					noErrorOnMissing: true,
				},
				{
					from: '**/*.{woff,woff2,eot,ttf,otf}',
					to: 'fonts/[path][name][ext]',
					context: path.resolve( process.cwd(), 'src/fonts' ),
					noErrorOnMissing: true,
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
		 * Clean build directory.
		 *
		 * @see https://www.npmjs.com/package/clean-webpack-plugin
		 */
		new CleanWebpackPlugin( {
			cleanAfterEveryBuildPatterns: [ '!fonts/**', '!*.woff2' ],
		} ),

		/**
		 * Report JS warnings and errors to the command line.
		 *
		 * @see https://www.npmjs.com/package/eslint-webpack-plugin
		 */
		new ESLintPlugin(),

		/**
		 * Report css warnings and errors to the command line.
		 *
		 * @see https://www.npmjs.com/package/stylelint-webpack-plugin
		 */
		new StylelintPlugin(),
	],
};
