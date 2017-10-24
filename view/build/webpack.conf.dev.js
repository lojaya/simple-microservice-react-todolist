// ===================================================================================================
// This file is webpack configuration for development testing.
// More info on Webpack's Configuration: https://webpack.js.org/configuration/
// ===================================================================================================

import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import config from '../config';
import utils from '../tools/utils';

const context = utils.resolve('src');

export default {
    resolve: {
        extensions: ['*', '.js', '.jsx', '.json'],
        alias: {
            '@': context,
        }
    },
    // more info: https://webpack.js.org/guides/development/#using-source-maps
    // and https://webpack.js.org/configuration/devtool/#devtool
    devtool: 'eval-source-map',
    entry: [
        // must be first entry to properly set public path
        utils.resolve('./build/webpack-public-path.js'),
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?reload=true',

        // defining path seems necessary for this
        // to work consistently on Windows machines.
        utils.resolve('src/index.js')
    ],
    target: 'web',
    output: {
        // physical files are only output by the
        // production build task `npm run build`.
        path: config.build.targetRoot,
        filename: '[name].js',
        publicPath: config.dev.targetPublic
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': config.dev.env,
            __DEV__: true
        }),

        new webpack.HotModuleReplacementPlugin(),

        new webpack.NoEmitOnErrorsPlugin(),

        // create HTML file that includes references to bundled CSS and JS.
        new HtmlWebpackPlugin({
            template: utils.resolve('src/index.ejs'),
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            inject: true
        }),
        
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true,
            // set to false to see a list of every file being bundled.
            noInfo: true,
            options: {
                sassLoader: {
                   includePaths: [utils.resolve('src'), utils.resolve('scss')]
                },
                context: '/',
                postcss: () => [autoprefixer],
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }, {
                test: /\.eot(\?v=\d+.\d+.\d+)?$/,
                loader: 'file-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?mimetype=application/font-woff',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
                loader: 'url-loader?mimetype=application/octet-stream',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?mimetype=image/svg+xml',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.(jpe?g|png|gif)$/i,
                loader: 'file-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            }, {
                test: /\.ico$/,
                loader: 'file-loader?name=[name].[ext]'
            }, {
                test: /(\.css|\.scss|\.sass)$/,
                loaders: [
                    `style-loader?sourceMap=${config.dev.cssSourceMap}`,
                    `css-loader?importLoader=1&modules&localIdentName=[name]-[local]-[hash:base64:5]&minimize=false&sourceMap=${config.dev.cssSourceMap}`,
                    'postcss-loader',
                    'sass-loader?sourceMap'
                ]
            }
        ]
    }
};
