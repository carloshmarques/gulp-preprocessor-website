'use strict';
// List dependencies here

const { series } = require('gulp');
const gulp = require('gulp');
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const jshint = require('gulp-jshint');
const modernizr = require('gulp-modernizr');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');


/* in the future as the files go large, you might want to install
gulp-autoprefixer & gulp-concat
see documentation at:  https://www.npmjs.com/package/gulp-autoprefixer

/*
* Add your variables here
*
*/


var outputDir = "./dist/";
var inputDir = "./src/";

/*
 * by default gulp task are set to a development mode as seen on the line var env = process.env.NODE_ENV || 'development';
 * to run tasks in a production mode, type in terminal NODE_ENV=production and task ex: NODE_ENV=production gulp js
 *
 */
var env = process.env.NODE_ENV || 'development';


/// Create your functions here

/// js 
function js(cb) {
  gulp
  .src(inputDir + 'js/main.js')
  .pipe(plumber())
  .pipe(browserify({debug: env === 'development' }))
  .pipe(gulpif(env === 'production', uglify()))  
  .pipe(plumber.stop())
  .pipe(gulp.dest(outputDir + 'js'));

   cb();      
}

// js_hint to see errors on *.js files
function js_hint(cb) {
  gulp
  .src(outputDir + 'js/**/**/*.js')
  .pipe(plumber())
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(plumber.stop())

  cb();
}

// modernizr options
 function modernizer(cb){

  gulp
  .src(inputDir + 'js/modernizr.js')
  .pipe(plumber())
  .pipe(browserify({debug: env === 'development' }))
  .pipe(gulpif(env === 'production', uglify())) 
  .pipe(modernizr({
    'options': ['setClasses'],
    'tests': [
      'webworkers',
      [
        'cssgrid',
        'cssgridlegacy'
      ]
    ],
    excludeTests: ['csstransforms3d']
    })) 
  .pipe(gulpif(env === 'production', uglify())) 
  .pipe(plumber.stop())
  .pipe(gulp.dest(outputDir + 'js'))
  cb();
};

/// CSS tasks here
function styles(cb) {
  
  var config = {};
  if (env === 'development') {
  config.sourceComments = 'map';
  }
  if (env === 'production') {
    config.outputStyle = 'compressed';
    }
     gulp
     .src(inputDir + 'sass/main.scss')
     .pipe(plumber())
     .pipe(sourcemaps.init({loadMaps: true}))
     .pipe(sourcemaps.init({largeFile: true}))
     .pipe(sass(config))
     .pipe(sourcemaps.write())
     .pipe(plumber.stop())
     .pipe(gulp.dest(outputDir + 'css'))

  cb(); 
};

// minify images
function images(cb){
  gulp
  .src(inputDir + 'images/**/**/*.+(png|jpg|jpeg|gif|svg|ico)')
  .pipe(plumber())
  .pipe(cache(imagemin({ 
    interlaced: true,
    progressive: true,
    optimizationLevel: 7,
   })))
  .pipe(plumber.stop()) 
  .pipe(gulp.dest(outputDir + 'img'));

  cb();
};

/// Web Server & Watch tasks here
function watch(cb) {

  browserSync.init({

    server: outputDir

    });

  gulp.watch(inputDir + 'js/**/main.js', js).on('change', browserSync.reload);
  gulp.watch(inputDir + 'js/**/modernizr.js', modernizer).on('change', browserSync.reload);
  gulp.watch(inputDir + 'js/**/**/*.js', js_hint).on('change', browserSync.reload);
  gulp.watch(inputDir + 'sass/**/*.scss', styles).on('change', browserSync.reload);
  gulp.watch(inputDir + 'images/**/**/*.+(png|jpg|jpeg|gif|svg|ico)', images).on('change', browserSync.reload);
  //gulp.watch(inputDir + 'fonts/**/**/*.+(ttf|woff2|otf)', font).on('change', browserSync.reload);
  gulp.watch(outputDir + '*.html').on('change', browserSync.reload);

  cb();
};

/// ##############################################################################################################

// exports here
exports.js = js
exports.watch = watch
exports.styles = styles
exports.js_hint = js_hint
exports.modernizer = modernizer
exports.images = images

// set default task here
exports.default = series(
  watch
)

 function defaultTask(cb) {  
   /* defaultTask
      keep function defaultTask empty, add your tasks in the exports.default code block
      ex: exports.default(
        watch, styles, & whatever tasks you want to be fired up by default
      )
    */
   cb();
}

/*
 * by default gulp task are set to a development mode as seen on the line var env = process.env.NODE_ENV || 'development';
 * to run tasks in a production mode, type in terminal NODE_ENV=production and task ex: NODE_ENV=production gulp 
 * or NODE_ENV=development or just gulp + task
 */


