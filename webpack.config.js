
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	entry: './src/index.js',
	plugins: [
	new HtmlWebpackPlugin({
		title: 'API Gateway',
		template: './src/app/html/layout.html'
	})
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'designer')
	}
};
