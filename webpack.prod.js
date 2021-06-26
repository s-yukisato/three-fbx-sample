const path = require('path')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const outputPath = path.resolve(__dirname, 'docs/js');
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: "production",
    // entry: './src/prod/dragon.js',
    entry: './src/prod/dragon.js',
    output: {
        path: outputPath,
        filename: 'dragon.js?[hash]' // バンドル後のファイル
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: '../contents/dragon.html'
        }),
        // new HtmlWebpackPlugin({
        //     template: './src/index.html',
        //     filename: '../contents/warriors.html'
        // })
    ]
});