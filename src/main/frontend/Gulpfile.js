var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
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
    require('wiredep')({ src: paths.base , cwd: '../../../', exclude: ['jquery','bootstrap.js']});
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
            js1: [ngAnnotate(), uglify(), 'concat'],
            js2: [ngAnnotate(), uglify(), 'concat']
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('copydebug', ['clean'], function() {
    gulp.src('**/*.{ttf,woff,woff2,eof,svg,css,js,html}')
        .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function(cb) {
    del(['webapp'], {cwd : '../'}, cb);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['wiredep','usemin', 'copyfonts']);

