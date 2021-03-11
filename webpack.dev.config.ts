import webpack from "webpack";
import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

const dotenv = require('dotenv').config({path:__dirname + '/.env'});

const config: webpack.Configuration = {
    mode: "development",
    output: {
        publicPath: "/",
    },
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "resolve-url-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jp(e*)g|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[hash]-[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|otf|eot|woff|woff2)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: "fonts",
                            name: '[name].[ext]',
                            esModule: false,
                        }
                    }
                ]
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html",
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({
            async: false
        }),
        new ESLintPlugin({
            extensions: ["js", "jsx", "ts", "tsx"],
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.parsed)
        })

    ],
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.join(__dirname, "build"),
        historyApiFallback: true,
        port: 4000,
        open: true,
        hot: true
    },
};

export default config;