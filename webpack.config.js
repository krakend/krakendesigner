const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require("webpack");


module.exports = {
	entry: './src/index.js',
	plugins: [
	new HtmlWebpackPlugin({
		template: './src/app/layout/layout.html'
	}),
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery"
	})
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'designer')
	}
};
