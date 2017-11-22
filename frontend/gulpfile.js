const gulp = require("gulp");
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const order = require("gulp-order");
const print = require('gulp-print');
const livereload = require('gulp-livereload');
const watch = require('gulp-watch');
const cssnano = require('gulp-cssnano');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('streamqueue');
const size = require('gulp-size');
const pug = require('gulp-pug');
const rename = require('gulp-rename');

const del = require('del');

const ts = require('gulp-typescript');

const tsConfig = {
  typescript: require("typescript"),
  module: "amd",
  lib: ["es2015", "dom"],
  sourceMap: true
};

const allImages = [
  './images/**'
]

const allFonts = [
  './node_modules/material-design-icons/iconfont/*.{eot,svg,ttf,woff,woff2}',
  './node_modules/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}'
]

const allCss = [ 
    './css/ui.css',
    './node_modules/angular-material/angular-material.css', 
    './node_modules/font-awesome/css/font-awesome.css',
    './components/**/**.css'
]

const allJs = ['_built/ts-components.js', 'components/**/*.js'];

const allPug = ['./components/**/**.pug', './../pug/legal/**.pug'];
const icons = './icons/*.svg';

function swallowError (error) {

  // If you want details of the error in the console
  console.log(error.toString())

  this.emit('end')
}

gulp.task('index', function(done){
    return gulp.src('./index.html')
          .on('error', swallowError)
          .pipe(gulp.dest('./../public/'))
          .pipe(livereload())
          .on("end", done);
})

gulp.task('pug', function(done){

  return gulp.src(allPug)
        // .pipe(print())
        .pipe(rename({dirname: ''}))
        .pipe(pug({ verbose : false }))
        .on('error', swallowError)
        .pipe(gulp.dest("./../public/templates/"))
        .pipe(livereload())
        .on("end", done);
  
});

gulp.task('css', function(done) {

  return gulp.src(allCss)
         //.pipe(print())
         .pipe(concat("three_d_repo.min.css"))
         .pipe(cssnano())
         .on('error', swallowError)
         .pipe(gulp.dest("./../public/dist/"))
         .pipe(livereload())
         .on("end", done);

});

gulp.task('clean', function(done){
  return del('./_built').then(function(){
    done();
  })
   
})

gulp.task('icons', function (done) {
  return gulp.src('./icons/*.svg')
    .on('error', swallowError)
    //.pipe(print())
    .pipe(gulp.dest('./../public/icons/'))
    .pipe(livereload())
    .on("end", done);
});

gulp.task('images', function(done) {
  return gulp.src(allImages)
        .on('error', swallowError)
        .pipe(gulp.dest('./../public/images/'))
        .pipe(livereload())
        .on("end", done);
});

gulp.task('fonts', function(done) {
  return gulp.src(allFonts)
        .on('error', swallowError)
        .pipe(gulp.dest('./../public/fonts/'))
        .pipe(livereload())
        .on("end", done);
});

gulp.task('unity', function(done) {
  return gulp.src("./unity/**")
        .on('error', swallowError)  
        .pipe(gulp.dest('./../public/unity/'))
        .on("end", done);
});

gulp.task('custom', function(done) {
  return gulp.src("./custom/**")
        .on('error', swallowError)  
        .pipe(gulp.dest('./../public/custom/'))
        .on("end", done);
});

gulp.task('manifest-file', function(done) {
  return gulp.src("./manifest.json")
    .on('error', swallowError)
    .pipe(gulp.dest('./../public/'))
    .on("end", done);
});

gulp.task('manifest-icons', function(done) {
  return gulp.src("./manifest-icons/**.png")
    .on('error', swallowError)
    .pipe(gulp.dest('./../public/manifest-icons/'))
    .on("end", done);
});


const sw = function(callback, verbose) {
  var swPrecache = require('sw-precache');
  var serviceWorkerName = "service-worker";
  console.log("Service workers");
  const dir = "../public/";
  swPrecache.write(path.join(dir, `${serviceWorkerName}.js`) , {
    staticFileGlobs: [
      `${dir}/index.html`,
      `${dir}/templates/.{html}`,
      `${dir}/dist/**/*.{js,css}`,
      `${dir}/fonts/**/*.{svg,eot,ttf,woff,woff2}`,
      `${dir}/icons/**/*.{svg}`,
      `${dir}/images/**/*.{png,jpg}`,
      `${dir}/unity/**/*.{js,html,data,mem,css,png,jpg}`,
    ],
    stripPrefix: `${dir}`,
    verbose: false,
  }, callback);
}

gulp.task('service-workers', function(callback) {
  sw(callback, true)
});

gulp.task('service-workers-dev', function(callback) {
  sw(callback, false)
});

// JavaScript
// We have one dev task and one production task because the time taken to do 
// minifcation + source maps is so long

// BUILD COMPONENTS

gulp.task("typescript-components", function(done){
   
  // COMPILE TYPESCRIPT TO AMD
  return gulp.src(['components/**/*.ts'])
    .pipe(ts(tsConfig))
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('./_built/amd/components/'))
    .on("end", done)

})

