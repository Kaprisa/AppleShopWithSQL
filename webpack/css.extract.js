const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins() { return [ autoprefixer({ browsers: 'last 3 versions' }) ]; }
  }
};

module.exports = function(path){

	return {
		module: {
			rules: [
			{
				test: /\.sass$/,
				include: path,
				use: ExtractTextPlugin.extract({
					publicPath: '../',
					fallback: 'style-loader',
					use: ['css-loader', postcss, 'sass-loader'],
				}),
			},
			{
				test: /\.css$/,
				include: path,
				use: ExtractTextPlugin.extract({
					publicPath: '../',
					fallback: 'style-loader',
					use: 'css-loader',
				}),
			}
			]
		},
		plugins: [
			new ExtractTextPlugin('./css/[name].css'),
			new OptimizeCssAssetsPlugin({
	      assetNameRegExp: /\.css$/,
	      cssProcessor: require('cssnano'),
	      cssProcessorOptions: { discardComments: {removeAll: true } },
	      canPrint: true
    	})
		]
	}

};