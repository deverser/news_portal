'use strict';

const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const gcssmq = require('gulp-group-css-media-queries');
//const includeFiles = require('gulp-include');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');


function browsersync() {
  browserSync.init({
    server: {
      baseDir: './public/',
      serveStaticOptions: {
        extensions: ['html'],
      },
    },
    port: 8080,
    ui: { port: 8081 },
    open: true,
  });
}

function views() {
  return src('./src/components/index.pug')
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(dest('./public'));
}

function styles() {
  return src('src/styles/styles.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({ grid: true }))
  .pipe(gcssmq())
  .pipe(dest('public/css/'))
  .pipe(browserSync.stream());
}


function scripts() {
  return src('./src/js/*.js')
//   .pipe(
//     includeFiles({
//       includePaths: './src/components/**/',
//     })
//   )
  .pipe(dest('./public/js/'))
  .pipe(browserSync.stream());
}


// function pages() {
//   return src('./src/pages/*.html')
//   .pipe(
//     includeFiles({
//       includePaths: './src/components/**/',
//     })
//   )
//   .pipe(dest('./public/'))
//   .pipe(browserSync.reload({ stream: true, }));
// }

function copyStyles() {
	return src('./src/styles/*.css')
	.pipe(dest('./public/css/'));
}

function copyFonts() {
  return src('./src/fonts/**/*')
  .pipe(dest('./public/fonts/'));
}

function copyImages() {
  return src('./src/images/**/*')
  .pipe(dest('./public/images/'));
}

function copyIcons() {
   return src('./src/icons/**/*')
  .pipe(dest('./public/icons/'));
}

async function copyResources() {
  copyFonts();
  copyImages();
  copyIcons();
  copyStyles();
}

async function clean() {
  return del.sync('./public/', { force: true });
}


function watchDev() {
  watch(['./src/js/script.js', './src/components/**/*.js'], scripts);
  watch(['./src/styles/styles.scss', './src/components/**/*.scss'], styles).on(
    'change',
    browserSync.reload
  );
  watch(['./src/components/index.pug', './src/components/**/*.pug'], views).on(
    'change',
    browserSync.reload
  );
  watch('./src/styles/*.css', copyStyles).on(
	'change',
	browserSync.reload
  );
}


exports.browsersync = browsersync;
exports.views = views;
exports.clean = clean;
exports.scripts = scripts;
exports.styles = styles;
//exports.pages = pages;
exports.copyResources = copyResources;

exports.default = parallel(
  clean,
  views,
  styles,
  scripts,
  copyResources,
  //pages,
  browsersync,
  watchDev
);

exports.build = series(
  clean,
  views,
  styles,
  scripts,
  copyResources,
  //pages
);