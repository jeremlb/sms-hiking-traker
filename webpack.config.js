var webpack = require('webpack');
var BowerWebpackPlugin = require("bower-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	entry: {
		app: ['./client/js/app.js'],
		// vendors: [
		// 	'angular'
		// ]
	},
	output: {
		path: __dirname + '/.build/',
		filename: 'bundle.js'
	},
	modules: {
		loaders: [
			// Extract css files
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
			{
		      test: /\.js$/,
		      exclude: /(node_modules|bower_components)/,
		      loader: 'babel', // 'babel-loader' is also a legal name to reference
		      query: {
		        presets: ['es2015']
		      }
		    }
		]
	},
	resolve: {
        modulesDirectories: ["node_modules", "bower_components"]
    },

    plugins: [
		new ExtractTextPlugin("[name].css"),
        new BowerWebpackPlugin({})
    ],

	devtool: 'source-map'
};
