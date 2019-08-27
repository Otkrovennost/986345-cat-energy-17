"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var less = require("gulp-less");
var combineMq = require('gulp-combine-mq');
var cssBase64 = require("gulp-css-base64");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var stylelint = require("gulp-stylelint");
var editorconfig = require("gulp-lintspaces");
var del = require("del");
var server = require("browser-sync").create();
var settings = require("./package.json");
var isDev = process.env.NODE_ENV !== "production";

gulp.task("editorconfig", function () {
  return gulp.src(settings["editorconfig-cli"])
    .pipe(plumber())
    .pipe(editorconfig({ editorconfig: `.editorconfig` }))
    .pipe(editorconfig.reporter());
});

gulp.task("stylelint", function () {
  return gulp.src("source/less/**/*.less")
    .pipe(plumber())
    .pipe(stylelint({
      reporters: [
        {
          console: true,
          formatter: "string"
        }
      ]
    }));
});

gulp.task("css", function () {
  return gulp.src("source/less/style.less", { sourcemaps: isDev })
    .pipe(plumber())
    .pipe(less())
    .pipe(combineMq())
    .pipe(cssBase64({
      baseDir: "../img/bg-icons",
      maxWeightResource: 10000,
      extensionsAllowed: [".svg", ".png"]
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(server.stream());
});

gulp.task("js", function () {
  return gulp.src([
    "node_modules/picturefill/dist/picturefill.min.js",
    "node_modules/svg4everybody/dist/svg4everybody.min.js",
    "source/js/start.js",
    "source/js/nav.js",
    "source/js/map.js"
  ], { sourcemaps: isDev })
    .pipe(concat("script.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("build/js", { sourcemaps: "." }));
});

gulp.task("images", function () {
  return gulp.src("source/img/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo(settings.svgoConfig)
    ]))
    .pipe(gulp.dest("build/img"))
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("icons", function () {
  return gulp.src("source/img/bg-icons/**/*.{svg,png}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo(settings.svgoConfig)
    ]))
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest("source/img/bg-icons"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/sprite-icons/**/*.svg")
    .pipe(imagemin([
      imagemin.svgo(settings.svgoConfig)
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/**/*.html",
    "source/fonts/**/*.{woff, woff2}"
  ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("server", function () {
  server.init({
    server: "build",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/**/*.html", gulp.series("copy", "reload"));
  gulp.watch("source/js/**/*.js", gulp.series("js", "reload"));
  gulp.watch("source/less/**/*.less", gulp.series("stylelint", "css"));
  gulp.watch("source/img/*.{jpg,png,svg}", gulp.series("images", "reload"));
  gulp.watch("source/img/sprite-icons/**/*.svg", gulp.series("sprite", "reload"));
  gulp.watch(settings["editorconfig-cli"], gulp.series("editorconfig", "reload"));
});

gulp.task("reload", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series(
  gulp.parallel("editorconfig", "stylelint", "clean", "icons"),
  gulp.parallel("css", "js", "images", "sprite", "copy")
));
gulp.task("start", gulp.series("build", "server"));
