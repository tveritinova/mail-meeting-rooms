
const ASSET_PATH = process.env.ASSET_PATH || '/';

const webpack = require('webpack');

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
    entry:  __dirname + '/js/index.jsx',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        publicPath: ASSET_PATH
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
	  rules: [
	    {
	      test: /\.jsx?/,
	      exclude: /node_modules/,
	      use: 'babel-loader'
	    },
	  ],
	},
	plugins: [
		new BundleAnalyzerPlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
	]
};
module.exports = config;