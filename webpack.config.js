
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	entry: './src/index.js',
	plugins: [
	new HtmlWebpackPlugin({
		template: './src/app/layout.html'
	})
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'designer')
	}
};
