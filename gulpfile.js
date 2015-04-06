var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    minifyHTML = require('gulp-minify-html'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    notify = require('gulp-notify'),
    clean = require('gulp-clean');

var config = {
    path: {
        js: ['js/**/*.js'],
        less: ['less/*.less']
    },
    dist: {
        js: './dist/js',
        css: './dist/css',
        fonts: './dist/fonts'
    }
};

gulp.task('default', ['clean'], function() {
    gulp.start('js', 'less', 'watch');
});


gulp.task('watch', function() {
    gulp.watch([config.path.js], ['js']).on('change', function(event) {
        console.log('js文件变更: ' + event.path + ' was ' + event.type);
    });
    gulp.watch([config.path.less], ['less']).on('change', function(event) {
        console.log('less文件变更: ' + event.path + ' was ' + event.type);
    });
});

//脚本
gulp.task('js', function() {
    gulp.src(config.path.js)
    	.pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('channel.js'))
        .pipe(stripDebug())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist.js))
        .pipe(notify({
            message: '--js 任务 完成 --'
        }));
});

//less
gulp.task('less', function() {
    gulp.src(config.path.less)
        .pipe(concat('channel.css'))
        .pipe(less())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(config.dist.css))
        .pipe(notify({
            message: '--less 任务 完成 --'
        }));
});


//清理生产目录文件
gulp.task('clean', function() {
    return gulp.src([config.dist.js, config.dist.css], {
            read: false
        })
        .pipe(clean());
});