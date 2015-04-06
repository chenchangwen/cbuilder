
(function (exports) {
    var doc = exports.document,
        a = {},
        expose = +new Date(),
        rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
        isLtIE8 = ("" + doc.querySelector).indexOf("[native code]") === -1;
    exports.getCurrAbsPath = function () {
        // FF,Chrome
        if (doc.currentScript) {
            return doc.currentScript.src;
        }

        var stack;
        try {
            a.b();
        } catch (e) {
            stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
        }
        // IE10
        if (stack) {
            var absPath = rExtractUri.exec(stack)[1];
            if (absPath) {
                return absPath;
            }
        }

        // IE5-9
        for (var scripts = doc.scripts,
            i = scripts.length - 1,
            script; script = scripts[i--];) {
            if (script.className !== expose && script.readyState === "interactive") {
                script.className = expose;
                // if less than ie 8, must get abs path by getAttribute(src, 4)
                return isLtIE8 ? script.getAttribute("src", 4) : script.src;
            }
        }
    };
}(window));

var mcepath = getCurrAbsPath().replace(/src\/.+/, '') + 'css/';

define(['jquery', 'jqextend'], function ($) {
    var exports = {
        tinymcepath: mcepath
    }
    //创建jquery对象
    exports.$tag=function $tag(tag, id, css) {
        var element = document.createElement(tag);
        if (id) {
            element.id = prefix + id;
        }
        if (css) {
            element.style.cssText = css;
        }
        return $(element);
    };

    //随机数
    exports.rndNum = function rndNum(n) {
        var rnd = "";
        for (var i = 0; i < n; i++)
            rnd += Math.floor(Math.random() * 10);
        return rnd;
    }

    //精确相乘
    exports.accDiv = function accDiv(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }

    //比较是否重复
    exports.isCompareExist = function isCompareExist(value, compareary) {
        var sum = 0;
        for (var i = 0; i < compareary.length - 1; i++) {
            if (value === compareary[i]) {
                sum++;
            }
        }
        if (sum == 0) {
            return false;
        }
        return true;
    }

    //调用所有方法
    exports.callAllFn = function (obj) {
        for (var pfn in obj) {
            for (var i = 1; i < arguments.length; i++) {
                if (pfn !== arguments[i]) {
                    if (typeof (obj[pfn]) == "function") {
                        obj[pfn]();
                    }
                }
            }
        }
    }
    return exports;
});

