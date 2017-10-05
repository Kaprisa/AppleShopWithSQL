module.exports = () => {
	return {
		module: {
			rules: [
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/,
					use: {
						loader: 'url-loader',
						options: {
							name: 'fonts/[name]/[name].[ext]',
							limit: 10000
						}
					}
				}
			]
		}
	}
};