// ===================================================================================================
// this file configures the development web server
// which supports hot reloading and synchronized testing.
// More info on Browsersync's API: https://www.browsersync.io/docs/api
// More info on Browsersync's Configuration: https://www.browsersync.io/docs/options
// ===================================================================================================

// check node and npm version
require('../tools/nodeVersionCheck');

import config from '../config';

// initialize NODE_ENV
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

import browserSync from 'browser-sync';
// required for react-router browserHistory
// see https://github.com/BrowserSync/browser-sync/issues/204#issuecomment-102623643
import webpack from 'webpack';
import historyApiFallback from 'connect-history-api-fallback';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.conf.dev';

const bundler = webpack(webpackConfig);

// run Browsersync and use middleware for HMR
browserSync({
  port: config.dev.port,
  ui: {
    port: config.dev.uiport
  },
  server: {
    baseDir: config.dev.targetRoot,

    middleware: [
      historyApiFallback(),

      // https://webpack.js.org/guides/development/#using-webpack-dev-middleware
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,

        // These settings suppress noisy webpack output
        // so only errors are displayed to the console.
        noInfo: true,
        quiet: false,
        stats: {
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false
        },
      }),

      webpackHotMiddleware(bundler)
    ]
  },
  // no need to watch '*.js' here
  // webpack will take care of it for us,
  // including full page reloads if HMR won't work
  files: [
    'src/index.html'
  ]
});
