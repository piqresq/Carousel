const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
require("@babel/polyfill");

module.exports = {
    entry: ["@babel/polyfill",'./src/index.jsx'],
    output: {
        filename: "bundle.[hash].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new webpack.ProvidePlugin({
            React: 'react'
        })
    ],
    resolve: {
        modules: [__dirname, "src", "node_modules"],
        extensions: ["*",".js",".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: require.resolve("babel-loader"),
            },
            {
                test: /\.css?$/,
                use: ["style-loader","css-loader"],
            },
            {
                test: /\.mp4|mp3|png|jpe?g|svg|gif$/,
                use: ["file-loader"],
            },
        ],
    },
}
