var gulp = require("gulp"),
    jshint = require("gulp-jshint"),
    changed = require("gulp-changed"),
    imagemin = require("gulp-imagemin"),
    minifyHTML = require("gulp-minify-html"),
    minifycss = require("gulp-minify-css"),
    concat = require("gulp-concat"),
    stripDebug = require("gulp-strip-debug"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    less = require("gulp-less"),
    notify = require("gulp-notify"),
    processhtml = require("gulp-processhtml"),
    clean = require("gulp-clean"),
    fileinclude = require("gulp-file-include"),
    prettify = require("gulp-prettify"),
    plumber = require('gulp-plumber'),
    html2js = require('gulp-html-js-template');

var path = {
    dev: {
        js: ["src/js/core/plugin.js"],
        less: ["src/less/**/*.less"],
        tplhtml: ["src/tplhtml/*.html"]
    },
    src: {
        js: "src/js",
        tpl: "src/js/tpl"
    },
    dist: {
        js: "./dist/js",
        // css: './dist/css',
        css: "src/css"
    }
};

gulp.task("default", ["clean"], function() {
    gulp.start("template", "js", "less", "watch");
});

var stackTrace = require('stack-trace');
var err = new Error('something went wrong');
gulp.task("watch", function () {
    gulp.watch([path.dev.tplhtml], ["template","js"]).on("change", function (event) {
        console.log("tpl文件变更: " + event.path + " was " + event.type);
    });
    gulp.watch([path.dev.js, 'src/js/core/block/*.js'], ["js"]).on("change", function (event) {
        console.log("js文件变更: " + event.path + " was " + event.type);
    });
    gulp.watch([path.dev.less], ["less"]).on("change", function(event) {
        console.log("less文件变更: " + event.path + " was " + event.type);
    });
});


//初始化
gulp.task('init', function () {
    gulp.start("template");
});


//模板
var replace = require('gulp-replace');
gulp.task('template', function () {
    return gulp.src(path.dev.tplhtml)
        .pipe(plumber())
        .pipe(html2js())
        .pipe(uglify({ compress: true }))
        .pipe(replace(/\s{2,}/ig, ''))
        .pipe(gulp.dest(path.src.tpl));
    //.pipe(notify({
    //    message: "--template 任务 完成 --"
    //}));
});

//脚本
gulp.task("js", ['template'],function() {
    gulp.src(path.dev.js)
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: "~~",
            basedev: "~file"
        }))
        /* 引用文件 合并源代码 */
        .pipe(uglify({ output: { beautify: true, comments: true }, mangle: false, compress: false }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(concat("jquery.cbuilder.js"))
        .pipe(gulp.dest(path.src.js))
        //.pipe(jshint())
        //.pipe(jshint.reporter("default"))
        //.pipe(stripDebug())
        //.pipe(notify({
        //    message: "--js 任务 完成 --"
        //}));
});


//less
gulp.task("less", function() {
    gulp.src(path.dev.less)
        .pipe(plumber())
        .pipe(concat("cbuilder.css"))
        .pipe(less())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(path.dist.css))
        //.pipe(notify({
        //    message: "--less 任务 完成 --"
        //}));
});


//清理生产目录文件
gulp.task("clean", function() {
    return gulp.src([path.dist.js, path.dist.css], {
            read: false
    })
    .pipe(plumber())
    .pipe(clean());
});
