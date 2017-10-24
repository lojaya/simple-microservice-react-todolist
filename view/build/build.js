// ===================================================================================================
// Bundler for build version
// More info on Webpack's Node API: https://webpack.js.org/api/node
// chalk: https://www.npmjs.com/package/chalk
// rimraf: https://www.npmjs.com/package/rimraf
// ===================================================================================================

/* eslint-disable no-console */

// check node and npm version
require('../tools/nodeVersionCheck');

// this assures React is built in production mode
// and that the Babel dev config doesn't apply.
process.env.NODE_ENV = 'production';

import rm from 'rimraf';
import path from 'path';
import webpack from 'webpack';
import config from '../config';
import { chalk } from '../config/chalk';
import webpackConfig from './webpack.conf.prod';

console.log(chalk.proc('Bundling minified codes. Please wait for a moment...'));

rm(path.join(config.build.targetRoot, config.build.targetAssets), err => {
  if (err){
    // Stop if a fatal error occurred.
    console.log(chalk.error(err));
    return 1;
  }
  webpack(webpackConfig).run((error, stats) => {
    if (error) {
      // Stop if a fatal error occurred.
      console.log(chalk.error(error));
      return 1;
    }

    const jsonStats = stats.toJson();

    if (jsonStats.hasErrors) {
      return jsonStats.errors.map(error => console.log(chalk.error(error)));
    }

    if (jsonStats.hasWarnings) {
      console.log(chalk.warn('Webpack generated the following warnings: '));
      jsonStats.warnings.map(warning => console.log(chalk.warn(warning)));
    }

    console.log(`Webpack stats: ${stats}`);

    console.log(chalk.success('Your app is successfully compiled in production mode!'));

    return 0;
  });
});
