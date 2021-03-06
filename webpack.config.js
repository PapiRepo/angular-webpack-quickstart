'use strict';
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function makeWebpackConfig() {
    var config = {};

    config.entry = {
        vendor: ['angular', 'angular-ui-router', 'bootstrap', 'jquery'],
        app: './src/app/app.module.js'
    };

    config.resolve = {
        modulesDirectories: ['node_modules', 'src/app']
    };

    config.output = {
        path: './dist/',
        filename: '[name].bundle.js'
    };

    config.devtool = 'source-map';

    config.devServer = {
        inline: true
    };

    config.module = {
        loaders: [{
            test: /\.js/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file'
        }, {
            test: /\.html$/,
            loader: 'raw'
        }]
    };

    config.plugins = [];

    config.plugins.push(
        // Copy files from 'src/public' to 'dist/' directory
        new copyWebpackPlugin([{
            from: './src/public'
        }]),

        // Provide global jQuery (and others if needed, add here!) object needed by vendor libraries.
        // see: https://webpack.github.io/docs/list-of-plugins.html#provideplugin
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery" : "jquery"
        }),

        // Splitting modules into two files - all from vendors goes to vendor.bundle.js
        // see: https://webpack.github.io/docs/code-splitting.html#split-app-and-vendor-code
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),

        // Minimize and uglify code.
        // see: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );

    return config;
}();
