const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const devserver = require('./webpack/devserver');
const sass = require('./webpack/sass');
const css = require('./webpack/css');
const extractCss = require('./webpack/css.extract');
const uglifyJs = require('./webpack/js.uglify');
const images = require('./webpack/images');
const fonts = require('./webpack/fonts');

const PATHS = {
    source: path.join(__dirname, 'public/assets'),
    build: path.join(__dirname, 'public/dist')
};

const common = merge([
    {
        entry: {
            'index': PATHS.source + '/js/index.js',
            'catalog': PATHS.source + '/js/catalog.js',
            'product': PATHS.source + '/js/product.js',
            'contacts': PATHS.source + '/js/contacts.js',
            'store': PATHS.source + '/js/store.js',
            'order': PATHS.source + '/js/order.js',
            'profile': PATHS.source + '/js/profile.js',
            'admin': PATHS.source + '/js/admin.js',
            'employee': PATHS.source + '/js/employee.js',
            'error': PATHS.source + '/js/error.js'
        },
        output: {
            path: PATHS.build,
            filename: 'js/[name].js'
        },
        devtool: 'cheap-eval-source-map',
        plugins: [
            new CleanWebpackPlugin(['public/dist']),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                chunks: ['index', 'catalog', 'product', 'contacts']
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common2',
                chunks: ['order', 'profile', 'store', 'employee']
            })
        ],
    },
    images(),
    fonts()
]);


module.exports = function(env) {
    if (env === 'production'){
        return merge([
            common,
            extractCss(),
            uglifyJs()
        ]);
    }
    if (env === 'development'){
        return merge([
            common,
            devserver(),
            sass(),
            css()
        ])
    }
};