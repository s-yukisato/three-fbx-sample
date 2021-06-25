const path = require('path');
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
    mode: "development",
    ntry: './src/sample.dev.js',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'docs/'),
        inline: true,
        open: true
    }
});