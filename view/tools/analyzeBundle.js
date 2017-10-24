// eslint-disable-line no-console

import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import config from '../config';
import webpackConfig from '../build/webpack.conf.prod';

webpackConfig.plugins.push(new BundleAnalyzerPlugin());

process.env.NODE_ENV = config.build.env;

const compiler = webpack(webpackConfig);

compiler.run((error, stats) => {
  if (error) {
    throw new Error(error);
  }

  console.log(stats);
});
