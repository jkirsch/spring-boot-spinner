var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var usemin = require('gulp-usemin');
var minifyHtml = require('gulp-htmlmin');
var minifyCss = require('gulp-cssnano');
var del = require('del');
//var closure = require('gulp-closure-compiler-service');


var jshint = require('gulp-jshint');

var watch = require('gulp-watch');

var wiredep = require('wiredep').stream;

var paths = {
    base: 'index.html',
    dist: '../webapp/',
    fonts: 'lib/bootstrap/fonts'
};

gulp.task('wiredep', function () {
    require('wiredep')({src: paths.base, cwd: '../../../', exclude: ['jquery', 'bootstrap.js']});
});

gulp.task('copyfonts', function () {
    gulp.src(paths.fonts + '**/*.{ttf,woff,woff2,eof,svg}')
        .pipe(gulp.dest(paths.dist));
});

gulp.task('usemin', function () {
    return gulp.src(paths.base)
        .pipe(usemin({
            css1: [minifyCss(), 'concat'],
            css2: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true, conditionals: true, collapseWhitespace: true})],
            js1: [ngAnnotate(), uglify({preserveComments: 'license'})],
            js2: [ngAnnotate(), uglify()]
/*            js1: [ngAnnotate(), closure({compilation_level: 'SIMPLE_OPTIMIZATIONS'})],
            js2: [ngAnnotate(), closure({compilation_level: 'SIMPLE_OPTIMIZATIONS'})]*/
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('copydebug', function () {
    gulp.src('**/*.{ttf,woff,woff2,eof,svg,css,js,html}')
        .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function (cb) {
    del.sync(['webapp'], {cwd: '../'});//.then(cb);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['clean', 'wiredep', 'usemin', 'copyfonts']);

gulp.task('lint', function () {
    //gulp.src('js/**/*.js')
    watch('js/**/*.js')
        //gulp.pipe(watch('js/**/*.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
