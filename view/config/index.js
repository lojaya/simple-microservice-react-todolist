import path from 'path';

module.exports = {
  build: {
    env: require('./prod.env'),
    port: 4000,
    uiport: 4001,
    targetRoot: path.resolve(__dirname, '../dist/'),
    targetAssets: 'static',
    targetPublic: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
  },
  dev: {
    env: require('./dev.env'),
    port: 3000,
    uiport: 3001,
    targetRoot: 'src',
    targetAssets: 'static',
    targetPublic: '/',
    proxy: {
      // proxy setting
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },
};
