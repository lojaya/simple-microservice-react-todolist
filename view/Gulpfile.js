const gulp = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const concatcss = require('gulp-concat-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// Bundle Application CSS
gulp.task('css', () => {
  gulp.src([
    './assets/css/main.scss'
  ])
  .pipe(sass())
  .pipe(prefix(
    'last 1 version', '> 1%', 'ie 8', 'ie 7'
  ))
  .pipe(concatcss('app.css'))
  .pipe(cleancss({ compatibility: 'ie8' }))
  .pipe(gulp.dest('./static/css/'));
});

// Bundle CSS Libraries
gulp.task('styles', () => {
  gulp.src([
    './node_modules/toastr/toastr.scss',
    './node_modules/nprogress/nprogress.css'
  ])
  .pipe(sass())
  .pipe(prefix(
    'last 1 version', '> 1%', 'ie 8', 'ie 7'
  ))
  .pipe(concatcss('vendor.css'))
  .pipe(cleancss({ compatibility: 'ie8' }))
  .pipe(gulp.dest('./static/css/'));
});

// Bundle JavaScript Libraries
gulp.task('scripts', () => {
  gulp.src([
    './static/lib/jquery/dist/jquery.min.js',
    './static/lib/tether/dist/js/tether.min.js',
    './static/lib/bootstrap/dist/js/bootstrap.min.js',
    './static/lib/jquery.nicescroll/jquery.nicescroll.min.js',
    './static/lib/svg4everybody/dist/svg4everybody.min.js',
    './static/lib/imagesloaded/imagesloaded.pkgd.min.js'
  ])
  .pipe(uglify())
  .pipe(concat('libraries.js'))
  .pipe(gulp.dest('./static/js'));
});


gulp.task('default', ['styles', 'scripts']);
