/**
 * Webpack Config
 *
 * @package wd_s
 */
const webpack = require( 'webpack' );
const isProduction = (process.env.NODE_ENV === 'production');
const isWatch = ( process.env.NODE_ENV === 'watch' );

const watchEntry = {
	main: [
		'./assets/scripts/src/index.js',
		'webpack/hot/dev-server',
		'webpack-hot-middleware/client'
	]
};

const prodEntry = {
	main: [ './assets/scripts/src/index.js' ]
};

const config = {
	mode: isProduction ? 'production' : 'development',
	entry: isWatch ? watchEntry : prodEntry,
	output: {
		filename: isProduction ? 'project.min.js' : 'project.js',
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
						presets: [
							[
								"@babel/preset-env",
								{
									"targets": {
										"browsers": [ "last 2 versions" ]
									}
								}
							]
						]
					}
				}
			}
		]
	},
	plugins: [],
	devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map'
};

if ( isWatch ) {
	config.plugins.push( new webpack.HotModuleReplacementPlugin() );
}

module.exports = config;
