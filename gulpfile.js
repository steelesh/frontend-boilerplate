const browsersync = require('browser-sync').create();
const { src, dest, watch, series } = require('gulp');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');

// Sass Task
function cssTask() {
  return src('./app/css/*.css', { sourcemaps: true })
    .pipe(concatCss('style.css'))
    .pipe(postcss([cssnano]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Javascript Task
function jsTask() {
  return src('./app/css/*.js', { sourcemaps: true })
    .pipe(concat('app.js'))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: './',
    },
    port: 8080,
    https: {
      key: '/Users/steele/Documents/Personal/Dev Tools/localhostkeys/localhost-key.pem',
      cert: '/Users/steele/Documents/Personal/Dev Tools/localhostkeys/localhost.pem',
    },
    browser: 'min',
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browsersyncReload);
  watch(['*.css', '*.js'], series(cssTask, jsTask, browsersyncReload));
}

// Default Gulp Task
exports.default = series(cssTask, jsTask, browsersyncServe, watchTask);
