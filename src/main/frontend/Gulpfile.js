var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
var imagemin = require('gulp-imagemin');
var usemin = require('gulp-usemin');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var del = require('del');

var wiredep = require('wiredep').stream;

var paths = {
    base: 'index.html',
    dist: '../webapp/',
    fonts: 'lib/bootstrap/fonts'
};

gulp.task('wiredep', function () {
        wiredep(paths.base);
});

gulp.task('copyfonts', ['clean'], function() {
    gulp.src(paths.fonts + '**/*.{ttf,woff,woff2,eof,svg}')
        .pipe(gulp.dest(paths.dist));
});

gulp.task('usemin', ['clean'], function () {
    return gulp.src(paths.base)
        .pipe(usemin({
            css1: [minifyCss(), 'concat'],
            css2: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true, conditionals: true})],
            js1: [ngmin(), uglify(), 'concat'],
            js2: [ngmin(), uglify(), 'concat']
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function(cb) {
    del([paths.dist], cb);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['wiredep','usemin', 'copyfonts']);

