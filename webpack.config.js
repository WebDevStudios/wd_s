'use strict';

const webpack = require( 'webpack' );
const path = require( 'path' );
const CleanPlugin = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );
const SpritesmithPlugin = require('webpack-spritesmith');
const bourbon = require( 'bourbon' ).includePaths;
const neat = require( 'bourbon-neat' ).includePaths;

let webpackConfig = {

	entry: {
		main: './assets/scripts/index.js'
	},

	output: {
		filename: '[name].js',
		path: path.resolve( __dirname, './dist' )
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
					{ loader: 'resolve-url-loader' },
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							includePaths: [ bourbon, neat ]
						}
					}
				]
			},
			{
				test: /\.(jpg|png|gif|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name].[ext]',
							outputPath: path.resolve( __dirname, './dist/images' )
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name].[ext]',
							outputPath: path.resolve( __dirname, './dist/fonts' )
						}
					}
				]
			}
		]
	},

	plugins: [
        new SpritesmithPlugin(
			{
				src: {
					cwd: path.resolve( __dirname, 'assets/images/sprites' ),
					glob: '*.png'
				},
				target: {
					image: path.resolve( __dirname, 'assets/images/sprites.png' ),
					css: path.resolve( __dirname, 'assets/sass/base/_sprites.scss' )
				},
				apiOptions: {
					cssImageRef: 'sprites.png'
				}
			}
		),
		new webpack.ProvidePlugin( {
			$: 'jquery',
			jQuery: 'jquery'
		} ),
		new CleanPlugin( [ 'dist' ] ),
		new MiniCssExtractPlugin( {
			filename: 'style.css',
			chunkFilename: 'style.css'
		} ),
		new BrowserSyncPlugin(
			{
				host: 'localhost',
				port: 3000,
				proxy: 'https://testing.test/',
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
			configFile: './.stylelintrc',
			files: './assets/sass/**',
			syntax: 'scss'
		} )
	],

	devtool: 'source-map'
};

module.exports = webpackConfig;
