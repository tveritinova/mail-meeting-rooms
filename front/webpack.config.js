
const ASSET_PATH = process.env.ASSET_PATH || '/';

const webpack = require('webpack');

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
	    { 
	      test: /\.css$/, 
	      use: 'css-loader',
	    },
	    {
	      test: /\.css$/,
	      loader: 'style!css',
	      //include: path.join(__dirname, 'node_modules')
	    }
	  ],
	}
};
module.exports = config;