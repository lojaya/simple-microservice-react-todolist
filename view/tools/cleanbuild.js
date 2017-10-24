// This script cleans build directory
import rimraf from 'rimraf';
import fs from 'fs';
import config from '../config';

rimraf(config.build.targetRoot, error => {
    fs.mkdirSync(config.build.targetRoot);
});