// ===================================================================================================
// This file configures a web server for testing
// the production build on your machine.
// More info on Browsersync's API: https://www.browsersync.io/docs/api
// More info on Browsersync's Configuration: https://www.browsersync.io/docs/options
// ===================================================================================================

/* eslint-disable no-console */

// check node and npm version
require('../tools/nodeVersionCheck');

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import config from '../config';
import { chalk } from '../config/chalk';

console.log(chalk.proc('Opening production build...'));

browserSync({
  port: config.build.port,
  ui: {
    port: config.build.uiport
  },
  server: {
    baseDir: config.build.targetRoot
  },

  files: [
    'src/index-build.html'
  ],

  middleware: [historyApiFallback()]
});
