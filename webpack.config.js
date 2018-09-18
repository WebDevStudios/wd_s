'use strict';

const path = require( 'path' );
const CleanPlugin = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );

let webpackConfig = {

	entry: {
		main: './assets/scripts/index.js'
	},

	output: {
		filename: '[name].bundle.js',
		path: path.resolve( __dirname, './assets/dist' )
	},

	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'eslint-loader',
					options: {
						fix: true,
						failOnWarning: false,
						failonError: true
					}
				}
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|dist)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ]
					}
				}
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(jpg|png|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: './assets/images/'
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: './assets/fonts/'
						}
					}
				]
			}
		]
	},

	plugins: [
		new CleanPlugin( [ 'dist' ] ),
		new MiniCssExtractPlugin( {
			filename: '[name].css',
			chunkFilename: '[id].css'
		} ),
		new BrowserSyncPlugin(
			{
				host: 'localhost',
				port: 3000,
				proxy: 'http://localhost:2368',
				files: [
					{
						match: [
							'**/*.php',
							'./assets/*.*'
						],
						options: {
							ignored: './assets/bundles/*.*'
						}
					}
				]
			},
			{
				reload: true
			}
		),
		new StyleLintPlugin( {
			configFile: './stylelint.config.js',
			files: './assets/styles/*.scss',
			syntax: 'scss'
		} )
	],

	devtool: 'source-map'
};

module.exports = webpackConfig;
