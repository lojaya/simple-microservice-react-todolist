import path from 'path';
import config from '../config';

exports.assetsPath = function (_path) {
    const targetAssets = process.env.NODE_ENV === 'production'
      ? config.build.targetAssets
      : config.dev.targetAssets;
    return path.posix.join(targetAssets, _path);
};

exports.resolve = function (dir) {
    return path.join(__dirname, '..', dir);
};