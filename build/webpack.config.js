const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = (env, { mode }) => {
    const isProduction = mode === "production";

    return {
        mode: isProduction ? 'production' : 'development',
        target: "node",
        node: false,
        devtool: isProduction ? 'none' : 'source-map',
        entry: "./app/index.ts",
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, '../bin'),
        },
        plugins: [
            new CopyPlugin([{
                from: './node_modules/shelljs/src/exec-child.js',
                to: ''
            }]),
            new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
        ],
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    use: [
                        { loader: 'babel-loader' },
                        { loader: 'ts-loader' }
                    ],
                    exclude: /node_modules/,
                }
            ]
        },
        optimization: isProduction
            ? {}
            : {
                minimizer: [
                    new TerserPlugin({
                        cache: true,
                        parallel: true,
                    })
                ]
            },
        resolve: {
            extensions: ['.js', '.ts', '.json'],
        },
        stats: {
            warnings: false
        },
        watch: !isProduction,
    }
}