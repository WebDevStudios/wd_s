/**
 * Webpack Config
 *
 * @package wd_s
 */
const webpack = require( 'webpack' );
const isDev = (process.env.NODE_ENV !== 'production');

const devEntry = {
	main: [
		'./assets/scripts/src/index.js',
		'webpack/hot/dev-server',
		'webpack-hot-middleware/client'
	]
};

const prodEntry = {
	main: './assets/scripts/src/index.js'
};

const config = {
	mode: isDev ? 'development' : 'production',
	entry: isDev ? devEntry : prodEntry,
	output: {
		filename: isDev ? 'project.js' : 'project.min.js',
	},
	devServer: {

		hot: true,

	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ]
					}
				}
			}
		]
	},
	plugins: [],
	devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map'
};

if ( isDev ) {
	config.plugins.push( new webpack.HotModuleReplacementPlugin() );
}

module.exports = config;
