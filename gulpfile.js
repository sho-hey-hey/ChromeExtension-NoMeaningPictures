var gulp = require('gulp');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');

// TypeScript options JSON
var tsOptions = require('./node_config/ts-option');
tsOptions.typescript = require('typescript');

// build
gulp.task('build', function() {
	return runSequence(
		['clean'],
		['compile']
	);
});

// typescript
gulp.task('typescript', function() {
	return runSequence(
		['clean:javascript'],
		['compile:typescript']
	);
});

// scss
gulp.task('scss', function() {
	return runSequence(
		['clean:css'],
		['compile:scss']
	);
});

// watch系をまとめたもの
gulp.task('watch', ['watch:typescript', 'watch:scss']);

// typescriptのwatch
gulp.task('watch:typescript', function() {
	gulp.watch(["ts/**/*.ts"], {interval: 500} ,['typescript']);
});

// scssのwatch
gulp.task('watch:scss', function() {
	gulp.watch(["scss/**/*.scss"], {interval: 500} ,['scss']);
});

// compile系をまとめたもの
gulp.task('compile', ['compile:typescript', 'compile:scss']);

// typescriptのcompile
gulp.task('compile:typescript', function () {
	return gulp.src('ts/**/*.ts')
		.pipe(plumber())
		.pipe(ts(tsOptions))
		.pipe(gulp.dest('js'));
});

// scssのcompile
gulp.task('compile:scss', function () {
  return gulp.src('scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'));
});

// clean系をまとめたもの
gulp.task('clean', ['clean:javascript', 'clean:css']);

// javascriptのclean
gulp.task('clean:javascript', function() {
	rimraf('js/**/*.js', function() { });
});

// cssのclean
gulp.task('clean:css', function() {
	rimraf('css/**/*.css', function() { });
});