gulp.task("amd-components", function(done){

  // CREATE COMPONENTS (FROM TS COMPILED AMD)
  return gulp.src(["./entry-ts-components.js"])
    .pipe(sourcemaps.init())
    .pipe(webpack({
      output: {
        filename: 'ts-components.js',
      },
    }, require('webpack')))
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('./_built/'))
    .on("end", done)

});

gulp.task("tsc-amd-components", gulp.series("typescript-components", "amd-components"))
// BUILD DEPENDENCIES

gulp.task("typescript-globals", function(done) {
  
  // COMPILE TYPESCRIPT TO AMD
  return gulp.src(['globals/*.ts'])
    .pipe(ts(tsConfig))
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('./_built/amd/globals/'))
    .on("end", done)

});

gulp.task("amd-dependencies", function(done){

    // CREATE DEPENDENCIES 
    return gulp.src(['./entry.js'])
      .pipe(sourcemaps.init())
      .pipe(webpack({
        output: {
          filename: 'dependencies.js',
        },
      }, require('webpack')))
      .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
      .pipe(gulp.dest('./_built/'))
      .on("end", done)

});

gulp.task("tsc-amd-dependencies", gulp.series("typescript-globals", "amd-dependencies"));

gulp.task('javascript-build', function(done){
  
  const jsOrder = [
    '_built/dependencies.js',
    'components/entry/js/entry.js',
    '_built/ts-components.js',
    'components/**/*.js',
    'bootstrap.js'
  ];

  const js = [
    '_built/dependencies.js',
    '_built/ts-components.js',
    'components/**/*.js',
    'bootstrap.js'
  ];

  return gulp.src(js)
          .pipe(order(jsOrder, { base: './' }))
          .pipe(print())
          .pipe(sourcemaps.init())
          .pipe(concat("three_d_repo.min.js"))
          .pipe(uglify({mangle: false})) // Mangle causes error for some reason
            .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
          .pipe(size())
          .pipe(sourcemaps.write('./maps'))
          .pipe(gulp.dest("./../public/dist/"))
          .on("end", done)
    
});

gulp.task('javascript-build-dev', function(done){

  const jsOrder = [
    '_built/dependencies.js',
    'components/entry/js/entry.js',
    '_built/ts-components.js',
    'components/**/*.js',
    'bootstrap.js'
  ];

  const js = [
    '_built/dependencies.js',
    '_built/ts-components.js',
    'components/**/*.js',
    'bootstrap.js'
  ];

  return gulp.src(js)
          .pipe(order(jsOrder, { base: './' }))
          .pipe(sourcemaps.init())
          .pipe(concat("three_d_repo.min.js"))
          .pipe(sourcemaps.write('./maps'))
          .pipe(gulp.dest("./../public/dist/"))
          .pipe(livereload())
          .on("end", done)
  
});

gulp.task('javascript', gulp.series('clean', "tsc-amd-dependencies", "tsc-amd-components", "javascript-build" ));

gulp.task('javascript-dev', gulp.series('clean', "tsc-amd-dependencies", "tsc-amd-components", "javascript-build-dev" ))


// Watch for changes and live reload in development
gulp.task('watch', function() {

  livereload.listen({host: 'localhost', port: '35729', start: true })

  // Because gulp is annoying and only allows paralell execution
  // of tasks, we need to setup a dependency order using a task
  // registration. Sigh.

  const watches = {
    "index" : [ ["./index.html"], ['index'] ],
    "entry" :[ ["./entry.js"], ['javascript-dev'] ],

    "typescript-globals": [ ["./globals/*.ts"], ["typescript-globals"] ],
    "typescript-components": [ ["./components/**/*.ts"], ["typescript-components"] ],

    "amd-deps" : [ ['./entry.js', "./_built/amd/globals/*.js"], ["amd-dependencies"]],
    "amd-components" : [ ['./entry-ts-components.js', "./_built/amd/components/**/*.js"], ["amd-components"]],

    "js" : [ ["./_built/dependencies.js", "./_built/ts-components.js", "./components/**/*.js", "./bootstrap.js", ], ['javascript-build-dev'] ],
    "css" : [ allCss, ['css'] ],
    "pug" : [ allPug, ['pug'] ],
    "icons" : [ icons, ['icons'] ],
    "manifest" : [ ["./manifest.json"], ['manifest-file'] ],
    "manifest-icons" : [ ["./manifest-icons/**.png"], ['manifest-icons'] ]
  };

  for (let key in watches) {
    let taskData = watches[key];
    let files = taskData[0];
    let task = taskData[1][0]
    registerTasksWithSW(task);
    watchSWTask(files, task)
  }

});

const registerTasksWithSW = function(task){
  gulp.task(task + "SW", gulp.series(task, "service-workers-dev"));
}

const watchSWTask = function(files, task){
  gulp.watch(files, gulp.series(task + "SW"));
};

// Final task to build everything for the frontend (public folder)
// It will use 'javascript' task rather than the dev version which includes maps
gulp.task('build', gulp.series(
  gulp.parallel(
    'index', 
    'pug', 
    'javascript',
    'css', 
    'icons', 
    'fonts', 
    'images', 
    'unity', 
    'custom',
    'manifest-icons', 
    'manifest-file'
  ),
  'service-workers'
  )
);

