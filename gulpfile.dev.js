const gulp = require('gulp');
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const mustache = require("gulp-mustache");
const webpack_stream = require("webpack-stream");
const webpack_config = require("./webpack.dev");



// functions
function compileTemplates() {
  return gulp
    .src("./src/templates/**/*.html")
    .pipe(mustache())
    .pipe(rename({dirname: "/"}))
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());
}

function compileImg() {
  return gulp
    .src("./src/**/*.{png,jpg,gif,svg}")
    .pipe(rename({dirname: "/"}))
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());
}

function webpackDev() {
  return webpack_stream(webpack_config)
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());
}



// browsersync
function bsServe() {
  watch();

  browserSync.init({
    server: {
      baseDir: "./dist",
      index: "/index.html"
    },
    open: "external",
    notify: false,
    ghostMode: false
  });

}

// watch
function watch() {
  gulp.watch("./src/**/*.{png, jpg, gif, svg}", compileImg);
  gulp.watch("./src/**/*.mustache", compileTemplates);
  gulp.watch("./src/**/*.html", compileTemplates);
  gulp.watch("./src/**/*.scss", webpackDev);
  gulp.watch("./src/**/*.js", webpackDev);
}



// exports

// dev
var devFunctions = gulp.parallel(compileTemplates, compileImg, webpackDev);
exports.devCompile = devFunctions;
exports.dev = gulp.parallel(devFunctions, bsServe);

// production
exports.prod = gulp.parallel(compileTemplates, compileImg);