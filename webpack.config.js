const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    resolve: {
        fallback: {
            "path": require.resolve("path-browserify"),
            "http": require.resolve("stream-http"),
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "crypto": require.resolve("crypto-browserify"),
            "assert": require.resolve("assert/"),
            "util": require.resolve("util/"),
            "url": require.resolve("url/"),
            "querystring": require.resolve("querystring-es3"),
            "vm": require.resolve("vm-browserify"),
            process: require.resolve("process/browser"),
            "fs": false,
            "net": false,
            "async_hooks": false
        }
    },
    mode: "development",
    entry: "./src/index.js",
    devServer: {
        port: 8080,
        static: {
            directory: path.join(__dirname, "dist"),
        },
        open: true,
    },
    target: "web",
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [

        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'service-worker.js'), to: 'service-worker.js' }
            ],
        }),

        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
        new webpack.ProvidePlugin({
            process: "process/browser"
        })
    ],
};
