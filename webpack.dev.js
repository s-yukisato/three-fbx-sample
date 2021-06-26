const path = require('path');
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const outputPath = path.resolve(__dirname, 'docs/dev');
const common = require('./webpack.common')

module.exports = merge(common, {
    mode: "development",
    entry: '~/dragon.js',
    output: {
        path: outputPath,
        filename: 'bundle.js?[hash]' // バンドル後のファイル
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        })
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'docs/'),
        inline: true,
        open: true
    }
});