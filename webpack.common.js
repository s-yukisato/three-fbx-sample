const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const outputPath = path.resolve(__dirname, 'docs/js');
const webpack = require('webpack');

module.exports = {
    output: {
        path: outputPath,
        filename: 'bundle.js?[hash]' // バンドル後のファイル
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: '../index.html',
        })
    ],

    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
        }
    },
}