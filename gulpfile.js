'use strict';

var gulp = require('gulp'),
    changed = require('gulp-changed'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    reactify = require('reactify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    del = require('del'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    p = {
      jsx: './scripts/app.jsx',
      scss: ['styles/*.css', 'bower_components/gaia-icons/gaia-icons-embedded.css', 'styles/main.css'],
      bundle: 'app.js',
      distJs: 'dist/js',
      distCss: 'dist/css',
      images: 'images/**/*',
      data: 'data/*.xml',
      distFx: "./platform/fxos/dist",
      distFxos: "./platform/fxos/",
      buildFxos: ["dist/**/*"]
    };

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('cleanFxos', function(cb) {
  del(['platform/fxos'], cb);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('watchify', function() {
  var bundler = watchify(browserify(p.jsx, watchify.args));

  function rebundle() {
    return bundler
      .bundle()
      .on('error', notify.onError())
      .pipe(source(p.bundle))
      .pipe(gulp.dest(p.distJs))
      .pipe(reload({stream: true}));
  }

  bundler.transform(reactify)
  .on('update', rebundle);
  return rebundle();
});

gulp.task('browserify', function() {
  browserify(p.jsx)
    .transform(reactify)
    .bundle()
    .pipe(source(p.bundle))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(p.distJs));
});

gulp.task('styles', function() {
  return gulp.src(p.scss)
    .pipe(changed(p.distCss))
    .pipe(sass({errLogToConsole: true}))
    .on('error', notify.onError())
    .pipe(autoprefixer('last 1 version'))
    .pipe(csso())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(p.distCss))
    .pipe(reload({stream: true}));
});

gulp.task('build_data', function() {
  return gulp.src(p.data)
    .pipe(gulp.dest("dist/data"));
});

gulp.task('build_images', function() {
  return gulp.src(p.images)
    .pipe(gulp.dest("dist/images"));
});

gulp.task('cpApp', function() {
  return gulp.src(["manifest.webapp", "index.html"])
    .pipe(gulp.dest(p.distFxos));
});

gulp.task('cpBuild', function() {
  return gulp.src(p.buildFxos)
    .pipe(gulp.dest(p.distFx));
});

gulp.task('fxos', ['cleanFxos'], function() {
  gulp.start(['cpApp', 'cpBuild']);
});

gulp.task('watchTask', function() {
  gulp.watch(p.scss, ['styles']);
});

gulp.task('watch', ['clean'], function() {
  gulp.start(['browserSync', 'watchTask', 'watchify', 'styles', 'build_images', 'build_data']);
});

gulp.task('build', ['clean'], function() {
  process.env.NODE_ENV = 'production';
  gulp.start(['browserify', 'styles', 'build_images', 'build_data']);
});

gulp.task('default', function() {
  console.log('Run "gulp watch or gulp build"');
});
