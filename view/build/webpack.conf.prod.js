// ===================================================================================================
// This file is webpack configuration for production build.
// For info on how we're generating bundles with hashed filenames for cache busting
// https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.w99i89nsz
// More info on Webpack's Configuration: https://webpack.js.org/configuration/
// ===================================================================================================

import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import WebpackMd5Hash from 'webpack-md5-hash';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';

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
    // more info: https://webpack.js.org/guides/production/#source-mapping
    // and https://webpack.js.org/configuration/devtool/
    devtool: config.build.productionSourceMap ? 'source-map' : false,
    entry: utils.resolve('src/index.js'),
    target: 'web',
    output: {
        path: config.build.targetRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        publicPath: config.build.targetPublic,
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        // hash the files using MD5 so that their
        // names change when the content changes.
        new WebpackMd5Hash(),

        // tells React to build in prod mode.
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': config.build.env,
            __DEV__: false
        }),

        // generate an external css file with a hash in the filename
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),

        // Compress extracted CSS.
        // To dedupe duplicated CSS from different components.
        new OptimizeCSSPlugin({
          cssProcessorOptions: {
            safe: true
          }
        }),

        // generate HTML file that contains references to generated bundles.
        // https://github.com/jantimon/html-webpack-plugin#basic-usage
        new HtmlWebpackPlugin({
            template: utils.resolve('src/index-build.ejs'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
                removeAttributeQuotes: true
                // more options: https://github.com/kangax/html-minifier#options-quick-reference
            },
            inject: true,
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency',
            // to track JavaScript errors via TrackJS
            trackJSToken: '',
            // you can add custom options here if you need
            // to handle other custom logic in index.html
        }),

        // minify javascript
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            // set to false to see a list of every file being bundled.
            noInfo: true,
            options: {
                sassLoader: {
                    includePaths: [utils.resolve('src')]
                },
                context: '/',
                postcss: () => [autoprefixer],
            }
        }),

        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),

        // split vendor.js into its own file
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: function (module) {
            // any required modules inside node_modules are extracted to vendor
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.indexOf(
                utils.resolve('node_modules')
              ) === 0
            );
          }
        }),

        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest',
          chunks: ['vendor']
        }),

        // copy custom static assets
        new CopyWebpackPlugin([
          {
            from: utils.resolve('static'),
            to: config.build.targetAssets,
            ignore: ['.*', 'img/icon/*']
          }
        ])
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }, {
                test: /\.eot(\?v=\d+.\d+.\d+)?$/,
                loader: 'url-loader',
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
                loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader!sass-loader?sourceMap')
            }
        ]
    }
};
