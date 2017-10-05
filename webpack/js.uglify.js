const webpack = require('webpack');
module.exports = function() {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                sourceMap: true,
                compress: {
                    warnings: false,
                },
                comments: false
            })
        ]
    };
};