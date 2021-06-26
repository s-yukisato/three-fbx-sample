const path = require('path');
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
    mode: "development",
    entry: '~/warriors.js',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: '../index.html',
        })
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'docs/'),
        inline: true,
        open: true
    }
});