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
    html2js = require('gulp-html-js-template'),
    filter = require('gulp-filter');


var path = {
    dev: {
        js: ["src/js/core/**/*.js"],
        js_plugin: ["src/js/core/plugin.js"],
        js_parser: ["src/js/parser/*.js"],
        js_parser_component: ["!src/js/parser/component/all.js", "src/js/parser/component/*.js"],
        less: ["src/less/*.less"],
        less_parser: ["src/less/parser/**.less"],
        tplhtml: ["src/tplhtml/*.html"]
    },
    src: {
        root:'./src/',
        js: "src/js",
        tpl: "src/js/tpl",
        css:'src/css/'
    },
    dist: {
        normal:'./dist',
        css_parser: './dist/',
        js_parser: './dist/'
    }
};

gulp.task("default", function() {
    gulp.start("template", "js", "less", "less_parser", "js_parser_component", "js_parser", "watch");
});


gulp.task("watch", function () {
    gulp.watch([path.dev.tplhtml], ["js"], function (event) {
        console.log("tpl文件变更: " + event.path + " was " + event.type);
    });

    gulp.watch([path.dev.js, path.dev.js_plugin], ["js"], function (event) {
        console.log("js文件变更: " + event.path + " was " + event.type);
    });

    gulp.watch([path.dev.js_parser], ["js_parser"], function (event) {
        console.log("js_parser文件变更: " + event.path + " was " + event.type);
    });

    gulp.watch([path.dev.js_parser_component], ["js_parser_component"], function(event) {
        console.log("js_parser_component文件变更: " + event.path + " was " + event.type);
    });

    gulp.watch([path.dev.less], ["less"], function (event) {
        console.log("less文件变更: " + event.path + " was " + event.type);
    });

    gulp.watch([path.dev.less_parser], ["less_parser"], function (event) {
        console.log("less_parser文件变更: " + event.path + " was " + event.type);
    });
});


/* init */
gulp.task('init', function () {
    gulp.start("template");
});


/* html template */
var replace = require('gulp-replace');
gulp.task('template', function () {
    return gulp.src(path.dev.tplhtml)
        .pipe(plumber())
        .pipe(html2js())
        .pipe(uglify({ compress: true }))
        .pipe(replace(/\s{2,}/ig, ''))
        .pipe(gulp.dest(path.src.tpl));
});

/* js_parser */
gulp.task("js_parser", function () {
    gulp.src(path.dev.js_parser)
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: "~~",
            basedev: "~file"
            }))
        .pipe(concat("jquery.cbuilder.parser.js"))
        .pipe(gulp.dest(path.src.js))
        .pipe(uglify())
        .pipe(concat("cbuilder_parser.js"))
        .pipe(rename({
            suffix: ".min"
         }))
        .pipe(gulp.dest(path.dist.normal));
});

/* js_parser_component */
gulp.task("js_parser_component",["js_parser"], function () {
    gulp.src(path.dev.js_parser_component)
        .pipe(plumber())
        .pipe(concat("all.js"))
        .pipe(gulp.dest(path.src.js + '/parser/component'));
});

/* js */
gulp.task("js",["template"], function () {
    gulp.src(path.dev.js_plugin)
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: "~~",
            basedev: "~file"
        }))
        /* 引用文件 合并源代码 */
        .pipe(uglify({ output: { beautify: true, comments: true }, mangle: false, compress: false }))
        .pipe(concat("jquery.cbuilder.js"))
        .pipe(gulp.dest(path.src.js))
        .pipe(concat("jquery.cbuilder.js"))
        .pipe(rename({
            suffix: ".min"
         }))
        .pipe(uglify())
        .pipe(gulp.dest(path.src.js));
});

/* less_parser */
gulp.task("less_parser", function () {
    gulp.src(path.dev.less_parser)
        .pipe(plumber())
        .pipe(concat("cbuilder_parser.css"))
        .pipe(less())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(path.dist.normal));
});

/* less */
gulp.task("less", function () {
    gulp.src(path.dev.less)
        .pipe(plumber())
        .pipe(concat("cbuilder.css"))
        .pipe(less())
        .pipe(gulp.dest(path.src.css))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(path.src.css));
});


/* clean dist directory */
gulp.task("clean", function() {
    return gulp.src([path.dist.js_parser, path.dist.css_parser], {
            read: false
    })
    .pipe(plumber())
    .pipe(clean());
});
